# INSPECT-6 Planning Review

Status: pass after correction
Date: 2026-06-09
Reviewer role: planning/review agent
Reviewed commit: `1ebd19db7bb1509e04b72715cbe4179a65e417a7`

## Scope

Read-only planning review of `archive/sprints/INSPECT-6/INSPECT-6-sprint-plan.md`.

Evidence inspected:

- `archive/sprints/INSPECT-6/INSPECT-6-authorisation.md`
- `archive/sprints/INSPECT-6/INSPECT-6-sprint-plan.md`
- `archive/sprints/INSPECT-5R/INSPECT-5R-closure-log.md`
- `archive/sprints/INSPECT-5R/INSPECT-5R-external-review-results.md`
- `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `AGENTS.md`

## Verdict

Verdict: REVISE

## Blocking Findings

1. INSPECT-6 was missing `archive/sprints/INSPECT-6/INSPECT-6-correction-log.md`
   as a required output, even though the plan requires lead-review and
   external-review correction loops.
2. Teacher usefulness was underspecified because the plan did not explicitly
   require a 5-10 minute teacher/school-leader readability and usability
   threshold.
3. The review-packet contract did not explicitly require official-source
   boundary anchors for OP0/privacy/claim safety.

## Corrections Applied

The sprint plan now requires:

- `archive/sprints/INSPECT-6/INSPECT-6-correction-log.md`;
- lead-review and external-review corrections to be logged there;
- a 5-10 minute teacher/school-leader usability acceptance check;
- visible separation of `4veco evidence`, `school evidence still needed`,
  weak/missing evidence, and forbidden inference;
- official-source boundary anchors in the INSPECT-6 review packet.

## Required Next Action

Proceed with INSPECT-6 implementation within planning-only scope. Create only
the authorised generator planning documents and review packet, then validate,
lead-review, push, and send the packet for teacher, legal/privacy, and Dutch
quality-inspection `MORE_THAN_SATISFIED` review.

## Recheck

Recheck commit: `5003eb45`

Verdict: PASS

The reviewer found no remaining blockers. The corrected plan now requires:

- an INSPECT-6 correction log;
- correction logging for lead-review and external-review loops;
- a 5-10 minute teacher/school-leader usefulness threshold;
- visible separation of `4veco evidence`, `school evidence still needed`,
  weak/missing evidence, and forbidden inference;
- official-source boundary anchors for OP0/privacy/claim safety.
