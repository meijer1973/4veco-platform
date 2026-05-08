# GitHub Agent Entry - 4veco Platform

This repo is the authoring and build platform for 4veco. It contains tools, engines, build scripts, skills, validators, references, source data, roadmaps, and reports. It is not the final student-facing lesson corpus.

The student-facing output lives in the companion repo `4veco-lessen`. For cross-repo work, start by reading both `RESEARCH_AGENT_MAP.md` files.

Path reliability:

- Use exact paths from `RESEARCH_AGENT_MAP.md` or this file when possible.
- Use `reports/github-agent-index-platform.md` and `reports/github-agent-index-lessen.md` for existence checks.
- Use GitHub search mainly for discovery, not proof; confirm search hits through exact paths or the generated inventory.

| Question type | Inspect first |
|---|---|
| How is a lesson, game, visual, validator, or reference generated? | `4veco-platform` |
| Does a generated lesson artifact currently exist for students? | `4veco-lessen` |
| Why did a generated artifact look or behave this way? | `4veco-lessen`, then `4veco-platform` |
| Which engine/source/template should be changed? | `4veco-platform` |
| How should companion visuals, rendered HTML, procedure fidelity, or next-step affordance be reviewed? | `agents/econ-companion-visual-review.md` |
| Which book/chapter/paragraph files are published now? | `4veco-lessen` |
| Are references, validators, roadmaps, or sprint reports current? | `4veco-platform` |
| Is a copied `shared/` engine file authoritative? | `4veco-platform` |

Common mistakes:

- Searching only `4veco-platform` and concluding a lesson artifact does not exist.
- Searching only `4veco-lessen` and concluding the build logic is absent.
- Treating generated or copied `shared/` files in `4veco-lessen` as the source of truth for engine code.
- Treating platform templates, source data, or roadmap entries as proof that student-facing output has been generated.
- Building a Book 1-specific status system instead of using repository maps and the generated file inventory.

Useful entry points:

- `RESEARCH_AGENT_MAP.md`
- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `build-scripts/README.md`
- `agents/README.md`
- `agents/econ-companion-visual-review.md`
- `reports/github-agent-index-platform.md` after running `npm run agent:index`
