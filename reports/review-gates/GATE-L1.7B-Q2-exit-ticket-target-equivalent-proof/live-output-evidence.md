# GATE-L1.7B-Q2 Live-Output Evidence

Generated: 2026-06-01

Status: packet evidence summary; no human interview started; no product
authority.

## Scope

This evidence supports the `GATE-L1.7B-Q2` review of the implemented
`1.1.2 Percentages en indexcijfers` target-equivalent exit-ticket candidate.

The gate must inspect live rendered output before binding answers. This file
summarizes the already captured implementation evidence from `L1.7B-Q2`; it
does not replace live inspection during the human review.

## Remote Evidence Baseline

- Platform implementation commit:
  `31e035aaab656f8f64722ac62d26108f829d0f60`.
- Lesson output commit:
  `971bf68402e6071804c44d3aa67c67320a987e33`.
- Source data:
  `source-data/book-1/exit-ticket/1.1.2.json`.
- Generated lesson output:
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers – exit-ticket.html`.

## Implemented Candidate

The `1.1.2` candidate contains four task-shell tasks:

| Task | Required operation | Evidence |
|---|---|---|
| `prijsstijging-procent` | Calculate `(920 - 800) / 800 * 100 = 15%` | requires work text with 920, 800, change, and old basis |
| `index-naar-waarde` | Calculate `162 / 150 * 100 = 108` | requires work text with 162, 150, division by basis, and `* 100` |
| `index-naar-procent` | Calculate `(112 - 108) / 108 * 100 = 3.7%` | requires work text with 112, 108, change, and old basis |
| `indexpunten-uitleg` | Explain 4 index points is not 4 percent | requires index-points, old basis 108, about 3.7 percent, and rejection of 4 percent |

## Captured Live Facts

From `reports/sprints/L1.7B-Q2-live-output-evidence.json`:

- The `1.1.2` landing page shows `Exit ticket` and
  `Maak de volledige paragraaf-check`.
- The exit-ticket page shows title `Exit ticket`.
- The surface contains 4 tasks: 3 calculation-work tasks and 1 short
  constructed-response task.
- Completion is hidden before task completion.
- Correct responses produce 4 matched feedback states and 0 retry states.
- Completion copy remains local only:
  `Je hebt deze check afgerond. Bekijk je feedback en bespreek de eindopgave met je docent.`
- No visible `A38`, `A39`, `D31`, `MTU`, or `PV` codes appear in the student
  surface.
- No visible `bewezen`, `aangetoond`, `aankunt`, or `beheerst` language
  appears before the gate.
- Mobile/narrow viewport keeps route context visible.
- Dark-mode rendering is readable.

## Adversarial Proof Evidence

Lead review round 1 found that the first implementation was too weak:

- a correct final answer could pass with bogus calculation work;
- contradictory D31 wording could pass by matching loose substrings.

The implementation was corrected before sprint closure:

- calculation tasks now require reviewed work-text groups;
- D31 uses stricter required text and `rejectText`;
- tests and `check-l1-7b-q2-implementation.js` include adversarial bogus-work
  and contradictory-D31 cases.

Lead review round 2 passed with one carried flag: deterministic text-group
matching is not symbolic math parsing or semantic language understanding.

## Screenshot Evidence

Reviewers should inspect:

- `reports/sprints/screenshots/L1.7B-Q2-1.1.2-landing-card.png`
- `reports/sprints/screenshots/L1.7B-Q2-1.1.2-exit-ticket-initial.png`
- `reports/sprints/screenshots/L1.7B-Q2-1.1.2-exit-ticket-completion.png`
- `reports/sprints/screenshots/L1.7B-Q2-1.1.2-exit-ticket-mobile.png`
- `reports/sprints/screenshots/L1.7B-Q2-1.1.2-exit-ticket-dark.png`

## Product Boundary

This evidence does not authorize:

- source-data mutation;
- generated-output mutation;
- target-equivalent completion language;
- diagnostics;
- adaptive routing;
- mastery or sequencing;
- student-facing AI;
- summative use;
- PV projection or PV machine promotion;
- Scale Gate 1;
- student/product use.

The gate may only decide whether a later exact implementation may enable local,
non-summative paragraph-completion copy for the reviewed `1.1.2` output.
