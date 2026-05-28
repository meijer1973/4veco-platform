# Sprint MTU-H4: Baseline

Generated: 2026-05-28

Status: baseline recorded before non-mutating H4 packet preparation.

## Plan reference

Plan: `reports/sprints/MTU-H4-plan.md`

## Remote And Worktree

- Local `HEAD`: `71268d8fa0bc3820cc4e9117dc7010ff6e510310`
- `origin/main`: `71268d8fa0bc3820cc4e9117dc7010ff6e510310`
- Expected local untracked file left untouched:
  `knowledge/exit-ticket-game-1.1.1.zip`

## Roadmap State

`references/reference-team-roadmap.md` is at
`v3.09-mtu-h3c-incidence-executed`.

Active sprint:

```text
MTU-H4 - Answer-Form MTUs And Question-Type Mapping
```

Roadmap authority boundary: H4 begins with a non-mutating planning/review
packet. No protected reference mutation, target-exercise promotion, candidate
writes, lesson output, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, or
student/product use is authorized.

## Existing Question-Type Evidence

`references/authored/course-target-exercises.json` currently has 54 target
exercise records and zero records with `question_type`, `question_types`,
`answer_form`, or `answer_forms` fields.

`reports/json/exam-question-extraction-gaps.json` currently exposes these
`question_type` values:

| question_type | Count |
|---|---:|
| `uitleg_dat` | 32 |
| `uitleg_of` | 10 |
| `bron` | 8 |
| `berekenen` | 2 |
| `noem` | 2 |

These values come from extraction-gap patch records and are evidence for
mapping design only. They are not target-exercise source fields.

## Deferred MTU-H2 Answer-Form Needs

`reports/mtu-hardening/solo-q1-q3-operation-map.md` records answer forms as
teachable requirements and routes them to MTU-H4:

| Source | Candidate label | Core need |
|---|---|---|
| q1 | `A_ANSWER_LEG_UIT_WITH_EXAMPLE` | Give the requested example, explain why it fits, and connect it to context. |
| q2 | `A_ANSWER_BEREKEN_QUESTION` | Show formula, substitution, intermediate calculation, unit, and final conclusion. |

`reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/gate-closure.json`
preserves these as deferred MTU-H4 items:

- q1 `Leg-uit-vraag met voorbeeld beantwoorden`
- q2 `Bereken-vraag beantwoorden`

## Existing Question-Type Taxonomy

`references/authored/vraagtypen-en-opgaveontwerp.md` defines seven VWO exam
question patterns:

1. `Leg uit dat`
2. `Bereken`
3. `Leg uit of`
4. `Is X een Y? Motiveer`
5. `Teken / Arceer`
6. `Leg uit met behulp van [figuur/tabel]`
7. `Noem`

It also records answer-model conventions for calculation, causal-chain,
definition-application, graph manipulation, source-use, and recall answers.

## EX Answer-Skill Candidate Boundary

`references/data/exam-ingestion/operation-answer-skill-contract.*` defines
future answer-skill candidates as overlay-first records. Persistent storage is
still absent:

- `references/data/exam-ingestion/answer-skill-candidates.json`

`build-scripts/references/answer-skill-candidate-add.js` is dry-run-only and
asserts future storage remains absent. `check-operation-answer-skill-candidates.js`
currently proves operation/answer-skill candidate storage absence by default.

Reviewed EX answer-skill examples remain visible but unwritten:

| Requirement | Candidate | Boundary |
|---|---|---|
| `q3-answer-1` | `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION` | threshold conclusion with unit and direction |
| `q15-answer-1` | `EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION` | two-step correction-model explanation, content units only support the content |

## Live MTU State

The MTU catalog contains many content, calculation, graph, and reasoning units,
but no dedicated live answer-form MTU family for general exam verbs. H3C has
already executed the incidence lanes:

- `D41`, `D42`, `D43`, `D45`, and `D46` are live.
- `D07` is narrowed to percentage burden calculation.
- `D44` remains absent and held.

MTU-H4 must not hand-edit `references/machine/micro-teaching-units.json`.

## Baseline Stop Conditions

Stop before packet completion if any H4 artifact:

- authorizes unit minting, unit update execution, or machine-reference writes;
- creates `references/data/exam-ingestion/answer-skill-candidates.json`;
- authorizes candidate writes or answer-skill mutation;
- writes `question_type` or answer-form fields to target exercises;
- treats generated projections as source evidence;
- authorizes lesson output, diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, or student/product use.

## Data integrity notes

No protected reference data changed while recording this baseline.
`references/machine/` and `references/external/` were read as evidence only
and were not edited. `references/authored/course-target-exercises.json` was
read as evidence only and was not changed. No candidate storage was created
and no generated projection refresh was performed.
