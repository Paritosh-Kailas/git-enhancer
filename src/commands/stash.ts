import type { Command } from "commander";

import { createCommandContext } from "../core/context.js";
import { formatStashTable } from "../ui/tables.js";

export function registerStashCommand(program: Command): void {
  program
    .command("stash")
    .description("List current stash entries.")
    .action(async () => {
      const context = await createCommandContext();
      const entries = await context.git.getStashEntries();
      console.log(formatStashTable(entries));
    });
}
