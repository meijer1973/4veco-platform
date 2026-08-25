# PR #200 Current-Main Conflict Resolution Log

Generated: 2026-08-23

Base merged: `origin/main` at `0d8ff433031f88062e884f6c67ebd47dbcc61dd1`

Resolution rule: current `main` remained authoritative for route behavior,
review guardrails, and current repository state. The PR reapplied only the
normal Part A PDF human-review requirement and the two-lane terminology on top.

## Content Conflicts

| Path | Resolution | Current-main behavior retained | PR #200 clarification retained |
|---|---|---|---|
| `AGENTS.md` | Began from current main and replaced the ambiguous PDF sentence. | The 14-file baseline is not full-route proof; `Start -> Leer -> Check -> Oefen -> Exit ticket`, advisory short check, and separate target-equivalent exit ticket remain mandatory review scope. | Paragraph PDFs and `build_pdf.py` are normal Part A outputs; publisher-print is the later chapter/book handoff profile. |
| `BUILD-PARAGRAPH.md` | Began from current main and updated only Part A ownership/profile/PDF sections plus matching summary checks. | Current Part B baseline/export matrix, route guardrails, rendered-review requirements, and Office/legacy distinctions remain intact. | Every Part A profile requires `build_pdf.py` and the type-specific paragraph PDF packet for human review. |
| `agents/econ-companion-visual-review.md` | Began from current main and repaired the Part A boundary paragraph. | Full rendered route review and baseline-versus-product hard fail remain intact. | Part A owns paragraph PDFs/build script; publisher-print does not define another lane or the only PDF gate. |
| `reports/github-agent-index-platform.json` | Temporarily retained current-main generated output. | Current-main inventory entries and source state remain available during repair. | No hand merge; this file will be regenerated from the committed repaired source head. |
| `reports/github-agent-index-platform.md` | Temporarily retained current-main generated output. | Current-main inventory entries and source state remain available during repair. | No hand merge; this file will be regenerated from the committed repaired source head. |

## Semantic Auto-Merges

| Path | Review outcome |
|---|---|
| `docs/workflows/web-companion-paragraph-lane.md` | PASS. It keeps the two-lane boundary, web-plus-PPTX Part B line, 14-file validator baseline warning, and full route/check/exit-ticket review requirement. |
| `scripts/tests/validate-paragraph.test.js` | PASS after additions. Current-main route-baseline coverage remains; focused tests now also prove Part A baseline failure without `build_pdf.py` or any required PDF and Part B success without DOCX. |
| `skills/econ-companion-artifacts.md` | PASS. Current-main route completeness and Office/legacy guardrails remain, while paragraph PDFs/build script stay outside Part B. |
| `skills/econ-quality-control.md` | PASS after one wording repair. Current-main baseline-versus-route and split quality-ref guidance remain; publisher-print now reads as the later Part A chapter/book handoff profile instead of a separate PDF handoff. |

## Additional Missed Surfaces

- `build-scripts/README.md` now requires `build_pdf.py` and the complete Part A
  paragraph PDF packet in baseline Part A validation and retains the full-route
  warning for the Part B baseline.
- `build-scripts/templates/textbook-to-companion-handoff.md` now records the
  build script and normal Part A paragraph PDFs independently of optional
  publisher-print chapter/book evidence.
- `docs/workflows/legacy-full-companion-profile.md` now states that the 14-file
  baseline is not the complete product route and that Office exports do not
  replace route/check/exit-ticket proof.

## Generated Resolution

The four GitHub agent-index files and `reports/url-index.md` will be regenerated
as a separate deterministic tail after the repaired source commit. Their final
review therefore binds to generated output, not these temporary merge-stage
versions.
