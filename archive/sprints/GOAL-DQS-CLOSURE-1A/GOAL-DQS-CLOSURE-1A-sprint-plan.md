# Sprint GOAL-DQS-CLOSURE-1A: Original Closure Contract Completion

Status: implementation plan
Date: 2026-06-20
Sprint: `GOAL-DQS-CLOSURE-1A`

## Goal

Complete the original GOAL-DQS-CLOSURE-1 contract on the same branch and PR
after PR #124 human review returned `REVISE`. The prior GOAL-DQS-CLOSURE-1
work is accepted as a strong internal-layer closure component, but this sprint
must add the missing Dutch multi-scope roll-up, internal school-evidence-pack
candidate, and formal closure-policy decision before returning for human
review.

The sprint must stay Dutch-only and internal/manual. It must not begin
international work, teacher/school-facing distribution, public output, product
routes, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data
processing, or compliance/approval claims.

## Context

### Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Quality standards end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original sprint/gate spec:
  `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- Current PR human review input:
  `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-human-review-packet.md`
  plus PR #124 review verdict dated 2026-06-20.
- Prior component:
  `reports/inspection-standards/dutch-quality-standards-closure-candidate.md`
  and `.json`.

## Non-Negotiable Requirements

- Use REV-STD-1 in the plan, generated reports, validation log, review
  records, closure log, PR body, and human-review packet.
- Cite product end-state and the original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings and carried issues.
- Include `blocks`, `does_not_block`, and `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.
- Add all three required artifact pairs:
  Dutch multi-scope roll-up, internal school-evidence-pack candidate, and
  closure candidate.
- The internal school-evidence-pack candidate must not be authorised for
  school or public distribution.
- The closure candidate must choose exactly one of:
  `CLOSE_INTERNAL_SYSTEM`,
  `AUTHORISE_BOUNDED_SCHOOL_PACK_TRIAL`,
  `REMEDIATE_BEFORE_CLOSURE`.
- The decision must be based on both the roll-up and the internal pack
  candidate, not only on governance maturity.
- The generator/checker must use exact source and output allowlists.
- All authority flags must remain false.
- Keep school-owned evidence, draft source/profile status, forbidden
  inferences, and downstream blockers visible.
- Keep no public/school-facing authorisation and no international scope.
- Preserve the existing refusal matrix and add the required new refusal cases.

## Quality Standard

The quality floor is a deterministic, manually invoked, internal-only Dutch
closure packet that fulfils the original specification, not merely the narrower
internal-layer component. The packet must be strong enough for a reviewer to
judge the final closure-policy decision from the generated Markdown/JSON
artifacts, without hidden missing requirements, stale rendered output claims,
or student-facing authority drift.

The proof standard is validator evidence, refusal evidence, exact allowlists,
specialist subagent review, final lead PASS, refreshed PR freshness, green
remote CI, and mergeability. Follow-up authority must remain explicit: any
teacher/school-facing, public, product-route, Scale Gate, diagnostics/mastery/
PV, student/product-use, international, personal-data, compliance, approval,
OP0, PTA, summative, or inspection-readiness step requires a later human-
authorised sprint.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Original closure contract restored | Roll-up pair, internal pack candidate pair, updated closure candidate pair | DQS checker and final lead review | planned |
| Product end-state and original spec cited | All generated reports and review packets cite both | Sprint-plan checker and final lead review | planned |
| Core checklist complete | Generated closure candidate includes a core-requirement checklist for all 1A deliverables | DQS checker | planned |
| Multi-scope roll-up complete | Chapter 1.1, Chapter 1.2, Chapter 1.3, and system layer each carry required evidence/blocker fields | Lead reviewer and DQS checker | planned |
| Internal pack candidate safe-use boundary visible | First screen contains the exact required warning text and all required sections | Teacher, legal/privacy, Dutch quality-inspection, accessibility reviewers | planned |
| Explicit closure-policy decision | Closure candidate chooses exactly one allowed decision and explains basis from roll-up and pack candidate | DQS checker and final lead review | planned |
| All authority flags false | Top-level and output-boundary flags remain false in every generated JSON report | DQS checker | planned |
| Exact source/output allowlists | Generator exports and checker verifies exact source and output path lists | `check-dqs-closure-candidate.js` | planned |
| Refusal matrix expanded | Existing refusal cases plus `--publish`, `--school-pack`, `--external-share`, `--inspection-ready`, `--compliant`, `--op0-complete` | DQS checker | planned |
| Specialist corrections complete | Material findings are logged, corrected, validated, and re-reviewed | Specialist gate results and correction log | planned |
| PR human-review ready | Branch is 0 behind current main, PR is non-draft, mergeable, and fresh CI is green | GitHub PR evidence | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Refactor the existing DQS generator to emit one deterministic bundle with all three report pairs. | include_now | Required because the checker must verify consistency across roll-up, pack candidate, and closure decision. |
| Add a bounded internal pack candidate that is readable by teachers/school leaders but not authorised for distribution. | include_now | Required original deliverable; safe-use warnings and false authority flags prevent scope drift. |
| Authorise a school pack trial from this sprint. | defer_named_follow_up | Allowed only if the final decision explicitly chooses that result; the sprint itself must not start a trial. |
| Start international roadmap work after local implementation. | reject_scope_creep | Explicitly forbidden until the owner accepts and merges the completed Dutch closure packet. |
| Add package scripts, CI hooks, dashboard gates, quality-ref, Scale Gate, product routes, diagnostics/mastery/PV, or student/product-use integration. | reject_scope_creep | Not part of the original closure contract and explicitly blocked. |

## Allowed paths

The sprint may read the DQS source allowlist used by the manual generator:

- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `references/data/inspection-standards/source-register.json`
- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `docs/inspection-standards/nl-vo-evidence-model.md`
- `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md`
- `docs/inspection-standards/teacher-facing-evidence-pack-template.md`
- `build-scripts/inspection/validate-inspection-evidence.js`
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-closure-log.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-final-lead-review.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-validation-log.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-specialist-gate-results.md`
- `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json`
- `reports/inspection-standards/internal-diagnostic-scope-readiness.json`
- `reports/inspection-standards/chapter-1-3-readiness-closure.json`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- `reports/inspection-standards/chapter-1-3-diagnostic-report.json`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/product-vision.md`

The sprint may write:

- `archive/sprints/GOAL-DQS-CLOSURE-1A/`
- `build-scripts/inspection/build-dqs-closure-candidate.js`
- `build-scripts/inspection/check-dqs-closure-candidate.js`
- `reports/inspection-standards/dutch-quality-standards-rollup.md`
- `reports/inspection-standards/dutch-quality-standards-rollup.json`
- `reports/inspection-standards/dutch-school-evidence-pack-candidate.md`
- `reports/inspection-standards/dutch-school-evidence-pack-candidate.json`
- `reports/inspection-standards/dutch-quality-standards-closure-candidate.md`
- `reports/inspection-standards/dutch-quality-standards-closure-candidate.json`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`
- generated repository maps/indexes required by closure checks.

## Forbidden paths

- `references/machine/`
- `references/external/`
- Protected source registries and external-reference surfaces.
- Lesson output mutation under `../4veco-lessen/`.
- Generated lesson-output scanning.
- Teacher/school-facing distribution artifacts.
- Public/external artifacts.
- Package scripts, CI hooks, dashboard gates, quality-ref integration, Scale
  Gate integration, product-route adoption, diagnostics/mastery/PV,
  student/product-use, personal-data processing, non-Dutch standards work,
  compliance, approval, OP0, PTA, summative, inspection-readiness, or
  school-SKA artifacts.

## Inputs

- PR #124 review verdict: technical content PASS; goal completion REVISE;
  merge HOLD.
- Accepted GOAL-DQS-CLOSURE-1 internal-layer closure component.
- Product end-state, product vision, quality-standards end-state, and original
  quality-standards roadmap.
- Draft Dutch source register and evidence profile.
- INSPECT-7 bounded Chapter 1.1 sample.
- INSPECT-11/11D/11E/F readiness, closure, diagnostic, and specialist records.
- Chapter 1.2 and Chapter 1.3 internal diagnostic report pairs.

## Outputs

- `reports/inspection-standards/dutch-quality-standards-rollup.md`
- `reports/inspection-standards/dutch-quality-standards-rollup.json`
- `reports/inspection-standards/dutch-school-evidence-pack-candidate.md`
- `reports/inspection-standards/dutch-school-evidence-pack-candidate.json`
- Updated `reports/inspection-standards/dutch-quality-standards-closure-candidate.md`
- Updated `reports/inspection-standards/dutch-quality-standards-closure-candidate.json`
- Updated manual DQS generator and checker.
- GOAL-DQS-CLOSURE-1A sprint plan, planning review, validation log, correction
  log, specialist gate results, final lead review, human-review packet, and
  closure log.
- Updated roadmap, ledger, roadmap version index, and repository maps.
- Same PR #124 refreshed, green, non-draft, and mergeable.

## Operationalized sprint procedure

1. Refresh the branch against `origin/main`, publish the rebase to the same PR
   with lease protection, and claim the `GOAL-DQS-CLOSURE-1A` worktree lock.
   Stop if the branch is dirty, shared, on `main`, or behind current main after
   refresh.
2. Write this sprint plan and run the sprint-plan checker. Stop and correct if
   REV-STD-1 fields, product end-state, original sprint/gate spec, deliverable
   paths, forbidden paths, or proof required to close are missing.
3. Run a lead-review subagent on the plan, roll-up architecture, and source
   completeness while implementation proceeds. Stop and correct any missing
   core requirement before final review.
4. Refactor the DQS generator/checker to emit and verify all three artifact
   pairs from exact source and output allowlists.
5. Generate the roll-up, internal pack candidate, and updated closure
   candidate. Stop if any report weakens false authority flags, school-owned
   evidence boundaries, draft source/profile status, or Dutch-only scope.
6. Validate currentness, source/output allowlists, required safe-use text,
   refusal matrix, diagnostic report stability, scope language, roadmap index,
   URL index, report JSON, diff hygiene, and platform tests.
7. Run teacher/economics, legal/privacy, Dutch quality-inspection,
   accessibility, and final lead subagents. Treat material findings as
   blockers; correct, validate, and re-review before human review.
8. Refresh repository maps and PR body, commit the intended files, push the
   same branch, wait for fresh `platform-ci / validate-platform`, and verify PR
   #124 is 0 behind, non-draft, mergeable, and green.
9. Return for human review only after the complete closure packet is ready.

## Acceptance tests

Visibility-only archive-layout command:

```bash
node build-scripts/sprints/check-sprint-bundle.js GOAL-DQS-CLOSURE-1A --complete
```

Required executable checks:

```bash
npm.cmd run check:agent-worktree-safety -- --check --task GOAL-DQS-CLOSURE-1A --agent codex-main --require-prefix codex/,agent/
node build-scripts/sprints/check-sprint-plan.js archive/sprints/GOAL-DQS-CLOSURE-1A/GOAL-DQS-CLOSURE-1A-sprint-plan.md
node build-scripts/inspection/build-dqs-closure-candidate.js --check
node build-scripts/inspection/check-dqs-closure-candidate.js
node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
git diff --check
git diff --check origin/main...HEAD
npm.cmd run check:platform
```

## Proof Required to Close

Closure proof must combine review evidence, validator evidence, generated
artifact evidence, PR freshness, and remote CI evidence.

- Sprint plan checker PASS.
- Worktree safety check PASS for `GOAL-DQS-CLOSURE-1A`.
- DQS generator `--check` PASS for six outputs.
- DQS checker PASS for exact allowlists, required safe-use language, all
  authority flags false, draft source/profile visibility, roll-up/pack/closure
  consistency, no public/school authorisation, no international scope, and
  refusal matrix.
- Existing diagnostic report generator `--check --scope all` PASS.
- Diagnostic stability checker PASS.
- Scope-language, roadmap version index, URL index, report JSON, diff hygiene,
  and platform validation PASS.
- Lead planning/architecture reviewer PASS.
- Teacher/economics, legal/privacy, Dutch quality-inspection, and accessibility
  reviewer corrections are closed.
- Final lead reviewer returns PASS with no missing core requirement.
- PR #124 is open, non-draft, 0 behind current main, mergeable, and has fresh
  green `platform-ci / validate-platform` on the final head.

## Rollback plan

Before merge, close or revise PR #124. After merge, revert the GOAL-DQS-CLOSURE
branch commits that added the 1A generator/checker expansion, three report
pairs, sprint records, roadmap/ledger/version-index changes, and regenerated
maps. No protected references, source registries, generated lesson output,
package scripts, CI hooks, dashboard gates, quality-ref integrations, Scale
Gate integrations, product routes, personal data, international work, or
teacher/school/public outputs are changed by this sprint.

## Human review required

Yes. Human review receives the complete GOAL-DQS-CLOSURE-1A packet only after
all three artifact pairs exist, DQS checks and refusal checks pass, specialist
corrections are closed, final lead returns PASS, the branch is 0 behind current
main, fresh PR CI is green, PR #124 is mergeable and non-draft, and the closure
decision is explicit.

The human decision may accept or revise the completed closure packet. It must
not unlock downstream product, evidence-pack, teacher/school-facing, public,
Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data,
international, compliance, approval, OP0, PTA, summative, inspection-readiness,
or school-SKA authority unless a later sprint explicitly authorises that exact
scope.
