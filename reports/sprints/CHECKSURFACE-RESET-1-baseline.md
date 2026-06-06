# CHECKSURFACE-RESET-1 Baseline

Generated: 2026-06-05

## Reviewed Gate State

The direct human review returned:

```text
GATE-CHECK-SHORT-EXIT-2: REVISE
Gate direction: hold_for_surface_repair
Additional direction: replan before the next human gate
```

The prior packet state was `direct_human_review_packet_prepared_not_closed`.
The reviewer rejected another narrow gate round and asked for a product-quality
reset before any retry gate.

## Deterministic Baseline Evidence

From `reports/json/check-short-exit2-proof.json`:

- `1.1.3-short.task_shell_count = 0`;
- `1.1.3-short.context_block_count = 0`;
- `1.1.3-short.graph_workspace_required = false`;
- `1.1.3-exit.task_families` includes `graph_construction_substitute`,
  `graph_reading`, and `calculation_work_capture`;
- `1.1.3-exit.context_block_count = 4`;
- screenshots were captured, but the proof focuses on existence and structural
  state rather than product-quality judgment.

From `source-data/book-1/exit-ticket/1.1.3-korte-check.json`:

- all three tasks are ordinary `choice` tasks;
- no `contextBlocks` are present;
- no graph workspace is present.

From `reports/sprints/CHECK-SHORT-EXIT-2-lead-review-round2.md`:

- lead review recorded `PASS WITH FLAGS`;
- lead review said no blocking findings remained;
- that review missed the central product defect in the graph paragraph short
  check.

## Boundary

No closure artifacts exist at the start of the reset sprint. No product-route
adoption, new completion language, diagnostics, mastery/sequencing, PV, Scale
Gate 1, or student/product use is authorized.
