# NEWS-DETECTIVE-V2-PROTOTYPE-REPLACEMENT-1 Review Packet

REV-STD-1 packet date: 2026-06-18

## Product End-State And Original Spec

Product end-state: generated Nieuws-detective pages are V2 product pages in
the same family as Paragraph, Chapter, and Book Landing V2. The article remains
fully readable while the student completes all four game rounds.

Original sprint/gate spec: attachment
`b6e3f4b6-56b4-48a9-9c1c-80aace262b82/pasted-text.txt`, using the root
prototype `4veco-news-detective-v2-prototype.html` as the approved baseline.

## Non-Negotiable Requirements

- Complete front-end replacement, not old-layout polish.
- Production shell loads only V2 UI/CSS plus the fixed engine asset.
- Active round screen uses the full article text from `NEWS_DETECTIVE_DATA`.
- No compact article card, no line clamp, no fake links.
- Preserve the four game rounds and scoring behavior.
- Generated lesson output must come from platform.
- Rendered proof must come from generated lesson output.

## Core-Requirement Checklist

- [x] Fixture: `references/ui/news-detective-v2/approved.html`.
- [x] V2 shell markers present in generated output.
- [x] Old high-level markers absent from active source/output.
- [x] Full article body rendered in `screen-game`.
- [x] Article source/date/source URL render.
- [x] Dynamic article facts supported when provided.
- [x] All four rounds render in V2 controls.
- [x] Result, replay, and return-to-paragraph navigation render.
- [x] Light and dark mode share one DOM.
- [x] Mobile stacks article above round.
- [x] No horizontal overflow in rendered proof.
- [x] Dedicated checker and focused tests added.

## Findings

Blocking finding, closed:
Real data omitted optional `domainColors`, which caused the V2 UI to abort via
`getDomainColors()`. The engine now returns `{}` for missing optional colors,
and the lesson shared engine was regenerated.

Blocking finding, closed:
Rendered desktop proof exposed horizontal overflow from `100vw` content sizing.
Production CSS now uses grid-column-relative width, and the checker forbids the
old `calc(100vw - var(--sidebar))` pattern.

No open blocking findings remain.

## Proof

Rendered proof directory:
`reports/sprints/NEWS-DETECTIVE-V2-PROTOTYPE-REPLACEMENT-1-screenshots/`

Evidence files:

- `start-desktop-light.png`
- `round-1-desktop-light.png`
- `round-4-desktop-light.png`
- `active-desktop-dark.png`
- `active-mobile-light.png`
- `result-desktop-light.png`
- `dom-proof.json`

`dom-proof.json` records `pass: true`, exact article-body length match in all
active rounds, no clamp styles, no legacy markers, no fake links, and no
horizontal overflow.

## Blocks / Does Not Block / Proof Required To Close

blocks: none.

does_not_block: this PR pair does not close Scale Gate 1, product-route
adoption, diagnostics, mastery/PV, or student/product-use authority.

proof_required_to_close:

- Merge platform PR first.
- Merge generated lesson PR second.
- Regenerate from merged platform main into lesson main.
- Confirm no generated-output drift.

## Reviewer Verdict

Recommended verdict: PASS.

PASS WITH FLAGS is not used because no missing core requirement is being
carried.
