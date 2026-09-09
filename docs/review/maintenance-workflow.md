# Routine maintenance: checks, review and merge

Active from 9 September 2026, under the owner-authorized CI cleanup.
This is the normal route for code/tooling and documentation maintenance that
does not change protected references, product authority or student-facing output.
It replaces the temporary cleanup exception.

**Finish the change → relevant checks → one independent review when meaningful
→ authorized merge → brief completion report.**

Use a dedicated task branch and owned worktree. Keep the PR diff inspectable.
Check affected behavior and syntax/configuration. Meaningful code or CI changes
get one independent review; fix substantive findings and recheck those findings.
Mechanical corrections do not need another reviewer. Do not run separate
planning, prescribed review rounds, readiness decisions or packet generators
for routine maintenance. Mark the PR ready when the work is ready.

When the task or owner policy authorizes integration, check the live PR head,
required status and unresolved findings, then merge one PR at a time:

```powershell
gh pr merge <number> --merge --match-head-commit <reviewed-head-sha>
```

Keep `validate-platform` required and existing branch protection. Never use
admin bypass, direct pushes to main, or force pushes. CI success is evidence,
not owner authority. This cleanup effort already has owner integration authority.
Conflicts that change behavior need relevant validation and review of the repair;
an unchanged tree does not need a fresh review/authorization packet.

Generated navigation indexes are advisory. Fix broken links when paths change;
refresh useful indexes with the owning generator, but do not manufacture
integration commits just to update commit IDs. Use the reviewed PR and Actions
run as the evidence record; do not recopy it through readiness and dry-run packets.
Independent repository changes need no compatibility matrix. Runtime-coupled
changes need a check of the actual affected repository combination.

## CI profiles

The unconditional `validate-platform` job reports the exact commits and profile:

| Trigger/scope | Checks |
|---|---|
| Allowlisted CI/review tooling and maintenance/instruction docs in a PR | Syntax, JSON/YAML parsing, diff hygiene, affected Jest tests and core CI tests. Workflow/data inputs select their consumer tests explicitly. Markdown selects existing entry/navigation checks; the exact Part A instruction allowance also selects content-contract, PDF-readiness and paragraph/chapter review-validator tests. Deleted JavaScript falls back to the current complete Jest suite because missing import edges cannot be recovered reliably. |
| Product, mixed or unknown PR paths; manual `profile=full` | Current complete Jest suite with two workers, content/source validators, presentation builds and rendering proofs, and current reuse of historical Y1 evidence. |
| Merge push to main | Syntax/configuration and core CI smoke tests. Product validation from the reviewed PR is not repeated. |

The maintenance allowlist lives in `build-scripts/ci/maintenance-ci.js`.
It is deliberately conservative: unrelated code outside it still gets product
validation. Changing dependencies, deployment scripts or unknown paths cannot
silently select the maintenance route. Manual full validation uses exact base
and head inputs. Run it once at a stable cleanup/release milestone or for a
specific unresolved concern, not after every merge of an already validated tree.

Only artifacts produced by the current CI run are uploaded. Jest timing results
are included in full runs so future optimization can use measured cost.
`npm test` and `npm run check:platform` use the same current-suite configuration
as CI in `jest.config.cjs`; pass a test path for a focused local run.
Maintenance target: 2–5 minutes; the activation candidate passed in 1m45s.

## Historical evidence and product boundaries

The Y1 capture, certificate, sealed verifiers and historical artifacts remain
unchanged. The product adapter rebuilds the certificate against its recorded
source (including that source's workflow and lockfile), checks bound files and
runtime bytes, then checks current lesson ancestry, rendering inputs and routes.
It reports that historical first-viewport evidence does not attest the current
workflow or new captures. Live workflow behavior is tested by the current CI
tests. The two sealed `check-y1-golden-rollout-wave-1*.test.js` suites belong to
the archived workflow and are excluded from the current suite; inspect/run them
in a separate worktree at the certificate's recorded source when auditing that
historical contract. This is a separation of provenance from current behavior,
not a permanent suspension of product-integrity checks.

Student-facing material retains its applicable content, rendering and human
review. Deployment and protected-reference/product-authority changes retain
their existing authorization and specialist gates. For those scopes, consult
the applicable lane and the protected/bundle procedures in the legacy review
policies. Their custom readiness/integration tooling remains available there;
it is not a prerequisite for routine maintenance. Model capability alone is
not a reason to remove a check; use relevance, duplication and measured cost.
