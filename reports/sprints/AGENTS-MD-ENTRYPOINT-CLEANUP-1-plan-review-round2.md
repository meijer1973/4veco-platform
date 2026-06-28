# AGENTS-MD-ENTRYPOINT-CLEANUP-1 Plan Review Round 2

Reviewer: lead-review subagent

Verdict: PASS

Assessment:

- Canonical bundle marker and JSON are included, and prose-only approval is
  rejected.
- Paired PR metadata requirements are explicit, including `cross_repo_bundle`,
  shared `bundle_id`, exact PRs, exact payload SHAs, and delegated lesson proof.
- Active-surface `rg` sweeps are specified for platform and lesson, with
  archive/report exclusions.
- `CLAUDE.md` and `.claude/commands` now default to deletion, with tight
  tombstone/remnant restrictions.
- Prior #151/#37 handling is explicit, including supersession language and no
  competing active bundles.

Conclusion: The plan is sufficiently scoped and safe to execute.
