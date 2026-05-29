# GATE-MTU-H4 Gate Closure

Closed: 2026-05-29

Decision: PASS WITH CONDITIONS for answer-form/question-type routing only. No
mutation is authorized by this gate.

Reviewed remote commit:
`38a032346db9a6a1dcb247d52afce745c48863f7`

The H4 routing packet, review packet, bundle URLs, sprint result, and cited
evidence were pushed before review. The packet status string requiring commit
and push is resolved by this closure record: the packet was reviewed from the
remote branch at the commit above.

## Accepted

Use a hybrid architecture:

- reusable answer-form MTUs for broad student procedures;
- EX answer-skill overlays for correction-model-specific answer construction;
- later authored-reference fields for `question_type` / `answer_form` only
  after exact mutation review.

Approve planning lanes:

- `ANS_BEREKEN`
- `ANS_LEG_UIT_DAT`
- `ANS_LEG_UIT_OF`
- `ANS_LEG_UIT_MET_VOORBEELD`
- `ANS_NOEM_GEEF_AAN`
- `ANS_BRON_GEBRUIKEN`
- `ANS_GRAFISCH_ARCEER_TEKEN` as a planning candidate needing more mapping
  evidence.

Accept the current `question_type` mapping candidates as planning input only:

- `berekenen` -> `ANS_BEREKEN`
- `uitleg_dat` -> `ANS_LEG_UIT_DAT`
- `uitleg_of` -> `ANS_LEG_UIT_OF`
- `bron` -> `ANS_BRON_GEBRUIKEN` as source-use modifier plus underlying
  answer form
- `noem` -> `ANS_NOEM_GEEF_AAN`

Keep q3 threshold conclusion/unit-direction and q15 two-step correction-model
explanation in EX answer-skill overlay routes; no candidate writes are
authorized.

## Held

- `ANS_ANALYSEER_BEOORDEEL` remains held.
- `ANS_MOTIVEER_CLASSIFICATIE` must be added as a held Type 4 / motiveer /
  definition-application / classificatie planning lane so the seven-type
  taxonomy is not silently incomplete.

Suggested held lane core:

```text
ANS_MOTIVEER_CLASSIFICATIE
Core: state definition, map definition criteria to context, conclude yes/no or classification.
Status: held/planning-only until current extraction evidence supports mapping.
```

## Conditions

1. Add a held Type 4 / motiveer / classificatie lane so the seven-type taxonomy
   is not silently incomplete.
2. Treat `bron` as source-use plus an underlying answer form, not as a
   standalone complete answer form.
3. Do not mint graph or analysis/evaluation answer-form units until stronger
   mapping evidence exists.
4. Keep the EX overlay boundary strict; correction-model-specific answer
   construction must not be hidden inside broad MTUs without explicit review.
5. Do not create or write `answer-skill-candidates.json`.
6. Do not write target-exercise `question_type` or `answer_form` fields from
   this gate.
7. Record the reviewed remote commit/hash.

## Authorized Next

`MTU-H4A Answer-Form CLI-Mutation Planning Packet` may prepare a later bounded
planning packet for the accepted answer-form lanes and held-lane decisions.

Authorized next scope is planning only:

- propose exact answer-form unit IDs and specs;
- carry the held Type 4 lane explicitly;
- mark `bron` as source-use modifier plus underlying answer form;
- keep graph/draw/shade planning-only until stronger mapping evidence exists;
- keep analysis/evaluation held;
- keep q3/q15 EX answer-skill overlay needs visible;
- define exact source-mutation, candidate-storage, target-exercise field, and
  projection boundaries for later review.

No execution or writes are authorized.

## Not Authorized

- protected reference mutation
- external-source mutation
- machine-reference mutation
- unit minting
- unit updates
- unit splits
- unit deprecation
- answer-skill candidate storage creation
- answer-skill candidate writes
- target-exercise `question_type` or `answer_form` writes
- generated projection refresh
- lesson output
- diagnostics, adaptive routing, mastery, or sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- Scale Gate 1
- student/product use

## Quality Log

| Issue | Severity | Next action | Proof required |
|---|---:|---|---|
| Type 4 / motiveer/classificatie lane absent | Medium-high | Add held planning lane | H4 closure or next packet lists Type 4 explicitly |
| `bron` can be mistaken for full answer form | Medium | Mark as source-use modifier | Future mapping combines `bron` with underlying answer form |
| Graph lane lacks current extracted mapping evidence | Medium | Keep planning-only | Exact target/example evidence before unit minting |
| EX answer skills could be hidden inside broad MTUs | High | Keep q3/q15 overlays visible | No candidate writes; EX overlay needs remain listed |
| Candidate storage absent | High governance risk if ignored | Keep storage blocked | No `answer-skill-candidates.json` created |
| Target exercise fields absent | Medium | Later authored-reference packet only | Exact before/after diffs if fields are added later |

## Operational Next Action

Start `MTU-H4A Answer-Form CLI-Mutation Planning Packet` with a checkable
sprint plan. The sprint may prepare exact lane specs, held-lane treatment,
source-boundary language, rollback expectations, and validation proof, but
must not execute mutation, create candidate storage, write candidates, write
target-exercise fields, refresh projections, generate lesson output, or expose
student-facing product surfaces.
