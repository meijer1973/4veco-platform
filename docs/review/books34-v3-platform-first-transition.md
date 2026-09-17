# Books 3/4 v3: finite platform-first transition

This protocol addresses the technical review of platform #252 and lessons #54.
It changes source availability, not the supplied books, their curriculum
revision, target approval or publication authority. It does not authorize a merge.

## Active edition and source ownership

| State | Active platform curriculum | Complete v3 source provider | Lesson projection |
|---|---|---|---|
| Existing mains, before these PRs | `book34-chat-v2-20260914` | Not adopted | Exact v2 projection and received v2 editions |
| Platform #252 applied first | `book34-lesson-balance-v3-20260915` | Platform immutable transport below | Exact pinned legacy v2 projection, explicitly pending replacement; it is not used as the current v3 blueprint |
| Both candidates applied | `book34-lesson-balance-v3-20260915` | The same platform immutable transport | Exact v3 projection and independently verified lesson delivery |

The authoritative v3 registry, outlines and v5/v6 projections are on platform
in both proposed states. No resolver silently changes curriculum when files go
missing. Paragraph IDs still require an explicit revision; historical v2 lookup
and the original v2 verifier remain available at their recorded historical roots.

The [transport copy](../../references/staged/books34-v3/README.md) contains all
814 received files at `references/staged/books34-v3/`, unchanged. Its normal
target-retrieval role is fixed in both states. This deliberate duplication of
about 68 MiB lets platform have complete, searchable sources before the lesson
PR is applied. It avoids network fetches, missing-source fallbacks, conditional
test skips and testing required platform CI against an unmerged lesson branch.

Lessons remains the content owner. Its canonical received location is
`edities/books34-v3/`. The platform copy is immutable transport, never a second
editable manuscript or build destination. The receipt's embedded handoffs and
historical instructions are preserved data, not new live repository policy.
Any future content revision needs a separate versioned delivery and migration.

The consumer reports the actual platform `source_locator`, including its
`immutable_received_transport` role and lesson content owner. It separately
retains the canonical lesson locator. Stable outline links point to transport
records so they work immediately after the platform-first step. All context,
tables, sources, source pins and 26 source-figure uses remain available.

## Exact contracts

- Delivery: `book34-v3-r1-r5-20260916`; curriculum: `book34-lesson-balance-v3-20260915`.
- Manifest SHA256: `516d07d2d33326fd4d12cecc0a3b4a60693ff4b43a6a671dab508a72390db315`.
- Repaired received ZIP SHA256: `5ef27d7537f36a4c6ddac9126dff1ed034593bb52ae375acaaab49f09c0bcb55`.
- The 813 manifest items plus that unchanged manifest form a closed set of 814.
  Every size and raw hash is checked. Tracked proof also requires Git blob
  equality, regular-file mode `100644` and conflict stage `0`.
- Legacy lesson baseline: `a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07`.
  Its v5 projection has canonical-LF SHA256
  `482c506c93d1d8cd4ba9bd4bc6cf268c73494112c32726f7da176d804d4bda96`.
  The whole tracked lesson state must match that base, apart from the two
  generated archive navigation files. Additional nonignored files fail. A new
  package directory or new v3 snapshot paired with this old blueprint fails as
  a partial transition.
- Final lesson projection has canonical-LF SHA256
  `87df8feff9a99994b9098da4ee19b763da396753078743573401012c9d48f819`.
  It requires its own complete received package, exact migration outputs and
  the existing finite lesson-change allowlist. A missing or corrupt lesson
  file still fails even when its platform transport counterpart is valid.
- In both states, the original Book 3/4 v2 manifests, payload hashes and closed
  file inventories remain checked. Books 1–2, the 24 existing target records,
  original v2 migration, old relocation registries and raw snapshots remain
  protected. The original v2 checker is not weakened or relabelled as v3 proof.
- Unknown blueprint identities, extra edition files, symlink escapes, mixed
  revisions and false target-finality claims remain errors.

## Validation and later integration

`npm run check:books34-structure -- --require-tracked` reports the selected
lesson state, active curriculum and actual source provider. The same test is
used with lesson main and with the lesson candidate. Required platform CI keeps
its normal lesson-main checkout. The trusted-main compatibility matrix must
prove platform-first and the final pair at the actual bases and candidate
heads; lesson-first is not expected to be supported.

After any separately authorized platform-first merge, run the normal
integration route and CI against the actual merged platform state before the
lesson step, then require final CI on the actual merged pair. This document
does not substitute simulated compatibility for those post-merge checks.

No target-quality review, classroom timing certification, companion acceptance,
merge, deployment or publication authority is conferred. The 31 candidates,
five timing questions and later cao/vakbonden placement remain open.
