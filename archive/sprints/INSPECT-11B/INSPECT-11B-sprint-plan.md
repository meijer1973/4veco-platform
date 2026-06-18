# Sprint INSPECT-11B: Chapter 1.3 Readiness Remediation And Diagnostic Tool Health Repair

Status: planned
Date: 2026-06-18
Sprint: `INSPECT-11B`
Branch: `codex/inspect-11b-readiness-remediation-tool-health-20260618`

## Goal

Produce the full INSPECT-11B remediation packet requested after PR #99:

1. repair or formally classify the existing Chapter 1.2 diagnostic byte-stability mismatch;
2. reconcile current Chapter 1.3 quality-ref/review state;
3. create route-local Chapter 1.3 proof-record candidates;
4. decide the `1.3.4` integration/no-code/no-new-theory posture;
5. create accessibility/support and companion/advisory evidence decisions;
6. return a blocker ledger with `blocks`, `does_not_block`, and `proof_required_to_close`.

This sprint does not generate a Chapter 1.3 diagnostic report and does not create an evidence pack.

## Context

- Product end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Operational product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Strategic product vision: `../4veco-lessen/specifications/product-vision.md`
- Original roadmap spec: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- Current sprint ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
- Controlling input: `reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.md`
- Diagnostic operating procedure: `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- Human-review trigger: PR #99 review verdict, which accepted INSPECT-11A and directed INSPECT-11B to include Chapter 1.2 byte-stability repair first.

## Quality Standard

The specification quality floor is a decision-useful internal remediation
packet. It must prove whether the existing Chapter 1.2 diagnostic tool is
byte-stable, then make a conservative Chapter 1.3 readiness decision without
turning rendered output into student-facing authority.

Rendered output may be inspected as evidence, but rendered output alone is not
proof of diagnostic readiness, accessibility/support strength, pack strength,
teacher/school-facing usefulness, or product-use authority. Missing proof must
remain visible with a named follow-up route.

The packet must separate:

- source-registry target finality;
- lesson-side quality-ref/review state;
- route-local proof candidates;
- accessibility/support evidence;
- companion/advisory evidence;
- downstream authority gates.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Repair/classify Chapter 1.2 diagnostic byte-stability | Refreshed existing report pair or explicit blocker | Generator `--check`, stability checker, and diff review | planned |
| Cite product end-state and original sprint/gate spec | Sprint plan and result Markdown/JSON | Lead review checks citations | planned |
| Reconcile Chapter 1.3 quality-ref/review state | Per-target reconciliation table | Lead review checks stale/current distinction | planned |
| Create proof-record candidates | Per-target operation-chain, answer-form, scaffold, and authority fields | Teacher/usefulness review | planned |
| Decide `1.3.4` integration/no-code/no-new-theory posture | Explicit `1.3.4` decision | Lead and Dutch quality-inspection review | planned |
| Record accessibility/support and companion/advisory evidence | Decision matrices with carried blockers | Teacher/usefulness and legal/privacy/claims review | planned |
| Preserve no-output/no-authority boundary | Diff contains no Chapter 1.3 report, evidence pack, lesson mutation, protected-reference mutation, or source-registry mutation | Validators, diff review, and closure log | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Refresh existing Chapter 1.2 diagnostic report metadata | `include_now` | Required to restore byte-stability |
| Add Chapter 1.3 remediation-results JSON and Markdown | `include_now` | Required for human review |
| Add per-target proof-record candidates | `include_now` | Required to make the next route auditable |
| Add accessibility/support and companion/advisory decisions | `include_now` | Required because missing core evidence cannot be hidden |
| Add lesson-side quality-ref mutations | `defer_named_follow_up` | Needs separate lesson-side authorisation |
| Generate a Chapter 1.3 diagnostic report | `reject_scope_creep` | Forbidden until later human-reviewed readiness closes |
| Generate an evidence pack or teacher/school-facing output | `reject_scope_creep` | Outside INSPECT-11B |

## Non-Negotiable Requirements

- Use REV-STD-1.
- Cite product end-state and the original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for carried issues.
- PASS WITH FLAGS may not carry a missing core requirement.
- Dutch-only inspection-standards scope.
- Chapter 1.2 work is limited to the existing allowlisted internal diagnostic report pair and byte-stability metadata.
- Chapter 1.3 work is remediation/proof/support results only.
- No new Chapter 1.3 diagnostic report.
- No evidence pack.
- No teacher/school-facing or public/external output.
- No package-script, CI/build, dashboard gate, quality-ref integration gate, Scale Gate integration, product-route adoption, diagnostics/mastery/PV, student-use, or product-use authority.
- No generated lesson-output mutation in `../4veco-lessen`.
- No protected-reference or source-registry mutation.
- No personal-data processing.
- No compliance, approval, inspection-ready, complete OP0, PTA-validity, summative-validity, classroom-implementation, school-obligation, or school-SKA claim.

## Allowed paths

```text
archive/sprints/INSPECT-11B/
reports/inspection-standards/chapter-1-3-readiness-remediation-results.md
reports/inspection-standards/chapter-1-3-readiness-remediation-results.json
reports/inspection-standards/chapter-1-2-diagnostic-report.md
reports/inspection-standards/chapter-1-2-diagnostic-report.json
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/roadmap-version-index.md
docs/roadmaps/roadmap-version-index.json
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
reports/inspection-standards/chapter-1-3-diagnostic-report.md
reports/inspection-standards/chapter-1-3-diagnostic-report.json
reports/inspection-standards/*-evidence-pack.md
reports/inspection-standards/*-evidence-pack.json
build-scripts/inspection/build-dutch-diagnostic-report.js
build-scripts/inspection/check-dutch-diagnostic-report-stability.js
references/authored/course-target-exercises.json
references/machine/
references/external/
../4veco-lessen/
```

## Inputs

- `reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.json`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.md`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `references/authored/course-target-exercises.json` read-only
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/` read-only

## Outputs

- `archive/sprints/INSPECT-11B/INSPECT-11B-sprint-plan.md`
- `archive/sprints/INSPECT-11B/INSPECT-11B-validation-log.md`
- `archive/sprints/INSPECT-11B/INSPECT-11B-lead-review-round1.md`
- `archive/sprints/INSPECT-11B/INSPECT-11B-lead-review-round2.md`
- `archive/sprints/INSPECT-11B/INSPECT-11B-specialist-gate-results.md`
- `archive/sprints/INSPECT-11B/INSPECT-11B-closure-log.md`
- `reports/inspection-standards/chapter-1-3-readiness-remediation-results.md`
- `reports/inspection-standards/chapter-1-3-readiness-remediation-results.json`
- refreshed existing Chapter 1.2 diagnostic report pair only if required to restore byte-stability

## Operationalized sprint procedure

1. Confirm branch/worktree safety from current `origin/main` and read-only lesson checkout.
2. Reproduce the Chapter 1.2 diagnostic byte-stability failure.
3. Refresh only the existing Chapter 1.2 diagnostic report pair if the operating procedure permits it.
4. Rerun `build-dutch-diagnostic-report.js --check` and `check-dutch-diagnostic-report-stability.js`.
5. Inspect Chapter 1.3 quality refs, reviews, target registry records, generated lesson files, and assets read-only.
6. Build the remediation-results JSON and Markdown using REV-STD-1.
7. Run lead review after quality-ref/review reconciliation and proof records exist.
8. Run teacher/usefulness, legal/privacy/claims, and Dutch quality-inspection specialist gates.
9. Correct any missing core requirement and rerun affected reviews.
10. Run validators and acceptance checks.
11. Refresh roadmap, ledger, URL index, agent indexes, and internal dashboard maps as mechanical repository maps only.
12. Commit, push, open PR, wait for fresh `platform-ci / validate-platform`, then request human review only after the full packet is visible.

## Acceptance tests

`check-sprint-bundle` is retained as deterministic visibility for the archive
packet, but this legacy checker is not the closure authority for archived
sprint-path layout. If it reports only the known archive/report layout
expectation, record that result in the validation log and rely on the REV-STD-1
packet files plus the validators below for closure.

```bash
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11B/INSPECT-11B-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-11B
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('reports/inspection-standards/chapter-1-3-readiness-remediation-results.json','utf8'));"
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

Proof to close must include review evidence, validator evidence, and test
evidence for the final PR-visible commit.

- Chapter 1.2 generator `--check` and stability checker pass.
- INSPECT-11B JSON parses and includes product end-state, original sprint/gate spec, non-negotiables, core checklist, classified findings, and blocker ledger.
- Markdown and JSON agree on final decision and carried blockers.
- Lead review and specialist gates pass without missing core requirements.
- Diff review proves no Chapter 1.3 diagnostic report, evidence pack, protected reference, source-registry mutation, lesson-output mutation, or downstream authority change.
- Fresh PR CI passes before human review.

## Rollback plan

If the sprint drifts into forbidden output, stop and revert only INSPECT-11B
changes made by this branch. Preserve unrelated user/agent changes. If Chapter
1.2 stability cannot be repaired without generator behavior changes, close the
packet as blocked with exact proof required. If Chapter 1.3 cannot be evaluated
without lesson-side mutation, carry that as a blocker and do not generate a
diagnostic report.

## Human review required

Yes. Human review is required only after the full INSPECT-11B packet exists,
lead/specialist reviews pass, validation has run, the branch is pushed, and
fresh PR CI is green. Do not request human review for a partial target matrix,
partial proof-record draft, or standalone Chapter 1.2 metadata refresh.
