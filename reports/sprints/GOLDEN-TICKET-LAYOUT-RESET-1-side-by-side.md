# GOLDEN-TICKET-LAYOUT-RESET-1 Side-by-Side Proof

Date: 2026-06-08

## Desktop Light

| Golden reference | Implemented initial |
| --- | --- |
| ![Golden desktop](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/golden-reference-desktop-light.png) | ![Implemented desktop initial](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-initial.png) |

## Mobile Light

| Golden reference | Implemented initial |
| --- | --- |
| ![Golden mobile](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/golden-reference-mobile-light.png) | ![Implemented mobile initial](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-light-initial.png) |

| Implemented mobile after graph |
| --- |
| ![Implemented mobile after graph](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-light-after-graph.png) |

## Interaction States

| After correct graph | Retry feedback | Completed |
| --- | --- | --- |
| ![Implemented after graph](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-after-graph.png) | ![Implemented feedback](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-feedback.png) | ![Implemented completed](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-completed.png) |

## Dark Mode

| Desktop dark initial | Mobile dark initial |
| --- | --- |
| ![Implemented desktop dark](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-dark-initial.png) | ![Implemented mobile dark](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-dark-initial.png) |

## Routing After Reload

| Implemented routing after reload |
| --- |
| ![Implemented routing after reload](GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-routing-after-reload.png) |

## DOM Verdict

The implemented route uses the golden route root directly:

- `header.ge-topbar`
- `main.ge-page[data-golden-ticket-root]`
- `.ge-hero`
- `.ge-workbench`
- `.ge-source-card`
- `.ge-task-card`
- `svg.ge-graph[data-graph-id="golden-ticket-113"]`

The implemented route does not load:

- `skill-map-route.css`
- `task-shell.css`
- `exit-ticket.css`
- `task-shell-ui.js`
- `exit-ticket-ui.js`

The route also omits `#exit-ticket-app` and has no mixed `ge-*` plus `et-*` class attributes.
