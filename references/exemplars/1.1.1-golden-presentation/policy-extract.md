# Policy Extract

Status: reusable policy extracted from the `1.1.1` Golden Presentation exemplar.

## Core Policy

Economics presentations should be web-first learning surfaces. A presentation is not just a slide stack; it is a route from a concrete case to a concept, a misconception check, a reusable procedure, a worked example, a short active check, and a summary bridge.

## Web-First Source Of Truth

- Build a semantic presentation model first.
- Render and review the web presentation first.
- Treat PowerPoint as a derivative export after the web version passes review.
- Do not hand-edit generated lesson output to make a presentation appear finished.

## Semantic Model Requirements

Each production presentation model should include:

- `slideRole`;
- `studentTitle`;
- `assertion`;
- visible route or student action fields;
- structured notes with `studentExplanation`, `misconceptionWatch`, `teacherCue`, and `transition`;
- visual metadata or alt descriptions for instructional visuals;
- explicit `does_not_authorize` authority boundaries.

## Required Presentation Route

Default economics route:

1. Route contract.
2. Concrete narrative or source anchor.
3. Core concept.
4. Transfer to another context.
5. Misconception control.
6. Canonical procedure or model.
7. Worked example, calculation/setup.
8. Worked example, interpretation/conclusion.
9. Active formative check.
10. Summary and bridge.

Agents may deviate only when they name the didactic reason.

## Review Gate

Production readiness requires:

- teacher learning quality review;
- student experience review;
- visual QA with screenshots;
- accessibility review;
- lead synthesis.

Technical tests alone cannot approve a presentation as production-ready.

## Non-Authority

This policy does not authorize product use, Scale Gate 1, diagnostics, mastery, automatic sequencing, summative use, target-equivalent completion language, broad migration, or edits in generated lesson output.
