# Layout Framework

Status: conceptual web-first layout standard.

## Web-First Requirements

The web presentation is the design source. PowerPoint is a derivative export only after the web surface passes review.

The page must include:

- sidebar or slide-list navigation;
- slide count or progress indicator;
- keyboard navigation;
- notes toggle;
- dark mode;
- fullscreen or presentation mode when available;
- clear return route;
- semantic headings and accessible controls.

## Slide Surface

Each slide should show one learning move at a time. Visual hierarchy should make the assertion, relevant data, and student action easy to scan within a few seconds.

The slide canvas should support:

- route-contract cards;
- relation diagrams;
- transfer cards;
- misconception comparison cards;
- procedure steps;
- worked-example tables;
- active-check cards;
- summary and bridge panels;
- stable notes panel;
- mobile layout without clipped text or controls;
- dark-mode contrast.

## Notes Panel

The notes panel is part of the student learning surface. It must be readable, stable, keyboard reachable, and not visually treated as a hidden afterthought.

## Renderer Implications

A production renderer must not infer slide meaning from a PPTX file. It should consume the semantic model, including `slideRole`, assertion, visible elements, structured notes, and visual metadata.

## PowerPoint Boundary

A PPTX may be generated later from the same semantic model. The PPTX export should preserve route, assertions, slide roles, and notes intent, but it should not become the design source.
