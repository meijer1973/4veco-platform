# Speaker Notes Standard

Status: conceptual standard extracted from the `1.1.1` Golden Presentation exemplar.

## Core Rule

Speaker notes for web-first presentations are student-facing explanations. They are not a hidden teacher-only script by default.

## Required Structure

Each slide should support:

```json
{
  "notes": {
    "studentExplanation": [],
    "misconceptionWatch": [],
    "teacherCue": [],
    "transition": ""
  }
}
```

Render `studentExplanation`, `misconceptionWatch`, and `transition` by default for web-first student use. `teacherCue` may be hidden, visually separated, or exported into a teacher-supporting PPTX note mode.

## Student-Facing Requirements

Notes must:

- explain what the slide means;
- use canonical Dutch terminology;
- connect the visual to the concept;
- name common misconceptions where relevant;
- explain the transition to the next slide;
- be readable without teacher narration;
- avoid teacher-only stage directions unless clearly marked as teacher cues;
- stay concise enough to support learning without duplicating the textbook.

## PowerPoint Difference

In live-teaching PPTX exports, notes may become teacher-supporting. The semantic model should still preserve the student-facing explanation so web and PPTX exports do not silently lose learning content.

## Review Questions

- Can a student open the notes and understand the slide independently?
- Do notes repair the likely confusion without giving away a later answer?
- Does every note use the same concept language as the visible slide?
- Is any teacher-only instruction clearly separated?
