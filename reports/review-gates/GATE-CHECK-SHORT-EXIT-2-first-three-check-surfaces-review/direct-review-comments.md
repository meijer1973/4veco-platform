# Direct Review Comments

Gate: `GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review`
Sprint: `CHECK-SHORT-EXIT-2`
Recorded: 2026-06-05

## Decision

```text
GATE-CHECK-SHORT-EXIT-2: REVISE
Gate direction: hold_for_surface_repair
Additional direction: replan before the next human gate
```

This is not a failure, but it is not a small-patch revise. The reviewer found
that the packet proves generated pages, screenshots, and authority boundaries,
but does not prove the product end-state quality required for the first three
check surfaces.

The gate remains open. Do not write `closure-proposal.md/json` or
`gate-closure.md/json`. Do not proceed to `SCALE-PROOF-3P`,
`GATE-PRODUCT-3P`, product-route adoption, new target-equivalent completion
language, diagnostics, mastery/sequencing, PV, Scale Gate 1, or
student/product use.

## Core Review Finding

The current implementation proves that generated pages exist. It does not yet
prove that the first-three-paragraph check experience is coherent, visually
strong, graph-rich where graph-richness is required, or aligned with the
shared-task graph/source workspace work that just passed with flags.

The most obvious blocker is `1.1.3 Grafieken en tabellen`. The advisory
`Korte check` contains ordinary multiple-choice questions and no graph
workspace, no rendered graph, no source/table split, and no task-shell
interaction. The proof JSON records `task_shell_count: 0`,
`context_block_count: 0`, and `graph_workspace_required: false` for
`1.1.3-short`.

The `1.1.3` exit-ticket data is stronger, but the generated product does not
yet render as a polished source/task graph workspace.

## Prompt Comments

### CHECKSURFACE-Q1 - Landing Pages

Classification: blocking product-quality revise.

Landing pages may show both `Korte check` and `Exit ticket`, but this is not
enough. The landing page should make the difference between advisory repair
and target-equivalent proof visually and behaviorally obvious. It should also
show why a student would choose one path.

### CHECKSURFACE-Q2 - `1.1.1` Short Check

Classification: hold for broader product audit.

No main blocker was identified here, but this surface should not be approved in
isolation while the overall check system is below standard.

### CHECKSURFACE-Q3 - `1.1.1` Exit Ticket

Classification: hold for broader product audit.

It remains a candidate only, which is correct. The next review should judge
whether it is genuinely target-equivalent, not merely rendered.

### CHECKSURFACE-Q4 - `1.1.2` Short Check

Classification: hold with preservation condition.

It must not weaken or duplicate the reviewed `1.1.2` exit-ticket authority. The
current packet claims the reviewed `1.1.2` authority remains preserved, but the
whole three-paragraph surface needs a design-level recheck.

### CHECKSURFACE-Q5 - `1.1.2` Exit Ticket

Classification: preserve.

Preserve the prior reviewed authority. Do not destabilize this while repairing
the broader check system. `1.1.2` remains the only locally approved
completion-language case.

### CHECKSURFACE-Q6 - `1.1.3` Short Check

Classification: blocking revise.

The short check has no graph, no table/source context, no task shell, and no
graph workspace. This is not acceptable for `Grafieken en tabellen`.

### CHECKSURFACE-Q7 - `1.1.3` Exit Ticket

Classification: blocking product-quality revise.

The source data contains a better graph-construction candidate, but the
generated exit-ticket surface does not yet follow the source/task split and
graph-workspace experience from the shared-task ingestion repair. The graph
task is present in the data, but the full rendered product experience is not
yet good enough.

### CHECKSURFACE-Q8 - Source/Context Labels

Classification: partially repaired, still insufficient as quality evidence.

Label hygiene is necessary, but not a serious product-quality measure by
itself. It should remain in the validator, but it should not be confused with
visual QA.

### CHECKSURFACE-Q9 - Screenshots And Proof JSON

Classification: insufficient evidence.

The proof captures screenshots and verifies page existence, but it does not
prove product quality. The review lab itself is a navigation/screenshot aid,
not a strong playable review surface.

### CHECKSURFACE-Q10 - Authority Boundary

Classification: accepted boundary.

Boundary language is acceptable. The packet correctly withholds product
adoption, new completion language, diagnostics, mastery, sequencing, PV, Scale
Gate 1, and student use. The problem is not overclaim. The problem is
insufficient product quality.

### CHECKSURFACE-Q11 - Required Repairs

Classification: sprint-series required.

A single patch is not enough. The team needs a sprint series before the next
human gate:

```text
CHECKSURFACE-RESET-1
GRAPH-CHECK-UX-1
GRAPH-EXIT-UX-1
CHECK-ROUTE-COPY-1
VISUAL-QA-HARDEN-2
CHECK-SURFACE-PREGATE-1
GATE-CHECK-SHORT-EXIT-2-RETRY
```

### CHECKSURFACE-Q12 - Decision

Classification: gate direction.

```text
hold_for_surface_repair
```

## Product Reset Direction

Do not ask for another human gate after patching one or two files. The next
packet should demonstrate a coherent, visually strong, graph-first student
experience for `1.1.3`, while preserving the reviewed `1.1.2` authority and
keeping `1.1.1` / `1.1.3` completion language held.
