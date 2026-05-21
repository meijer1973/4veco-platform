# Sprint CP.6f: Planning Review

Generated: 2026-05-21

Verdict: PASS

## Scope Check

CP.6f is correctly scoped as a focused, non-mutating references-side recheck of the lesson-team L-CP6E remediation. The plan reads live lesson evidence and L-CP6E archive evidence, then records whether the `1.1.3` Part A figure-numbering blocker is cleared.

The plan does not authorize protected reference mutation, lesson-output mutation, lesson review/quality-ref hand patching, target-exercise promotion, placeholder finalization, unit minting, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or student-facing output.

## Artifact Check

Required pre-execution artifacts are present:

- `reports/sprints/CP.6f-plan.md`
- `references/data/sprints/CP.6f.plan.json`
- `reports/sprints/CP.6f-baseline.md`
- `build-scripts/references/build-cp6f-113-part-a-recheck.js`
- `build-scripts/review-gates/check-cp6f-113-part-a-recheck.js`

The plan defines generated outputs, decision states, validators, rollback route, stop conditions, and the lead-review cycle.

## Deterministic Checks

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6f-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6f
```

## Planning Notes

The builder is read-only against `../4veco-lessen` and discovers the live Part A markdown, HTML, and PDF files by kind and extension instead of relying on brittle punctuation in generated filenames. The PDF check uses `pdftotext`; if PDF extraction fails, the sprint blocks as `blocked_no_evidence`.

Proceed with the focused CP.6f recheck and stop if the live figure order, review evidence, quality-ref evidence, or L-CP6E archive evidence contradicts the handoff.
