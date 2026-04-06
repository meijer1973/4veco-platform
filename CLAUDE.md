# 4veco Platform — Build Tools & Game Engines

Platform-repo voor het genereren van lesmateriaal voor **Praktische Economie VWO 4**. Bevat game engines, build scripts, source data en skills. De gegenereerde output wordt gedeployed naar aparte module-repo's.

## Structuur

```
4veco-platform/
├── engines/                    ← Game engines (broncode)
│   ├── quiz-engine.js, quiz-ui.js, quiz.css
│   ├── reasoning-engine.js, reasoning-ui.js, reasoning.css
│   ├── skilltree-engine.js, skilltree-ui.js, skilltree.css
│   ├── newsdetective-engine.js, newsdetective-ui.js, newsdetective.css
│   ├── skilltree/base-elements.js, explanations.js
│   ├── theme.js
│   └── tests/                  ← Unit tests + data validation tests
├── build-scripts/              ← Generators (CSV→JS, HTML shells, landing pages, PPTX, DOCX)
├── source-data/
│   └── module-3/
│       ├── reasoning/*.csv     ← Bron-CSV's voor redeneer-spel
│       └── skilltree/*.js      ← Per-paragraaf skill config
├── scripts/
│   ├── deploy.js               ← Kopieert engines + genereert content naar module-repo
│   ├── check-links.js          ← Verifieert alle interne links
│   ├── verify-deployment.sh    ← Post-push verificatie
│   └── pre-push-hook.js        ← Git hook
├── .claude/commands/           ← Skills (didactiek, templates, grafieken)
└── package.json                ← Jest voor tests
```

## Deploy workflow

```bash
# Alles bouwen en kopiëren naar module-3:
node scripts/deploy.js "../3. Module 3 - Markt en overheid"

# Of via npm script:
npm run deploy:m3
```

De deploy doet:
1. Kopieert engine files → `<module>/shared/`
2. Runt alle generators (skilltree, reasoning, quiz, newsdetective, landing pages)
3. Verificatie: link checker + data tests

### Schalen naar Module 4
```bash
node scripts/deploy.js "../4. Module 4 - [Naam]"
```
Zelfde engines, zelfde base-elements, andere content data.

## Een nieuwe paragraaf bouwen

Volg **`BUILD-PARAGRAPH.md`** voor het complete stappenplan. Dit is de master-recipe voor het bouwen van een volledige paragraaf (23 bestanden) inclusief registratie, data-aanmaak, documentgeneratie, en verificatie.

### Registratie-checklist (4 bestanden bijwerken)
Bij elke nieuwe paragraaf moeten deze 4 bestanden worden bijgewerkt:
1. `build-scripts/build-landing-page.js` → PARAGRAAF_DATA + (bij nieuw hoofdstuk) CHAPTER_FOLDERS, CHAPTER_ORDER, CHAPTER_NUMBERS, DOMAIN_COLORS
2. `build-scripts/build-skilltree-shells.js` → PARAGRAPHS array
3. `engines/tests/skilltree-data.test.js` → expectedFiles array
4. `engines/theme.js` → DOMAIN_COLORS (alleen bij nieuw hoofdstuk)

### Referentie-implementaties
| Bestandstype | Referentiescript |
|--------------|-----------------|
| Presentatie met grafieken | `pptx-351-afsluiting.js` |
| Nieuws met visual | `nieuws-351-352-afsluiting.js` |
| Samenvatting (infographic) | `samenvatting-351-352-rebuild.js` |
| Uitleg voorkennis | `template-B_voorkennis.js` |
| Uitleg vaardigheden | `template-A_vaardigheden.js` |
| Begeleide inoefening | `inoefening-351-afsluiting.js` |
| Opgavensets | `opgaven-351-afsluiting.js` |

## Build scripts met MODULE_ROOT

Alle build scripts accepteren `MODULE_ROOT` als env var. Zonder die var schrijven ze naar hun parent directory (backward-compatible).

```bash
# Eén script draaien tegen een specifieke module:
MODULE_ROOT="../3. Module 3 - Markt en overheid" node build-scripts/build-skilltree-shells.js
```

| Script | Genereert |
|--------|-----------|
| `build-skilltree-shells.js` | HTML shells + data files in `shared/skilltree/` |
| `build-reasoning-engine.js` | HTML shells voor redeneer-spel |
| `build-reasoning-questions.js` | CSV → JS data file in `shared/reasoning/` |
| `generate-quiz-shells.js` | HTML shells voor instapquiz |
| `build-newsdetective-shells.js` | HTML shells voor nieuws-detective |
| `build-landing-page.js` | index.html voor paragrafen, hoofdstukken, module |
| `template-B_voorkennis.js` | `uitleg voorkennis.docx` |
| `pptx-template_presentatie.js` | Presentatie `.pptx` |

---

## Modelgebruik

| Taak | Model | Toelichting |
|------|-------|-------------|
| Opzet en ontwerp presentaties | **Opus 4.6** | Creatieve kwaliteit en visueel ontwerp |
| Economische grafieken en visuals | **Opus 4.6** | Precisie en vakinhoudelijke correctheid |
| Subtaken (research, berekeningen) | **Sonnet 4.6 of Opus 4.6** | Bij twijfel Opus |
| Eindcontroles en QA | **Opus 4.6** | Kritische feedback essentieel |
| **Nooit gebruiken** | ~~Haiku~~ | Niet geschikt voor presentaties en creatief werk |

---

## Skills — Automatische trigger-regels

Skills staan in `.claude/commands/`. Ze worden automatisch geladen op basis van de taak.

| Taak | Laad deze skills |
|------|-----------------|
| Presentatie maken | `econ-pptx-templates` + `economic-graph` + `econ-didactiek` |
| Uitleg voorkennis maken | `econ-explainer-docs` + `econ-word-templates` + `economic-graph` |
| Uitleg vaardigheden maken | `econ-explainer-docs` + `econ-word-templates` + `economic-graph` |
| Nieuws met visual maken | `econ-nieuws-exercise` + `econ-word-templates` + `economic-graph` |
| Begeleide inoefening maken | `econ-word-templates` + `econ-didactiek` |
| Opgaven/antwoorden maken | `econ-word-templates` + `econ-didactiek` |
| Hoofdstuksamenvatting maken | `aanpak-samenvattingen` + `econ-word-templates` + `economic-graph` |

---

## Presentatie-eisen (kernregels)

### Didactisch
- Start met leerdoelen
- Groepeer per vaardigheid of deeldomein
- Leg de denkroute uit
- Besteed kort aandacht aan veelgemaakte fouten
- Sluit af met samenvatting

### Visueel
- **Minimaal 18pt** lettergrootte, liever 20-24pt
- **Eén hoofdidee per dia**
- Veel witruimte, rustige compositie
- Grafieken op witte achtergrond
- Varieer lay-outs per dia

### Grafieken
Volg de `economic-graph` skill. Kernprincipe: economisch correct, geometrisch exact, visueel rustig.

**Architectuurbeslissing (2026-03):** Gebruik raw SVG → Sharp → PNG pipeline. Geen declaratieve libraries.

---

## Testing

```bash
# Engine unit tests (geen MODULE_ROOT nodig):
npx jest --testPathPatterns "engines/tests/.*-engine\.test\.js"

# Data tests (tegen een module-repo):
MODULE_ROOT="../3. Module 3 - Markt en overheid" npx jest --testPathPatterns "engines/tests/.*-data\.test\.js"

# Alle tests:
npm test
```

### Engines wijzigen
1. Edit in `engines/`
2. Run engine tests
3. Deploy naar module-repo
4. Test in browser
5. Commit en push module-repo

### Nieuw reasoning game toevoegen
1. CSV maken → `source-data/module-3/reasoning/X.Y.Z.csv`
2. `node build-scripts/build-reasoning-questions.js X.Y.Z <domain> source-data/module-3/reasoning/X.Y.Z.csv --generate-review`
3. Economics review subagent op het review document
4. Correcties doorvoeren in CSV, opnieuw builden
5. `node scripts/deploy.js <module-path>`

---

## Game Architectuur (overzicht)

### Instapquiz
- Engine: `engines/quiz-engine.js` + `quiz-ui.js`
- Data: `shared/questions/X.Y.Z.js` per paragraaf
- HTML: thin shell in `1. Voorbereiden/`

### Redeneer-spel (5 modi)
- Engine: `engines/reasoning-engine.js` + `reasoning-ui.js`
- Data: `shared/reasoning/X.Y.Z.js` (gegenereerd uit CSV)
- HTML: thin shell in `3. Oefenen/`
- Domeinen: economics, math-economics, arithmetic

### Wiskundevaardigheden (Skill Tree)
- Engine: `engines/skilltree-engine.js` + `skilltree-ui.js`
- Generators: `engines/skilltree/base-elements.js` (35 skills, 4 lagen)
- Data: `shared/skilltree/X.Y.Z.js` per paragraaf
- Global progress via `localStorage` key `skilltree_global_stars`

### Nieuws-detective
- Engine: `engines/newsdetective-engine.js` + `newsdetective-ui.js`
- Data: `shared/newsdetective/X.Y.Z.js` per paragraaf
- HTML: thin shell in `1. Voorbereiden/`
- 4 rondes per paragraaf, score 0-4

---

## Technische omgeving

### Node.js
Beschikbare modules: `pptxgenjs`, `sharp`, `docx`, `pdf-lib`, `marked`, `graphviz`

> Stel `NODE_PATH` in als modules globaal geïnstalleerd zijn.

### Python
Module `python-docx` voor het lezen van bestaande Word-bestanden.

---

## Kwaliteitsstandaard

Een presentatie is pas af als een docent deze **direct in de les kan gebruiken**, zonder aanpassingen.

**Bij twijfel over kwaliteit: gebruik Opus 4.6 en doe een extra QA-ronde.**

## Temporary Files & Workspace Cleanup

### MANDATORY: Clean up after every task

You MUST treat temporary/intermediate files as your responsibility. Delete all temp files when done. Use `/tmp/claude-work/` for intermediate files. Never litter the project root.

### Beleid: scripts bewaren

Wanneer een taak een script produceert dat herbruikbaar is, sla dit op in `build-scripts/` met een duidelijke naam en een `HOW TO ADAPT`-header.
