# MTU-H4 Answer-Form And Question-Type Routing Packet

Generated: 2026-05-28

Status: routing packet ready, no mutation authorized.

## Scope

This packet prepares GATE-MTU-H4. It reviews answer-form routing only: whether
the platform should later plan reusable answer-form MTUs, EX answer-skill
candidate overlays, or both for question verbs and answer structures such as
`bereken`, `leg uit`, `leg uit met voorbeeld`, `analyseer`, `arceer/grafisch`,
`geef aan`, `noem`, and source-based answers.

This packet does not authorize unit minting, unit updates, candidate storage,
candidate writes, target-exercise mutation, projection refresh, lesson output,
or student/product use.

## Evidence Base

- `reports/sprints/MTU-H4-plan.md`
- `reports/sprints/MTU-H4-baseline.md`
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`
- `reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/gate-closure.json`
- `reports/json/exam-question-extraction-gaps.json`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `references/authored/course-target-exercises.json`
- `references/machine/micro-teaching-units.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `references/schemas/answer-skill-candidates.schema.json`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/check-operation-answer-skill-candidates.js`

## Baseline Findings

`course-target-exercises.json` has no `question_type` or `answer_form` fields.
Any future addition of those fields is an authored-reference mutation and needs
an exact later packet.

Current extracted `question_type` values are:

| question_type | Count |
|---|---:|
| `uitleg_dat` | 32 |
| `uitleg_of` | 10 |
| `bron` | 8 |
| `berekenen` | 2 |
| `noem` | 2 |

The H2 operation map left two explicit answer-form needs for H4:

| Source | Need |
|---|---|
| q1 | `leg uit met voorbeeld` answer form |
| q2 | `bereken` answer form |

The EX track already has dry-run-only answer-skill candidate tooling. Persistent
`answer-skill-candidates.json` storage remains absent and candidate writes are
not authorized.

## Recommended Boundary

Use a hybrid route:

```text
Reusable answer-form MTUs:
  broad procedures students must learn across many exercises.

EX answer-skill overlays:
  correction-model-specific answer construction, point rules,
  accepted wording, threshold conclusions, or item-specific structure.
```

This avoids hiding answer construction inside content MTUs, while also avoiding
turning every correction-model phrase into a live MTU.

## Proposed Reusable Answer-Form Lanes

These are planning labels only, not live unit IDs.

| Lane | Maps current question_type | Core |
|---|---|---|
| `ANS_BEREKEN` | `berekenen` | formula, substitution, intermediate steps, units, conclusion |
| `ANS_LEG_UIT_DAT` | `uitleg_dat` | given conclusion, causal links, return to conclusion |
| `ANS_LEG_UIT_OF` | `uitleg_of` | state direction first, then explain why |
| `ANS_LEG_UIT_MET_VOORBEELD` | none yet | give example, explain fit, connect to context |
| `ANS_NOEM_GEEF_AAN` | `noem` | identify/list only what is asked |
| `ANS_BRON_GEBRUIKEN` | `bron` | cite source observation, then complete answer form |
| `ANS_GRAFISCH_ARCEER_TEKEN` | none yet | draw, label, or shade exactly what the graph prompt asks |
| `ANS_ANALYSEER_BEOORDEEL` | none yet | held until more evidence decides argument/evaluation boundaries |

## EX Answer-Skill Overlay Lanes

Keep these visible in the EX overlay route, with no candidate writes now:

| Candidate | Route |
|---|---|
| `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION` | q3 threshold conclusion with unit and direction |
| `EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION` | q15 two-step correction-model explanation |

## Held Routes

- Exact live MTU IDs for answer-form lanes.
- Persistent `answer-skill-candidates.json` storage.
- Target-exercise `question_type` or answer-form field writes.
- Student-facing answer-form training or lesson output.

## Recommended Next Gate

Run GATE-MTU-H4 to decide:

1. whether the hybrid boundary is acceptable;
2. which answer-form lanes may proceed to a later exact planning packet;
3. whether `question_type` values should map directly to these lanes;
4. whether EX answer-skill candidate storage stays separate;
5. what later sprint may be authorized.

No mutation or product use is authorized by this packet.
