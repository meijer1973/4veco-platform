# agents/

Reusable agent specifications for bounded review roles in the 4veco platform.

Agents in this folder are not generated lesson output, canonical curriculum data, or machine registries. They are operational review protocols: use them when a task needs a specific reviewer stance with explicit inputs, evidence hierarchy, verdict rules, and report format.

## Available agents

| Agent | Use when | Output |
|---|---|---|
| `lead-reviewer-agent.md` | Orchestrating multiple review/testing agents, checking evidence completeness, and making a consolidated go/no-go recommendation | `lead-review-plan-or-report.md` or the gate-required report path |
| `testing-agent.md` | Selecting relevant tests, overseeing test execution evidence, and reporting test/validator results | `test-report.md` or the gate-required report path |
| `accessibility-agent.md` | Reviewing readability, contrast, alt text, OCR, semantic clarity, keyboard/interaction access, and inclusive usability | `accessibility-review.md` or the gate-required report path |
| `teacher-learning-quality-review-agent.md` | Reviewing whether goals, prior knowledge, sequence, formative feedback, differentiation, dual coding, transfer, and retention make learning likely | `teacher-learning-quality-review.md` or the gate-required report path |
| `student-experience-review-agent.md` | Reviewing whether a typical 4 vwo student can orient, understand actions, manage cognitive load, stay motivated, and understand visual support | `student-experience-review.md` or the gate-required report path |
| `econ-companion-visual-review.md` | Reviewing generated companion artifacts where visuals, procedure fidelity, affordance, and rendered output parity matter | `X.Y.Z-companion-visual-review.md` in the paragraph folder, unless a gate plan specifies another report path |
| `visual-qa-agent.md` | Reviewing a specific visual item, screenshot, rendered UI, graph, chart, diagram, or generated asset | `visual-qa-report.md` or the report path required by the task/gate |

## Paired authoring spec

Every companion artifact reviewed by `econ-companion-visual-review.md` must be authored against `skills/econ-companion-artifacts.md` (the platform-wide authoring + regeneration spec). The skill is the source rule set; this agent is the closure gate. Builder skills (`econ-explainer-docs`, `econ-exercise-builder`, `econ-pptx-templates`, etc.) inherit the rules from `econ-companion-artifacts`.

## Pipeline ownership (Part A vs Part B reviewers)

The two paragraph pipelines have separate review surfaces. The asymmetry is intentional:

| Pipeline | Reviewer | Output file | Where to find it |
|---|---|---|---|
| Part A (textbook layer) | `econ-paragraph-review` SKILL | `${parNr}-review.md` | `skills/econ-paragraph-review.md` |
| Part B (companion layer) | `econ-companion-visual-review` AGENT | `${parNr}-companion-visual-review.md` | this folder |

Both verdicts feed `scripts/validate-paragraph.js` via the `partA:` and `companion:` blocks of `${parNr}-quality-ref.yaml` (schema_version 2). `--mode part-a` reads the Part A review only; `--mode part-b` reads the companion review only; `--mode complete` aggregates both — non-FAIL is required to pass.

## Operating rules

- Load `AGENTS.md`, `BUILD-PARAGRAPH.md`, and the requested agent file before reviewing production lesson artifacts.
- Inspect rendered output, not only source files. A clean source does not make a generated HTML, DOCX, PPTX, or PDF clean.
- Use `teacher-learning-quality-review-agent.md` when a task claims classroom readiness or learning quality. Visual polish, accessibility, and passing tests do not prove that students learn the intended concept or skill.
- Use `student-experience-review-agent.md` when a task claims student readiness or student-facing usability. Teacher learning quality does not prove that a typical student can find the next action, understand the visual, or stay motivated.
- Distinguish canonical authority, content source, generated artifact, rendered experience, platform implementation, and quality record in the report.
- Do not recommend hand edits in generated lesson output unless the team explicitly asks for a temporary patch. Prefer source, generator, CSS/JS, registry, or asset-builder fixes plus regeneration.
- Record closure proof: regenerated artifact, rendered check, source diff or validator pass, and quality log entry as applicable.
