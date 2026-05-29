# Sprint MTU-H4A: Baseline

Generated: 2026-05-29

Status: baseline recorded before non-mutating H4A planning packet preparation.

## Plan reference

Plan: `reports/sprints/MTU-H4A-plan.md`

## Remote And Worktree

- Local `HEAD`: `898cf9e4f082af53f55f28616f7b1727a5223d4f`
- `origin/main`: `898cf9e4f082af53f55f28616f7b1727a5223d4f`
- Expected local untracked file left untouched:
  `knowledge/exit-ticket-game-1.1.1.zip`

## Roadmap State

`references/reference-team-roadmap.md` is at
`v3.12-gate-mtu-h4-pass-with-conditions`.

Active sprint:

```text
MTU-H4A - Answer-Form CLI-Mutation Planning Packet
```

Roadmap authority boundary: H4A may prepare exact answer-form unit specs and
held-lane decisions only. No protected reference mutation, unit minting,
candidate storage creation, candidate writes, target-exercise mutation,
generated projection refresh, lesson output, diagnostics, adaptive routing,
mastery/sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, Scale Gate 1, or student/product use is authorized.

## Source Gate

`reports/review-gates/GATE-MTU-H4-answer-form-question-type-routing/gate-closure.json`
closed PASS WITH CONDITIONS and authorized only `MTU-H4A`.

Reviewed remote evidence commit:

```text
38a032346db9a6a1dcb247d52afce745c48863f7
```

Accepted planning lanes:

- `ANS_BEREKEN`
- `ANS_LEG_UIT_DAT`
- `ANS_LEG_UIT_OF`
- `ANS_LEG_UIT_MET_VOORBEELD`
- `ANS_NOEM_GEEF_AAN`
- `ANS_BRON_GEBRUIKEN` as source-use modifier plus underlying answer form
- `ANS_GRAFISCH_ARCEER_TEKEN` as planning candidate needing stronger mapping
  evidence

Held lanes:

- `ANS_ANALYSEER_BEOORDEEL`
- `ANS_MOTIVEER_CLASSIFICATIE`

## Existing Question-Type Evidence

`references/authored/course-target-exercises.json` currently has 54 target
exercise records and zero records with `question_type`, `question_types`,
`answer_form`, or `answer_forms` fields.

`reports/json/exam-question-extraction-gaps.json` exposes these extracted
`question_type` values for planning only:

| question_type | Count |
|---|---:|
| `uitleg_dat` | 32 |
| `uitleg_of` | 10 |
| `bron` | 8 |
| `berekenen` | 2 |
| `noem` | 2 |

## Taxonomy And H4 Conditions

`references/authored/vraagtypen-en-opgaveontwerp.md` defines seven VWO exam
question patterns. H4A must keep all seven visible:

| Type | Planning treatment in H4A |
|---|---|
| `Leg uit dat` | exact proposed unit spec |
| `Bereken` | exact proposed unit spec |
| `Leg uit of` | exact proposed unit spec |
| `Is X een Y? Motiveer` | held Type 4 lane only |
| `Teken / Arceer` | held graph planning candidate only |
| `Leg uit met behulp van` | source-use modifier plus underlying answer form |
| `Noem` | exact proposed unit spec, with split-if-needed condition |

## Live MTU And ID-Space State

The live MTU catalog contains 250 records. A-domain IDs use the two-digit
format `[A-L]\d\d`; therefore `A100` and higher are invalid.

Live A-domain facts before H4A planning:

- highest live A-domain ID: `A95`
- open A-domain slots in the two-digit ID range:
  `A71`, `A80`, `A81`, `A96`, `A97`, `A98`, `A99`
- `A71` remains held/high-risk from prior graphical foundation work and must
  not be consumed by H4A without explicit reviewer authorization.

The planning packet therefore may propose only these available non-held A
slots for later execution review:

```text
A80, A81, A96, A97, A98, A99
```

## EX Answer-Skill Candidate Boundary

`references/data/exam-ingestion/operation-answer-skill-contract.json` keeps
future answer-skill candidates overlay-first. Persistent storage remains
absent:

```text
references/data/exam-ingestion/answer-skill-candidates.json
```

`build-scripts/references/answer-skill-candidate-add.js` is dry-run-only and
asserts future storage remains absent. H4A must keep q3 and q15 EX
answer-skill needs visible without creating storage or writing candidates.

## Baseline Stop Conditions

Stop before packet completion if any H4A artifact:

- authorizes unit minting, unit update execution, unit split, or machine
  reference writes;
- proposes an invalid A-domain ID such as `A100`;
- consumes `A71` without an explicit review question and decision;
- treats `bron` as a standalone complete answer form;
- mints or executes graph, Type 4, or analysis/evaluation lanes;
- creates `references/data/exam-ingestion/answer-skill-candidates.json`;
- authorizes candidate writes or answer-skill mutation;
- writes `question_type` or answer-form fields to target exercises;
- treats generated projections as source evidence;
- authorizes lesson output, diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, Scale Gate 1, or student/product use.

## Data integrity notes

No protected reference data changed while recording this baseline.
`references/machine/` and `references/external/` were read as evidence only
and were not edited. `references/authored/course-target-exercises.json` was
read as evidence only and was not changed. No candidate storage was created
and no generated projection refresh was performed.
