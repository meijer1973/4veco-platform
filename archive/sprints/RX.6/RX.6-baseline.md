# Sprint RX.6: Baseline

## Plan reference

Plan: `docs/sprints/RX.6-plan.md`

## Current state

The live A-domain catalog has 81 active units. The source `engines/skilltree/base-elements.js` currently exports 44 generator-backed units as interactive and 37 missing-generator units as blocked metadata.

Baseline test status:

- `npx.cmd jest engines/tests/skilltree-data.test.js --runInBand` passes against source `base-elements.js`.
- The earlier structural failure is therefore not in the source adapter anymore.

Remaining release-readiness gap:

- `scripts/deploy.js` still needs to prove the browser-bundled `shared/skilltree/base-elements.js` uses the same interactive/block split as source `base-elements.js`.
- Existing generator-block records cover RX.2, RX.2b, RX.3a, RX.3b, and RX.4 units.
- Older R4.5 A-domain units `A45` through `A60` predate the current generator-block convention and need explicit non-interactive status if their generators remain missing.

## Data integrity notes

RX.6 must not mutate protected reference data. No hand edits to `references/machine/` or `references/external/` are allowed.

The sprint may update runtime/build code, tests, generated readiness reports, `references/data/sprints/` block metadata, and roadmap/versioning files. Any blocked A-domain unit remains catalog-valid but not student-facing until a later generator sprint implements and validates its generator.

## Stop conditions

- A missing-generator unit appears as an interactive `SKILLS` node in source or deployed bundle logic.
- A missing-generator unit lacks explicit non-interactive generator-block status.
- The implementation creates fake generators instead of real exercise logic.
- The implementation edits `references/machine/`, `references/external/`, authored source files, RAG chunks, or lesson output.
- Student-facing skill-tree/PV/diagnostic/adaptive/mastery/summative use is implied or authorized.
