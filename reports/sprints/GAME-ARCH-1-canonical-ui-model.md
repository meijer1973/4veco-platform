# Sprint GAME-ARCH-1: Canonical UI Model

Generated: 2026-05-31

## Core Principle

The default architecture is one visible route layer plus one shared task shell.
Domain engines may provide task data, domain visuals, and domain-specific
evaluation helpers, but they should not each invent a different task UI,
feedback grammar, route language, or progress meaning for the same student
action.

## Layers

### 1. Shared Student Route Layer

Responsibilities:

- show paragraph target in student language;
- show the relevant route subset for reasoning, calculation, graph/table,
  checkpoint, or mixed work;
- show recommended focus and next local practice action;
- show local progress only;
- hide internal MTU, generator, and operation codes;
- avoid diagnostics, mastery, sequencing, and proof claims.

Decision: keep and harden.

### 2. Shared Task-Type Shell

Responsibilities:

- render common task families;
- collect responses consistently;
- validate task data and blocked student-facing terms;
- provide neutral feedback and retry/self-check states;
- support keyboard/focus, mobile, and light/dark QA;
- allow later target-chain validation without forcing every task into choice
  form.

Required task families:

- numeric input;
- calculation/work capture;
- final-answer entry;
- unit/notation field;
- short constructed response;
- table-value selection;
- graph reading;
- point placement or graph-construction substitute;
- structured reasoning or short explanation where self-check/feedback overlaps.

Decision: keep as core architecture.

### 3. Domain Modules

Domain modules may remain separate where the domain logic is real:

- graph/table module: source tables, graphs, axis convention, interpolation,
  point placement, construction substitute, graph-specific feedback;
- math/calculation module: formulas, numeric evaluation, percentage/index
  notation, work capture, common calculation errors;
- reasoning module: causal chains, explanation structures, answer-form
  scaffolding, example-chain comparison;
- checkpoint composition module: target-operation chain assembly, mixed task
  sequencing, proof-status metadata, completion-language eligibility.

Decision: keep domain modules, but refactor them so shared task shell and route
layer own the common interaction contract.

## Short Check Model

The short check is a local advisory checkpoint. It may appear mid-lesson or as
a controlled `Check` surface when reviewed output exists. Its job is:

- tell the student how the current local route is going;
- recommend the next useful action;
- point to a game or skill that needs practice;
- optionally advise continuing for now while revisiting a weak skill later
  after a reviewed advisory-copy rule exists.

It must not:

- prove the paragraph target exercise;
- replace the target-equivalent exit ticket;
- grade, diagnose, sequence, or claim mastery;
- unlock or automatically move a student;
- use paragraph-completion proof language.

## Target-Equivalent Exit-Ticket Model

The target-equivalent exit ticket is a separate proof task. It must:

- be at the same cognitive level as the paragraph target exercise;
- cover the complete reviewed target-exercise operation chain;
- use answer forms matching the target exercise;
- compose shared task-shell families as needed;
- connect to answer-form MTUs and EX overlay boundaries where relevant;
- authorize only local paragraph-level completion language after
  GATE-L1.7B-Q2 approval.

Decision: hold implementation for L1.7B-Q2 and GATE-L1.7B-Q2 after
GAME-ARCH-2/GATE-ENGINE-1.

## Feedback Grammar

All shared practice/check feedback should follow this grammar:

1. what was checked;
2. what the student did;
3. what to repair or practise next;
4. next action in the route.

Feedback may be positive, corrective, or self-check oriented. It must remain
local and neutral unless a later gate authorizes stronger completion language.

## Exception Rule

An engine may keep domain-specific UI only when the UI represents a genuinely
domain-specific action that the shared shell cannot responsibly render yet.
The exception must be documented and reviewed. If the domain UI duplicates a
shared task family, it should be wrapped, refactored, or rebuilt around the
shared task shell.

## GAME-ARCH-2 Handoff

GAME-ARCH-2 should turn this model into a concrete architecture plan:

- file-level keep/wrap/deprecate/rebuild list;
- route-layer API;
- task-shell extension policy;
- domain-module contracts;
- checkpoint composition contract;
- state ownership and storage rules;
- copy/advice rules for short checks;
- target-chain proof requirements for exit tickets.
