# Books 3/4 v3 — final independent technical review

Date: 17 September 2026. Reviewer: `v3_integration_review`.

**Result: PASS. No unresolved substantive correctness finding remains within the reviewed implementation scope.**

This review applies to these exact committed heads, verified before and after the review:

| Repository | Reviewed commit |
|---|---|
| `meijer1973/4veco-platform` | `1b9af608b61445e63633ce9ef3eaba79babd15cf` |
| `meijer1973/4veco-lessen` | `ed43f3aeafe0fc8bb497902cfc9b23fac8f88a4b` |

The lesson worktree was clean. The platform worktree had only the disclosed generated navigation changes to `archive/index.json` and `archive/index.md`; no implementation edits were pending. Those navigation tails are outside the committed-head identity above. The comparison bases are platform `67374a9808d226f1be7e8fa73eb104312c075267` and lessons `a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07`.

## Scope and findings

The earlier implementation review is recorded in `independent-review.md`. Its findings concerning mixed v6 revision metadata, unversioned RAG export, lost retrieval source context and pending-review status, frozen snapshot byte comparisons, and incorrect test data were corrected. An earlier committed-head review covered platform `daa8e891cbc30fc914542eb84c5a18fed415bff3` with lesson `78d4000303755e27f87243a17b0a4b40d4e14f07`. This report now supersedes that head identity after re-reviewing the bounded correction prompted by the trusted-main archive generator.

- **Outline links and identities:** the technical projection replaces only package-relative target-record hyperlinks with the canonical lesson-repository package paths. The parser reverses that exact transformation and requires the immutable original hash, then checks the exact forward projection. The original package bytes and input hashes remain preserved; generated metadata records the current outline hash separately. All 31 target links identify the intended v3 package records.
- **Archive history and trusted-main compatibility:** `historical-paths.js`, its tests, and both legacy relocation registries are restored exactly to their base versions; independent Git comparisons confirmed no diff. The attempted expansion of the legacy relocation schema is absent from these reviewed heads. New v2 snapshot copies remain present with exact byte comparisons, and the dedicated `archive/blueprints/book34-pre-v3-20260917/snapshot-manifest.json` records each source repository, original path, exact source commit and raw SHA256. The migration reproduces the unchanged legacy relocation registries and independently owns the new version-qualified snapshot provenance. This preserves the trusted reader's original uniqueness guard and introduces no redirect or general archive exception.
- **Tracked package verification:** the former per-file `git show` comparison is replaced by one NUL-delimited `git ls-files --stage` inventory and local Git blob hashing. The check requires the exact 814 allowed entries, mode `100644`, stage `0`, and a Git blob SHA1 matching each file's current bytes. The independently passing manifest check separately verifies every payload's supplied SHA256. This removes repeated process launches while preserving byte validation and adding explicit mode/stage checks.
- **Pedagogical boundaries:** the current checker uses the v3 revision while retaining the frozen 148/152 maturity model and the 149/153 current arithmetic projection. The existing `current_year_1_structure_revision` metadata is v3. This change does not confer a new maturity approval or final target approval.
- **Target-validator tests:** the reusable reviewed-mixed-target format check is now tested independently from migration preservation. A synthetic positive-format Book 1/2 record still fails the full migration validator with `Book 1/2 records changed`. This resolves the old fixture conflict without relaxing the preservation requirement.
- **Lane classification:** only the exact v3 blueprint review packet is added as review evidence. The adjacent unknown-source negative remains, so this creates no blanket report-directory allowance.
- **Delivered books and v2 preservation:** the bounded import verifier passed with tracked-byte verification for the complete package. Git comparisons showed no changes to protected Book 1/2 lesson trees, prior Book 3/4 `edities/chat-2026` trees, the earlier v2 blueprint snapshot directory, Book 2 outline sources, or the original v2 migration script. The new source consumer and normal query path preserve candidate status and the full context, tables, figures and source provenance.

No repository file was edited by the reviewer.

## Independent verification at the reviewed heads

| Check | Result |
|---|---|
| Three affected Jest suites after the final archive/index-check correction | **44 tests passed; 3 suites passed**, 4.295 seconds |
| `node build-scripts/maintenance/check-books34-v3-import.js --require-tracked` | **PASS**, `tracked_verified: true`, zero failures |
| Legacy historical reader/tests and both relocation registries compared with their bases | **No diff** |
| Pending navigation diff hygiene | **PASS** |
| Exact platform/lesson head and worktree checks | **Match**; only the two disclosed platform archive indexes are pending |

The three suites rerun at the final reviewed heads were `build-scripts/lib/historical-paths.test.js`, `build-scripts/references/books34-v3.test.js`, and `build-scripts/references/books34-selected-structure.test.js`. At the preceding reviewed heads, six suites had independently passed 112 tests, including pedagogical boundaries, target-format/preservation and lane classification; the v5 validator, pedagogical-boundary CLI and committed diff hygiene also passed there. Those unchanged implementation areas were not redundantly rerun for this bounded correction. The new tracked import check passed again at the exact final pair with zero failures and `tracked_verified: true`.

## Limits and remaining evidence

This is technical integration review, not independent target-quality review, classroom-time certification, companion acceptance, publication approval, or merge authorization. The five lesson-time questions, deferred cao/vakbonden placement with time allocation, and independent review of the 31 candidates remain open as recorded in the supplied package and repository review packet.

The implementation agent owns the final full-suite result, native PDF rebuild and comparison evidence, remote required CI, and the trusted-main compatibility run against the exact candidate pair. Those results are not inferred from this review. In particular, a paired-tree PASS does not establish that either repository may be merged first; the supported order must come from the new compatibility evidence. No merge is authorized by this report.
