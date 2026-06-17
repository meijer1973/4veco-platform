# Chapter Landing V2 Minimal Navigation Fixture

`approved-minimal.html` is the approved visual baseline for
CHAPTER-LANDING-V2-MINIMAL-NAVIGATION-1. It came from the handoff prototype in
the workspace root.

Generated chapter pages must use this visual system for navigation and
orientation only. They must not copy paragraph route rows, companion resource
tiles, games, checks, textbook links, or exit-ticket work into the chapter
page.

The implementation intentionally corrects one prototype detail: generated
paragraph cards use neutral `Paragraaf N` and `Lesroute` labels instead of
fallback aspect/domain labels such as `Rekenen`. Domain tokens may remain as
styling metadata only.

Required generated-page proof:

- app shell, sidebar, topbar, hero, target panel, chapter overview, paragraph
  cards, route tags, and footer render from one light/dark DOM.
- one card is rendered for each visible paragraph in the chapter.
- paragraph cards link only to paragraph `index.html` pages.
- route tags are informational spans, not direct resource links.
- old shell markers and `voorkennis.css` are absent.
