# Sprint GAME-ARCH-2: Integrated Practice Engine Architecture Plan

Date: 2026-05-31

Status: planned from `GAME-ARCH-1` decision and user direction.

## Goal

Produce the canonical integrated practice-engine architecture plan for the
student route and practice system.

This sprint must turn the `GAME-ARCH-1` keep/refactor/rebuild decision into a
file-level and API-level plan for:

- the shared student route layer;
- the shared task-type shell;
- graph/table practice;
- math/calculation practice;
- reasoning practice;
- advisory short checks;
- target-equivalent checkpoint composition;
- procedure support;
- landing-page route integration;
- CSS, focus, feedback, and state ownership;
- per-paragraph data builders.

The plan must preserve the product distinction the user clarified:

```text
short check = advisory local route check
exit ticket = separate target-equivalent proof task
```

The short check should remain available as a useful in-between student surface
that gives non-binding advice about practice, proceeding to the exit ticket,
or continuing while revisiting a weak skill later. It must not become a grade,
diagnostic classification, automatic sequence decision, mastery claim,
summative judgement, or substitute for the target-equivalent exit ticket.

This sprint must not implement engine refactors, regenerate or hand-patch
generated lesson output, create exit-ticket source data, write target-exercise
fields, mutate protected references, create or write answer-skill candidate
storage, authorize target-equivalent completion language, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Context

`GAME-ARCH-1` closed after lead-review round 2 with the following decision:

- keep and harden the shared skill-map / route layer;
- keep the shared task shell as core architecture;
- keep/refactor graph/table practice as the reference pattern;
- refactor math/calculation around target-exercise operation chains;
- refactor reasoning around answer-form and constructed-response standards;
- keep the short check as an advisory local checkpoint;
- keep the target-equivalent exit ticket separate as a later thorough proof
  task;
- rebuild or remove duplicate engine-specific UI/state/feedback paths only
  through later governed work when they cannot consume the shared route and
  task shell cleanly.

The user has now confirmed the correct next move is `GAME-ARCH-2`, provided it
is a strict architecture-planning sprint and not another vague architecture
memo. The required output is a concrete plan that the next implementer can
execute without guessing where the shared route, task shell, state, feedback,
and domain boundaries live.

Current evidence from SKILLMAP-OP-1, GRAPH-UX-2, MATH-UX-2, REASON-UX-2, and
GAME-ARCH-1 shows real UI progress. The shared route is visible, the task
shell is used by graph/math/reasoning routes, and graph/table practice is the
strongest reference pattern. The remaining risk is a new round of local engine
patches that duplicate UI, state, feedback, or route logic instead of using one
operational spine.

## Quality Standard

The quality floor is a plan that is concrete at file level, API level, and
proof level. It must satisfy the product specification by making the unified
student route operationally designable: a student should see the route,
practice through the correct task interface, receive useful neutral feedback,
and understand the next action. Architecture progress remains insufficient
unless it can be checked against rendered output by `GATE-ENGINE-1`.

Proof must include a canonical architecture map, route-layer API, task-shell
API, module boundary plan, file-level keep/wrap/deprecate/rebuild inventory,
state ownership rules, feedback ownership rules, target-operation coverage
model, advisory short-check versus target-equivalent exit-ticket boundary, and
the `GATE-ENGINE-1` live-output checklist. The plan must name follow-up work
for implementation, refactor, rebuild, or gate review without authorizing that
work inside this sprint.

The review gate that will judge student-facing quality is `GATE-ENGINE-1`.
This sprint must prepare that gate with a concrete evidence checklist, but it
must not claim that the gate has passed.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| One visible route layer must guide the student across practice/check surfaces | Define a canonical route-layer API for paragraph target, relevant skill subset, recommended action, local progress language, practice link, and target-operation chain linkage | `GAME-ARCH-2-route-api.md` names fields, owners, consumers, prohibited claims, and implementation handoff | planned |
| One shared task shell must be the default interaction model where task families overlap | Define a canonical task-shell API for task type, prompt, source/table/graph payload, input model, validation model, feedback, retry/self-check, focus, result state, and next action | `GAME-ARCH-2-task-shell-api.md` names production-ready versus fixture-only families and exception rules | planned |
| Domain modules must be thin where shared UI/state/feedback already exists | Classify graph, math, reasoning, checkpoint, procedure, landing, CSS/focus, feedback, and data-builder files as keep/wrap/deprecate/rebuild | `GAME-ARCH-2-file-disposition.md` gives file-level decisions, rationale, owner, and follow-up sprint route | planned |
| State must not drift across engines | Define ownership for local progress, attempt state, route recommendations, task completion, feedback state, checkpoint result, and future target-equivalent status | `GAME-ARCH-2-state-ownership.md` names owner layer, persistence rule, permitted copy, and prohibited inference | planned |
| Feedback must not fork into four unrelated systems | Define task-shell, domain-module, wrapper, data-file, and future answer-model feedback ownership | `GAME-ARCH-2-feedback-ownership.md` names what each layer may generate and what must remain neutral/local | planned |
| Target-operation coverage must drive practice and checkpoint composition | Model `1.1.1`, `1.1.2`, and `1.1.3` by target-operation need and task-family coverage | `GAME-ARCH-2-target-operation-coverage.md` distinguishes practice coverage, fixture-only proof, advisory short check, and missing target-equivalent proof | planned |
| Short checks and target-equivalent exit tickets must remain separate | Define advisory-check module boundaries and target-equivalent checkpoint module boundaries | Architecture map and state/feedback records preserve advisory short checks without weakening the exit-ticket standard | planned |
| GATE-ENGINE-1 must review live rendered output, not contracts only | Convert the architecture into a gate checklist for route visibility, task-shell use, coverage, feedback, next action, prohibited claims, and keep/refactor/rebuild decisions | `GAME-ARCH-2-gate-engine1-checklist.md` names live-output evidence and stop conditions | planned |
| Product boundaries remain intact | Avoid implementation, generated output, source-data writes, protected references, target-exercise writes, candidate storage, and product claims | Sprint bundle, evidence checker, protected-surface diff check, scope-language check, and lead review confirm boundaries | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add a file-level keep/wrap/deprecate/rebuild inventory | `include_now` | The user explicitly asked for concrete file-level decisions, not broad component labels. |
| Add route-layer and task-shell API drafts | `include_now` | Future engine work needs one route contract and one task interaction contract. |
| Add state and feedback ownership rules | `include_now` | State and feedback drift is the central architecture risk after recent UI integration. |
| Add advisory-check and target-equivalent checkpoint module boundaries | `include_now` | The short check should remain useful without weakening the separate exit-ticket proof standard. |
| Add `GATE-ENGINE-1` live-output checklist | `include_now` | The next human gate must inspect rendered output and not rely on architecture-only proof. |
| Implement or refactor engine source files | `defer_named_follow_up` | Later implementation sprints must own code changes after the architecture plan and gate review. |
| Publish or create target-equivalent exit-ticket source/pages | `defer_named_follow_up` | `L1.7B-Q2` and `GATE-L1.7B-Q2` own target-equivalent implementation and completion-language approval. |
| Use short-check advice as diagnostics, mastery, proof, sequencing, or summative judgement | `reject_scope_creep` | Advisory checks are local and non-binding; target-equivalent proof remains a separate surface. |
| Mutate protected references, target-exercise mappings, candidate storage, or generated lesson output | `reject_scope_creep` | Those surfaces require separate governed sprints or gates. |

## Allowed paths

- `reports/sprints/GAME-ARCH-2-*`
- `references/data/sprints/GAME-ARCH-2.plan.json`
- `references/data/sprints/GAME-ARCH-2.result.json`
- `build-scripts/sprints/check-game-arch2-evidence.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `../4veco-lessen/lessen-team-roadmap.md`
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/GAME-ARCH-2/`
- generated repository maps, URL indexes, internal dashboard data, source
  registries, and document inventories required for remote reviewer navigation

Read-only inputs may include engine source files, build scripts, source-data
manifests, generated Book 1 output, product specifications, roadmap records,
recent sprint result reports, recent lead-review reports, route-output
checkers, target-exercise records, and screenshot-backed evidence.

## Forbidden paths

- hand edits to generated Book 1 HTML, CSS, JS, or data files
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/book-*/exit-ticket/*.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- engine implementation rewrites or refactors
- new generated lesson output, unless a reviewer explicitly requires
  stop-and-replan before any such work
- target-equivalent checkpoint publication or paragraph-completion copy
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `reports/sprints/GAME-ARCH-1-result.md`
- `reports/sprints/GAME-ARCH-1-component-decision-matrix.md`
- `reports/sprints/GAME-ARCH-1-canonical-ui-model.md`
- `reports/sprints/GAME-ARCH-1-short-check-exit-ticket-boundary.md`
- `reports/sprints/GAME-ARCH-1-architecture-decision.md`
- `reports/sprints/GRAPH-UX-2-result.md`
- `reports/sprints/MATH-UX-2-result.md`
- `reports/sprints/REASON-UX-2-result.md`
- `reports/sprints/SKILLMAP-OP-1-result.md`
- `reports/sprints/*-lead-review-round2.md` for recent engine sprints
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `engines/skill-map-route-ui.js`
- `engines/skill-map-route.css`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/graphical-engine.js`
- `engines/graphical-ui.js`
- `engines/graphical.css`
- `engines/skilltree-engine.js`
- `engines/skilltree-ui.js`
- `engines/skilltree.css`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/exit-ticket.css`
- `engines/procedure-engine.js`
- `engines/procedure-ui.js`
- `engines/procedure.css`
- `build-scripts/platform/build-landing-page.js`
- `build-scripts/platform/build-graphical-shells.js`
- `build-scripts/platform/build-skilltree-shells.js`
- `build-scripts/platform/build-reasoning-engine.js`
- `build-scripts/platform/build-exit-ticket-shells.js`
- `build-scripts/platform/build-procedure-shells.js`
- `build-scripts/content/book-1/b1-112-graphical-data.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- `build-scripts/content/book-1/b1-111-procedure-data.js`
- `source-data/book-1/reasoning/1.1.1.csv`
- `source-data/book-1/reasoning/1.1.2.csv`
- generated Book 1 output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` as read-only
  inspection evidence

## Outputs

- `reports/sprints/GAME-ARCH-2-plan.md`
- `reports/sprints/GAME-ARCH-2-baseline.md`
- `reports/sprints/GAME-ARCH-2-planning-review.md`
- `reports/sprints/GAME-ARCH-2-architecture-map.md`
- `reports/sprints/GAME-ARCH-2-route-api.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/GAME-ARCH-2-module-boundaries.md`
- `reports/sprints/GAME-ARCH-2-file-disposition.md`
- `reports/sprints/GAME-ARCH-2-state-ownership.md`
- `reports/sprints/GAME-ARCH-2-feedback-ownership.md`
- `reports/sprints/GAME-ARCH-2-target-operation-coverage.md`
- `reports/sprints/GAME-ARCH-2-gate-engine1-checklist.md`
- `reports/sprints/GAME-ARCH-2-lead-review-assignment.md`
- `reports/sprints/GAME-ARCH-2-lead-review-round1.md`
- `reports/sprints/GAME-ARCH-2-lead-review-corrections.md`
- `reports/sprints/GAME-ARCH-2-lead-review-round2.md`
- `reports/sprints/GAME-ARCH-2-result.md`
- `reports/sprints/GAME-ARCH-2-diff-summary.md`
- `references/data/sprints/GAME-ARCH-2.plan.json`
- `references/data/sprints/GAME-ARCH-2.result.json`
- `build-scripts/sprints/check-game-arch2-evidence.js`
- updated platform and lesson roadmaps marking `GAME-ARCH-2` closure and
  preserving `GATE-ENGINE-1`, `L1.7B-Q2`, `GATE-L1.7B-Q2`, `REV-STD-1`, and
  Scale Gate 1 blocks
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/GAME-ARCH-2/`

## Operationalized sprint procedure

1. Record baseline evidence: roadmap authority, product-specification
   requirements, `GAME-ARCH-1` decision, current graph/math/reasoning
   integration state, short-check boundary, target-equivalent exit-ticket
   boundary, generated-output boundary, and protected reference status. Stop if
   the plan would require engine implementation, generated output, source-data
   writes, target-exercise field writes, or protected reference mutation.
2. Ask the planning/review subagent to inspect the plan, baseline, outputs,
   stop conditions, generated-output statement, file-level evidence
   requirements, and acceptance tests before execution. Fix the plan before
   continuing if the reviewer finds a core gap.
3. Inspect read-only engine and builder files to identify current route,
   shell, wrapper, state, feedback, focus, and data-builder boundaries. Do not
   edit engine source files.
4. Write the architecture map from landing page to shared route panel,
   graph/math/reasoning/checkpoint surfaces, task shell, feedback, and next
   action. The map must show shared versus domain-specific responsibilities.
5. Define the route-layer API and task-shell API. Name required fields,
   consumers, state events, focus expectations, next-action rules, prohibited
   claims, and extension policy.
6. Define domain-module boundaries for graph/table, math/calculation,
   reasoning, advisory short check, target-equivalent checkpoint composition,
   procedure support, landing integration, CSS/focus, and per-paragraph data
   builders.
7. Produce the file-level keep/wrap/deprecate/rebuild inventory. Stop if a
   file cannot be classified with a concrete rationale and follow-up owner.
8. Define state ownership and feedback ownership rules. Stop if any rule lets
   the short check imply target-equivalent proof, diagnostics, mastery,
   automatic sequencing, summative status, or student-facing AI decisions.
9. Produce the target-operation coverage model for `1.1.1`, `1.1.2`, and
   `1.1.3`, clearly distinguishing practice evidence, checkpoint-only
   fixture evidence, advisory-check advice, and missing target-equivalent
   proof.
10. Write the `GATE-ENGINE-1` checklist for live rendered output. It must name
    required evidence, stop conditions, and the keep/refactor/rebuild/hold
    decisions the gate must make.
11. Add a deterministic evidence checker for GAME-ARCH-2 artifacts and run
    the planned validator stack. Stop if the checker cannot detect missing
    architecture map, API plan, file disposition, state/feedback ownership,
    coverage model, gate checklist, or prohibited authority language.
12. Run the structural lead-review cycle with assignment, round-1 review,
    correction log, and round-2 recheck. Stop if lead review returns REVISE,
    FAIL, or PAUSE on file-level concreteness, route/task API clarity,
    short-check boundary, target-equivalent boundary, gate checklist, or
    product authority.
13. Update result records, diff summary, lesson archive, roadmaps, and
    generated indexes. Run validators and stop if sprint-bundle, evidence,
    scope-language, protected-surface, roadmap, lead-review, or diff checks
    fail.
14. Fetch, reconcile, commit, and push both repositories if both contain
    changes. If either repository is behind or diverged, stop and report the
    required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-ARCH-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js GAME-ARCH-2
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-game-arch2-evidence.js
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/GAME-ARCH-2-result.md
node build-scripts/sprints/check-sprint-bundle.js GAME-ARCH-2 --complete
rg -n "GAME-ARCH-2|GATE-ENGINE-1|route-layer API|task-shell API|keep|wrap|deprecate|rebuild|short check|target-equivalent exit ticket" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure requires proof that GAME-ARCH-2 gives the next
implementer a concrete file-level and API-level plan, not a source-only memo.
Required closure evidence:

- architecture map from landing page to shared route, domain surface, task
  shell, feedback, and next action;
- route-layer API with fields, consumers, state events, and prohibited claims;
- task-shell API with task families, payloads, validation, feedback,
  retry/self-check, focus, result state, and next action;
- module-boundary record for graph/table, math/calculation, reasoning,
  advisory short check, target-equivalent checkpoint composition, procedure
  support, landing integration, CSS/focus, feedback, and data builders;
- file-level keep/wrap/deprecate/rebuild inventory with rationale, owner, and
  follow-up route;
- state ownership rules for local progress, attempt state, route
  recommendations, task completion, feedback state, checkpoint result, and
  future target-equivalent status;
- feedback ownership rules for task shell, domain modules, wrappers, data
  files, and future answer-model/operation-chain layer;
- target-operation coverage model for `1.1.1`, `1.1.2`, and `1.1.3`;
- `GATE-ENGINE-1` live-output checklist;
- deterministic evidence checker output;
- lead-review assignment, round-1 review, correction log, and round-2 recheck;
- result metadata and diff summary;
- validation commands above passing or explicitly recorded as
  `skipped_with_reason` only where a command is not applicable to this
  no-implementation architecture sprint.

## Rollback plan

If GAME-ARCH-2 must be reverted, revert the GAME-ARCH-2 sprint records,
evidence checker, roadmap/version-index changes, result metadata, lesson
archive records, and generated maps/indexes produced for this sprint.

Do not hand-edit generated lesson output, protected references,
target-exercise mappings, source exit-ticket data, or answer-skill candidate
storage as part of rollback.

## Human review required

No human-review gate is required to close this architecture-planning sprint.
Lead review is required before closure.

`GATE-ENGINE-1` remains the later human-review gate before engine scale,
controlled production reliance, target-equivalent checkpoint reliance, or
Scale Gate 1.
