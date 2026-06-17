# Sprint TEXTBOOK-FIGURE-STANDARD-1: Textbook Figure Standard

## Goal

Add the detailed textbook figure standard named as a follow-up by
`TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1`.

This is a platform-only policy sprint. It does not edit lesson content, does
not regenerate textbook output, and does not start Book 2 Chapter 2.2
production.

## Context

`TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1` established the core rule: markdown and
governed records remain the content source of truth, while final rendered PDF
and HTML pages are the acceptance proof for student-facing readability, layout,
visual legibility, and print/product quality.

That sprint intentionally left detailed figure rules to this named follow-up.
Recent textbook QA showed why the detail matters: a figure can pass source
existence checks while its labels, subtitle, legend, or graph text remain too
small after final page scaling.

This sprint creates the figure-specific specification so future textbook
sprints know what to check before rendering and what still requires rendered
output proof.

## Quality Standard

The governing specifications are:

- product end-state: `../4veco-lessen/specifications/product-end-state.md`;
- textbook end-state: `docs/roadmaps/textbook/textbook-end-state.md`;
- original report spec:
  `C:\Users\meije\.codex\attachments\72b95bfa-b57b-4d9e-a86e-8666bd18fd61\pasted-text.txt`;
- upstream policy sprint:
  `reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-result.md`;
- rendered-page standard:
  `references/authored/textbook-rendered-page-acceptance-standard.md`;
- REV-STD-1 review discipline as implemented in
  `agents/lead-reviewer-agent.md`.

The quality floor is a durable figure specification with explicit source
preflight rules, rendered output proof boundaries, student-facing figure
blockers, and follow-up separation. The figure standard must deepen the
rendered-page standard without weakening it: source checks can catch risks
early, but final figure acceptance still depends on full-page rendered proof.

Because this policy affects student-facing textbook quality, the plan and
review records must use REV-STD-1:

- cite product end-state and this original sprint/report spec;
- name non-negotiable requirements;
- include a core-requirement checklist;
- classify findings;
- include `blocks`, `does_not_block`, and `proof_required_to_close` for carried
  issues.

PASS WITH FLAGS may not carry a missing core requirement. A visible
student-facing figure defect in final rendered textbook output is a blocker,
not a future flag.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| [CORE] Add a durable textbook figure standard. | `references/authored/textbook-figure-standard.md` defines source hygiene, graph conventions, readability guards, proof layers, blockers, mixed-section rules, and closure fields. | Lead review confirms the standard is concrete enough for future figure-heavy textbook sprints. | Planned |
| [CORE] Preserve rendered-page authority. | The new standard cites `textbook-rendered-page-acceptance-standard.md` and says source preflight cannot replace full-page rendered proof. | Lead review blocks closure if source checks are treated as final acceptance. | Planned |
| [CORE] Define source-asset expectations. | Standard names SVG/PNG pairing, regeneration, stable filenames, stale export prevention, editable source, and figure-reference integrity. | Review verifies future agents can distinguish source hygiene from rendered proof. | Planned |
| [CORE] Define graph and label conventions. | Standard names axes, units, direct labels, staged figures, color-not-sole-meaning, text/number concordance, legends, and split-attention risks. | Review checks that student-facing figure comprehension is represented, not only asset existence. | Planned |
| [CORE] Define blocking figure defects. | Standard states unreadable labels, clipping, overlap, graph/text contradictions, missing figures, stale exports, color-only meaning, and missing figure proof block closure. | Lead review verifies PASS WITH FLAGS cannot carry those as missing core requirements. | Planned |
| [CORE] Wire the standard into active workflow expectations. | Textbook end-state, roadmap, ledger, authored README, rendered-page standard, and lead-reviewer instructions cite the figure standard. | Sprint bundle and lead-review evidence cite the changed workflow files. | Planned |
| Preserve product-gate boundaries. | Policy says textbook figure closure does not authorize diagnostics, adaptive routing, mastery, sequencing, PV, Scale Gate 1, product-route adoption, or student/product-use gates. | Scope-language and lead review confirm no widened authority. | Planned |
| Keep this sprint platform-only. | No `../4veco-lessen` content or generated output changes. | Diff summary and status evidence prove lesson repo was not edited by this sprint. | Planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add detailed textbook figure standard | `include_now` | This is the direct named follow-up from the rendered-page policy sprint. |
| Wire standard into reviewer and roadmap instructions | `include_now` | Future figure-heavy sprints need the standard at active workflow entry points. |
| Clarify source preflight versus rendered proof | `include_now` | This prevents future closure based only on SVG or cropped figure checks. |
| Build PDF-to-PNG/contact-sheet automation now | `defer_named_follow_up` | This remains the separate `RENDERED-PROOF-WORKFLOW-1` sprint. |
| Add quality-ref schema fields now | `defer_named_follow_up` | This remains the separate `TEXTBOOK-QUALITY-REF-SCHEMA-RENDERED-PROOF-1` sprint after the workflow exists. |
| Retrofit every older figure immediately | `reject_scope_creep` | The report and rendered-page standard say older output should be backfilled when touched or through explicit print QA. |
| Edit lesson textbook content or generated output | `reject_scope_creep` | This policy sprint changes platform governance only. |

## Allowed paths

- `references/authored/textbook-figure-standard.md`
- `references/authored/textbook-rendered-page-acceptance-standard.md`
- `references/authored/README.md`
- `docs/roadmaps/textbook/textbook-end-state.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`
- `agents/lead-reviewer-agent.md`
- `reports/sprints/TEXTBOOK-FIGURE-STANDARD-1-*`
- `references/data/sprints/TEXTBOOK-FIGURE-STANDARD-1.plan.json`
- `references/data/sprints/TEXTBOOK-FIGURE-STANDARD-1.result.json`
- Repository maps and indexes refreshed by the normal platform workflow if required.

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No edits under `../4veco-lessen/`.
- No textbook paragraph, chapter, or book content edits.
- No generated lesson output regeneration.
- No validator that claims to judge subjective visual quality automatically.
- No diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1,
  product-route adoption, or student/product-use authorization.

## Inputs

- `C:\Users\meije\.codex\attachments\72b95bfa-b57b-4d9e-a86e-8666bd18fd61\pasted-text.txt`
- `../4veco-lessen/specifications/product-end-state.md`
- `docs/roadmaps/textbook/textbook-end-state.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `references/authored/textbook-rendered-page-acceptance-standard.md`
- `references/authored/didactiek-principes.md`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `agents/lead-reviewer-agent.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`

## Outputs

- Durable textbook figure standard under `references/authored/`.
- Workflow references to the new figure standard.
- Sprint plan, plan JSON, baseline, result, diff summary, command log, result
  JSON, and lead-review records.
- No lesson-side output.

## Operationalized sprint procedure

1. Create this plan, plan JSON, baseline, and active textbook ledger row before
   implementation. Run the plan and planned-bundle checks. Stop if the plan
   does not satisfy the sprint protocol.
2. Add `references/authored/textbook-figure-standard.md`. It must define source
   asset hygiene, graph conventions, readability and density guards, source
   preflight proof, rendered acceptance proof, blockers, and closure-record
   requirements.
3. Wire the policy into active workflow documentation: textbook end-state,
   roadmap or ledger expectations, references/authored inventory,
   rendered-page standard follow-up list, and lead-review instructions for
   figure-heavy textbook sprints. Stop if the wiring implies old output is
   retroactively defective or if it authorizes product gates.
4. Run the acceptance validators. If a core requirement is missing, fix it
   inside scope or stop with a blocking result; do not close as PASS WITH
   FLAGS.
5. Prepare result, diff summary, and command-log evidence.
6. Run a lead-review round according to `agents/lead-reviewer-agent.md`. Apply
   any required corrections or record that none were required, then run a
   round-2 recheck.
7. Run the complete sprint bundle check and normal diff/status checks before
   treating the sprint as complete.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TEXTBOOK-FIGURE-STANDARD-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TEXTBOOK-FIGURE-STANDARD-1
node build-scripts/sprints/check-scope-language.js --active
node build-scripts/sprints/check-sprint-result.js reports/sprints/TEXTBOOK-FIGURE-STANDARD-1-result.md
node build-scripts/sprints/check-lead-review-substance.js TEXTBOOK-FIGURE-STANDARD-1
node build-scripts/sprints/check-sprint-bundle.js TEXTBOOK-FIGURE-STANDARD-1 --complete
npm.cmd run check:platform
git diff --check
git -C ../4veco-lessen diff --check
git -C ../4veco-lessen status --short --branch
```

No rendered lesson-output proof is required for this sprint because this sprint
does not change student-facing textbook output. The standard must state when
future figure-changing sprints do require rendered proof.

## Proof Required to Close

Closure proof must include the new figure standard, workflow references, plan
and baseline, command-log evidence for the acceptance checks, result and diff
summary, lead-review assignment/round-1/corrections/round-2 records, result
JSON with classified findings, and complete-bundle validation.

The lead review must explicitly say whether the standard satisfies the report's
named figure-standard follow-up. Any carried issue must include `blocks`,
`does_not_block`, and `proof_required_to_close`. PASS WITH FLAGS may carry only
separate follow-up work such as rendered-proof automation or quality-ref schema
work; it may not carry a missing figure standard, missing rendered-proof
boundary, or missing blocker rule for unreadable figures.

## Rollback plan

If this sprint is rejected, remove the new figure standard and
`TEXTBOOK-FIGURE-STANDARD-1-*` sprint artifacts, restore the textbook
roadmap/ledger/end-state/lead-review/reference README/rendered-page-standard
edits, and rerun the same sprint checks. Do not touch `references/machine/`,
`references/external/`, or `../4veco-lessen/`; this sprint should not change
them.

## Human review required

No separate human gate is required for this platform-only policy sprint unless
the lead reviewer finds that the policy changes product authority rather than
clarifying textbook figure proof expectations. A strict lead-review cycle is
required before closure, and it must use REV-STD-1.

