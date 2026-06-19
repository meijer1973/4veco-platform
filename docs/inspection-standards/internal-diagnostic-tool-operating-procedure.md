# Internal Diagnostic Tool Operating Procedure

Status: updated for INSPECT-11E/F human review
Date: 2026-06-19
Applies to: manual internal diagnostic generator for Chapter 1.2 and Chapter 1.3

## Product End-State And Original Spec

- Product end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original roadmap spec: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- Generator implementation spec: `archive/sprints/INSPECT-10B/INSPECT-10B-sprint-plan.md`
- Stability-hardening spec: `archive/sprints/INSPECT-10C/INSPECT-10C-sprint-plan.md`
- Operating-procedure spec: `archive/sprints/INSPECT-10D/INSPECT-10D-sprint-plan.md`
- Chapter 1.3 readiness gate:
  `archive/sprints/INSPECT-11D/INSPECT-11D-authorisation-note.md`
- Chapter 1.3 onboarding spec:
  `archive/sprints/INSPECT-11EF/INSPECT-11EF-sprint-plan.md`

## Non-Negotiable Requirements

- The tool is internal-only.
- The tool is manual-only.
- The tool is diagnostic-only.
- The tool applies only to explicit scope descriptors for Chapter 1.2 and
  Chapter 1.3.
- Chapter 1.3 may read only its descriptor's exact source allowlist, including
  exact read-only lesson Markdown proof paths. Directory globbing, implicit
  discovery, generated lesson-output scanning, and lesson mutation remain
  forbidden.
- Generated diagnostic output is not student-facing, teacher/school-facing,
  public, external, pack-strength, product-use, compliance, approval, or
  inspection-readiness proof.
- Running the tool does not close Chapter 1.2 generated-output,
  accessibility/support, or check-surface blockers.
- Running the tool does not authorise package/CI, dashboard, quality-ref,
  Scale Gate, product-route, diagnostics/mastery/PV, student-use, or
  product-use work.
- Running the tool must not mutate protected references, source registries, or
  generated lesson output.
- Any broader use requires a new human-reviewed sprint packet before work
  starts.
- PASS WITH FLAGS may not carry a missing core requirement.

## Core Requirement Checklist

| Requirement | Status | Evidence |
|---|---|---|
| Product end-state cited | met | Product End-State And Original Spec |
| Original sprint/gate specs cited | met | Product End-State And Original Spec |
| Non-negotiables named | met | Non-Negotiable Requirements |
| Allowed invocation defined | met | Allowed Invocation |
| Preconditions defined | met | Preconditions Before Running |
| Post-run checks defined | met | Required Post-Run Checks |
| Changed-output semantics defined | met | Meaning Of Changed Output |
| Stop conditions defined | met | Stop Conditions |
| Carried blockers classified | met | Finding Classification |
| Chapter 1.2 regression protected | met | Stability checker semantic hash |
| Chapter 1.3 source/output allowlists explicit | met | Scope descriptors and stability checker |

## Allowed Invocation

Agents may invoke the manual diagnostic generator only when all of these are
true:

1. The work is part of a human-reviewed or human-requested sprint whose scope
   explicitly includes one of the manual internal diagnostic report scopes:
   `chapter-1-2`, `chapter-1-3`, or `all`.
2. The branch is a dedicated `codex/` or `agent/` task branch, not `main`.
3. The platform worktree safety check passes for the current task.
4. The requested action is internal diagnostic review, freshness checking,
   stability checking, or blocker visibility checking.
5. The action does not request a stronger audience, integration, or authority
   than the controlling sprint granted.

Allowed commands:

```powershell
node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope chapter-1-2
node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope chapter-1-3
node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
```

Running the generator without `--check` is allowed only inside a sprint that
explicitly authorises refreshing the named diagnostic report pair and lists the
generated Markdown/JSON files as allowed output paths.

## Preconditions Before Running

Before invoking the tool, the agent must verify:

- `git fetch --prune origin` has run for the platform repo.
- The branch is not behind `origin/main`, or the sprint records why a stale
  local dry run is acceptable.
- `npm.cmd run check:agent-worktree-safety -- --check --task <task-id> --agent <agent-id> --require-prefix codex/,agent/` passes.
- The request stays inside internal diagnostic scope.
- No evidence-pack, teacher/school-facing, public/external, package/CI,
  dashboard, quality-ref, Scale Gate, product-route, diagnostics/mastery/PV,
  student/product-use, personal-data, protected-reference, source-registry, or
  generated lesson-output work is being requested.
- The sprint plan names allowed source paths and output paths if report files
  may be refreshed.
- The known Chapter 1.2 and Chapter 1.3 blockers remain in scope as blockers,
  not as resolved issues.
- The diagnostic source and report files that are compared byte-for-byte must
  be checked out with stable LF bytes according to `.gitattributes`; if a
  local Windows worktree expands them differently, run the normalization
  sequence below before trusting `--check` output.

## LF Normalization Recovery

Use this sequence when the generator reports stale output but the only changed
source is line-ending metadata for the diagnostic source/report pair:

```powershell
git config core.autocrlf false
git restore --worktree -- `
  .gitattributes `
  docs/roadmaps/quality-standards/quality-standards-end-state.md `
  reports/inspection-standards/chapter-1-2-diagnostic-report.json `
  reports/inspection-standards/chapter-1-2-diagnostic-report.md
git ls-files --eol `
  docs/roadmaps/quality-standards/quality-standards-end-state.md `
  reports/inspection-standards/chapter-1-2-diagnostic-report.json `
  reports/inspection-standards/chapter-1-2-diagnostic-report.md
node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
```

Expected `git ls-files --eol` result for the three diagnostic files is
`i/lf w/lf`. If the checker still reports stale output after that sequence,
treat the change as semantic or source-state drift and inspect the report diff
before continuing.

## Required Post-Run Checks

After a diagnostic report check or authorised report refresh, run and record:

```powershell
node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
git diff --check
```

For PR-bound work, also run:

```powershell
npm.cmd run check:platform
```

If lesson-output non-mutation is part of the sprint proof, record a read-only
lesson checkout status check. INSPECT-10D uses the canonical lesson checkout:

```powershell
git -C C:\Projects\4veco\4veco-lessen status --short
```

## Meaning Of Changed Output

Changed diagnostic output is a review signal only. It can mean a source file,
blocker ledger, report contract, or generator behavior changed and needs
review. It does not mean:

- a blocker is closed;
- evidence is pack-strength;
- a teacher/school-facing artifact is approved;
- public or external sharing is approved;
- a product route may adopt the output;
- diagnostics, mastery, PV, student-use, or product-use authority exists;
- Scale Gate or quality-ref integration is unlocked.

Changed output must be inspected as a diff and classified. If the diff changes
semantic status, blocker visibility, audience, authority, source eligibility,
or stop/refusal behavior, the sprint must run the specialist gate before human
review.

## Stop Conditions

Stop and require a new human-reviewed sprint before continuing if any request
asks for:

- evidence-pack generation;
- teacher/school-facing output;
- public or external output or sharing;
- package script, CI/build gate, dashboard gate, quality-ref integration, or
  Scale Gate integration;
- product-route adoption;
- diagnostics/mastery/PV authority;
- student-use or product-use authority;
- generated lesson-output mutation;
- protected-reference or source-registry mutation;
- personal-data processing;
- compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, or
  school-SKA claims;
- hiding or softening the `1.2.2`, `1.2.4`, Chapter 1.3 route-local-only,
  school-owned evidence, accessibility/support, full-Book assembly,
  check-surface authority, or downstream-product blockers.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Manual internal diagnostic generator exists and has a stability checker. | `core_requirement_met` | Treating unchecked or stale output as current | Internal diagnostic freshness and stability checks | Generator `--check`, stability checker, and diff review |
| Operating procedure limits invocation and interpretation. | `core_requirement_met` | Informal tool use that creates implied authority | Human review of INSPECT-10D | Validation, lead review, specialist gate, fresh PR CI |
| Byte-stable diagnostic source/report checkout is required. | `core_requirement_met` | Treating line-ending drift as semantic diagnostic change, or treating stale metadata as valid | Internal diagnostic freshness checks | `.gitattributes`, generator `--check`, stability checker, and diff review |
| Generated output remains internal diagnostic only. | `core_requirement_met` | Evidence-pack, teacher/school-facing, public/external, product-use, compliance, or approval claims | Internal review by agents and maintainers | New human-reviewed sprint for any stronger audience or claim |
| Chapter 1.2 generated-output blockers remain open. | `scale_blocker` | Pack-strength Chapter 1.2 closure and teacher/school-facing reliance | Internal diagnostic reporting with blockers visible | Scoped remediation or reviewed waiver/carry decision |
| Accessibility/support evidence remains below pack-strength. | `scale_blocker` | Accessibility-strength and support-strength claims | Internal diagnostic reporting with gaps visible | Reviewed mobile/responsive, contrast/theme, semantic/PDF, support/advisory, hints/repair, and product/school-boundary proof |
| Check-surface authority remains outside this tool. | `scale_blocker` | Scale Gate 1, product-route adoption, diagnostics/mastery/PV, and student/product-use work | Ordinary scoped internal diagnostic checks | Renewed human review confirming check-surface gate closure and naming authority unlocked |
| Chapter 1.2 semantic report contract remains protected. | `core_requirement_met` | Silent semantic drift in the existing Chapter 1.2 report | Deterministic metadata repair and Chapter 1.3 onboarding | Stability checker semantic hash and diff review |
| Chapter 1.3 internal diagnostic report exists with blockers visible. | `core_requirement_met` | Treating route-local evidence as school-owned, teacher/school-facing, public, product-route, or Scale Gate authority | Manual internal diagnostic reporting | Later authorised sprint with school-owned evidence and renewed human review |
| Chapter 1.3 full Book 1 assembly health remains separate. | `scope_boundary_flag` | Book 1 clean-health claims | Scoped Chapter 1.3 diagnostic report when Chapter 1.3 validators pass | Separate `BOOK1-ASSEMBLY-HEALTH-1` repair route |

## Review Boundary

Human review of INSPECT-11E/F may accept, revise, or reject this operating
procedure update and the Chapter 1.3 internal diagnostic onboarding work. It
may not, by accepting the procedure, authorise any broader output surface,
integration, route adoption, or downstream product authority.
