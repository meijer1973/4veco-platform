# Sprint MTU-H2A: Diff Summary

Date: 2026-05-27

## Primary changes

- Added exact Solo q1-q3 CLI mutation planning under `reports/mtu-hardening/`.
- Added `GATE-MTU-H2A` review packet for the planning proposal.
- Added `check-mtu-h2a-cli-mutation-plan.js` to validate IDs, specs, authority
  flags, guardrails, and roadmap state.
- Updated the roadmap so the top operational next action is GATE-MTU-H2A human
  review.
- Updated sprint-bundle ID validation so `MTU-H2A`-style sprint IDs are valid.
- Refreshed generated reports, dashboard data, source registry, source
  manifest, document inventory, URL index, and agent indexes.

## Protected surfaces

No files under `references/machine/` or `references/external/` were changed.
No unit CLI mutation command was run. No candidate-storage files were created.
No lesson-output mutation occurred.

## Generated outputs

Generated report and index refreshes are included so the new roadmap and gate
packet are visible in the reference dashboards and agent indexes.

## Residual risk

The plan proposes exact IDs and specs but does not execute them. A later human
gate must decide whether direct `unit-add` execution is acceptable despite the
current lack of `--dry-run`, or whether a dry-run wrapper is required first.
