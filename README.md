# Git Enhancer CLI

`gx` is a colorful TypeScript CLI for making everyday Git workflows easier to inspect, navigate, and clean up.

## Goals

- Make common Git information easier to scan in the terminal
- Add safer workflows for branch cleanup and conflict discovery
- Stay modular so future API-powered features can plug in cleanly
- Keep the developer experience publish-ready from day one

## Planned Feature Areas

- Pretty repository status dashboard
- Branch insights and merged branch cleanup
- Stash browsing
- Merge conflict helpers
- Repository health checks
- Optional local config file
- API client layer for future remote integrations

## Tech Stack

- TypeScript
- Node.js
- Commander for CLI parsing
- Chalk, Boxen, and cli-table3 for terminal UI
- Vitest for testing
- ESLint and Prettier for quality
- GitHub Actions for CI

## Getting Started

```bash
npm install
npm run dev -- status
```

Build the CLI:

```bash
npm run build
node dist/cli.js status
```

Run the built CLI through npm:

```bash
npm run gx -- status
```

If you want to use the real `gx` command globally on your machine during local development:

```bash
npm run link:local
gx status
```

To remove the global link later:

```bash
npm run unlink:local
```

## Commands

- `gx status` shows a dashboard view of the current repository state
- `gx branches` lists local branches and highlights the current one
- `gx cleanup` previews merged branches and can optionally delete them
- `gx stash` lists current stash entries
- `gx conflicts` surfaces unmerged files
- `gx health` runs a small repository health report

## Config

The CLI looks for either `gx.config.json` or `.gxrc.json` in the current repository tree.

Example:

```json
{
  "defaultBranch": "main",
  "colors": true,
  "dashboard": {
    "showHints": true
  }
}
```

## Quality Scripts

```bash
npm run lint
npm run test
npm run typecheck
npm run build
npm run verify
```

## Suggested Next Steps

- Add interactive prompts for risky operations
- Add richer diff and commit insights
- Add future API integrations behind a dedicated client module
