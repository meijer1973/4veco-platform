# Sprint TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1: Rendered-Page Acceptance Policy

## Goal

Turn the Book 2 rendered-output lesson into a durable textbook policy:
markdown remains the content source of truth, while final rendered PDF and HTML
pages are the acceptance proof for student-facing readability, layout, visual
quality, and print/product quality.

This is a platform-only policy sprint. It does not edit lesson content, does
not regenerate textbook output, and does not close any product gate.

## Context

The report for this sprint identifies a recurring risk in textbook work:
source-level validators can pass while the actual rendered page still contains
visible student-facing defects. A figure can have acceptable SVG source text
but become unreadable when scaled on an A4 page; a table can be valid in
markdown but overflow after rendering; and a sprint packet can say "checked"
without pointing reviewers to the exact full-page proof.

Existing platform policy already says review gates must inspect rendered
student-facing output, and `MIXED-OPGAVEN-TARGET-STANDARD-1` already created a
separate target standard for mixed sections. What is missing is a durable
textbook rendered-page acceptance standard and explicit closure-record language
for textbook sprint closure.

This sprint implements the report's first recommended policy sprint:
`TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1`.

## Quality Standard

The governing specifications are:

- product end-state: `../4veco-lessen/specifications/product-end-state.md`;
- textbook end-state: `docs/roadmaps/textbook/textbook-end-state.md`;
- original sprint/report spec: the rendered-page acceptance report in
  `C:\Users\meije\.codex\attachments\d7f55c2a-4391-4a58-8e36-8f6fcb4b4e5e\pasted-text.txt`;
- REV-STD-1 review discipline as implemented in `agents/lead-reviewer-agent.md`.

The quality floor is policy clarity, not broad enforcement. The standard must
make clear that rendered output is acceptance proof for student-facing
readability and layout, but not the source of truth for content. It must name
the full-page proof required for textbook sprints, classify visible
student-facing defects as blockers, preserve PASS WITH FLAGS discipline, and
define proof artifact conventions that future validators and review records
can adopt. Any omitted automation or detailed figure work must be named as a
follow-up, not hidden inside this sprint's closure claim.

Because this policy affects student-facing textbook quality, the plan and
review records must use REV-STD-1:

- cite product end-state and this original sprint/report spec;
- name non-negotiable requirements;
- include a core-requirement checklist;
- classify findings;
- include `blocks`, `does_not_block`, and `proof_required_to_close` for carried
  issues.

PASS WITH FLAGS may not carry a missing core requirement. A visible
student-facing defect in final rendered textbook output is a blocker, not a
future flag.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| [CORE] Add a rendered-page acceptance standard. | `references/authored/textbook-rendered-page-acceptance-standard.md` defines content-source vs rendered-acceptance authority, scope, required proof, checklist, pass/fail rule, proof convention, closure-record fields, and non-goals. | Lead review confirms the standard is durable enough for future textbook sprints. | Planned |
| [CORE] Preserve markdown/content governance. | Standard states markdown and target records remain content source of truth; rendered PDF/HTML is reader-experience acceptance proof. | Lead review blocks closure if rendered output is made the content source of truth. | Planned |
| [CORE] Require full-page rendered proof for student-facing textbook changes. | Standard and textbook sprint protocol require final PDF/HTML proof, page PNGs or contact sheets, pages inspected, and defect disposition. | Closure records include exact paths, pages inspected, and known warnings. | Planned |
| [CORE] Define visible-defect blocker rules. | Standard says clipped text, overlap, unreadable labels, table overflow, missing figures, broken glyphs, stale generated output, and missing answer models cannot be carried as PASS WITH FLAGS. | Lead review verifies PASS WITH FLAGS carries only non-core future work. | Planned |
| [CORE] Define proof artifact convention. | Standard names `reports/rendered-proof/<sprint-id>/<artifact-id>/` and required manifest fields for PDF page renders/contact sheets. | Review can cite the convention and future validators can check artifact existence without judging subjective readability. | Planned |
| [CORE] Wire policy into textbook workflow expectations. | Textbook ledger/end-state/lead-review instructions cite the standard and rendered-output proof expectation. | Sprint bundle and lead-review evidence cite the changed workflow files. | Planned |
| Preserve product-gate boundaries. | Policy says textbook closure does not authorize diagnostics, adaptive routing, mastery, sequencing, PV, Scale Gate 1, or student/product-use gates. | Scope-language and lead review confirm no widened authority. | Planned |
| Keep this sprint platform-only. | No `../4veco-lessen` content or generated output changes. | Diff summary and git status prove lesson repo remains unchanged. | Planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add durable rendered-page acceptance standard | `include_now` | This is the direct report request and blocks reliable future chapter/textbook closure. |
| Add textbook sprint/review protocol references to the standard | `include_now` | Future agents need a stable citation point in active workflow files, not only a standalone policy document. |
| Include figure acceptance principles in the standard | `include_now` | The report explicitly calls out source-asset hygiene versus full-page rendered legibility, while leaving detailed figure rules for a later sprint. |
| Build a full proof-generation workflow now | `defer_named_follow_up` | The report recommends a separate `RENDERED-PROOF-WORKFLOW-1`; this sprint defines the policy and convention only. |
| Add a detailed figure standard now | `defer_named_follow_up` | The report recommends `TEXTBOOK-FIGURE-STANDARD-1` as a follow-up so figure rules can get proper depth. |
| Retrofit all older paragraphs and chapters | `reject_scope_creep` | The report explicitly says not to retrofit every old paragraph immediately. |
| Edit lesson textbook content or generated output | `reject_scope_creep` | This policy sprint changes platform governance only. |

## Allowed paths

- `references/authored/textbook-rendered-page-acceptance-standard.md`
- `references/authored/README.md`
- `docs/roadmaps/textbook/textbook-end-state.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `agents/lead-reviewer-agent.md`
- `reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-*`
- `references/data/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1.plan.json`
- `references/data/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1.result.json`
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

- `C:\Users\meije\.codex\attachments\d7f55c2a-4391-4a58-8e36-8f6fcb4b4e5e\pasted-text.txt`
- `../4veco-lessen/specifications/product-end-state.md`
- `docs/roadmaps/textbook/textbook-end-state.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `references/authored/gemengde-opgaven-target-standard.md`
- `agents/lead-reviewer-agent.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`

## Outputs

- Durable rendered-page acceptance standard under `references/authored/`.
- Textbook workflow references to the new standard.
- Sprint plan, plan JSON, baseline, result, diff summary, command log, result
  JSON, and lead-review records.
- No lesson-side output.

## Operationalized sprint procedure

1. Create this plan, plan JSON, baseline, and active textbook ledger row before
   implementation. Run the plan and planned-bundle checks. Stop if the plan
   does not satisfy the sprint protocol.
2. Add `references/authored/textbook-rendered-page-acceptance-standard.md`.
   It must distinguish content source authority from rendered acceptance proof,
   define mandatory full-page proof for student-facing textbook changes, name
   blocker/flag examples, and define a proof artifact convention.
3. Wire the policy into active workflow documentation: textbook end-state or
   ledger expectations, references/authored inventory, and lead-review
   instructions for textbook sprints. Stop if the wiring implies old output must
   be retroactively defective or if it authorizes product gates.
4. Run the acceptance validators. If a core requirement is missing, fix it
   inside scope or stop with a blocking result; do not close as PASS WITH FLAGS.
5. Prepare result, diff summary, and command-log evidence.
6. Run a lead-review round according to `agents/lead-reviewer-agent.md`. Apply
   any required corrections and run a round-2 recheck. Repeat if the recheck is
   not positive.
7. Run the complete sprint bundle check and normal diff/status checks before
   treating the sprint as complete.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1
node build-scripts/sprints/check-scope-language.js --active
node build-scripts/sprints/check-sprint-result.js reports/sprints/TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1 --complete
npm.cmd run check:platform
git diff --check
git -C ../4veco-lessen diff --check
```

No rendered lesson-output proof is required for this sprint because this sprint
does not change student-facing textbook output. The standard must state when
future sprints do require rendered proof.

## Proof Required to Close

Closure proof must include the new standard, workflow references, plan and
baseline, command-log evidence for the acceptance checks, result and diff
summary, lead-review assignment/round-1/corrections/round-2 records, result
JSON with classified findings, and complete-bundle validation.

The lead review must explicitly say whether the standard satisfies the report's
core request. Any carried issue must include `blocks`, `does_not_block`, and
`proof_required_to_close`. PASS WITH FLAGS may carry only follow-up work such
as detailed figure standard or proof-workflow automation; it may not carry a
missing rendered-page acceptance standard or missing PASS WITH FLAGS blocker
rules.

## Rollback plan

If this sprint is rejected, remove the new rendered-page standard and
`TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1-*` sprint artifacts, restore the textbook
ledger/end-state/lead-review/reference README edits, and rerun the same sprint
checks. Do not touch `references/machine/`, `references/external/`, or
`../4veco-lessen/`; this sprint should not change them.

## Human review required

No separate human gate is required for this platform-only policy sprint unless
the lead reviewer finds that the policy changes the product end-state rather
than clarifying textbook proof expectations. A strict lead-review cycle is
required before closure, and it must use REV-STD-1.
