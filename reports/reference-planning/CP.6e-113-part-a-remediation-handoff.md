# CP.6e 1.1.3 Part A Remediation Handoff

Generated: 2026-05-21

Status: failed_clearance

## Handoff Need

Lesson-side remediation is required before the `1.1.3` Part A flag can be cleared.

## Exact Blocking Issue

The live `1.1.3 Grafieken en tabellen – paragraaf.md` still mentions `Figuur 3` before `Figuur 2`.

Current first-use sequence:

```text
1 -> 3 -> 2
```

Expected first-use sequence:

```text
1 -> 2 -> 3
```

## Required Route

If remediation is needed, it must happen through an authorized lesson-side remediation/regeneration workflow. Do not hand-patch generated lesson output or quality refs from the references repo.

## Acceptance Evidence Needed Back

- lesson commit SHA;
- list of changed/generated `1.1.3` files;
- validation commands and outputs;
- updated Part A review/quality evidence showing the figure-numbering flag is cleared or explicitly accepted;
- confirmation that CP-6 and Year 1 are not closed by the lesson-side correction.
