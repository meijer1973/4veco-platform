# PowerPoint Derivative Policy

Status: guidance for PPTX exports after web-first review.

Derived from `references/exemplars/1.1.1-golden-presentation/`.

## Production Direction

For 4veco presentations, the preferred production route is:

1. Build a semantic web-first presentation model.
2. Render and review the web presentation.
3. Use the web version as the source of design truth.
4. Generate PPTX only after the web version passes student, teacher, visual, and accessibility review.

Do not treat PPTX as the design source when a web presentation route exists.

## Derivative Requirements

When generating PPTX from the semantic model:

- preserve the route-contract slide;
- preserve all core assertions;
- preserve slide roles;
- preserve student-facing notes where possible;
- convert notes to teacher-supporting format if the export is intended for live teaching;
- keep body text at least 18 pt and labels at least 14 pt;
- run LibreOffice roundtrip;
- repair notes font size after roundtrip where the PPTX pipeline supports it;
- run visual QA on exported slide PNGs;
- document any content lost from web to PPTX.

## Structured Notes

When one semantic model feeds both outputs, keep notes structured:

```text
studentExplanation
misconceptionWatch
teacherCue
transition
```

Web-first output renders student-facing explanation. PPTX live-teaching output may emphasize teacher cues and transitions.

## Active Check Exception

The older "no exercise instructions" rule remains for exercise sets. A presentation may include a short active-check slide if it checks immediate understanding and does not replace the paragraph's exercise/check surfaces.

## Non-Authority

A PPTX derivative does not authorize product use, Scale Gate 1, diagnostics, mastery, automatic sequencing, summative use, target-equivalent completion language, broad migration, or generated-output hand edits.
