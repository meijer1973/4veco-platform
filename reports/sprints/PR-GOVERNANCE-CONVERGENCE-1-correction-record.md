# PR-GOVERNANCE-CONVERGENCE-1 Correction Record

## Reviewer Finding 1

`route-and-apply:pr-readiness` was documented as a one-command ready transition
but could run without supplemental checker or lead-review evidence.

Correction: require `--evidence <file>`, add `--expect-transition`, fail when
the expected transition is absent, and cover the real review/classifier plus
fixture application path in tests.

## Reviewer Finding 2

`finalization:freshness` could certify a stale local `origin/main`.

Correction: query remote `refs/heads/main`, compare against local
`origin/main`, fail on mismatch, record ancestry, and hash both branch files and
remote-main blobs.

## Reviewer Finding 3

GitHub-facing maps did not expose the new governance entry points.

Correction: update `AGENT_GITHUB_ENTRY.md`, `RESEARCH_AGENT_MAP.md`, generated
GitHub agent indexes, and URL index where applicable.

## Reviewer Finding 4

The wording checker omitted active instruction roots and did not catch
line-wrapped variants.

Correction: scan `CLAUDE.md`, `skills/`, `.claude/commands/`, the research map,
and sibling lesson active instructions when available. Normalize whitespace for
multi-line matches and add regressions for the observed stale phrases.
