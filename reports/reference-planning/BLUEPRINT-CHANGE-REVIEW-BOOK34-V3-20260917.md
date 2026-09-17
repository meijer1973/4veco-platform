# Books 3/4 v3 bounded change review

Task: `BOOK34-V3-INTEGRATION-20260917`. Status: integration prepared/in PR.
The owner requested execution of the repaired integration package on 17 September 2026. Its handoff authorizes the listed curriculum migration and paired PRs, and explicitly excludes merge, deployment and publication. This record makes no independent target approval or classroom timing claim.

The received ZIP SHA256 is `5ef27d7537f36a4c6ddac9126dff1ed034593bb52ae375acaaab49f09c0bcb55`. The inner immutable manifest SHA256 is `516d07d2d33326fd4d12cecc0a3b4a60693ff4b43a6a671dab508a72390db315`. The inner manifest's `received_zip_sha256` describes an earlier input to the repair; it is not the hash of this delivered repaired ZIP. All 813 listed files plus the manifest are preserved at lesson `edities/books34-v3/`.

## Adopted change

Curriculum revision: `book34-lesson-balance-v3-20260915`. Technical delivery: `book34-v3-r1-r5-20260916`.

| Surface | v3 disposition |
|---|---|
| Book 3 | 14 paragraphs in 6+4+4; separate limited derivative 3.2.2 and feasible short-run profit choice 3.2.3. |
| Long-run competition | Old v2 3.2.3 moves to new 4.1.1; no Book 3 test requirement. |
| Book 4 | 17 paragraphs in 5+7+5; chapter 4.1 becomes Van concurrentie naar monopolie. |
| Labour | Old v2 4.3.5 cao/vakbonden/agreement-policy evaluation deferred; new 4.3.5 is independent mixed practice, formerly 4.3.6. |
| Targets | 31 exact supplied filled candidates; no placeholder or final-status substitution, no invented machine skill/exam codes. |
| Page caps | Book 3 50/40/40; Book 4 50/60/50. Delivered chapter counts 48/34/38 and 48/60/44. |
| Other books | Books 1–2 unchanged; no Book 1 second-edition publication. Later years and frozen 148/152 counts unchanged, current arithmetic projection 149/153 retained. |

The canonical v3 outlines and [version-qualified migration](../../references/authored/book-outlines/paragraph-migration-v2-to-v3.csv) are the placement source. Numeric ID equality is never target equivalence or inherited approval. The delivered manuscripts, source figures and answer books are preserved without content revision.

## Reproduction and historical identity

Migration: `node build-scripts/references/migrate-books34-v3.js --inputs <received-package> --apply`. Inputs are pinned to platform base `67374a9808d226f1be7e8fa73eb104312c075267` and lessons base `a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07`. The actual prior outlines, adoption metadata, registry and blueprints are snapshotted with original Git bytes, commits and hashes in `archive/blueprints/book34-pre-v3-20260917/` and its snapshot manifest. Existing archive entries and v2 deliveries are preserved.

The original v2 migration remains unchanged. Its checker uses the isolated v2 structure module and is run at historical paired roots, not as v3 approval. The current checker requires exact v3 payloads, canonical v5 anchors, package sources and asset hashes. It accepts no broad `edities/` or archive exception. Book 2's immutable source pins are served by a finite three-file authority transition; any other source hash combination fails.

Canonical curriculum refs stay in platform; portable source pins resolve against the explicit lesson `source_locator.package_root`. The supplied reproduction scripts remain immutable delivery artifacts. Platform owns the migration, consumer and acceptance tools.

## Current consumer contract

The existing consumer is `build-scripts/rag/build-chunks.js`, then `build-scripts/rag/query.js`. Its old registry-wide 20,000-character truncation is replaced by per-target records. V3 exports consume `context`, `context_html`, subquestions and registered source figures with path/hash validation. Manuscripts are checked against pins but never used to reconstruct missing context. Unabridged `sources` are retained as provenance, not a fallback. The normal query JSON exposes the full source contract; text query exposes complete context/questions and figure locations. Candidate queries explicitly retain pending review and no curriculum authority.

This fixes the repository retrieval/export route; it does not create or approve a companion. Future consumers must preserve the same source contract.

## Remaining decisions

- Independent quality review and final adoption of 31 target exercises.
- Credible selected lesson cores for 3.1.2, 3.1.3, 3.1.5, 4.2.4 and 4.2.5; no classroom timing certificate.
- Later-year cao/vakbonden placement with an explicit time allocation before prerequisite use.
- Companion acceptance, publication and merge authorization remain separate.
- Supported merge order must come from a new trusted-main exact-pair compatibility run; prior v2 proof cannot authorize this v3 pair.
