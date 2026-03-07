# LiftCoach

## What It Does

Many gym-goers have the discipline to show up consistently but lack structured training plans with proper progression — so their results plateau. LiftCoach solves this by telling you exactly what to do each workout and applying progressive overload systematically so you achieve real, measurable results.

## Development Rules

**IMPORTANT**: Before proposing a plan or writing any code, ALWAYS read the docs first:
1. Start with `docs/index.md` to understand the project, what it solves and how it's built
2. Read `docs/architecture.md` to understand the domain model and event-sourced aggregate pattern
3. Read `docs/code-standards.md` to understand nullability, silent defaults, and other coding conventions
4. Read any other relevant doc (e.g. `docs/exercise-states.md`, `docs/progression.md`) for the area you're working on

- Always make sure you understand the module you are working on
- Make sure the feature/bug/chore you are working on has existing git branch that is relevant, ask user for a branch and create if missing
- After each change run `pnpm typecheck` to see any typescript issues
- After each change run `pnpm lint` to see any linting issues
- After each change run `pnpm knip` to check for unused exports, deps and files
- After each change run `pnpm test` to run vitest tests

**IMPORTANT**: For any non-trivial feature or architectural change, use the `design-first-engineering` skill to iterate on the design before writing code. Walk through Capabilities, Components, Interactions, and Contracts with the user first.