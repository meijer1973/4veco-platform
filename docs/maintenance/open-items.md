# Carried requirements from archived planning

Archiving changes location only. Current roadmap decisions and source approvals
remain authoritative. Unknown below means implementation/closure has not been
proved by this cleanup; it is neither a new approval nor a reopened decision.

## Companion quality

Source: [April quality review](../../archive/knowledge/old/platform-team-companion-quality-gate-review.md).
Current owner: platform companion workflow and the lesson roadmap.

| Requirement | Current disposition | Concrete next action |
|---|---|---|
| Verify news URL reachability, redirects, title/date and source drift | Unknown against the current news sources; structural URL syntax is insufficient | Audit current news builder/data URLs and add title/date/redirect evidence to the source check |
| Complete-mode quality-ref coverage and freshness | Separate Part A/Part B records and companion blocks exist in `scripts/validate-paragraph.js`; the 1.1.1 check passes. This does not prove every freshness case | Test newer output against an older quality record and verify all companion sources/data/assets are covered |
| Surface review flags and require disposition before scale | Review records and dashboard exist; no general scale approval follows from a passing paragraph check | Reconcile current flags with the lesson roadmap and applicable human gates |
| Map each planned visual to its intended output | Asset integrity and declared companion assets are checked; full per-surface embedding remains unverified | Compare the plan assignment table with rendered/current output and add missing checks through platform tooling |
| Repeatable browser smoke for quiz, newsdetective, procedure, reasoning and skilltree | Current runbooks require browser proof; the April complaint alone does not establish that every route is covered | Audit one current paragraph's repeatable browser gate across all five surfaces |
| Align data-test and paragraph-validator content thresholds | Unknown; structural startability is not content quality | Compare difficulty/category thresholds in data tests and paragraph validation, then resolve inconsistent expectations |

## Pipeline coordination

Source: [coordination handoff](../../archive/knowledge/Improvement%20production%20pipeline/pipeline-coordination-handoff.md).
Owner: platform maintenance; current worktree safety remains mandatory.

| Requirement | Current disposition | Concrete next action |
|---|---|---|
| File/paragraph-level claims declared before kickoff | Dedicated branch/worktree ownership is implemented; it is not path-level claims across sprints | Inspect current sprint templates and define the missing claim granularity with the owner |
| Aggregate both repositories' active claims | Not established by this cleanup | Reconcile the active sprint ledgers and design one generated claim registry if absent |
| Detect overlapping claims at kickoff/on plan changes | Worktree collision checks exist; overlapping file claims across different worktrees remain unproved | Add overlap cases to the claim-registry acceptance checks |
| Detect closed/stale claims and release them | Worktree locks report age; scheduled closed-sprint release is a separate unproved requirement | Compare completed sprint state with live claims and establish a release/staleness check |
| Dashboard visibility with conflict status | Historical roadmaps are now separated from current priorities; claim visibility is not established | Add the registry's conflict/release projection once its contract is accepted |
| Enforce shared-resource ownership and generated-output restrictions | CLI/protected-source rules exist; coverage of every generated/shared lesson path is not established | Compare the declared protected/shared list against actual CI enforcement with negative tests |
| Reviewable design, migration/conflict procedure, Phase A retrospective and four consecutive conflict-free sprints | No evidence of full delivery established here | Locate accepted coordination design/rollout evidence or keep each missing deliverable open; do not infer it from worktree locks |

The original phased timing and named April sprints are historical estimates, not
new scheduling authority. Preserve the two-repository boundary and existing
source/CLI ownership when resolving these requirements.

## Reference and April design inputs

Sources: [old platform roadmap](../../archive/knowledge/old/platform-team-roadmap.md),
[three-month roadmap](../../archive/knowledge/old/three-month-roadmap.md), and
[April schema/design packet](../../archive/knowledge/Exercise%20schema%20and%20quality/).
Owner: [current reference roadmap](../../references/reference-team-roadmap.md).

| Requirement or condition | Disposition and next action |
|---|---|
| Reference report drift, term/unit consistency, missing-unit triage and deprecated/exam-code links | Original report counts are historical. Use current reference health/source validators to reconcile unresolved items; do not mint units from the archived backlog |
| Bloom/vraagtype/instruction-word vocabulary, dual-coding stages, level, graph specs, precision lint and direct eindterm linkage | Preserve the CP-1 schema-audit relationship and current gate decisions. Resolve each unmatched proposal through the existing schema-audit/current-reference workflow; archive placement is not adoption |
| Owned source scope, exercise roundtrip, skill-registry coexistence, D04 disposition and Year-1 coverage | Existing CP-2 through CP-6 decisions remain controlling. Consult their closure records and current reference roadmap before changing scope; unknown downstream closure stays unknown |
| Original HCS/engineering feedback and competing proposed roadmaps | All 13 files remain intact and indexed with original commit views. Compare unresolved proposals to the accepted current contract; do not treat a historical proposal as a replacement specification |
| First companion MVP, reliable production and teacher-facing clarity/pacing/graph/answer-model/exam-fit proof | Current 1.1.1 artifacts and validation exist, but broad scaling/teacher acceptance is not proved by this cleanup. Follow current Part A/Part B review and lesson roadmap holds |
| `S7` and `PV-G4` legacy compatibility entries | Keep both plans in place. No result JSON establishes closure; reconcile the named conditions with current gate records before any closure claim |
| L-CP6E and carried L-CP6A / Year-1 / CP-6 conditions | Keep lesson tickets and live roadmap conditions visible; only their established decision process can close them |
| Python PPTX roundtrip wrapper points to absent `lib/roundtrip-pptx.py` | Keep `build-scripts/archive/roundtrip-pptx.py`; deliberately repair or retire the unused wrapper in a separate maintenance change |

The [archive index](../../archive/index.md) includes every relocated April input
with its original path and source commit. The complete original live roadmaps
are preserved under `archive/roadmaps/snapshots/`; their execution narratives are
available without crowding normal search results.
