# EX-6 Validator And CLI Implementation Plan

Generated: 2026-05-26

Status: planning-only pending GATE-EX6 review.

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No unit minting
authorized. No operation-registry mutation authorized. No answer-skill mutation
authorized. No q19 source-annex or graph-object extraction execution
authorized. No PV/graph mutation authorized. No target-exercise promotion
authorized. No lesson-output mutation authorized. No CP-6 or Year-1 closure
authorized. No student/product use authorized.

## Purpose

EX-6 translates the GATE-EX5 PASS WITH CONDITIONS decision into a concrete
validator and dry-run CLI implementation plan. It creates schema contracts and
review evidence only. It does not create candidate storage, does not write
candidate records, and does not execute q19 extraction.

## Future Storage Contracts

These storage paths are named for later tooling, but they are not created by
EX-6. In short: future storage not created, future writes not authorized.

| Family | Schema | Future storage | Created now | Writes now |
|---|---|---|---:|---:|
| operation candidates | `references/schemas/operation-candidates.schema.json` | `references/data/exam-ingestion/operation-candidates.json` | false | false |
| answer-skill candidates | `references/schemas/answer-skill-candidates.schema.json` | `references/data/exam-ingestion/answer-skill-candidates.json` | false | false |
| source-annex extraction overlays | `references/schemas/source-annex-extraction-overlays.schema.json` | `references/data/exam-ingestion/source-annex-extraction-overlays.json` | false | false |

## Future Validators

Future implementation work may create these validators only after GATE-EX6
closes with explicit authorization.

| Validator | Future path | Created now |
|---|---|---:|
| operation and answer-skill candidates | `build-scripts/references/check-operation-answer-skill-candidates.js` | false |
| source-annex extraction overlays | `build-scripts/references/check-source-annex-extraction-overlays.js` | false |

The validators must reject:

- unauthorized mutation or product-use flags;
- candidate records without source exam item IDs;
- candidate records without source evidence or answer-model refs where required;
- `A15` reused as q3 annual-threshold support;
- `A45` treated as primary q19 graph-shift support;
- q19 graph/PV or reasoning records marked ready while `q19-source-annex-gap`
  or `q19-graph-object-gap` remains unresolved;
- hidden q3 threshold-answer wording;
- hidden q15 two-step correction-model explanation.

## Future Dry-Run CLI Contract

Future CLI paths are named but not created by EX-6:

- `build-scripts/references/operation-candidate-add.js`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/source-annex-extraction-add.js`

Any future CLI must support read-only dry-run mode before any write mode exists.
Write mode remains unauthorized until a later human gate names the exact lane,
storage path, validator, rollback route, audit evidence, and stop conditions.

## Dry-Run Fixture Policy

Dry-run fixtures are non-persistent and test-only. EX-6 permits temporary
fixtures only under `/tmp/Codex-work/EX-6/`. Persistent candidate paths under
`references/data/exam-ingestion/` remain forbidden until a later gate.

## Rollback And Audit Requirements

Before any future write is authorized, the implementation lane must define:

- a closed human gate naming the exact write lane;
- before and after file manifests;
- a machine-readable mutation log entry;
- the dry-run and write commands used;
- a rollback command or exact restore route;
- validator output proving no hidden gaps or product-use flags;
- source evidence refs and review artifact refs.

## Preserved Routing Guardrails

| Requirement | Guardrail |
|---|---|
| `q3-calc-1` | Keep `A61` as support for table-value selection only; reject `A15` as q3 annual-threshold support. |
| `q3-answer-1` | Keep threshold conclusion with unit and direction visible as an answer-skill need. |
| `q19-graph-op-1` | Carry `A42` and `D10` as candidates; keep `A45` weak support only; q19 remains blocked by source/graph gaps. |
| `q19-reason-1` | Keep chained-market reasoning provisional and blocked until q19 extraction is adequate. |
| `q15-answer-1` | Keep two-step correction-model explanation visible as an answer-skill need; `D27`/`F03`/`F09` cover content only. |

## Required Gate Before Implementation

Run `GATE-EX6-validator-cli-planning` before any later validator
implementation, dry-run CLI implementation, candidate-storage creation,
candidate write, q19 extraction execution, lesson handoff, PV projection, or
student/product use.
