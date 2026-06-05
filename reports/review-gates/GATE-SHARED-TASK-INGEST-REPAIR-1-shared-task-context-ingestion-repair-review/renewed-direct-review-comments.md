# GATE-SHARED-TASK-INGEST-REPAIR-1 Renewed Direct Review Comments

Date received: 2026-06-04

Source: `C:\Users\meije\.codex\attachments\266c4f26-4284-4533-ae51-28792d68fb5c\pasted-text.txt`

Decision: `hold_for_playable_repair`

Status: renewed human comments recorded; gate remains open; no closure,
product authority, generated output authority, or Scale Gate authority.

## Overall Decision

The renewed review is still a `REVISE`. The correct gate direction remains:

```text
SHAREDINGEST-Q12: hold_for_playable_repair
```

The source-authority repair is mostly acceptable. The renewed blocker is task
design and didactic usability: the revised labs are too fragmented and do not
center the actual target task.

## Core Judgement

The previous repair improved mechanical playability: real controls, collapsed
support, wrong/retry states, and semantic validation are now claimed in the
packet. Those repairs do not resolve the deeper problem.

For the textbook case, the target is:

```text
Teken een P-Q-grafiek bij de tabel.
```

That target has not been converted into the primary active task. It is still
treated as prompt/source context, while the task sequence begins with smaller
support questions. The current transformation is coverage-first instead of
target-first.

## Blocking Defects

1. The textbook target task "draw the graph" was not converted into a
   graph-construction task.
2. The textbook sequence has nine task cards where the target needs at most
   three: draw/construct the graph, read Q at `P = EUR 1.75`, and optionally
   check one 50 percent quantity drop.
3. `Opdracht` / prompt context is rendered in the source pane instead of the
   right task pane.
4. The completed textbook graph is visible as source before the student draws
   it.
5. The graph workspace is cramped into a side pane; visual QA must judge graph
   workspace usability, not only scrollability.
6. The actual-exam item is still over-fragmented into six cards. It should be
   three cards: source values, calculation with visible work, conclusion with
   direction.
7. The packet/checkers still reward many mapped task families more than a
   coherent target-task experience.

## Prompt Comments

### SHAREDINGEST-Q1

The external-primary source boundary is adequate. The issue is no longer
source authority. The actual-exam item is too fragmented into procedural cards,
which makes the experience confusing rather than instructive.

### SHAREDINGEST-Q2

The source/question layout is mechanically readable, but the flow is not
pedagogically clean. A two-point threshold calculation should not require six
required cards.

### SHAREDINGEST-Q3

The revised controls may now be technically playable, but the task design is
too convoluted. Reduce the exam flow to source values, calculation, and
conclusion. Formula help belongs in collapsed support, not as a required card.

### SHAREDINGEST-Q4

The operation chain avoids final-answer-only reduction but overcorrects. The
source-chain card risks exposing the solution path instead of helping the
student build it.

### SHAREDINGEST-Q5

The owned-textbook boundary is acceptable. Keep it separate from exam
authority.

### SHAREDINGEST-Q6

Revise. The main task "Teken een P-Q-grafiek bij de tabel" is placed as
source/context in the left pane and is not converted into the active task. The
left pane is too small for table/graph work.

### SHAREDINGEST-Q7

The 50 percent ambiguity record is useful, but it should be a later or
optional follow-up. It must not distract from the primary graph-construction
task.

### SHAREDINGEST-Q8

The maps are structurally rich but overbuilt. The transformation must be
target-first, not coverage-first.

### SHAREDINGEST-Q9

Screenshots are not sufficient if they prove only scrollability and completion.
Visual QA must judge whether the workspace is large enough for the task.

### SHAREDINGEST-Q10

The packet does not overclaim product authority. That part is acceptable.

### SHAREDINGEST-Q11

Required repairs before adoption-preparation:

1. Convert "Teken een P-Q-grafiek bij de tabel" into the primary active task.
2. Move `Opdracht` from the source pane to the task pane.
3. Remove the completed graph from default source view when the task is to draw
   the graph.
4. Replace the nine-card textbook sequence with a maximum three-card sequence:
   draw graph, read graph, optional 50 percent claim.
5. Replace the six-card exam sequence with source values, calculation, and
   conclusion.
6. Add graph-construction or graph-construction-substitute controls.
7. Add visual QA criteria for graph workspace size and usability.
8. Add a validator that fails when a prompt block is rendered as source
   context.
9. Add a validator that fails when a task set exceeds the allowed maximum card
   count without a human waiver.

### SHAREDINGEST-Q12

Decision:

```text
hold_for_playable_repair
```

This remains a revise.

## Required Next Sprint

Create and run `SHARED-TASK-INGEST-PLAYABLE-REPAIR-2` before any gate closure.

The sprint must simplify the actual-exam and textbook transformations, add
graph-construction-substitute proof, add visual QA and transformation-economy
evidence, refresh the human-review packet, and leave the gate open for another
direct human review.
