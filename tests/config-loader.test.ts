import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadConfig } from "../src/services/config-loader.js";

const tempDirs: string[] = [];

describe("loadConfig", () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.map((dir) => rm(dir, { recursive: true, force: true }))
    );
    tempDirs.length = 0;
  });

  it("returns defaults when no config exists", async () => {
    const dir = await createTempDir();
    const config = await loadConfig(dir);

    expect(config.defaultBranch).toBe("main");
    expect(config.colors).toBe(true);
    expect(config.dashboard.showHints).toBe(true);
  });

  it("merges values from gx.config.json", async () => {
    const dir = await createTempDir();
    await writeFile(
      path.join(dir, "gx.config.json"),
      JSON.stringify({
        defaultBranch: "develop",
        dashboard: { showHints: false }
      })
    );

    const config = await loadConfig(dir);

    expect(config.defaultBranch).toBe("develop");
    expect(config.colors).toBe(true);
    expect(config.dashboard.showHints).toBe(false);
  });
});

async function createTempDir(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "gx-config-"));
  tempDirs.push(dir);
  return dir;
}
