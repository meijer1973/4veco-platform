# 1.1.3 Golden Exercise Workbench Implemented Exemplar

Status: repository-compatible implemented exemplar for `GOLDEN-EXEMPLAR-PROMOTION-1`.

This folder promotes the current generated `1.1.3` Golden Ticket route as the implemented Golden Exercise Workbench reference. It complements, but does not replace, the conceptual product exemplar at:

```text
references/exemplars/1.1.3-exit-ticket/
```

It also links to the A96 answer-form exemplar for calculation/formula answer-form transfer and formula-token policy:

```text
references/exemplars/a96-answer-form/
```

## Files

```text
README.md
source-data-snapshot.json
generated-route-snapshot.html
screenshot-proof.md
no-legacy-proof.md
rollout-notes.md
```

## Snapshot Sources

`source-data-snapshot.json` is copied from:

```text
source-data/book-1/exit-ticket/1.1.3-exit-ticket.json
```

`generated-route-snapshot.html` matches the generated lesson route produced on
the lesson revision branch during the Golden surface visual revision deploy:

```text
C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\...\1.1.3 Grafieken en tabellen\1.1.3 exit-ticket route
```

The snapshot can also be reproduced from the current platform source data with
`build-scripts/platform/build-exit-ticket-shells.js`. Generated lesson output
was refreshed through the deploy pipeline only; no generated output was
hand-edited for this exemplar package.

## Snapshot Hashes

```text
generated-route-snapshot.html sha256: 27D7C22C680410C5CEFA831732513B0AE675CD15B5DABF5B976F120DA6707118
source-data-snapshot.json sha256: B6E049B17C117D825291FE83C218F12CB0CFBF4FCBD3DA718D2C6031B71FCCC1
```

## Why This Is the Implemented Reference

The source data opts into:

```text
layout.framework: golden_exercise_workbench
```

The generated route snapshot contains:

```text
header.ge-topbar
main.ge-page[data-golden-ticket-root]
golden-ticket-layout.css
golden-ticket-graph.js
golden-ticket-layout.js
```

The generated route snapshot does not contain:

```text
#exit-ticket-app
et-page
task-shell.css
exit-ticket.css
task-shell-ui.js
exit-ticket-ui.js
```

## Product Pattern Preserved

This route demonstrates:

```text
source-left/task-right Golden shell
source table as first-class context
axis choices with plausible distractors
two source points for a straight-line graph
automatic line after determined points
interval-before-read-off graph reading
structured claim-control placement
local formula-token clarity for this route; formula-token policy still belongs to A96
local feedback after attempt
no target-equivalent completion claim
```

## Formula-Token Scope Warning

Use this implemented `1.1.3` exemplar for:

```text
Golden shell/layout reference
source-left/task-right reference
graph/table interaction reference
route/no-legacy reference
```

Do not use it as the formula-token policy exemplar. The current source snapshot
has local formula-token clarity for this route, but future calculation/formula
policy work must still use `references/exemplars/a96-answer-form/` for
reusable-token rules, hidden-token-trap policy, and A96-level formula proof.

## How Future Agents Should Use It

Use this folder when implementing or reviewing later Golden Exercise routes:

```text
1. Start from references/ui/*.md policy.
2. Inspect source-data-snapshot.json for the data contract.
3. Inspect generated-route-snapshot.html for direct Golden shell structure.
4. Inspect no-legacy-proof.md before changing renderer selection.
5. Inspect screenshot-proof.md for current proof status and remaining live-capture gap.
6. Use A96 for calculation/formula answer-form and formula-token work.
```

If a future route cannot preserve the same operation-chain quality, record an engine blocker rather than downgrading to a legacy or generic UI.

## Boundary

This exemplar does not authorize:

```text
student/product use
Scale Gate 1
target-equivalent completion language
diagnostics
mastery
automatic sequencing
summative use
broad route migration
renderer generalization
generated lesson output churn
```
