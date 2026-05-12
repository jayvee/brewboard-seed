---
description: Do feature <ID> - works in both Drive and Fleet modes
argument-hint: "<ID> [--agent=<agent-id>] [--iterate] [--max-iterations=N] [--auto-submit] [--no-auto-submit] [--dry-run]"
---
# aigon-feature-do

> **RUN THIS FIRST — no preamble, no --help, no file searches:**
> ```bash
> aigon feature-do {{args}}
> ```
> This prints the feature spec inline. Read the output, then follow the steps below.
> Do NOT search for spec files, do NOT run `aigon --help`, do NOT hunt for the `aigon` source. Just run the command above.

Implement a feature. Works in Drive mode (branch), Drive worktree, and Fleet mode (competition).

> **Worktree invariant:** you are already inside the correct repo. If `aigon` fails, read the error — do NOT try to introspect the tool's internals.

## Argument Resolution
If no ID is provided or it doesn't match an active feature, run `aigon feature-list --active`, filter to matches, and ask the user which one.

## Step 1: Attach to the workspace

```bash
aigon feature-do {{args}}
```

Only run `/aigon:feature-start {{args}}` if the feature branch/worktree does not exist yet.

## Step 2: Read the spec (already inlined)

The spec body was printed inline by `feature-do` above. **Use that copy.** Do not re-read from disk and do not re-run `aigon feature-spec` — the inline copy is authoritative.

**Skip plan mode — implement directly.**

{{SET_CONTEXT_SECTION}}

{{RESEARCH_CONTEXT_SECTION}}

{{PLANNING_CONTEXT_SECTION}}

## Step 3: Implement

Signal that you are starting (shell command only — do not write `.aigon/state/` files directly):
```bash
aigon agent-status implementing
```

**TIME BUDGET: under 10 minutes.**
- Start coding within 60 seconds. The spec IS your plan.
- Read ONLY files listed in the spec's Technical Approach / Key Files section.
- Do not create test files unless the spec explicitly requires them.
- **COMMIT EARLY AND OFTEN.** After every meaningful change: `git add -A && git commit -m "wip: <what you just did>"`. Never more than 2 minutes of uncommitted work.
- Use **relative paths** from the current worktree. Never absolute paths.
- Run shell commands directly; don't delegate simple commands (test runs, syntax checks, validation batches) to sub-agents.
- **Do not run the project's full / heavy validation suite during ordinary feature work** — that's pre-push territory. Use the project's quick / scoped validation (if any) during iteration. Check the project's own docs (`AGENTS.md`, `README.md`, etc.) for which commands are which.

**Scope guardrails — read before editing:**
- Do not delete, move, or modify files unrelated to your feature spec. If existing code conflicts with your feature, document it in your log — do not remove it.
- Do not delete any test files. Do not remove existing function exports.
- Do not move spec files between folders — only the CLI manages spec state transitions.
- If you must touch a file outside your feature's area, note it explicitly in your implementation log with the reason.

Work through the acceptance criteria in order.

## Step 4: Commit your implementation

Stage and commit using conventional commits (`feat:`, `fix:`, `chore:`). Verify with `git log --oneline -1`.

## Step 4.5: Start the dev server

Run `aigon dev-server start` to start the project dev server. Use the URL printed to verify your changes. **Never run the project's dev command directly** — it bypasses port allocation.

**No implementation log (instructions rigor: light).** Do not create `docs/specs/features/logs/feature-{{ARG1_SYNTAX}}-*-log.md`.

## Step 6.5: Start the dev server (mandatory)

**You MUST run this step — do not skip it, even for simple or non-UI features.**

```bash
aigon dev-server start
```

Leave it running. Do not proceed to Step 5 until this command has completed successfully.

## Step 5: Signal completion

After committing, run **immediately**:

```bash
aigon agent-status implementation-complete
```

Hard rules:
- Implementation is **not** complete until this succeeds. Don't say "done" before it exits 0.
- If it fails, diagnose whether it is **scope uncertainty** or an **infrastructure blockage**:
  - **Scope uncertainty** (ambiguous criterion, missing information, decision required): report the error and stop for user guidance. Don't substitute `feature-close` or other commands.
  - **Infrastructure blockage** (pre-existing bug in the submission gate — security scanner, test runner, validation script — that is clearly diagnosable and fixable in ≤10 lines, unrelated to your feature's scope): apply the minimal fix, commit it with message `fix: unblock agent-status gate — <one-line description>`, and retry. Document the fix in your implementation log.
- Ship within 60 seconds of green tests — don't re-run validation "to be sure" or pre-expand the log.

After it succeeds, tell the user: "Implementation complete — ready for review."

**STAY in the session.** If the user requests changes, make them, commit, and say "Changes committed."

Do **not** run `feature-close` or `feature-eval` — that's the user's decision. In Drive mode the recommended next command is `/aigon:feature-close <ID>`; in worktree/Fleet modes, wait for the user.
