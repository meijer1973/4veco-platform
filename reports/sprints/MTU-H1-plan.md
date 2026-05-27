# Sprint MTU-H1: Operation Benchmark From Exam Questions

## Goal

Create the first MTU-hardening operation benchmark from the 2026 VWO economie
Solo q1-q3 review and existing exam-audit evidence, without mutating the live
MTU registry.

The sprint must turn the analysis into structured evidence that separates:

- content MTUs;
- calculation, graph, source, and reasoning operation MTUs;
- answer-form MTUs;
- misconception targets;
- missing-unit flags;
- over-trigger flags.

MTU-H1 is evidence-gathering and classification only. It must not add,
update, split, merge, deprecate, or otherwise mutate `references/machine/*`.

## Context

The Solo q1-q3 review exposed systemic MTU-quality problems:

- q1 needs verbal external-cost explanation and a "leg uit met voorbeeld"
  answer form, but current F16 is too marginal-curve/formal for the item;
- q2 needs reverse fixed-cost-from-profit calculation, pointwise TO, constant
  variable-cost TVK, scale-factor handling, and bereken-answer form;
- q3 needs GO-to-MO, MO equals given MK, new price after Q*, percentage price
  change, and pass-through/incidence distinction without over-triggering MK
  derivation or a calculus-only MO route;
- incidence/pass-through is a recurring standard skill and D07 is too narrow
  if it remains only a tax-framed unit;
- question verbs such as `berekenen`, `leg uit`, `analyseer`, and
  `arceer/grafisch` must be treated as teachable answer forms rather than
  prompt metadata only.

Current reference architecture already supports the direction through EX-0 to
EX-7: exam ingestion separates prompt, source material, correction model,
answer construction, operations, gaps, and lesson handoff. EX-7 added
validator/dry-run CLI infrastructure without candidate storage or writes.
MTU-H1 should now provide a benchmark artifact that later H2-H6 sprints can
review before any governed MTU or answer-form mutation.

## Quality Standard

The expected outcome is a specification-grade benchmark, not a loose note or
wishlist. The benchmark must preserve the user's Solo q1-q3 findings as
checkable evidence and must make every later MTU-hardening suggestion traceable
to an answer-model operation, an answer form, a misconception target, or an
over-trigger defect.

The quality floor is that the sprint produces no rendered output and no
student-facing output, but still applies the same proof discipline used for
student-facing work: evidence must be structured, validator-backed, and explicit
about follow-up authority. The benchmark must not imply registry writes are
allowed, must not treat user-provided exam analysis as refreshed external-source
truth, and must not hide unknowns behind generic "needs review" language.

Closure proof must show that the specification is fulfilled, protected surfaces
remain untouched, all q1-q3 records distinguish content, operation, answer-form,
and misconception layers, and named follow-up sprints carry every deferred
mutation or product question.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Solo q1-q3 are recorded as canonical MTU-hardening seed cases | `reports/mtu-hardening/benchmark-sample-v1.json` and `solo-q1-q3-operation-map.md` | Benchmark checker confirms three Solo records and required fields | planned |
| Content, operation, answer-form, misconception, missing-unit, and over-trigger layers are separated | JSON fields and markdown tables per question | Checker rejects missing answer-form, missing-unit, or over-trigger fields | planned |
| Registry mutation remains blocked | Authority flags in JSON, forbidden paths in logs, no `references/machine/` edits | Sprint bundle, git diff, and benchmark checker evidence | planned |
| Later H2-H6 work is routed without direct mutation | Failure taxonomy and roadmap rows name bounded follow-up lanes | Roadmap version/index check and sprint result | planned |
| Benchmark has a regression path | Failure taxonomy defines defect classes and future sample requirements | Checker confirms stratified sample slots and quality-log entries | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Encode q1-q3 as structured benchmark records with a read-only checker | `include_now` | This is the core MTU-H1 proof and keeps the findings reusable. |
| Add future stratified sample slots for `berekenen`, `leg_uit`, `analyseer`, `arceer_grafisch`, `bron`, and `classificatie` | `include_now` | It prevents the sprint from becoming a three-question one-off. |
| Mint or refactor MTUs for Solo q1-q3 immediately | `defer_named_follow_up` | Belongs to MTU-H2/H3/H4 after human review and CLI-governed mutation scope. |
| Build student-facing exit-ticket coverage from these units now | `reject_scope_creep` | MTU-H6 depends on hardened registry decisions and cannot precede them. |

## Allowed paths

- `reports/sprints/MTU-H1-plan.md`
- `references/data/sprints/MTU-H1.plan.json`
- `reports/sprints/MTU-H1-baseline.md`
- `reports/sprints/MTU-H1-planning-review.md`
- `reports/mtu-hardening/benchmark-sample-v1.json`
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`
- `reports/mtu-hardening/failure-taxonomy-v1.md`
- `build-scripts/references/check-mtu-hardening-benchmark.js`
- `reports/sprints/MTU-H1-result.md`
- `reports/sprints/MTU-H1-diff-summary.md`
- `references/data/sprints/MTU-H1.result.json`
- roadmap/version-index updates and normal generated report/index refreshes

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- protected reference mutation
- external-source mutation
- machine-reference mutation
- unit minting
- operation-registry mutation
- answer-skill mutation
- candidate-storage creation or candidate writes
- q19 source-annex or graph-object extraction execution
- lesson-output mutation
- target-exercise promotion
- CP-6 closure or Year-1 closure
- diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing output authorization

## Inputs

- User-provided Solo q1-q3 2026 VWO economie analysis in the sprint request.
- `references/reference-team-roadmap.md`
- `references/machine/micro-teaching-units.md` as read-only context only.
- `references/machine/micro-teaching-units.json` as read-only context only.
- `references/schemas/exam-question.schema.json`
- `references/schemas/exam-ingestion.schema.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `references/data/exam-ingestion/validator-cli-implementation-plan.md`
- `build-scripts/references/check-ex7-dry-run-cli-implementation.js`

## Outputs

- `reports/mtu-hardening/benchmark-sample-v1.json`: structured seed benchmark
  with Solo q1-q3 plus stratified benchmark slots for later samples.
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`: human-readable mapping
  from official correction-model operations to content, operation,
  answer-form, misconception, missing-unit, and over-trigger evidence.
- `reports/mtu-hardening/failure-taxonomy-v1.md`: MTU-hardening defect
  taxonomy and quality-log entries.
- `build-scripts/references/check-mtu-hardening-benchmark.js`: read-only
  validator for the benchmark files.
- Sprint result, diff summary, and result JSON.
- Roadmap update that routes later MTU-H2 through MTU-H6 work without
  authorizing mutation.

Generated output statement: MTU-H1 generates reference planning reports and a
read-only validator only. It generates no lesson output, no candidate storage,
and no machine-reference mutation.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, planning review, and active roadmap
   row. Stop if the plan does not explicitly forbid `references/machine/`
   mutation and lesson-output mutation.
2. Build `benchmark-sample-v1.json` from the Solo q1-q3 analysis. Each record
   must include question id, prompt excerpt, correction-model operations,
   answer type, content MTUs, calculation/graph/source operation MTUs,
   answer-form MTUs, misconception targets, missing-unit flags, over-trigger
   flags, and mutation authority false.
3. Write the human-readable q1-q3 operation map. Stop if q1 is mapped as full
   formal externality welfare-loss machinery, q2 requires a full TO-function
   construction, or q3 requires MK derivation/calculus when the official
   operation does not.
4. Write the failure taxonomy and quality log. It must cover the Solo q1-q3
   defect classes plus answer-form, incidence/pass-through, scale-factor, and
   regression-validator gaps.
5. Add a read-only checker that validates the JSON shape, confirms mutation
   authority is false, confirms all q1-q3 records have answer-form mappings,
   confirms the known over-trigger flags are present, and confirms later
   stratified sample slots exist.
6. Run sprint and benchmark validators plus report/index refresh checks. Stop
   if any checker fails or if any generated artifact implies registry mutation
   is authorized.
7. Close MTU-H1 with result/diff logs and route the next action to MTU-H2
   canonical micro-case review, not direct mutation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H1-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H1
node build-scripts/references/check-mtu-hardening-benchmark.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test -- --runInBand
node build-scripts/sprints/check-sprint-bundle.js MTU-H1 --complete
```

## Proof Required to Close

Closure requires proof that `check-sprint-plan`, `check-sprint-bundle`,
`check-mtu-hardening-benchmark`, report/index validators, roadmap-version
checks, and Jest all pass or are explicitly skipped with a bounded reason. The
result log must include the validation evidence, confirm no protected reference
data changed, and name MTU-H2 as the next review/mutation-planning lane rather
than authorizing direct registry edits.

The sprint may close only after validator and test proof is recorded in the
result JSON and markdown result log.

## Rollback plan

Revert the MTU-H1 commit. Rollback removes only the benchmark reports, checker,
sprint logs, roadmap/index updates, and generated report/index refreshes. It
does not touch `references/machine/`, `references/external/`, lesson output,
or the pre-existing untracked exit-ticket draft zip.

## Human review required

No separate human-review gate is required for MTU-H1 because it is a
non-mutating benchmark and classification sprint. Human review is required
before MTU-H2 or later sprints mutate the live MTU registry, answer-form units,
or incidence/pass-through family through CLI-governed workflows.
