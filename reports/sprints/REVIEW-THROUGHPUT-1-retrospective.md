# REVIEW-THROUGHPUT-1 Retrospective

Generated: 2026-06-14.

## Scope and Source

Scope:

- Platform PRs `#42` through `#56` in `meijer1973/4veco-platform`.
- Lesson PRs `#4` through `#13` in `meijer1973/4veco-lessen`.

Source data was fetched from GitHub with `gh pr view` on 2026-06-14 and
included PR title, state, merge time, changed-file count, additions/deletions,
changed paths, body links, review records, comments, and URL.

This report is retrospective routing advice under
`docs/review/pr-throughput-policy.md`. It does not retroactively authorize any
product use, protected reference mutation, generated output, diagnostics,
mastery, PV, or student/product use.

## Executive Summary

Correctly isolated:

- Protected target/reference mutations were mostly kept separate from generated
  lesson output. The clearest examples are platform `#48` with lesson `#13`,
  and platform `#55` following non-mutating candidate packet `#42`.
- Generated-output lesson PRs were generally paired with platform source/proof
  PRs instead of mixing platform implementation and lesson output in one repo.
- High-authority inspection/quality work stayed in platform governance/report
  PRs rather than lesson output PRs.

Could have been batched:

- Lesson `#5` could have been batched into lesson `#4` as a micro maintenance
  follow-up to the same generated Golden Ticket surface.
- Lesson `#9` and `#10` could have been a single cross-repo bundle for the
  `1.1.2` exit-ticket and advisory short-check deployment if the platform proof
  was ready together.
- Platform `#52` could have been bundled with platform `#48` and lesson `#13`
  as the roadmap follow-through for the same Chapter 2.2 readiness transition.
- Closed superseded PRs platform `#45` and lesson `#11` should have stayed as
  draft evidence or been closed earlier once platform `#47` and lesson `#12`
  replaced them.

Could have used lead-review autonomous closure:

- Platform `#42`, `#43`, `#44`, `#51`, and `#52` are good L1 candidates if
  future packets include the required fields, CI/checker proof, and lead-review
  PASS/PASS WITH FLAGS.
- Platform `#56` could use L1 only for packet publication; any later gate
  decision or mutation stays human-gated.
- Lesson `#5` could use L2 only if the owner preapproves that exact tiny
  generated-output maintenance lane. Otherwise it should batch into its parent
  generated-output bundle.

Required full human review:

- Platform `#46`, `#48`, `#49`, `#53`, `#54`, and `#55`.
- Lesson `#7`, `#8`, `#12`, and `#13`.
- Lesson `#6` required at least an L3 owner one-decision gate because it was a
  large generated-output chapter release; use L4 if the packet also claims
  target finality or product authority.

## Platform PRs

| PR | State | Future class / lane | Correctly isolated | Batch note | Lead-review autonomous | Full human gate |
|---|---|---|---|---|---|---|
| [`#42`](https://github.com/meijer1973/4veco-platform/pull/42) Add concrete placeholder target candidates | merged | `normal_sprint` / L1 candidate | Yes. Non-mutating candidate packet stayed separate from later registry mutation. | Do not batch with `#55`; review-before-mutation is useful. | Yes, with required CI/checker and lead-review proof. | No. |
| [`#43`](https://github.com/meijer1973/4veco-platform/pull/43) Harden MTU-H5 mainline checkers | merged | `normal_sprint` / L1 | Yes. Checker hardening was isolated. | No strong batching opportunity. | Yes. | No. |
| [`#44`](https://github.com/meijer1973/4veco-platform/pull/44) Refresh check-surface evidence for rereview | merged | `normal_sprint` gate-evidence refresh / L1 | Yes. Evidence refresh did not close the gate by itself. | Could only batch with later gate artifacts if no human decision boundary sits between them. | Yes for evidence refresh only. | No for this PR; later gate closure remains human. |
| [`#45`](https://github.com/meijer1973/4veco-platform/pull/45) Implement paragraph landing V2 route | closed | Superseded draft | No final merge. | Should have stayed draft or been replaced before review overhead accumulated. Superseded by `#47`. | No. | No. |
| [`#46`](https://github.com/meijer1973/4veco-platform/pull/46) INSPECT-9 Dutch evidence gap closure plan | merged | `high_authority` / L4 | Yes. Inspection evidence planning stayed in governance reports. | Do not batch across inspection gate steps unless one packet explicitly authorizes the sequence. | No. | Yes. |
| [`#47`](https://github.com/meijer1973/4veco-platform/pull/47) Replace paragraph landing V2 prototype renderer | merged | `cross_repo_bundle` / L3-L4 with lesson `#12` | Yes. Platform renderer/proof was separate from lesson output. | Correct bundle partner is lesson `#12`; superseded `#45`/`#11`. | No as a bundle, because paired lesson PR touched product specs/output. | Yes at bundle level because lesson `#12` touched product specs. |
| [`#48`](https://github.com/meijer1973/4veco-platform/pull/48) Add mixed-opgaven target standard and accept 2.1.4 | merged | `protected_reference` / L4 | Yes. Protected target/reference work stayed in platform, paired with lesson `#13` output. | Could include roadmap follow-through `#52` in the same bundle. | No. | Yes. |
| [`#49`](https://github.com/meijer1973/4veco-platform/pull/49) INSPECT-9A Chapter 1.2 target and exam-linkage remediation | merged | `protected_reference` plus `high_authority` / L4 | Yes. Target/exam-linkage remediation was isolated. | Do not batch with adjacent INSPECT steps unless the human gate authorizes the sequence. | No. | Yes. |
| [`#50`](https://github.com/meijer1973/4veco-platform/pull/50) Add check surface closure proposal | merged | `high_authority` proposal / L3 | Mostly. Proposal stayed separate from final closure. | Keep separate if human comments/decision occurred between proposal and closure. | No. | Not by itself; closure does. |
| [`#51`](https://github.com/meijer1973/4veco-platform/pull/51) Refresh MTU-H5 post-q3 diagnostic evidence | merged | `normal_sprint` report refresh / L1 with explicit no-diagnostics-authority claim | Yes. Report/checker refresh only. | Could be bundled with a later MTU-H5 packet if proof was ready together. | Yes, if packet explicitly says no diagnostics authority. | No. |
| [`#52`](https://github.com/meijer1973/4veco-platform/pull/52) Update textbook roadmap for Chapter 2.2 readiness | merged | `micro_maintenance` or `normal_sprint` / L1 | Partly. It was a small roadmap follow-through. | Better bundled with `#48` and lesson `#13`. | Yes. | No. |
| [`#53`](https://github.com/meijer1973/4veco-platform/pull/53) Close check surface evidence gate | merged | `high_authority` gate closure / L4 | Yes. Closure was separate from proposal and evidence refresh. | Do not batch across the human decision boundary. | No. | Yes. |
| [`#54`](https://github.com/meijer1973/4veco-platform/pull/54) INSPECT-9B target-equivalent and accessibility/support review | merged | `high_authority` / L4 | Yes. Inspection target-equivalent/accessibility review stayed in governance reports. | Do not batch unless a single human packet covers the sequence. | No. | Yes. |
| [`#55`](https://github.com/meijer1973/4veco-platform/pull/55) Replace Book 1 mixed target placeholders | merged | `protected_reference` / L4 | Yes. Actual target registry replacement followed the non-mutating candidate packet. | Do not batch with `#42`; the separation is a good safety boundary. | No. | Yes. |
| [`#56`](https://github.com/meijer1973/4veco-platform/pull/56) Prepare MTU-H5 q19 repair gate | open | Gate packet publication / L1 for publication, L4 for decision | Yes if it remains packet-only. | Could bundle with the eventual q19 decision only if the packet is still reviewable and no mutation sneaks in. | Yes for packet publication only. | Later gate decision requires human review. |

## Lesson PRs

| PR | State | Future class / lane | Correctly isolated | Batch note | Lead-review autonomous | Full human gate |
|---|---|---|---|---|---|---|
| [`#4`](https://github.com/meijer1973/4veco-lessen/pull/4) Deploy golden ticket layout reset | merged | `generated_output` cross-repo bundle / L3 with platform `#18` | Yes. Lesson output was separate from platform source/proof. | Could have included tiny follow-up `#5` if known. | No. | Not necessarily L4; L3 owner decision is enough if no product authority is claimed. |
| [`#5`](https://github.com/meijer1973/4veco-lessen/pull/5) Deploy hidden golden ticket workbench header | merged | `micro_maintenance` generated-output lane / L2 if preapproved | Partly. Very small generated-output maintenance. | Best batched into `#4`; otherwise L2 needs exact owner preapproval. | Yes only as L2 owner-preapproved lane. | No. |
| [`#6`](https://github.com/meijer1973/4veco-lessen/pull/6) Add Book 2 Chapter 2.1 textbook output | merged | `generated_output` / L3, L4 if target/product authority is claimed | Yes. Large generated textbook output was isolated. | Do not batch with unrelated small fixes; it is review-heavy enough alone. | No. | L3 minimum; L4 if finality/product authority is part of the packet. |
| [`#7`](https://github.com/meijer1973/4veco-lessen/pull/7) Sync REV-STD-1 review standard | merged | `high_authority` / L4 | Yes. Review-standard/spec sync was separate from generated output. | No safe batching unless paired with platform `#31` in one bundle. | No. | Yes. |
| [`#8`](https://github.com/meijer1973/4veco-lessen/pull/8) Align Book 2 2.1 target status refs | merged | `high_authority` or owner-gated metadata / L4 | Partly. Small diff, but status refs are authority-adjacent. | Could have been included in the Book 2 output bundle if reviewed together. | No unless an owner-preapproved metadata lane exists. | Yes by default. |
| [`#9`](https://github.com/meijer1973/4veco-lessen/pull/9) Deploy 1.1.2 rendered exit-ticket output | merged | `generated_output` / L3 with platform `#34` | Yes. Output paired with platform proof. | Could batch with `#10` as a `1.1.2` generated-output bundle. | No. | No unless product authority is claimed. |
| [`#10`](https://github.com/meijer1973/4veco-lessen/pull/10) Deploy 1.1.2 advisory short check | merged | `generated_output` / L3 with platform `#38` | Yes. Output paired with platform proof. | Could batch with `#9`. | No. | No unless product authority is claimed. |
| [`#11`](https://github.com/meijer1973/4veco-lessen/pull/11) Add paragraph landing V2 spec and outputs | closed | Superseded draft | No final merge. | Should have been held as draft evidence and superseded by `#12` earlier. | No. | No final gate because closed. |
| [`#12`](https://github.com/meijer1973/4veco-lessen/pull/12) Add paragraph landing V2 repair spec and outputs | merged | `cross_repo_bundle` plus product specs / L4 with platform `#47` | Yes. Paired with platform renderer/proof. | Correct replacement for `#11`; bundle with `#47`. | No. | Yes because product specs and generated output changed together. |
| [`#13`](https://github.com/meijer1973/4veco-lessen/pull/13) Update 2.1.4 mixed-opgaven target output | merged | `cross_repo_bundle` generated output / L4 with platform `#48` | Yes. Lesson output followed protected platform target decision. | Bundle with `#48`; platform `#52` could have joined as roadmap follow-through. | No. | Yes at bundle level because platform `#48` touched protected target authority. |

## Recommended Future Packet Routing

Use L1 for normal platform-only PRs when all of these are true:

- no protected reference, machine/external reference, generated lesson output,
  product-spec authority, diagnostics, mastery, PV, or student-use authority;
- `proof.ci` and `proof.checkers` are complete;
- `review_autonomy.lead_review_result` is PASS or PASS WITH FLAGS;
- `escalation_triggers` is empty.

Use L3 for generated-output bundles that are bounded, source-backed, and do not
claim product authority.

Use L4 for protected references, product specs, target finality,
inspection/school-facing authority, review-gate closure, diagnostics, mastery,
PV, adaptive routing, summative use, student-facing AI, or student/product use.

Use `cross_repo_bundle` whenever platform source/proof and lesson output are
part of one logical change. The highest-risk PR in the bundle determines the
bundle lane.
