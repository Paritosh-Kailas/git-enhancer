import Table from "cli-table3";

import type { BranchInfo, StashEntry } from "../types/git.js";

import { theme } from "./theme.js";

export function formatBranchesTable(branches: BranchInfo[]): string {
  const table = new Table({
    head: ["Branch", "Current", "Last Commit"],
    style: {
      head: ["cyan"]
    }
  });

  for (const branch of branches) {
    table.push([
      branch.isCurrent ? theme.accent(branch.name) : branch.name,
      branch.isCurrent ? "yes" : "",
      branch.lastCommitRelative
    ]);
  }

  return table.toString();
}

export function formatStashTable(entries: StashEntry[]): string {
  if (entries.length === 0) {
    return theme.success("No stash entries found.");
  }

  const table = new Table({
    head: ["Stash", "Message"],
    style: {
      head: ["cyan"]
    },
    wordWrap: true
  });

  for (const entry of entries) {
    table.push([entry.id, entry.message]);
  }

  return table.toString();
}
