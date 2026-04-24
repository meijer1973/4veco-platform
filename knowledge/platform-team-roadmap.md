# Platform Team Roadmap

Generated: 2026-04-23  
Updated: 2026-04-23 after executing Sprint P1.1  
Source: split from `knowledge/three-month-roadmap.md` after Sprint 0.5 sign-off

Detailed bootstrap plan for the first Book 1 companion MVP:

- `knowledge/platform-team-companion-bootstrap-plan.md`

## Mission

Own the platform guardrails that make material production trustworthy:

- validators
- deploy/config plumbing
- generators
- reference quality
- architecture quality
- CI and repeatable health checks

## Current Status

Sprint 0.5 is signed off for Part A textbook/book production, and Sprint P1.1 has now proven the first Book 1 companion paragraph path.

Verified:

- `npm.cmd run check:platform` passes.
- `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` passes.
- `node scripts\validate-paragraph.js --mode complete "<1.1.1-folder>"` passes.
- `node scripts\deploy.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` runs cleanly, including link checks and data tests.

Important boundary:

- Part A textbook/chapter/book delivery is green.
- The Part B companion pipeline is now technically proven end-to-end for `1.1.1 Schaarste en economisch denken`.
- Bulk repetition beyond the first MVP paragraph is not yet proven.

Companion bootstrap status:

- `BUILD-PARAGRAPH.md` has been patched for the Book 1 flat-layout Part B flow.
- Book 1 now has a book-root `deploy-config.json`.
- Book 1 now has a book-root `shared/` structure.
- `build-scripts/content/book-1/` now exists.
- `source-data/book-1/reasoning/` now exists.
- `validate-paragraph.js --mode part-b` and `--mode complete` for `1.1.1` now run against the real flat-layout Book 1 flow.
- `scripts/deploy.js` now supports the Book 1 MVP flow cleanly, including shared reasoning metadata and flat-layout converter/deploy behavior.

## Team Guardrails

- Keep `check:platform` green.
- Keep `check:book` green while the lessen team edits Book 1 and builds Book 2 Part A.
- Do not reopen Phase 0 unless one of the green-gate commands regresses.
- Treat companion work as a pilot scaling track: one real paragraph now passes `validate-paragraph.js --mode complete`, but repeatability across more paragraphs is still the next proof step.

## Recommended Start

### Phase 1A: Companion Handoff Stabilization

Status: complete.

Target: 0.5-1 week.

Purpose:

- keep the Part A green gate routine intact
- prove that the new Book 1 companion bootstrap is genuinely usable
- keep the split with the lessen team clean by removing any remaining platform-owned ambiguity

Success condition:

- the platform team can say with confidence whether any remaining `1.1.1` Part B failures are platform defects or content/data work
- the lessen team can continue the MVP paragraph without inventing platform structure on the fly
- the Book 1 proof run is green on platform, book, paragraph-complete, and deploy checks

## First Sprint Proposal

### Sprint P1.1: Book 1 Companion Proof Sprint

Status: complete.

Goal:

Prove that `1.1.1 Schaarste en economisch denken` has no remaining platform-owned blockers and that the Book 1 companion path is stable enough for the lessen team to keep moving.

Executed work:

1. Kept the green gate routine active:
   - `npm.cmd run check:platform`
   - `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"`
2. Re-ran the MVP proof checks for `1.1.1`:
   - `node scripts\validate-paragraph.js --mode complete "<paragraph-folder>"`
3. Verified `scripts/deploy.js` is repeatable against Book 1 without path/layout surprises.
4. Fixed the platform-owned blockers surfaced by the proof run:
   - `check-book.js` now defaults to `part-a` so book health stays stable while companion pilots are in progress
   - chapter/paragraph validators now distinguish Part A asset checks from companion-only extra assets
   - flat-layout converters now support Book 1 root-level companion files
   - deploy now copies shared reasoning metadata needed by the flat Book 1 flow
   - link checking now measures actual interactive reachability rather than textbook export noise
   - procedure-data tests were aligned with the canonical unit registry rather than a stale last-step assumption
5. Updated the roadmap/docs to match the real post-proof state.

Exit criteria:

- `check:platform` stays green
- `check:book` stays green
- Book 1 deploy/generator behavior is stable for the MVP paragraph
- `1.1.1` passes `validate-paragraph.js --mode complete`
- no remaining `1.1.1` platform blockers were found during the proof run

## Immediate Priorities

### 1. Lock The Green Gate Into Routine

- Keep these as the standard pre/post-change checks:

```powershell
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

- Keep validator docs and roadmap status aligned with real behavior.
- Record any non-blocking residual risks in `knowledge/current-state-detailed-analysis.md`.

### 2. Prove And Stabilize The Companion MVP Plumbing

This is the main post-gate platform responsibility.

Current state:

- `build-scripts/content/book-1/` exists.
- Book 1 has a book-root `deploy-config.json`.
- Book 1 has a book-root `shared/` game-data/engine layer.
- `1.1.1` now passes `validate-paragraph.js --mode complete`.
- `scripts/deploy.js` now runs cleanly against Book 1.
- The remaining question is how to scale the pattern from one proven paragraph to repeatable routine use.

Tasks:

- Keep the Book 1 bootstrap layer stable.
- Verify `scripts/deploy.js` runs cleanly against Book 1 under repeat use.
- Verify generated/shared files land where the flat layout expects them.
- Triage remaining Part B validation failures into platform-owned vs content-owned work.
- Support one representative complete companion paragraph until it passes:

```powershell
node scripts\validate-paragraph.js --mode complete "<paragraph-folder>"
```

### 3. Reference Data Quality

- Regenerate stale reports when needed.
- Clean unit-term drift between `micro-teaching-units.json` and `begrippen.json`.
- Triage `missing_units_flagged` into:
  - minted
  - duplicate
  - still needed
  - defer
  - reject
- Improve exam-question coverage:
  - missing required-skill links
  - missing exam-code links
  - deprecated `D23` cleanup

### 4. Architecture Quality

- Keep validators layout-aware and explicit.
- Keep generated output separate from source intent.
- Make book/chapter/paragraph validation practical to run during active work.
- Add small tests around reference CLI scripts where risk is high.
- Update docs when live behavior changes.

## Platform Team Deliverables

### Next 1 Week

- Green gate stays green.
- Companion MVP plumbing is proven stable for Book 1 under real use.
- Lessen team can continue one real companion paragraph without platform ambiguity.

### Next 2-4 Weeks

- One representative paragraph passes `--mode complete`. Completed for `1.1.1`.
- Reusable Book 1 companion build scripts exist under `build-scripts/content/book-1/`.
- Deploy/config assumptions for flat Book output are stable enough to repeat.

### Months 1-3

- Reference backlog is cleaner and better trusted.
- Companion pipeline is proven on real work, not just documented.
- Platform quality is better than merely "green".

## What The Platform Team Does Not Own

- Teacher-facing content judgment on Book 1 polish.
- The actual educational writing for Book 2 Part A.
- Bulk companion production across many paragraphs before the MVP is proven.

## Escalation Triggers

Bring issues back to shared planning immediately if:

- `check:platform` regresses.
- `check:book` regresses because of validator/platform behavior rather than content edits.
- `scripts/deploy.js` cannot target Book 1 cleanly after config/plumbing is added.
- The first companion MVP reveals a structural mismatch between `BUILD-PARAGRAPH.md` and the real toolchain.
