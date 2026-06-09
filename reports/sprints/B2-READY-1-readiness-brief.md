# Sprint B2-READY-1: Readiness Brief

## Book 2 Production Brief

Book 2 should start with the costs-and-revenue sequence because the active v5 blueprint moved production material out of Book 1 print. Book 2 now provides the foundations for costs, revenues, break-even, marginal reasoning, elasticity, and surplus before later books take on government intervention and market structures.

Production should begin with Chapter 2.1 as a vertical slice because it tests the full printed workflow on a compact cluster: definitions and formulas, average-cost calculations, revenue and profit, break-even graphs, marginal tables, and mixed integration practice.

## Chapter 2.1 Plan

| Section | Production role | Expected printed output |
|---|---|---|
| 2.1.1 Kostenstructuren | Teach fixed, variable, and total costs plus average cost concepts. | Theory, worked example, target-opgave, independent exercises, answers, and cost-table/graph assets where useful. |
| 2.1.2 Opbrengsten, winst en break-even | Connect revenue, average revenue, profit, and break-even calculation/graphing. | Theory, worked example, target-opgave, independent exercises, answers, and TK/TO break-even graph assets. |
| 2.1.3 Marginale kosten en marginale opbrengsten | Teach marginal reasoning with table differences before any calculus framing. | Theory, worked example, target-opgave, independent table exercises, answers, and table-first explanation. |
| 2.1.4 Gemengde opgaven: kosten en opbrengsten | Consolidate and transfer 2.1.1 through 2.1.3 in exam-style mixed contexts. | Exercises and answers only; no new theory paragraph unless a later sprint explicitly changes the build contract. |

## Target-Exercise Readiness

| Section | Current evidence | Readiness decision |
|---|---|---|
| 2.1.1 | Migrated v4 target asks for TK/TVK/TCK formulas, calculations at Q = 500 and Q = 1000, GTK/GVK/GCK, and explanation of falling GCK. | Draft-ready for production planning, but requires v5 review before final closure. |
| 2.1.2 | Migrated v4 target asks for TO, profit, GO, algebraic break-even, and a TK/TO graph with break-even and profit area. | Draft-ready for production planning, but requires v5 review before final closure. |
| 2.1.3 | Migrated v4 target asks for Q/TK/TO/winst/MK/MO tables, constant-price MO, and changing MK for a quadratic-cost case. | Draft-ready for production planning, but requires v5 review before final closure. |
| 2.1.4 | Placeholder only; current prompt says to combine at least two earlier skills in one exam-style context. | Not production-ready as final target evidence. Replace before final production closure or carry as an explicit target gap into `B2-2.1-A`. |

## Notation And Graph Contract

Use these conventions consistently in 2.1:

| Concept | Contract |
|---|---|
| Cost totals | `TCK` for total constant costs, `TVK` for total variable costs, `TK = TCK + TVK`. Use `Q` for quantity. |
| Average costs | `GTK = TK / Q`, `GCK = TCK / Q`, `GVK = TVK / Q`. Explain that `GCK` falls as fixed costs spread over more units. |
| Revenue | `TO = P x Q`, `GO = TO / Q`; when price is constant, `GO = P`. |
| Profit and break-even | `winst = TO - TK`; break-even where `TO = TK` and `winst = 0`. |
| Marginal concepts | `MK = change in TK / change in Q`, `MO = change in TO / change in Q`. For 2.1.3, teach this table-first and do not introduce calculus. |
| Cost graphs | Horizontal axis is `Q`; vertical axis is money in EUR. Cost graphs must use aligned scales and label `TCK`, `TVK`, and `TK` if more than one line appears. |
| Break-even graphs | Draw `TK` and `TO`, mark the break-even point, and distinguish profit/loss zones without decorative ambiguity. |
| Tables | Table columns must make changes visible: `Q`, `TK`, `TO`, `winst`, `MK`, and `MO` where applicable. State the step size when marginal values come from table differences. |

## Book 1 Style Extraction

Book 2 should inherit these Book 1 production habits:

- Page rhythm: short theory blocks, one worked example before independent work, then a target-opgave or comparable capstone exercise.
- Target-opgave structure: match the target exercise closely enough that a reviewer can trace every required student action.
- Worked examples: show the calculation route and interpretation, not only final answers.
- Visual density: use figures only when they carry student action; keep captions and first-use references aligned with rendered output.
- Answer-model style: concise computations, clear units, and short interpretation sentences for graph/table reasoning.
- Gemengde-opgaven handling: consolidation sections are exercise-and-answer sections, not new theory sections, unless a later sprint explicitly changes that contract.

## Exit Decision

Chapter 2.1 is not yet production-ready for final closure because `2.1.4` is still a placeholder and 2.1.1 through 2.1.3 remain migrated targets needing v5 review. The next production sprint may plan around 2.1.1 through 2.1.3 as draft evidence, but it must resolve or explicitly carry the 2.1.4 target gap before final printed-output closure.
