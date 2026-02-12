# LiftCoach

## What It Does

Many gym-goers have the discipline to show up consistently but lack structured training plans with proper progression — so their results plateau. LiftCoach solves this by telling you exactly what to do each workout and applying progressive overload systematically so you achieve real, measurable results.

## Development Rules

- Always make sure you understand basic
- Always make sure you understand the module you are working on
- Make sure the feature/bug/chore you are working on has existing git branch that is relevant, ask user for a branch and create if missing
- After each change run `pnpm typecheck` to see any typescript issues
- After each change run `pnpm lint` to see any linting issues
- After each change run `pnpm knip` to check for unused exports, deps and files
- After each change run `pnpm test` to run vitest tests

**IMPORTANT**: Before proposing a plan or writing any code, ALWAYS ensure you understand the project by going through the `docs/index.md`. You NEED to understand what the project is, what it solves and how its built.