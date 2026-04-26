import type { Command } from "commander";

import { createCommandContext } from "../core/context.js";
import { formatRepositoryStatus } from "../ui/dashboard.js";

export function registerStatusCommand(program: Command): void {
  program
    .command("status")
    .description("Show a colorful repository status dashboard.")
    .action(async () => {
      const context = await createCommandContext();
      const snapshot = await context.git.getRepositorySnapshot();
      console.log(formatRepositoryStatus(snapshot, context.config));
    });
}
