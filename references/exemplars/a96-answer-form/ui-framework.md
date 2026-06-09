# General layout and UI framework for golden exemplars

This framework is deliberately explicit. Teams should not infer these rules loosely from a single example.

## 1. Start from the operation chain

Before designing the screen, write the target operation chain:

```text
source action -> method/action -> substitution/calculation setup -> final answer -> notation -> conclusion/next action
```

Every operation that must be visible in a good student answer should usually become a visible UI section. Do not hide required operations inside one generic text area.

For polished calculation tasks, avoid needless duplicate fields. If a formula-template substitution already shows the calculation setup, do not also require separate fields for the same difference, division, and percent step unless the target specifically requires those separate lines.

## 2. Choose the surface type

State whether the surface is:

- practice;
- advisory short check;
- target-equivalent exit ticket;
- MTU answer-form proof;
- review-only lab.

The surface type determines how much help is allowed. A proof/check surface may orient the student, but it must not teach the answer before the attempt.

## 3. Use source-left / task-right for source-dependent tasks

For desktop:

- left pane: only source material, concise and stable;
- right pane: active task steps;
- route/next-practice cards visible but secondary.

For mobile:

- hero;
- route if short;
- source;
- task steps;
- feedback.

The source should be close enough that the student does not have to hunt for values, but it should not contain formulas or answer patterns when those are assessed.

## 4. One cognitive operation per visible section

A good step card has:

- task number;
- short title;
- one-sentence purpose;
- one or more controls that match the student action;
- no unrelated controls.

For this polished A96 exemplar, the visible sections are:

1. write/build the formula to use;
2. fill that formula with the source numbers;
3. calculate final answer and unit/notation;
4. write the contextual direction sentence.

## 5. Input controls must match the answer form

Use:

- token/formula builders for formula or method structure;
- formula templates with blanks for labelled substitution;
- final-answer field plus notation field;
- conclusion field or conclusion choice when context/direction matters.

Do not use a generic textarea as the only way to capture a structured answer unless the target is genuinely extended writing.

## 6. No answer-giving placeholders

Bad:

```text
bijv. 15%
```

when 15% is the answer.

Good:

```text
vul percentage in, bijvoorbeeld met %
```

Placeholders may show the expected type of input. They may not show the correct value, formula, conclusion, or answer pattern.

## 7. No fake actions

A control is fake if the wrong action is impossible.

Examples:

- a line-shape check with only the correct line-shape button;
- an interval selector with only correct intervals;
- a formula builder with no plausible distractors;
- a formula token bank ordered so left-to-right clicking automatically gives the correct formula;
- a conclusion dropdown with only acceptable conclusions.

If a thing is assessed, wrong alternatives must be possible. If wrong alternatives are not useful, do not pretend to assess that thing separately.

## 8. Feedback comes after the attempt

Feedback should:

- name which operation is missing or weak;
- route to the relevant practice surface;
- avoid grade, mastery, diagnostic, summative, adaptive, or product-readiness language;
- be visible in one stable feedback region.

Feedback should not appear as a teaching card before the attempt on proof/check surfaces.

## 9. Tolerance should protect the skill being assessed

Do not reject normal student notation when the mathematical answer is correct.

Examples:

- accept `15`, `15%`, `15 procent`, `15,0%` where appropriate;
- accept comma and point decimals;
- accept Unicode minus signs;
- accept direction phrases where they express the same economic conclusion.

Strictness belongs on the operation chain, not on irrelevant formatting.

## 10. Visual design rules

Use:

- clear card hierarchy;
- task numbers/badges;
- generous spacing;
- compact controls;
- visible source/task relationship;
- responsive layout;
- dark-mode proof;
- readable labels, not internal codes.

Avoid:

- walls of text;
- dense generic forms;
- hidden required steps;
- unlabelled controls;
- proof tooling mixed with student surface.

## 11. Review proof must include interaction states

Initial screenshots are not enough. A golden exemplar review needs:

- initial state;
- partial input state;
- wrong-answer feedback state;
- correct-answer feedback state;
- mobile state;
- dark-mode state;
- negative fixture results.

Lead review must compare generated output directly to the exemplar and list any weakened affordance.

## 12. The golden-exemplar rule

A golden exemplar is not a data template. It is a rendered product standard. If generated output preserves the JSON but loses the visible answer form, the implementation has failed.


## v3 polish — no invisible duplicate tokens

The v2 prototype contained two visually identical answer tokens labelled `oude prijs`, backed by different hidden IDs for numerator and denominator. That creates an invisible 50/50 failure: a student can build a formula that looks exactly correct but is rejected because the hidden token IDs are swapped.

This is now forbidden. When the same concept appears twice in a formula, use **one reusable token** with a usage count, for example `oude prijs ×2`, and validate the sequence with the same token ID appearing twice.

Policy: never create two visually indistinguishable correct controls with different hidden meanings. If the distinction matters, make it visible to the student; if it does not matter visually, the internal IDs must not make it matter.
