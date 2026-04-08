# Contributing to Sanctum UI

Thank you for your interest in contributing to Sanctum UI.

## Language Convention

All user-facing text must use **Australian English** spelling:

- colour (not color)
- organisation (not organization)
- licence (noun), license (verb)
- centre (not center)
- behaviour (not behavior)
- favour (not favor)
- catalogue (not catalog)

Code identifiers (variable names, CSS classes, API fields) follow their upstream conventions and are exempt from this rule.

## Code Style

- **TypeScript** -- all source files use `.ts` or `.tsx` extensions with strict type checking
- **CVA (Class Variance Authority)** -- use CVA for component variant definitions
- **Tailwind utility-first** -- prefer Tailwind utility classes; extend the design-token preset in `src/styles/tailwind.preset.ts` rather than writing custom CSS
- **Barrel exports** -- each component directory has an `index.ts` that re-exports public API; the top-level `src/index.ts` re-exports all components

## Testing

- **Vitest** -- test runner and assertion library
- **Testing Library** -- `@testing-library/react` for component rendering and queries
- **axe-core** -- accessibility assertions via `axe-core` directly

Run the full test suite:

```bash
npm run test:run -- --legacy-peer-deps
```

Run tests in watch mode during development:

```bash
npm run test -- --legacy-peer-deps
```

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure all checks pass: `npm run build && npm run test:run && npm run lint`
4. Open a pull request targeting `main`
