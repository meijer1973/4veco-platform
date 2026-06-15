## Overall assessment

The work so far is a real improvement. The team has moved from a failing “patch the old shell” pattern to a governed Golden Exercise Workbench rollout with policy, exemplars, checkers, renderer variants, rendered output, and screenshot proof.

But it is still **early rollout**, not broad adoption. At this point, the project has proved three things:

1. A **graph/table exit ticket** can work in the Golden layout: `1.1.3`.
2. A **calculation/structured exit ticket** can work in the Golden layout: `1.1.2`.
3. A **simple advisory short check** can work in the Golden layout: `1.1.2-korte-check`.

It has **not** yet proved:

```text
all exit tickets can be migrated
all short checks can be migrated
1.1.1 can be migrated cleanly
graph-based advisory short checks can be migrated
A96-level calculation answer forms are fully implemented
mixed/gemengde target exercises are final
Year 1 is closed
Scale Gate 1 is available
student/product use is authorized
```

The main risk now is not “can they build the UI?” They can. The main risk is **premature broad rollout** before the route types, proof standards, and target-exercise base are strong enough.

---

## What has been achieved

### 1. The legacy-layout failure mode is now understood and guarded against

The original failure was that agents kept reusing the old exit-ticket shell. The pure legacy route used `et-topbar`, `et-page`, `id="exit-ticket-app"`, and legacy `skill-map-route.css`, `task-shell.css`, `exit-ticket.css`, `task-shell-ui.js`, and `exit-ticket-ui.js`. 

The failed hybrid route was even more dangerous because it mixed `ge-*` classes into the old shell: `ge-topbar et-topbar`, `ge-page et-page`, still with `id="exit-ticket-app"` and the legacy runtime stack. 

The working Golden route uses the correct direct root: `header.ge-topbar`, `main.ge-page[data-golden-ticket-root]`, `golden-ticket-layout.css`, and direct Golden runtime scripts. 

This is the central technical lesson:

```text
Golden Workbench is not a CSS patch.
It is a route architecture.
```

That standard is now reflected in the policy/checker work. PR #26 added the Golden Exercise policy checkers and negative fixtures for pure legacy routes, hybrid routes, legacy assets, fake graph controls, answer-giving placeholders, ordered formula tokens, hidden-token traps, and missing after-interaction proof. 

### 2. The first full Golden exit-ticket proof exists: 1.1.3

`1.1.3` is the graph/table Golden Ticket route. It is the first true design proof: source-left/task-right, graph construction, graph reading, claim control, local feedback, and rendered proof. The current route still has the correct direct Golden root and source/task structure. 

However, there is a known limitation: the implemented `1.1.3` route should be used as layout/graph/no-legacy reference, **not** as the formula-token exemplar. The team correctly quarantined the duplicate visible-token issue and preserved A96 as the formula-token standard in the exemplar promotion work. PR #25 explicitly says not to use implemented `1.1.3` as the formula-token exemplar because of the `oldQden` / `oldQnum` duplicate visible `oude Q` tokens. 

### 3. The second Golden exit-ticket proof exists: 1.1.2

PR #30 introduced `golden_calculation_structured_v1` and moved only `1.1.2-exit-ticket` to `layout.framework: golden_exercise_workbench`. It kept `1.1.1` unmigrated and kept `1.1.3` on the graph variant. 

Then PR #34 and lesson PR #9 turned that platform proof into rendered lesson output. The lesson route replaced the legacy `et-page` shell with `ge-topbar`, `main.ge-page[data-golden-ticket-root]`, `golden-ticket-layout.css`, `1.1.2-exit-ticket.js`, and `golden-ticket-layout.js`.  The deployed shared data now has the correct held authority posture: `gateApproved: false`, `completionLanguageEligible: false`, and `targetReadinessEvidence: false`. 

This is the first proof that the Golden Workbench can transfer beyond the original graph example.

The caveat: the `1.1.2` calculation UI is still a pragmatic structured-work version. It uses a textarea for “Methode, invulling en tussenstap” plus final answer and notation fields. That is acceptable as a transfer proof, but it is not yet the full A96 ideal of separate visible formula → substitution → final answer → notation → contextual conclusion steps.

### 4. Advisory short-check policy is now defined

PR #35 defined `golden_advisory_short_check_v1` as a policy-defined short-check variant. The policy clearly separates exit tickets from short checks: exit tickets are target-equivalent candidates, while advisory short checks are advisory, may be partial-skill, may include route advice, and must not claim target-equivalent proof or paragraph completion. 

The machine contract says this short-check variant is `policy_defined_no_route_migration`, has no real routes migrated, and does not authorize implementation migration by itself. 

That was a necessary intermediate step. It prevents agents from using short checks as cheap replacements for exit tickets.

### 5. The first rendered advisory short check exists: 1.1.2-korte-check

PR #38 and lesson PR #10 implemented and deployed the first Golden advisory short check. Platform #38 added `golden_advisory_short_check_v1` renderer support for ordinary advisory choice tasks, updated the 1.1.2 short-check source contract, and added rendered proof and screenshots.  Lesson #10 deployed the generated `1.1.2-korte-check` route and kept it advisory only. 

The lesson diff confirms the route is now Golden, not legacy: old `skill-map-route.css`, `task-shell.css`, `exit-ticket.css`, `et-topbar`, `et-page`, and `#exit-ticket-app` are removed; `golden-ticket-layout.css`, `ge-topbar`, `main.ge-page[data-golden-ticket-root]`, `1.1.2-korte-check.js`, and `golden-ticket-layout.js` are used instead. 

The source contract is also correct: `targetEquivalent.candidate: false`, `gateApproved: false`, `completionLanguageEligible: false`, `layout.variant: golden_advisory_short_check_v1`, `advisory.intent`, `hintsAbsent: true`, and route advice. 

This is a good first advisory proof. It is intentionally simple: multiple-choice advisory checks with context refs and route advice.

---

## Current capability map

| Surface                                          | Current state                                | Quality verdict           | Main limitation                                                        |
| ------------------------------------------------ | -------------------------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| `1.1.3` exit ticket                              | Rendered Golden graph/read/claim route       | Good Golden layout proof  | Formula-token part is quarantined; not formula-token exemplar          |
| `1.1.2` exit ticket                              | Rendered Golden calculation/structured route | Good transfer proof       | Calculation UI is still below full A96 standard                        |
| `1.1.2-korte-check`                              | Rendered Golden advisory choice short check  | Good first advisory proof | Only proves simple choice-based short checks                           |
| `1.1.1` exit ticket / short check                | Not migrated                                 | Unknown                   | Needs operation-fit analysis first                                     |
| `1.1.3-korte-check`                              | Source exists but not migrated               | Risky                     | Graph advisory variant has more complexity and should be planned first |
| mixed/gemengde opgaven `1.1.4`, `1.2.4`, `1.3.4` | Review/candidate lane in progress            | Not final                 | Current candidate lane is PR #42, not the abstract PR #41              |
| broad exercise rollout                           | Not authorized                               | Too early                 | Need route ledger, visual reviews, and target-exercise finalization    |

---

## Main weaknesses still present

### 1. Review communication is still too weak

The team merged several PRs with no PR review comments recorded. The state ledger they later produced helped, but this must become default practice for multi-lane work.

New rule should be:

```text
If more than one lane is active, every merged PR must update a post-merge ledger.
```

Without that, you lose the ability to tell whether a later packet supersedes an earlier packet.

### 2. The calculation route is not yet A96-level

The `1.1.2` exit ticket is a good rendered proof, but not the final calculation-answer-form standard. A96 remains stronger. The next calculation renderer should move toward explicit structured fields:

```text
formula/method
substitution with source values
intermediate step
final answer
unit/notation
contextual conclusion
```

Right now, the calculation work capture is serviceable but too compressed.

### 3. The short-check renderer is narrow

`golden_advisory_short_check_v1` currently works for ordinary choice tasks with context refs. That is fine. But it does not prove graph advisory checks, formula advisory checks, or reasoning-chain advisory checks.

Do not use it as a universal short-check renderer yet.

### 4. Target-exercise governance is behind the UI work

The UI is now ahead of the Year 1 target-exercise base. PR #39 and #41 show that Year 1 closure is still blocked by placeholders, migrated v5 review, 1.1.3 graph evidence closure, and missing-unit decisions. PR #41 is superseded by PR #42 for concrete placeholder candidates.  

That means the UI rollout should not outrun the target-exercise review lane.

### 5. Check-surface gate remains held

PR #44 is the current renewed evidence packet for `GATE-CHECK-SURFACE-EXCELLENT-1`; it explicitly does not close the gate or authorize product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1, or student/product use. 

So the check-surface packet must be reviewed before claiming the first surfaces are “excellent” or gate-ready.

---

## Recommended plan

### Phase 1 — Stabilize and review what is already implemented

Do not build new surfaces yet. First validate the current Golden surfaces.

#### Sprint 1: `GOLDEN-SURFACE-VISUAL-REVIEW-1`

Scope:

```text
1.1.2 exit ticket
1.1.2 advisory short check
1.1.3 exit ticket
shared golden-ticket-layout.js/css runtime
```

Tasks:

```text
- Visual review desktop/mobile/dark for all three rendered routes.
- Confirm no legacy/hybrid route structure.
- Confirm no old internal labels are visible.
- Confirm 1.1.2 exit-ticket completion remains authority-held.
- Confirm 1.1.2 short-check copy remains advisory.
- Confirm 1.1.3 graph behavior still uses the cleaned current behavior, not the old fake slope/connect-line behavior.
- Confirm route links work.
```

Acceptance:

```text
PASS: no visual/layout regression, no authority overclaim, no legacy shell.
REVISE: visual issues or copy issues.
FAIL: legacy/hybrid route, wrong authority, fake graph controls reappear.
```

This should be a human-facing review, not only checker output.

### Phase 2 — Review the check-surface evidence packet

#### Sprint 2: `GATE-CHECK-SURFACE-EXCELLENT-1-REREVIEW`

Review PR #44’s current packet.

The question is:

```text
Has the previous hold_for_surface_repair review been resolved enough to move the gate forward?
```

Do not close the gate casually. Require proof of:

```text
- no legacy/hybrid layouts;
- screenshots after actual interaction;
- 1.1.2 Golden transfer authority held;
- 1.1.3 graph/table implementation aligned with current golden behavior;
- no target-equivalent completion-language overclaim;
- no diagnostics/mastery/PV/Scale Gate/student-use claim.
```

Possible verdicts:

```text
PASS_TO_NEXT_GATE
PASS_WITH_FLAGS_BUT_GATE_STILL_HELD
HOLD_FOR_SURFACE_REPAIR
FAIL_PACKET
```

Given the history, I would expect “pass with flags, gate still held” unless the packet is very strong.

### Phase 3 — Resolve placeholder target candidates

#### Sprint 3: `Y1-PLACEHOLDER-CANDIDATE-REVIEW-1`

Review PR #42, not PR #41. PR #41 is abstract and superseded. PR #42 is the concrete candidate lane.

Questions:

```text
- Are 1.1.4 / 1.2.4 / 1.3.4 target candidates actually good?
- Do they stay within prior theory?
- Do they have target context, subquestions, answer form, operation chain, MTU mapping, and review criteria?
- Does 1.3.4 handle the unresolved 1.3.3 simultaneous-shift missing-unit issue safely?
- Are they ready for later governed replacement of placeholders, or only revision candidates?
```

Do not mutate `course-target-exercises.json` in this review. This is still review/candidate stage.

### Phase 4 — Decide the next actual UI implementation

Only after Phases 1–3 should you choose the next route.

I see three possible directions:

#### Option A — `1.1.1` exit ticket / short check planning

This is the most disciplined path toward the first-three-paragraph proof.

Sprint:

```text
EXIT-SHORT-WORKBENCH-111-PLAN-1
```

Output:

```text
- Decide whether 1.1.1 should first get an exit ticket, short check, or both.
- Identify operation chain.
- Identify whether source/context-left layout is needed.
- Identify whether current renderer variants can support it.
- If unsupported, define a new minimal variant before rendering.
```

This is my recommended next implementation lane after #44/#42 review.

#### Option B — `1.1.3-korte-check` advisory graph planning

This is important but more dangerous. The existing `1.1.3-korte-check` source includes graph-construction and graph-reading tasks, plus a `table_value_selection` task. It also has graph controls such as `lineConfirmationLabel` / `lineShapeLabel`, which previously caused fake-control issues.  

Do not render it directly. First run:

```text
SHORT-CHECK-WORKBENCH-113-PLAN-1
```

Goal:

```text
repair the source and define supported advisory graph variant behavior
```

#### Option C — A96 calculation-answer-form renderer refinement

This improves quality more than breadth.

Sprint:

```text
A96-CALCULATION-WORKBENCH-REFINE-1
```

Goal:

```text
Move calculation tasks beyond one textarea into separate formula/substitution/final-answer/notation/context conclusion sections.
```

This should eventually replace the weaker `golden_calculation_structured_v1` pattern where appropriate.

---

## My recommended sequence

Use this order:

```text
1. GOLDEN-SURFACE-VISUAL-REVIEW-1
2. GATE-CHECK-SURFACE-EXCELLENT-1-REREVIEW using PR #44
3. Y1-PLACEHOLDER-CANDIDATE-REVIEW-1 using PR #42
4. EXIT-SHORT-WORKBENCH-111-PLAN-1
5. Either:
   A. EXIT-TICKET-WORKBENCH-111-RENDERED-1, or
   B. SHORT-CHECK-WORKBENCH-111-RENDERED-1
6. SHORT-CHECK-WORKBENCH-113-PLAN-1
7. A96-CALCULATION-WORKBENCH-REFINE-1
8. GATE-PRODUCT-3P-PREP-1
```

This avoids broad rollout before:

```text
- the existing surfaces are visually reviewed;
- the check-surface gate is rereviewed;
- placeholder target candidates are reviewed;
- 1.1.1 operation fit is understood.
```

---

## Concrete instruction to the team

Send this:

```markdown
Current state accepted, but do not start another broad implementation lane yet.

We have three rendered Golden surfaces:
1. 1.1.3 exit ticket: graph/read/claim.
2. 1.1.2 exit ticket: calculation/structured.
3. 1.1.2 advisory short check: choice/advisory.

Before further rollout, create `GOLDEN-SURFACE-VISUAL-REVIEW-1`.

Scope:
- Review the three rendered Golden surfaces.
- Verify desktop/mobile/dark states.
- Verify no legacy/hybrid shell.
- Verify 1.1.2 exit-ticket authority is held.
- Verify 1.1.2 short check remains advisory.
- Verify 1.1.3 graph behavior has no fake line/slope controls.
- Verify route links.
- Record screenshots and a lead review.

Do not migrate 1.1.1.
Do not migrate 1.1.3-korte-check.
Do not mutate target-exercise registry.
Do not claim product use, target-equivalent completion, diagnostics, mastery, PV, Scale Gate 1, or student use.

After this, prepare PR #44 for renewed human review. The check-surface gate remains held until explicitly reviewed.
```

---

## Strategic conclusion

The Golden Workbench rollout has moved from “prototype” to **early governed implementation**. That is a significant step.

The right mindset now is:

```text
slow down breadth
increase review quality
stabilize the three existing surfaces
then expand by operation type
```

Do not let the team turn this into “migrate every exercise to Golden.” The correct product goal is not Golden-looking pages everywhere. The correct goal is:

```text
every exercise surface has the right operation chain,
the right authority level,
the right student interaction,
the right proof,
and no legacy/hybrid contamination.
```
