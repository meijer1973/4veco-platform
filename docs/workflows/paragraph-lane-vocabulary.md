# Paragraph Lane Vocabulary

Use exactly two operational lane names for paragraph work.

| Operational lane | Allowed aliases | Owns | Does not own |
|---|---|---|---|
| Part A textbook lane | Part A, textbook lane | Textbook source markdown, textbook HTML renders, core textbook visuals, `X.Y.Z-review.md`, `X.Y.Z-textbook-handoff.md`, `partA:` quality-ref values, and publisher-print PDFs when explicitly requested. | Companion route, companion games, companion/student-web HTML files, PPTX companion presentation, `_paragraph-plan.md`, `X.Y.Z-companion-visual-review.md`, or `companion:` quality-ref values. |
| Part B companion lane | Part B, companion lane, student-web companion lane | Student-facing companion route, `index.html`, companion HTML/game surfaces, PPTX companion presentation, web visual variants, shared game data, `_paragraph-plan.md`, `X.Y.Z-companion-visual-review.md`, and `companion:` quality-ref values. | Textbook source markdown, textbook HTML renders, core textbook visuals, `X.Y.Z-review.md`, publisher-print PDFs, or `partA:` quality-ref values. |

## Terms That Are Not Lanes

- `student-web` is a validator profile name, not a third operational lane.
  Use it only when quoting `--profile student-web` or describing the Part B
  companion/student-web deliverable set. In `--mode part-a --profile
  student-web`, the validator checks Part A textbook HTML renders and source
  prerequisites; it does not move those files into Part B.
- `complete` is an integration verification mode after both lanes exist, not a
  production lane.
- `office`, `legacy-full`, and `publisher-print` are export/validation
  profiles, not lanes.

## Preferred Wording

- Say "textbook HTML render" for Part A HTML files.
- Say "companion/student-web output" for Part B HTML, game, route, and PPTX
  files.
- Say "publisher-print PDF" for Part A PDF output.
- Do not say that Part A owns "student-web material"; that phrase belongs to
  the Part B companion lane except when quoting the historical validator
  profile name.
