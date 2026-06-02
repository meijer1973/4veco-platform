# Sprint REASON-ANSWERFORM-2: Result

Generated: 2026-06-02

Verdict: **PASS WITH FLAGS**

## Plan reference

Plan: `reports/sprints/REASON-ANSWERFORM-2-plan.md`

## Summary

`REASON-ANSWERFORM-2` connected the generated Book 1 reasoning practice route
to reviewed answer-form scaffold metadata for explanation and source-use
patterns while preserving the local-practice boundary.

The sprint adds student-facing scaffold cues for answer construction, keeps
internal MTU codes out of rendered UI, and records honest mode dispositions for
lanes that remain local or held. It does not authorize target-equivalent
reasoning proof, diagnostics, mastery, sequencing, summative use, Scale Gate 1,
student-facing AI, PV, or product use.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts\sprints\check-sprint-plan.js reports\sprints\REASON-ANSWERFORM-2-plan.md` | passed |
| `node build-scripts\sprints\check-sprint-bundle.js REASON-ANSWERFORM-2` | passed |
| `npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js` | passed, 4 suites / 130 tests |
| `node scripts\deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts\sprints\check-reason-answerform2-route-output.js` | passed |
| `node build-scripts\sprints\capture-reason-answerform2-screenshots.js` | passed |
| `node build-scripts\reports\validate-report-json.js` | passed |
| `git diff --check` | passed |
| `git -C "../4veco-lessen" diff --check` | passed |

## Changed files

Platform implementation and tests:

- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/tests/reasoning-engine.test.js`
- `engines/tests/reasoning-ui.test.js`

Sprint tooling and evidence:

- `build-scripts/sprints/check-reason-answerform2-route-output.js`
- `build-scripts/sprints/capture-reason-answerform2-screenshots.js`
- `reports/sprints/REASON-ANSWERFORM-2-*`
- `reports/json/reason-answerform2-proof.json`
- `reports/json/reason-answerform2-scaffold-map.json`
- `references/data/sprints/REASON-ANSWERFORM-2.plan.json`
- `references/data/sprints/REASON-ANSWERFORM-2.result.json`

Generated lesson output:

- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning.css`

## Data integrity notes

No protected reference data was changed. The sprint did not mutate
`references/machine/`, `references/external/`, source reasoning CSV files,
exit-ticket source data, target-exercise fields, candidate storage, or
protected MTU records.

Generated Book 1 output was changed only through `scripts/deploy.js`; known
deploy spillover files outside the sprint output map were restored.

## Open follow-ups

- Late planning review is accepted as a protocol variance, not erased.
- A99 scaffold exists in the catalog but lacks a live generated 1.1.1/1.1.2
  evidence case.
- A81 remains future source-use modifier only; no live source-based explanation
  route is proven.
- Mode 2 needs reviewed error-repair/two-tier adoption before unified
  shared-shell status.
- Mode 3 remains an ordered-chain bridge, not a full visual flow construction
  task.
- Mode 4 remains held for classification-with-explanation redesign.
- Mobile route panel can sit below the first viewport after long checked tasks.
- Deterministic rendered interactions prove rendered scaffold behavior, not
  independent student usability.

## Rollback instructions

If rollback is required, revert the platform implementation and evidence files
from this sprint and redeploy the Book 1 reasoning output through
`scripts/deploy.js`. Do not hand-edit generated lesson output. After rollback,
rerun the sprint route checker, focused reasoning/task-shell tests, and lesson
diff check.

## Implemented

- Added distinct answer-form scaffold catalog entries for:
  - `A97` / `Leg uit dat`
  - `A98` / `Leg uit of`
  - `A99` / `Leg uit met voorbeeld`
  - `A81` / source-use modifier
  - `A96` / calculation coordination
- Added scaffold inference for generated reasoning tasks.
- Added `A81` modifier-only guard; standalone source-use scaffolds are rejected.
- Added answer-form cues to the reasoning UI with friendly labels and local
  checklist copy.
- Preserved mode 2 as local error repair.
- Preserved mode 4 as held for classification-with-explanation redesign.
- Preserved mode 3 as an ordered-chain bridge, not full flow construction.
- Added focused tests, route checker, screenshot capture, proof JSON, scaffold
  map JSON, screenshot manifest, and playable proof.

## Generated Output

Generated Book 1 output was rebuilt only through:

```powershell
node scripts\deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Current lesson diff is scoped to:

- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning.css`

Known deploy spillover files outside the sprint map were restored.

## Evidence

- `reports/sprints/REASON-ANSWERFORM-2-plan.md`
- `reports/sprints/REASON-ANSWERFORM-2-baseline.md`
- `reports/sprints/REASON-ANSWERFORM-2-planning-review.md`
- `reports/sprints/REASON-ANSWERFORM-2-answer-form-scaffold-map.md`
- `reports/sprints/REASON-ANSWERFORM-2-mode-disposition.md`
- `reports/sprints/REASON-ANSWERFORM-2-playable-proof.md`
- `reports/json/reason-answerform2-proof.json`
- `reports/json/reason-answerform2-scaffold-map.json`
- `reports/sprints/REASON-ANSWERFORM-2-screenshot-manifest.md`
- `reports/sprints/REASON-ANSWERFORM-2-screenshots/`
- `reports/sprints/REASON-ANSWERFORM-2-lead-review-assignment.md`
- `reports/sprints/REASON-ANSWERFORM-2-lead-review-round1.md`
- `reports/sprints/REASON-ANSWERFORM-2-lead-review-corrections.md`
- `reports/sprints/REASON-ANSWERFORM-2-lead-review-round2.md`
- `reports/sprints/REASON-ANSWERFORM-2-diff-summary.md`
- `references/data/sprints/REASON-ANSWERFORM-2.plan.json`
- `references/data/sprints/REASON-ANSWERFORM-2.result.json`

## Lead Review

Round 1 returned `REVISE` because the planning-review artifact and lead-review
artifacts were missing and implementation had proceeded before valid planning
review. Corrections added the missing evidence and recorded the issue as a
protocol variance.

Round 2 returned `PASS WITH FLAGS` and accepted the late planning review as a
carried protocol variance, not a precedent.

## Carried flags

- Late planning review is accepted as a protocol variance, not erased.
- A99 scaffold exists in the catalog but lacks a live generated 1.1.1/1.1.2
  evidence case.
- A81 remains future source-use modifier only; no live source-based explanation
  route is proven.
- Mode 2 needs reviewed error-repair/two-tier adoption before unified
  shared-shell status.
- Mode 3 remains an ordered-chain bridge, not a full visual flow construction
  task.
- Mode 4 remains held for classification-with-explanation redesign.
- Mobile route panel can sit below the first viewport after long checked tasks.
- Deterministic rendered interactions prove rendered scaffold behavior, not
  independent student usability.

## Authority

Authorized next:

- Prepare the final reasoning human review gate packet only after this sprint
  is committed and pushed with maps/indexes refreshed.

Not authorized:

- target-equivalent reasoning proof;
- generated lesson output beyond this sprint's reviewed reasoning output;
- protected reference mutation;
- source CSV mutation;
- target-exercise field writes;
- candidate storage;
- diagnostics;
- adaptive routing;
- mastery or sequencing;
- summative use;
- student-facing AI;
- PV projection or machine promotion;
- Scale Gate 1;
- student/product use.
