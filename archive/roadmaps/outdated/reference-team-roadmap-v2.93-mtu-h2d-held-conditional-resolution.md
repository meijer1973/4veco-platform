# References Team Roadmap

Generated: 2026-04-23
Adopted main roadmap: 2026-04-25
Last strategic update: 2026-05-28
Roadmap ID: `references-team-roadmap`
Roadmap version: `v2.93-mtu-h2d-held-conditional-resolution`
Roadmap status: `active`
Version index: `docs/roadmaps/roadmap-version-index.json`
Scope: `references/`, `build-scripts/references/`, `build-scripts/reports/`, reference dashboards, and generated reference reports under `reports/`

## Exam Ingestion North Star

The long-term reference-platform goal is that a new official CvTE economics
exam question can be ingested as an authoritative external exercise record,
including prompt, source material, figures/tables/graphs, official correction
model, point allocation, and answer-construction requirements.

For each ingested exam question, the platform must be able to:

1. decompose the question into required micro-teaching units;
2. distinguish content concepts, calculation operations, graphical operations,
   source-reading operations, reasoning operations, and answer-writing
   operations;
3. compare those requirements against the existing MTU registry and
   procedure/visual registry;
4. classify gaps as existing-unit mapping, missing unit, merge/split candidate,
   source-annex extraction gap, answer-model extraction gap, or defer;
5. produce a lesson-build handoff showing what a paragraph must teach for
   students to answer the exam question according to the official correction
   model.

Do not mint units from syllabus prose alone. Exam questions, official
correction models, and reviewed target exercises are stronger evidence than
abstract syllabus descriptions.

## Sprint Ledger

The currently-active sprint sits at the top. Future sprints follow in sequence.
Closed sprints are recorded separately in the "Closed Sprints" section below.
New and currently-active sprint plans live beside their sprint logs under
`reports/sprints/`. Archived plans under `docs/sprints/` remain valid for
legacy bundles only.

| Sprint | Name | Completed | Current State |
|--------|------|-----------|---------------|
| GATE-MTU-H2D | Solo q1-q3 Held/Conditional Lane Human Review | no | **ACTIVE OPERATIONAL NEXT ACTION.** Run the formal human review for `reports/review-gates/GATE-MTU-H2D-held-conditional-lanes/review-packet.md` before any further Solo q1-q3 MTU execution. Review whether `A12` may use the revised update spec that retains `A2.11`; whether `A20` stays held for a separate split/deprecate/replacement and affected-mapping packet; whether `A88` and `A89` may become zero-needs units; whether `A90` should narrow to the linear GO-rule route; whether `A92` may proceed only after `A89`; whether `A93` may drop `A66` and keep broader incidence in MTU-H3; and whether generator implementation or explicit generator-blocked status is required before student-facing exposure. This gate may record reviewed lane dispositions only. It does not authorize protected reference mutation, external-source mutation, machine-reference mutation, unit minting, unit update execution, unit split execution, candidate writes, lesson-output mutation, target-exercise promotion, CP-6/Year-1 closure, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use. |
| LESSON-SCALE-1 | Lesson Companion Pre-Scale Gates Tracking | no | **TRACKING DEPENDENCY, NOT A REFERENCE EXECUTION SPRINT.** Lesson L1.7A closed PASS WITH FLAGS and rejected broad companion scaling. Closed lesson prerequisites now include `L1.7B-C`, `L1.7B-R`, `GATE-L1.7B`, `L1.7C-0`, `L1.7C`, `L1.7D`, `L2.0`, `L1.7C-MATH`, `L1.7B-MAP`, and `L1.7B-P23`. Platform `GAME-UX-1` supplied shared skill-map runtime support; platform `GAME-UX-2` supplied the source-controlled `1.1.1` checkpoint engine/output support. `L1.7C-MATH` restored the scoped skill-tree math game as primary `Rekenen`; `L1.7B-MAP` fixed checkpoint metadata scope to `B01/B02`, removed `A04`, recorded target-exercise skills as `A43/B01/B02`, and kept `targetReadinessEvidence: false`. Lesson `L1.7B-P23` accepted the stop/handoff decision: current exit-ticket task types are choice-only and cannot honestly check `1.1.2` calculation/index or `1.1.3` graph/table operation chains. Platform task-type expansion is now required before lesson `L1.7B-Q2` can produce target-exercise-readiness evidence for calculation or graph/table paragraphs. EX-7 is resolved as a validator/dry-run CLI implementation only. Reference/product planning must not treat the lesson companion pipeline as scale-approved until platform task-type support, lesson `L1.7B-Q2`, `GATE-L1.7B-Q2`, `REV-STD-1`, minimal curriculum-versioning readiness, and Scale Gate 1 resolve or are explicitly waived while preserving blocks on diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, and PV machine promotion. |
| GAME-UX-3 | Exit Ticket Task-Type Expansion | no | **LESSON PLATFORM HANDOFF / PLANNED DEPENDENCY.** L1.7B-P23 closed as a correct stop/handoff because choice-only checkpoint output would weaken the exit-ticket specification for `1.1.2` and `1.1.3`. Platform support must add reviewed task families and validation for numeric input, calculation/work capture, percent/index notation, short constructed response, table-value selection, graph reading, and graph construction or axis/point-placement checks before generated readiness checkpoints can be produced for calculation or graph/table paragraphs. This row authorizes no source-data mutation, generated lesson output, `Check` activation, target-exercise promotion, diagnostics, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, Scale Gate 1, or broad companion scaling. |
| MTU-H3 | Incidence Pass-Through Skill Family Review | no | Planned after MTU-H2 evidence or in parallel as a separate review lane if authorized. Review whether D07 should split or generalize into tax incidence, subsidy incidence, cost-shock pass-through, graphical wedge/area recognition, elasticity explanation, and misconception handling. No unit minting or D07 refactor is authorized until a human-reviewed CLI-governed lane names exact changes and rollback. |
| MTU-H4 | Answer-Form MTUs And Question-Type Mapping | no | Planned after MTU-H1. Define a governed answer-form route for `bereken`, `leg uit`, `leg uit met voorbeeld`, `analyseer`, `arceer/grafisch`, `geef aan`, and related exam verbs, and map them to existing `question_type` values. This row is contract/review work until a later CLI-governed mutation path is explicitly authorized. |
| MTU-H5 | MTU Mapping Regression Validator | no | Planned after MTU-H1/H2/H3/H4 produce enough reviewed mapping rules. Build a regression check for missing correction-model operations, over-triggered prerequisites, calculus/function-construction false positives, incidence questions without incidence MTUs, question words without answer-form MTUs, scale-factor gaps, and missing misconception tags. No candidate writes or protected mutation are authorized. |
| MTU-H6 | Hardened MTUs Into Student Routes | no | Planned only after the relevant MTU/answer-form/incidence decisions are reviewed and implemented through governed paths. Feed hardened operation chains into instapquiz routing, uitleg vaardigheden, skill-tree/procedure games, practice, exit-ticket coverage, answer-model generation, and review gates while preserving blocks on diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, and PV machine promotion. |
| REF-CT3 | Year-2 Skeleton | no | Planned after the CP.6a-CP.6f remediation lanes and the bounded EX-0/EX-1/EX-2 exam-ingestion implementation track produce enough evidence for a responsible CP-6 closure proposal, explicit hold, or Year-2 anchoring handoff. Prepare Year-2 skeleton with CvTE-vwo anchor status and `concept_orphan` flags for CP-7; do not treat the rough three-year blueprint as authoritative. |
| R7.6 | RAG Quality Hardening | no | Planned. Close R7.4 follow-ups, split target-exercise chunks, expand retrieval eval coverage, backfill evidence anchors, and improve approved/pending/diagnostic labels. |
| R14.1 | Curriculum Versioning | no | Planned earlier in the sequence. Track active v5, archived v4, the non-authoritative three-year planning sketch, built lesson outputs, and migrated/not-final target exercises so reports and retrieval do not silently mix incompatible source states. |
| Sprint 12 | Exam And Target Exercise Decomposition Backfill | no | Planned after schema/overlay work. Backfill exercise metadata for the 349 exam questions and 49 target exercises through protected-source-safe overlays. |
| Sprint 13 | Composition Pattern Registry | no | Planned. Define reusable exercise-composition patterns for internal authoring support, not automatic student-facing publication. |
| Sprint 14 | C-to-B Promotion Workflow | no | Planned only after schema audit, owned-source registry, exercise overlays, D04/unit-design status, R7.6, R14.1, and precision lint path are ready. |
| Product Gate | Re-Evaluate R10-R13 Product Surfaces | no | Blocked. Diagnostics, adaptive routing, student-facing AI, teacher cockpit deployment, automatic sequencing, mastery, and summative uses remain out of scope until data-quality gates justify them. Lesson L1.7A explicitly rejected broad companion scaling; `L1.7B-R` and `GATE-L1.7B` accepted only the non-summative `1.1.1` checkpoint boundary; `L1.7C-MATH` restored the old skill-tree math route; `L1.7B-MAP` fixed checkpoint metadata alignment but kept `targetReadinessEvidence: false`; and `L1.7B-P23` accepted a stop/handoff rather than generating weak choice-only checks for calculation and graph/table paragraphs. GATE-EX5 closed PASS WITH CONDITIONS as design-contract review only; EX-6 completed validator/CLI planning without candidate writes; GATE-EX6 closed PASS WITH CONDITIONS for validator/dry-run CLI implementation only; and EX-7 implemented validators and dry-run-only CLIs without candidate storage or writes. Broad lesson-companion scaling remains blocked until platform task-type support, lesson `L1.7B-Q2`, `GATE-L1.7B-Q2`, `REV-STD-1`, and Scale Gate 1 establish the remaining readiness, review-standard, curriculum-versioning, and game-row scaling quality. |

## Closed Sprints

| Sprint | Name | Completed | Current State |
|--------|------|-----------|---------------|
| MTU-H2D | Solo q1-q3 Held And Conditional Lane Resolution | yes | Completed as a non-mutating resolution sprint. Added `reports/mtu-hardening/solo-q1-q3-held-conditional-resolution.*`, `reports/review-gates/GATE-MTU-H2D-held-conditional-lanes/review-packet.*`, `build-scripts/references/check-mtu-h2d-held-conditional-resolution.js`, and sprint result logs. The packet revises `A12` to retain `A2.11`, keeps `A20` held for a separate split/deprecate/replacement and affected-mapping packet, revises `A88` and `A89` to zero-needs routes, narrows `A90` to the linear GO-rule route, keeps `A92` dependent on accepted/executed `A89`, and revises `A93` to depend on `A38`/`A92` while routing broader incidence to MTU-H3. It also records that `GEN_A12`, `GEN_A20`, `GEN_A88`, `GEN_A89`, `GEN_A90`, `GEN_A92`, and `GEN_A93` need implementation or explicit generator-blocked status before student-facing exposure. No protected reference mutation, unit minting, unit updates, unit splits, candidate writes, lesson output, target-exercise promotion, CP-6/Year-1 closure, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use was authorized. Top operational next action is `GATE-MTU-H2D`. |
| MTU-H2C | Reduced-Scope Solo q1-q3 CLI Execution | yes | Completed the reduced clean-lane CLI execution authorized by GATE-MTU-H2B. Through `unit-add.js`, minted exactly `F19`, `F20`, `A85`, `A86`, `A87`, and `A91`, with extracted JSON specs echoed before execution and post-execution validation. `A12`, `A20`, `A88`, `A89`, `A90`, `A92`, and `A93` were not executed. `A12` remains held until its update spec retains `A2.11` or a later gate authorizes removal; `A20` remains held because target exercise `4.1.2` uses current `A20` in a given-MK context; `A92` remains held until the `A89` dependency route is resolved. H2A/H2B checkers now validate the post-H2C lifecycle state while still blocking conditional/held IDs from silently appearing. No candidate storage, candidate writes, `references/external/` mutation, lesson-output mutation, CP-6/Year-1 closure, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use was authorized. `MTU-H2D` has since prepared the held/conditional resolution packet; top operational next action is `GATE-MTU-H2D`. |
| GATE-MTU-H2B | Solo q1-q3 CLI Execution Authorization Human Review | yes | Closed as `partial_pass_with_conditions` for reduced-scope execution only. The full H2B execution-ready set is not authorized as written. Clean lanes after final preflight are `F19`, `F20`, `A85`, `A86`, `A87`, and `A91`; `A92` requires dependency resolution because it depends on conditional `A89`; `A88`, `A89`, `A90`, and `A93` are conditional or revise-first lanes; `A12` is held until its update spec retains `A2.11` or explicitly justifies removal; and `A20` is held because active target exercise `4.1.2` uses `A20` in a given-MK context. The gate required final preflight, extracted-spec logging, unchanged/revalidated plan proof, rollback/validation/no-unintended-diff proof, and no product-use authority. MTU-H2C has since executed the clean lanes and MTU-H2D has prepared the held/conditional resolution packet; top operational next action is `GATE-MTU-H2D`. |
| MTU-H2B | Solo q1-q3 CLI Execution Gate Packet | yes | Completed as a non-mutating execution-gate packet sprint. Added `reports/mtu-hardening/solo-q1-q3-cli-execution-gate-packet.*`, `reports/review-gates/GATE-MTU-H2B-cli-execution/review-packet.*`, sprint logs, and `build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js`. The packet proves ID availability for `F19`, `F20`, and `A85-A93`; validates A-unit generator fields and term links; simulates the unblocked post-execution catalog; carries exact command strings for the unblocked lanes; and records expected diff, rollback, audit, validation, and no-unintended-diff requirements. The `A20` usage audit blocks direct `A20` narrowing because target exercise `4.1.2` uses `A20` in a given-MK context. MTU-H2B did not mutate `references/machine/` or `references/external/`, mint units, execute unit updates, execute unit splits, create candidate storage, write candidates, mutate lesson output, close CP-6/Year-1, or authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. GATE-MTU-H2B closed, MTU-H2C executed the reduced clean lanes, and MTU-H2D prepared the resolution packet; top operational next action is `GATE-MTU-H2D`. |
| GATE-MTU-H2A | Solo q1-q3 CLI-Mutation Plan Human Review | yes | Closed as `pass_with_conditions_execution_gate_planning_only`. Accepted the proposed `F19`, `F20`, `A85-A93`, `A12` update, and conditional `A20` update/split route for a later bounded execution-gate packet only. Conditions require ID-collision proof, schema-valid specs, A-unit generator-field proof or validator proof, term-link validation, `A20` usage impact audit, OR-prerequisite guardrail for `A90`/`A12`/`A91`, exact command log, rollback, audit, validation, reference-health/Jest proof, and no unintended external/candidate/lesson-output diff. GATE-MTU-H2A authorized no CLI execution, protected/external/machine reference mutation, unit minting, unit update execution, unit split execution, candidate writes, lesson-output mutation, CP-6/Year-1 closure, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use. `MTU-H2B`, `GATE-MTU-H2B`, `MTU-H2C`, and `MTU-H2D` have since closed; top operational next action is now `GATE-MTU-H2D`. |
| MTU-H2A | Solo q1-q3 CLI-Mutation Planning | yes | Completed as a planning-only sprint. Added `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.*`, `reports/review-gates/GATE-MTU-H2A-cli-mutation-plan/review-packet.*`, sprint logs, and `build-scripts/references/check-mtu-h2a-cli-mutation-plan.js`. The packet proposes exact new IDs `F19`, `F20`, and `A85` through `A93`, plus live updates to `A12` and `A20`, with CLI specs, command order, rollback/audit expectations, validation proof, and guardrails. It keeps q1/q2 answer-form needs routed to MTU-H4 and D07 incidence/pass-through routed to MTU-H3. MTU-H2A did not mutate `references/machine/` or `references/external/`, mint units, execute unit updates, create candidate storage, write candidates, mutate lesson output, close CP-6/Year-1, or authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. GATE-MTU-H2A, MTU-H2B, GATE-MTU-H2B, MTU-H2C, and MTU-H2D have since closed; top operational next action is now `GATE-MTU-H2D`. |
| GATE-MTU-H2 | Solo q1-q3 Micro-Case Human Review | yes | Closed as `pass_with_conditions` for routing only. Accepted the reviewed Solo q1-q3 candidate lanes for later bounded MTU-H2A CLI-mutation planning: q1 verbal external-cost recognition and explanation-with-example lanes; q2 pointwise TO, TVK from constant variable cost, unknown fixed costs from profit, and scale-factor handling lanes; q3 MO route split/supplement lanes and price-change lanes. Deferred q1 `leg uit met voorbeeld` and q2 `bereken` answer-form needs to MTU-H4 while keeping them visible, and routed broader D07/pass-through/incidence work to MTU-H3. Conditions preserve the guardrails: q1 must not require full MPC/MSC machinery, q2 must not require full TO-function construction, and q3 must not require MK derivation when MK is given or a calculus-only MO route. GATE-MTU-H2 authorized no mutation execution, protected/external/machine reference mutation, unit minting, candidate writes, lesson-output mutation, CP-6/Year-1 closure, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use. |
| MTU-H2 | Solo q1-q3 Canonical Micro-Case Review | yes | Completed as a non-mutating review-packet sprint. Added `reports/mtu-hardening/solo-q1-q3-canonical-cases.json`, `solo-q1-q3-canonical-cases.md`, `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/review-packet.*`, and `build-scripts/references/check-mtu-h2-solo-cases.js`. The package makes q1 verbal external-cost candidates, q2 reverse fixed-cost calculation candidates, q3 granular MO/MK and price-change candidates, existing-unit guardrails, MTU-H3 incidence dependencies, and MTU-H4 answer-form dependencies reviewable without mutating the live registry. MTU-H2 did not mutate `references/machine/` or `references/external/`, mint units, create candidate storage, write operation/answer-skill candidates, mutate lesson output, close CP-6/Year-1, or authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. GATE-MTU-H2 has since closed and the top operational next action is `MTU-H2A`. |
| MTU-H1 | Operation Benchmark From Exam Questions | yes | Completed as a non-mutating MTU-hardening benchmark sprint. Added `reports/mtu-hardening/benchmark-sample-v1.json`, `solo-q1-q3-operation-map.md`, `failure-taxonomy-v1.md`, and `build-scripts/references/check-mtu-hardening-benchmark.js`. The benchmark records the supplied 2026 VWO economie Solo q1-q3 analysis as structured evidence that separates content MTUs, calculation/graph/source operations, answer-form MTUs, misconception targets, missing-unit flags, and over-trigger flags. It routes later MTU-H2 through MTU-H6 work for canonical micro-cases, incidence/pass-through, answer-form units, regression validation, and student-route integration. MTU-H1 did not mutate `references/machine/` or `references/external/`, mint units, create candidate storage, write operation/answer-skill candidates, execute q19 extraction, mutate lesson output, close CP-6/Year-1, or authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. |
| QUALITY-STD-1 | Planning Quality Standard Enforcement | yes | Completed as a cross-repo governance hardening sprint. Added quality-driven execution language to both repo `AGENTS.md` files, inserted a Specification-Fulfilment Rule and Planning Quality Floor into the lesson companion specification, added paragraph-build quality-standard guidance, updated lead-reviewer instructions, and hardened `check-sprint-plan.js` so future platform sprint plans must include `Quality Standard`, `Specification Fulfilment Matrix`, `Quality Improvement Candidates`, and `Proof Required to Close`. Added focused tests and updated the current GAME-UX-2 plan so completed-bundle validation remains compatible with the stricter checker. No generated lesson output, protected reference mutation, target-exercise promotion, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or product-use authorization. |
| GAME-UX-2 | Exit Ticket Checkpoint Engine | yes | Completed as platform runtime and generated-output support for lesson `L1.7B-R`. Added a source-controlled checkpoint engine/UI/CSS, paragraph-limited data for `1.1.1 Schaarste en economisch denken`, an exit-ticket shell/data generator, deploy integration, landing-page `Check` activation copy, focused tests, and screenshot QA support. Generated the bounded Book 1 lesson checkpoint surface and refreshed affected landing pages through platform scripts only. The checkpoint consumes `SkillMapEngine.createRequest("exit-ticket", ...)` in compact mode, keeps internal MTU ids out of rendered student text, uses neutral practice/self-check feedback, and carries no mastery/pass/fail/score/grade/evidence/diagnostic/adaptive/summative/product-use claims. GAME-UX-2 did not import the untracked draft wholesale, mutate protected/external/machine references, mint units, create EX candidate storage, execute q19 extraction, promote target exercises, close CP-6/Year-1, close GATE-L1.7B or Scale Gate 1, or authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or broad companion scaling. |
| EX-7 | Validator And Dry-Run CLI Implementation | yes | Completed as a validator/dry-run CLI implementation sprint after GATE-EX6. Added shared validation support, read-only validators for operation/answer-skill candidates and source-annex extraction overlays, dry-run-only candidate CLI wrappers, and an EX-7 self-checker using temporary OS-temp fixtures. Updated the operation and answer-skill future schemas to use explicit status fields and typed unit-support assessments so weak and rejected unit evidence cannot collapse. Validators reject mutation/product flags, q3 `A15` annual-threshold support, q19 primary `A45` graph-shift support, hidden q3/q15 answer-skill needs, weak/rejected ambiguity, and q19 reconstructable states with empty/vague source or graph detail. EX-7 created no candidate-storage files, wrote no candidate records, executed no q19 extraction, mutated no protected/external/machine references, changed no lesson output, and authorized no CP-6/Year-1 closure or student/product use. |
| GATE-EX6 | Validator And CLI Planning Human Review | yes | Closed as `pass_with_conditions` for validator/dry-run CLI implementation only. Accepted the EX-6 three-schema split and validator/CLI implementation plan as adequate for a later bounded implementation sprint. Authorized only `EX-7 Validator And Dry-Run CLI Implementation`: validators, dry-run-only CLIs, temporary non-persistent test fixtures, and rejection tests. Conditions: no candidate-storage creation, no candidate writes, no q19 extraction execution, no protected/external/machine reference mutation, no unit minting, no operation-registry or answer-skill mutation, no PV/graph mutation, no lesson-output mutation, no CP-6/Year-1 closure, and no student/product use. Validators must preserve weak vs rejected unit evidence, reject empty/vague q19 reconstructability fields, keep `A15` rejected for q3 and `A45` weak-only for q19, and keep q3/q15 answer-skill needs visible. |
| EX-6 | Validator And CLI Implementation Planning | yes | Completed as a planning-only sprint after GATE-EX5. Added future-storage schemas for operation candidates, answer-skill candidates, and source-annex extraction overlays; added `references/data/exam-ingestion/validator-cli-implementation-plan.*`; added `build-scripts/references/check-ex6-validator-cli-planning.js`; and prepared `reports/review-gates/GATE-EX6-validator-cli-planning/review-packet.*`. EX-6 created no persistent candidate-storage files, no future mutation CLIs, no operation/answer-skill candidate writes, no q19 extraction records, and no lesson output. It authorizes no protected mutation, external-source mutation, machine-reference mutation, unit minting, operation-registry mutation, answer-skill mutation, q19 extraction execution, PV/graph mutation, target-exercise promotion, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. |
| GATE-EX5 | Operation And Answer-Skill Contract Human Review | yes | Closed as `pass_with_conditions` for design-contract review only. Accepted the EX-5 operation/answer-skill/q19 extraction contract as adequate for later bounded validator/CLI planning; preserved overlay-first future storage under `references/data/exam-ingestion/`; kept q3 `A61` support with `A15` rejected; kept q19 `A42`/`D10` support with `A45` weak and `q19-source-annex-gap` / `q19-graph-object-gap` blocking; kept q3/q15 answer-skill needs visible; and authorized only `EX-6 Validator And CLI Implementation Planning`. GATE-EX5 authorizes no candidate writes, q19 extraction execution, protected mutation, external-source mutation, machine-reference mutation, unit minting, operation-registry mutation, answer-skill mutation, PV/graph mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. |
| SYNC-2 | Exit-Ticket And Scale-Gate Roadmap Precision | yes | Completed as a roadmap-only cross-repo synchronization sprint. Split lesson L1.7B into closed contract-only `L1.7B-C` and future implementation `L1.7B-R`; added lesson-side `GATE-L1.7B`; added platform `GAME-UX-2` as future checkpoint-engine support; clarified that L2.0 must classify L1.7C game-row carried flags and define exit-ticket readiness; and revised Scale Gate 1 prerequisites so the contract alone cannot be mistaken for a safe exit-ticket surface. No lesson output, protected reference mutation, external-source mutation, machine-reference mutation, unit minting, operation/answer-skill mutation, target-exercise promotion, CP-6/Year-1 closure, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output was authorized. |
| EX-5 | Operation And Answer-Skill Registry Contract | yes | Completed as a design-only contract sprint after GATE-EX4. Added `references/schemas/operation-answer-skill-contract.schema.json`, `references/data/exam-ingestion/operation-answer-skill-contract.*`, `build-scripts/references/check-ex5-operation-answer-skill-contract.js`, and the `GATE-EX5-operation-answer-skill-contract` review packet. The contract defines future overlay-first operation-candidate, answer-skill-candidate, and q19 source-annex extraction storage; required operation/answer-skill fields; q19 graph/source reconstruction fields; validator/CLI prerequisites; rollback; audit evidence; and stop conditions preserving q19 blockers and q3/q15 answer-skill visibility. EX-5 created no candidate-storage files, did not execute q19 extraction, and authorized no protected mutation, external-source mutation, machine-reference mutation, unit minting, operation-registry mutation, answer-skill mutation, PV/graph mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. |
| GAME-UX-1 | Shared Skill-Map Engine Architecture | yes | Completed as platform runtime support for the closed lesson `L1.7C-0` contract. Added `engines/skill-map-engine.js` as the shared compact/route/restricted-full view-model engine; exposed MTU `aspects` through skill-tree base data and deploy bundle data; added scoped route request hooks for reasoning, calculation/procedure, graphical, exit-ticket checkpoint, and landing-preview consumers; made future generated skill-tree data carry compact `skillMapDefaults` so `activeSkills: null` is no longer a default all-skill student route; and changed visible skill-tree progress copy from mastery language to practice language. No lesson output was generated, no exit-ticket prototype was imported, and no protected reference mutation, machine-reference mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing product use was authorized. |
| GATE-EX4 | Mutation Planning Human Review | yes | Closed as `pass_with_conditions` for routing/design authority only. Accepted q3 `q3-calc-1` as a later operation-registry design candidate with `A61` support and stale `A15`; kept q3 `q3-answer-1` and q15 `q15-answer-1` as separate answer-skill candidates; kept q19 source-annex and graph-object extraction as the blocking prerequisite before graph/PV, reasoning, lesson handoff, PV projection, or student-facing use; carried q19 `A42`/`D10` candidates with weak `A45`; and authorized only a later bounded tooling/design sprint. No protected mutation, external-source mutation, machine-reference mutation, unit minting, operation-registry mutation, answer-skill mutation, PV/graph mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output was authorized. |
| EX-4 | CLI-Backed MTU / Operation / Answer-Skill Mutation Planning | yes | Completed as governed mutation-planning prep only. Added `reports/review-gates/GATE-EX4-mutation-planning/mutation-candidates.*`, `cli-readiness-plan.*`, `review-packet.*`, and `build-scripts/references/check-ex4-mutation-planning.js`. The packet routes q3 `q3-calc-1` as an operation candidate with `A61` support and stale `A15`, q3 `q3-answer-1` as an answer-skill candidate, q19 source/graph extraction as a blocker before graph/PV/reasoning or lesson handoff, q19 `q19-graph-op-1` with `A42`/`D10` support and weak `A45`, q19 `q19-reason-1` with `D10`/`D13` partial support, and q15 `q15-answer-1` as an answer-skill candidate while `D27`/`F03`/`F09` remain content-only coverage. EX-4 authorizes no protected mutation, external-source mutation, machine-reference mutation, unit minting, operation-registry mutation, answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. |
| EX-3 | Exam Coverage Dashboard | yes | Completed as a reporting-only dashboard sprint. Added generated `reports/json/exam-ingestion-coverage.json` and `reports/markdown/exam-ingestion-coverage.md`, plus `build-scripts/references/check-exam-ingestion-coverage.js`, report-contract wiring, and reference-health summary fields. The report records 3 EX-1 pilot items, 8 reviewed GATE-EX2 classifications, 2 blocking q19 gaps, q3 `A61` support with stale/weak `A15`, q19 `A42`/`D10` support with weak `A45`, q3/q15 `answer_skill_need`, and q19 blocked lesson-handoff status. No protected mutation, external-source mutation, unit minting, operation-registry mutation, answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output was authorized. |
| EX-2 | Exam-to-MTU Mapping Review Gate | yes | Closed as `pass_with_conditions` for classification and routing only. Accepted reviewed classifications for the EX-1 pilot items: q3 `q3-calc-1` remains `operation_registry_need` with `A61` support and stale/incorrect `A15`; q3 and q15 answer-model wording remain `answer_skill_need`; q19 remains blocked by `q19-source-annex-gap` and `q19-graph-object-gap`; q19 graph routing adds `A42` and `D10` while downgrading `A45` to weak support; q15 content maps to `D27`, `F03`, and `F09` for content coverage only. EX-2 authorizes EX-3 dashboard/reporting work only. No protected mutation, external-source mutation, unit minting, operation-registry mutation, answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output was authorized. |
| EX-1 | Exam Source Annex And Answer Model Pilot | yes | Completed as a bounded non-mutating pilot under the closed `GATE-EX0` conditions. Created exactly three pilot overlay families under `references/data/exam-ingestion/`: `exam-item-overlays.json`, `exam-answer-model-overlays.json`, and `exam-source-annex-overlays.json`, covering q3 calculation-heavy, q19 graph/source-heavy, and q15 reasoning/answer-model-heavy official VWO 2025 tijdvak 1 items. Added `build-scripts/references/check-exam-ingestion-pilots.js` and a gate-aware EX-0 contract-check update. q19 remains blocked with visible `q19-source-annex-gap` and `q19-graph-object-gap`; it is not `reviewed_ready_for_mapping`. No protected mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output was authorized. |
| GATE-EX0 | Exam Ingestion Contract Human Review | yes | Closed as `pass_with_conditions`. The gate authorizes EX-1 as a bounded, non-mutating pilot to create three `references/data/` exam-ingestion overlays only. Conditions: graph/source-heavy pilot items may not be marked `reviewed_ready_for_mapping` unless required graph/table/source values are reconstructable or blocking gaps are carried; EX-1 must add a real pilot-overlay validator; L-EX0 should make assumed prior knowledge with MTU evidence and deliberately out of scope with reason explicit; `pass_with_gaps` may be used only when named gaps remain visible downstream. No protected mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output was authorized. |
| EX-0 | Exam Ingestion Contract Design | yes | Completed as a non-mutating contract-design sprint. Added `references/schemas/exam-ingestion.schema.json`, `references/data/exam-ingestion/README.md`, `references/data/exam-ingestion/review-procedure.md`, `build-scripts/references/check-exam-ingestion-contract.js`, and `reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.*`. The contract keeps prompt metadata, source annexes, graph/table/figure objects, official correction-model steps, point rules, accepted alternatives, precision/unit requirements, skill decomposition, MTU gap classification, and lesson-build handoff separately traceable. It creates no pilot overlay records and authorizes no protected mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. GATE-EX0 has since closed as `pass_with_conditions`, authorizing only the bounded non-mutating EX-1 pilot overlays under the recorded gate conditions. |
| CP.6f | 1.1.3 Part A Remediation Recheck | yes | Completed as a non-mutating focused recheck after lesson-team `L-CP6E`. The live `1.1.3` Part A markdown, regenerated HTML, and regenerated PDF now first mention figures in order `1 -> 2 -> 3`; `1.1.3-quality-ref.yaml` records Part A `PASS WITH FLAGS` with the figure-order flag fixed and the repeated worked example carried as accepted non-blocking scaffolding. Lesson evidence commit: `a31f2e11320035f6a616f899fe91a68d8a204c01`; platform index/handoff commit at lesson handoff: `e7163e8df17bea35961c0df93f964038749d304a`. Recheck output: `references/data/sprints/CP.6f-113-part-a-recheck.json` and `reports/reference-planning/CP.6f-113-part-a-recheck.md`. CP.6f clears only the focused `1.1.3` Part A blocker; it does not close CP-6 or Year 1, promote target exercises, finalize placeholders, mint units, or authorize protected mutation or student/product use. |
| CP.6e | Focused 1.1.3 Part A Re-Review | yes | Completed as a non-mutating focused Part A re-review with `failed_clearance`. The then-live `1.1.3 Grafieken en tabellen – paragraaf.md` still introduced figures in first-use order `1 -> 3 -> 2` instead of `1 -> 2 -> 3`, so the remaining Part A figure-numbering flag was not cleared. The repeated worked example in `opgaven.md` was recorded as accepted standalone-exercise scaffolding, not the remaining hard blocker. Output: `references/data/sprints/CP.6e-113-part-a-rereview.json`, `reports/reference-planning/CP.6e-113-part-a-rereview.md`, and `reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md`. No protected mutation, lesson-output mutation, lesson review/quality-ref hand patching, target-exercise promotion, placeholder finalization, unit minting, CP-6 closure, or Year-1 closure was authorized. Lesson-team `L-CP6E` and references sprint CP.6f have since cleared this focused figure-numbering blocker. |
| CP.6d | Book 1 Graph-Heavy Evidence Upgrade | yes | Completed as a non-mutating graph-heavy evidence ledger upgrade. Checked the live post-L-CP6A lesson repo, not stale REF-CT2 paths: active `1.3.2` is `Marktevenwicht`, active `1.3.3` is `Verschuivingen en nieuw evenwicht`, and active Chapter 1.3 has 0 current source/lesson mismatches. Recorded 9 graph-heavy active-v5 Book 1 records, 9 current Part A review files, 3 companion-review-required records with current companion visual reviews, 3 `schema_version: 2` quality refs, 6 legacy/pre-schema quality refs needing later quality workflow, 1 then-open `1.1.3` Part A `FLAG`, and 0 records allowed as CP-6 closure evidence now. Output: `references/data/sprints/CP.6d-graph-heavy-evidence.json` and `reports/reference-planning/CP.6d-graph-heavy-evidence.md`. No protected mutation, lesson-output mutation, lesson quality-ref hand patching, companion review fabrication, target-exercise promotion, placeholder finalization, unit minting, CP-6 closure, or Year-1 closure was authorized. CP.6f has since cleared the focused `1.1.3` figure-numbering blocker, while CP-6 and Year 1 remain open for remaining non-final evidence and later human-confirmed closure. |
| CP.6c | Year-1 MTU Backfill Classification | yes | Completed as a non-mutating MTU backfill classification sprint. Classified the nine REF-CT1 Year-1 candidates against the current live registry: existing-unit mappings to `A45`, `A46`, `A47`, `A48`, `A49`, and `A51`; one merge/design candidate for normal/inferior goods around successor units `A17`/`D11`/`D33` with deprecated `D04` retained only as historical context; one deferred kink-in-collective-demand candidate; and one true missing simultaneous-shift reasoning operation for later governed review. Output: `references/data/sprints/CP.6c-mtu-backfill-classification.json` and `reports/reference-planning/CP.6c-mtu-backfill-classification.md`. No protected mutation, unit minting, target-exercise promotion, placeholder finalization, CP-6 closure, or Year-1 closure was authorized. CP.6f has since cleared the focused `1.1.3` figure-numbering blocker; the simultaneous-shift true missing operation remains a later governed review/mutation question. |
| CP.6b | Year-1 Target-Exercise Review | yes | Completed as a non-mutating target-exercise review/design sprint. Recorded 12 active-v5 Book 1 target-exercise records, 9 migrated records needing explicit v5 review artifacts, 3 placeholder records with draft gemengde-opgaven integration designs, 0 reviewed-final records, 0 target-exercise promotions, and 0 placeholder finalizations. Output: `references/data/sprints/CP.6b-target-exercise-review.json` and `reports/reference-planning/CP.6b-target-exercise-review.md`. CP-6 and Year 1 remain open; CP.6f has since cleared the focused `1.1.3` figure-numbering blocker, but target exercises remain non-final and no placeholder finalization is authorized. |
| EX-NS0 | Exam Ingestion North-Star Guidance | yes | Completed as a cross-repo guidance and roadmap update. Added the official exam-question ingestion north star to platform guidance, source-of-truth rules, exercise-overlay policy, paragraph-build guidance, platform/lesson maps, and both roadmaps. Inserted future EX-0 through EX-4 reference lanes and L-EX0/L-EX1 lesson lanes without changing protected references, creating exam-ingestion overlays, mutating lesson output, minting units, promoting target exercises, closing CP-6, or closing Year 1. |
| CP.6a | Book 1 Chapter 1.3 Lesson-Side Alignment | yes | Completed as a non-mutating alignment-plan sprint, then rechecked after lesson-team `L-CP6A`. Initial CP.6a recorded that active v5 `1.3.2 Marktevenwicht` and `1.3.3 Verschuivingen en nieuw evenwicht` did not match then-current lesson-side `1.3.2 Kostenstructuren` and `1.3.3 Opbrengsten`; L-CP6A lesson commit `1aa63e4f0968c39141c1a04809f6410b5435ee34` and platform commit `6e2c06684e0c9b782cf005027a3b2ef3fd9fd230` now fix that source/lesson mismatch with carried conditions. Recheck evidence: `references/data/sprints/CP.6a-lesson-side-recheck.json` and `reports/reference-planning/CP.6a-lesson-side-recheck.md`. Costs/revenue material is preserved for Book 2 survival, target exercises remain migrated/placeholders, and CP-6/Year 1 remain open. No protected mutation, target-exercise promotion, placeholder finalization, unit minting, CP-6 closure, or Year-1 closure was authorized. |
| GATE-CP6 | Year-1 Paragraph Coverage Human Review | yes | Completed as a non-closing human routing gate. Recorded all nine CP-6 answers in `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.md`, produced `gate-routing-decision.*`, and opened five bounded remediation lanes: CP.6a lesson-side alignment, CP.6b target-exercise review, CP.6c MTU backfill classification, CP.6d graph-heavy evidence upgrade, and CP.6e focused `1.1.3` Part A re-review. CP-6 and Year 1 remain open; no protected mutation, lesson-output mutation, target-exercise promotion, placeholder finalization, unit minting, closure proposal, or closure record was authorized. |
| REF-CP6 | Year-1 CP-6 Remediation And Review Readiness | yes | Completed as a non-mutating review-readiness sprint. Routed all REF-CT2 blockers into explicit decision lanes, preserved 12 active-v5 Book 1 records with 0 CP-6 quality-ready records, 3 placeholders, 2 source/lesson topic mismatches, 9 Year-1 backfill candidates, 9 legacy quality-ref records, 1 remaining `1.1.3` Part A `FLAG`, and 9 migrated target-exercise records needing final review. Prepared `GATE-CP6-year-1-paragraph-coverage` review packet with nine planned questions and a future interview protocol. CP-6 and Year 1 remain open; no human interview, gate closure, protected mutation, lesson-output mutation, target-exercise promotion, or placeholder finalization was authorized. |
| REF-CT2 | Year-1 Precision And Dual-Coding Audit | yes | Completed as a non-mutating audit sprint. Audited the 12 active-v5 Book 1 records for precision-lint and semantic dual-coding evidence. Found 9 visual/graph-heavy records, semantic evidence present across the inspected surfaces, 3 placeholders, 2 source/lesson topic mismatches (`1.3.2`, `1.3.3`), 1 L1.6R pass-with-flags record with remaining Part A `FLAG`, 9 legacy quality-ref records, and 0 CP-6 quality-ready records. CP-6 and Year 1 remain blocked; no CLI mutation, lesson-output mutation, target-exercise promotion, placeholder finalization, or protected reference mutation was authorized. |
| REF-CT1 | Year-1 Target Exercise And MTU Coverage Baseline For v5 | yes | Completed as a non-mutating baseline/reporting sprint. Produced the 12-record Book 1 coverage JSON/report, MTU gap-classification report, and CP-6 review packet. Recorded 9 migrated records needing v5 review, 3 placeholders needing evidence, 0 reviewed-final records, 19 confirmed Book 1 MTUs, 9 Year-1 backfill candidates, and `1.1.3` L1.6R/Part A closure blockers. CP-6 and Year 1 remain not closed; no CLI mutation or protected reference mutation was authorized. |
| REF-CT0 | Three-Year Prototype Normalisation And MTU Classification | yes | Completed. Produced a non-authoritative v5-aware three-year prototype, source/authority boundary note, MTU classification JSON/Markdown, and REF-CT1 candidate-review packet. Classified 104 active v5-confirmed MTU ids, 44 live Year-1 backfill MTU ids plus 68 active v5 missing-flag records, 57 Year-2 skeleton ids, 20 Year-3 skeleton ids, 4 duplicate/merge/split records, 3 parked records, and 11 placeholder needs-evidence records. No `references/machine` or `references/external` mutation occurred. Post-closure lead-review logs are required in the sprint bundle. |
| SYNC-1 | Roadmap Reconciliation | yes | Completed. Updated the references roadmap to v2.45 post-L1.6 state, updated the roadmap version index, and synchronized lesson/reference sequencing around foundation hardening instead of broad scaling. |
| S9a | D04 CLI-Only Mutation Sprint | yes | Completed. Applied the CP-5 D04 decision through `unit-deprecate.js`, deprecated D04 with successor pointers to `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, and `D27`, removed the single active target-exercise D04 citation, recorded mutation/stale-reference logs, regenerated reports/RAG/inventories, and preserved all blocked downstream uses. |
| S9 | Unit Design Status And D04 Resolution | yes | Completed with `pass_with_conditions`. Added derived `unit-design-status` overlay, validator, JSON/Markdown report, reference-health/RAG labels, CP-5 decision record, dependent-unit audit, human interview, and gate closure; D04 remains promotion-blocked and no protected machine mutation occurred. |
| S8 | Misconception Registry MVP | yes | Completed. Added the internal-only `references/data/misconceptions/misconception-registry.json`, tightened `misconception.schema.json`, added `check-misconceptions.js`, generated `misconception-registry` JSON/Markdown reports, exposed safe reference-health/RAG labels, and preserved all PV-G4 blocked-use conditions. |
| S7 | Skill And Operation Registry MVP | yes | Completed with `pass_with_conditions`. Generated `references/data/skill-operation-registry.json`, coexistence reports, and `GATE-CP4-skill-registry-coexistence` closure; `exercise_operations` remain provisional; no machine registry promotion or bulk backfill authorized. |
| PV.0 | CP-4 Procedure-Visual Addendum | yes | Completed with CP-4. PV templates may reference provisional `exercise_operations` only with explicit provisional status and no operation promotion; no machine registry creation or student-facing PV projection is authorized. |
| PV.1 | Procedure-Visual Inventory | yes | Completed. Generated `references/data/procedure-visual/inventory.json`, JSON/Markdown reports, and 12 ranked pilot templates spanning flowchart, formula trace, graph-stage, table-trace, and blocked generator/projection cases. |
| PV.2 | Procedure-Visual Schema And Validator MVP | yes | Completed. Added PV schema files, vocabulary, empty real overlay registries, validator, schema-status reports, and `GATE-PV-G1-schema` technical proof; real pilot templates wait for PV.3 and student-facing projection remains blocked. |
| PV.3 | Pilot Procedure-Visual Templates | yes | Completed. Added six pilot templates, six visual states, six unit-template links, and `GATE-PV-G2-pilot-content` technical proof; formula trace, graph-stage, table-trace, and flowchart-style coverage are present, while machine promotion and student-facing PV projection remain blocked. |
| PV.4 | Procedure/Game Projection Contract | yes | Completed. Added optional `formal_step_id` engine support, a procedure-game alignment fixture/report, and `GATE-PV4-procedure-game-contract` technical proof; mapped PV game records are now possible while legacy unmapped games remain valid and publication remains blocked. |
| RX.5 | Representation Operation Registry And Reports | yes | Completed as report-only bridge. Added representation-operation coverage, graph-skill-tree, and representation-transfer-gap reports; operation records remain provisional, stale/live status differences are explicit, held records stay held, and generator/PV publication blocks remain active. |
| PV.5 | Visual Projection MVP | yes | Completed. Added reusable report-side render/validation libraries for formula trace, flowchart, table trace, and static graph-stage PV visual states, generated SVG proof artifacts under `reports/`, and preserved publication, dynamic-graph, machine-promotion, and student-facing blocks. |
| PV.6 | Coverage Reports And Dashboard Integration | yes | Completed. Added `procedure-visual-coverage` reports and reference-health PV summary with diagnostic-only authority flags, surface/game/answer-model coverage, generator support, generator-block status, and blocker reasons; PV publication remains blocked. |
| RX.6 | Skill-Tree And Generator Integration | yes | Completed. Source and deployed skill-tree bundles now expose 44 generator-backed A-domain units as interactive and 37 missing-generator units as explicit generator-blocked/non-interactive rows; no student-facing skill-tree or PV exposure is authorized for blocked units. |
| PV.7 | Machine-Promotion Review Gate | yes | Closed as `pass_with_conditions`. No Procedure-Visual records may move to `references/machine` now; PV-G4 has now supplied the lesson-regression prerequisite, but future promotion still requires CLI implementation, validators, mutation logs, and a later human promotion gate. |
| PV.8 | Promotion Pipeline Design | yes | Completed as design-only. Defined proposed PV promotion plan/promote/rollback CLI contracts, mutation-log schema, validators, rollback expectations, and future unit-template-link promotion gate criteria; no machine promotion or CLI implementation occurred. |
| PV-G4 | Lesson Regression Proof | yes | Closed as `pass_with_conditions`. Lesson-team evidence records `2/2` proofs and HCS accepted them for the regression gate after freshness reconciliation. No PV machine promotion, student-facing PV projection, diagnostics, adaptive routing, mastery, sequencing, AI, or summative use is authorized. Proof 002 remains bounded A61 pilot evidence only. |
| RX.3 | Producer Table And Graph Representation Review | yes | Completed as non-mutating review. `GATE-RX3-producer-representation` closed as `pass_with_conditions`; A75/A76/A79 may enter first-lane mutation review; A77/A78 are later graph-lane candidates; A80/A81 and graphical MO=MK remain held. |
| RX.3a | Producer Table/Data First-Lane Mutation Review And CLI Execution | yes | Completed. `GATE-RX3a-first-lane-mutation-review` closed as `pass_with_conditions`; `A75`, `A76`, and `A79` were added through `unit-add.js`; `A76` needs `A14`, `A04`, and `A61`; all three remain generator-blocked/non-interactive. |
| RX.3b | Producer TO-TK Graph-Lane Mutation Review And CLI Execution | yes | Completed. `GATE-RX3b-producer-graph-lane-review` closed as `pass_with_conditions`; `A77` and `A78` were added through `unit-add.js`; `A78` needs `A63`, `A75`, and `A77`; both remain generator-blocked/non-interactive. |
| RX.4 | Elasticity And Market Diagram Representation Review And CLI Execution | yes | Completed. `GATE-RX4-elasticity-market-diagram-review` closed as `pass_with_conditions`; `A82`, `A84`, and `A83` were added through `unit-add.js`; `A83` uses the HCS-approved P-Q graph demand-elasticity scope; all three remain generator-blocked/non-interactive. |
| S6 | Bronnen Registry MVP | yes | Completed. Created the source-document schema/validator, generated `references/data/source-document-registry.json`, and emitted JSON/Markdown registry reports. The registry is a governed `references/data/` overlay, not a hand-maintained `references/machine/` registry. |
| RX.2b | Graphical Foundation Coverage And Mutation | yes | Completed. `GATE-RX2b-graphical-foundation` closed as `pass_with_conditions`; `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, and `A73` were added through `unit-add.js`; `A71` remains held/high-risk; all seven new A-units remain generator-blocked/non-interactive until generator implementation and validation. |
| GATE-RX2b | Graphical Foundation Review | yes | Closed as `pass_with_conditions`. Authorized CLI-only mutation for the seven-unit graphical foundation lane, held `A71`, preserved ID gaps, and preserved student-facing/adaptive/product-use blocks. |
| RX.2 | First-Lane Mutation Review And CLI Execution | yes | Completed. `GATE-RX2-first-lane-mutation-review` closed as `pass_with_conditions`; `A61`, `A66`, `A67`, `A70`, `A72`, and `A74` were added through `unit-add.js`; all six remain generator-blocked/non-interactive until generator implementation and validation. |
| GATE-RX2 | First-Lane Mutation Review | yes | Closed as `pass_with_conditions`. Authorized CLI-only mutation for the six-unit first lane and preserved blocks on deferred candidates, generator exposure, and student-facing/adaptive/product uses. |
| R8.1 | QC Issue Model | yes | Completed. Created internal-only quality issue schema/log, validator, `reference-quality-issues` report, and reference-health/RAG data hook; QC issues remain diagnostic governance records, not curriculum authority. |
| RX.1 | Representation-Operation Inventory | yes | Completed through the non-mutating inventory/review-packet stop point. Prepared 29 operation records, 24 provisional candidates, 5 held duplicate/overlap records, and `GATE-RX1-representation-unit-scope`. |
| GATE-RX1 | Representation Unit Scope Review | yes | Closed as `pass_with_conditions`. RX.2 planning is authorized for the bounded first lane only; direct mutation remains blocked until explicit RX.2 mutation review and CLI-backed execution. |
| S4.1 | Exercise Overlay Conditions And Calibration | yes | Completed on 2026-04-29. Implemented CP-3 condition artifacts, source-annex gap tracker, scaffolding calibration, graph-spec representation plan, product-boundary warnings, condition validator, and condition reports. No bulk extension or source mutation authorized. |
| R9.2 | Content Graph Projection | yes | Completed. Created a separate owned-content projection graph with 1,464 typed edges, RAG owned-content chunks, coverage reports, and 10/10 retrieval eval pass state while preserving CP-2 evidence boundaries. |
| S4 | Exercise Metadata Overlay MVP | yes | Completed on 2026-04-29 with CP-3 status `pass_with_conditions`. Created overlay schema, one Tier A dry-run overlay, one Tier C dry-run overlay, validator, and CP-3 closure. No bulk extension or source mutation authorized. |
| R9.1 | Owned Source Registry | yes | Completed with `pass_with_conditions`. Registered owned-source surfaces, repaired blueprint refs, prepared CP-2, and authorized R9.2 with projection-edge defaults and evidence-boundary conditions. |
| S1 | Schema Audit And Exercise Naming Contract | yes | Completed. `GATE-CP1-schema-audit` closed as `pass_with_conditions`; naming contract, role split, scaffolding object, and overlay-first strategy are approved. |
| R7.4 | RAG Review Gate | yes | Completed with `pass_with_conditions`. Internal and teacher-facing non-authoritative retrieval plus human-reviewed lesson-authoring support are allowed; student-facing diagnostics, adaptive routing, AI, automatic sequencing, mastery decisions, and summative use remain blocked. |
| R7.5 | Merge Readiness and Main Sync | yes | Completed. Branch synced with `origin/main`, duplicate R5 gate namespace resolved, stray roadmap artifact moved to `docs/roadmaps/`, validators pass, and merge-readiness report says ready for merge review. |
| R9.0 | Legacy Target Reference Minimization | yes | Completed. Minimized the frozen legacy target as a conceptual anchor before R9.1 while preserving functional legacy paths and guardrails. |
| R9.01 | Legacy Folder Rename | yes | Completed. Renamed repo-local legacy folders to `legacy-target` while preserving the frozen external lesson target. |
| R7.3 | Retrieval Evaluation Set | yes | Completed. Added fixed retrieval eval set, runner, validator, JSON results, and Markdown report; 10/10 cases pass with zero authority violations. |
| R7.2 | Hybrid Retrieval | yes | Completed. Added internal deterministic query prototype preserving source authority, evidence IDs, edge status, and generated-report warnings. |
| R7.1 | Deterministic Chunk Layer | yes | Completed. Added deterministic internal RAG chunk index with 842 chunks and authority metadata preserving generated-report safeguards. |
| R6.2 | Reference Health Dashboard Data | yes | Completed. Added `reports/json/reference-health.json` and Markdown projection with R5.3 graph-authority constraints and dashboard health summaries. |
| R6.1 | JSON-First Reports | yes | Completed. Added JSON-first report generation and validation for 10 required health/coverage reports, plus Markdown projections under `reports/markdown/`. |
| R5.3 | Alignment Graph Review Gate | yes | Completed with `pass_with_conditions`. Named graph edge groups are approved for internal dashboard/reporting and internal retrieval development/evaluation; student diagnostics, adaptive routing, and student-facing AI remain blocked. |
| R5.2 | Alignment Graph | yes | Completed. Built the first draft alignment graph from R5.1 evidence anchors: 31 edges, 13 pending main edges, 18 traceability edges, and 0 human-approved edges. |
| R5.1 | Evidence-Anchor Layer | yes | Completed. Created the first governed evidence-anchor layer: source-ranking policy, 15 anchors, 13 claims, schemas, validator, and status reports. |
| R4.3 | Blueprint Flag Triage | yes | Completed. Triaged all 84 current raw target-exercise missing-unit flags into a curated backlog: 68 still needed, 4 existing-unit match candidates, 1 duplicate, and 11 deferred. |
| R4.4 | Micro-Teaching Unit Quality Packet | yes | Completed. Created non-mutating packet for 48 empty-needs units, 44 missing term-link units, 2 unresolved term strings, and 84 blueprint flags; R4.5 requires human review before mutation. |
| R4.5 | Apply Reviewed Micro-Unit Corrections | yes | Completed. Applied the bounded human-reviewed mutation set through CLI: 2 B-domain terms, 13 dependency edges, 19 micro-units, regenerated reports/RAG surfaces, and preserved held design-review items. |
| R4.2 | Exam-Question Extraction Gap Closure | yes | Completed. Produced a non-mutating gap report and patch queue for 27 exam-question records with missing required-skill annotations; protected references were not changed. |
| R4.1 | Unit-Term Slug Migration | yes | Completed. Migrated safe unit `terms` values to canonical `begrippen.json` slug IDs through a validated migration script; left `alternatieve kosten` and `schaarste` unresolved for later term-registry review. |
| R3.2 | Apply Reviewed Empty-Needs Corrections | yes | Completed. Applied the bounded R2.4 mutation-review set through CLI: 15 dependency edges and 6 `underbouw_assumed` classifications. No D04, rejected market-graph, held A-domain, L09->L03, or H13 mutations were applied. |
| R3.1 | Reference CLI And Documentation Completion | yes | Completed. CLI docs now reflect implemented scripts; coverage report status is `ready_with_blockers`; zero-needs review fields round-trip through parser, formatter, validation, and JSON projection. |
| R2.4 | Evidence And Unit-Design Cleanup | yes | Completed. Non-mutating packet attaches exact evidence to selected candidate edges, resolves D04 as unit-design-required, classifies foundational A-domain zero-needs candidates, preserves rejected market-graph suggestions, and records a bounded labor-market/unemployment second pass. |
| R2.3 | Human Review And Gate Closure | yes | Completed with GATE-R2 status `hold`. The audit was diagnostic only; R2.4 produced the non-mutating packet and R3.2 later applied only the human-approved CLI mutation set. |
| R2.2 | Subagent Review For Empty Needs | yes | Completed. Pedagogy, data-integrity, and evidence reviews plus a GATE-R2 review packet are ready for human review. |
| R2.1 | Full Empty-Needs Audit | yes | Completed. Non-mutating audit generated 61 machine-suggested empty-needs review entries for the current branch catalog. |
| R1.3 | Unit Prior-Knowledge Schema Extension | yes | Completed. Unit and review schemas now support zero-needs status, assumed prior knowledge, and review records. |
| R1.2 | Core JSON Schemas | yes | Completed. Initial JSON schema contracts exist for units, terms, evidence, graph edges, reports, RAG chunks, and reference-quality records. |
| R1.1 | Source-of-Truth Decision | yes | Completed. `references/SOURCE_OF_TRUTH.md` defines canonical source, projection, authority, and edit-policy rules. |
| R0.2 | Reference Baseline Inventory | yes | Completed. Source manifest, document inventory, builder, and validators now define the baseline reference/report/tooling surface. |
| R0.1 | Sprint Execution Scaffold | yes | Completed. Sprint templates, example fixtures, JSON sprint metadata, and plan/result validators exist. |
| H0.1 | A-Domain Skilltree Consistency | yes | Historical completed work. `A38` through `A44` implemented; A-domain skilltree coverage matches the catalog. |
| H0.2 | Reference Report Regeneration | yes | Historical completed work. Core reports regenerated and aligned with the catalog. |
| H0.3 | Labor-Market Unit And Dependency Patch | yes | Historical branch work. Not present in the current 190-live-unit catalog; labor-market/unemployment sequencing is reopened under R2.4. |

## Adoption Decision

The handoff roadmap has been adopted as the main operating roadmap for the references team.

No blocking incompatibility was found. The roadmap direction fits the repository: machine-edited references, evidence-first unit growth, JSON-first reports, review gates for pedagogical authority, and bounded later AI.

Update 2026-04-29: R8.1 Scoped QC Issue Model is completed. The roadmap now has an internal-only quality issue layer under `references/data/qc/`, generated `reference-quality-issues` report output, and a reference-health/RAG data hook. QC issues are diagnostic governance records, not curriculum authority or student-facing material.

Update 2026-04-30: HCS approved inserting `RX.2b Graphical Foundation Coverage And Mutation` before `RX.3`. RX.2 was a safe table/index first lane, not a full graphical-foundation completion. RX.2b must cover the missing bar-chart, line-graph, pie-chart, visual percentage-change, and visual index foundations before producer/profit graph units proceed.

Update 2026-04-30: The Sprint Ledger was first moved near the top of the roadmap so agents saw current/open work before detailed operating rules and phase background.

Update 2026-04-30: RX.2b closed `GATE-RX2b-graphical-foundation` as `pass_with_conditions` and added `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, and `A73` through `unit-add.js`. `A71` remains held/high-risk. All seven new graphical-foundation units remain generator-blocked and non-interactive until generator implementation and validation.

Update 2026-04-30: `S6 Bronnen Registry MVP` is completed. The first source-document registry implementation lives under `references/data/source-document-registry.json` as a governed overlay, not under `references/machine/`. It records source type, authority level, source version, status, owner, citation policy, and public-citation policy while preserving external/machine protected-surface boundaries.

Update 2026-04-30: `S7 Skill And Operation Registry MVP` is prepared for `GATE-CP4-skill-registry-coexistence` review. The registry remains a `references/data/` overlay and keeps `required_units`, provisional `exercise_operations`, and `skill_tags` separate while preserving `required_skills` as legacy/source-only.

Update 2026-05-01: Leadership approved the Procedure-Visual Backbone as a formal PV track. PV starts as a governed `references/data/procedure-visual/` overlay, not a `references/machine/` registry. PV.0/PV.1/PV.2 are inserted after S7/CP-4 and before large RX.3/RX.4 mutation work so producer graphs, elasticity diagrams, market diagrams, procedure games, and surface-specific visuals share one student-visible reasoning model.

Update 2026-05-01: `GATE-CP4-skill-registry-coexistence` closed as `pass_with_conditions`. S7 is completed as a governed `references/data/` overlay. `exercise_operations` remain provisional, Dutch broad `skill_tags` are accepted as v1 with alias/naming follow-up, English dry-run `skill_tags` remain provisional aliases/sub-tags, and no machine registry or bulk backfill is authorized. PV.0 is completed: PV templates may reference provisional `exercise_operations` only with explicit provisional status and no operation promotion.

Update 2026-05-01: `PV.1 Procedure-Visual Inventory` is completed. The inventory now lives at `references/data/procedure-visual/inventory.json` with 12 ranked pilot templates, runtime-surface findings, provisional operation-reference status, generator/projection blockers, and PV.2 schema requirements. No `references/machine/` or `references/external/` mutation occurred, and no student-facing PV projection is authorized.

Update 2026-05-01: `PV.2 Procedure-Visual Schema And Validator MVP` is completed. The PV overlay now has strict schema files, vocabulary, empty real registries, a read-only validator, schema-status reports, and `GATE-PV-G1-schema` technical proof artifacts. Real templates and visual states remain deferred to PV.3, no PV `references/machine/` registry exists, and student-facing PV projection remains blocked.

Update 2026-05-01: `RX.3 Producer Table And Graph Representation Units` is prepared for `GATE-RX3-producer-representation` human review. The packet splits the producer table/data lane (`A75`, `A76`, `A79`) from the producer graph lane (`A77`, `A78`, `A80`, `A81`), keeps graphical MO=MK held, applies PV.2 visual-state constraints, and authorizes no mutation before HCS decision.

Update 2026-05-01: `GATE-RX3-producer-representation` closed as `pass_with_conditions`. RX.3 is completed as a non-mutating review sprint. The next allowed step is `RX.3a` bounded first-lane mutation review for `A75`, `A76`, and `A79`; `A76` must include `A14`, `A04`, and `A61` as needs. `A77`/`A78` may proceed later after `A75`, while `A80`, `A81`, and graphical MO=MK remain held.

Update 2026-05-01: `RX.3a Producer Table/Data First-Lane Mutation Review` is prepared for `GATE-RX3a-first-lane-mutation-review`. Candidate specs, CLI mutation plan, and generator-block records are ready for `A75`, `A76`, and `A79`; execution is still blocked until HCS explicitly authorizes CLI mutation.

Update 2026-05-01: `GATE-RX3a-first-lane-mutation-review` closed as `pass_with_conditions` and RX.3a applied the authorized producer table/data lane through `unit-add.js`. `A75`, `A76`, and `A79` are now live catalog units; `A76` includes `A14`, `A04`, and `A61` as required needs. All three remain generator-blocked/non-interactive. `A77`/`A78` move to a later graph-lane review, while `A80`, `A81`, and graphical MO=MK remain held.

Update 2026-05-01: `RX.3b Producer TO-TK Graph-Lane Mutation Review` is prepared for `GATE-RX3b-producer-graph-lane-review`. Candidate specs and a blocked CLI plan are ready for `A77` and `A78`; the packet records PV graph-stage constraints and asks HCS whether `A78` should add `A77` as a dependency. No mutation is authorized before HCS decision. `A80`, `A81`, and graphical MO=MK remain held.

Update 2026-05-01: `GATE-RX3b-producer-graph-lane-review` closed as `pass_with_conditions` and RX.3b applied the authorized TO-TK graph lane through `unit-add.js`. `A77` and `A78` are now live catalog units; `A78` includes `A63`, `A75`, and `A77` as required needs. Both remain generator-blocked/non-interactive. `A80`, `A81`, graphical MO=MK, real PV producer-graph templates, and student-facing PV projection remain blocked.

Update 2026-05-01: `RX.4 Elasticity And Market Diagram Representation Units` is prepared for `GATE-RX4-elasticity-market-diagram-review` human review. The packet treats `A82` and `A84` as the lower-risk elasticity table/source lane, keeps `A83` conditional on the demand-graph versus P-Q graph evidence/naming decision, and holds new market/welfare/surplus/intervention graph units that overlap `A19`, `A32`, `A40`, `D39`, `D40`, `A51`, `A56`, or `A59`. No mutation is authorized before HCS decision.

Update 2026-05-02: `GATE-RX4-elasticity-market-diagram-review` closed as `pass_with_conditions` and RX.4 applied the approved elasticity representation lane through `unit-add.js`. `A82`, `A84`, and conditionally approved `A83` are now live catalog units; `A83` uses the HCS-approved name `Prijselasticiteit van de vraag berekenen uit P-Q-grafiek`. All three remain generator-blocked/non-interactive. Market/welfare duplicate areas, student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, and summative use remain blocked.

Update 2026-05-02: `PV.3 Pilot Procedure-Visual Templates` is completed. The PV overlay now contains six pilot procedure templates, six pilot visual states, and six unit-template links under `references/data/procedure-visual/`, with PV-G2 technical proof for formula trace, graph-stage, table-trace, and flowchart-style coverage. No PV `references/machine/` registry exists, all PV records block student-facing projection, and PV.4 is the next sprint.

Update 2026-05-02: `PV.4 Procedure/Game Projection Contract` is completed. The procedure engine now supports optional `formal_step_id` alignment reporting without changing legacy gameplay, and `procedure-game-template-alignment` proves one B02 pilot maps every game step to a PV template while a legacy unmapped fixture remains valid. No forced procedure-game migration, student-facing PV projection, or PV machine registry is authorized.

Update 2026-05-02: `RX.5 Representation Operation Registry And Reports` is completed as a report-only bridge. New representation-operation coverage, graph-skill-tree, and representation-transfer-gap reports distinguish live units, stale provisional registry statuses, held/high-risk records, generator-blocked live units, and PV pilot links without creating a `references/machine/` operation registry or authorizing student-facing use.

Update 2026-05-02: `PV.5 Visual Projection MVP` is completed. The platform now has report-side PV renderer libraries for formula trace, flowchart, table trace, and static graph-stage visual states, plus 28 SVG proof artifacts under `reports/procedure-visual-projections/`. These are validation/proof outputs only: no lesson target writes, dynamic graph manipulation, PV machine promotion, or student-facing PV projection is authorized.

Update 2026-05-02: `PV.6 Coverage Reports And Dashboard Integration` is completed. The new `procedure-visual-coverage` report and `reference-health` PV summary show PV-linked units, templates, visual states, surface variants, game mapping, answer-model step order, generator support, generator blocks, and blocker reasons while preserving diagnostic-only, non-authoritative, non-student-facing PV boundaries.

Update 2026-05-03: `RX.6 Skill-Tree And Generator Integration` is completed. Source and deployed skill-tree base elements now expose only generator-backed active A-domain units as interactive skill-tree nodes. The 37 active A-domain units without generators are explicitly recorded as generator-blocked/non-interactive, including older R4.5 units `A45` through `A60` that predated the generator-block convention. Student-facing skill-tree exposure, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, and summative use remain blocked for generator-blocked units.

Update 2026-05-03: `PV.7 Machine-Promotion Review Gate` is prepared for HCS review. The readiness report shows PV has schemas, validator, six pilot templates, six visual states, six unit-template links, projection proof, and coverage reports, but lacks a PV machine-edit CLI, machine-promotion mutation logs, and two lesson-side PV regression proofs. The packet recommends no `references/machine/` PV promotion in PV.7; all PV records should remain under `references/data/procedure-visual/` unless HCS explicitly decides otherwise.

Update 2026-05-03: `GATE-PV7-machine-promotion-review` closed as `pass_with_conditions`. No Procedure-Visual records may move to `references/machine/` now. HCS confirmed that `unit-template-links` are the safest future first candidate only after CLI, validators, mutation logs, and lesson-regression proof exist. `PV.8 Promotion Pipeline Design` is inserted before any future promotion attempt, and PV-G4 lesson-regression proof remains required before reopening machine promotion.

Update 2026-05-03: `PV.8 Promotion Pipeline Design` is completed as a design-only technical sprint. It defines the future unit-template-link-first promotion path, proposed CLI contracts, mutation-log schema, rollback expectations, validators, and future gate questions. No PV promotion CLI was implemented, no mutation log was created, no PV `references/machine/` registry was created, and no student-facing PV projection is authorized. PV-G4 lesson-regression proof is now the next required step before any future promotion attempt.

Update 2026-05-03: `PV-G4 Lesson Regression Proof` evidence intake is prepared. The new proof template and review packet define the two required lesson-team-owned PV regression proofs, validation expectations, and no-hand-patch requirement. PV-G4 is not closed: there are currently 0/2 recorded lesson-side proofs, no lesson-team output was committed by the references team, and PV machine promotion plus student-facing PV projection remain blocked.

Update 2026-05-14: `PV-G4 Lesson Regression Proof` received lesson-team proof records and HCS lead review returned `pass_with_conditions`. The platform proof intake now records `2/2` proofs from lesson commit `52f9237de9e465e7f75483f6feac4e80241e8631` with clean-worktree metadata, and the proof-intake checker passes. A post-closure report-state cleanup made the intake generator closure-aware, so current intake reports `pass_with_conditions` instead of `ready_for_hcs_review`. Conditions remain active: Proof 002 is bounded non-student-facing A61 proof diversity only, and PV machine promotion, student-facing PV projection, diagnostics, adaptive routing, mastery, sequencing, AI, and summative use remain blocked.

Update 2026-05-14: `S8 Misconception Registry MVP` is plan-ready as the next reference sprint after PV-G4 closure. The plan keeps Sprint 8 as an internal diagnostic overlay only: it may tighten the existing misconception schema, add a small `references/data/` registry, validator, report, reference-health hook, and RAG diagnostic hook, but it must not authorize student-facing diagnostics, adaptive routing, mastery, sequencing, AI, summative use, PV projection, or PV machine promotion.

Update 2026-05-15: `S8 Misconception Registry MVP` is completed. The registry lives at `references/data/misconceptions/misconception-registry.json` as an internal diagnostic overlay with four evidence-backed seed records, a tightened `misconception.schema.json`, read-only validator, JSON/Markdown report, reference-health summary, and generated-report RAG chunk. It remains non-authoritative: not primary evidence, not curriculum or exam authority, not a scoring rule, not student-facing diagnosis, and not permission for adaptive routing, mastery, sequencing, AI, summative use, PV projection, or PV machine promotion.

Update 2026-05-15: `S9 Unit Design Status And D04 Resolution` is completed and `GATE-CP5-D04-resolution` closed as `pass_with_conditions`. S9 created a derived `references/data/unit-design-status/unit-design-status-overlay.json`, read-only validator, JSON/Markdown report, reference-health/RAG hooks, dependent-unit audit, D04 decision record, human interview, and gate closure. The CP-5 decision resolves direction only: D04 content should be redistributed to successor elasticity units and the standalone unit retired later through CLI. No protected machine mutation is authorized in S9; D04 remains promotion-blocked until a separate CLI-only mutation sprint executes the decision.

Update 2026-05-16: `S9a D04 CLI-Only Mutation Sprint` is completed. S9a applied the CP-5 D04 decision through `unit-deprecate.js`, marking `D04` deprecated in favor of `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, and `D27`; recorded a mutation plan, CLI mutation log, and stale-reference audit; removed the single active D04 citation from target exercise `2.1.3`; updated unit-design-status reports to `retired_after_cli_mutation`; and resolved QC issue `R8-QC-007`. No hand edits to `references/machine/` or `references/external/` occurred, no D04 prerequisite edge was added, and diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, and PV machine promotion remain blocked.

Update 2026-05-18: `SYNC-1 Roadmap Reconciliation` is completed. The reference roadmap now reflects the lesson-side May 18 closures: L1.5P corrected the Book 1 12-paragraph print scope, L1.5Q made v5 the active 54-record curriculum-source baseline, and L1.6 closed PASS WITH FLAGS after proving fresh paragraph transfer for `1.1.3`. This evidence does not approve broad lesson scaling. The coming period is a foundation-hardening phase: normalize the rough three-year blueprint as a non-authoritative v5-aware planning prototype, classify MTU and target-exercise gaps before mutation, keep migrated target exercises visibly non-final, and preserve blocks on diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, and PV machine promotion.

Update 2026-05-18: The Sprint Ledger now sits at the top of the roadmap, directly after metadata. The currently-active sprint sits first, future sprints follow in sequence, and closed sprints are archived in a separate `Closed Sprints` section.

Update 2026-05-19: Sprint log procedure now co-locates new and currently-active sprint plans with baseline, result, diff, and review logs under `reports/sprints/`. Sprint closure now includes a structural lead-review assignment, round-1 review log, correction log, and round-2 recheck log; if the recheck is not `PASS` or `PASS WITH FLAGS`, agents must stop and report back instead of closing.

Update 2026-05-19: L1.6R reopened the lesson-side `1.1.3` companion quality verdict for dual-coding failure. The L1.6 fresh-build and procedure-contract proof remains useful, but broad scaling is still blocked because the main graph/table explanation surfaces did not consistently show the table/graph learning objects. Reference-side Content Track 2 must treat semantic dual-coding as an evidence-backed quality gate: a correct procedure without the visible learning object is a failure, not a non-blocking flag.

Update 2026-05-19: `REF-CT2 Year-1 Precision And Dual-Coding Audit` completed as a non-mutating audit sprint. It preserved the L1.6R calibration rule, recorded current lesson-side `1.1.3` L1.6R status as `pass_with_flags` while keeping the remaining Part A `FLAG`, identified `1.3.2` and `1.3.3` source/lesson topic mismatches, and left CP-6/Year 1 blocked with 0 CP-6 quality-ready records. A new `REF-CP6 Year-1 CP-6 Remediation And Review Readiness` sprint is inserted before Year-2 skeleton work.

Update 2026-05-19: `REF-CP6 Year-1 CP-6 Remediation And Review Readiness` completed as a non-mutating review-readiness sprint. It created the `GATE-CP6-year-1-paragraph-coverage` review packet, routed all REF-CT2 blockers into seven decision lanes, and kept CP-6/Year 1 open. The next active step is the formal CP-6 human-review gate or an explicitly inserted narrower remediation sprint if the reviewer chooses not to run the gate yet.

Update 2026-05-19: `GATE-CP6 Year-1 Paragraph Coverage Human Review` completed as a non-closing routing gate. The human answer set keeps CP-6 and Year 1 open, treats active v5 as the intended source for `1.3.2`/`1.3.3`, requires reviewed integration/transfer target exercises for `1.1.4`, `1.2.4`, and `1.3.4`, requires classification of nine backfill candidates before mutation, keeps the remaining `1.1.3` Part A `FLAG` blocking unconditioned closure, requires current graph-heavy review evidence, and forbids protected mutation or closure now. The roadmap now opens five bounded remediation lanes: CP.6a lesson-side alignment, CP.6b target-exercise review, CP.6c MTU backfill classification, CP.6d graph-heavy evidence upgrade, and CP.6e focused `1.1.3` Part A re-review.

Update 2026-05-19: `CP.6a Book 1 Chapter 1.3 Lesson-Side Alignment` completed as a non-mutating alignment-plan sprint. It records the exact active-v5 mismatch, identifies existing lesson-side `1.4.1`/`1.4.2` material as the likely equivalent for active-v5 `1.3.2`/`1.3.3` while carrying forward its `PASS WITH FLAGS` state, and records that current Book 1 `Kostenstructuren`/`Opbrengsten` belong to active-v5 Book 2. The source/lesson mismatch is not resolved yet; it requires a later authorized lesson-side regeneration/remediation sprint before CP-6 closure can count it as fixed. The next active remediation lane is CP.6b target-exercise review.

Update 2026-05-19: Lesson team completed `L-CP6A Book 1 Chapter 1.3 v5 Alignment Remediation` and pushed lesson commit `1aa63e4f0968c39141c1a04809f6410b5435ee34` with platform commit `6e2c06684e0c9b782cf005027a3b2ef3fd9fd230`. References recheck records the CP.6a source/lesson mismatch as fixed with carried conditions: active Chapter 1.3 now contains `1.3.2 Marktevenwicht`, `1.3.3 Verschuivingen en nieuw evenwicht`, and a rescoped `1.3.4 Gemengde opgaven`; costs/revenue material is archived for Book 2 survival. Local recheck passed Chapter 1.3 validation, Book 1 health `26/26`, print scope `12/12`, and v5 target-exercise count `54` with `12/12/14/16`. CP-6 and Year 1 remain open; CP.6b, CP.6c, CP.6d, and CP.6e remained required at that point before any closure proposal.

Update 2026-05-20: `EX-NS0 Exam Ingestion North-Star Guidance` completed as a cross-repo guidance and roadmap update. Official exam-question ingestion is now explicit as the shared end-state: prompt, source annexes, official correction model, point allocation, answer-construction requirements, operation decomposition, MTU mapping, and lesson-build handoff must become separately traceable. Future reference work inserts EX-0 through EX-4 after the CP-6 remediation/recheck route is explicit enough for a responsible hold or closure proposal; lesson work inserts L-EX0/L-EX1 before L2.4-TEA. This update authorizes no protected reference mutation, no exam-ingestion overlay creation, no lesson-output mutation, no target-exercise promotion, no unit minting, no CP-6 closure, and no Year-1 closure.

Update 2026-05-20: `CP.6d Book 1 Graph-Heavy Evidence Upgrade` completed as a non-mutating evidence-ledger sprint. It rechecked the live lesson repo after L-CP6A and records active `1.3.2 Marktevenwicht`, active `1.3.3 Verschuivingen en nieuw evenwicht`, 0 current Chapter 1.3 source/lesson mismatches, 9 graph-heavy active-v5 records, 9 current Part A review files, 3 current companion visual reviews where companion material exists and is in CP.6d scope, 3 `schema_version: 2` quality refs, 6 legacy/pre-schema quality refs needing later quality workflow, 1 open `1.1.3` Part A `FLAG`, and 0 records allowed as CP-6 closure evidence now. Output: `references/data/sprints/CP.6d-graph-heavy-evidence.json` and `reports/reference-planning/CP.6d-graph-heavy-evidence.md`. CP-6 and Year 1 remain open; `CP.6e Focused 1.1.3 Part A Re-Review` became active after this sprint.

Update 2026-05-21: `CP.6e Focused 1.1.3 Part A Re-Review` completed as a non-mutating failed-clearance sprint. It checked the live `1.1.3` Part A files and confirmed the figure first-use order remains `1 -> 3 -> 2`, so the remaining Part A figure-numbering `FLAG` is not cleared. The repeated worked example in `opgaven.md` is accepted as standalone-exercise scaffolding and is not treated as the remaining hard blocker. Output: `references/data/sprints/CP.6e-113-part-a-rereview.json`, `reports/reference-planning/CP.6e-113-part-a-rereview.md`, and `reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md`. CP-6 and Year 1 remain open; the next active action is `CP.6f 1.1.3 Part A Remediation Recheck`, blocked on lesson-side remediation/regeneration evidence.

Update 2026-05-21: Lesson team completed `L-CP6E` and pushed lesson commit `a31f2e11320035f6a616f899fe91a68d8a204c01`; references sprint `CP.6f 1.1.3 Part A Remediation Recheck` then cleared the focused Part A figure-numbering blocker. The live `1.1.3` Part A markdown, regenerated HTML, and regenerated PDF now first mention figures as `1 -> 2 -> 3`; `1.1.3-quality-ref.yaml` records Part A `PASS WITH FLAGS` with the figure-order flag fixed and the repeated worked example carried as accepted non-blocking scaffolding. Recheck output: `references/data/sprints/CP.6f-113-part-a-recheck.json` and `reports/reference-planning/CP.6f-113-part-a-recheck.md`. CP-6 and Year 1 remain open; no protected mutation, lesson-output mutation, target-exercise promotion, placeholder finalization, unit minting, closure, or product-use authorization occurred. `EX-0 Exam Ingestion Contract Design` is now the active next sprint.

Update 2026-05-21: `EX-0 Exam Ingestion Contract Design` completed as a non-mutating contract-design sprint. It added the exam-ingestion schema, data-folder README, review procedure, contract validator, and `GATE-EX0-exam-ingestion-contract` review packet. The contract keeps prompt metadata, source annexes, graph/table/figure objects, official correction-model steps, point rules, accepted alternatives, partial-credit rules, precision/unit requirements, skill decomposition, MTU gap classification, and lesson-build handoff separately traceable. It creates no pilot overlay records. EX-1 is now the active pilot-preparation lane, but GATE-EX0 human review must authorize the contract before any pilot overlay data is treated as accepted evidence. No protected mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output was authorized.

Update 2026-05-21: `GATE-EX0 Exam Ingestion Contract Human Review` closed as `pass_with_conditions`. The gate authorizes `EX-1 Exam Source Annex And Answer Model Pilot` to create three bounded non-mutating `references/data/` pilot overlays only: one calculation-heavy, one graph/source-heavy, and one reasoning/answer-model-heavy. Conditions carried into EX-1: graph/source-heavy pilot items may not be marked `reviewed_ready_for_mapping` unless required graph/table/source values are reconstructable or blocking gaps are carried; EX-1 must add a separate pilot-overlay validator; L-EX0 should make assumed prior knowledge with MTU evidence and deliberately out of scope with reason explicit; and `pass_with_gaps` may be used only when named gaps remain visible downstream and block affected use. No protected mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output was authorized.

Update 2026-05-21: `EX-1 Exam Source Annex And Answer Model Pilot` completed as a bounded non-mutating pilot. It created exactly three pilot overlay families under `references/data/exam-ingestion/` for official VWO 2025 tijdvak 1 items: q3 as calculation-heavy, q19 as graph/source-heavy, and q15 as reasoning/answer-model-heavy. It added `build-scripts/references/check-exam-ingestion-pilots.js` and adjusted the EX-0 contract checker so pilot files require the closed GATE-EX0 authorization and the pilot validator. The q19 graph/source-heavy record remains blocked by visible `q19-source-annex-gap` and `q19-graph-object-gap` records and is not `reviewed_ready_for_mapping`. EX-1 authorizes no protected mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output. `EX-2 Exam-to-MTU Mapping Review Gate` is now the active next sprint.

Update 2026-05-22: Lesson roadmap gained three explicit pre-scale companion gates after L1.7A: the original `L1.7B Exit Ticket Game MVP + Companion Completion Contract` lane, `L1.7C Three-Aspect Game Quality Upgrade`, and `L1.7D Paragraph Landing Page Information Architecture Cleanup`. The original L1.7B lane has since been split into `L1.7B-C` contract-only evidence and `L1.7B-R` future safe implementation. This reference roadmap now tracks that dependency as `LESSON-SCALE-1`: broad companion/product scaling must wait for the companion-set contract, game-row quality rubric, landing-page IA, and L2.0 house-style burn-down. A local untracked platform candidate exists at `knowledge/exit-ticket-game-1.1.1.zip`; lesson L1.7B-R must resolve whether that prototype becomes source-controlled review input or is rewritten before implementation. This update authorizes no lesson-output mutation, protected reference mutation, target-exercise promotion, placeholder finalization, unit minting, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or product-use claim.

Update 2026-05-22: Added `GAME-UX-1 Shared Skill-Map Engine Architecture` as platform support for lesson `L1.7C-0`. The companion game architecture is now tracked as three separate practice engines (`Redeneren`, `Rekenen`, `Grafieken`) plus one shared skill-map / skill-tree engine for progression display, aspect filtering, recommended-next-skill, prerequisites, locked/open/completed states, progress/stars, and compact/route/full display modes. The shared engine is route/progression UI, not a fourth game. It must avoid unfiltered all-skill views by default; exit ticket may use compact checkpoint mode; landing IA should consume scoped routes. This update authorizes no lesson-output mutation, protected reference mutation, target-exercise promotion, placeholder finalization, unit minting, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or product-use claim.

Update 2026-05-23: Lesson L1.7A closed PASS WITH FLAGS as a readiness decision sprint. Current lesson validation is green for `1.1.1` through `1.1.3`, procedure contracts, Book 1 health, print scope, and v5 target-exercise counts, but the decision explicitly rejects broad companion scaling. The allowed lesson path remains foundation hardening: L1.7B-C exit-ticket companion contract, L1.7C-0 shared skill-map contract, L1.7C game-row quality upgrade, L1.7D landing-page IA, L2.0 house-style cleanup, L1.7B-R safe exit-ticket MVP, GATE-L1.7B, then Scale Gate 1. This update authorizes no lesson-output mutation, protected reference mutation, target-exercise promotion, placeholder finalization, unit minting, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or product-use claim.

Update 2026-05-23: Lesson L1.7B-C completed a contract-and-stop pass, not a student-output build. The lesson team inspected local untracked prototype `knowledge/exit-ticket-game-1.1.1.zip`, ran its prototype unit test successfully, and recorded it as design evidence only. The companion-completion contract and future exit-ticket MVP scope now exist in `archive/sprints/L1.7B/`, but implementation is paused because the prototype is not source-controlled, uses mastery/score/pass/evidence/adaptive-focus semantics, and depends on compact checkpoint-mode skill-map behavior that L1.7C-0/GAME-UX-1 had to define first. Lesson L1.7B-R remains the future safe resume path. This update authorizes no lesson-output mutation, prototype import, target-exercise promotion, protected reference mutation, placeholder finalization, unit minting, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or product-use claim.

Update 2026-05-23: Lesson L1.7C-0 closed PASS WITH FLAGS as the shared skill-map contract sprint. The lesson-side contract in `archive/sprints/L1.7C-0/` defines one shared route/progression/filtering layer for `Redeneren`, `Rekenen`, `Grafieken`, compact checkpoint-mode exit tickets, and landing-page route previews. It defines `compact`, `route`, and restricted `full` modes; aspect filters for reasoning, calculation, graphical, and explicit mixed views; non-mastery state/progress language; and accessibility expectations. `GAME-UX-1` is now the platform implementation lane for this closed contract, while lesson L1.7C is active for game-row quality review and must stop if meaningful review requires platform implementation first. This update authorizes no lesson-output mutation, target-exercise promotion, protected reference mutation, placeholder finalization, unit minting, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or product-use claim.

Update 2026-05-23: `GAME-UX-1 Shared Skill-Map Engine Architecture` completed as platform runtime support for lesson `L1.7C-0`. The platform now has a shared `skill-map-engine.js` view-model layer with aspect filters (`reasoning`, `calculation`, `graphical`, explicit `mixed`), compact/route/restricted-full modes, non-mastery state labels, local-practice-only progress/stars, and boundary flags forced false. Skill-tree base data and deploy bundles expose MTU `aspects`; reasoning, calculation/procedure, and graphical engines can request scoped routes; future skill-tree data carries compact defaults so `activeSkills: null` is not the default all-skill student route. No lesson output was generated, no exit-ticket prototype was imported, and no protected mutation, machine-reference mutation, unit minting, target-exercise promotion, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or product-use claim was authorized.

Update 2026-05-24: Lesson L1.7C first human review returned REVISE because the
shared route panel could expose internal skill IDs such as `A61` in visible
student focus text. The targeted platform support now renders the focus line
from student-facing skill labels, adds an `A61` regression test, refreshes
lesson landing-copy generation so `1.1.1` only lists available practice routes,
and records route-panel screenshot evidence in the lesson repo. Focused human
recheck on 2026-05-24 accepted the fix and lesson L1.7C closed PASS WITH FLAGS.
Remaining lesson-side game-row concerns are scaling flags, not closure blockers:
`Rekenen` is still procedure/stappenplan practice rather than a full numeric
calculation engine, `Grafieken` has one less-labelled variant, `Redeneren` needs
richer variants/replay value, and reusable game screenshot QA should mature.
This update authorizes no broad companion scaling, protected mutation,
target-exercise promotion, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, or
product-use claim.

Update 2026-05-24: Lesson L1.7D is technically ready for human review after
platform-owned landing-page information architecture cleanup. The generator now
renders paragraph landings as `Start`, `Leer`, `Oefen`, optional `Check`, and
`Verdiep`; `Check` stays hidden until a reviewed exit-ticket exists; `Oefen`
uses guided support plus scoped `Redeneren`, `Rekenen / stappenplan`, and
`Grafieken` routes where available; the full skill map and source/download
surfaces are collapsed under `Verdiep`. Lesson evidence records green deploy
link/data checks, focused landing Jest, complete student-web validation for
`1.1.1` through `1.1.3`, procedure contracts, Book 1 Part A health, v5
target-exercise counts, representative screenshot QA, and full platform Jest.
L1.7D is not closed until human review records and a lead-review summary exist.
This update authorizes no broad companion scaling, protected mutation,
target-exercise promotion, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, or
product-use claim.

Update 2026-05-24: Lesson L1.7D closed PASS WITH FLAGS after human review.
The controlled landing route is accepted for pilot use; no implementation
revision is required. Carried flags: `Rekenen / stappenplan` is not a full
numeric calculation engine, `Check` remains hidden until reviewed
non-summative exit-ticket output exists, screenshot evidence is representative,
and `1.1.4 Gemengde opgaven` needs a dedicated consolidation landing pattern
before broad scale. Lesson L2.0 is now the active foundation-hardening cleanup
sprint. Broad companion scaling remains blocked.

Update 2026-05-22: `GATE-EX2 Exam-to-MTU Mapping Review` closed as `pass_with_conditions` for classification and routing only. The gate records q3 `q3-calc-1` as `operation_registry_need`, corrects the support route from stale/incorrect `A15` to `A61`, keeps q3 threshold wording as `answer_skill_need`, keeps q19 blocked by `q19-source-annex-gap` and `q19-graph-object-gap`, adds `A42` plus `D10` as q19 graph-operation support while downgrading `A45` to weak support, records q19 chained reasoning as provisional `operation_registry_need`, accepts `D27`/`F03`/`F09` for q15 content coverage only, and keeps q15 two-step correction-model wording as `answer_skill_need`. EX-2 authorizes `EX-3 Exam Coverage Dashboard` reporting only. It authorizes no protected mutation, external-source mutation, unit minting, operation-registry mutation, answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

Update 2026-05-22: `EX-3 Exam Coverage Dashboard` completed as a reporting-only sprint. It added `reports/json/exam-ingestion-coverage.json`, `reports/markdown/exam-ingestion-coverage.md`, and `build-scripts/references/check-exam-ingestion-coverage.js`. The dashboard records 3 pilot items, 8 reviewed classifications, q3 `A61` support with stale `A15`, q19 `A42`/`D10` support with weak `A45`, q3/q15 answer-skill needs, and q19 blocked by 2 source/graph gaps. EX-3 authorized no protected mutation, external-source mutation, unit minting, operation-registry mutation, answer-skill mutation, lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use.

Update 2026-05-22: `EX-4 CLI-Backed MTU / Operation / Answer-Skill Mutation Planning` completed as governed mutation-planning prep only. It prepared `GATE-EX4-mutation-planning` with mutation candidates, a disabled CLI/readiness plan, and a human review packet. The next active item is `GATE-EX4 Mutation Planning Human Review`; it must decide later bounded routing before any mutation, CLI execution, source-annex extraction execution, or lesson handoff can proceed. EX-4 authorizes no protected mutation, external-source mutation, machine-reference mutation, unit minting, operation-registry mutation, answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

Update 2026-05-23: `GATE-EX4 Mutation Planning Human Review` closed as `pass_with_conditions` for routing/design authority only. The gate keeps q3 `q3-calc-1` as a later operation-registry design candidate with `A61` support and stale `A15`, keeps q3 `q3-answer-1` and q15 `q15-answer-1` as answer-skill candidates, keeps q19 source-annex and graph-object extraction as blocking prerequisites, carries q19 `A42`/`D10` candidates with weak `A45`, and authorizes `EX-5 Operation And Answer-Skill Registry Contract` as a bounded tooling/design sprint only. GATE-EX4 authorizes no protected mutation, external-source mutation, machine-reference mutation, unit minting, operation-registry mutation, answer-skill mutation, PV/graph mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, q19 extraction execution, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

Update 2026-05-24: `EX-5 Operation And Answer-Skill Registry Contract` completed as a design-only sprint. It added the operation/answer-skill/q19 extraction contract under `references/data/exam-ingestion/`, a schema, a read-only checker, and `GATE-EX5-operation-answer-skill-contract` review packet. The contract keeps future operation candidates, answer-skill candidates, and source-annex extraction overlays as not-yet-created `references/data/` surfaces; preserves q3 `A61` support with stale `A15` rejected; preserves q19 `A42`/`D10` support with weak `A45` and blocking `q19-source-annex-gap` / `q19-graph-object-gap`; and preserves q3/q15 answer-skill visibility. The next active item is `GATE-EX5 Operation And Answer-Skill Contract Human Review`. EX-5 authorized no protected mutation, external-source mutation, machine-reference mutation, unit minting, operation-registry mutation, answer-skill mutation, q19 extraction execution, PV/graph mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

Update 2026-05-25: `SYNC-2 Exit-Ticket And Scale-Gate Roadmap Precision` completed as a roadmap-only synchronization. Lesson L1.7B is now split into `L1.7B-C` closed contract-only and `L1.7B-R` future boundary-safe MVP resume; lesson-side `GATE-L1.7B` is required before Scale Gate 1; platform `GAME-UX-2` is inserted as the future source-controlled non-summative checkpoint-engine support lane; L2.0 must classify L1.7C game-row carried flags and define exit-ticket readiness; and Scale Gate 1 now requires or explicitly waives L2.0, L1.7B-R, GATE-L1.7B, L1.7C flag disposition, L1.7D landing IA, minimal curriculum-versioning readiness, and the GATE-EX6 operation-answer-skill planning review state. This update authorizes no lesson-output mutation, prototype import, protected reference mutation, external-source mutation, machine-reference mutation, unit minting, operation/answer-skill mutation, target-exercise promotion, CP-6/Year-1 closure, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student/product use.

Update 2026-05-25: Lesson L2.0 is technical-QA green / ready for human review,
not closed. The lesson sprint now has a house-style baseline, PASS WITH FLAGS
definition, flag-disposition table, quality-ref status standard, exit-ticket
readiness checklist, validation log, technical QA report, screenshots, and
human-review packet. Platform support added a consolidation landing rule:
`1.1.4 Gemengde opgaven` now routes to primary `Oefen gemengd` and the Chapter
1.1 card shows `Oefen gemengd` instead of treating the paragraph as
Verdiep-only. Green gates include focused landing Jest 2/2, deploy link/data
checks, Book 1 health 26/26, procedure contracts 341 checks, v5 target-exercise
counts, `1.1.4` screenshot QA, and full platform Jest 544 passed / 8 skipped.
This authorizes no L2.0 closure, broad companion scaling, exit-ticket
implementation, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, CP-6
closure, or Year-1 closure.

Update 2026-05-25: Lesson L2.0 closed PASS WITH FLAGS after human review. The
consolidation landing rule is accepted: `1.1.4 Gemengde opgaven` presents as
`Oefen gemengd`, not as a Verdiep-only leftover. L2.0 also closed the
house-style baseline, PASS WITH FLAGS definition, flag-disposition table,
quality-ref status standard, screenshot/QA expectations, and exit-ticket
readiness checklist. Carried flags remain: `1.1.4` has legacy `FLAG` status,
graph-drawing consolidation and profit-formula framing need later content
review, `Rekenen / stappenplan` is not a full numeric calculation engine,
graph/reasoning game variants remain MVP-level, and exit-ticket implementation
continues through lesson L1.7B-R plus GATE-L1.7B. This authorizes no broad
companion scaling, exit-ticket implementation, diagnostics, adaptive routing,
mastery/sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, CP-6 closure, or Year-1 closure.

Update 2026-05-25: Lesson L1.7B-R produced its operational resume plan,
baseline audit, platform support request, stop decision, and validation log
under `archive/sprints/L1.7B-R/`. The lesson team did not import the untracked
prototype, did not implement platform runtime code, did not generate lesson
output, and did not activate landing-page `Check`. The platform support request
for `GAME-UX-2` is now present. After EX-7 closure, GAME-UX-2 is the next
platform start decision but still requires explicit start authorization or
waiver before implementation. GATE-L1.7B and Scale Gate 1 remain blocked until a
source-controlled, generated, non-summative exit-ticket checkpoint surface
exists and passes review.

Update 2026-05-25: `GATE-EX5 Operation And Answer-Skill Contract Human Review`
closed as `pass_with_conditions` for design-contract review only. The gate
accepts the EX-5 operation/answer-skill/q19 extraction contract as adequate for
later bounded validator/CLI planning; preserves overlay-first future storage
under `references/data/exam-ingestion/`; keeps q3 `A61` support with `A15`
rejected; keeps q19 `A42`/`D10` support with `A45` weak and
`q19-source-annex-gap` / `q19-graph-object-gap` blocking; and keeps q3/q15
answer-skill needs visible. The next active lane is `EX-6 Validator And CLI
Implementation Planning` only. GATE-EX5 authorizes no candidate writes, q19
extraction execution, protected mutation, external-source mutation,
machine-reference mutation, unit minting, operation-registry mutation,
answer-skill mutation, PV/graph mutation, target-exercise promotion,
lesson-output mutation, CP-6 closure, Year-1 closure, diagnostics, adaptive
routing, mastery, sequencing, student-facing AI, summative use, PV projection,
PV machine promotion, or student-facing output.

Update 2026-05-26: `EX-6 Validator And CLI Implementation Planning` completed
as a planning-only sprint. It added future-storage schemas for operation
candidates, answer-skill candidates, and source-annex extraction overlays,
recorded the validator/CLI implementation plan, added a read-only EX-6 checker,
and prepared `GATE-EX6-validator-cli-planning` for human review. EX-6 did not
create persistent candidate-storage files, candidate records, q19 extraction
records, future mutation CLIs, or lesson output. The next active reference gate
is `GATE-EX6 Validator And CLI Planning Human Review`; it may review whether a
later bounded validator and dry-run CLI implementation sprint is acceptable,
but it must not authorize candidate writes, q19 extraction execution, protected
mutation, external-source mutation, machine-reference mutation, unit minting,
operation-registry mutation, answer-skill mutation, PV/graph mutation,
target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1
closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student-facing output.

Update 2026-05-26: `GATE-EX6 Validator And CLI Planning Human Review` closed
as `pass_with_conditions` for validator/dry-run CLI implementation only. The
gate accepts the EX-6 three-schema split and validator/CLI implementation plan
as adequate for a later bounded implementation sprint. The next active lane is
`EX-7 Validator And Dry-Run CLI Implementation` only. EX-7 may implement
validators, dry-run-only CLIs, temporary non-persistent test fixtures, and
rejection tests for the GATE-EX6 conditions. EX-7 must not create candidate
storage, write candidate records, execute q19 source-annex or graph-object
extraction, mutate protected references, mutate external sources, mutate
machine references, mint units, mutate operation or answer-skill registries,
mutate PV/graph records, mutate lesson output, close CP-6/Year 1, or authorize
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student/product use.

Update 2026-05-26: `EX-7 Validator And Dry-Run CLI Implementation` completed
as a bounded validator/dry-run CLI implementation sprint. It added shared
candidate validation support, read-only operation/answer-skill and
source-annex extraction validators, dry-run-only candidate CLI wrappers, and a
self-checker that uses temporary OS-temp fixtures. It also aligned the future
operation and answer-skill schemas with explicit status fields and typed
unit-support assessments. EX-7 created no candidate-storage files, wrote no
candidate records, executed no q19 extraction, mutated no protected/external or
machine references, changed no lesson output, and authorized no CP-6/Year-1
closure or student/product use. Platform `GAME-UX-2` has since closed; the
remaining lesson-side pre-scale blockers are tracked through `LESSON-SCALE-1`.

Update 2026-05-26: Lesson `L1.7B-MAP Exit Ticket Skill-Metadata Alignment`
closed PASS WITH FLAGS. The `1.1.1` checkpoint metadata now uses `B01/B02` for
checkpoint-assessed target/scope fields, removes `A04`, records the
target-exercise skill set as `A43/B01/B02`, and keeps
`targetReadinessEvidence: false`. This resolves the prior metadata mismatch for
the current checkpoint role only. It does not make the checkpoint
target-exercise-readiness evidence, does not authorize scale reliance, and does
not authorize diagnostics, adaptive routing, mastery/sequencing, student-facing
AI, summative use, PV projection, or PV machine promotion. The next lesson-side
work, if continued, is `L1.7B-P23`.

Update 2026-05-26: Lesson `L1.7B-P23 Exit Ticket Target-Skill Checkpoint
Designs For 1.1.2 And 1.1.3` is ready for human review with a stop/handoff
decision. Operation-chain analysis shows `1.1.2` requires calculation/work
fields, final answer entry, notation handling, and short explanation, while
`1.1.3` requires table/graph handling, economic axis convention, graph drawing
or point placement, interpolation, and short explanation. The current
exit-ticket engine/UI supports only choice tasks, so no `1.1.2` or `1.1.3`
checkpoint output was generated. Platform task-type support is required before
these checkpoints can become target-exercise-readiness evidence.

Update 2026-05-28: Lesson `L1.7B-P23` closed PASS WITH FLAGS. Human review
accepted the stop/handoff decision as the correct product decision: generating
choice-only exit tickets for `1.1.2` and `1.1.3` would undercut the
target-exercise-readiness specification. `Check` remains hidden for both
paragraphs and no generated exit-ticket output was created. The next
lesson-companion dependency, if work continues, is platform exit-ticket
task-type expansion before `L1.7B-Q2`.

Compatibility decisions:

- Sprint `R0.1` now means the sprint-execution scaffold.
- The older local `R0.1` / `R0.2` history is preserved as completed historical `H0.x` work, not as active roadmap numbering.
- `R0.1 Sprint Execution Scaffold` is completed.
- `R2.3 Human Review And Gate Closure` is completed with `GATE-R2-empty-needs` status `hold`.
- `R2.4 Evidence And Unit-Design Cleanup` is completed as a non-mutating review packet.
- `R3.2 Apply Reviewed Empty-Needs Corrections` is completed; the approved mutation set was applied through CLI.
- Current catalog metrics reflect the post-merge `main` state after R7.5 validation.
- `R3.1 Reference CLI And Documentation Completion` is completed. CLI documentation and command coverage now distinguish ready mutation paths from remaining blockers.
- The active roadmap is narrowed to reference and RAG data quality. Delayed product surfaces such as diagnostics, adaptive routing, teacher cockpit, student-facing AI, games, simulations, privacy deployment, accessibility deployment, and continuous-improvement claims are intentionally out of scope for this roadmap until the data foundation is stronger.
- The exercise-schema roadmap restores the HCS two-axis role model (`instructional_role`, `assessment_role`), the four-field `scaffolding` object, and CP-1 through CP-8 cross-team checkpoints.
- New registries under `references/machine/` remain future end states only. They require schema, CLI, validators, and mutation logs before machine files are created or changed.
- `R9.2 Content Graph Projection` is completed. Owned-source content is queryable through a separate projection graph without changing R5 alignment authority.
- `Phase RX Representation-Sensitive Micro-Unit Decomposition` is adopted as a dedicated reference-team phase. RX.1, GATE-RX2, and GATE-RX2b closed as `pass_with_conditions`; RX.2 and RX.2b applied bounded lanes through CLI-only mutation and now block student-facing use through explicit generator-block tracking.
- `R8.1 Scoped QC Issue Model` is completed. Quality issues are internal-only governance signals with proof-to-close fields, exposed to dashboards and RAG as diagnostic generated-report context only.
- `RX.2b Graphical Foundation Coverage And Mutation` is completed before RX.3. Producer/profit graph work may now proceed only with the RX.2b dependencies live or explicitly held; `A71` remains held/high-risk.
- `S6 Bronnen Registry MVP` is completed as a `references/data/` registry overlay. No hand-maintained `references/machine/` source-document registry was created.


## Operating Rule

Every sprint must keep plans and completion status explicit.

Each sprint must have:

- a committed sprint plan
- an operationalized sprint procedure that expands the roadmap description into executable steps, decision points, stop conditions, outputs, and acceptance tests
- a baseline report
- bounded allowed and forbidden paths
- acceptance tests
- a result report
- a diff summary
- a completion status in this roadmap
- a deterministic sprint-bundle check before completion

The sprint plan must be more detailed than the sprint row in this roadmap. It must preserve every substantive instruction from the roadmap phase, sprint description, review-gate model, and current-state notes. If an instruction exists in the roadmap but is missing from the sprint plan, the plan is incomplete and the sprint must not proceed.

Machine-reference changes must go through CLI scripts. Do not hand-edit `references/machine/` or `references/external/`.

## Sprint Planning Contract

This contract applies to every sprint in the ledger.

Before execution, the sprint plan must include an `Operationalized sprint procedure` section that answers:

- what exact sequence of work will happen
- which roadmap instructions are being carried forward
- what artifacts prove the work happened
- what validators must pass
- what requires human review
- where the agent must stop

For human-review gates, the procedure must include the full interview or review protocol, not only the final gate status. R2.3 is the reference example: the plan must include calibration questions, answer recording, pattern analysis, targeted follow-ups, closure proposal, explicit human confirmation, and only then gate records.

Human-review interviews must be interactive: ask one question at a time, offer clear multiple-choice options where useful plus an open-answer option, record the answer, and then choose the next question or next interview mode. Do not dump a full interview list at the human reviewer. Include enough context in each question that the reviewer does not need to look up unit IDs or shorthand labels.

After a gate is closed, `gate-closure.json` is the canonical status file. Review packets can remain historically accurate with "prepared/not closed" wording from their creation moment; agents must check the closure file before drawing current gate-status conclusions.

## Subagent And Verification Structure

Subagents are part of the sprint control system, not a substitute for it.

Default sprint structure:

1. A planning/review subagent checks whether the sprint plan fully operationalizes the roadmap description, baseline, required logs, stop conditions, and review gates.
2. The main agent executes the sprint and keeps ownership of integration, file changes, and roadmap state.
3. Specialist subagents may review bounded pedagogy, evidence, data-integrity, code, or dashboard questions.
4. A verification subagent reviews the completed artifacts or test evidence before the sprint is considered done when the sprint has meaningful risk.
5. The deterministic sprint-bundle checker verifies that required logs exist and point to each other.

The deterministic checker cannot prove pedagogical quality. It must prove the mechanical part: plan, plan JSON, baseline, result, diff summary, result JSON, protected-surface declarations, and validator references.

## Cross-Team Checkpoints

The current roadmap uses cross-team checkpoints to keep reference engineering and content strategy synchronized. Target dates are capacity-bound planning targets, not delivery promises.

Each checkpoint follows the existing review-gate discipline:

```text
subagent review -> human review -> recorded decision
```

Allowed decisions:

```text
pass | pass_with_conditions | hold
```

Checkpoint artifacts belong under:

```text
reports/review-gates/<gate-id>/
```

| Checkpoint | Capacity-bound target | Gate ID | Track gate | Engineering produces | Content reviews |
|---|---:|---|---|---|---|
| CP-1 Schema audit review | 2026-05-08 | `GATE-CP1-schema-audit` | Pre-R9.1 | Audit table plus vocabulary-rename and overlay proposal | Audit covers Bloom, vraagtype, instruction word, dual-coding stage, level, graph specs, precision lint, and direct eindterm linkage |
| CP-2 R9.1 owned-source scope review | 2026-05-15 | `GATE-CP2-owned-source-scope` | During R9.1 | Source-surface list with status and authority labels | All relevant companion artefact types are represented; authority weights match content reality |
| CP-3 Schema extension dry run | 2026-06-05 | `GATE-CP3-schema-extension-dry-run` | Pre-bulk extension | One Tier A item and one Tier C target exercise manually represented in the proposed schema | Round trip is lossless enough that a reviewer can reconstruct the exercise without ambiguity |
| CP-4 Skill registry coexistence | 2026-06-19 | `GATE-CP4-skill-registry-coexistence` | Pre-skill-registry promotion | Three-layer hierarchy: categories on exercise, aspects on unit, fine-grained exercise operations | `skill-categories.md` content is preserved where still valid, including CvTE A mapping, vraagtype mapping, Bloom levels, and distribution rules |
| CP-5 D04 resolution | 2026-07-03 | `GATE-CP5-D04-resolution` | Pre-promotion on D-domain | D04 split/retire/redistribute proposal plus dependent-unit audit | VWO economics review checks the decision against actual D-domain exam items |
| CP-6 Year-1 paragraph-coverage closeout | 2026-07-24 | `GATE-CP6-year-1-paragraph-coverage` | Pre-Year-2 extension | `reports/blueprint-coverage.md` | Year 1 stays open if paragraph target coverage or precision status is not acceptable |
| CP-7 Year-2 anchoring review | 2026-09-04 | `GATE-CP7-year-2-anchoring` | Parallel content-track gate, pre-Year-2 Tier C authoring | Year-2 skeleton with CvTE-vwo anchor status per paragraph | `concept_orphan` rates and sequencing chains are coherent against Year 1 |
| CP-8 RAG eval content coverage | 2026-09-25 | `GATE-CP8-rag-eval-content-coverage` | During R7.6 | Expanded retrieval eval set, target 50-100 cases | Includes content-side queries from HCS feedback, including negative and ambiguity cases |

## Detailed Sprint Backlog

The sprint ledger is a quick status table. This section is the readable backlog. Sprint plans must operationalize these descriptions, not only copy the ledger row.

### S1 Schema Audit And Exercise Naming Contract

Purpose: start the approved exercise-schema roadmap with a non-mutating audit. The audit must compare the current repository data shapes with the schema and field names proposed by HCS, Head of Engineering, and the repository-checked roadmap.

Required work:

- Compare current data shapes in:
  - `references/schemas/exam-question.schema.json`
  - `references/schemas/target-exercise.schema.json`
  - `references/schemas/rag-chunk.schema.json`
  - `references/external/exam-questions.json`
  - `references/authored/course-target-exercises.json`
  - `references/data/rag/chunk_index.jsonl`
- Resolve the naming contract:
  - `required_units` for micro-teaching-unit IDs.
  - `exercise_operations` for fine-grained exercise actions.
  - `skill_tags` or `skill_category_tags` for broader skill taxonomy labels.
- Preserve the HCS role split:
  - `instructional_role`: `worked_example`, `startoefening`, `independent_practice`, `interleaving`, `target`, `verdieping`, `consolidatie`, `instapquiz`, `diagnostic`, `nieuws`.
  - `assessment_role`: optional; omit the field when absent. Allowed v1 values are `exam_mirror`, `bridge`, and `prerequisite`.
- Preserve the HCS scaffolding object:
  - `verbal_level`: integer 0-5.
  - `visual_stage`: integer 1-4.
  - `fading_position`: integer.
  - `dual_coding_present`: boolean.
- Decide which fields belong in source files and which belong in protected-source-safe overlays under `references/data/exercises/`.
- Confirm the corrected SVG verifier path: `build-scripts/lib/verify_svg_geometry.py`, or propose a wrapper if the future field expects a shorter path.
- Produce the CP-1 review packet and gate artifacts under `reports/review-gates/GATE-CP1-schema-audit/`.

Required output: sprint plan, baseline, schema-audit report, vocabulary decision table, overlay strategy, CP-1 review packet, result report, diff summary, and sprint metadata.

Stop condition: do not mutate `references/machine/`, `references/external/`, or bulk exercise data during S1. Stop at CP-1 if the schema audit finds a naming or compatibility issue that cannot be represented safely.

Checkpoint: `GATE-CP1-schema-audit`.

Completion: completed on 2026-04-28 with `pass_with_conditions`. CP-1 approved the schema naming and storage strategy, not bulk metadata implementation. `required_skills` remains a legacy/source field until explicit migration; `assessment_role` is omitted when absent; external overlays must carry source stable ID and curriculum version; and bulk metadata backfill remains blocked until Sprint 4 and CP-3 dry-run.

### R2.4 Evidence And Unit-Design Cleanup

Purpose: respond to `GATE-R2-empty-needs` closing as `hold`. The empty-needs audit is useful, but it is not enough to authorize dependency mutation.

Required work:

- Attach exact exam or target-exercise evidence to any candidate prerequisite edge before it can later be applied.
- Resolve `D04 Elasticiteit en goederenclassificatie` as a unit-design issue. Goods classification belongs inside the relevant elasticity units unless evidence proves a separate unit is needed.
- Classify foundational A-domain empty-needs units, especially `underbouw_assumed` cases.
- Run a second pedagogical pass for labor-market and unemployment sequencing.
- Preserve rejected machine suggestions such as `D10 -> D01/D03`, `D13 -> D03`, and `D32 -> D01/D03` as rejected unless new evidence proves otherwise.

Required output: a review-ready evidence and unit-design packet that states which edges are evidence-backed, which units need design changes, and what remains blocked.

Stop condition: do not edit `references/machine/`; do not proceed to R3.2 until this packet exists and is reviewed.

### R3.1 Reference CLI And Documentation Completion

Purpose: make sure the CLI layer can safely apply reviewed reference changes without hand-editing protected files.

Required work:

- Audit the existing `build-scripts/references/` commands against the actual mutations needed after R2.4.
- Update stale documentation that still describes the CLI as a future contract.
- Add missing validators for any mutation command that can affect unit dependencies, unit status, term links, or evidence anchors.

Required output: CLI documentation and command coverage report.

Stop condition: if a required correction cannot be expressed through CLI, build or specify the CLI first; do not hand-edit machine references.

Completion: completed on 2026-04-26. `reports/reference-cli-coverage.md` and `reports/json/reference-cli-coverage.json` record status `ready_with_blockers`. Human mutation review later authorized a bounded R3.2 mutation set. D04 lifecycle work remains out of scope until a separate unit-design decision is made.

### R3.2 Apply Reviewed Empty-Needs Corrections

Purpose: apply only reviewed and evidence-backed corrections from R2.4 through CLI.

Required work:

- Apply accepted prerequisite edges only when exact evidence is attached.
- Apply accepted `underbouw_assumed` classifications only through the approved workflow.
- Skip blocked items: `D04` until unit design is resolved, labor-market sequencing until the second pass closes, and rejected graph edges unless new evidence overturns the rejection.

Required output: CLI mutation log, regenerated reports, and a diff summary proving protected changes were script-produced.

Stop condition: blocked while the R2.4 packet has not been human-reviewed for mutation decisions or while R3.1 has not confirmed CLI/validator readiness.

Completion: completed on 2026-04-26. Human mutation review exists at `reports/review-gates/GATE-R2-empty-needs/R2.4-mutation-review.md` and `.json`. R3.2 applied only the approved bounded mutation set through CLI. Mutation log: `reports/review-gates/GATE-R2-empty-needs/R3.2-mutation-log.md`.

### R4.1 Unit-Term Slug Migration

Purpose: migrate unit `terms` fields from old canonical text strings to canonical `begrippen.json` slug IDs.

Required work:

- Produce a mapping from current unit term strings to term slugs.
- Flag ambiguous or missing mappings for human review.
- Apply safe mappings through CLI or a validated migration script.

Required output: migration report, unresolved mapping queue, regenerated term coverage.

Stop condition: do not silently create new term slugs or rewrite term meaning during migration.

Completion: completed on 2026-04-26. `build-scripts/references/unit-term-slug-migration.js` applied only safe exact mappings. Initial write changed 79 units, left `alternatieve kosten` and `schaarste` unresolved, and created no new term slugs. `reports/terminology-drift.md` now validates against `begrippen.json` as the primary registry so migrated slug IDs are not false positives.

### R4.2 Exam-Question Extraction Gap Closure

Purpose: improve links between exam questions, required skills, exam codes, and teaching units.

Required work:

- Identify exam-question records with missing required-skill or exam-code links.
- Attach evidence from actual CvTE questions or target exercises.
- Keep syllabus clauses as grouping/coverage context, not as the reason to mint units.

Required output: extraction gap report and reviewed patch queue.

Stop condition: do not invent skills from syllabus prose alone.

Completion: completed on 2026-04-26 as a non-mutating audit. `build-scripts/references/exam-question-gap-audit.js` produced `reports/exam-question-extraction-gaps.md` and `.json`. The queue contains 27 records with missing `required_skills`; 19 also miss `exam_codes`. Current annotations contain 0 invalid unit IDs and 0 invalid exam codes. No files in `references/external/` or `references/machine/` were changed.

### R4.3 Blueprint Flag Triage

Purpose: convert raw blueprint missing-unit flags into curated decisions.

Required work:

- Separate true missing units, existing-unit matches, duplicates, low-priority ideas, and reject/hold cases.
- Prioritize flags backed by target exercises.
- Produce a backlog that can feed later CLI unit creation or evidence work.

Required output: curated blueprint flag backlog with decision category, evidence, and next action.

Stop condition: do not auto-mint units from blueprint prose.

Completion: completed on 2026-04-26 as a non-mutating triage. `build-scripts/references/check-target-exercise-flags.js` produced `reports/blueprint-flag-triage.md` and `.json`. All 84 current raw flags are triaged: 68 `still_needed`, 4 `existing_unit_match`, 1 `duplicate`, and 11 `defer`. No files in `references/machine/`, `references/external/`, or `references/authored/course-target-exercises.json` were changed.

### R4.4 Micro-Teaching Unit Quality Packet

Purpose: gather the remaining micro-teaching-unit quality issues into a single review packet before any further machine-reference mutation.

Required work:

- classify the remaining empty-needs units after R3.2
- classify live units without term links
- carry forward unresolved term strings from R4.1
- carry forward R4.3 blueprint missing-unit triage into mutation-review categories
- separate reviewed non-mutations, ready-for-review candidates, unit-design issues, existing-unit-match candidates, duplicates, and deferred items
- produce a packet that can be reviewed before R4.5

Required output: `reports/review-gates/GATE-R4-micro-unit-quality/R4.4-micro-unit-quality-packet.md` and `.json`.

Stop condition: do not edit `references/machine/`; R4.4 is non-mutating.

Completion: completed on 2026-04-27. Packet produced at `reports/review-gates/GATE-R4-micro-unit-quality/R4.4-micro-unit-quality-packet.md` and `.json`. The packet authorizes no mutation by itself; R4.5 is blocked on human review of the packet.

### R4.5 Apply Reviewed Micro-Unit Corrections

Purpose: apply only reviewed R4.4 packet items through the reference CLI.

Required work:

- use R4.4 packet decisions as the only mutation source
- apply approved dependency edges, term links, unit additions, unit deprecations, or unit-design changes through CLI only
- generate a mutation log and diff summary
- regenerate reference reports, reference health, RAG chunks, and retrieval evals
- stop if validation fails, creates a cycle, creates unresolved IDs, or requires hand editing machine references

Required output: CLI mutation log, regenerated reports, and a reviewed result report.

Stop condition: no mutation is allowed unless it is explicitly approved from the R4.4 packet or a follow-up human decision record.

Completion: completed on 2026-04-28. Human decision recorded at `reports/review-gates/GATE-R4-micro-unit-quality/R4.5-human-review-decision.md` and `.json`. Mutation log recorded at `reports/review-gates/GATE-R4-micro-unit-quality/R4.5-mutation-log.md` and `.json`. R4.5 added `schaarste` and `alternatieve-kosten`, updated `B02` to the canonical term slug, applied 13 approved dependency edges, and minted 19 approved Book 1/2 foundation micro-units through CLI only. Held items (`A42`, `D32`, `D02`, `G11`, `H16`, `H21`, `A11`/`3.1.2`, and `F16` terminology) remain future review work.

### R5.1 Evidence-Anchor Layer

Purpose: create exact proof anchors for important claims, prerequisite edges, term definitions, and unit decisions.

Required work:

- Define evidence-anchor schema and source ranking.
- Attach anchors to high-risk decisions first: prerequisite edges, elasticity decisions, labor-market sequencing, and exam links.
- Distinguish external authority, owned source material, machine registry, and generated reports.

Required output: evidence-anchor records plus validator.

Stop condition: do not let reports or summaries become primary evidence.

Completion: completed on 2026-04-26. R5.1 added `references/data/evidence-anchors.json`, operational evidence-anchor and claim schemas, `build-scripts/references/check-evidence-anchors.js`, and status reports. The first layer contains 15 evidence anchors and 13 claims. Generated reports are explicitly secondary and the validator rejects generated-report anchors marked as primary.

### R5.2 Alignment Graph

Purpose: create graph edges between units, terms, evidence, questions, procedures, misconceptions, and later content surfaces.

Required work:

- Build graph edges only from evidence-backed relationships.
- Separate prerequisite, supports, assesses, explains, contradicts, and derived-from edge types.
- Produce graph integrity reports.

Required output: alignment graph data and integrity report.

Stop condition: graph must not become pedagogically authoritative before R5.3 closes.

Completion: completed on 2026-04-26. R5.2 added `references/data/alignment-graph.json`, `build-scripts/references/build-alignment-graph.js`, `build-scripts/references/check-alignment-graph.js`, and graph integrity reports. R5.3 later approved only named edge groups with conditions; unreviewed graph edges remain pending or diagnostic.

### R5.3 Alignment Graph Review Gate

Purpose: human-review the alignment graph before it powers retrieval, diagnostics, dashboards, or adaptive decisions.

Required work:

- Prepare a review packet with samples from high-risk domains.
- Run subagent reviews for pedagogy, evidence, and data integrity.
- Conduct an interactive human review and record the gate decision.

Required output: gate packet, human interview, gate closure JSON, validator.

Stop condition: retrieval and diagnostics cannot depend on the graph until this gate allows it.

Completion: completed on 2026-04-27 with `pass_with_conditions`. The gate approves only named edge groups, not the whole graph as pedagogically authoritative. Internal dashboard/reporting and internal retrieval development/evaluation may proceed if edge status, source authority, evidence anchors, diagnostic flags, and generated-report warnings are preserved. Student diagnostics, adaptive routing, student-facing AI, automatic mastery decisions, and summative assessment decisions remain blocked.

### R6.1 JSON-First Reports

Purpose: make Markdown reports projections of structured report JSON instead of primary data.

Required work:

- Define report JSON schemas.
- Convert priority reports: needs, terms, procedures, aspects, unresolved refs, dead units.
- Keep Markdown readable but generated from JSON.

Required output: JSON report files, Markdown projections, report validators.

Stop condition: do not make dashboards scrape Markdown as the long-term data interface.

Completion: completed on 2026-04-27. R6.1 added `build-scripts/reports/generate-all.js`, `build-scripts/reports/validate-report-json.js`, 10 required JSON report files under `reports/json/`, and readable projections under `reports/markdown/`. Generated reports remain diagnostic and do not replace source evidence.

### R6.2 Reference Health Dashboard Data

Purpose: produce one generated reference-health state file for dashboards and planning.

Required work:

- Combine report JSON into a dashboard-ready state file.
- Include sprint status, gate status, quality categories, blockers, and trend-friendly counts.
- Keep teacher/student data out of reference health.

Required output: `reports/json/reference-health.json` or successor plus dashboard integration.

Stop condition: dashboard must remain internal/developer-facing.

Completion: completed on 2026-04-27. R6.2 added `build-scripts/reports/generate-reference-health.js`, `build-scripts/reports/check-reference-health.js`, `reports/json/reference-health.json`, and `reports/markdown/reference-health.md`. The state file explicitly blocks student diagnostics, adaptive routing, and student-facing AI.

### R7.1 Deterministic Chunk Layer

Purpose: build retrieval chunks from source-ranked, deterministic references.

Required work:

- Define chunk schema, source rank, stable IDs, and provenance.
- Chunk external, authored, machine, and report surfaces according to their authority.
- Exclude or label generated summaries as secondary evidence.

Required output: chunk index and validator.

Stop condition: no vector-first shortcut.

Completion: completed on 2026-04-27. R7.1 added `build-scripts/rag/build-chunks.js`, `build-scripts/rag/validate-chunks.js`, and `references/data/rag/chunk_index.jsonl`. Generated-report chunks are non-primary and non-authoritative.

### R7.2 Hybrid Retrieval

Purpose: add lexical, entity, and graph retrieval before optional vector search.

Required work:

- Implement deterministic search over terms, units, evidence anchors, exam references, and graph edges.
- Add ranking rules that prefer source authority and exact identifiers.
- Make uncertainty visible.

Required output: retrieval API or script plus evaluation hooks.

Stop condition: retrieval must not hide source rank or evidence weakness.

Completion: completed on 2026-04-27. R7.2 added `build-scripts/rag/query.js` and `build-scripts/rag/validate-query-output.js`. Retrieval is internal only and preserves authority metadata and generated-report warnings.

### R7.3 Retrieval Evaluation Set

Purpose: make retrieval quality regressions visible before teacher-facing use.

Required work:

- Create representative queries for units, terms, exam evidence, procedures, and roadmap questions.
- Record expected source surfaces and unacceptable answers.
- Add repeatable evaluation commands.

Required output: retrieval eval set and report.

Stop condition: no teacher-facing RAG without passing evaluation.

### R7.4 RAG Review Gate

Purpose: approve internal or teacher-facing RAG only after deterministic retrieval and evaluation.

Required work:

- Prepare retrieval evaluation summary and failure cases.
- Run review for evidence fidelity, hallucination risk, and source transparency.
- Conduct human gate review.

Required output: RAG gate packet, human decision, and closure record.

Stop condition: no student-facing AI, diagnostics, adaptive routing, automatic sequencing, mastery decisions, or summative use from this gate.

Completion: completed on 2026-04-27 with `pass_with_conditions`. Internal dashboard use, internal retrieval development, retrieval evaluation, teacher-facing non-authoritative lookup, and human-reviewed lesson-authoring support are allowed. Student-facing diagnostics, adaptive routing, student-facing AI, automatic lesson sequencing, automatic mastery decisions, summative assessment decisions, and unreviewed student-facing publication remain blocked.

### R9.0 Legacy Target Reference Minimization

Purpose: reduce non-functional references to the frozen legacy target before owned-source integration begins. The frozen legacy target remains operationally protected, but it should not remain the default example or course-design backbone for new reference/RAG work.

Required work:

- scan the repository for frozen-legacy-target labels and legacy path references
- classify each occurrence as functional legacy path, frozen-target guardrail, historical planning note, generated artifact, or safe cleanup target
- update safe cleanup targets in current guidance, authored course-design notes, and generic examples
- preserve legacy source-data paths, legacy content-builder paths, `deploy:legacy`, and explicit frozen-target warnings
- regenerate derived inventories/RAG chunks if authored-reference changes affect generated data
- report remaining frozen-legacy-target references by category

Acceptance:

- R9.0 sprint bundle passes
- no hand edits to `references/machine/` or `references/external/`
- remaining frozen-legacy-target references are intentional, categorized, and reported

Stop condition: do not delete or refactor functional legacy paths in this sprint.

Completion: completed on 2026-04-27. Active authored references and generic guidance no longer use the frozen legacy target as the course-design shorthand; remaining frozen-legacy-target references are guardrails, functional legacy paths, historical planning notes, or the R9.0 audit record itself.

### R9.01 Legacy Folder Rename

Purpose: rename repo-local legacy folders so the active repository no longer has folders named after the frozen legacy target.

Required work:

- rename the repo-local legacy source-data folder to `source-data/legacy-target/`
- rename the repo-local legacy content-builder folder to `build-scripts/content/legacy-target/`
- update repo-local script and README references to the new paths
- preserve the external frozen lesson target name and storage behavior
- regenerate inventories and validate the sprint bundle

Acceptance:

- no repo-local directory remains named after the frozen legacy target
- legacy helper scripts resolve the renamed paths
- no hand edits to `references/machine/` or `references/external/`

Stop condition: do not rename or mutate the external frozen lesson target.

Completion: completed on 2026-04-27. Repo-local legacy source-data and content-builder folders now use `legacy-target`; the external frozen lesson target name and storage behavior were not changed.

### R9.1 Owned Source Registry

Purpose: register owned book/source material as source surfaces without confusing it with external authority. This is the first implementation sprint after `GATE-CP1-schema-audit`.

Required work:

- Promote `references/owned/course-blueprint-v4.md` as the canonical owned curriculum-design source for the current partial blueprint.
- Keep `references/owned/course-blueprint-v4.meta.json` attached so retrieval can see that the blueprint is partial, owned, and not external authority.
- Repair target-exercise source references that still point to `knowledge/course_blueprint_v4.md`; the canonical reference-facing source is `references/owned/course-blueprint-v4.md`.
- List owned book materials, paragraph plans, generated textbook surfaces, target exercises, answer models, chapter plans, course blueprint material, and active lesson markdown.
- Define source status for each surface: authored source, generated projection, exercise evidence, answer model, planning artifact, or implementation output.
- Define what can be used as evidence and what is exposition or generated projection.
- Connect owned sources to source manifest and document inventory.
- Keep lesson-output references separate from external authority and protected machine registries.

Required output: owned source registry, schema, validator, blueprint metadata validation, source-manifest integration, and report.

Stop condition: owned exposition cannot override external authority or reviewed machine references.

Checkpoint: `GATE-CP2-owned-source-scope`.

Completion: completed on 2026-04-29 with CP-2 status `pass_with_conditions`. R9.1 created the owned-source registry, repaired 50 target-exercise blueprint references to `references/owned/course-blueprint-v4.md`, generated registry/report artifacts, and recorded human review. R9.2 is unblocked only if owned-source edges default to projection edges and evidence edges are reserved for explicitly evidence-qualified records.

### R9.2 Content Graph Projection

Purpose: project owned content into the reference graph for navigation and coverage without making it canonical evidence by accident.

Required work:

- Use `references/owned/course-blueprint-v4.md` as the course-design backbone for blueprint paragraph, chapter, target-exercise, and difficulty-note projection edges.
- Link paragraphs, exercises, visuals, procedures, summaries, and answer models to units and terms.
- Mark projection edges separately from evidence edges.
- Preserve source type, source path, authority level, and generated/projection status in every edge.
- Produce coverage reports for owned content against the reference graph.
- Regenerate RAG chunks so owned-source retrieval works without weakening evidence hierarchy.

Required output: content graph projection, graph/report validators, owned-content coverage report, regenerated chunk index, and retrieval smoke tests.

Stop condition: do not use generated lesson text as primary proof for reference claims.

Completion: completed on 2026-04-29. R9.2 created `references/data/owned-content-graph.json` with 1,464 typed edges: 695 projection edges, 332 owned exercise evidence edges, and 437 implementation trace edges. Generated artifacts remain non-evidence with explicit warnings. RAG now indexes owned-content edge chunks and retrieval evals still pass 10/10 with 0 authority violations.

### S4 Exercise Metadata Overlay MVP

Purpose: add the HCS exercise-quality fields in a protected-source-safe overlay before any bulk source mutation.

Required work:

- Store first-pass exercise metadata under `references/data/exercises/` unless a source-specific CLI/refresh workflow already exists.
- Treat CP-1 closure files as authoritative over the earlier review packet if wording differs.
- Preserve the role split:
  - `instructional_role`: `worked_example`, `startoefening`, `independent_practice`, `interleaving`, `target`, `verdieping`, `consolidatie`, `instapquiz`, `diagnostic`, `nieuws`.
  - `assessment_role`: optional; omit the field when absent. Allowed v1 values are `exam_mirror`, `bridge`, and `prerequisite`.
- Document that `instructional_role: diagnostic` means an authored exercise role only; it does not authorize student diagnostics, adaptive routing, mastery logic, or any diagnostic product layer.
- Preserve the scaffolding object:
  - `verbal_level`: integer 0-5.
  - `visual_stage`: integer 1-4.
  - `fading_position`: integer.
  - `dual_coding_present`: boolean.
- Add or stage metadata for authority tier, Bloom level, instruction word, answer format, graph specification, precision lint status, evidence status, source version, source stable ID, curriculum version, and content status.
- Use `build-scripts/lib/verify_svg_geometry.py` or create a wrapper if future automation expects `build-scripts/verify_svg_geometry.py`.
- Dry-run one Tier A item and one Tier C target exercise before bulk extension.

Required output: overlay schema, dry-run records, validator, and CP-3 review packet.

Stop condition: do not hand-edit protected external exam-question data and do not collapse `instructional_role` and `assessment_role` into one flat enum.

Checkpoint: `GATE-CP3-schema-extension-dry-run`.

Completion: completed on 2026-04-29 with `GATE-CP3-schema-extension-dry-run` status `pass_with_conditions`. S4 created the overlay schema, one Tier A exam-question dry-run overlay, one Tier C target-exercise dry-run overlay, validator, and gate closure. Bulk metadata extension and source mutation remain blocked until the CP-3 conditions are reflected in the next sprint plan.

Conditions carried forward:

- Track Tier A source annex extraction gaps before broad Tier A overlay backfill.
- Mark `exercise_operations` as provisional until a governed operation registry exists.
- Add reviewer calibration notes for scaffolding scale values.
- Refine `graph_spec` representation values during broader coverage work.
- Strengthen warnings around `instructional_role: diagnostic`.
- Preserve product-boundary flags: no student diagnostics, adaptive routing, student-facing AI, mastery decisions, summative use, or automatic sequencing.

### S4.1 Exercise Overlay Conditions And Calibration

Purpose: make the CP-3 conditions explicit in artifacts, validators, and reports before any bulk metadata extension.

Completion: completed on 2026-04-29. S4.1 added:

- `references/data/exercises/source-annex-gap-log.json`
- `references/data/exercises/scaffolding-calibration.json`
- `references/data/exercises/graph-spec-representation-plan.json`
- `references/data/exercises/product-boundary-warnings.json`
- `reports/json/exercise-overlay-conditions.json`
- `reports/markdown/exercise-overlay-conditions.md`
- `build-scripts/references/check-exercise-overlay-conditions.js`

S4.1 also updated the overlay schema and dry-run overlay records so `exercise_operations` are explicitly provisional, source annex status is explicit, condition references are attached to each overlay record, and product-boundary warnings are mandatory.

Remaining blocker: broad exercise metadata backfill remains blocked until a later sprint explicitly plans around the open source-annex gap, provisional operation registry status, and graph-spec refinement policy.

### R8.1 QC Issue Model

Purpose: define a lightweight, machine-readable quality issue model that directly improves reference/RAG trust.

Required work:

- Model only categories needed now: reference quality, evidence sufficiency, unit design, extraction integrity, report drift, source-version drift, term-link gaps, needs gaps, and production-readiness warnings.
- Include severity, owner/team, affected surface, evidence, next action, and proof required to close.
- Make issues retrievable and dashboard-friendly without turning them into curriculum authority.
- Ensure categories are internal-facing and not exposed as student material.

Required output: QC issue schema, example issue log, validator, and dashboard/RAG data hook.

Stop condition: do not gold-plate a general issue tracker and do not copy categories from unrelated data-analysis projects.

Completion: completed on 2026-04-29. Added the internal-only issue log at `references/data/qc/reference-quality-issues.json`, tightened `quality-issue.schema.json`, added `check-quality-issues.js`, generated `reports/json/reference-quality-issues.json`, and exposed a `quality_issue_model` summary in reference health. The records are diagnostic governance data only.

### Sprint 6 Bronnen Registry MVP

Purpose: create a controlled source-document registry without weakening machine-edit discipline.

Required work:

- Create source-document schema and validator.
- Decide whether the first implementation belongs under `references/data/` or `references/machine/`.
- If stored under `references/machine/`, create the CLI before creating the registry.
- Include source type, authority level, source version, status, owner, citation policy, and public-citation policy.

Required output: registry schema, validator, seed records or derived overlay, and report.

Stop condition: do not create a hand-maintained machine registry.

Completion: completed on 2026-04-30. The MVP registry lives at `references/data/source-document-registry.json` with JSON and Markdown reports at `reports/json/source-document-registry.json` and `reports/markdown/source-document-registry.md`. The schema now requires source version, status, owner, citation policy, and public-citation policy. `check-source-document-registry.js` verifies evidence-anchor document coverage, generated-report diagnostic boundaries, external/machine protected-surface policies, and confirms no `references/machine/source-document-registry.json` exists.

### Sprint 7 Skill And Operation Registry MVP

Purpose: separate micro-teaching-unit IDs from fine-grained exercise operations and broader skill/category tags.

Required work:

- Promote useful current content from `references/authored/skill-categories.md` into a governed registry or overlay.
- Preserve the HCS category structure where it survives CP-1 and CP-4 review.
- Keep `required_units` for micro-teaching-unit IDs.
- Use `exercise_operations` for fine-grained learner operations.
- Use `skill_tags` or `skill_category_tags` for broader taxonomy labels if CP-1 approves those names.
- Map exercise operations to unit IDs where the relationship is known.

Required output: skill/operation registry MVP, validator, coexistence report, and CP-4 review packet.

Stop condition: do not reuse `required_skills` for a new concept until the migration plan is complete.

Checkpoint: `GATE-CP4-skill-registry-coexistence`.

Completion: completed on 2026-05-01 with `GATE-CP4-skill-registry-coexistence` status `pass_with_conditions`. S7 is closed as a governed `references/data/skill-operation-registry.json` overlay. Machine registry promotion, bulk exercise metadata backfill, and `required_skills` reuse remain blocked.

PV dependency decision from CP-4: Procedure-Visual templates may reference provisional `exercise_operations` only with explicit provisional status. PV must not promote those operations to governed operation records, and must not create `references/machine/` PV registries during PV.0 through PV.6.

### PV Track Procedure-Visual Backbone

Strategic purpose: make visual teaching and dual coding part of the repository backbone by storing student-visible reasoning procedures, visual states, and representation-specific operation sequences as governed reference data.

Boundary: PV starts as a `references/data/procedure-visual/` overlay. No `references/machine/` promotion is allowed until schema, CLI, validators, mutation logs, reports, lesson-side regressions, and a later human promotion gate exist. PV-G4 supplies the lesson-regression evidence only; it does not authorize promotion by itself.

Canonical overlay target:

```text
references/data/procedure-visual/
  procedure-template.schema.json
  visual-state.schema.json
  visual-grammar.schema.json
  procedure-templates.json
  visual-states.json
  unit-template-links.json
  procedure-visual-vocab.json
```

Planned validators and reports:

```text
build-scripts/references/validate-procedure-visual-registry.js
build-scripts/reports/build-procedure-visual-coverage.js
reports/json/procedure-visual-coverage.json
reports/markdown/procedure-visual-coverage.md
```

Do not create these future-state files yet:

```text
references/machine/procedure-templates.json
references/machine/visual-states.json
```

Conceptual rule: the central PV object is a student-visible reasoning trace with visual states, not an image asset. Keep micro teaching units, actors, variables, operations, relations, visual primitives, visual states, procedure templates, and lesson/game projections separate. Consumer, producer, price, increase, and decrease are typed parts of procedures and visuals unless a reviewed evidence path shows they should become teaching units.

Sprint sequence:

- `PV.0 CP-4 Addendum`: completed through CP-4. PV may reference provisional `exercise_operations` only with explicit provisional status; no machine registry is created.
- `PV.1 Procedure-Visual Inventory`: inspect `micro-teaching-units.json`, `skill-operation-registry.json`, `source-data/book-1/`, procedure and skilltree engines/builders, `didactiek-principes.md`, and `economic_mathematical_precision_reference.md`; deliver inventory JSON and Markdown/JSON reports with an 8-12 candidate pilot list.
- `PV.2 Schema And Validator MVP`: completed. Created schemas, vocabulary, empty real overlay registries, validator, schema-status reports, and `GATE-PV-G1-schema` technical proof; validator resolves unit IDs, step IDs, actions, visual-state refs, graph axes/units, non-color accessibility fallback, pilot publication blockers, and no machine registry mutation.
- `RX.3 Producer Table/Graph Units`: proceed using PV constraints once PV.1/PV.2 define the relevant procedure/visual boundary.
- `RX.4 Elasticity/Market Diagram Units`: completed. Elasticity table/source and P-Q graph units are live but generator-blocked; market/welfare duplicate areas remain held.
- `PV.3 Pilot Procedure-Visual Templates`: create at least five validated templates, two visual-state sequences, and one formula trace, graph stage, table trace, and flowchart-style template across the approved pilot set.
- `PV.4 Procedure/Game Projection Contract`: add optional `formal_step_id` mapping first; existing procedure games without mappings report as `legacy_unmapped` and continue to run.
- `RX.5 Representation Operation Registry And Reports`: expand representation-operation reporting with PV operation/visual-state dimensions.
- `PV.5 Visual Projection MVP`: render or validate non-dynamic formula traces, flowcharts, table traces, and static staged graphs from PV state sequences.
- `PV.6 Coverage Reports And Dashboard Integration`: report PV coverage in JSON/Markdown and reference health without treating PV as curriculum authority.
- `RX.6 Skill-Tree And Generator Integration`: completed. Source and deployed skill-tree bundles now consume only generator-backed units as interactive and keep missing-generator units explicitly non-interactive.
- `PV.7 Machine-Promotion Review Gate`: completed as `pass_with_conditions`; PV remains an overlay and no machine promotion is authorized.
- `PV.8 Promotion Pipeline Design`: completed. Designed CLI contracts, validators, mutation logs, rollback, and later gate criteria before any future promotion attempt.
- `PV-G4 Lesson Regression Proof`: closed as `pass_with_conditions`; two lesson-side proofs are recorded, but machine-authoritative and student-facing PV promotion remain blocked until later CLI, mutation-log, validator, and human promotion gates authorize them.

Quality gates:

- `PV-G1 Schema Gate`: schema exists, validator exists, empty/example registry passes, unit IDs and visual-state IDs resolve, operation references are status-aware, and no machine registry is edited.
- `PV-G2 Pilot Content Gate`: 5+ templates pass, 2+ visual-state sequences pass, formula/graph/table/flowchart examples exist, and all blockers are explicit.
- `PV-G3 Projection Gate`: one pilot unit aligns vaardigheden explanation, procedure game, answer model, visual sequence, and surface-variant requirement.
- `PV-G4 Lesson Regression Gate`: one fresh paragraph build uses or validates PV data, complete paragraph validation and Book 1 check pass, and no hand-built generated lesson artifacts are introduced.

### Phase RX Representation-Sensitive Micro-Unit Decomposition

Purpose: strengthen the micro-teaching-unit registry by making explicit when students must combine a base calculation, representation reading, and economic interpretation.

Core principle:

```text
A calculation skill is not complete until the student can execute it across the representations in which exam questions and lesson materials actually present the data.
```

Design distinction:

- `base_operation`: the underlying calculation, such as percentage change, index calculation, profit, or elasticity.
- `representation_reading`: the source-reading skill, such as table value selection, bar chart reading, line chart reading, pie chart share reading, P-Q graph reading, or producer graph reading.
- `composed_application`: the combined skill of extracting values from the representation and then calculating/interpreting correctly.

Do not solve this by bloating `aspects`. Keep `aspects` broad (`verbaal`, `grafisch`, `rekenen`). Use a provisional operation/representation inventory first, then promote to a governed registry only when schema, validator, CLI, and mutation-log workflows exist.

Repository check as of 2026-04-29:

- `A60` is currently the last live A-domain unit.
- `A45` through `A60` exist and cover selected graph/table foundations from R4.5.
- Candidate IDs `A61` and later are placeholders until execution; the mutation sprint must re-check the live registry before assigning IDs.
- `unit-add.js` is the correct mutation mechanism, but CLI-ready specs must satisfy the current schema (`mastery_target`, `prior_learning`, `terms`, non-empty `aspects`, and A-domain generator handling).
- `references/machine/README.md` still points to missing `knowledge/micro-teaching-units-plan.md`; treat this as a low-severity documentation issue, not a blocker for RX.1.

#### RX.1 Representation-Operation Inventory

Purpose: build the representation-operation inventory before minting any new units.

Required work:

- Scan target exercises, exam-question records, blueprint flags, owned-source projections, and existing A-domain units.
- Identify every case where a calculation depends on values extracted from a representation.
- Classify each case as:
  - already covered;
  - needs new representation-reading unit;
  - needs new composed calculation unit;
  - duplicate/merge candidate;
  - hold for human review.
- Produce a matrix:

```text
base operation x representation x economic context
```

Example rows:

```text
percentage_change x bar_chart x demand/sales
percentage_change x line_chart x macro/time-series
profit x table x producer
profit x TO-TK graph x producer
surplus x P-Q graph x market
elasticity x demand curve x market
```

Candidate inventory path:

```text
references/data/sprints/RX.1-representation-operation-inventory.json
```

Required output:

- sprint plan, baseline, result, and diff summary;
- provisional inventory JSON;
- duplicate/overlap report against existing A-units;
- proposed mutation queue;
- review packet under `reports/review-gates/GATE-RX1-representation-unit-scope/`.

Acceptance tests:

- every proposed unit has target-exercise evidence, exam-question evidence, or a clearly marked didactic-prior rationale;
- no unit is proposed from syllabus text alone;
- duplicates and overlap candidates are held, not minted;
- candidate units distinguish base operation, representation reading, and composed application;
- candidate IDs are marked provisional.

Stop condition: no mutation in RX.1.

Checkpoint: `GATE-RX1-representation-unit-scope`.

Completion: completed on 2026-04-29 through the non-mutating inventory/review-packet stop point. `GATE-RX1-representation-unit-scope` closed as `pass_with_conditions`; RX.2 planning is authorized for the bounded first lane only, with mutation still blocked until explicit RX.2 mutation review and CLI-backed execution.

#### RX.2 Percentage And Index Representation Units

Purpose: plan, review, and execute the highest-value percentage/index/table representation branch after RX.1 gate closure. Direct mutation was authorized only after the RX.2 mutation review closed as `pass_with_conditions`.

First-lane mutation scope:

- `A61` Tabelwaarden selecteren voor berekening.
- `A66` Basiswaarde en vergelijkingswaarde in bron bepalen.
- `A67` Procentuele verandering berekenen vanuit tabel.
- `A70` Percentagepuntverandering in aandeel herkennen.
- `A72` Indexcijfer berekenen vanuit tabel.
- `A74` Procentuele verandering berekenen vanuit indexcijfers.

Deferred RX.2 candidates:

- Chart-only candidates `A62`, `A64`, `A68`, and `A71` remain medium/high risk until stronger evidence or explicit didactic-prior approval exists. `A71` is especially high risk.
- Line-graph candidates `A63`, `A69`, and `A73` can become a second wave within RX.2 or RX.2b after representation calibration.
- Elasticity candidates `A82` and `A84` should move earlier than the full producer-graph lane, but not inside the first RX.2 lane unless a later review expands scope. `A83` remains conditional on P-Q graph/source-value readiness.

Completed work:

- Re-checked live A-domain numbering before mutation review and again before mutation execution.
- Prepared an explicit RX.2 mutation-review packet for the bounded first lane.
- Closed `GATE-RX2-first-lane-mutation-review` as `pass_with_conditions`.
- Confirmed every first-lane candidate still had evidence, procedure, `needs`, aspects, and generator/backlog status.
- Applied only approved units through `unit-add.js`.
- Regenerated unit index, reports, RAG chunks, and health reports after approved CLI execution.
- Tracked all six interactive generators as missing/non-interactive until implementation and validation.

Acceptance tests:

- unit validator passes;
- no unresolved `needs`;
- no DAG cycles;
- percentage-point versus percentage-change distinction is explicit;
- pie-chart absolute/share candidates remain deferred outside the first lane;
- A-domain generator coverage is either implemented or explicitly tracked as blocked;
- held duplicate/overlap records from RX.1 remain blocked.

Completion: completed on 2026-04-29. `GATE-RX2-first-lane-mutation-review` closed as `pass_with_conditions`; `A61`, `A66`, `A67`, `A70`, `A72`, and `A74` were added through `unit-add.js`. Student-facing skill-tree exposure remains blocked until generator implementation and validation.

#### RX.2b Graphical Foundation Coverage And Mutation

Purpose: complete the basic graphical representation-reading layer before producer/profit graph units are reviewed or mutated.

HCS decision: approved as the required next RX sprint after RX.2 and before RX.3. RX.2 was a safe table/index lane; it did not complete graphical foundation coverage.

Approved target queue for mutation review:

- `A62` Waarden aflezen uit staafdiagram.
- `A63` Waarden aflezen uit lijngrafiek.
- `A64` Aandelen aflezen uit cirkeldiagram.
- `A65` Absolute hoeveelheid berekenen uit aandeel en totaal.
- `A68` Procentuele verandering berekenen vanuit staafdiagram.
- `A69` Procentuele verandering berekenen vanuit lijngrafiek.
- `A73` Indexverandering aflezen uit lijngrafiek.

Conditional target:

- `A71` Procentuele verandering berekenen vanuit cirkeldiagram.

`A71` may be held if the evidence or procedure remains too thin. The review gate must allow `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, and `A73` to proceed while holding `A71`.

Required procedure standard for `A62`, `A63`, and `A64`:

1. Identify the title/context.
2. Identify the variable and unit.
3. Check axis, legend, or category labels.
4. Check the scale.
5. Read the value.
6. Decide whether exact reading, estimation, or interpolation is required.

These units must not become one-line "read the value" records. The point of RX.2b is to make graphical reading teachable and diagnosable.

Required output:

- `reports/json/graphical-foundation-coverage.json`
- `reports/markdown/graphical-foundation-coverage.md`
- `reports/review-gates/GATE-RX2b-graphical-foundation/review-packet.md`
- `reports/review-gates/GATE-RX2b-graphical-foundation/review-packet.json`
- `references/data/sprints/RX.2b.plan.json`
- `reports/sprints/RX.2b-baseline.md`

If the gate authorizes mutation, also produce:

- `reports/review-gates/GATE-RX2b-graphical-foundation/human-interview.md`
- `reports/review-gates/GATE-RX2b-graphical-foundation/human-interview.json`
- `reports/review-gates/GATE-RX2b-graphical-foundation/gate-closure.md`
- `reports/review-gates/GATE-RX2b-graphical-foundation/gate-closure.json`
- `references/data/sprints/RX.2b-generator-blocked-units.json`
- `references/data/sprints/RX.2b.result.json`
- `reports/sprints/RX.2b-result.md`
- `reports/sprints/RX.2b-diff-summary.md`

Coverage-report requirement:

The graphical foundation coverage report must distinguish:

- live units;
- candidate units;
- held/high-risk units;
- missing but not-yet-scoped units;
- generator-blocked units.

Review questions:

1. Is the graphical foundation queue complete enough for bar, line, pie, percentage-change, and index-reading basics?
2. Are `A62`, `A63`, and `A64` acceptable as representation-reading foundation units?
3. Is `A65` justified as a composed share-times-total unit?
4. Are `A68`, `A69`, and `A73` sufficiently grounded for mutation?
5. Is `A71` safe to mutate now, or should it remain held because pie-chart composition is high risk?
6. Should the provisional IDs be preserved with gaps?
7. Does the dependency order work without cycles?
8. Does the graphical foundation coverage report clearly distinguish live, candidate, held, missing, and generator-blocked skills?
9. Are all new units generator-blocked/non-interactive until RX.6?
10. Gate status: `pass_with_conditions`, `hold`, or `fail`?

Mutation order if approved:

```text
A62
A63
A64
A65
A68
A69
A73
A71 only if explicitly approved
```

Acceptance tests:

- unit validator passes;
- no unresolved `needs`;
- no DAG cycles;
- `A62`, `A63`, and `A64` encode title/context, labels, units, scale, reading, estimation, and interpolation where relevant;
- graphical foundation coverage report distinguishes live, candidate, held/high-risk, missing/not-scoped, and generator-blocked states;
- all newly minted A-units are tracked as generator-blocked/non-interactive until RX.6;
- no student-facing skill-tree exposure is authorized.

Stop condition: no mutation before `GATE-RX2b-graphical-foundation` records explicit human authorization. Do not hand-edit `references/machine/`, `references/external/`, authored source files, or RAG chunks. Do not authorize student diagnostics, adaptive routing, student-facing AI, sequencing, mastery decisions, or summative use.

Completion: completed on 2026-04-30. `GATE-RX2b-graphical-foundation` closed as `pass_with_conditions`; `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, and `A73` were added through `unit-add.js`; `A71` remains held/high-risk; all seven new A-units remain generator-blocked and non-interactive until generator implementation and validation.

#### RX.3 Producer Table And Graph Representation Units

Purpose: add representation-sensitive profit/cost units after RX.2b closes or explicitly holds the graphical foundation layer.

Completion: completed as non-mutating review on 2026-05-01. `GATE-RX3-producer-representation` closed as `pass_with_conditions`; `A75`, `A76`, and `A79` may enter a bounded first-lane mutation review; `A76` must include `A14`, `A04`, and `A61` as needs. `A77` and `A78` may proceed later after `A75` with PV graph-stage constraints. `A80`, `A81`, and `HOLD_GRAPHICAL_MO_MK_OPTIMUM` remain held.

Candidate scope, subject to duplicate audit and renumbering:

- total profit from revenue/cost table;
- total profit from P, GTK, and Q;
- break-even from TO-TK graph;
- profit/loss from TO-TK graph;
- maximum profit from TO-TK table;
- profit rectangle in producer graph;
- profit, loss, and break-even recognition in producer graph.

Required work:

- Confirm RX.2b graphical-reading dependencies are live or explicitly held before producer graph mutation.
- Review overlap with existing profit, break-even, MO/MK, GTK, table-difference, and producer-graph units.
- Mint only missing composed representation skills.
- Distinguish TO/TK graph, P/GTK/Q graph, and table-based profit comparison.

Acceptance tests:

- no duplicate of existing break-even/profit units;
- every graph unit has a procedure that tells the student exactly what to read from the graph;
- profit rectangle and vertical-distance logic are not conflated.

#### RX.4 Elasticity And Market Diagram Representation Units

Purpose: extend the representation model to elasticity and market diagrams.

Current state: RX.4 is completed. `A82`, `A84`, and `A83` were added through CLI-only mutation after `GATE-RX4-elasticity-market-diagram-review` closed as `pass_with_conditions`; `A83` uses the HCS-approved demand-elasticity P-Q graph scope. New market/welfare/surplus/intervention graph units remain held to avoid duplicating existing units.

Candidate scope, subject to duplicate audit and renumbering:

- elasticity from table values;
- elasticity from demand graph;
- revenue-change judgement with elasticity from source;
- any approved market-graph gaps after audit.

Required work:

- Separate table extraction for elasticity, graph extraction for elasticity, interpretation of elastic/inelastic after calculation, and market-intervention graph operations already covered by A51/A56/A59.
- Audit A19/A32/A40/D39/D40 before minting new surplus/welfare units.

Acceptance tests:

- no new unit duplicates A19/A32/A40/D39/D40;
- graph-reading step is explicit before calculation;
- elasticity sign and absolute-value interpretation are preserved.

#### RX.5 Representation Operation Registry And Reports

Purpose: make representation-sensitive operations durable.

Required work:

- Promote the provisional RX inventory into a governed registry only if Sprint 7 has provided the schema, validator, and CLI path.
- Keep new machine registries as end-state only until CLI and validators exist.
- Generate:
  - `reports/representation-operation-coverage.md`;
  - `reports/json/representation-operation-coverage.json`;
  - `reports/graph-skill-tree.md`;
  - `reports/representation-transfer-gaps.md`.

Acceptance tests:

- every representation-sensitive unit links to at least one operation record;
- every operation record has status;
- reports distinguish "calculation covered" from "calculation from representation covered."

#### RX.6 Skill-Tree And Generator Integration

Purpose: make approved representation-sensitive units usable in the student-facing skill tree only after data and generator readiness are clear.

Required work:

- Implement missing `GEN_A61+` generators or explicitly mark nodes as explanation-only/non-interactive until generators exist.
- Add graph/representation skill-tree filters:
  - percentage from representations;
  - tables and charts;
  - producer graphs;
  - market diagrams;
  - welfare graphs.
- Update relevant paragraph `skilltree.skills` lists only through the normal platform/lesson workflow and with separate authorization for target output changes.

Acceptance tests:

- generator coverage report passes;
- no skill-tree node points to a missing generator unless intentionally marked non-interactive;
- generated lesson target validates after any authorized deploy.

Stop condition: do not mutate `../4veco-lessen/` or student-facing output from a references sprint without explicit platform/lessen authorization.

Completion: completed on 2026-05-03. RX.6 did not implement missing generators. It made the current readiness boundary explicit: 44 active A-domain units are generator-backed and interactive, while 37 active A-domain units are generator-blocked/non-interactive until a later generator sprint implements and validates their `GEN_A*` functions. The deployed browser bundle now uses the same interactive/block split as source `base-elements.js`.

#### PV.7 Machine-Promotion Review Gate

Purpose: decide whether any Procedure-Visual records should move from `references/data/procedure-visual/` to `references/machine/`.

Preparation: prepared for HCS review on 2026-05-03. `GATE-PV7-machine-promotion-review` has a readiness report and review packet. The readiness result is `promotion_not_ready`: schema, validator, overlay records, projection proof, and coverage reports exist, but a PV machine-edit CLI, PV machine-promotion mutation logs, and two lesson-side PV regression proofs are missing.

Recommended decision: keep all PV records in `references/data/procedure-visual/` for now. If HCS wants a future promotion path, the safest first candidate is `unit-template-links`, but only after a CLI-backed promotion workflow, mutation logs, and lesson-regression proof exist. Procedure templates and visual states should remain governed data overlays until renderer and lesson-regression maturity is stronger.

Required review artifacts:

- `reports/json/procedure-visual-machine-promotion-readiness.json`
- `reports/markdown/procedure-visual-machine-promotion-readiness.md`
- `reports/review-gates/GATE-PV7-machine-promotion-review/review-packet.md`
- `reports/review-gates/GATE-PV7-machine-promotion-review/review-packet.json`

Stop condition: do not create `references/machine/procedure-templates.json`, `references/machine/visual-states.json`, `references/machine/unit-template-links.json`, `references/machine/procedure-visual-vocab.json`, or any equivalent PV machine registry before explicit human promotion approval and a CLI-backed mutation path exist. Do not authorize student-facing PV projection, generator exposure for blocked units, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.

Completion: completed on 2026-05-03. `GATE-PV7-machine-promotion-review` closed as `pass_with_conditions`; no PV machine promotion is authorized. HCS confirmed that `unit-template-links` are the safest future first candidate only after prerequisites are met, while procedure templates and visual states remain governed data overlays. The next required work is `PV.8 Promotion Pipeline Design` plus PV-G4 lesson-regression proof before reopening promotion.

#### PV.8 Promotion Pipeline Design

Purpose: design the future Procedure-Visual machine-promotion path without executing it.

Required work:

- Define the proposed PV promotion CLI surface, likely starting with unit-template links only.
- Define mutation-log schema and rollback expectations.
- Define validators for promoted PV records, overlay/machine coexistence, and no student-facing leakage.
- Define promotion-gate review questions and proof requirements.
- Define how PV-G4 lesson-regression evidence is recorded before any future promotion attempt.

Required output:

- promotion-pipeline design document;
- proposed CLI contract;
- proposed mutation-log schema;
- validator plan;
- review-gate packet for the later promotion attempt.

Stop condition: do not create or edit PV `references/machine/` registries in PV.8. Do not promote unit-template links, procedure templates, visual states, vocabulary, or provisional `exercise_operations`.

Completion: completed on 2026-05-03. PV.8 added a design-only promotion-pipeline record and technical packet. It defines proposed `pv-promotion-plan.js`, `pv-machine-promote.js`, and `pv-machine-rollback.js` contracts, a mutation-log schema, future validators, rollback expectations, and future gate questions. All proposed commands and validators remain `proposed_not_implemented`; no PV machine registry was created.

#### PV-G4 Lesson Regression Proof

Purpose: prove PV data can survive lesson-side use before reopening student-facing or machine-authoritative PV promotion.

Required work:

- Record at least two lesson-side PV regression proofs.
- Each proof must show a fresh paragraph or pilot surface using or validating PV data without hand-built generated-output patching.
- Complete paragraph validation and Book 1 checks must pass for each proof where applicable.

Stop condition: the references team must not commit lesson-team output unless explicitly authorized; lesson-side proof artifacts may be referenced from platform reports after the lesson team owns its commits.

Preparation: proof intake prepared on 2026-05-03. `GATE-PV-G4-lesson-regression` now has a proof template, proof-intake report, and evidence review packet. Initial proof count was 0/2, so the gate remained blocked pending lesson-team-owned regression evidence.

Completion: closed on 2026-05-14 as `pass_with_conditions` after lesson-team L-PV0 through L-PV5. The platform intake now records 2/2 lesson-owned proofs and embeds the reconciled lesson commit `52f9237de9e465e7f75483f6feac4e80241e8631` with `lesson_worktree_dirty_at_generation: false`; `check-procedure-visual-lesson-regression-proof-intake.js` passes. Post-closure report-state cleanup made the intake and review packet closure-aware. Conditions remain active: Proof 002 is only bounded, non-student-facing A61 proof diversity, and no PV machine promotion, student-facing PV projection, diagnostics, adaptive routing, mastery, sequencing, AI, or summative use is authorized.

### S8 / Sprint 8 Misconception Registry MVP

Purpose: make recurring student errors retrievable and usable in exercise design.

Required work:

- Create misconception schema and validator.
- Link misconceptions to units, terms, exercise operations, and evidence where available.
- Keep the first pass small and high-value.
- Preserve diagnostic/non-authority labels in RAG output.

Required output: misconception registry MVP, validator, and retrieval/report hook.

Completion: completed on 2026-05-15. S8 tightened `references/schemas/misconception.schema.json`, created the internal seed registry at `references/data/misconceptions/misconception-registry.json`, added `build-scripts/references/check-misconceptions.js`, generated `reports/json/misconception-registry.json` and `reports/markdown/misconception-registry.md`, exposed a safe `misconception_registry` summary in reference health, and preserved the diagnostic/non-authority labels in generated RAG report chunks. No `references/machine/` or `references/external/` mutation occurred.

Stop condition: do not treat misconception records as primary evidence. Also stop if implementation implies student-facing diagnostics, adaptive routing, mastery, sequencing, AI, summative use, PV projection, or PV machine promotion.

### S9 / Sprint 9 Unit Design Status And D04 Resolution

Purpose: stop D04 and similar unstable units from silently supporting exercise promotion workflows.

Completion: completed on 2026-05-15. S9 created a derived unit-design-status overlay under `references/data/`, generated `unit-design-status` JSON/Markdown reports, exposed non-authority reference-health/RAG labels, and closed `GATE-CP5-D04-resolution` as `pass_with_conditions`. CP-5 resolves the decision direction only: D04 content should be redistributed to successor elasticity units and the standalone D04 unit retired later through CLI. No `references/machine/` or `references/external/` mutation occurred, no D04 prerequisite edge was added, and D04 remains blocked for C-to-B promotion and student-facing projection until a later CLI-only mutation sprint executes the decision.

Required work:

- Decide whether `unit_design_status` is a derived overlay or a CLI-backed machine-unit field.
- Prefer a derived overlay first unless the CLI/schema migration is ready.
- Resolve D04 as retire, merge, redistribute, or split into successor units.
- Audit dependent units that currently assume D04-like aggregate behavior.
- Produce the CP-5 review packet.

Required output: D04 decision record, dependent-unit audit, unit-design status strategy, and gate packet.

Stop condition: do not mutate `references/machine/` by hand and do not promote any exercise that relies on an unstable required unit.

Checkpoint: `GATE-CP5-D04-resolution`.

### S9a D04 CLI-Only Mutation Sprint

Purpose: apply the CP-5 D04 decision through governed CLI mutation without hand-editing protected references.

Completion: completed on 2026-05-16. S9a selected `unit-deprecate.js`, recorded a concrete mutation plan, deprecated `D04` in favor of `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, and `D27`, removed the single active D04 target-exercise citation from `2.1.3`, recorded a CLI mutation log and stale-reference audit, regenerated reports/RAG/inventories, and updated unit-design-status reporting to `retired_after_cli_mutation`. D04 remains a deprecated historical/provenance record only; it is not an active promotion dependency. No `D04 -> A15` edge, external-source mutation, student-facing exposure, diagnostics, adaptive routing, mastery, sequencing, AI, summative use, PV projection, or PV machine promotion was authorized.

Required work:

- Convert the CP-5 decision into concrete mutation targets: D04 retirement or redistribution, citation/reference replacement, term movement, and stale-reference cleanup.
- Select the correct CLI path (`unit-deprecate.js`, `unit-merge.js`, `unit-split.js`, or a documented combination) before mutation.
- Execute only through CLI scripts and record a mutation log.
- Regenerate machine projections, generated reports, RAG chunks, source manifest, document inventory, and roadmap bookkeeping.
- Verify that D04 no longer functions as an unstable promotion dependency and that successor units preserve the intended goods-classification content.

Required output: mutation plan, CLI mutation log, regenerated reports/RAG chunks, stale-reference audit, and sprint result bundle.

Stop condition: do not hand-edit `references/machine/` or `references/external/`; do not mutate without exact target specs; do not authorize student-facing diagnostics, adaptive routing, mastery, sequencing, AI, summative decisions, PV projection, or PV machine promotion.

### SYNC-1 Roadmap Reconciliation

Completion: completed on 2026-05-18. SYNC-1 reconciled the reference and
lesson roadmaps after the lesson-side May 18 closures. It records that L1.5P,
L1.5Q, and L1.6 materially improved the foundation, but did not approve broad
lesson scaling. It also moves the next reference content work from immediate
Year-1 coverage to a non-mutating three-year prototype normalization step.

Required output: updated `references/reference-team-roadmap.md`, updated
roadmap version index, and matching lesson roadmap sequencing.

Stop condition preserved: do not authorize broad lesson scaling, PV machine
promotion, student-facing PV projection, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, or summative use from this roadmap sync.

### REF-CT0 Three-Year Prototype Normalisation And MTU Classification

Status: completed. Outputs are recorded in:

- `reports/reference-planning/REF-CT0-source-authority-boundary.md`
- `reports/reference-planning/REF-CT0-three-year-prototype.md`
- `reports/reference-planning/REF-CT0-mtu-classification.md`
- `reports/reference-planning/REF-CT0-candidate-review-packet.md`
- `references/data/sprints/REF-CT0-mtu-classification.json`

Purpose: turn `knowledge/three Year blue print.md` into a clean planning
prototype without making it a curriculum source of truth.

Required work:

- Treat the rough three-year blueprint as a concept scaffold only.
- Rewrite or derive a v5-aware non-authoritative prototype that reflects the
  active four-book/four-test-week v5 baseline.
- Classify units and paragraph candidates into:
  - Year 1 confirmed
  - Year 1 backfill candidate
  - Year 2 skeleton candidate
  - Year 3 skeleton candidate
  - duplicate/merge/split candidate
  - parked
  - needs evidence
- Preserve evidence-first ordering: exam questions and target exercises before
  machine registry interpretation, syllabus grouping, or generated reports.
- Produce a candidate-review packet for later MTU/target-exercise work.

Required output: non-authoritative three-year planning prototype, MTU
classification table, candidate-review packet, and explicit source/authority
boundary note.

Stop condition: do not mutate `references/machine/`; do not promote the rough
three-year blueprint into the owned curriculum source; do not treat migrated v5
target exercises as final-reviewed.

Completion note: REF-CT0 preserved all stop conditions. It did not mutate
`references/machine/` or `references/external/`, did not promote the rough
three-year blueprint into `references/owned/`, and did not treat migrated or
placeholder v5 target-exercise records as final-reviewed.

### REF-CT1 Year-1 Target Exercise And MTU Coverage Baseline For v5

Purpose: close the v5 Year-1 course-design coverage baseline after REF-CT0 has
classified the three-year prototype and MTU gaps.

Required work:

- Use active v5, not v4.
- Include built lesson evidence from `1.1.1`, `1.1.2`, and `1.1.3`.
- Identify Year-1 count-bearing paragraphs with no target exercise or only a
  placeholder target exercise.
- Separate missing target exercises from deliberately deferred paragraphs.
- Connect target exercises to owned blueprint source, unit IDs, MTU
  classifications, and evidence status.
- Classify missing MTUs as backfill, future-year, duplicate, parked, or needs
  evidence.
- Produce a review packet before any CLI mutation.

Required output: Year-1 target-exercise/MTU coverage report and CP-6 review
packet.

Stop condition: Year-1 does not close while target-exercise coverage or precision status is not acceptable.

Checkpoint: `GATE-CP6-year-1-paragraph-coverage`.

### Content Track 2 Year-1 Precision And Dual-Coding Audit

Purpose: make sure exercise metadata reflects actual teaching quality, not only administrative fields.

Required work:

- Audit graph-based and visual reasoning exercises.
- Record precision lint status where the verifier applies.
- Record `dual_coding_present` for relevant guided-practice and scaffolded surfaces.
- Use the L1.6R incident as the calibration example: a procedure can be
  consistent and still fail if the graph/table object is absent.
- Require semantic evidence, not just a boolean: table, graph, axis, point,
  guide line, scale comparison, or other learning object must be inspectable in
  the generated surface being reviewed.
- Record `not_applicable` or equivalent where no graph/visual precision check applies.

Required output: precision and dual-coding audit report.

Stop condition: do not mark graph-heavy guided practice as quality-ready if
`dual_coding_present` cannot be established with visible learning-object
evidence.

### Content Track 3 Year-2 Skeleton

Purpose: prepare the second-year course backbone without weakening Year-1 quality.

Required work:

- Draft Year-2 paragraph skeletons with tentative target exercises.
- Add CvTE-vwo anchor status where available.
- Mark unanchored concepts with `concept_orphan` or successor field.
- Treat CP-7 as a parallel content-track checkpoint, not an engineering Phase E blocker.

Required output: Year-2 skeleton and CP-7 review packet.

Stop condition: do not use Year-2 skeleton work to authorize C-to-B promotion before the engineering gates are ready.

Checkpoint: `GATE-CP7-year-2-anchoring`.

### R7.6 RAG Quality Hardening

Purpose: improve retrieval quality before new product features. This sprint closes the R7.4 follow-up conditions and expands the proof layer enough that RAG quality is more than a smoke test.

Required work:

- RAG-01: make retrieval labels explicit for approved, approved-with-conditions, pending-review, diagnostic-only, generated-report diagnostic, external-primary, machine-registry, and authored-judgement results.
- RAG-02: add score, match-strength, and weak-match warnings; very low-score matches must be hidden by default or grouped as possible weak matches.
- RAG-03: split target exercises into stable per-exercise chunks with exercise IDs, source paths, unit links, term links where available, evidence metadata, and target-exercise status.
- RAG-04: create evidence-anchor coverage reports for retrieval by chunk type, entity type, source type, and authority level.
- Expand retrieval evaluation from the 10-case smoke suite toward a meaningful regression suite covering unit lookup, terms, exam phrasings, known ambiguity, deprecated units, missing-needs queries, generated-report-only results, pending-review graph edges, and out-of-corpus queries.
- Backfill evidence anchors for high-traffic concepts and currently weak surfaces, especially elasticity, A-domain foundations, labor-market sequencing, `alternatieve kosten`, and `schaarste`.
- Review the first backfilled graph edge batch so the graph has meaningful approved edges instead of relying mainly on draft/pending traceability.

Required output: updated RAG scripts, expanded eval set and results, evidence-anchor coverage report, backfilled evidence-anchor records, graph integrity report, and sprint result.

Stop condition: do not expand into diagnostics, adaptive routing, student-facing AI, or new product surfaces.

Checkpoint: `GATE-CP8-rag-eval-content-coverage`.

### R14.1 Curriculum Versioning

Purpose: track curriculum/source versions and migrations so retrieval cannot silently mix incompatible source generations.

Required work:

- Record versioned exam programs, syllabi, owned source versions, rough planning
  prototypes, built lesson output baselines, and migration status.
- Distinguish archived v4, active v5, and non-authoritative three-year
  prototypes.
- Tag migrated/not-final-reviewed v5 target exercises distinctly from reviewed
  final target exercises.
- Make stale references visible.
- Link version changes to affected units, terms, and evidence anchors.
- Keep the first pass minimal: enough to tag current external, machine, authored, and owned-source surfaces with version provenance.

Required output: curriculum version registry and stale-reference report.

Stop condition: do not silently mix curriculum versions.

### Sprint 12 Exam And Target Exercise Decomposition Backfill

Purpose: apply the audited schema and overlay model to the existing exam-question and target-exercise corpus.

Required work:

- Backfill protected-source-safe metadata for the 349 exam-question records.
- Backfill metadata for the active v5 target-exercise registry, currently 54
  count-bearing records.
- Close known exam-question extraction gaps through overlays or refresh scripts, not hand edits to `references/external/`.
- Record role, authority, Bloom level, instruction word, exercise operations, evidence status, and source version where approved by CP-1/CP-3.

Required output: overlay records, validator, backfill report, and updated RAG/report surfaces.

Stop condition: do not bulk-apply uncertain exercise metadata without review.

### Sprint 13 Composition Pattern Registry

Purpose: define reusable exercise-composition patterns for internal authoring support.

Required work:

- Define composition patterns for exercise types.
- Link patterns to operations, source authority, scaffolding object, instructional role, assessment role, and evidence status.
- Keep the registry internal and non-authoritative for student-facing publication.

Required output: composition-pattern schema, seed patterns, validator, and authoring-support report.

Stop condition: do not use patterns to auto-publish student-facing exercises.

### Sprint 14 C-to-B Promotion Workflow

Purpose: create a controlled path from concept blueprint exercises to stronger exercise authority.

Required prerequisites:

- CP-1 schema audit closed.
- R9.1 owned-source registry closed.
- Sprint 4 exercise metadata overlay MVP closed.
- D04/unit-design status usable.
- R7.6 RAG hardening closed.
- R14.1 versioning closed.
- Precision lint path corrected or wrapped.

Required output: promotion schema/rules, first reviewed promotion batch, gate records, and rollback plan.

Stop condition: do not promote any exercise with unstable required units, missing source authority, missing evidence status, unresolved graph precision status, or absent human review.

## Executive Direction

The reference folder is becoming the platform's governed educational knowledge base.

Target flow:

```text
owned book/source material
-> machine-readable reference data
-> evidence anchors
-> alignment graph
-> JSON-first reports
-> retrieval/RAG layer
```

Current focus: improve data quality inside this flow before adding new product surfaces.

Do not proceed to diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative decisions, teacher cockpit deployment, game/simulation product mapping, or continuous-improvement claims from this roadmap.

## Current Catalog State

Last regenerated: 2026-04-29

### Machine Unit Catalog

- `217` total units.
- `215` live units.
- `2` deprecated units: `D23`, `H26`.
- Domain spread, live units:
  - `A`: 66
  - `B`: 2
  - `D`: 39
  - `E`: 7
  - `F`: 18
  - `G`: 12
  - `H`: 30
  - `I`: 20
  - `L`: 21
- Mastery spread, live units:
  - `understand`: 90
  - `apply`: 103
  - `analyze`: 19
  - `evaluate`: 3
- Dependency graph:
  - `261` live prerequisite edges.
  - `40` live units still have no `needs` edges.
- Coverage:
  - `188/215` live units have exam-code links.
  - `146/215` live units have term links.
  - `125/125` apply/analyze/evaluate live units have procedures.

### Begrippen Registry

- `227` live terms.
- `227/227` have definitions.
- `227/227` have examples.
- `62/227` have pitfall text.
- `97/227` are reverse-linked to teaching units.
- `34/227` carry formulas.

Main risk: the former unresolved term strings `alternatieve kosten` and `schaarste` are resolved. The current quality risk is that many newly minted A-domain foundation units are intentionally procedure/instrument units without term links; a later QC rule should distinguish true missing term links from procedure-only exemptions.

### Reports

Current generated reports:

- `reports/dag-integrity.md`: pass.
- `reports/needs-coverage.md`: informational backlog, `40` live units without `needs`.
- `reports/terms-coverage.md`: informational backlog, `69` live units without terms.
- `reports/terminology-drift.md`: pass against machine-registry-first term validation.
- `reports/exam-question-extraction-gaps.md`: patch queue, `27` exam-question records need required-skill review; `19` also need exam-code review.
- `reports/blueprint-flag-triage.md`: curated backlog, `84` raw target-exercise flags triaged.
- `reports/evidence-anchor-status.md`: pass, `15` evidence anchors and `13` claims.
- `reports/procedure-coverage.md`: pass for apply+ units.
- `reports/aspects-coverage.md`: informational, remaining exam-citation gaps.
- `reports/unresolved-refs.md`: warnings only for deprecated references.
- `reports/dead-units.md`: informational scanner output; should be improved after JSON-first reports.

### Owned Sources

- `references/owned/course-blueprint-v5.md`: active owned curriculum-design baseline after L1.5Q. It mirrors the lesson-side `course_blueprint_v5.md`, uses the 12/12/14/16 four-book structure, and carries metadata in `references/owned/course-blueprint-v5.meta.json`.
- `references/owned/course-blueprint-v4.md`: archived owned course-design baseline retained for historical comparison only.
- Blueprint target exercises and sequencing are strong owned course-design signals, but migrated v5 target exercises remain non-final until the later target-exercise/MTU coverage and distribution audits.
- Blueprint prose is contextual/design rationale and cannot by itself mint or mutate machine units.

## Roadmap Phases

### Phase R0: Governance And Sprint Machinery

Goal: make reference work rollback-safe and auditable before more data work.

- `R0.1` completed: sprint execution scaffold.
- `R0.2` completed: source manifest and document inventory.

### Phase R1: Source Of Truth And Schemas

Goal: remove ambiguity about canonical data and generated projections.

Key outputs:

- `references/SOURCE_OF_TRUTH.md`
- core JSON schemas for units, terms, exam questions, source documents, evidence anchors, claims, alignment edges, reports, retrieval chunks, and reference-quality issues
- prior-knowledge schema extension for empty `needs`

### Phase R2: Empty-Needs And Prior-Knowledge Review

Goal: distinguish true zero-prerequisite units from hidden prerequisite gaps.

Rules:

- `R2.1` is non-mutating.
- subagents can propose corrections
- `R2.3` closed the review gate as `hold`.
- broad dependency corrections are not applied until `R2.4` supplies exact evidence and unit-design decisions.

Sprints:

- `R2.1` completed: full empty-needs audit, non-mutating.
- `R2.2` completed: subagent review and human-review packet.
- `R2.3` completed: interactive human review and gate closure as `hold`.
- `R2.4` completed: evidence and unit-design cleanup after the hold decision.

### Phase R3: CLI-Only Corrections

Goal: complete any missing mutation scripts, update CLI documentation, and apply reviewed corrections only through CLI.

Sprints:

- `R3.1` completed: reference CLI and documentation completion.
- `R3.2` completed: reviewed empty-needs corrections applied through CLI.

### Phase R4: Term, Exam, Blueprint, And Authored-Bucket Cleanup

Goal: turn raw backlog into production signal.

Priority work:

- migrate unit terms to canonical slugs
- close exam-question skill/code gaps
- triage blueprint missing-unit flags
- classify authored-bucket files by migration status

Sprints:

- `R4.1` completed: unit-term slug migration.
- `R4.2` completed: exam-question extraction gap closure.
- `R4.3` completed: blueprint flag triage.
- `R4.4` completed: micro-teaching-unit quality packet.
- `R4.5` completed: reviewed micro-unit corrections applied through CLI.

### Phase R5: Evidence Anchors And Alignment Graph

Goal: connect claims to exact proof and make graph relationships explicit.

Do not let the graph become pedagogically authoritative until the alignment-graph review gate is closed.

Sprints:

- `R5.1` completed: evidence-anchor layer.
- `R5.2` completed: alignment graph.
- `R5.3` completed: alignment graph review gate.

### Phase R6: JSON-First Reports And Dashboard Data

Goal: make reports and dashboards consume structured data rather than scraping Markdown.

The reference dashboard should eventually read `reports/json/reference-health.json` or its successor, not scattered Markdown files.

Sprints:

- `R6.1` completed: JSON-first reports.
- `R6.2` completed: reference health dashboard data.

### Phase R7: RAG And Technical Retrieval Layer

Goal: deterministic, source-ranked retrieval with evaluation before any teacher-facing use.

No vector-first shortcut. Build lexical/entity/graph retrieval, evaluation, owned-source coverage, evidence-anchor density, and warning behavior first.

Sprints:

- `R7.1` completed: deterministic chunk layer.
- `R7.2` completed: hybrid retrieval.
- `R7.3` completed: retrieval evaluation set.
- `R7.4` completed: RAG review gate with `pass_with_conditions`.
- `R7.5` completed: merge readiness and main sync.
- `R7.6` planned: RAG quality hardening, retrieval eval expansion, target-exercise chunking, evidence-anchor coverage, and anchor backfill.

### Phase Schema/Exercise Quality: CP-1 Through CP-4

Goal: make the exercise schema compatible with current repository data before adding bulk metadata or registries.

Sprints:

- `S1` completed: schema audit and exercise naming contract; `GATE-CP1-schema-audit` closed as `pass_with_conditions`.
- `Sprint 4` planned: exercise metadata overlay MVP, including `instructional_role`, `assessment_role`, scaffolding object, and schema-extension dry run.
- `S7` completed: skill and operation registry MVP closed at `GATE-CP4-skill-registry-coexistence` as `pass_with_conditions`.
- `PV Track` adopted: Procedure-Visual Backbone starts as a `references/data/` overlay; PV.1 and PV.2 are completed, so large RX.3/RX.4 mutation work can proceed only under PV constraints.

### Phase RX: Representation-Sensitive Micro-Unit Decomposition

Goal: distinguish base calculations, representation-reading skills, and composed calculation-from-source applications before minting new A-domain transfer units.

Sprints:

- `RX.1` completed: non-mutating representation-operation inventory and duplicate audit.
- `RX.2` completed: bounded first-lane percentage/index/table units added through CLI; generator-blocked status remains active.
- `RX.2b` completed: graphical foundation units `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, and `A73` added through CLI; `A71` remains held/high-risk; generator-blocked status remains active.
- `PV.0` completed: CP-4 addendum for provisional `exercise_operations` dependency handling; no machine registry creation.
- `PV.1` completed: procedure-visual inventory and pilot-candidate ranking.
- `PV.2` completed: procedure-visual schemas, vocabulary, empty real overlay registries, validator, schema-status reports, and `GATE-PV-G1-schema` technical proof.
- `RX.3` completed: `GATE-RX3-producer-representation` closed as `pass_with_conditions`; `RX.3a` and `RX.3b` applied producer table/data and TO-TK graph lanes through CLI-only mutation.
- `RX.4` completed: `A82`, `A84`, and `A83` added through CLI-only mutation; `A83` uses the HCS-approved P-Q graph demand-elasticity scope; all three remain generator-blocked/non-interactive.
- `PV.3` completed: pilot templates and visual-state sequences.
- `PV.4` completed: backward-compatible procedure/game projection contract.
- `RX.5` completed: representation operation registry and reports, expanded with PV operation/visual-state dimensions, only after schema/validator/CLI path exists.
- `PV.5` completed: non-dynamic visual projection MVP.
- `PV.6` completed: PV coverage reports and dashboard integration.
- `RX.6` completed: source and deployed skill-tree generator readiness now distinguish interactive generator-backed units from explicit non-interactive generator-blocked catalog units.
- `PV.7` completed: machine-promotion review closed as `pass_with_conditions`; no PV `references/machine/` promotion authorized.
- `PV.8` completed: design-only promotion pipeline recorded; no promotion CLI implemented and no machine registry created.
- `PV-G4` closed as `pass_with_conditions`: two lesson-regression proofs are recorded and reconciled, but machine-authoritative and student-facing PV promotion remain blocked pending later CLI, mutation-log, validator, and human promotion gates.

### Phase R9: Owned Source Integration And Content Graph

Goal: connect owned book and lesson material to the reference graph without confusing authored exposition with machine reference data.

Sprints:

- `R9.1` completed: owned source registry and blueprint source-reference repair.
- `R9.2` completed: content graph projection.

### Phase R8: QC Issue Model And Registries

Goal: make quality issues machine-readable only where doing so improves reference and RAG trust.

Sprints:

- `R8.1` completed: scoped QC issue model.
- `S6` completed: bronnen registry MVP under `references/data/`.
- `S8 / Sprint 8` completed: misconception registry MVP as internal diagnostic overlay only.
- `S9 / Sprint 9` completed: unit design status and D04 decision gate closed as `pass_with_conditions`.
- `S9a` completed: D04 deprecated through CLI-only mutation with successor pointers, stale-reference audit, and active target-exercise cleanup.

### Content Track: Foundation Hardening Before Scale

Goal: stabilize the v5/three-year planning model and MTU/target-exercise
coverage before broader lesson production or protected registry mutation.

Sprints:

- `REF-CT0` completed: normalized the rough three-year blueprint as a
  non-authoritative v5-aware prototype and classified MTU gaps.
- `REF-CT1` completed: Year-1 target-exercise and MTU coverage baseline for
  v5, with `GATE-CP6-year-1-paragraph-coverage`.
- `REF-CT2` completed: Year-1 precision and dual-coding audit.
- `REF-CP6` completed: CP-6 remediation/readiness packet.
- `GATE-CP6` completed: human routing decision recorded, no closure or mutation authorized.
- `CP.6a` completed and rechecked: Book 1 Chapter 1.3 lesson-side alignment for `1.3.2` and `1.3.3` is fixed with carried conditions after lesson-team L-CP6A.
- `CP.6b` completed: Year-1 target-exercise review and gemengde-opgaven integration design/review; all records remain non-final and no registry mutation was authorized.
- `CP.6c` completed: Year-1 MTU backfill classification; six candidates map to live units, one is a merge/design candidate, one is deferred, and one simultaneous-shift operation is a true missing-unit candidate for later governed review.
- `CP.6d` completed: Book 1 graph-heavy evidence ledger upgraded against the live post-L-CP6A lesson repo; no closure evidence authorized.
- `CP.6e` completed: focused `1.1.3` Part A re-review failed clearance because the then-live figure first-use order remained `1 -> 3 -> 2`.
- `CP.6f` completed: lesson-team L-CP6E and references-side recheck cleared the focused `1.1.3` Part A figure-numbering blocker with live markdown, HTML, and PDF first-use order `1 -> 2 -> 3`.
- `EX-0` completed: exam-ingestion contract design for prompt, source-annex,
  answer-model, scoring-rule, operation, MTU, and lesson-build handoff overlays.
- `GATE-EX0` completed: EX-0 contract review closed as `pass_with_conditions` and authorizes the bounded non-mutating EX-1 pilot under graph/source reconstruction, pilot-validator, lesson-handoff, and no-hidden-gap conditions.
- `EX-1` completed: three-question source-annex and answer-model extraction
  pilot under the GATE-EX0 conditions, with q19 graph/source gaps carried as
  blocking.
- `EX-2` completed: human-reviewed exam-to-MTU mapping gate closed as
  `pass_with_conditions` for classification and routing only. q3 adds `A61`
  support while keeping the threshold operation open, q19 remains blocked by
  source/graph gaps with `A42` added as graph-shift support, and q3/q15
  answer-skill needs remain visible.
- `EX-3` completed: coverage dashboards and reports recorded reviewed EX-2
  classifications, q3/q15 answer-skill needs, and q19 blocking gaps.
- `EX-4` completed: governed mutation-planning packet prepared routing/design
  evidence only.
- `GATE-EX4` completed: mutation planning human review closed as
  `pass_with_conditions` and authorized EX-5 design-contract work only.
- `EX-5` completed: operation/answer-skill/q19 extraction contract prepared as
  a design-only sprint.
- `GATE-EX5` completed: operation/answer-skill contract human review closed as
  `pass_with_conditions` for design-contract review only and authorized EX-6
  validator/CLI implementation planning only.
- `EX-6` completed: validator/CLI implementation planning added future-storage
  schemas, a planning contract, a read-only checker, and the GATE-EX6 review
  packet without candidate writes, q19 extraction execution, protected
  mutation, lesson-output mutation, or student/product use.
- `GATE-EX6` completed: validator/CLI planning human review closed as
  `pass_with_conditions` and authorized EX-7 validators and dry-run CLIs only.
- `EX-7` completed: validators and dry-run-only CLIs implemented with no
  candidate storage, candidate writes, q19 extraction execution, protected
  mutation, lesson-output mutation, or student/product use.
- `GAME-UX-2` is the next platform start decision or waiver: implement a
  source-controlled non-summative checkpoint engine only if explicitly started.
- `LESSON-SCALE-1` tracks the lesson-side pre-scale dependency: L1.7A rejected
  broad scaling; `L1.7B-C` closed the exit-ticket contract-only lane; L1.7C-0
  closed the shared skill-map contract; platform `GAME-UX-1` implemented the
  shared skill-map runtime support; lesson L1.7C/L1.7D closed PASS WITH FLAGS;
  and lesson L2.0 closed PASS WITH FLAGS with the house-style baseline,
  game-row flag disposition, exit-ticket readiness, and consolidation landing
  rule recorded. Broad companion/product scaling must still wait for L1.7B-R,
  GATE-L1.7B, minimal curriculum-versioning readiness, GAME-UX-2 status or an
  explicit waiver, and Scale Gate 1.
- `Content Track 3` planned: Year-2 skeleton and `GATE-CP7-year-2-anchoring`,
  after CP-6 remediation and the bounded exam-ingestion pilot track make the
  Year-1 hold explicit enough to guide skeleton work.

### Phase R14: Minimal Curriculum Versioning

Goal: prevent retrieval and reports from silently mixing curriculum/source versions.

Sprint:

- `R14.1` planned: minimal curriculum versioning.

### Phase Promotion And Product Re-Evaluation

Goal: only promote or productize after the schema, source, evidence, RAG, and unit-design gates make it safe.

Sprints:

- `Sprint 12` planned: exam and target exercise decomposition backfill.
- `Sprint 13` planned: composition pattern registry.
- `Sprint 14` planned: C-to-B promotion workflow.
- `Product Gate` blocked: re-evaluate R10-R13 product surfaces only after the data-quality gates pass.

## Review Gates

| Gate | When | Subagents | Human Review | Required Before |
|---|---:|---:|---:|---|
| GATE-R1-schema | after schemas | optional | no | schema-dependent migrations |
| GATE-R2-empty-needs | before broad dependency corrections | yes | yes | authoritative prerequisite graph |
| GATE-R5-alignment-graph | before graph powers retrieval/diagnostics | yes | yes | retrieval, diagnostics |
| GATE-R7-rag | before teacher-facing RAG | yes | sampled | teacher-facing retrieval |
| GATE-CP1-schema-audit | before R9.1 implementation | yes | yes | owned-source and exercise-schema implementation |
| GATE-CP2-owned-source-scope | during R9.1 | yes | yes | content graph projection |
| GATE-CP3-schema-extension-dry-run | before bulk exercise metadata extension | yes | yes | exercise metadata backfill |
| GATE-CP4-skill-registry-coexistence | before skill/operation registry promotion | yes | yes | operation registry and exercise decomposition |
| GATE-PV-G1-schema | before Procedure-Visual pilot data scales | optional | no | PV schema and validator MVP |
| GATE-PV-G2-pilot-content | before Procedure-Visual generator or game integration | yes | no | pilot procedure templates and visual-state sequences |
| GATE-PV-G3-projection | before lesson-side dependency | yes | sampled | procedure/game, answer-model, and visual projection alignment |
| GATE-PV-G4-lesson-regression | before Lessen Team L1.7 scaling decision | yes | yes | fresh paragraph PV regression and no generated-output hand patching |
| GATE-RX1-representation-unit-scope | before representation-sensitive unit mutations | yes | yes | RX.2+ unit mutation |
| GATE-RX2-first-lane-mutation-review | before RX.2 first-lane CLI execution | yes | yes | A61/A66/A67/A70/A72/A74 catalog mutation |
| GATE-RX2b-graphical-foundation | before RX.2b CLI execution | yes | yes | A62/A63/A64/A65/A68/A69/A73 and conditional A71 catalog mutation |
| GATE-CP5-D04-resolution | before D-domain C-to-B promotion | yes | yes | exercise promotion on D-domain units |
| GATE-CP6-year-1-paragraph-coverage | before Year-2 extension is considered ready | yes | yes | Year-2 extension confidence |
| GATE-EX0-exam-ingestion-contract | before EX-1 pilot overlay records are treated as accepted contract evidence | yes | yes | EX-1 bounded exam-ingestion pilot |
| GATE-EX2-exam-to-mtu-mapping | before EX-1 pilot mapping classifications are treated as accepted routing evidence | yes | yes | EX-3 exam coverage dashboard/reporting and later EX-4 mutation planning |
| GATE-EX6-validator-cli-planning | before EX-6 validator/CLI planning is treated as implementation-ready | yes | yes | EX-7 bounded validator and dry-run CLI implementation only |
| GATE-MTU-H2B-cli-execution | before Solo q1-q3 CLI execution is authorized | yes | yes | bounded unblocked CLI execution lanes only, with `A20` held unless a later reviewed split/replacement route resolves active given-MK usage |
| GATE-CP7-year-2-anchoring | before Year-2 Tier C authoring is treated as coherent | yes | yes | Year-2 skeleton progression |
| GATE-CP8-rag-eval-content-coverage | during R7.6 | yes | yes | broader teacher-facing retrieval confidence |

## Critical Path

Use this order when capacity is limited:

```text
R0.2 Reference baseline inventory
R1.1 Source-of-truth decision
R1.2 Core JSON schemas
R1.3 Unit prior-knowledge schema extension
R2.1 Full empty-needs audit, non-mutating
R2.2 Subagent review
R2.3 Adaptive human review and gate closure
R2.4 Evidence and unit-design cleanup after GATE-R2 hold
R3.1 Reference CLI and documentation completion
R3.2 Apply reviewed empty-needs corrections
R4.1 Unit-term slug migration
R4.2 Exam-question extraction gap closure
R4.3 Blueprint flag triage
R4.4 Micro-teaching unit quality packet
R4.5 Apply reviewed micro-unit corrections
R5.1 Evidence anchors
R5.2 Alignment graph
R5.3 Alignment graph gate
R6.1 JSON-first reports
R6.2 Reference-health dashboard
R7.1 Chunk index
R7.2 Hybrid retrieval
R7.3 Retrieval evals
R7.4 RAG gate
R7.5 Merge readiness and main sync
R9.0 Legacy target reference minimization
R9.01 Legacy folder rename
S1 Schema audit and exercise naming contract (CP-1)
R9.1 Owned source registry
R9.2 Content graph projection
Sprint 4 Exercise metadata overlay MVP (CP-3)
RX.2 First-lane mutation review and CLI execution
RX.2b Graphical foundation coverage and mutation
S6 Bronnen registry MVP
S7 Skill and operation registry MVP (CP-4)
PV.0 CP-4 Procedure-Visual addendum
PV.1 Procedure-Visual inventory
PV.2 Procedure-Visual schema and validator MVP
RX.3 Producer table and graph representation units using PV constraints
RX.4 Elasticity and market diagram representation units completed using PV constraints
PV.3 Pilot Procedure-Visual templates
PV.4 Procedure/game projection contract
RX.5 Representation operation registry and reports expanded with PV
PV.5 Visual projection MVP
PV.6 Coverage reports and dashboard integration
RX.6 Skill-tree and generator integration
PV.7 Machine-promotion review gate
PV.8 Promotion pipeline design
PV-G4 Lesson regression proof
S8 / Sprint 8 Misconception registry MVP completed
Sprint 9 Unit design status and D04 resolution (CP-5) completed
S9a D04 CLI-only mutation sprint completed
SYNC-1 Roadmap reconciliation completed
REF-CT0 Three-year prototype normalization and MTU classification completed
REF-CT1 Year-1 target exercise and MTU coverage baseline for v5 (CP-6)
REF-CT2 Year-1 precision and dual-coding audit
REF-CP6 Year-1 CP-6 remediation and review readiness
GATE-CP6 Year-1 paragraph coverage human review completed as routing decision
CP.6a Book 1 Chapter 1.3 lesson-side alignment rechecked after L-CP6A; source/lesson mismatch fixed with carried conditions
CP.6b Year-1 target-exercise review
CP.6c Year-1 MTU backfill classification
CP.6d Book 1 graph-heavy evidence upgrade completed
CP.6e Focused 1.1.3 Part A re-review failed clearance
CP.6f 1.1.3 Part A remediation recheck completed; focused figure-numbering blocker cleared
EX-0 Exam ingestion contract design completed
GATE-EX0 Exam ingestion contract review closed as pass_with_conditions
EX-1 Exam source annex and answer model pilot completed under GATE-EX0 conditions
EX-2 Exam-to-MTU mapping review gate closed as pass_with_conditions
EX-3 Exam coverage dashboard completed
EX-4 CLI-backed MTU / operation / answer-skill mutation planning completed as prep only
GATE-EX4 mutation planning human review closed as pass_with_conditions for routing/design only
EX-5 Operation and answer-skill registry contract completed as design-only sprint
SYNC-2 exit-ticket and scale-gate roadmap precision completed: L1.7B split into L1.7B-C contract-only and L1.7B-R future checkpoint resume; GATE-L1.7B and GAME-UX-2 inserted; Scale Gate 1 prerequisites clarified
GATE-EX5 Operation and answer-skill contract human review closed as pass_with_conditions for design-contract review only
EX-6 Validator and CLI implementation planning completed without candidate writes or q19 extraction execution
GATE-EX6 Validator and CLI planning human review closed as pass_with_conditions for validator/dry-run CLI implementation only
EX-7 Validator and dry-run CLI implementation completed, with no candidate storage, candidate writes, or q19 extraction execution
LESSON-SCALE-1 lesson companion pre-scale gates tracked: L1.7A closed with broad scaling rejected; L1.7B-C recorded the exit-ticket companion contract and paused implementation; L1.7B-R closed the boundary-safe checkpoint resume; GATE-L1.7B closed the product-boundary review; L1.7C-0 closed the shared skill-map contract; GAME-UX-1 implemented platform shared skill-map runtime support; L1.7C closed PASS WITH FLAGS after focused recheck; L1.7D closed PASS WITH FLAGS; L2.0 closed PASS WITH FLAGS with game-row flag disposition, exit-ticket readiness, house-style policy, and consolidation landing proof recorded; GAME-UX-2 closed checkpoint-engine support; L1.7C-MATH restored the scoped primary math route; L1.7B-MAP fixed checkpoint metadata; L1.7B-P23 closed as a stop/handoff; platform task-type support, L1.7B-Q2, GATE-L1.7B-Q2, REV-STD-1, and Scale Gate 1 remain before broad companion/product scaling
GAME-UX-1 shared skill-map engine architecture completed for the closed lesson L1.7C-0 contract
GAME-UX-2 exit-ticket checkpoint engine completed as bounded platform support for L1.7B-R
GAME-UX-3 exit-ticket task-type expansion planned from the L1.7B-P23 stop/handoff before L1.7B-Q2 readiness implementation
MTU-H1 operation benchmark from Solo q1-q3 completed without mutation
GATE-MTU-H2 Solo q1-q3 routing review closed as pass_with_conditions
MTU-H2A Solo q1-q3 CLI-mutation planning completed without mutation
GATE-MTU-H2A Solo q1-q3 CLI-mutation plan review closed as pass_with_conditions for execution-gate planning only
MTU-H2B Solo q1-q3 CLI execution gate packet completed without mutation; A20 direct update held by active given-MK usage in target exercise 4.1.2
GATE-MTU-H2B Solo q1-q3 CLI execution authorization human review closed as partial_pass_with_conditions; A12 and A20 held, A92 requires A89 dependency resolution
MTU-H2C Reduced-scope Solo q1-q3 CLI execution completed for F19, F20, A85, A86, A87, and A91
MTU-H2D Solo q1-q3 held and conditional lane resolution completed without mutation
GATE-MTU-H2D Solo q1-q3 held/conditional lane human review
REF-CT3 Year-2 skeleton (CP-7)
R7.6 RAG quality hardening
R14.1 Minimal curriculum versioning
Sprint 12 Exam and target exercise decomposition backfill
Sprint 13 Composition pattern registry
Sprint 14 C-to-B promotion workflow
Product Gate Re-evaluate R10-R13 product surfaces
```

Do not invert this order.

## Immediate Next Sprint

Next action: run `GATE-MTU-H2D Solo q1-q3 Held/Conditional Lane Human Review`. MTU-H2D has prepared the non-mutating resolution packet for `A12`, `A20`, `A88`, `A89`, `A90`, `A92`, and `A93`. Do not execute another Solo q1-q3 mutation until the human gate reviews the packet. `A12` may only move forward if `A2.11` is retained or a later gate explicitly authorizes removal. `A20` remains separate because target exercise `4.1.2` uses current `A20` in a given-MK context. `A88` and `A89` are proposed as zero-needs revisions, `A90` is proposed as a narrowed linear GO-rule route, `A92` depends on accepted/executed `A89`, and `A93` is proposed without `A66` while broader incidence remains MTU-H3. The gate must also decide how to handle absent generator implementations before student-facing exposure. GATE-MTU-H2D is review work only unless a later gate names exact CLI commands, specs, rollback, audit log, validation evidence, and execution authority. GAME-UX-2 has already supplied the bounded checkpoint engine support; lesson-side broad companion scaling remains blocked by the lesson review/Scale Gate path, while the reference-side active lane is now GATE-MTU-H2D.

R4.5 has closed the bounded micro-unit mutation lane, CP-1 has closed the non-mutating schema audit gate as `pass_with_conditions`, CP-2 has closed the owned-source scope gate as `pass_with_conditions`, R9.1 has registered the owned-source surfaces, R9.2 has completed owned-content projection, S4/CP-3 has closed as `pass_with_conditions`, S4.1 has implemented the CP-3 condition artifacts, RX.1 has prepared the non-mutating representation-operation inventory, `GATE-RX1-representation-unit-scope` has closed as `pass_with_conditions`, RX.2/GATE-RX2 has added the bounded six-unit first lane through CLI-only mutation, RX.2b/GATE-RX2b has added the bounded seven-unit graphical foundation lane through CLI-only mutation while holding `A71`, R8.1 has added the scoped internal QC issue model, S6 has created the source-document registry MVP under `references/data/`, S7/CP-4 has closed as `pass_with_conditions`, RX.3a/RX.3b/RX.4 have applied producer and elasticity representation lanes through CLI-only mutation, PV.3 through PV.6 have completed pilot templates, projection proof, and coverage dashboards, RX.5 has added representation-operation reports, RX.6 has completed skill-tree generator readiness, PV.7 has closed the machine-promotion review gate without authorizing promotion, PV.8 has completed the promotion-pipeline design, PV-G4 has closed as `pass_with_conditions` with two reconciled lesson-team proofs, S8 has created the bounded internal misconception registry under `references/data/`, S9 has closed CP-5 as a D04 decision-only gate, and S9a has applied the D04 retirement through CLI-only mutation.

All active A-domain units without generators are now explicitly generator-blocked/non-interactive. The skill-tree currently has 44 generator-backed interactive A-domain units and 37 generator-blocked A-domain units. Blocked units must not be exposed in student-facing skill-tree or PV projection until their generators exist, validators pass, and a later sprint explicitly authorizes exposure.

`S7` is closed. The skill/operation registry remains a `references/data/` overlay; `exercise_operations` remain provisional; PV templates may reference them only as provisional records; `required_skills` remains legacy/source-only; and machine registry promotion plus bulk exercise metadata backfill remain blocked.

The Procedure-Visual Registry remains under `references/data/procedure-visual/`; do not create `references/machine/procedure-templates.json`, `references/machine/visual-states.json`, `references/machine/unit-template-links.json`, or equivalent PV machine registries before a later sprint implements the CLI-backed path and a later human promotion gate explicitly authorizes machine promotion.

Do not start diagnostics, adaptive routing, student-facing AI, automatic lesson sequencing, mastery decisions, summative decisions, teacher cockpit deployment, game/simulation product mapping, or continuous-improvement claims from this roadmap.

R7.4/R7.5 completion state:

- R7.4 closed as `pass_with_conditions`.
- R7.5 merged the reference foundation to `main`.
- Post-merge validation passed on `main`.
- Retrieval evaluation has 10/10 passing cases and 0 authority violations.
- RAG-01 through RAG-04 remain required quality follow-ups.
- Student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, and unreviewed student-facing publication are explicitly blocked.

CP-1 decisions now in force:

- `required_units` is canonical for micro-teaching-unit IDs.
- `exercise_operations` is canonical for fine-grained exercise actions and may be empty until Sprint 12.
- `skill_tags` is canonical for broader taxonomy labels.
- `instructional_role` and `assessment_role` are separate fields.
- `instructional_role: diagnostic` is an exercise role, not permission for student diagnostics or adaptive products.
- `assessment_role` is optional and omitted when absent.
- The scaffolding object is `verbal_level`, `visual_stage`, `fading_position`, `dual_coding_present`.
- External exam-question metadata must use `references/data/exercises/` overlays with source stable ID and curriculum version.
- Authored target exercises use overlay-first strategy until a later approved migration.
- `build-scripts/lib/verify_svg_geometry.py` is the canonical current precision verifier path.
- S4/CP-3 approved the dry-run overlay shape only with conditions; it did not authorize source mutation or bulk metadata completion.
- Tier A source annex extraction gaps, scaffolding calibration, provisional operation labels, graph-spec refinement, and product-boundary warnings must be handled before broad backfill.

CP-2 decisions now in force:

- R9.1 closed as `pass_with_conditions`.
- R9.2 closed after creating owned-content projection edges with projection defaults.
- Evidence edges are allowed only for explicitly evidence-qualified records, such as the target-exercise index and owned exercise markdown, and must remain separate from external authority.
- Generated HTML, PDF, PNG, DOCX, PPTX, shared-engine output, generated navigation, generated quality YAML, and review notes are retrieval context or implementation trace only.
- R9.2 strengthened edge labels so projection, owned exercise evidence, external authority, and implementation trace cannot be confused in graph/RAG output.
- Companion subtype labels should continue to be refined where broad source-surface classes remain.
- Exercise metadata backfill remains Sprint 4/CP-3 scope.

## Final Rule

Use this sequence:

```text
Plan in reports/sprints with sprint logs
-> Baseline
-> Execute
-> Verify
-> Lead-review assignment and round-1 review log
-> Correction pass and correction log
-> Lead-review recheck and round-2 review log
-> Review gate if needed
-> Deterministic bundle check
-> Fetch/prune remote and resolve behind/diverged state
-> Refresh repository maps and GitHub-facing indexes
-> Commit
-> Push
-> Tag
-> Proceed only to the allowed next sprint
```

Subagents find and frame issues. The lead reviewer must review each completed sprint once, the executor must make or explicitly log the correction pass, and the lead reviewer must recheck once. Humans make pedagogical decisions. Validators enforce completeness. GitHub is the review surface for off-site reviewers, so pushed remote state and current repository maps are part of done.
