# Textbook End State Draft

Updated: 2026-06-08
Roadmap: `docs/roadmaps/textbook/textbook-production-roadmap.md`

## Purpose

This is a first attempt at the end state for the complete textbook set. It describes what should be true when the three-year economics course has a full, coherent set of printed textbooks and answer materials.

## End-State Claim

The finished textbook set is a complete three-year course for vwo economics. It gives students a stable printed route from first economic reasoning and graph/table fluency through market analysis, government intervention, market structures, market failure, and labor-market topics. Each book is usable as a standalone printed learning object for its year or course block, while the full set works as one coherent curriculum.

## Textbook Set

| Book | Role In The Set | End-State Expectation |
|---|---|---|
| Book 1 | Foundations, demand, supply, and market equilibrium. | Students learn the shared language, calculations, graphs, and market basics needed before production, elasticity, surplus, and policy topics. |
| Book 2 | Costs, revenue, elasticity, and surplus. | Students learn cost and revenue reasoning, break-even, marginal thinking, elasticity, and welfare/surplus foundations. |
| Book 3 | Government intervention and market structures. | Students apply Book 1 and Book 2 foundations to taxes, subsidies, price controls, quotas, perfect competition, and monopoly. |
| Book 4 | Advanced market forms, market failure, and labor market. | Students synthesize market-structure reasoning, market-failure analysis, and labor-market concepts in exam-ready contexts. |

## Student-Facing Quality

Each printed paragraph should have a clear learning route: short theory, one or more worked examples, visual or tabular support when it improves understanding, a target-opgave or equivalent capstone task, independent exercises, and an answer model that explains the route as well as the result.

The set should feel consistent across all books:

- Same notation for the same concept.
- Same graph conventions for axes, curves, labels, shifts, equilibrium points, shaded areas, and break-even points.
- Same distinction between theory paragraphs and gemengde-opgaven sections.
- Same answer-model style: calculations with units, concise reasoning, and explicit interpretation of graphs and tables.
- Same print rhythm, so students know what kind of work each page is asking from them.

## Completeness Standard

The full set is complete only when every count-bearing paragraph has:

- Current source files for theory, exercises, and answers, or exercise/answer-only files for gemengde-opgaven sections.
- Target-exercise evidence that is reviewed-final or explicitly accepted by a documented human decision.
- Generated rendered output for student book and answer materials.
- Validated asset references, SVG/PNG pairs where relevant, and graph/table concordance.
- Chapter-level and book-level validation.
- A quality/reflection record naming any carried flags and why they do not block publication.

## Curriculum Coherence

The three-year set should avoid isolated topic islands. Each book should prepare the next:

- Book 1 builds graph, table, demand, supply, and equilibrium foundations.
- Book 2 turns those foundations into firm behavior, revenue, elasticity, and welfare reasoning.
- Book 3 uses those tools for policy and market-structure analysis.
- Book 4 asks students to combine the full toolkit in more complex market and labor-market contexts.

Target exercises should remain the spine of the curriculum. If a paragraph teaches a skill, the target exercise and answer model must make that skill visible enough for review.

## Teacher And Maintenance End State

A teacher should be able to open any book and see a stable chapter sequence, print-ready student material, print-ready answer material, and review evidence for the current version. Maintainers should be able to regenerate the books without hand-patching generated output, then use validators and review packets to catch drift.

## Non-Goals

This textbook end state does not by itself authorize companion scaling, diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative decisions, or product-wide deployment. Those may use textbook evidence later, but they require their own explicit gates.

## Open Design Questions

- Whether the final set should remain four printed books across the three-year course or be packaged differently for teacher use.
- How much exam-style mixed practice belongs inside each book versus in separate test-week or exam-preparation materials.
- Which target-exercise placeholders need replacement before they can support final textbook publication.
- How strict the final visual-density standard should be for graph-heavy chapters.
