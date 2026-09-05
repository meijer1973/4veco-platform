# Book 2 exact-source book profile — review record

## Scope and status

Author: codex-root. Date: 2026-09-05. Status: PENDING independent review.
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

Pending. Record the actual verdict and any source corrections here.
