# §2.1.2 metadata correction: committed scope and publication

Date2026-09-05. Builder/lock owner `paragraph_212_alt_builder`.
Pair root `C:/wt/book2-212-alt-correction-20260905/`.
Both branches: `agent/book2-212-alt-correction-20260905`.

## Actual payload commits

| Repository/worktree | Published payload HEAD | Classifier base | Actual result |
|---|---|---|---|
| 4veco-platform | 89a8fc34f7c017b10af86d6b058bf6ba21328367 | 798cacfeeb40e4e0ba54d26f2b040cbdeec327a9 | PASS shared:6 platform-source/test paths,51 review-evidence paths |
| 4veco-lessen | 901e18aaf8179b37daafd5fd2e45ed92db444a49 | a2bb4bcf199b8871eef21426f329efb6795e7dd8 | PASS textbook:14 Part A paths, no Part B or shared changes |

The classifier was run after both commits; it resolved the actual local HEADs
and passed these exact SHAs as `--head`. Full command/stdout is in the two
scope rows of `BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-command-log.jsonl`.
The platform payload contains the nine native source attributes, five generated
title values, separate regression suite and additive supplemental R6 evidence.
The lesson payload is exactly3MD/3HTML/3ZIP and5SVG files; no PDF/PNG, caption,
canonical review/quality/handoff or prerequisite source changed.

Both payloads were pushed normally to origin; read-only `git ls-remote` returned
the exact payload HEADs above. No force push. The paired ownership checks passed
with the same task and agent. `git diff --check` passed for both repos.
Fetched governance origin/main was `96416b6b5bd57094576e9aba0a42d682584ec479`;
governance freshness passed with no differing protected governance files.

## Evidence identities

All paths below use prefix `reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-`.

| Suffix | SHA-256 |
|---|---|
| baseline-r6.json | 4aea63dbb0c60e363127555440f0cb6143830792999ce72f7e1701c7d5847b88 |
| build-r6.json | 3191dcacfd1a97422d11821d89879a28105beb287626d3aa8ec43fa63abb8038 |
| mechanical-r6.json | abaa67850c693be5c66f704c193127440b8f6aa75bc8970a31523463d154fa05 |
| print-rebuild-r6.json | 9fb6b82d177fde5275aadb225947818f41ccf311afc828a9bcd44e63276795aa |
| builder-inspection-r6.json | 8304929cb947fbddc86956766f9822252b1a6929d9d6fee2d348699ec8b3ef81 |

The native R6 proof directories are `212-paragraaf-e94d42f66ab9-r6`,
`212-opgaven-94ebe5d35207-r6`, and `212-antwoorden-07a75d7b5b69-r6` under
`reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`. Their native PENDING
acceptance fields remain untouched. Every proof page is hashed in the native
manifest and personal builder-inspection record. All27 pages and3PDFs remain
byte-identical to R5; all11 native PNGs remain byte-identical and exact0 pixel
delta. Full ZIP19/11/9 member contracts and parity are recorded mechanically.

## Publication boundaries

This scope/publication record is committed separately after the payload. The
required map/index refresh follows in a mechanical-only commit. Final local and
remote SHAs and clean status are reported directly to root after that push.
No dashboard/roadmap state changed, so no dashboard regeneration is required.

The first default `agent:index` execution selected lesson `origin/main`; diff
inspection detected that this would omit current Book2 branch files. That
uncommitted interim index was regenerated through the existing generator using
`FOURVECO_LESSEN_SOURCE_REF=901e18aaf8179b37daafd5fd2e45ed92db444a49` and
`FOURVECO_LESSEN_SOURCE_BRANCH=agent/book2-212-alt-correction-20260905`.
The corrected lesson inventory remains1850 files; its only delta is source
identity/timestamp/scope wording. Platform additions are this task's53 new
source/evidence paths. A fixed `FOURVECO_INDEX_GENERATED_AT` from the generated
JSON permits deterministic regeneration; no generator was edited. The final
index-only descendant contains just the four existing GitHub-agent index files.
`emit-url-index.js` ran without a content delta; existing maps still resolve
their unchanged entrypoint paths. No unrelated lesson inventory was deleted.

`gh run list --branch agent/book2-212-alt-correction-20260905 --limit5` returned
an empty array after payload push. Exact-head `platform-ci / validate-platform`
is therefore NOT RUN/UNAVAILABLE, not PASS or waived. Root owns later applicable
CI/integration checks. No PR or merge is authorized or performed.

Next required gate: root-assigned independent paragraph review and distinct
specialist QC against this published payload/R6 proof, followed by root
acceptance. Historical §211/§213 pins remain unchanged; do not repin successors
or promote canonical §212 evidence merely from this builder result.
