# Lessen Team Roadmap

Generated: 2026-04-23  
Source: split from `knowledge/three-month-roadmap.md` after Sprint 0.5 sign-off

## Mission

Own the material side of delivery:

- Book 1 release polish
- Book 2 Part A textbook production
- first companion MVP build, treated as a pilot

## Current Status

Sprint 0.5 is signed off for Part A textbook/book production.

That means:

- Book 1 Part A is green.
- Book 2 Part A can start.
- The first companion build may start, but it must be treated as pilot work.

Important boundary:

- A complete paragraph plus companion pipeline is not yet routine.
- The first companion paragraph is meant to prove the workflow, not to scale it blindly.

## Team Guardrails

- Keep Book 1 green while editing:

```powershell
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

- Reviews and quality refs are now mandatory artifacts, not optional paperwork.
- Rebuild affected paragraph/chapter/book HTML/PDF whenever source markdown or assets change.
- Do not start bulk companion production until one real paragraph passes:

```powershell
node scripts\validate-paragraph.js --mode complete "<paragraph-folder>"
```

## Immediate Priorities

### 1. Book 1 Release Polish

Do a teacher-facing review pass on Book 1:

- clarity
- pacing
- graph readability
- answer model usability
- exam fit

Rules:

- Keep all five chapter validators passing.
- Keep all paragraph validators passing in auto/Part A mode.
- Any repeated manual fix should be turned into a checklist or handed back as a platform improvement request.

### 2. Book 2 Part A Textbook Layer

Build Book 2 Part A first, with hard gates:

- `_chapter-plan.md`
- paragraph markdown files
- SVG/PNG pairs
- PDFs
- review files
- quality refs
- chapter assembly
- chapter validation

Use Book 2 as proof that the Book 1 Part A workflow is repeatable, not just a one-off success.

### 3. Companion MVP Pilot

Start small.

Phase 1 recommendation:

- pick one representative paragraph first
- build the full Part B layer seriously
- pass `validate-paragraph.js --mode complete`
- only then decide whether to expand to 3-5 representative paragraphs

Expected companion scope comes from `BUILD-PARAGRAPH.md`:

- `_paragraph-plan.md`
- the 24 required Part B root files
- shared game data at book root
- generated landing/game shell outputs where required

Pilot mindset:

- expect workflow gaps
- document friction honestly
- feed lessons back into templates and scripts before scaling

## Lessen Team Deliverables

### Next 1 Week

- Book 1 release polish starts while keeping `check:book` green.
- Book 2 Part A planning and first chapter work begin.
- One candidate paragraph is chosen for the companion MVP.

### Next 2-4 Weeks

- Book 1 is stronger for teacher use.
- Book 2 Part A chapters are moving under the same green-gate discipline.
- The first complete companion paragraph is either validated successfully or has a concrete blocker list.

### Months 1-3

- Book 1 becomes pilot-ready.
- Book 2 textbook layer becomes textbook-ready or close.
- Companion production decisions are based on one real validated MVP, not guesswork.

## What The Lessen Team Does Not Own

- Validator bugs and deploy/config plumbing.
- Reference-report architecture cleanup.
- Platform-level generator refactors.

Those should be escalated to the platform team instead of patched locally.

## Escalation Triggers

Bring issues back to the platform team immediately if:

- `check:book` fails because of validator/tooling behavior rather than content quality.
- A companion build is blocked by missing `deploy-config.json`, missing `shared/`, or missing generator/build-script infrastructure.
- The complete-mode validator expects artifacts that the documented toolchain cannot yet produce cleanly.
