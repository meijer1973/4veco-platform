# Books 3/4 v3: review follow-up

This is the remotely accessible continuation of the local integration handoff
for [platform #252](https://github.com/meijer1973/4veco-platform/pull/252) and
[lessons #54](https://github.com/meijer1973/4veco-lessen/pull/54). It addresses
the owner's review dated 17 September 2026. It supersedes the initial merge-order
discussion, while retaining the original receipt and PDF evidence.

## P2: existing skill and exam searches

`targetChunks()` now preserves the existing `required_skills` and `exam_codes`
in both search entities and explicit exported metadata. The ordinary query
result retains that metadata. The regenerated index still has 55 individual
target chunks with complete v3 context and figure data.

The ordinary CLI regression test finds both 1.1.1 and 1.1.4 using each of A43,
B01 and B02, and finds 1.2.1 and 1.2.4 using their existing D1.1 exam mapping.
It compares all exported mappings with the untouched registry and confirms
that no canonical codes were invented for the 31 v3 candidates.

## P1: explicit availability before lesson activation

The [finite transition contract](../../docs/review/books34-v3-platform-first-transition.md)
records each state's active curriculum, exact source provider, blueprint hashes
and validation. Platform now has all 814 immutable received files at
`references/staged/books34-v3/`, in addition to the canonical lesson delivery.
This is a deliberate transport copy; lessons retains content ownership.

V3 authority and normal target retrieval use the same complete platform source
in both proposed states. The first state accepts only the exact old lesson
projection and pinned baseline; the final state requires the full new lesson
delivery and matching projection. Corrupt or partial lesson activation cannot
silently fall back to transport. Original v2 data and checks remain protected.
Source metadata names the actual provider, and outline record links work before
the lesson PR is applied.

Local focused verification passes for the existing lesson baseline and the
complete lesson candidate. Negative tests cover partial imports, changed or
missing manifests, altered sources/figures, additional files, unknown blueprint
identities, mode/stage changes and path escapes. Final independent review and
the new exact-head CI/matrix results are linked in the PR descriptions; they
are not inferred from local success. No merge order is approved by this report.

## Preserved evidence and remaining decisions

All original 814 lesson delivery bytes are unchanged, and the transport copy is
checked against the same pinned manifest. Books 1–2 and v2 history remain
unchanged. No student, exercise, answer or PDF content was revised.

The [initial report](BOOK34-V3-INTEGRATION-20260917-result.md) and its QA files
retain the native Windows evidence: all 490 pages have equal extracted text and
page counts; 326 pages differ in raster and four were visually sampled. This
does not establish visual equivalence of all pages. The supplied PDFs remain
unchanged, so no replacement rendering is being proposed.

Font names/versions alone do not identify font bytes. The QA evidence records
the actual Windows font hashes and environment. Future pixel-identical
reproduction needs the exact reference font bytes and native renderer stack;
the differing Lato Regular hashes alone do not explain every raster difference.

All 31 independent content reviews, timing questions 3.1.2, 3.1.3, 3.1.5,
4.2.4 and 4.2.5, and later cao/vakbonden placement with lesson time remain open.
Companion acceptance and publication remain separate. Both PRs are delivered
for review; this follow-up has no merge or publication authority.
