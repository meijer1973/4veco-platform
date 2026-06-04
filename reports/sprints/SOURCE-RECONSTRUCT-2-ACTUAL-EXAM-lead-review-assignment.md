# Sprint SOURCE-RECONSTRUCT-2-ACTUAL-EXAM: Lead Review Assignment

## Assignment

Sprint: `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`

Lead reviewer agent: Gibbs (`019e9189-1733-7de0-a12f-410d026e4aef`)

Scope: review the actual-exam source reconstruction bundle for the authorized
external-primary item `vw-1022-a-25-1-o:opgave-1:question-3`. The review must
judge source-output parity, official PDF evidence, rendered proof, answer
leakage, no copied-image dependency, and boundary discipline.

## Evidence To Inspect

- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-baseline.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-planning-review.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-normalized-source.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-source-map.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-visual-fidelity-notes.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-reviewer-comparison.md`
- `reports/json/source-reconstruct2-actual-exam.json`
- `reports/json/source-reconstruct2-actual-exam-proof.json`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshots/desktop-light.png`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshots/mobile-light.png`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshots/mobile-dark.png`
- `build-scripts/sprints/capture-source-reconstruct2-screenshots.js`
- `build-scripts/sprints/check-source-reconstruct2-actual-exam.js`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-command-log.jsonl`

## Required Review Questions

1. Does the reconstruction match the source authority contract and cite only
   the authorized exam item/source material?
2. Does the checker verify the official prompt and correction PDFs directly?
3. Does the semantic table preserve values, labels, units, and row order?
4. Does the rendered proof include desktop light, mobile light 390px, and
   mobile dark 390px screenshots with readable source blocks?
5. Does the rendered lab avoid answer-threshold leakage and copied-image
   shortcuts?
6. Are protected references, source-data, and Book 1 generated output unchanged?
7. Are omitted requirements named as follow-up work rather than claimed done?

## Stop Conditions

Stop with REVISE, FAIL, or PAUSE if any required output file is missing, the
PDF evidence cannot be tied to the official prompt/correction files, values or
units drift from the source table, the rendered proof leaks the answer amount,
the table depends on a copied image, protected paths changed, or the bundle
claims task transformation/product adoption.

## Expected Output

Return a `# Lead Review Summary` using the strict sprint format, with
`Round: lead review round 1`, command-log evidence, blocking findings, flags,
ownership, and one concrete next action.
