# GOLDEN-TICKET-LAYOUT-RESET-1 Screenshot Manifest

Date: 2026-06-08

## Reference

- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/golden-reference-desktop-light.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/golden-reference-mobile-light.png`

Reference source:

- `references/exemplars/1.1.3-exit-ticket/prototype.html`

## Implemented Route

- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-initial.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-after-graph.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-feedback.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-completed.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-light-initial.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-light-after-graph.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-dark-initial.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-dark-initial.png`
- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-routing-after-reload.png`

Implemented route:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - exit-ticket.html`

## Browser Proof

- `main.ge-page[data-golden-ticket-root]`: present
- `#exit-ticket-app`: absent
- legacy CSS scripts loaded by target route: none
- legacy UI scripts loaded by target route: none
- graph id: `golden-ticket-113`
- graph expected points: `350,1;300,1.5;250,2;200,2.5;150,3`
- route links resolve through deploy link check
- mobile after-graph proof produced graph points `350,1` and `150,3`; line count was `0` after point 1 and `1` immediately after point 2 before checking; no checkbox, no connect checkbox, no slope-choice controls, and successful graph feedback
- reload proof preserved `main.ge-page[data-golden-ticket-root]`, dark theme, golden graph id, and no legacy wrapper/assets
- completed browser flow produced graph points `350,1` and `150,3`, an automatic rendered line, graph/read/claim feedback, and visible completion state
