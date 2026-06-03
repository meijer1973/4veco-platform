# Sprint SYNC-ROADMAP-EXAM-REPAIR-1: Roadmap Exam Repair Alignment

Generated: 2026-06-03

## Goal

Synchronize the platform and lesson roadmaps after the rollback of the invalid
shared task context ingestion proof and before `EXAM-SOURCE-AUTH-1` begins.

This sprint makes the active roadmap authority explicit: the protocol hardening
sprint is closed, the context/ingestion rows are not accepted as completed
evidence, and downstream work must proceed through the repair sequence with
real exam source authority first.

It is roadmap and evidence infrastructure only. It does not implement shared
task context rendering, source reconstruction, task transformation, generated
lesson output, product-route adoption, target-equivalent proof, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or student/product use.

## Context

`SPRINT-PROTOCOL-HARDEN-2` closed at commit
`b662e8a13739dd2ca96d8c431d41afee44c1a873`, after the prior invalid shared
task context ingestion attempt was rolled back by
`99f2f5fb15bf24ea08c533eb62c412b976544c27`.

Current roadmap state is split:

- `references/reference-team-roadmap.md` records `SPRINT-PROTOCOL-HARDEN-2`
  as closed and leaves the context/ingestion lane open, but it still uses the
  old `SOURCE-RECONSTRUCT-1`, `TASK-INGEST-TRANSFORM-1`, and
  `GATE-SHARED-TASK-INGEST-1` names.
- `../4veco-lessen/lessen-team-roadmap.md` still records
  `SYNC-TASK-CONTEXT-INGEST-1`, `TASK-CONTEXT-SPEC-1`,
  `TASK-CONTEXT-RUNTIME-1`, `CONTEXT-VISUAL-STD-1`,
  `SOURCE-RECONSTRUCT-1`, and `TASK-INGEST-TRANSFORM-1` as completed.
- The active next action needs to point to `EXAM-SOURCE-AUTH-1` before actual
  exam reconstruction and task transformation work.

## Quality Standard

The quality floor is synchronized roadmap authority: both roadmaps must tell
the same operational story, distinguish accepted closed work from rolled-back
or invalid evidence, and name the repair sequence that must precede any later
source-context ingestion gate.

Passing validators is not enough if the roadmaps still imply that invalid
proof is accepted. The sprint must fulfil the roadmap synchronization
specification, prove rendered output and student-facing output are unchanged,
show protected references are untouched, make the repair sequence checkable,
and name every omitted implementation requirement as follow-up work rather
than silently completed.

The review gate is structural lead review before closure. Human review is not
required because this is a roadmap synchronization sprint with no student
surface or generated output.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Both roadmaps agree that `SPRINT-PROTOCOL-HARDEN-2` is closed and governs later sprint evidence. | Platform and lesson roadmap rows or closure notes name the protocol sprint and its boundary claims. | Custom roadmap sync checker and lead review inspect both roadmaps. | planned |
| Rolled-back or invalid context/ingestion evidence is not recorded as completed accepted work. | Lesson roadmap rows for `SYNC-TASK-CONTEXT-INGEST-1`, `TASK-CONTEXT-SPEC-1`, `TASK-CONTEXT-RUNTIME-1`, `CONTEXT-VISUAL-STD-1`, old reconstruction, and old transform/gate rows are reset or rerouted to explicit repair status. | Checker rejects completed old rows and stale active-gate authority. | planned |
| Real exam source authority is first in the repair lane. | Both roadmaps include `EXAM-SOURCE-AUTH-1` as the next authorized sprint before actual exam reconstruction or transform work. | Checker requires ordered repair identifiers. | planned |
| Downstream repair sprint names are explicit. | Both roadmaps name `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`, `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`, `TASK-INGEST-TRANSFORM-3-TEXTBOOK`, and `GATE-SHARED-TASK-INGEST-REPAIR-1`. | Checker rejects old active names as the authoritative repair gate. | planned |
| `CHECK-SHORT-EXIT-2`, `SCALE-PROOF-3P`, and Scale Gate 1 stay blocked behind the repaired context/ingestion gate or explicit waiver. | Both roadmaps update held language to reference `GATE-SHARED-TASK-INGEST-REPAIR-1`. | Checker and lead review inspect hold language. | planned |
| No implementation or protected data mutation occurs. | Diff summary and git status show no edits under `references/machine/`, `references/external/`, source data, or generated Book 1 output. | `git diff --check`, lesson diff check, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add a deterministic checker for roadmap alignment. | include_now | The mismatch can recur unless both roadmap ledgers are checked by ID and status. |
| Rename the repair gate to distinguish it from the rolled-back/invalid gate. | include_now | The old gate name is polluted by invalid local-only evidence; a repair gate avoids false continuity. |
| Patch product specs again. | reject_scope_creep | Product specs were already updated for context-first requirements; this sprint only synchronizes active roadmap authority. |
| Implement source-authority validation in this sync sprint. | defer_named_follow_up | That belongs to `EXAM-SOURCE-AUTH-1`, which runs immediately after this sync closes. |
| Rewrite historical closed-roadmap prose. | reject_scope_creep | Historical narrative may remain for audit context; the active ledger and next-action authority are what must be synchronized. |

## Allowed paths

Allowed roadmap paths:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

Allowed sprint evidence and validation paths:

- `reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-*`
- `references/data/sprints/SYNC-ROADMAP-EXAM-REPAIR-1.plan.json`
- `references/data/sprints/SYNC-ROADMAP-EXAM-REPAIR-1.result.json`
- `build-scripts/sprints/check-sync-roadmap-exam-repair1.js`

Allowed closure/index paths:

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
- `build-scripts/README.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-result.md`
- `references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.result.json`

## Outputs

Required generated output statement:

- no student-facing or generated lesson output is generated or changed by this
  sprint.

Required roadmap and evidence outputs:

- synchronized platform roadmap row/status language;
- synchronized lesson roadmap row/status language;
- explicit repair-lane sequence through `EXAM-SOURCE-AUTH-1`,
  `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`,
  `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`,
  `TASK-INGEST-TRANSFORM-3-TEXTBOOK`, and
  `GATE-SHARED-TASK-INGEST-REPAIR-1`;
- deterministic roadmap sync checker;
- sprint planning review record;
- sprint result markdown and JSON;
- sprint diff summary;
- structural lead-review assignment, round 1, correction log, and round 2;
- refreshed repository maps/index/dashboard artifacts at closure.

## Operationalized sprint procedure

1. Validate this plan, baseline, and plan JSON with the sprint-plan and planned
   bundle checkers. Stop if the plan does not pass.
2. Ask the planning/review subagent to inspect both roadmap ledgers and the
   proposed sync quality floor. Stop and revise if it finds an authority
   blocker.
3. Edit the platform roadmap so the active lane records the sync sprint,
   authorizes `EXAM-SOURCE-AUTH-1` next, and replaces old active
   source-reconstruction/transform/gate identifiers with the repair sequence.
4. Edit the lesson roadmap so the context/ingestion rows no longer claim
   completed accepted evidence and instead point to the same repair sequence.
5. Add `check-sync-roadmap-exam-repair1.js` to verify both ledgers, blocked
   downstream rows, old-name retirement, and no false completion of invalid
   evidence. Stop if the checker cannot distinguish the repaired state.
6. Run wrapped acceptance commands and record command-log evidence for every
   passing result claim.
7. Assign structural lead review, record round 1, apply any corrections and
   correction log, then record round 2. Do not close if round 2 is not PASS or
   PASS WITH FLAGS.
8. Create result markdown, result JSON, and diff summary; refresh roadmap
   indexes, URL index, GitHub-facing maps, and internal dashboard.
9. Run final wrapped validation, `git diff --check` in both repositories,
   fetch/prune, resolve any behind/diverged state, commit and push the
   platform and lesson repos as needed, then report commit hash and push
   status.

## Acceptance tests

All closure commands after this plan must be run through
`build-scripts/sprints/run-sprint-command.js SYNC-ROADMAP-EXAM-REPAIR-1 --`.

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js SYNC-ROADMAP-EXAM-REPAIR-1
node build-scripts/sprints/check-sync-roadmap-exam-repair1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-lead-review-substance.js SYNC-ROADMAP-EXAM-REPAIR-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-result.md
node build-scripts/sprints/check-sprint-bundle.js SYNC-ROADMAP-EXAM-REPAIR-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close this sprint must include:

- command-log evidence for all passed acceptance tests listed in result JSON;
- custom checker output proving both roadmaps agree on repair-lane authority;
- validator/test evidence from sprint, roadmap, platform, index, and diff
  checks;
- lead-review assignment, round 1, correction log, and round 2;
- diff summary proving no generated lesson output, source-data, or protected
  reference changes;
- refreshed maps/index/dashboard artifacts where validators require them.

## Rollback plan

If synchronization proves wrong, revert only this sprint's roadmap rows,
checker, and sprint artifacts. Do not modify `references/machine/`,
`references/external/`, source data, or generated lesson output during
rollback. If one repo is pushed and the other fails, create an explicit
follow-up correction commit in the lagging repo rather than rewriting history.

## Human review required

Human review is not required for this roadmap synchronization sprint. The
required review gate is structural lead review before sprint closure.
