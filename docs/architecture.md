# What This App Does

LiftCoach is an iOS fitness app that generates structured training programs and applies progressive overload automatically. Users provide their experience, schedule, and muscle priorities — the app handles everything else: what exercises to do, how heavy, how many sets/reps, and when to increase or decrease intensity.

All data is local. No backend. No accounts.

## Tech Stack

React Native + Expo, TypeScript, SQLite + Drizzle ORM, tRPC (local, no network), TanStack React Query, Zod, React Navigation.

## High-Level Architecture

The app uses **tRPC without a network layer**. A custom local link calls the router directly with context implementations backed by SQLite. This gives type-safe API contracts while keeping everything on-device.

Four context interfaces define the API surface: **User**, **Workout**, **MesoPlanner**, and **ExerciseLibrary**. Each is implemented as a local context that reads/writes to SQLite via Drizzle.

The UI layer consumes these through standard tRPC hooks, so from the UI's perspective it looks like a normal client-server app.

## Domain Model

### Training Hierarchy

- **Mesocycle** — A 6-week training program
- **Microcycle** — One week of training within a mesocycle (week 0 is the testing/calibration week)
- **Workout** — A single training session within a microcycle
- **WorkingExercise** — An exercise assignment within a workout, tracked through a state machine
- **WorkingSet** — A single set (pending → done/failed)

### Exercises

Exercises come in two flavors: **curated** and **custom**. Curated exercises ship with the app and carry movement pattern classification and experience-level requirements. Custom exercises are user-created — just a name and a target muscle group. Both participate equally in program generation and progression.

### Exercise State Machine

Exercises move through states depending on whether the user has done them before:

- **First encounter**: `loading → loaded` — user performs a calibration set so the app can calculate working weights
- **Returning exercise (new mesocycle)**: `testing → tested` — user re-tests with a suggested weight
- **Subsequent weeks**: `pending → finished` — sets are pre-populated, user just trains

The transition from loaded/tested to pending happens when a new microcycle is generated.

### Program Generation

When a user onboards (or starts a new mesocycle), the generator:

1. Calculates **volume per muscle group** from user preferences and experience
2. Selects the optimal **split type** (PPL, Upper/Lower, Push/Pull, Full Body) based on volume distribution and available training days
3. **Picks exercises** — custom exercises for a muscle group are preferred; curated exercises are selected by movement pattern and experience level as fallback
4. Creates the first microcycle with exercises in loading/testing state

### Progression System

After completing a microcycle, the app generates the next week by examining each exercise's history:

- **All sets completed, good form** → increment reps (8→9→10→11→12 range)
- **Set failures** → maintain weight and reps (retry)
- **User assessed "too heavy"** → reduce weight by 10%
- **2+ consecutive weeks of failures** → reduce weight by 10%
- **Suboptimal lifestyle (poor sleep/diet)** → hold weight, don't penalize

Lifestyle feedback (sleep and diet quality rated after each workout) prevents the system from reducing weight when failures are lifestyle-related rather than strength-related.

### Weight Calculation

Uses estimated 1RM (Epley formula) from calibration sets to calculate working weights at target RPE. A user coefficient derived from optional strength test results personalizes the calculation.

## Core Pattern: Event-Sourced Aggregate

`MesocycleAggregateRoot` is the central mutation point. All workout state transitions flow through it:

- Starting/finishing workouts
- Loading/testing exercises (calibration)
- Marking sets as done/failed
- Applying progression between microcycles
- Replacing exercises mid-workout

It takes a mesocycle DTO, validates invariants, applies domain events that mutate state, and collects events for persistence. This is the most important piece of the codebase — nearly all business logic lives here or is called from here.

## Navigation

Two top-level flows based on user state:

**Onboarding** — Collects gender, experience level, training frequency, and muscle group priorities (balanced or custom). Generates the first program and lets the user review/edit before confirming.

**Main app** — Three tabs: dashboard (weekly progress + insights), active workout (exercise cards with set tracking), and planning (mesocycle customization). An exercise library lets users browse all exercises and add custom ones. A strength test modal can overlay the main app.

## Development

```bash
pnpm run ios        # run on iOS simulator
pnpm typecheck      # always run after changes
pnpm lint           # always run after changes
pnpm knip           # check for unused exports/deps/files
```
