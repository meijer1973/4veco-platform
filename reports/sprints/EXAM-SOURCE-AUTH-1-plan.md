# Sprint EXAM-SOURCE-AUTH-1: Exam Source Authority Contract

Generated: 2026-06-03

## Goal

Define and validate what counts as real exam evidence before any actual exam
source reconstruction, task transformation, or human ingestion gate work
continues.

This sprint creates an exam-source-authority contract for the single selected
item `vw-1022-a-25-1-o:opgave-1:question-3`. It must prove that later work
can only claim exam evidence when it carries an external-primary source
authority object tied to the official prompt PDF, official correction PDF,
overlay record, source material ID, extracted source values, and answer-model
references.

It does not reconstruct sources, render task-shell context, transform the exam
item into tasks, generate lesson output, mutate external or machine
references, adopt product routes, claim target-equivalent proof, or authorize
diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate 1, or
student/product use.

## Context

`SYNC-ROADMAP-EXAM-REPAIR-1` closed immediately before this sprint and made
`EXAM-SOURCE-AUTH-1` the next required repair sprint.

The selected item is:

- `exam_item_id`: `vw-1022-a-25-1-o:opgave-1:question-3`
- Prompt PDF: `references/external/exams/vw-1022-a-25-1-o.pdf#question-3`
- Correction PDF: `references/external/exams/vw-1022-a-25-1-c.pdf#question-3`
- Overlay: `references/data/exam-ingestion/exam-item-overlays.json`
- Source material: `table-1-zoohee-zorgverzekering`

The overlay records a two-row table for a Zoohee zorgverzekering and an
official answer model with the EUR 649 threshold. It is extracted overlay
evidence only; this sprint validates source authority and rejects local
official-style substitutes before downstream reconstruction.

## Quality Standard

The quality floor is a specification-accurate authority contract: any later
exam-source reconstruction or transformed shared-task evidence must carry a
`sourceAuthority` object with external-primary provenance, official PDF
references, a matching overlay record, matching source table/graph values, and
answer-model references.

Passing tests is not enough if the contract still allows `official-style`,
`exam-style`, `local review data`, `local official-style source`, or
`reconstructed local source` to stand in for real exam proof. The sprint must
fulfil the roadmap specification, prove rendered output and student-facing
output are unchanged, protect `references/external/` and
`references/machine/`, and name reconstruction/transformation work as
follow-up rather than silently doing it here.

The review gate is structural lead review before closure. Human review is not
required because this sprint creates internal authority validation only; the
later ingestion repair gate remains the human-review surface.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Require external-primary source authority for real exam evidence. | `reports/json/exam-source-authority1-contract.json` contains `sourceAuthority.kind: external_primary` and official exam identifiers. | Custom checker and lead review verify the sourceAuthority object. | planned |
| Tie the authority object to official prompt and correction PDFs. | Contract includes prompt PDF and correction PDF paths with `#question-3`; checker verifies local PDF files exist. | Checker rejects missing/non-PDF/local substitute paths. | planned |
| Tie authority to overlay and source material. | Contract names `references/data/exam-ingestion/exam-item-overlays.json` and `table-1-zoohee-zorgverzekering`. | Checker loads overlay and verifies the record and source material. | planned |
| Verify source values match the overlay. | Contract records the Zoohee table rows for statutory/enhanced deductible and premium values. | Checker compares contract values against overlay values. | planned |
| Require answer-model references for transformed tasks. | Contract records required answer-model source refs and states future transformed tasks must cite them. | Checker validates current contract and negative transformed-task fixtures. | planned |
| Reject official-style or local substitutes. | Checker includes negative fixtures for `official-style`, `exam-style`, `local review data`, `local official-style source`, and `reconstructed local source`. | Negative fixtures must fail for the right reason. | planned |
| Preserve boundaries: no reconstruction, runtime, source mutation, or generated output. | Diff summary and git status show only checker, contract/report, sprint artifacts, and roadmap closure/index files changed. | `git diff --check`, lead review, and complete bundle check. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Include negative fixtures for every forbidden proof phrase. | include_now | The roadmap explicitly requires these rejections before actual exam repair work proceeds. |
| Validate the official PDFs by OCR/text extraction. | defer_named_follow_up | Useful for reconstruction, but this sprint only establishes authority and file/provenance matching. |
| Parse the correction PDF to independently verify EUR 649. | defer_named_follow_up | Later reconstruction/transform sprints can compare rendered source/reviewer artifacts; this sprint validates overlay-backed authority. |
| Add a general sourceAuthority library. | reject_scope_creep | One deterministic sprint checker is enough for this repair step; abstraction can follow if repeated sprints need it. |
| Build task-shell context blocks from the table. | reject_scope_creep | Context rendering belongs to `TASK-CONTEXT-RUNTIME-1` and source reconstruction belongs to `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`. |

## Allowed paths

Allowed implementation and evidence paths:

- `build-scripts/sprints/check-exam-source-authority1.js`
- `reports/json/exam-source-authority1-contract.json`
- `reports/sprints/EXAM-SOURCE-AUTH-1-*`
- `references/data/sprints/EXAM-SOURCE-AUTH-1.plan.json`
- `references/data/sprints/EXAM-SOURCE-AUTH-1.result.json`

Allowed read-only inputs:

- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/external/exam-questions.json`
- `references/external/exams/vw-1022-a-25-1-o.pdf`
- `references/external/exams/vw-1022-a-25-1-c.pdf`

Allowed closure/index paths:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/outdated/reference-team-roadmap-*.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `AGENT_GITHUB_ENTRY.md`
- `reports/url-index.md`
- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `reports/internal-dashboard/*`

## Forbidden paths

Forbidden paths and surfaces:

- `references/machine/`
- `references/external/`
- `source-data/`
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- `../4veco-lessen/Boek*/`
- target-exercise registry records
- candidate-storage files
- PV projection or PV machine-promotion outputs

No protected reference mutation, machine reference mutation, external-source
mutation, unit minting, unit update, unit split, unit deprecation, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or student/product use is authorized.

## Inputs

Required inputs:

- `AGENTS.md`
- `../CLAUDE.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-result.md`
- `references/data/sprints/SYNC-ROADMAP-EXAM-REPAIR-1.result.json`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/external/exam-questions.json`
- `references/external/exams/vw-1022-a-25-1-o.pdf`
- `references/external/exams/vw-1022-a-25-1-c.pdf`

## Outputs

Required generated output statement:

- no student-facing or generated lesson output is generated or changed by this
  sprint.

Required authority outputs:

- `reports/json/exam-source-authority1-contract.json` with the canonical
  `sourceAuthority` object and selected item value/answer-model requirements;
- `reports/sprints/EXAM-SOURCE-AUTH-1-source-authority.md` explaining the
  authority contract and forbidden proof forms;
- `build-scripts/sprints/check-exam-source-authority1.js` with positive and
  negative fixture validation;
- sprint planning review record;
- sprint result markdown and JSON;
- sprint diff summary;
- structural lead-review assignment, round 1, correction log, and round 2;
- refreshed repository maps/index/dashboard artifacts at closure if roadmap
  state changes.

## Operationalized sprint procedure

1. Validate this plan, baseline, and plan JSON with wrapped sprint-plan and
   planned bundle checks. Stop if the plan does not pass.
2. Ask the planning/review subagent to inspect the plan, selected overlay,
   roadmap row, and source-boundary requirements. Stop and revise if it finds
   that the contract would authorize reconstruction or local substitute proof.
3. Create the contract JSON and source-authority markdown report for the single
   selected exam item. Do not edit external PDFs, external question mirrors,
   machine references, source data, or generated lessons.
4. Implement `check-exam-source-authority1.js`. It must load the contract,
   overlay, exam-question mirror, and PDF paths; verify sourceAuthority fields,
   table values, answer-model refs, product-boundary flags, and negative
   fixtures.
5. Run wrapped acceptance commands and record command-log evidence.
6. Assign structural lead review, record round 1, apply any corrections and
   correction log, then record round 2. Do not close if round 2 is not PASS or
   PASS WITH FLAGS.
7. Close the roadmap row only after validation and lead review pass. Refresh
   maps/index/dashboard if roadmap state changes.
8. Create result markdown, result JSON, and diff summary. Run final wrapped
   validation, `git diff --check`, fetch/prune, resolve any behind/diverged
   state, commit, push, and report commit hash and push status.

## Acceptance tests

All acceptance commands must be run through
`build-scripts/sprints/run-sprint-command.js EXAM-SOURCE-AUTH-1 --`.

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXAM-SOURCE-AUTH-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js EXAM-SOURCE-AUTH-1
node build-scripts/sprints/check-exam-source-authority1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-lead-review-substance.js EXAM-SOURCE-AUTH-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/EXAM-SOURCE-AUTH-1-result.md
node build-scripts/sprints/check-sprint-bundle.js EXAM-SOURCE-AUTH-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close this sprint must include:

- command-log evidence for all passed acceptance tests listed in result JSON;
- custom checker output proving the authority contract matches the overlay,
  official PDFs, source table values, and answer-model refs;
- negative-fixture evidence rejecting official-style/local substitute proof;
- validator/test evidence from sprint, roadmap, platform, index, and diff
  checks;
- lead-review assignment, round 1, correction log, and round 2;
- diff summary proving no generated lesson output, source-data, or protected
  reference changes.

## Rollback plan

If the contract is wrong, revert only this sprint's contract report, checker,
sprint artifacts, result JSON, roadmap closure row, and refreshed indexes. Do
not modify `references/machine/`, `references/external/`, source data, or
generated lesson output during rollback.

## Human review required

Human review is not required for this authority-contract sprint. The required
review gate is structural lead review before sprint closure. The later
`GATE-SHARED-TASK-INGEST-REPAIR-1` remains the human-review gate for playable
source-context ingestion proof.
