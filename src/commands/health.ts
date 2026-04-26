import type { Command } from "commander";

import { createCommandContext } from "../core/context.js";
import { formatHealthReport } from "../ui/dashboard.js";

export function registerHealthCommand(program: Command): void {
  program
    .command("health")
    .description("Run a small repository health report.")
    .action(async () => {
      const context = await createCommandContext();
      const report = await context.git.getHealthReport(
        context.config.defaultBranch
      );
      console.log(formatHealthReport(report));
    });
}
