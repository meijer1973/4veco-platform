# INSPECT-9 Dutch Evidence Gap Closure Plan

Status: report-only gap-closure plan
Date: 2026-06-10
Sprint: `INSPECT-9`

## Scope And Safe-Use Note

This report converts the INSPECT-8 readiness audit into proof requirements and
correction routes for the Dutch-only product-side evidence basis.

This is not an inspection judgement, compliance claim, approval, certificate,
OP0 completion claim, school-obligation claim, PTA-validity claim,
summative-validity claim, classroom-implementation proof, or school-SKA claim.
School-owned evidence remains school-owned.

Lesson evidence was inspected read-only from:

```text
../4veco-lessen
```

Lesson evidence commit:

```text
b858bca602bb7afdf75cad7c3ecc1a79b31fbb76
```

## Executive Planning Decision

Do not generate an additional Dutch evidence pack yet.

Book 1 Chapter 1.2 `Vraag` is the right first gap-closure candidate, but it is
not pack-ready. It needs target-record finality review, an integration-target
decision for `1.2.4`, exam-code linkage decisions, target-equivalent proof
design and review, and stronger accessibility/support evidence before later
evidence-pack work.

Book 1 Chapter 1.1 first-three paragraphs may remain the control scope only.
Before re-use as more than a control baseline, it needs explicit remediation
decisions for missing target-registry exam-code links, migrated target-record
status, local-only `1.1.2` target-equivalent authority, and the pending-review
status of the rendered `1.1.2` proof packet.

## Input Evidence

Primary evidence:

- `reports/inspection-standards/dutch-evidence-scale-readiness.md`
- `reports/inspection-standards/dutch-evidence-scale-readiness.json`
- `references/authored/course-target-exercises.json`
- `references/external/syllabus-eindtermen.json`
- `references/external/exam-questions.json`
- `references/data/alignment-graph.json`
- `references/data/inspection-standards/source-register.json`
- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/gate-closure.md`
- `reports/json/exit-ticket-workbench-112-rendered-1-proof.json`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md`
- `reports/review-gates/GATE-PV-G4-lesson-regression/gate-closure.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`

## Chapter 1.2 Candidate Matrix

| Paragraph | Current evidence | Gap state | Correction route before pack work |
|---|---|---|---|
| `1.2.1 Individuele vraag` | Target record exists, but status is `migrated_from_v4_needs_v5_review`; no target-registry exam codes; Part A review and quality-ref exist; quality-ref cites D1.1, D1.2, and D3.1 as lesson goals; companion materials are absent in the quality-ref. | Weak target finality; missing exam-code decision; missing target-equivalent proof; weak accessibility/support evidence. | Run exact target-record v5 review; decide whether D1.1, D1.2, D3.1, a narrower set, or no-code-with-rationale belongs in the target registry; define a target-equivalent proof task covering willingness-to-pay, individual demand, buy/no-buy rule, and consumer surplus; run focused accessibility/support evidence review. |
| `1.2.2 Vraagfactoren` | Target record exists, but status is `migrated_from_v4_needs_v5_review`; target registry links `D1.9`; official-question projection contains D1.9 examples; Part A review exists with local flags; quality-ref cites D1.2, D1.4a, and D1.4b; companion materials are absent in the quality-ref. | Weak target finality; existing exam link needs operation-chain confirmation; missing target-equivalent proof; weak accessibility/support evidence. | Run exact target-record v5 review; confirm whether D1.9 is sufficient or whether D1.4a/D1.4b coverage must be recorded separately; resolve or carry review flags; define proof task for movement versus shift, factors, substitutes/complements, and graph consequence; run focused accessibility/support evidence review. |
| `1.2.3 Van individuele naar collectieve vraag` | Target record exists, but status is `migrated_from_v4_needs_v5_review`; target registry links `A2.9`; syllabus row A2.9 concerns use of equations, descriptive statistics, and graphs in economic questions; quality-ref cites D1.3; Part A review exists with non-blocking flags; companion materials are absent in the quality-ref. | Weak target finality; existing A-domain link needs D-domain alignment decision; missing target-equivalent proof; weak accessibility/support evidence. | Run exact target-record v5 review; decide whether the target registry needs D1.3 in addition to or instead of A2.9; define proof task for horizontal summation, table/formula/graph representation, kink/dropout logic, and answer-form match; run focused accessibility/support evidence review. |
| `1.2.4 Gemengde opgaven: vraag` | Target record is `placeholder_needs_review`; no target-registry exam codes; generated consolidation opgaven/answers and review evidence exist; quality-ref says no separate theory paragraph is expected and cites D1.3 plus D1.1-D1.4; one orphaned asset is recorded. | Placeholder target; missing integration-target authority; missing exam-code/no-code decision; missing target-equivalent proof; weak accessibility/support evidence. | Create or review an exact integration target for the mixed-practice paragraph, including no-new-theory rationale and skill coverage from 1.2.1-1.2.3; decide link/no-link/defer for D1.3/D1.4/D1.1-D1.4 style evidence; resolve or carry the orphaned-asset flag; define integrated proof requirements without turning consolidation into summative assessment. |

## Chapter 1.1 Control-Scope Remediation Decision

Chapter 1.1 remains usable as the accepted first-three control scope only
because INSPECT-7 produced a bounded sample and tri-role external review
returned `MORE_THAN_SATISFIED`. It is not authority for broad scale.

| Paragraph | Current evidence | Required remediation before stronger re-use |
|---|---|---|
| `1.1.1` | Target record is migrated and has no exam codes; Part A and companion evidence exist with flags; target-equivalent claim remains unapproved. | Exact v5 target finality review; exam-code/no-code decision; target-equivalent proof design and review if any closure language or pack-strength claim would rely on this paragraph. |
| `1.1.2` | Target record is migrated and has no exam codes; Part A and companion evidence exist with flags; GATE-L1.7B-Q2 accepts only exact local target-equivalent proof with flags; rendered proof packet is pending review and authorizes no product use or broad rollout. | Exact v5 target finality review; exam-code/no-code decision; keep local-only target-equivalent authority narrow; do not use rendered proof as reviewed authority until its own review closes. |
| `1.1.3` | Target record is migrated and has no exam codes; Part A and companion evidence exist with flags; first-three check-surface packet is prepared but not closed; target-equivalent proof remains unapproved. | Exact v5 target finality review; exam-code/no-code decision; close or supersede first-three check-surface review before relying on it; separate target-equivalent proof review for graph/table target operations. |

## Proof Requirements By Gap Type

| Gap type | Proof required before gap can close |
|---|---|
| Target-exercise finality | Exact target-record review artifact for the paragraph; reviewer decision; reviewed operation chain; answer-form expectations; source references; allowed state transition from migrated/placeholder to reviewed status. |
| Exam-code linkage | Official syllabus or official-question evidence; operation-level comparison to the target exercise; accepted outcome of `link`, `no-code-with-rationale`, or `defer`; explicit note that syllabus prose alone does not mint targets or MTUs. |
| Target-equivalent proof | Reviewed proof task matching the target operation chain and cognitive level; answer forms matching the target exercise; no answer-giving scaffold before attempt; local/generalized authority boundary; screenshots or proof JSON where the surface is interactive. |
| Accessibility evidence | Product-side evidence for alt text, contrast/theme, mobile layout, keyboard/focus, semantic structure, inclusive language, and absence of internal-code exposure where relevant; route-local proof must stay route-local. |
| Support/differentiation evidence | Product-side route, prerequisite, hint, advisory check, remediation, and enrichment evidence; explicit separation from school monitoring, accommodations, care plans, and support decisions. |
| Source freshness | Source ID, retrieved date, active/stale status, authority boundary, and owner next action; stale sources may support historical context but not current stronger claims. |
| Product/school boundary wording | Per category, name 4veco evidence, school-owned evidence still needed, and forbidden inference. |

## Correction Routes And Owners

| Route | Owner surface | Applies to | Output needed before closure |
|---|---|---|---|
| `TARGET-FINALITY-1.2` | Future target-review sprint or packet | `1.2.1`, `1.2.2`, `1.2.3` | Review artifact per target record and authorised state transition. |
| `INTEGRATION-TARGET-1.2.4` | Future target-review sprint or packet | `1.2.4` | Reviewed integration target or explicit defer/no-new-theory rationale. |
| `EXAM-LINK-1.2` | Future exam-linkage decision packet | `1.2.1`, `1.2.4`, plus confirmation for `1.2.2` and `1.2.3` | Link/no-code/defer decision with official-source evidence and operation comparison. |
| `TARGET-EQUIV-1.2` | Future proof-design and review gate | Chapter 1.2 | Proof task specifications, rendered/proof artifacts if interactive, and review closure. |
| `ACCESS-SUPPORT-1.2` | Future focused accessibility/support review | Chapter 1.2 | Rubric evidence across sublabels, with route-local limitations. |
| `CONTROL-1.1-REMEDIATION` | Future control-scope remediation decision | `1.1.1`, `1.1.2`, `1.1.3` | Decision on exam-code/no-code, target finality, and target-equivalent authority before stronger re-use. |
| `SOURCE-FRESHNESS-DUTCH` | Future source/profile maintenance step | Dutch source register, profile, evidence reports | Freshness labels, recheck interval, stale-source owner next action. |

## Accessibility Evidence Rubric

For Chapter 1.2, a later evidence-pack candidate needs at least product-side
evidence for:

- meaningful alt text or text-equivalent context for instructional visuals;
- contrast/theme evidence where dark or themed surfaces are cited;
- mobile layout evidence if web surfaces are cited;
- keyboard/focus evidence where interactive surfaces are cited;
- semantic structure for generated pages or documents;
- inclusive student-facing language;
- absence of internal-code exposure in student-facing route surfaces.

Screenshot evidence can support route-local accessibility evidence. It must
not be treated as full accessibility compliance.

## Support/Differentiation Evidence Rubric

For Chapter 1.2, a later evidence-pack candidate needs product-side evidence
for:

- prerequisite or start-state checks;
- practice progression from supported to independent work;
- explicit hints or repair routes where support is claimed;
- advisory short-check or next-action evidence if check surfaces are cited;
- differentiated practice or extension evidence;
- separation between product route advice and school-owned support decisions.

This evidence does not prove school monitoring, interventions,
accommodations, care plans, or classroom implementation.

## Stale Source Freshness Policy

Minimum policy for later Dutch evidence work:

- Official Dutch inspection, curriculum, and exam sources must cite
  `source_id`, retrieved date, source status, and authority boundary from the
  source register or a reviewed successor.
- Recheck official Dutch inspection/curriculum/exam sources before any new
  teacher/school-facing pack if the retrieved date is older than 180 days, if
  the school/exam year changes, or if the source itself signals a framework or
  syllabus update.
- Generated lesson and proof evidence must cite the lesson commit, generation
  or review date, and authority status.
- Quality-ref and paragraph-review evidence older than the candidate pack
  should be treated as historical unless the report records a freshness
  recheck or a decision to carry the flag.
- Pending-review proof may be cited as pending evidence only; it cannot close
  proof gaps.

The current Dutch source register/profile baseline was retrieved on
2026-06-08. Chapter 1.2 quality refs were generated on 2026-04-23 and record
`standards_verified: 2026-04-12`; they support artifact/review history but do
not by themselves close current target-equivalent, accessibility, or support
proof gaps.

## Product/School Boundary Wording

| Category | 4veco product evidence | School-owned evidence still needed | Forbidden inference |
|---|---|---|---|
| Curriculum offer | Target records, generated lesson artifacts, reviewed target-finality records when present, official source links. | Full school curriculum plan, scheduling, local policy, implementation choices. | Do not infer final curriculum evidence from migrated target records. |
| Subject-material basic skills | Economics calculation, graph/table/source, reasoning, and answer-construction evidence. | School-wide Dutch language, mathematics/arithmetic, citizenship policy and practice. | Do not state complete OP0/basic-skills proof. |
| Didactic quality | Paragraph reviews, quality refs, Part A/companion reviews, procedure/visual evidence. | Actual teacher practice, adaptation, classroom interaction. | Do not flatten PASS WITH FLAGS into unconditional pass. |
| Student development/support | Product route advice, hints, practice progression, advisory checks. | Monitoring, care plans, accommodations, interventions, support decisions. | Do not treat product route advice as school support evidence. |
| Assessment/closure | Target exercises, answer models, reviewed local target-equivalent proof where present. | PTA, grading, summative assessment policy, transition decisions. | Do not infer target-equivalent closure from target presence or answer-model presence. |
| Accessibility/inclusion | Alt text, contrast/theme, mobile, focus/keyboard, semantic, inclusive-language evidence where reviewed. | Individual accommodations, device access, school accessibility policy. | Do not treat screenshots or route-local proof as full accessibility proof. |
| Quality assurance | Validators, reports, review records, lead reviews, closure logs. | School governance, self-evaluation, improvement planning, inspection dialogue. | Do not treat product QA as school SKA evidence. |

## Quality Log

| Issue | Category | Severity | Evidence | Next action | Proof required to close |
|---|---|---:|---|---|---|
| Chapter 1.2 target records are not final | target-exercise-finality-gap | high | `references/authored/course-target-exercises.json` | Plan exact v5 review for `1.2.1`-`1.2.3` and integration review for `1.2.4`. | Review artifact per target record with allowed state transition. |
| Chapter 1.2 exam linkage is incomplete or unconfirmed | exam-code-linkage-gap | high | target registry, syllabus projection, exam-question projection | Decide link/no-code/defer for `1.2.1` and `1.2.4`; confirm existing `1.2.2` and `1.2.3` links. | Official-source-backed operation comparison. |
| Chapter 1.2 has no reviewed target-equivalent proof | target-equivalent-proof-gap | high | INSPECT-8 readiness report, review gates | Plan proof task requirements before any pack work. | Reviewed local proof with operation-chain and answer-form match. |
| Chapter 1.2 companion/accessibility/support evidence is weak | accessibility-evidence-gap | high | 1.2 quality refs and reviews | Run focused evidence review before pack scale. | Rubric evidence for accessibility and support sublabels. |
| Chapter 1.1 control scope remains weak for stronger re-use | exam-code-linkage-gap | high | INSPECT-8 report, target registry, gate closures | Keep as control only or plan remediation. | v5 target review, exam-code/no-code decisions, and target-equivalent proof boundaries. |
| Dutch source freshness policy is not yet operationalized | dutch-source-gap | medium | source register, profile, quality refs | Adopt freshness labels before future pack work. | Source type intervals, owner next action, and stale-source treatment. |

## School-Owned Evidence Still Needed

- Full school curriculum plan, scheduling, and implementation choices.
- Classroom enactment, teacher adaptation, and interaction evidence.
- School-wide Dutch language, mathematics/arithmetic, and citizenship
  basic-skills policy and practice.
- Student monitoring, interventions, accommodations, care plans, and support
  decisions.
- PTA, grading, summative assessment policy, transition decisions, and formal
  assessment-validity evidence.
- School governance, self-evaluation, improvement planning, board
  accountability, and inspection-dialogue evidence.

## Unsafe-Claim Risks

- Do not infer final-reviewed curriculum evidence from migrated target
  records.
- Do not infer target-equivalent closure from target-exercise or answer-model
  presence.
- Do not generalize the exact local `1.1.2` proof to other paragraphs.
- Do not treat generated artifact presence as reviewed lesson quality.
- Do not treat review screenshots or route-local checks as full accessibility
  proof.
- Do not treat product route/check surfaces as school monitoring or support
  evidence.
- Do not treat product QA records as school SKA evidence.
- Do not use consolidation or test-prep evidence to make PTA,
  summative-validity, grading, or school-obligation claims.

## Validation Summary

This report created no evidence packs, no generator, no package script, no
CI/build gate, no dashboard gate, no quality-ref integration, no Scale Gate
integration, and no lesson-output mutation.

No personal data was processed. No non-Dutch standards work was started.

## Next Action

Run the planned INSPECT-9 validation and lead review. If lead review passes,
the next product decision should be a future target/exam-linkage remediation
sprint for Chapter 1.2, not additional evidence-pack generation.
