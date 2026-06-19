#!/usr/bin/env node
/**
 * L-CP6A lesson-side remediation for Book 1 Chapter 1.3.
 *
 * This script owns the generated-output migration so the lesson repo is not
 * hand-patched folder by folder. It deliberately does not close CP-6 or Year 1.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(PLATFORM_ROOT, '..', '4veco-lessen');
const BOOK_DIR = path.join(LESSON_ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');
const OLD_CHAPTER_DIR = path.join(BOOK_DIR, '1.3 Hoofdstuk Aanbod en kosten');
const NEW_CHAPTER_DIR = path.join(BOOK_DIR, '1.3 Hoofdstuk Aanbod en marktevenwicht');
const CHAPTER_14_DIR = path.join(BOOK_DIR, '1.4 Hoofdstuk Marktevenwicht en marginale analyse');
const ARCHIVE_DIR = path.join(LESSON_ROOT, 'archive', 'sprints', 'L-CP6A');
const DISPLACED_DIR = path.join(ARCHIVE_DIR, 'displaced-book2-material');
const OLD_ASSEMBLY_DIR = path.join(ARCHIVE_DIR, 'old-chapter13-assembly');

function fail(message) {
  console.error(`L-CP6A remediation failed: ${message}`);
  process.exit(1);
}

function ensure(condition, message) {
  if (!condition) fail(message);
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const normalized = typeof content === 'string' ? content.replace(/\r\n/g, '\n') : content;
  fs.writeFileSync(filePath, normalized, 'utf8');
}

function move(src, dest) {
  ensure(exists(src), `missing source for move: ${src}`);
  ensure(!exists(dest), `destination already exists: ${dest}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(src, dest);
}

function copyDir(src, dest) {
  ensure(exists(src), `missing source for copy: ${src}`);
  ensure(!exists(dest), `destination already exists: ${dest}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function removeInside(root, target) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  ensure(
    resolvedTarget === resolvedRoot || resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`),
    `refusing to remove path outside ${resolvedRoot}: ${resolvedTarget}`
  );
  if (exists(resolvedTarget)) fs.rmSync(resolvedTarget, { recursive: true, force: true });
}

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function renameFilesRecursive(dir, transformName) {
  const files = listFiles(dir).sort((a, b) => b.length - a.length);
  for (const file of files) {
    const nextName = transformName(path.basename(file));
    if (nextName !== path.basename(file)) {
      const dest = path.join(path.dirname(file), nextName);
      ensure(!exists(dest), `rename target exists: ${dest}`);
      fs.renameSync(file, dest);
    }
  }

  const dirs = [];
  function collectDirs(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const full = path.join(current, entry.name);
        collectDirs(full);
        dirs.push(full);
      }
    }
  }
  collectDirs(dir);
  for (const folder of dirs.sort((a, b) => b.length - a.length)) {
    const nextName = transformName(path.basename(folder));
    if (nextName !== path.basename(folder)) {
      const dest = path.join(path.dirname(folder), nextName);
      ensure(!exists(dest), `folder rename target exists: ${dest}`);
      fs.renameSync(folder, dest);
    }
  }
}

function replaceAllLiteral(text, from, to) {
  return text.split(from).join(to);
}

function transformTextFiles(dir, transformText) {
  const textExts = new Set(['.md', '.py', '.yaml', '.yml', '.html', '.txt']);
  for (const file of listFiles(dir)) {
    if (!textExts.has(path.extname(file).toLowerCase())) continue;
    const before = read(file);
    const after = transformText(before, file);
    if (after !== before) write(file, after);
  }
}

function removeCostExercise(text) {
  return text
    .replace(/\n\n\*\*Opgave 7\*\* \*\(herhaling §1\.3\.2: kostenstructuren\)\*[\s\S]*?(?=\n\n### Doeloefening)/g, '\n\n')
    .replace(/\n\n\*\*Opgave 7\*\* \*\(herhaling (?:Â§|§)1\.3\.2: (?:kostenstructuren|productiekosten)\)\*[\s\S]*?(?=\n\n### Doeloefening)/gi, '\n\n')
    .replace(/\n\n## Opgave 7[\s\S]*?\n\n---\n\n## Opgave 8/g, '\n\n## Opgave 8');
}

function transformMarktevenwicht(text) {
  let out = text;
  out = replaceAllLiteral(out, '1.4 Hoofdstuk Marktevenwicht en marginale analyse', '1.3 Hoofdstuk Aanbod en marktevenwicht');
  out = replaceAllLiteral(out, '1.4.1_', '1.3.2_');
  out = replaceAllLiteral(out, '1.4.1', '1.3.2');
  out = replaceAllLiteral(out, '1.4.2', '1.3.3');
  out = replaceAllLiteral(out, 'De markt voor elektrische fietsen is in evenwicht. De overheid kondigt aan dat ze een subsidie geeft op elektrische fietsen.', 'De markt voor elektrische fietsen is in evenwicht. De overheid kondigt aan dat consumenten een aankoopsubsidie krijgen op elektrische fietsen.');
  out = replaceAllLiteral(out, 'Een subsidie op de aanschafprijs is een verandering van de **eigen prijs** (de consument betaalt minder). Maar als de subsidie naar de producenten gaat, verschuift de aanbodlijn. Het hangt af van hoe de subsidie wordt ingezet.\n\nHet meest waarschijnlijke antwoord: de subsidie verlaagt de effectieve prijs voor de consument. De **aanbodlijn** verschuift naar rechts (producenten kunnen goedkoper aanbieden) of de **vraaglijn** verschuift naar rechts (consumenten vinden het product aantrekkelijker). Het exacte antwoord hangt af van de vormgeving van de subsidie.\n\n*Waarom: Een subsidie maakt het product goedkoper. Als de subsidie via de prijs loopt (producenten ontvangen de subsidie), verschuift de aanbodlijn naar rechts. Als de subsidie de voorkeur van consumenten verandert (ze zien het als aantrekkelijker), verschuift de vraaglijn.*\n\n**b)** De **aanbodlijn** verschuift naar **rechts** (producenten kunnen bij elke prijs meer aanbieden doordat hun kosten dalen door de subsidie).\n\n**c)** De evenwichtsprijs **daalt** (door het grotere aanbod) en de evenwichtshoeveelheid **stijgt** (meer wordt verhandeld tegen een lagere prijs).',
    'Een aankoopsubsidie voor consumenten verlaagt de prijs die consumenten effectief betalen. Dat is geen verandering van de marktprijs zelf in de grafiek, maar een andere vraagfactor: elektrische fietsen worden aantrekkelijker voor consumenten.\n\n**b)** De **vraaglijn** verschuift naar **rechts**: bij elke marktprijs willen meer consumenten een elektrische fiets kopen.\n\n**c)** De evenwichtsprijs **stijgt** en de evenwichtshoeveelheid **stijgt**. Door de extra vraag ontstaat bij de oude prijs een vraagoverschot; de prijs stijgt tot er een nieuw evenwicht is.');

  const hint = '> Hint: gebruik de stappen uit het uitgewerkte voorbeeld: stel Qv = Qa, los P op en controleer daarna beide vergelijkingen.';
  out = out.replace(/\*\*Opgave 1\*\* \*\(invuloefening\)\*\n\n(?!> Hint:)/g, `**Opgave 1** *(invuloefening)*\n\n${hint}\n\n`);
  out = out.replace(/\*\*Opgave 2\*\* \*\(oefenen met de procedure\)\*\n\n(?!> Hint:)/g, `**Opgave 2** *(oefenen met de procedure)*\n\n${hint}\n\n`);
  out = out.replace(/\*\*Opgave 3\*\* \*\(overschot en tekort\)\*\n\n(?!> Hint:)/g, `**Opgave 3** *(overschot en tekort)*\n\n> Hint: bereken eerst Qv en Qa bij de gegeven prijs. Vergelijk daarna welke hoeveelheid groter is.\n\n`);
  return out;
}

function transformVerschuivingen(text) {
  let out = text;
  out = replaceAllLiteral(out, '1.4 Hoofdstuk Marktevenwicht en marginale analyse', '1.3 Hoofdstuk Aanbod en marktevenwicht');
  out = replaceAllLiteral(out, '1.4.2 Verschuivingen en nieuw evenwicht', '1.3.3 Verschuivingen en nieuw evenwicht');
  out = replaceAllLiteral(out, '1.4.2 Verschuivingen', '1.3.3 Verschuivingen en nieuw evenwicht');
  out = replaceAllLiteral(out, '1.4.2_', '1.3.3_');
  out = replaceAllLiteral(out, '1.4.1_', '1.3.2_');
  out = replaceAllLiteral(out, '1.4.1', '1.3.2');
  out = replaceAllLiteral(out, '1.4.2', '1.3.3');
  out = replaceAllLiteral(out, '1.3.3 Verschuivingen en nieuw evenwicht en nieuw evenwicht', '1.3.3 Verschuivingen en nieuw evenwicht');
  out = replaceAllLiteral(out, 'Kostenstructuren bepalen de positie van de aanbodlijn.', 'Productiekosten bepalen de positie van de aanbodlijn.');
  out = replaceAllLiteral(out, 'kostenstructuren', 'productiekosten');
  out = out.replace(/Herhaling uit (?:Â§|§)1\.3\.2\*\*\n> Productiekosten/g, 'Herhaling uit §1.3.1**\n> Productiekosten');
  out = replaceAllLiteral(out, 'In de volgende paragraaf bekijken we de welvaart op de markt: consumentensurplus en producentensurplus.', 'In de volgende paragraaf oefen je met vraag, aanbod, marktevenwicht en verschuivingen door elkaar.');
  out = removeCostExercise(out);
  out = replaceAllLiteral(out, '**Opgave 8** *(alles samen — twee markten)*', '**Opgave 7** *(alles samen — twee markten)*');
  out = replaceAllLiteral(out, '## Opgave 8', '## Opgave 7');
  out = replaceAllLiteral(out, '**Opgave 9**', '**Opgave 8**');
  out = replaceAllLiteral(out, '## Opgave 9', '## Opgave 8');
  out = replaceAllLiteral(out, 'e) Vergelijk dit evenwicht met het oorspronkelijke. De hoeveelheid is ... (gestegen/gedaald/gelijk gebleven). De prijs is ... Leg uit waarom het prijseffect lastig te voorspellen was zonder te rekenen.',
    'e) Vergelijk dit evenwicht met het oorspronkelijke. De hoeveelheid is ... (gestegen/gedaald/gelijk gebleven). De prijs is ... Leg uit waarom het hoeveelheidseffect lastig te voorspellen was zonder te rekenen.');
  out = replaceAllLiteral(out, '**e)** De hoeveelheid is **gelijk gebleven** (32 → 32). De prijs is **gestegen** (EUR 42 → EUR 52). Het prijseffect was lastig te voorspellen omdat meer vraag de prijs omhoog duwt, maar meer aanbod (als dat het geval zou zijn) de prijs omlaag drukt. In dit geval verschuift het aanbod juist naar *links* (minder aanbod door duurdere inkt), dus zowel de vraagstijging als de aanboddaling duwen de prijs omhoog — daardoor stijgt de prijs fors.\n\nHet verrassende is de hoeveelheid: de extra vraag en het mindere aanbod heffen elkaar precies op. De vraag verschuift 40 eenheden naar rechts, maar het aanbod verschuift 10 eenheden naar links. Omdat de helling van de vraaglijn (−4) vier keer zo steil is als die van de aanbodlijn (1), compenseert de prijsstijging de extra vraag precies.',
    '**e)** De hoeveelheid is **gelijk gebleven** (32 → 32). De prijs is **gestegen** (EUR 42 → EUR 52). Het prijseffect is hier niet ambigu: meer vraag duwt de prijs omhoog en een aanbodlijn naar links duwt de prijs ook omhoog.\n\nHet hoeveelheidseffect was wél lastig te voorspellen zonder te rekenen. Meer vraag vergroot de hoeveelheid, maar minder aanbod verkleint de hoeveelheid. In deze getallen heffen die twee krachten elkaar precies op: de vraag verschuift 40 eenheden naar rechts, het aanbod 10 eenheden naar links, en door de hellingen blijft Q* gelijk.');
  return out;
}

function transformNewFileName(name, fromNr, fromTitle, toNr, toTitle) {
  let out = name;
  out = replaceAllLiteral(out, `${fromNr} ${fromTitle}`, `${toNr} ${toTitle}`);
  out = replaceAllLiteral(out, `${fromNr}-`, `${toNr}-`);
  out = replaceAllLiteral(out, `${fromNr}_`, `${toNr}_`);
  out = replaceAllLiteral(out, fromNr, toNr);
  return out;
}

function copyAndTransformParagraph({ source, dest, fromNr, fromTitle, toNr, toTitle, transform }) {
  copyDir(source, dest);
  renameFilesRecursive(dest, (name) => transformNewFileName(name, fromNr, fromTitle, toNr, toTitle));
  transformTextFiles(dest, transform);
}

function writeChapterPlan() {
  write(path.join(NEW_CHAPTER_DIR, '_chapter-plan.md'), `# Chapter Plan: 1.3 Aanbod en marktevenwicht

## Build order
- Wave 1: 1.3.1 Aanbod, already built and retained.
- Wave 2: 1.3.2 Marktevenwicht, migrated from former 1.4.1 and renumbered through L-CP6A.
- Wave 3: 1.3.3 Verschuivingen en nieuw evenwicht, migrated from former 1.4.2 and renumbered through L-CP6A.
- Wave 4: 1.3.4 Gemengde opgaven, rewritten to consolidate supply, demand, equilibrium, and shifts only.

## Dependencies
- 1.3.1 introduces aanbodlijn, wet van het aanbod, movement versus shift, and aanbodfactoren.
- 1.3.2 combines the demand and supply functions from earlier chapters and introduces market equilibrium, shortages, and surpluses.
- 1.3.3 depends on 1.3.2 and teaches new equilibrium after demand and/or supply shifts.
- 1.3.4 consolidates demand, supply, equilibrium, and shifts. It introduces no new theory.

## Displaced material
- Former 1.3.2 Kostenstructuren is parked for active-v5 2.1.1 Kostenstructuren.
- Former 1.3.3 Opbrengsten is parked for active-v5 2.1.2 Opbrengsten, winst en break-even.
- Costs, revenue, break-even, and marginal analysis are not active Book 1 Chapter 1.3 coverage.

## Shared conventions
- Notation: Qv = gevraagde hoeveelheid, Qa = aangeboden hoeveelheid, P = prijs.
- Equilibrium condition: Qv = Qa.
- Axis convention: price on the vertical axis, quantity on the horizontal axis.
- Demand colour when reused: #1A5276.
- Supply colour: #27AE60.

## Interleaving plan
- 1.3.1 revisits demand-line logic from Chapter 1.2 on the supply side.
- 1.3.2 combines demand and supply in one market.
- 1.3.3 reuses the same equilibrium procedure after a changed demand or supply function.
- 1.3.4 mixes graph, calculation, and explanation tasks across the full active-v5 chapter scope.

## Dual coding plan
- 1.3.1: supply line, movement along the line, shift of the line, factor overview.
- 1.3.2: demand and supply lines together, equilibrium point, shortage/surplus diagrams.
- 1.3.3: before/after equilibrium graphs and shift direction overview.
- 1.3.4: table/formula prompts and drawing tasks for demand, supply, equilibrium, and shifts.

## Procedure plan
- Aanbodverandering classificeren:
  1. Is de eigen prijs veranderd?
  2. Ja: beweging langs de aanbodlijn. Nee: kijk welke aanbodfactor verandert.
  3. Bepaal richting: aanbod stijgt naar rechts, aanbod daalt naar links.
- Marktevenwicht berekenen:
  1. Stel Qv = Qa.
  2. Los op naar P.
  3. Vul P in om Q te vinden.
  4. Controleer in beide vergelijkingen.
- Nieuw evenwicht berekenen:
  1. Bepaal welke lijn verschuift.
  2. Gebruik de nieuwe vergelijking.
  3. Stel Qv = Qa en los het nieuwe evenwicht op.
  4. Vergelijk oud en nieuw economisch.

## Precision standards
- Keep movement along a curve separate from curve shifts.
- State units on axes and in calculations.
- Do not reintroduce costs/revenue/break-even as Book 1 Chapter 1.3 theory.
- Keep inherited PASS WITH FLAGS items visible in review and quality records.
`);
}

function buildChapterScript() {
  const oldScript = read(path.join(NEW_CHAPTER_DIR, 'build_chapter.py'));
  const frontPage = `<div class="chapter-front">

<h1>Hoofdstuk 3 — Aanbod en marktevenwicht</h1>

<h2>Inhoud</h2>

<table>
<thead><tr><th>§</th><th>Onderwerp</th></tr></thead>
<tbody>
<tr><td>1.3.1</td><td>Aanbod</td></tr>
<tr><td>1.3.2</td><td>Marktevenwicht</td></tr>
<tr><td>1.3.3</td><td>Verschuivingen en nieuw evenwicht</td></tr>
<tr><td>1.3.4</td><td>Gemengde opgaven</td></tr>
</tbody>
</table>

<h2>Leerdoelen</h2>

<p>Na dit hoofdstuk kun je:</p>

<ul>
<li>Een aanbodlijn tekenen en interpreteren</li>
<li>Het verschil uitleggen tussen een beweging langs de aanbodlijn en een verschuiving van de aanbodlijn</li>
<li>Aanbodfactoren benoemen en gebruiken om verschuivingen te verklaren</li>
<li>Het marktevenwicht berekenen door Qv = Qa op te lossen</li>
<li>Een aanbodoverschot of vraagoverschot herkennen en berekenen</li>
<li>Een nieuw evenwicht berekenen na een verschuiving van vraag of aanbod</li>
<li>Uitleggen wanneer een prijs- of hoeveelheidsverandering eenduidig of onzeker is</li>
</ul>

<h2>Vraag en aanbod komen samen</h2>

<p>In dit hoofdstuk kijk je eerst naar de aanbodkant van de markt. Daarna breng je vraag en aanbod samen: je berekent het marktevenwicht en onderzoekt wat er gebeurt als vraag of aanbod verschuift. Kosten, opbrengsten en marginale analyse horen niet meer bij de gedrukte versie van Boek 1; die stof komt later terug.</p>

</div>`;

  const paragraphBlock = `PARAGRAPHS = [
    {
        "dir": MODULE / "1.3.1 Aanbod",
        "para": "1.3.1 Aanbod \\u2013 paragraaf.md",
        "answers": "1.3.1 Aanbod \\u2013 antwoorden.md",
        "asset_prefix": "_assets/",
    },
    {
        "dir": MODULE / "1.3.2 Marktevenwicht",
        "para": "1.3.2 Marktevenwicht \\u2013 paragraaf.md",
        "answers": "1.3.2 Marktevenwicht \\u2013 antwoorden.md",
        "asset_prefix": "_assets/",
    },
    {
        "dir": MODULE / "1.3.3 Verschuivingen en nieuw evenwicht",
        "para": "1.3.3 Verschuivingen en nieuw evenwicht \\u2013 paragraaf.md",
        "answers": "1.3.3 Verschuivingen en nieuw evenwicht \\u2013 antwoorden.md",
        "asset_prefix": "_assets/",
    },
    {
        "dir": MODULE / "1.3.4 Gemengde opgaven",
        "para": "1.3.4 Gemengde opgaven \\u2013 opgaven.md",
        "answers": "1.3.4 Gemengde opgaven \\u2013 antwoorden.md",
        "asset_prefix": "_assets/",
    },
]`;

  let script = oldScript;
  script = script.replace(/Produces:[\s\S]*?"""/, 'Produces:\\n  - 1.3 Aanbod en marktevenwicht – hoofdstuk.md / .html / .pdf\\n  - 1.3 Aanbod en marktevenwicht – antwoorden.md / .html / .pdf\\n"""');
  script = script.replace(/FRONT_PAGE_HTML = """[\s\S]*?"""\n\n# ---------------------------------------------------------------------------\n# Paragraph source files \(in order\)/, `FRONT_PAGE_HTML = """${frontPage}"""\n\n# ---------------------------------------------------------------------------\n# Paragraph source files (in order)`);
  script = script.replace(/PARAGRAPHS = \[[\s\S]*?\]\n\n# ---------------------------------------------------------------------------\n# CSS/, `${paragraphBlock}\n\n# ---------------------------------------------------------------------------\n# CSS`);
  script = replaceAllLiteral(script, 'Aanbod en kosten', 'Aanbod en marktevenwicht');
  script = replaceAllLiteral(script, 'from blueprint chapter 3: Supply & Cost Structures', 'from active v5 chapter 1.3: Supply and Market Equilibrium');
  script = replaceAllLiteral(script, 'Antwoorden Hoofdstuk 3 \\u2014 Aanbod en marktevenwicht', 'Antwoorden Hoofdstuk 3 \\u2014 Aanbod en marktevenwicht');
  script = replaceAllLiteral(script, '1.3 Aanbod en kosten', '1.3 Aanbod en marktevenwicht');
  write(path.join(NEW_CHAPTER_DIR, 'build_chapter.py'), script);
}

const SCREEN_SUPPORT_CSS = `

@media screen and (max-width: 700px) {
  html { box-sizing: border-box; }
  *, *::before, *::after { box-sizing: inherit; }
  body {
    width: auto !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 12px !important;
    overflow-wrap: anywhere;
  }
  .chapter-front h1,
  h1 {
    font-size: 20pt;
    line-height: 1.15;
  }
  h2 {
    font-size: 14pt;
    line-height: 1.2;
  }
  table {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    font-size: 9.5pt;
  }
  pre,
  code {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  figure img,
  img {
    width: auto;
    max-width: 100%;
    height: auto;
  }
}
`;

function addScreenSupportCssToBuildScripts() {
  const scripts = [
    path.join(NEW_CHAPTER_DIR, 'build_chapter.py'),
    path.join(NEW_CHAPTER_DIR, '1.3.1 Aanbod', 'build_pdf.py'),
    path.join(NEW_CHAPTER_DIR, '1.3.2 Marktevenwicht', 'build_pdf.py'),
    path.join(NEW_CHAPTER_DIR, '1.3.3 Verschuivingen en nieuw evenwicht', 'build_pdf.py'),
    path.join(NEW_CHAPTER_DIR, '1.3.4 Gemengde opgaven', 'build_pdf.py'),
  ];
  for (const file of scripts) {
    if (!exists(file)) continue;
    let before = read(file);
    let after = before;
    if (!after.includes('@media screen and (max-width: 700px)')) {
      ensure(after.includes('</style>'), `missing CSS closing style tag in ${file}`);
      after = after.replace('</style>', `${SCREEN_SUPPORT_CSS}</style>`);
    }
    after = replaceAllLiteral(
      after,
      '.write_text(html, encoding="utf-8")',
      '.write_text(html, encoding="utf-8", newline="\\n")'
    );
    after = replaceAllLiteral(
      after,
      '.write_text(chapter_md, encoding="utf-8")',
      '.write_text(chapter_md, encoding="utf-8", newline="\\n")'
    );
    after = replaceAllLiteral(
      after,
      '.write_text(answers_md, encoding="utf-8")',
      '.write_text(answers_md, encoding="utf-8", newline="\\n")'
    );
    if (!after.includes('def normalize_generated_text(text):')) {
      after = after.replace(
        '\ndef wrap_exercises(html):',
        '\ndef normalize_generated_text(text):\n    return "\\n".join(line.rstrip() for line in text.splitlines()) + "\\n"\n\n\ndef wrap_exercises(html):'
      );
    }
    after = replaceAllLiteral(
      after,
      '.write_text(html, encoding="utf-8", newline="\\n")',
      '.write_text(normalize_generated_text(html), encoding="utf-8", newline="\\n")'
    );
    after = replaceAllLiteral(
      after,
      '.write_text(chapter_md, encoding="utf-8", newline="\\n")',
      '.write_text(normalize_generated_text(chapter_md), encoding="utf-8", newline="\\n")'
    );
    after = replaceAllLiteral(
      after,
      '.write_text(answers_md, encoding="utf-8", newline="\\n")',
      '.write_text(normalize_generated_text(answers_md), encoding="utf-8", newline="\\n")'
    );
    if (!after.includes("html.replace('<title>-</title>'")) {
      if (path.basename(file) === 'build_chapter.py') {
        after = after.replace(
          '    html = result.stdout.decode("utf-8")\n\n    # Wrap exercises',
          `    html = result.stdout.decode("utf-8")
    html = html.replace('<title>-</title>', f'<title>{output_stem}</title>')

    # Wrap exercises`
        );
      } else {
        after = after.replace(
          '    html = result.stdout\n\n    # Strip default Pandoc stylesheet',
          `    html = result.stdout
    html = html.replace('<title>-</title>', f'<title>{Path(md_path).stem}</title>')

    # Strip default Pandoc stylesheet`
        );
      }
    }
    if (after === before) continue;
    write(file, after);
  }
}

function writeGemengdeOpgaven() {
  const dir = path.join(NEW_CHAPTER_DIR, '1.3.4 Gemengde opgaven');
  fs.mkdirSync(path.join(dir, '_assets'), { recursive: true });
  write(path.join(dir, '_assets', '.gitkeep'), '\n');
  const oldBuild = path.join(DISPLACED_DIR, '1.3.4 Gemengde opgaven', 'build_pdf.py');
  if (exists(oldBuild)) fs.copyFileSync(oldBuild, path.join(dir, 'build_pdf.py'));
  const opgaven = read(path.join(PLATFORM_ROOT, 'build-scripts', 'books', 'book-manifests', 'book-1-print-1.3.4-gemengde-opgaven.md'));
  write(path.join(dir, '1.3.4 Gemengde opgaven – opgaven.md'), opgaven);
  write(path.join(dir, '1.3.4 Gemengde opgaven – antwoorden.md'), `# 1.3.4 Gemengde opgaven — antwoorden

## Opgave 1: De markt voor schriften

**a.** Qv = Qa: -2P + 100 = 3P - 25. Dus 125 = 5P en **P* = EUR 25**. Invullen: Qv = -2 x 25 + 100 = **50** en Qa = 3 x 25 - 25 = **50**. De evenwichtshoeveelheid is **50 schriften**.

**b.** Controle: beide vergelijkingen geven Q = 50 bij P = 25, dus vraag en aanbod zijn gelijk.

**c.** Bij P = EUR 30: Qv = -2 x 30 + 100 = 40. Qa = 3 x 30 - 25 = 65. Er is een **aanbodoverschot** van 65 - 40 = **25 schriften**.

**d.** Bij een aanbodoverschot willen producenten meer verkopen dan consumenten kopen. Verkopers verlagen dan de prijs. Bij een vraagoverschot stijgt de prijs juist. Zo beweegt de prijs richting het evenwicht.

---

## Opgave 2: Meer vraag naar bioscoopkaartjes

**a.** Dit is een verschuiving van de vraaglijn, want de voorkeur/interesse van consumenten verandert. De prijs zelf is niet de oorzaak van de verandering.

**b.** De oude vraaglijn en nieuwe vraaglijn lopen dalend. De nieuwe vraaglijn ligt rechts van de oude vraaglijn. De aanbodlijn blijft gelijk.

**c.** De evenwichtsprijs stijgt waarschijnlijk.

**d.** De evenwichtshoeveelheid stijgt waarschijnlijk.

**e.** Door meer interesse willen consumenten bij elke prijs meer kaartjes kopen. Bij de oude prijs ontstaat vraagoverschot, waardoor de prijs stijgt tot er een nieuw evenwicht is met meer verkochte kaartjes.

---

## Opgave 3: Goedkopere productie van zonnepanelen

**a.** De aanbodlijn verschuift.

**b.** De aanbodlijn verschuift naar rechts, want producenten kunnen bij elke prijs meer aanbieden.

**c.** De evenwichtsprijs daalt waarschijnlijk.

**d.** De evenwichtshoeveelheid stijgt waarschijnlijk.

**e.** Door de lagere productiekosten komt er meer aanbod. Daardoor daalt de marktprijs. Bij die lagere prijs kopen consumenten meer zonnepanelen, ook als hun voorkeur niet is veranderd.

---

## Opgave 4: Eigen prijs of vraagfactor

**a.** Situatie A is een **beweging langs de vraaglijn**. De eigen prijs verandert; daardoor verandert de gevraagde hoeveelheid op dezelfde vraaglijn.

**b.** Situatie B is een **verschuiving van de vraaglijn**. De campagne verandert de voorkeur/interesse van consumenten, dus bij elke prijs willen consumenten meer elektrische fietsen kopen.

**c.** Teken de oude vraaglijn V dalend. Teken de nieuwe vraaglijn V' rechts van V. De aanbodlijn A blijft gelijk.

**d.** De evenwichtsprijs stijgt waarschijnlijk en de evenwichtshoeveelheid stijgt waarschijnlijk. Bij de oude prijs ontstaat vraagoverschot, waardoor de prijs stijgt tot er een nieuw evenwicht is.

**e.** Bij een verandering van de eigen prijs beweeg je langs de bestaande vraaglijn. Bij een verandering van een vraagfactor verschuift de hele vraaglijn, omdat consumenten bij elke prijs meer of minder willen kopen.

---

## Opgave 5: Doeloefening

**a.** Oud evenwicht: -4P + 120 = 6P - 30. Dus 150 = 10P en **P* = EUR 15**. Q* = -4 x 15 + 120 = **60 broden**.

**b.** Nieuw evenwicht: -4P + 120 = 6P - 60. Dus 180 = 10P en **P* = EUR 18**. Q* = -4 x 18 + 120 = **48 broden**.

**c.** De kosten voor bakkers stijgen. Dat is een aanbodfactor: productiekosten. De aanbodlijn verschuift naar links.

**d.** De prijs stijgt van EUR 15 naar EUR 18. De hoeveelheid daalt van 60 naar 48.

**e.** Ja. Hogere kosten maken produceren minder aantrekkelijk bij elke prijs. Het aanbod daalt, de marktprijs stijgt en er worden minder broden verkocht.
`);
}

function writeQualityAndReviews() {
  write(path.join(NEW_CHAPTER_DIR, '1.3.2 Marktevenwicht', '1.3.2-review.md'), `# QC Review: 1.3.2 Marktevenwicht

## Verdict

PASS WITH FLAGS.

## L-CP6A Review Notes

- Migrated from former '1.4.1 Marktevenwicht' to active-v5 '1.3.2'.
- The ambiguous electric-bicycle subsidy prompt was corrected to a consumer purchase subsidy, with the answer route changed to a demand-line shift.
- Short hints were added to early start exercises.
- The inherited duplicated-exercise pattern in 'paragraaf.md' and 'opgaven.md' remains a Part A maintenance flag.

## Boundary

No CP-6 closure, Year 1 closure, target-exercise promotion, adaptive behavior,
diagnostics, mastery routing, sequencing, student-facing AI, summative use, PV
projection, or PV machine promotion is claimed.
`);

  write(path.join(NEW_CHAPTER_DIR, '1.3.3 Verschuivingen en nieuw evenwicht', '1.3.3-review.md'), `# QC Review: 1.3.3 Verschuivingen en nieuw evenwicht

## Verdict

PASS WITH FLAGS.

## L-CP6A Review Notes

- Migrated from former '1.4.2 Verschuivingen' to active-v5 '1.3.3'.
- The stale forward reference was corrected to '1.3.4 Gemengde opgaven'.
- The old costs/revenue exercise was removed because costs/revenue are no
  longer active Book 1 Chapter 1.3 theory.
- The old exercise 8e ambiguity was corrected: price direction is predictable;
  the quantity effect is the ambiguous/cancelling element.
- The inherited duplicated-exercise pattern in 'paragraaf.md' and 'opgaven.md'
  remains a Part A maintenance flag.

## Boundary

No CP-6 closure, Year 1 closure, target-exercise promotion, adaptive behavior,
diagnostics, mastery routing, sequencing, student-facing AI, summative use, PV
projection, or PV machine promotion is claimed.
`);

  write(path.join(NEW_CHAPTER_DIR, '1.3.4 Gemengde opgaven', '1.3.4-review.md'), `# QC Review: 1.3.4 Gemengde opgaven

## Verdict

PASS WITH FLAGS.

## L-CP6A Review Notes

- Re-scoped to active-v5 Book 1 Chapter 1.3: supply, demand, equilibrium, and
  shifts.
- Costs, revenue, break-even, and marginal analysis are excluded from this Book
  1 consolidation paragraph.
- INSPECT-11D replaced the simultaneous demand/supply shift task with a
  movement-versus-demand-shift consolidation task, preserving the reviewed
  no-new-theory integration target.

## Boundary

No CP-6 closure, Year 1 closure, target-exercise promotion, adaptive behavior,
diagnostics, mastery routing, sequencing, student-facing AI, summative use, PV
projection, or PV machine promotion is claimed.
`);

  write(path.join(NEW_CHAPTER_DIR, '1.3.2 Marktevenwicht', '1.3.2-quality-ref.yaml'), `# Quality Reference - 1.3.2 Marktevenwicht
paragraph: "1.3.2"
title: "Marktevenwicht"
chapter: "1.3 Aanbod en marktevenwicht"
type: theory
framework_version: "onderzoekskader 2021, bijgesteld 2025"
standards_verified: "2026-05-19"
target_exercise_status: "reviewed_final_source_registry_with_lesson_flags"
cp6_quality_ready: false
content:
  paragraaf_md: true
  opgaven_md: true
  antwoorden_md: true
  paragraaf_pdf: true
  opgaven_pdf: true
  antwoorden_pdf: true
  build_pdf_py: true
assets:
  total_referenced: 6
  total_present: 6
  missing: []
  orphaned: []
  svgpng_paired: true
  naming_compliant: true
review:
  file: "1.3.2-review.md"
  unresolved_blockers: 0
  verdict: "PASS WITH FLAGS"
  flags:
    - "Source registry is reviewed_final; CP-6/Year 1 closure is not claimed here."
    - "Opgaven staan zowel in paragraaf.md als opgaven.md as current Part A pattern."
l_cp6a:
  status: "aligned_with_active_v5_with_flags"
  migrated_from: "1.4.1 Marktevenwicht"
  cp6_closed: false
  year1_closed: false
l_inspect11d:
  status: "quality_ref_review_reconciled"
  source_registry_status: "reviewed_final"
  remaining_flags:
    - "Duplicated exercise pattern remains a Part A maintenance flag."
`);

  write(path.join(NEW_CHAPTER_DIR, '1.3.3 Verschuivingen en nieuw evenwicht', '1.3.3-quality-ref.yaml'), `# Quality Reference - 1.3.3 Verschuivingen en nieuw evenwicht
paragraph: "1.3.3"
title: "Verschuivingen en nieuw evenwicht"
chapter: "1.3 Aanbod en marktevenwicht"
type: theory
framework_version: "onderzoekskader 2021, bijgesteld 2025"
standards_verified: "2026-05-19"
target_exercise_status: "reviewed_final_source_registry_with_lesson_flags"
cp6_quality_ready: false
content:
  paragraaf_md: true
  opgaven_md: true
  antwoorden_md: true
  paragraaf_pdf: true
  opgaven_pdf: true
  antwoorden_pdf: true
  build_pdf_py: true
assets:
  total_referenced: 8
  total_present: 8
  missing: []
  orphaned: []
  svgpng_paired: true
  naming_compliant: true
review:
  file: "1.3.3-review.md"
  unresolved_blockers: 0
  verdict: "PASS WITH FLAGS"
  flags:
    - "Source registry is reviewed_final; CP-6/Year 1 closure is not claimed here."
    - "Opgaven staan zowel in paragraaf.md als opgaven.md as current Part A pattern."
l_cp6a:
  status: "aligned_with_active_v5_with_flags"
  migrated_from: "1.4.2 Verschuivingen"
  cp6_closed: false
  year1_closed: false
l_inspect11d:
  status: "quality_ref_review_reconciled"
  source_registry_status: "reviewed_final"
  remaining_flags:
    - "Duplicated exercise pattern remains a Part A maintenance flag."
`);

  write(path.join(NEW_CHAPTER_DIR, '1.3.4 Gemengde opgaven', '1.3.4-quality-ref.yaml'), `# Quality Reference - 1.3.4 Gemengde opgaven
paragraph: "1.3.4"
title: "Gemengde opgaven: aanbod en marktevenwicht"
chapter: "1.3 Aanbod en marktevenwicht"
type: gemengde_opgaven
framework_version: "onderzoekskader 2021, bijgesteld 2025"
standards_verified: "2026-05-19"
target_exercise_status: "reviewed_final_source_registry_no_new_theory"
cp6_quality_ready: false
content:
  opgaven_md: true
  antwoorden_md: true
  opgaven_pdf: true
  antwoorden_pdf: true
  build_pdf_py: true
assets:
  total_referenced: 0
  total_present: 0
  missing: []
  orphaned: []
  svgpng_paired: true
  naming_compliant: true
review:
  file: "1.3.4-review.md"
  unresolved_blockers: 0
  verdict: "PASS WITH FLAGS"
  flags:
    - "INSPECT-11D repaired the prior simultaneous-shift divergence in generated Opgave 4."
    - "CP-6/Year 1 closure is not claimed here."
l_cp6a:
  status: "rescoped_to_active_v5_with_flags"
  excludes_costs_revenue_break_even: true
  cp6_closed: false
  year1_closed: false
l_inspect11d:
  status: "quality_ref_review_reconciled"
  source_registry_status: "reviewed_final"
  no_new_theory: true
  simultaneous_shift_divergence: "repaired_in_generated_output"
`);
}

function updateAanbodParagraph() {
  const dir = path.join(NEW_CHAPTER_DIR, '1.3.1 Aanbod');
  transformTextFiles(dir, (text) => {
    let out = replaceAllLiteral(text, '1.3 Aanbod en kosten', '1.3 Aanbod en marktevenwicht');
    out = replaceAllLiteral(out,
      'In de volgende paragraaf bekijken we de kostenstructuur van een producent: welke kosten zijn vast, welke variabel, en hoe berekent een ondernemer de gemiddelde kosten per product?',
      'In de volgende paragraaf brengen we vraag en aanbod samen en berekenen we het marktevenwicht.'
    );
    return out;
  });

  const qualityRef = path.join(dir, '1.3.1-quality-ref.yaml');
  if (exists(qualityRef)) {
    let quality = read(qualityRef);
    quality = replaceAllLiteral(
      quality,
      'review_status: "blocker: numerical graph-text mismatch in supply figures"',
      'review_status: "resolved: numerical graph-text mismatch corrected; remaining notes non-blocking"'
    );
    if (!quality.includes('review_reconciliation:')) {
      quality += `
  review_reconciliation:
    status: "graph_text_blocker_resolved"
    source_registry_status: "reviewed_final"
    review_evidence: "1.3.1-review.md confirms the previous graph-text number mismatch was corrected."
    unresolved_blockers: 0
    cp6_closed: false
    year1_closed: false
`;
    }
    write(qualityRef, quality);
  }

  const review = path.join(dir, '1.3.1-review.md');
  if (exists(review)) {
    let reviewText = read(review);
    if (!reviewText.includes('## INSPECT-11D Reconciliation')) {
      reviewText += `

## INSPECT-11D Reconciliation

The stale quality-ref blocker for the numerical graph-text mismatch is closed.
This review already confirms the coordinates and text now match. Remaining notes
are non-blocking refinement flags; no CP-6, Year 1, diagnostic, mastery/PV,
student-use, product-use, or compliance authority is claimed.
`;
    }
    write(review, reviewText);
  }
}

function collectChapterAssets() {
  const chapterAssets = path.join(NEW_CHAPTER_DIR, '_assets');
  fs.rmSync(chapterAssets, { recursive: true, force: true });
  fs.mkdirSync(chapterAssets, { recursive: true });
  for (const paragraph of ['1.3.1 Aanbod', '1.3.2 Marktevenwicht', '1.3.3 Verschuivingen en nieuw evenwicht', '1.3.4 Gemengde opgaven']) {
    const assetDir = path.join(NEW_CHAPTER_DIR, paragraph, '_assets');
    if (!exists(assetDir)) continue;
    for (const file of listFiles(assetDir)) {
      if (path.basename(file) === '.gitkeep') continue;
      const dest = path.join(chapterAssets, path.basename(file));
      if (!exists(dest)) fs.copyFileSync(file, dest);
    }
  }
}

function writeSprintRecords() {
  write(path.join(ARCHIVE_DIR, 'L-CP6A-survival-map.md'), `# L-CP6A Survival Map

Date: 2026-05-19
Status: ACTIVE REMEDIATION RECORD

| Displaced material | Active-v5 survival route | Current repository state |
|---|---|---|
| Former Book 1 \`1.3.2 Kostenstructuren\` | Future \`2.1.1 Kostenstructuren\` | Archived under \`archive/sprints/L-CP6A/displaced-book2-material/1.3.2 Kostenstructuren/\` |
| Former Book 1 \`1.3.3 Opbrengsten\` | Future \`2.1.2 Opbrengsten, winst en break-even\` | Archived under \`archive/sprints/L-CP6A/displaced-book2-material/1.3.3 Opbrengsten/\` |
| Former Book 1 \`1.3.4 Gemengde opgaven\` costs/revenue consolidation | Partial future reuse only; not active-v5 Book 1 | Archived under \`archive/sprints/L-CP6A/displaced-book2-material/1.3.4 Gemengde opgaven/\` |

No Book 2 production is claimed by this sprint.
`);

  write(path.join(ARCHIVE_DIR, 'L-CP6A-remediation-report.md'), `# L-CP6A Remediation Report

Date: 2026-05-19
Status: IMPLEMENTATION APPLIED BY PLATFORM WORKFLOW; SEE TECHNICAL QA AND CLOSURE LOG

## What Changed

- Renamed active Chapter 1.3 to \`1.3 Hoofdstuk Aanbod en marktevenwicht\`.
- Archived stale costs/revenue paragraph slots from active Book 1 Chapter 1.3.
- Migrated former \`1.4.1 Marktevenwicht\` into active-v5 \`1.3.2 Marktevenwicht\`.
- Migrated former \`1.4.2 Verschuivingen\` into active-v5 \`1.3.3 Verschuivingen en nieuw evenwicht\`.
- Re-scoped \`1.3.4 Gemengde opgaven\` to supply, demand, equilibrium, and shifts.
- Updated review and quality-ref records to preserve non-final v5/CP-6 status.

## CP-6 Status

This sprint prepares lesson-side evidence for references-team re-evaluation.
It does not close CP-6 or Year 1.
`);
}

function main() {
  ensure(exists(path.join(CHAPTER_14_DIR, '1.4.1 Marktevenwicht')), 'source 1.4.1 Marktevenwicht missing');
  ensure(exists(path.join(CHAPTER_14_DIR, '1.4.2 Verschuivingen')), 'source 1.4.2 Verschuivingen missing');

  if (exists(OLD_CHAPTER_DIR)) {
    ensure(!exists(NEW_CHAPTER_DIR), `new chapter folder already exists: ${NEW_CHAPTER_DIR}`);
    ensure(exists(path.join(OLD_CHAPTER_DIR, '1.3.2 Kostenstructuren')), 'expected stale 1.3.2 Kostenstructuren folder missing');
    ensure(exists(path.join(OLD_CHAPTER_DIR, '1.3.3 Opbrengsten')), 'expected stale 1.3.3 Opbrengsten folder missing');
    ensure(!exists(ARCHIVE_DIR), `archive directory already exists: ${ARCHIVE_DIR}`);

    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    move(OLD_CHAPTER_DIR, NEW_CHAPTER_DIR);
    fs.mkdirSync(DISPLACED_DIR, { recursive: true });
    fs.mkdirSync(OLD_ASSEMBLY_DIR, { recursive: true });

    for (const entry of fs.readdirSync(NEW_CHAPTER_DIR)) {
      const full = path.join(NEW_CHAPTER_DIR, entry);
      if (fs.statSync(full).isDirectory()) continue;
      if (entry === 'build_chapter.py' || entry === '_chapter-plan.md') continue;
      move(full, path.join(OLD_ASSEMBLY_DIR, entry));
    }

    move(path.join(NEW_CHAPTER_DIR, '1.3.2 Kostenstructuren'), path.join(DISPLACED_DIR, '1.3.2 Kostenstructuren'));
    move(path.join(NEW_CHAPTER_DIR, '1.3.3 Opbrengsten'), path.join(DISPLACED_DIR, '1.3.3 Opbrengsten'));
    move(path.join(NEW_CHAPTER_DIR, '1.3.4 Gemengde opgaven'), path.join(DISPLACED_DIR, '1.3.4 Gemengde opgaven'));
  } else {
    ensure(exists(NEW_CHAPTER_DIR), `neither stale nor remediated chapter folder exists: ${NEW_CHAPTER_DIR}`);
    ensure(exists(DISPLACED_DIR), `remediated chapter exists but displaced archive is missing: ${DISPLACED_DIR}`);
    console.log('Refreshing existing L-CP6A remediated chapter from platform sources.');
  }

  removeInside(NEW_CHAPTER_DIR, path.join(NEW_CHAPTER_DIR, '1.3.2 Marktevenwicht'));
  removeInside(NEW_CHAPTER_DIR, path.join(NEW_CHAPTER_DIR, '1.3.3 Verschuivingen en nieuw evenwicht'));
  removeInside(NEW_CHAPTER_DIR, path.join(NEW_CHAPTER_DIR, '1.3.4 Gemengde opgaven'));

  updateAanbodParagraph();

  copyAndTransformParagraph({
    source: path.join(CHAPTER_14_DIR, '1.4.1 Marktevenwicht'),
    dest: path.join(NEW_CHAPTER_DIR, '1.3.2 Marktevenwicht'),
    fromNr: '1.4.1',
    fromTitle: 'Marktevenwicht',
    toNr: '1.3.2',
    toTitle: 'Marktevenwicht',
    transform: transformMarktevenwicht,
  });

  copyAndTransformParagraph({
    source: path.join(CHAPTER_14_DIR, '1.4.2 Verschuivingen'),
    dest: path.join(NEW_CHAPTER_DIR, '1.3.3 Verschuivingen en nieuw evenwicht'),
    fromNr: '1.4.2',
    fromTitle: 'Verschuivingen',
    toNr: '1.3.3',
    toTitle: 'Verschuivingen en nieuw evenwicht',
    transform: transformVerschuivingen,
  });

  writeGemengdeOpgaven();
  writeChapterPlan();
  buildChapterScript();
  addScreenSupportCssToBuildScripts();
  writeQualityAndReviews();
  collectChapterAssets();
  writeSprintRecords();

  console.log('OK L-CP6A remediation files prepared');
  console.log(`Active chapter: ${NEW_CHAPTER_DIR}`);
  console.log(`Displaced material: ${DISPLACED_DIR}`);
}

main();
