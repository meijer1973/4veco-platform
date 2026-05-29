# GATE-MTU-H4A Human Review Record

Recorded: 2026-05-29

Reviewed remote commit:
`a91e5da2082ef8aacc040e55b3fae905d6f0799a`

Review mode: human review recorded from the supplied reviewer verdict. The
review packet showed the full planned question list before review; the reviewer
supplied the calibration answers, all ten review answers, conditions, quality
log, and recommended closure wording in one response. No follow-up ambiguity
remained before closure.

## Verdict

PASS WITH CONDITIONS for later bounded execution-packet preparation. No
execution or product use is authorized now.

The H4A packet satisfies the H4 closure conditions: it proposes exact
answer-form unit IDs and specs, carries the held Type 4 lane, treats `bron` as
a modifier rather than a standalone answer form, keeps graph/analysis lanes
held, preserves the EX overlay boundary, and keeps candidate storage absent.

The main review concern is A-domain ID pressure. `A100` is invalid under the
current ID policy, `A71` remains held, and `A80`, `A81`, and `A96`-`A99` are
acceptable for this bounded packet only. Future answer-form or A-domain growth
requires an ID-policy or namespace decision before more A-domain units are
planned.

## Calibration Answers

| Calibration | Answer |
|---|---|
| This gate reviews H4A planning only and does not authorize mutation/product use. | Yes. |
| The H4A packet and evidence have been pushed before review. | Yes, based on remote fetchability. Closure records reviewed commit `a91e5da2082ef8aacc040e55b3fae905d6f0799a`. |
| Candidate storage remains absent; A-domain ID pressure is a review issue; proposed answer-form IDs are not live until later execution. | Yes. Candidate storage is still absent and no answer-skill candidate writes are authorized. |

## Review Answers

| Question | Decision | Rationale |
|---|---|---|
| MTUH4A-Q1 ID allocation and planning scope | Approve for this bounded packet, with an ID-policy follow-up. | `A100` is invalid under the two-digit ID pattern. `A71` is deliberately held. `A80`, `A81`, and `A96`-`A99` are acceptable for this packet, but future growth requires an ID-policy sprint or a new namespace decision. |
| MTUH4A-Q2 `A96` bereken | Approve. | `A96` is a clean reusable answer-form unit: formula/relation, values, intermediate steps, unit/notation, and short context conclusion. It correctly stays content-neutral with `needs: []` and a zero-needs review rationale. |
| MTUH4A-Q3 `A97`/`A98`/`A99` leg-uit lanes | Approve all three as separate lanes. | The split is pedagogically justified: `uitleg_dat` builds toward a given conclusion; `uitleg_of` requires choosing direction first; `leg uit met voorbeeld` requires example fit plus explanation. Combining them would recreate the answer-form blur H4 is meant to fix. |
| MTUH4A-Q4 `A80` noem/geef aan | Approve with split-if-needed condition. | A combined concise-identification unit is acceptable now. The packet correctly preserves a future split condition if evidence shows `geef aan` behaves differently from `noem`. |
| MTUH4A-Q5 `A81` bron modifier | Approve. | `A81` is correctly marked as not a standalone complete answer form. It must combine with an underlying answer form such as calculation, explanation, classification, or graph response. |
| MTUH4A-Q6 held lanes | Approve held treatment. | Graph/draw/shade needs stronger mapping and possibly source/graph-object evidence. Type 4 motiveer/classificatie is now explicitly carried as held, satisfying the H4 closure condition. Analysis/evaluation remains held pending better evidence. |
| MTUH4A-Q7 EX overlays | Approve no-write overlay boundary. | q3 threshold conclusion/unit-direction and q15 two-step correction-model explanation remain visible as EX answer-skill overlays. No candidate storage or writes are authorized. |
| MTUH4A-Q8 mapping/projection boundary | Approve. | Current `question_type` mappings remain planning input only. No target-exercise `question_type` or `answer_form` field writes are authorized. `bron` is explicitly a modifier requiring an underlying answer form. |
| MTUH4A-Q9 command and validation standard | Accept with generator/exposure condition. | The command plan discloses that `unit-add` has no dry-run, requires extracted-spec logging, simulated catalog validation, and generator/exposure checks. That is sufficient for a later execution packet. |
| MTUH4A-Q10 next sprint and authority | Authorize only a later bounded execution packet; no execution now. | The next packet may prepare exact `unit-add` execution for accepted lanes. It must not create candidate storage, write target-exercise fields, refresh projections, or expose student-facing answer-form training. |

## Accepted For Later Bounded Execution-Packet Preparation

- `A96` Bereken-vraag beantwoorden.
- `A97` Leg-uit-dat antwoord opbouwen.
- `A98` Leg-uit-of antwoord opbouwen.
- `A99` Leg uit met voorbeeld beantwoorden.
- `A80` Noem of geef-aan antwoord geven, with split-if-needed condition.
- `A81` Bron gebruiken in een antwoord, only as source-use modifier plus
  underlying answer form.

## Held Lanes And Boundaries

- `ANS_GRAFISCH_ARCEER_TEKEN` remains held.
- `ANS_MOTIVEER_CLASSIFICATIE` remains held as the explicit Type 4 /
  motiveer / definition-application / classificatie lane.
- `ANS_ANALYSEER_BEOORDEEL` remains held.
- q3 threshold conclusion/unit-direction remains in the EX answer-skill
  overlay route.
- q15 two-step correction-model explanation remains in the EX answer-skill
  overlay route.

## Conditions Before A Later Execution Packet

1. Record the reviewed remote commit/hash and resolve the stale must-push
   status string.
2. Explicitly accept bounded use of `A80`, `A81`, and `A96`-`A99`; keep `A71`
   held.
3. Treat future A-domain growth as requiring an ID-policy or namespace
   decision.
4. Require generator implementation or generator-blocked/non-interactive
   status before any student-facing exposure.
5. Do not write target-exercise `question_type` or `answer_form` fields from
   this gate.
6. Do not create or write answer-skill candidate storage.
7. Run simulated catalog validation and the full validator stack in the later
   execution packet.
8. Validate the proposed exam codes against the syllabus/eindtermen registry.

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

## Explicit Non-Authority

This review authorizes no protected reference mutation, external-source
mutation, machine-reference mutation, unit minting, unit updates, unit splits,
unit deprecation, candidate storage creation, candidate writes,
target-exercise mutation, generated projection refresh, lesson-output mutation,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.
