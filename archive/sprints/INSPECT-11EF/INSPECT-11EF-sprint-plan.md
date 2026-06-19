# Sprint INSPECT-11E/F: Chapter 1.3 Internal Diagnostic Onboarding And Stability Closure

Status: implementation plan
Date: 2026-06-19
Sprint: `INSPECT-11E/F`

## Goal

Deliver one complete internal diagnostic onboarding track for Book 1 Chapter
1.3. Phase 1 defines the implementation plan and architecture. Phase 2
implements the narrow multi-scope diagnostic generator, generates the
Chapter 1.3 internal diagnostic report pair, protects the existing Chapter 1.2
report semantically, and closes the validation/review packet.

This sprint must not stop for human review after planning alone. Human review
is requested only after implementation, generated reports, stability/refusal
tests, specialist corrections, final lead review, a fresh PR, and remote CI.

## Context

### Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Quality standards end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original sprint/gate spec:
  `archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md`
- Human accepted prerequisite:
  INSPECT-11D state A accepted; platform PR #114 and lesson PR #28 merged.
- Controlling closure packet:
  `reports/inspection-standards/chapter-1-3-readiness-closure.md`
  and `.json`
- Operating procedure to update:
  `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`

## Non-Negotiable Requirements

- Use REV-STD-1 in planning, reviews, closure, and PR packet.
- Cite product end-state and original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.
- Preserve Chapter 1.2 diagnostic report semantics.
- Generate a blocker-visible Chapter 1.3 internal diagnostic report pair.
- Use explicit per-scope source and output allowlists.
- Use deterministic currentness/stability checks.
- Refuse forbidden audiences, claims, integrations, and authority jumps.
- Keep the tool manual-only and internal-only.
- Do not add a package script, CI hook, dashboard gate, quality-ref
  integration, Scale Gate integration, product-route adoption,
  diagnostics/mastery/PV, student/product-use, personal-data processing,
  evidence-pack generation, teacher/school-facing output, public/external
  output, or compliance/approval/inspection-readiness claims.
- Do not read generated lesson output except where the approved Chapter 1.3
  scope explicitly lists exact read-only lesson Markdown files needed for
  line-range proof.
- Do not use directory globbing or implicit source discovery.
- Do not mutate protected references, source registries, or lesson output.
- Record pre-existing Chapter 1.1 and Chapter 1.4 Book 1 assembly failures as
  a separate backlog item, not as an INSPECT-11E/F blocker.

## Quality Standard

The quality floor is a functioning, manually invoked, internal-only diagnostic
report system for Chapter 1.2 and Chapter 1.3. The implementation must fulfil
the specification above, keep rendered output claims internal-only, block
student-facing and teacher/school-facing use, and provide proof through
deterministic checks plus specialist review. Any follow-up must be classified
as either non-blocking maintenance or a separate named backlog item; no PASS
WITH FLAGS verdict may carry a missing core requirement.

The system must be more stable than the previous hard-coded Chapter 1.2 script:
scope descriptors must declare their own sources, outputs, status vocabulary,
blockers, and output builder, and the stability checker must prove that
Chapter 1.2 did not change semantically while Chapter 1.3 was onboarded.

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Factor the hard-coded Chapter 1.2 generator into explicit Chapter 1.2 and Chapter 1.3 descriptors. | include_now | Required to avoid copy/paste drift and prove per-scope allowlists. |
| Add richer school-evidence scoring beyond the internal route-local diagnostic display. | defer_named_follow_up | This belongs to a later school-owned evidence or inspection-readiness sprint and remains blocked here. |
| Add package scripts, CI hooks, dashboard gates, public output, or Scale Gate/product-route integration. | reject_scope_creep | Explicitly forbidden by INSPECT-11D and this sprint. |

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Exact Chapter 1.3 input allowlist | Scope descriptor lists every allowed source path, including only exact read-only lesson Markdown paths needed for proof ranges. | Lead plan review and stability checker | planned |
| Exact output allowlist | Scope descriptor lists only `chapter-1-3-diagnostic-report.md/json` for the new generated report pair. | Generator and checker | planned |
| Allowed diagnostic status vocabulary | Descriptor/report JSON lists statuses and meanings. | Checker verifies required statuses in JSON/Markdown | planned |
| INSPECT-11D proof records map to report fields | Route-local proof records become `4veco_product_evidence` rows with operation chain, answer form, line ranges, and boundary. | Teacher/economics review | planned |
| Blocker display | Report visibly carries school-owned evidence, forbidden inferences, accessibility/support limits, check-surface separation, owner next action, and proof required to close. | Legal/privacy, Dutch quality-inspection, final lead review | planned |
| Refusal and stop conditions | Generator refuses forbidden audiences/claims/integrations and unknown scopes/outputs. | Stability/refusal tests | planned |
| Chapter 1.2 regression contract | Checker proves semantic Chapter 1.2 fields are unchanged while allowing deterministic currentness metadata repair. | Chapter 1.2 regression proof | planned |
| Source traceability policy | Report cites authored-registry rule and forbids stale blueprint override. | Dutch quality-inspection review | planned |
| Review gates | Lead plan review, implementation specialists, final lead review, PR CI, and human review only after full implementation. | Review packet | planned |

## Phase 1 - INSPECT-11E Implementation Plan

Phase 1 outputs:

- `archive/sprints/INSPECT-11EF/INSPECT-11EF-sprint-plan.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-onboarding-plan.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-onboarding-plan.json`
- lead-review subagent result for the plan/architecture

Phase 1 must define:

- exact Chapter 1.3 input allowlist;
- exact output allowlist;
- allowed diagnostic status vocabulary;
- mapping from INSPECT-11D proof records to report fields;
- blocker-display requirements;
- refusal and stop conditions;
- regression contract protecting Chapter 1.2 output;
- source-traceability policy;
- validation and review gates.

If the lead reviewer finds no scope expansion or missing core requirement, the
main agent proceeds directly to Phase 2 without returning to the human owner.

## Phase 2 - INSPECT-11F Narrow Implementation

Required implementation outputs:

```text
reports/inspection-standards/chapter-1-3-diagnostic-report.md
reports/inspection-standards/chapter-1-3-diagnostic-report.json

updated manual generator or narrowly factored multi-scope generator
updated stability/currentness checker
Chapter 1.2 regression proof
Chapter 1.3 refusal tests
INSPECT-11E/F validation, review, correction, and closure records
```

Preferred architecture:

- explicit scope descriptor for Chapter 1.2;
- explicit scope descriptor for Chapter 1.3;
- no directory globbing;
- no implicit source discovery;
- no generated lesson-output scanning;
- no public, external, teacher-facing, student-facing, package, CI, dashboard,
  quality-ref, Scale Gate, or product-route mode.

## Allowed paths

Chapter 1.2 scope keeps the existing source and output allowlists unless
changed only for deterministic currentness metadata repair.

Chapter 1.3 scope may read only:

- `reports/inspection-standards/chapter-1-3-readiness-closure.json`
- `reports/inspection-standards/chapter-1-3-readiness-closure.md`
- `docs/inspection-standards/chapter-1-3-source-traceability.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-validation-log.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-specialist-gate-results.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-lead-review-final.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-closure-log.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/product-vision.md`
- Exact read-only lesson Markdown proof files:
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod/1.3.1 Aanbod – opgaven.md`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod/1.3.1 Aanbod – antwoorden.md`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht/1.3.2 Marktevenwicht – opgaven.md`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht/1.3.2 Marktevenwicht – antwoorden.md`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht/1.3.3 Verschuivingen en nieuw evenwicht – opgaven.md`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht/1.3.3 Verschuivingen en nieuw evenwicht – antwoorden.md`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.4 Gemengde opgaven/1.3.4 Gemengde opgaven – opgaven.md`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.4 Gemengde opgaven/1.3.4 Gemengde opgaven – antwoorden.md`

The sprint may write only the output paths listed below and generated index
artifacts needed to keep roadmap/report navigation current.

## Forbidden paths

- `references/machine/`
- `references/external/`
- Any protected source registry or external-reference surface.
- Lesson output mutation under `../4veco-lessen/`.
- Any generated lesson-output scan outside the exact read-only Chapter 1.3
  Markdown proof paths listed in `## Allowed paths`.
- Evidence-pack, public, teacher/school-facing, product-route, Scale Gate,
  dashboard-gate, quality-ref, diagnostics/mastery/PV, student/product-use, or
  personal-data artifacts.

## Inputs

- Accepted INSPECT-11D state A and merged platform PR #114 / lesson PR #28.
- Existing Chapter 1.2 generator, checker, report pair, and operating
  procedure.
- Chapter 1.3 readiness closure packet and source-traceability note.
- Exact read-only Chapter 1.3 lesson Markdown proof files listed in
  `## Allowed paths`.
- Product end-state, product vision, and quality-standards end-state.

## Outputs

- `archive/sprints/INSPECT-11EF/INSPECT-11EF-sprint-plan.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-lead-review-plan.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-validation-log.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-correction-log.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-specialist-gate-results.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-final-lead-review.md`
- `archive/sprints/INSPECT-11EF/INSPECT-11EF-closure-log.md`
- `archive/sprints/INSPECT-11EF/BOOK1-ASSEMBLY-HEALTH-1-triage-note.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-onboarding-plan.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-onboarding-plan.json`
- `reports/inspection-standards/chapter-1-3-diagnostic-report.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-report.json`
- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `build-scripts/inspection/check-dutch-diagnostic-report-stability.js`
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- roadmap, ledger, version-index, URL/index/dashboard report updates needed to
  publish the new sprint and generated report.

## Forbidden Outputs

- Evidence packs.
- Teacher/school-facing output.
- Public or external output.
- Package scripts or CI invocation.
- Dashboard gates.
- Quality-ref or Scale Gate integration.
- Product-route adoption.
- Diagnostics/mastery/PV work.
- Student-use or product-use artifacts.
- Personal-data processing.
- Compliance, approval, OP0, PTA, summative, inspection-readiness, or
  school-SKA claims.
- Protected reference or source-registry mutation.
- Lesson output mutation.

## Chapter 1.2 Regression Contract

The previous Chapter 1.2 report may change only to remove or replace volatile
currentness metadata that made the report stale after unrelated lesson-main
changes. The semantic regression proof must compare stable semantic fields:

- scope;
- safe-use flags;
- diagnostic status vocabulary;
- input eligibility decisions;
- `4veco_product_evidence`;
- weak or missing evidence;
- blockers;
- school-owned evidence;
- forbidden inferences;
- owner next action;
- proof required to close;
- refusal policy;
- output boundary flags.

The checker must fail if any Chapter 1.2 semantic field changes without an
explicit correction-log entry and final lead acceptance.

## Chapter 1.3 Report Requirements

The generated Chapter 1.3 report must visibly retain:

- route-local-only evidence status;
- school-owned evidence still needed;
- forbidden inferences;
- accessibility/support limitations;
- check-surface authority separation;
- owner next action;
- proof required to close;
- source traceability policy;
- exact source/output metadata;
- false authority flags.

## Required Subagent Reviews

- Lead reviewer: Phase 1 plan and architecture.
- Teacher/economics reviewer: generated Chapter 1.3 evidence descriptions and
  usefulness.
- Legal/privacy reviewer: audience, sharing, personal-data, and claims
  boundaries.
- Dutch quality-inspection reviewer: product/school boundary and
  inspection-language safety.
- Final lead reviewer: complete implementation, tests, generated reports, and
  PR packet.

## Operationalized sprint procedure

1. Validate the INSPECT-11E/F plan files and run a lead-review subagent against
   the plan/architecture. Stop and correct if the reviewer finds scope
   expansion, a missing core requirement, or an unclear validation route.
2. Refactor the diagnostic generator into explicit Chapter 1.2 and Chapter 1.3
   scope descriptors. Stop if any descriptor relies on directory globbing,
   implicit source discovery, generated lesson-output scanning, or a forbidden
   audience/integration mode.
3. Generate or check the Chapter 1.2 and Chapter 1.3 report pairs manually,
   then run the stability/currentness checker and refusal tests. Treat any
   failed validator as a stop condition until corrected or explicitly logged as
   an out-of-scope inherited issue.
4. Run teacher/economics, legal/privacy, Dutch quality-inspection, and final
   lead subagent reviews. Correct every blocking or missing-core finding before
   PR publication.
5. Open one platform PR, keep it fresh against `main`, wait for remote CI, and
   return for human review only after the full implementation and review packet
   is ready.

## Acceptance tests

The legacy `check-sprint-bundle` command is retained as deterministic
visibility for the archive sprint layout; the supported closure validator is
`check-sprint-plan` plus the explicit generator, stability, refusal, roadmap,
diff, and platform checks below.

```bash
npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-11EF --agent codex-main --require-prefix codex/,agent/
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11EF/INSPECT-11EF-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-11EF
node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
node build-scripts/inspection/build-dutch-diagnostic-report.js --public
node build-scripts/inspection/build-dutch-diagnostic-report.js --scope chapter-1-3 --teacher
node build-scripts/inspection/build-dutch-diagnostic-report.js --scope chapter-1-3 --product-route
node build-scripts/inspection/build-dutch-diagnostic-report.js --scope chapter-1-3 --lesson-output-scan
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
git diff --check
npm.cmd run check:platform
```

Also run post-merge smoke validation already required by INSPECT-11D:

```bash
node scripts/validate-chapter.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "<1.3.1 through 1.3.4>"
```

## Proof Required to Close

- Lead subagent PASS for the INSPECT-11E plan and architecture.
- Generated Chapter 1.3 report Markdown/JSON with visible blockers,
  `blocks`, `does_not_block`, and `proof_required_to_close` fields.
- Chapter 1.2 semantic regression proof and deterministic currentness proof.
- Chapter 1.3 refusal tests for forbidden audiences, claims, integrations,
  authority jumps, and generated lesson-output scanning.
- Teacher/economics, legal/privacy, Dutch quality-inspection, and final lead
  subagent PASS after all corrections.
- Fresh platform PR, green remote CI, and validation log showing the manual
  generator/checker, roadmap/report checks, diff hygiene, and platform tests.

## Rollback plan

Before merge, close the PR or revert the branch commits. After merge, revert
the INSPECT-11E/F implementation commit(s), restoring the previous
Chapter 1.2-only generator/report state and removing the Chapter 1.3 generated
report pair. No protected reference, lesson output, package/CI, dashboard,
quality-ref, Scale Gate, or product route is changed.

## Human review required

Yes, but only after the complete INSPECT-11E/F implementation and review
packet is available. Human review may accept, revise, or reject only this
internal diagnostic onboarding track. It must not unlock evidence-pack,
teacher/school-facing, public/external, Scale Gate, product-route,
diagnostics/mastery/PV, student/product-use, personal-data, or compliance
authority.
