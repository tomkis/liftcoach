---
name: design-first-engineering
description: Guide software design iteration before writing any code. Use this skill when the user wants to design a system, plan architecture, think through a feature's structure before implementing, or asks about "design first", "system design", "architecture planning", or "what should the components be". Also trigger when the user says things like "let's think through this before coding", "what's the right architecture", "help me plan this feature", or "I want to design X before building it". This is about producing a design document — not code.
---

# Design-First Engineering

This skill walks the user through 4 sequential design steps before any code gets written. The goal is to produce a clear, iterated design that the user is confident in — so implementation becomes straightforward.

The power of this approach is forced separation of concerns: each step builds on the previous one, and getting the earlier steps right prevents costly rework later. Rushing to contracts before understanding capabilities leads to interfaces that don't fit. Jumping to components before understanding interactions leads to tangled dependencies.

## The 4 Steps

Work through these steps **in order**. Complete and confirm each step with the user before moving to the next. Encourage iteration — it's cheap to change a design, expensive to change code. Before moving to next step, ALWAYS ask user if he's happy with the result of the current step and summarize what you know.

### Step 1: Capabilities

*What does this system need to do?*

List the core requirements — what the system must accomplish from the user's perspective. Stay at the "what", not the "how". No implementation details, no technology choices, no component names.

Good: "Users can search authors by creation date"
Bad: "ElasticSearch index for authors lookup via REST API"

Ask the user to confirm the capabilities list is complete and correct before proceeding. Push back if implementation details creep in — they belong in later steps.

**Output:** A numbered list of capabilities.

### Step 2: Components

*What are the building blocks?*

Given the capabilities from Step 1, identify the services, modules, and major abstractions needed. Each component should have a clear single responsibility. Name them and give each a one-line description of what it owns.

Think about:
- What are the natural boundaries?
- What changes independently?
- What could be swapped out without affecting the rest?

**Output:** A list of components, each with a name and responsibility.

### Step 3: Interactions

*How do the components communicate?*

Map out the data flow between components. For each significant operation, trace the path: who initiates, who responds, what data moves where. Cover the main flows — not every edge case.

Think about:
- Direction of dependencies (who knows about whom)
- Sync vs async communication
- What triggers each interaction

**Output:** Interaction descriptions for each major flow, showing which components participate and how data moves between them.

### Step 4: Contracts

*What are the interfaces?*

Define the boundaries between components precisely. Function signatures, type definitions, API shapes, event schemas. This is the most concrete step — it should be specific enough that two developers could implement different sides of an interface independently and have them connect.

Think about:
- Input and output types
- Error cases
- What's required vs optional

**Output:** Interface definitions — types, function signatures, schemas — for each component boundary identified in Step 3.

## How to Facilitate

- Present your proposal for each step, then ask the user to review
- If the user wants changes, revise and present again
- Use a clear "Step N complete, moving to Step N+1" transition
- If a later step reveals a problem with an earlier one, go back and fix it — that's the whole point of designing first
- Keep everything in a single evolving design document format
- Do not write implementation code — pseudocode in contracts is fine, but no real code