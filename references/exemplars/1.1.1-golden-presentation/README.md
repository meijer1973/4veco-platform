# 1.1.1 Golden Presentation Exemplar

Type: conceptual presentation exemplar.
Surface: web-first economics presentation with student-facing speaker notes.
Paragraph: 1.1.1 Schaarste en economisch denken.
Status: accepted by human feedback as a golden example candidate; not yet an implemented production generator reference.

## Use For

- presentation layout standard;
- didactic route standard;
- student-facing notes standard;
- web-first presentation policy;
- later PPTX derivation policy.

## Do Not Use For

- product-use approval;
- Scale Gate 1;
- automatic migration of all presentations;
- replacing paragraph markdown as source of truth;
- hand-editing generated lesson output;
- diagnostics, mastery, automatic sequencing, summative use, broad migration, or target-equivalent completion claims.

## Package Contents

- `golden-presentation.html` - standalone web-first reference surface for the conceptual exemplar.
- `golden-presentation-content-model.json` - semantic presentation model, not an HTML dump.
- `slide-route.md` - required route pattern and slide-role sequence.
- `speaker-notes-standard.md` - student-facing notes requirements.
- `didactic-framework.md` - learning-route and misconception-control guidance.
- `layout-framework.md` - web-first layout and renderer implications.
- `teacher-student-review.md` - review packet requirements for teacher, student, visual, and accessibility review.
- `policy-extract.md` - reusable policy extracted from this exemplar.
- `implementation-handoff.md` - platform-side implementation path for a later implemented reference.
- `screenshot-proof.md` - current proof ledger and required preview states.
- `previews/` - selected slide preview captures for visual orientation.

## Authority Boundary

This folder preserves a conceptual golden standard. It does not prove that the current generator can reproduce the surface, and it does not authorize direct edits in `4veco-lessen`.

Production integration must happen through `4veco-platform`, followed by regeneration of `4veco-lessen` output and fresh review evidence.
