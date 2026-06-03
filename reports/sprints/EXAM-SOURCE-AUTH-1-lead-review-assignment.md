# Lead Review Assignment: EXAM-SOURCE-AUTH-1

Generated: 2026-06-03

## Scope

Lead reviewer must inspect the exam-source-authority sprint before closure.
The review scope is limited to the authority contract, checker, source-authority
report, sprint artifacts, command-log evidence, and boundary claims.

## Evidence to inspect

- `reports/sprints/EXAM-SOURCE-AUTH-1-plan.md`
- `reports/sprints/EXAM-SOURCE-AUTH-1-baseline.md`
- `reports/sprints/EXAM-SOURCE-AUTH-1-planning-review.md`
- `references/data/sprints/EXAM-SOURCE-AUTH-1.plan.json`
- `reports/json/exam-source-authority1-contract.json`
- `reports/sprints/EXAM-SOURCE-AUTH-1-source-authority.md`
- `build-scripts/sprints/check-exam-source-authority1.js`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/external/exam-questions.json`
- `references/external/exams/vw-1022-a-25-1-o.pdf`
- `references/external/exams/vw-1022-a-25-1-c.pdf`
- `reports/sprints/EXAM-SOURCE-AUTH-1-command-log.jsonl`

## Review questions

- Does the contract require `sourceAuthority.kind: external_primary`?
- Does it cite the official exam item ID, overlay path, prompt PDF, correction
  PDF, and source material ID?
- Does the checker verify the selected overlay item is table-only with exactly
  one table, zero figures, and zero graphs?
- Do contract source values match the overlay Zoohee table?
- Do answer-model references point to the correction PDF and include the EUR
  649 threshold evidence?
- Do negative fixtures reject `official-style`, `exam-style`,
  `local review data`, `local official-style source`, and
  `reconstructed local source`?
- Are reconstruction, runtime/context rendering, task transformation,
  protected reference mutation, source-data mutation, generated lesson output,
  product-route adoption, target-equivalent proof, and Scale Gate authority
  excluded?

## Reviewer

Lead reviewer: subagent structural lead review for exam source authority.

## Required output

Round 1 must return PASS, PASS WITH FLAGS, REVISE, FAIL, or PAUSE with concrete
findings. Round 2 must recheck the corrected artifacts before closure.
