# Sprint INSPECT-11: Internal Diagnostic Scope Readiness Audit

Status: planned
Date: 2026-06-17
Sprint: `INSPECT-11`
Branch: `codex/inspect-11-diagnostic-scope-readiness-20260617`

## Goal

Determine whether the internal diagnostic tool can safely be considered for a
Dutch scope beyond the current Chapter 1.2 report pair, and identify the next
candidate scope without generating any new diagnostic report.

The sprint answers:

```text
Which Dutch scope is mature enough to be considered for internal diagnostic
reporting next, and what blockers prevent that consideration from becoming
report generation, evidence-pack generation, or downstream authority?
```

## Context

Product end-state and original spec:

- Product end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Operational product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Strategic product vision: `../4veco-lessen/specifications/product-vision.md`
- Original roadmap spec: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- Current sprint ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
- Controlling gate input: `archive/sprints/INSPECT-11/INSPECT-11-authorisation-note.md`
- Operating-procedure input: `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`

Authority reconciliation:

The original roadmap and sprint-ledger row named `INSPECT-11` as Dutch bounded
multi-scope evidence-pack generation. That older evidence-pack implementation
row remains blocked and is not activated by this sprint.

The PR #90 human-review verdict is the controlling later gate for this branch.
It instructs the team to start `INSPECT-11 Internal Diagnostic Scope Readiness
Audit` after PR #90 merges, to produce a substantial readiness audit and
candidate recommendation, and not to generate new diagnostic reports or return
for human review after every small artifact.

Therefore this sprint uses the `INSPECT-11` identifier only for the re-scoped
readiness audit. It does not authorise the older multi-scope evidence-pack
work, evidence-pack generation, teacher/school-facing output, or diagnostic
report generation.

Non-negotiable requirements:

- Use REV-STD-1.
- Cite product end-state and original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for carried issues.
- PASS WITH FLAGS may not carry a missing core requirement.
- Dutch-only.
- Internal diagnostic readiness audit only.
- No new generator implementation.
- No new diagnostic report generation.
- No evidence-pack generation.
- No teacher/school-facing output.
- No public/external output.
- No dashboard gate, dashboard authority, quality-ref, CI/package, Scale Gate,
  product-route, diagnostics/mastery/PV, student-use, or product-use
  integration.
- Generated dashboard/index paths may be refreshed only as mechanical
  GitHub-facing repository maps after roadmap/report paths change. They may
  not become a dashboard gate, status surface, product route, or authority.
- No generated lesson-output mutation.
- No protected-reference or source-registry mutation.
- No personal-data processing.
- No compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, or
  school-SKA claim.

## Quality Standard

The specification quality floor is a decision-useful internal readiness audit
that keeps every weak or missing proof visible. The audit must make it harder,
not easier, to overclaim. Passing validators or producing rendered output is
not enough: the report must explain why existing generated lesson artifacts,
reviews, quality refs, and target records do or do not support future internal
diagnostic consideration.

This sprint does not create student-facing output. Existing student-facing
lesson artifacts may be inspected read-only as evidence, but their presence is
not proof of pack strength, support strength, accessibility strength, product
route adoption, diagnostics/mastery/PV, or student-use authority.

Every candidate scope must receive an explicit follow-up or blocker decision
with `blocks`, `does_not_block`, and `proof_required_to_close`. Any missing
core requirement blocks closure; it may not be carried as PASS WITH FLAGS.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Cite product end-state and original sprint/gate spec | Plan, authorisation note, audit report, closure log | Lead review and specialist gate verify citations | planned |
| Compare candidate Dutch scopes | Readiness matrix for 1.1, 1.2, 1.3, and 1.4/1.5 controls | JSON/Markdown agreement and lead review | planned |
| Preserve no-generation boundary | No new diagnostic report or evidence-pack files in diff | Git diff, generator `--check`, stability checker | planned |
| Preserve downstream blockers | Findings include `blocks`, `does_not_block`, `proof_required_to_close` | REV-STD-1 lead review and specialist gate | planned |
| Keep dashboard refresh mechanical only | Dashboard/index diff limited to generated map refresh | Diff review and validation log | planned |
| Avoid biased recommendation | Neutral candidate-under-test language until evidence matrix is complete | Lead review checks recommendation support | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Add in-repo PR #90 authorisation note | `include_now` | Needed to reconcile the old roadmap INSPECT-11 row with the re-scoped readiness audit |
| Add structured JSON plus Markdown readiness report | `include_now` | Needed for machine-readable and human-readable review |
| Add new diagnostic generator output for Chapter 1.3 | `reject_scope_creep` | This sprint is readiness audit only |
| Add evidence-pack output for multiple scopes | `reject_scope_creep` | The old evidence-pack INSPECT-11 row remains blocked |
| Repair Chapter 1.3/1.4 lesson flags | `defer_named_follow_up` | Lesson-output mutation is forbidden; possible later remediation sprint |
| Build a reusable scope-readiness checker | `defer_named_follow_up` | Useful later, but this sprint should stay audit-only |

## Allowed paths

```text
archive/sprints/INSPECT-11/INSPECT-11-sprint-plan.md
archive/sprints/INSPECT-11/INSPECT-11-authorisation-note.md
archive/sprints/INSPECT-11/INSPECT-11-planning-review.md
archive/sprints/INSPECT-11/INSPECT-11-validation-log.md
archive/sprints/INSPECT-11/INSPECT-11-lead-review-assignment.md
archive/sprints/INSPECT-11/INSPECT-11-lead-review-round1.md
archive/sprints/INSPECT-11/INSPECT-11-correction-log.md
archive/sprints/INSPECT-11/INSPECT-11-lead-review-round2.md
archive/sprints/INSPECT-11/INSPECT-11-lead-review-round3.md
archive/sprints/INSPECT-11/INSPECT-11-specialist-gate-results.md
archive/sprints/INSPECT-11/INSPECT-11-closure-log.md
reports/inspection-standards/internal-diagnostic-scope-readiness.md
reports/inspection-standards/internal-diagnostic-scope-readiness.json
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/roadmap-version-index.json
docs/roadmaps/roadmap-version-index.md
reports/url-index.md
reports/github-agent-index-platform.md
reports/github-agent-index-platform.json
reports/github-agent-index-lessen.md
reports/github-agent-index-lessen.json
reports/internal-dashboard/index.html
reports/internal-dashboard/dashboard-data.json
```

## Forbidden paths

```text
build-scripts/inspection/build-dutch-diagnostic-report.js
build-scripts/inspection/check-dutch-diagnostic-report-stability.js
reports/inspection-standards/chapter-1-2-diagnostic-report.md
reports/inspection-standards/chapter-1-2-diagnostic-report.json
reports/inspection-standards/*-evidence-pack.md
reports/inspection-standards/*-evidence-pack.json
references/authored/course-target-exercises.json
references/machine/
references/external/
../4veco-lessen/
```

## Inputs

- `archive/sprints/INSPECT-11/INSPECT-11-authorisation-note.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json`
- `reports/inspection-standards/dutch-evidence-scale-readiness.json`
- `reports/inspection-standards/dutch-evidence-gap-closure-plan.json`
- `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json`
- `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.json`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.json`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- `references/authored/course-target-exercises.json` read-only
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` read-only

## Outputs

- `archive/sprints/INSPECT-11/INSPECT-11-planning-review.md`
- `archive/sprints/INSPECT-11/INSPECT-11-validation-log.md`
- `archive/sprints/INSPECT-11/INSPECT-11-lead-review-assignment.md`
- `archive/sprints/INSPECT-11/INSPECT-11-lead-review-round1.md`
- `archive/sprints/INSPECT-11/INSPECT-11-correction-log.md`
- `archive/sprints/INSPECT-11/INSPECT-11-lead-review-round2.md`
- `archive/sprints/INSPECT-11/INSPECT-11-lead-review-round3.md`
- `archive/sprints/INSPECT-11/INSPECT-11-specialist-gate-results.md`
- `archive/sprints/INSPECT-11/INSPECT-11-closure-log.md`
- `reports/inspection-standards/internal-diagnostic-scope-readiness.md`
- `reports/inspection-standards/internal-diagnostic-scope-readiness.json`
- roadmap, ledger, URL index, agent index, and internal-dashboard map refreshes as needed

## Operationalized sprint procedure

1. Confirm branch/worktree safety from current `origin/main`; stop if the branch is behind, diverged, on `main`, or unexpectedly dirty outside INSPECT-11 files.
2. Run deterministic plan validation; stop and revise the plan if the sprint checker fails.
3. Record planning review. If planning review returns REVISE, correct the plan and rerun review before implementation.
4. Inventory candidate scope evidence from existing platform reports, target registry state, and read-only lesson review/quality-ref artifacts.
5. Draft the readiness audit JSON and Markdown. Every candidate must classify readiness, blockers, `blocks`, `does_not_block`, and `proof_required_to_close`.
6. Update roadmap and ledger only to record the INSPECT-11 re-scope and active status, while keeping the older evidence-pack implementation row blocked.
7. Run lead review round 1. If it finds a missing core requirement, stop, correct, and record the correction log.
8. Run lead review round 2 after corrections. If main moves or lead review still returns REVISE, correct and run a subsequent lead review round.
9. Do not proceed to human review unless lead review passes without carrying a missing core requirement.
10. If the audit recommends considering any new diagnostic scope, run teacher/usefulness, legal/privacy/claims, and Dutch quality-inspection specialist reviews before human review.
11. Run validators and acceptance tests. Stop if generated diagnostic reports, evidence packs, protected references, or lesson outputs changed.
12. Refresh generated repository maps and dashboard only as mechanical maps.
13. Commit, push, open PR, wait for fresh `platform-ci / validate-platform`, then prepare the human-review packet only after the complete audit is PR-visible.

## Acceptance tests

The archive sprint packet is not closed by the legacy sprint-bundle checker.
That checker is retained below for deterministic visibility only: it expects the
`reports/sprints/<id>-plan.md` layout and does not support
`archive/sprints/INSPECT-11/` packets. Its archive-path failure is not closure
proof and must be recorded as an explicit reviewed exemption in the correction
and validation logs. Closure proof comes from the plan checker, parse checks,
lead/specialist reviews, validators, diff review, map checks, local platform
check, and fresh PR CI.

```bash
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11/INSPECT-11-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-11
node build-scripts/inspection/build-dutch-diagnostic-report.js --check
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ..\4veco-lessen status --short
npm.cmd run check:platform
```

## Proof Required to Close

Closure proof requires:

Proof to close must include review evidence, validator evidence, and test
evidence for the final PR-visible commit.

- plan checker output;
- planning review PASS after the REVISE loop;
- parseable readiness JSON;
- Markdown/JSON agreement for candidate recommendation and blockers;
- diagnostic generator `--check` and stability checker proving the existing Chapter 1.2 diagnostic pair was not regenerated or semantically changed;
- diff review proving no evidence-pack, new diagnostic report, protected-reference, or lesson-output mutation;
- lead review round 1, correction log, and final passing lead review round;
- specialist gate results if a new diagnostic-scope consideration is recommended;
- refreshed URL index, roadmap version index, agent indexes, and internal-dashboard maps when paths/roadmap surfaces change;
- fresh PR `platform-ci / validate-platform` for the reviewed commit.

## Rollback plan

If the sprint drifts into forbidden output, stop and revert only the INSPECT-11
working changes made by this sprint. Preserve unrelated user/agent changes.
If the audit cannot recommend a candidate without implying new authority, close
the sprint as blocked with the readiness matrix and no new diagnostic-scope
recommendation.

## Human review required

Yes. Human review is required after the full readiness audit is complete,
lead-reviewed, specialist-reviewed if required, pushed, and backed by fresh PR
CI. Do not request human review for a small intermediate artifact. Human review
may accept, revise, or reject only the readiness audit and candidate
recommendation; it may not, by accepting INSPECT-11, authorise new diagnostic
report generation, evidence packs, teacher/school-facing output, public output,
dashboard/quality-ref/Scale Gate integration, product-route adoption,
diagnostics/mastery/PV, student-use, product-use, generated lesson mutation,
protected-reference mutation, personal-data processing, or compliance/approval
claims.
