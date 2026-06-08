# INSPECT-0 Current-State Audit

Status: setup audit only
Date: 2026-06-08
Roadmap: `docs/roadmaps/inspection-standards-roadmap.md`
Branch: `codex/quality-standards-20260608`
Platform worktree: `C:/wt/QS-20260608/4veco-platform`
Lessen evidence worktree: `C:/wt/QS-20260608/4veco-lessen`

## Scope

This audit records the repository state for the inspection-standards setup
project. It does not authorise Phase 1 implementation, schemas, validators,
country overlays, generated lesson-output changes, or compliance claims.

## Required Reading Checked

The setup audit checked the required governance and product-baseline files:

- `4veco-platform/RESEARCH_AGENT_MAP.md`
- `4veco-lessen/RESEARCH_AGENT_MAP.md`
- `4veco-platform/AGENTS.md`
- `4veco-platform/CLAUDE.md`
- `4veco-lessen/specifications/product-vision.md`
- `4veco-lessen/specifications/product-end-state.md`
- `4veco-platform/references/SOURCE_OF_TRUTH.md`
- `4veco-platform/references/reference-team-roadmap.md`
- `4veco-platform/docs/roadmaps/roadmap-version-index.json`
- `4veco-lessen/lessen-team-roadmap.md`

## Worktree State

Platform:

```text
path: C:/wt/QS-20260608/4veco-platform
branch: codex/quality-standards-20260608
status before edits: clean
worktree lock: claimed for task QS-20260608 by codex
```

Lessen:

```text
path: C:/wt/QS-20260608/4veco-lessen
branch: codex/quality-standards-20260608
status before edits: clean
role: read-only evidence target for this setup phase
```

The lessen worktree already existed as the coordinated sibling checkout for
this task. It was not created for generated-output mutation, and it remains
read-only evidence unless a later sprint plan explicitly authorises platform-led
lesson-output changes.

## Conflict Check

No existing target path was present before setup:

```text
docs/roadmaps/inspection-standards-roadmap.md: absent
references/data/inspection-standards/: absent
archive/sprints/INSPECT-0/: absent
```

The live references roadmap did not contain an overlapping
inspection-standards compatibility track. Existing active work continues to
block broad product-route adoption, generated lesson-output scaling,
diagnostics, mastery/sequencing, PV, Scale Gate 1, and product-wide use until
later reviewed gates.

## Source Of Truth Notes

- `4veco-platform` owns references, roadmaps, validators, reports, and
  generators.
- `4veco-lessen` is generated student-facing output and is read-only evidence
  for this setup phase.
- `references/data/` is the right future location for governed
  inspection-evidence overlays.
- `references/machine/` and `references/external/` remain protected from
  hand edits.
- Reports are diagnostic projections, not primary evidence.

## Product Baseline Notes

The project must preserve the strategic and operational product baselines:

- `../4veco-lessen/specifications/product-vision.md` defines strategic product
  direction.
- `../4veco-lessen/specifications/product-end-state.md` defines the operational
  student route and completeness standard.
- 4veco remains exercise-first and exam-grounded. Inspection prose may define
  evidence categories, but it must not create economics content by itself.

## Outputs Added

The setup phase adds:

```text
docs/roadmaps/inspection-standards-roadmap.md
references/data/inspection-standards/README.md
archive/sprints/INSPECT-0/INSPECT-0-current-state-audit.md
```

## Not Done In This Setup Phase

This setup phase intentionally does not add:

- authority source register JSON;
- Dutch evidence-profile JSON;
- international common-quality profile;
- country/region overlays;
- inspection-evidence schema;
- validators;
- inspection reports;
- generated lesson-output changes;
- compliance or approval claims.

## Recommended Next Action

After this setup is reviewed, the first real sprint should be:

```text
INSPECT-0 Source Register + Dutch Profile Design
```

That sprint should stay research/data-only: source register plus Dutch
evidence-profile draft, no validators yet, and no generated lesson changes.
