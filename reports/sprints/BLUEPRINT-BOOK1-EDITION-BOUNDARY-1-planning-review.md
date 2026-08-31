# Sprint BLUEPRINT-BOOK1-EDITION-BOUNDARY-1: Planning Review

## Scope

This independent review is limited to the repaired sprint plan, baseline, plan
JSON, the owned pedagogical-boundary policy, the specified merged PR #219 Part
A contract excerpts, package checker conventions, and the owner-review
requirements for PR #222.

The planning gate commands were rerun:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1-plan.md` — PASS
- `node build-scripts/sprints/check-sprint-bundle.js BLUEPRINT-BOOK1-EDITION-BOUNDARY-1` — PASS

## Findings

### Blocking findings

None.

### Policy compatibility

The plan operationalizes the owner's required compatibility boundary without
weakening the merged Part A contract:

- bounded previews are limited to explanation/context, retrieval of already
  taught prerequisites, or optional perspective;
- a preview cannot earn a `Covered` cell or imply mastery;
- a preview cannot add an independently required operation to the worked
  example, current-content Start check, guided practice, independent practice,
  or doeloefening without reviewed goal/target authority;
- target practice and the paragraph-specific whole-lesson equation of at most
  55 minutes remain protected;
- Book 1 supplied-formula exposure cannot shorten later formal Book 2
  instruction, including the §2.1.1 cost treatment and the later
  revenue/profit/break-even sequence.

These clauses are consistent with the inspected PR #219 surfaces: backward
design starts from lesson goals and the doeloefening, the worked example may
add no untargeted operation, Startopgaven retrieves only taught prerequisites,
and timing may not be achieved by dropping a target operation.

### Operational inheritance and source of truth

The plan avoids a competing source of truth. The complete interpretation stays
in `references/owned/course-blueprint-pedagogical-boundaries.md`, while concise
inheritance pointers are planned for the build guide, operational exercise
builder, textbook lane, and teacher-review mode. The exercise builder remains
the operational Book 2+ Part A sequence/target contract; the owned policy
governs the distinct meanings of exposure, support, independent performance,
and mastery.

### Checker, mutations, and invariants

The proposed platform-only checker and tests cover the required fail-closed
surface:

- every critical compatibility clause;
- both metadata references and the referenced policy;
- `preview_is_mastery: false` and
  `later_formal_treatment_still_required: true`;
- pointer loss from every planned operational surface;
- the active target-registry pointer;
- v5 paragraph counts and total;
- v6 book count, 4+4+3 route, book roles/count model, and Year 1 inheritance;
- Book 1 freeze and no lesson-output mutation.

Implementation must make these assertions exact rather than relying on broad
keyword presence. In particular, the checker/tests should fail for a missing
policy file or wrong metadata path as well as a deleted reference, and the
scope/diff evidence must prove that the target registry itself was not edited.
These are implementation details already encompassed by the plan, not plan
blockers.

### Review, evidence, and integration

The plan correctly requires a fresh teacher-learning-quality review of the
policy and Book 2 handoff, substantive lead review with correction/recheck as
needed, synchronized result and command evidence, current generated indexes,
green exact-head CI, readiness routing, exact-payload owner authorization, the
authorized single-PR integration lane, and green post-merge main CI. The
existing owner review is changes-required evidence, not merge authorization.

### Scope separation

PR #222 remains platform-policy-only. Book 1, the lesson repository, target and
machine/external registries, companion output, and Issue #223 lesson
implementation are forbidden. Issue #223 may continue read-only planning only
until PR #222 is merged and post-merge CI is green. No §2.1.1 source, rendered
output, or evidence may enter this PR.

## Verdict

**PASS — implementation may start.**

The repaired plan fully covers the owner requirements and current Part A
contract, the planned bundle is valid, and no blocking planning defect remains.
This verdict authorizes implementation of the scoped policy/pointer/checker
repair only; it does not authorize merge or Issue #223 student-facing work.
