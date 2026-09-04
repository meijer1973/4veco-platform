# Sprint BOOK2-TARGET-AUTHORITY-REMEDIATION-1: Book 2 Target Authority Remediation

Generated: 2026-09-04

## Goal

Deliver Issue #229 Phase A as one platform-only, independently reviewed draft
PR. Repair all twelve Book 2 target records (§2.1.1–§2.3.4), resolve the `Ei`
terminology conflict, prove lesson-goal/target-operation alignment, and keep
lesson publication blocked until the exact package receives owner approval and
governed integration.

## Context

The sprint starts from platform `e5f89e730d65c4131d7dd09f805f0db94690e8e6`
and lesson `f09fd6e88edc5049b026b16b0158e7e188091d2d`, the exact heads audited in
`Boek_2_doelopgaven_en_lesdoelen_audit.pdf` (SHA-256
`8dbf513e7acf8da0967d4906cc6f09875cb4de211113fb52fa6a86559f2d836c`).
Issue #229 authorizes implementation and a draft PR, but not merge, lesson
writes, or student-output generation.

The approved Book 2 outline is `book-2-outline-v3-review-ready`, semantic hash
`69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde`, with
open paragraph holds. The existing currentness contract binds open target holds
only to an old baseline or an owner-approved replacement. This sprint must add
an explicit, non-approval candidate binding so a review branch can carry the
full proposed registry without inventing owner approval, while approved-use,
integration, production, and lesson-authoring actions remain blocked.

The `Ei` source decision is evidence-led: CvTE 2026 D1.8, authored terminology,
the machine term registry, and MTU `D11` use `inferieur`, `normaal`, and `luxe`.
MTU `A17` alone says `noodzakelijk`; it will be corrected through
`unit-update.js`, never by hand. The approved outline also contains two stale
necessity/luxury statements. Its approved semantic payload will not be silently
rewritten. A narrowly scoped open `H-229-EI-SUPERSESSION` lifecycle hold will
identify those exact statements, establish the CvTE/terminology/term-registry
three-way route as the Issue #229 candidate rule, and block approved target use,
target integration, production, lesson authoring, and merge for §2.2.3 until an
owner decides the semantic outline supersession. Structural target repair and
specialist review remain permitted.

Candidate governance is exact and non-approving. Historical released target
bindings and their integrated-commit evidence remain immutable. Every open
Issue #229 target transition uses this exact `candidate_binding` shape:
`blocked_baseline_sha256`, `candidate_replacement_sha256`,
`candidate_package_sha256`, `candidate_evidence_ref`, `candidate_status`,
`approved_replacement_sha256`, `approval_ref`, `approved_by`, `approved_on`.
`candidate_status` progresses from `implementation_candidate` through
`specialist_reviewed_candidate` to `lead_reviewed_candidate`; the evidence ref
must name the exact local/remote review packet. Approval fields stay null. The
twelve canonical `JSON.stringify(record)` hashes, in paragraph order, form one
canonical package whose SHA-256 is repeated in every candidate binding. Existing
open target holds receive that shape; new Issue #229 holds cover §2.1.1 and the
paragraphs without target-integration holds. In particular, the released
§2.1.1 integration remains valid history while the later open §2.1.1 candidate
hold owns the new pin and blocks reuse.

## Quality Standard

The specification quality floor is twelve independently executable Dutch
4-vwo targets whose visible questions elicit every required operation, whose
answer models reproduce each requested calculation and explanation, and whose
goals and operations map both ways without scope drift. Theory records have at
most four concise measurable goals. Mixed records use one coherent world,
concrete sources, continuous numbering, explicit points, checked answer forms,
and no new theory.

Every numerical result must be recalculated; formulas, substitutions, signs,
interval denominators, graph axes/regions, dimensions, source sufficiency, and
point allocations must be checked. Model claims must be bounded. Economic
efficiency and maximum total surplus must remain distinct from fairness or a
complete social-welfare judgment.

Rendered output and student-facing lesson files are deliberately not produced
in Phase A. The student-facing text under review is the target and goal text in
the authored registry; rendered proof is a named Phase B follow-up after exact
target approval/integration. Phase A proof consists of source-authority
traceability, the alignment matrix, exact candidate hashes, answer audits,
focused positive and mutation tests, independent specialist reviews, lead
round 1/correction/round 2, full exact-head platform validation, and successful
hosted CI.

Product-vision fit: the package strengthens exercise-first decomposition,
short reliable target routes, canonical language, and agent-scalable evidence.
The follow-up is governed Phase B lesson rebuilding and rendered review; this
sprint must not anticipate it.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Repair all twelve records as one package. | Twelve registry records plus exact per-record and package hashes. | Registry-delta checker proves exactly Book 2 changed; specialist and lead review cover all twelve. | planned |
| Resolve `Ei` terminology first. | Decision record; `A17` updated through CLI; all target language follows three-way CvTE classification. | Terminology checker rejects `noodzakelijk` in the Book 2 `Ei` route and mutation fixture restores the conflict. | planned |
| Expose every essential learner action. | Visible subquestions for tables, calculations, graph work, interpretation, and evaluation. | Target checker rejects hidden table actions and unasked answer-model work. | planned |
| Prove goal/operation alignment. | `BOOK2-TARGET-AUTHORITY-REMEDIATION-1-alignment-matrix.md` and record-level operation/answer-form metadata. | Positive and gap mutations; teacher and lead review. | planned |
| Repair economic precision. | Interval-normalized MK/MO, bounded capacity and supply-as-MC claims, correct demand-only wording, determinate surplus scenarios. | Economics review, recalculation ledger, graph/unit checks, focused mutations. | planned |
| Rebuild mixed targets. | Complete source-rich 2.1.4 and 2.3.4; shortened coherent 2.2.4; continuous points and short answer models. | Mixed-target contract tests and specialist review. | planned |
| Preserve honest approval state. | Candidate bindings distinct from owner-approved bindings; issue-wide open review hold. | Currentness tests prove candidates pass structural review but fail approved integration/production. | planned |
| Keep Phase A platform-only. | No lesson diff, no generated output, no Book 1 or Part B path. | Scope checker, lesson SHA/status proof, lead review. | planned |
| Publish a complete remote review surface. | Sprint/review packet, maps/indexes/dashboard refresh, pushed branch, draft PR. | Exact-head CI and PR-readiness evidence; stop for owner decision. | planned |

The planned per-record goal-to-operation coverage is recorded in
`reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-alignment-matrix.md`.

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add explicit short answer models and answer-form expectations to every Book 2 target, not only mixed targets. | include_now | Required to prove prompt/answer correspondence and calculations. |
| Add a reusable Book 2 target-quality checker with isolated mutation fixtures. | include_now | Required by Issue #229 and reusable for Phase B currentness. |
| Correct unrelated MTU dependency or exam-code debt discovered during review. | defer_named_follow_up | Record exact IDs; change only `A17`, which is necessary to resolve the mandated `Ei` conflict. |
| Generate paragraph/chapter/book PDFs or lesson files. | reject_scope_creep | Phase B begins only after exact owner approval and governed integration. |
| Expand targets into website tasks, diagnostics, mastery, or adaptive routing. | reject_scope_creep | Outside Issue #229 Phase A. |

## Allowed paths

- `references/authored/course-target-exercises.json`
- `references/authored/economie-terminologie.md` only if the evidence decision
  needs an explicit boundary note
- `references/machine/micro-teaching-units.{md,json}` only through
  `build-scripts/references/unit-update.js`
- `references/authored/book-outlines/book-2-outline.md` and
  `references/authored/book-outlines/book-2-outline.meta.json` for target pins,
  candidate/hold lifecycle state, and normalized authority hashes only
- Focused currentness and Book 2 target-remediation checkers/tests under
  `build-scripts/workflows/`
- `package.json` and `.github/workflows/platform-ci.yml` only if needed to make
  the focused checker/test discoverable by the existing full platform/hosted-CI
  path; otherwise these files remain unchanged
- Sprint data/evidence under `references/data/sprints/` and `reports/sprints/`
- Review packet under
  `reports/review-gates/GATE-BOOK2-TARGET-AUTHORITY-REMEDIATION-1/`
- Textbook roadmap/ledger/version-index surfaces when required for the active
  sprint and final handoff
- Generated repository maps, GitHub indexes, URL index, and internal dashboard
  required by changed review/reference surfaces

## Forbidden paths

- No writes in `../4veco-lessen`, including Markdown, HTML, PDF, assets, chapter
  plans, book plans, or generated student output.
- No Book 1 printed output or any other book's target records.
- No website/Part B, companion, shared-engine, diagnostics, mastery, PV, Scale
  Gate, or student/product-use work.
- No hand edits under `references/machine/` or `references/external/`.
- No changes to external syllabus/exam mirrors or owned course blueprints.
- No merge, auto-merge, administrative bypass, or claim of owner approval.

## Inputs

- Issue #229 body and owner coding-agent handoff.
- `Boek_2_doelopgaven_en_lesdoelen_audit.pdf` at the workspace root.
- Platform and lesson `AGENTS.md` plus both repository maps.
- Book 2 outline/metadata, v5/v6 blueprint context, and pedagogical boundaries.
- Current target registry and `Ei` terminology/MTU/term-registry evidence.
- CvTE 2026 D1/D3 and A2 end terms.
- `vraagtypen-en-opgaveontwerp.md`, `econ-exercise-builder.md`,
  `econ-consolidation-builder.md`, Issue #218, and Issue #221.
- Product vision and product end-state from the lesson repository as read-only
  specification authority.

## Outputs

- Baseline, plan, planning review, terminology decision, exact candidate
  package, alignment matrix, and recalculated answer/graph/table/unit/point
  audit.
- Updated twelve-record target registry and honest Book 2 candidate bindings.
- Focused positive and mutation tests for all named audit failure modes.
- Teacher-learning, economics-specialist, student-language, and lead-review
  round 1/corrections/round 2 evidence.
- Independent finished-artifact/test-plan verification evidence, separate from
  the author and specialist reviews.
- Result, diff summary, command log, review packet, refreshed indexes/maps, and
  draft PR with exact-head CI evidence.

## Operationalized sprint procedure

1. Preserve exact platform/lesson/PDF/outline/registry hashes and run all twelve
   `target_authority_repair` currentness checks plus baseline target/Part A
   tests. Stop if the source heads or authority checks differ from Issue #229.
2. Obtain an independent planning review of this plan, the alignment matrix,
   the `Ei` decision, candidate-binding design, scope, and proof plan. Correct
   all blockers before implementation.
3. Record the `Ei` decision, dry-run and then apply the `A17` patch through the
   protected-reference CLI, regenerate its projection, and prove the other
   machine units are unchanged.
4. Add the exact candidate lifecycle contract described above. Preserve the
   historical released §2.1.1 binding/evidence, add an open successor hold for
   its Issue #229 revision, extend the six existing open target holds, and add
   holds for the five other paragraphs. Add `H-229-EI-SUPERSESSION` without
   changing the approved outline semantics. Structural/current repair checks
   must pass; `--require-approved`, `target_authority_integration`, production,
   lesson-authoring, and merge checks must fail until exact owner approval.
5. Build the twelve exact Dutch targets and short answer models as one candidate
   package, mechanically replace only Book 2 records, refresh target pins and
   authority hashes, and record non-approval candidate bindings. Stop if any
   other registry record changes.
6. Implement a source checker and mutation suite for forbidden/internal terms,
   hidden actions, stale dependencies, `ΔQ` normalization, demand-only
   equilibrium wording, unbounded supply/MC or social claims, incomplete mixed
   targets, answer arithmetic/forms, and bidirectional goal-operation coverage.
7. Run independent teacher-learning, economics, and student-language reviews
   against the exact candidate package. Apply every blocking correction,
   recalculate affected answers, and re-run affected checks.
8. Run a separate independent verification assignment against the coherent
   finished artifact and its test plan. Correct all blockers and run focused
   plus full local validation. Re-prove the lesson repository unchanged.
9. Complete the first review packet, commit and push the coherent package, and
   open one draft PR. Specialist evidence must identify this exact published
   substantive commit; refresh it if the published commit differs.
10. Assign a separate structural lead reviewer for round 1 against the remote
    draft PR and exact substantive head. Record findings, apply and log every
    blocker correction, commit and push the correction, then obtain lead round
    2 against the corrected exact head. Stop if any blocker remains.
11. Run full exact-head hosted CI, complete PR-readiness routing, and refresh
    deterministic sprint/currentness/reference/scope/data-integrity/map/index/
    dashboard evidence. A generated evidence-only tail must identify the
    substantive reviewed head and may not alter target semantics; final hosted
    CI still runs on the final exact PR head. Do not request merge.
12. Return the full Phase A handoff and stop for explicit human review/decision
    on the exact twelve-record package hash. Phase B remains blocked until the
    approved target package is integrated through the governed lane.

Expected lifecycle test outcomes are explicit: default structural currentness
and all twelve `target_authority_repair` actions pass; candidate quality checks
pass; an expected-failure harness proves `--require-approved` fails while any
Issue #229 candidate or the `Ei` supersession hold is open; each paragraph's
`target_authority_integration`, `paragraph_production`, and `lesson_authoring`
action fails; `book_readiness`, whole-book assembly, and merge remain blocked.
Mutation fixtures may inject exact synthetic approval data only in isolated
test copies to prove the transition, never in repository evidence.

Named stop conditions: changed remote baseline before source implementation;
failed currentness without a truthful repair path; inability to express
candidate state without weakening approved-use gates; unresolved economics or
terminology disagreement after specialist review; a required lesson write;
or exact-head CI that cannot be made green within Phase A scope.

Named omissions: classroom timing observation, rendered lesson/PDF deltas,
Chapter 2.3 lesson production, Book 2 book assembly, and student-use evidence.
All are Phase B or later evidence and are not closure claims here.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-AUTHORITY-REMEDIATION-1
node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-AUTHORITY-REMEDIATION-1 --complete
node scripts/check-course-target-exercises-v5.js
node build-scripts/workflows/check-book2-target-authority-remediation.js
npx jest build-scripts/workflows/check-book2-target-authority-remediation.test.js --runInBand
npx jest build-scripts/workflows/check-book-outline-currentness.test.js --runInBand
npm.cmd run check:book-outline-currentness
node build-scripts/workflows/check-book2-candidate-approval-block.js
npm.cmd run check:part-a-exercise-authoring-contract
npm.cmd run check:blueprint-pedagogical-boundaries
npm.cmd run check:scope-language
node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD
node build-scripts/references/check-reference-cli-coverage.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
npm.cmd run check:agent-index-freshness
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run dashboard:internal
npm.cmd run check:platform
npm.cmd run finalization:freshness
node build-scripts/ci/check-evidence-line-endings.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-result.md
node build-scripts/sprints/check-sprint-command-log.js BOOK2-TARGET-AUTHORITY-REMEDIATION-1
node build-scripts/sprints/check-lead-review-substance.js BOOK2-TARGET-AUTHORITY-REMEDIATION-1
npm.cmd run check:review-throughput -- reports/review-gates/GATE-BOOK2-TARGET-AUTHORITY-REMEDIATION-1/review-packet.json
git diff --check
git -C ../4veco-lessen status --short
git -C ../4veco-lessen diff --check
```

The expected-failure harness invokes `--require-approved` and every governed
target-integration/production action, asserts non-zero status, and asserts the
specific open candidate/supersession hold. Focused mutations also cover the
released-then-superseded §2.1.1 lifecycle, `Ei=0`/`Ei=1` boundaries, and scoped
student-facing forbidden-language detection. Diff proof hashes all non-Book-2
registry records and all machine units except `A17` before and after.

## Proof Required to Close

Closure proof requires: twelve exact reviewed record hashes and one package
hash; zero silent goal/operation gaps; recalculated answers and checked units,
tables, graphs, and points; the canonical three-way `Ei` route; positive and
mutation tests for every Issue #229 failure mode; teacher, economics,
student-language, and lead round-2 review without blockers; all focused and
full validators green; unchanged clean lesson head; refreshed repository
discovery surfaces; pushed draft PR; and successful exact-head platform CI.

This proof closes Phase A implementation readiness only. It does not close the
owner decision, target integration, merge, lesson publication, rendered proof,
or Phase B.

## Rollback plan

Before commit, revert only the allowed sprint paths and regenerate machine
projections through their CLI/build commands. After commit, revert this
sprint's commits or close the draft PR. The lesson repository requires no
rollback because it must remain unchanged. Never reset or overwrite unrelated
user work.

## Human review required

Yes. Independent agent reviews establish specialist/structural readiness, not
owner approval. After exact-head CI, the owner must approve, revise, or reject
the exact package hash and authorize the governed target-integration/merge
transition. Phase B may start only after that exact target authority is
approved and integrated, or under a separately explicit cross-repository bundle
authorization that pins the same hashes and review evidence.
