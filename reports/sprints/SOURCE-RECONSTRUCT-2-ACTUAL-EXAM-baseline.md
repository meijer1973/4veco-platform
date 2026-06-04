# Sprint SOURCE-RECONSTRUCT-2-ACTUAL-EXAM: Baseline

## Plan reference

- Plan: `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md`
- Plan data: `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.plan.json`
- Roadmap row: `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`

## Baseline state

- `EXAM-SOURCE-AUTH-1` is complete and produced the source-authority contract
  at `reports/json/exam-source-authority1-contract.json`.
- `TASK-CONTEXT-SPEC-1` is complete and produced the context block contract at
  `reports/json/task-context-spec1-contract.json`.
- `TASK-CONTEXT-RUNTIME-1` is complete and produced runtime proof at
  `reports/json/task-context-runtime1-proof.json`.
- `CONTEXT-VISUAL-STD-1` is complete and produced the visual standard contract
  at `reports/json/context-visual-std1-contract.json`.
- `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM` is open in both
  `references/reference-team-roadmap.md` and
  `../4veco-lessen/lessen-team-roadmap.md`.
- The local official prompt and correction PDFs exist under
  `references/external/exams/`, and `pdftotext` is available for read-only
  extraction evidence.

## Data integrity notes

- Protected reference data under `references/machine/` and `references/external/`
  is out of scope and must remain unchanged.
- Source-data writes are out of scope.
- Generated lesson output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod` is out of scope.
- This sprint may add reconstruction evidence under `reports/`, a checker under
  `build-scripts/sprints/`, sprint metadata under `references/data/sprints/`,
  and roadmap/map/index/dashboard updates required for closure.

## Initial stop conditions

- Stop before reconstruction if the planning review rejects the plan or finds
  missing PDF evidence, source-output parity checks, output files, or boundary
  declarations.
- Stop if the selected prompt, Zoohee table, exact table values, correction
  threshold, or correction-model steps cannot be verified from the local
  official PDFs.
- Stop if rendered proof cannot show the reconstructed semantic table, labels,
  captions, source refs, desktop light state, mobile light 390px state, and
  mobile dark 390px state without source-output parity gaps.
- Stop if reconstruction would require editing protected references,
  source-data, generated Book 1 output, task transformation files, target
  registries, unit registries, PV machinery, diagnostics, mastery, Scale Gate
  authority, or student/product surfaces.
