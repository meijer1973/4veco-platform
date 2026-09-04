# Finished Artifact Verification: BOOK2-TARGET-AUTHORITY-REMEDIATION-1

Generated: 2026-09-04

Round: independent finished-artifact/test-plan verification round 1

Mode: separate read-only Codex verifier; no files edited

## Exact review identity

- Candidate package SHA-256:
  `32f5325a542445eb093b0e645304afae7542b2c92e491c8bd09ace9fefa71441`
- Candidate-file SHA-256:
  `62b4305df2f6d55367055fcc547c305e9a432ee7bfdedf61049f18e56837a202`
- Platform baseline: `e5f89e730d65c4131d7dd09f805f0db94690e8e6`
- Lesson head: `f09fd6e88edc5049b026b16b0158e7e188091d2d`

## Verdict

`BLOCK`

The candidate content and existing focused checks passed, but the verifier
found three test/governance gaps and one evidence-routing requirement that had
to be corrected before publication.

## Blocking findings

1. A synthetic complete approval binding could make
   `target_authority_integration` pass while `candidate_status` remained only
   `specialist_reviewed_candidate`. The lifecycle checker must require
   `lead_reviewed_candidate`, with negative mutation proof.
2. The semantic checker did not reject §2.1.3 when the point-bearing table-work
   prompts were replaced by mere “Bekijk tabel…” instructions while the work
   remained present only in sources and answers.
3. The semantic checker did not reject §2.3.4 when all source content became
   `Bron volgt.` and the table rows were emptied.
4. Before lifecycle promotion to `lead_reviewed_candidate`, every
   `candidate_evidence_ref` must point to the exact Issue #229 review packet,
   not only to candidate storage.

## Passing evidence

- The remediation checker, approval-block harness, v5 registry checker,
  structural currentness, reference CLI coverage, active sprint bundle, and
  `git diff --check` passed.
- The focused remediation/currentness Jest selection passed 111 tests.
- Only A17 changed among machine units; the Ei three-way classification and
  explicit Ei=0/Ei=1 boundaries were correct.
- The lesson repository was clean at the pinned head.

## Required correction and recheck

Add lifecycle status/evidence guards and isolated negative tests; add explicit
point-bearing prompt checks for §2.1.3 table actions; add concrete mixed-source
shape and placeholder checks; then rerun this independent verification. The
candidate package must remain byte-identical unless affected specialist review
is renewed.
