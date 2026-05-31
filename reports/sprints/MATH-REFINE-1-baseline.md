# Sprint MATH-REFINE-1: Baseline

Generated: 2026-05-31

## Scope

Baseline for `MATH-REFINE-1`, the math target-operation-chain hardening
planning sprint authorized by `GATE-ENGINE-1`.

This baseline is read-only evidence. No implementation, generated output,
protected reference mutation, target-exercise field write, source exit-ticket
write, candidate storage, target-equivalent claim, Scale Gate 1 reliance, or
student/product use is authorized.

## Plan reference

- Plan: `reports/sprints/MATH-REFINE-1-plan.md`
- Plan metadata: `references/data/sprints/MATH-REFINE-1.plan.json`

## Governing Evidence

| Evidence | Baseline finding |
|---|---|
| `../4veco-lessen/specifications/product-end-state.md` | The end state requires a visible route to local target-equivalent proof. Graph/table, calculation, constructed-response, and checkpoint interactions use the shared task shell where actions overlap. |
| `../4veco-lessen/specifications/companion-core-specifications.md` | Advisory short checks are separate from target-equivalent exit tickets. Target-equivalent proof must cover the complete reviewed operation chain at the same level with matching answer forms. |
| `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/gate-closure.md` | GATE-ENGINE-1 accepted refactoring math around the `1.1.2` target-operation chain and authorized only downstream planning/preparation work. |
| `reports/sprints/GAME-ARCH-2-target-operation-coverage.md` | The `1.1.2` target chain is percentage change, price index, percentage change from index values, and explanation of why index-point change differs from percentage change. |
| `reports/sprints/MATH-UX-2-student-route-proof.md` | Current math route renders through shared route/task-shell and covers useful A38/A39 calculation task families as local practice only. |

## Target Exercise Baseline

Read-only target exercise source:
`references/authored/course-target-exercises.json`.

`1.1.2 Percentages en indexcijfers` target exercise:

- subquestion `a`: bicycle price rises from EUR 800 to EUR 920; calculate
  percentage change. Expected operation: `(920 - 800) / 800 * 100 = 15%`;
- subquestion `b`: basket price is EUR 150 in 2023 and EUR 162 in 2025 with
  base year 2023 index 100; calculate 2025 price index. Expected operation:
  `162 / 150 * 100 = 108`;
- subquestion `c`: 2026 index rises to 112; calculate price increase from
  2025 to 2026 in percent. Expected operation: `(112 - 108) / 108 * 100`,
  about `3.7%`;
- subquestion `d`: a student claims index 108 to 112 means inflation is 4%;
  explain why wrong and calculate the correct figure. Expected operation:
  distinguish 4 index points from 3.7 percent and show the A38 calculation on
  the index values.

The target exercise requires skills `A38`, `A39`, and `D31`.

## Unit Baseline

Read-only MTU source: `references/machine/micro-teaching-units.json`.

| Unit | Current role for `1.1.2` |
|---|---|
| `A38 Procentuele verandering berekenen` | Calculates percentage change with `(nieuw - oud) / oud * 100`; includes the pitfall that index-point changes are not percentages. |
| `A39 Prijsindex (CPI) berekenen` | Calculates price index and inflation between index values using A38 on index values; needs `A38`. |
| `D31 Indexpunt versus procentuele verandering` | Explains the difference between index-point change and percentage change; explicitly covers the 108 to 112 trap; needs `A38` and `A39`. |

## Current Math Route Evidence

Current generated-route evidence:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree/1.1.2.js`
- `reports/sprints/MATH-UX-2-student-route-proof.md`
- `reports/sprints/MATH-UX-2-screenshot-manifest.md`
- `build-scripts/sprints/check-math-ux2-route-output.js`

Current generated `1.1.2` math route state:

- `activeSkills`: `A38`, `A39`;
- calculation-route `skillScope`: `A38`, `A39`;
- calculation-route `targetSkills`: `A38`, `A39`;
- reasoning-route `skillScope`: `A38`, `A39`;
- reasoning-route `targetSkills`: `A38`, `A39`;
- no explicit `D31` route scope or target-skill entry;
- no `1.1.2` exit-ticket source or page;
- checkpoint-style calculation fixture keeps `targetReadinessEvidence: false`;
- no target-exercise `question_type` or `answer_form` fields are written;
- no answer-skill candidate storage exists.

## Current Task-Shell Evidence

MATH-UX-2 proves current local practice through shared task-shell families:

- `numeric_input`;
- `calculation_work_capture`;
- `final_answer_entry`;
- `unit_notation_field`.

The A38/A39 practice covers calculation mechanics and notation behavior. It
does not yet prove the complete target chain because the target-specific D31
explanation operation is not explicitly routed or checked.

## Baseline Gap: D31 Route Scope

Current `1.1.2` target exercise and specification require:

```text
distinguish index-point change from percentage change
```

Current generated math route scopes only:

```text
A38
A39
```

This is a target-chain gap. It does not invalidate MATH-UX-2 as local
practice proof, but it blocks target-equivalent math reliance until repaired
and reviewed. The future hardening plan must define whether D31 is surfaced
inside the math route, coordinated with reasoning, or covered by a shared
calculation-plus-short-explanation task family.

## Other Coverage Gaps Before Target-Equivalent Use

| Operation | Current state | Gap |
|---|---|---|
| Calculate percentage change from old/new values | A38 practice exists with visible work capture | Need target-aligned EUR 800 to EUR 920 proof task or equivalent same-level item |
| Calculate price index from base and target basket prices | A39 practice exists with visible work capture | Need target-aligned EUR 150 to EUR 162 index 108 proof task or equivalent same-level item |
| Calculate inflation from index 108 to 112 | A39 practice can calculate index-to-index inflation | Need explicit same-level sequence that carries index 108 from subquestion `b` into subquestion `c` or equivalent chain |
| Explain why 108 to 112 is not 4 percent | D31 exists in MTU catalog, but current route does not scope it | Need short explanation or constructed-response task that checks index points versus percentage change |
| Target-equivalent proof | No published `1.1.2` exit ticket | Held for `L1.7B-Q2` and `GATE-L1.7B-Q2` |

## Protected Surface Baseline

No change is authorized to:

- `references/machine/`;
- `references/external/`;
- `references/authored/course-target-exercises.json`;
- `references/data/exam-ingestion/answer-skill-candidates.json`;
- `source-data/book-*/exit-ticket/*.json`;
- generated Book 1 output;
- math engine/source implementation files.

## Data integrity notes

No protected reference data may change during MATH-REFINE-1.
`references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` are read-only or
forbidden for this sprint. `source-data/book-*/exit-ticket/*.json` is also
forbidden. The sprint may inspect current math route source and generated
output as evidence only.

## Baseline Stop Conditions

Stop MATH-REFINE-1 if the sprint attempts to:

- repair math implementation directly;
- regenerate lesson output;
- create a `1.1.2` exit ticket;
- treat current A38/A39 practice as target-equivalent proof;
- hide the D31/index-point explanation gap;
- authorize diagnostics, adaptive routing, mastery, sequencing, summative use,
  PV, Scale Gate 1, or product use.
