# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Diff Summary

Generated: 2026-08-27

## Platform changes

- Ports the reviewed one-capture Y1 renewal evidence onto Platform `main`
  without importing PR #208 product commits.
- Separates historical source provenance
  (`e2deb65... -> 8f612ac... -> 4b49d82... -> aa06ada...`) from current
  lineage (`9c9d3cc7... -> a86c617e... -> H`).
- Uses exact initial and post-payload path inventories with no wildcard prefix.
- Enforces exact authority-key inventories across renewal, wave, proof, packet,
  and result records.
- Cross-binds the terminal result to the source/current evidence tuple, proof,
  packet, exactly one changed dependency, zero unresolved inputs, and the
  first-viewport-only limitation.
- Rejects duplicate or extra source-manifest artifacts before per-item checks.

## Lesson changes

None. Lesson `f09fd6e88edc5049b026b16b0158e7e188091d2d` is read-only evidence.

## Rendered comparison

The historical and replacement 1280×900 light-mode captures are byte-identical
at SHA-256 `5a269248...`; decoded RGBA comparison reports 0 changed pixels out
of 1,152,000. The diff PNG SHA-256 is `b0e8d470...` and is entirely zero-delta.
The claim is limited to the first viewport and excludes below-fold attestation.

## Protected surfaces

No lesson, textbook, Book 1 tooling, product, engine, source-data, protected
reference, workflow, package, roadmap, root-map, or historical Scale Proof
artifact is changed. PR #208 and PR #215 are untouched and remain unmerged.
