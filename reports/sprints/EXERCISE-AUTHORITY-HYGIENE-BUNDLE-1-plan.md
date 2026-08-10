# Sprint EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1: Exercise Authority Hygiene Bundle

Generated: 2026-07-01

## Goal

Resolve the three exercise authority-hygiene follow-ups deferred by
`EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1` in one coherent governance bundle:
canonicalize duplicate `1.1.3-exit-ticket` exemplar authority, classify Golden
fixture copies, and make the disposition of `knowledge/exit-ticket-game-1.1.1.zip`
machine-readable.

This sprint is evidence-authority and repository-governance hygiene only. It
must not edit exercise source data, generated lesson output, engines, runtime
behavior, product routes, completion-language flags, diagnostics, mastery,
sequencing, PV, Scale Gate 1, broad product use, or student/product use.

## Context

The current exercise workflow currentness bundle intentionally left three
non-blocking but durable authority risks:

- duplicate `1.1.3-exit-ticket` exemplar packages exist at
  `references/exemplars/1.1.3-exit-ticket/` and
  `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/`;
- Golden layout/checker fixtures exist in both active checker fixture roots and
  report fixture roots without a machine-readable active-versus-snapshot
  classification;
- `knowledge/exit-ticket-game-1.1.1.zip` has old narrative evidence that calls
  it untracked or a source-control gap, while current Git state tracks it.

Current active UI policy and registry files already point to
`references/exemplars/1.1.3-exit-ticket/` as the operational exemplar authority.
The product-excellence copy must be preserved as historical review material
rather than deleted or silently treated as an alternate current source.

## Quality Standard

Quality floor: after this sprint, a future agent must be able to determine from
one manifest and one deterministic checker which exemplar path is canonical,
which fixture copies are active fixtures versus frozen snapshots, and what the
tracked ZIP may and may not be used for.

Specification quality: the bundle must preserve historical evidence while
removing current-authority ambiguity. The implementation must prefer
classification, aliases, and checks over deletion or broad rewrites.

Rendered output and student-facing behavior must remain unchanged. Proof must
show no source data, generated lesson output, engine/runtime behavior, protected
reference data, product route, completion-language, diagnostics, mastery/PV, or
student/product-use surface changed.

Follow-up quality: if any artifact cannot be classified safely, the bundle must
record the exact owner decision needed rather than guessing or deleting evidence.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| One canonical `1.1.3-exit-ticket` exemplar authority is discoverable. | Add authority-hygiene manifest entry naming `references/exemplars/1.1.3-exit-ticket/` as canonical and the product-excellence path as historical alias. | Checker proves active UI registries cite only the canonical path for current authority and both paths remain present. | planned |
| Non-canonical exemplar copy cannot be mistaken for current authority. | Add narrow alias/historical note at the non-canonical path or manifest-enforced alias metadata. | Lead review verifies historical evidence is preserved and current-agent routing is unambiguous. | planned |
| Golden fixtures are classified as active fixtures or frozen snapshots. | Add manifest entries for `build-scripts/sprints/fixtures`, `reports/fixtures/golden-ticket-layout`, and UI fixture JSON. | Checker proves every known Golden fixture path has an allowed disposition and duplicated filenames are intentional. | planned |
| ZIP disposition is machine-readable. | Add tracked artifact disposition for `knowledge/exit-ticket-game-1.1.1.zip` with tracked state, size/hash, active-use flags, and deletion/modify policy. | Checker proves the ZIP is tracked, unchanged from the manifest hash, not a runtime dependency, and not product/student-use authority. | planned |
| Active checks cite the disposition model. | Add an npm checker for exercise authority hygiene and wire it into normal validation scope. | `npm.cmd run check:exercise-authority-hygiene` passes and `check:platform`/CI plan remains green. | planned |
| No behavioral or authority expansion. | No source-data, generated lesson output, engine/runtime, product-route, protected-reference, target-registry, or student/product-use changes. | Git diff guards, lesson diff guard, scope-language, and lead review verify forbidden surfaces remain untouched. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add one authority-hygiene manifest covering exemplars, fixtures, and ZIP disposition. | include_now | Centralizes the three deferred decisions without spreading one-off notes. |
| Add an npm checker for exemplar/fixture/artifact disposition. | include_now | Makes the hygiene decisions durable for CI and future agents. |
| Delete the historical product-excellence exemplar copy. | reject_scope_creep | Historical review evidence must be preserved; classify it instead. |
| Rewrite all old report prose that says the ZIP was untracked. | reject_scope_creep | Old reports remain historical; add current disposition instead of rewriting archive narrative. |
| Fully deduplicate fixture file contents by moving files. | defer_named_follow_up | Classification is safer now; moving fixtures could cause unnecessary churn unless the checker exposes a current ambiguity. |
| Rename the old currentness checker script. | defer_named_follow_up | Name cleanup is lower value than authority classification and not required for closure. |

## Allowed paths

- `references/data/exercise-authority-hygiene-manifest.json`
- `build-scripts/sprints/check-exercise-authority-hygiene.js`
- `package.json`
- `.github/workflows/platform-ci.yml`
- narrow README or alias note files under
  `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/`
- `references/reference-team-roadmap.md`
- `references/data/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1.plan.json`
- `references/data/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1.result.json`
- `reports/json/exercise-authority-hygiene-bundle-1-proof.json`
- sprint artifacts under `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-*`

## Forbidden paths

- No `source-data/book-1/exit-ticket/*.json` edits.
- No generated lesson output edits in `../4veco-lessen/`.
- No engine implementation, CSS, runtime JavaScript, or generated route behavior
  changes.
- No protected reference mutation under `references/machine/` or
  `references/external/`.
- No target-exercise registry writes.
- No candidate storage creation or candidate writes.
- No binary ZIP content edits, moves, deletion, or replacement.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1,
  product-route adoption, broad product use, or student/product use.

## Inputs

- `references/data/exercise-surface-manifest.json`
- `build-scripts/lib/exercise-currentness.js`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-result.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-evidence-map.md`
- `references/exemplars/1.1.3-exit-ticket/`
- `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/`
- `references/ui/layout-registry.json`
- `references/ui/interaction-policy.json`
- `references/ui/golden-exercise-checker-fixtures.json`
- `reports/fixtures/golden-ticket-layout/`
- `build-scripts/sprints/fixtures/`
- `knowledge/exit-ticket-game-1.1.1.zip`
- old sprint/report references that mention the ZIP only as historical context

## Outputs

- Sprint plan and plan metadata.
- Authority-hygiene manifest for exemplar, fixture, and ZIP disposition.
- Deterministic authority-hygiene checker and npm validation command.
- Optional CI wiring if lead review confirms the checker is stable enough for
  normal platform CI.
- Active roadmap ledger row, initially `Completed: no`, later marked
  `Completed: yes` only after the complete result bundle validates.
- Baseline, quality log, evidence map, command log, diff summary, result, and
  result metadata.
- Lead-review records for plan review, implementation review, and PR-readiness
  workflow review.
- Draft PR with PR Readiness Reviewer output against the exact remote head.

## Operationalized sprint procedure

1. Write this plan and plan metadata.
2. Run sub-agent lead review on the plan before implementation.
3. Apply plan-review corrections and repeat lead review until the plan receives
   `PASS` or explicit `OK`.
4. Register the sprint in the active roadmap ledger as `Completed: no`.
5. Record a baseline with current exemplar hashes, fixture inventory, ZIP Git
   tracking state, and forbidden-surface status.
6. Run the planned/active sprint bundle check only after the baseline exists.
7. Implement the manifest and checker in the smallest durable form.
8. Add only narrow alias/historical notes needed to prevent current-authority
   ambiguity; do not delete historical evidence.
9. Add npm/CI wiring only if the checker is deterministic and does not depend
   on local-only files.
10. Write result, quality log, evidence map, command log, and result metadata.
11. Mark the active roadmap ledger row `Completed: yes` only after result
    artifacts and final validation are ready.
12. Run focused validation, report validation, roadmap index checks, scope
   language, platform checks, and diff hygiene.
13. Run sub-agent implementation lead review. Apply required corrections and
    repeat until the implementation receives `PASS` or explicit `OK`.
14. Push a draft PR and run the PR Readiness Reviewer against the exact remote
    head.
15. Run the required sub-agent review for the PR workflow. Apply required
    corrections and repeat until the PR-workflow review receives `PASS` or
    explicit `OK`.
16. Present the PR for human review with exact-head evidence.

Decision points:

- If the two exemplar copies disagree on pedagogical substance, keep the active
  top-level path canonical and classify the product-excellence copy as
  historical unless lead review identifies a real owner decision.
- If fixture copies are byte-identical, classify one root as active and one as
  report snapshot. If they differ, record why each fixture is retained.
- If ZIP current Git state differs from old prose, trust current Git state for
  the new disposition and leave old prose historical.

Stop conditions:

- Stop if classification requires source-data, generated lesson output, engine,
  protected reference, target registry, product-authority, or student-use
  changes.
- Stop if no canonical `1.1.3-exit-ticket` authority can be selected without an
  owner decision.
- Stop if the ZIP hash or tracking state changes unexpectedly.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan.md
npm.cmd run check:exercise-authority-hygiene
npm.cmd run check:exercise-workflow-currentness
node build-scripts/sprints/check-sprint-bundle.js EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:scope-language
npm.cmd run check:platform
node build-scripts/sprints/check-sprint-result.js reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-result.md
node build-scripts/sprints/check-lead-review-substance.js EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1
node build-scripts/sprints/check-sprint-bundle.js EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1 --complete
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: the manifest names one canonical
`1.1.3-exit-ticket` exemplar authority and classifies the other as historical
alias; active UI/reference routing does not cite the historical alias as current
authority; Golden fixtures are classified as active fixtures or frozen
snapshots; `knowledge/exit-ticket-game-1.1.1.zip` has tracked, hash-checked,
non-runtime, non-product-authority disposition; the authority-hygiene checker
passes; existing exercise currentness still passes; sprint/report/platform
validators pass; lesson diff hygiene passes; no forbidden surfaces changed; and
sub-agent lead review returns `PASS` or explicit `OK` before human review.

## Internal Review Plan

Use sub-agent lead review before implementation, after implementation, and
before presenting the PR. The review must cover:

- exemplar authority and alias semantics;
- fixture active/snapshot classification;
- ZIP disposition and no-change proof;
- repository/CI determinism;
- authority-boundary preservation;
- PR-readiness routing evidence.

Proceed past each phase only after the lead reviewer returns `PASS` or explicit
`OK`.

## Human review required

Human review is required before merge. This sprint changes reference authority
and validation behavior that future exercise workflows may rely on. The PR
Readiness Reviewer must run against the exact remote PR head after the draft PR
exists.

## Rollback plan

Before merge, abandon this branch. After merge, revert the PR. Because the
sprint is limited to manifest/checker/docs/report governance, rollback should
not require lesson regeneration, source-data restoration, engine rollback, ZIP
restoration, or product-route rollback.
