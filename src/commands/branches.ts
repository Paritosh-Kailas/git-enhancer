import type { Command } from "commander";

import { createCommandContext } from "../core/context.js";
import { formatBranchesTable } from "../ui/tables.js";

export function registerBranchesCommand(program: Command): void {
  program
    .command("branches")
    .description("List local branches and highlight the current branch.")
    .action(async () => {
      const context = await createCommandContext();
      const branches = await context.git.getLocalBranches();
      console.log(formatBranchesTable(branches));
    });
}
