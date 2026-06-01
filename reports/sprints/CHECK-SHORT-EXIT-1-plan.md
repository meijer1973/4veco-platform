# Sprint CHECK-SHORT-EXIT-1: Paragraph Check Surface Inventory And Contract

Generated: 2026-06-01

## Goal

Audit the current `1.1.1`, `1.1.2`, and `1.1.3` check surfaces and define
their product-contract status before any follow-up implementation sprint. The
result must clearly distinguish advisory short checks from target-equivalent
exit tickets.

## Context

`SYNC-PRODUCT-1` inserted the Product Proof Track before Scale Gate 1. The
first follow-up is this audit/contract sprint. Current known state:

- `1.1.1` has a generated `Korte check` and source data, but it is advisory
  only and not target-readiness evidence.
- `1.1.2` has the reviewed target-equivalent exit ticket and local completion
  copy for this paragraph only.
- `1.1.3` has graph/table practice routes but no target-equivalent exit-ticket
  source or generated exit-ticket page.

This sprint does not repair or generate surfaces. It records the current state
and the missing work so `CHECK-SHORT-EXIT-2` cannot silently assume product
completion.

## Quality Standard

Quality floor: the inventory must satisfy the product-end-state specification
within this audit-only scope. It must inspect real source data and generated
Book 1 output, name each paragraph's current check status, preserve the
short-check versus target-equivalent exit-ticket distinction, and identify
missing work without authorizing implementation. Passing tests alone is not
enough; the result must be usable as a student-product contract for later
sprints. The proof standard for this sprint is traceable inventory evidence,
deterministic checker coverage, and lead-review confirmation. Rendered output
may be inspected as evidence, but no generated output or student-facing source
is changed. Any omitted product requirement must be listed as a follow-up or
blocker.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Audit `1.1.1`-`1.1.3` check surfaces. | Inventory rows for all three paragraphs. | Checker verifies all paragraph rows and statuses. | planned |
| Distinguish short/advisory check from target-equivalent exit ticket. | Status columns for short check, exit ticket, target-readiness evidence, completion language, and hints. | Lead review checks no advisory surface is promoted by wording. | planned |
| Preserve no-implementation boundary. | Git-status guard for source, engines, protected references, and generated Book 1 output. | Checker and lead review. | planned |
| Define missing work for later sprints. | Inventory and result list blockers/follow-ups per paragraph. | Lead review verifies statuses are actionable. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add a deterministic JSON inventory and checker. | include_now | Needed so future implementation cannot reinterpret prose-only audit findings. |
| Inspect live rendered browser screenshots. | defer_named_follow_up | This audit may inspect generated HTML paths, but `SCALE-PROOF-3P` owns rendered student-path proof. |
| Repair missing short checks or exit tickets while auditing. | reject_scope_creep | Implementation belongs to later Product Proof Track sprints. |

## Allowed paths

- `reports/sprints/CHECK-SHORT-EXIT-1-plan.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-baseline.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-planning-review.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-inventory.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-result.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-diff-summary.md`
- lead-review assignment, round-1, corrections, and round-2 logs
- `reports/json/check-short-exit-inventory.json`
- `references/data/sprints/CHECK-SHORT-EXIT-1.plan.json`
- `references/data/sprints/CHECK-SHORT-EXIT-1.result.json`
- `build-scripts/sprints/check-check-short-exit1-inventory.js`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository-map, URL-index, and dashboard artifacts

## Forbidden paths

- No generated lesson output.
- No engine implementation.
- No source exit-ticket data writes.
- No reasoning CSV writes.
- No protected reference mutation under `references/machine/` or
  `references/external/`.
- No target-exercise registry field writes.
- No candidate storage creation or candidate writes.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  product-wide use.
- Do not import, stage, move, or edit `knowledge/exit-ticket-game-1.1.1.zip`.

## Inputs

- `source-data/book-1/exit-ticket/1.1.1.json`
- `source-data/book-1/exit-ticket/1.1.2.json`
- absence/presence check for `source-data/book-1/exit-ticket/1.1.3.json`
- `references/authored/course-target-exercises.json` as read-only context
- generated Book 1 paragraph landing and exit-ticket HTML as read-only evidence
- `reports/sprints/L1.7B-Q2-operation-chain.md`
- `reports/sprints/L1.7B-Q2-D31-STRUCT-result.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

## Outputs

- `reports/sprints/CHECK-SHORT-EXIT-1-inventory.md`
- `reports/json/check-short-exit-inventory.json`
- `build-scripts/sprints/check-check-short-exit1-inventory.js`
- sprint plan, baseline, planning review, lead-review records, result, diff
  summary, and result metadata
- platform and lesson roadmap status updates for `CHECK-SHORT-EXIT-1`

## Operationalized sprint procedure

1. Record the baseline from source exit-ticket data, target-exercise context,
   generated landing pages, and generated exit-ticket pages.
2. Run planning review against this plan before writing the inventory.
3. Build the inventory matrix for `1.1.1`, `1.1.2`, and `1.1.3`.
4. Emit structured JSON with the same statuses and missing-work fields.
5. Add a checker that verifies inventory/schema consistency and forbidden
   surface cleanliness.
6. Run validation and lead-review round 1.
7. Apply corrections if needed, then run lead-review round 2.
8. Commit and push platform evidence. No lesson repo commit is expected unless
   a roadmap-only lesson-side correction becomes necessary.

Decision points:

- If a paragraph has a generated check surface but no source contract, record
  it as a blocker instead of inferring approval.
- If a check uses advisory hints or feedback, classify it as short-check
  behavior unless target-equivalent source and gate evidence prove otherwise.
- If a target-equivalent exit ticket exists, verify operation-chain evidence,
  task forms, target-readiness status, and completion-language status before
  marking it approved.

Stop conditions:

- Stop if the audit would require editing source exit-ticket data, generated
  lesson output, engines, target-exercise records, or protected references.
- Stop if any paragraph is promoted from advisory to target-equivalent by prose
  only.
- Stop if the checker cannot prove that forbidden implementation/source
  surfaces are unchanged.

Review and validator details:

- Planning review must pass before the inventory is treated as sprint output.
- `build-scripts/sprints/check-check-short-exit1-inventory.js` must validate
  the markdown inventory, JSON inventory, source/read-only evidence, and
  forbidden path state.
- Lead-review round 2 must return PASS or PASS WITH FLAGS before closure.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECK-SHORT-EXIT-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js CHECK-SHORT-EXIT-1
node build-scripts/sprints/check-check-short-exit1-inventory.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/CHECK-SHORT-EXIT-1-result.md
node build-scripts/sprints/check-sprint-bundle.js CHECK-SHORT-EXIT-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: `1.1.1`, `1.1.2`, and `1.1.3` each have a named
short-check status, exit-ticket status, landing visibility status, hint status,
task-type status, target-readiness status, completion-language status, and
missing-work list; the checker passes; lead-review round 2 returns PASS or
PASS WITH FLAGS; and no forbidden product/source/generated-output changes are
present.

## Rollback plan

Before commit, remove only the CHECK-SHORT-EXIT-1 report, checker, metadata,
roadmap/index, and dashboard changes. After commit, revert the sprint commit.
Do not revert previous sprint records, source exit-ticket data, generated
Book 1 output, protected references, or unrelated user work.

## Human review required

No human review gate is required for this inventory sprint. Future
implementation and three-paragraph product proof remain gated by later Product
Proof Track sprints.
