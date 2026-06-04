# Sprint SOURCE-RECONSTRUCT-2-ACTUAL-EXAM: Planning Review

## Reviewer

- Planning/review subagent: `019e917c-07e6-7be3-8607-536344720cd5`
- Review type: pre-implementation sprint plan check
- Date: 2026-06-04

## Evidence inspected

- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-baseline.md`
- `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.plan.json`
- `references/reference-team-roadmap.md`
- `reports/json/exam-source-authority1-contract.json`
- `reports/json/context-visual-std1-contract.json`
- `reports/sprints/CONTEXT-VISUAL-STD-1-visual-standard.md`
- `references/external/exams/vw-1022-a-25-1-o.pdf`
- `references/external/exams/vw-1022-a-25-1-c.pdf`

## Initial verdict

Verdict: REVISE before implementation.

The plan passed the deterministic plan and active-bundle validators, and the
local PDF evidence surface exists. The reviewer found one blocking plan gap:
the plan pushed rendered proof to later work, while `CONTEXT-VISUAL-STD-1`
requires source-reconstruction sprints to include rendered source-output parity
proof with desktop/mobile/dark screenshots.

## Required corrections

| Finding | Correction | Status |
|---|---|---|
| Source-output parity proof cannot be prose-only. | Added review-only rendered lab, screenshot manifest, desktop light screenshot, mobile light 390px screenshot, mobile dark 390px screenshot, and proof JSON as planned outputs. | Applied |
| Acceptance tests must include screenshot capture before custom checker. | Added `node build-scripts/sprints/capture-source-reconstruct2-screenshots.js` before `check-source-reconstruct2-actual-exam.js`. | Applied |
| Stop conditions must include rendered proof failure. | Baseline and procedure now stop if rendered proof cannot show semantic table, labels, captions, source refs, and mobile/dark states. | Applied |
| Generated output boundary must remain clear. | Plan states reconstruction artifacts are generated under `reports/` only; generated Book 1 lesson output remains forbidden. | Applied |

## Validator evidence

Passed before planning-review correction:

```bash
node build-scripts/sprints/run-sprint-command.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md
node build-scripts/sprints/run-sprint-command.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM -- node build-scripts/sprints/check-sprint-bundle.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM
```

## Final planning decision

Verdict: PASS after corrections.

The sprint may proceed to implementation of the reconstruction artifacts,
rendered proof capture, deterministic checker, and lead-review cycle. The main
agent must stop if PDF evidence, exact source values, rendered proof, or
protected/generated-output boundaries fail.
