# CHECK-SHORT-EXIT-2 Diff Summary

Generated: 2026-06-05

## Summary

Implemented the first-three-paragraph split check-surface route:

- `Korte check` and `Exit ticket` can coexist per paragraph.
- Landing pages render distinct Check cards when both surfaces exist.
- Exit-ticket pages can render task-shell context blocks.
- The shared graph-construction substitute renders as a graph workspace with
  attached axis controls, grid, table-derived ticks, point fallback fields, and
  same-workspace line rendering.
- Context blocks render one visible source/table/figure/formula identifier per
  block instead of repeating labels in both kicker and heading text.
- New `1.1.1` and `1.1.3` exit-ticket candidates keep completion language held
  and carry no product authority.
- `1.1.2` reviewed exit-ticket authority is preserved and a separate advisory
  short check was added.

## Implementation Files

- `build-scripts/platform/build-exit-ticket-shells.js`
- `build-scripts/platform/build-landing-page.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- `build-scripts/lib/convert_samenvatting.py`
- `build-scripts/lib/convert_nieuws.py`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/graphical-ui.js`
- `engines/skilltree-ui.js`
- focused tests under `engines/tests/` and `scripts/tests/`

## Source Data

- Migrated legacy single check files into `*-korte-check.json` /
  `*-exit-ticket.json` source-key convention.
- Added short/exit surfaces for `1.1.1`, `1.1.2`, and `1.1.3`.
- Added `1.1.3` source-context exit-ticket candidate with context blocks,
  graph-construction substitute, graph reading, and `interval_halving_check`.

## Evidence

- `reports/json/check-short-exit2-proof.json`
- `reports/sprints/CHECK-SHORT-EXIT-2-screenshot-manifest.md`
- `reports/sprints/CHECK-SHORT-EXIT-2-screenshots/manifest.json`
- `build-scripts/sprints/check-check-short-exit2.js`

## Rendered Evidence

The repaired capture harness records all 10 required screenshots with 0
blocked cases. The proof JSON records `screenshot_capture_blocked: false` and
`all_screenshots_exist: true`. Human review may use the rendered proof packet
after remote publication of the packet and every cited evidence artifact.
