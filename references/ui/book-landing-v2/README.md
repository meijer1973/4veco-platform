# Book Landing V2 Minimal Navigation Fixture

`approved-minimal.html` is the approved visual baseline for
BOOK-LANDING-V2-MINIMAL-NAVIGATION-1.

Book Landing V2 Minimal Navigation is a book-level orientation surface. It
points to chapter landing pages only. It must not copy chapter route rows,
paragraph route rows, resource tiles, checks, games, or direct companion links
into the book page.

Generated book pages must use this visual system for navigation and orientation
only:

- the book page links to chapter `index.html` pages;
- chapter cards do not link directly to paragraph pages or companion artifacts;
- paragraph names inside chapter cards are informational spans, not links;
- chapter cards use neutral `Hoofdstuk N` / `Hoofdstukroute` labels;
- chapter/domain tokens may be used for styling only, not visible aspect
  claims.

Required generated-page proof:

- app shell, sidebar, topbar, hero, target panel, book overview, chapter list,
  chapter cards, and footer render from one light/dark DOM;
- one card is rendered for each visible chapter in the book;
- each chapter card links only to the chapter `index.html`;
- old shell markers and `voorkennis.css` are absent.
