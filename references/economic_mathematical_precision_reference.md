# Economic and Mathematical Precision Reference

## Purpose

This file is the **source of truth** for economic and mathematical precision in this repository.
It is intended to be used for:

- writing new textbook paragraphs
- reviewing explanations, worked examples, and exercises
- testing graphs, tables, and formulas
- checking whether simplifications are economically valid and mathematically explicit

The core principle is simple:

> **Every explanation, graph, table, and formula must be both economically correct and mathematically explicit enough that a student cannot learn the wrong rule from it.**

---

## 1. General standard

A good explanation is not merely understandable. It must also be **precise about what changes, what stays constant, and under which assumptions the statement is true**.

Every section should be checked against four questions:

1. **What variable changes?**
2. **What is held constant?**
3. **Is the statement exact or a school-level simplification?**
4. **Do the text, graph, table, and formula say the same thing?**

If any of those four questions cannot be answered clearly, the explanation is not yet precise enough.

---

## 2. Non-negotiable precision rules

### 2.1 Distinguish the economic object precisely

Always state clearly whether the text refers to:

- an **individual consumer** or the **market as a whole**
- an **individual producer** or the **market as a whole**
- a **quantity demanded/supplied at a given price** or the **entire curve**
- a **movement along a curve** or a **shift of the curve**

Do not allow sentences that blur those distinctions.

**Good**
- "The demand curve shows the relationship between price and quantity demanded, while other factors are held constant."
- "A change in the own price causes a movement along the curve."
- "A change in income shifts the entire demand curve."

**Bad**
- "Demand only depends on price."
- "The line changes because the price changed," when the intended meaning is a movement along the line.

---

### 2.2 State the ceteris paribus condition explicitly

Whenever a curve is introduced, the text must make clear that it shows the relationship between two variables **while other relevant factors remain constant**.

This matters especially for:

- individual demand
- market demand
- supply
- cost or revenue relationships

The phrase does not need to be repeated in every sentence, but it must be clear early in the explanation and must remain consistent throughout.

---

### 2.3 Text, graph, table, and formula must match exactly

If the text says:

- price rises from €2 to €3
- quantity changes from 1000 to 700

then the graph and any table must show the same values, unless the graph is explicitly stated to be schematic.

Allowed options:

- **Exact numerical graph**: text and graph must match exactly.
- **Schematic graph**: remove the misleading numbers and keep the graph conceptual.

Not allowed:

- a graph that looks numerical but does not match the text
- examples where the formula, table, and graph imply different values

---

### 2.4 Units must always be visible

Every variable and result must have units, either in the symbol definition or in the line of text.

Examples:

- `P` in euros
- `Q` in loaves per week
- `TK` in euros
- `GTK` in euros per unit

Check explicitly for:

- axis labels
- table headers
- formula context
- final answers in worked examples

---

## 3. Demand-side precision

### 3.1 Willingness to pay and the buying rule

For discrete units, the buying rule is:

> Buy a unit if willingness to pay is **greater than or equal to** the market price.

This equality condition matters. If equality is allowed in the text, the graph should not visually suggest the opposite.

For step functions, the endpoint convention should be clear enough that students can tell whether equality counts as buying.

---

### 3.2 A downward-sloping demand curve is a model statement

For this repository, the standard school-level statement is:

> The demand curve slopes downward: at a higher price, the quantity demanded is lower, ceteris paribus.

But this should be understood as the **model being taught**, not as a universal claim without qualification.

Use careful wording such as:

- "In this model, the demand curve slopes downward."
- "At this level, we represent demand as downward sloping."

Avoid unnecessarily absolute phrasing such as "always" unless the context clearly signals that this is a simplifying classroom model.

---

### 3.3 Step demand versus smooth demand

For discrete purchases, an individual demand schedule may be represented as a **step function**.

For divisible goods or for large groups of consumers, demand may be represented as a **smooth downward-sloping curve**.

Important precision rule:

> A smoother curve does **not automatically** imply a **straight line**.

A linear demand equation such as

`Qv = -aP + b`

is a **convenient approximation or model choice**, not a consequence that follows automatically from divisibility or aggregation.

Therefore:

- "smooth" and "linear" must not be treated as synonyms
- if a straight line is used, that should be signposted as a simplification

---

### 3.4 Consumer surplus

Consumer surplus must be defined as:

> willingness to pay minus the price actually paid, for each purchased unit

When the price is above willingness to pay, the unit is not bought and its "surplus" is not counted in total consumer surplus.

The graph should make visually clear that only **purchased** units contribute to consumer surplus.

---

## 4. Movement along versus shift

This distinction is one of the highest-priority precision checks in the repository.

### 4.1 Demand

- **Own price of the good changes** -> movement along the demand curve
- **Anything else changes** -> shift of the demand curve

Standard demand shifters:

- income
- preferences
- price of substitutes
- price of complements
- expectations

### 4.2 Supply

- **Own price of the good changes** -> movement along the supply curve
- **Anything else changes** -> shift of the supply curve

Standard supply shifters:

- input prices
- technology
- number of sellers
- expectations
- government policy

### 4.3 Classification must use the economically correct category

Do not classify a change under a vague factor when a more precise factor is available.

Example:

- If petrol becomes more expensive and demand for bicycles rises, the most precise classification is **price of a substitute**, not merely "preferences changed".
- If lithium batteries become cheaper and supply rises, the most precise classification is **input prices**, not "technology improved".

---

## 5. Collective demand precision

### 5.1 Market demand is horizontal summation

Collective demand is obtained by **adding quantities at the same price**.

> Choose one price -> read each individual's quantity -> add the quantities.

Never add prices.

This rule must be stated verbally, shown graphically, and reflected in any formula work.

---

### 5.2 Piecewise logic matters when consumers leave the market

If one consumer drops out above a certain price, the market demand function changes.

Therefore:

- a single summed formula may only be valid on the price interval where all relevant consumers are active
- above or below a threshold price, the collective demand function may need to be **piecewise**

Bad practice:

- summing the full individual demand functions once and acting as if the result applies for all prices

Good practice:

- state the validity range explicitly
- note when one consumer's demand becomes zero
- define the new market demand function above that threshold

---

### 5.3 Kinks require slope language that matches the axes

When price is on the vertical axis and quantity on the horizontal axis, slope language must be handled carefully.

If more consumers are active below a threshold price, then a given price change produces a larger total quantity response. In the usual `P`-vertical, `Q`-horizontal graph, the market demand curve becomes **flatter**, not steeper.

This must be checked carefully whenever the text discusses:

- a kink in collective demand
- steepness versus flatness
- slope comparisons between individual and market curves

---

## 6. Supply precision

### 6.1 Upward-sloping supply is also a model statement

For this repository, the standard school-level statement is:

> At a higher price, firms are willing to supply more, ceteris paribus.

This should be presented as the model being taught, supported by profitability logic.

### 6.2 Supply shifts must be linked to producer logic

A supply shift is not just a directional graph event. The text should also say **why producers change behavior**.

Examples:

- higher input costs -> some firms are no longer willing to produce at the old price
- better technology -> lower cost per unit -> more supply at each price
- expected future price increase -> firms withhold stock now -> lower current supply

---

## 7. Cost precision

### 7.1 Use the cost vocabulary consistently

Required distinctions:

- `CK` or constant costs: do not vary with output
- `VK` or variable costs: do vary with output
- `TCK`: total constant costs
- `TVK`: total variable costs
- `TK`: total costs
- `GCK`: average constant costs
- `GVK`: average variable costs
- `GTK`: average total costs

Do not mix up total and average concepts.

### 7.2 Higher total cost is not the same as higher cost per unit

This is a common misconception and should be explicitly guarded against.

- `TK` often rises with output
- `GTK` may fall with output

Therefore statements like "producing more makes costs higher" are incomplete and often misleading.

The text must specify whether it means:

- total cost
- average cost per unit

### 7.3 Constant GVK is a modelling assumption, not a universal law

If the variable cost per unit is constant, then:

- `TVK` is linear in `Q`
- `GVK` is constant

But that must be signposted as a simplification.

Use wording such as:

- "In this chapter we assume constant variable cost per unit."
- "Under that assumption, GVK is constant."

Avoid wording that implies that GVK is generally constant in reality.

### 7.4 Spread effect must be explained causally

If `GCK` falls as output rises, the explanation should be causal:

> the same fixed cost is spread over more units

Do not merely say "the curve falls". State why.

### 7.5 Graph shape must follow formulas

If:

- `TCK` is constant, its line is horizontal
- `TVK = vQ`, it starts at the origin and is linear
- `TK = TCK + TVK`, it is parallel to `TVK` and starts at `TCK`
- `GCK = TCK / Q`, it falls and approaches zero without touching it
- `GTK = GCK + GVK`, it lies above `GVK`

Every graph must reflect those properties exactly.

---

## 8. Revenue, profit, and break-even precision

### 8.1 Revenue is not profit

This distinction must always be explicit.

- `TO` = total revenue = `P x Q`
- `Winst` = profit = `TO - TK`

A high revenue does not imply profit.

### 8.2 Average revenue equals price only under constant price

`GO = TO / Q = P`

This equality holds when all units are sold at the same constant price.

That assumption should be explicit.

### 8.3 Break-even formulas require explicit assumptions

The standard formula

`Q_break-even = TCK / (P - GVK)`

depends on:

- constant selling price per unit
- constant variable cost per unit

If those assumptions do not hold, the simple formula is not valid in that form.

### 8.4 Whole-unit interpretation matters

A calculated break-even output such as `714.3 loaves` is mathematically valid, but operationally a firm cannot sell 0.3 of a loaf in many contexts.

Therefore outputs should distinguish between:

- **theoretical algebraic break-even value**
- **practical minimum whole-number output to avoid loss**

Recommended wording:

- "The algebraic break-even point is 714.3 units. In practice, the firm must sell at least 715 whole units to avoid a loss."

---

## 9. Graph precision rules

### 9.1 Axes must be explicit

For market diagrams:

- price on the vertical axis
- quantity on the horizontal axis

For cost and revenue diagrams:

- euro amount on the vertical axis
- output on the horizontal axis

### 9.2 Labels must not create ambiguity

Graphs should label:

- the curve itself
- relevant points
- reference lines if used
- units or variable names on axes

A graph should never require the student to infer what a line represents from color alone.

### 9.3 Visual clutter should be minimized

Only include graphical elements that do instructional work.

Avoid:

- unexplained shaded regions
- decorative arrows that are not discussed in the text
- extra labels that duplicate without clarifying

### 9.4 Direct labeling beats detached explanation

Whenever possible, label the economically important event directly in or next to the graph:

- "movement along the curve"
- "shift to the right"
- "break-even"
- "profit"
- "loss"

### 9.5 Schematic versus exact graphs must be distinguished

A graph must be either:

- conceptual/schematic
- numerically exact

If a graph uses numbers, those numbers must correspond to the example.

---

## 10. Mathematical precision rules

### 10.1 Domains and non-negativity

Economic quantities are usually non-negative in these chapters.

Therefore functions should be interpreted with domain restrictions such as:

- `Q >= 0`
- relevant price intervals
- piecewise validity ranges

### 10.2 Algebra must preserve economic meaning

Formal algebraic steps are not enough. The result must also be interpreted economically.

Example:

- Solve for the price at which a consumer leaves the market
- Then state what happens to the market demand function above that price

### 10.3 Rounding must be justified

Whenever answers are rounded:

- state the exact result first if useful
- then explain the operational rounding rule

Examples:

- money: usually to cents
- quantities of indivisible goods: often up or down depending on context
- break-even output: round up for the minimum profitable whole-unit target

### 10.4 Equality conditions must be respected

If a rule says:

- buy when `BB >= P`
- break-even when `TO = TK`

then examples, graphs, and explanations must not contradict that equality rule.

---

## 11. Precision in exercises and assessments

### 11.1 Ask for the changed variable explicitly

Good questions specify what changes.

Examples:

- "The price of the good itself rises. Is this a movement or a shift?"
- "Income rises while the own price stays the same. What happens to the demand curve?"

### 11.2 If two things change at once, isolate them first

For simultaneous-change questions, the standard sequence is:

1. analyze change A in isolation
2. analyze change B in isolation
3. compare or combine the effects

This avoids cognitive overload and improves classification accuracy.

### 11.3 Exercises should test classification and explanation

Students should not only identify:

- movement vs shift
- left vs right
- increase vs decrease

They should also explain the producer or consumer logic behind the answer.

### 11.4 Graph tasks must specify whether exact plotting is required

A drawing task should clearly indicate whether the student should:

- sketch conceptually
- use exact coordinates
- calculate before drawing

---

## 12. Common failure patterns to detect in generated content

Use this section as a review checklist when generating new material.

### 12.1 Economic classification errors

- calling a substitute-price change a "preference" change
- calling an input-price change "technology"
- treating revenue as profit
- confusing total and average costs

### 12.2 Curve logic errors

- saying a change in own price shifts the curve
- saying a non-price factor causes movement along the curve
- forgetting piecewise market demand when consumers exit
- using wrong steepness/flatter language with `P` on the vertical axis

### 12.3 Graph-text mismatch

- graph numbers differ from the example text
- axes have the wrong units or no units
- a line is labeled in the text but not in the graph
- a graph visually suggests a different equality convention than the text

### 12.4 Formula-assumption mismatch

- using linear formulas without signaling linearity as an assumption
- using break-even formulas without constant price and constant variable cost assumptions
- presenting a summed demand function without a valid price range

### 12.5 Pedagogical overcompression

- too many new terms in one section
- introducing formulas before the underlying logic
- giving table, graph, and text that merely duplicate rather than clarify

---

## 13. Build checklist for new chapters or paragraphs

Before accepting any new paragraph, check the following.

### Economic correctness

- [ ] Is the economic object clear: individual, firm, or market?
- [ ] Is the changed variable identified precisely?
- [ ] Is movement vs shift classified correctly?
- [ ] Are factor categories economically precise?
- [ ] Are assumptions explicit where needed?

### Mathematical correctness

- [ ] Do the formulas match the numbers in the example?
- [ ] Are domains or validity ranges stated where needed?
- [ ] Are averages, totals, and units distinguished correctly?
- [ ] Is rounding handled explicitly?
- [ ] Does the algebra lead to the correct economic interpretation?

### Graph correctness

- [ ] Do graph, text, and table match exactly?
- [ ] Are the axes labeled with variables and units?
- [ ] Are slope/steepness descriptions consistent with the axes?
- [ ] Is the graph schematic or exact, and is that clear?
- [ ] Is there any unnecessary clutter?

### Pedagogical clarity

- [ ] Does the section start from a concrete economic question?
- [ ] Are concepts introduced in a manageable order?
- [ ] Are common misconceptions addressed explicitly?
- [ ] Does each representation add something distinct?
- [ ] Are exercises aligned with the concept just taught?

---

## 14. Recommended wording templates

### Curves
- "The curve shows the relationship between X and Y, while other relevant factors remain constant."
- "A change in the own price causes a movement along the curve."
- "A change in a non-price factor shifts the entire curve."

### Market demand
- "At each price, add the individual quantities horizontally."
- "Above this price, consumer B no longer buys, so the market demand function changes."

### Costs
- "Total cost rises with output, but average cost per unit may fall because fixed costs are spread over more units."
- "In this section we assume constant variable cost per unit, so GVK is constant."

### Break-even
- "Break-even means total revenue equals total cost."
- "The algebraic break-even level is X units; in practice the firm must sell at least Y whole units to avoid a loss."

---

## 15. Repository policy

When this file conflicts with looser wording elsewhere in the repository, **this file takes precedence** for economic and mathematical precision.

If a choice must be made between:

- slightly simpler wording that risks teaching a false rule
- slightly more careful wording that preserves the correct rule

choose the more careful wording.

The teaching material may simplify, but it may not simplify in a way that creates a wrong economic rule.
