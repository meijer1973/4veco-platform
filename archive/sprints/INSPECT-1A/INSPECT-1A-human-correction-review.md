# INSPECT-1A Human Correction Review

Status: pass
Date: 2026-06-08
Reviewer: Head of Strategy
Decision: `pass`

## Decision Summary

INSPECT-1A is accepted as the corrected v0 baseline for the next bounded step.
The source register and Dutch evidence profile remain evidence-supporting
drafts; they are not final compliance evidence.

The review accepted that INSPECT-1A:

- added Dutch curriculum and assessment authority sources;
- kept inspection sources separate from curriculum/assessment sources;
- tightened safe claims;
- added the OP0/basic-skills forbidden claim;
- preserved draft status;
- avoided schemas, validators, overlays, generated lesson changes, gates, and
  compliance/approval claims.

## Minor Cleanup

The correction report contained one stale next-action sentence that still said
to complete validation and lead review. Validation and lead review were already
complete. The packet should clean that sentence when touched again.

## Accepted Baseline Status

The source register and Dutch profile may move only to a cautious review state:

```text
draft_accepted_for_bounded_pilot_audit
```

Do not mark the profile final, compliant, approved, or complete.

## Approved Next Action

Approved:

```text
INSPECT-2 Bounded Pilot Evidence Audit
```

Not approved:

- schema design;
- validators;
- generated evidence packs;
- country overlays;
- dashboard gates;
- quality-ref integration;
- Scale Gate integration;
- generated lesson-output changes;
- legal compliance claims;
- inspectorate approval claims;
- complete OP0/basic-skills claims.

## INSPECT-2 Scope

Pilot audit only. Use a small stabilised scope, preferably Book 1 Chapter 1.1:

- `1.1.1 Schaarste en economisch denken`
- `1.1.2 Percentages en indexcijfers` in the live repo; the review text called
  this `Ruilen en rekenen`, but the current source of truth names it
  `Percentages en indexcijfers`.
- `1.1.3 Grafieken en tabellen`

Audit whether the Dutch v0 evidence categories can locate real evidence in:

- paragraph markdown and generated lesson evidence;
- target exercises;
- answer models;
- quality-ref and review records;
- companion artifacts where present;
- reports, only as diagnostic evidence.

## Required Audit Output

The INSPECT-2 audit report should say:

1. which categories find strong evidence;
2. which categories only find implicit evidence;
3. which categories are missing or weak;
4. where product evidence ends and school evidence begins;
5. whether the profile needs adjustment before schema design.

## Required Next Action

Create and run INSPECT-2 as a bounded pilot evidence audit. Do not start schema
design or validators.
