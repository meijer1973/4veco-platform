# GATE-SHARED-TASK-INGEST-REPAIR-1 Planning Review
Sprint: `GATE-SHARED-TASK-INGEST-REPAIR-1`
Verdict: REVISE

## Evidence Inspected

- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-plan.md`
- `reports/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1-baseline.md`
- `references/data/sprints/GATE-SHARED-TASK-INGEST-REPAIR-1.plan.json`
- `references/reference-team-roadmap.md` row `GATE-SHARED-TASK-INGEST-REPAIR-1`
- Current rendered labs for `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` and `TASK-INGEST-TRANSFORM-3-TEXTBOOK`
- User request: repair non-playable labs, keep sources/tables/questions readable together, then prepare the human-gate packet.

## Plan Readiness

The sprint is directionally ready: it correctly treats the current labs as insufficient, requires visible controls, requires split or paired source/question readability, preserves source-authority boundaries, and blocks premature human-review closure.

The plan also correctly scopes this sprint as packet preparation and pre-gate evidence repair. It does not claim returned human comments, comment resolution, closure proposal approval, gate closure, product-route adoption, or Scale Gate authorization.

The current rendered labs confirm the user-reported gap: they contain source context and task cards, but no visible input/button/select/textarea controls for a human completion path.

## Required Corrections Before Implementation

1. Amend the plan outputs to enumerate the repaired lab artifacts with exact file paths for both prerequisite sprints. At minimum, name the regenerated lab HTML, proof JSON, screenshot manifest, screenshot directory manifest, and desktop/mobile/dark screenshot files for:
   - `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`
   - `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

2. Amend the proof/checker requirements to name where the reviewed remote branch and commit hash will be recorded for the human reviewer, such as `review-packet.json`, `bundle-urls.md`, or `live-output-evidence.json`. The packet checker should verify that this remote-publication evidence exists before the packet is treated as ready.

## Non-Blocking Notes

- `../4veco-lessen/lessen-team-roadmap.md` exists, so the lesson-roadmap input path is valid.
- The planned `build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js` does not exist yet, but it is listed as a generated output, so that is acceptable.
- The plan can keep comment-resolution logs and closure JSON out of this packet-preparation pass, provided it remains explicit that these are later work after real human comments.

## Generated Output Check

The packet outputs are clear and concrete: `review-packet.md`, `review-packet.json`, `live-output-evidence.*`, and `bundle-urls.md` are named.

The repaired lab outputs are not concrete enough yet. The plan currently says "repaired actual-exam rendered lab/proof/screenshots" and "repaired textbook rendered lab/proof/screenshots" rather than listing the exact generated files. This must be corrected before implementation so verification can check every required artifact without inference.

## Human Gate Protocol Check

The human gate protocol is correct for this stage. The plan requires a direct-comment review packet with calibration checks, comment prompts, stop conditions, answer-recording instructions, targeted follow-up protocol, and explicit human confirmation before closure.

The plan appropriately forbids premature comment-resolution records and gate-closure files.

## Stop Conditions Check

Stop conditions are mostly adequate:

- stop if either lab cannot show controls, source-scroll plus question visibility, and deterministic completion proof;
- stop if packet checker cannot reject missing playable evidence or premature closure files;
- stop on protected reference, source-data, or generated lesson-output writes;
- stop if lead-review round 2 does not pass before human review starts.

Add one explicit stop condition for missing remote-publication evidence: if the packet and cited evidence are not pushed and the remote commit/hash is not recorded, human review must not start.

## Final Recommendation

Revise the plan before implementation. The core approach is sound, but the plan needs exact generated lab output paths and remote commit/hash evidence requirements so the human-review packet can be audited without guesswork.
