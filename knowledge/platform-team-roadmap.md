# Platform Team Roadmap

Generated: 2026-04-23  
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

Sprint 0.5 is signed off for Part A textbook/book production.

Verified:

- `npm.cmd run check:platform` passes.
- `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` passes.

Important boundary:

- Part A textbook/chapter/book delivery is green.
- The full Part B companion pipeline is not yet proven end-to-end for Book 1.

## Team Guardrails

- Keep `check:platform` green.
- Keep `check:book` green while the lessen team edits Book 1 and builds Book 2 Part A.
- Do not reopen Phase 0 unless one of the green-gate commands regresses.
- Treat companion work as an MVP track until one real paragraph passes `validate-paragraph.js --mode complete`.

## Immediate Priorities

### 1. Lock The Green Gate Into Routine

- Keep these as the standard pre/post-change checks:

```powershell
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

- Keep validator docs and roadmap status aligned with real behavior.
- Record any non-blocking residual risks in `knowledge/current-state-detailed-analysis.md`.

### 2. Build The Companion MVP Plumbing

This is the main post-gate platform responsibility.

Current gaps:

- `build-scripts/content/book-1/` does not exist yet.
- Book 1 has no book-root `deploy-config.json`.
- Book 1 has no book-root `shared/` game-data/engine layer.
- `scripts/deploy.js` expects that manifest/config shape for flat-layout companion generation.

Tasks:

- Create `build-scripts/content/book-1/`.
- Add the Book 1 `deploy-config.json` needed by the flat deploy path.
- Establish the Book 1 `shared/` structure:
  - `shared/questions/`
  - `shared/newsdetective/`
  - `shared/reasoning/`
  - `shared/procedure/`
  - `shared/skilltree/`
- Verify `scripts/deploy.js` runs cleanly against Book 1.
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
- Companion MVP plumbing exists for Book 1.
- Lessen team can start one real companion paragraph without inventing the platform layer on the fly.

### Next 2-4 Weeks

- One representative paragraph passes `--mode complete`.
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
