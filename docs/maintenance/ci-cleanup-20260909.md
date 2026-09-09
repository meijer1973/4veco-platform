# CI cleanup mode — 9 September 2026

The owner authorized this maintenance effort and the temporary replacements
below in the task requesting lighter CI and policies, including activation of
the exception itself. This is the single authorization for the bounded cleanup
and its ordinary PR integrations. Review point: **16 September 2026**.
Rollback baseline: `c8e88cf4a510378e1941011be9e321cf2c4741bf`.

## Scope and operating exception

This exception overrides the conflicting maintenance requirements in `AGENTS.md`,
`docs/review/pr-integration-lane-policy.md`,
`docs/review/pr-readiness-routing-policy.md`,
`docs/review/pr-throughput-policy.md`, and the lead/readiness agent procedures.
It covers CI configuration, CI/review tooling and tests, maintenance documentation,
and removal of redundant integration/index/evidence work. It includes this PR.

Use: **finish change → focused checks → one relevant independent review → merge
→ brief completion report**. Mechanical follow-up edits need no separately
staffed review. Recheck substantive findings when needed, without prescribed
rounds, separate readiness assessments or repeated authorization packets.

Keep dedicated branches/worktrees, inspectable PRs, relevant passing checks,
no unresolved substantive findings, and a final exact-head check. Integrate one
PR at a time with `gh pr merge --merge --match-head-commit <reviewed-head>`.
Admin bypass, force pushes and direct pushes to main remain prohibited.
The custom prepare/dry-run/integrate lane is suspended for this effort.

Keep the required `validate-platform` status and existing branch protection.
Maintenance CI runs syntax/configuration checks and affected tests. Presentation
tool installation, builds, historical product proofs and the complete suite are
not maintenance prerequisites. Index freshness and generated navigation refreshes
are advisory; do not create index-only integration commits. A three-state bundle
matrix is unnecessary for independent maintenance/documentation changes; test
the actual affected combination when runtime dependencies cross repositories.

Workflow and data inputs select their existing consumer tests explicitly.
Deleted JavaScript falls back to the complete Jest suite, excluding the two
historical suites named below, because Jest cannot recover missing import edges.
This correctness fallback does not install or run presentation proof tools.

The Y1 workflow-preservation contract and its associated historical governance
tests are explicitly suspended for this intentional workflow change. Do not
claim they passed. Historical files/certificates remain unchanged. The product
route retains source/capture integrity, current lesson inputs, route checks and
rendering validation; the temporary product-evidence adapter reports the wiring
exception separately. Deployment and protected-reference changes are outside
this authorization and retain their applicable requirements.

After merge, verify parents/tree and run a useful smoke check. Full post-merge
CI is not a completion gate. Run broader validation once at the stable cleanup
milestone before replacing this exception with the permanent lightweight process.

## Execution and acceptance

1. Activate the bounded maintenance selector and this exception in a small PR.
   Unknown/product paths select the product checks; never report skipped heavy
   checks as executed. Preserve `validate-platform` and explicit CI summaries.
2. Measure actual Actions timings, then remove duplicated work and the largest
   irrelevant costs. Prefer deletion or direct execution over new process layers.
3. Establish the permanent workflow, run the broader validation, and remove the
   temporary exception. Record actual timings and any remaining limitations.

Quality floor: maintenance changes get useful tests and an independent code/CI
review; product changes retain applicable content and rendering validation.
Target required maintenance CI: **2–5 minutes**, measured on GitHub Actions.
Tests must cover misclassification, mixed/product changes, malformed ranges,
configuration errors and failures propagating to the required status.

Stop for unexpected commit movement, changed protection, unresolved substantive
findings, or work expanding into deployment/protected references. The owner has
accepted later discovery of unrelated regressions during this bounded cleanup.
The review date is a review point, not an implicit permanent policy extension.

Broader pedagogical/skill redesign and protected-reference modernization remain
separate. Model capability is not proof that a particular check is unnecessary;
remove checks based on repository relevance, duplication and measured cost.
