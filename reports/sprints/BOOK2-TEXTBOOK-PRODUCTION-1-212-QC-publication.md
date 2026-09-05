# §2.1.2 R5 specialist QC publication

Date: 2026-09-05. Agent: `paragraph_212_qc`.
Branch in both repositories: `agent/book2-212-qc-20260905`.
Task: `BOOK2-TEXTBOOK-PRODUCTION-1-212-QC`.

## Payload and attribution

| Repository | Commit | Bounded delta |
|---|---|---|
| 4veco-platform | `1493e3500fb7dcc36739e1769920a3bf0436dcb4` | Six new specialist planning, verification, review and independent page-inspection evidence files. |
| 4veco-lessen | `c51f1777afc358a49e249dd599d29a8d5fd2607a` | Fresh `2.1.2-review.md` and only the `partA` block of `2.1.2-quality-ref.yaml`. |

This publication record is a later platform evidence-only tail. The handoff
message supplies its exact containing commit and verified pushed remote heads;
the record does not invent a self-containing commit hash.

Specialist verdict: **PASS WITH FLAGS**, no required correction. The separate
paragraph verdict is `correction_plan_review`'s actual PASS WITH FLAGS recorded
at platform `406e0b0af719d4b1720f19e0fb63c2516881955f`. Full attribution and
exact candidate/proof bindings are in the fresh specialist and lesson reviews.

## Post-write checks

| Check | Actual result |
|---|---|
| YAML parse, unchanged non-PartA fields and absent companion block | PASS; no companion fabricated. |
| Review hash in quality-ref equals actual file | PASS, raw SHA-256 `74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd`. |
| Normal `student-web --mode part-a` | PASS; final output explicitly recognizes verdict PASS WITH FLAGS. |
| Normal `publisher-print --mode part-a` | PASS; final output explicitly recognizes verdict PASS WITH FLAGS. |
| Actual builder lesson single-commit scope (`afc2ed53^...afc2ed53`) | PASS, 35 Part A paths including the exact three ZIP names; no exception. |
| QC lesson delta scope (`7867b72...c51f177`) | PASS, one Part A review path and one PartA-only quality-ref evidence path. |
| QC platform evidence-only delta (`3bf29a9...1493e35`) under shared lane | FAIL solely because six review-evidence paths contain no shared-platform-owned source change. All six correctly classified; zero unknown files. |
| Full inherited platform branch (`origin/main...1493e35`) under shared lane | PASS; origin/main `96416b6b5bd57094576e9aba0a42d682584ec479`; no scope exception. |
| Both staged whitespace checks before content commits | PASS. |
| Both claimed worktree safety checks after commits | PASS, correct task/owner/branch, clean, no divergence. |

The evidence-only platform failure is not hidden or bypassed. This reviewer
must not manufacture a source change to satisfy a lane-owner condition. Root
will carry the specialist evidence with its actual production/shared-source
payload and run its final combined scope gate. The full inherited-branch pass
is not misrepresented as a pass of the six-file-only delta.

An initial review-format check fell back to “no explicit verdict” because the
verdict line included explanatory text. The review was reformatted with its
standalone canonical verdict line, then its hash and both profiles rechecked.
This changed review evidence only, not the reviewed student payload. A first
worktree-check invocation omitted `--check`; corrected invocations both passed.

## Independent checks already completed

Own currentness/action gate and durable frozen authority PASS; all numerical
chains recalculated; all 27 full pages, 11 direct figure pairs and two full-page
grayscale probes personally inspected. Ten source tests and rendered geometry/
font checks PASS. All three MD editions regenerated in memory, all eleven SVG
sources and fresh PNG exports match published bytes. Fresh Poppler 150 DPI
reproduced all 27 page hashes and both grayscale hashes. Exact ZIP inventories
19/11/9 have streamed SHA-256 member parity, no unexpected files, duplicate
names, traversal, scripts or pupil answer leakage. Detailed independent results
are in `BOOK2-TEXTBOOK-PRODUCTION-1-212-QC-verification.json`.

Student sources, generated MD/HTML/PDF/ZIP, assets, immutable PENDING manifests,
builder inspection, target records, approved plans, authority and shared scripts
remain unchanged. Historical unrelated quality-ref top-level fields remain
unchanged and are explicitly not current Part A acceptance. No companion,
quality.json, shared generator or protected inspection reference was authored.

## Root handoff and retained limits

Root should cherry-pick only the new platform QC commit and publication tail,
plus the one lesson QC commit. Do not re-import the shared base history.
The paired dedicated worktrees remain claimed for this task after publication.

Keep the observation-dependent 54-minute core / 67-minute supported route /
77-minute all-items estimate, nonblocking recap model/range reminder omission,
and omitted current-2026 inspection mapping. Their `blocks`, `does_not_block`
and `proof_required_to_close` are recorded in the specialist review/quality-ref.

Root owns adoption, global maps/indexes, downstream handoff and final combined
exact-head CI. No independent full Jest rerun, exact-head CI PASS or waiver,
human-ready/PR decision, chapter/book acceptance, observed learning or merge
authorization is claimed by this specialist task. A normal branch push is not
CI proof. No PR or merge operation was performed.
