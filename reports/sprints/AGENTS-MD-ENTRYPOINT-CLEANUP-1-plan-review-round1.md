# AGENTS-MD-ENTRYPOINT-CLEANUP-1 Plan Review Round 1

Reviewer: lead-review subagent

Verdict: REQUEST_CHANGES

Required changes:

- Replace the prose-only human packet with the canonical bundle authorization
  marker and JSON using `decision: "APPROVE_BUNDLE_AND_MERGE"`.
- Make paired PR metadata explicit in the PR workflow: `cross_repo_bundle`,
  shared `bundle_id`, exact PRs, exact payload SHAs, complete `paired_prs`, and
  delegated lesson proof.
- Add a final active-surface sweep for `CLAUDE.md`, `.claude/commands`,
  `C:\Projects`, and `/tmp/claude-work`, with historical archive/report
  exclusions documented.
- Clarify that `CLAUDE.md` and `.claude/commands` default to deletion. A
  tombstone or remnant requires a concrete tooling dependency, must be
  non-authoritative, must be excluded from maps/indexes, and must be protected
  by the wording checker.
- Handle prior draft pair `4veco-platform#151` and `4veco-lessen#37` explicitly
  so two AGENTS-entrypoint bundles do not compete for review.
