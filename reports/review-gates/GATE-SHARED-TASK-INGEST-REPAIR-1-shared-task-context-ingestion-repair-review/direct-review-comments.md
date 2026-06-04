# GATE-SHARED-TASK-INGEST-REPAIR-1 Direct Review Comments

Date received: 2026-06-04

Source: `C:\Users\meije\.codex\attachments\3e63554c-b97b-4398-b24d-6d5247c09112\pasted-text.txt`

Decision: `hold_for_playable_repair`

Status: returned human comments recorded; gate remains open; no closure or
product authority.

## Overall Decision

The source/context ingestion track has a good technical basis, but the current
gate must not pass. The correct gate direction is:

```text
SHAREDINGEST-Q12: hold_for_playable_repair
```

This is a `REVISE`, not a fail. The source-authority basis, exam/textbook
separation, and layout direction should be preserved, but the current labs are
too generic to prove task playability or learner/reviewer completion quality.

## What Is Good Enough

- The actual-exam source authority is much improved and uses external-primary
  exam evidence for `vw-1022-a-25-1-o:opgave-1:question-3`.
- The actual-exam source reconstruction correctly preserves the Zoohee table
  values and official prompt/correction model references.
- The textbook source remains correctly bounded as `owned_textbook_source` and
  explicitly rejects official exam or external-primary authority.
- The split source/question layout is directionally useful and should be kept.

## Blocking Problems

1. The `Controleer` buttons do not semantically evaluate answers. They mark a
   card complete on click and the demo path fills dummy text, so completion
   proof is not meaningful task playability proof.
2. The rendered controls are generic. Real value banks, role banks, token
   banks, step banks, source-chain nodes, and concrete options are collapsed
   into blank fields, blank textareas, or `Keuze A` / `Keuze B`.
3. Several prompts are too open for a student or reviewer. Each card must state
   the exact action, available input source, expected answer form, and whether
   one or more answers are expected.
4. Correction-model formulas and procedure support are visible immediately as
   source context. Source material, task prompt, and optional support must be
   separated; support should be collapsed by default.
5. The proof and lead review overweight layout and underweight task clarity,
   affordance, wrong-answer handling, and support policy.

## Prompt Comments

### SHAREDINGEST-Q1

The actual-exam source authority is much improved and appears adequate as a
basis for review. However, the reconstruction includes a formula block from the
correction model as visible source context. Move correction-model operations
out of the default source pane into collapsed support.

### SHAREDINGEST-Q2

The layout repair is useful: the question strip remains visible and the source
pane is independently scrollable. The blocker is not the layout; it is that
visible question controls do not make clear what the student is supposed to
enter and task-family affordances are not rendered.

### SHAREDINGEST-Q3

No. The actual-exam task cards are not playable enough. They use generic text
inputs and blank textareas where value banks, role banks, formula tokens, step
banks, and source-chain nodes are required. Check buttons mark completion
regardless of semantic correctness.

### SHAREDINGEST-Q4

The underlying JSON and traces avoid final-answer-only reduction, but the
rendered lab still feels too open because it often reduces the task to writing
something in a textarea.

### SHAREDINGEST-Q5

Yes. The textbook evidence is correctly bounded as owned-source only and does
not imply official exam authority. Preserve that boundary.

### SHAREDINGEST-Q6

The source/question layout is readable enough as a first layout prototype, but
the questions are too open. The textbook source pane also gives too much help
immediately by showing table, graph, formula, and procedure flowchart together.

### SHAREDINGEST-Q7

The 50 percent ambiguity is handled better than before because both valid
intervals are recorded. The student-facing question still needs clearer
wording about whether one valid interval, all valid intervals, or an ambiguity
explanation is expected.

### SHAREDINGEST-Q8

The task-family maps and answer-form traces are promising, but not enough for
adoption-preparation. Rendered controls must preserve the task-family
interactions.

### SHAREDINGEST-Q9

The screenshots and proof JSON are sufficient to judge layout and scroll
behavior. They are not sufficient to judge task clarity, answer affordance, or
correctness handling.

### SHAREDINGEST-Q10

The packet does not overclaim product authority. The problem is insufficient
playable task quality, not authority overclaim.

### SHAREDINGEST-Q11

Required repairs before adoption-preparation:

1. Replace generic review controls with real task-family controls.
2. Hide formulas and procedure hints by default unless the surface is guided
   practice.
3. Separate source material from optional support.
4. Rewrite prompts so each states exact action and expected answer form.
5. Add task-clarity and affordance checks.
6. Make `Controleer` semantically evaluate answers or rename it to review-only
   marking.
7. Add at least one wrong-answer/retry state per task family.
8. Re-run human review after revised playable labs and screenshots are
   committed.

### SHAREDINGEST-Q12

Decision:

```text
hold_for_playable_repair
```

The basis is good, but the current labs are not good enough for later
controlled adoption-preparation.

## Quality Log

| Issue | Category | Severity | Next action |
|---|---|---|---|
| Generic controls instead of task-family affordances | Playable-lab quality | Blocking | Implement real task-family renderers. |
| Check buttons do not validate answers | Playability / proof validity | Blocking | Use semantic validation or rename to review-only marking. |
| Formula/support shown as default source | Source fidelity / hint policy | High | Move formulas and correction-model support into collapsed support boxes. |
| Textbook source gives too much help immediately | Guided-practice design | High | Separate source from support/procedure aids. |
| Questions are under-specified | Didactic clarity | Blocking | Rewrite prompts with action, source, answer form, and number of required items. |
| Gate checker overweights layout | Evidence validator gap | High | Add task-affordance and support-policy checks. |

## Required Next Sprint

Create and run `SHARED-TASK-INGEST-PLAYABLE-REPAIR-1` before any gate closure.
The repair must produce revised actual-exam and textbook labs, updated proof
with wrong/retry/correct/completed states, updated checker coverage, lead
review, and a refreshed packet for another direct human review.
