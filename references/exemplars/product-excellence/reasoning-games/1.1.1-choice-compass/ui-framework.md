# Choice-Compass Reasoning Game UI Framework

## Why this framework exists

The flowchart golden exemplar worked for a price-mechanism paragraph because the target reasoning was a causal chain. §1.1.1 is different. It is about recognizing scarcity, identifying a choice, and naming the best alternative that is given up.

The UI must adapt to the paragraph target. Do not copy the visible shape of the previous exemplar if the reasoning structure is different.

## Core layout

Use the now-standard product layout:

- desktop: source-left / task-right;
- mobile: source-before-task;
- hero: short paragraph identity and game purpose;
- route card: three visible game moves;
- task cards: one cognitive operation per card;
- feedback: one feedback region per task.

## Interaction principles

### 1. One click does one complete student action

A student should not need to click a card and then click a target unless the target choice is itself part of the assessed skill.

Good:
- click evidence card → selected;
- click answer fragment → next empty line;
- click selected item × → remove one item.

Bad:
- click card → click slot → then click confirm for every small move.

### 2. Do not force order where order is not the economics

Scarcity evidence is order-free. The student needs to identify the right evidence, not arrange it into a six-step flow.

Use ordered slots only when the economic reasoning itself requires order.

### 3. Use small task count and clear mechanics

For an introductory paragraph reasoning game:

- 3 tasks is usually enough;
- first task should be immediately playable;
- each task should have one mechanic;
- no mode overload;
- no hidden puzzle rules.

### 4. Randomize card banks

Card order must be randomized so the answer is not encoded by position. The layout may give structure, but not the exact answer order.

### 5. No visible IDs or role tags

Cards must not show labels such as `cause`, `mechanism`, `answer`, `B02`, `slot-3`, or other role tags that reveal the answer. If a label helps the student, it must be normal student-facing language.

### 6. Make wrong answers possible

A valid reasoning game includes plausible distractors:

- chosen alternative instead of opportunity cost;
- lower-value non-chosen alternative;
- sum of all non-chosen alternatives;
- “no scarcity because money is earned”;
- vague or conclusion-only answer.

### 7. Feedback names the economic misconception

Do not only say “try again.” Feedback should identify the weakness:

- limited means missing;
- best forgone alternative missing;
- chosen alternative confused with opportunity cost;
- all non-chosen alternatives incorrectly added;
- scarcity denied because the chosen option has value.

## Visual standard

The game should feel like a polished product:

- compact source card;
- large touch targets;
- selected tray clearly visible;
- individually removable selected cards;
- consistent task-card hierarchy;
- clear task number badges;
- no cramped text;
- dark mode and mobile proof;
- interaction-state screenshots, not only initial screenshots.

## When not to use a flowchart

Do not use a flowchart when:

- the student only needs to select evidence;
- order is not the target;
- the flowchart would give away the answer;
- the flowchart creates more UI work than economics work.

For §1.1.1, the best first game is a choice/evidence game, not a long chain builder.
