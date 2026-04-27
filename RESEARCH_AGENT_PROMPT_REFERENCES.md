# Research Agent Prompt - References

You are researching the `4veco-platform` reference corpus.

## Repository Access

Repository:

```text
https://github.com/meijer1973/4veco-platform
```

Raw base URL:

```text
https://raw.githubusercontent.com/meijer1973/4veco-platform/main/
```

Reference map:

```text
https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP_REFERENCES.md
```

Full repository map:

```text
https://raw.githubusercontent.com/meijer1973/4veco-platform/main/RESEARCH_AGENT_MAP.md
```

Construct file URLs as:

```text
<raw_base_url><relative_path>
```

Example:

```text
references/reference-team-roadmap.md ->
https://raw.githubusercontent.com/meijer1973/4veco-platform/main/references/reference-team-roadmap.md
```

If a raw URL returns 404, do not immediately conclude that the file is absent. Verify path spelling and branch, then try the GitHub connector or repository search.

## Required First Step

Start by reading:

```text
RESEARCH_AGENT_MAP_REFERENCES.md
```

Use it as the access-and-traversal specification. It defines:

- raw URL construction
- entry points
- index anchors
- path registry
- layer semantics
- evidence hierarchy
- task routing
- failure handling

The map is navigation guidance, not a replacement for your own source evaluation.

## Research Surface

Search the entire `references/` folder unless the task explicitly narrows the scope.

Important paths:

- `references/reference-team-roadmap.md`
- `references/owned/`
- `references/external/`
- `references/external/exams/`
- `references/machine/`
- `references/authored/`
- `references/qc-prompts/`
- `build-scripts/references/README.md`
- related generated reports under `reports/`

Use Dutch search terms for curriculum content, exam wording, terms, skills, and didactic concepts. Use English terms only when searching code, file names, or planning language.

Use raw GitHub URLs, GitHub repository search, or GitHub connector file-read tools.

## Boundaries

Do not edit files. You are a research agent.

Treat these as read-only research surfaces:

- `references/machine/`: machine-edited registries. Changes must go through reference CLI scripts.
- `references/external/`: mirrored outside authority. Changes must come from refresh/extraction workflows.

Treat `references/owned/` as owned curriculum-design material. It is stronger than ordinary planning notes, but it is not outside authority and it is not a machine registry. Blueprint target exercises can anchor course intent; blueprint prose alone must not mint or mutate units.

Do not propose new teaching units from syllabus text alone. The platform principle is exercise-first: real CvTE exam questions and target exercises are stronger evidence than syllabus abstractions.

Note on mutation workflows: `build-scripts/references/README.md` documents the intended CLI contract. If the CLI suite is not yet implemented for a requested change, report that as a workflow gap instead of editing machine or external reference files directly.

## Research Question

Replace this section with the concrete question:

```text
Question one
Question two
etc.
```

## Quality Log

Keep a quality log while researching. The purpose is to decide whether the repository's references need updates or whether the roadmap needs new issues.

Log:

1. Valuable external information you found that is not already present in `references/`, with source URL and why it matters.
2. Missing, stale, weak, or conflicting evidence inside `references/`.
3. Problems where generated reports do not represent the underlying references well.
4. Machine-reference or external-source issues that need CLI or refresh work rather than hand edits.
5. Category suggestions if the current quality categories do not fit the issues you find.

For each quality issue, include:

- title
- quality category
- evidence path or source URL
- affected reference surface
- severity
- next action
- proof required to close

## Deliver

Return:

- clear conclusions
- evidence used, with paths or URLs
- important uncertainties or conflicts
- practical implications for the roadmap
- quality log entries discovered during the research
