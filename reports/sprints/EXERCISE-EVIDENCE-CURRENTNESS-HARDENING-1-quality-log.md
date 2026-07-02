# Sprint EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1: Quality Log

Generated: 2026-07-01

## Quality Standard

This sprint is validation and evidence-governance hardening only. Quality is
met when future agents and CI can distinguish current split exercise surfaces
from historical pre-split evidence without changing product behavior.

## Core Requirement Checklist

| Requirement | Evidence | Status |
|---|---|---|
| Currentness checker is durable, not sprint-local only. | `package.json`, `.github/workflows/platform-ci.yml`, `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js` | met |
| Current surfaces are registry-driven. | `references/data/exercise-surface-manifest.json` | met |
| Path categories avoid false positives. | `build-scripts/lib/exercise-currentness.js` and classifier assertions in `check-exercise-workflow-checker-cleanup.js` | met |
| Superseded stale checkers fail closed. | `guardHistoricalChecker` in `build-scripts/lib/exercise-currentness.js`; guarded stale checker entry points | met |
| Historical metadata cannot masquerade as current evidence. | Updated `references/data/sprints/*.json` records with `evidence_status`, `active_for_ci`, and `active_for_agent_routing` fields | met |
| Roadmap wording does not revive old path assumptions. | `references/reference-team-roadmap.md` currentness annotations | met |
| Forbidden surfaces remain untouched. | `git diff --check`, `git -C ../4veco-lessen diff --check`, currentness checker status guards | met |

## Quality Improvement Candidates

| Candidate | Disposition |
|---|---|
| Exemplar authority canonicalization for duplicate `1.1.3-exit-ticket` evidence. | Deferred to `EXEMPLAR-AUTHORITY-113-CANONICALIZATION-1`. |
| Golden fixture deduplication. | Deferred to `GOLDEN-FIXTURE-DEDUP-HYGIENE-1`. |
| Knowledge ZIP disposition cleanup. | Deferred to `KNOWLEDGE-ARTIFACT-DISPOSITION-CLEANUP-1`. |

## Review Notes

The implementation lead reviewer returned PASS. No material corrections were
required. The final PR still routes to human review because the sprint changes
governance/CI behavior, even though it does not change product runtime or
lesson output.

Remote CI repair: after the initial draft PR run failed because the new
currentness checker ran after CI steps that dirty the lesson checkout with
generated presentation proof files, the workflow order was corrected so the
checker runs while the sibling lesson checkout is still clean.
