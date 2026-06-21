# Sprint GOAL-DQS-CLOSURE-1: Dutch Quality Standards Closure Candidate

Status: implementation plan
Date: 2026-06-20
Sprint: `GOAL-DQS-CLOSURE-1`

## Goal

Deliver one Dutch quality-standards closure candidate for the current
authorised repository layer after INSPECT-11E/F merged. The sprint produces a
manual, internal, report-only closure-candidate pair, roadmap and ledger
updates, REV-STD-1 review records, specialist gates, final lead review, and a
fresh PR for human review.

This sprint closes only the current authorised Dutch internal/report-only
evidence-support and diagnostic layer through Chapter 1.3. It does not claim
full L4/L5 Dutch quality-control maturity and does not authorise evidence-pack,
teacher/school-facing, public/external, product-route, Scale Gate,
diagnostics/mastery/PV, student/product-use, personal-data, or
compliance/approval authority.

## Context

### Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Quality standards end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original sprint/gate spec:
  `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- Controlling recent gate:
  `archive/sprints/INSPECT-11EF/INSPECT-11EF-closure-log.md`
- Accepted prerequisite: INSPECT-11E/F merged in platform PR #119 after final
  lead PASS, specialist review, local validation, fresh green PR CI, and
  governed human-approved merge.

## Non-Negotiable Requirements

- Use REV-STD-1 in the plan, review packet, validation log, closure log, final
  lead review, and PR body.
- Cite product end-state and the original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for carried
  issues.
- PASS WITH FLAGS may not carry a missing core requirement.
- Use explicit source and output allowlists for the DQS closure candidate.
- Keep the generator/checker manual-only; do not add package scripts, CI hooks,
  dashboard gates, quality-ref integration, Scale Gate integration, or product
  route integration.
- Preserve the existing Chapter 1.2 and Chapter 1.3 internal diagnostic report
  semantics and authority boundaries.
- Keep Dutch source register and evidence profile draft/bounded status visible.
- Keep L4/L5, teacher/school-facing, public/external, product-route, Scale
  Gate, diagnostics/mastery/PV, student/product-use, personal-data,
  compliance, approval, OP0, PTA, summative, and inspection-readiness authority
  blocked.
- Do not mutate generated lesson output, protected references, source
  registries, external source records, lesson output, or school-owned evidence.
- Treat Book 1 Chapter 1.1 and Chapter 1.4 assembly-health issues as the
  separate `BOOK1-ASSEMBLY-HEALTH-1` carry item, not as a DQS closure blocker.

## Quality Standard

The quality floor is a deterministic, manually invoked, internal-only DQS
closure-candidate report pair that fulfils the specification above, cites the
product end-state and original sprint/gate spec, preserves rendered output and
student-facing authority boundaries, and provides proof through currentness
checks, refusal tests, roadmap/index checks, platform validation, specialist
reviews, and final lead review.

The sprint must make follow-up authority explicit. Missing L4/L5,
teacher/school-facing, public/external, product-route, Scale Gate,
diagnostics/mastery/PV, student/product-use, personal-data, or compliance
authority must be classified as future-authority blockers for those surfaces,
not as flags inside a PASS verdict for the current internal/report-only
closure candidate.

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Add a narrow manual DQS closure-candidate generator and checker with exact source/output allowlists. | include_now | Required to make the closure candidate deterministic and reviewable. |
| Update roadmap, ledger, and roadmap version index so INSPECT-11E/F is no longer stale and GOAL-DQS-CLOSURE-1 is the current human-review stop. | include_now | Required to avoid handing the owner a stale next-step map. |
| Add package scripts, CI hooks, dashboard gates, quality-ref or Scale Gate integration, product-route adoption, diagnostics/mastery/PV, student/product-use, or evidence-pack generation. | reject_scope_creep | Explicitly forbidden by the controlling gates and this sprint. |
| Start INSPECT-12/13/14 implementation from this closure candidate. | defer_named_follow_up | Those remain separate future sprints requiring fresh human authority and MORE_THAN_SATISFIED gates. |

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Product end-state and original sprint/gate spec cited | Closure report, sprint plan, human-review packet, and PR body cite both surfaces. | Lead review and final human packet | planned |
| Current authorised DQS layer inventoried | Closure-candidate report includes maturity assessment, authorised surfaces, source/profile status, and output boundary flags. | DQS checker, specialist reviews | planned |
| No missing core requirement hidden in PASS WITH FLAGS | Core checklist marks current-layer requirements met and future-authority items as blockers for future surfaces. | Final lead review | planned |
| Findings classified | Report and review packets classify findings and include `blocks`, `does_not_block`, and `proof_required_to_close`. | DQS checker and final lead review | planned |
| Exact source/output allowlists | Generator exports exact `SOURCE_PATHS` and `OUTPUT_PATHS`; checker verifies order, hashes, bytes, and output list. | `check-dqs-closure-candidate.js` | planned |
| Forbidden authority refused | Generator refuses public/external, teacher/school-facing, evidence-pack, personal-data, Scale/dashboard/quality-ref/product-route/diagnostics, lesson-output, and protected-reference requests. | Refusal matrix | planned |
| Roadmap and ledger no longer stale | Roadmap, ledger, and roadmap version index record PR #119 as merged and GOAL-DQS-CLOSURE-1 as the current closure-candidate review stop. | Roadmap version index checker | planned |
| Specialist gates complete | Teacher/usefulness, legal/privacy, and Dutch quality-inspection reviewers return `MORE_THAN_SATISFIED` or corrections are applied and rerun. | Specialist-gate results | planned |
| Final lead review complete | Final lead reviewer inspects complete implementation, validations, specialist gates, generated reports, PR body, and authority boundaries. | Final lead review | planned |
| Human review packet complete | Packet states decision requested, core checklist, findings, validation, proof required to close, and forbidden inferences. | Human owner review | planned |

## Allowed paths

The sprint may read only the explicit DQS closure-candidate source allowlist:

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

The sprint may write only:

- `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-sprint-plan.md`
- `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-planning-review.md`
- `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-validation-log.md`
- `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-correction-log.md`
- `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-specialist-gate-results.md`
- `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-final-lead-review.md`
- `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-human-review-packet.md`
- `archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-closure-log.md`
- `build-scripts/inspection/build-dqs-closure-candidate.js`
- `build-scripts/inspection/check-dqs-closure-candidate.js`
- `reports/inspection-standards/dutch-quality-standards-closure-candidate.md`
- `reports/inspection-standards/dutch-quality-standards-closure-candidate.json`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`
- generated index artifacts only if the repository checkers require them.

## Forbidden paths

- `references/machine/`
- `references/external/`
- Protected source registries and external-reference surfaces.
- Lesson output mutation under `../4veco-lessen/`.
- Generated lesson-output scanning.
- Evidence-pack outputs.
- Teacher/school-facing, public/external, product-route, Scale Gate,
  dashboard-gate, quality-ref, diagnostics/mastery/PV, student/product-use,
  personal-data, compliance, approval, OP0, PTA, summative,
  inspection-readiness, or school-SKA artifacts.

## Inputs

- Merged INSPECT-11E/F implementation and closure record from PR #119.
- Product end-state, product vision, and quality-standards end-state.
- Current Dutch source register and evidence profile, both draft/bounded.
- Existing report-only schema/validator and internal diagnostic operating
  procedure.
- INSPECT-7 bounded sample, Chapter 1.2 diagnostic report, Chapter 1.3
  diagnostic report, and prior readiness/diagnostic packets.
- Human instruction to deliver the complete DQS closure candidate with
  subagent quality inspection before human review.

## Outputs

- Manual DQS closure-candidate generator and checker.
- `reports/inspection-standards/dutch-quality-standards-closure-candidate.md`
- `reports/inspection-standards/dutch-quality-standards-closure-candidate.json`
- GOAL-DQS-CLOSURE-1 sprint plan, validation log, correction log, specialist
  gate results, final lead review, human-review packet, and closure log.
- Roadmap, ledger, and roadmap version index updates that record INSPECT-11E/F
  as merged and this closure candidate as the current human-review stop.
- Fresh platform PR with green remote CI before returning for human review.

## Operationalized sprint procedure

1. Create the GOAL-DQS-CLOSURE-1 sprint plan and run the sprint-plan checker.
   Stop and correct if the plan omits REV-STD-1 fields, product end-state,
   original sprint/gate spec, allowed/forbidden paths, or proof required to
   close.
2. Run a lead-review subagent against the plan and closure-candidate
   architecture. Stop and correct if the reviewer finds scope expansion,
   missing core requirements, or an unclear validation route.
3. Finalize the manual generator/checker and generated DQS closure-candidate
   report pair. Stop if any output is outside the allowlist or if the report
   weakens draft source/profile status or downstream authority blockers.
4. Update roadmap, ledger, and version index so the next-step map is current.
   Stop if future INSPECT-12/13/14 work becomes authorised by implication.
5. Run local validation and refusal checks, then record the validation log and
   correction log.
6. Run teacher/usefulness, legal/privacy, and Dutch quality-inspection
   specialist subagents. Treat `REVISE` or ordinary `PASS` as insufficient for
   this quality-standards gate; correct and rerun until all three return
   `MORE_THAN_SATISFIED`.
7. Run final lead review on the complete implementation, test evidence,
   generated reports, specialist gate, and PR packet. Stop and correct any
   missing core requirement or authority-boundary defect.
8. Open one platform PR, keep it fresh against `main`, wait for remote CI, and
   return for human review only after the PR is open, mergeable, fresh, and
   green.

## Acceptance tests

The legacy `check-sprint-bundle` command is retained as deterministic
visibility text for the archive sprint layout; it is not closure proof because
the helper expects the older bundle layout rather than this archived
REV-STD-1 packet.

Visibility-only archive-layout command:

```bash
node build-scripts/sprints/check-sprint-bundle.js GOAL-DQS-CLOSURE-1 --complete
```

Required executable checks:

```bash
npm.cmd run check:agent-worktree-safety -- --check --task GOAL-DQS-CLOSURE-1 --agent codex-main --require-prefix codex/,agent/
node build-scripts/sprints/check-sprint-plan.js archive/sprints/GOAL-DQS-CLOSURE-1/GOAL-DQS-CLOSURE-1-sprint-plan.md
node build-scripts/inspection/build-dqs-closure-candidate.js --check
node build-scripts/inspection/check-dqs-closure-candidate.js
node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
git diff --check
npm.cmd run check:platform
```

## Proof Required to Close

Closure proof must combine review evidence, validator evidence, and test
evidence; the sprint may not close on narrative acceptance alone.

- Sprint-plan checker PASS and lead planning review PASS.
- DQS closure-candidate generator `--check` PASS.
- DQS closure-candidate checker PASS, including exact source/output
  allowlists, currentness, boundary fragments, finding classification, and
  refusal matrix.
- Existing Dutch diagnostic report `--check --scope all` PASS and stability
  checker PASS for Chapter 1.2/1.3 regression protection.
- Roadmap version index, URL index, report JSON, scope-language, diff hygiene,
  and platform test validation PASS.
- Teacher/usefulness, legal/privacy, and Dutch quality-inspection reviewers
  return `MORE_THAN_SATISFIED` after any correction.
- Final lead reviewer returns PASS with no missing core requirement and no
  authority-boundary blocker.
- PR is open, fresh against `main`, mergeable, and green before human review.

## Rollback plan

Before merge, close the PR or revert the branch commits. After merge, revert
the GOAL-DQS-CLOSURE-1 commit(s), removing the DQS closure-candidate
generator/checker, generated report pair, sprint records, and roadmap/ledger
version updates. No protected references, source registries, generated lesson
output, package scripts, CI hooks, dashboard gates, quality-ref integrations,
Scale Gate integrations, or product routes are changed by this sprint.

## Human review required

Yes. Human review receives the complete GOAL-DQS-CLOSURE-1 closure candidate
only after implementation, validation, specialist gates, final lead review,
PR publication, freshness, mergeability, and remote CI are complete.

The human decision may accept, revise, or reject closure of the current
authorised internal/report-only DQS layer. It must not unlock evidence-pack,
teacher/school-facing, public/external, Scale Gate, product-route,
diagnostics/mastery/PV, student/product-use, personal-data, non-Dutch,
compliance, approval, OP0, PTA, summative, inspection-readiness, or school-SKA
authority.
