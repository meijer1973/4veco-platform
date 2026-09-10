# Sprint CI-GATE-PROOF-1: Baseline

Generated: 2026-06-06

## Plan reference

Plan: `reports/sprints/CI-GATE-PROOF-1-plan.md`

## Baseline state

- `CI-REMOTE-1A` records the rule that future human gate packets must cite a
  passing `platform-ci / validate-platform` run for the reviewed commit or
  explicitly record a waiver.
- No reusable checker currently validates that rule for markdown or JSON gate
  packets.
- Current gate packet shapes vary. Some existing packet metadata records
  reviewed remote commit fields but does not record check-run proof in a shape
  strict enough for automated validation.

## Data integrity notes

No protected reference data is in scope. `references/machine/` and
`references/external/` remain unchanged. No generated lesson output,
source-data, target registries, candidate storage, PV outputs, or product
route files are in scope.

## Stop conditions

Stop if the checker cannot validate current/new packet conventions without
weakening the rule, if remote verification requires unavailable permissions,
or if any generated/protected output changes.
