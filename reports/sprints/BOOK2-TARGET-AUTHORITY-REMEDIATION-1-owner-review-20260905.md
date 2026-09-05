## Review verdict

**Request changes on PR #230.** The twelve-record content package is strong; the blockers are in lifecycle enforcement and evidence—not the exercises.

### Findings

1. **P1 — Terminal integration is not cryptographically bound to the approved records.**
   [`durableLifecycleState()`](https://github.com/meijer1973/4veco-platform/blob/b614577f19c6e8a95c9981256aa125e56d26cd79/build-scripts/workflows/check-book2-target-authority-remediation.js#L91-L136) checks the top-level package string, but each released record hash only has to be valid-looking and agree with its own evidence. It is never compared with that record’s hash in package `914d…1310`. The [terminal early return](https://github.com/meijer1973/4veco-platform/blob/b614577f19c6e8a95c9981256aa125e56d26cd79/build-scripts/workflows/check-book2-target-authority-remediation.js#L319-L345) then skips candidate, registry, and alignment verification. I reproduced this by replacing one approved record hash and its evidence with `ffff…ffff`; the lifecycle still returned `retired` with no failures.

2. **P1 — Released target authority can drift afterward.**
   The currentness checker now validates a pin against its approved replacement [only while the hold is open](https://github.com/meijer1973/4veco-platform/blob/b614577f19c6e8a95c9981256aa125e56d26cd79/build-scripts/workflows/check-book-outline-currentness.js#L535-L560). The release path also no longer requires the current pin to match and [accepts `candidate_review_ready`](https://github.com/meijer1973/4veco-platform/blob/b614577f19c6e8a95c9981256aa125e56d26cd79/build-scripts/workflows/check-book-outline-currentness.js#L689-L709). A released target can therefore change without a new successor approval. Any exception should exist only while an exact active successor hold explains the change.

3. **P1 — The Ei hold is not bound to the semantic decision.**
   Its terminal validation requires only a release method, person, date, and nonempty reference. It does not record the chosen rule, reviewed head, or semantic-outline hash. Meanwhile, the [approved outline still describes the hierarchical classification](https://github.com/meijer1973/4veco-platform/blob/b614577f19c6e8a95c9981256aa125e56d26cd79/references/authored/book-outlines/book-2-outline.md#L165-L170). The official 2026 syllabus explicitly names inferior, normal, and luxury goods, but does not itself state the numerical boundaries, so the repository still needs an explicit supersession decision. [CvTE syllabus, D1.8](https://www.examenblad.nl/2026/vwo/documenten/syllabus-economie-vwo-2026).

4. **P2 — Closure evidence is stale and CI omits the sprint-scope guard.**
   The [review packet still says exact-head CI is pending](https://github.com/meijer1973/4veco-platform/blob/b614577f19c6e8a95c9981256aa125e56d26cd79/reports/review-gates/GATE-BOOK2-TARGET-AUTHORITY-REMEDIATION-1/review-packet.json#L159-L176), although [run 33917295567](https://github.com/meijer1973/4veco-platform/actions/runs/33917295567) passed. CI invokes only durable mode; durable mode skips the non-Book-2 and non-A17 diff guards. There is also no recorded PR Readiness Reviewer result.

### Decisions

| Item                           | Decision                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| Exact package `914d1a39…71310` | **APPROVE as target content; freeze these twelve records**                                      |
| Ei semantic supersession       | **APPROVE** the three-way student-facing rule, including unlabeled `Ei=0` and `Ei=1` boundaries |
| PR #230                        | **REQUEST CHANGES** before integration or readiness                                             |
| Phase B, lessons, merge        | **NOT AUTHORIZED**                                                                              |

I independently confirmed the package hash, twelve-record registry equality, arithmetic and economic models, goal/question mappings, sources, scoring, and mixed-target coherence. The timing flag—especially §2.3.3—is appropriately deferred to Phase B. Both repository maps were accessible, the lessons head remains unchanged, and the live PR head matches `b614577…cd79`.

### Coding-agent handoff

1. Keep the twelve candidate records byte-identical so package hash `914d…1310` remains stable.
2. Make terminal validation derive all twelve expected record hashes from the approved package and compare every target binding, release subject, registry record, and integrated commit against them. Recompute the ordered package hash from those records.
3. Remove the terminal early-pass behavior until those comparisons complete. Add a negative test that changes one record hash while keeping its release evidence internally consistent.
4. Restore post-release current-pin protection. Permit temporary drift only when an active, exact successor hold for the same paragraph exists.
5. Bind `H-229-EI-SUPERSESSION` to an explicit decision enum, semantic-outline hash, reviewed PR/head, owner identity/date, and immutable evidence reference. Update the canonical outline to the approved three-way rule.
6. Clarify whether final integration requires `reviewed_final`; do not silently treat `candidate_review_ready` as final authority.
7. Run both sprint-scope and durable checks in CI, refresh the review packet with head `b614…cd79` and run `33917295567`, run `npm run review:pr-readiness`, and keep the PR draft until all P1 tests pass.

No GitHub review or PR state was changed during this review.
