# Issue #229 owner-review corrections

Date: 2026-09-05
Reviewed base: b614577f19c6e8a95c9981256aa125e56d26cd79 (PR #230).

Quality floor: preserve the approved twelve-record package byte for byte;
prove that internally consistent forged hashes, unapproved post-release drift,
and incomplete semantic-decision evidence cannot grant target authority.

The owner approved package
914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310 and
the three-way Ei rule with unlabeled zero/one boundaries. Integration, lessons,
Phase B, and merge remain unauthorized. Record the supplied review verbatim
as immutable Git evidence, and bind the semantic decision to that evidence.

## Procedure and requirement matrix

1. Independently review this correction plan before implementation.
2. Derive expected record hashes from the immutable approved package; verify
   ordered package identity, live registry, every release/binding, and actual
   ancestor integration commits before any terminal result. Preserve alignment
   validation in terminal mode. Test internally consistent forged hashes.
3. Restore released-pin protection. An exact active successor for the same
   paragraph may explain temporary drift; wrong-scope, unbound, or inactive
   successors may not. Test positive and negative successor transitions.
4. Record the owner's explicit Ei decision enum, PR/head, identity/date, source
   evidence hash, and new semantic-outline hash; update both stale outline
   statements. Preserve the old approval as history and require validated
   supersession evidence for the new semantics.
5. Keep approved content bytes frozen, including record_status. Define final
   authority through an explicit verified package approval plus integration
   evidence, not candidate_review_ready alone. Historical reviewed_final records
   retain their existing contract.
6. Run sprint-scope checks on PR #230 and durable checks in CI. Record the prior
   successful run 33917295567 against b614577f, then publish fresh test, lead,
   CI, and PR Readiness Reviewer evidence for the corrected branch.

Outputs: correction code/mutation tests, owner decision and verbatim evidence,
outline/meta updates, resolution log, renewed independent verification/lead
review, refreshed sprint and review packets, generated navigation, draft PR.
No student output is generated. Existing content-quality reviews remain valid
only while candidate bytes remain unchanged; classroom timing stays Phase B.

Validation: focused currentness/remediation suites, sprint and durable checks,
protected Bundle 4, full platform suite, source/semantic hashes, review packet,
remote CI, and live PR readiness. Log commands in the existing sprint log.

Stop conditions: candidate bytes change, unresolved P1 mutation, inability to
prove source approval or integration ancestry, lesson changes, or a requested
action beyond the owner's explicit authorization. Independent verification and
structural lead review judge enforcement/evidence; owner content review already
judges the frozen student-facing package.
