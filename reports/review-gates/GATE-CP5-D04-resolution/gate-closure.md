# GATE-CP5 D04 Resolution Closure

Sprint: S9  
Gate: GATE-CP5-D04-resolution  
Status: `pass_with_conditions`  
Closed on: 2026-05-15

## Summary

CP-5 closes as `pass_with_conditions`. S9 resolves the D04 unit-design decision direction, but does not authorize or execute protected machine mutation.

## Decision

- Keep `unit_design_status` as a derived `references/data` overlay for now.
- Resolve `D04 Elasticiteit en goederenclassificatie` as an unstable standalone unit whose content should be redistributed to successor elasticity units.
- Treat the successor mapping as complete enough for CP-5:
  - `A15`/`D06` for price elasticity.
  - `A17`/`D11` for income elasticity.
  - `A16`/`D12`/`D27` for cross elasticity and substitutes/complements.
- Keep D04 blocked for C-to-B promotion and student-facing projection.
- Authorize no protected machine mutation in S9.
- Require a later CLI-only mutation sprint to apply the decision, with mutation log, regenerated reports, and validation.

## Accepted Outcomes

- The derived overlay in `references/data/unit-design-status/unit-design-status-overlay.json` may remain the active internal unit-design-status surface.
- The D04 decision direction is settled for CP-5: redistribute content to successor elasticity units and retire D04 later through CLI.
- The dependent-unit audit is sufficient for CP-5 closure.
- D04 remains blocked for promotion and student-facing projection until a later CLI-only mutation sprint executes the decision.

## Blocked Outcomes

- No hand edits to `references/machine/`.
- No hand edits to `references/external/`.
- No `D04 -> A15` prerequisite edge.
- No `unit-deprecate.js`, `unit-merge.js`, or `unit-split.js` execution in S9.
- No machine-unit `unit_design_status` field migration in S9.
- No exercise promotion relying on D04 before later CLI mutation.
- No student diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative decisions, PV projection, or PV machine promotion.

## Conditions

1. A later CLI-only mutation sprint must specify the exact D04 mutation target: retire, merge, split, or redistribute concrete citations and references.
2. The later mutation sprint must include CLI command selection, mutation log, regenerated machine projections, reports, RAG chunks, source manifest, and document inventory.
3. The later mutation sprint must verify stale D04 references after mutation.
4. D04 remains an internal unit-design issue until the later sprint completes.
5. Generated reports and RAG chunks must continue to preserve non-authority and promotion-blocked labels.

## Human Confirmation

The human reviewer explicitly recommended closing `GATE-CP5-D04-resolution` as `pass_with_conditions` and answered A on all six planned calibration questions.

Protected reference data changed: false.
