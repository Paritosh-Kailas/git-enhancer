import type { Command } from "commander";

import { registerBranchesCommand } from "./branches.js";
import { registerCleanupCommand } from "./cleanup.js";
import { registerConflictsCommand } from "./conflicts.js";
import { registerHealthCommand } from "./health.js";
import { registerStashCommand } from "./stash.js";
import { registerStatusCommand } from "./status.js";
import { registerLogCommand } from "./log.js";

export function registerCommands(program: Command): void {
  registerStatusCommand(program);
  registerBranchesCommand(program);
  registerCleanupCommand(program);
  registerStashCommand(program);
  registerConflictsCommand(program);
  registerHealthCommand(program);
  registerLogCommand(program);
}
