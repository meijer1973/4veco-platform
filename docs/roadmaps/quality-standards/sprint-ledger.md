# Quality Standards Sprint Ledger

Status: active
Updated on: 2026-06-09
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

## Quality-Standards External Review Gate

INSPECT-5R and all later quality-standards sprints that prepare generator
planning, evidence packs, teacher-facing summaries, public claims, dashboards,
quality-ref integration, Scale Gate integration, overlays, or generated-output
changes must use the three-reviewer gate:

| Reviewer role | Required verdict before proceeding |
|---|---|
| Teacher reviewer | `MORE_THAN_SATISFIED` |
| Legal/privacy reviewer | `MORE_THAN_SATISFIED` |
| Dutch quality-inspection reviewer | `MORE_THAN_SATISFIED` |

Verdict scale:

```text
REVISE
PASS
MORE_THAN_SATISFIED
```

Any `REVISE` or `PASS` blocks progression. A `PASS` is not enough for this
quality-standards track because the owner requires the reviewer team to be
more than merely satisfied. Corrections must be logged, implemented, validated,
lead-reviewed, pushed, and re-reviewed before the next sprint can be
authorised.

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
| `INSPECT-2` | closed / pass_with_required_profile_adjustment | Bounded read-only pilot evidence audit of Book 1 Chapter 1.1 against the Dutch v0 evidence categories. | `archive/sprints/INSPECT-2/INSPECT-2-sprint-plan.md`; `archive/sprints/INSPECT-2/INSPECT-2-bounded-pilot-evidence-audit.md`; `archive/sprints/INSPECT-2/INSPECT-2-validation-log.md`; `archive/sprints/INSPECT-2/INSPECT-2-lead-review-round2.md`; `archive/sprints/INSPECT-2/INSPECT-2-closure-log.md` | `1a1f718b` | Head of Strategy accepted the audit and required INSPECT-2A before schema design. Categories locate real evidence, but evidence-finality language was insufficient. |
| `INSPECT-2A` | closed / pass | Corrections-only profile adjustment before schema design. Adds evidence-finality, target-equivalent proof, subject-material OP0, title/source reconciliation, diagnostic-report status, and per-category product/school boundary language. | `archive/sprints/INSPECT-2A/INSPECT-2A-sprint-plan.md`; `archive/sprints/INSPECT-2A/INSPECT-2A-correction-packet.md`; `archive/sprints/INSPECT-2A/INSPECT-2A-validation-log.md`; `archive/sprints/INSPECT-2A/INSPECT-2A-lead-review-round2.md`; `archive/sprints/INSPECT-2A/INSPECT-2A-closure-log.md` | `06a7b34f` plus this commit | Head of Strategy accepted INSPECT-2A and authorised INSPECT-3 report-only schema design. Dutch profile remains `status: draft`; `review_status` stays `draft_adjusted_for_schema_design`. |
| `INSPECT-3` | closed / pass_with_minor_guardrails | Report-only inspection evidence schema design. Creates a diagnostic schema and schema notes while preserving evidence state/finality, target-equivalent proof, source-pointer types, OP0 boundaries, and product/school boundaries. | `references/schemas/inspection-evidence.schema.json`; `docs/inspection-standards/report-only-schema-design.md`; `references/data/inspection-standards/schema-notes.md`; `archive/sprints/INSPECT-3/INSPECT-3-sprint-plan.md`; `archive/sprints/INSPECT-3/INSPECT-3-validation-log.md`; `archive/sprints/INSPECT-3/INSPECT-3-closure-log.md` | `360e3ad6` plus this commit | Head of Strategy accepted INSPECT-3 and authorised INSPECT-4. Guardrails: claim checks are not complete semantic detection; only full-report mode may require all eight categories; weak evidence can be valid. |
| `INSPECT-4` | closed / pass_with_required_refinement | Report-only validator design. Adds a manual diagnostic validator for inspection-evidence report objects, validator notes, validator design docs, and a pilot sample object. | `build-scripts/inspection/validate-inspection-evidence.js`; `docs/inspection-standards/report-only-validator-design.md`; `references/data/inspection-standards/validator-notes.md`; `references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json`; `archive/sprints/INSPECT-4/INSPECT-4-sprint-plan.md`; `archive/sprints/INSPECT-4/INSPECT-4-validation-log.md`; `archive/sprints/INSPECT-4/INSPECT-4-closure-log.md` | `f8b174d2` plus this commit | Head of Strategy accepted INSPECT-4 but required INSPECT-5 before generator planning because the invalid-status/schema-depth boundary needed refinement. |
| `INSPECT-5` | closed / pass | Strictly non-blocking validator refinement. Clarifies `SCHEMA_INVALID_REPORT_ONLY`, adds schema-backed object-contract checks and repeatable negative fixtures, and keeps the validator manual/non-integrated. | `build-scripts/inspection/validate-inspection-evidence.js`; `references/data/inspection-standards/fixtures/negative/*.sample.json`; `docs/inspection-standards/report-only-validator-design.md`; `references/data/inspection-standards/validator-notes.md`; `archive/sprints/INSPECT-5/INSPECT-5-sprint-plan.md`; `archive/sprints/INSPECT-5/INSPECT-5-validation-log.md`; `archive/sprints/INSPECT-5/INSPECT-5-closure-log.md` | this commit | No report-only generator planning, package script, CI/build integration, dashboard gate, quality-ref integration, Scale Gate work, evidence pack, teacher inspection pack, overlay, generated lesson-output change, or compliance claim. |
| `INSPECT-5R` | in progress / tri-agent guardrail | External review, privacy, teacher-usefulness, OP0, and claim-safety guardrails before INSPECT-6. Records teacher/legal/privacy/Dutch quality-inspection review as mandatory and requires `MORE_THAN_SATISFIED` from all three roles. | `archive/sprints/INSPECT-5R/INSPECT-5R-sprint-plan.md`; `archive/sprints/INSPECT-5R/INSPECT-5R-external-review-intake.md`; `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md`; `docs/inspection-standards/teacher-facing-evidence-pack-template.md`; roadmap and ledger updates. | pending closure commit | Guardrail sprint only. No report-only generator implementation, evidence pack, dashboard gate, quality-ref integration, Scale Gate work, lesson-output mutation, personal-data processing, or compliance/approval claim. |

## Candidate Future Sprints

These are not authorised implementation work until a human review explicitly
approves the packet.

| Candidate sprint | Intended scope | Authorisation status |
| --- | --- | --- |
| `INSPECT-6` | Report-only generator planning, only after INSPECT-5R tri-agent review reaches `MORE_THAN_SATISFIED` for teacher, legal/privacy, and Dutch quality-inspection reviewers and the owner explicitly authorises generator planning. | not authorised |
| `INSPECT-7` | Dutch scoped evidence-pack prototype for one bounded generated output slice, only after INSPECT-6 passes tri-agent review and the owner explicitly authorises a prototype pack. | not authorised |
| `INSPECT-8` | International common-quality profile design after Dutch profile/schema/validator review. | not authorised |
| `INSPECT-9` | Scope-wide standards evidence roll-up across authorised generated artifacts and supporting review records. | not authorised |

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
