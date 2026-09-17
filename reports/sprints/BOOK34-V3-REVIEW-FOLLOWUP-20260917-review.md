# Independent review: Books 3/4 v3 review follow-up

Date: 17 September 2026. Reviewer: independent read-only review agent.

**Implementation verdict: PASS, with no substantive findings.** This is a review of the implementation and local evidence, not merge authorization or a claim that the fresh remote compatibility matrix has already passed.

## Exact reviewed versions

| Repository | Reviewed candidate | Comparison head | Pinned main/base |
|---|---|---|---|
| Platform, PR #252 | `25645ffef951d5bde8470c103657256cebf25d32` | `5d97018b93d3725148a7facd1b2117b06034367f` | `67374a9808d226f1be7e8fa73eb104312c075267` |
| Lessons, PR #54 | `834002c0af233d727b0002fa27423b82dde1a629` | `ed43f3aeafe0fc8bb497902cfc9b23fac8f88a4b` | `a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07` |

Both implementation worktrees were clean when inspected. Review inputs included the owner's `Review_PR252_PR54_Boek34_v3.md`, the actual commit differences, migration/consumer/import code, transition tests, generated query index, the transition contract and the repository-accessible follow-up report. No repository edits, GitHub actions or publication were performed by this reviewer.

## P1: transition and source availability

The bridge is coherent: platform authority remains v3 in both proposed states. Normal v3 target retrieval always uses the complete immutable platform transport at `references/staged/books34-v3/`. It never changes curriculum or chooses sources because a lesson file is missing. Lessons retains content ownership, separately exposed by `canonical_source_locator`; `source_locator` accurately identifies the platform bytes actually read. Stable outline target links resolve to that transport.

The transitional lesson state requires the exact old blueprint identity and pinned lesson baseline, allowing only the two generated archive navigation files to differ. Partial new packages or snapshots are rejected. The final state independently requires the complete v3 lesson package and exact migration outputs. A valid transport does not excuse a damaged or missing final lesson receipt. Both states verify original v2 manifests, payload hashes and closed inventories. The original v2 checker is unchanged by this follow-up.

I independently executed the complete import verifier with `requireTracked: true` against both actual lesson candidate and the pinned historical lesson checkout. Both passed, reporting respectively `v3-projection` and `legacy-v2-projection`, the same active v3 curriculum and the same immutable platform provider. I also directly compared all 814 platform transport files with the lesson delivery: all bytes were identical.

New tests exercise absent/changed manifests, altered/missing sources, changed figures, extra files, a partial transition, unknown blueprint identity, independent final-receipt failure despite valid transport, Git mode and conflict-stage changes, junction injection and unsafe paths. Existing revision, source-context, candidate-status and Book 1/2 preservation tests remain active. There are no newly skipped dependent tests or general edition-directory exemptions.

The cost is deliberate duplication of approximately 68 MiB. The documented immutable transport role and requirement for a separately versioned future delivery prevent this from creating a second editable content owner.

## P2: existing skill and exam retrieval

The export preserves `required_skills` and `exam_codes` as search entities, searchable text and explicit query-result metadata. Through the ordinary CLI using the committed index, each of `A43`, `B01` and `B02` returned both `1.1.1` and `1.1.4`, with the unchanged original mappings. The focused suite also verifies the existing `D1.1` exam mapping and compares all exported mappings with the registry.

The ordinary revision-qualified query for `4.3.2` returned `candidate_review_ready`, empty skill/exam mappings, actual platform transport metadata and the canonical lesson locator. Full context, tables, sources and the 26 source-figure uses remain covered. No canonical codes were invented for the 31 candidates.

## Independent checks

- Three targeted Jest suites passed: `books34-v3.test.js`, `books34-v3-transition.test.js`, `books34-selected-structure.test.js`; **56 tests passed, zero skipped or failed**.
- Complete tracked import verification passed against each of the two actual lesson states.
- Direct raw-byte comparison passed for all 814 files in the two received copies.
- Ordinary committed-index searches passed for A43/B01/B02 and revision-qualified 4.3.2 retrieval.
- Diff inspection confirms the original v2 checker, v2 migration, finite authority transitions, canonical target registry and existing relocation registry were unchanged by this follow-up. Protected Book 2 outline/meta and the original v2 migration still match the pinned main baseline.
- The lesson follow-up changes only two book README files; its 814-file delivery is unchanged from the previous reviewed candidate. Diff hygiene passed.

A first reviewer test command also named a nonexistent `check-books34-v3-import.test.js`; that command's discovery error was a reviewer invocation error, not a PR failure. The corrected three-suite command above completed successfully. The full repository suite was not rerun independently by this reviewer; the implementation agent's full run and fresh remote evidence must be reported separately.

## Remaining integration and content boundaries

Before claiming a supported merge order, obtain a fresh trusted-main compatibility run bound to the final pushed heads and refreshed actual bases, plus required platform CI using lessons main. The implementation supports the intended platform-first transition locally; this review does not replace that remote proof or the normal checks on any later, separately authorized merged state. A navigation/evidence-only commit tail requires confirmation that it contains no substantive implementation change.

All 31 independent target-content reviews, the five timing questions and later cao/vakbonden placement with time allocation remain open. The supplied PDFs are unchanged. The existing Windows evidence establishes equal extracted text and page counts on 490 pages, not raster equality: 326 pages differed and four were visually sampled. Future pixel-identical rebuild claims require exact font bytes and renderer provenance. Neither implementation PASS nor this report authorizes merge, deployment or publication.
