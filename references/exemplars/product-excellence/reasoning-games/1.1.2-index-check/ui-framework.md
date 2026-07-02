# Reasoning-game UI framework — transfer from §1.1.1 to §1.1.2

## 1. Product grammar and reasoning grammar are different

A golden exemplar contains two layers:

- **product grammar**: layout, interaction clarity, feedback, repair, visual hierarchy;
- **reasoning grammar**: the specific mental operations demanded by the paragraph.

Transfer the product grammar. Re-derive the reasoning grammar for every paragraph.

## 2. Start from the target misconception

For §1.1.2, the central misconception is:

```text
index-point difference = percentage change
```

The interface should expose and repair that misconception directly. It should not begin with a generic formula drill.

## 3. One task, one cognitive purpose

- Task 1: classify the unit of the difference.
- Task 2: choose the reference value through two equivalent calculations.
- Task 3: formulate the corrected claim.

Do not combine all three into one crowded screen or one textarea.

## 4. One click performs one complete action

Normal interactions should be:

- click to select;
- click again to deselect;
- click another option in the same row to replace.

Do not require “select card, then select slot” when there is only one obvious destination.

## 5. Randomize once, then preserve spatial stability

Distractor order may vary by session. Once rendered, cards must not jump after a student clicks. Spatial stability is part of usability.

## 6. Repair must be local

A student must be able to remove or replace one selection without clearing unrelated correct work.

## 7. Source and claim remain visible

On desktop, use source-left / task-right. The source pane should contain:

- concise context;
- the table;
- basis-year label;
- the claim being investigated.

Do not include a teaching procedure or the corrected answer in the source pane.

## 8. Controls must admit meaningful errors

Use distractors that represent actual misconceptions:

- divide by new rather than old;
- use basis-year 100 as denominator for a later interval;
- equate subtraction with percentage change;
- confuse euro change and index-point change.

Random nonsense distractors do not produce useful reasoning. Do not print a pre-attempt explanation under a distractor that identifies the misconception; that turns the option bank into an answer key.

## 9. Build the answer visibly

The final task should make answer functions visible:

```text
verdict → index-point statement → percentage calculation/explanation
```

The screen should help students produce an exam-usable answer without giving them the answer before they choose.

## 10. The UI challenge stays below the economics challenge

Students should struggle, if at all, with:

- what an index-point difference means;
- which old level is the reference;
- why two valid routes agree.

They should not struggle with:

- where a card goes;
- how to undo one action;
- why cards moved;
- hidden IDs;
- unnecessary locks;
- ambiguous controls.

## 11. Feedback follows the operation

After an attempt, feedback should identify the broken operation:

- unit confusion;
- wrong reference value;
- incomplete answer form.

It should not only say “wrong” or expose the entire procedure before the attempt.

## 12. Reuse at the right abstraction level

Good reusable patterns from this exemplar are:

- replaceable single-choice classification;
- order-free exact-set formula selection;
- one-click sentence-grid answer construction;
- stable once-per-session randomization;
- individual selection removal.

Do not encode bus subscriptions or the values 120 and 126 into the shared engine.
