# agents/

Reusable agent specifications for bounded review roles in the 4veco platform.

Agents in this folder are not generated lesson output, canonical curriculum data, or machine registries. They are operational review protocols: use them when a task needs a specific reviewer stance with explicit inputs, evidence hierarchy, verdict rules, and report format.

## Available agents

| Agent | Use when | Output |
|---|---|---|
| `econ-companion-visual-review.md` | Reviewing generated companion artifacts where visuals, procedure fidelity, affordance, and rendered output parity matter | `X.Y.Z-companion-visual-review.md` in the paragraph folder, unless a gate plan specifies another report path |

## Paired authoring spec

Every companion artifact reviewed by `econ-companion-visual-review.md` must be authored against `skills/econ-companion-artifacts.md` (the platform-wide authoring + regeneration spec). The skill is the source rule set; this agent is the closure gate. Builder skills (`econ-explainer-docs`, `econ-exercise-builder`, `econ-pptx-templates`, etc.) inherit the rules from `econ-companion-artifacts`.

## Operating rules

- Load `AGENTS.md`, `BUILD-PARAGRAPH.md`, and the requested agent file before reviewing production lesson artifacts.
- Inspect rendered output, not only source files. A clean source does not make a generated HTML, DOCX, PPTX, or PDF clean.
- Distinguish canonical authority, content source, generated artifact, rendered experience, platform implementation, and quality record in the report.
- Do not recommend hand edits in generated lesson output unless the team explicitly asks for a temporary patch. Prefer source, generator, CSS/JS, registry, or asset-builder fixes plus regeneration.
- Record closure proof: regenerated artifact, rendered check, source diff or validator pass, and quality log entry as applicable.
