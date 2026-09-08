# Independent Y1 successor-verifier lead review — round 1

Verdict: **REVISE**.

Reviewed live draft Platform PR #234 at `64f9cfffcfb5bcc995e74d705873ae40f676f673`, against `96416b6b5bd57094576e9aba0a42d682584ec479`. Certificate source payload: `32ac84f153dffa28b9b354eed1b595837290fc4d`. Current lesson: `57b31a1f4a3d2aa0da3945abbc5a7a0ee5d05e6a`. Reviewer: independent `entry_rule_review`.

## Findings

1. **P1 — Workflow binding overlooks job properties after the steps sequence.** In `build-scripts/sprints/check-y1-golden-rollout-wave-1-current.js:91–105`, the protected job comparison only retains text before `steps:` plus selected step blocks. Appending either `    if: false` or `    continue-on-error: true` after the sequence is accepted by `validateWiring`. Independent `js-yaml` parsing confirms these are valid properties of the actual `validate-platform` job. The first can skip the protected job, and the second changes its failure behavior. Root permission drift is also accepted by the current contract extractor. Compare the complete protected job's non-step properties and relevant top-level contract, independent of property ordering; reject duplicate or ambiguous mappings. Add regression cases at both property positions.

2. **P2 — Global alias regex rejects unrelated executable text.** At line 88, `[&*][A-Za-z_]` is applied to the whole workflow rather than YAML syntax. A harmless additional step containing `run: echo https://example.test/?a=1&b=2` fails as an alleged YAML alias. This violates the approved requirement to permit unrelated workflow additions without resealing source evidence. Parse YAML structure or otherwise distinguish scalar contents from YAML syntax. Add valid ampersand, literal/comment text and unrelated alias cases while preserving protected-contract rejection.

Both findings were independently reproduced by passing in-memory mutated workflow text to `validateWiring`; no repository files were changed.

## Preserved requirements verified

- Published source and evidence remain separate: the source-to-head delta contains only the new certificate and four generated indexes.
- All 81 inventoried historical artifacts are unchanged from the baseline, including the old verifier/test, source manifest, renewal, proof and capture dependencies.
- The successor uses a stable committed source certificate, exact successor-source hashes, and semantic package/workflow wiring rather than requiring every future platform file to remain unchanged.
- Current lesson ancestry, independently rediscovered rendered dependencies, route existence, historical/current ref separation, and active CLI rejection of scope/write/unbound/root overrides are present.
- Independently ran the complete active successor at the reviewed head: PASS. It verified 64 historical platform rendered inputs, the existing one-capture renewal, all 78 current lesson rendered inputs and 55 route targets. The result retains `first_viewport_only: true`, `below_fold_exercises_attested: false` and the separate current lesson SHA. No new capture is claimed.

Focused-suite completion and protected remote CI were still pending when requested; this review does not claim their success or grant lifecycle readiness.

## Accepted correction direction

The proposed bounded amendment uses explicit pinned `js-yaml` 3.14.2 already present transitively in the lockfile, `safeLoad`, semantic whole-job/protected-step comparison, duplicate-key rejection and relevant top-level trigger/permission/default checks. The new certificate may move to the sprint evidence directory to satisfy existing scope policy; historical files remain unchanged. Add package-lock provenance and bind the current parser version/resolved/integrity entry and root declaration, allowing unrelated dependency changes. An installed version string alone is insufficient source binding.

After source corrections, freeze a new source payload, regenerate the certificate, publish the new evidence head, rerun the relevant negative and positive regressions plus complete actual-pair validation, and obtain exact-head round-2 review. The current REVISE verdict is not closed by the proposed design alone. No publication, source edit or external state mutation was performed by this reviewer.
