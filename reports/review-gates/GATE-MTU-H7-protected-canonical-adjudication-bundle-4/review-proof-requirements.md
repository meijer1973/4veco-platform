# GATE-MTU-H7-protected-canonical-adjudication-bundle-4 Review Proof Requirements

Status: `PENDING_EXACT_REMOTE_HEAD_REVIEW`

This file defines requirements only. The builder does not generate reviewer identities, verdicts, or lead-review approval.

Required external proof against the exact remote payload head:

- Teacher verdict: `MORE_THAN_SATISFIED`
- Economist verdict: `MORE_THAN_SATISFIED`
- Quality inspection verdict: `MORE_THAN_SATISFIED`
- Lead result: `PASS` or `PASS WITH FLAGS`
- Lead `reviewed_commit_sha`: exact remote payload head
- Full live branch-protection output with `ok: true`
- Exact-head required CI and Bundle 4 checker success

`PASS WITH FLAGS` may not carry a missing core requirement. Payload integration authorization and later per-candidate execution-preparation authority are separate decisions.
