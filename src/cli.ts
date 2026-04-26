#!/usr/bin/env node

import { Command } from "commander";

import { registerCommands } from "./commands/index.js";

const program = new Command();

program
  .name("gx")
  .description("A colorful Git enhancer CLI for everyday workflows.")
  .version("0.1.0");

registerCommands(program);

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`gx failed: ${message}`);
  process.exitCode = 1;
});
