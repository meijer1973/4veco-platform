# Sprint SYNC-PRODUCT-1: Diff Summary

Generated: 2026-06-01

## Summary

Roadmap/specification alignment only. The diff inserts the Product Proof Track
before Scale Gate 1, strengthens stable specs where the user's package was more
explicit than current wording, adds deterministic evidence checking, and
records the sprint/lead-review artifacts.

## Platform changes

- `references/reference-team-roadmap.md`
  - bumped active roadmap version to
    `v3.39-sync-product1-product-proof-track`;
  - added `## Product Proof Track Before Scale Gate 1`;
  - inserted `SYNC-PRODUCT-1` in the sprint ledger;
  - changed immediate next action to `CHECK-SHORT-EXIT-1` and
    `STANDARD-EXERCISES-1`;
  - kept Scale Gate 1 blocked until `GATE-PRODUCT-3P` and `REV-STD-1` close
    or are explicitly waived with consequences.
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
  - updated the active roadmap entry to v3.39.
- `build-scripts/sprints/check-sync-product1-evidence.js`
  - added deterministic checks for roadmap sequence, spec wording, version
    index state, plan metadata, Product Proof Track blockers, and forbidden
    source/generated-output surfaces.
- `reports/sprints/SYNC-PRODUCT-1-*`
- `references/data/sprints/SYNC-PRODUCT-1.*.json`
  - added sprint plan, baseline, planning review, lead-review records, result,
    diff summary, and metadata.

## Lesson-side changes

- `../4veco-lessen/lessen-team-roadmap.md`
  - added the same Product Proof Track;
  - repaired stale near-term text that still pointed directly from Q2 work to
    Scale Gate 1;
  - keeps Scale Gate 1 behind rendered three-paragraph product proof.
- `../4veco-lessen/specifications/product-end-state.md`
  - clarifies both-check coverage, hint policy, route affordance, skill-map
    product role, shared task-family expectations, dual-coding task decisions,
    and first-three-paragraph proof.
- `../4veco-lessen/specifications/companion-core-specifications.md`
  - mirrors the companion-surface contract for advisory checks, exit tickets,
    shared task shell, student skill map, route actions, reasoning/flow task
    families, and dual coding.

## Protected surfaces

No protected surfaces changed:

- `references/machine/`;
- `references/external/`;
- `references/authored/course-target-exercises.json`;
- `references/data/exam-ingestion/answer-skill-candidates.json`;
- `source-data/book-1/exit-ticket/`;
- `source-data/book-1/reasoning/`;
- `engines/`;
- generated Book 1 lesson output.

## Product authority

No implementation, generated lesson output, diagnostics, adaptive routing,
mastery/sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or product-wide use is authorized.
