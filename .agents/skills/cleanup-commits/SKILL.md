---
name: cleanup-commits
description: Rebase and reorganize commits into clean, meaningful commits for easy PR review
disable-model-invocation: true
argument-hint: "[base-branch]"
allowed-tools: Bash(git *), Read, Grep, Glob
---

# Cleanup Commits for PR Review

Reorganize all commits on the current branch into clean, logical commits that are easy to review.

## Arguments

- `$0` - Base branch to rebase onto (default: `main`)

## Process

### 1. Preparation

First, verify clean working state and identify the base:

```bash
git status --porcelain
```

If there are uncommitted changes, warn the user and stop.

Get the base branch (use argument or default to `main`):

- Base branch: `${0:-main}`

### 2. Analyze Changes

Get the full picture of what changed:

```bash
git log --oneline ${0:-main}..HEAD
git diff --stat ${0:-main}..HEAD
git diff ${0:-main}..HEAD
```

Also check the files changed to understand the scope:

```bash
git diff --name-only ${0:-main}..HEAD
```

### 3. Plan Commits

Based on the diff analysis, identify logical groupings. Common patterns:

- **Feature commits**: Group related functionality together
- **Refactor commits**: Structural changes without behavior change
- **Config/setup commits**: Dependencies, configs, tooling
- **Test commits**: Test additions/changes
- **Fix commits**: Bug fixes
- **Docs commits**: Documentation updates

Create a plan listing each commit with:

- Clear subject line (imperative mood, <72 chars)
- Which files go in each commit
- Why this grouping makes sense

**Show the plan to the user and ask for confirmation before proceeding.**

### 4. Execute Rebase

After user confirms the plan:

```bash
git reset --soft ${0:-main}
git reset HEAD
```

This unstages everything while keeping all changes in working directory.

### 5. Create Commits

For each logical group in the plan:

1. Stage the relevant files:

   ```bash
   git add <specific-files>
   ```

2. Create commit with descriptive message:

   ```bash
   git commit -m "type: concise description

   - Detail 1
   - Detail 2"
   ```

Use conventional commit prefixes:

- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code restructuring
- `test:` - Test changes
- `docs:` - Documentation
- `chore:` - Build, config, dependencies

### 6. Verify Result

Show the new commit history:

```bash
git log --oneline ${0:-main}..HEAD
```

Compare with original to ensure nothing was lost:

```bash
git diff ${0:-main}..HEAD --stat
```

## Important Notes

- This is a **destructive operation** - it rewrites git history
- Only use on branches that haven't been pushed, or be prepared to force push
- Always verify the final diff matches the original diff
- If something goes wrong, use `git reflog` to recover

## Example Output

Before:

```
abc1234 wip
def5678 more stuff
ghi9012 fix thing
jkl3456 wip2
```

After:

```
aaa1111 feat: add user authentication flow
bbb2222 refactor: extract validation helpers
ccc3333 test: add auth integration tests
```