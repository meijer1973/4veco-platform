# Sprint INSPECT-11D: Chapter 1.3 Paired Lesson Repair And Readiness Closure

Status: in progress
Date: 2026-06-18
Sprint: `INSPECT-11D`

## Goal

Close or narrowly carry the concrete Chapter 1.3 blockers identified by
INSPECT-11C through a paired platform-and-lesson repair sprint.

Target result for human review:

```text
A. Chapter 1.3 is ready for a later internal diagnostic implementation-plan sprint.
```

That target may be returned only if the core repair, reconciliation, proof,
rendered evidence, source traceability, and subagent gates are complete. This
sprint does not generate a Chapter 1.3 diagnostic report or evidence pack.

## Context

Product end-state source: `docs/roadmaps/quality-standards/quality-standards-end-state.md`

Operational product end-state source:
`../4veco-lessen/specifications/product-end-state.md`

Strategic product vision source:
`../4veco-lessen/specifications/product-vision.md`

Original sprint/gate spec:
`archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md`

Controlling prior packet:
`reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.md`

INSPECT-11D is an internal repair/readiness sprint. It is not a diagnostic
report, evidence pack, teacher/school-facing artifact, product route, Scale
Gate, diagnostics/mastery/PV gate, student-use authority, product-use
authority, inspection judgement, or compliance/approval claim.

## Quality Standard

The specification quality floor is a reproducible paired repair that improves
student-facing generated output while preserving the governed authority
boundary. The platform source must drive the lesson output; no generated
lesson artifact may be hand-patched to satisfy the sprint.

Rendered output is part of the proof because the product end-state requires
actual student-facing route quality, not only source validity. The packet must
therefore include rendered mobile/desktop proof, exact exercise ranges,
accessibility/support review evidence, and follow-up blockers where proof is
still outside this sprint.

REV-STD-1 applies to the plan, review packets, lead reviews, product-proof
gates, Scale Gate preparation, validation log, and closure log. Missing core
requirements may not be carried as PASS WITH FLAGS; they must block closure or
be explicitly outside the sprint authority.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Repair `1.3.4` registry/output divergence | platform manifest/generator diff and regenerated lesson output | teacher/economics review, exact before/after proof | in progress |
| Reconcile `1.3.1` through `1.3.4` quality-ref/review state | generated quality-ref/review updates and canonical resolution table | lead review and Dutch quality-inspection review | in progress |
| Produce final route-local proof records | exact exercise IDs, opgaven ranges, answer/model ranges, scaffold boundary | teacher/economics and lead review | in progress |
| Produce rendered accessibility/support evidence | PDF contact sheets, desktop/mobile screenshots, viewport metrics, support matrix | accessibility review | in progress |
| Resolve companion/advisory status | reviewed N/A decision with rationale for this non-interactive route-local packet | Dutch quality-inspection review | in progress |
| Formalise source traceability | supersession rule for authored JSON registry versus stale blueprint prose | Dutch quality-inspection review | in progress |
| Preserve forbidden authority boundaries | false authority flags, blocker ledger, safe-use note | validation, legal/privacy check, final lead review | in progress |

## Quality Improvement Candidates

| Candidate | Decision | Reason |
|---|---|---|
| Replace `1.3.4` simultaneous-shift task with movement-versus-demand-shift task | `include_now` | It closes the named core divergence without adding new theory. |
| Add mobile screen CSS and HTML titles to generated build scripts | `include_now` | Rendered proof showed mobile overflow/title weakness; the fix is route-local and improves accessibility support evidence. |
| Generate Chapter 1.3 diagnostic report | `reject_scope_creep` | Explicitly forbidden by the authorisation note. |
| Generate Chapter 1.3 evidence pack | `reject_scope_creep` | Explicitly forbidden by the authorisation note. |
| Full WCAG/PDF tagging audit | `defer_named_follow_up` | This sprint can record rendered/support evidence, not a complete accessibility certification. |
| Product-route adoption or Scale Gate closure | `reject_scope_creep` | Separate renewed human review is required before any downstream authority changes. |

## Allowed paths

- Change platform source/generator files required for the `1.3.4` repair.
- Regenerate the affected Chapter 1.3 lesson output through the normal
  platform-to-lesson pipeline.
- Add platform-side INSPECT-11D reports, logs, rendered proof, and roadmap
  updates.
- Add a lesson PR containing only regenerated Chapter 1.3 output and the
  associated generated reconciliation records.
- Use lead and specialist subagents before human review.

## Forbidden paths

- Do not generate a Chapter 1.3 diagnostic report.
- Do not generate a Chapter 1.3 evidence pack.
- Do not mutate `references/machine/`, `references/external/`, protected
  registries, or source-registry records.
- Do not hand-edit generated lesson output outside the regeneration pipeline.
- Do not add dashboard, quality-ref, package-script, CI/build, or Scale Gate
  integration.
- Do not claim product-route adoption, diagnostics/mastery/PV, student-use,
  product-use, compliance, approval, inspection-ready, complete OP0, PTA,
  summative, classroom-implementation, school-obligation, or school-SKA
  authority.
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
- Platform PR first, lesson PR second.
- Human review only after authorised repairs, validation, subagent review,
  paired PR publication, and fresh PR CI/check evidence.

## Inputs

- `archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md`
- `reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.md`
- `reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.json`
- `build-scripts/books/book-manifests/book-1-print-1.3.4-gemengde-opgaven.md`
- `build-scripts/sprints/l-cp6a-remediate-book1-chapter13.js`
- generated lesson worktree at
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht`

## Outputs

- Platform PR with source/reconciliation/proof changes.
- Lesson PR with regenerated Chapter 1.3 repair output.
- `reports/inspection-standards/chapter-1-3-readiness-closure.md`
- `reports/inspection-standards/chapter-1-3-readiness-closure.json`
- `docs/inspection-standards/chapter-1-3-source-traceability.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-sprint-plan.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-validation-log.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-correction-log.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-lead-review-round1.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-lead-review-round2.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-specialist-gate-results.md`
- `archive/sprints/INSPECT-11D/INSPECT-11D-closure-log.md`
- `archive/sprints/INSPECT-11D/rendered-proof/`

## Operationalized sprint procedure

1. Confirm PR #110/INSPECT-11C is merged and branch platform/lesson worktrees
   from current main.
2. Implement the `1.3.4` repair in platform source/generator and regenerate
   lesson output. Stop if output changes cannot be reproduced from platform
   source.
3. Reconcile `1.3.1` through `1.3.4` quality-ref/review state and draft the
   REV-STD-1 closure report.
4. Capture rendered before/after proof for `1.3.4`, desktop/mobile chapter
   proof, viewport metrics, exact exercise ranges, and source-traceability
   evidence.
5. Run lead review round 1 and specialist reviews. If any reviewer returns
   `REVISE` or identifies a missing core requirement, implement corrections,
   update the correction log, rerun affected validation, and rerun the
   affected review.
6. Run platform and lesson validators. Record known full-book failures only if
   they are outside Chapter 1.3 and do not block the scoped repair.
7. Refresh roadmap, ledger, version index, URL index, agent maps, and internal
   dashboard outputs where required.
8. Commit, push, and open platform PR first, then lesson PR.
9. After paired PRs are visible and green, run final lead review. Human review
   may then accept, revise, or reject only the INSPECT-11D readiness closure
   packet and its state recommendation.

## Acceptance tests

`check-sprint-bundle` is retained as deterministic visibility for the archive
packet, but this legacy checker is not the closure authority for archived
sprint-path layout. If it reports only the known archive/report layout
expectation, record that result in the validation log and rely on the REV-STD-1
packet files plus the supported validators below for closure.

```bash
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11D/INSPECT-11D-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-11D
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('reports/inspection-standards/chapter-1-3-readiness-closure.json','utf8'));"
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ..\4veco-lessen diff --check
npm.cmd run check:platform
node scripts/validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.3 Hoofdstuk Aanbod en marktevenwicht"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.3 Hoofdstuk Aanbod en marktevenwicht\1.3.1 Aanbod"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.3 Hoofdstuk Aanbod en marktevenwicht\1.3.2 Marktevenwicht"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.3 Hoofdstuk Aanbod en marktevenwicht\1.3.3 Verschuivingen en nieuw evenwicht"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.3 Hoofdstuk Aanbod en marktevenwicht\1.3.4 Gemengde opgaven"
```

## Proof Required to Close

Proof required to close must include validator evidence, test evidence,
rendered proof, reviewer evidence, and PR-visible commit evidence.

- The `1.3.4` old simultaneous demand/supply shift task is absent from
  regenerated `1.3.4` opgaven/antwoorden output.
- The replacement task preserves no-new-theory consolidation and distinguishes
  own-price movement from demand-factor shift.
- Quality-ref/review state for `1.3.1` through `1.3.4` has one canonical
  resolution record.
- Route-local proof records cite exact exercise and answer/model line ranges.
- Rendered desktop/mobile proof has no horizontal overflow for the selected
  surfaces.
- Companion/advisory status is explicitly reviewed as N/A for this packet.
- Authored JSON registry source-traceability supersession is recorded.
- Subagent review corrections are complete.
- Platform and lesson PRs are open, mergeable, and green before human review.

## Rollback plan

If a blocker shows the sprint drifted into forbidden authority or unreproducible
lesson mutation, stop and revert only INSPECT-11D branch changes from this
worktree. Do not revert unrelated main history or user work.

## Human review required

Human review is required after paired PRs are visible, fresh, green, and
subagent-reviewed. Human review may accept, revise, or reject only the
INSPECT-11D readiness closure packet and its state recommendation. It must not
infer diagnostic report generation, evidence-pack generation, teacher/school
output, product-route adoption, Scale Gate, diagnostics/mastery/PV,
student/product-use, personal-data, or compliance/approval authority.
