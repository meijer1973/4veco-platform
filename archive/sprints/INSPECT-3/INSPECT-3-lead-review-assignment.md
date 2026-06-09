# INSPECT-3 Lead Review Assignment

Status: assigned
Date: 2026-06-08
Lead reviewer: `agents/lead-reviewer-agent.md`
Testing reviewer: `agents/testing-agent.md`

## Review Scope

The lead review must decide whether INSPECT-3 produced a diagnostic
report-only schema without turning it into a validator, gate, generated pack,
or compliance claim.

## Required Evidence

- Human authorization record.
- Sprint plan and planning review.
- Schema file.
- Schema design document.
- Schema notes with pilot object example.
- Updated roadmap, ledger, profile metadata, evidence model, README, and URL
  surfaces.
- Validation log with command and exit-code evidence.
- Git diff proving no generated lesson artifacts, quality-ref files,
  dashboard gates, Scale Gate integrations, country overlays, generated
  evidence packs, or validator scripts were added or changed.

## Required Review Questions

1. Is the schema report-only and diagnostic?
2. Does the schema include the required wording?
3. Does it separate evidence state from finality?
4. Does it require product/school boundaries?
5. Does it distinguish source pointer types?
6. Does assessment/closure require target-equivalent proof status?
7. Does basic-skills require subject-material OP0 boundary fields?
8. Did validation run with command and exit-code evidence?
9. Did the sprint avoid all forbidden implementation work?

## Required Next Action

After validation, perform lead-review round 1, record the correction pass, then
perform lead-review round 2 before closure.
