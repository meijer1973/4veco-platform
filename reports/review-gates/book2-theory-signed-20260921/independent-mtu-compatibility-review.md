# Independent bounded review — MTU-H7 historical registry compatibility

Verdict: **PASS** for the source identities in `independent-mtu-compatibility-bindings.json`. No required changes found. This is a compatibility review of the existing protected packet after the authorized signed-elasticity update; it grants no new curriculum, operation, mutation, product or lifecycle approval.

The preceding full platform CI run 35605124803 failed on two A15 live semantic comparisons and the whole-registry source hash. Independent inspection confirms the registry changed only the four previously reviewed units: A15/A82/A83 procedure and pitfalls, and A84 kern/procedure/pitfalls. The historical packet's A15 uses are forbidden guards for net-ratio nivelling and insurance cost-benefit; signed-elasticity wording does not make A15 an eligible match for either operation.

The new helper first requires the exact complete current registry canonical hash `a67185a7e2f8b3389dccf9ef9108036cd02f0bfe2c270fed0fba15552332aaf8`. It then reverses only the four already-reviewed CLI patches and requires the resulting complete registry hash to equal the exact predecessor `6588a10086ecd1a0f08ac4ff3870469ad011c13970737b27d66f21f59e2dc1cd`. Only those two named operations with A15's existing forbidden role may use the reconstructed historical unit for comparison. The original semantic snapshots and whole-unit hashes are still checked. Only the original registry source path is compared with the predecessor hash, and the packet must retain its original path, canonical hash kind and original hash.

All other protected checks remain active: exact operation/role sets, all-false authority flags, prep-only status, historical ancestry, forbidden-source guards, official evidence and rendered PDF bindings, other source hashes, packet/matrix integrity and all seven negative fixtures. The summary explicitly identifies the accepted successor and preserved forbidden roles. Historical packet, matrix, negative fixture and review-packet bytes were independently verified unchanged.

Independent verification completed:

- Two focused Jest suites, **15 tests passed** (9 successor tests and 6 existing provenance tests).
- Actual protected gate and throughput packet pass; all **7/7** executable negative fixtures remain detected.
- Additional in-memory tests of the actual gate confirm the original registry still passes, while unrelated unit mutation, partial four-unit application and registry order drift fail.
- Existing regression tests also reject changed historical snapshots, released forbidden roles, repinned historical source hashes and a one-character current A15 mutation.

The lesson tree remains clean at `c07ae61b2635b2a3a59aa81c901273a7a37d5832`; its manifest and previously reviewed content are unchanged. The earlier exact-pair report remains historical evidence for its original commit. This addendum binds the compatibility source files before the next platform commit; successful new full CI is not inferred from the local PASS.
