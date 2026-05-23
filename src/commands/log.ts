import type { Command } from "commander";

import { createCommandContext } from "../core/context.js";
export function registerLogCommand(program: Command): void {
  program
    .command("log")
    .description("Display the commit history of the current branch.")
    .action(async () => {
      const context = await createCommandContext();
      const logs = await context.git.getCommitHistory();
      console.log(logs);
    });
}
