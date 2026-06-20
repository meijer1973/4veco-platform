# Web-First Presentation Policy

Status: production-quality policy extracted from `references/exemplars/1.1.1-golden-presentation/`.

## Core Rule

4veco presentations should be semantic web-first learning surfaces. PowerPoint is a later derivative export after the web presentation has passed review.

## What A Production Presentation Must Do

A production economics presentation must:

- start with a route contract;
- move from concrete case to concept;
- use canonical Dutch terminology;
- connect visible data or visuals to the concept;
- control likely misconceptions;
- make any procedure visible on the slide surface;
- split worked examples into calculation/setup and interpretation/conclusion;
- include a short active check where it strengthens the route;
- end with a summary and bridge;
- provide student-facing speaker notes;
- preserve a clear return route and navigation affordance.

## Semantic Model Policy

The presentation model should include:

- `id`;
- `surface`;
- `paragraph`;
- `title`;
- `quality_claim`;
- `does_not_authorize`;
- per-slide `id`, `navTitle`, `slideRole`, `studentTitle`, `assertion`, and `visibleElements`;
- structured notes with `studentExplanation`, `misconceptionWatch`, `teacherCue`, and `transition`.

The renderer should consume slide meaning from these fields. It should not infer pedagogy from a PPTX file.

## Required Review

Before a generated presentation is production-ready, require:

- teacher learning quality review;
- student experience review;
- visual QA with screenshot evidence;
- accessibility review;
- lead verdict.

Technical tests are necessary but insufficient.

## Non-Authority

This policy does not authorize product use, Scale Gate 1, diagnostics, mastery, automatic sequencing, summative use, broad migration, target-equivalent completion language, or generated-output hand edits.

## Reference

Golden conceptual exemplar:

```text
references/exemplars/1.1.1-golden-presentation/
```
