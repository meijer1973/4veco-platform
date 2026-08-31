# Sprint PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1: Planning Review

Generated: 2026-08-29

Reviewer: independent planning/review subagent

Verdict: REVISE

## Scope

This review judges whether the sprint plan is ready for implementation of
GitHub issue 218. It checks specification coverage, Part A/Part B and Book 1
boundaries, source-of-truth topology, the proposed non-retroactive guardrail,
evidence, review gates, and stop conditions. It does not review an implemented
contract and does not authorize any change to `4veco-lessen` or lesson output.

Evidence inspected:

- GitHub issue 218 and the attached assignment summary
- `AGENTS.md`
- `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-plan.md`
- `references/data/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1.plan.json`
- `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-baseline.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- the ten proposed active authoring/review surfaces, including the current
  paragraph-level summary and website-help placement rules
- existing workflow/currentness checker and CI wiring conventions
- the read-only product vision, product end state, and companion specification
  at lesson `origin/main`

The bootstrap commands pass:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1`

## Findings Classification

| Finding | Classification | Impact |
|---|---|---|
| The current summary-box and website-help placement conflict is not identified or dispositioned. | blocking | The implementation can retain an active `theory -> worked example -> summary -> website help -> exercises` rule while claiming the issue's `theory -> worked example -> Startopgaven` contract is aligned. |
| The local validation procedure requires a missing sibling `../4veco-lessen` checkout. | blocking | `check:exercise-workflow-currentness` cannot run as planned, and the task lacks deterministic local proof that no lesson-repository file changed. |
| The proposed source-contract checker is non-retroactive and architecturally appropriate, but its per-surface authority roles should be made explicit. | non-blocking | Without role-specific assertions, a checker could encourage duplicated contract prose across every surface and recreate competing sources of truth. |
| Several subordinate issue rules are implicit rather than individually mapped to checker/review evidence. | non-blocking | The main acceptance checklist is covered, but implementation could omit smaller safeguards while the high-level matrix still appears complete. |
| Human review is required before adoption, but the plan does not explicitly distinguish task closure at `READY_FOR_HUMAN_REVIEW` from later human approval/merge authority. | non-blocking | The plan correctly forbids merge and Book 2 production, but the evidence lifecycle should be unambiguous. |

## Blocking Findings

### 1. Summary box and website-help note remain an unresolved structural conflict

Issue 218 and the attached interpretation require the printed progression
`theory -> Uitgewerkt voorbeeld -> Startopgaven`, with the worked example
directly adjacent to theory and only the seven named top-level exercise
sections. Current active guidance instead requires:

`theory -> worked example -> summary box -> website-help note -> exercises`

That rule appears in both `skills/econ-textbook-paragraph.md` and
`references/authored/didactiek-principes.md`. The baseline does not name this
conflict, and the plan says unrelated precision should be preserved. An
implementer could therefore update only the exercise headings and leave a
contradictory printed sequence in place.

The safest in-scope disposition is:

- make the seven named headings one contiguous top-level exercise block;
- place `Uitgewerkt voorbeeld` immediately after theory and
  `Startopgaven` immediately after the worked example;
- retain the summary as a compact non-exercise recap after section 7, outside
  the exercise block and without presenting it as an eighth exercise section;
- retain the website-help copy only as a subordinate, non-heading callout
  inside `Startopgaven` next to the compact route note, explicitly described as
  an optional Part B help pointer rather than a printed Part A route step; and
- add checker mutations for reintroducing either intervening top-level stage.

This preserves useful existing content without widening the task into a
paragraph redesign or a Part B redesign. The plan, baseline conflict list,
fulfilment matrix, implementation procedure, and checker proof must record the
chosen disposition before contract implementation starts.

### 2. The local no-lesson-change proof is not executable in the prepared worktree

The prepared task root currently contains only `4veco-platform`, while
`npm.cmd run check:exercise-workflow-currentness` resolves the lesson
repository at the hard-coded sibling path `../4veco-lessen` and reads its Book
1 output. The planned command therefore cannot pass locally in the stated
environment. The platform `--lane shared` diff check also cannot prove that a
separate lesson checkout stayed unchanged.

Before implementation, the plan must require a clean, read-only sibling lesson
worktree/check-out at the expected path, pinned to and recording the freshly
fetched lesson `origin/main` SHA. It must add explicit command-log evidence that
the entire lesson checkout is clean and unchanged against that baseline. No
lesson branch, file, generation, commit, or push is authorized. Alternatively,
the plan must remove the local-pass claim for the dependent checker and name
exact-head CI as the only execution environment, but that is weaker than the
repository workflow and is not recommended.

## Non-Blocking Findings

The core scope is otherwise well controlled. The plan expressly excludes Book
1 edits/revalidation, all `4veco-lessen` changes, Book 2 paragraph production,
Part B redesign, protected references, target registries, schema migration,
and merge authority. The seven sections, differentiated routes, route-aware
time budget, target-operation backward design, bonus/review distinction,
independent teacher review, lead-review cycle, exact-head CI, and stop
conditions are all represented.

The proposed guardrail is also the right kind: a source-contract checker over
an enumerated set of active platform guidance is non-retroactive and does not
judge printed Book 1 output. To avoid creating a second narrative authority,
the checker design should assign explicit obligations by surface:

- `references/authored/didactiek-principes.md`: didactic rationale and stable
  invariants;
- `skills/econ-exercise-builder.md`: the single full operational Part A
  contract;
- `references/authored/vraagtypen-en-opgaveontwerp.md`: question-type and
  answer-form authority only, with a pointer to the builder for sequence;
- other authoring/review/workflow surfaces: concise inheritance plus only the
  local checks needed for their role.

The checker may hard-code expected invariants as enforcement, but it should not
require every surface to reproduce the full contract. Mutation tests should
prove both authoritative-content loss and inheriting-pointer drift fail.

When correcting the plan, add explicit proof coverage for smaller issue rules
that are currently only implied: the worked example introduces no target-absent
operation, prerequisite retrieval uses already-taught knowledge, the brief
Start check makes no mastery/diagnosis/automatic-routing claim, and closing
review introduces no new theory. Also clarify that sprint delivery stops at a
validated PR ready for human review; later owner approval governs merge and
Book 2 adoption and is not inferred from this planning review.

## Required Corrections

1. Add and resolve the summary-box/website-help placement conflict using a
   contiguous seven-section exercise block and checker mutations.
2. Provision and record a clean read-only sibling lesson checkout, then add
   deterministic whole-repository no-change evidence, or explicitly redesign
   the validation evidence without claiming a local pass.
3. Make checker obligations role-specific so the didactic rationale and full
   operational builder remain the only two deliberately different authority
   layers and all other surfaces inherit concisely.
4. Add the four subordinate contract safeguards named above to the fulfilment
   matrix or checker/reviewer proof.
5. Clarify the boundary between implementation closure at
   `READY_FOR_HUMAN_REVIEW` and later human approval/merge/adoption authority.

After these corrections, rerun both bootstrap validators and request a short
planning recheck. Do not start contract implementation before the blocking
findings are resolved.

## Final Verdict

REVISE. The plan has strong scope control and covers the issue's principal
acceptance criteria, but the unresolved printed-placement conflict and the
non-executable lesson-dependency proof make it unsafe to implement as written.
