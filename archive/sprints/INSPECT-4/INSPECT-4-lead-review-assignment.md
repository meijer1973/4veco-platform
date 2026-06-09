# INSPECT-4 Lead Review Assignment

Status: assigned
Date: 2026-06-08
Lead reviewer: `agents/lead-reviewer-agent.md`
Testing reviewer: `agents/testing-agent.md`

## Review Scope

The lead review must decide whether INSPECT-4 produced a manual diagnostic
validator without turning it into a build gate, dashboard gate, quality-ref
integration, Scale Gate input, evidence-pack generator, or compliance-claim
mechanism.

## Required Evidence

- Human authorization record.
- Sprint plan and planning review.
- Validator script.
- Validator design document and validator notes.
- Sample report-only evidence object.
- Updated roadmap, ledger, profile metadata, evidence model, README, and URL
  surfaces.
- Validation log with command and exit-code evidence.
- Git diff proving no package script, CI/build gate, generated lesson artifact,
  quality-ref file, dashboard gate, Scale Gate integration, country overlay,
  evidence pack, teacher pack, or compliance claim was added.

## Required Review Questions

1. Is the validator manual, diagnostic, and report-only?
2. Does weak evidence return warnings without non-zero exit?
3. Does pilot mode allow partial category coverage?
4. Does full-report mode require all eight categories only in that explicit
   mode?
5. Are forbidden-claim checks described as limited known-phrase checks?
6. Did validation run with command and exit-code evidence?
7. Did the sprint avoid all forbidden implementation work?

## Required Next Action

After validation, perform lead-review round 1, record the correction/no-
correction pass, then perform lead-review round 2 before closure.
