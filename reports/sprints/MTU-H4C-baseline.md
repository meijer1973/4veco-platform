# Sprint MTU-H4C: Baseline

Date: 2026-05-30

## Plan reference

This baseline records the pre-execution state for
`reports/sprints/MTU-H4C-plan.md`.

## Authority baseline

- Source gate:
  `reports/review-gates/GATE-MTU-H4B-answer-form-cli-execution/gate-closure.json`.
- Gate status: `pass_with_conditions`.
- Reviewed remote commit: `f59c83a7067678aa3ff2c4bab4455ab9d90d72af`.
- Authorized next sprint: `MTU-H4C`.
- Direct execution from the H4B review packet: not authorized.
- Execution in this sprint: authorized only for reviewed `unit-add` commands
  for `A96`, `A97`, `A98`, `A99`, `A80`, and `A81`.

## Repository baseline

- Local HEAD before H4C planning: `c51ebfa048fc01e0b8cb8dc8d5dafd71f43fbaba`.
- `origin/main` before H4C planning:
  `c51ebfa048fc01e0b8cb8dc8d5dafd71f43fbaba`.
- Worktree status before H4C planning: clean except pre-existing untracked
  `knowledge/exit-ticket-game-1.1.1.zip`.

## Catalog baseline

- Live unit count before execution: 250.
- `A96`: absent.
- `A97`: absent.
- `A98`: absent.
- `A99`: absent.
- `A80`: absent.
- `A81`: absent.
- `A71`: absent and held.
- `A100`: absent and invalid under the current `^[A-L]\d\d$` ID pattern.

## Target-exercise baseline

- Target-exercise records: 54.
- Records with `question_type`: 0.
- Records with `answer_form`: 0.
- H4C must not add either field.

## Candidate-storage baseline

- `references/data/exam-ingestion/answer-skill-candidates.json`: absent.
- H4C must not create or write candidate storage.

## Data integrity notes

Protected reference data changes are authorized only for
`references/machine/micro-teaching-units.md` and
`references/machine/micro-teaching-units.json`, and only through
`build-scripts/references/unit-add.js` with the reviewed H4B specs. No hand
edits to `references/machine/` or `references/external/` are allowed.

No target-exercise field writes, candidate storage, candidate writes, generated
projection refresh as a source-mutation side effect, lesson output,
diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use are authorized.
