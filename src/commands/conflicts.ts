import type { Command } from "commander";

import { createCommandContext } from "../core/context.js";
import { formatConflictReport } from "../ui/dashboard.js";

export function registerConflictsCommand(program: Command): void {
  program
    .command("conflicts")
    .description("Show unmerged files and conflict guidance.")
    .action(async () => {
      const context = await createCommandContext();
      const report = await context.git.getConflictReport();
      console.log(formatConflictReport(report));
    });
}
