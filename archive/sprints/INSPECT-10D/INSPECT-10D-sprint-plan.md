# Sprint INSPECT-10D: Internal Diagnostic Tool Acceptance And Operating Procedure

Status: implementation plan
Date: 2026-06-17
Sprint: `INSPECT-10D`

## Goal

Decide whether the merged and stability-hardened INSPECT-10B manual internal
diagnostic generator may be accepted as a stable internal tool, and define the
operating procedure for how agents may invoke it without creating new
authority.

INSPECT-10D is an operating-procedure sprint only. It may perform a
non-semantic byte-stability refresh of the existing Chapter 1.2 diagnostic
report pair if validation proves the committed metadata depends on
worktree-specific line endings. It does not generate new diagnostic outputs,
evidence packs, teacher/school-facing output,
public/external output, package scripts, CI/build gates, dashboard gates,
quality-ref integration, Scale Gate integration, product-route adoption,
diagnostics/mastery/PV authority, student-use authority, product-use
authority, source-registry mutation, generated lesson-output mutation, or
personal-data processing.

## Context

PR #83 merged INSPECT-10C after final refresh against `main`, fresh
`platform-ci / validate-platform`, and empty review-thread checks. INSPECT-10C
closed the stability-hardening follow-up for the INSPECT-10B manual internal
diagnostic generator by adding the manual stability checker, keeping all
Chapter 1.2 blockers visible, aligning Markdown/JSON output-file visibility,
and removing stale post-merge owner-action wording.

The next permitted step named by the human review packet is not broader output.
It is a decision/hardening sprint:

```text
INSPECT-10D Internal Diagnostic Tool Acceptance And Operating Procedure
```

This sprint must define when the manual generator may be run, preconditions
before running it, post-run checks, what changed output means, and when work
must stop for a new human-reviewed sprint.

## Quality Standard

The quality floor for this sprint is faithful operating-procedure definition
against the INSPECT-10B/10C specification without authority creep. The
procedure must make the rendered output status clear: the Chapter 1.2 report
pair is internal diagnostic output only, not student-facing, teacher-facing,
public, external, pack-strength, or product-use proof. Closure proof must show
that the procedure cites product end-state and original sprint/gate specs,
keeps all blockers visible, preserves manual-only invocation, and names every
follow-up that would require a new human-reviewed sprint.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Product end-state and original spec are cited | Sprint plan and operating procedure cite the end-state, roadmap, INSPECT-10B, and INSPECT-10C packets | Sprint-plan checker and REV-STD-1 lead review | planned |
| Operating procedure defines allowed invocation | Procedure states who may run the generator, when it may be run, and which command modes are allowed | Lead review and specialist gate | planned |
| Preconditions are explicit | Procedure lists branch/worktree, source, output, blocker, and scope checks before invocation | Lead review and validation log | planned |
| Post-run checks are explicit | Procedure lists generator `--check`, stability checker, scope-language, roadmap index, URL index, diff hygiene, and lesson read-only status checks | Validation log | planned |
| Changed output semantics are safe | Procedure says changed diagnostic output is a review signal, not downstream authority or pack proof | Specialist gate and lead review | planned |
| Byte-stable invocation is reproducible | `.gitattributes` pins the diagnostic source/report files that the checker compares by bytes, and the existing report pair is refreshed only for non-semantic source metadata if required | Generator `--check`, stability checker, diff review, and lead review | planned |
| Stop conditions preserve blockers | Procedure refuses evidence-pack, teacher/school-facing, public/external, package/CI, dashboard, quality-ref, Scale Gate, product-route, diagnostics/mastery/PV, student/product-use, protected-reference, generated lesson-output, personal-data, and compliance/approval requests | Lead review and closure log | planned |
| No missing core requirement carried as PASS WITH FLAGS | Closure must revise on missing procedure, blocker, validation, or review proof | Lead review, correction log, and closure log | planned |

## Quality Improvement Candidates

| Candidate | Classification | Decision |
|---|---|---|
| Add an internal diagnostic tool operating procedure | `include_now` | In scope; this is the sprint's core output |
| Record exact preconditions, invocation modes, and post-run checks | `include_now` | In scope; prevents informal use from becoming authority |
| Pin byte-stable diagnostic source/report files and refresh existing metadata if needed | `include_now` | In scope only as a non-semantic reproducibility repair for the existing internal report pair |
| Update roadmap, ledger, end-state, and version index to make INSPECT-10D the active step | `include_now` | In scope as bookkeeping for human review |
| Add package scripts, CI gates, dashboard hooks, or quality-ref/Scale Gate integration | `defer_named_follow_up` | Requires later human-reviewed authority and is not approved here |
| Generate new diagnostic outputs or evidence packs | `reject_scope_creep` | Explicitly blocked |
| Use the diagnostic report for teacher/school-facing, public/external, product-route, diagnostics/mastery/PV, student-use, or product-use decisions | `reject_scope_creep` | Explicitly blocked |

## Allowed paths

- `archive/sprints/INSPECT-10D/INSPECT-10D-sprint-plan.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-planning-review.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-validation-log.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-lead-review-assignment.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-lead-review-round1.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-correction-log.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-lead-review-round2.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-specialist-gate-results.md`
- `archive/sprints/INSPECT-10D/INSPECT-10D-closure-log.md`
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- `.gitattributes`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.md`
- `reports/inspection-standards/chapter-1-2-diagnostic-report.json`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`
- Repository maps and indexes regenerated by standard commands if they change

## Forbidden paths

- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `build-scripts/inspection/check-dutch-diagnostic-report-stability.js`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `../4veco-lessen/` except read-only status checks
- Any generated lesson-output path
- Any package, CI/build, dashboard, quality-ref, or Scale Gate integration path
- Any evidence-pack, teacher/school-facing, public/external, student/product-use, product-route, diagnostics/mastery/PV, personal-data, or compliance/approval path

## Inputs

- PR #83 human review verdict and merged INSPECT-10C packet
- INSPECT-10B sprint plan, validation log, lead review, closure log, and generator/report pair
- INSPECT-10C sprint plan, validation log, lead review, closure log, and stability checker
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `build-scripts/inspection/build-dutch-diagnostic-report.js`
- `build-scripts/inspection/check-dutch-diagnostic-report-stability.js`

## Outputs

- INSPECT-10D sprint artifacts
- `docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md`
- Byte-stability attributes and existing diagnostic report metadata refresh if
  validation proves the committed report is not reproducible from a clean
  checkout
- Roadmap, ledger, end-state, and roadmap-version-index updates that make
  INSPECT-10D the active operating-procedure step

## Operationalized sprint procedure

1. Stop if `main` is stale, the branch is not under the allowed agent prefix,
   the worktree safety claim fails, or the diff touches any forbidden path.
2. Create the operating procedure with sections for allowed invocation,
   preconditions, command sequence, post-run checks, changed-output semantics,
   stop conditions, and required new human review before any broader use.
3. Keep generator code unchanged. Keep the generated Chapter 1.2 report pair
   semantically unchanged; a byte-stability metadata refresh is allowed only if
   validation proves the committed report is stale because of line-ending
   instability.
4. Update only the allowlisted roadmap, ledger, end-state, and version-index
   files needed to record INSPECT-10C closure and INSPECT-10D as the active
   operating-procedure sprint.
5. Run acceptance validators and record command evidence. If any validator
   fails because a core requirement is missing, stop for correction rather
   than carrying it as PASS WITH FLAGS.
6. Perform REV-STD-1 lead review with product end-state, original sprint/gate
   spec, non-negotiables, core checklist, finding classifications, and
   `blocks` / `does_not_block` / `proof_required_to_close` fields.
7. Run the teacher/usefulness, legal/privacy/claims, and Dutch
   quality-inspection specialist subagent gate before human review because
   this procedure governs later agent use of the diagnostic tool.
8. Push the branch and open a PR for human review. Human review must decide
   only whether INSPECT-10D safely defines the internal operating procedure;
   it must not unlock downstream surfaces.

## Acceptance tests

```bash
npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-10D-20260617 --agent codex --require-prefix codex/,agent/
node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-10D/INSPECT-10D-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-10D
node build-scripts/inspection/build-dutch-diagnostic-report.js --check
node build-scripts/inspection/check-dutch-diagnostic-report-stability.js
npm.cmd run check:scope-language
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run agent:index
npm.cmd run dashboard:internal
git diff --check
git -C C:\Projects\4veco\4veco-lessen status --short
npm.cmd run check:platform
```

The legacy sprint bundle checker is listed for protocol completeness but is
not expected to validate archive-based sprint packets unless the helper is
later updated.

## Proof Required to Close

Closure proof to close INSPECT-10D requires the operating procedure to exist,
the sprint plan to pass, byte-stability attributes to be scoped to the existing
diagnostic source/report files, generator `--check` and the INSPECT-10C
stability checker to remain green from a clean checkout, roadmap version index
and URL index checks to pass, scope-language and diff hygiene checks to pass,
the lesson checkout to remain read-only, platform tests to pass, REV-STD-1
lead review to pass, the specialist subagent gate to return
`MORE_THAN_SATISFIED`, and no missing core requirement to be carried as PASS
WITH FLAGS.

## Rollback plan

Before merge, rollback is branch-local: revert the INSPECT-10D commit or close
the PR. After merge, rollback is to revert the INSPECT-10D operating-procedure
commit and restore the roadmap/ledger/version-index wording to the INSPECT-10C
state. No generator code, generated diagnostic report, package/CI, dashboard,
quality-ref, Scale Gate, generated lesson-output, source-registry, protected
reference, or downstream product path is changed.

## Human review required

Yes. Human review must confirm that INSPECT-10D is only an internal diagnostic
tool acceptance and operating-procedure sprint. Human review does not
authorise evidence packs, teacher/school-facing output, public/external output,
package/CI/dashboard/quality-ref/Scale Gate integration, generated
lesson-output mutation, product-route adoption, diagnostics/mastery/PV,
student-use, product-use, personal-data processing, or compliance/approval
authority.
