import boxen from "boxen";

import type { GxConfig } from "../types/config.js";
import type {
  CleanupPlan,
  ConflictReport,
  GitHealthReport,
  RepositorySnapshot
} from "../types/git.js";

import { theme } from "./theme.js";

export function formatRepositoryStatus(
  snapshot: RepositorySnapshot,
  config: GxConfig
): string {
  const lines = [
    `${theme.strong("Branch")}: ${theme.accent(snapshot.branchName)}`,
    `${theme.strong("Staged")}: ${snapshot.stagedFiles.length}`,
    `${theme.strong("Modified")}: ${snapshot.modifiedFiles.length}`,
    `${theme.strong("Untracked")}: ${snapshot.untrackedFiles.length}`,
    `${theme.strong("Ahead / Behind")}: ${snapshot.aheadCount} / ${snapshot.behindCount}`
  ];

  if (config.dashboard.showHints) {
    lines.push(theme.muted("Hint: run `gx health` for a quick repo check."));
  }

  return boxen(lines.join("\n"), {
    padding: 1,
    borderStyle: "round",
    borderColor: "cyan"
  });
}

export function formatCleanupPlan(plan: CleanupPlan): string {
  const summary =
    plan.deletableBranches.length === 0
      ? theme.success("No merged branches are ready for cleanup.")
      : plan.deletableBranches.map((branch) => `- ${branch}`).join("\n");

  return boxen(
    [
      `${theme.strong("Base branch")}: ${plan.baseBranch}`,
      `${theme.strong("Current branch")}: ${plan.currentBranch}`,
      `${theme.strong("Merged branches found")}: ${plan.mergedBranches.length}`,
      `${theme.strong("Safe to delete")}:`,
      summary
    ].join("\n"),
    {
      padding: 1,
      borderStyle: "round",
      borderColor: "yellow"
    }
  );
}

export function formatConflictReport(report: ConflictReport): string {
  const body = report.hasConflicts
    ? report.files.map((file) => `- ${theme.danger(file)}`).join("\n")
    : theme.success("No merge conflicts detected.");

  return boxen(
    [
      theme.strong("Conflict Report"),
      body,
      theme.muted("Resolve files, then stage them with `git add`.")
    ].join("\n"),
    {
      padding: 1,
      borderStyle: "round",
      borderColor: report.hasConflicts ? "red" : "green"
    }
  );
}

export function formatHealthReport(report: GitHealthReport): string {
  return boxen(
    [
      `${theme.strong("Branch")}: ${theme.accent(report.branchName)}`,
      `${theme.strong("Default branch")}: ${report.defaultBranch}`,
      `${theme.strong("Working tree clean")}: ${
        report.hasUncommittedChanges
          ? theme.warning("No")
          : theme.success("Yes")
      }`,
      `${theme.strong("Stashes")}: ${report.stashCount}`,
      `${theme.strong("Local branches")}: ${report.branchCount}`,
      `${theme.strong("Ahead / Behind")}: ${report.aheadCount} / ${report.behindCount}`
    ].join("\n"),
    {
      padding: 1,
      borderStyle: "round",
      borderColor: "green"
    }
  );
}
