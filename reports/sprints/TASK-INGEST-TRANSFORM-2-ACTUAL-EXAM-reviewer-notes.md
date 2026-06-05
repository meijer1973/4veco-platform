# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Reviewer Notes

Generated: 2026-06-05

Status: revised for repair-3 interaction quality after renewed gate review.

## What Changed

The required sequence was reduced from six cards to three cards:

1. source values through compact table-cell selection;
2. calculation;
3. carried-value conclusion with constrained direction.

This preserves target-task economy while repairing interaction quality.

The reviewer flagged the previous six-card sequence as over-composed. The
formula-builder, step-ordering, and source-chain cards were removed as
required cards and retained only as collapsed support or trace evidence where
useful.

Repair 3 adds the original exam question to the right task pane before the
cards, removes repeated value/role dropdown rows from task 1, and makes task 3
consume the task-2 `EUR 649 per jaar` result.

## Checker Focus

`TaskShellEngine` validates all three tasks. The checker rejects:

- missing source values;
- final-answer-only calculation;
- bogus calculation work;
- missing conclusion direction;
- missing original right-pane exam question;
- repeated value/role dropdown rows;
- task 3 without carried task-2 value;
- free-text direction instead of constrained direction;
- required `formula_builder`, `step_ordering`, or `source_chain_builder` cards.

## Boundary

This is review-only transformation evidence. It grants no human-gate closure,
generated output, product route, target-equivalent proof, diagnostics,
mastery/sequencing, Scale Gate 1, or student/product authority.
