# Sprint INSPECT-10B: Internal Diagnostic Report Generator

Status: implementation plan
Date: 2026-06-16
Sprint: `INSPECT-10B`

## Goal

Implement a manually invoked internal Dutch diagnostic report generator for
Book 1 Chapter 1.2 only, using exactly the INSPECT-10A source allowlist and
writing only the allowlisted INSPECT-10B diagnostic report pair plus sprint and
roadmap artifacts.

The goal is not to create an evidence pack, teacher/school-facing output,
public/external output, package script, CI/build gate, dashboard gate,
quality-ref integration, Scale Gate integration, source-registry mutation,
generated lesson-output mutation, or downstream product-use authority.

## Context

INSPECT-10 and INSPECT-10A closed the procedural ambiguity around a possible
internal diagnostic generator. INSPECT-10B is the narrow implementation that
follows those accepted packets after PR #75 merged and post-merge validation
passed. Chapter 1.2 still carries `1.2.2`, `1.2.4`, accessibility, support,
public/external, check-surface, and downstream product-use blockers.

## Quality Standard

The quality floor for this sprint is faithful implementation of the
specification without authority creep. The rendered output must be an internal
diagnostic report that keeps all blockers visible, cites source paths for
claims, and remains safe for review. It must not become student-facing,
teacher/school-facing, public/external, pack-strength, or product-use proof.
Any stronger surface is a named follow-up, not implicit scope. Closure proof
must include validator/test evidence and lead review.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exact source allowlist only | Generator hard-codes and enforces the INSPECT-10A source paths | Generator `--check`, source metadata, lead review | planned |
| Exact output allowlist only | Generator writes only the Chapter 1.2 report pair; sprint updates stay in allowed paths | Diff review and validation log | planned |
| Required output fields | JSON and Markdown include the INSPECT-10A required fields | Generated report inspection and `--check` | planned |
| Blockers visible | `1.2.2`, `1.2.4`, accessibility, support, and check-surface blockers remain in output | Hidden-blocker assertion and lead review | planned |
| No missing core requirement carried as PASS WITH FLAGS | Closure must be PASS or revise; no missing required field can be carried | Lead review and closure log | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Implement manual internal generator and report pair | `include_now` | In scope under INSPECT-10A |
| Add `--check` mode and refusal-code tests | `include_now` | Supports closure proof without CI integration |
| Add package script, CI/build gate, dashboard, quality-ref, or Scale Gate hook | `defer_named_follow_up` | Requires later human-reviewed authority |
| Generate evidence pack or teacher/school-facing pack | `reject_scope_creep` | Explicitly blocked by INSPECT-10A |
| Read lesson output or protected references outside the allowlist | `reject_scope_creep` | Explicitly blocked by source contract |

## Allowed paths

- `archive/sprints/INSPECT-10B/INSPECT-10B-sprint-plan.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-planning-review.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-validation-log.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-lead-review-assignment.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-lead-review-round1.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-closure-log.md`
- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.md`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`

## Forbidden paths

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `../4veco-lessen/` except
  `../4veco-lessen/specifications/product-end-state.md` and
  `../4veco-lessen/specifications/product-vision.md`
- Any generated lesson-output path
- Any package, CI/build, dashboard, quality-ref, or Scale Gate integration path

## Inputs

- INSPECT-10 diagnostic planning JSON/Markdown
- INSPECT-10R three-reviewer gate result
- INSPECT-9C proof/support remediation JSON/Markdown
- INSPECT-9B and INSPECT-9A Chapter 1.2 review/remediation JSON/Markdown
- INSPECT-8 and INSPECT-9 readiness/gap JSON files
- INSPECT-7 bounded Chapter 1.1 control JSON
- Quality-standards end-state
- Product end-state and product vision specifications
- Prior report-only generator, source-contract, and validator design docs

## Outputs

- Manual internal diagnostic generator script
- Chapter 1.2 diagnostic report JSON
- Chapter 1.2 diagnostic report Markdown
- INSPECT-10B sprint artifacts
- Allowlisted roadmap, ledger, end-state, and version-index updates

## Operationalized sprint procedure

1. Stop if `main` is stale, the branch is not under the allowed agent prefix,
   the worktree claim is not owned by this agent/task, or any source/output
   path falls outside the INSPECT-10A allowlists.
2. Implement the manual generator with hard-coded allowlists, required output
   fields, source metadata, blocker visibility checks, refusal codes, and a
   `--check` validator mode.
3. Generate the report pair and inspect JSON/Markdown for visible blockers,
   safe-use wording, source citations, and absence of forbidden authority.
4. Run acceptance validators and record command evidence. If any validator
   fails because a core requirement is missing, stop for correction rather than
   carrying it as PASS WITH FLAGS.
5. Perform REV-STD-1 lead review with finding classifications and
   `blocks` / `does_not_block` / `proof_required_to_close` fields.
6. Close only after validation and lead review pass; otherwise revise and
   repeat the validator/review loop.
7. Push the branch and open a PR for human review. Human review must decide
   only whether INSPECT-10B faithfully implements the internal diagnostic
   generator; it must not unlock downstream surfaces.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-10B/INSPECT-10B-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-10B
node build-scripts/inspection/build-dutch-diagnostic-report.js --check
npm run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
git diff --check
npm run check:platform
```

## Proof Required to Close

Proof to close must include a current generated report pair, a passing
generator `--check`, a passing sprint-plan check, roadmap-version index
validation, scope-language validation, URL-index validation, whitespace
validation, platform tests, refusal-code spot checks, and lead review. The lead
review must return PASS and may not carry a missing core requirement as PASS
WITH FLAGS.

## Rollback plan

Before merge, rollback is branch-local: revert the INSPECT-10B commit or close
the PR. After merge, rollback requires a follow-up PR that removes the
generator/report pair and restores the roadmap/ledger/version-index wording to
the previous INSPECT-10A state while preserving audit history.

## Human review required

Yes. Human review must confirm that INSPECT-10B is only the internal
diagnostic generator/report pair allowed by INSPECT-10A. Human review does not
authorise evidence-pack generation, teacher/school-facing output,
public/external sharing, package/CI/dashboard/quality-ref/Scale Gate
integration, generated lesson-output mutation, product-route adoption,
diagnostics/mastery/PV, student-use, or product-use authority.

## Product End-State And Original Spec

- Product end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original roadmap/gate spec:
  `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
  candidate sprint `INSPECT-10B`
- Controlling implementation gate:
  `reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.md`
  and
  `reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.json`
- Accepted diagnostic-planning packet:
  `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md`
  and
  `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json`
- Human-review gate evidence:
  `archive/sprints/INSPECT-10A/INSPECT-10A-three-reviewer-gate-results.md`

## Sprint Objective

Implement the narrow internal Chapter 1.2 Dutch diagnostic report generator
authorised by INSPECT-10A. The generator is manual-only, report-only, and
diagnostic-only. It reads only the exact INSPECT-10A source allowlist and writes
only the exact INSPECT-10A output allowlist needed for INSPECT-10B.

This sprint must preserve all Chapter 1.2 generated-output, accessibility,
support, public/external, check-surface, and downstream product-use blockers.

## Non-Negotiable Requirements

- Use REV-STD-1 for planning, lead review, carried issues, and closure.
- Cite product end-state and the original sprint/gate spec.
- Name all non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for carried
  issues.
- PASS WITH FLAGS may not carry a missing core requirement.
- Dutch scope only.
- Internal diagnostic report only.
- Manual invocation only.
- No evidence pack.
- No teacher/school-facing pack.
- No public/external generated output or public/external sharing.
- No package script, CI/build gate, dashboard gate, quality-ref integration, or
  Scale Gate integration.
- No source-registry mutation.
- No generated lesson-output mutation in `../4veco-lessen`.
- No protected lesson-output or protected reference reads outside the
  INSPECT-10A source allowlist.
- No personal-data processing.
- No compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, school-SKA,
  product-route adoption, diagnostics/mastery/PV, student-use, or product-use
  authority.

## Allowed Source Files

The generator may read only these INSPECT-10A source paths:

- `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json`
- `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md`
- `archive/sprints/INSPECT-10/INSPECT-10R-three-reviewer-gate-results.md`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.json`
- `reports/inspection-standards/chapter-1-2-proof-support-remediation.md`
- `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.json`
- `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.md`
- `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json`
- `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md`
- `reports/inspection-standards/dutch-evidence-scale-readiness.json`
- `reports/inspection-standards/dutch-evidence-gap-closure-plan.json`
- `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/product-vision.md`
- `docs/inspection-standards/report-only-generator-plan.md`
- `docs/inspection-standards/evidence-pack-source-contract.md`
- `docs/inspection-standards/report-only-validator-design.md`

## Allowed Output Files

INSPECT-10B may create or update only these output files:

- `archive/sprints/INSPECT-10B/INSPECT-10B-sprint-plan.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-planning-review.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-validation-log.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-lead-review-assignment.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-lead-review-round1.md`
- `archive/sprints/INSPECT-10B/INSPECT-10B-closure-log.md`
- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.md`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`

## Required Diagnostic Output Fields

The generated JSON and Markdown must include:

- `scope`
- `source_files_used`
- `evidence_status`
- `4veco_product_evidence`
- `weak_or_missing_evidence`
- `blockers`
- `school_owned_evidence_still_needed`
- `forbidden_inference`
- `public_external_sharing_status`
- `owner_next_action`
- `proof_required_to_close`
- `refusal_status`

## Stop Conditions

The generator must stop with an explicit refusal code for:

- `STOP_SOURCE_ALLOWLIST_MISMATCH`
- `STOP_OUTPUT_ALLOWLIST_MISMATCH`
- `STOP_MISSING_SOURCE`
- `STOP_HIDDEN_BLOCKER`
- `STOP_PACK_STRENGTH_REQUEST`
- `STOP_PUBLIC_EXTERNAL_REQUEST`
- `STOP_PERSONAL_DATA`
- `STOP_DOWNSTREAM_GATE_AUTHORITY`
- `STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE`
- `STOP_UNCITED_CLAIM`

## Implementation Steps

1. Create `build-scripts/inspection/build-dutch-diagnostic-report.js`.
2. Hard-code the INSPECT-10A source and output allowlists.
3. Read and parse only allowlisted sources.
4. Generate `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
   with required fields, blocker carry ledger, refusal policy, source citations,
   and safe-use boundary fields.
5. Generate `reports/inspection-standards/chapter-1-2-diagnostic-report.md`
   from the same in-memory report object.
6. Support a `--check` mode that regenerates content in memory and fails if the
   committed report files are stale.
7. Refuse any request for evidence-pack, public/external, teacher/school-facing,
   package/CI/dashboard, quality-ref, Scale Gate, lesson-output, personal-data,
   product-route, diagnostics/mastery/PV, student-use, or product-use authority.
8. Update only the allowlisted roadmap, ledger, end-state, and version-index
   files to record the INSPECT-10B implementation boundary.
9. Record validation and lead-review artifacts.

## Core-Requirement Checklist

| Core requirement | Status | Evidence |
|---|---|---|
| Product end-state cited | planned | Product End-State And Original Spec |
| Original sprint/gate spec cited | planned | Product End-State And Original Spec |
| Non-negotiables named | planned | Non-Negotiable Requirements |
| Exact INSPECT-10A source allowlist preserved | planned | Allowed Source Files |
| Exact INSPECT-10A output allowlist preserved | planned | Allowed Output Files |
| Required output fields included | planned | Required Diagnostic Output Fields |
| Stop/refusal codes implemented | planned | Stop Conditions |
| Blockers remain visible | planned | Finding Classification |
| No missing core requirement carried as PASS WITH FLAGS | planned | Planning review and lead review |
| No forbidden integration created | planned | Validation commands and diff review |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| INSPECT-10B is authorised only as a manual internal diagnostic generator. | `core_requirement_met` | Evidence-pack generation, teacher/school-facing output, public/external output, package/CI/dashboard/quality-ref/Scale Gate integration, generated lesson-output mutation, product-route adoption, diagnostics/mastery/PV, student/product-use authority | Creating the manual internal generator and Chapter 1.2 diagnostic report | Human review of any later sprint that widens surface, output audience, integration, or authority |
| `1.2.2` carries a generated-output substitute-mechanism blocker. | `scale_blocker` | Clean `1.2.2` target-equivalent closure, pack-strength reliance, and generator wording that hides the blocker | Blocker-visible diagnostic reporting | Corrected generated output or reviewed waiver/carry decision naming opgave 10b and allowed substitute-attractiveness wording |
| `1.2.4` carries frozen-yoghurt and orphaned-asset blockers. | `scale_blocker` | Clean integrated proof closure, pack-strength proof reliance, asset-cleanliness claims, and generator wording that hides the blockers | Blocker-visible diagnostic reporting | Corrected generated output or reviewed waiver/carry decision for frozen-yoghurt wording, plus corrected asset set or reviewed harmlessness decision |
| Chapter 1.2 accessibility evidence remains below pack-strength. | `scale_blocker` | Accessibility-strength claims, teacher/school-facing pack reliance, and pack-strength generator posture | Diagnostic reporting with gaps visible | Reviewed mobile/responsive proof, contrast/theme proof, semantic/PDF proof, keyboard/focus applicability, text-equivalent review, and internal-code/inclusive-language review |
| Chapter 1.2 support evidence remains below pack-strength. | `scale_blocker` | Support-strength, companion/advisory, next-action, teacher/school-facing pack reliance, and pack-ready claims | Diagnostic reporting with gaps visible | Reviewed hints/repair evidence, companion/advisory route evidence, next-action evidence, differentiation/support evidence, and product/school support-boundary evidence |
| Check-surface gate authority remains outside INSPECT-10B. | `scale_blocker` | Scale Gate 1, product-route adoption, diagnostics/mastery/PV, and student/product-use work | Ordinary scoped internal diagnostic generator work that does not reinterpret gate authority | Renewed human review confirming check-surface gate closure and explicitly naming any authority unlocked |

## Acceptance Tests

```powershell
npm.cmd run check:agent-worktree-safety -- --task INSPECT-10B-20260616 --agent codex --require-prefix codex/,agent/ --require-clean
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-10B/INSPECT-10B-sprint-plan.md
node build-scripts/inspection/build-dutch-diagnostic-report.js
node build-scripts/inspection/build-dutch-diagnostic-report.js --check
npm.cmd run check:scope-language
node build-scripts/roadmaps/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
git diff --check
npm.cmd run check:platform
```

## Closure Rule

INSPECT-10B may close only if the generator writes the diagnostic report pair,
all required fields are present, all blockers remain visible, no output falls
outside the INSPECT-10A allowlist, no missing core requirement is carried as
PASS WITH FLAGS, validation passes, and lead review returns `PASS`.
