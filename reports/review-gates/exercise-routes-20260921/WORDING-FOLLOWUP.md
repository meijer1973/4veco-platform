# Final wording corrections and navigation follow-up

The owner's review identified two remaining wording inconsistencies. The didactics skill's decision rule now treats guided practice as the normal learning route and refers to the canonical exercise contract. Book 2 §2.2.4 now calls the additional activity “Hoofdstukcheck 7”, matching the teacher guidance and the existing exercise.

Book 2 was rebuilt through the reviewed platform controller. The complete student PDF changes only page 66; its H2 chapter copies change page 30 and the standalone mixed-practice export changes page 1. All other pages of the 32 PDFs whose bytes changed during rebuilding retain identical text and rendered pixels (373 pages compared with lesson commit `b946cf04b128a374301e1998653f45583ec97057`). All links in those PDFs remain identical. The unchanged complete answer and teacher volumes retain their exact bytes. Pages 65–67 were rendered with Poppler and inspected.

The contract's 69 tests pass. The full source/assembly verifier again passes 43 paragraphs, 390 exercise blocks, 31 target payloads and 632 chapter body pages, including 598 Books 3/4 edition checks. The revised lesson commit is `fdad5d8f62b7e12618e6a3b8d344c407c259ed35`; its closed manifest SHA256 is `a07127c5fe1e2595067c840608b722235188279441116c638f7e7dc7967f3b07`. Current paragraph snapshots and independent bindings supersede the preceding revision's bindings; the earlier committed reports and evidence remain history. Current CI is recorded on the PRs.

## Separate navigation defect

The owner's review also found lost chapter-contents links in the complete student PDFs: Book 3 pages 5 and 87, and Book 4 pages 53 and 113. The source chapter PDFs have 28, 19, 28 and 24 clickable annotations respectively; the corresponding complete pages have none. This defect predates the route revision and needs a separate assembly repair. These four chapter pages must not be confused with the complete books' main contents pages, whose links pass the existing checks.

The earlier phrase “contents navigation passed” described the main contents destinations and validity of surviving links; it did not establish preservation of every chapter-contents annotation. The independent follow-up records the narrower verified scope and the outstanding defect. No navigation repair is included in these two wording corrections. A separate repair should preserve all 99 annotations and their clickable rectangles, map their destinations to the complete books, and add checks for missing as well as invalid links.

The 34 theory paragraphs' timing flags and nine mixed-practice exceptions remain unchanged. These corrections do not confer new target approval or establish a full 55-minute route budget.
