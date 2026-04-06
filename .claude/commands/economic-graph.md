---
name: economic-graph
description: "Technical specifications for creating economically correct, geometrically precise SVG graphs and visuals for economics education. Covers supply/demand diagrams, cost curves (MK/GTK/GVK), market equilibrium, surplus areas, tax/subsidy shifts, flowcharts, and infographics. Use this skill whenever a graph, diagram, or visual explanation is needed in presentations, Word documents, or HTML files for economics VWO lessons."
---

# Economic Graph Skill v2

Technical specifications for creating SVG-based economics visuals. All graphs must be **economically correct**, **geometrically exact**, and **visually clean**. These visuals are used by 15-16 year old VWO students.

**Core principle:** A student should understand the graph in 5 seconds without the teacher's explanation. If it takes longer, simplify.

---

## PART 1: SVG CANVAS & RENDERING

### Standard canvas

```
SVG viewBox: "0 0 720 360"  (landscape, slightly taller for label room)
Background: #F7FAFC with rx="8" (light gray, rounded corners)
Render width: 720px via sharp, then insert at full content width
```

### Plot area layout (MANDATORY)

Every graph must reserve margins for labels. The **plot area** is where curves are drawn; labels and titles go outside it.

```
PLOT AREA (the rectangle where curves live):
  Left margin:   80px  (room for Y-axis label + price labels)
  Right margin:  40px  (room for curve endpoint labels)
  Top margin:    45px  (room for title)
  Bottom margin: 50px  (room for X-axis label + quantity labels)

  Plot area: x=80, y=45, width=600, height=265
  Y-axis: vertical line at x=80, from y=45 to y=310
  X-axis: horizontal line at y=310, from x=80 to x=680
```

### Label positioning (MANDATORY — prevents overlap)

```
Y-axis title ("Prijs (P)"):
  Position: x=15, y=180, transform="rotate(-90, 15, 180)"
  This places it vertically along the left edge, OUTSIDE the plot area

X-axis title ("Hoeveelheid (Q)"):
  Position: x=380, y=355, text-anchor="middle"
  This is the LOWEST text element — it goes BELOW everything else.
  If there are annotations below the X-axis (brackets, labels), omit the
  "Hoeveelheid (Q)" title entirely — the axis is self-evident.

Price labels (P*, Pe, Pmax etc.):
  Position: x=72, text-anchor="end"  (right-aligned, 8px left of Y-axis)
  Never let price labels extend past x=0 or overlap with dashed lines
  When there are many price levels (>3), use smaller font-size="9"

Quantity labels (Q*, Qe, Q1 etc.):
  Position: y=325, text-anchor="middle"  (centered below X-axis)
  Never let quantity labels overlap with each other — minimum 40px apart
  CRITICAL: quantity labels must NOT overlap with the X-axis title.
  If they would overlap, OMIT the "Hoeveelheid (Q)" title.

Curve labels (V, A, MO, MK, GTK, GVK etc.):
  Position: at the END of each curve, 5-10px beyond the endpoint
  Use the curve's own color, font-weight="bold"
  EVERY curve must be labeled — if a curve has no label, add one.
  CRITICAL: labels must stay INSIDE the SVG viewport (0..720, 0..360).
  If a label would be clipped at the right edge, move it to the left
  side of the curve endpoint or place it slightly above/below.

Graph title:
  Position: x=360, y=25, text-anchor="middle" (centered above plot area)
```

### Rendering pipeline

```javascript
const sharp = require("sharp");

async function svgToPng(svgString, width = 720) {
  return await sharp(Buffer.from(svgString)).resize(width).png().toBuffer();
}
```

### Insertion in Word documents

```javascript
// Content width tight margins: 9638 DXA = 6.693 inches = 482pt
// At 96 DPI: 642px. At 72 DPI: 482px.
// ImageRun width should be 482pt (full content width)
const IMG_WIDTH_PT = 482;

// Height scales proportionally from SVG viewBox aspect ratio
// For viewBox "0 0 720 360": height = 482 * (360/720) = 241pt
```

Always use **full content width** for graph images. Never shrink them smaller.

---

## PART 1B: MANDATORY BUILD ORDER (scaffold-first)

Every graph MUST be built in this exact order. Do NOT skip steps or combine them.

**Step 1 — Scaffold (basiselementen)**
Draw these elements FIRST, before any curves or data:
1. SVG canvas + background rect
2. Y-axis line (x=80, y=45→310) with arrowhead
3. X-axis line (y=310, x=80→680) with arrowhead
4. Y-axis title "Prijs (P)" (x=15, y=180, rotated)
5. X-axis title "Hoeveelheid (Q)" (x=380, y=355) — or omit if Q-labels will be present
6. Graph title (x=360, y=25)
7. Origin label "0" (x=72, y=325)

After placing these, mentally note their bounding boxes — these are **reserved zones** that later elements must never overlap:
- Y-axis zone: x=0..80 (labels + axis line)
- X-axis zone: y=310..360 (axis line + labels + title)
- Title zone: y=0..40
- Plot area for curves: x=80..680, y=45..310

**Step 2 — Reference lines and labels**
Add price labels (P*, Pe) and quantity labels (Q*, Qe) at their axis positions.
Check: do any labels collide with the scaffold from Step 1?

**Step 3 — Curves**
Draw curves INSIDE the plot area (x=80..680, y=45..310).
Add curve labels at endpoints. Check: do curve labels stay inside the SVG viewport (0..720, 0..360)?

**Step 4 — Equilibrium and intersections**
Compute intersections mathematically. Place dots, dashed reference lines.
Check: do dashed lines align with the axis labels from Step 2?

**Step 5 — Areas and annotations**
Add surplus areas, tax brackets, shift arrows, and other annotations.
Check: do annotations avoid the scaffold elements from Step 1?

**Why this order matters:**
The scaffold defines reserved zones that later elements must respect. By placing the scaffold first, you always know where the axes, labels, and title are — preventing overlap. When the scaffold is skipped or built simultaneously with curves, position awareness is lost and elements collide.

---

## PART 1C: ECONOMIC CORRECTNESS RULES

These rules prevent common economic errors in graphs.

### Supply curves
- Supply curves MUST have a **positive Y-intercept** (the curve starts on the Y-axis above the origin)
- NEVER use functions like `P = 2Q - 40` where the supply curve enters through the Q-axis (creates a white gap and implies negative prices at low quantities)
- Good example: `P = Q + 10` (Y-intercept at P=10) or `P = 0.5Q + 20` (Y-intercept at P=20)

### Surplus areas
- **CS (consumentensurplus)**: triangle between demand Y-intercept, equilibrium, and P* on Y-axis. Always ABOVE the price line.
- **PS (producentensurplus)**: triangle between supply Y-intercept, equilibrium, and P* on Y-axis. Always BELOW the price line, above the supply curve.
- Both triangles share the equilibrium point and P* on the Y-axis as two of their three vertices.

### Deadweight loss
- DWL is always a triangle pointing toward the efficient equilibrium
- At monopoly: DWL between monopoly Q, efficient Q, and the intersection of the curves

---

## PART 2: COLOR PALETTE

Use the shared project palette. Never use random colors.

```javascript
const GRAPH_COLORS = {
  // Curves and lines
  demand:     "#1A5276",  // blue — demand/vraag curve
  supply:     "#1E8449",  // green — supply/aanbod curve
  supplyNew:  "#E67E22",  // amber — shifted supply (tax/subsidy)
  cost:       "#E67E22",  // amber — MK, TK curves
  costAvg:    "#D9534F",  // red — GTK, GVK curves
  price:      "#1A5276",  // blue — horizontal price line
  revenue:    "#7B2D8E",  // purple — MO, TO curves

  // Areas — use with fill-opacity="0.45" for shaded regions
  // These are MEDIUM-intensity colors, NOT pale pastels. They must be
  // clearly visible when rendered to PNG at 150 DPI.
  surplus:    "#85C1E9",  // medium blue — consumer surplus (CS)
  prodSurplus:"#82E0AA",  // medium green — producer surplus (PS)
  loss:       "#F1948A",  // medium red — deadweight loss, firm loss
  tax:        "#F8C471",  // medium amber — tax revenue area

  // Structure
  axis:       "#2D3748",  // dark — axes
  grid:       "#CBD5E0",  // gray — grid lines, dashed references
  label:      "#718096",  // gray — axis labels, captions
  title:      "#1E2761",  // navy — graph title
  background: "#F7FAFC",  // light gray — canvas background
};
```

---

## PART 3: GRAPH TYPES & SPECIFICATIONS

### A. Supply & Demand (Vraag en Aanbod)

**Rules:**
- Demand (V) slopes downward left-to-right
- Supply (A) slopes upward left-to-right
- Price on Y-axis, Quantity on X-axis
- Equilibrium at intersection, marked with a dot (r=4)
- Dashed lines from equilibrium to both axes
- Do NOT label the equilibrium point with text like "Evenwicht" — the dot + dashed lines are sufficient
- Label curves at their endpoints: "V" (demand), "A" (supply)
- **For surplus graphs (CS/PS):** extend both V and A lines all the way to the Y-axis (price axis), so the surplus triangle is fully enclosed. The V-line must reach the Y-axis to form the top of the CS triangle. The A-line must reach the Y-axis to form the bottom of the PS triangle.

**Shift arrows (verschuivingspijlen):**
- Always draw shift arrows **horizontally** (never diagonal along the curve)
- Keep them **short** (40-60px) — they indicate direction, not magnitude
- Place them **away from the equilibrium** point, roughly at 1/3 from the endpoint of the curve, in a quiet area with few other elements
- Never place a shift arrow near the intersection/equilibrium — that area is already visually busy with dots and dashed lines

**Tax/subsidy shift:**
- Tax: supply shifts UP (parallel), old supply becomes dashed
- Subsidy: supply shifts DOWN
- Show old equilibrium (dot, dashed lines) and new equilibrium
- Label price levels on Y-axis (e.g., €11, €15)
- Show the tax/subsidy bracket **to the LEFT of the Y-axis** (outside the plot area), not inside the graph where it overlaps with curves. Use a vertical bracket or line segment at approximately x=65..75 showing the height of the tax/subsidy between the two price levels.

**MANDATORY: Compute intersection points mathematically.**

For two straight lines defined by endpoints, compute the intersection — never estimate visually.

```javascript
// Line from (x1,y1) to (x2,y2): y = y1 + ((y2-y1)/(x2-x1)) * (x - x1)
// Rewrite as: y = mx + b  where m = (y2-y1)/(x2-x1), b = y1 - m*x1
//
// Intersection of line1 (m1,b1) and line2 (m2,b2):
//   x = (b2 - b1) / (m1 - m2)
//   y = m1 * x + b1

function lineParams(x1, y1, x2, y2) {
  const m = (y2 - y1) / (x2 - x1);
  return { m, b: y1 - m * x1 };
}

function intersect(line1, line2) {
  const x = (line2.b - line1.b) / (line1.m - line2.m);
  const y = line1.m * x + line1.b;
  return { x: Math.round(x), y: Math.round(y) };
}

// Example: demand (130,55)→(620,260), supply (150,250)→(550,60)
// const d = lineParams(130, 55, 620, 260);  // m=0.418, b=0.6
// const s = lineParams(150, 250, 550, 60);  // m=-0.475, b=321.25
// intersect(d, s) → { x: 359, y: 151 }
```

Place equilibrium dots at the computed (x, y). Place dashed reference lines from (x, y) to (x, yAxis) and from (x, y) to (xAxis, y).

**Annotation placement (MANDATORY):**
- Brackets showing distances (vraagoverschot, aanbodoverschot, belastingwig, quotum, etc.) must NEVER overlap with curve labels or Q-labels on the X-axis
- Place horizontal brackets (vraagoverschot, aanbodoverschot) **below the X-axis** (y=320..340), not inside the plot area where they collide with lines
- Place vertical brackets (tax height, subsidy amount) **left of the Y-axis** (x=55..75), not inside the plot area
- When a label would overlap with lines inside the graph, move it outside the axes where there is whitespace
- General rule: the area outside the axes (left of Y-axis, below X-axis) has more free space — use it for annotations

**Common mistakes to avoid:**
- Equilibrium dots not on the actual intersection of the lines (use computation above)
- Curves that cross the axes at wrong points
- Supply and demand with identical slopes
- Tax shift that's too small to see (make it clearly visible)
- Missing axis labels
- Labeling the equilibrium point with "Evenwicht" text (the dot + dashed lines suffice)
- Placing brackets/annotations inside the plot area where they overlap with curves

### B. Cost Curves (MK, GTK, GVK)

**Rules:**
- MK (marginale kosten): starts high at low Q, dips down, then rises — a valley (dal) shape, with the minimum at the left side
- GTK (gemiddelde totale kosten): valley-shaped (dal) — starts high, curves DOWN to a minimum, then rises again. Think of it as a valley/U viewed normally: the curve goes DOWN first, reaches a minimum, then goes UP. The minimum is the break-even price.
- GVK (gemiddelde variabele kosten): same valley shape as GTK but lower, minimum = shutdown point
- MK crosses GTK at GTK's minimum (this is mathematically required)
- MK crosses GVK at GVK's minimum

**For volkomen concurrentie (price-taker):**
- Horizontal price line = MO = GO = P (label the line with ALL its names, e.g. "P = MO = GO")
- If price > GTK minimum: PROFIT. The firm produces at Q* where P = MK (rising part of MK).
  Profit area = rectangle from Q=0 to Q=Q*, between price line (top) and GTK curve (bottom).
  The break-even point is where P = GTK minimum (the bottom of the GTK valley).
- If price < GTK minimum but > GVK minimum: LOSS. The firm still produces at Q* where P = MK.
  Loss area = rectangle from Q=0 to Q=Q*, between GTK curve (top) and price line (bottom).
  The shutdown point is where P = GVK minimum.
- Q* is ALWAYS on the RISING part of the MK curve (right of MK minimum), never on the falling part.

**CRITICAL rules for cost curve graphs:**
1. The break-even point is at GTK MINIMUM — where MK crosses GTK. Label it correctly.
2. Q* (production quantity) is where the horizontal price line intersects the RISING part of MK.
3. The profit/loss area is a rectangle, NOT a triangle. It spans from Q=0 to Q*.
4. Label ALL curves: every line in the graph must have a label. MK, GTK, GVK, P=MO must all be labeled.
5. Keep the price line label "P = MO" INSIDE the SVG viewport — if it would be clipped at the right edge, place the label at mid-graph or left of the line.
6. Do NOT write "prijsnemer" or other annotations on top of curves or labels.

**For split-panel graphs (markt links, bedrijf rechts):**
- Left panel: label ALL curves (V, A). Show equilibrium with dot + dashed lines. If there's an MK curve in the market panel, label it too.
- Right panel: the horizontal price line must show its full label "P = MO = GO" clearly inside the panel (not clipped at the edge).
- Use a simple arrow (→) between panels to show the price connection.
- Keep each panel clean: maximum 3-4 curves per panel. If more complex, split into multiple slides.

**Common mistakes to avoid:**
- GTK that doesn't have a clear valley shape (dal)
- MK not crossing GTK at its minimum
- Loss/profit area in the wrong location or wrong shape
- GVK above GTK (impossible — GTK = GVK + GCK)
- Break-even point NOT at GTK minimum
- Q* on the falling part of MK (must be on rising part)
- Unlabeled curves — every curve needs a label
- Labels clipped at SVG viewport edges
- Too many labels/annotations crowding the graph — if it gets busy, simplify or split into multiple graphs

### C. Reaction Lines (Cournot-duopolie)

**Rules:**
- Axes: q1 on X-axis, q2 on Y-axis (quantities of firm 1 and 2)
- Reaction line R1: slopes downward from Y-intercept to X-intercept (firm 1's best response)
- Reaction line R2: slopes downward from Y-intercept to X-intercept (firm 2's best response)
- R1 color: demand blue (#1A5276), R2 color: supply green (#1E8449)
- Nash equilibrium: dot at intersection of R1 and R2, labeled "Nash-evenwicht"
- Optional: kartel point closer to origin (lower total output), labeled "Kartel"
- Optional: 45° symmetry line as dashed gray line
- Compute intersection mathematically using `lineParams()` + `intersect()`
- Use the standard plot area layout (x=80..680, y=45..310)

### D. Production Possibility Frontier (PPF / Transformatiecurve)

**Rules for side-by-side PPF (two countries):**
- Use SVG viewBox "0 0 720 360" — split into two panels
- Left panel: x=40..340 (Land A), Right panel: x=380..680 (Land B)
- Each panel has its own axes with product names on X and Y
- PPF line: straight line from Y-intercept to X-intercept (linear PPF for comparatief voordeel)
- Colors: Land A = demand blue (#1A5276), Land B = supply green (#1E8449)
- Label opportunity costs below each panel
- Panel titles centered above each panel, font-size="13", bold

### E. Side-by-Side Market Panels (Prijsdiscriminatie, etc.)

**Rules:**
- Use SVG viewBox "0 0 720 360" — split into two panels
- Left panel: x=40..340, Right panel: x=380..680
- Each panel gets its own V, A (or V, MO, MK) curves with independent axes
- Share Y-axis scale when comparing prices between panels
- Panel titles: centered above each panel (e.g., "Deelmarkt A (inelastisch)")
- Use consistent colors: demand = blue, MO = purple, MK = amber in both panels
- Compute intersections independently per panel

### F. Flowcharts & Process Diagrams

**Rules:**
- Horizontal flow: left to right with arrow connectors
- Each step in a colored box with rounded corners (rx=6-8)
- Use different colors per step/category from the project palette
- Arrow connectors: stroke="#718096", marker-end with arrowhead
- Maximum 5-6 steps horizontally

### D. Comparison Diagrams (Before/After)

**Rules:**
- Side by side layout with clear "Before" / "After" labels
- Use a large arrow (→) between the two states
- Highlight the change with a contrasting color
- Add a summary box below with the key takeaway

### H. Bar Charts & Infographics

**Rules:**
- Horizontal bars for ranking/comparison (easier to read)
- Bars sorted from largest to smallest (top to bottom)
- Use graduating shades of one color family
- Labels directly on or next to bars (no legend needed)
- Include values at bar endpoints
- Captions or footnotes must go BELOW all bars with at least 15px gap — never overlap with the lowest bar
- Reserve bottom 30px of the SVG for captions (below y=330)

---

## PART 4: TYPOGRAPHY IN GRAPHS

```
Title:      font-size="14", font-weight="bold", fill="#1E2761"
Axis label: font-size="12", fill="#718096"
Curve label:font-size="11-12", font-weight="bold", fill=[curve color]
Value label:font-size="10-11", fill="#2D3748" or "#718096"
Caption:    font-size="10-11", fill="#718096"
Legend:     font-size="10", fill="#2D3748"
```

Always use `font-family="Arial"`. Never use serif fonts in graphs.

---

## PART 5: QA CHECKLIST

### Every economic graph
1. Are axes labeled correctly? (Price/Prijs on Y, Quantity/Hoeveelheid on X)
2. Does the demand curve slope downward? Does the supply curve slope upward?
3. **Are equilibrium points computed from line equations (not estimated)?** Verify the dot coordinates satisfy both line equations.
4. Are price/quantity labels at the correct positions on axes?
5. Do dashed reference lines go from the equilibrium to both axes — and do they align exactly with the dot?
6. Are all curves labeled at their endpoints?

### Mandatory economic correctness verification
After computing coordinates, verify the economics:
1. **Supply/demand**: Does equilibrium show the correct market outcome? (higher supply → lower price, tax → higher price)
2. **Monopolist**: Is Q* at MO=MK? Is P* read from the DEMAND curve at Q* (not from MO or MK)?
3. **Cost curves**: Does MK cross GTK at GTK's minimum? Is the loss/profit area between the correct curves?
4. **Welfare loss**: Is the triangle between demand, MK, and the quantity restriction?
5. For each computed coordinate: **substitute back into the line equations** and verify it satisfies both.

### Mandatory visual verification
After generating any SVG with economic curves:
1. **Render the SVG to PNG** using `sharp(Buffer.from(svg)).resize(720).png().toBuffer()`
2. **Visually inspect** the rendered image: do dots sit exactly on line intersections?
3. If dots appear off the lines, recompute using `lineParams()` + `intersect()` from PART 3A
4. **Cross-check**: do the SVG hardcoded coordinates match the computed values? (This catches copy-paste errors where computation is correct but SVG uses old values.)
5. **Never deliver** a graph without completing both the economic and visual checks

### Cost curve graphs
7. Is the GTK curve U-shaped with a clear minimum?
8. Does MK cross GTK at GTK's minimum point?
9. Is the loss/profit area correctly positioned and labeled?
10. If GVK is shown: is it below GTK everywhere?

### Tax/subsidy graphs
11. Does the supply curve shift in the correct direction? (tax = up, subsidy = down)
12. Is the old curve shown as dashed?
13. Is the tax/subsidy bracket clearly visible?
14. Are both old and new equilibrium prices labeled?

### All visuals
15. Is the graph readable at the rendered size? (no text smaller than 10px)
16. Does it use only palette colors? (no random colors)
17. Is there a title at the top?
18. Would a student understand it in 5 seconds?

**If any answer is "no", fix before delivering.**

---

## PART 6: SIZING FOR DIFFERENT CONTEXTS

| Context | SVG viewBox | Render width | Image size in output |
|---------|-------------|-------------|---------------------|
| Word doc (tight margins) | 720 × 360 | 720px | w=482pt, h=241pt (full content width) |
| Word doc (standard margins) | 720 × 360 | 720px | w=434pt, h=217pt (full content width) |
| **PowerPoint slide** | **720 × 360** | **720px** | **w=8.5", h=4.25", centered on slide** |
| HTML page | 720 × 360 | inline SVG | 100% container width |

### PowerPoint insertion (MANDATORY)

When inserting a graph PNG into a PptxGenJS slide:

```javascript
// Convert SVG to PNG buffer first
const pngBuf = await svgToPng(svgString, 720);
const base64 = "image/png;base64," + pngBuf.toString("base64");

// Insert at near-full slide width, vertically centered in content area
slide.addImage({
  data: base64,
  x: 0.75,    // inches from left (centered with 0.75" margins)
  y: 0.9,     // below the header bar
  w: 8.5,     // inches — nearly full slide width
  h: 4.25,    // inches — proportional to viewBox 720:360
});
```

**CRITICAL:** The graph must fill most of the slide. Never insert a small image with large whitespace around it. Minimum width: **8 inches** on a 10-inch slide.

**Key rule:** visuals should always be as wide as the text content. Never smaller.

---

## NEVER DO

- Use curved supply/demand lines (they should be straight unless explicitly modeling non-linear functions)
- Place labels inside the graph area where they overlap with curves
- Use more than 4-5 colors in one graph
- Add decorative elements (clipart, icons, backgrounds)
- Make text smaller than font-size="10"
- Use a white background without the light gray (#F7FAFC) canvas
- Forget to label axes or curves
- Show a GTK curve without U-shape
- Show MK not crossing GTK at its minimum
- Draw curves outside the plot area (x=80..680, y=45..310) — curves must stay within bounds
- Let axis labels overlap with price/quantity labels — maintain minimum 5px gap
- Use the old pale area colors (#EBF5FB etc.) — use the medium-intensity colors with fill-opacity="0.45"
- Insert a graph smaller than 8" wide on a PowerPoint slide — graphs must fill the slide
- Place the Y-axis label horizontally (it must be rotated -90° and positioned at x=15)
- Label equilibrium points with text "Evenwicht" — the dot + dashed lines are enough
- Draw shift arrows diagonally — shift arrows must always be horizontal
- Place shift arrows near the equilibrium — put them in a quiet zone at ~1/3 from curve endpoint
- Place brackets/annotations inside the plot area where they overlap with curves — use the space outside the axes instead
- Draw surplus triangles without extending V and A lines to the Y-axis — for CS/PS the lines must reach the price axis
- Draw GTK/GVK curves going upward (hill shape) — they must be valley-shaped (dal): high → minimum → high
- Let "Hoeveelheid (Q)" overlap with Q-value labels — if Q-labels are present, omit the axis title
- Let curve labels get clipped at the SVG viewport edge — all labels must be fully inside 0..720, 0..360
- Leave any curve unlabeled — EVERY curve must have a visible label
- Place break-even point anywhere other than GTK minimum (where MK crosses GTK)
- Choose Q* on the falling part of MK — Q* is always on the rising part
- Draw the profit/loss area as a triangle — it's a rectangle between price and GTK, spanning 0 to Q*
- Place captions or footnotes on top of bars in a bar chart

---

Apply this skill to the following task: $ARGUMENTS
