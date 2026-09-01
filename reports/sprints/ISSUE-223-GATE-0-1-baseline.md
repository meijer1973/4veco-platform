# Sprint ISSUE-223-GATE-0-1: Baseline

> **Operative status after owner review:** Gate 0A baseline audit PASS;
> curriculum-design Gate 0B REVISE / `HOLD_FOR_GOAL_AND_TARGET_DESIGN`.
> The hashes and rendered observations below remain valid audit evidence, but
> they do not approve the current goals, target, old exercise mapping, a lesson
> rewrite, generated output, or a paragraph-specific guardrail.

## Plan reference

Plan: `reports/sprints/ISSUE-223-GATE-0-1-plan.md`

## Starting state

- Platform worktree: `C:\wt\Issue 218, textbook excercises\issue223-gate0-platform`
- Platform branch: `codex/issue223-gate0-planning-20260901`
- Platform baseline: `15bb80496916e3c07f5c957226b857cc689d9f43`
- Lesson worktree: `C:\wt\Issue 218, textbook excercises\issue223-lesson`
- Lesson branch: `codex/issue223-lesson-20260901`
- Lesson baseline: `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- Both worktrees were clean, aligned with their respective `origin/main`, and
  claimed as task `ISSUE-223-GATE-0-1` by `codex-root` before planning work.

PR #222 merged as the exact platform baseline. Post-merge CI run `33399439318`
passed that commit. Issue #218 remains closed. Issue #223 is open, but owner
review now blocks lesson, target-authority, and guardrail implementation until
the revised human-reviewed gate sequence is satisfied.

## Current target authority audit

- File: `references/authored/course-target-exercises.json`
- File SHA-256:
  `33928e7929fa1c9af86159b07769e2f01d28963873ef34c40e55c2001feb87ac`
- §2.1.1 record SHA-256 using `JSON.stringify(record)` in repository property
  order:
  `f01cd43c65e639e396a14b3dcfe5ed546ed7baa5cf8d2aa20a8bbe0c2c310de8`
- Record status: `reviewed_final`
- Source: `references/owned/course-blueprint-v5.md §2.1.1`
- v4 source id: `1.3.2`
- `review_required_before_final: false`

The current target decomposition, including goals, subquestions, operation
chain, representations, answer forms, prior-knowledge boundary, and explicit
non-target operations, remains baseline evidence. Owner review reopens its
educational quality and rejects treating it as immutable. No target or protected
reference mutation is authorized in PR #224.

## Current lesson source state

The current lesson contains a bakery graph/table, a foodtruck example, repeated
practice calculations, an Opgave 7 matching the current registry chain, and
complete numerical answers. None has a presumption of reuse; the package is
read-only audit/salvage evidence and predates the newly approved contract:

- the paragraph uses `## Samenvatting`, `## Vastgelopen op een opgave?`, and
  `## Opgaven` rather than the exact seven-section route;
- the summary has six bullets and is a heading rather than a compact
  non-heading summary of at most five points;
- there is no printed optional `Begeleide inoefening` section or exact short
  route note;
- Startopgaven contains graph reading but no genuine generic prior-arithmetic
  retrieval;
- Herhaling appears before Doeloefening, and Opgave 5 duplicates much of the
  independent calculation chain;
- `2.1.1-review.md` contains stale target-status prose even though the registry
  and quality-ref record `reviewed_final`;
- `build_pdf.py` produces the current PDFs but the final exercise page has large
  avoidable blank space and target questions cross a page boundary.
- the paragraph has no student-visible `Na deze paragraaf kun je` goal box;
- the worked example, guided table, independent work, target, and bonus repeat
  substantial arithmetic, while classification, units, total-versus-average
  interpretation, and ambiguous statements receive much thinner evidence;
- the current target supplies the constant/variable labels and never asks why
  `GVK` remains constant, so it does not fully elicit its stated goals;
- the printed target omits the rent/insurance meaning of the fixed amount and
  treats energy as an unqualified per-product variable cost rather than teaching
  that a bill can contain constant and variable components.

## Baseline artifact inventory

All hashes are SHA-256 at lesson baseline `f09fd6e...`.

| File | Bytes | SHA-256 |
|---|---:|---|
| `2.1.1 Kostenstructuren – antwoorden.html` | 15,664 | `c594d983530dcc11d31ef4f39d1d01766f8d1d54a7dd255d1b60b956c3f7442d` |
| `2.1.1 Kostenstructuren – antwoorden.md` | 4,742 | `e40b2948e4ec1fdf15ead71b7c46b7c5511e484587eb676120e6975943ea7fd6` |
| `2.1.1 Kostenstructuren – antwoorden.pdf` | 37,085 | `eaa105f0f691d87b2185a5c90f256892ce308e6d2c223dd430d1cd95b3ad4aa6` |
| `2.1.1 Kostenstructuren – opgaven.html` | 460,578 | `a086f428e369510c728127f8ba752e1e982e37dd7ed01f40e74b022380282a6f` |
| `2.1.1 Kostenstructuren – opgaven.md` | 4,852 | `160efffc43e1dc4938de8bc1dbb25937ff5434587b2ca4ded6e15e6d8cbf27f5` |
| `2.1.1 Kostenstructuren – opgaven.pdf` | 333,746 | `e04e1e08e04510dbd276f6cd1936e1e6b2f28bd7909b34e367fd1928a48db6f9` |
| `2.1.1 Kostenstructuren – opgaven.zip` | 222,900 | `bb951635865a5e7e321f562ef73c640c84948f99441385f217cf366d9e3e996d` |
| `2.1.1 Kostenstructuren – paragraaf.html` | 466,142 | `15fbebfd2579fd762f8889b39f8c42ffa0e1a96722800fc74fdf1e8e0cdc819c` |
| `2.1.1 Kostenstructuren – paragraaf.md` | 8,093 | `a8ec73b249ac0253952f507715a1f86fdf2184607c28834787ca7bf0dd1f4d31` |
| `2.1.1 Kostenstructuren – paragraaf.pdf` | 345,508 | `b30b559d69e8a7b1cbe3ec9f6dec57104bd91c978d0affe3771aa41101c0db77` |
| `2.1.1-quality-ref.yaml` | 823 | `c3943165fd24b9197f8bd47a691d3449874aea29048eb6bcfb3146a6ef327751` |
| `2.1.1-review.md` | 1,321 | `313da5cb0bb71697820ce791f8775af09f84469a64d6f553c96c5c4006699569` |
| `build_pdf.py` | 3,293 | `4763aff3adef9d05d787073dfc188ad7df0b241c0dce59f3214e22042e80f6f5` |
| `_assets/2.1.1_fig_1.png` | 333,852 | `08423a4a6f26c875a4c3ccd8c4bb3421dbc645b328c8fd5523aee075afb25808` |
| `_assets/2.1.1_fig_1.svg` | 2,479 | `7e1674e16c93069b27e6cd1876c6729c36b5837c9a04478df161fde5cd3f6b54` |

The figure assets are under the paragraph's `_assets/` directory and remain
subject to exact SVG/PNG pairing and rendered graph/text concordance checks.

### Stale tracked zip disposition

`2.1.1 Kostenstructuren – opgaven.zip` is tracked but is not a required output
of the current Part A lane. Its archive members are materially older than the
live baseline: for example, archived/live `opgaven.html` are 38,146/460,578
bytes, archived/live `opgaven.pdf` are 55,091/333,746 bytes, archived/live
`paragraaf.pdf` are 67,050/345,508 bytes, and the archived PNG is 17,026 bytes
versus the live 333,852-byte PNG. Keeping or regenerating it would preserve a
second, stale distribution surface. The stale-zip finding remains valid, but
the earlier deletion authorization is withdrawn. A later approved lesson/output
gate must explicitly decide whether to remove it and prove that only governed
current outputs remain. Gate 0B does not change, replace, or delete the archive.

`2.1.1-textbook-handoff.md` is absent at baseline. The merged textbook lane
requires it for eventual closure. Its later creation remains a Part A lane
obligation, not an authorized Gate 0B output or a Part B completion claim.

### Frozen quality-ref state

The baseline `2.1.1-quality-ref.yaml` has SHA-256
`c3943165fd24b9197f8bd47a691d3449874aea29048eb6bcfb3146a6ef327751`
and records:

| Field | Baseline value |
|---|---|
| `reviewed_on` | `2026-06-08` |
| `review_mode` | `part-a` |
| `target_exercise_status` | `reviewed_final` |
| `target_status_promotion_sprint` | `B2-2.1-TARGET-V5-PROMOTE` |
| `production_ready_with_flags` | `true` |
| Content flags | All current markdown, PDF, motivating problem, worked example, summary box, help note, staged route, and target exercise fields are `true`. |
| Assets | One referenced asset; no missing assets; SVG/PNG paired; naming compliant. |
| Review | `PASS WITH FLAGS`; zero unresolved blockers; existing-graph reuse flag. |

The historical `staged_exercise_route: true` and `PASS WITH FLAGS` describe the
older Book 1-style hardening standard. They are baseline metadata, not proof
that the newly merged exact seven-section contract is already satisfied.

## Rendered-output baseline

The three existing PDFs were rendered to PNG page images and every baseline
page was visually inspected, not inferred from extracted text:

| PDF | Pages | Page size | Baseline visual findings |
|---|---:|---|---|
| paragraph | 8 | A4 | Readable overall. Old section structure begins on page 5. The graph legend occupies the plot area. Target Opgave 7 begins at the bottom of page 7 and continues on page 8. |
| exercises | 5 | A4 | Readable overall. Doeloefening begins late on page 4 and continues on page 5; page 5 is mostly blank after Opgave 8. |
| answers | 6 | A4 | Readable and numerically complete. Opgave 7 fills page 5 and Opgave 8 sits alone on page 6 with substantial unused space. |

No clipping, table overflow, missing figure, broken glyph, or fully blank PDF
page was observed. These are baseline observations only; all final pages must be
rendered and inspected again after source regeneration.

This layout inspection is not pedagogical approval. Later content review must
publish reviewable page images or contact sheets and require teacher-learning-
quality and student-experience inspection of every page, including calculation
load, visible goals, context, explanation opportunities, and misconceptions.

## Validator baseline and gap

- The merged Part A authoring checker validates contract, policy, and template
  surfaces, not the concrete §2.1.1 lesson files.
- The paragraph validator validates Part A file presence, PDFs, asset pairs,
  and review/quality-ref metadata, not the seven headings, summary placement,
  route wording, Start roles, device/internal language, timing, target coverage,
  or exercise/answer parity.
- The concrete-validation gap is recorded, but owner review withdraws the claim
  that a paragraph-specific guardrail is already required. Gate 3 may decide
  objective generic or §2.1.1 automation only after goals, target, paragraph,
  and exercises are approved and stable.

## Historical evidence caveat

PR #222 result/roadmap sentences about pending push, readiness, integration,
and post-merge CI are historical pre-integration snapshots. They are
superseded by merge `15bb8049...`, exact-commit run `33399439318`, and Issue
#223. This caveat is non-blocking and does not reopen PR #222 or Issue #218.

## Data integrity notes

Protected reference data is unchanged. No writes are authorized under
`references/machine/`, `references/external/`, the target registry, blueprint
authority, MTU/candidate/PV records, Book 1, Part B, other Book 2 paragraphs, or
Chapter 2.1 assembly. At this baseline stage, the dedicated lesson worktree has
no student-facing or generated-output diff.
