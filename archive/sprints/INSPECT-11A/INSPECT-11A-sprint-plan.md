# Sprint INSPECT-11A: Chapter 1.3 Diagnostic Readiness Remediation Plan

Status: planned
Date: 2026-06-17
Sprint: `INSPECT-11A`
Branch: `codex/inspect-11a-chapter-13-readiness-remediation-20260617`

## Goal

Produce a planning/evidence-readiness remediation packet for Book 1 Chapter
1.3 before any later internal diagnostic report generation is considered.

The sprint answers:

```text
What exact proof, quality-ref/review reconciliation, accessibility/support,
companion/advisory, and authority-boundary work is required before Chapter 1.3
can move from "best next planning candidate" to any future diagnostic-report
consideration?
```

## Context

Product end-state and original spec:

- Product end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Operational product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Strategic product vision: `../4veco-lessen/specifications/product-vision.md`
- Original roadmap spec: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- Current sprint ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
- Controlling input: `reports/inspection-standards/internal-diagnostic-scope-readiness.md`
- Operating-procedure input: `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`

Authority reconciliation:

INSPECT-11 selected Chapter 1.3 only as the best next planning/remediation
candidate. It did not authorise report generation, evidence-pack generation,
teacher/school-facing output, dashboard/quality-ref integration, Scale Gate
work, product-route adoption, diagnostics/mastery/PV work, student/product-use
authority, generated lesson-output mutation, protected-reference mutation, or
compliance/approval claims.

INSPECT-11A is therefore a planning and evidence-readiness remediation design
sprint. It names the required next work and records blockers. It does not close
those blockers, mutate lesson output, update protected source records, or
generate a Chapter 1.3 diagnostic report.

Non-negotiable requirements:

- Use REV-STD-1.
- Cite product end-state and original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for carried issues.
- PASS WITH FLAGS may not carry a missing core requirement.
- Dutch-only.
- Chapter 1.3 planning/evidence-readiness remediation design only.
- No new diagnostic report.
- No evidence pack.
- No teacher/school-facing or public/external output.
- No dashboard gate, dashboard authority, quality-ref integration, package/CI
  gate, Scale Gate integration, product-route adoption,
  diagnostics/mastery/PV, student-use, or product-use authority.
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

The specification quality floor is a decision-useful internal remediation plan
that keeps every weak or missing proof visible. The packet must use existing
rendered output, reviews, quality refs, and source-registry records only as
read-only evidence. Rendered output is not enough: the plan must explain what
proof is missing before any student-facing or diagnostic reliance can be
considered, and it must name a concrete follow-up route.

This sprint does not create student-facing output. Existing student-facing
lesson artifacts may be inspected read-only as evidence, but their presence is
not proof of target-equivalent readiness, accessibility readiness, support
strength, pack strength, product route adoption, diagnostics/mastery/PV, or
student-use authority.

Every target and carried issue must receive an explicit blocker decision with
`blocks`, `does_not_block`, and `proof_required_to_close`. Missing core proof
must remain blocking; it may not be carried as PASS WITH FLAGS.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Cite product end-state and original sprint/gate spec | Sprint plan, remediation plan Markdown/JSON, closure log | Lead review verifies citations | planned |
| Inventory Chapter 1.3 targets | Target inventory for `1.3.1` through `1.3.4` | Lead review checks registry-to-plan mapping | planned |
| Reconcile quality-ref/review state | Matrix for stale, current, conflicting, and unresolved lesson-side evidence | Lead review checks stale `1.3.1-quality-ref.yaml` blocker versus later correction and all other stale flags | planned |
| Design proof-record route | Per-target operation-chain proof, answer-form proof, scaffold boundary, and authority boundary | Teacher/usefulness specialist checks whether proof design is decision-useful | planned |
| Resolve `1.3.4` posture | Explicit reviewed integration/no-code decision or defer rationale | Lead and Dutch quality-inspection reviews | planned |
| Record accessibility/support route | Mobile/responsive, contrast/theme, semantic/PDF, keyboard/focus applicability, text equivalents, internal-code/inclusive-language, hints/repair, companion/advisory, next-action, and product/school boundary plan | Teacher, legal/privacy, and Dutch quality-inspection reviews | planned |
| Preserve no-output/no-authority boundary | Diff contains no generated lesson-output, protected-reference mutation, evidence pack, or new diagnostic report | Validators, diff review, and closure log | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Add structured Chapter 1.3 remediation-plan JSON and Markdown | `include_now` | Required to make the next route reviewable |
| Add target inventory and stale-evidence reconciliation | `include_now` | Required by INSPECT-11 and REV-STD-1 |
| Add per-target proof-record design | `include_now` | Required before any later diagnostic consideration |
| Add accessibility/support and companion/advisory plan | `include_now` | Required because Chapter 1.3 lacks diagnostic-depth support evidence |
| Refresh roadmap, ledger, URL index, agent index, and internal dashboard maps | `include_now` | Mechanical repository map/status updates only |
| Generate a Chapter 1.3 diagnostic report | `reject_scope_creep` | Forbidden until a later human-reviewed sprint explicitly authorises it |
| Mutate `../4veco-lessen` generated lesson outputs or quality refs | `reject_scope_creep` | This sprint is read-only with respect to lesson evidence |
| Update protected references/source registry | `reject_scope_creep` | Source-registry mutation is forbidden in INSPECT-11A |
| Implement proof fixes and report generation in the same sprint | `defer_named_follow_up` | Candidate next route is INSPECT-11B only after human review |

## Allowed paths

```text
archive/sprints/INSPECT-11A/INSPECT-11A-sprint-plan.md
archive/sprints/INSPECT-11A/INSPECT-11A-validation-log.md
archive/sprints/INSPECT-11A/INSPECT-11A-lead-review-round1.md
archive/sprints/INSPECT-11A/INSPECT-11A-lead-review-round2.md
archive/sprints/INSPECT-11A/INSPECT-11A-specialist-gate-results.md
archive/sprints/INSPECT-11A/INSPECT-11A-closure-log.md
reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.md
reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.json
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
reports/inspection-standards/chapter-1-3-diagnostic-report.md
reports/inspection-standards/chapter-1-3-diagnostic-report.json
reports/inspection-standards/*-evidence-pack.md
reports/inspection-standards/*-evidence-pack.json
references/authored/course-target-exercises.json
references/machine/
references/external/
../4veco-lessen/
```

## Inputs

- `reports/inspection-standards/internal-diagnostic-scope-readiness.md`
- `reports/inspection-standards/internal-diagnostic-scope-readiness.json`
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.md`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.json`
- `references/authored/course-target-exercises.json` read-only
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/` read-only

## Outputs

- `archive/sprints/INSPECT-11A/INSPECT-11A-validation-log.md`
- `archive/sprints/INSPECT-11A/INSPECT-11A-lead-review-round1.md`
- `archive/sprints/INSPECT-11A/INSPECT-11A-lead-review-round2.md`
- `archive/sprints/INSPECT-11A/INSPECT-11A-specialist-gate-results.md`
- `archive/sprints/INSPECT-11A/INSPECT-11A-closure-log.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.json`
- roadmap, ledger, URL index, agent index, and internal-dashboard map refreshes as needed

## Operationalized sprint procedure

1. Confirm branch/worktree safety from current `origin/main`; stop if the branch is behind, on `main`, or unexpectedly dirty outside INSPECT-11A files.
2. Run deterministic plan validation; stop and revise the plan if the sprint checker fails.
3. Inventory Chapter 1.3 target records, lesson-side quality refs, lesson-side reviews, and lesson file surfaces read-only.
4. Draft the remediation-plan JSON and Markdown with target inventory, quality-ref/review reconciliation, proof-record design, accessibility/support plan, companion/advisory plan, `1.3.4` posture, and blocker ledger.
5. Run lead review after the target inventory and quality-ref/review reconciliation are present. If it finds a missing core requirement, correct the packet and rerun review.
6. Run teacher/usefulness review after proof-record design, legal/privacy/claims review after output/audience boundary wording, and Dutch quality-inspection review after the full blocker ledger. If any reviewer returns REVISE or identifies a missing core requirement, correct the packet and rerun the affected review.
7. Update roadmap and ledger only to record INSPECT-11 closure and INSPECT-11A status/recommendation. Keep the older evidence-pack row and downstream gates blocked.
8. Run validators and acceptance tests. Stop if generated diagnostic reports, evidence packs, protected references, or lesson outputs changed.
9. Refresh generated repository maps and dashboard only as mechanical maps.
10. Commit, push, open PR, wait for fresh `platform-ci / validate-platform`, then prepare the human-review packet only after the complete INSPECT-11A packet is PR-visible.

## Acceptance tests

The archive sprint packet is not closed by the legacy sprint-bundle checker.
That checker is retained below for deterministic visibility only: it expects the
`reports/sprints/<id>-plan.md` layout and does not support
`archive/sprints/INSPECT-11A/` packets. Its archive-path failure is not closure
proof and must be recorded as an explicit reviewed exemption in validation.
Closure proof comes from the plan checker, parse checks, lead/specialist
reviews, validators, diff review, map checks, local platform check, and fresh
PR CI.

```bash
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11A/INSPECT-11A-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-11A
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.json','utf8'));"
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

- sprint plan checker output;
- parseable remediation-plan JSON;
- Markdown/JSON agreement for target inventory, quality-ref/review
  reconciliation, proof-record design, recommended next route, and blocker
  ledger;
- lead review round 1 after target inventory and quality-ref/review
  reconciliation;
- final passing lead review after corrections, if any;
- specialist gate results for teacher/usefulness, legal/privacy/claims, and
  Dutch quality-inspection;
- diagnostic generator `--check` and stability checker proving the existing
  Chapter 1.2 diagnostic pair was not regenerated or semantically changed;
- diff review proving no evidence-pack, new diagnostic report,
  protected-reference, or lesson-output mutation;
- refreshed URL index, roadmap version index, agent indexes, and
  internal-dashboard maps when paths/roadmap surfaces change;
- local `check:platform` and fresh PR `platform-ci / validate-platform`.

## Rollback plan

If the sprint drifts into forbidden output, stop and revert only the
INSPECT-11A working changes made by this sprint. Preserve unrelated user/agent
changes. If the plan cannot name a next remediation route without implying
diagnostic authority, close the sprint as blocked with the evidence inventory
and no report-generation recommendation.

## Human review required

Yes. Human review is required after the full remediation plan is complete,
lead-reviewed, specialist-reviewed, pushed, and backed by fresh PR CI. Do not
request human review for a small intermediate artifact. Human review may
accept, revise, or reject only the INSPECT-11A remediation-plan packet and next
route. It may not, by accepting INSPECT-11A, authorise new diagnostic report
generation, evidence packs, teacher/school-facing output, public output,
dashboard/quality-ref/Scale Gate integration, product-route adoption,
diagnostics/mastery/PV, student-use, product-use, generated lesson mutation,
protected-reference mutation, personal-data processing, or compliance/approval
claims.
