# Graph skill cleanup

After integrating PR #239, separate the economic-graph skill's mandatory output
requirements from optional construction recipes. Keep this as a separate PR.

Quality floor: equations, economic domains, labels/units, cross-surface numerical
agreement, project visual conventions, executable geometry checks and inspection
of the final rendering remain required. Do not change protected precision
references, student materials, renderers or geometry tools. Retain the previous
recipe text as an optional reference, with current requirements taking priority.

Update only direct callers that prescribe the old construction method or refer
to its removed section numbering. Preserve paragraph asset/output contracts.
Use existing affected tests and navigation checks; do not add prose-matching
tests or relax CI classification simply to obtain a faster run.

Proof: inspect the requirements against the old skill and precision reference;
run one independent graph task from supplied equations, capped at 30 minutes,
then independently check its calculations and rendered figure. Record files
actually read, elapsed time, repair attempts and available token usage only.
This is a bounded usability observation, not a before/after speed benchmark.
One independent maintenance review covers the instruction change and findings.
Publish the separate PR with current CI and evidence; do not merge trial
platform #238 or lessons #47, or run another paragraph-production trial.

## Evidence

- PR #239 merged as `3bfb5a97dd5ba77f7ddd080d64bc65f69faa9131`, with the
  expected parents and a tree identical to reviewed `0ec39d46`. Its
  [post-merge CI](https://github.com/meijer1973/4veco-platform/actions/runs/34474934498)
  passed 70 smoke tests. No admin bypass or trial PR merge occurred.
- Required graph entry: 5,340 to 1,317 words. The original recipe body is
  preserved exactly beneath its optional-reference banner. Standard skill
  metadata validation passes; the repository's existing `pipeline` extension
  is retained. No rendering/geometry tool or precision reference changed.
- 104 affected tests passed, plus the 13-document navigation check. Independent
  review found two remaining caller references (Word's removed Part 3 link and
  the tooling README's prescribed helper); both were corrected and rechecked.
- A cold agent received only the graph skill and this task: plot
  `Qv = 120 - 2P`, `Qa = 3P - 30`, with P in EUR/kg and Q in kg/week; show valid
  nonnegative curves, equilibrium/guides and consumer/producer surplus. It was
  capped at 30 minutes, with output isolated from both repositories.
- The [activity log](graph-skill-experiment/activity-log.md) records only the
  required graph skill read, two repairs (console encoding and label overlap),
  and 2m50s from its first clock reading **after skill loading** through final
  verification. Total cold-entry time was not measured; token usage is
  unavailable. No optional recipe or paragraph-production route was loaded.
- [SVG](graph-skill-experiment/appelmarkt.svg),
  [PNG](graph-skill-experiment/appelmarkt.png),
  [numerical output](graph-skill-experiment/numerical-check.json), and
  [generation/verification source](graph-skill-experiment/create_graph.py) are
  retained as experimental evidence, not lesson material. Rerun the source with
  Python and CairoSVG to regenerate its adjacent outputs.
- Parent and independent reviewer checked the actual graph: P = 30, Q = 60,
  CS = 900 EUR/week and PS = 600 EUR/week, with correct SVG coordinates and a
  clear final PNG. Review: PASS for the bounded instruction change and fixes.

This one graph demonstrates successful use without the compulsory recipe; it
does not establish a speed/token improvement or validate every graph type.
No further skill-library or test-rewriting program is included. The separate
PR and its current-head Actions runs are the publication/CI record.
