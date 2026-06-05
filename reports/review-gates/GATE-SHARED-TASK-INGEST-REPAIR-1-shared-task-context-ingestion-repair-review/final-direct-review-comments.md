# GATE-SHARED-TASK-INGEST-REPAIR-1 Final Direct Review Comments

Recorded: 2026-06-05

Reviewed remote evidence snapshot: `codex/shared-task-ingest-repair4` at
`95f0eda5f51eb7868cb947dc3e8f081957b2afb4`.

Remote branch head at recording:
`845d974161f0fc8f375cb2d3d66baf1b169b46a3`.

Decision:

```text
GATE-SHARED-TASK-INGEST-REPAIR-1: PASS WITH FLAGS
Gate direction: pass_with_flags
```

This is a limited pass. It authorizes only later controlled
adoption-preparation for shared task context handling. It does not authorize
generated lesson output, protected reference mutation, source-data mutation,
product-route adoption, target-equivalent completion language, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, broad product use, or student
use.

The reviewer accepted that the fourth repair crossed the threshold for the
limited gate question: whether the shared task system can ingest source-context
exercises and produce usable review-only transformed tasks for later controlled
adoption-preparation.

## Administrative Caveat

The prior all-zero reviewed evidence hash would have blocked closure. The
current packet records the real reviewed remote evidence commit
`95f0eda5f51eb7868cb947dc3e8f081957b2afb4`, and the remote branch exists.

GitHub status evidence at recording:

- `git ls-remote origin refs/heads/codex/shared-task-ingest-repair4` returned
  branch head `845d974161f0fc8f375cb2d3d66baf1b169b46a3`.
- GitHub commit status API returned no status contexts for `845d974...`.
- GitHub check-runs API returned no check runs for `845d974...`.
- GitHub commit status API returned no status contexts for `95f0eda...`.
- GitHub check-runs API returned no check runs for `95f0eda...`.

Because no GitHub status context exists for the branch commits, closure relies
on the pushed branch evidence plus local validators recorded in the closure
proposal and gate closure. This does not create product authority.

## Prompt Comments

### SHAREDINGEST-Q1

Pass. The source-authority question is resolved enough for this gate. No
additional source-authority repair is needed now.

### SHAREDINGEST-Q2

Pass with flag. The original actual-exam question remains visible in the
right-side task flow while the source remains readable. Carry this as a general
shared-task rule: original prompt/question must be visible in the task pane for
transformed source tasks.

### SHAREDINGEST-Q3

Pass with flag. Actual-exam task 1 now uses conceptual setup instead of a
mechanical select-all-numbers interaction. Carry this as a transformation rule:
source selection is useful only when it checks a genuine source-use decision.

### SHAREDINGEST-Q4

Pass with flag. The calculation task now requires accepting `649` with
reasonable yearly unit variants, targeted feedback, progressive support, and
the premium-difference shortcut. Carry the feedback pattern into future
calculation tasks: number-correct/unit-wrong and answer-correct/work-missing
must receive targeted feedback rather than generic failure.

### SHAREDINGEST-Q5

Pass. Actual-exam task 3 carries the calculated value and constrains the
direction selection. Carry-forward values should become a shared task-shell
pattern rather than an ad hoc hardcoded feature.

### SHAREDINGEST-Q6

Pass. Keep the textbook source bounded as owned-source only. No issue.

### SHAREDINGEST-Q7

Pass with flag. The primary textbook task is now `graph_construction_substitute`
with axis choices, click-to-place points, visible grid, delayed labels/scale,
and a same-workspace constructed line. Carry the flag that this is a
review-only substitute, not yet a final graphing engine.

### SHAREDINGEST-Q8

Pass with flag. The reveal policy is acceptable: grid visible from the start,
labels/scale hidden before correct axis selection, and the line drawn in the
same workspace. Carry the reveal policy as a general source/task rule: do not
reveal answer-bearing labels, completed graph, or solution structure before
the relevant student action.

### SHAREDINGEST-Q9

Pass with flag. The 50 percent follow-up is simplified enough for this gate.
Carry it as secondary to graph construction; later product work may make it
optional or non-blocking.

### SHAREDINGEST-Q10

Pass. No product-authority overclaim blocker remains. The packet still blocks
generated lesson output, protected reference mutation, source-data mutation,
product-route adoption, target-equivalent completion language, diagnostics,
adaptive routing, mastery, sequencing, PV projection, Scale Gate 1, broad
product use, and student use.

### SHAREDINGEST-Q11

Carry these flags before later adoption-preparation:

1. Keep the real published branch/commit evidence in the packet and closure.
2. Record this as `pass_with_flags`, not broad product approval.
3. Add a roadmap row for a later shared-task hardening sprint series.
4. Make graph construction substitute, carried-value conclusion, progressive
   calculation feedback, source/support separation, and reveal timing general
   shared-task patterns.
5. Add future work for high-quality multiple choice with feedback,
   guided-exercise ingestion, explanation detours, and wider bounded
   exam/textbook ingestion trials.

### SHAREDINGEST-Q12

Decision:

```text
pass_with_flags
```

## Closure Confirmation

The reviewer stated that this can now pass with flags and that the correct next
move is to close the gate with flags, then continue the roadmap sequence. This
is recorded as explicit human confirmation for `gate-closure.md/json`, after
the real remote evidence hash condition was satisfied.
