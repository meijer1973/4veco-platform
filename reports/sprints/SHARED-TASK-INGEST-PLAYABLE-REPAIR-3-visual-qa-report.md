# SHARED-TASK-INGEST-PLAYABLE-REPAIR-3 Visual QA Report

Generated: 2026-06-05

Status: PASS for repair-3 review-lab evidence; human gate remains open.

## Scope

This report reviews only the repaired playable labs for:

- right-pane actual exam question orientation;
- compact actual-exam source-cell selection;
- task-3 carry-forward conclusion;
- click-to-place textbook graph construction;
- delayed graph labels and numeric scale;
- completed graph hidden before graph-construction success;
- source-pane readability without visible long file paths;
- desktop, mobile, and dark proof.

It authorizes no generated lesson output, product-route adoption,
target-equivalent proof, diagnostics, mastery/sequencing, Scale Gate 1, or
student/product use.

## Evidence Inspected

- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- actual-exam screenshots: desktop initial, wrong/retry, corrected,
  completed, mobile completed, mobile dark completed;
- textbook screenshots: desktop initial, axis-selected, wrong/retry,
  corrected, completed, mobile completed, mobile dark completed.

## Actual-Exam Lab QA

| Check | Result |
|---|---|
| Original exam question visible in right task pane | PASS |
| Source pane has no prompt block | PASS |
| Source pane hides long `references/` paths | PASS |
| Source table visible at source-pane top | PASS |
| Desktop source pane shows table comfortably | PASS |
| Task 1 uses compact source-cell selection | PASS |
| Task 1 avoids repeated value/role dropdown rows | PASS |
| Task 3 requires task 2 before showing the carried value | PASS |
| Completed path carries `EUR 649 per jaar` into task 3 | PASS |
| Task 3 uses constrained direction selection | PASS |
| Mobile and dark completed states render | PASS |

Mobile source panes may scroll vertically, but the source table remains visible
from the top of the source pane and long file paths are not shown.

## Textbook Lab QA

| Check | Result |
|---|---|
| Source pane has no prompt block | PASS |
| Source pane hides long `references/` paths | PASS |
| Source table visible at source-pane top | PASS |
| Desktop source pane shows table comfortably | PASS |
| Completed graph absent before construction success | PASS |
| Graph workspace is in the main task pane | PASS |
| Desktop graph workspace width passes | PASS |
| Initial graph hides axis labels and numeric scale | PASS |
| Axis-selected state reveals labels and scale only after correct axis choice | PASS |
| Primary graph interaction is click-to-place | PASS |
| Typed coordinate entry is collapsed fallback only | PASS |
| Wrong/retry state does not reveal completed graph | PASS |
| Corrected/completed states reveal completed graph after success | PASS |
| Mobile and dark completed states render | PASS |

## Residual Risk

The click-to-place interaction is deterministic review-lab proof, not a general
freehand graph drawing engine. A later product-route adoption sprint must
review keyboard/touch ergonomics, accessibility labeling, and route-specific
student use before adoption.

