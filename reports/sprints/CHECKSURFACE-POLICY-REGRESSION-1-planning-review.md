# CHECKSURFACE-POLICY-REGRESSION-1 Planning Review

Generated: 2026-06-06

## Verdict

PASS WITH REQUIRED CONDITIONS BEFORE EXECUTION.

## Review

The plan correctly treats the old retry packet as superseded and inserts a
policy/regression sprint before any renewed human-review request. That is
necessary because the reviewer complaint is not only about one `1.1.3`
surface; it is about lost institutional memory.

## Required Conditions

| Condition | Status | Required action |
|-----------|--------|-----------------|
| Durable policy | required | Add the rule to stable specs, not only sprint prose. |
| Negative fixtures | required | Include the exact failure modes named in human feedback. |
| Generated-output statement | required | State that generated output is not hand-patched; later redesign regenerates through deploy. |
| Prior artifacts | required | Treat old repair artifacts as baseline evidence, not closure evidence. |
| Gate pause | required | Update roadmap text that currently points directly to retry comments. |
| Authority bounds | required | Preserve `1.1.2` authority only; keep `1.1.1` and `1.1.3` held. |

## Stop Conditions Added

- Stop if the checker cannot catch a correct-only interval selector.
- Stop if the roadmap still sends the old retry packet directly.
- Stop if any result claims the renewed human gate is complete.

## Planning-Agent Note

The plan has a clear generated-output statement: this sprint writes policy,
checker, and proof artifacts. Surface regeneration is authorized only in the
next redesign sprint and must use the platform deploy pipeline.
