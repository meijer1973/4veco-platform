# Sprint PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1: Book 2 Part A Exercise Authoring Contract

Generated: 2026-08-29

Revised: 2026-08-31 after owner review of PR #219

## Goal

Establish one unambiguous, platform-only Part A textbook exercise-authoring
contract for Book 2 and later books, as specified by GitHub issue 218. Align
the active didactic, authoring, workflow, and review guidance; add a focused
non-retroactive contract checker; and leave Book 1 and `4veco-lessen`
unchanged.

The canonical visible sequence is:

1. `Uitgewerkt voorbeeld`
2. `Startopgaven`
3. `Begeleide inoefening`
4. `Zelfstandige oefening`
5. `Doeloefening`
6. `Denkertje` or `Bonusopgave`
7. `Herhaling` or `Herhaling en interleaving`

## Context

Issue 218 corrects the active historical sequence
`worked example -> Startoefeningen/guided -> independent -> interleaving ->
target -> stretch`. The new contract preserves theory immediately followed by
the worked example, keeps prerequisite retrieval and a brief current-content
check inside the single visible `Startopgaven` heading, gives scaffolded and
faded new-content practice its own `Begeleide inoefening` section, moves the
target exercise before optional bonus and closing cumulative review, and makes
the short route `2 -> 4 -> 5`.

The companion route `Start -> Leer -> Check -> Oefen -> Exit ticket` remains
an internal Part B companion/product concept. It is not the printed Part A
sequence, a printed route dependency, or student-facing template language.
This sprint does not redesign Part B, build a Book 2 paragraph, audit or repair
paragraph 1.2.1, regenerate Book 1, or change `4veco-lessen`.

Book 2 Part A is paper-first and fully usable in a no-device classroom. Every
explanation, retrieval task, scaffold, practice task, and target preparation
required by the classroom route must be present in print. Printed template
copy must not direct students to a website, online explanation, companion
surface, laptop, phone, tablet, or QR code, and must not expose internal terms
such as Part A, Part B, lane, or companion route.

The canonical exercise headings all use Markdown level `##` and retain their
order. Book 1 continuity deliberately preserves a compact, non-heading summary
after `Uitgewerkt voorbeeld` and before `Startopgaven`; the summary is not an
eighth exercise section and may contain at most five concise points. The
checker must permit that block while rejecting any intervening top-level
heading. The visible paper route note is only:

> **Korte route:** Startopgaven → Zelfstandige oefening → Doeloefening.
> **Extra hulp nodig?** Maak eerst Begeleide inoefening.

Baseline inspection found contradictory active wording in the required eight
surfaces plus `references/authored/vraagtypen-en-opgaveontwerp.md` and
`skills/econ-pdf-builder.md`. Internal historical-compatible metadata values
such as `startoefening` are not student-facing authoring guidance and are not
renamed in this sprint; changing those schemas would be a separate migration.

## Quality Standard

The specification quality floor is internal consistency and operational
usability, not a token wording replacement. A future Book 2 author must be
able to derive the visible sequence, route choices, time budget, backward
alignment, scaffolding/fading behavior, bonus purpose, and closing review role
without reconciling competing instructions.

The sprint passes only when:

- the didactic reference remains the rationale source of truth;
- `econ-exercise-builder` contains the full operational contract and other
  surfaces inherit or summarize it without creating competing variants;
- the exact seven-section order, exact `##` level, and `Startopgaven` two-role
  rule are explicit;
- no additional top-level exercise heading, generic `Opgaven` wrapper, or
  website-help stage interrupts the canonical order;
- a compact non-heading summary remains after the worked example and before
  `Startopgaven`, with no more than five concise points;
- printed template copy is paper-only, contains the canonical short/support
  route note, and contains no website/device dependency or internal lane term;
- the short route `Startopgaven -> Zelfstandige oefening -> Doeloefening` is
  realistic within normal exercise time in a 55-minute lesson;
- backward design runs from lesson goals through target decomposition to the
  worked example and practice sequence, with the required alignment table;
- `Begeleide inoefening` is optional, neutrally framed, more explicitly
  scaffolded than the old default, and deliberately faded;
- bonus develops cognitive flexibility, while final review/interleaving is one
  or two accessible cumulative homework-suitable tasks;
- Part A and Part B routes are explicitly separated;
- Book 1 freeze and Book 2 opt-in/non-retroactivity are explicit and enforced
  by a checker that reads active platform guidance only;
- focused and full validation, independent planning review,
  teacher-learning-quality review, and lead-review round 1/correction/round 2
  provide proof;
- no rendered output or student-facing lesson files change. Rendered-output
  proof is not applicable because this is authoring-contract-only work; the
  diff and lane-scope proof must instead show zero lesson-output changes;
- any useful work outside this scope is named as follow-up rather than silently
  omitted.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Part A/Part B boundary | Internal guidance distinguishes lanes while printed templates neither depend on nor advertise Part B or any website/device route | Contract checker mutation tests plus lead review | revision planned |
| Canonical seven-section order and level | Didactic rationale and full operational builder use the exact order at `##`; every restating surface agrees | Focused checker parses names, order, and heading level | revision planned |
| Worked example, summary, and Start adjacency | Paragraph/workflow guidance states theory -> worked example -> compact non-heading summary -> `Startopgaven`; teacher may assign prerequisite retrieval earlier | Reviewer and checker evidence | revision planned |
| Two roles under one `Startopgaven` heading | Prerequisite retrieval and brief comprehension check are both required without extra visible top-level headings | Focused negative tests remove each role or add conflicting heading language | planned |
| Canonical printed flow | Summary remains before exercises without becoming a heading; no additional top-level Start/help/summary section appears | Mutations moving the summary after section 7, promoting it to `##`, or adding `Website-help`/`Voorkennis ophalen` must fail | revision planned |
| Paper-only classroom completeness | All normal-route support is printed; the paper route note points to `Begeleide inoefening`, never online | Mutations mentioning website, Part B, laptop, or online explanation in printed copy must fail | revision planned |
| Optional scaffolded support route | `Begeleide inoefening` requires task-appropriate explicit scaffolds, deliberate fading, neutral skip wording, and the same target | Teacher-learning-quality review and contract checker | planned |
| Core route and lesson realism | Short route is `2 -> 4 -> 5`; route-aware minute ranges replace rigid percentage allocation and fit normal 55-minute work time | Plan/diff review plus checker | planned |
| Backward target alignment | Guidance requires goals -> target -> target-operation decomposition -> example/practice and the seven-column alignment table | Reviewer verifies every required column and drift prohibition | planned |
| Independent core practice and target | `Zelfstandige oefening` is unscaffolded same-chain practice; `Doeloefening` is the target capstone before optional material | Contract checker and lead review | planned |
| Bonus and review distinction | Bonus requires transfer/comparison/evaluation/model criticism; closing review is one or two short accessible cumulative tasks | Teacher-learning-quality review and mutation tests | planned |
| Book 1 freeze and non-retroactivity | Active guidance states Book 2+ applicability; checker scans only platform guidance and rejects Book 1/lesson-output scope expansion | Tests inspect configured surface list and no-lesson diff | planned |
| Subordinate safety rules | Worked example adds no target-absent operation; prerequisite retrieval uses taught knowledge; brief Start check makes no mastery/diagnosis/automatic-routing claim; closing review adds no new theory | Role-specific checker assertions and teacher/lead review | planned |
| Active contradictory wording removed | Required eight surfaces plus active question-design/PDF guidance no longer teach old `Startoefeningen` semantics or old order | Repository search evidence and checker | planned |
| Regression guardrail in normal CI | New workflow checker, Jest tests, npm script, platform-CI step, and repository navigation entries | Focused Jest, checker CLI, full platform CI | planned |
| No Book 2 paragraph output | No paragraph source, generated lesson output, visual, PDF, or `4veco-lessen` file changes | Git diff and shared lane-scope proof | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Update the active question-design reference and PDF heading guidance in addition to the eight minimum surfaces. | `include_now` | Both currently encode the obsolete visible sequence and would otherwise remain competing active guidance. |
| Add a dedicated Part A contract checker instead of overloading the existing two-lane wording checker. | `include_now` | It keeps sequence semantics, non-retroactivity, and mutation tests focused and discoverable. |
| Preserve the compact summary before exercises and remove every printed website/device pointer. | `include_now` | This retains Book 1 reading continuity and makes the classroom route fully usable on paper. |
| Rename internal exercise-schema enum values such as `startoefening` and migrate existing records. | `defer_named_follow_up` | Those compatibility values are not the printed authoring contract; migration risk exceeds this bounded guidance task. |
| Apply the contract to the first Book 2 paragraph. | `defer_named_follow_up` | Explicitly reserved by issue 218 until the contract is reviewed and approved. |
| Audit or repair Book 1 paragraph 1.2.1. | `reject_scope_creep` | Book 1 is frozen and may be used only as historical continuity evidence. |
| Redesign the Part B companion route to mirror the textbook. | `reject_scope_creep` | Issue 218 retains cross-surface comparison as a later decision. |

## Allowed paths

- `references/authored/didactiek-principes.md`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `skills/econ-exercise-builder.md`
- `skills/econ-textbook-paragraph.md`
- `skills/econ-didactiek.md`
- `skills/econ-paragraph-review.md`
- `skills/econ-pdf-builder.md`
- `agents/teacher-learning-quality-review-agent.md`
- `BUILD-PARAGRAPH.md`
- `docs/workflows/textbook-paragraph-lane.md`
- `build-scripts/workflows/check-part-a-exercise-authoring-contract.js`
- `build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js`
- `package.json`
- `.github/workflows/platform-ci.yml`
- `AGENT_GITHUB_ENTRY.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `build-scripts/sprints/emit-url-index.js`
- `references/reference-team-roadmap.md`
- `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-*`
- `references/data/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1.plan.json`
- `references/data/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1.result.json`
- generated repository maps, URL index, GitHub agent indexes, and internal dashboard files refreshed by repository commands

## Forbidden paths

- `../4veco-lessen/` and every Book 1 lesson/output file
- Book 2 paragraph source or generated output
- `references/machine/`
- `references/external/`
- `source-data/`
- target-exercise registries or blueprint target content
- candidate-storage and PV projection/promotion outputs
- archived evidence and `docs/roadmaps/outdated/`
- Part B companion implementation, route, game, checkpoint, or exit-ticket files

## Inputs

- GitHub issue 218, the original assignment, the owner review on PR #219, and
  the 2026-08-31 correction requiring a paper-only/no-device printed route
- `AGENTS.md`
- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- the ten active authoring/review surfaces listed under Allowed paths
- detached read-only sibling lesson checkout at `../4veco-lessen`, pinned to
  lesson `origin/main` only for currentness and no-change proof
- `docs/workflows/paragraph-lane-vocabulary.md`
- existing workflow checker/test conventions under `build-scripts/workflows/`
- sprint plan/bundle/checker conventions under `build-scripts/sprints/`

## Outputs

No textbook paragraph, rendered output, Book 1 output, or Part B companion
output is generated or changed.

Required outputs are:

- aligned active authoring, workflow, and reviewer guidance;
- one focused Part A exercise-authoring contract checker with mutation tests;
- npm and platform-CI wiring for the checker;
- discoverable repository navigation/index entries;
- sprint plan, baseline, planning review, teacher-learning-quality review,
  planning-review resolution/recheck, command log, lead-review
  assignment/rounds/corrections, diff summary, result, and plan/result JSON;
- a pushed task branch, refreshed PR #219 description, exact-head CI evidence,
  clean mergeability proof, and governed non-draft human-review routing without
  merge.

## Operationalized sprint procedure

1. Preserve the clean dedicated worktree, fetch/prune, run governance and
   worktree preflight, inspect issue 218, all required active surfaces, broader
   active contradiction searches, current checker architecture, and Book 1/
   Part B boundaries. Provision a detached read-only `../4veco-lessen`
   worktree at its freshly fetched `origin/main`, record its SHA, and require
   whole-repository clean status before and after validation. Stop on branch
   collision, unexpected dirt, or protected/lesson surface changes.
2. Write and revise this plan, plan JSON, baseline, and active roadmap row.
   Explicitly preserve the compact non-heading summary after the worked example
   and before `Startopgaven`; remove printed website/device help and expose only
   the paper short/support route. Run the plan
   validator and planned-bundle checker, then obtain an independent planning
   review. Correct the plan before any contract implementation if the reviewer
   finds a core omission or weak proof design; record a resolution and obtain a
   passing planning recheck.
3. Make the didactic reference the rationale authority, put the full operational
   contract in `econ-exercise-builder`, and make the other active surfaces
   concise, consistent inheritors. Preserve existing unrelated precision,
   exercise-type, PDF, and review rules.
4. Implement a source-contract checker that scans only enumerated active
   platform guidance. Assign role-specific obligations: the authored didactic
   reference owns rationale/invariants, `econ-exercise-builder` owns the full
   operational contract, the question-design reference owns question/answer
   forms only, and every other surface inherits concisely. The checker must
   verify the canonical order at exact `##` level, summary placement,
   Startopgaven roles, paper-only core/support/challenge/review routes,
   backward-design table, time realism, internal Part A/Part B boundary, and
   Book 1 non-retroactivity. Add mutation tests and normal CI wiring. Printed
   template checks must reject internal lane language and website/device
   dependencies without globally banning those terms in internal architecture
   documentation. It must also reject target-absent worked-example
   operations, untaught prerequisite retrieval, mastery/diagnosis/automatic
   routing claims for the brief Start check, new theory in closing review, and
   intervening top-level summary/help stages. Stop rather than weakening checks
   if the aligned contract cannot be expressed deterministically.

   Direct mutation evidence must prove failure when:

   1. one canonical section changes from `##` to `###`;
   2. `## Website-help` is inserted;
   3. printed route copy says to use the website;
   4. printed route copy says to use Part B;
   5. printed route copy requires a laptop or online explanation;
   6. the paper support note is removed;
   7. the summary is moved after section 7;
   8. the summary becomes an eighth top-level heading;
   9. `Voorkennis ophalen` becomes a separate top-level heading;
   10. `Begeleide inoefening` loses optionality or deliberate fading;
   11. the bonus becomes repetitive arithmetic;
   12. closing review introduces new theory; or
   13. Book 1 output is added to checker scope.

   The first twelve are the owner-specified content mutation matrix; the
   thirteenth is the separately required non-retroactivity scope mutation.
5. Refresh maps/indexes/dashboard when required, run focused and full
   validators through the sprint command logger, and inspect the final diff for
   scope and wording. Any change under `4veco-lessen`, Book 1 output,
   protected references, or student-facing generated output is a hard stop.
6. Preserve all earlier review records. Obtain a renewed teacher-learning-
   quality review with a separate evidence-backed judgment for each exact
   owner-required criterion:

   1. paper-only usability;
   2. no-device compatibility;
   3. all required support present in print;
   4. a simple printed route;
   5. backward alignment;
   6. 55-minute feasibility;
   7. same-goal differentiation;
   8. bonus cognitive flexibility;
   9. accessible closing review;
   10. Book 1 continuity;
   11. summary placement; and
   12. absence of student-facing internal architecture terminology.

   After focused/full validation, obtain a renewed
   independent lead review covering headings, summary, student-facing copy,
   checker scope/mutations, current-main integration, CI, and lesson cleanliness.
   A core-spec failure or final verdict other than PASS/PASS WITH FLAGS blocks
   closure.
7. Current `main` integration is mandatory before final review: fetch/prune,
   merge current `origin/main`, resolve conflicts without losing current-main
   improvements or weakening this contract, and record both base and integration
   SHAs. Commit, push the revised PR branch, and verify exact-integration-head
   `platform-ci / validate-platform`.
8. Synchronize the result Markdown/JSON and PR description with the real final
   state. Record current base SHA, final PR head SHA, clean mergeability,
   focused/full test counts, exact CI run, contract-check result, renewed
   teacher/lead verdicts, lesson SHA and clean state, zero Book 1/Book 2 output
   changes, removed printed website/device/internal terminology, deliberate
   pre-exercise summary placement, and the remaining human-authority boundary.
   Remove every stale claim that publication, readiness routing, or exact-head
   CI is pending. Run PR-readiness routing, apply only `MARK_READY`, verify PR
   head equals the reviewed/CI head and `isDraft: false`, and do not merge.

## Acceptance tests

```bash
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-plan.md
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/sprints/check-sprint-bundle.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npx.cmd jest build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js --runInBand
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd test -- --runInBand build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js build-scripts/workflows/check-paragraph-lane-scope.test.js
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd run check:part-a-exercise-authoring-contract
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd run check:paragraph-workflow-wording
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd run check:exercise-workflow-currentness
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd run check:active-governance-wording
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd run check:platform
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node -e "const {execFileSync}=require('child_process'); const out=execFileSync('git',['-C','../4veco-lessen','status','--porcelain'],{encoding:'utf8'}); if(out.trim()){console.error(out);process.exit(1)}"
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- npm.cmd run check:agent-index-freshness
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/ci/check-evidence-line-endings.js
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- git diff --check
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/sprints/check-sprint-command-log.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/sprints/check-lead-review-substance.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/sprints/check-sprint-result.js reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-result.md
node build-scripts/sprints/run-sprint-command.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 -- node build-scripts/sprints/check-sprint-bundle.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1 --complete
```

Repository map/dashboard refresh commands run before their freshness checks:

```bash
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
```

## Proof Required to Close

Closure proof requires:

- a passing independent planning review;
- aligned source diffs across every in-scope active guidance surface;
- focused mutation tests and checker CLI exit-code evidence;
- passing existing workflow wording/currentness/governance checks and full
  platform Jest/CI validation;
- a renewed teacher-learning-quality PASS with an explicit judgment for all
  twelve listed review questions, showing a complete paper-only/no-device route;
- the preserved earlier lead audit plus a renewed lead-review PASS or PASS WITH
  FLAGS on the integrated revision, with no core-spec failure;
- a clean no-lesson-output/no-protected-data diff and shared lane-scope proof;
- whole-repository clean proof for the detached sibling lesson checkout at the
  recorded `f09fd6e88edc5049b026b16b0158e7e188091d2d` baseline;
- current maps/indexes/dashboard and complete sprint-bundle evidence;
- current base SHA, final integration SHA, pushed state, PR URL, clean
  mergeability, non-draft readiness, refreshed description/evidence with every
  required handoff field, and exact-head `platform-ci / validate-platform`
  result.

Proof closes only this authoring-contract sprint. It does not approve a Book 2
paragraph, Book 1 revision, Part B redesign, or merge.

The task may close operationally only at `READY_FOR_HUMAN_REVIEW` after the
cleanly mergeable non-draft PR, synchronized final evidence, and exact-head CI
exist. That state is not human approval. Later owner review governs merge and
Book 2 adoption separately.

## Rollback plan

Revert the guidance edits, checker/test, npm/CI wiring, navigation/index updates,
roadmap row, and sprint evidence as one platform-only PR. No lesson-output or
Book 1 cleanup is needed because those files are forbidden from changing.

## Human review required

Yes. This is governance and instructional-authoring-contract work. The agent
must implement, validate, push, refresh PR #219, and use governed readiness
routing to return a cleanly mergeable non-draft PR for human review. The
contract must remain unmerged and must not be used to produce the first Book 2
paragraph until the repository owner reviews and approves the final payload.

## Lead Review Required

Lead review schema version 3 is required. Teacher-learning-quality review is a
mandatory specialist input because this sprint changes future instructional
design. Rendered visual, accessibility, and student-experience reviews are not
applicable because no student-facing artifact is produced.

## Stop Conditions

Stop and report if:

- the branch/worktree ownership or base state is unsafe;
- another task is changing the same active guidance surfaces;
- the planning reviewer finds an unresolved core-spec omission;
- implementation would require editing `4veco-lessen`, Book 1, a Book 2
  paragraph, protected references, source data, or target registries;
- the checker would retroactively validate lesson output or require schema
  migration outside this contract;
- required validators, teacher review, or lead-review round 2 fail after
  reasonable in-scope corrections;
- remote publication or exact-head CI cannot be established;
- the requested readiness state would require merge or broader product authority.

## Next Authorized Work After Closure

After later human approval and merge of this contract, create a separate governed
task to build the first Book 2 paragraph under the approved rules. Keep broader
paragraph-process redesign, cross-surface Part A/Part B comparison, internal
schema-role migration, and every Book 1 revision as separately authorized
follow-ups.
