# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: First-Three Golden Workflow Availability Wave

## Goal

Codify the first Year 1 Golden rollout wave as a bounded first-three workflow
availability package. The wave records that `1.1.1`, `1.1.2`, and `1.1.3`
have six current Golden check surfaces and existing rendered product-path proof,
then adds a deterministic checker so future workflow agents cannot treat that
bounded state as complete Year 1 rollout or Scale Gate 1 authority.

## Context

Current platform source data under `source-data/book-1/exit-ticket/` contains
only six current split check surfaces: advisory short checks and exit tickets
for `1.1.1`, `1.1.2`, and `1.1.3`. `references/data/exercise-surface-manifest.json`
marks those six surfaces as first-three product-proof scope and marks `1.1.4`
only as same-copy hygiene. The refreshed Scale proof packet records rendered
landing, Start, Leer, Oefen, skill-map, practice, advisory-check, exit-ticket,
feedback, mobile, and dark-state evidence for the first three paragraphs, with
all downstream authority flags held.

The sprint is therefore not a new source-authoring sprint for `1.1.4` or
chapter `1.2`. It is a rollout-control sprint: make the already-proven
first-three Golden exercise surfaces available to workflows through a
machine-readable wave manifest, CI-visible checker, REV-STD-1 packet, and clear
next-expansion boundary.

## Quality Standard

The specification quality floor is that a rollout wave must be based on current
source/generated evidence, not stale pre-split check paths or screenshots. The
student-facing claim must stay limited to rendered output already proved for the
first three paragraphs, and every proof artifact must state the follow-up work
that remains before broader product, route-adoption, or scale claims.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| First-three check surfaces are current and Golden | Wave manifest lists exactly the six current split surfaces and checker verifies source, generated output, Golden framework, and authority flags | `check-y1-golden-rollout-wave-1.js` plus exercise currentness checker | planned |
| Workflow availability is based on rendered product-path proof | Wave manifest cites Scale proof, route inventory, screenshot manifest, and skill-map proof | Checker verifies the Scale proof status and route-family/link facts remain clean | planned |
| Expansion boundary is explicit | Manifest records `1.1.4` as same-copy hygiene only and chapter `1.2` as not source-data ready for this wave | Checker rejects extra source check surfaces or gate claims beyond `1.1.1`-`1.1.3` | planned |
| Downstream authority remains held | Manifest, proof JSON, and review-gate packet keep all product, diagnostics, mastery/sequencing, PV, Scale Gate 1, completion-language, and student/product-use flags false | Checker verifies false authority flags across wave and Scale proof | planned |
| Workflow agents get durable guidance | Active roadmap row and sprint result name the next logical expansion work without opening new claims | Lead review confirms no missing core requirement is carried as a non-blocking flag | planned |

## Quality Improvement Candidates

| Candidate | Disposition | Reason |
|---|---|---|
| Add a wave manifest plus CI-visible checker | include_now | This makes the rollout boundary actionable for future agents and ordinary workflow checks. |
| Add fresh screenshots | defer_named_follow_up | The refreshed Scale proof already contains the rendered screenshot bundle; this sprint verifies and cites it rather than recapturing unchanged output. |
| Create new `1.1.4` or `1.2` short-check/exit-ticket source data | defer_named_follow_up | New source authoring needs target-operation review and should be its own implementation sprint. |
| Mark Year 1 rollout complete or Scale Gate 1 closed | reject_scope_creep | The evidence is first-three only and explicitly not a Scale Gate 1 or student/product-use decision. |
| Mutate target-readiness flags or generated lesson output | reject_scope_creep | The sprint is validation/governance/reporting only. |

## Allowed paths

- `references/data/exercises/y1-golden-rollout-wave-1.json`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`
- `package.json`
- `.github/workflows/platform-ci.yml`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-*`
- `reports/json/y1-golden-rollout-wave-1-proof.json`
- `reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.*.json`
- Active roadmap rows that describe this bounded rollout-control sprint.

## Forbidden paths

- No `source-data/book-1/exit-ticket/*.json` edits.
- No generated lesson output edits in `../4veco-lessen`.
- No engine implementation, CSS, runtime JavaScript, route migration, or
  generated route behavior changes.
- No `references/machine/` or `references/external/` edits.
- No `references/authored/course-target-exercises.json` edits.
- No candidate storage writes.
- No diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV, Scale Gate 1, product-route adoption, broad product use,
  target-equivalent completion-language release, or student/product use.

## Inputs

- `references/data/exercise-surface-manifest.json`
- `reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json`
- `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-result.md`
- `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-route-inventory.md`
- `reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshot-manifest.md`
- `reports/sprints/SKILLMAP-OP-1-result.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

## Outputs

- `references/data/exercises/y1-golden-rollout-wave-1.json`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-baseline.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-quality-log.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-map.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-diff-summary.md`
- `reports/json/y1-golden-rollout-wave-1-proof.json`
- `reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.plan.json`
- `references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json`
- Lead-review and command-log artifacts.

## Operationalized sprint procedure

1. Write the plan and baseline, then get lead-review feedback before implementation.
2. Add the wave manifest and checker. The checker must verify the six first-three
   surfaces, Scale proof status, route-family proof, false authority flags,
   package/CI wiring, and absence of claimed source expansion.
3. Produce proof JSON, quality log, evidence map, result, diff summary, and
   REV-STD-1 packet JSON. Stop if a core requirement is missing.
4. Run the focused checker, currentness checker, authority-hygiene checker, Scale
   proof checker, sprint-bundle checks, report/roadmap/url/scope checks,
   platform tests, and platform/lesson diff hygiene.
5. Run lead review on the completed work, implement required corrections, and
   repeat review until the final lead verdict is `PASS` or `PASS WITH FLAGS`
   with no missing core requirement carried as a flag.
6. Route the PR with the PR Readiness Reviewer. Because this changes CI-visible
   governance/reporting, return for human review before merge.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md
npm.cmd run check:y1-golden-rollout-wave-1
npm.cmd run check:exercise-workflow-currentness
npm.cmd run check:exercise-authority-hygiene
npm.cmd run check:scale-proof-3p-product-path
node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/sprints/check-sprint-result.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-result.md
node build-scripts/sprints/check-lead-review-substance.js Y1-GOLDEN-ROLLOUT-WAVE-1
node build-scripts/sprints/check-sprint-command-log.js Y1-GOLDEN-ROLLOUT-WAVE-1
node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close includes machine proof that the wave claim is exactly
the six current first-three Golden surfaces, rendered workflow proof remains
present and clean, all downstream authority flags remain false, no
source/generated lesson output changed, the active roadmap row is updated, and
lead-review plus validator/test evidence has no blocking findings.

## Rollback plan

Before merge, abandon this branch or revert the branch commit. After merge,
revert the PR. No source-data restoration, generated-output regeneration,
engine rollback, or target-registry restoration should be required because the
sprint only changes validation, roadmap, and proof/reporting artifacts.

## Human review required

Human review is required before merge because the sprint adds a CI-visible
checker and roadmap/reporting governance around exercise rollout workflow
authority. Human review is not asked to close Scale Gate 1 or approve broader
student/product use.
