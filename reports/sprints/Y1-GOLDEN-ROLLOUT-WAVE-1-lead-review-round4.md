# Y1-GOLDEN-ROLLOUT-WAVE-1 Lead Review Round 4

Generated: 2026-08-23

Reviewed substantive payload:
`3ee039acf3bacc3c55d74cce69bbde7ebea237fc`

## Context

The direct full-mode regression exposed the actual fresh-runner failure:
historical lesson paths containing an en dash could not be queried reliably
through Git argv on the Windows CI image. The checker now uses Git's batch
stdin protocol for historical object reads.

## Review loop

The first review returned `REVISE` for newline framing, swallowed process
failures, empty-blob ambiguity, and missing protocol-delimiter checks. All
findings were corrected:

- NUL, CR, and LF are rejected in refs and paths before newline-framed input.
- Spawn and nonzero Git failures throw; only an explicit `missing` protocol
  response returns `null`.
- Empty blobs remain valid empty strings.
- Batch responses require exact size and trailing delimiter conformance.
- OID checks use `--batch-check`, avoiding binary-content buffering.
- Tests cover Unicode paths, empty and missing blobs, control characters,
  process failure, and malformed headers.

## Verdict

`OK_TO_COMMIT`, normalized to `PASS WITH FLAGS` for the L4 packet.

No blocking or material findings remain. The focused Node 20 suite passes all
24 tests, the exact checker passes, and diff hygiene is clean. The only review
note was that LF and CR have explicit test cases while NUL shares the same
tested rejection expression; this does not block.
