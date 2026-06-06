# CHECKSURFACE-EXCELLENCE-AUDIT-3P Audit Plan

Generated: 2026-06-06

## Status

Planned after `CHECKSURFACE-EXCELLENCE-REDESIGN-1`.

## Goal

Audit the first three paragraphs across both check surfaces so the renewed
gate can judge product quality, not only route existence.

## Authorized Scope

This sprint may:

- produce a first-three-paragraph matrix comparing short check and exit ticket
  purpose, action, feedback, independence, and authority;
- aggregate refreshed proof JSON and screenshots;
- record lead-review and verification artifacts;
- update roadmap status to point to renewed excellent-gate packet
  preparation.

This sprint may not:

- materially redesign the surfaces after the redesign sprint without a plan
  update;
- enable new completion language;
- send or close the human-review gate;
- authorize diagnostics, mastery/sequencing, PV, Scale Gate 1, or
  student/product use.

## Quality Floor

The audit must make differences visible enough for a reviewer to detect weak
surface design:

1. every `1.1.1`-`1.1.3` short check and exit ticket has a stated purpose;
2. every surface names the student action and target skill;
3. the short check/exit ticket pair is not a duplicate;
4. no surface gives away the answer or procedure before the attempt;
5. feedback and next action are visible;
6. authority claims are explicit and bounded;
7. graph/table proof includes interactive state, not only screenshots.

## Specification Requirements Fulfilled

- Product end-state: first-three paragraph proof must be coherent, visible,
  and student-route based.
- Companion core: technical QA cannot replace student-experience review.
- Human-review proof: interactive surfaces need playable/reproducible proof,
  state evidence, screenshots, and a checker.

## Evidence Needed

- `reports/sprints/CHECKSURFACE-EXCELLENCE-AUDIT-3P-matrix.md`
- `reports/json/checksurface-excellence-audit-3p-proof.json`
- checker or policy-regression proof that the matrix is complete
- refreshed screenshot/proof references
- verification review and lead-review cycle

## Procedure

1. Read refreshed source, generated output, and proof JSON.
2. Build the six-surface matrix for `1.1.1`, `1.1.2`, and `1.1.3`.
3. Compare short check versus exit ticket per paragraph.
4. Record proof for independence, no answer-giveaway, feedback, next action,
   and authority.
5. Run the policy/regression checker and prior checkers.
6. Record verification and lead-review round 1/round 2.
7. Update roadmap next action.

## Acceptance Tests

```text
node build-scripts/sprints/check-checksurface-policy-regression1.js
node build-scripts/sprints/check-check-short-exit2.js
node build-scripts/sprints/check-check-route-copy1.js
node build-scripts/sprints/check-graph-check-ux1.js
node build-scripts/sprints/check-graph-exit-ux1.js
node build-scripts/sprints/check-visual-qa-harden2.js
node build-scripts/reports/validate-report-json.js
```

## Stop Conditions

Stop if:

- the matrix cannot explain why a surface is useful for a student;
- any surface has unclear authority;
- the matrix uses old stale proof JSON after source/output changes;
- reviewer evidence is local-only when a human-review packet is being prepared.

## Review Gate

Lead review judges audit completeness before the renewed human-review packet.

## Higher-Quality Improvements In Scope

- Include concise "why now better" notes that connect directly to human
  feedback.

## Omitted Follow-Up Work

- Human packet assembly and remote publication belong to
  `CHECKSURFACE-GATE-RETRY-EXCELLENT-1`.
