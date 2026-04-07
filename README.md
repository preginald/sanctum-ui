# @digital-sanctum/sanctum-ui

Shared React component library for the Digital Sanctum platform.

## Overview

Sanctum UI provides a canonical set of UI primitives (Button, Input, Card,
Table, Modal, Navigation, Status Badge, Alert/Toast, SSO Login) used by all
Digital Sanctum consumer applications.

## Tech Stack

- React 18 + TypeScript 5 (strict mode)
- Vite 5 (library mode, tree-shakeable ESM)
- Tailwind CSS 3 (design token preset)
- Vitest + Testing Library + axe-core
- Storybook 8

## Prerequisites

| Tool | Minimum Version | Check Command |
|------|----------------|---------------|
| Node.js | 18.0+ (LTS recommended) | `node --version` |
| npm | 9.0+ | `npm --version` |
| Git | 2.30+ | `git --version` |

> **Tip:** We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage
> Node.js versions. The project works with Node 18, 20, and 22 LTS releases.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/preginald/sanctum-ui.git
cd sanctum-ui
```

### 2. Set up environment variables (optional)

```bash
cp .env.example .env
```

Edit `.env` if you need to override default ports. For most development
workflows no changes are needed.

### 3. Install dependencies

```bash
npm install --legacy-peer-deps
```

> **Note:** The `--legacy-peer-deps` flag is required until the ESLint plugin
> ecosystem fully supports ESLint 9. This will be resolved in a future update.

### 4. Start the development server

```bash
npm run dev
```

This starts the Vite dev server at `http://localhost:5173`.

### 5. Verify the setup

```bash
npm run typecheck   # TypeScript strict-mode check
npm run lint        # ESLint
npm run build       # Full production build
```

If all three commands pass, your environment is correctly configured.

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite dev server |
| `build` | `npm run build` | TypeScript compile + Vite production build |
| `preview` | `npm run preview` | Preview the production build locally |
| `lint` | `npm run lint` | Run ESLint on `src/` |
| `format` | `npm run format` | Format source files with Prettier |
| `typecheck` | `npm run typecheck` | Run TypeScript type checking (no emit) |

## Installation

Package not yet published -- coming in Phase 4.

## Contributing

See the project board for active tickets.
All components must pass: TypeScript strict, WCAG 2.1 AA audit, visual
regression baseline.

## License

MIT
