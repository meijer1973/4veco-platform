# INSPECT-1 Sprint Plan

Status: prepared for human review, not executed
Date: 2026-06-08
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`

## Purpose

INSPECT-1 prepares the human review of the INSPECT-0 source register and Dutch
VO evidence profile.

This sprint does not approve the profile, correct the profile, create schemas,
create validators, generate evidence packs, change generated artifacts, add
country overlays, integrate with dashboard gates, integrate with Scale Gate, or
make compliance claims.

## Scope

Allowed:

- Review-readiness planning for the source register and Dutch VO evidence
  profile.
- Human-review packet with decision questions and answer-recording fields.
- Lead-review readiness check before the human review starts.
- Validation and closure/readiness logging for the packet itself.

Forbidden:

- Editing `references/machine/` or `references/external/`.
- Changing generated output in `../4veco-lessen/`.
- Marking `source-register.json` or `nl-vo-evidence-profile.v0.json` as
  accepted before human review.
- Adding schemas, validators, dashboard gates, country overlays,
  quality-ref integration, Scale Gate integration, or compliance/approval
  claims.

## Baseline Inputs

Primary:

- `references/data/inspection-standards/source-register.json`
- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `docs/inspection-standards/nl-vo-evidence-model.md`

Governance:

- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `AGENTS.md`
- `agents/lead-reviewer-agent.md`
- `agents/testing-agent.md`

Prior sprint logs:

- `archive/sprints/INSPECT-0/INSPECT-0-sprint-plan.md`
- `archive/sprints/INSPECT-0/INSPECT-0-validation-log.md`
- `archive/sprints/INSPECT-0/INSPECT-0-closure-log.md`

## Operationalized Sprint Procedure

1. Read the sprint ledger and roadmap scope.
2. Confirm the source register and Dutch profile remain in draft state.
3. Summarize the current source/profile baseline.
4. Create the human-review packet with explicit decisions and answer fields.
5. Create planning-review evidence that checks the packet against the roadmap
   and sprint protocol.
6. Create lead-review assignment and readiness report before the human review
   starts.
7. Validate JSON and generated reports.
8. Refresh generated maps/reports if new archive paths or dashboard summaries
   changed.
9. Record validation and closure/readiness logs.
10. End the final response with the operational next action.

## Acceptance Criteria

- Sprint plan exists before any profile corrections.
- Human-review packet exists and asks bounded questions.
- Lead-review readiness check exists before human review starts.
- The packet preserves safe/forbidden claims.
- The packet distinguishes product evidence from school/provider evidence.
- The packet does not create or imply schema/tooling/overlay authority.
- Validation logs record commands and outcomes.
- Ledger marks `INSPECT-1` as prepared/pending human review, not closed as an
  accepted profile.

## Stop Conditions

Stop and report back if:

- The human-review packet would require claims outside the roadmap boundary.
- Source freshness or authority cannot be judged without fresh web
  verification.
- The review would need profile/source edits before the human reviewer has
  decided.
- A lead-review check returns `REVISE`, `FAIL`, or `PAUSE`.

## Required Next Action

After this preparation sprint, send
`archive/sprints/INSPECT-1/INSPECT-1-human-review-packet.md` to the human
reviewer. Do not start INSPECT-2 or implement corrections until the human
review decision is recorded.
