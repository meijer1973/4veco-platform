# Sprint EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1: Diff Summary

Generated: 2026-07-01

## Summary

This diff adds a durable exercise authority-hygiene manifest and checker. It
classifies the duplicate `1.1.3-exit-ticket` exemplar paths, records Golden
fixture active-versus-snapshot disposition, and records the current tracked
reference-only disposition for `knowledge/exit-ticket-game-1.1.1.zip`.

## Changed areas

- `references/data/exercise-authority-hygiene-manifest.json` records authority
  boundaries, exemplar canonical/alias paths, Golden fixture dispositions, and
  ZIP hash/size/tracking status.
- `build-scripts/sprints/check-exercise-authority-hygiene.js` verifies the
  manifest, active UI routing, byte-identical fixture snapshots, historical
  exemplar differences, ZIP disposition, npm/CI wiring, and forbidden local
  diffs.
- `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/README.md`
  now marks that folder as a historical alias and points future agent routing
  to the canonical exemplar path.
- `package.json` exposes `check:exercise-authority-hygiene`.
- `.github/workflows/platform-ci.yml` runs the authority-hygiene checker after
  npm install and after the sibling lesson checkout exists.
- `references/reference-team-roadmap.md` registers the sprint in the active
  roadmap ledger.
- Sprint plan, baseline, review, command-log, quality, evidence, and proof
  artifacts record the implementation and validation trail.

## Protected surfaces

No protected surfaces changed:

- `source-data/book-1/exit-ticket/`
- `engines/`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `knowledge/exit-ticket-game-1.1.1.zip`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`

The authority-hygiene checker, scope-language check, platform diff hygiene, and
lesson diff hygiene verify those boundaries.

## Not included

- No source-data or generated lesson output PR is included.
- No route migration is included.
- No ZIP binary edit, move, deletion, or replacement is included.
- No target-readiness, completion-language, diagnostics, mastery/sequencing,
  PV, Scale Gate 1, summative use, broad product use, product-route adoption,
  or student/product-use authority is introduced.

