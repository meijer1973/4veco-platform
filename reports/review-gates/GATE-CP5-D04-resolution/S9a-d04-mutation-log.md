# S9a D04 CLI Mutation Log

Sprint: S9a  
Gate: GATE-CP5-D04-resolution  
Status: completed  
Completed on: 2026-05-16

## Execution Mode

Protected reference mutation was executed only through `build-scripts/references/unit-deprecate.js`.

## Command

```bash
node build-scripts/references/unit-deprecate.js --id D04 --replaced-by A15,D06,A17,D11,A16,D12,D27
```

Result:

```text
OK  deprecated D04 (replaced_by: A15, D06, A17, D11, A16, D12, D27)
```

Exit code: `0`

## Applied Change

- Deprecated unit: `D04`
- Replacement units: `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, `D27`
- Protected files written by CLI:
  - `references/machine/micro-teaching-units.md`
  - `references/machine/micro-teaching-units.json`
- Narrow authored-source cleanup:
  - Removed `D04` from target exercise `2.1.3` fields `required_skills` and `new_skills_introduced`.
  - Kept successor units already present in that target exercise.

## Rollback

```bash
node build-scripts/references/unit-deprecate.js --id D04 --undo
```

Then revert the S9a implementation commit to restore non-protected source cleanup, reports, roadmap bookkeeping, and sprint artifacts.

## Boundaries Preserved

No `D04 -> A15` edge was added. No external exam-question source was changed. No exercise promotion, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or PV machine promotion is authorized.
