# Web-First Presentation Policy

Status: production-quality policy extracted from `references/exemplars/1.1.1-golden-presentation/`.

## Core Rule

4veco presentations should be semantic web-first learning surfaces. PowerPoint is
a later derivative export after the web presentation has passed review.

## What A Production Presentation Must Do

A production economics presentation must:

- start with a route contract;
- develop the central concept or model with canonical Dutch terminology;
- connect visible data, source material, examples, or visuals to the concept;
- include at least one worked example, source application, or student-visible use;
- include a short retrieval/check moment where it strengthens the route;
- end with a summary and bridge;
- provide student-facing speaker notes or explanation text;
- preserve a clear return route and navigation affordance.

Use conditional route tools only when the topic needs them:

- narrative anchor;
- transfer slide;
- misconception slide;
- procedure route;
- separated calculation/setup and interpretation/conclusion.

The exact eleven-slide route in `references/exemplars/1.1.1-golden-presentation/`
is mandatory for that accepted §1.1.1 exemplar only. It is not a global quota for
every presentation.

## Semantic Model Policy

The presentation model should include:

- stable presentation identity, paragraph, title, surface, and quality claim;
- source/provenance metadata when the model is derived from an accepted artifact;
- per-slide `id`, title, semantic `role`, visible assertion or learning move, and visible elements or content blocks;
- student-facing explanation text for every slide;
- misconception, teacher cue, transition, data, and visual metadata where instructionally relevant.

The renderer should consume slide meaning from these fields. It should not infer
pedagogy from a PPTX file.

## Required Review

Before a generated presentation is production-ready, require:

- teacher learning quality review;
- student experience review;
- visual QA with screenshot evidence;
- accessibility review;
- testing/static verification;
- lead verdict.

Technical tests are necessary but insufficient. Static web checks are structural
floors; browser behavior, focus order, dark mode, and mobile layout require
rendered QA.

## Non-Authority

This policy does not authorize product use, Scale Gate 1, diagnostics, mastery,
automatic sequencing, summative use, broad migration, target-equivalent
completion language, or generated-output hand edits.

## Reference

Golden conceptual exemplar:

```text
references/exemplars/1.1.1-golden-presentation/
```
