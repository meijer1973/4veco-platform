# Sprint MTU-GENBLOCK-HARDEN-1: Generator-Blocked MTU Exposure Hardening

Generated: 2026-06-07

## Goal

Prove and harden that active A-domain MTUs without skill-tree generators
remain explicitly generator-blocked and cannot become student-facing
interactive, route, PV, diagnostic, mastery, or product-authority surfaces by
accident.

This sprint strengthens the existing RX.6 readiness boundary after later MTU
hardening added more blocked A-domain units. It does not implement missing
generators, does not expose blocked units to students, and does not convert
generator-blocked status into product authority.

## Context

RX.6 split generator-backed A-domain units from missing-generator A-domain
units. Since RX.6, later MTU hardening added answer-form and Solo q1-q3 units,
so the current readiness report now records 98 active A-domain units, 47
generator-backed interactive units, and 51 generator-blocked units.

The current source and deploy `SKILLS` exports are interactive-only, but the
shared skill-map route layer can render from `ROUTE_SKILLS`. `ROUTE_SKILLS` is
student-visible through route panels, so generator-blocked A-domain units must
not be available there as ordinary route rows. Non-A concept units may remain
display-only route concepts, but blocked A-domain units need explicit
non-interactive metadata only.

This sprint is a source/report/test hardening sprint. Generated lesson-output
or live route checks are out of scope unless a later sprint explicitly
authorizes them.

## Quality Standard

Quality floor: the sprint must satisfy the specification by proving every
current generator-blocked active A-domain MTU has an explicit block record,
no blocked A-domain unit appears in interactive source or deployed exports,
no blocked A-domain unit appears in student-visible route exports, and the
checker rejects a negative fixture where a blocked unit is marked interactive.
Rendered output and generated lesson-route screenshots are out of scope in
this sprint; student-facing protection proof is source/deploy route-boundary
evidence, checker evidence, Jest coverage, and explicit follow-up routing for
blocked units that matter to the next product route. Any omitted generated
output proof must be named as follow-up work rather than treated as complete.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Every blocked A-domain unit has an explicit block record. | `references/data/sprints/RX.6-generator-blocked-units.json` and readiness rows list each missing-generator active A-domain unit. | `build-skilltree-generator-readiness.js` rebuild plus checker count and row validation. | planned |
| No blocked unit appears in interactive exports. | Source `engines/skilltree/base-elements.js`, deploy `buildSkilltreeBundleData`, and readiness report show blocked units only in `GENERATOR_BLOCKED_SKILLS`. | Checker asserts source/deploy splits and zero `blocked_interactive_leak_count`; Jest covers source/deploy split. | planned |
| No blocked A-domain unit leaks into student-visible route exports. | Source and deploy `ROUTE_SKILLS` exclude generator-blocked A-domain rows while preserving non-A concept route rows. | Readiness report adds route leak counts; checker and Jest reject route leaks. | planned |
| Negative fixture catches an interactive leak. | Checker contains or consumes a deterministic negative fixture with a blocked unit marked interactive. | `check-skilltree-generator-readiness.js` fails that fixture during self-test and reports rejection. | planned |
| PV, lesson, diagnostic, mastery, and product surfaces remain unauthorized. | Readiness policy and block file carry explicit false authority flags and blocked downstream uses. | Checker validates policy flags and blocked-scope labels. | planned |
| First-three-paragraph route impact is explicit without silent wiring. | Result log classifies blocked units that matter for next product routes versus units that can remain blocked. | Result and verification review inspect the route-impact table and follow-up owners. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Exclude generator-blocked A-domain units from `ROUTE_SKILLS` while keeping non-A concept route rows. | include_now | Directly closes the route leak vector without implementing generators. |
| Add route-leak fields and policy flags to the readiness report/checker. | include_now | Makes the proof visible in the requested verification surface. |
| Add deterministic negative-fixture self-test to the checker. | include_now | Satisfies the hardening requirement that the checker fail on blocked interactive leakage. |
| Run generated Book 1 route screenshots. | defer_named_follow_up | Useful for future product proof, but this sprint explicitly limits generated-output checks. |
| Implement `GEN_A20`, `GEN_A45` through `GEN_A99`, or publish PV projections. | reject_scope_creep | The sprint is exposure hardening only and cannot add missing generators or product authority. |

## Allowed paths

- `reports/sprints/MTU-GENBLOCK-HARDEN-1-plan.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-baseline.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-planning-review.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-result.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-diff-summary.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-verification-review.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-assignment.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-round1.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-corrections.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-round2.md`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-command-log.jsonl`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-command-log.md`
- `references/data/sprints/MTU-GENBLOCK-HARDEN-1.plan.json`
- `references/data/sprints/MTU-GENBLOCK-HARDEN-1.result.json`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `reports/json/skilltree-generator-readiness.json`
- `reports/markdown/skilltree-generator-readiness.md`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/*` generated technical side-effect files
- `engines/skilltree/base-elements.js`
- `scripts/deploy.js`
- `build-scripts/references/build-skilltree-generator-readiness.js`
- `build-scripts/references/check-skilltree-generator-readiness.js`
- `engines/tests/skilltree-data.test.js`
- `engines/tests/skill-map-engine.test.js`
- `references/reference-team-roadmap.md`
- `reports/url-index.md`
- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `reports/internal-dashboard/*`

## Forbidden paths

- No hand edits to `references/machine/` or `references/external/`.
- No source-data writes.
- No lesson-target writes or generated Book 1 lesson output.
- No target-exercise registry mutation.
- No unit minting, unit deprecation, unit dependency mutation, or protected
  reference data mutation.
- No missing-generator implementation.
- No fake placeholder generators.
- No PV projection publication or PV machine promotion.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, Scale Gate 1, product-route adoption, product-wide use, or
  student/product authority.

## Inputs

- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `docs/sprints/RX.6-plan.md`
- `reports/sprints/RX.6-result.md`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `reports/json/skilltree-generator-readiness.json`
- `engines/skilltree/base-elements.js`
- `scripts/deploy.js`
- `build-scripts/references/build-skilltree-generator-readiness.js`
- `build-scripts/references/check-skilltree-generator-readiness.js`
- `engines/tests/skilltree-data.test.js`
- `engines/tests/skill-map-engine.test.js`
- `references/reference-team-roadmap.md`

## Outputs

- Hardened source and deploy base-elements route exports that exclude
  generator-blocked A-domain units from `ROUTE_SKILLS`.
- Updated readiness builder/checker proving interactive and route export
  guardrails, policy blocks, explicit block records, and negative-fixture
  rejection.
- Regenerated readiness JSON/Markdown reports and RX.6 block file.
- Sprint records:
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-plan.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-baseline.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-planning-review.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-result.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-diff-summary.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-verification-review.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-assignment.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-round1.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-corrections.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-lead-review-round2.md`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-command-log.jsonl`
  - `reports/sprints/MTU-GENBLOCK-HARDEN-1-command-log.md`
  - `references/data/sprints/MTU-GENBLOCK-HARDEN-1.plan.json`
  - `references/data/sprints/MTU-GENBLOCK-HARDEN-1.result.json`

## Operationalized sprint procedure

1. Record this plan, baseline, planning review, plan metadata, and roadmap row
   before implementation edits. Stop if the plan does not name the route leak
   vector, generated-output boundary, or negative-fixture proof.
2. Inspect current readiness/block/source/deploy/test state and document
   baseline counts, stale historical RX.6 result numbers, and the `ROUTE_SKILLS`
   exposure risk.
3. Harden `engines/skilltree/base-elements.js` and `scripts/deploy.js` so
   generator-blocked A-domain units remain out of `SKILLS` and out of
   student-visible `ROUTE_SKILLS`, while non-A concept route rows remain
   available.
4. Extend `build-skilltree-generator-readiness.js` and
   `check-skilltree-generator-readiness.js` so the report and checker validate
   explicit block records, source/deploy interactive exports, source/deploy
   route exports, blocked downstream authority flags, and a deterministic
   negative fixture.
5. Add or update Jest coverage for route export filtering and negative
   source/deploy leak behavior. Stop if the tests can pass while a blocked
   A-domain row is visible in a student route catalog.
6. Rebuild readiness outputs and run the requested verification surface.
   Generated-output or live route checks remain omitted by design unless this
   plan is explicitly amended.
7. Produce result, diff summary, verification review, and structural
   lead-review round 1. Apply corrections or record no corrections, then run
   lead-review round 2 before closure.
8. Refresh repository maps and indexes, run sprint bundle checks, fetch/prune
   origin, commit, push, and inspect `platform-ci / validate-platform`.

Stop conditions:

- Stop if the work would require protected reference mutation, source-data
  writes, lesson-output writes, fake generators, or PV publication.
- Stop if a blocked A-domain unit is needed for first-three-paragraph route
  exposure and no reviewed implementation plan or explicit non-interactive
  handling proposal is created.
- Stop if the checker does not fail the negative interactive-leak fixture.
- Stop if lead review returns REVISE, FAIL, or PAUSE until corrections are
  complete.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-GENBLOCK-HARDEN-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-GENBLOCK-HARDEN-1
node build-scripts/references/build-skilltree-generator-readiness.js
node build-scripts/references/check-skilltree-generator-readiness.js
npx.cmd jest engines/tests/skilltree-data.test.js engines/tests/skill-map-engine.test.js --runInBand
npm.cmd run check:platform
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/check-sprint-command-log.js MTU-GENBLOCK-HARDEN-1
node build-scripts/sprints/check-lead-review-substance.js MTU-GENBLOCK-HARDEN-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/MTU-GENBLOCK-HARDEN-1-result.md
node build-scripts/sprints/check-sprint-bundle.js MTU-GENBLOCK-HARDEN-1 --complete
git diff --check
```

## Proof Required to Close

Proof required to close: the readiness report and RX.6 block file list every
current missing-generator active A-domain unit as blocked; source and deploy
interactive exports have zero blocked rows; source and deploy route exports
have zero blocked A-domain rows; the checker reports that its negative fixture
was rejected; Jest and `npm.cmd run check:platform` pass; result evidence
classifies blocked units needed for next product routes versus units that can
remain blocked; lead-review round 2 returns PASS or PASS WITH FLAGS; and the
diff shows no protected reference mutation, source-data write, lesson-output
write, generator implementation, PV projection, or product-authority expansion.

## Rollback plan

Revert the sprint commit. That removes the route export hardening, checker
extensions, tests, regenerated readiness outputs, map/index refreshes, and
sprint evidence. Do not hand-edit `references/machine/`,
`references/external/`, source-data, or lesson output during rollback.

## Human review required

No new human review gate is required for this hardening sprint because it
reduces accidental exposure and authorizes no product use. Structural lead
review is required before closure. Human review remains required before any
blocked unit becomes student-facing, before PV projection is published, before
diagnostic/adaptive/mastery/summative use, or before product-route adoption.
