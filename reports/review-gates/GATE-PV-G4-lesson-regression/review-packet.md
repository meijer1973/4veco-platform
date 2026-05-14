# GATE-PV-G4 Lesson Regression: Evidence Intake Packet

Sprint: `PV-G4`
Status: `evidence_ready_for_hcs_review`

This packet records two lesson-side PV regression proofs for HCS human review. It does not close the gate by itself.

## Context

PV.7 and PV.8 require at least two lesson-side PV regression proofs before any student-facing or machine-authoritative PV promotion can reopen. The current platform-side PV overlay is mature enough for proof intake, but the lesson-side evidence is still absent.

## Current Proof Count

Recorded proofs: `2/2`

## Required Lesson-Team Evidence

- fresh paragraph build or pilot surface uses or validates PV data
- proof is owned and committed by the lesson team when it changes lesson-side output
- no hand-built generated-output patching
- complete paragraph validation passes where applicable
- Book 1 check passes where applicable
- PV data remains a references/data overlay and no PV machine registry is created

## Review Questions After Proofs Exist

### PVG4-Q1

Are at least two lesson-side PV regression proofs recorded and owned by the lesson team?

Recommended answer now: A. Yes, two proof records are recorded.

### PVG4-Q2

Does each proof show PV data being used or validated in a fresh paragraph or pilot surface without hand-built generated-output patching?

Recommended answer now: A. Yes, inspect proof artifacts and validation commands.

### PVG4-Q3

Did complete paragraph validation and Book 1 checks pass where applicable?

Recommended answer now: A. Yes, commands are recorded as passed in the intake.

### PVG4-Q4

Does PV-G4 authorize PV machine promotion or student-facing PV projection?

Recommended answer: A. No.

### PVG4-Q5

What gate status should `GATE-PV-G4-lesson-regression` receive?

Recommended answer now: `human_review_required`.

## Required Conditions Before Closure

- Record two lesson-team-owned proof records.
- Include reproducible validation commands and outputs.
- Confirm no generated lesson output was hand-patched.
- Keep PV records in `references/data/procedure-visual/`.
- Do not authorize machine promotion, student-facing projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.
