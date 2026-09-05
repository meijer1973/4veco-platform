# Book 2 exact-source book profile — review record

## Scope and status

Author: codex-root. Date: 2026-09-05. Status: Round 1 REVISE; correction pending recheck.
This is reusable assembly tooling, not completed chapter/book output or approval.
The combined production plan already requires separate paper-only student and
answer books, reviewed front/back matter, exact input provenance and 12-point
print readability without Book 1 regeneration.

The existing book CLI/library now dispatches only an explicit
`book2-frozen-part-a` manifest to the new bounded Book 2 helper. No such final
manifest is created while chapters remain unfinished. Existing Book 1 paths and
rendering stay unchanged. Unknown profiles or a profile attached to another
book fail. Input preflight checks all six chapter sources, exact asset maps,
root plan and authored front/back sources before any output write. The helper
does not generate teaching content, approve plans, or infer chapter acceptance.

The shared print helper change excludes explicit book front/back regions from
exercise wrapping and adds the short Book 2 footer rule only when book front
matter is actually present. Root rebuilt §211 afterwards: all three MD/HTML/PDF
and asset outputs remain unchanged; lesson status stays clean. The generated
root rebuild record binds the actually used updated helper independently of
the earlier canonical builder record.

## Author-observed checks

- Book profile tests: 9 PASS, including strict order/title/root pins, changed
  sources/assets, matter path confinement/active HTML, twelve paragraph anchors,
  student/answer separation and protected front/back wrapping.
- Existing print and chapter tests: 20 + 6 PASS.
- Existing book-library Python tests: 7 PASS.
- §211 complete rebuild: exit 0; identical current MD/HTML/PDF/assets;
  approved paragraph currentness and durable twelve-record authority PASS.

The first provisional shared CSS placement was corrected before publication
to avoid changing standalone paragraph HTML; final rebuild confirms parity.
No actual book pages are represented by these temporary technical fixtures.
Independent review must judge correctness, fail-closed pins, separation,
source/anchor transformation and regression risk before real book assembly.

## Independent review

Round 1 reviewer: `correction_plan_review`, independent/read-only, reviewed
983eecf106768532ec1a2f74958cd4929b89b148. Verdict: REVISE, B2-BOOK-01 (P2).

Raw-regex anchor rewriting broke valid links to implicit heading IDs and
single-quoted explicit IDs, and changed visible code literals containing
`id="example"`. The reviewer independently reproduced all three cases with
real Pandoc conversion. Existing 9 book + 20 print + 6 chapter + 7 legacy tests
all passed, demonstrating the missing regression coverage rather than closure.

The other reviewed paths were sound within scope: explicit profile dispatch,
ordered book/chapter identities, input/asset pins and path confinement,
student/answer separation, pre-write authority checks, input freshness,
pending-only proof, bounded shared-print changes. No actual book was approved.

### B2-BOOK-01 correction

Chapter Markdown is now resolved to structural HTML with Pandoc first. Only
actual IDs, anchor hrefs and structural IDREF attributes are prefixed. Implicit
heading anchors, quote variants and reference-style links are resolved together;
code and ordinary visible teaching text are not rewritten. Chapter and final
assembled navigation must resolve against unique, nonempty IDs before any
output writes, including authored front/back TOC links and all stable paragraph
targets. Original source bytes remain in the assembly provenance manifest.

Added real-Pandoc regressions cover every reported form, exact visible-text
preservation, duplicate/missing targets and final front/body anchor collisions.
An initial code-literal assertion incorrectly expected a trailing newline that
Pandoc itself omits; the corrected test compares visible text before/after the
structural transformation and separately checks the literal code string.
Round 2 independent verdict is not yet available.
