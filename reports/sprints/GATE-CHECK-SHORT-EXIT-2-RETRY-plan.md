# GATE-CHECK-SHORT-EXIT-2-RETRY Gate Preparation Plan

Generated: 2026-06-06

## Status

Planned active human-review gate preparation after
`CHECK-SURFACE-PREGATE-1`.

## Goal

Prepare the retry direct human review packet for the first-three paragraph
Check surfaces after the surface repair sequence:

```text
CHECKSURFACE-RESET-1
-> GRAPH-CHECK-UX-1
-> GRAPH-EXIT-UX-1
-> CHECK-ROUTE-COPY-1
-> VISUAL-QA-HARDEN-2
-> CHECK-SURFACE-PREGATE-1
-> GATE-CHECK-SHORT-EXIT-2-RETRY
```

This sprint prepares the packet, live-output evidence, review lab, planned
comment prompts, stop conditions, deterministic packet checker, bundle URLs,
and pre-gate lead review. It does not record human comments, draft closure,
write gate-closure files, authorize product adoption, or enable new completion
language.

## Quality Floor

The retry packet is ready only if a reviewer can inspect the repaired
student-facing experience, not only structural files:

1. Landing pages distinguish advisory `Korte check` from `Exit ticket`.
2. `1.1.3` short check uses graph/table task-shell interaction.
3. `1.1.3` exit ticket uses a readable source/task graph workspace.
4. Source scrolling preserves task orientation.
5. Graph line drawing occurs in the active graph workspace.
6. Targeted feedback and next action are visible.
7. Mobile and dark evidence are present.
8. `1.1.1` and `1.1.3` completion language remains held.
9. Reviewed `1.1.2` local, non-summative completion-language authority is
   preserved only as previously approved.
10. No artifact claims product-route adoption, diagnostics, mastery/sequencing,
    PV, Scale Gate 1, or student/product use.

## Specification Requirements Fulfilled

- Product end-state: separate advisory short check and exit ticket surfaces
  are visible for the first three paragraphs.
- Product end-state: graph/table tasks use graph/table interaction and source
  context where the target operation requires it.
- Human-review proof: the gate supplies a review lab, screenshots, proof JSON,
  live-output evidence, and deterministic checker.
- Review governance: direct packet comments are the default; closure requires
  returned comments, resolution log, closure proposal, and explicit human
  confirmation.

## Evidence Needed

- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review/review-packet.md`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review/review-packet.json`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review/live-output-evidence.md`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review/live-output-evidence.json`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review/review-lab.html`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review/bundle-urls.md`
- `build-scripts/review-gates/check-gate-check-short-exit2-retry-review-packet.js`
- pre-gate lead-review assignment, round 1, correction log, and round 2
- verification review, result, command log, roadmap update, maps, and indexes

## Procedure

1. Record plan, baseline, and planning review.
2. Create the retry gate directory and packet artifacts.
3. Include previous `REVISE` comments and repair sequence evidence.
4. Build a review lab with links and screenshots for route copy, short-check
   graph interaction, exit-ticket source/task workspace, feedback, mobile, and
   dark states.
5. Add the deterministic packet checker.
6. Run pre-gate lead review and record corrections/recheck.
7. Emit bundle URLs and validate the packet.
8. Refresh repository maps and dashboard.
9. Commit and push the packet and all cited evidence before asking for human
   direct comments.

## Acceptance Tests

```text
node build-scripts/review-gates/check-gate-check-short-exit2-retry-review-packet.js
node build-scripts/sprints/check-bundle-urls.js GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review --branch codex/check-short-exit-2
node build-scripts/sprints/check-check-surface-pregate1.js
node build-scripts/sprints/check-visual-qa-harden2.js
node build-scripts/sprints/check-check-short-exit2.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
```

Final publication should also run remote freshness checks and report local and
remote commit hashes.

## Stop Conditions

Stop instead of sending the review packet if:

- `CHECK-SURFACE-PREGATE-1` proof is missing or not complete;
- the retry packet lacks direct comment prompts;
- the review lab cannot show the repaired graph short check and graph exit
  ticket states;
- `1.1.3` completion language is enabled;
- `1.1.2` prior authority is weakened or broadened;
- closure proposal or gate-closure files are created before comments;
- product adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1, or
  student/product use is claimed;
- the packet and evidence cannot be pushed to the remote branch.

## Review Gate

`GATE-CHECK-SHORT-EXIT-2-RETRY` will be judged by direct human packet comments.
This preparation sprint only makes the packet ready for that human review.

## Omitted Follow-Up Work

- Direct human comments are still required.
- Comment-resolution log, closure proposal, and gate-closure records remain
  future work after review comments are returned.
- Any completion-language expansion, product-route adoption, or Scale Gate
  work remains blocked until explicitly authorized by later gates.
