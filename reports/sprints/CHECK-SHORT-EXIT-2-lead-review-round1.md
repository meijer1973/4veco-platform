# Lead Review Summary
Sprint: `CHECK-SHORT-EXIT-2`
Round: lead review round 1

## Scope

Reviewed implementation, generated-output deployment, deterministic checker,
source data, runtime changes, tests, and rendered-proof artifacts for
`CHECK-SHORT-EXIT-2`.

Evidence inspected: `reports/sprints/CHECK-SHORT-EXIT-2-command-log.jsonl`,
`reports/json/check-short-exit2-proof.json`,
`reports/sprints/CHECK-SHORT-EXIT-2-screenshot-manifest.md`,
`reports/sprints/CHECK-SHORT-EXIT-2-screenshots/manifest.json`,
`build-scripts/sprints/check-check-short-exit2.js`,
`build-scripts/sprints/capture-check-short-exit2-screenshots.js`,
`source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`,
`build-scripts/platform/build-exit-ticket-shells.js`,
`build-scripts/platform/build-landing-page.js`, and generated Book 1 output
under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`.

## Review Plan

| Review/Test | Required evidence | Status |
|---|---|---|
| Split check surfaces | Six source records and generated pages | passed |
| Landing card rendering | Distinct `Korte check` and `Exit ticket` cards | passed |
| Source/context rendering | `1.1.3` context blocks and refs | passed by source/generated checks |
| Graph construction substitute | graph workspace contract, grid/ticks, line runtime | passed by source/runtime checks |
| Forbidden authority | no product/diagnostic/mastery/Scale Gate claims | passed |
| Rendered screenshots | desktop/mobile/dark PNG evidence | blocked |

Commands evidenced in `reports/sprints/CHECK-SHORT-EXIT-2-command-log.jsonl`
include `node build-scripts/sprints/check-check-short-exit2.js`,
`npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`,
and `npm.cmd run check:platform`.

## Consolidated Verdict

Verdict: REVISE

Implementation and non-visual proof are strong enough to proceed once rendered
screenshot evidence exists, but lead review cannot pass the sprint into human
review yet.

## Blocking Findings

`CSE2-B1`: Screenshot evidence is blocked. `reports/json/check-short-exit2-proof.json`
records `screenshot_capture_blocked: true`, `all_screenshots_exist: false`,
and required screenshot cases with `file: null`. Local Chrome/Edge headless
screenshot mode did not write PNG files. This blocks lead-review pass and
human-review packet readiness.

## Specialist Findings

- Split check source convention is implemented.
- New `1.1.1` and `1.1.3` target-equivalent candidates keep completion
  language held.
- Reviewed `1.1.2` exit-ticket authority is preserved.
- `1.1.3` exit-ticket source includes context blocks, graph-construction
  substitute, graph reading, and interval-halving check.
- The custom checker passes, but it is not a substitute for rendered
  screenshots.

## Test Evidence

Passed:

```text
node build-scripts/sprints/check-check-short-exit2.js
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
```

Blocked:

```text
node build-scripts/sprints/capture-check-short-exit2-screenshots.js
0 captured screenshots; 10 blocked screenshot cases recorded
```

## Required Correction

Capture real rendered screenshots for the cases listed in
`CHECK-SHORT-EXIT-2-screenshot-manifest.md`, or record an explicit human
waiver that screenshot evidence is replaced by direct local rendered
inspection. Without one of those, do not prepare the human review packet and
do not claim sprint closure.
