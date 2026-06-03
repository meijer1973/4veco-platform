# Sprint TASK-CONTEXT-SPEC-1: Baseline

Generated: 2026-06-03

## Plan reference

Plan: `reports/sprints/TASK-CONTEXT-SPEC-1-plan.md`

## Current git state

- Platform repo starts clean on `main` aligned with `origin/main`.
- Last platform commit before this sprint: `631c31a Add exam source authority contract`.
- Lesson repo is read-only for this planning phase unless a later roadmap
  mirror edit is explicitly escalated.

## Existing task-shell baseline

- `engines/task-shell-engine.js` defines deterministic task families and
  boundary flags, but it does not define a first-class context block schema.
- `engines/task-shell-ui.js` renders task interactions, but this sprint may
  not edit runtime rendering.
- `TASK-FAMILY-CONSTRUCT-1` and `TASK-FAMILY-SOURCE-1` define source-value and
  source-chain task actions, but not the source/context material that must
  appear before those actions.
- `EXAM-SOURCE-AUTH-1` provides the external-primary sourceAuthority contract
  that later context bundles can cite.

## Data integrity notes

This sprint starts with no authorized protected reference data changes. It may
read but not edit `reports/json/exam-source-authority1-contract.json`, task
shell runtime files, prior task-family contracts, official exam mirrors, or
lesson output.

It may not edit `references/machine/`, `references/external/`, source data,
candidate storage, target-exercise records, runtime task-shell files, PV
machine-promotion files, or generated Book 1 lesson output.

## Stop conditions

- Stop if the contract would require runtime rendering changes.
- Stop if a positive fixture needs actual source reconstruction or copied
  source images.
- Stop if the checker cannot reject missing alt text, bad refs, answer leakage,
  raw copied images, inconsistent captions, or internal-code exposure.
- Stop if implementation would require source-data mutation, protected
  reference mutation, generated lesson output, product-route adoption, or Scale
  Gate authority.
