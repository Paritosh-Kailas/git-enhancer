import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const gitDir = path.join(cwd, ".git");
const hooksDir = path.join(gitDir, "hooks");
const hookPath = path.join(hooksDir, "pre-commit");
const wrapper = `#!/usr/bin/env sh
. "$(dirname "$0")/../../.husky/pre-commit"
`;

try {
  await access(gitDir);
} catch {
  console.log("Skipping git hook setup because .git was not found.");
  process.exit(0);
}

await mkdir(hooksDir, { recursive: true });

const existing = await readIfExists(hookPath);
if (existing !== wrapper) {
  try {
    await writeFile(hookPath, wrapper, { encoding: "utf8" });
  } catch (error) {
    if (isPermissionError(error)) {
      console.log("Skipping hook install because .git/hooks is not writable here.");
      process.exit(0);
    }

    throw error;
  }
}

console.log("Installed pre-commit hook.");

async function readIfExists(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return undefined;
  }
}

function isPermissionError(error) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "EPERM"
  );
}
