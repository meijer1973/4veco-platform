# Quality Standards Sprint Ledger

Status: active
Updated on: 2026-06-08
Branch in use: `codex/quality-standards-20260608`

## Purpose

This ledger tracks the quality-standards roadmap track separately from the
large references-team roadmap. It records what has actually been authorised,
implemented, validated, and pushed.

## Sprint Protocol Reminder

Every non-trivial quality-standards roadmap sprint must follow the repository
sprint protocol before implementation starts. Read `AGENTS.md`, the relevant
roadmap section, this ledger, prior sprint logs, and the applicable review
agents first.

Do not treat a ledger row as an executable plan. A sprint row authorises or
tracks scope; it does not replace a committed sprint plan.

## Sprint Protocol Summary

Required default flow:

1. Create or update a sprint plan before implementation. The plan must expand
   the roadmap row into concrete procedure, decision points, outputs,
   acceptance tests, stop conditions, allowed paths, and forbidden paths.
2. Have a planning/review agent check the plan against the roadmap, baseline,
   required logs, review gates, and missing instructions before execution.
3. Let the main agent execute and own final integration.
4. Use specialist agents when the sprint makes claims about evidence,
   data-integrity, learning quality, accessibility, student experience,
   visuals, generated output, or code.
5. Use `agents/testing-agent.md` for test-command selection, command/exit-code
   evidence, validator interpretation, and residual-risk reporting.
6. Use `agents/lead-reviewer-agent.md` for the consolidated go/no-go decision.
   Non-trivial roadmap sprint closure requires lead-review assignment,
   round-1 review, correction log, and round-2 recheck unless an explicit
   exemption is recorded with reason, approver, and date.
7. Before closure, verify every required output from the plan exists, run the
   relevant validators, refresh generated maps/reports when repository paths or
   roadmap surfaces changed, and record validation and closure logs.
8. Human-review gates must receive lead review before the human review starts.
   Human gate artifacts do not replace the lead-review cycle.
9. A completed non-trivial sprint should not be left in a dirty local worktree:
   commit, push the task branch, and record local commit hash, remote push
   status, files changed, validators run, known flags, and the next action.
10. End every non-trivial response with explicit advice on the operational next
    step. Do not leave the user to infer the next step from a status summary.
    The final paragraph should say whether to proceed to the next sprint, send
    a human-review packet, run a validation/build step, commit/push, insert a
    new sprint, or deliberately stop/pause.

## Ledger

| Sprint | Status | Scope | Primary outputs | Commit | Notes |
| --- | --- | --- | --- | --- | --- |
| `QS-SETUP-0` | closed | Create quality-standards roadmap and current-state audit. | `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`; `references/data/inspection-standards/README.md`; `archive/sprints/INSPECT-0/INSPECT-0-current-state-audit.md` | `613c7eab` | Setup only. No schemas, validators, lesson-output changes, overlays, reports, or compliance claims. |
| `INSPECT-0` | closed | Source register plus Dutch VO evidence-profile design. | `references/data/inspection-standards/source-register.json`; `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`; `docs/inspection-standards/nl-vo-evidence-model.md`; validation and closure logs. | `271890f8` | Bounded research/data work. No generated lesson changes or tooling gates. |
| `QS-ROADMAP-HOME-1` | closed | Move the roadmap into a dedicated quality-standards roadmap folder and add governance companions. | `docs/roadmaps/quality-standards/README.md`; `docs/roadmaps/quality-standards/sprint-ledger.md`; `docs/roadmaps/quality-standards/quality-standards-end-state.md`; moved roadmap path. | this commit | Structural documentation only. No source-profile semantics or production behaviour changed. |
| `QS-ROADMAP-HOME-2` | closed | Remove mistaken content-production framing from the quality-standards folder and connected inspection evidence docs. | `docs/roadmaps/quality-standards/README.md`; `docs/roadmaps/quality-standards/sprint-ledger.md`; `docs/roadmaps/quality-standards/quality-standards-end-state.md`; `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`; connected inspection evidence docs. | this commit | Quality-standards documentation only. The folder is explicitly not about writing student-facing content. |
| `QS-ROADMAP-HOME-3` | closed | Add sprint-protocol reminder and summary to the quality-standards sprint ledger. | `docs/roadmaps/quality-standards/sprint-ledger.md` | this commit | Documentation-only reminder based on `AGENTS.md`, `agents/lead-reviewer-agent.md`, and `agents/testing-agent.md`. |
| `QS-ROADMAP-HOME-4` | closed | Add the final-answer next-step requirement to the sprint-protocol reminder. | `docs/roadmaps/quality-standards/sprint-ledger.md` | this commit | Documents the `AGENTS.md` rule that non-trivial responses must end with explicit operational next-step advice. |
| `INSPECT-1` | closed / pass_with_corrections | Human review of source register and Dutch VO evidence profile; corrections only after a recorded human decision. | `archive/sprints/INSPECT-1/INSPECT-1-sprint-plan.md`; `archive/sprints/INSPECT-1/INSPECT-1-human-review-packet.md`; `archive/sprints/INSPECT-1/INSPECT-1-lead-review-readiness.md`; `archive/sprints/INSPECT-1A/INSPECT-1A-human-review-response.md` | `abfbbfca` | Human review returned `pass_with_corrections` and authorised INSPECT-1A corrections only. No schema, validator, overlay, generated-output, dashboard-gate, quality-ref, Scale Gate, or compliance-claim authority. |
| `INSPECT-1A` | closed / pass | Corrections-only packet authorised by Head of Strategy review: Dutch curriculum/assessment source provenance, canonical URL hygiene, safe/forbidden claim tightening, and draft/pending-review preservation. | `archive/sprints/INSPECT-1A/INSPECT-1A-sprint-plan.md`; `archive/sprints/INSPECT-1A/INSPECT-1A-human-correction-review.md`; `archive/sprints/INSPECT-1A/INSPECT-1A-correction-report.md`; `archive/sprints/INSPECT-1A/INSPECT-1A-validation-log.md`; `archive/sprints/INSPECT-1A/INSPECT-1A-lead-review-round2.md`; `archive/sprints/INSPECT-1A/INSPECT-1A-closure-log.md` | `2214f294` plus this commit | Human correction review passed. Source register and profile remain `status: draft`; `review_status` moved only to `draft_accepted_for_bounded_pilot_audit`. |
| `INSPECT-2` | closed / pass | Bounded read-only pilot evidence audit of Book 1 Chapter 1.1 against the Dutch v0 evidence categories. | `archive/sprints/INSPECT-2/INSPECT-2-sprint-plan.md`; `archive/sprints/INSPECT-2/INSPECT-2-bounded-pilot-evidence-audit.md`; `archive/sprints/INSPECT-2/INSPECT-2-validation-log.md`; `archive/sprints/INSPECT-2/INSPECT-2-lead-review-round2.md`; `archive/sprints/INSPECT-2/INSPECT-2-closure-log.md` | this commit | Audit finds that categories locate real evidence, but recommends profile adjustment before schema design for evidence finality, target-proof status, diagnostic-report status, and product/school boundaries. No lesson-output changes. |

## Candidate Future Sprints

These are not authorised implementation work until a human review explicitly
approves the packet.

| Candidate sprint | Intended scope | Authorisation status |
| --- | --- | --- |
| `INSPECT-3` | Evidence schema and validator design for inspection/quality evidence records, only after the pilot audit and any required profile-adjustment review. | not authorised |
| `INSPECT-4` | Dutch scoped evidence-pack prototype for one bounded generated output slice. | not authorised |
| `INSPECT-5` | International common-quality profile design after Dutch profile review. | not authorised |
| `INSPECT-6` | Scope-wide standards evidence roll-up across authorised generated artifacts and supporting review records. | not authorised |

## Ledger Rules

1. Every non-trivial quality-standards sprint must add or update one row before
   closure.
2. A row may say `planned`, `in progress`, `closed`, `blocked`, or `rejected`.
3. Closure must record the local commit, remote push status, validation
   commands, changed files, generated reports, known flags, and recommended
   next action in the sprint closure log.
4. The ledger does not authorise work by itself. It records authorisation that
   came from the human owner or an accepted review packet.
5. Do not convert candidate future sprints into active work without preserving
   the existing forbidden-claim and no-lesson-mutation boundaries.
