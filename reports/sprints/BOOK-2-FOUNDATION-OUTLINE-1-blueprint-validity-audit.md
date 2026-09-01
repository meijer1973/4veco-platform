# BOOK-2-FOUNDATION-OUTLINE-1 Blueprint Validity Audit

Audit date: 2026-09-01

## Outcome

`VALID_WITH_DERIVED_OUTLINE_REQUIRED`

The owned three-year blueprint, active Year 1 blueprint, target registry,
pedagogical boundaries, and Part A exercise contract provide enough compatible
authority to derive a Book 2 outline. No material contradiction requires a
blueprint repair before the outline can be drafted.

The audit does not return `VALID` because the required book-outline layer is
absent, the lesson Book 2 root has no root plan, Chapter 2.3 has no lesson plan,
and several target/readiness holds must remain visible. It does not return
`BLOCKED_BLUEPRINT_REPAIR_REQUIRED` because those gaps can be represented as
derived sequencing and explicit holds without changing the blueprints.

## Audited authority and evidence

| Evidence | SHA-256 / commit | Authority use |
|---|---|---|
| `references/owned/course-blueprint-v6-three-year.md` | `72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e` | Three-year umbrella, Book 2 role, count, operation-family trajectory, and Book 3 dependency. |
| `references/owned/course-blueprint-v5.md` | `61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7` | Detailed active Year 1 Book 2 structure and source statuses. |
| `references/authored/course-target-exercises.json` | `33928e7929fa1c9af86159b07769e2f01d28963873ef34c40e55c2001feb87ac` | Active goals, operations, target contexts, kinds, statuses, and record evidence. |
| `references/owned/course-blueprint-pedagogical-boundaries.md` | `47a9d1ee203efe4b94eb360e696f071ae66bfda1192b389b59e22b9d64e8f5a7` | Preview, support, independently-required, and mastery boundary. |
| `skills/econ-exercise-builder.md` | `27b8a1a09f3b87b57ce9608ccadfb0a5f32c47e62ae3436970aee58fc0464d5a` | Book 2+ Part A target-first exercise contract and time/route constraints. |
| `../4veco-lessen/specifications/product-end-state.md` | `78c739220f359a5d5301d7d854dd42a2f45181bb54b4772d66509377f4bbe6ab` | Read-only product north star. |
| Book 2 Chapter 2.1 `_chapter-plan.md` | `cbf01cedb2250cdc4aff53e596b9a5c7bbb20e2d9fe829b0c7fc703ee4e28c58` | Read-only current lesson planning evidence. |
| Book 2 Chapter 2.2 `_chapter-plan.md` | `3ee3156020bf61626e94963508a960a651e08028f0dc4b4ebf1aebdadd633167` | Read-only current lesson planning evidence. |

## V6 to v5 reconciliation

V6 fixes Book 2 at 12 count-bearing paragraphs and identifies the operation
families for cost/revenue/profit, marginal reasoning, elasticity, and
surplus/deadweight loss. V5 supplies the active Year 1 detail: three chapters,
three theory paragraphs plus one consolidation paragraph per chapter, followed
by test week 2.

The sources are compatible under this authority rule:

- v6 supplies the long-route purpose and later-book dependency;
- v5 supplies Book 2 paragraph identity, order, kind, topic, and source status;
- the target registry supplies current paragraph-level goals and operations;
- boundaries prevent earlier previews from being promoted to mastered entry
  prerequisites; and
- the Part A exercise contract controls later paragraph authoring.

V6's operation-family label `OP-C2` includes "output choice", while the current
v5 §2.1.3 target teaches marginal calculation and interpretation but does not
yet require a formal `MO = MK` output-choice decision. This is recorded as a
later coverage review, not silently added to §2.1.3 and not treated as a
blueprint-blocking conflict.

## V5 to registry structural reconciliation

The registry has the same 12 Book 2 IDs, order, kinds, and source statuses as
the v5 table.

| ID | Kind | Status | Target record SHA-256 |
|---|---|---|---|
| 2.1.1 | theory | reviewed_final | `f01cd43c65e639e396a14b3dcfe5ed546ed7baa5cf8d2aa20a8bbe0c2c310de8` |
| 2.1.2 | theory | reviewed_final | `51de36d4b150bcabb51b8391aff15bf5b68610f140b80d12ca3f021e663ae4b5` |
| 2.1.3 | theory | reviewed_final | `e06c097e50cb44ea41357125f224a60124c5a4d17f7eaeafae769f15bfe683fd` |
| 2.1.4 | gemengde_opgaven | reviewed_final | `7a4a01e133dcdf828f4f9d7b06209d1c51ca29ff98d83876dc026f8ba973ac24` |
| 2.2.1 | theory | reviewed_final | `4283adf5c6de9015c2daccc80b794183138ff4b7b9b5f4309bd7da80ef0304ed` |
| 2.2.2 | theory | reviewed_final | `b939b9f4538d9e16f5eed3c8a1f9bca03b8a2380610776105a5c8d235795ffb1` |
| 2.2.3 | theory | reviewed_final | `5455130e28d15c2b70a77d55df346ca04c5a19d6c25da158c615fddd68ba3a17` |
| 2.2.4 | gemengde_opgaven | reviewed_final | `5edc21a8f3977215674013fca251719d8000c34ab9736246f119a4ef21a1476b` |
| 2.3.1 | theory | migrated_from_v4_needs_v5_review | `078536130e88c1bc9c6a58fc492dc47ccf7a411bafc8b49b9571e1de238f0388` |
| 2.3.2 | theory | migrated_from_v4_needs_v5_review | `d1dba16d567f77717277206c1e01de3d69de5f3e5c2c68783835a81c1f7b9ab8` |
| 2.3.3 | theory | migrated_from_v4_needs_v5_review | `7ae371e71b3f805daa084c4a0ddf32498f8ded36acfc2f7e97a0d5f443a2d833` |
| 2.3.4 | gemengde_opgaven | placeholder_needs_review | `601f73e3ed958b4b6257e3ccad0a08c44138b2a2fa310bbcee8beedc120e856f` |

Record hashes use SHA-256 over `JSON.stringify(record)` in repository property
order. They are freshness pins, not assertions that every reviewed record is
free from later-discovered quality defects.

## Book 1 entry and boundary audit

All 12 Book 1 registry records are `reviewed_final`. Book 2 can therefore plan
retrieval of these established operations where relevant:

- percentage change and index interpretation (§1.1.2);
- graph/table reading, graph construction, interpolation, and data-based claim
  evaluation (§1.1.3);
- willingness to pay, demand, demand factors, substitutes/complements, and
  collective demand (§1.2.1–§1.2.3);
- supply, equilibrium, surplus/shortage at a price, and shifted equilibrium
  (§1.3.1–§1.3.3); and
- mixed source selection and short economic conclusions from the Book 1
  consolidation paragraphs.

The boundary file overrides any tempting inference from exposure. Book 1
cost/revenue/profit encounters, consumer-surplus intuition, normal/inferior
terms, and step-function representations are familiarity/preview where stated;
they are not mastered Book 2 prerequisites. Book 2 must formally teach the
corresponding reviewed target operations.

## Lesson planning audit

- The Book 2 lesson root exists but has no root outline or foundation plan.
- Chapter 2.1's plan is an inventory-oriented production note. It does not
  define the full role of each paragraph, cross-chapter prerequisites,
  operation balance, retrieval/interleaving, or exit readiness.
- Chapter 2.2's plan is more mature and records a coherent student route and
  consolidation intent, but it is not a Book-level authority.
- A Chapter 2.3 lesson directory/plan is absent.

The lesson evidence confirms the missing layer but remains read-only. The
canonical derived outline belongs in the platform repository.

## Content-quality holds that derivation must preserve

| Hold | Evidence and consequence |
|---|---|
| `H-211-GATE0B1` | §2.1.1 goal design, target design, and specialist review are permitted, but goal approval, target authority, paragraph/lesson production, and merge remain blocked until the outline and exact Gate 0B-1 package satisfy their release conditions. The outline states the role but does not approve a paragraph target. |
| `H-212-STALE-REF` | The §2.1.2 target says "bakery from §1.3.2" although the current Book 2 sequence points to §2.1.1. Repair requires a separate target-authority change. |
| `H-213-DELTAQ` | The §2.1.3 target samples Q in intervals larger than one while discussing MK/MO per extra unit. Paragraph approval must explicitly preserve `ΔTK/ΔQ` and `ΔTO/ΔQ`, not raw row differences. |
| `H-213-OPC2` | V6's `OP-C2` output-choice label is broader than the current v5/target operation chain. Do not add formal output choice without an authority decision. |
| `H-221-PRIOR` | §2.2.1's registry `prior_knowledge_assumed` is empty although its target calculates percentage changes and interprets demand. The outline derives explicit retrieval from Book 1 but does not mutate the registry. |
| `H-22-ELASTIC-CONTRAST` | The numerical cinema and petrol cases used across §2.2.1–§2.2.2 both produce `|Ev|<1`. Approved teaching/practice must include at least one explicit `|Ev|>1` contrast so both sides of the stated classification/revenue rule are learned; this does not mutate the target. |
| `H-231-V5` | §2.3.1 is migrated and still needs v5 target review. Book 1 consumer-surplus familiarity cannot close this gate. |
| `H-232-V5` | §2.3.2 is migrated and still needs v5 target review, including the supply-as-MC bridge and bounded welfare claim. |
| `H-233-V5-REF` | §2.3.3 is migrated, cites "§2.2.2" where the current welfare sequence indicates §2.3.2, and uses an unqualified any-price deadweight-loss claim. Review must pin binding/transaction assumptions and the intended source paragraph. |
| `H-234-PLACEHOLDER` | §2.3.4 is a one-question placeholder and is not production-ready. |
| `H-LESSON-ROOT` | No Book 2 root outline and no Chapter 2.3 lesson plan exist. This platform sprint must not write them. |

## Derived outline rules

The audit authorizes the outline to:

- make explicit prerequisite and dependency relations already implied by the
  compatible sources;
- define paragraph roles and qualitative operation balance;
- distinguish prior teaching, retrieval, interleaving, new formal teaching,
  and preview;
- state conventions and misconception boundaries; and
- assign readiness verdicts and holds.

It does not authorize the outline to:

- alter a target record, blueprint, or protected reference;
- treat a source status as proof that a later-discovered defect does not exist;
- promote preview to mastery;
- add `MO = MK` output choice as a §2.1.3 target;
- approve Issue #223's provisional paragraph design; or
- claim lesson implementation or student readiness.

## Audit decision

Proceed with the derived Book 2 outline and machine companion. Keep owner
approval pending, enforce source freshness and holds mechanically, and require
future paragraph plans to pin an approved outline version/hash before Gate
0B-1 or later paragraph production begins.
