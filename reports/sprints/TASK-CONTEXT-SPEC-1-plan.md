# Sprint TASK-CONTEXT-SPEC-1: Shared Task Context Contract

Generated: 2026-06-03

## Goal

Define the shared task-shell context schema and authoring/interchange contract
that later runtime, source reconstruction, and task-ingestion sprints must use.

This sprint specifies validated `contextBlocks` and task `contextRefs` for
markdown, source excerpt, semantic table, reconstructed SVG/figure, graph,
flowchart, formula, and info/context blocks. It proves the schema with a
contract JSON and deterministic checker, including negative fixtures for
missing alt text, missing refs, unreferenced source blocks, answer-hint
leakage, raw copied images where reconstruction is required, inconsistent
captions, and internal-code exposure.

It does not implement context rendering, source reconstruction, actual exam
task transformation, generated lesson output, protected reference mutation,
source-data mutation, product-route adoption, target-equivalent proof,
diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate 1, or
student/product use.

## Context

`EXAM-SOURCE-AUTH-1` closed first and established the external-primary
authority contract for `vw-1022-a-25-1-o:opgave-1:question-3`. The next
roadmap step is a schema contract so later runtime and reconstruction work can
share the same context-block shape instead of inventing per-surface payloads.

Existing shared task-shell families already support source-value selection and
source-chain construction. They do not yet define a first-class context layer
above task lists. This sprint fills that contract gap only.

## Quality Standard

The quality floor is a specification-accurate context contract: every task that
depends on source/context material must reference stable `contextBlocks`, every
source block must be reachable through `contextRefs`, every visual or structured
block must carry a caption/source label and accessible text, and student-facing
text must not leak answers or internal implementation codes.

Rendered output is intentionally unchanged in this sprint, and proof is limited
to contract fixtures, checker output, command logs, and lead review.

Passing tests is not enough if the contract still permits raw copied images,
unreferenced source blocks, inconsistent captions, missing alt text, or hidden
answer hints. The sprint must fulfil the roadmap specification, prove rendered
output and student-facing output are unchanged, protect `references/external/`
and `references/machine/`, and name runtime/reconstruction/transformation work
as follow-up rather than silently doing it here.

The review gate is structural lead review before closure. Human review is not
required because this is a contract/validator sprint; the later repair gate
remains the human-review surface.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Define authoring/interchange model for context-first shared tasks. | `reports/json/task-context-spec1-contract.json` defines `contextBundle`, `contextBlocks`, task `contextRefs`, and allowed block types. | Custom checker and lead review inspect schema and fixture coverage. | planned |
| Support required context block types. | Contract defines markdown, source excerpt, semantic table, reconstructed SVG/figure, graph, flowchart, formula, and info/context blocks. | Checker requires every block type in the positive fixture. | planned |
| Require contextRefs and stable IDs. | Contract requires tasks to cite `contextRefs`; checker rejects missing refs and refs to unknown blocks. | Negative fixtures for missing and unknown refs. | planned |
| Prevent unreferenced source/context blocks. | Checker rejects blocks that no task references unless marked `allowUnreferencedForReviewOnly: true`. | Negative fixture for unreferenced source block. | planned |
| Require accessibility and captions. | Contract requires `altText` or `accessibilitySummary`, source labels, and captions for table/visual/formula/source blocks. | Negative fixtures for missing alt text and inconsistent captions. | planned |
| Prevent answer-hint leakage and internal-code exposure. | Checker scans student-facing context/task text for answer-leak fields/phrases and internal codes such as MTU/PV/A15. | Negative fixtures for leaked answer and internal-code exposure. | planned |
| Reject raw copied images where reconstruction is required. | Contract allows reconstructed SVG/figure blocks with reconstruction metadata and rejects raw image dependency. | Negative fixture for raw copied image block. | planned |
| Preserve boundaries: no runtime, reconstruction, generated output, or protected data mutation. | Diff summary and git status show only contract/checker/sprint artifacts and roadmap/index closure files changed. | `git diff --check`, lead review, and complete bundle check. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Include one positive fixture covering all block types. | include_now | The contract needs proof that all required context surfaces can coexist in one bundle. |
| Include negative fixtures for every roadmap rejection category. | include_now | The sprint is only useful if it rejects weak context evidence. |
| Implement context rendering in `task-shell-ui.js`. | reject_scope_creep | Runtime rendering belongs to `TASK-CONTEXT-RUNTIME-1`. |
| Reconstruct the Zoohee table or any official figure. | reject_scope_creep | Reconstruction belongs to `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`. |
| Create reusable runtime validation library in `engines/`. | defer_named_follow_up | This sprint can use a deterministic sprint checker; runtime validation can be extracted when rendering is implemented. |

## Allowed paths

Allowed implementation and evidence paths:

- `build-scripts/sprints/check-task-context-spec1.js`
- `reports/json/task-context-spec1-contract.json`
- `reports/sprints/TASK-CONTEXT-SPEC-1-*`
- `references/data/sprints/TASK-CONTEXT-SPEC-1.plan.json`
- `references/data/sprints/TASK-CONTEXT-SPEC-1.result.json`

Allowed read-only inputs:

- `reports/json/exam-source-authority1-contract.json`
- `reports/sprints/EXAM-SOURCE-AUTH-1-source-authority.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/sprints/TASK-FAMILY-SOURCE-1-result.md`

Allowed closure/index paths:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/outdated/reference-team-roadmap-*.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `AGENT_GITHUB_ENTRY.md`
- `reports/url-index.md`
- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `reports/internal-dashboard/*`

## Forbidden paths

Forbidden paths and surfaces:

- `references/machine/`
- `references/external/`
- `source-data/`
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- `../4veco-lessen/Boek*/`
- task-shell runtime files such as `engines/task-shell-engine.js`, `engines/task-shell-ui.js`, and `engines/task-shell.css`
- target-exercise registry records
- candidate-storage files
- PV projection or PV machine-promotion outputs

No protected reference mutation, machine reference mutation, external-source
mutation, unit minting, unit update, unit split, unit deprecation, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or student/product use is authorized.

## Inputs

Required inputs:

- `AGENTS.md`
- `../CLAUDE.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/EXAM-SOURCE-AUTH-1-result.md`
- `references/data/sprints/EXAM-SOURCE-AUTH-1.result.json`
- `reports/json/exam-source-authority1-contract.json`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- prior task-family source/construct contracts

## Outputs

Required generated output statement:

- no student-facing or generated lesson output is generated or changed by this
  sprint.

Required contract outputs:

- `reports/json/task-context-spec1-contract.json` with block-type schema,
  positive fixture, and negative fixture inventory;
- `reports/sprints/TASK-CONTEXT-SPEC-1-context-contract.md` explaining the
  authoring/interchange model and boundaries;
- `build-scripts/sprints/check-task-context-spec1.js` validating positive and
  negative fixtures;
- sprint planning review record;
- sprint result markdown and JSON;
- sprint diff summary;
- structural lead-review assignment, round 1, correction log, and round 2;
- refreshed repository maps/index/dashboard artifacts at closure if roadmap
  state changes.

## Operationalized sprint procedure

1. Validate this plan, baseline, and plan JSON with wrapped sprint-plan and
   planned bundle checks. Stop if the plan does not pass.
2. Ask the planning/review subagent to inspect the plan against the roadmap,
   prior source-authority contract, and task-shell family contracts. Stop and
   revise if it finds runtime/reconstruction scope creep.
3. Create the context contract JSON and markdown report. Keep the positive
   fixture representative but explicitly non-rendered.
4. Implement `check-task-context-spec1.js` with positive validation and
   negative fixtures for missing alt text, missing refs, unknown refs,
   unreferenced blocks, answer leakage, raw copied images, inconsistent
   captions, and internal-code exposure.
5. Run wrapped acceptance commands and record command-log evidence.
6. Assign structural lead review, record round 1, apply any corrections and
   correction log, then record round 2. Do not close if round 2 is not PASS or
   PASS WITH FLAGS.
7. Close the roadmap row only after validation and lead review pass. Refresh
   maps/index/dashboard if roadmap state changes.
8. Create result markdown, result JSON, and diff summary. Run final wrapped
   validation, `git diff --check`, fetch/prune, resolve any behind/diverged
   state, commit, push, and report commit hash and push status.

## Acceptance tests

All acceptance commands must be run through
`build-scripts/sprints/run-sprint-command.js TASK-CONTEXT-SPEC-1 --`.

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-CONTEXT-SPEC-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-SPEC-1
node build-scripts/sprints/check-task-context-spec1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-lead-review-substance.js TASK-CONTEXT-SPEC-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-CONTEXT-SPEC-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-SPEC-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close this sprint must include:

- command-log evidence for all passed acceptance tests listed in result JSON;
- custom checker output proving schema positive fixture and all negative
  rejection categories;
- validator/test evidence from sprint, roadmap, platform, index, and diff
  checks;
- lead-review assignment, round 1, correction log, and round 2;
- diff summary proving no generated lesson output, runtime implementation,
  source-data, or protected reference changes.

## Rollback plan

If the contract is wrong, revert only this sprint's contract report, checker,
sprint artifacts, result JSON, roadmap closure row, and refreshed indexes. Do
not modify `references/machine/`, `references/external/`, source data, runtime
files, or generated lesson output during rollback.

## Human review required

Human review is not required for this context-contract sprint. The required
review gate is structural lead review before sprint closure. The later
`GATE-SHARED-TASK-INGEST-REPAIR-1` remains the human-review gate for playable
source-context ingestion proof.
