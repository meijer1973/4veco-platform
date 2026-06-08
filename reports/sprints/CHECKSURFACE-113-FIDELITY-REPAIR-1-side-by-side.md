# CHECKSURFACE-113-FIDELITY-REPAIR-1 Side-by-Side Visual Proof

Date: 2026-06-08

## Scope

Compared the golden exemplar prototype with the regenerated `1.1.3 Grafieken en tabellen - exit-ticket.html` page through the in-app Browser at desktop `1366x900` and mobile `390x844`.

## Golden Layout Signals

- Desktop golden exemplar uses a source-left, task-right work surface.
- Task 1 exposes a real line-shape choice: `Dalend`, `Stijgend`, `Horizontaal`, `Geen verband`.
- Task 3 is visibly split into interval choice, source Q values, formula builder, and conclusion.

## Generated Layout Signals

- Desktop generated page preserves the source-left, task-right work surface.
- Generated task families are exactly `graph_construction_substitute`, `graph_reading`, and `calculation_work_capture`.
- No separate `formula_builder` task card remains; the formula builder is embedded inside Task 3.
- Task 3 sections are `3a. Kies het interval`, `3b. Haal de bronwaarden zelf uit de tabel`, `3c. Bouw de berekening`, `3d. Vul de procentuele verandering in`, and `3e. Conclusie`.
- Task 3 renders 6 interval options, old/new Q fields, 12 formula tokens, final percentage input, and 4 conclusion choices.
- Mobile generated page has no horizontal overflow.

## Interaction Proof

The generated graph line control renders four selectable buttons. Browser interaction with `Stijgend` set `aria-pressed="true"` only on that button and updated the hidden line-shape value to `increasing`. The sprint gate separately proves that `increasing` is rejected by `TaskShellEngine.evaluateTask`.

## Screenshots

- `reports/sprints/CHECKSURFACE-113-FIDELITY-REPAIR-1-screenshots/desktop-golden-exemplar.png`
- `reports/sprints/CHECKSURFACE-113-FIDELITY-REPAIR-1-screenshots/desktop-generated-initial.png`
- `reports/sprints/CHECKSURFACE-113-FIDELITY-REPAIR-1-screenshots/desktop-golden-task3.png`
- `reports/sprints/CHECKSURFACE-113-FIDELITY-REPAIR-1-screenshots/desktop-generated-task3.png`
- `reports/sprints/CHECKSURFACE-113-FIDELITY-REPAIR-1-screenshots/desktop-generated-task3-lower.png`
- `reports/sprints/CHECKSURFACE-113-FIDELITY-REPAIR-1-screenshots/desktop-generated-line-shape-selected.png`
- `reports/sprints/CHECKSURFACE-113-FIDELITY-REPAIR-1-screenshots/mobile-generated-initial.png`

## Verdict

Pass for the requested fidelity repair. The generated page now uses the golden exemplar's working layout and task sequence instead of the previous generic textarea/card sequence, while keeping the product shell's existing header and navigation.
