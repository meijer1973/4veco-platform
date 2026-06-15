# REVIEW-THROUGHPUT-2 CI Decision

Generated: 2026-06-14

Decision: do not add a broad `check:review-throughput` step to
`.github/workflows/platform-ci.yml` in this sprint.

Rationale: many archived `reports/review-gates/*/review-packet.json` files
predate the `REVIEW-THROUGHPUT-1` field contract. A broad CI gate would create
false migration failures instead of proving current PR safety.

Adopted path now:

- Active packet generators should use
  `build-scripts/review-gates/review-throughput-fields.js`.
- Focused packet checkers may call
  `build-scripts/sprints/check-review-throughput-packet.js` for packets that
  have adopted the envelope.
- Autonomous packets still must use `--changed-paths-file` when validating
  against a real PR diff.

Follow-up before CI promotion:

- Either migrate historical packets to the envelope or define an explicit
  allowlist of current generated packet paths.
- Decide whether CI checks only changed packet files or a curated active-packet
  set.
- Keep protected references, generated lesson output, product authority,
  diagnostics, mastery, PV, Scale Gate 1, and student/product-use authority out
  of autonomous closure.
