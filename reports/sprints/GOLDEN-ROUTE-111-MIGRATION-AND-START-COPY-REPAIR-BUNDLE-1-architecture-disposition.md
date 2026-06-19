# GOLDEN-ROUTE-111 Architecture Disposition

Date: 2026-06-19
Status: implemented internal architecture disposition

## Decision

Use the existing Golden Exercise Workbench renderer variants for `1.1.1`:

- Exit ticket: `golden_calculation_structured_v1`
- Korte check: `golden_advisory_short_check_v1`

No new renderer variant was required.

## Exit Ticket Disposition

`1.1.1-exit-ticket.json` keeps its reviewed target-equivalent task chain and authority flags. The migration adds the Golden layout contract and context-first data:

- `layout.framework: golden_exercise_workbench`
- two context tables:
  - `ctx-111-boer-grond`
  - `ctx-111-buurvrouw-grond`
- `contextRefs` for all task-shell tasks
- `operationChain` for all task-shell tasks

The route now renders as:

```text
header.ge-topbar
main.ge-page[data-golden-ticket-root]
golden-ticket-layout.css
golden-ticket-layout.js
```

It no longer renders through:

```text
#exit-ticket-app
et-page
task-shell.css
exit-ticket.css
skill-map-route.css
task-shell-ui.js
exit-ticket-ui.js
```

## Korte Check Disposition

`1.1.1-korte-check.json` remains an advisory short check. It now declares:

```json
{
  "targetEquivalent": {
    "candidate": false,
    "gateApproved": false,
    "completionLanguageEligible": false
  },
  "layout": {
    "framework": "golden_exercise_workbench",
    "variant": "golden_advisory_short_check_v1"
  },
  "advisory": {
    "targetEquivalentProof": false
  }
}
```

Each choice task now has a context block and `contextRefs`. This improves the Golden route quality without turning the short check into target-equivalent evidence.

## Start Copy Disposition

The first-three Start pages previously used visible mastery/closure language:

```text
Jouw beheersing
definitief af te sluiten
mastery-dashboard
```

The generator and shared quiz UI/CSS now use neutral practice-progress language:

```text
Oefenstatus
progress-dashboard
progress-container
Een reeks van 3 laat zien waar je vlot antwoordt en waar je nog wilt oefenen.
```

The underlying local practice mechanics are unchanged. The student-visible claim is changed from mastery/closure to local practice progress.

## Boundary

This bundle does not migrate `1.1.3-korte-check`; it remains an advisory legacy-rendered route. This bundle does not close Scale Gate 1, authorize product-route adoption, or authorize diagnostics, mastery/sequencing, PV, summative use, broad product use, or student/product use.
