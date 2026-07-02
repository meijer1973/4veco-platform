# Speaker Notes Policy

Status: student-facing notes policy for web-first presentations.

Derived from `references/exemplars/1.1.1-golden-presentation/`.

## Core Rule

Speaker notes for web-first presentations are student-facing explanations. They must be useful when a student opens the notes without live teacher narration.

## Structured Notes

Use this model:

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

Render student-facing explanation, misconception watch, and transition by default. Teacher cues may be separated, hidden, or exported to a teacher-supporting PPTX note mode.

## Requirements

Notes must:

- explain what the slide means;
- use canonical Dutch terminology;
- connect visual evidence to the concept;
- name common misconceptions when relevant;
- explain how the current slide leads to the next slide;
- be readable without teacher narration;
- avoid teacher-only stage directions unless clearly marked;
- stay concise enough not to become a second textbook.

## Review Checks

- Every slide has notes.
- Notes are aligned with the visible assertion.
- Misconceptions in notes match likely student errors.
- Notes do not smuggle in unsupported diagnostics, mastery, sequencing, summative, or target-equivalent claims.
