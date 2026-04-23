# Three-Month Roadmap

Generated: 2026-04-23  
Scope: `4veco-platform` and companion output directory `../4veco-lessen`

## Core Principle

The two-team plan should start with a narrow platform-green gate. Until that gate is met, there is a deployment/output freeze for student-facing `4veco-lessen` material. The material team may plan and review, but should not start production work that depends on validators, generated game shells, skilltree data, or reference reports.

First make the platform minimally trustworthy. Then split the teams:

- Platform team: quality of architecture, validators, reference data, generators, CI.
- Material team: Book 1 release polish, Book 2 textbook production, teacher pilot materials.

## Phase 0: Define Green Enough

Do not wait for perfect architecture. Phase 0 covers both unblock work and essential cleanup work. Its purpose is to make `4veco-platform` safe enough for material production in `4veco-lessen`.

### Accepted Green-Enough Checklist

Status: accepted, not yet complete. Current failure details live in `knowledge/green-gate-failing-commands.md`.

The Green Gate passes only when all checks below are true:

| Gate | Current status |
|------|----------------|
| `npm.cmd test -- --runInBand` passes. | Not done. The skilltree data suite still fails. |
| `validate-chapter.js` works for current `4veco-lessen` chapters. | Partial. Chapter 1.1 passes; chapters 1.2-1.5 still expose content quality-gate gaps. |
| `validate-paragraph.js` is active, required, and matches the new flat paragraph layout. | Not done. It still expects the older paragraph folder naming format. |
| The skilltree/catalog mismatch is resolved. | Not done. `GEN.A38`-`GEN.A44` need to be implemented or classified as catalog-only. |
| One command exists to validate the platform plus a target book. | Not done. `check:platform` and `check:book` do not exist yet. |
| Generated reports are not obviously stale against the current catalog. | Not verified yet. This belongs in Sprint 0.4. |
| The deployment/output freeze can be lifted safely. | Not done. This is the Sprint 0.5 sign-off decision. |

This is the unlock point for full material production.

### Phase 0 Deployment Freeze

During Phase 0, agents must not generate, deploy, overwrite, or commit student-facing output in `4veco-lessen`.

Allowed during the freeze:

- planning documents.
- read-only review of existing material.
- platform code fixes in `4veco-platform`.
- validator/test/report fixes in `4veco-platform`.
- temporary scratch runs outside production output paths.
- health-check commands that inspect existing `4veco-lessen` output.

Not allowed during the freeze:

- new chapter or book production in `4veco-lessen`.
- new paragraph production in `4veco-lessen`.
- companion-material generation in `4veco-lessen`.
- deployment or generator runs that overwrite production material in `4veco-lessen`.

The freeze lifts only after Sprint 0.5 signs off the green gate.

### Phase 0A: Intake And Freeze The Gate

Target: 0.5 day.

Goal: define exactly what must be green before the material team starts production work.

Phase 0A handoff brief: `knowledge/phase-0a-green-gate-brief.md`.

Tasks:

- Record the current failing commands and their failure causes in `knowledge/green-gate-failing-commands.md`.
- Confirm that Phase 0 covers both unblock work and essential cleanup work.
- Keep the accepted "green enough" checklist in this roadmap current as failures are fixed.
- Mark `validate-paragraph.js` as active and required for the flat layout.
- Keep the flat-layout paragraph contract in `BUILD-PARAGRAPH.md` B6 as the source for what `validate-paragraph.js` must enforce.
- Declare the Phase 0 deployment/output freeze for `4veco-lessen`.
- Confirm that the material team may only do planning/review during Phase 0, not validator-dependent production.

Exit criteria:

- Everyone knows which commands must pass.
- Everyone knows which cleanup tasks are required before the gate can pass.
- Everyone knows the freeze rules and what work is still allowed.

### Sprint 0.1: Test Suite Unblock And Cleanup

Target: 2-3 days.

Goal: make the core platform test suite pass and clean up the known test-contract drift that caused the failures.

Tasks:

- Fix the skilltree/catalog mismatch:
  - decide whether A38-A44 are interactive skilltree units or catalog-only units.
  - add missing generators if interactive.
  - update tests if catalog-only.
- Replace hard-coded historical skill counts with catalog-driven expectations.
- Fix `scripts/tests/validate-chapter.test.js` output-capture failures.
- Run:

```powershell
npm.cmd test -- --runInBand
```

Exit criteria:

- `npm.cmd test -- --runInBand` passes.
- Any remaining skipped tests have a written reason and owner.

### Sprint 0.2: Validator Alignment And Cleanup

Target: 2-3 days.

Goal: make validation match the actual `4veco-lessen` layouts and remove stale validator assumptions.

Tasks:

- Keep `validate-chapter.js` as the required Part A chapter gate.
- Verify `validate-chapter.js` against all current Book 1 chapters.
- Update `validate-paragraph.js` for flat paragraph folders.
- Make `validate-paragraph.js` part of the green-gate health check.
- Decide whether companion validation needs a separate mode or file.
- Add a clear validator usage note:
  - textbook/chapter validation.
  - full companion paragraph validation.
  - book-level validation.

Exit criteria:

- The platform team can say which validator applies to which artifact.
- The material team can validate Book 1 chapters without guessing.
- The material team can validate a flat-layout paragraph pack with `validate-paragraph.js`.

### Sprint 0.3: Book-Level Health Command

Target: 1-2 days.

Goal: provide one command sequence that both teams can run before declaring the platform usable.

Tasks:

- Add or document a platform health command.
- Add or document a book health command for a target book path.
- Include:
  - platform tests.
  - chapter validation for every chapter in the target book.
  - link/data checks where stable enough.
- Keep the command practical. It should be repeatable during active work, not a once-a-month ceremony.

Target command shape:

```powershell
npm run check:platform
npm run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Exit criteria:

- A teammate can run the health check without knowing the internals.
- Failures point to a concrete next action.

### Sprint 0.4: Reference Report Sanity And Cleanup

Target: 1 day.

Goal: prevent stale reference reports from misleading the material team during Book 2 planning and clean up report drift where it blocks the green gate.

Tasks:

- Regenerate the core reference reports.
- Confirm report unit counts match the current catalog.
- Fix reports that block the green gate.
- If a non-blocking report cannot be fixed inside Phase 0, label it stale and exclude it from production decisions.
- Confirm `micro-teaching-units.json`, `begrippen.json`, and report outputs agree on basic counts.

Exit criteria:

- There is no obviously stale report being treated as authoritative.
- Known stale reports are named explicitly.

### Sprint 0.5: Green-Gate Sign-Off

Target: 0.5 day.

Goal: decide whether full team split can begin.

Tasks:

- Run the final platform and book health checks.
- Record pass/fail status.
- List residual risks that do not block material production.
- Assign owners for remaining cleanup that does not block material production.
- If all gate checks pass, explicitly lift the deployment/output freeze.

Exit criteria:

- If green: freeze is lifted; material team starts Book 1 release cleanup and Book 2 production.
- If not green: keep both teams focused on Phase 0 unblock and cleanup work, and do not start dependent production.

### Phase 0 Non-Goals

These are important, but they should not block the green gate:

- Full reference catalog cleanup.
- Full companion-material pipeline.
- All Book 1 review/quality-ref gaps.
- Book 2 production.

## Phase 1: First Post-Gate Split Sprint

Target: 1 week after Phase 0 passes.

Purpose: start the two-team split without losing the discipline created in Phase 0.

### Priority 1: Lock The Gate Into Routine Work

- Add the health commands to team working agreements.
- Make the green-gate commands the first step before any new chapter/book production.
- Confirm the Phase 0 deployment/output freeze has been lifted.
- Record known non-blocking residual risks in `knowledge/current-state-detailed-analysis.md`.
- Assign owners for each residual platform issue.

### Priority 2: Start Book 1 Release Cleanup

- Material team starts the Book 1 validator gaps:
  - missing reviews.
  - missing quality refs.
  - 1.2.2 asset naming/orphan issue.
- Platform team stays available for validator defects only, not content decisions.
- Any repeated manual fix should be turned into a script or checklist.

### Priority 3: Start Platform Quality Tracks

- Platform team starts the reference report and architecture tracks.
- Do not reopen Phase 0 unless the health command regresses.
- Defer companion-pipeline work until the validation path stays stable for at least one full Book 1 cleanup pass.

### Phase 1 Deliverable

The team split is active, Book 1 cleanup has started, and the health command remains the shared guardrail.

## Phase 2: Split The Teams

Once Phase 1 is done, split work clearly.

## Platform Team Roadmap

### Track A: Reference Data Quality

Target: months 1-3.

- Regenerate all stale reference reports.
- Fix reports still showing old unit counts.
- Clean unit-term drift between `micro-teaching-units.json` and `begrippen.json`.
- Triage `missing_units_flagged` into:
  - minted
  - duplicate
  - still needed
  - defer
  - reject
- Prioritize Book 2 dependencies and repeated hubs.
- Improve exam-question coverage:
  - fill missing required-skill links.
  - fill missing exam-code links.
  - remove deprecated `D23` usage.

### Track B: Architecture Quality

- Make validators layout-aware and explicit.
- Keep generated output separate from source.
- Make book/chapter validation easy to run.
- Add small tests around reference CLI scripts.
- Update stale docs where they conflict with current behavior.
- Keep architecture work focused on `4veco-platform` and `4veco-lessen`.

### Track C: Companion Pipeline

- Build a reliable flat-layout Part B path.
- Create `build-scripts/content/book-1/`.
- Adapt only the best reusable Module 1/3 content-builder patterns.
- Validate the companion MVP before scaling.

## Material Team Roadmap

### Track A: Book 1 Release Grade

- Add missing reviews and quality refs for chapters 1.2 through 1.5.
- Fix the 1.2.2 asset naming/orphan issue.
- Get all five Book 1 chapter validators passing.
- Rebuild Book 1 PDF/HTML.
- Do a teacher-facing review pass:
  - clarity
  - pacing
  - graph readability
  - answer model usability
  - exam fit

### Track B: Book 2 Textbook Layer

- Build Book 2 Part A only first.
- Use hard gates:
  - `_chapter-plan.md`
  - markdown files
  - SVG/PNG pairs
  - PDFs
  - review files
  - quality refs
  - chapter assembly
  - chapter validation
- Treat Book 2 as proof that the Book 1 workflow is repeatable.

### Track C: Companion MVP

- Do not build all 24 files for every paragraph yet.
- Pick 3-5 representative paragraphs.
- Build a polished set:
  - presentation
  - voorkennis/vaardigheden
  - one interactive/game shell
  - landing page
  - possibly one guided practice file
- Feed lessons back into templates before scaling.

## Suggested Timeline

### Weeks 1-2: Platform Green Gate

- Platform team owns all green-gate unblock and cleanup work.
- Material team can do review/planning only; production output in `4veco-lessen` stays frozen.
- Output: tests green, validators usable, book validation command exists, freeze can be lifted.

### Weeks 3-4: Book 1 Release Cleanup

- Material team fixes Book 1 validation gaps.
- Platform team continues reference-health and architecture cleanup.
- Output: Book 1 all chapters validate.

### Month 2

- Material team builds Book 2 chapters 2.1 through 2.3.
- Platform team works reference cleanup and companion pipeline.
- Output: first companion MVP paragraph/chapter finished.

### Month 3

- Material team completes or nearly completes Book 2 textbook layer.
- Platform team finishes reference backlog triage and validates pipeline reliability.
- Output: Book 1 pilot-ready, Book 2 textbook-ready or close, platform healthier than merely green.

## Strong Recommendation

Make the first milestone brutally narrow:

> Platform green enough for material production.

Only after that should the teams split fully. Otherwise the material team will keep building on moving sand, and the platform team will be pulled into constant green-gate cleanup work.
