---
description: Do feature <ID> - works in both Drive and Fleet modes (shortcut for feature-do)
argument-hint: "<ID> [--agent=<cc|gg|cx|cu>] [--autonomous] [--max-iterations=N] [--auto-submit] [--no-auto-submit] [--dry-run]"
---
# aigon-feature-do

Implement a feature. Works in Drive mode (branch), Drive mode (worktree) (parallel development), and Fleet mode (competition).

**IMPORTANT:** Run `/aigon:feature-start <ID>` first to prepare your workspace.

## Argument Resolution

If no ID is provided, or the ID doesn't match an existing active feature:
1. Run `aigon feature-list --active`
2. If a partial ID or name was given, filter to matches
3. Present the matching features and ask the user to choose one

## Step 0: Verify your workspace (MANDATORY)

Before doing ANYTHING else, verify you are on the correct branch — **never implement on `main`**.

```bash
git branch --show-current
```

**Expected**: A branch named `feature-<ID>-<agent>-<description>` (e.g., `feature-55-gg-add-auth`).

**If the output is `main` or `master`:** STOP. You are on the wrong branch. Do NOT write any code. Instead:
1. Check if a feature branch already exists: `git branch | grep feature-{{args}}`
2. If it exists, switch to it: `git checkout feature-{{args}}-cc-*` (use the full branch name from the list)
3. If it does NOT exist, the workspace was not set up — run `/aigon:feature-start {{args}}` first

Also verify your working directory:
```bash
pwd
```

**Expected for worktree mode**: A path ending in `feature-{{args}}-cc-<description>`
**Expected for Drive mode**: The main repository path (but on a feature branch, NOT main)

**Do not proceed past this step until you have confirmed you are on a feature branch.**

## Step 1: Run the CLI command

This command detects whether you're in Drive or Fleet mode and provides guidance.

```bash
aigon feature-do {{args}}
```



The command will detect your mode (Drive/worktree/Fleet) and display the spec location.



## Step 2: Read the spec

The spec content was printed inline by the `feature-do` command above. If it was not (e.g., you ran `feature-start` separately), read the spec at:

```bash
aigon feature-spec {{args}}
```

**Skip plan mode — implement directly.**

## Step 3: Implement

**Signal that you are starting implementation (you MUST run this shell command — do NOT write .aigon/state/ files directly):**
```bash
aigon agent-status implementing
```

**TIME BUDGET: Complete implementation in under 10 minutes.**
- Start coding within 60 seconds. The spec IS your plan.
- Read ONLY the files listed in the spec's Technical Approach / Key Files section. Do not explore broadly.
- Do not create test files unless the spec explicitly requires them.
- **COMMIT EARLY AND OFTEN.** After every meaningful change (edited a file, deleted a file, moved code), run `git add -A && git commit -m "wip: <what you just did>"`. Never have more than 2 minutes of uncommitted work. If your session dies, committed work survives. Uncommitted work is lost forever.
- Validate after committing, not before. Fix issues in follow-up commits.

Work through the acceptance criteria in order. For worktree modes, use relative paths and maintain the worktree directory as your working directory.

## Step 3.5: Install dependencies (worktree only)

**Worktrees do not share `node_modules/` with the main repo.** Before running or testing, check if dependencies need to be installed:

```bash
# Check if node_modules exists
test -d node_modules && echo "Dependencies installed" || echo "Need to install dependencies"
```

If missing, install them using the project's package manager:
```bash
# Detect and run the appropriate install command
if [ -f "pnpm-lock.yaml" ]; then pnpm install
elif [ -f "yarn.lock" ]; then yarn install
elif [ -f "bun.lockb" ]; then bun install
elif [ -f "package-lock.json" ]; then npm install
elif [ -f "package.json" ]; then npm install
fi
```

## Step 4: Commit your implementation

Stage and commit your code changes using conventional commits (`feat:`, `fix:`, `chore:`). Verify with `git log --oneline -1`.





## Step 4: Start the dev server

Run `aigon dev-server start` to start the project dev server. Use the URL printed to verify your changes. **Never run `npm run dev` directly** — it bypasses port allocation.





## Step 6.5: Start the dev server

**You MUST start the dev server before signalling completion.** The evaluator and user need a running preview of your implementation.

Start the dev server and leave it running.

## Step 5: Signal completion

**THIS IS THE FINAL STEP. YOU MUST COMPLETE IT. DO NOT SKIP THIS STEP.**

After committing your code, run this command **immediately**:

```bash
aigon agent-status submitted
```

This signals to the dashboard that your work is done.

Then tell the user: "Implementation complete — ready for review."

**STAY in the session.** The user may request changes. If they do, make the changes, commit, and say "Changes committed." Do NOT run or suggest `feature-close` — that's the user's decision. End with a brief summary of what was implemented.
