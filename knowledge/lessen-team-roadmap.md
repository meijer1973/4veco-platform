# Lessen Team Roadmap

## Sprint Ledger

| Sprint | Name | Completed | Current State |
|--------|------|-----------|---------------|
| L0.5 | Green Gate Handoff | yes | Book 1 Part A and the platform/book health routine are green. |
| L1.1 | First Companion Technical Pilot | yes | `1.1.1` passes the current complete technical gate. |
| L1.2 | Second Companion Technical Probe | yes | `1.1.2` proved the technical pattern can repeat; probe materials were removed for didactic rebuild. |
| L1.3 | Companion Layout And Front-End Usability | no | Current priority. Improve companion layout, navigation, readability, and front-end usability before scaling. |
| L1.4 | Post-Layout Scaling Decision | no | Decide whether to expand after the improved layout is platform-integrated and regenerated. |
| L2.1 | Book 1 Release Polish | no | Teacher-facing polish continues under the Book 1 health gate. |
| L2.2 | Book 2 Part A Textbook Layer | no | Start Book 2 Part A only under the chapter/paragraph hard gates. |

## Roadmap Metadata

Generated: 2026-04-23  
Updated: 2026-04-24 after companion pilot review and layout/UI reprioritization  
Source: split from `knowledge/three-month-roadmap.md` after Sprint 0.5 sign-off

## Mission

Own the material side of delivery:

- Book 1 release polish
- Book 2 Part A textbook production
- companion MVP work, treated as an active pilot until quality and usability are good enough to scale

## Current Status

Sprint 0.5 is signed off for Part A textbook/book production.

That means:

- Book 1 Part A is green.
- Book 2 Part A can start.
- Companion production may continue, but it is still pilot work.

The first companion pilot has now been run, and the technical pattern has also
been repeated for a second paragraph. The 1.1.2 probe materials were removed
after the technical test because that paragraph must be recreated with explicit
teaching and didactic design instructions. That does not finish the companion pilot.
The main current issue is companion layout and front-end usability: the materials
need to feel more usable, readable, navigable, and coherent before this pattern
is repeated across many paragraphs.

Important boundary:

- A complete paragraph plus companion pipeline is not yet routine.
- The first companion paragraph proves that the workflow can run, not that the
  output design is good enough.
- Bulk companion production should wait until layout/UI improvements are
  integrated into the platform workflow.

## Team Guardrails

- Keep Book 1 green while editing:

```powershell
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

- Reviews and quality refs are mandatory artifacts, not optional paperwork.
- Rebuild affected paragraph/chapter/book HTML/PDF whenever source markdown or assets change.
- Do not scale companion production until the pilot has passed both technical validation and layout/usability review:

```powershell
node scripts\validate-paragraph.js --mode complete "<paragraph-folder>"
```

- Every layout or user-interface improvement must be integrated in the platform, not patched into one generated lesson file.
- Reusable UI work belongs in `C:\Projects\4veco\4veco-platform`: templates, shared CSS/JS, converters, generators, validators, or build scripts.
- Generated output in `4veco-lessen` may show the result, but it should not become the source of truth for UI changes.

## Layout Reference

Use this local legacy/rewire file as a reference input for the next companion UI pass:

```text
file:///C:/Projects/4veco/3-Module-3-rewire-test/3.1%20Hoofdstuk%201%20-%20Markten/3.1.1%20Paragraaf%201%20-%20Markt%20en%20marktstructuur/1.%20Voorbereiden/3.1.1%20Markt%20en%20marktstructuur%20%E2%80%93%20uitleg%20voorkennis.html
```

This is not the end state. It is better than the current companion layout and is
useful because it already shows several patterns worth studying:

- sidebar navigation by section
- mobile menu toggle and overlay
- hero section with section cards
- domain badges and domain-colored section headers
- clearer content blocks, formula boxes, callouts, summary tables, and checklist
- more obvious document structure for students

The task is not to copy this file by hand. The task is to turn the useful parts
of this direction into a platform-owned companion layout system.

## Sprint Details

### Sprint L0.5: Green Gate Handoff

Completed: yes.

Purpose:

- accept the platform/book health routine as good enough for controlled material work
- keep Book 1 Part A green
- allow controlled companion pilot work

Evidence:

- `check:book` passes for Book 1.
- `validate-paragraph.js` supports the flat paragraph layout.
- companion output may be produced under the documented platform workflow.

### Sprint L1.1: First Companion Technical Pilot

Completed: yes.

Purpose:

- run one real companion paragraph through the complete Part B workflow
- expose platform, validator, build, layout, and usability gaps before scaling

Current state:

- `1.1.1 Schaarste en economisch denken` has a full companion set.
- The complete technical validator passes.
- A platform-team quality-gate review has been created for validator/source/quality-ref gaps.

Exit criteria:

- one pilot paragraph passes complete-mode validation. Done for `1.1.1`.
- known source/quality-gate gaps are handed to the platform team. Done in the platform quality-gate review.

### Sprint L1.2: Second Companion Technical Probe

Completed: yes.

Purpose:

Prove that the current companion workflow can repeat once content/data inputs exist.

Evidence:

- `1.1.2 Percentages en indexcijfers` has been used as the second technical probe.
- The platform roadmap records it as passing complete-mode validation.
- This proves technical repeatability, not final companion quality.
- The generated 1.1.2 test materials have been cleared and must not be used as lesson content.

Exit criteria:

- two Book 1 companion paragraphs pass complete-mode validation during technical probing. Observed for `1.1.1` and `1.1.2`; 1.1.2 now awaits didactic rebuild.
- repeated setup steps are saved or documented in the platform workflow.
- remaining risks are moved to layout/usability and quality-gate work.

### Sprint L1.3: Companion Layout And Front-End Usability

Completed: no.

Purpose:

Make companion material easier to use before scaling. This is now the most
important companion-pilot work.

Work:

- Compare current Book 1 companion pages against the improved rewire reference file.
- Define a companion layout standard for at least:
  - `uitleg voorkennis.html`
  - `uitleg vaardigheden.html`
  - `begeleide inoefening.html`
  - paragraph `index.html`
  - game shell pages where navigation or framing is weak
- Improve navigation, mobile behavior, hierarchy, callouts, section scanning, and visual consistency.
- Make sure the UI changes are implemented in the platform, not only in generated output.
- Update platform templates, shared CSS/JS, converters, and validators where needed.
- Rerun the pilot output after platform changes.
- Browser-check the improved pages on desktop and mobile widths.

Exit criteria:

- `1.1.1` companion pages have improved layout/usability from platform-owned sources.
- The improved layout can be regenerated, not hand-maintained.
- The local reference file has been used as input, but the result is a new Book 1 companion design direction.
- `validate-paragraph.js --mode complete` still passes after regeneration.
- Link/reachability and browser smoke checks pass for the improved companion pages.

### Sprint L1.4: Post-Layout Scaling Decision

Completed: no.

Purpose:

Decide whether companion production may expand after the layout/front-end sprint.

Work:

- Review the regenerated `1.1.1` and didactically rebuilt `1.1.2` companion pages after layout/UI improvements.
- Decide whether to expand to 3-5 representative paragraphs.
- Keep all builder scripts saved under the platform `build-scripts/content/book-1/` workflow.
- Separate remaining content problems from platform usability problems.

Exit criteria:

- improved companion pages pass validation and browser checks
- the platform team confirms the layout direction is reproducible
- the lesson team has a go/no-go decision for broader companion production

### Sprint L2.1: Book 1 Release Polish

Completed: no.

Purpose:

Do a teacher-facing review pass on Book 1 while keeping the health gate green.

Work:

- clarity
- pacing
- graph readability
- answer model usability
- exam fit

Rules:

- Keep all five chapter validators passing.
- Keep all paragraph validators passing in Part A mode.
- Any repeated manual fix should become a checklist item or a platform improvement request.

### Sprint L2.2: Book 2 Part A Textbook Layer

Completed: no.

Purpose:

Build Book 2 Part A first, with hard gates.

Required gates:

- `_chapter-plan.md`
- paragraph markdown files
- SVG/PNG pairs
- PDFs
- review files
- quality refs
- chapter assembly
- chapter validation

Book 2 should prove that the Book 1 Part A workflow is repeatable, not just a one-off success.

## Lessen Team Deliverables

### Next 1 Week

- Keep Book 1 green.
- Continue companion pilot work with layout/front-end usability as the main focus.
- Hand platform-owned UI integration work back to the platform team instead of patching generated files.
- Keep Book 2 Part A planning moving only under the normal chapter gates.

### Next 2-4 Weeks

- One improved companion paragraph exists with platform-integrated layout/UI.
- The second technical companion probe remains documented as evidence, but its materials have been cleared and no broad scaling starts until layout/UI is improved.
- Book 1 teacher-facing polish continues without breaking `check:book`.

### Months 1-3

- Book 1 becomes pilot-ready.
- Book 2 textbook layer becomes textbook-ready or close.
- Companion production decisions are based on validated, usable, regenerated companion materials, not only file-count validation.

## What The Lessen Team Does Not Own

- Validator bugs and deploy/config plumbing.
- Platform-level generator refactors.
- Shared companion CSS/JS architecture.
- Converter/template changes needed to make layout improvements reproducible.
- Reference-report architecture cleanup.

Those should be escalated to the platform team instead of patched locally.

## Escalation Triggers

Bring issues back to the platform team immediately if:

- `check:book` fails because of validator/tooling behavior rather than content quality.
- A companion build is blocked by missing `deploy-config.json`, missing `shared/`, or missing generator/build-script infrastructure.
- The complete-mode validator expects artifacts that the documented toolchain cannot yet produce cleanly.
- A UI/layout improvement requires editing generated HTML directly instead of changing platform templates, converters, shared CSS/JS, or generators.
- The companion pages pass file validation but fail browser rendering, navigation, mobile usability, or basic readability checks.
