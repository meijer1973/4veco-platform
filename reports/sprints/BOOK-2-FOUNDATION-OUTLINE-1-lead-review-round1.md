# Lead Review Summary

Sprint: `BOOK-2-FOUNDATION-OUTLINE-1`

Round: lead review round 1

## Scope

- Artifact/task: Book 2 derived authority layer and currentness guardrail.
- Requested outcome: satisfy Issue #225 and route an exact payload to human
  review without integration.
- Reviewed repository: platform worktree based on
  `15bb80496916e3c07f5c957226b857cc689d9f43`.
- Reviewed state: pre-correction working tree; initial outline SHA-256
  `8a1599d70ea9495f9c2ef031476a3aa656ea2bfdf12e05a744c1e1e4fb55d627`.
- Human-authority trigger: required before outline approval and merge.
- Subsequent changes require re-review: yes.

## Review plan

| Review/test | Evidence | Status |
|---|---|---|
| Specification fulfilment | Issue #225 requirements against plan/audit/outline/workflows | revise |
| Teacher learning quality | Prior knowledge, progression, retrieval, misconception, holds | pass with correction |
| Economics precision | Formula/classification/welfare/target-boundary audit | revise |
| Curriculum sequencing | Book 1 → Book 2 → Book 3 dependencies | pass |
| Guardrail proof | Currentness checker and mutation suite | revise |
| Scope integrity | Git diff and lesson read-only boundary | pass at review point |

## Consolidated verdict

Verdict: `REVISE`

The architecture and 12-paragraph sequence are sound, but two core proof issues
blocked routing to human review in round 1.

## Core-requirement checklist

| Core requirement | Status | Round-1 evidence |
|---|---|---|
| Allowed audit disposition | met | `VALID_WITH_DERIVED_OUTLINE_REQUIRED` is evidence-backed. |
| Full prose/machine outline | met | All required sections and 12 rows exist. |
| Exact source/target pins | met | Metadata contains source and per-record hashes. |
| Preview/mastery boundary | met | Prose and semantic invariant are explicit. |
| Complete operation balance | revise | §2.2.1/§2.2.2 did not yet require an elastic numerical contrast although both target contexts are inelastic. |
| Six workflow pointers | met | Required surfaces point to the outline and foundation table. |
| Reusable mutation-tested checker | revise | Initial checker had a regex syntax defect; first mutation run also exposed pointer-test and approved-mode fixture defects. |
| Platform-only boundary | met | No lesson/target/protected-reference write. |
| Human decision still pending | met | Metadata status and owner hold are pending. |

## Blocking findings

1. `core_spec_failure` — operation balance across §§2.2.1–2.2.2 was incomplete.
   Both cinema and petrol contexts yield `|Ev|<1`; without an explicit
   `|Ev|>1` contrast, the outline did not fully operationalize both sides of the
   stated classification/revenue rule.
   - Blocks: human-review routing of the outline.
   - Does not block: the audit disposition or other chapter sequencing.
   - Proof to close: add an explicit elastic contrast requirement and a hold in
     prose/meta/checker, then pass teacher/economics rereview.
2. `core_spec_failure` — guardrail execution proof was initially invalid.
   - Blocks: claiming reusable currentness/mutation protection.
   - Does not block: outline content review.
   - Proof to close: repair checker syntax and test semantics; all required
     positive and negative mutations must pass.

## Specialist findings

- Teacher: progression and prior-knowledge boundaries are sound; add the
  missing elastic contrast before approval.
- Economics: marginal-interval and welfare conditions are correctly held;
  elasticity contrast is the only new outline-level correction.
- Sequencing: v5 order and Book 1/Book 3 dependencies pass.

## Test evidence

- Structural currentness passed after syntax repair.
- Initial mutation run: 26 passed, 6 failed because pointer mutations replaced
  only the first repeated marker and the approved fixture left empty hold arrays
  where the checker still required non-empty arrays.
- No final PASS may be recorded until the corrected suite is green.

## Student/rendered evidence

Not applicable. No student-facing or rendered artifact changed.

## Required next action

Apply both corrections, rerun specialist checks and all mutation tests, then
perform lead review round 2 against the corrected outline hash.
