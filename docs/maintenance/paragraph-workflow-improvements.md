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
