# BOOK-LANDING-V2-MINIMAL-NAVIGATION-1 Baseline

Baseline date: 2026-06-17

## Starting Surface

The generated Book 1 root `index.html` used the old book shell:

- `body[data-layout="landing-book-v1"]`
- `page-layout`
- `sidebar-toggle`
- `sidebar-overlay`
- `viewer-panel`
- `shared/voorkennis.css`
- `shared/voorkennis.js`

The old renderer also produced visible chapter domain/aspect labels through
`chapter-card-domain` and `domainLabel(token)`, which rendered the fallback
`Rekenen` label for the visible Book 1 chapter card.

## Product Risk

The book page was still visually and structurally out of family with Paragraph
Landing V2 and Chapter Landing V2. It also retained an affordance for visible
fallback aspect labels and old direct-resource viewer behavior.

## Intended Replacement

Book Landing V2 Minimal Navigation should keep the hierarchy strict:

```text
Book page -> chapter pages
Chapter page -> paragraph pages
Paragraph page -> route/checks/games/resources
```

The book page should be a chapter chooser only.
