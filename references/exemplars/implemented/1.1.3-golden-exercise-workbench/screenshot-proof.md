# Screenshot Proof

Status: proof ledger for the implemented `1.1.3` Golden Exercise Workbench exemplar.

## Current Evidence

The implemented exemplar contains a committed generated route snapshot:

```text
references/exemplars/implemented/1.1.3-golden-exercise-workbench/generated-route-snapshot.html
```

That snapshot matches the current committed generated lesson route on `4veco-lessen` `origin/main` after the workbench-header label fix. No lesson output was edited for this goal.

Static route evidence from the snapshot:

```text
generated-route-snapshot.html sha256: 8A7003DFDD2821956D8ECFBD9E4F0E160CB7D1763A716D2FC5625E03780576F4
source-data-snapshot.json sha256: 32844DF1FED311ACDFE038F2281243543691CD09840C824318A8438180771586
```

Formula-token scope is intentionally excluded from this proof. The current `1.1.3` source snapshot contains duplicate visible `oude Q` tokens with hidden IDs `oldQden` and `oldQnum`; use A96 for formula-token policy until that is repaired.

## Screenshot Capture Status

Live browser screenshot capture was attempted on 2026-06-09 through the in-app browser. Direct `file://` navigation to the local generated lesson route was blocked by the browser URL policy. This proof file therefore records the required screenshot states and the current static snapshot evidence, but it does not claim that fresh PNG screenshots were captured in this goal.

Do not work around the browser URL policy by using an alternate browser surface just to produce screenshots.

## Required Screenshot States For Future Capture

Future capture should use an allowed local serving route or CI renderer and record:

```text
desktop initial state
mobile initial state
dark-mode state
wrong/retry feedback state
correct/completed state
after-graph construction state
after-formula builder state
route/reload state
```

The proof must show the state after student action. Initial render alone is not enough for route adoption.

## Current Proof Limit

This file is sufficient to locate and inspect the implemented snapshot. It is not sufficient by itself for product-route adoption, Scale Gate 1, student/product use, or target-equivalent completion language.
