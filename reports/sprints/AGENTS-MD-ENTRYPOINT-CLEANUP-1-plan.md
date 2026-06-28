# AGENTS-MD-ENTRYPOINT-CLEANUP-1 Plan

Status: draft for lead review

## Objective

Make `AGENTS.md` the single canonical starting point for every coding or
research agent across the platform and lesson repositories. Retire `CLAUDE.md`
and `.claude/commands` as active policy or skill surfaces, remove stale
Claude-specific entrypoint references, and align integration-lane wording with
the current payload-lineage workflow.

This is governance/self-modification work. It is an L4 cross-repository bundle
with `4veco-platform` as controller and `4veco-lessen` as generated-output
member.

## Baseline Findings

Current `origin/main` still contains these active contradictions:

- `4veco-platform/AGENTS.md` and `4veco-lessen/AGENTS.md` tell agents to read
  `../CLAUDE.md` before normal work.
- `4veco-platform/CLAUDE.md` remains an active top-level instruction file.
- `4veco-platform/.claude/commands` remains tracked and is indexed as a skill
  surface.
- `RESEARCH_AGENT_MAP.md`, `RESEARCH_AGENT_PROMPT.md`, generated GitHub
  indexes, and the URL index still expose `CLAUDE.md` or `.claude/commands` as
  active surfaces.
- Some active docs still use machine-local `C:\Projects\...` links where
  repo-relative links are sufficient.
- `skills/manage-references.md` and `skills/econ-pptx-templates.md` cite
  `CLAUDE.md`; `reports/qc/README.md` cites `.claude/commands`.
- `skills/reasoning-game-prompt-template.md` is referenced by map metadata as
  if it has a `pipeline:` claim, but the file needs verification and either the
  metadata or the skill should be corrected.
- `check-active-governance-wording` still treats `CLAUDE.md`,
  `.claude/commands`, and lesson `CLAUDE.md` as active roots instead of
  guarding against their return as active governance surfaces.
- `AGENTS.md` and `docs/review/pr-integration-lane-policy.md` still describe
  `.github/workflows/authorized-pr-integration.yml` as the only direct lane
  when operational, while recent practice showed the workflow can fail with
  branch-protection API `403` and the owner-authenticated local
  `npm.cmd run integrate:authorized-pr` path is the valid fallback. The policy
  must preserve payload-lineage authorization and forbid raw `gh pr merge`.

Existing draft PRs `4veco-platform#151` and `4veco-lessen#37` are useful prior
art, but platform #151 is currently conflicting with `main` and predates later
integration-lane repairs. This sprint will use fresh branches from current
`origin/main` unless lead review specifically directs reviving the old draft
pair.

## Quality Floor

The work is acceptable only if:

1. An agent starting in either repository is directed to `AGENTS.md` as the
   canonical entrypoint and is not told to read `CLAUDE.md`.
2. No active map, prompt, generated index, workflow policy, or skill metadata
   presents `CLAUDE.md` or `.claude/commands` as an operating-rule source.
3. The old Claude-specific command mirror is removed by default. A tombstone or
   compatibility remnant is allowed only for a concrete tooling dependency, and
   then it must be non-authoritative, excluded from maps/indexes, and protected
   by the wording checker.
4. Machine-local documentation links are replaced with repo-relative links
   where the target is in the repository.
5. Governance wording checks fail if future active guidance reintroduces
   `CLAUDE.md` as an agent entrypoint or `.claude/commands` as an active skill
   mirror.
6. Integration-lane wording reflects the current rule: owner authorization
   binds to reviewed payload lineage, not every later integration head; marking
   ready needs no owner approval; merges use the authorized integration lane or
   its owner-authenticated local fallback, not raw `gh pr merge`.
7. Generated maps and indexes match the real repository layout after deletions
   or path changes.
8. The platform and lesson sides are presented as one paired bundle with exact
   member PR metadata and delegated lesson proof.

## Scope

### Platform files expected in scope

- `AGENTS.md`
- `CLAUDE.md`
- `.claude/commands/**`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_PROMPT.md`
- `AGENT_GITHUB_ENTRY.md` if generated map refresh changes it
- `build-scripts/README.md`
- `docs/review/pr-integration-lane-policy.md`
- `build-scripts/review-gates/check-active-governance-wording.js`
- `build-scripts/review-gates/check-active-governance-wording.test.js`
- `build-scripts/reports/github-agent-index.js`
- `build-scripts/reports/dead-units.js`
- `build-scripts/reports/unresolved-refs.js`
- `build-scripts/sprints/emit-url-index.js`
- `build-scripts/sprints/check-pptx-skill-mirror.js` if the command mirror is
  removed
- `skills/manage-references.md`
- `skills/qc-references.md`
- `skills/econ-pptx-templates.md`
- `skills/reasoning-game-prompt-template.md`
- generated `reports/github-agent-index-*.{md,json}`
- generated `reports/url-index.md`
- this sprint plan, command log, correction log, and result records

### Lesson files expected in scope

- `AGENTS.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_PROMPT.md`
- `lessen-team-roadmap.md` only if its active future-work row still names
  `CLAUDE.md` as a target

Archived reports may continue to mention historical `CLAUDE.md` reads. They
must not be included in active wording checks or regenerated public entrypoint
indexes as current instructions.

## Implementation Procedure

1. **Finalize plan review**
   - Run lead-review subagent on this plan.
   - Address every blocking or material suggestion in this plan.
   - Re-run lead review until the plan receives `PASS` or explicit `OK`.

2. **Entrypoint cleanup**
   - Move the current non-negotiable operating rules into `AGENTS.md` if any
     are present only in `CLAUDE.md`.
   - Remove the `../CLAUDE.md` read-first bullets from platform and lesson
     `AGENTS.md`.
   - Delete `4veco-platform/CLAUDE.md` unless a concrete tooling dependency
     requires a short non-authoritative tombstone. If a tombstone remains, it
     may only point to `AGENTS.md`, must not contain separate rules, must be
     excluded from maps/indexes, and must be guarded by the wording checker.
   - Remove tracked `.claude/commands` mirrors by default. If any compatibility
     remnant remains, document the exact dependency and ensure it is
     non-authoritative and unindexed.

3. **Map and prompt cleanup**
   - Update `RESEARCH_AGENT_MAP.md` and `RESEARCH_AGENT_PROMPT.md` in both
     repositories so external agents start from `AGENTS.md`.
   - Remove raw GitHub URLs for `CLAUDE.md` and `.claude/commands`.
   - Preserve the practical note that some web-fetch environments need literal
     URLs, but make it agent-neutral rather than Claude-specific.

4. **Skill and docs cleanup**
   - Replace skill references to `CLAUDE.md` with `AGENTS.md` or a more
     specific active file.
   - Replace `.claude/commands` mirror references with `skills/`.
   - Replace local `C:\Projects\...` links in active docs with repo-relative
     links when the targets are local repository files.
   - Verify and correct the `pipeline:` metadata claim for
     `skills/reasoning-game-prompt-template.md`.

5. **Governance checker hardening**
   - Remove `CLAUDE.md`, lesson `CLAUDE.md`, and `.claude/commands` from active
     roots.
   - Add forbidden patterns for active `CLAUDE.md` read-first instructions,
     `CLAUDE.md` as operating rules, and `.claude/commands` as active skill
     mirrors.
   - Add tests proving allowed historical archive mentions are ignored and
     active surfaces fail closed.

6. **Integration-lane wording alignment**
   - Update `AGENTS.md` and `docs/review/pr-integration-lane-policy.md` so the
     authoritative merge instruction is:
     - do not use raw `gh pr merge`;
     - prefer the trusted workflow when it can verify branch protection;
     - use `npm.cmd run integrate:authorized-pr` as the owner-authenticated
       local fallback when the workflow token cannot read branch protection;
     - keep payload-lineage authorization inheritance and exact integration
       head validation.

7. **Generated index refresh**
   - Run the repository index and URL index generators after the source edits.
   - Ensure generated indexes no longer publish `CLAUDE.md` or
     `.claude/commands` as active entrypoints.

8. **Final active-surface sweep**
   - Run an explicit active-surface `rg` sweep over platform and lesson active
     guidance for `CLAUDE.md`, `.claude/commands`, `C:\Projects`, and
     `/tmp/claude-work`.
   - Document that historical archive/report mentions are excluded from this
     active sweep unless they are linked from current operating rules.
   - Treat any remaining active mention as either a defect to repair or a
     lead-review-explicit exception with rationale.

9. **Prior draft-pair handling**
   - Before opening the new pair, decide whether this work supersedes draft PRs
     `4veco-platform#151` and `4veco-lessen#37` or revives them.
   - If using the fresh pair, the new PR bodies must explicitly say they
     supersede #151/#37 because #151 is conflicting and predates later
     integration-lane repairs.
   - Do not leave two competing AGENTS-entrypoint bundles both presented as
     current review candidates.

10. **Implementation review loop**
   - Run focused validation.
   - Ask lead-review subagent to review the implementation.
   - Address suggestions and re-run until `PASS` or explicit `OK`.

11. **PR workflow**
   - Commit and push platform and lesson branches.
   - Open draft paired PRs with `bundle_id:
     AGENTS-MD-ENTRYPOINT-CLEANUP-1`.
   - Require both PR bodies/evidence to carry `pr_throughput_class:
     cross_repo_bundle`, the same `bundle_id`, complete `paired_prs`, exact PR
     numbers, exact reviewed payload SHAs, and delegated lesson proof.
   - The lesson PR must identify the platform PR as controller and consume
     delegated controller bundle proof rather than requiring standalone
     platform branch-protection evidence on the lesson commit.
   - Run platform CI and cross-repo bundle compatibility if both repos change.
   - Run the independent lead review required by the PR workflow; repair and
     re-run until `PASS`.
   - Run PR Readiness Reviewer and apply `MARK_READY` if returned. Do not ask
     owner permission merely to mark ready.
   - Present the non-draft PR bundle for human review with exact payload heads,
     CI, checker proof, lead-review proof, readiness comment, bundle proof, and
     final validation summary.

## Validation Plan

Focused checks:

- `npm.cmd run check:agent-worktree-safety -- --check --task AGENTS-MD-ENTRYPOINT-CLEANUP-1 --agent codex --require-prefix codex/,agent/`
- `npm.cmd run check:active-governance-wording`
- `npx.cmd jest build-scripts/review-gates/check-active-governance-wording.test.js --runInBand`
- `npm.cmd run check:integration-lane`
- `npm.cmd run check:pr-readiness`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run agent:index`
- `npm.cmd run finalization:freshness`
- `git diff --check` in both repositories
- active-surface sweeps, with archive/report exclusions documented:
  - platform:
    `rg -n "CLAUDE\\.md|\\.claude/commands|C:\\\\Projects|/tmp/claude-work" AGENTS.md RESEARCH_AGENT_MAP.md RESEARCH_AGENT_PROMPT.md AGENT_GITHUB_ENTRY.md build-scripts docs skills reports/url-index.md reports/github-agent-index-platform.md reports/github-agent-index-platform.json reports/github-agent-index-lessen.md reports/github-agent-index-lessen.json package.json .github/workflows`
  - lesson:
    `rg -n "CLAUDE\\.md|\\.claude/commands|C:\\\\Projects|/tmp/claude-work" AGENTS.md RESEARCH_AGENT_MAP.md RESEARCH_AGENT_PROMPT.md AGENT_GITHUB_ENTRY.md lessen-team-roadmap.md`

Remote checks after PR publication:

- platform `platform-ci / validate-platform` on the platform PR head
- lesson PR state open, mergeable, and matching paired metadata
- cross-repo bundle compatibility matrix when both PRs exist
- PR Readiness Reviewer route expected: `READY_FOR_HUMAN_REVIEW` with
  `MARK_READY`, because this is L4 governance and cross-repo agent instruction
  work

## Stop Conditions

Stop and return for direction if:

- moving rules out of `CLAUDE.md` reveals policy content that is absent from
  `AGENTS.md` and cannot be safely folded in without changing behavior;
- deleting `.claude/commands` breaks non-governance production tooling in a way
  that requires a larger skill architecture decision;
- generated indexes still include deleted/retired Claude surfaces after source
  generator changes;
- the integration-lane wording requires a new secret, service identity,
  branch-protection change, or workflow redesign;
- PR #151/#37 must be revived instead of superseded and branch ownership makes
  that unsafe without owner direction.

## Expected Human Review Packet

The final packet must use the canonical bundle authorization shape. Prose-only
approval is invalid for bundle integration.

Marker:

```text
<!-- 4veco-human-bundle-authorization:AGENTS-MD-ENTRYPOINT-CLEANUP-1 -->
```

JSON body:

```json
{
  "schema_version": 1,
  "decision": "APPROVE_BUNDLE_AND_MERGE",
  "bundle_id": "AGENTS-MD-ENTRYPOINT-CLEANUP-1",
  "controller": {
    "repository": "meijer1973/4veco-platform",
    "pr_number": 0,
    "reviewed_payload_head_sha": "<platform-sha>"
  },
  "members": [
    {
      "repository": "meijer1973/4veco-lessen",
      "pr_number": 0,
      "reviewed_payload_head_sha": "<lesson-sha>"
    }
  ],
  "decision_scope": "AGENTS.md canonical entrypoint, Claude-specific policy surface retirement, active governance wording checks, generated agent indexes, and integration-lane fallback wording.",
  "merge_order": "CI_SELECTED",
  "invalidation_conditions": [
    "member_payload_not_ancestor",
    "substantive_member_change",
    "bundle_membership_change",
    "effective_governance_change",
    "no_green_intermediate_order"
  ]
}
```

Human-readable packet summary:

```text
HUMAN_DECISION: APPROVE_BUNDLE_AND_MERGE
BUNDLE_ID: AGENTS-MD-ENTRYPOINT-CLEANUP-1
CONTROLLER: meijer1973/4veco-platform#<platform-pr>
MEMBER: meijer1973/4veco-lessen#<lesson-pr>
REVIEWED_PAYLOAD_HEADS:
  platform: <sha>
  lesson: <sha>
DECISION_SCOPE: AGENTS.md canonical entrypoint, Claude-specific policy surface retirement, active governance wording checks, generated agent indexes, and integration-lane fallback wording.
MERGE_METHOD: merge commit
ADMIN_BYPASS: prohibited
```
