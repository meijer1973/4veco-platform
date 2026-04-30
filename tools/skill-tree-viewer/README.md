# Skill-Tree Viewer

Visuele DAG-verkenner voor de `references/machine/micro-teaching-units` catalogus. Laat per unit de volledige voorwaardenboom (upstream) en afhankelijkhedenboom (downstream) zien, gelaagd op `layer` en ingekleurd per domein.

## Gebruik

1. Open `index.html` in een browser (gewoon dubbelklikken werkt — geen server nodig).
2. Links: zoek/filter op domein, beheersingsniveau, aspect (`grafisch`, `rekenen`, `verbaal`), aantal needs, boomgrootte, of tekst. Klik een unit om zijn skill-tree te zien.
3. Rechts: layered graph met de unit in het midden. Voorwaarden in blauw (upstream), afhankelijken in groen (downstream).
4. Klik elke node om die tot nieuwe root te maken. `fit` past de zoom aan; `reset` centreert.
5. Deep-link: `index.html#A06` opent direct op unit A06.

## Herbouwen

Na een catalogus-mutatie (`unit-add` / `unit-update` / `unit-deprecate`):

```bash
node build-scripts/tools/build-skill-tree-viewer.js
```

Dit leest `template.html` + de huidige catalogus JSON en schrijft `index.html` met de data inline. Commit `index.html` mee zodat reviewers niet hoeven te bouwen.

## Bestanden

| Bestand | Rol |
|---|---|
| `template.html` | HTML + CSS + JS skelet, met placeholder `__UNITS_DATA__` |
| `index.html` | **gegenereerd** door de build-script — dit is wat reviewers openen |
| `README.md` | dit bestand |

## Roadmap

v1 (nu): standalone viewer.
v2: twee-panel modus. Links = examen-PDF of lesmateriaal met skill-tags; rechts = skill-tree van de geklikte tag.
v3: lesmateriaal-dekkingsanalyse. Gegeven een paragraaf in `4veco-lessen/`, markeer welke skills geleerd worden en welke prereqs ontbreken (gap-detectie).

Zie `memory/project_skill_tree_viewer_roadmap.md` voor de volledige visie.

## Design

- **D3 v7** via CDN. Geen build step nodig voor de viewer-code zelf.
- **Layered force simulation**: y-positie = `layer`, x-positie via force-spread.
- **Kleurcodering**: elk domein (A-L) krijgt een vaste kleur; mastery-niveau (U/A/An/E) als hoek-badge.
- **Aantal-needs-filter**: filtert op directe voorwaarden (`needs.length`). Dit is nuttig om units zonder prereqs of units met opvallend veel directe prereqs te vinden.
- **Aspect-filter**: filtert op brede unit-aspecten (`aspects`) zoals `grafisch`, `rekenen` en `verbaal`. Meerdere actieve aspectchips tonen units die ten minste een van de gekozen aspecten hebben.
- **Boomgrootte-filter**: berekent per unit de grootte van de verbonden component in de `needs`-graaf. Grootte 1 toont volledig geisoleerde units; 2-3 toont kleine verdachte eilandjes.
- **Offline klaar**: D3 komt van CDN; alles anders is inline. Zonder internet werkt de lay-out niet, maar dat is triviaal op te lossen door D3 lokaal mee te bundelen indien nodig.

## Beperkingen (v1)

- Toont alle bereikbare units — voor zeer connected hubs (A06 heeft 11 directe afhankelijken, elk met eigen boom) kan de grafiek groot worden. Zoom-to-fit werkt, maar voor zulke hubs is overwogen filtering in v2.
- Alleen DAG-edges via `needs`. Zwakke / impliciete links (zelfde `category`, overlappende `terms`) worden niet getoond.
- Geen bewerkmodus. Dit is een viewer, geen editor. Mutaties blijven via `build-scripts/references/unit-*.js`.
