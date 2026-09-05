# Root adoption and reproduction — §212 R5 / §221 R6

Date: 2026-09-05. Accountable coordinator: `codex-root`.
Status: **REPRODUCIBLE; PARAGRAPH REVIEWS PASSED WITH FLAGS; SPECIALIST QC PENDING**.
This supplements, and does not rewrite, the historical §221 R5 root verification.

## Candidate identity

Root platform `3bf29a96cbdbcb1f51570b3ec39ff61d115c680c`, lessons
`7867b72a7829ef96cbd1aa451e89aebcec79da0b`, branch
`codex/book2-part-a-production-20260905`, paired dedicated worktrees under
`C:/wt/book2-part-a-production-20260905/`, claim codex-root /
BOOK2-TEXTBOOK-PRODUCTION-1. Fetch, governance freshness and ongoing worktree
ownership checks PASS; origin/main remains `96416b6b5bd57094576e9aba0a42d682584ec479`.
Expected ahead commits and four new runner/evidence paths were inspected before edits.

§212 published builder platform `16eca0301ae66071830606b95ae0b7866395068f`
was adopted through source `21bee92a`, publication `093d2a17` and grayscale
relocation `3bf29a96`. Lesson `afc2ed53e6ae5f85bbeaa3c61172fc419b59e08f`
became root `7867b72`. §221 R6 corrective platform
`a5f6c163725a988bff76dcba14254e67d725a169` became `6ae2c902`; lesson
`7523d9c2dc89ada2f736ddcb199118dd5f69270a` became `e2d75b5`.
These are isolated candidate integrations, not merges to main.

## Actual root execution

Structured sprint runner recorded six commands, all exit 0:

1. §212 source tests: ten PASS.
2. `b2_212.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-root-rebuild-r5.json`: rebuild PASS, including currentness and twelve-record durable authority before output writes.
3. §221 source tests: ten PASS.
4. `b2_221.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-rebuild-r6.json`: rebuild PASS, same authority preflight.
5. §212 render checker: PASS against actual root lessons, twelve-point body/footer, minimum figure label 12.548pt, ZIP member parity, twenty-seven pages.
6. §221 render checker: PASS on its explicit original-builder R6 manifest paths, twenty pages, twelve-point body/footer, minimum figure label 12.221pt. This command alone does not prove root equality.

Root then ran separate read-only raw SHA-256 comparisons using PowerShell
Get-FileHash, checking both actual builder and actual root files against each
manifest, document/asset order and remapped paths. §212: seventy-five paired
references (six inputs, nine document files, thirty asset references, three
ZIPs, twenty-seven PNG pages). All outputs/assets/ZIPs/pages match byte-for-byte.
The only input difference is the already reviewed shared print helper:
builder `570cecd697a3123f145d30dfd25eae738d423baa317f2d6469a2dbaf59aeed2f`,
root `51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5`.
It contains the accepted book-front/back conditional behavior. Actual standalone
rebuild parity establishes that the §212 outputs are unchanged, not an assumption.

§221: forty-three paired references (six inputs, nine documents, eight asset
references, twenty page PNGs), all identical with no input differences. Thus its
original-path mechanical checker applies to byte-identical root files. All six
imported immutable proof manifests also match actual builder raw bytes and the
exact hashes recorded in the independent paragraph reports. Generated proof
statuses remain PENDING; no captured inspection field was altered.

## Root visual inspection

Root read all §212 authored fragments, builder, tests and final supporting
reports, and personally opened all twenty-seven R5 pages individually at normal
reading scale: paragraph 1–14, exercises 1–7, answers 1–6, plus both grayscale
probes. No visible clipping, overlap, broken table, lost question, unreadable
label or orphan step heading was found. Exercise continuations are coherent;
pots' prompt and source remain available across facing pages. Target remains
intact and answer graph separate. Dark dashed TK and solid TO remain legible in
grayscale; the orange stroke is only a redundant accent. Substantial whitespace
on the target page is not omission of target content.

Root personally inspected all twenty §221 R5 pages earlier. For R6, root directly
viewed the four changed pages (paragraph 3–5, exercises 2); no visible defect.
Root independently recomputed all twenty R5/R6 actual page hashes and proved
exactly those four changed, with sixteen exact-hash transfers from root's own
earlier individual inspection. This is not transfer of builder inspection.

## Root ZIP-content check and review separation

Read-only .NET ZipArchive verification constructed the expected exact names from
each root edition's MD/HTML/PDF and referenced paired assets, rejected unexpected
or duplicate names, required every expected member and recomputed raw SHA-256
from each entry stream. All pass: nineteen paragraph, eleven exercises, nine
answers members. Student editions contain no answer file or answer-only ex3/4/5
pair; no script, traversal, duplicate or extra file can pass the exact inventory.
Independent paragraph reviewer separately reached the same result.

The new exact thirty-three-path archive classification has separate independent
PASS evidence in `BOOK2-TEXTBOOK-PRODUCTION-1-paragraph-archive-review.md`.
Fresh independent paragraph decisions are recorded separately for §212 R5 and
§221 R2. They do not replace distinct specialist QC now assigned to independent
reviewers, nor the lane-owned review/quality-ref updates and final handoffs.

§212 retains 54-minute unobserved timing and the nonblocking recap qualification
recommendation; §221 retains 48.5-minute unobserved timing. No classroom attainment,
Part B authority, final paired CI, human readiness or future merge is claimed.
Root lessons remained clean after both regenerations; proof/history is untouched.
The Markdown command log alone is mechanically formatted to LF before commit,
preserving original escaped JSONL outputs and hashes. Next: specialist QC, then
explicit root handoffs and dependency releases if all gates pass.
