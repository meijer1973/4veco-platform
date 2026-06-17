# Sprint INSPECT-10C: Diagnostic Generator Review / Stability Hardening

Status: implementation plan
Date: 2026-06-16
Sprint: `INSPECT-10C`

## Goal

Review and harden the merged INSPECT-10B manual internal diagnostic generator
before any broader diagnostic scope is considered. INSPECT-10C may only make
the existing Chapter 1.2 internal diagnostic report pair more stable,
deterministic, and reviewable.

The goal is not to create an evidence pack, teacher/school-facing output,
public/external output, package script, CI/build gate, dashboard gate,
quality-ref integration, Scale Gate integration, product-route adoption,
diagnostics/mastery/PV authority, student-use authority, product-use
authority, source-registry mutation, generated lesson-output mutation, or
personal-data processing.

## Context

PR #79 merged INSPECT-10B as an internal diagnostic generator only. Human review
approved the merge after final freshness, CI, and comment checks, and named
INSPECT-10C as the next permitted sprint. The carried Chapter 1.2 blockers from
INSPECT-10B remain active: `1.2.2`, `1.2.4`, accessibility/support, and
check-surface authority.

INSPECT-10C addresses the review/stability question now exposed by the merged
generator: does the actual generated Markdown/JSON report remain aligned,
deterministic, blocker-visible, source-hash stable, refusal-covered, and
bounded to manual internal diagnostic use after regeneration?

## Quality Standard

The quality floor for this sprint is faithful stability hardening of the
INSPECT-10B specification without authority creep. The rendered output must
remain an internal diagnostic report that keeps all blockers visible, cites
source paths for claims, and remains safe for review. It must not become
student-facing, teacher/school-facing, public/external, pack-strength, or
product-use proof. Any stronger surface is a named follow-up, not implicit
scope. Closure proof must include validator/test evidence, lead review, and the
required specialist subagent review if semantic output or generator behavior
changes.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Post-merge owner action is stable | Generator and report no longer instruct the owner to send already-merged INSPECT-10B for review | Generated Markdown/JSON inspection and stability checker | planned |
| Markdown/JSON alignment is explicit | Markdown renders the report output-file list present in JSON | Stability checker validates alignment | planned |
| Source hashes remain stable | Stability checker recomputes source file SHA-256 and byte counts | `check-dutch-diagnostic-report-stability.js` | planned |
| Refusal cases are systematic | Stability checker covers public/external, evidence-pack, teacher, personal-data, downstream, CI/build/package, dashboard, quality-ref, lesson-output, and protected-reference requests | Refusal case pass/fail output | planned |
| Blockers remain visible | Required Chapter 1.2 and check-surface blocker IDs remain in JSON and Markdown | Stability checker and lead review | planned |
| No missing core requirement carried as PASS WITH FLAGS | Closure must revise on missing stability, blocker, refusal, or boundary proof | Lead review and closure log | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Add manual diagnostic stability checker | `include_now` | In scope; manual checker only, no package/CI hook |
| Update stale post-merge owner action | `include_now` | In scope; keeps generated output current without widening authority |
| Render output-file list in Markdown | `include_now` | In scope; improves Markdown/JSON alignment |
| Add package script or CI gate for the checker | `defer_named_follow_up` | Requires later human-reviewed authority |
| Generate evidence packs or teacher/school-facing reports | `reject_scope_creep` | Explicitly blocked |
| Read generated lesson output or protected references | `reject_scope_creep` | Explicitly blocked |

## Allowed paths

- `archive/sprints/INSPECT-10C/INSPECT-10C-sprint-plan.md`
- `archive/sprints/INSPECT-10C/INSPECT-10C-planning-review.md`
- `archive/sprints/INSPECT-10C/INSPECT-10C-validation-log.md`
- `archive/sprints/INSPECT-10C/INSPECT-10C-lead-review-assignment.md`
- `archive/sprints/INSPECT-10C/INSPECT-10C-lead-review-round1.md`
- `archive/sprints/INSPECT-10C/INSPECT-10C-closure-log.md`
- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `build-scripts/inspection/check-dutch-diagnostic-report-stability.js`
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
- `../4veco-lessen/` except read-only status checks
- Any generated lesson-output path
- Any package, CI/build, dashboard, quality-ref, or Scale Gate integration path
- Any student/product-use, product-route, diagnostics/mastery/PV, public/external, or teacher/school-facing output path

## Inputs

- PR #79 human review verdict and merge decision
- INSPECT-10B sprint plan, validation log, lead review, closure log, and generated report pair
- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.md`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- Quality-standards roadmap, ledger, and end-state

## Outputs

- Manual diagnostic stability checker
- Hardened Chapter 1.2 internal diagnostic report JSON/Markdown pair
- INSPECT-10C sprint artifacts
- Allowlisted roadmap, ledger, end-state, and version-index updates

## Operationalized sprint procedure

1. Stop if `main` is stale, the branch is not under the allowed agent prefix,
   or the worktree is dirty with unrelated changes.
2. Keep changes restricted to the allowed paths and preserve all INSPECT-10B
   internal-only boundaries.
3. Add a manual stability checker that reruns generator `--check`, recomputes
   source hashes, compares generator allowlists to report metadata, validates
   Markdown/JSON alignment, checks required blockers, and exercises refusal
   cases.
4. Update only stale or missing internal diagnostic report details needed for
   stability review; do not add new surfaces or downstream authority.
5. Run acceptance validators and record command evidence. If any validator
   fails because a core requirement is missing, stop for correction rather than
   carrying it as PASS WITH FLAGS.
6. Perform REV-STD-1 lead review with product end-state, original sprint/gate
   spec, non-negotiables, core checklist, finding classifications, and
   `blocks` / `does_not_block` / `proof_required_to_close` fields.
7. Because INSPECT-10C changes generator behavior/output vocabulary, rerun the
   teacher/usefulness, legal/privacy/claims, and Dutch quality-inspection
   specialist subagent gate once before human review.
8. Push the branch and open a PR for human review. Human review must decide
   only whether INSPECT-10C safely hardens the internal diagnostic generator;
   it must not unlock downstream surfaces.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-10C/INSPECT-10C-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-10C
node build-scripts/inspection/build-dutch-diagnostic-report.js --check
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
npm run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
git diff --check
npm run check:platform
```

The legacy sprint bundle checker is listed for protocol completeness but is
not expected to validate archive-based sprint packets unless the helper is
later updated.

## Proof Required to Close

Closure proof to close INSPECT-10C requires the manual stability checker to pass,
the diagnostic report pair to be current, source hashes to match,
Markdown/JSON alignment to be proved, blockers to remain visible, refusal cases
to return the expected stop codes, no forbidden path or downstream authority to
be introduced, lead review to pass, validator/test evidence to be recorded,
and the required specialist subagent gate to return `MORE_THAN_SATISFIED`.

## Rollback plan

Before merge, rollback is branch-local: revert the INSPECT-10C commit or close
the PR. After merge, rollback is to revert the INSPECT-10C hardening commit,
which restores the INSPECT-10B generator/report state. No package/CI,
dashboard, quality-ref, Scale Gate, generated lesson-output, source-registry,
or downstream product path is changed.

## Human review required

Yes. Human review must confirm that INSPECT-10C is only diagnostic generator
review/stability hardening and does not authorise evidence packs,
teacher/school-facing output, public/external output, Scale Gate,
product-route adoption, diagnostics/mastery/PV, student/product-use, or
pack-strength claims.
