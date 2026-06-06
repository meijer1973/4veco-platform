# CHECKSURFACE-POLICY-REGRESSION-1 Lead Review Round 1

Generated: 2026-06-06

## Verdict

REVISE.

## Findings

| ID | Severity | Finding | Required correction |
|----|----------|---------|---------------------|
| CSPR1-LR1-1 | medium | The checker initially matched exact prose and failed on a line-wrapped policy sentence. | Match policy meaning with regex instead of exact line layout. |
| CSPR1-LR1-2 | medium | The checker initially tried to validate ordinary choice tasks through `TaskShellEngine`. | Validate only actual `task_shell` tasks through the shared engine. |

