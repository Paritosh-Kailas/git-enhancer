import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type {
  BranchInfo,
  CleanupPlan,
  ConflictReport,
  GitHealthReport,
  RepositorySnapshot,
  StashEntry
} from "../types/git.js";

const execFileAsync = promisify(execFile);

export interface GitService {
  getRepositorySnapshot(): Promise<RepositorySnapshot>;
  getLocalBranches(): Promise<BranchInfo[]>;
  getMergedBranchCleanupPlan(defaultBranch: string): Promise<CleanupPlan>;
  deleteBranches(branches: string[]): Promise<void>;
  getStashEntries(): Promise<StashEntry[]>;
  getConflictReport(): Promise<ConflictReport>;
  getHealthReport(defaultBranch: string): Promise<GitHealthReport>;
}

export function createGitService(cwd: string): GitService {
  const runGit = async (...args: string[]): Promise<string> => {
    const { stdout } = await execFileAsync("git", args, {
      cwd,
      encoding: "utf8"
    });
    return stdout.trim();
  };

  return {
    async getRepositorySnapshot() {
      const [branchName, porcelain, aheadBehind] = await Promise.all([
        runGit("branch", "--show-current"),
        runGit("status", "--short"),
        getAheadBehind(runGit)
      ]);

      const lines = porcelain ? porcelain.split("\n").filter(Boolean) : [];

      return {
        branchName: branchName || "(detached HEAD)",
        stagedFiles: lines.filter(
          (line) => line[0] && line[0] !== " " && line[0] !== "?"
        ),
        modifiedFiles: lines.filter((line) => line[1] && line[1] !== " "),
        untrackedFiles: lines.filter((line) => line.startsWith("??")),
        aheadCount: aheadBehind.ahead,
        behindCount: aheadBehind.behind
      };
    },

    async getLocalBranches() {
      const currentBranch = await runGit("branch", "--show-current");
      const output = await runGit(
        "for-each-ref",
        "--format=%(refname:short)|%(committerdate:relative)",
        "refs/heads"
      );

      return output
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [name, lastCommitRelative = "unknown"] = line.split("|");
          const branchName = name ?? "(unknown)";
          return {
            name: branchName,
            isCurrent: branchName === currentBranch,
            lastCommitRelative
          } satisfies BranchInfo;
        });
    },

    async getMergedBranchCleanupPlan(defaultBranch: string) {
      const currentBranch = await runGit("branch", "--show-current");
      const merged = await runGit("branch", "--merged", defaultBranch);
      const protectedBranches = new Set([defaultBranch, currentBranch]);
      const branches = merged
        .split("\n")
        .map((line) => line.replace("*", "").trim())
        .filter(Boolean);

      const deletableBranches = branches.filter(
        (branch) => !protectedBranches.has(branch)
      );

      return {
        baseBranch: defaultBranch,
        currentBranch,
        mergedBranches: branches,
        deletableBranches
      } satisfies CleanupPlan;
    },

    async deleteBranches(branches) {
      for (const branch of branches) {
        await runGit("branch", "-d", branch);
      }
    },

    async getStashEntries() {
      const output = await runGit("stash", "list");
      if (!output) {
        return [];
      }

      return output
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [id, ...rest] = line.split(": ");
          const stashId = id ?? "stash@{unknown}";
          return {
            id: stashId,
            message: rest.join(": ")
          } satisfies StashEntry;
        });
    },

    async getConflictReport() {
      const output = await runGit("diff", "--name-only", "--diff-filter=U");
      const files = output ? output.split("\n").filter(Boolean) : [];

      return {
        hasConflicts: files.length > 0,
        files
      } satisfies ConflictReport;
    },

    async getHealthReport(defaultBranch: string) {
      const snapshot = await this.getRepositorySnapshot();
      const stashEntries = await this.getStashEntries();
      const branches = await this.getLocalBranches();

      return {
        branchName: snapshot.branchName,
        defaultBranch,
        hasUncommittedChanges:
          snapshot.stagedFiles.length > 0 ||
          snapshot.modifiedFiles.length > 0 ||
          snapshot.untrackedFiles.length > 0,
        stashCount: stashEntries.length,
        branchCount: branches.length,
        aheadCount: snapshot.aheadCount,
        behindCount: snapshot.behindCount
      } satisfies GitHealthReport;
    }
  };
}

async function getAheadBehind(
  runGit: (...args: string[]) => Promise<string>
): Promise<{ ahead: number; behind: number }> {
  try {
    const output = await runGit(
      "rev-list",
      "--left-right",
      "--count",
      "@{upstream}...HEAD"
    );
    const [behindText = "0", aheadText = "0"] = output.split("\t");
    return {
      ahead: Number.parseInt(aheadText, 10) || 0,
      behind: Number.parseInt(behindText, 10) || 0
    };
  } catch {
    return { ahead: 0, behind: 0 };
  }
}
