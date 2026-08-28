# Y1 Golden Evidence Prerequisite Lead Review — Round 1

Reviewed: 2026-08-27

Reviewer: `/root/residual_bridge_lead_review`

Reviewed Platform commit:
`8dcbb36726a3861c31928b5f500f5f75a2ebd9ac`

Base: `9c9d3cc7fa8e72d536e03af192f53f7079823dbe`

## Verdict

**REVISE**

The provenance, selector, one-dependency computation, imported bytes, pixel
comparison, and first-viewport visual qualification are sound. Four
fail-closed gaps block freezing the reviewed payload.

## Blocking findings

1. `Y1-PREREQ-R1-PATHS`: the executable initial and post-payload path policies
   are broader than the plan's complete allowlist. Inherited workflow, package,
   roadmap, root-map, old-plan, and wildcard sprint paths can be accepted.
   Replace both policies with exact inventories and add negative regressions.
2. `Y1-PREREQ-R1-AUTHORITY`: wave/proof/packet authority validation does not
   require exact artifact-specific key sets and omits the protected-reference
   hold. Require exact keys and false values, including negative missing,
   added, renamed, substituted, and true-key tests across all authority records.
3. `Y1-PREREQ-R1-RESULT`: the terminal result is allowed in the evidence tail
   but is not parsed or bound. Cross-bind it to source provenance, the current
   base/payload/lesson tuple, proof, packet, one renewed dependency, zero
   unresolved inputs, the first-viewport limitation, and exact authority holds.
4. `Y1-PREREQ-R1-MANIFEST`: duplicate source-manifest IDs can hide an
   unvalidated extra artifact because the set comparison deduplicates and the
   validator checks only the first match. Require exact length and unique IDs
   before validating every record.

## Positive evidence retained

- All ten source/destination Git blobs and SHA-256 values were independently
  verified, including exact/adapted dispositions.
- Historical ancestry is
  `e2deb65... -> 8f612ac... -> 4b49d82... -> aa06ada...`.
- The selector preserves 1280×900, DPR 1, light mode, first viewport, and hidden
  scrollbars.
- The recomputed delta contains exactly §1.1.2 `opgaven.html`, one verified
  renewal, and zero unresolved inputs.
- Historical and replacement PNGs are byte-identical at SHA-256
  `5a2692481110d68e2d23992373c3b06f0a198518265dba754a4f022125ea515f`;
  the RGBA delta is 0 of 1,152,000 pixels.
- The visual verdict is PASS for the first viewport only and does not attest
  below-fold exercises.

No lesson or student-visible product file changed. This review does not
authorize merge or closure.
