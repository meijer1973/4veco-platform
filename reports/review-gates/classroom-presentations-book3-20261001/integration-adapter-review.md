# Independent notation/classroom adapter repair review

Date: 2026-10-01. **PASS — no actionable findings in this bounded repair.** This closes the two adapter findings in [integration-base-drift-review.md](integration-base-drift-review.md) for the exact candidate bytes below. It is technical review only, not merge authority or a claim that fresh hosted CI/compatibility has passed.

## Reviewed identity and scope

Underlying platform HEAD: `25bb4082baea0268ba1e74c1949948c599ae0174`.
Paired lesson HEAD: `43de12b0702773ace76803e2f4d4cb9523ab06cd`.

| Working candidate file | SHA-256 |
|---|---|
| `build-scripts/maintenance/check-classroom-edition.js` | `13111ba019652e1890cb5b4ac35bf16d076cf38b86a5e5d003ae5d7f198f7f15` |
| `build-scripts/maintenance/check-classroom-notation.test.js` | `167e4fafbd13a60ea5806e196f5c426eac067e9099c9df65429e4be6a75e8f5a` |

I read the complete adapter delta and new test file, comparing each new branch obligation with the complete original `book2-notation-revision.verify/verifyManifest`, its `history`, `verifyFiles`, `protectedPath`, inventory and contract dependencies. The scope is the current-notation companion compatibility branch and CLI export ordering. This does not reapprove new content, slides, timing, targets or Book 4 production.

## Preservation comparison

The new `verifyNotation` preserves every substantive invariant of the original current notation verifier:

- Exact notation pin revision and manifest digest; exact manifest revision and baseline commit.
- Original presentation successor `checkContract` and full authenticated historical receipt/input/classroom evidence through `history`.
- Exact lesson/platform contract bases, finite Book 2 revision paths and required root entry README source binding.
- All sealed files required, with original byte counts, SHA-256 values, baseline Git blob identities, protected-path checks and historical deletion rejection via the unchanged `verifyFiles`.
- Exact approved changed-path sets against both the contract and the current pin after subtracting only approved new companion paths and the existing navigation exception.
- Every contract source's historical ancestor hash and current proposed hash.
- Exact platform input path inventory and all current LF-normalized input hashes.
- With `requireTracked`, exact stage-0 mode100644/index-to-saved-byte identity for every sealed file, added companion, current receipt and changed navigation file. The common helper also enforces tracked inventory cardinality; it does not merely spot-check selected sources.

The intentional difference is that the existing companion partition admits new Book 3 PPTX/PDF/evidence beside an actual sealed paragraph student PDF. It does not alter the original path grammar, permit Book 4, allow arbitrary additions or replace any sealed file. Current Book 2 presentation files already listed in the notation manifest remain sealed and cannot be treated as new additions. The original historical validators, pins and receipts are not repinned or bypassed.

Routing still runs `historical.verify` first. A successful result returns unchanged. The new fallback requires exactly one failure, the exact notation lesson state, and one of two exact messages: inventory mismatch or finite-revision scope mismatch. All other single failures and any combined failures propagate. The old fallback remains available for its earlier states. When the current notation receipt exists, full notation validation is used rather than the older follow-up verifier. An unknown extra file can trigger an inventory mismatch but then fails the bounded partition; it is not silently excluded.

Publishing exports before the CLI call resolves the new `notation.history → partitionInventory` callback. The exported API is complete when the CLI starts verification, with no validation removed or deferred.

I independently verified that the actual working bytes of the notation verifier, notation pin, notation contract, Book 2 presentation successor verifier, historical dispatcher and paragraph scope checker are byte-identical to fetched main `537b9fd541906d59ee74eafc95b2acd85ff5239d`. No changes to those sealed files are required by this repair.

## Independently executed validation

1. Ran all three focused Jest suites: old classroom adapter, new notation adapter and original notation verifier. Result: **3 suites, 69 tests passed**, exit0.
2. Ran the real standalone `node build-scripts/maintenance/check-classroom-edition.js --require-tracked` against the synchronized pair. Result: **PASS, 1,561 sealed current files plus all42 Book 3 additions**, no failures. This exercises the real history/presentation contract and recursive CLI path, not the fixture stubs.
3. Ran four additional real-pair negative controls by substituting bytes only at the in-process read boundary; no files or Git state were mutated. A current Book 3 manuscript edit and an accepted Book 2 §213 PPTX edit both failed `Stale current bytes`; a notation tool edit failed `Stale notation tool`; a navigation edit failed `Staged successor/classroom bytes differ RESEARCH_AGENT_MAP.md`.
4. Re-executed the recursive-export scenario against the actual old synchronized adapter source loaded in memory. It exited1 with `Incomplete recursive export`; the candidate regression test passes. Thus the new cycle test detects the original defect rather than merely passing on a harmless stub.

The new fixture tests meaningfully cover stale protected/current bytes; protected-source repinning; repinning an editable Book 2 source against its independently bound proposed hash; false baseline identity; deletion even with a changed receipt; unknown and Book 4 additions; nonexistent paragraph and chapter mismatch; unrelated paths outside the inventory; modified platform inputs; changed receipt/pin paths; source ancestry; history/presentation-contract errors; missing or stale staged companions/navigation; wrong lesson state; multiple/unrelated errors; and both allowed routing failures. The fixture intentionally mocks history and presentation-contract internals; those internals remain unchanged and were exercised on the real pair by the independent CLI and read-boundary mutation checks. This is bounded coverage, not exhaustive formal verification.

## Closure and remaining integration work

Both drift findings are closed at the reviewed hashes. The initial synchronized compatibility failure `bundle_final_not_green` remains historical evidence; this report does not relabel it as a pass. Fresh exact-head hosted CI and three-state bundle compatibility must bind the committed repaired payload. The authored source change also remains subject to the authorization boundary recorded in the drift report; independent PASS is not an authorization extension.

No repository file, author artifact, receipt, commit, branch or GitHub object was changed by this review. All mutations were confined to disposable test fixtures or process-local reads. Only this scratch report was written. The candidate file hashes were rechecked unchanged immediately before saving this report.
