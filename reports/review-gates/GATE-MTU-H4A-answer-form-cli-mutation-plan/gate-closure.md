# GATE-MTU-H4A Gate Closure

Closed: 2026-05-29

Decision: PASS WITH CONDITIONS for later bounded execution-packet preparation.
No execution or product use is authorized by this gate.

Reviewed remote commit:
`a91e5da2082ef8aacc040e55b3fae905d6f0799a`

The H4A planning packet, review packet, bundle URLs, sprint result, and cited
evidence were pushed before review. The packet status string requiring commit
and push is resolved by this closure record: the packet was reviewed from the
remote branch at the commit above.

## Accepted

Approve the following answer-form units for later bounded execution-packet
preparation only:

- `A96` Bereken-vraag beantwoorden.
- `A97` Leg-uit-dat antwoord opbouwen.
- `A98` Leg-uit-of antwoord opbouwen.
- `A99` Leg uit met voorbeeld beantwoorden.
- `A80` Noem of geef-aan antwoord geven, with split-if-needed condition.
- `A81` Bron gebruiken in een antwoord, only as source-use modifier plus
  underlying answer form.

Accept the current `question_type` mapping candidates as planning input only:

- `berekenen` -> `A96` / `ANS_BEREKEN`
- `uitleg_dat` -> `A97` / `ANS_LEG_UIT_DAT`
- `uitleg_of` -> `A98` / `ANS_LEG_UIT_OF`
- `noem` -> `A80` / `ANS_NOEM_GEEF_AAN`
- `bron` -> `A81` / `ANS_BRON_GEBRUIKEN` as source-use modifier plus
  underlying answer form

The command, rollback, and validation standard is accepted for later
execution-packet planning, provided generator/exposure handling is made
explicit before any student-facing exposure.

## Held

- `ANS_GRAFISCH_ARCEER_TEKEN` remains held until stronger mapping evidence and
  source/graph-object evidence support minting.
- `ANS_MOTIVEER_CLASSIFICATIE` remains held as the explicit Type 4 /
  motiveer / definition-application / classificatie lane.
- `ANS_ANALYSEER_BEOORDEEL` remains held until stronger exam-question evidence
  distinguishes analysis, evaluation, and judgement boundaries.
- q3 threshold conclusion/unit-direction remains in the EX answer-skill
  overlay route; no candidate storage or writes are authorized.
- q15 two-step correction-model explanation remains in the EX answer-skill
  overlay route; no candidate storage or writes are authorized.

## ID Allocation Decision

`A100` is invalid under the current two-digit ID policy and must not appear in
an execution packet. `A71` remains held and must not be consumed without an
explicit reviewer decision.

For this bounded packet only, `A80`, `A81`, and `A96`-`A99` are acceptable
planned IDs. This consumes the remaining non-held A-domain slots. Future
answer-form or A-domain growth requires an ID-policy sprint or namespace
decision before more A-domain units are planned.

## Conditions

1. Record the reviewed remote commit/hash.
2. Explicitly accept bounded use of `A80`, `A81`, and `A96`-`A99`; keep `A71`
   held.
3. Treat future A-domain growth as requiring an ID-policy or namespace
   decision.
4. Require generator implementation or generator-blocked/non-interactive
   status before student-facing exposure.
5. Do not write target-exercise `question_type` or `answer_form` fields from
   this gate.
6. Do not create or write answer-skill candidate storage.
7. Run simulated catalog validation and the full validator stack in the later
   execution packet.
8. Validate proposed exam codes, including `A1.7`, `A4.2`, `A1.3`, `A1.9`,
   and `A1.5`, against the syllabus/eindtermen registry.

## Authorized Next

`MTU-H4B Answer-Form Bounded CLI Execution Packet` may prepare a later bounded
execution packet for the accepted H4A lanes.

Authorized next scope is packet preparation only:

- prepare exact `unit-add` execution commands for `A80`, `A81`, and
  `A96`-`A99`;
- print and log every extracted spec before any later command;
- prove simulated catalog validation before mutation;
- verify generator implementation or generator-blocked/non-interactive status;
- prove no student-facing route exposes generator-blocked answer-form units;
- preserve `A100` rejection and `A71` hold;
- keep graph, Type 4, and analysis/evaluation lanes held;
- keep q3/q15 EX answer-skill overlays visible with no candidate writes;
- keep target-exercise field writes, projection refresh, lesson output, and
  product use out of scope.

No execution or writes are authorized by this gate.

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
| A-domain ID pressure | High for future work | Accept this bounded allocation; plan ID-policy follow-up | Closure states `A80`/`A81`/`A96`-`A99` are bounded and future growth needs policy |
| `A100` invalid | High if used | Keep rejected | No execution packet references `A100` |
| `A71` held | Medium | Do not consume without explicit review | `A71` absent from command set |
| Answer-form units may lack generators | High if exposed | Implement or generator-block | Generator-readiness proves no broken student route |
| `bron` could become standalone | Medium-high | Keep `A81` as modifier | Future mapping requires underlying answer form |
| EX overlays could be hidden | High | Keep q3/q15 overlay route visible | No candidate storage or writes |
| Target-exercise fields absent | Medium | Separate authored-reference mutation packet only | Exact before/after diffs before any field write |

## Operational Next Action

Start `MTU-H4B Answer-Form Bounded CLI Execution Packet` with a checkable
sprint plan. The sprint may prepare exact commands, extracted-spec logs,
generator/exposure proof, simulated catalog validation, rollback expectations,
and validation evidence for the accepted H4A lanes, but must not execute
mutation, create candidate storage, write candidates, write target-exercise
fields, refresh projections, generate lesson output, or expose student-facing
product surfaces.
