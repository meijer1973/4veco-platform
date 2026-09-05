# Bounded Book 2 paragraph archive recognition

Date: 2026-09-05. Accountable implementer: codex-root.
Status: PLANNED; independent implementation review required before integration use.

The independently accepted §212 plan explicitly requires MD/HTML/PDF/ZIP
derivatives. Its builder generated three reproducible archives, but the lane
checker currently recognizes only the first three formats. The actual lesson
scope check failed on exactly those three ZIP filenames. This is an output
classification gap, not permission for a broad archive exception.

## Quality floor and bounded implementation

Extend only `check-paragraph-lane-scope.js` and its tests to recognize the
canonical Book 2 paragraph download filenames, using the twelve exact
paragraph paths already enumerated by the sprint output contract. Require
the existing book root, exact chapter and paragraph names, matching complete
file stem and only paragraaf/opgaven/antwoorden for theory, opgaven/antwoorden
for consolidation. Hyphen/en-dash and normal path case/slash normalization
follow existing filename behavior. No other ZIP becomes a textbook artifact.

No generic `.zip` suffix, root/book/chapter archive, plan archive, proof archive,
arbitrary paragraph title, wrong ID, nested archive, renamed companion bundle,
shared/platform ZIP or companion-lane permission is added. Quality-ref block
ownership and normal lane separation remain unchanged. No scope exception,
policy bypass or owner authority transition is introduced.

This is path classification only, not archive-content acceptance. Actual
production review must also verify each archive's exact member inventory is
its same-edition MD/HTML/PDF plus only the referenced SVG/PNG asset pairs,
without scripts, symlinks, traversal, unrelated lesson files or separate-answer
leakage into student editions. Every member must equal its current source bytes;
rebuild hashes must be stable. A correctly named but wrong-content archive
does not pass that output-quality gate. Existing §211 acceptance does not imply
unproduced archives exist; the final output inventory will distinguish them.

## Acceptance and independent gate

- Focused regression tests accept all 33 canonical paragraph archive paths.
- Reject mismatched IDs/titles/chapters, noncanonical suffixes/editions,
  Book 1/root/chapter/proof archives, companion names and nested paths.
- Accepted ZIPs pass only the textbook lane, not companion/shared lanes;
  explicit exceptions still cannot turn unknown paths into recognized files.
- Existing lane/proof/quality-ref tests remain green.
- The actual §212 changed-file scope passes with no exception after the narrow
  recognition is independently reviewed; preserve the original failure record.
- Separate independent non-author code review judges bounds and negative tests
  before root uses the change to accept a paragraph package. Source/render,
  economics, page QA and specialist review remain distinct mandatory gates.

No shared rendered-proof contract expansion is needed for the builder's two
supplementary grayscale captures: those are relocated to the existing named
sprint-evidence area, with hashes and references preserved, rather than treating
arbitrary files inside canonical proof directories as accepted capture content.

Next: implement/test this bounded naming support, obtain independent review,
and validate the actual §212 archives alongside its fresh paragraph review/QC.
