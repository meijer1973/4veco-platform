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
| How should a completed remote draft PR be routed to revise, batch, lead-only closure, human review, or pause? | `agents/pr-readiness-reviewer-agent.md`, `docs/review/pr-readiness-routing-policy.md` |
| How should a human-authorized PR be serialized through base refresh, exact-head readiness, and merge? | `docs/review/pr-integration-lane-policy.md`, `.github/workflows/authorized-pr-integration.yml`, `docs/review/human-payload-authorization.schema.json`, `build-scripts/review-gates/integrate-authorized-pr.js` |
| How should a paired platform/lesson PR bundle be compatibility-checked and merged as one unit? | `docs/review/pr-integration-lane-policy.md`, `.github/workflows/cross-repo-bundle-compatibility.yml`, `.github/workflows/authorized-bundle-integration.yml`, `build-scripts/review-gates/cross-repo-bundle-compatibility.js`, `build-scripts/review-gates/check-human-bundle-authorization.js`, `build-scripts/review-gates/integrate-authorized-bundle.js` |
| How should test commands, validator results, and residual testing risk be reported? | `agents/testing-agent.md` |
| How should accessibility, readability, contrast, alt text, OCR, or keyboard access be reviewed? | `agents/accessibility-agent.md` |
| How should learning goals, prior knowledge, didactic sequence, formative feedback, differentiation, transfer, retention, or classroom readiness be reviewed? | `agents/teacher-learning-quality-review-agent.md` |
| How should student orientation, affordance, cognitive load, motivation, confusion risks, graph understandability, or student readiness be reviewed? | `agents/student-experience-review-agent.md` |
| How should companion visuals, rendered HTML, procedure fidelity, or next-step affordance be reviewed? | `agents/econ-companion-visual-review.md` |
| How should a specific screenshot, UI state, graph, diagram, chart, or visual asset be reviewed? | `agents/visual-qa-agent.md` |
| Which book/chapter/paragraph files are published now? | `4veco-lessen` |
| Are references, validators, roadmaps, or sprint reports current? | `4veco-platform` |
| How should inspection/accountability evidence work be scoped? | `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`, `docs/roadmaps/quality-standards/sprint-ledger.md`, `docs/roadmaps/quality-standards/quality-standards-end-state.md`, `references/data/inspection-standards/source-register.json`, `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`, `docs/inspection-standards/nl-vo-evidence-model.md`, `references/SOURCE_OF_TRUTH.md`, `4veco-lessen/specifications/product-end-state.md` |
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
- `.github/workflows/authorized-pr-integration.yml`
- `.github/workflows/cross-repo-bundle-compatibility.yml`
- `.github/workflows/authorized-bundle-integration.yml`
- `build-scripts/review-gates/integrate-authorized-pr.js`
- `build-scripts/review-gates/cross-repo-bundle-compatibility.js`
- `build-scripts/review-gates/check-human-bundle-authorization.js`
- `build-scripts/review-gates/integrate-authorized-bundle.js`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
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
- Use `docs/review/pr-integration-lane-policy.md` plus the authorized
  integration workflow when an owner decision is already bound to a reviewed PR
  payload and the remaining work is base refresh, exact-head readiness proof,
  and serialized merge.
- Use the cross-repo bundle compatibility workflow and authorized bundle
  integration workflow when a platform PR and lesson PR must land as one
  coordinated payload.
