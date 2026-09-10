---
name: economic-graph
description: "Create or check economics graphs and explanatory diagrams for VWO lessons. Defines mathematical accuracy, project visual conventions and final-output checks; construction tools and layout recipes are optional. Use when the task includes a graph or diagram, not for unrelated authoring or publication work."
pipeline: "shared infrastructure"
---

# Economic graphs: output requirements

Create graphs that are economically correct, geometrically precise and readable
for 15–16 year old VWO students. Choose the construction method, drawing order,
canvas and layout that suit the supplied equations and intended output.

This file is the required graph guidance. The
[construction recipes](references/economic-graph-recipes.md) are optional lookup
examples, not another required read. The
[economic and mathematical precision reference](../references/authored/economic_mathematical_precision_reference.md#9-graph-precision-rules)
remains authoritative; consult its relevant section when a model-specific
question arises. Its rules about domains, units and formula agreement apply
regardless of the drawing method.

## Establish the graph's scope

Use the supplied graph specification: economic question, equations/data,
variable names and units, valid domains, required points/areas and target size.
Keep the graph consistent with the exercise, answer, caption and surrounding
explanation. If a necessary equation or unit is missing or contradictory,
resolve that before producing a numerical graph. Do not silently invent it.
Distinguish a conceptual schematic from an exact numerical plot; numbers must
still match their example. Do not alter supplied functions to fit a recipe.

A standalone draft graph requires its numerical and visual checks and the
requested files. It does not itself require a paragraph build, review manifest
or PR. Graphs included in publishable paragraphs/slides retain their existing
artifact, independent-review and publication requirements.

## Mathematical and economic requirements

- Derive coordinates from equations and a consistent scale. Compute intersections,
  extrema, cutoffs, kinks and shaded boundaries mathematically; never position
  them by eye. Substitute results back into the relevant equations. Keep exact
  values through the calculation and explain any displayed rounding.
- Respect non-negative quantities, applicable price ranges and piecewise domains.
  Clip curves at valid domain or plot boundaries; never move a line endpoint to
  an axis merely for appearance. Every displayed point and guide must align with
  the actual function and its axis value.
- Market graphs have quantity on the horizontal axis and price on the vertical
  axis. Cost/revenue graphs use output horizontally and the relevant euro amount
  vertically. Label variables and units explicitly; quantity tick values do not
  replace an axis title. Other graph types use their stated variables.
- Curve shape follows the model. For ordinary straight-line supply/demand
  examples, V slopes down and A slopes up. When free to choose an illustrative
  supply equation, retain the project's positive price-intercept convention;
  this is not permission to change a supplied equation. Show valid nonlinear or
  non-U-shaped curves when the supplied model requires them.
- Distinguish movement along a curve from a shift. For collective curves, sum
  quantities at a common price, respect entry/exit cutoffs and explain slope
  with the actual axis orientation (more active identical consumers means a
  flatter inverse demand segment). Do not infer steepness from participant
  count without the model's assumptions.

Apply only the relevant type-specific requirements:

| Graph type | Required economic meaning |
|---|---|
| Market equilibrium and surplus | Solve V = A. Mark the intersection and align guides to both axes. CS lies below demand and above the price; PS lies above supply and below the price. For the standard linear model the enclosed areas are triangles reaching the correct price intercepts. For other domains/shapes, compute their actual boundaries. |
| Tax/subsidy or quantity restriction | Show the correct old/new curves and equilibria, distinguish buyer/seller prices, and label the wedge or restriction. A per-unit producer tax shifts inverse supply up, a subsidy down. Show shift arrows horizontally in an uncluttered region; distinguish these from a vertical tax wedge. Welfare-loss boundaries follow the affected quantities, demand and marginal cost; triangular only for the applicable linear model. |
| Cost, revenue and firm choice | Respect GTK = GVK + GCK and the given cost functions. In the usual U-shaped model, MK crosses GTK/GVK at their minima. A price-taking firm's interior Q* satisfies P = MO = GO = MK on the rising MK branch; check the shutdown condition. Profit/loss is Q* × (P − GTK(Q*)), shown as the corresponding rectangle. In that model break-even is at minimum GTK and shutdown at minimum GVK. For monopoly, solve MO = MK and read the price from demand at that quantity. |
| Reaction curves | Use q1/q2 axes, solve both best-response equations and label the Nash intersection. Additional cartel/symmetry points must follow the specified model. |
| PPF, comparison or market panels | Name products/variables, preserve the stated production limits and opportunity costs, and compute each panel separately. Keep comparable scales when comparing prices or changes; keep identical scales across progressive versions. |
| Flow/process diagrams and bar charts | Arrows must represent the stated causal/sequence relation; values, categories and comparisons must match the source. Label bars directly and keep captions separate from the data. |

## Presentation and project conventions

- Label every curve directly; identify relevant points, areas and guides without
  relying on colour alone. Keep Dutch terminology consistent with the material.
  Place labels where they fit, inside the viewport and clear of curves, guides,
  other labels and captions. Area labels must fit fully inside their region or
  use an unambiguous external label.
- Use Arial/sans-serif and the project palette below. Keep labels at least 10px
  in the rendered graph and readable at the actual document/slide size; follow
  the target artifact's stricter typography when applicable. Give text strong
  contrast, including on fills; use dark text outside an area or a solid badge
  with contrasting text rather than same-hue text on translucent backgrounds.
- Use the light canvas for ordinary textbook graphs. Adapt backgrounds/contrast
  to an explicitly required web or slide surface while retaining colour meaning.
  Shaded areas must remain visible after export. Avoid unexplained decoration,
  redundant overlapping curves and excessive colour; split crowded comparisons
  into clear panels when needed.
- Give the figure a useful title/caption and make its teaching point apparent.
  Preserve aspect ratio, adequate margins and label space. Fit the intended
  content area at a readable size; no fixed pixel coordinate, full-width rule or
  construction order overrides the actual output's layout contract.

| Role | Project colour |
|---|---|
| V/demand, price; A/supply | `#1A5276`; `#1E8449` |
| Shifted supply, MK/TK; GTK/GVK; MO/TO | `#E67E22`; `#D9534F`; `#7B2D8E` |
| CS; PS; loss; tax area | `#85C1E9`; `#82E0AA`; `#F1948A`; `#F8C471` |
| Axes/body text; guides; secondary labels; title; light canvas | `#2D3748`; `#CBD5E0`; `#718096`; `#1E2761`; `#F7FAFC` |

## Verify and deliver

1. **Check the actual geometry programmatically.** Compare the drawn endpoints,
   sample/intersection points, guides and area boundaries with equation-derived
   coordinates. Recheck affected geometry after edits. Use
   [verify_svg_geometry.py](../build-scripts/lib/verify_svg_geometry.py) for its
   supported linear-curve cases or an equivalent executable check for the actual
   figure. The helper's self-test proves the helper, not your graph; supply the
   figure's real coordinates. A computation disconnected from the drawing is
   insufficient. Allow only the declared rounding tolerance (the helper uses
   1.5px); do not round economic values to hide discrepancies.
2. **Render and inspect the final figure at its intended size.** Check alignment,
   clipping, overlaps, units, contrast, shaded areas and caption/exercise/answer
   agreement. Inspect the export, not just SVG source. After repairs, repeat the
   affected numerical and visual checks. Fix failures before delivery.
3. Return the requested figure and concise numerical check. For repository
   textbook assets, retain the SVG + PNG pair, naming and destination required
   by the paragraph contract. Choose the renderer freely if it preserves the
   figure. For other scopes, return only the requested formats. Record the
   actual command/result and useful limitations; do not manufacture review or
   publication approval.

For a canvas/scaffold, Sharp conversion, Word/PPTX insertion or a graph-type
implementation example, look up that section in the optional recipes. Existing
renderers and geometry tools remain available; no particular library is required
solely by this skill.

Apply this skill to the following task: $ARGUMENTS
