# International Commonalities And Differences

Status: complete_internal_analysis
Date: 2026-06-21
Sprint: `GOAL-IQS-FOUNDATION-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-authorisation-note.md`
- Dutch closure basis: PR #124 accepted and merged under `CLOSE_INTERNAL_SYSTEM`.

## Non-Negotiable Requirements

- Cite the product end-state and original sprint/gate specification.
- Name non-negotiable requirements before conclusions.
- Include a core-requirement checklist.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry any missing core requirement as PASS WITH FLAGS.
- Keep all country-compliance, approval, public, school-facing, package/CI/dashboard/quality-ref, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, and inspection-readiness authority blocked.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| `official_source_profiles`: Nine jurisdiction profiles use official-source anchors and record allowed use plus forbidden inference. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `governance_boundaries`: Flanders, England, Germany, Spain, and the United States retain explicit subnational or federal/state boundaries. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `common_core_matrix`: The shared common-core matrix distinguishes portable product-pedagogy from local overlay needs. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `differences_matrix`: The differences matrix names material divergences and the architecture response. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `overlay_architecture`: The overlay architecture separates shared core, local curriculum/exam overlays, source-evidence overlay, and school-owned evidence. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `book_portability_check`: Book 1 Chapters 1.2 and 1.3 are tested only as a bounded internal portability check. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `blocked_authority`: All forbidden authority flags remain false and visible. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `single_decision`: The foundation chooses exactly one allowed decision. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `human_review_stop`: The packet returns for human review before any country edition, public/school-facing, product, or compliance step. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |

## Common-Core Matrix

| Category | Classification | Common core | Overlay need | School-owned boundary |
|---|---|---|---|---|
| Curriculum coherence | `near_universal_common_core` | A shared textbook can expose coherent sequencing, chapter goals, prerequisite progression, and links from concepts to exercises. | Jurisdiction overlays must map local subject names, programme goals, standards codes, and mandatory sequence expectations. | Schools still own enacted curriculum, timetable choices, local schemes of work, and inspection conversations. |
| Subject knowledge and progression | `near_universal_common_core` | Scarcity, choice, opportunity cost, markets, demand/supply reasoning, data interpretation, and economic argumentation recur across the reviewed sources. | Local overlays must add jurisdiction-specific vocabulary, examination taxonomies, and prescribed examples. | Textbook evidence does not prove student mastery or teacher diagnosis. |
| Didactic quality | `widely_shared_but_locally_interpreted` | Worked examples, guided practice, independent practice, retrieval, feedback prompts, and misconception handling are portable product-design patterns. | Inspectorate language and classroom evidence expectations vary strongly by jurisdiction. | Observed teaching quality, lesson adaptation, and classroom climate are school-owned. |
| Assessment alignment | `widely_shared_but_locally_interpreted` | A shared bank can support formative checks, calculation/graph/source tasks, and argument construction. | Exam-code mapping, mark schemes, assessment objectives, task forms, grading language, and national/state exam structures are local. | Summative validity, PTA/school assessment policy, and exam-board approval cannot be supplied by the textbook alone. |
| Student support and differentiation | `widely_shared_but_locally_interpreted` | Scaffolding, hints, alternative representations, and difficulty layering can be designed into the shared product. | Local SEN/SEND/inclusion/accommodation language and required documentation differ. | Individual support plans, intervention records, accommodations, and learner monitoring remain school-owned. |
| Accessibility and inclusion | `widely_shared_but_locally_interpreted` | Semantic structure, readable layouts, text alternatives, keyboard support, contrast, and inclusive examples can be common product requirements. | Legal standards, terminology, and proof expectations differ by country/state. | Accessibility certification, legal compliance, and individual accommodation evidence remain outside this foundation. |
| Quality assurance | `near_universal_common_core` | Source traceability, review records, validator checks, correction logs, and versioned evidence are portable product-quality controls. | Each jurisdiction needs source freshness and authority-strength metadata. | School self-evaluation, governance, and official external review remain local/school-owned. |
| Improvement cycle | `near_universal_common_core` | Finding classification, owner next action, proof required to close, and review-after-correction are portable. | Local accountability cycles and inspection timelines vary. | School improvement planning and accountable implementation are not textbook outputs. |
| Safeguarding/product-school boundaries | `school_owned_or_not_textbook_owned` | The shared product can keep forbidden claims visible and avoid converting product evidence into school evidence. | Safeguarding, privacy, and accountability vocabulary must be jurisdiction-specific. | Safeguarding practice, student data, school policy, and competent-authority judgement remain outside the textbook. |

## Differences Matrix

| Divergence | Finding | Architecture response |
|---|---|---|
| Inspection versus accreditation | The Netherlands, Flanders, England, Italy, Poland, and parts of Spain use official inspection/supervision or national quality frameworks; the United States relies on federal/state accountability plus state/local standards and optional accreditation, not a national inspection regime. | Keep school accountability evidence outside the shared textbook and route it to Layer 4. |
| National versus regional/state governance | Flanders is subnational, Germany and the United States require federal/context plus state/Land examples, and Spain requires autonomous-community overlays beyond national minimums. | Require exact jurisdiction overlay descriptors and forbid generalized country claims where governance is subnational. |
| Prescribed curriculum versus outcome frameworks | Some systems specify detailed programmes or examination content; others combine broad standards, competences, local curriculum design, and school-owned implementation. | Layer 1 stores portable pedagogy; Layer 2 stores local curriculum mapping. |
| Central examinations versus local assessment | The Netherlands, France, Poland, and England use nationally regulated qualification or central-exam structures; US state examples and local districts vary; school assessment remains local in all cases. | Layer 3 stores exam/assessment overlays and never claims summative validity from textbook tasks alone. |
| School accountability requirements | Quality frameworks ask for enacted curriculum, teaching, support, safety, results, improvement, and leadership evidence that a textbook can support but not supply. | Layer 4 is school-owned and remains blocked for product claims. |
| Basic-skills/citizenship requirements | Economic literacy often connects to civic, financial, enterprise, and data-literacy aims, but labels and obligations differ. | Common core may include financial/economic reasoning; local overlays map citizenship/basic-skills labels. |
| Accessibility and inclusion expectations | Accessibility and inclusion are widely shared goals, but legal language, proof, and accommodations are local. | Common product accessibility standards are allowed; compliance claims remain blocked. |
| Evidence and documentation expectations | Every reviewed governance system values evidence, but the form ranges from inspection evidence to exam specifications, school self-evaluation, and state standards documentation. | All reports must preserve authority strength, allowed use, forbidden inference, and proof required to close. |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| International common core is product-pedagogical, not jurisdiction-compliance. | `core_requirement_met` | Country-compliance or approval claims. | Proceeding with common core and overlays as an internal analytical architecture. | Keep overlays explicit and all blocked authority flags false. |
| Regional/state governance is material. | `minor_carry_flag` | All-Belgium, whole-UK, single-Germany, or national-US claims. | Representative overlay foundation. | Separate jurisdiction-specific source refresh before any local edition work. |
