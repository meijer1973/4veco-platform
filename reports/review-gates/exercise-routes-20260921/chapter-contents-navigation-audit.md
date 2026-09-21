# Independent audit — missing chapter contents hyperlinks

Reviewer: `review_book2`; 2026-09-21. Read-only audit requested after the bounded route review. This records an existing defect for a separate repair; no repository or PDF was edited.

## Exact affected pages

The complete student books lose all clickable link annotations on these four chapter openings. Both the normal local-page chapter PDF and its final `_bookpages.pdf` source contain working named destinations. The complete-book assembly contains none on the affected page.

| Book | Chapter | Complete PDF page | Source annotations → complete | Local destination pages | Expected complete destination pages |
|---|---|---:|---:|---|---|
| 3 | 3.1 | 5 | 28 → 0 | 2, 10, 19, 28, 35, 44, 48 | 6, 14, 23, 32, 39, 48, 52 |
| 3 | 3.3 | 87 | 19 → 0 | 2, 11, 21, 31, 38 | 88, 97, 107, 117, 124 |
| 4 | 4.2 | 53 | 28 → 0 | 3, 11, 19, 25, 36, 47, 53 | 55, 63, 71, 77, 88, 99, 105 |
| 4 | 4.3 | 113 | 24 → 0 | 2, 12, 20, 29, 37, 43 | 114, 124, 132, 141, 149, 155 |

There are 99 source annotations representing 25 distinct entries; individual entries have several overlapping/text-fragment rectangles. Entries include each listed paragraph and the chapter overview where it is linked. §4.2 has seven paragraph links and no linked overview row. These counts are annotation counts, not 99 separate topics.

The two other chapter openings—Book 3 §3.2 on complete page 53 and Book 4 §4.1 on complete page 5—already have no clickable annotations in their chapter sources. They are not source-to-assembly loss cases.

## Baseline and mechanism

Directly read the original source and complete PDF bytes from lesson commit `e2843b47c828784ab594d004cef461cea929717f` using `git show`. The baseline source/complete annotation counts are exactly the same: 28/0,19/0,28/0,24/0. Therefore the defect predates the route revision and is not introduced by either final wording correction. Current Books3/4 PDFs remain unchanged by those wording corrections.

The current and received assembly path inserts the chapter PDF into a new PyMuPDF document. Source annotations use named `/Dest` values such as `s311`. In an independent in-memory probe using the actual pinned PyMuPDF 1.26.7, inserting the full §3.1 book-page source and reopening its bytes changed 28 source-page links to 0, without any other processing. This reproduces the loss at insertion. It is separate from the complete main contents page, whose explicit links are built after insertion.

A separate repair should resolve each source named destination to its local explicit destination before insertion (or otherwise preserve namespace and offset correctly), then verify source-to-complete link counts, rectangles, target pages and positions on these four pages. The repeated `overzicht` name across chapters makes destination namespace handling material. Recheck the main contents links and every unaffected annotation after the repair; do not treat in-range remaining links as proof that no links disappeared.

## Qualification of the previous review

The earlier review's claim about navigation covered the complete main contents labels/destinations, Book2's full 105-annotation preservation check, and validity of remaining internal Book 3/4 links. Its pixel/body-text checks and `0 <= page < page_count` loop did not check preservation of chapter-opening hyperlinks. Visual page inspection cannot establish that rectangles are clickable. Thus it must not be read as complete Book 3/4 hyperlink preservation; that broader interpretation is withdrawn here.

The main complete contents pages continue to have verified working chapter/paragraph destinations. They provide navigation but do not repair these four chapter pages. The defect is acknowledged as open and explicitly deferred by the owner's request to a separate repair. The current route-only acceptance must retain this navigation flag; it cannot claim the defect is fixed or use the previous review as full hyperlink coverage.

## Evidence

- `chapter-contents-navigation-audit.json`: SHA256 `40f834f734338a7d2bce735dc59fb1c7f78d54ecc7ade9cabb55125d46dc9e73`; current source/final PDF hashes, exact link rectangles/destinations, all six openings and baseline counts.
- `chapter-link-insertion-probe.json`: SHA256 `e3ba8c9f9407acb613646222c7fc780b1e4b95e9d77bf082b9f32a59f5b034cd`; pinned-runtime reproduction and source annotation dictionary.

This audit is not a navigation-repair PASS. It does not authorize merging or publishing; it documents the separate defect and corrects the scope of prior evidence.
