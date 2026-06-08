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

## Ledger

| Sprint | Status | Scope | Primary outputs | Commit | Notes |
| --- | --- | --- | --- | --- | --- |
| `QS-SETUP-0` | closed | Create quality-standards roadmap and current-state audit. | `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`; `references/data/inspection-standards/README.md`; `archive/sprints/INSPECT-0/INSPECT-0-current-state-audit.md` | `613c7eab` | Setup only. No schemas, validators, lesson-output changes, overlays, reports, or compliance claims. |
| `INSPECT-0` | closed | Source register plus Dutch VO evidence-profile design. | `references/data/inspection-standards/source-register.json`; `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`; `docs/inspection-standards/nl-vo-evidence-model.md`; validation and closure logs. | `271890f8` | Bounded research/data work. No generated lesson changes or tooling gates. |
| `QS-ROADMAP-HOME-1` | closed | Move the roadmap into a dedicated quality-standards roadmap folder and add governance companions. | `docs/roadmaps/quality-standards/README.md`; `docs/roadmaps/quality-standards/sprint-ledger.md`; `docs/roadmaps/quality-standards/quality-standards-end-state.md`; moved roadmap path. | this commit | Structural documentation only. No source-profile semantics or production behaviour changed. |
| `QS-ROADMAP-HOME-2` | closed | Remove mistaken content-production framing from the quality-standards folder and connected inspection evidence docs. | `docs/roadmaps/quality-standards/README.md`; `docs/roadmaps/quality-standards/sprint-ledger.md`; `docs/roadmaps/quality-standards/quality-standards-end-state.md`; `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`; connected inspection evidence docs. | this commit | Quality-standards documentation only. The folder is explicitly not about writing student-facing content. |
| `QS-ROADMAP-HOME-3` | closed | Add sprint-protocol reminder and summary to the quality-standards sprint ledger. | `docs/roadmaps/quality-standards/sprint-ledger.md` | this commit | Documentation-only reminder based on `AGENTS.md`, `agents/lead-reviewer-agent.md`, and `agents/testing-agent.md`. |

## Candidate Future Sprints

These are not authorised implementation work until a human review explicitly
approves the packet.

| Candidate sprint | Intended scope | Authorisation status |
| --- | --- | --- |
| `INSPECT-1` | Human review of source register and Dutch VO evidence profile; corrections only. | not authorised |
| `INSPECT-2` | Evidence schema and validator design for inspection/quality evidence records. | not authorised |
| `INSPECT-3` | Dutch scoped evidence-pack prototype for one bounded generated output slice. | not authorised |
| `INSPECT-4` | International common-quality profile design after Dutch profile review. | not authorised |
| `INSPECT-5` | Scope-wide standards evidence roll-up across authorised generated artifacts and supporting review records. | not authorised |

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
