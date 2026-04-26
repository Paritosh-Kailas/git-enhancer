import type { Command } from "commander";

import { createCommandContext } from "../core/context.js";
import { formatCleanupPlan } from "../ui/dashboard.js";

export function registerCleanupCommand(program: Command): void {
  program
    .command("cleanup")
    .description("Preview merged branches and optionally delete them.")
    .option(
      "--delete-merged",
      "Delete merged branches after previewing the plan."
    )
    .action(async (options: { deleteMerged?: boolean }) => {
      const context = await createCommandContext();
      const plan = await context.git.getMergedBranchCleanupPlan(
        context.config.defaultBranch
      );

      console.log(formatCleanupPlan(plan));

      if (options.deleteMerged && plan.deletableBranches.length > 0) {
        await context.git.deleteBranches(plan.deletableBranches);
        console.log(
          `Deleted ${plan.deletableBranches.length} merged branches.`
        );
      }
    });
}
