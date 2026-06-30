# Paragraph Quality-Ref Schema V2

This is the current implemented schema for paragraph quality records.
`docs/L1.5V/F-plan-part-a-b-separation.md` is historical design context; use
this file for active workflow decisions.

## File

Each paragraph stores one quality record at the paragraph root:

```text
X.Y.Z-quality-ref.yaml
```

The file is shared by the two paragraph lanes, but each lane owns only its own
top-level block.

## Required Shape

```yaml
schema_version: 2
partA:
  review_file: "X.Y.Z-review.md"
  review_verdict: "PASS"
  assets:
    missing: []
    svgpng_paired: true
    naming_compliant: true
companion:
  review_file: "X.Y.Z-companion-visual-review.md"
  review_verdict: "PASS"
  hard_fails_open: 0
```

Additional lane-specific evidence fields are allowed when they remain inside
the lane-owned block.

## Ownership

Part A textbook owners maintain `partA:`. This block records textbook review and
textbook asset state. Publisher-print PDF evidence belongs to Part A when
`--profile publisher-print` is in scope.

Part B companion owners maintain `companion:`. This block records the companion
visual review outcome for the student-web route: HTML/game companions, the PPTX
presentation route, web visual variants, route/affordance checks, and related
student-facing companion evidence. Part B does not own PDF output in the normal
lane; PDF output remains Part A / publisher-print unless a future human decision
creates a separate PDF lane.

## Validator Contract

`scripts/validate-paragraph.js` reads exact filenames:

- `X.Y.Z-review.md` for Part A;
- `X.Y.Z-companion-visual-review.md` for Part B;
- `X.Y.Z-quality-ref.yaml` for lane-owned quality evidence.

Mode behavior:

| Mode | Reads `partA:` | Reads `companion:` | Required review file |
|---|---|---|---|
| `--mode part-a` | yes | no | `X.Y.Z-review.md` |
| `--mode part-b` | no | yes | `X.Y.Z-companion-visual-review.md` |
| `--mode complete` | yes | yes | both review files |

Part B and complete modes require `companion.review_file`,
`companion.review_verdict`, and `companion.hard_fails_open` to match
`X.Y.Z-companion-visual-review.md`. A `PASS` or `PASS WITH FLAGS` companion
review must have `hard_fails_open: 0`.

## Lane Scope

The lane-scope checker treats block edits as lane-owned:

- textbook lane may edit `partA:` only;
- companion lane may edit `companion:` only;
- shared lane may not edit lesson quality-ref blocks unless a reviewed
  machine-readable lane-scope exception is included.

If one lane discovers a defect in the other lane's block, open an explicit
repair follow-up or include a reviewed lane-scope exception. Do not silently
repair the other lane's quality block.
