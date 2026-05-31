# Sprint GAME-ARCH-1: Component Decision Matrix

Generated: 2026-05-31

## Decision Summary

GAME-ARCH-1 recommends keeping the shared route layer, shared task shell, and
graph UI direction; refactoring math, reasoning, short-check advice, and
checkpoint composition around target-operation chains; and rebuilding or
removing duplicate engine-specific UI/state/feedback paths when they cannot
consume the shared route and shared task shell cleanly.

This is not an implementation authorization. It is the decision input for
`GAME-ARCH-2` and `GATE-ENGINE-1`.

## Matrix

| Component | Current status | Decision | Rationale | Required next action |
|---|---|---|---|---|
| Shared skill-map / route layer | Visible in live Book 1 routes after SKILLMAP-OP-1; route text avoids internal MTU codes. | Keep and harden. | This layer now gives students route context and should not be replaced. It still needs stronger keyboard/focus proof, route clarity, and direct operation-chain links. | GAME-ARCH-2 defines route API and target-chain linkage. GATE-ENGINE-1 inspects live rendered route panels. |
| Shared task-type shell | Used by graph, math, reasoning, and checkpoint-compatible fixtures. | Keep as core architecture. | The shell now supports the shared input families needed across practice and checkpoint tasks. | GAME-ARCH-2 makes the shell the default for overlapping interactions and defines exception rules. |
| Graph/table practice | Strongest route after GRAPH-UX-2; covers table, graph, axis, interpolation, point placement, construction substitute, calculation, and less-labelled variant. | Keep/refactor as reference pattern. | The direction is correct and should guide other routes, but target-chain composition and source/explanation answer quality are not yet proven. | Use graph route as reference in GAME-ARCH-2; keep target-equivalent publication for L1.7B-Q2/GATE-L1.7B-Q2. |
| Math/calculation practice | Task-shell integrated for `A38`/`A39`; primary route restored in `wiskundevaardigheden.html`. | Refactor around target-exercise operation chains. | The route is useful practice, but the target requires multi-step percentage/index tasks plus notation trap explanation. | GAME-ARCH-2 defines how math tasks compose with answer forms and short response in exit-ticket readiness. |
| Reasoning practice | Six modes, structured reasoning self-check, richer feedback. | Refactor around answer-form and constructed-response standards. | Self-check is valuable, but it does not yet evaluate exam-style `leg uit`, `motiveer`, `analyseer`, or correction-model-specific answer construction. | GAME-ARCH-2 aligns reasoning practice with answer-form MTUs and future EX overlay boundaries. |
| Current short check / local checkpoint | `1.1.1` has a useful `Korte check` with `targetReadinessEvidence: false`. | Keep as advisory local check. | It is valuable as an in-between check and local route-advice surface. It must not be confused with target-equivalent proof. | Add copy/advice rules in specs and roadmaps; later sprint may improve advice quality without proof claims. |
| Target-equivalent exit ticket | Specified but not published for `1.1.2` or `1.1.3`; `1.1.1` current check is not equivalent proof. | Hold for separate implementation. | The exit ticket must be a thorough proof task at target level and separate from the short check. | L1.7B-Q2 and GATE-L1.7B-Q2 own implementation and completion-language approval after GAME-ARCH-2/GATE-ENGINE-1. |
| Exit-ticket engine / checkpoint composition | Runtime can render task-shell checkpoint fixtures, but target-equivalent pages are not published. | Refactor/build around shared shell and target-chain coverage. | The engine should compose graph, math, source, and constructed-response task families instead of narrowing checks to choices. | GAME-ARCH-2 defines checkpoint composition architecture and proof requirements. |
| Remaining engine-specific UI/state/feedback logic | Graph, math, and reasoning each still own wrappers, collection, feedback placement, and progress conventions. | Rebuild or remove duplicate paths when they cannot consume shared route/task shell cleanly. | The rule should be hard: duplicate paths are acceptable only as thin domain wrappers. If they create drift, rebuild them around the shared shell. | GAME-ARCH-2 inventories keep/wrap/deprecate/rebuild file paths and state ownership. |
| `Stappenplan` / procedure support | Still useful as support, not primary math route. | Keep as support. | It should reinforce procedure steps, but not replace scoped math/calculation practice. | Keep visible as support/extra route; do not promote to primary calculation engine without review. |

## Architecture Decision

Proceed to `GAME-ARCH-2` before `GATE-ENGINE-1`.

Reason: the current engines are no longer weak enough to justify an immediate
full rebuild, but they still need a canonical architecture plan for shared
route, shared task shell, domain modules, checkpoint composition, state
ownership, advice copy, and target-operation coverage.

## Explicit Non-Decisions

- No engine refactor is authorized by GAME-ARCH-1.
- No target-equivalent exit-ticket page or source data is authorized.
- No student-facing completion language is authorized.
- No diagnostics, adaptive routing, mastery, sequencing, summative use, PV,
  Scale Gate 1, or student/product use is authorized.
