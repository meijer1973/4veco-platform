# REASON-STD-1 Lead Review Assignment

Generated: 2026-06-02

Sprint: `REASON-STD-1`

Reviewer: lead reviewer agent `Russell` (`019e88a6-39e1-78a3-934c-2e8cd468d51d`)

## Scope

Review the completed reasoning standard-family migration evidence before
sprint closure. This is a bounded platform-runtime mapping sprint. The review
must decide whether the current reasoning modes have honest shared task-family
dispositions, whether the checker/test proof is sufficient, and whether the
next reasoning sprints are correctly constrained before any generated-route or
product-route adoption.

## Evidence To Inspect

- `reports/sprints/REASON-STD-1-plan.md`
- `reports/sprints/REASON-STD-1-baseline.md`
- `reports/sprints/REASON-STD-1-planning-review.md`
- `reports/sprints/REASON-STD-1-standard-family-map.md`
- `reports/sprints/REASON-STD-1-build-vs-rebuild-note.md`
- `reports/sprints/REASON-STD-1-rendered-fixture.html`
- `reports/sprints/REASON-STD-1-screenshot-manifest.md`
- `reports/json/reason-std1-standard-family-map.json`
- `reports/json/reason-std1-proof.json`
- `references/data/sprints/REASON-STD-1.plan.json`
- `build-scripts/sprints/check-reason-std1.js`
- `engines/reasoning-engine.js`
- `engines/tests/reasoning-engine.test.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

## Required Review Questions

1. Does mode 0 map honestly to `step_ordering` and validate/evaluate through
   the shared task shell?
2. Does mode 1 map honestly to `claim_reason_evidence` while using the
   `step_ordering` response shape?
3. Does mode 3 map honestly to an ordered `flow_diagram_build` /
   `cause_effect_chain` bridge while carrying the visual-flow follow-up?
4. Does mode 5 remain `structured_reasoning` self-check without target-proof,
   diagnostic, mastery, sequencing, or scored-completion claims?
5. Are mode 2 and mode 4 correctly deferred/refactor-scoped instead of forced
   into weak or leaking shared-shell families?
6. Are the report fixture, JSON proof, checker, and focused tests sufficient
   for this sprint's platform-runtime mapping claim?
7. Does the build-vs-rebuild note give the next implementer actionable
   keep/wrap/refactor/rebuild decisions?
8. Did the sprint avoid generated lesson output, reasoning CSV edits,
   source-data writes, protected reference mutation, target-exercise writes,
   candidate storage, target-equivalent claims, diagnostics, adaptive routing,
   mastery/sequencing, student-facing AI, summative use, PV, Scale Gate 1, and
   product-wide use?

## Expected Output Format

Return a strict lead-review report using the repo-required headings:

- `# Lead Review Summary`
- `Sprint: `REASON-STD-1``
- `Round: lead review round 1`
- `## Scope`
- `## Review Plan`
- `## Consolidated Verdict`
- `## Blocking Findings`
- `## Specialist Findings`
- `## Test Evidence`
- `## Learning Quality Evidence`
- `## Student Experience Evidence`
- `## Ownership and Handoff`
- `## Required Next Action`

Valid round-1 verdicts are `PASS`, `PASS WITH FLAGS`, `REVISE`, `PAUSE`, or
`FAIL`. If any mode mapping is overstated, if the checker allows product-route
adoption claims, or if the sprint hides generated-output/product-authority
scope creep, return `REVISE`, not `PASS WITH FLAGS`.

