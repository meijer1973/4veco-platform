# Sprint LEAD-REVIEW-2: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/LEAD-REVIEW-2-plan.md`

## Current state

LEAD-REVIEW-1 made lead review structural in the normal validation path. The
current checker requires new sprints created on or after `2026-05-31` to carry
lead review or an exemption, and future human-review sprints must set
`lead_review_phase: "before_human_gate"`.

The remaining baseline risks are:

- a new sprint could be backdated before `2026-05-31`;
- a human-review sprint could try to use an exemption instead of pre-gate lead
  review;
- lead-review reports are checked mostly by path presence and final verdict
  metadata;
- PASS WITH FLAGS can close without structured flag disposition.

## Existing compatibility requirement

Previously closed bundles must remain inspectable. Existing pre-policy bundles
that do not carry lead review need an explicit grandfather file so the stricter
validator does not rely on editable `created` dates.

## Data integrity notes

No protected reference data is needed for this repair. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` remain forbidden.

No generated lesson output under `../4veco-lessen/Boek *` is in scope. This
sprint repairs process validation only.

## Stop conditions

- Stop if the stricter validator would require protected reference mutation.
- Stop if the stricter validator would require generated lesson output edits.
- Stop if stricter validation invalidates the explicit MTU human-gate
  exclusion from LEAD-REVIEW-1.
- Stop if LEAD-REVIEW-2 cannot prove the negative fixture cases.
