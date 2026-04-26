import type { GxConfig } from "../types/config.js";
import type { GitService } from "../services/git-service.js";

import { loadConfig } from "../services/config-loader.js";
import { createGitService } from "../services/git-service.js";

export interface CommandContext {
  config: GxConfig;
  git: GitService;
}

export async function createCommandContext(): Promise<CommandContext> {
  const config = await loadConfig(process.cwd());
  const git = createGitService(process.cwd());

  return {
    config,
    git
  };
}
