# INSPECT-1A Sprint Plan

Status: closed
Date: 2026-06-08
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising review: `C:\Users\meije\.codex\attachments\a7ea07bd-619a-4a1c-80ba-567b75f083bf\pasted-text.txt`

## Purpose

INSPECT-1A implements the corrections-only packet authorised by the Head of
Strategy review of INSPECT-1.

The sprint closes source-register completeness and claim-hygiene corrections
only. It does not accept the Dutch profile, start schema design, create
validators, generate evidence packs, add country overlays, integrate dashboard
or quality-ref gates, change lesson output, or make compliance claims.

## Quality Floor

The correction packet is acceptable only if:

- Dutch vwo economie curriculum, exam, and correction-model authority sources
  are explicitly present as non-inspection sources.
- Weak or non-canonical source URLs are corrected where identified by the
  human review, especially the Flanders OK-framework entry.
- Every source has a `use_in_v0_profile` classification using the approved
  vocabulary: `inspection_anchor`, `curriculum_anchor`,
  `accountability_context`, or `comparator_only`.
- Safe claims use the exact tighter wording approved by the human review.
- The extra OP0/basic-skills forbidden claim is present.
- Source register and Dutch profile remain draft/pending review.
- Validation and closure logs make the correction scope auditable.

## Specification Requirements

Fulfill the human review decision:

- add Dutch curriculum/assessment authority sources to
  `source-register.json`;
- correct weak/non-canonical source URLs where needed;
- tighten safe claims in the JSON profile, markdown evidence model, and local
  overlay README where the same claims appear;
- add the extra OP0 forbidden claim;
- keep all status fields draft/pending review;
- update sprint ledger, validation log, lead-review records, and closure log.

## Evidence Needed

- Source-register diff showing added Dutch curriculum/assessment sources and
  `use_in_v0_profile` values.
- Profile/model/README diff showing approved safe and forbidden claims.
- Official source URLs recorded in the register.
- Validation commands with exit-code evidence.
- Lead-review assignment, round-1 review, correction log, and round-2 recheck.
- Closure log naming changed files, pushed commit, flags, and next action.

## Review Gate

Lead review judges INSPECT-1A closure readiness. The next human gate is a
correction review of the closed INSPECT-1A packet. Human review is required
before INSPECT-2, pilot audit, schema design, or any implementation beyond this
correction packet.

## Operational Procedure

1. Confirm dedicated worktree, branch, and clean starting state.
2. Read `AGENTS.md`, sprint ledger, INSPECT-1 records, the human review, and
   the current source/profile/model/README files.
3. Verify official source URLs for the Dutch vwo economie subject page,
   syllabus/examenprogramma, first-period exam, correction model, and Flanders
   OK-framework canonical source.
4. Update sprint ledger to track INSPECT-1A.
5. Apply only the authorised source-register and claim-hygiene corrections.
6. Refresh URL index and repository maps if sprint/report paths changed.
7. Run validation proportional to the changed surfaces.
8. Run lead-review round 1, apply any required correction, and record round-2
   recheck.
9. Commit, push the task branch, verify remote branch state, and record
   closure.
10. End the final response with the operational next action.

## Allowed Paths

- `references/data/inspection-standards/source-register.json`
- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `references/data/inspection-standards/README.md`
- `docs/inspection-standards/nl-vo-evidence-model.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `archive/sprints/INSPECT-1A/`
- generated repository maps/indexes refreshed by standard commands

## Forbidden Paths And Claims

Forbidden:

- schemas;
- validators;
- generated evidence packs;
- country overlays;
- dashboard gates;
- quality-ref integration;
- Scale Gate integration;
- generated lesson-output changes;
- legal compliance or inspectorate approval claims;
- accepting the source register or profile before correction review.

## Acceptance Criteria

- `source-register.json` parses and includes the authorised Dutch
  curriculum/assessment source entries.
- All source entries include `use_in_v0_profile` with the approved vocabulary.
- Flanders OK-framework URL points to a stronger canonical official source.
- JSON profile safe claims exactly match the human-review wording.
- JSON profile forbidden claims include the added OP0/basic-skills claim.
- Markdown docs no longer preserve the weaker "helps schools demonstrate"
  wording.
- Status fields remain draft/pending review.
- Validation, lead-review, closure, and ledger records are updated.
- Task branch is committed and pushed; `main` is not touched.

## Stop Conditions

Stop and report if:

- an official source URL cannot be verified;
- corrections require adding schema/tooling/overlay behavior;
- the source/profile would need to be marked accepted to satisfy the request;
- validation fails and cannot be repaired inside the authorised correction
  scope;
- branch or worktree safety fails.

## Required Next Action

After INSPECT-1A closes, send the correction packet for human correction review.
Do not start INSPECT-2, a pilot audit, schema design, or broader implementation
until that review explicitly authorises the next sprint.
