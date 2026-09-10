# Paragraph workflow improvements

Implement the seven recommendations from the cold paragraph assessment in
platform PR #238 (test only), without integrating that PR or lesson PR #47.

Quality floor: preserve source authority, lane ownership, independent review,
rendered-page quality and required product CI. Reduce duplicate transcription
and reading; never turn missing evidence into PASS.

1. Recognize required textbook plans and the narrowly named generated records.
2. Bind an explicit Part A verdict to an exact content inventory; use the same
   check for paragraph and chapter validation. Test changes, deletions, additions,
   missing verdicts, stale evidence, line endings and companion separation.
3. Generate mechanical foundation and quality projections from existing checked
   sources, preserving authored pedagogy and the companion block.
4. Present current action authority beside clearly labelled historical lifecycle
   prose, without modifying approved source semantics or their hash contract.
5. Provide a reusable Pandoc/WeasyPrint paragraph builder with rendering tests
   for UTF-8, lists around tables, bullets, figure placement and pagination.
6. Route ordinary Part A through a compact checklist and conditional references;
   correct the chapter orchestrator introduction.
7. Offer focused paragraph CI with explicit platform and lesson commit identities,
   keeping required platform CI and its lesson-main behavior intact.

Proof: behavioral tests for tooling and validators, foundation checks, navigation
checks, rendered PDF inspection, appropriate complete CI, and one independent
review of the final implementation. Record remaining limitations honestly.
Publish a separate PR for review; do not integrate the experimental paragraphs.

## Implementation evidence

- All seven recommendations implemented in platform tooling/instructions;
  no lesson payload or approved reference semantics changed.
- Initial complete Jest run: 112 suites passed; three failing assertions in
  two fixtures needed migration to the stricter review/entry contracts. Those
  fixtures were repaired, retaining their original behavior checks.
- After independent-review repairs: 226 focused tests passed, one skipped,
  covering paragraph/chapter/book validation, source projection, navigation,
  dependency freshness, YAML preservation and the committed paired CLI.
- Five Python tests build actual PDFs and check UTF-8, lettering around tables,
  bullet preservation, figure pagination, missing assets and unsupported math.
  The one-page and three-page rendered fixtures were visually inspected.
- Approved/action foundation checks and active exercise/navigation contracts
  pass. The final PR's Actions runs provide exact-head CI evidence.

The independent review found and prompted repairs to dependency discovery,
YAML preservation, formula warning handling and paired execution provenance.
The same reviewer rechecks those fixes; there is no new review assignment.

Limits: the foundation projection currently covers registered Book 2 paragraph
actions; other scopes retain their existing source checks. The review inventory
supports static local rendering and rejects unsupported dynamic/external inputs.
Unsupported Pandoc math stops the builder for correction. Quoted top-level
Part A keys or cross-block YAML anchors that cannot be safely preserved are
rejected before writing. No historical review is automatically renewed. The
new manual paired workflow needs default-branch availability before hosted
dispatch; its CLI is tested from an isolated committed repository pair.

## PR #239 amendment

Resolve only the two requested compatibility/input findings. Preserve the
current-review quality floor, source authority and frozen Book 1 bytes. Provide
an explicit export of an existing committed PDF edition, without a rebuild or
retrospective PASS. Validate paired paragraph inputs from private snapshots of
the pinned Git blobs, excluding ignored local overlays while allowing caches.

Proof: a representative legacy paragraph export with exact-byte comparison,
regressions for unchanged/changed historical review and ignored local evidence,
focused validator tests, current-head CI and one independent amendment review.
Do not retrofit the back catalogue or run another paragraph pilot. Keep trial
PRs #238/#47 unmerged; defer graph-skill/caller cleanup and its tiny experiment
until acceptance. Return the amended head for an integration decision.

Amendment checks: 219 focused tests passed, one skipped (13 suites), including
101 entry/navigation, exercise-contract and PDF-readiness tests. The
committed paired-CLI fixture passes with an ignored cache, but fails when its
manifest exists only as an ignored local file; the live-folder check reproduces
the old false PASS. Changed reviewed content still fails the committed check.

At lesson commit `57b31a1f4a3d2aa0da3945abbc5a7a0ee5d05e6a`, the compatibility
command exported all three PDFs for Book 1 paragraph 1.1.1, Schaarste en
economisch denken. Independent `git hash-object --no-filters` comparisons
matched the source blobs: paragraph `a12d05c270e88f43173bb32d0152e2abe0022cf3`,
exercises `6c5111b0adc309d59e0c44fb79ec5806e9e71fa7`, answers
`ddc6be1caae889fb1f772823e129aa039d5cfdec`. The lesson worktree stayed clean.
Its historical PASS WITH FLAGS still fails current-review validation because
it lacks a manifest. A committed fixture also rejects changed content retaining
an old PASS and proves that selecting the historical SHA still exports the
original PDFs. No historical review or source was rewritten.

Compatibility limit: export requires committed PDFs; it does not rebuild missing
artifacts or reassemble chapters/books. Current paragraph/chapter closure now
requires current review evidence. Historical rebuilds require their applicable
historical toolchain. The paired hosted workflow remains unproven with a real
production pair; fixture success is not a production-quality attestation.

The first amended-head CI run exposed a Windows short-path alias bypass in
the new export destination guard (1,914 tests passed, one failed, 10 skipped).
The same failure was reproduced locally using a real 8.3 filesystem alias.
Native realpath canonicalization now expands both source and destination paths
before comparison. The new regression failed before the repair and passed
after it; all 35 repair-focused tests passed. Final-head CI is linked in the PR.
