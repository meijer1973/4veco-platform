# Sprint CP.6a: Diff Summary

## Summary

CP.6a adds a non-mutating alignment plan for the active-v5 versus lesson-side Book 1 Chapter 1.3 mismatch.

It creates:

- machine-readable alignment evidence
- Markdown alignment plan
- a read-only validator
- sprint plan, baseline, planning review, result, metadata, and lead-review scaffolding

## Added alignment artifacts

- `references/data/sprints/CP.6a-lesson-side-alignment.json`
- `reports/reference-planning/CP.6a-lesson-side-alignment.md`

## Added script

- `build-scripts/review-gates/check-cp6a-lesson-side-alignment.js`

The script is read-only. It fails if CP.6a claims the mismatch is resolved, if mutation/closure boundaries are missing, if the two mismatch records are not present, if displaced Book 2 topics are not mapped, or if `1.4.1`/`1.4.2` `PASS WITH FLAGS` states are hidden.

## Protected surfaces

No changes are authorized or expected under:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `../4veco-lessen`

CP.6a does not authorize CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, unit minting, protected reference mutation, lesson-output mutation, diagnostics, adaptive routing, mastery decisions, student-facing AI, summative use, PV projection, or student-facing output.

## Alignment decision

Recorded status: `alignment_plan_ready_no_output_mutation`.

Evidence:

- active v5 `1.3.2 Marktevenwicht` maps from v4 `1.4.1`;
- active v5 `1.3.3 Verschuivingen en nieuw evenwicht` maps from v4 `1.4.2`;
- current lesson-side `1.3.2 Kostenstructuren` belongs to active-v5 Book 2 `2.1.1`;
- current lesson-side `1.3.3 Opbrengsten` belongs to active-v5 Book 2 `2.1.2`;
- equivalent current lesson material is under `1.4.1` and `1.4.2`, but both records are `PASS WITH FLAGS`.

## Roadmap update

The references roadmap is updated to `v2.53-cp6a-lesson-side-alignment`.

`CP.6a` moves to Closed Sprints as an alignment-plan-only sprint. `CP.6b` becomes the active top Sprint Ledger row.

The prior live roadmap is archived at `docs/roadmaps/outdated/reference-team-roadmap-v2.52-gate-cp6-routing-decision.md`.

## Map refresh

Generated report, source-manifest, document-inventory, dashboard, GitHub-agent-index, and URL-index surfaces are refreshed by normal tooling before sprint closure.
