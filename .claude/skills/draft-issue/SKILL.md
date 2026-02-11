---
name: draft-issue
description: Draft GitHub issues for liftcoach repo
---

# Draft Issue Skill

Create GitHub issues for the tomkis/liftcoach repository.

## Instructions

1. **Start with user's vague problem** - e.g. "build new workout tracking engine"

2. **Explore codebase for context**:
   - Search relevant code, configs, tests
   - Understand current implementation
   - Identify what's missing/broken

3. **Ask clarifying questions** based on findings:
   - Expected vs actual behavior?
   - What triggers it?
   - Error messages?
   - For features: desired outcome?

4. **Synthesize into structured issue**:
   - Clear actionable title
   - Problem statement with codebase context
   - Steps to reproduce (bugs)
   - Acceptance criteria (features)

5. **Check for duplicates**:

   ```bash
   gh issue list --repo tomkis/liftcoach --search "<keywords>"
   ```

   Show matches, ask to proceed.

6. **Suggest labels**:
   - bug → `bug`
   - feature → `enhancement`
   - chore → `chore`

7. **Ask for assignee** (suggest the current authenticated user by running `gh api user -q .login`)

8. **Show full issue for approval** - render complete issue as markdown:

   ```markdown
   # Title

   [body content]

   ---

   Labels: x, y
   Assignee: username
   ```

   Ask user to confirm or request changes.

9. **Create issue** (after approval):

   ```bash
   gh issue create --repo tomkis/liftcoach \
     --title "Title" \
     --body "Body" \
     --label "labels" \
     --assignee "username"
   ```

10. **Return issue URL**.