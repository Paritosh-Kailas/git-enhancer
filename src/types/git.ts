export interface RepositorySnapshot {
  branchName: string;
  stagedFiles: string[];
  modifiedFiles: string[];
  untrackedFiles: string[];
  aheadCount: number;
  behindCount: number;
}

export interface BranchInfo {
  name: string;
  isCurrent: boolean;
  lastCommitRelative: string;
}

export interface CleanupPlan {
  baseBranch: string;
  currentBranch: string;
  mergedBranches: string[];
  deletableBranches: string[];
}

export interface StashEntry {
  id: string;
  message: string;
}

export interface ConflictReport {
  hasConflicts: boolean;
  files: string[];
}

export interface GitHealthReport {
  branchName: string;
  defaultBranch: string;
  hasUncommittedChanges: boolean;
  stashCount: number;
  branchCount: number;
  aheadCount: number;
  behindCount: number;
}

export interface CommitInfo {
  hash: string;
  author: string;
  date: string;
  message: string;
}
