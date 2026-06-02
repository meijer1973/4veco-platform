# Lead Review Summary
Sprint: `REASON-STD-1`
Round: lead review round 1

## Scope

Round-1 lead review inspected the reasoning standard-family migration package
before sprint closure. Evidence inspected included the sprint plan, baseline,
planning review, standard-family map, build-vs-rebuild note, rendered fixture,
screenshot manifest, proof JSON, checker, engine changes, focused tests, and
protected-output boundaries.

Evidence inspected:

- `reports/sprints/REASON-STD-1-plan.md`
- `reports/sprints/REASON-STD-1-baseline.md`
- `reports/sprints/REASON-STD-1-planning-review.md`
- `reports/sprints/REASON-STD-1-standard-family-map.md`
- `reports/sprints/REASON-STD-1-build-vs-rebuild-note.md`
- `reports/sprints/REASON-STD-1-rendered-fixture.html`
- `reports/sprints/REASON-STD-1-screenshot-manifest.md`
- `reports/json/reason-std1-standard-family-map.json`
- `reports/json/reason-std1-proof.json`
- `build-scripts/sprints/check-reason-std1.js`
- `engines/reasoning-engine.js`
- `engines/tests/reasoning-engine.test.js`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Mode mapping honesty | Lead reviewer agent Russell | Modes 0/1/3/5 mapped to executable shared tasks; modes 2/4 not overclaimed | PASS |
| Product-boundary check | Lead reviewer agent Russell | No generated output, source-data edits, protected-reference mutation, target-equivalent, diagnostic, mastery, sequencing, or product-use claims | PASS |
| Fixture provenance | Lead reviewer agent Russell | Rendered fixture must be generated from actual engine task objects or clearly reworded as illustrative only | REVISE |
| Standard-task negative proof | Lead reviewer agent Russell | Wrong shared task-shell responses rejected for modes 0, 1, and 3 | REVISE |
| Focused validation | Shell commands | Plan, checker, focused Jest, active sprint bundle pass | PASS |

## Consolidated Verdict

Verdict: REVISE

The sprint direction is conceptually sound. Modes 0, 1, 3, and 5 have
executable shared-task proof, and modes 2 and 4 are correctly deferred or
refactor-scoped instead of forced into weak mappings.

The product boundaries are clean. The review found no generated lesson output
changes, source-data edits, protected-reference diffs, or target-equivalent,
diagnostic, mastery, sequencing, or product-use claims.

The proof package must be corrected before closure because two proof-rigor
blockers remain.

## Blocking Findings

Blocking findings existed in round 1.

1. Rendered fixture provenance is too weak. The first fixture was static
   illustrative HTML while the sprint prose said it showed task-shell shapes
   emitted by the reasoning engine. The checker verified strings but did not
   prove the fixture matched actual `round.taskShellTask` objects.
2. Shared task-shell negative proof is incomplete. The checker and focused
   tests accepted correct `{ order }` responses for modes 0, 1, and 3, but did
   not prove wrong-order shared task-shell responses were rejected.

## Specialist Findings

Mode 1 is only a `claim_reason_evidence` semantic mapping over
`step_ordering`; later adoption must not overclaim a richer claim/evidence
model.

Mode 3 is an ordered-chain bridge, not a real visual flow-diagram
implementation yet.

Mode 4's `refactor_before_adoption` disposition is correct and must remain
carried until reviewed one-to-one match banks and explanation handling exist.

The screenshot manifest is honest that generated-route screenshots are not
present in this sprint, but that boundary should remain explicit because the
filename can be over-read.

## Test Evidence

Lead reviewer commands run:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-STD-1-plan.md`
- `node build-scripts/sprints/check-reason-std1.js`
- `npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js`
- `node build-scripts/sprints/check-sprint-bundle.js REASON-STD-1`
- `git -C ..\4veco-lessen status --short`
- `git diff -- source-data references/machine references/external references/authored/course-target-exercises.json`

The commands passed, but round 1 still returned REVISE because the proof
package accepted weaker fixture provenance and lacked wrong-response
assertions.

## Learning Quality Evidence

The mapping preserves the correct learning boundary. Reasoning tasks are local
practice and repair support, not proof that a target exercise can be completed.
The review accepted the decision to avoid weak generic-choice or matching
substitutes for modes 2 and 4.

## Student Experience Evidence

No generated student route changed. The rendered fixture is useful only as a
report surface for task-family shape. Later reasoning adoption must produce
playable route proof, actual screenshots, and usability-agent traces before a
human gate can judge the lived student experience.

## Ownership and Handoff

Main agent owns corrections to fixture provenance, negative standard-task
checks, and correction logging. The lead-review agent owns round-2 recheck
after corrections.

No protected reference data, source reasoning CSV, source exit-ticket data,
target-exercise registry, candidate storage, or generated lesson output should
change during correction.

## Required Next Action

Generate the rendered fixture and proof JSON from actual engine-emitted
`taskShellTask` objects, update checker and focused tests to reject wrong
orders for modes 0, 1, and 3, record corrections, rerun focused validation,
then request lead-review round 2. Do not close `REASON-STD-1` until round 2
passes.
