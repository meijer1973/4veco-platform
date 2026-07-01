# Sprint EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1: Baseline

Generated: 2026-07-01

## Plan reference

Plan: `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md`

## Current State

Current `origin/main` has the PR #183 split-source cleanup, but the cleanup is
still sprint-local rather than durable policy:

- `package.json` has no `check:exercise-workflow-currentness` command.
- `.github/workflows/platform-ci.yml` does not run the exercise currentness
  checker.
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js` hardcodes
  the current source and lesson file lists.
- `build-scripts/sprints/check-check-short-exit2.js` and
  `build-scripts/sprints/check-check-route-copy1.js` still encode older
  assumptions and fail against current source state.
- Sprint metadata under `references/data/sprints/` still contains historical
  legacy unsuffixed exit-ticket path references without a common
  current/historical/superseded status.
- Valid unsuffixed non-exit-ticket generated lesson assets exist for
  procedure, reasoning, skilltree, and newsdetective workflows, so currentness
  checks need a path classifier rather than broad unsuffixed-path rejection.

## Baseline Commands

Observed during planning on the fresh branch from current `origin/main`:

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md
```

After template corrections, the plan check passes.

```text
node build-scripts/reports/validate-report-json.js
```

Result: pass.

Focused stale-checker probes from the audit remain the reason for this sprint:

```text
node build-scripts/sprints/check-check-short-exit2.js
```

Current failure mode: stale expectations for advisory short-check metadata and
old completion-language semantics.

```text
node build-scripts/sprints/check-check-route-copy1.js
```

Current failure mode: stale `1.1.2 completionLanguageEligible:true` and old
landing-copy assumptions.

## Forbidden Surface Baseline

The sprint starts with no intended source-data, engine, protected-reference, or
generated lesson output changes. Any implementation that needs those surfaces
must stop and replan.

## Data integrity notes

No protected reference data changed during baseline capture.
`references/machine/`, `references/external/`, exercise source data, engines,
generated Book 1 lesson output, target-exercise registries, candidate storage,
PV outputs, product routes, diagnostics, adaptive routing, mastery/sequencing,
Scale Gate 1, and student/product-use surfaces are out of scope.

## Closure Implications

The sprint must close only when currentness policy is manifest-driven, CI-wired,
historical metadata is explicit, stale checkers fail closed as historical
validators, and valid non-exit generated assets remain accepted by the path
classifier.
