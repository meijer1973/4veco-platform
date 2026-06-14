# INSPECT-9A Sprint Plan

Status: planning review pending
Date: 2026-06-11
Sprint: `INSPECT-9A`
Branch: `codex/inspect-9a-chapter-12-target-exam-remediation-20260611`
Platform worktree: `C:\wt\INSPECT-9A-20260611\4veco-platform`
Lesson evidence checkout: `C:\wt\INSPECT-9A-20260611\4veco-lessen`

## Mission

Close or explicitly defer the Chapter 1.2 source-evidence prerequisites named
by INSPECT-9 before any Dutch evidence-pack generator implementation starts.

The sprint is Dutch-only and product-evidence-side only. It may remediate the
authored target-exercise registry for Book 1 Chapter 1.2 after planning review
passes, but it must not mutate generated lesson output.

## Baseline

Start point:

```text
INSPECT-9 closure commit c8a17b4a97e2f688ae085fea8192b49c217314ee
Lesson evidence commit b858bca602bb7afdf75cad7c3ecc1a79b31fbb76
```

Required read evidence:

```text
AGENTS.md
CLAUDE.md
C:\Projects\4veco\CLAUDE.md
../4veco-lessen/specifications/product-vision.md
../4veco-lessen/specifications/product-end-state.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/quality-standards/quality-standards-end-state.md
reports/inspection-standards/dutch-evidence-gap-closure-plan.md
reports/inspection-standards/dutch-evidence-gap-closure-plan.json
archive/sprints/INSPECT-9/INSPECT-9-closure-log.md
reports/inspection-standards/dutch-evidence-scale-readiness.md
reports/inspection-standards/dutch-evidence-scale-readiness.json
references/authored/course-target-exercises.json
references/authored/README.md
references/external/syllabus-eindtermen.json
references/external/exam-questions.json
references/data/alignment-graph.json
references/machine/micro-teaching-units.json
references/data/sprints/CP.6b-target-exercise-review.json
../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/
```

Safety preflight already run:

```text
npm.cmd run check:agent-worktree-safety -- --claim --task INSPECT-9A-20260611 --agent codex --require-prefix codex/,agent/ --require-clean
```

Result: pass; lock owner `codex`, task `INSPECT-9A-20260611`.

## Quality Floor

INSPECT-9A is successful only if it records source-evidence decisions that are
traceable, conservative, and safe to use later.

Minimum quality floor:

1. Each Chapter 1.2 target decision must cite the exact target exercise,
   generated lesson evidence, quality-ref/review evidence, and official
   syllabus or exam-question evidence used.
2. Each exam-code decision must be one of:
   - `link`;
   - `remove`;
   - `no-code-with-rationale`;
   - `defer`.
3. Each target-record status transition must cite a review artifact and name
   what remains outside the transition.
4. `1.2.4` may move out of placeholder state only if the registry target is
   based on existing generated consolidation evidence, not newly invented
   lesson output.
5. Chapter 1.1 control scope must receive a decision, even if the decision is
   to keep it as control-only and defer remediation.
6. Weak, deferred, local, stale, or school-owned evidence must remain visible.
7. No pack-readiness, compliance, approval, school implementation, PTA,
   summative, OP0 completion, or school-SKA claim may be introduced.

## Product-Vision Fit

Vision pillar strengthened:

```text
Exercise-first and exam-grounded architecture.
Agent-scalable production system.
```

Advantage/parity posture:

- Advantage: target exercises and official-source links become more reliable
  evidence anchors for later Dutch quality-control work.
- Parity: safe source-record hygiene prevents later reports from overstating
  weak or migrated evidence.

Student-visible improvement in this sprint:

```text
None directly. This sprint does not regenerate or edit lesson output.
```

Agent-reliability improvement:

```text
Future agents can see which Chapter 1.2 target/exam-code decisions are closed,
which are deferred, and which proof gaps still block INSPECT-10.
```

## Scope

Allowed implementation after planning review passes:

- create INSPECT-9A remediation report:
  - `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md`
  - `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json`
- update `references/authored/course-target-exercises.json` only for:
  - `1.2.1`
  - `1.2.2`
  - `1.2.3`
  - `1.2.4`
- update only these target-record fields if the remediation report proves the
  exact field-level need:
  - `target_exercise`
  - `lesson_goals`
  - `required_skills`
  - `prior_knowledge_assumed`
  - `new_skills_introduced`
  - `missing_units_flagged`
  - `exam_codes`
  - `difficulty_notes`
  - `record_status`
  - `placeholder_reason`
  - `v5_migration`
  - a new `review_evidence` pointer object
- for `1.2.1` through `1.2.3`, prefer the narrower set `exam_codes`,
  `record_status`, `v5_migration`, and `review_evidence` unless the
  remediation report proves another field is required;
- for `1.2.4`, target exercise and skill/goal fields may change only because
  the current record is a placeholder and the replacement must be based on
  existing generated consolidation evidence;
- create sprint records under `archive/sprints/INSPECT-9A/`;
- update roadmap, ledger, and end-state docs to record INSPECT-9A status and
  next action;
- refresh repository maps/indexes and internal dashboard as repository-index
  surfaces only.

Forbidden:

- evidence-pack generation;
- report-only generator implementation;
- package scripts;
- CI/build gates;
- dashboard gates;
- quality-ref integration;
- Scale Gate integration;
- source mutation outside the four named Chapter 1.2 target records;
- generated lesson-output mutation in `../4veco-lessen`;
- personal-data processing;
- non-Dutch standards work;
- legal compliance, inspectorate approval, inspection-ready, complete OP0,
  school-obligation, PTA-validity, summative-validity,
  classroom-implementation, or school-SKA claims.

## Proposed Target Decisions For Review

These are proposed implementation decisions. The main agent must not apply
them until planning review passes.

| Paragraph | Proposed target-record outcome | Proposed exam-code outcome | Carried limits |
|---|---|---|---|
| `1.2.1 Individuele vraag` | Promote existing doeloefening-aligned target record to reviewed final. | Link `D1.1`, `D1.2`; do not link `D3.1` to the target exercise because consumer-surplus work appears in lesson/practice evidence but not in the current registry target exercise. | Graph-heavy and target-equivalent proof still not closed. |
| `1.2.2 Vraagfactoren` | Promote existing doeloefening-aligned target record to reviewed final with local generated-output flags carried in the report. | Confirm `D1.9`; add `D1.4b`; defer any broader `D1.4a` or `A2.15` registry link unless operation comparison proves it. | Generated lesson review flags about answer wording remain lesson-output issues, not registry closure blockers. |
| `1.2.3 Van individuele naar collectieve vraag` | Promote existing doeloefening-aligned target record to reviewed final. | Keep `A2.9`; add `D1.3`; defer broader A-domain additions unless later official-operation evidence requires them. | Missing-unit flags for horizontal aggregation remain visible for MTU/backfill work. |
| `1.2.4 Gemengde opgaven: vraag` | Replace placeholder with an integration target based on the existing generated consolidation opgaven and review evidence; mark as reviewed final only for source-registry integration target, not pack readiness. | Link `D1.1`, `D1.2`, `D1.3`, `D1.4b`, `D1.9`, and `A2.9` if operation comparison supports each; defer any ambiguous `D1.4a` claim. | Local frozen-yoghurt wording flag and orphaned-asset note remain visible; no generated lesson files are changed. |
| Chapter 1.1 control scope | Keep as control-only. | No Chapter 1.1 registry mutation in this sprint. | Stronger re-use still requires a separate remediation sprint. |

## Implementation Procedure

1. Create planning review packet and obtain planning review.
2. If planning review passes, create the remediation report JSON/Markdown with:
   - evidence checkout metadata;
   - per-paragraph operation-chain review;
   - per-code official-source comparison;
   - registry mutation plan and actual diff summary;
   - no-pack/no-generator safe-use note;
   - quality log using roadmap-required fields.
3. Apply the bounded registry updates in
   `references/authored/course-target-exercises.json`.
4. Verify that only the four named Chapter 1.2 target records changed in the
   registry, and that only approved fields changed in each record.
5. Create validation log.
6. Run required validators.
7. Create lead-review assignment and get lead review before closure.
8. Apply any corrections, rerun validation, refresh maps, and create closure
   log.
9. Run `git fetch --prune origin`, resolve any unexpected behind/diverged
   state, then commit, push, and report branch, worktree, lock owner, commit
   SHA, remote status, PR status, and CI status if available.

## Required Output Shape

Sprint records:

```text
archive/sprints/INSPECT-9A/INSPECT-9A-sprint-plan.md
archive/sprints/INSPECT-9A/INSPECT-9A-planning-review.md
archive/sprints/INSPECT-9A/INSPECT-9A-validation-log.md
archive/sprints/INSPECT-9A/INSPECT-9A-lead-review-assignment.md
archive/sprints/INSPECT-9A/INSPECT-9A-lead-review-round1.md
archive/sprints/INSPECT-9A/INSPECT-9A-correction-log.md
archive/sprints/INSPECT-9A/INSPECT-9A-closure-log.md
```

Primary outputs:

```text
reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md
reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json
```

Possible source update:

```text
references/authored/course-target-exercises.json
```

Governance/index updates:

```text
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/quality-standards/quality-standards-end-state.md
reports/github-agent-index-platform.md
reports/github-agent-index-platform.json
reports/github-agent-index-lessen.md
reports/github-agent-index-lessen.json
reports/internal-dashboard/index.html
reports/internal-dashboard/dashboard-data.json
reports/url-index.md
```

## Validation Plan

Minimum validation before closure:

```text
npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-9A-20260611 --agent codex --require-prefix codex/,agent/
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/references/check-target-exercise-flags.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
npm.cmd run dashboard:internal
git diff --check
git -C ../4veco-lessen status --short --branch
git -C ../4veco-lessen diff --name-only
```

Additional targeted checks:

- JSON parse for the remediation report;
- schema-shape check that every quality-log item includes:
  `title`, `quality_category`, `evidence_path_or_url`, `affected_surface`,
  `severity`, `next_action`, `platform_handoff_required`,
  `proof_required_to_close`;
- registry-diff check that only `1.2.1` through `1.2.4` changed in
  `references/authored/course-target-exercises.json`;
- field-level registry-diff check that only approved fields changed in those
  records;
- forbidden-positive-claim scan over the INSPECT-9A packet.

If `node build-scripts/references/check-target-exercise-flags.js` updates
triage reports, stage and include those generated report updates only if they
are caused by the approved registry changes.

## Review Plan

Planning review must check:

- whether the proposed registry mutations are in INSPECT-9A scope;
- whether the exam-code decisions are conservative and source-backed;
- whether `1.2.4` can use existing generated consolidation evidence without
  mutating lesson output;
- whether the `D3.1`, `D1.4a`, `A2.15`, and Chapter 1.1 decisions are safely
  carried or deferred;
- whether the validation plan catches source drift and unsafe claims.

Lead review must check after implementation:

- required files exist;
- registry mutation matches the plan;
- quality log is complete;
- deferred evidence remains visible;
- no forbidden integration or claim slipped in;
- lesson checkout is still clean.

No three-reviewer external gate is required if the sprint stays within this
source-record remediation/report scope. If the sprint begins preparing
evidence packs, generator work, teacher/school-facing summaries, public
claims, dashboard/report surfaces beyond the named remediation report,
quality-ref/Scale Gate integration, or generated-output changes, stop and
require the applicable gate.

## Stop Conditions

Stop before implementation if:

- planning review returns `REVISE`;
- the reviewer rejects any proposed registry mutation as too strong;
- the target/exam-code evidence requires a generated lesson change;
- any source-data change outside `1.2.1` through `1.2.4` is needed;
- validation requires a new package script, CI/build gate, dashboard gate,
  quality-ref integration, or Scale Gate integration;
- a positive compliance, approval, inspection-ready, OP0 completion, PTA,
  summative, classroom-implementation, school-obligation, or school-SKA claim
  appears.

## Expected Next Action After Closure

If INSPECT-9A closes cleanly, proceed to a bounded pre-INSPECT-10 decision:

```text
Either start an accessibility/support evidence review for Chapter 1.2, or
start INSPECT-10 only if the closure log says the remaining target-equivalent
and accessibility/support gaps are acceptable blockers for a report-only
generator implementation.
```
