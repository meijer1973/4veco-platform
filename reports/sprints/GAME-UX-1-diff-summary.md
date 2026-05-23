# Sprint GAME-UX-1: Diff Summary

Date: 2026-05-23

## Summary

GAME-UX-1 added one shared skill-map route/view-model engine and wired existing
practice engines to request scoped route views without changing generated
lesson output.

## Main implementation changes

- `engines/skill-map-engine.js` implements:
  - aspect filters `reasoning`, `calculation`, `graphical`, and explicit
    `mixed`;
  - display modes `compact`, `route`, and restricted `full`;
  - non-mastery student labels (`aanbevolen`, `beschikbaar`, `ga verder`,
    `geoefend`, `later nodig`);
  - local-practice-only progress;
  - product boundary flags forced false.
- `engines/skilltree/base-elements.js` and `scripts/deploy.js` now pass MTU
  `aspects` through to runtime and bundled browser skill data.
- `build-scripts/platform/build-skilltree-shells.js` now emits
  `skillMapDefaults` and loads `skill-map-engine.js` before the skill-tree
  engine.
- `engines/skilltree-engine.js` exposes `getSkillMapView()` and uses compact
  defaults instead of a full all-skill default when generated data provides
  `skillMapDefaults`.
- `engines/reasoning-engine.js`, `engines/procedure-engine.js`, and
  `engines/graphical-engine.js` expose `getSkillMapRequest()` with scoped
  aspect defaults.
- Visible skill-tree UI copy no longer uses `beheerst`, `Voltooid`, or
  `Doel behaald` wording.

## Test changes

- Added `engines/tests/skill-map-engine.test.js`.
- Extended skill-tree data tests to prove MTU aspect exposure and deploy-bundle
  aspect parity.
- Extended skill-tree engine tests for shared view-model access and full-view
  restrictions.

## Protected surfaces

No protected reference data changed. `references/machine/` and
`references/external/` were not edited. No lesson output was generated or
mutated. No target exercises, owned blueprint sources, or external-source
mirrors were changed.

## Generated map/report refresh

Normal report, dashboard, source-document registry, source manifest, document
inventory, GitHub-agent index, roadmap-version index, and reference-health
outputs were refreshed so remote/off-site review sees the current platform
state.
