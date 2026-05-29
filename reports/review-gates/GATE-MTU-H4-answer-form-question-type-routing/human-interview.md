# GATE-MTU-H4 Human Review Record

Recorded: 2026-05-29

Reviewed remote commit:
`38a032346db9a6a1dcb247d52afce745c48863f7`

Review mode: human review recorded from the supplied reviewer verdict. The
review packet showed the full planned question list before review; the reviewer
supplied the calibration answers, all ten review answers, conditions, quality
log, and recommended closure wording in one response. No follow-up ambiguity
remained before closure.

## Verdict

PASS WITH CONDITIONS for answer-form/question-type routing only. No mutation
is authorized by this gate.

The H4 packet is strong enough to close as a routing gate and authorize only a
later bounded CLI-mutation planning packet. It correctly separates:

1. reusable answer-form MTUs;
2. EX answer-skill overlays for correction-model-specific answer construction;
3. later authored-reference `question_type` / `answer_form` mapping fields.

## Calibration Answers

| Calibration | Answer |
|---|---|
| This gate reviews H4 routing only and does not authorize mutation/product use. | Yes. |
| The H4 packet and cited evidence have been pushed before review. | Yes, based on remote fetchability. Closure records reviewed commit `38a032346db9a6a1dcb247d52afce745c48863f7`. |
| Answer-skill candidate storage remains absent and no writes may occur unless a later gate authorizes an exact lane. | Yes. The EX contract keeps candidate storage future/absent, with creation and write authority false. |

## Review Answers

| Question | Decision | Rationale |
|---|---|---|
| MTUH4-Q1 evidence baseline | Accept. | The baseline is sufficient for routing: target exercises lack `question_type`/`answer_form`, extraction evidence has question-type values, H2 deferred answer-form needs remain visible, and EX answer-skill storage is dry-run-only/absent. |
| MTUH4-Q2 architecture boundary | Approve the hybrid architecture. | Reusable MTUs should teach broad procedures; EX overlays should preserve correction-model-specific answer construction. |
| MTUH4-Q3 `ANS_BEREKEN` | Approve for later planning. | The lane procedure matches formula, substitution, intermediate steps, final answer with units, and conclusion. |
| MTUH4-Q4 `leg uit` lanes | Approve separate lanes. | `uitleg_dat`, `uitleg_of`, and `leg uit met voorbeeld` have distinct answer procedures and should not collapse into one broad lane. |
| MTUH4-Q5 `noem/geef aan` and source use | Approve with conditions. | `ANS_NOEM_GEEF_AAN` and `ANS_BRON_GEBRUIKEN` are useful lanes. Split `geef aan` later if evidence shows it behaves differently from `noem`. Treat `bron` as a source-use modifier plus an underlying answer form, not a complete standalone answer form. |
| MTUH4-Q6 graph and analysis lanes | Plan graph/draw/shade now; hold analysis/evaluation. | The graph lane is justified by taxonomy but lacks current extracted mapping evidence. Keep graph planning-only until stronger evidence. Hold `analyseer/beoordeel`. |
| MTUH4-Q7 EX answer-skill overlays | Keep q3 and q15 in EX overlay; no writes. | q3 threshold conclusion/unit-direction and q15 two-step correction-model explanation are item-specific answer-construction needs. |
| MTUH4-Q8 question-type mappings | Accept as later planning input. | The mappings from `berekenen`, `uitleg_dat`, `uitleg_of`, `bron`, and `noem` to lanes are reasonable. No target-exercise writes now. |
| MTUH4-Q9 next sprint authority | Authorize only a later bounded CLI-mutation planning packet; no execution or writes. | The next packet should propose exact answer-form unit IDs/specs and decide what remains in EX overlay. |
| MTUH4-Q10 mutation/product authority now | No. | This packet authorizes no mutation, candidate storage, candidate writes, target-exercise fields, projection refresh, lesson output, or product use. |

## Accepted Planning Lanes

- `ANS_BEREKEN`
- `ANS_LEG_UIT_DAT`
- `ANS_LEG_UIT_OF`
- `ANS_LEG_UIT_MET_VOORBEELD`
- `ANS_NOEM_GEEF_AAN`
- `ANS_BRON_GEBRUIKEN` as source-use modifier plus underlying answer form
- `ANS_GRAFISCH_ARCEER_TEKEN` as planning candidate needing more mapping evidence

## Held Lanes And Boundaries

- `ANS_ANALYSEER_BEOORDEEL` remains held.
- `ANS_MOTIVEER_CLASSIFICATIE` must be added as a held Type 4 planning lane:
  state definition, map definition criteria to context, and conclude yes/no or
  classification.
- `ANS_GRAFISCH_ARCEER_TEKEN` must not become a live MTU until exact examples
  or target-exercise mappings support it.
- q3 threshold conclusion/unit-direction remains in the EX answer-skill
  overlay route.
- q15 two-step correction-model explanation remains in the EX answer-skill
  overlay route.

## Conditions Before The Next H4 Planning Packet

1. Add a held Type 4 / motiveer / classificatie lane so the seven-type
   taxonomy is not silently incomplete.
2. Treat `bron` as source-use plus an underlying answer form, not as a
   standalone complete answer form.
3. Do not mint graph or analysis/evaluation answer-form units until stronger
   mapping evidence exists.
4. Keep the EX overlay boundary strict.
5. Do not create or write `answer-skill-candidates.json`.
6. Do not write target-exercise `question_type` or `answer_form` fields from
   this gate.
7. Record the reviewed remote commit/hash in closure.

## Quality Log

| Issue | Severity | Next action | Proof required |
|---|---:|---|---|
| Type 4 / motiveer/classificatie lane absent | Medium-high | Add held planning lane | H4 closure or next packet lists Type 4 explicitly |
| `bron` can be mistaken for full answer form | Medium | Mark as source-use modifier | Future mapping combines `bron` with underlying answer form |
| Graph lane lacks current extracted mapping evidence | Medium | Keep planning-only | Exact target/example evidence before unit minting |
| EX answer skills could be hidden inside broad MTUs | High | Keep q3/q15 overlays visible | No candidate writes; EX overlay needs remain listed |
| Candidate storage absent | High governance risk if ignored | Keep storage blocked | No `answer-skill-candidates.json` created |
| Target exercise fields absent | Medium | Later authored-reference packet only | Exact before/after diffs if fields are added later |

## Explicit Non-Authority

This review authorizes no protected reference mutation, external-source
mutation, machine-reference mutation, unit minting, unit updates, unit splits,
unit deprecation, candidate storage creation, candidate writes,
target-exercise mutation, generated projection refresh, lesson-output mutation,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.
