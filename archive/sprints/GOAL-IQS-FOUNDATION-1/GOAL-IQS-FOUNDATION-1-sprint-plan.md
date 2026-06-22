# Sprint GOAL-IQS-FOUNDATION-1: International Quality Standards Common Core And Overlay Foundation

Status: implementation plan
Date: 2026-06-21
Sprint: `GOAL-IQS-FOUNDATION-1`

## Goal

Create the first separate international quality-standards foundation after
GOAL-DQS-CLOSURE-1A accepted and merged the Dutch internal/report-only closure
decision `CLOSE_INTERNAL_SYSTEM`.

The sprint must answer whether a shared upper-secondary economics product core
can proceed with explicit jurisdiction overlays for the Netherlands, Flanders,
England, Germany, France, Italy, Spain, Poland, and the United States. It must
return a reviewed foundation decision, not a country edition or external claim.

## Context

### Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Quality standards end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Original sprint/gate spec:
  `archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-authorisation-note.md`
- Governing international roadmap:
  `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
- Dutch closure basis:
  `archive/sprints/GOAL-DQS-CLOSURE-1A/GOAL-DQS-CLOSURE-1A-human-review-packet.md`
- Starting repository state: PR #124 merged on 2026-06-21; branch then
  fast-forwarded to `origin/main` after PR #126 merged.

## Non-Negotiable Requirements

- Use REV-STD-1 in the plan, generated reports, validation log, specialist
  reviews, final lead review, human-review packet, and PR body.
- Cite product end-state and the original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.
- Use official-source anchors for every jurisdiction wherever possible.
- Preserve governance boundaries for Flanders, England, Germany, Spain, and
  the United States.
- Select exactly one final foundation decision from the allowed decision set.
- Keep all forbidden authority flags false and visible.
- Return for human review before any next implementation authority.

## Quality Standard

The quality floor is a deterministic, manually invoked, internal-only
foundation packet that fulfils the specification with official-source evidence,
clear architecture boundaries, refusal tests, specialist review, and final lead
review proof. Passing tests alone is not enough: the packet must make it obvious
which product-pedagogy elements are portable, which parts require local
overlays, which evidence remains school-owned, and why no country-compliance,
inspection-readiness, public, school-facing, product-route, Scale Gate,
student-facing, diagnostics/mastery/PV, personal-data, OP0, PTA, or summative
claim is authorised.

Rendered output is limited to Markdown/JSON review artifacts generated from
the manual foundation generator. No student-facing or teacher/school-facing
route is changed.

Follow-up authority remains blocked unless human review accepts this packet and
separately authorises a later internal architecture sprint.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Official-source profiles for all nine jurisdictions | `international-authority-profiles.v0.json` | Country/source reviewer and checker PASS | planned |
| Common-core model | `international-common-core.v0.json`; `international-common-core-model.md` | Checker PASS and final lead review | planned |
| Differences matrix | `international-commonalities-and-differences.md/json` | Teacher/economics and authority-boundary review | planned |
| Overlay architecture | `international-overlay-architecture.md` | Lead architecture review | planned |
| Book 1 portability check | `international-book-portability-pilot.md/json` | Teacher/economics review | planned |
| Single foundation decision | `international-foundation-decision.md/json` | Checker PASS and final lead review | planned |
| Refusal and stop conditions | Generator refusal cases and checker | Legal/privacy and final lead review | planned |
| REV-STD-1 review packet | Human-review packet and lead review | Sprint-plan checker and final lead PASS | planned |
| Remote human-review readiness | Branch, PR, CI, and maps current | Fresh green `platform-ci / validate-platform` | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Put the foundation data behind a deterministic manual generator and checker. | include_now | Required to prevent stale hand-authored source and report drift. |
| Add refusal cases for forbidden audience, compliance, downstream authority, and governance overgeneralisation. | include_now | Required to make boundaries executable. |
| Add a deeper local exam-code mapping for each jurisdiction. | defer_named_follow_up | Needs separate local overlay source refresh and expert review. |
| Generate country editions or local compliance reports. | reject_scope_creep | Explicitly outside foundation scope and blocked by the owner. |
| Add package scripts, CI hooks, dashboard gates, quality-ref, Scale Gate, product routes, diagnostics/mastery/PV, or student/product-use integration. | reject_scope_creep | Not part of this internal foundation and explicitly blocked. |

## Allowed paths

The sprint may read:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/product-vision.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `archive/sprints/GOAL-DQS-CLOSURE-1A/`
- official web sources recorded in generated authority profiles

The sprint may write:

- `build-scripts/inspection/build-international-quality-standards.js`
- `build-scripts/inspection/check-international-quality-standards.js`
- `references/data/inspection-standards/international-authority-profiles.v0.json`
- `references/data/inspection-standards/international-common-core.v0.json`
- `docs/inspection-standards/international-common-core-model.md`
- `docs/inspection-standards/international-overlay-architecture.md`
- `reports/inspection-standards/international-commonalities-and-differences.md`
- `reports/inspection-standards/international-commonalities-and-differences.json`
- `reports/inspection-standards/international-book-portability-pilot.md`
- `reports/inspection-standards/international-book-portability-pilot.json`
- `reports/inspection-standards/international-foundation-decision.md`
- `reports/inspection-standards/international-foundation-decision.json`
- `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/README.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`
- `archive/sprints/GOAL-IQS-FOUNDATION-1/`
- generated repository maps/indexes required by closure checks

## Forbidden paths

- `references/machine/`
- `references/external/`
- Protected external-reference or machine-reference surfaces.
- Lesson output mutation under `../4veco-lessen/`.
- Generated lesson-output scanning.
- Country edition output.
- Teacher/school-facing distribution artifacts.
- Public/external artifacts.
- School-owned evidence collection or processing.
- Package scripts, CI hooks, dashboard gates, quality-ref integration, Scale
  Gate integration, product-route adoption, diagnostics/mastery/PV,
  student/product-use, personal-data processing, compliance, approval, OP0,
  PTA, summative, inspection-readiness, or school-SKA artifacts.

## Inputs

- PR #124 human verdict accepting GOAL-DQS-CLOSURE-1A and final decision
  `CLOSE_INTERNAL_SYSTEM`.
- Current `origin/main` after PR #124 and PR #126 merges.
- Product end-state and product vision.
- Dutch quality-standards roadmap and closure records as a completed baseline.
- Official-source refresh for requested jurisdictions.

## Outputs

- International roadmap.
- Manual international foundation generator and checker.
- Authority-profile and common-core source JSON.
- Common-core model and overlay architecture docs.
- Commonalities/differences, portability check, and foundation decision report
  pairs.
- Sprint plan, planning review, validation log, correction log, specialist
  gate results, final lead review, human-review packet, and closure log.
- Updated quality-standards ledger, Dutch roadmap pointer, README, roadmap
  version index, and repository maps.
- New PR, fresh, mergeable, and green before human review.

## Operationalized sprint procedure

1. Verify PR #124 merged, create a new worktree/branch, claim the worktree lock,
   and fast-forward onto current `origin/main`. Stop if the branch is on `main`,
   dirty before claim, behind current main after refresh, or lock ownership is
   unclear.
2. Create this international roadmap and sprint plan. Run the sprint-plan
   checker. Stop and correct if REV-STD-1 fields, product end-state, original
   sprint/gate spec, deliverable paths, forbidden paths, or proof required to
   close are missing.
3. Refresh official-source anchors through official sites. Stop if a required
   jurisdiction lacks at least two official-source anchors or if subnational
   governance cannot be represented accurately.
4. Implement the manual generator/checker with exact output allowlists,
   no directory globbing, no implicit source discovery, and refusal cases.
5. Generate all report/data/doc outputs. Stop if the foundation selects more
   than one decision or weakens any false authority flag.
6. Run lead architecture, teacher/economics, legal/privacy, Dutch
   quality-inspection, international authority/source, accessibility, and final
   lead subagents. Treat any missing core requirement as a blocker; correct,
   validate, and re-review before human review.
7. Run currentness, refusal, scope-language, roadmap-index, URL-index,
   report-JSON, diff-hygiene, and platform validation.
8. Refresh repository maps, commit the intended files, push the branch, open a
   PR, wait for fresh `platform-ci / validate-platform`, and verify the PR is
   0 behind, non-draft, mergeable, and green.
9. Return for human review only after the complete foundation packet is ready.

## Acceptance tests

Repository sprint-protocol visibility command required by the sprint-plan
checker:

```bash
node build-scripts/sprints/check-sprint-bundle.js GOAL-IQS-FOUNDATION-1 --complete
```

For this archive-governance packet, that command is named to preserve the
repository sprint-plan protocol. It is not used as the operative closure
evidence unless a matching `reports/sprints`/`references/data/sprints` bundle
is instantiated. Archive visibility is covered by the sprint-plan checker, URL
index check, and the committed `archive/sprints/GOAL-IQS-FOUNDATION-1/` review
packet.

Required executable checks:

```bash
npm.cmd run check:agent-worktree-safety -- --check --task GOAL-IQS-FOUNDATION-1 --agent codex-main --require-prefix codex/,agent/
node build-scripts/sprints/check-sprint-plan.js archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-sprint-plan.md
node build-scripts/inspection/build-international-quality-standards.js --check
node build-scripts/inspection/check-international-quality-standards.js
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
git diff --check
git diff --check origin/main...HEAD
npm.cmd run check:platform
```

## Proof Required to Close

Closure proof must combine official-source evidence, validator evidence,
generated artifact evidence, specialist-review evidence, final lead review, PR
freshness, and remote CI evidence.

- Worktree safety check PASS.
- Sprint-plan checker PASS.
- International generator `--check` PASS.
- International checker PASS for jurisdictions, source profiles, common-core
  categories, differences matrix, overlay architecture, portability check,
  final decision, false authority flags, Markdown REV-STD-1 fragments, and
  refusal cases.
- Scope-language, roadmap version index, URL index, report JSON, diff hygiene,
  and platform validation PASS.
- Lead architecture reviewer PASS.
- Teacher/economics, legal/privacy, Dutch quality-inspection, international
  authority/source, and accessibility reviewer corrections are closed.
- Final lead reviewer returns PASS with no missing core requirement.
- PR is open, non-draft, 0 behind current main, mergeable, and has fresh green
  `platform-ci / validate-platform` on the final head.

## Rollback plan

Before merge, close or revise the PR. After merge, revert the GOAL-IQS
foundation commit that added the generator/checker, international source/data
outputs, review reports, sprint records, roadmap/index updates, and generated
maps. No protected references, machine/external references, generated lesson
output, package scripts, CI hooks, dashboard gates, quality-ref integrations,
Scale Gate integrations, product routes, personal data, teacher/school/public
outputs, or country editions are changed by this sprint.

## Human review required

Yes. Human review receives the complete GOAL-IQS-FOUNDATION-1 packet only
after all generated artifacts exist, checks and refusal tests pass, specialist
corrections are closed, final lead returns PASS, the branch is 0 behind current
main, fresh PR CI is green, and the PR is mergeable and non-draft.

The human decision may accept, revise, or reject only the internal foundation.
It must not unlock country implementation, school-facing output, public output,
evidence-pack deployment, product-route adoption, Scale Gate,
diagnostics/mastery/PV, student/product-use, personal-data processing,
compliance, approval, OP0, PTA, summative, inspection-readiness, or school-SKA
authority unless a later sprint explicitly authorises that exact scope.
