# BUNDLE-INDEX-REFRESH-1 Result

Status: CI startup hardening locally complete; exact-commit review pending

## Result

The lesson-first authorized bundle lane now refreshes committed platform and
lesson GitHub agent indexes after the lesson merge and before platform PR CI.
The refresh runs trusted platform-main tooling in isolated exact-SHA clones,
permits only the four canonical index files, verifies deterministic output,
creates or reuses one canonical index-only descendant, pushes without force,
refetches, and proves payload lineage.

Compatibility remains bound to the immutable platform and lesson payloads. A
separate integration-refresh proof binds the post-lesson-merge platform head,
refresh parent, exact lesson merge commit, generated hashes and metadata,
lineage, readiness attestation, and exact-head CI. The integration lane fails
closed on stale refs, unexpected paths, nondeterminism, publication failure,
lineage failure, wrong CI coordinates, or final pre-merge drift.

PR Readiness now requires a platform controller to carry exactly one paired
lesson member and one paired lesson lead review. Their payload identities must
match the compatibility-tested lesson candidate in runtime classification,
standalone decision validation, and structural schema validation. Delegated
lesson rendering identifies the lesson as the current member.

After human review returned `HOLD_REVISE`, the trusted refresh helper was added
to every applicable canonical repository-map representation and to the
generated URL index. The focused refresh regression now reads those real map
sections and fails when the helper is missing from an entry point, anchor,
governance path, task route, GitHub entry guide, URL-index source, or generated
URL index. `RESEARCH_AGENT_MAP_REFERENCES.md` remains unchanged because its
declared scope is the reference corpus rather than PR-governance execution.

Exact-head GitHub Actions attempts 1-3 then exposed an unrelated CI startup
race: the presentation browser was allowed only eight seconds to expose its
DevTools endpoint, and browser output was discarded. The exact local HTML QA
passed. The launcher now waits up to 30 seconds, races endpoint polling against
spawn error and early exit, settles once with listener/timer cleanup, and emits
bounded browser-path, spawn, exit, endpoint, and stderr diagnostics. Rendering
and interaction assertions are unchanged.

## Validation

- Full platform suite: 99 suites passed; 1,325 tests passed; 8 skipped.
- Focused router: 139 passed.
- Authorized bundle integration: 44 passed.
- Compatibility: 12 passed.
- Workflow contract: 6 passed.
- Trusted refresh and canonical navigation suite: 21 passed, including 14
  independent omission or misplacement regressions.
- Browser-startup regression suite: 4 passed (delayed success, bounded timeout,
  early exit, and spawn error).
- Exact local presentation-v2 HTML QA: passed with all screenshot and
  interaction checks.
- Readiness application: 5 passed.
- PR Readiness aggregate: 169 passed.
- Integration-lane aggregate: 145 passed.
- Active governance wording, branch protection, URL-index freshness, and
  `git diff --check`: passed.
- Agent-index freshness: intentionally pending until the reviewed evidence
  commit and final generated-index-only tail are created.
- Rawls implementation review Round 8: `OK`.

## Authority Boundary

This repair does not authorize or merge platform PR #198 or lesson PR #44.
Those bundle PRs remain draft/held until this repair lands on platform `main`,
their controller branch is resynchronized, exact compatibility and readiness
evidence are rebuilt, and the owner reviews the renewed payload coordinates.

## Next Action

Bind the CI-hardening substantive commit to a new Rawls review record,
regenerate the agent indexes from the evidence commit, and rerun exact-head CI,
PR-level Rawls review, and PR Readiness before presenting PR #209 for renewed
human review without merging it.
