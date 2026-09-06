# Actual text-extraction whitespace diagnostic

The first specialist HTML/PDF membership probe stopped on the first target
answer formula in `antwoorden`. The source HTML holds an uninterrupted inline
formula ending `GO=(P×Q)/Q=P=€1,50 per brood.`; the PDF visually wraps after `/`
and extraction inserts whitespace before the following `Q`. The own harness
initially required the whitespace-normalized HTML node as an exact substring.

I personally inspected fresh r20 answer page 4 in color and grayscale: all
symbols, calculation and the formula continuation are printed correctly. The
terminal's non-UTF-8 display replacement in the first uncaptured outer traceback
is not a claim of malformed HTML or printed replacement glyphs. Frozen registry
source, generated HTML and the visual PDF show the multiplication and euro signs.

The corrected own membership probe removes whitespace only on both sides, so
native PDF line wrapping cannot falsely fail an otherwise identical formula.
It still requires every other character of every body text node, and records
the actual HTML/PDF hashes and this normalization. No lesson/source/renderer
edit or native regeneration was performed for this diagnostic.
