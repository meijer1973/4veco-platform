# Book 2 Outline: Costs, Revenue, Elasticity, And Surplus

Outline ID: `book-2`

Version: `book-2-outline-v3-review-ready`

Status: `approved_with_holds`

Audit outcome: `VALID_WITH_DERIVED_OUTLINE_REQUIRED`

Owner approval: `approved`

## Authority and freshness

This is a derived planning authority between the owned course blueprint and
chapter/paragraph planning. It does not supersede the blueprint, target
registry, pedagogical boundaries, or Part A exercise contract.

| Priority | Source | Pinned SHA-256 | Controls |
|---:|---|---|---|
| 1 | `references/owned/course-blueprint-v6-three-year.md` | `72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e` | Three-year purpose, Book 2 role, later-book dependency, operation-family trajectory. |
| 2 | `references/owned/course-blueprint-v5.md` | `61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7` | Active Year 1 Book 2 IDs, order, kinds, topics, and source statuses. |
| 3 | `references/authored/course-target-exercises.json` | `33928e7929fa1c9af86159b07769e2f01d28963873ef34c40e55c2001feb87ac` | Current paragraph goals, target operations, contexts, records, and review evidence. |
| 4 | `references/owned/course-blueprint-pedagogical-boundaries.md` | `47a9d1ee203efe4b94eb360e696f071ae66bfda1192b389b59e22b9d64e8f5a7` | Prior-teaching classifications, preview/familiarity boundaries, and later formal teaching. |
| 5 | `skills/econ-exercise-builder.md` | `27b8a1a09f3b87b57ce9608ccadfb0a5f32c47e62ae3436970aee58fc0464d5a` | Target-first Part A exercise sequence, support rules, and 55-minute route. |

Run `npm run check:book-outline-currentness` before using this outline. A
source-hash, target-record, row-order, status, workflow-pointer, or semantic
failure makes it stale. This Markdown file is the canonical human semantic
authority. The machine companion may pin identity, hashes, target records,
workflow surfaces, reviews, and hold state; it must not restate paragraph roles,
prerequisites, retrieval, misconceptions, or other outline semantics.

The canonical semantic hash covers this Markdown after LF normalization with
the separately validated lifecycle status line, owner-approval line, and hold
projection replaced by stable markers. Lifecycle-only approval and hold-state
changes therefore do not silently revoke an approved semantic outline; every
excluded lifecycle field is instead checked exactly against metadata on every
run.

Planning additionally evaluates the intended action and paragraph/chapter
scope. An open hold blocks only a matching action in matching scope. A released
hold remains visible with release evidence and no longer blocks. Approval mode
still fails while owner approval is pending.

## Purpose and position in the course

Book 2 turns the market foundations from Book 1 into three connected economic
calculation-and-interpretation systems:

1. how a firm's costs, revenue, profit, break-even point, and marginal changes
   can be calculated and explained;
2. how demand responsiveness can be calculated, classified, and connected to
   revenue and multi-variable demand; and
3. how willingness to pay, supply/marginal cost, and equilibrium become
   consumer surplus, producer surplus, total surplus, and welfare loss.

The route deliberately precedes Book 3. Students need Book 2's calculation,
elasticity, and surplus foundations before government intervention and market
structure can be taught at full procedural and welfare depth.

The book is exercise-first: paragraph goals and instruction must be designed
backward from the current reviewed target operations. This outline constrains
that work but does not itself prove student attainment or approve a target.

## Entry prerequisites from Book 1

### Curricularly prior operations eligible for bounded retrieval

Every Part A paragraph foundation check classifies each incoming prerequisite
at paragraph level as exactly one of:

1. `previously_taught_probably_secure`;
2. `previously_taught_retrieval_required`;
3. `previously_taught_not_secure_enough_to_assume`;
4. `preview_or_familiarity_only`; or
5. `new_formal_learning`.

Curricular placement proves only that an operation was taught or previewed. It
does not prove learner security. The plan must name the evidence or support
decision behind its classification.

| Book 1 source | Book 2 use | Retrieval boundary |
|---|---|---|
| §1.1.2 percentages and index numbers | Percentage change in elasticity and comparisons across values. | Reactivate the percentage base/sign convention; do not reteach it as new Book 2 theory unless evidence shows a learner need. |
| §1.1.3 graphs and tables | Read/calculate from cost, revenue, elasticity, demand/supply, and surplus representations. | Retrieval may test reading and plotting already-taught forms; a new Book 2 economic meaning still needs explicit teaching. |
| §1.2.1 willingness to pay and individual demand | Demand interpretation and the entry to consumer surplus. | Reactivate willingness to pay; formal surplus area and welfare meaning remain new in §2.3.1. |
| §1.2.2 demand factors, substitutes, and complements | Explain elasticity determinants and later cross-elasticity signs. | Familiar contextual labels may be retrieved; formal elasticity classification is taught in Book 2. |
| §1.2.3 collective demand and linear demand functions | Multi-variable demand work and quantity calculation. | Keep ceteris-paribus changes explicit; do not assume a new multivariable procedure is secure. |
| §1.3.1 supply | Producer-surplus and supply-as-marginal-cost bridge. | Supply interpretation may be retrieved; the marginal-cost/welfare meaning is formal Book 2 teaching. |
| §1.3.2 equilibrium and surplus/shortage | Welfare diagrams, transaction quantity, and comparison with forced prices. | Algebraic/graphical equilibrium may be retrieved; deadweight loss and Pareto claims are new formal learning. |
| §1.3.3 new equilibrium after shifts | Later transfer and Book 3 preparation. | Use only when it supports a Book 2 target without displacing its operation chain. |
| §1.1.4, §1.2.4, §1.3.4 mixed work | Source selection, calculation with units, graph/table evidence, and short economic conclusions. | Consolidation evidence supports retrieval design; it does not authorize unlisted new economic operations. |

Every paragraph plan must recheck that the selected prerequisite was actually
taught and is applicable to the current representation. The label "Book 1"
alone is not evidence.

### Familiarity or preview that is not an assumable prerequisite

- Book 1 supplied-formula encounters with costs, revenue, or profit do not
  shorten formal teaching in Chapter 2.1.
- Book 1 consumer-surplus intuition does not replace the graphical and
  calculation route in §2.3.1.
- Book 1 use of normal/inferior terminology does not replace `Ei` sign-first
  classification in §2.2.3.
- Seeing a step-function demand representation does not make step-function
  construction or analysis a Book 2 prerequisite unless a reviewed target
  explicitly requires it.

## Book exit expectations

After approved teaching and target-equivalent evidence across Book 2, students
should be able to:

- select, calculate, label, and interpret total/average cost and revenue
  relations, profit, break-even, and marginal changes;
- calculate and interpret price, income, and cross elasticities, including
  correct sign/magnitude classifications and bounded revenue advice;
- use tables, functions, and graphs with ceteris-paribus reasoning;
- calculate and interpret consumer, producer, total surplus, and deadweight
  loss under explicit transaction assumptions; and
- write short economic conclusions that connect calculation, unit,
  classification, representation, and source evidence.

These are course-route expectations, not an attainment claim from this document.
Book completion evidence must come from the approved targets and reviewed
student work. The resulting foundation supports Book 3 work on intervention,
price controls, taxes/subsidies, competition, and monopoly.

## Chapter spine

| Chapter | Purpose | Progression | Exit dependency |
|---|---|---|---|
| 2.1 Costs and revenue | Build the firm's calculation language and connect levels, averages, graphs, break-even, and marginal change. | classify/formulate → calculate/interpret → compare increments → integrate and select operations | Supplies revenue and marginal-cost language to elasticity/welfare work and later firm/market-structure analysis. |
| 2.2 Elasticity | Turn Book 1 percentage/demand foundations into responsiveness measures, revenue consequences, and multi-variable demand reasoning. | calculate/classify `Ev` → connect `Ev` to revenue → extend to `Ei`, `Ek`, and functions → integrate and advise cautiously | Supplies responsiveness reasoning to later intervention, incidence, pricing, and market analysis. |
| 2.3 Surplus and welfare | Formalise buyer/seller welfare and use equilibrium plus marginal-cost meaning to reason about total surplus and welfare loss. | formal CS → add PS/TS and supply-as-MC → compare constrained transactions/Pareto/DWL → integrate | Supplies the welfare baseline required before Book 3 intervention and market-structure evaluation. |

## Dependency route

```text
Book 1 percentages + demand ----------------------> 2.2.1 -> 2.2.2 -> 2.2.3 -> 2.2.4
Book 1 graphs/tables -------> 2.1.1 -> 2.1.2 -> 2.1.3 -> 2.1.4
                                      |                |
                                      |                +---- marginal-cost bridge ----+
Book 1 WTP + demand + supply + equilibrium ----------> 2.3.1 -> 2.3.2 -> 2.3.3 -> 2.3.4
```

The arrows are prerequisite/teaching dependencies, not permission to skip
retrieval or review. Consolidation paragraphs introduce no new terminal theory.

## Paragraph role matrix

### 2.1 Costs and revenue

| Paragraph | Role and new formal teaching | Prior teaching, retrieval, and interleaving | Operation emphasis | Misconception boundary | Readiness and holds |
|---|---|---|---|---|---|
| **2.1.1 Kostenstructuren** | Establish fixed/constant versus variable costs; formulate `TCK`, `TVK`, `TK`; calculate `GCK`, `GVK`, `GTK`; explain spreading fixed costs and constant `GVK` only under a constant per-unit assumption. | Retrieve only a previously taught arithmetic, unit, table, or graph operation directly needed by the approved target and worked example. Book 1 cost/profit exposure is `preview_or_familiarity_only`. | Balanced formula construction/selection, two-quantity calculation with units, average-versus-total interpretation, trend explanation, and claim evaluation. | A cost category depends on how it changes with output, not on whether an invoice looks regular; `GVK` is not universally constant; `GCK` is not a fixed amount per product. | `DESIGN_PERMITTED_PRODUCTION_BLOCKED`: Issue #223 may redesign goals/target and obtain specialist review; approved goal use waits for `H-211-GATE0B1`, while production waits for the separately evidenced `H-211-TARGET-INTEGRATION`. |
| **2.1.2 Opbrengsten, winst en break-even** | Add `TO=P×Q`, `GO=TO/Q`, `winst=TO-TK`, algebraic break-even, and `TK`/`TO` graph zones. | Require completed §2.1.1 cost relations; retrieve Book 1 graph/function skills. Interleave units and total-versus-average language. | Formula choice, substitution, comparison, equation solving, graph construction/reading, break-even interpretation, and bounded profit conclusion. | Revenue/omzet is not profit; `GO=P` only under the stated price structure; break-even is zero profit, not zero costs/revenue. | `BLOCKED_TARGET_REPAIR`: target context has stale `§1.3.2` cross-reference; pin/repair the intended §2.1.1 dependency before paragraph approval. |
| **2.1.3 Marginale kosten en marginale opbrengsten** | Define and calculate `MK=ΔTK/ΔQ` and `MO=ΔTO/ΔQ`; interpret increments for linear and nonlinear totals; build marginal intuition. | Require §2.1.1–§2.1.2 totals and formulas; retrieve table differences and units. Interleave profit columns only as context, not a new decision rule. | Table completion, interval-normalised difference calculation, pattern comparison, unit interpretation, and explanation in words. | A row difference is not a per-unit marginal value when `ΔQ≠1`; constant `MO` follows only from constant price; marginal is not average; `MO=MK` output choice is not yet an approved target. | `BLOCKED_TARGET_PRECISION_REVIEW`: resolve interval wording; `H-213-OPC2` holds formal output choice outside this target. |
| **2.1.4 Gemengde opgaven** | Consolidate cost, revenue, average, profit, break-even, and marginal operation families without new theory. | Retrieve all approved Chapter 2.1 teaching; interleave source selection, units, graph meaning, and structured conclusions. | Decide which family applies, calculate accurately, compare sources/representations, and justify conclusions. | Do not turn consolidation into a fourth theory paragraph or equate post-break-even sales with equal marginal profitability. | `BLOCKED_UPSTREAM_CHAPTER`: production waits for §§2.1.1–2.1.3 holds and reviewed teaching. |

### 2.2 Elasticity

| Paragraph | Role and new formal teaching | Prior teaching, retrieval, and interleaving | Operation emphasis | Misconception boundary | Readiness and holds |
|---|---|---|---|---|---|
| **2.2.1 Prijselasticiteit** | Define `Ev=%ΔQv/%ΔP`; calculate with signs; classify by `|Ev|`; interpret magnitude and contextual determinants. | Explicitly retrieve §1.1.2 percentage change and §1.2 demand/substitute reasoning even though the target registry prior list is empty. | Percentage calculation, elasticity ratio, sign/magnitude classification, plain-language interpretation, and contextual comparison. Because both target contexts yield `|Ev|<1`, instruction/practice must also include one explicit `|Ev|>1` contrast. | Elasticity is a ratio, not the absolute change; negative `Ev` does not mean "inelastic"; classification uses magnitude while direction retains sign; necessity/luxury here is a determinant discussion, not `Ei` classification. | `READY_AFTER_OUTLINE_APPROVAL_WITH_FLAGS`: resolve `H-221-PRIOR` and `H-22-ELASTIC-CONTRAST` in the paragraph plan; neither authorizes target mutation. |
| **2.2.2 Elasticiteit en omzet** | Connect `Ev` to `TO=P×Q` before/after a price change and give bounded revenue advice. | Require §2.2.1 and retrieve §2.1.2 revenue. Reuse the cinema/petrol contexts deliberately, then interleave one explicit elastic contrast because both reused cases are inelastic. | Before/after revenue calculation, proportional comparison, causal explanation, rule completion, and cautious advice across both elastic and inelastic cases. | Omzet is not winst; an elasticity estimate does not prove unlimited future response, long-run retention, or optimal price; direction rules depend on the stated price movement. | `READY_AFTER_OUTLINE_APPROVAL_WITH_FLAG`: `H-22-ELASTIC-CONTRAST` must be closed in instruction/practice and the revenue-only boundary must pass review. |
| **2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit** | Extend to `Ei` and `Ek`, sign-first classifications, multi-variable demand functions, and ceteris-paribus predictions. | Require §2.2.1 percentage/elasticity procedure; retrieve §1.2.2 substitutes/complements and §1.2.3 demand functions. Interleave named numerator/denominator goods and units. | Calculate, sign/classify, substitute into a function, isolate one change, compare scenarios, and write bounded predictions. | For `Ei`, normal/inferior comes before necessity/luxury and the latter applies only to normal goods; for `Ek`, name whose demand and whose price; do not change multiple variables under a ceteris-paribus claim. | `READY_AFTER_OUTLINE_APPROVAL_WITH_LOAD_FLAG`: paragraph plan must stage the high operation load and preserve sign-first classification. |
| **2.2.4 Gemengde opgaven** | Consolidate `Ev`, revenue, `Ei`, `Ek`, demand functions, source selection, and bounded advice without new theory. | Retrieve all approved Chapter 2.2 teaching and §2.1.2 revenue; interleave irrelevant-data rejection and conclusion limits. | Select sources and operation families, execute calculations/classifications, compare representations, and synthesize cautious advice. | Multiple calculations do not by themselves prove profit or customer retention; consolidation must not introduce a new elasticity formula. | `BLOCKED_UPSTREAM_CHAPTER` until §§2.2.1–2.2.3 teaching and review pass. |

### 2.3 Surplus and welfare

| Paragraph | Role and new formal teaching | Prior teaching, retrieval, and interleaving | Operation emphasis | Misconception boundary | Readiness and holds |
|---|---|---|---|---|---|
| **2.3.1 Consumentensurplus** | Formalise individual differences between willingness to pay and price, aggregate CS, identify the graph area, calculate triangle area, and interpret buyer welfare. | Reactivate §1.2.1 willingness to pay, §1.1.3 graph reading, and §1.3.2 price/quantity relations. Book 1 CS exposure is `preview_or_familiarity_only`. | Solve quantity at price, draw/label, select the correct area, calculate with units, and explain welfare meaning. | CS is not revenue, profit, or the whole area under demand; continuous triangle calculation differs from simply counting buyers; a Book 1 intuition does not prove formal competence. | `BLOCKED_V5_TARGET_REVIEW`: migrated target must pass v5 review before paragraph production. |
| **2.3.2 Producentensurplus en totaal surplus** | Add PS, `TS=CS+PS`, supply-as-marginal-cost meaning, and a bounded equilibrium-welfare comparison. | Require §2.3.1; retrieve §1.3 supply/equilibrium and interleave §2.1.3 marginal-cost meaning. | Solve equilibrium, draw/label two areas, calculate CS/PS/TS, connect supply to marginal cost, and justify a bounded welfare conclusion. | PS is not profit; supply-as-MC requires the stated competitive/marginal interpretation; maximum TS is not the same as equal distribution or a complete social-welfare judgment. | `BLOCKED_V5_TARGET_REVIEW`: migrated target and the supply-as-MC bridge require economics/teacher review. |
| **2.3.3 Pareto-efficiëntie en welvaartsverlies** | Compare equilibrium with an explicitly constrained transaction outcome; define Pareto efficiency; identify/calculate DWL. | Require §2.3.2; retrieve shortage/surplus and transaction-quantity logic from §1.3.2. Interleave CS/PS/TS area accounting. | Calculate `Qd`, `Qs`, actual transactions under an explicit rule, recompute areas/TS, calculate loss, shade the lost triangle, and explain conditions. | A quoted price alone does not determine traded quantity; an unbound/non-binding price need not create DWL; Pareto efficiency is not fairness; policy mechanics belong to later Book 3 unless target authority expands. | `BLOCKED_V5_TARGET_AND_REFERENCE_REVIEW`: repair stale `§2.2.2` reference and qualify the any-price claim/transaction assumptions. |
| **2.3.4 Gemengde opgaven** | Intended consolidation across CS, PS, TS, equilibrium, constrained transactions, Pareto efficiency, and DWL, with no new theory. | Retrieve all approved Chapter 2.3 teaching and the relevant Book 1 graph/equilibrium route; interleave marginal-cost and source-evidence language. | Select areas and quantities, calculate with units, compare scenarios, and write a qualified welfare conclusion. | A single generic combined question is not a reviewed consolidation target; no new government-intervention theory may be smuggled into the mixed paragraph. | `BLOCKED_PLACEHOLDER_REPAIR`: current target is a placeholder and Chapter 2.3 has no lesson plan. |

### Canonical paragraph foundation dimensions

This table is semantic authority for the dimensions that every Part A
`X.Y.Z-textbook-plan.md` must copy by reference and apply. It must not be
duplicated into machine metadata.

| Paragraph | Incoming prerequisite classification | Explicit non-goals/deferred scope | Prepares for | Model conditions and relevant range |
|---|---|---|---|---|
| 2.1.1 | Arithmetic/units/table/graph operation: classify only if directly required by the approved target and worked example; Book 1 cost/profit exposure: `preview_or_familiarity_only`; cost structures/averages: `new_formal_learning`. | Revenue; profit; break-even; marginal costs; `MO=MK`; formal proportional/degressive/progressive cost classification. | §2.1.2; §2.1.3; §2.1.4; supply-as-MC bridge in §2.3.2. | Fixed/variable is relative to the stated time period and production/capacity range; total fixed cost may change when capacity changes; linear `TVK` and constant `GVK` are bounded assumptions, not universal laws. |
| 2.1.2 | §2.1.1 cost relations: `previously_taught_retrieval_required`; Book 1 graph/function operations: classify from evidence; revenue/profit/break-even: `new_formal_learning`. | Marginal costs/revenue; `MO=MK`; output optimization; formal cost-curve classification. | §2.1.3; §2.1.4; revenue retrieval in §2.2.2. | `GO=P` only under constant unit price; break-even conclusions apply to stated cost/revenue functions and range. |
| 2.1.3 | §2.1.1–§2.1.2 totals: `previously_taught_retrieval_required`; marginal ratios: `new_formal_learning`. | Formal profit-maximizing output choice; market-structure rules; calculus. | §2.1.4; supply-as-MC bridge in §2.3.2; later firm analysis. | `MK`/`MO` are interval-normalized `Δtotal/ΔQ`; constant `MO` needs constant price; conclusions stay within observed/stated intervals. |
| 2.1.4 | Approved §2.1.1–§2.1.3 operations: classify individually as secure, retrieval-required, or not secure enough to assume. | Any new terminal theory or unapproved optimization rule. | Chapter 2.2 revenue links; Chapter 2.3 marginal-cost links. | Each operation retains the conditions established in its theory paragraph. |
| 2.2.1 | Percentage change and demand reasoning: `previously_taught_retrieval_required`; elasticity ratio/classification: `new_formal_learning`. | Income/cross elasticity; profit optimization; universal causal claims. | §2.2.2; §2.2.3; §2.2.4. | Use stated original bases; sign represents direction and magnitude represents classification; estimates are local/context-bound. |
| 2.2.2 | §2.2.1 `Ev` and §2.1.2 revenue: `previously_taught_retrieval_required`. | Profit, optimal pricing, retention, or unlimited long-run response. | §2.2.4; later pricing/incidence reasoning. | Advice is revenue-only, conditional on the stated change and elasticity estimate. |
| 2.2.3 | §2.2.1 percentage/elasticity procedure and Book 1 demand factors/functions: `previously_taught_retrieval_required`; `Ei`/`Ek`: `new_formal_learning`. | Simultaneous causal inference; welfare effects; unrestricted forecasting. | §2.2.4; later multivariable demand work. | Ceteris paribus unless explicitly varied; `Ei` classification is sign-first; `Ek` names both goods. |
| 2.2.4 | Approved §2.2.1–§2.2.3 operations: classify individually from current evidence. | New formulas, profit claims, or causal generalizations. | Later integrated demand/pricing analysis. | Preserve every component operation's stated context and bounds. |
| 2.3.1 | Willingness to pay/graph/quantity operations: retrieval classification from evidence; Book 1 surplus intuition: `preview_or_familiarity_only`; formal CS: `new_formal_learning`. | Producer surplus; total surplus; Pareto efficiency; DWL. | §2.3.2; §2.3.3; §2.3.4. | Continuous-area calculation needs a stated linear demand segment and relevant traded quantity; discrete buyer sums remain distinct. |
| 2.3.2 | §2.3.1 and equilibrium/triangle operations: `previously_taught_retrieval_required`; supply-as-MC bridge: `new_formal_learning`. | Fairness conclusions; externalities; full policy mechanics. | §2.3.3; §2.3.4; Book 3 welfare analysis. | Supply-as-MC requires the stated competitive/marginal interpretation; maximum `TS` is a bounded efficiency claim. |
| 2.3.3 | §2.3.2 CS/PS/TS: `previously_taught_retrieval_required`; Pareto/DWL route: `new_formal_learning`. | Fairness proof; general government-intervention mechanics; claims without transaction/allocation assumptions. | §2.3.4; Book 3 price-control/tax/subsidy work. | State binding status, actual transaction quantity, and allocation/rationing assumption; a quoted price alone is insufficient. |
| 2.3.4 | Approved §2.3.1–§2.3.3 operations: classify individually from current evidence. | Any new intervention theory or unrepaired placeholder goal. | Later integrated welfare and policy analysis. | Preserve the transaction, area, and supply-as-MC conditions of the selected operations. |

## Retrieval and interleaving schedule

| Point in route | Required retrieval/interleaving intent |
|---|---|
| Start of 2.1.1 | Retrieve only a previously taught arithmetic, unit, table, or graph operation directly needed by the approved target and worked example; otherwise add no generic graph prerequisite. Teach cost relations in full. |
| 2.1.2 | Retrieve 2.1.1 totals/averages and Book 1 graphs; contrast revenue with cost and profit. |
| 2.1.3 | Retrieve total cost/revenue formulas; calculate marginal values across explicit intervals. |
| 2.1.4 | Cumulative Chapter 2.1 source selection and operation-family choice. |
| Start of 2.2.1 | Retrieve Book 1 percentage change and demand-factor reasoning. |
| 2.2.2 | Reuse `TO=P×Q` from 2.1.2 and elasticity from 2.2.1; keep advice revenue-bounded. |
| 2.2.3 | Retrieve percentage procedure and Book 1 substitutes/complements/functions; isolate variables. |
| 2.2.4 | Cumulative Chapter 2.2 multi-source selection, calculation, classification, and advice. |
| Start of 2.3.1 | Reactivate willingness to pay and graph/triangle reading; formalise surplus anew. |
| 2.3.2 | Retrieve equilibrium/supply and interleave marginal-cost meaning from 2.1.3. |
| 2.3.3 | Retrieve CS/PS/TS plus surplus/shortage transaction logic; state binding assumptions. |
| 2.3.4 | Cumulative Book 2 welfare route, with selected earlier calculation and elasticity links only where relevant. |

Retrieval must be compact and evidence-backed. If a prerequisite is not secure,
the paragraph plan must classify it as `previously_taught_not_secure_enough_to_assume`
and add support or hold the affected action; it may not relabel preview as secure.

## Operation balance

| Chapter | Calculation | Representation | Interpretation/reasoning | Selection/classification | Answer form |
|---|---|---|---|---|---|
| 2.1 | totals, averages, profit, break-even, marginal ratios | functions, tables, `TK`/`TO` graphs | total vs average vs marginal meaning; trends | choose cost/revenue/marginal family | formula → substitution → value/unit → conclusion |
| 2.2 | percentage changes, `Ev`, revenue, `Ei`, `Ek`, function values | tables, structured sources, multivariable functions | proportional response and bounded prediction | magnitude/sign classification and source relevance | named numerator/denominator → result → classification → economic meaning |
| 2.3 | equilibrium, triangle areas, CS/PS/TS/DWL | demand/supply and shaded welfare areas | buyer/seller welfare, transaction assumptions, Pareto limits | select quantity/area/scenario | quantity/area calculation → labelled unit → qualified welfare conclusion |

No chapter may collapse into arithmetic-only practice. Each target route needs
calculation or selection where required, representation use, interpretation,
units/labels, and a conclusion at the target's actual depth.

## Shared conventions

- Use canonical Dutch terminology from
  `references/authored/economie-terminologie.md`; translate source English into
  stable student-facing Dutch during paragraph production.
- State quantities and periods (`per stuk`, `per maand`, tickets, litres) and
  carry currency/percentage/surplus units through answers.
- Use `TCK`, `TVK`, `TK`, `GCK`, `GVK`, `GTK`, `TO`, `GO`, `MK`, `MO`, and
  `winst` consistently. Define every abbreviation at first use.
- Use `Q_v`/demand and `Q_a`/supply consistently with existing course notation;
  label both axes and equilibrium values on graphs.
- Marginal values across intervals use `Δtotal/ΔQ`; raw row differences are
  permitted only when `ΔQ=1` or are explicitly divided by the interval.
- Elasticity calculations name the original base, preserve the sign, and use
  absolute magnitude only for elastic/inelastic classification.
- `Ei` classification is sign-first. `Ek` answers name the demand good and the
  other good whose price changes.
- Multi-variable function comparisons change one stated variable at a time
  unless the task explicitly asks for a multi-change comparison.
- Welfare graphs label demand, supply/MC, price, quantity, CS, PS, and DWL as
  applicable. Area calculations identify base and height before substitution.
- A constrained-price welfare calculation states whether the constraint binds,
  how actual transactions are determined, and what allocation/rationing
  assumption is being used.
- Advice distinguishes revenue from profit and efficiency from fairness.
- Fixed and variable costs are classified relative to a stated time period and
  production/capacity range. Total fixed cost may change after a capacity
  change. Linear `TVK` or constant `GVK` is a bounded model assumption, not a
  universal cost law.

## Common misconception map

| Misconception | Required boundary response |
|---|---|
| Fixed cost means a fixed cost per unit. | Separate total fixed cost from falling average fixed cost. |
| Variable costs or `GVK` are always constant. | Tie constancy to the stated per-unit/function assumption. |
| Revenue equals profit. | Reconnect profit to both revenue and total cost. |
| Break-even means the firm has no costs. | Define it as `TO=TK` and profit zero. |
| Marginal means average or raw row difference. | Use extra total divided by extra quantity and label per-unit meaning. |
| A negative elasticity is automatically inelastic. | Preserve sign for direction; classify `Ev` by magnitude. |
| Normal/inferior and necessity/luxury are one classification step. | Apply sign first; necessity/luxury only within positive `Ei`. |
| Any positive `Ek`/negative `Ek` can be named without specifying goods. | Name demand good and price-changing good before classification. |
| Consumer surplus is firm revenue; producer surplus is profit. | Define each area/economic meaning and state the limits of the comparison. |
| Maximum total surplus proves fairness. | Distinguish efficiency from distribution and broader welfare judgments. |
| Any stated price away from equilibrium necessarily creates DWL. | Check binding status, transaction quantity, and allocation assumptions. |
| A preview in Book 1 means the Book 2 operation can be skipped. | Reactivate familiarity, then teach the formal Book 2 target in full. |

## Readiness and hold register

| Hold ID | Status | Scope | Blocks | Explicitly permits | Resolution actions | Transition binding | Release condition | Release evidence |
|---|---|---|---|---|---|---|---|---|
| `H-OUTLINE-OWNER` | released | `book:2` | `approved_outline_use`, `goal_owner_decision`, `approved_goal_use`, `target_authority_repair`, `target_authority_integration`, `paragraph_production`, `chapter_production`, `lesson_authoring`, `merge` | `outline_owner_decision`, `goal_design`, `target_design`, `specialist_review`, `chapter_planning` | `outline_owner_decision` | — | The owner approves an exact PR head and the approval pins are recorded. | resolved_via=outline_owner_decision; released_by=meijer1973; released_on=2026-09-02; evidence_ref=https://github.com/meijer1973/4veco-platform/pull/226#issuecomment-5515033629; subject_id=book-2-outline-v3-review-ready; subject_sha256=69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde; reviewed_pr=226; reviewed_head=2166cd074e1cb8d24f7908e9f792a996dbfd48e7 |
| `H-211-GATE0B1` | open | `paragraph:2.1.1` | `approved_goal_use`, `paragraph_production`, `lesson_authoring` | `goal_design`, `target_design`, `specialist_review`, `goal_owner_decision` | `goal_owner_decision` | approved_goal_package_sha256=pending; approval_ref=pending; approved_by=pending; approved_on=pending | The goal owner approves the exact hashed paragraph goal package with identity, date, and decision reference. | — |
| `H-211-TARGET-INTEGRATION` | open | `paragraph:2.1.1` | `paragraph_production`, `lesson_authoring` | `goal_design`, `target_design`, `specialist_review`, `target_authority_repair`, `target_authority_integration` | `target_authority_integration` | blocked_baseline_sha256=f01cd43c65e639e396a14b3dcfe5ed546ed7baa5cf8d2aa20a8bbe0c2c310de8; approved_replacement_sha256=pending; approval_ref=pending; approved_by=pending; approved_on=pending | The exact approved target record is current in the registry, its compact pin is refreshed, post-integration checks pass, and the integration commit is recorded. | — |
| `H-212-STALE-REF` | open | `paragraph:2.1.2` | `approved_goal_use`, `paragraph_production` | `goal_design`, `target_design`, `specialist_review`, `target_authority_repair`, `target_authority_integration` | `target_authority_integration` | blocked_baseline_sha256=51de36d4b150bcabb51b8391aff15bf5b68610f140b80d12ca3f021e663ae4b5; approved_replacement_sha256=pending; approval_ref=pending; approved_by=pending; approved_on=pending | The repaired dependency is current in the exact reviewed target record, its compact pin is refreshed, post-integration checks pass, and the integration commit is recorded. | — |
| `H-213-DELTAQ` | open | `paragraph:2.1.3` | `approved_goal_use`, `paragraph_production` | `goal_design`, `target_design`, `specialist_review`, `target_authority_repair`, `target_authority_integration` | `target_authority_integration` | blocked_baseline_sha256=e06c097e50cb44ea41357125f224a60124c5a4d17f7eaeafae769f15bfe683fd; approved_replacement_sha256=pending; approval_ref=pending; approved_by=pending; approved_on=pending | The approved interval-normalized wording is current in the target registry, its compact pin is refreshed, post-integration checks pass, and the integration commit is recorded. | — |
| `H-213-OPC2` | open | `paragraph:2.1.3`, `route:long` | `formal_output_choice_teaching` | `goal_design`, `specialist_review`, `target_authority_repair` | `target_authority_repair` | — | Governed authority decides whether and where OP-C2 is taught. | — |
| `H-221-PRIOR` | open | `paragraph:2.2.1` | `approved_goal_use`, `paragraph_production` | `goal_design`, `target_design`, `specialist_review`, `goal_owner_decision` | `goal_owner_decision` | — | An approved Part A plan pins retrieval and records any registry-normalization decision. | — |
| `H-22-ELASTIC-CONTRAST` | open | `paragraph:2.2.1`, `paragraph:2.2.2` | `approved_goal_use`, `paragraph_production` | `goal_design`, `target_design`, `specialist_review`, `goal_owner_decision` | `goal_owner_decision` | — | Approved instruction and practice include reviewed elastic-contrast evidence. | — |
| `H-231-V5` | open | `paragraph:2.3.1` | `approved_goal_use`, `paragraph_production` | `goal_design`, `target_design`, `specialist_review`, `target_authority_repair`, `target_authority_integration` | `target_authority_integration` | blocked_baseline_sha256=078536130e88c1bc9c6a58fc492dc47ccf7a411bafc8b49b9571e1de238f0388; approved_replacement_sha256=pending; approval_ref=pending; approved_by=pending; approved_on=pending | The exact v5-reviewed target record is current in the registry, its compact pin is refreshed, post-integration checks pass, and the integration commit is recorded. | — |
| `H-232-V5` | open | `paragraph:2.3.2` | `approved_goal_use`, `paragraph_production` | `goal_design`, `target_design`, `specialist_review`, `target_authority_repair`, `target_authority_integration` | `target_authority_integration` | blocked_baseline_sha256=d1dba16d567f77717277206c1e01de3d69de5f3e5c2c68783835a81c1f7b9ab8; approved_replacement_sha256=pending; approval_ref=pending; approved_by=pending; approved_on=pending | The exact v5-reviewed target and supply-as-MC boundary are current in the registry, its compact pin is refreshed, post-integration checks pass, and the integration commit is recorded. | — |
| `H-233-V5-REF` | open | `paragraph:2.3.3` | `approved_goal_use`, `paragraph_production` | `goal_design`, `target_design`, `specialist_review`, `target_authority_repair`, `target_authority_integration` | `target_authority_integration` | blocked_baseline_sha256=7ae371e71b3f805daa084c4a0ddf32498f8ded36acfc2f7e97a0d5f443a2d833; approved_replacement_sha256=pending; approval_ref=pending; approved_by=pending; approved_on=pending | The exact reviewed source repair and binding/transaction assumptions are current in the registry, its compact pin is refreshed, post-integration checks pass, and the integration commit is recorded. | — |
| `H-234-PLACEHOLDER` | open | `paragraph:2.3.4` | `approved_goal_use`, `paragraph_production` | `goal_design`, `target_design`, `specialist_review`, `target_authority_repair`, `target_authority_integration` | `target_authority_integration` | blocked_baseline_sha256=601f73e3ed958b4b6257e3ccad0a08c44138b2a2fa310bbcee8beedc120e856f; approved_replacement_sha256=pending; approval_ref=pending; approved_by=pending; approved_on=pending | The exact reviewed consolidation target is current in the registry, its compact pin is refreshed, post-integration checks pass, and the integration commit is recorded. | — |
| `H-BOOK2-ROOT-PLAN` | open | `book:2` | `book_readiness`, `whole_book_assembly` | `book_plan_repair`, `chapter_planning`, `specialist_review` | `book_plan_repair` | — | A lesson-authorized task creates and reviews the Book 2 root plan and records exact evidence. | — |
| `H-CHAPTER-23-PLAN` | open | `chapter:2.3` | `book_readiness`, `whole_book_assembly`, `chapter_production`, `paragraph_production`, `lesson_authoring` | `chapter_plan_repair`, `chapter_planning`, `goal_design`, `target_design`, `specialist_review` | `chapter_plan_repair` | — | A lesson-authorized task creates and reviews the Chapter 2.3 plan and records exact evidence. | — |
| `H-MERGE-GOVERNANCE` | open | `book:2` | `merge` | `merge_owner_decision` | `merge_owner_decision` | — | After applicable holds are released and exact-head CI passes, owner payload authorization and serialized integration evidence are recorded. | — |

The machine companion is the lifecycle authority for `status`, typed scope,
blocked actions, permitted actions, resolution actions, release condition, and
`release_evidence`; this table is its fully checked human-readable projection.
A released row is retained and must identify its single `resolved_via` action,
actor, date, and exact evidence reference. A target-integration release must also
pin `subject_id`, `subject_sha256`, and `integrated_commit`; production stays
blocked until those values match the current reviewed target record and compact
registry pin.
An open hold never blocks its own resolution actions. An open hold that is out
of scope, does not list the current action in `blocks`, or explicitly permits
that action does not block the foundation verdict.

## Gate 0B-0 readiness decision

The outline package is `review_ready_with_holds`, not approved. Its derived
sequence is suitable for teacher, economics, curriculum-sequencing, structural,
and owner review. §2.1.1 goal design, target design, and specialist review may
proceed as provisional Gate 0B-1 design. `outline_owner_decision` is the
resolution action for the owner hold; it is distinct from
`approved_outline_use`. No goal-owner decision, target-authority repair or
integration, paragraph/lesson production, merge, or approved-use claim is
permitted before the matching upstream holds release.

After human approval and governed integration:

1. update metadata to the approved exact outline version/hash;
2. refresh PR #224 from current main;
3. pin this outline in the Issue #223 paragraph plan;
4. evaluate the provisional §2.1.1 design for goal approval and target authority; and
5. keep every paragraph-specific and target-quality hold above in force until
   its own release condition is satisfied.

This outline does not authorize a merge, a lesson edit, target mutation,
student-facing output, or a student-attainment claim.
