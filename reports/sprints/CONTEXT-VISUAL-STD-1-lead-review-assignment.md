# Lead Review Assignment: CONTEXT-VISUAL-STD-1

Generated: 2026-06-04

## Scope

Lead reviewer must inspect the source context visual standard before sprint
closure. The review scope covers the standard document, machine-readable
contract, deterministic checker, planning review, command logs, current runtime
crosswalk, and the no-generated-output/no-protected-reference boundary.

This is a standard/checker sprint. It is not an exam-ingestion,
source-reconstruction, generated lesson-output, target-equivalent proof, PV,
diagnostics, mastery, student-use, or Scale Gate sprint.

## Evidence to Inspect

- `reports/sprints/CONTEXT-VISUAL-STD-1-plan.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-baseline.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-planning-review.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-visual-standard.md`
- `reports/json/context-visual-std1-contract.json`
- `build-scripts/sprints/check-context-visual-std1.js`
- `reports/json/task-context-spec1-contract.json`
- `reports/json/task-context-runtime1-proof.json`
- `reports/sprints/CONTEXT-VISUAL-STD-1-command-log.jsonl`
- `engines/task-shell.css`
- `engines/task-shell-ui.js`

## Review Questions

- Does the standard cover the roadmap visual terms: semantic tables,
  reconstructed SVG graphs/figures/flowcharts, formula boxes, source cards,
  captions, labels, color tokens, typography, spacing, mobile behavior, dark
  mode, axis/legend conventions, SVG sizing, alt text, and source-label rules?
- Does the contract cover all eight `TASK-CONTEXT-SPEC-1` block types?
- Do source-label, caption, and context-reference rules keep student-facing
  labels visible without exposing raw internal IDs?
- Are mobile, dark-mode, accessibility, graph/axis/legend, formula, table,
  SVG, and source-output parity proof expectations concrete enough for later
  source reconstruction?
- Does the checker deterministically reject missing coverage and verify
  protected-reference/source-data/generated-output boundaries?
- Does the standard correctly absorb only the visual-source part of
  `DUAL-CODING-STD-1` and name residual follow-up without generic decoration
  scope?
- Are any corrections required before closure?

## Reviewer

Lead reviewer: verification subagent plus main-agent structural round-2
recheck.

## Required Output

Round 1 must return PASS, PASS WITH FLAGS, REVISE, FAIL, or PAUSE with concrete
findings. Round 2 must recheck the corrected artifacts before closure.

Use the strict lead-review summary shape:

- Scope
- Review Plan
- Consolidated Verdict
- Blocking Findings
- Specialist Findings
- Test Evidence
- Learning Quality Evidence
- Student Experience Evidence
- Ownership and Handoff
- Required Next Action
