# GitHub Agent Entry - 4veco Platform

This repo is the authoring and build platform for 4veco. It contains tools, engines, build scripts, skills, validators, references, source data, roadmaps, and reports. It is not the final student-facing lesson corpus.

The student-facing output lives in the companion repo `4veco-lessen`. For cross-repo work, start by reading both `RESEARCH_AGENT_MAP.md` files.

Path reliability:

- Use exact paths from `RESEARCH_AGENT_MAP.md` or this file when possible.
- Use `reports/github-agent-index-platform.md` and `reports/github-agent-index-lessen.md` for existence checks.
- Use GitHub search mainly for discovery, not proof; confirm search hits through exact paths or the generated inventory.
- These GitHub-facing maps must be refreshed and pushed whenever repository paths, roadmaps, generated reports, review packets, agents, skills, or source surfaces change.

| Question type | Inspect first |
|---|---|
| How is a lesson, game, visual, validator, or reference generated? | `4veco-platform` |
| Does a generated lesson artifact currently exist for students? | `4veco-lessen` |
| Why did a generated artifact look or behave this way? | `4veco-lessen`, then `4veco-platform` |
| Which engine/source/template should be changed? | `4veco-platform` |
| How should multiple review/testing agents be coordinated into one go/no-go decision? | `agents/lead-reviewer-agent.md` |
| How should a completed remote draft PR be routed to revise, batch, lead-only closure, human review, or pause? | `agents/pr-readiness-reviewer-agent.md`, `docs/review/pr-readiness-routing-policy.md`, `build-scripts/review-gates/review-pr-readiness.js`, `build-scripts/review-gates/route-and-apply-pr-readiness.js`, `build-scripts/review-gates/apply-pr-readiness-decision.js` |
| How should a payload-authorized PR be serialized through base refresh, integration validation, exact-head readiness, and merge? | `docs/review/pr-integration-lane-policy.md`, `build-scripts/review-gates/check-integration-lane-capability.js`, `docs/review/human-payload-authorization.schema.json`, `build-scripts/review-gates/check-human-payload-authorization.js`, `build-scripts/review-gates/integrate-authorized-pr.js`, `.github/workflows/authorized-pr-integration.yml` |
| How should current branch protection and optional `integration-authorized` audit status be verified? | `docs/review/pr-integration-lane-policy.md`, `build-scripts/ci/check-branch-protection.js`, `build-scripts/review-gates/integrate-authorized-pr.js` |
| How should a paired platform/lesson PR bundle be compatibility-checked and merged as one unit? | `docs/review/pr-integration-lane-policy.md`, `.github/workflows/cross-repo-bundle-compatibility.yml`, `.github/workflows/authorized-bundle-integration.yml`, `build-scripts/review-gates/cross-repo-bundle-compatibility.js`, `build-scripts/review-gates/check-human-bundle-authorization.js`, `build-scripts/review-gates/refresh-bundle-agent-indexes.js`, `build-scripts/review-gates/integrate-authorized-bundle.js` |
| How should active governance wording, pre-work governance freshness, and finalization freshness be verified? | `build-scripts/review-gates/check-active-governance-wording.js`, `build-scripts/review-gates/check-governance-freshness.js`, `build-scripts/review-gates/finalization-freshness-proof.js`, `.github/workflows/platform-ci.yml` |
| How should the first-three Golden controlled-wave surface set and its exact committed PR scope be verified? | `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`, `references/data/exercises/y1-golden-rollout-wave-1.json`, `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`, `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`, `reports/json/y1-golden-rollout-wave-1-proof.json` |
| How should test commands, validator results, and residual testing risk be reported? | `agents/testing-agent.md` |
| How should paragraph work be split between Part A/textbook and Part B/companion/student-web production? | Start with `docs/workflows/paragraph-lane-vocabulary.md` and the two lane runbooks. Part A PDF readiness and paragraph-type rules: `build-scripts/workflows/check-part-a-pdf-readiness.js`, `scripts/lib/paragraph-types.js`. Opt-in Part B legacy profile: `docs/workflows/legacy-full-companion-profile.md`. Shared two-lane wording guardrail: `build-scripts/workflows/check-paragraph-workflow-wording.js`. Supporting surfaces: `docs/workflows/textbook-paragraph-lane.md`, `docs/workflows/web-companion-paragraph-lane.md`, `docs/workflows/paragraph-quality-ref-schema-v2.md`, `build-scripts/templates/textbook-to-companion-handoff.md`, `build-scripts/workflows/check-paragraph-lane-scope.js`. These are surfaces within exactly two lanes, not additional lanes. |
| What is the Book 2+ Part A exercise sequence and how do earlier previews interact with it? | Start with `skills/econ-exercise-builder.md`, then `references/authored/didactiek-principes.md` for rationale, `references/owned/course-blueprint-pedagogical-boundaries.md` for preview/support/mastery status, and `BUILD-PARAGRAPH.md` for the build gate. Run `build-scripts/workflows/check-part-a-exercise-authoring-contract.js` and `build-scripts/workflows/check-blueprint-pedagogical-boundaries.js`; mutation coverage sits beside each checker. The guards are platform-only and do not retrofit frozen Book 1 output. |
| How is the Book 2 foundation checked before chapter or paragraph planning? | Use the canonical `references/authored/book-outlines/book-2-outline.md` plus its `.meta.json` companion. First run `build-scripts/workflows/check-book-outline-currentness.js` for structural currentness, then run its action-specific check with `--action` and the exact `--paragraph` or `--chapter` scope. Use `--require-approved` only for approved authority, production, or integration actions. Part A uses `build-scripts/templates/template-textbook-paragraph-plan.md`; use `build-scripts/templates/template-paragraph-plan.md` only for Part B. |
| How should accessibility, readability, contrast, alt text, OCR, or keyboard access be reviewed? | `agents/accessibility-agent.md` |
| How should learning goals, prior knowledge, didactic sequence, formative feedback, differentiation, transfer, retention, or classroom readiness be reviewed? | `agents/teacher-learning-quality-review-agent.md` |
| How should student orientation, affordance, cognitive load, motivation, confusion risks, graph understandability, or student readiness be reviewed? | `agents/student-experience-review-agent.md` |
| How should companion visuals, rendered HTML, procedure fidelity, or next-step affordance be reviewed? | `agents/econ-companion-visual-review.md` |
| How should a specific screenshot, UI state, graph, diagram, chart, or visual asset be reviewed? | `agents/visual-qa-agent.md` |
| Which book/chapter/paragraph files are published now? | `4veco-lessen` |
| Are references, validators, roadmaps, or sprint reports current? | `4veco-platform` |
| How should inspection/accountability evidence work be scoped? | `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`, `docs/roadmaps/quality-standards/sprint-ledger.md`, `docs/roadmaps/quality-standards/quality-standards-end-state.md`, `references/data/inspection-standards/source-register.json`, `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`, `docs/inspection-standards/nl-vo-evidence-model.md`, `references/SOURCE_OF_TRUTH.md`, `4veco-lessen/specifications/product-end-state.md` |
| How should international common-core, jurisdiction-overlay, or local-expert evidence work be scoped? | `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`, `docs/roadmaps/quality-standards/sprint-ledger.md`, `docs/roadmaps/roadmap-version-index.json`, and the named England/Flanders reports under `reports/inspection-standards/` |
| Is a copied `shared/` engine file authoritative? | `4veco-platform` |
| How should official exam-question ingestion, source annexes, correction models, or answer-model decomposition be handled? | `AGENTS.md`, `references/SOURCE_OF_TRUTH.md`, `references/data/exercises/README.md`, `references/reference-team-roadmap.md` |

Common mistakes:

- Searching only `4veco-platform` and concluding a lesson artifact does not exist.
- Searching only `4veco-lessen` and concluding the build logic is absent.
- Treating generated or copied `shared/` files in `4veco-lessen` as the source of truth for engine code.
- Treating platform templates, source data, or roadmap entries as proof that student-facing output has been generated.
- Building a Book 1-specific status system instead of using repository maps and the generated file inventory.
- Treating an exam prompt as fully ingested before source annexes and the official correction model are separately traceable.

Useful entry points:

- `RESEARCH_AGENT_MAP.md`
- `AGENTS.md`
- `4veco-lessen/specifications/product-vision.md`
- `4veco-lessen/specifications/product-vision.json`
- `4veco-lessen/specifications/product-end-state.md`
- `4veco-lessen/specifications/companion-core-specifications.md`
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `docs/workflows/paragraph-lane-vocabulary.md`
- `docs/workflows/textbook-paragraph-lane.md`
- `docs/workflows/web-companion-paragraph-lane.md`
- `docs/workflows/legacy-full-companion-profile.md`
- `docs/workflows/paragraph-quality-ref-schema-v2.md`
- `build-scripts/templates/textbook-to-companion-handoff.md`
- `build-scripts/workflows/check-part-a-pdf-readiness.js`
- `build-scripts/workflows/check-paragraph-workflow-wording.js`
- `build-scripts/workflows/check-part-a-exercise-authoring-contract.js`
- `build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js`
- `build-scripts/workflows/check-paragraph-lane-scope.js`
- `scripts/lib/paragraph-types.js`
- `build-scripts/README.md`
- `agents/README.md`
- `agents/lead-reviewer-agent.md`
- `agents/pr-readiness-reviewer-agent.md`
- `agents/testing-agent.md`
- `agents/accessibility-agent.md`
- `agents/teacher-learning-quality-review-agent.md`
- `agents/student-experience-review-agent.md`
- `agents/econ-companion-visual-review.md`
- `agents/visual-qa-agent.md`
- `docs/review/pr-throughput-policy.md`
- `docs/review/pr-readiness-routing-policy.md`
- `docs/review/pr-integration-lane-policy.md`
- `docs/review/human-payload-authorization.schema.json`
- `build-scripts/ci/check-branch-protection.js`
- `build-scripts/review-gates/check-integration-lane-capability.js`
- `.github/workflows/authorized-pr-integration.yml`
- `.github/workflows/cross-repo-bundle-compatibility.yml`
- `.github/workflows/authorized-bundle-integration.yml`
- `build-scripts/review-gates/integrate-authorized-pr.js`
- `build-scripts/review-gates/route-and-apply-pr-readiness.js`
- `build-scripts/review-gates/check-active-governance-wording.js`
- `build-scripts/review-gates/check-governance-freshness.js`
- `build-scripts/review-gates/finalization-freshness-proof.js`
- `build-scripts/review-gates/cross-repo-bundle-compatibility.js`
- `build-scripts/review-gates/check-human-bundle-authorization.js`
- `build-scripts/review-gates/refresh-bundle-agent-indexes.js`
- `build-scripts/review-gates/integrate-authorized-bundle.js`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `references/owned/course-blueprint-v6-three-year.md` (draft three-year blueprint; v5 remains active until review)
- `reports/github-agent-index-platform.md` after running `npm.cmd run agent:index`

Task-routing guidance:

- Use `4veco-lessen/specifications/product-vision.md` for strategic direction,
  moat/parity trade-offs, lean diffusion constraints, and agent-reliability
  decisions.
- Use `4veco-lessen/specifications/product-end-state.md` for the operational
  student route and completeness definition.
- Use `docs/review/pr-integration-lane-policy.md` plus
  `build-scripts/review-gates/check-integration-lane-capability.js` when an
  owner decision is already bound to a reviewed PR payload and the remaining
  work is base refresh, integration-head validation, exact-head readiness
  proof, and serialized merge. Human handoffs should ask for payload
  authorization, include `AUTHORIZATION_TYPE: PAYLOAD_AUTHORIZATION`, and name
  the reviewed payload head and decision scope. The owner-authenticated local
  lane is the default single-PR merge path; the authorized GitHub workflow is
  optional only when its token can read branch protection. A
  `branch_protection_read_forbidden` result means use the local lane with the
  same authorization comment ID, not a raw merge.
- Use `build-scripts/review-gates/route-and-apply-pr-readiness.js` with
  `--evidence <file> --expect-transition MARK_READY` when a completed draft PR
  should be routed and promoted by machine decision in one step.
- Use `build-scripts/review-gates/check-active-governance-wording.js` and
  `build-scripts/review-gates/finalization-freshness-proof.js` before closing
  governance or workflow changes.
- Use the cross-repo bundle compatibility workflow and authorized bundle
  integration workflow when a platform PR and lesson PR must land as one
  coordinated payload. The trusted lesson-first path uses
  `build-scripts/review-gates/refresh-bundle-agent-indexes.js` after the lesson
  merge and before refreshed-head platform validation. If both members are
  still draft but substantively ready, run `npm.cmd run apply:bundle-readiness`
  from the controller decision before requesting bundle merge authorization.
