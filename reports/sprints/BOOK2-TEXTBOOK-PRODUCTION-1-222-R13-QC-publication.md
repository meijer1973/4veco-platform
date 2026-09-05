# §222 R13 specialist QC publication

2026-09-05. Actual actor paragraph_221_r8_independent_review, independent
specialist role. Current assessment **PASS WITH FLAGS**, no required correction.
Both branches: agent/book2-222-r13-qc-20260905.
Own pair: C:/wt/book2-222-r13-qc-20260905/{4veco-platform,4veco-lessen}.

## Exact substantive commits and bindings

| Repository | Assigned published baseline | Substantive QC commit |
|---|---|---|
| Platform |0436a9fe8d8da3bd385add8ecd195d2c05ed2f10|85509f2025181e94a6535165f124aded02053769|
| Lessons |8cad0b8e99371f33692793f533782654776f6b68|575371ca49051a9889825e53d0322508a9d73bfa|

Platform payload contains47 uniquely prefixed QC/evidence paths. Lesson
payload changes only222-quality-ref.yaml by appending schema_version2 and
lane-owned partA. The complete old byte prefix and all11 legacy keys/values
are preserved; there was no existing companion block to change. Canonical
paragraph review, all pupil source/output/assets and other51Pass0 bindings
remain exact. Root production_ready_with_flags stays false; handoff is absent.

| Bound evidence | SHA-256 |
|---|---|
| QC-report.md |3360264597075311ce9081b1dcb0c852e28bcff243cc2207a0112998e4b72687|
| exact-probes.json |05f3f111f6e5095dc1e3ca4499cfe956b38395e9ed8cb3e933f11967213ab316|
| personal-inspection.md |f489c4de9a7b6e0cd15fdaab7c7a608a95ed112e5fab8c9e056bc187768874aa|
| complete-route-check.json |e128a9c5c4921533141b830da050cc4d42b2a30583fc42ad5bdd18832283784e|
| current222-quality-ref.yaml |c7c42721dc7c352b65aaaa43be08641edc6723e63cc511820cf880403a558e5e|
| unchanged222-review.md |9122a962d5108565a631d6cd51b1945ab0ddb1ef78c2b979cca15ac59010f01a|
| committed-scope.json |2100cb62512782fd091766df197944201a28b390e6816863de4348c9421775bd|

Evidence JSON/notes are under the sibling QC-evidence directory. Canonical
QC binds report, personal observations and diagnostic hashes directly.
Both actual PartA profiles and both currentness actions/durable authority
were rerun after the canonical addition and passed, recorded in commands.jsonl.
The standalone canonical-preservation probe passed after that addition.

## Actual committed scope, not assumed scope

After both payload commits, the unchanged checker passed:

- Shared whole-candidate platform ca05ec784838617f7a11c0b33d0b53e1a2fb7f29
  →85509f2025181e94a6535165f124aded02053769.
- Textbook whole-candidate lessons6362d2596b20c3e28184d8b6a1a74cb6c901d7f0
  →575371ca49051a9889825e53d0322508a9d73bfa, with explicit lesson --cwd.
- Strict own delta against the assigned published pair contains only the
 47QC/evidence paths and the one canonical222-quality-ref.yaml addition.

The broad candidate contains genuine pre-existing implementation changes,
including other paragraph lineage. That broad PASS is not mislabeled as a
standalone evidence-only shared-lane implementation PASS. No fake anchor,
exception, source patch or reviewer policy change was used. The exact actual
heads/categories/path lists and commands remain in committed-scope.json/log.
This publication/scope-log persistence commit follows the payload; deterministic
index-only tail follows separately and is not part of the reviewed pupil payload.

## Paired maps and final handoff boundary

Index regeneration uses explicit FOURVECO_LESSEN_ROOT pointing to this owned
pair, FOURVECO_LESSEN_SOURCE_REF=HEAD and
FOURVECO_LESSEN_SOURCE_BRANCH=agent/book2-222-r13-qc-20260905. Its resolved
lesson source SHA must be575371ca49051a9889825e53d0322508a9d73bfa. Final published
scope/index SHAs are returned directly after fresh remote/clean-owner checks;
this document does not invent a self-referential final commit.

Root may adopt these new payload/evidence commits, refresh its own maps and
bind accepted prerequisite successors before deciding handoff/production
acceptance. Historical targets/plans/holds/pins/reviews remain immutable. The
completed §213 REVISE pair is untouched. Classroom51.5/66.5/79.5-minute workload
and attainment remain unobserved; no PDF-UA, PartB, whole-book, remote CI,
owner-readiness, PR or merge grant is supplied by this review/publication.
