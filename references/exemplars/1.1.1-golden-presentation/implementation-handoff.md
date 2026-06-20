# Implementation Handoff

Status: handoff for a later implemented presentation reference.

## Goal

Turn `1.1.1 Schaarste en economisch denken` into the first implemented Golden Presentation reference after the accepted conceptual snapshot and policy are merged.

## Source Boundary

Authoring changes belong in `4veco-platform`. Final student-facing output belongs in `4veco-lessen` and must be regenerated from platform source.

Do not hand-edit:

- generated lesson HTML;
- generated PPTX;
- copied shared engine files in `4veco-lessen`;
- paragraph quality logs to simulate proof.

## Likely Platform Files

Inspect and update as needed:

- `build-scripts/content/book-1/b1-111-presentation-v2-model.js`
- `build-scripts/content/book-1/b1-111-presentation-v2-prototype.js`
- `build-scripts/lib/render-presentation-v2-html.js`
- `build-scripts/lib/render-presentation-v2-pptx.js`
- `engines/presentation-v2.css`
- `engines/presentation-v2.js`
- `engines/tests/presentation-v2-prototype.test.js`
- `scripts/qa-presentation-v2-html.js`

Filename churn is optional. Production labels and generated artifact text must not use unfinished-status wording.

## Required Implementation Changes

1. Replace the current semantic path with an eleven-slide semantic model matching `golden-presentation-content-model.json`.
2. Preserve the §1.1.1 exemplar route roles:
   - `route_contract`
   - `narrative_anchor`
   - `concept_model_development`
   - `transfer_slide`
   - `misconception_slide`
   - `procedure_route`
   - `worked_example_calculation`
   - `worked_example_interpretation`
   - `retrieval_check`
   - `summary_bridge`
3. Add student-facing explanation text for every slide, plus misconception, teacher-cue, transition, data, and visual metadata where instructionally relevant.
4. Extend the HTML renderer to support route cards, relation diagrams, transfer cards, misconception cards, procedure steps, worked-example tables, retrieval/check cards, and summary bridge layout.
5. Keep PowerPoint export optional until the web version passes review.
6. Upgrade static QA so it checks route contract, notes presence, accepted §1.1.1 route roles, no unfinished-status wording, and source provenance.
7. Add rendered QA for mobile overflow, dark mode, notes panel, focus order, and keyboard navigation.

## Required Lesson Output

After source implementation, regenerate:

```text
../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/
  1.1 Hoofdstuk Economisch denken en rekenen/
    1.1.1 Schaarste en economisch denken/
      1.1.1 Schaarste en economisch denken - presentatie.html
```

Keep PPTX optional until a derivative export consumes the same semantic model and passes separate visual and compatibility checks.

## Proof Required Before Implemented Promotion

- Generated web artifact exists in `4veco-lessen`.
- Page opens locally.
- Notes toggle works.
- Required screenshot states are captured.
- Teacher, student, visual, accessibility, testing, and lead review reports exist.
- Platform source and generated lesson output are paired.
- No generated-output hand patching.
