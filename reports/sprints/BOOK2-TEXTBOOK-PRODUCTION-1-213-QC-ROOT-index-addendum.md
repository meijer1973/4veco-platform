# Exact repository-map transport during current root publication

2026-09-06, codex-root. Additive operational order under the existing normal
paired-publication requirement; no change to lesson scope or shared tooling.

Read-only root inspection found the published platform index at source
5abbfbb4f37e4c8a0d8fdede0a53a5d1b41ade10 includes an extra `.git` pointer:
14,027 indexed versus14,026 tracked files. The shared generator's default
1MiB child stdout limit causes its HEAD route to fall back to filesystem walk;
the skip rule skips `.git` directories but not worktree pointer files. Root's
previous freshness proof checked the source commit, not literal full inventory.
The explicit lesson-ref index also retains Git-quoted Unicode names. These
are actual map defects, not native lesson/source or review-custody drift.

The224 and234 authors independently confirmed that their terminal full-index
comparisons matched line-delimited Git representations, not decoded literal
filenames. Their published historical payloads stay immutable. A first root
read-only probe printed an overlarge missing/extra list and was truncated;
the new bounded summary and complete file-backed diagnostic replace neither
the tool trace nor any old result. Two mistaken read-only filename lookups
(223 handoff title and224 index runner extension) were resolved using rg;
neither caused a file mutation or a false validator pass.

Root fully read shared github-agent-index.js and its freshness checker, plus
the224 task-owned runner/diagnostics. Capture the actual old-index mismatch
and default-vs128MiB Git inventory outcome before index generation. Use a
task-owned runner that verifies the unchanged shared generator against trusted
main96416b6 and runs its normal main entrypoint. Intercept only its read-only
Git inventory transport:128MiB stdout and `-c core.quotepath=false` for
ls-tree/ls-files. Rev-parse/remote remain read-only. No filesystem fallback,
shared generator edit, global Git configuration or changed grouping/output
logic is allowed. All six paired ROOT/SOURCE_REF/SOURCE_BRANCH fields must
be explicit; both source refs must be exact commits, never HEAD fallbacks.

After generation, independently compare each group union and file_count
against NUL-delimited actual Git filenames with the documented skipped-folder
rule. Reject all extra/missing paths, literal quoting, unexpected source refs
or mixed branches. Keep this evidence controller and diagnostic in the normal
payload before generating the final four-index-only tail. Terminal checks
must verify actual literal inventories, unchanged generator, URLs/freshness,
both clean same-owner claims and HEAD/tracking/remote equality. Do not describe
the earlier representation-only check as canonical filename proof. A general
shared-tool buffer/NUL parsing repair is named follow-up, not silently mixed
into this Part A paragraph acceptance. No owner or merge authority is added.
