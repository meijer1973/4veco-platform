# agents/

Reusable agent specifications for bounded review roles in the 4veco platform.

Agents in this folder are not generated lesson output, canonical curriculum data, or machine registries. They are operational review protocols: use them when a task needs a specific reviewer stance with explicit inputs, evidence hierarchy, verdict rules, and report format.

## Available agents

| Agent | Use when | Output |
|---|---|---|
| `lead-reviewer-agent.md` | Orchestrating multiple review/testing agents, checking evidence completeness, and making a consolidated go/no-go recommendation | `lead-review-plan-or-report.md` or the gate-required report path |
| `pr-readiness-reviewer-agent.md` | Independently routing a remotely inspectable draft PR to revise, batch, lead-only closure, human review, or pause after lead review and current-head evidence exist | `pr-readiness-decision.json` and `pr-readiness-decision.md` |
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

Both verdicts feed `scripts/validate-paragraph.js` via the `partA:` and `companion:` blocks of `${parNr}-quality-ref.yaml` (schema_version 2; see `docs/workflows/paragraph-quality-ref-schema-v2.md`). `--mode part-a` reads the Part A review only; `--mode part-b` reads the companion review only; `--mode complete` aggregates both — non-FAIL is required to pass.

## Operating rules

- Load `AGENTS.md`, the applicable textbook or companion lane runbook, and the requested reviewer file. Use relevant `BUILD-PARAGRAPH.md` sections as the full reference; chapter work additionally uses `BUILD-CHAPTER.md`.
- Use `lead-reviewer-agent.md` for substantive quality, specification fulfilment, specialist-review routing, and evidence completeness. Use `pr-readiness-reviewer-agent.md` only after the draft PR is remotely inspectable and lead review exists; it routes PR lifecycle state and must not replace missing lead or specialist review.
- Inspect rendered output, not only source files. A clean source does not make generated HTML, opt-in DOCX, PPTX, or Part A PDF output clean.
- For eligible routine Part A work, use the consolidated content-review route below for classroom readiness, learning quality, and student usability. Outside that exception, use `teacher-learning-quality-review-agent.md` for classroom readiness or learning-quality claims and `student-experience-review-agent.md` for student-readiness or usability claims. Visual polish, accessibility, and passing tests do not prove learning; teacher coverage alone does not prove student usability.
- Distinguish canonical authority, content source, generated artifact, rendered experience, platform implementation, and quality record in the report.
- Do not recommend hand edits in generated lesson output unless the team explicitly asks for a temporary patch. Prefer source, generator, CSS/JS, registry, or asset-builder fixes plus regeneration.
- Record closure proof: regenerated artifact, rendered check, source diff or validator pass, and quality log entry as applicable.

## Routine Part A content-review route

Eligibility is limited to routine Part A paragraph/chapter content authoring or
revision using existing approved teaching authority, production tools, and output
contracts. Platform/generator changes, companion interaction work, protected-source
or curriculum changes, and governance or review-policy changes are outside this
exception. Mixed tasks retain the review required by their consequential changes.
An explicit owner request or applicable specialist/human gate still applies.

After author self-checks and applicable mechanical validation, assign
`skills/econ-paragraph-review.md` to **one independent substantive content reviewer**,
separate from every author whose content they review. Its didactic, precision,
teacher, student, and final rendered-page coverage is mandatory. The same reviewer
may handle a manageable chapter batch and its continuity/final assembly checks,
but every paragraph retains identifiable findings and `X.Y.Z-review.md` plus its
required quality record, plan, and handoff.

Teacher, student-experience, visual, accessibility, and testing perspectives do not
automatically require separate model instances for eligible work. The reviewer may
consult those specialist protocols; executing a validator is not a model-based
testing review. Add a reviewer for a concrete unresolved issue, a failed check
needing specialist judgement, an explicit owner request, or an applicable
specialist gate, recording the reason in the existing review report. A generic
PASS without actual coverage is insufficient. Do not fabricate separate
specialist approvals or relabel author self-checks as independent review.

This is a content-review default, not a cap on PR reviewers. Required structural
lead review, independent PR-readiness routing, current-head CI, human
authorization, and authorized integration remain mandatory and independently
staffed wherever current governance requires it. Release reviewers may consume
the content report without unnecessarily repeating its checks. This exception
cannot approve the governance change that introduces it.
