# England Local Expert Review Request Packet

Packet ID: `england-local-expert-review-request-packet`
Status: `simulated_request_packet_ready_for_human_review`

## Authority Boundary

Expert feedback is bounded interpretive input for later human review. It is not legal advice, compliance proof, school evidence, official authority, localized output, product adoption, or inspection readiness.

No expert has been contacted. This packet is a simulated, source-bound request only.

## Expert Profile Needed

England economics qualification and inspection/source-boundary reviewer familiar with DfE A level economics subject content, Ofsted school inspection sources, representative AQA Economics 7136 specification/assessment surfaces, and SEND/accessibility terminology.

## Sources In Scope

| source_id | state | authority | role | forbidden inference |
|---|---|---|---|---|
| `england-ofsted-eif-2025` | `unchanged` | Ofsted | inspection/evaluation boundary | Does not approve product output or prove inspection readiness. |
| `england-ofsted-operating-guide-2025` | `unchanged` | Ofsted | inspection evidence-gathering boundary | Does not authorize evidence-pack generation or school evidence sufficiency claims. |
| `england-dfe-a-level-economics-content` | `unchanged` | Department for Education | qualification subject-content boundary | Does not approve an exam-board specification or 4veco tasks. |
| `england-aqa-7136-subject-content` | `unchanged` | AQA | representative awarding-body subject content | Does not represent all awarding bodies or all England. |
| `england-aqa-7136-scheme-assessment` | `unchanged` | AQA | assessment objective and paper-form boundary | Does not generate AQA exam questions or assessment items. |
| `england-aqa-economics-command-words` | `unchanged` | AQA | representative command-word meanings | Does not authorize student-facing assessment output. |
| `england-aqa-7136-assessment-resources` | `unchanged` | AQA | representative specimen paper and mark-scheme source layer | Does not copy or generate protected assessment material. |
| `england-send-code-practice` | `unchanged` | Department for Education and Department of Health and Social Care | SEND/accessibility terminology boundary | Does not prove accessibility compliance or school support sufficiency. |

## Allowed Questions

| question_id | source_ids | allowed question | forbidden question |
|---|---|---|---|
| `england-q-dfe-content` | `england-dfe-a-level-economics-content` | Interpret whether Book 1 Chapter 1.2 and 1.3 economics concept placement is consistent with the DfE A level economics subject-content boundary. | Do not approve any exam-board specification, localized edition, student task, or 4veco material. |
| `england-q-ofsted-eif` | `england-ofsted-eif-2025` | Interpret the Ofsted inspection/evaluation boundary that should remain visible if later internal overlay planning references quality or inspection language. | Do not provide inspection-readiness, compliance, evidence-pack, or school judgment claims. |
| `england-q-ofsted-operating-guide` | `england-ofsted-operating-guide-2025` | Interpret the evidence-gathering boundary in the Ofsted operating-guide source for internal blocker display only. | Do not say 4veco output would satisfy inspection evidence or school-owned evidence needs. |
| `england-q-aqa-subject` | `england-aqa-7136-subject-content` | Interpret representative AQA 7136 subject-content boundaries that may affect Book 1 1.2/1.3 concept mapping. | Do not treat AQA as all awarding bodies or generate exam-board-ready material. |
| `england-q-aqa-assessment` | `england-aqa-7136-scheme-assessment`, `england-aqa-economics-command-words`, `england-aqa-7136-assessment-resources` | Interpret assessment-form, command-word, and resource-index implications that should be retained as internal constraints. | Do not generate exam-ready exercises, mark schemes, assessment items, or protected assessment content. |
| `england-q-send-accessibility` | `england-send-code-practice` | Interpret SEND/accessibility terminology that should frame support and accommodation boundary questions. | Do not state accessibility compliance, legal sufficiency, support sufficiency, accommodation sufficiency, or individual adjustment sufficiency. |
| `england-q-england-only` | `england-ofsted-eif-2025`, `england-dfe-a-level-economics-content` | Identify any England-only phrasing needed to prevent whole-UK or all-awarding-body overclaims. | Do not generalize to Scotland, Wales, Northern Ireland, whole UK, or all awarding bodies. |
| `england-q-book1-placement` | `england-dfe-a-level-economics-content`, `england-aqa-7136-subject-content` | Flag any Book 1 1.2/1.3 concept-placement uncertainty that a later internal transformation sprint must preserve. | Do not rewrite or localize Book 1 paragraphs, exercises, answers, or assessment prompts. |

## Forbidden Questions

- legal advice
- compliance claims
- approval claims
- inspection-readiness claims
- school implementation evidence
- school-owned evidence
- student evidence
- student data
- personal data
- support sufficiency claims
- accommodation sufficiency claims
- accessibility/legal sufficiency claims
- product adoption claims
- official-source substitution
- localized output generation
- exam-ready exercise generation
- Do not generalize England to the whole UK, Scotland, Wales, Northern Ireland, all awarding bodies, all schools, or all local implementation contexts.

## Expected Response Format

- `reviewer_role`
- `jurisdiction`
- `source_id`
- `source_state_seen`
- `question_id`
- `answer_type`
- `interpretation`
- `confidence`
- `uncertainty`
- `cited_source`
- `forbidden_claims_disclaimed`
- `does_not_authorize`
- `proof_required_to_use`

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| England local expert request packet is complete and source-bound. | `core_requirement_met` | Nothing for human review once checker, specialists, final lead, CI, branch protection, and PR readiness pass. | Human review of this internal request packet. | Checker PASS, source/expert-scope review PASS, final lead PASS, exact-head readiness, green CI, and owner authorization. |
| Expert contact and downstream authority remain blocked. | `scale_blocker` | Expert contact, expert substitution, localized output, school/public/product output, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims. | A later local expert contact pilot only after human authorization. | Separate owner authorization for contact pilot and strict response intake. |
