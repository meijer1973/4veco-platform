# Sprint INSPECT-11C: Chapter 1.3 Lesson-Side Reconciliation And Proof Remediation

Status: in progress
Date: 2026-06-18
Sprint: `INSPECT-11C`

## Goal

Produce the full INSPECT-11C reconciliation and proof remediation packet:

1. reconcile current Chapter 1.3 quality-ref/review state for `1.3.1`
   through `1.3.4`;
2. decide the `1.3.4` lesson-output / registry divergence without mutating
   lesson output in this platform packet;
3. create route-local proof-record candidates with exercise IDs, line ranges,
   answer/model separation, and scaffold boundaries;
4. record accessibility/support and companion/advisory evidence gaps as
   blockers where proof is missing;
5. answer whether Chapter 1.3 is ready for a later internal diagnostic report
   implementation-plan sprint.

This sprint does not generate a Chapter 1.3 diagnostic report and does not
create an evidence pack.

## Context

Product end-state source: `docs/roadmaps/quality-standards/quality-standards-end-state.md`

Operational product end-state source:
`../4veco-lessen/specifications/product-end-state.md`

Strategic product vision source:
`../4veco-lessen/specifications/product-vision.md`

INSPECT-11C is an internal Dutch inspection-standards remediation packet. It is
not a diagnostic report, evidence pack, teacher/school-facing artifact,
student-facing product route, product-use authority, inspection judgement, or
compliance/approval claim.

## Original Sprint/Gate Spec

Original sprint/gate spec:
`archive/sprints/INSPECT-11C/INSPECT-11C-authorisation-note.md`

Prior roadmap context:
`docs/roadmaps/quality-standards/inspection-standards-roadmap.md`

Controlling prior packet:
`reports/inspection-standards/chapter-1-3-readiness-remediation-results.md`

Human review verdict for PR #105 authorises INSPECT-11C as:

```text
INSPECT-11C Chapter 1.3 Lesson-Side Reconciliation And Proof Remediation
```

## Quality Standard

The specification quality floor is a decision-useful internal remediation
packet. It must separate source-registry finality, lesson-side
quality-ref/review state, route-local proof candidates, accessibility/support
evidence, companion/advisory evidence, and downstream authority gates.

Rendered output may be inspected as evidence, but rendered output alone is not
proof of diagnostic readiness, accessibility/support strength, pack strength,
teacher/school-facing usefulness, student-facing usefulness, or product-use
authority. Missing proof must remain visible with a named follow-up route.

REV-STD-1 applies to the sprint plan, remediation packet, lead reviews,
specialist gates, validation log, and closure log.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Reconcile `1.3.1` through `1.3.4` quality-ref/review state | per-target reconciliation table | lead review | planned |
| Decide `1.3.4` lesson-output / registry divergence | explicit option decision | Dutch quality-inspection and lead review | planned |
| Create proof-record candidates | exercise IDs, line ranges, answer separation, authority boundary | teacher/usefulness review | planned |
| Produce accessibility/support evidence records | dimension matrix with blockers | Dutch quality-inspection and legal/privacy review | planned |
| Preserve forbidden authority boundaries | false output/authority flags and blocker ledger | validation and legal/privacy review | planned |

## Quality Improvement Candidates

| Candidate | Decision | Reason |
|---|---|---|
| Lesson-output mutation | `reject_scope_creep` | Not authorised in this platform packet |
| Source-registry mutation | `reject_scope_creep` | Protected/reference mutation requires separate explicit route |
| Chapter 1.3 diagnostic report | `reject_scope_creep` | Forbidden until core blockers close |
| Exact proof line ranges | `include_now` | Required to narrow scaffold/no-answer-before-attempt blockers |
| Accessibility/support matrix | `include_now` | Missing core evidence cannot be carried as a soft flag |
| Lesson-side metadata repair | `defer_named_follow_up` | Needs separate lesson-side authorisation |

## Allowed paths

- Create INSPECT-11C archive artifacts.
- Create `chapter-1-3-reconciliation-and-proof-remediation` JSON and
  Markdown.
- Inspect Chapter 1.3 lesson evidence read-only from the sibling lesson
  worktree.
- Record proof candidates and blockers.
- Refresh roadmap, ledger, URL index, agent index, and internal dashboard maps.
- Use subagents for lead, teacher/usefulness, Dutch quality-inspection, and
  legal/privacy/claims review.

## Forbidden paths

- Do not generate a Chapter 1.3 diagnostic report.
- Do not generate an evidence pack.
- Do not mutate lesson output in `../4veco-lessen`.
- Do not mutate protected references or source-registry records.
- Do not mutate `references/machine/`, `references/external/`, or protected
  registry surfaces.
- Do not create dashboard, quality-ref, package/CI, Scale Gate, product-route,
  diagnostics/mastery/PV, student-use, or product-use authority.
- Do not make compliance, approval, inspection-ready, OP0, PTA, summative,
  classroom, school-obligation, or school-SKA claims.
- Do not reinterpret check-surface gate authority.

## Non-Negotiables

- Use REV-STD-1.
- Cite product end-state and original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for
  carried issues.
- PASS WITH FLAGS may not carry a missing core requirement.
- Human review only after full packet, validation, CI, and subagent review.

## Inputs

- `reports/inspection-standards/chapter-1-3-readiness-remediation-results.md`
- `reports/inspection-standards/chapter-1-3-readiness-remediation-results.json`
- `references/authored/course-target-exercises.json`
- read-only lesson evidence at `../4veco-lessen`
- PR #105 review verdict

## Outputs

- `reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.md`
- `reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.json`
- `archive/sprints/INSPECT-11C/INSPECT-11C-sprint-plan.md`
- `archive/sprints/INSPECT-11C/INSPECT-11C-authorisation-note.md`
- `archive/sprints/INSPECT-11C/INSPECT-11C-validation-log.md`
- `archive/sprints/INSPECT-11C/INSPECT-11C-correction-log.md`
- `archive/sprints/INSPECT-11C/INSPECT-11C-lead-review-round1.md`
- `archive/sprints/INSPECT-11C/INSPECT-11C-lead-review-round2.md`
- `archive/sprints/INSPECT-11C/INSPECT-11C-specialist-gate-results.md`
- `archive/sprints/INSPECT-11C/INSPECT-11C-closure-log.md`

## Operationalized sprint procedure

1. Confirm PR #105 is merged and branch from current `origin/main`.
2. Create a read-only lesson evidence worktree.
3. Inspect source-registry records for `1.3.1` through `1.3.4`.
4. Inspect lesson quality refs, reviews, generated opgaven/antwoorden,
   rendered HTML/PDF presence, assets, hints, and support text.
5. Build reconciliation/proof remediation JSON and Markdown using REV-STD-1.
6. Run lead review after quality-ref/review reconciliation is drafted.
7. Run teacher/usefulness, Dutch quality-inspection, and legal/privacy/claims
   specialist gates.
8. Correct any missing core requirement and rerun affected reviews.
9. Run validators and acceptance checks.
10. Refresh repository maps.
11. Commit, push, open PR, wait for fresh `platform-ci / validate-platform`,
   then request human review only after the full packet is visible.

## Acceptance tests

`check-sprint-bundle` is retained as deterministic visibility for the archive
packet, but this legacy checker is not the closure authority for archived
sprint-path layout. If it reports only the known archive/report layout
expectation, record that result in the validation log and rely on the REV-STD-1
packet files plus the validators below for closure.

```bash
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11C/INSPECT-11C-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-11C
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.json','utf8'));"
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

- INSPECT-11C JSON parses and includes product end-state, original sprint/gate
  spec, non-negotiables, core checklist, classified findings, and blocker
  ledger.
- The packet answers whether Chapter 1.3 remains the right next diagnostic
  candidate.
- The packet decides whether `1.3.4` is reconciled, excluded, or still blocked.
- Proof-record candidates include exercise IDs/line ranges and answer
  separation.
- Accessibility/support gaps are classified as blockers where evidence is
  missing.
- Specialist gates and final lead review pass after correction.

## Rollback plan

If the sprint drifts into forbidden output, stop and revert only INSPECT-11C
files and generated maps from this branch. Do not revert unrelated main history
or user work.

## Human review required

Human review is required after the PR is visible, locally validated, CI-backed,
and subagent-reviewed. Human review may accept, revise, or reject only the
INSPECT-11C remediation packet and next-route recommendation. It must not infer
diagnostic report generation, evidence-pack, teacher/school-facing,
product-route, Scale Gate, diagnostics/mastery/PV, student/product-use,
personal-data, or compliance/approval authority.
