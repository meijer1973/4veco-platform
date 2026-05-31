# Sprint GAME-ARCH-1: Architecture Decision

Generated: 2026-05-31

## Verdict

Proceed to `GAME-ARCH-2` before `GATE-ENGINE-1`.

The current system has made enough progress that a full immediate rebuild is
not justified. The shared route layer and shared task shell are now valuable
foundations. The graph route is a strong reference direction. Math and
reasoning should be refactored around target-exercise operation chains and
answer-form standards. Any duplicate UI/state/feedback paths that cannot
consume the shared route and task shell cleanly should be rebuilt or removed.

## Keep

- Shared skill-map / route layer.
- Shared task-type shell.
- Graph/table UI direction as the reference pattern.
- Procedure support as support, not primary math replacement.
- Short check as advisory local checkpoint.

## Refactor

- Math/calculation route around target-exercise operation-chain coverage.
- Reasoning route around answer-form and constructed-response standards.
- Checkpoint composition around shared task shell plus target-operation chain
  proof.
- Short-check advice model around local, non-binding route guidance.
- Engine wrappers so common feedback, focus, route language, and task
  collection do not drift per engine.

## Rebuild Or Remove When Needed

Rebuild any engine-specific UI/state/feedback path that duplicates a shared
task-shell family and cannot be reduced to a thin domain wrapper.

This is a criterion for `GAME-ARCH-2`, not authorization to rewrite files in
GAME-ARCH-1.

## Hold

- Target-equivalent exit-ticket implementation.
- Paragraph-completion language.
- Diagnostics, adaptive routing, mastery, sequencing, summative use,
  student-facing AI, PV projection, PV machine promotion, Scale Gate 1, and
  student/product use.

## Required GAME-ARCH-2 Scope

`GAME-ARCH-2 Integrated Practice Engine Architecture Plan` should define:

- canonical route-layer API;
- canonical task-shell API and extension policy;
- domain module boundaries for graph/table, math/calculation, reasoning, and
  checkpoint composition;
- file-level keep/wrap/deprecate/rebuild list;
- state ownership and persistence rules;
- local advice copy model for short checks;
- target-operation coverage requirements;
- target-equivalent exit-ticket composition requirements;
- GATE-ENGINE-1 live-output proof requirements.

## GATE-ENGINE-1 Tightening

`GATE-ENGINE-1` should not close unless it reviews live rendered output and
explicitly decides whether each component is ready to keep, refactor, rebuild,
or hold. It must inspect:

- shared route visibility;
- shared task-shell use;
- graph route operation coverage;
- math route operation coverage;
- reasoning answer-quality route;
- short-check advisory boundary;
- target-equivalent exit-ticket boundary;
- next-action clarity;
- no prohibited product claims.

## No Authority Granted

GAME-ARCH-1 grants no implementation, generated output, protected reference,
source-data, candidate-storage, target-exercise, target-equivalent, diagnostic,
adaptive, mastery, sequencing, summative, PV, Scale Gate 1, or student/product
authority.
