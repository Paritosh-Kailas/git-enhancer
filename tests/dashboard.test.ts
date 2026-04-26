import { describe, expect, it } from "vitest";

import {
  formatCleanupPlan,
  formatRepositoryStatus
} from "../src/ui/dashboard.js";

describe("dashboard formatters", () => {
  it("renders the repository status", () => {
    const output = formatRepositoryStatus(
      {
        branchName: "main",
        stagedFiles: ["M src/index.ts"],
        modifiedFiles: [" M README.md"],
        untrackedFiles: ["?? temp.txt"],
        aheadCount: 1,
        behindCount: 0
      },
      {
        defaultBranch: "main",
        colors: true,
        dashboard: { showHints: true }
      }
    );

    expect(output).toContain("Branch");
    expect(output).toContain("main");
    expect(output).toContain("Hint");
  });

  it("renders a cleanup preview", () => {
    const output = formatCleanupPlan({
      baseBranch: "main",
      currentBranch: "feature/demo",
      mergedBranches: ["main", "feature/old"],
      deletableBranches: ["feature/old"]
    });

    expect(output).toContain("feature/old");
    expect(output).toContain("Safe to delete");
  });
});
