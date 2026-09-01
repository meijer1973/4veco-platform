# Sprint BOOK-2-FOUNDATION-OUTLINE-1: Baseline

## Plan reference

Plan: `reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-plan.md`

## Starting state

- Issue: #225
- Platform worktree:
  `C:\wt\Issue 218, textbook excercises\book2-foundation-outline-platform`
- Platform branch: `codex/book2-foundation-outline-20260901`
- Platform baseline: `15bb80496916e3c07f5c957226b857cc689d9f43`
- Claim owner: `codex-root`
- Claim task: `BOOK-2-FOUNDATION-OUTLINE-1`
- Governance preflight:
  `npm.cmd run check:governance-freshness -- --allow-policy-edit` passed.
- Lesson worktree: `C:\wt\Issue 218, textbook excercises\4veco-lessen`
- Lesson branch/commit are read-only evidence and will be re-recorded at final
  validation.

The platform branch started clean at the then-current `origin/main`. The lesson
repository is outside the implementation scope.

## Pinned platform sources

| Source | SHA-256 | Baseline observation |
|---|---|---|
| `references/owned/course-blueprint-v6-three-year.md` | `72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e` | Owned three-year umbrella authority; assigns Book 2 to Year 1, test week 2, and a 12-paragraph costs/revenue/elasticity/surplus route. |
| `references/owned/course-blueprint-v5.md` | `61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7` | Detailed active Year 1 authority; defines the 12 Book 2 IDs, order, kinds, and source statuses. |
| `references/authored/course-target-exercises.json` | `33928e7929fa1c9af86159b07769e2f01d28963873ef34c40e55c2001feb87ac` | Active target registry; currently contains all 12 Book 2 records in v5 order. |
| `references/owned/course-blueprint-pedagogical-boundaries.md` | `47a9d1ee203efe4b94eb360e696f071ae66bfda1192b389b59e22b9d64e8f5a7` | Preview/familiarity is not mastery; Book 2 must formally teach its named operations. |
| `skills/econ-exercise-builder.md` | `27b8a1a09f3b87b57ce9608ccadfb0a5f32c47e62ae3436970aee58fc0464d5a` | Part A target-first exercise contract, 55-minute bound, and mastered-prerequisite rule. |

## Read-only lesson evidence

| Source | SHA-256 | Baseline observation |
|---|---|---|
| `../4veco-lessen/specifications/product-end-state.md` | `78c739220f359a5d5301d7d854dd42a2f45181bb54b4772d66509377f4bbe6ab` | Canonical operational product north star. |
| Book 2 Chapter 2.1 `_chapter-plan.md` | `cbf01cedb2250cdc4aff53e596b9a5c7bbb20e2d9fe829b0c7fc703ee4e28c58` | Lists scope/assets/review state but does not define a full paragraph progression or Book 2 dependency route. |
| Book 2 Chapter 2.2 `_chapter-plan.md` | `3ee3156020bf61626e94963508a960a651e08028f0dc4b4ebf1aebdadd633167` | Contains a materially stronger paragraph route, consolidation notes, and assembly guidance. |

The Book 2 root has no root outline. A Chapter 2.3 lesson directory/plan is not
present. These are evidence gaps, not permission to write in the lesson repo.

## Book 1 entry evidence

All twelve Book 1 target records are `reviewed_final`. The usable Book 2 entry
base includes mastered percentage/index calculation (§1.1.2), graph/table
reading and claim interpretation (§1.1.3), demand and demand shifts (§1.2.1–3),
supply (§1.3.1), equilibrium calculation and surplus/shortage (§1.3.2), and new
equilibrium after shifts (§1.3.3). Mixed paragraphs consolidate those skills.

Pedagogical boundaries still control: Book 1 exposure to cost, revenue, profit,
consumer-surplus intuition, or normal/inferior labels is familiarity only where
the boundary file says so. The outline may retrieve mastered generic arithmetic,
graphs, demand/supply, and equilibrium, but must formally teach Book 2 economic
operations rather than treating preview exposure as mastery.

## Book 2 target baseline

The registry matches the v5 12-paragraph route and kinds:

| Paragraph | Kind | Registry status |
|---|---|---|
| 2.1.1 | theory | reviewed_final |
| 2.1.2 | theory | reviewed_final |
| 2.1.3 | theory | reviewed_final |
| 2.1.4 | gemengde_opgaven | reviewed_final |
| 2.2.1 | theory | reviewed_final |
| 2.2.2 | theory | reviewed_final |
| 2.2.3 | theory | reviewed_final |
| 2.2.4 | gemengde_opgaven | reviewed_final |
| 2.3.1 | theory | migrated_from_v4_needs_v5_review |
| 2.3.2 | theory | migrated_from_v4_needs_v5_review |
| 2.3.3 | theory | migrated_from_v4_needs_v5_review |
| 2.3.4 | gemengde_opgaven | placeholder_needs_review |

Exact per-record hashes will be embedded in the machine outline and checked
against `JSON.stringify(record)` in repository property order.

## Initial conflict and hold log

- No material v6/v5 contradiction has been found. V6 delegates detailed Year 1
  structure to v5 and does not supersede target or boundary authority.
- The missing Book 2 outline is a real derived-planning gap, so the expected
  audit outcome is `VALID_WITH_DERIVED_OUTLINE_REQUIRED` unless later evidence
  reveals a blueprint-blocking conflict.
- §2.1.2's target context refers to bakery material in `§1.3.2`, but the v5
  Book 2 sequence puts its intended preceding bakery foundation in `§2.1.1`.
  This is a visible target-quality hold; no silent repair is authorized.
- §2.3.3's migrated target context refers to the market from `§2.2.2`, while
  the current welfare sequence indicates `§2.3.2`. This remains a target-review
  hold; no silent repair is authorized.
- §2.3.1–§2.3.3 still require v5 review and §2.3.4 remains a placeholder.
- The lesson root and chapter-plan maturity are incomplete/inconsistent. The
  platform outline may state intended structure but may not claim lesson
  implementation readiness.
- Gate 0B-1 for §2.1.1 stays blocked until this outline is reviewed, approved,
  merged, and pinned by exact version/hash.

## Baseline disposition

Planning may proceed. No source authority, target record, protected reference,
or lesson file has been edited. Human owner approval and integration remain
outside the current implementation authority.

## Data integrity notes

- Protected reference data under `references/machine/` and
  `references/external/` is read-only and unchanged.
- The active target registry and both owned blueprint files are hash-pinned
  inputs and are not authorized write surfaces.
- The lesson repository is read-only evidence; its baseline commit and chapter
  plan hashes are recorded above and must remain unchanged.
- The derived outline and sprint/review artifacts are new platform-authored
  planning surfaces. They create no source-data, generated-output, target,
  mastery, diagnostic, sequencing, summative, AI, PV, or product-use authority.
