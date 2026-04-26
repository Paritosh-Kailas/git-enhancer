import { access, readFile } from "node:fs/promises";
import path from "node:path";

import type { GxConfig } from "../types/config.js";

const DEFAULT_CONFIG: GxConfig = {
  defaultBranch: "main",
  colors: true,
  dashboard: {
    showHints: true
  }
};

const CONFIG_FILES = ["gx.config.json", ".gxrc.json"] as const;

export async function loadConfig(startDir: string): Promise<GxConfig> {
  const configPath = await findConfigPath(startDir);
  if (!configPath) {
    return DEFAULT_CONFIG;
  }

  const fileContents = await readFile(configPath, "utf8");
  const parsed = JSON.parse(fileContents) as unknown;
  return mergeConfig(DEFAULT_CONFIG, normalizeConfig(parsed));
}

async function findConfigPath(startDir: string): Promise<string | undefined> {
  let currentDir = startDir;

  while (true) {
    for (const fileName of CONFIG_FILES) {
      const candidate = path.join(currentDir, fileName);
      if (await pathExists(candidate)) {
        return candidate;
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return undefined;
    }

    currentDir = parentDir;
  }
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function normalizeConfig(value: unknown): Partial<GxConfig> {
  if (!isObject(value)) {
    return {};
  }

  const dashboard = isObject(value.dashboard)
    ? {
        showHints:
          typeof value.dashboard.showHints === "boolean"
            ? value.dashboard.showHints
            : DEFAULT_CONFIG.dashboard.showHints
      }
    : DEFAULT_CONFIG.dashboard;

  return {
    defaultBranch:
      typeof value.defaultBranch === "string"
        ? value.defaultBranch
        : DEFAULT_CONFIG.defaultBranch,
    colors:
      typeof value.colors === "boolean" ? value.colors : DEFAULT_CONFIG.colors,
    dashboard
  };
}

function mergeConfig(
  defaultConfig: GxConfig,
  partial: Partial<GxConfig>
): GxConfig {
  return {
    defaultBranch: partial.defaultBranch ?? defaultConfig.defaultBranch,
    colors: partial.colors ?? defaultConfig.colors,
    dashboard: {
      showHints:
        partial.dashboard?.showHints ?? defaultConfig.dashboard.showHints
    }
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
