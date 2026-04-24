/**
 * HOW TO ADAPT
 * 1. Copy this script to `b1-XYZ-companions.js`.
 * 2. Change PAR_NR, PAR_NAME, PAR_DIR, content sections, and image usage.
 * 3. Keep output in the flat paragraph root.
 * 4. Reuse `_assets/*.png` visuals; do not generate one-off visuals inside doc scripts.
 * 5. Run from `4veco-platform/`:
 *      node build-scripts/content/book-1/b1-112-companions.js
 */
'use strict';

const path = require('path');
const fs = require('fs');

const NODE_PATH = path.join(process.env.APPDATA || '', 'npm', 'node_modules');
process.env.NODE_PATH = NODE_PATH;
require('module').Module._initPaths();

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
} = require('docx');
const PptxGenJS = require('pptxgenjs');

const PAR_NR = '1.1.2';
const PAR_NAME = 'Percentages en indexcijfers';
const PREFIX = `${PAR_NR} ${PAR_NAME}`;
const BOOK_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const PAR_DIR = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen', `${PAR_NR} ${PAR_NAME}`);
const ASSETS_DIR = path.join(PAR_DIR, '_assets');

const C = {
  navy: '1E2761',
  teal: '148F83',
  blue: '1A5276',
  amber: 'E67E22',
  red: 'C0392B',
  light: 'F7FAFC',
  border: 'CBD5E0',
  dark: '2D3748',
};

function assetPath(base) {
  return path.join(ASSETS_DIR, `${base}.png`);
}

function p(text, options = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: C.dark, ...options })],
  });
}

function h(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 260, after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 30, bold: true, color: C.navy })],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: C.dark })],
  });
}

function image(base, width = 460, height = 280) {
  const file = assetPath(base);
  if (!fs.existsSync(file)) return null;
  return new Paragraph({
    spacing: { before: 120, after: 140 },
    children: [new ImageRun({
      data: fs.readFileSync(file),
      transformation: { width, height },
      type: 'png',
      altText: { title: base, description: `Asset ${base}`, name: base },
    })],
  });
}

function table(rows) {
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: rows.map((row, rowIndex) => new TableRow({
      children: row.map(cell => new TableCell({
        width: { size: Math.floor(9000 / row.length), type: WidthType.DXA },
        shading: { fill: rowIndex === 0 ? C.navy : (rowIndex % 2 ? 'FFFFFF' : C.light), type: ShadingType.CLEAR },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: C.border },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border },
          left: { style: BorderStyle.SINGLE, size: 1, color: C.border },
          right: { style: BorderStyle.SINGLE, size: 1, color: C.border },
        },
        children: [new Paragraph({
          children: [new TextRun({
            text: cell,
            font: 'Arial',
            size: rowIndex === 0 ? 20 : 19,
            bold: rowIndex === 0,
            color: rowIndex === 0 ? 'FFFFFF' : C.dark,
          })],
        })],
      })),
    })),
  });
}

async function writeDocx(fileName, title, subtitle, sections) {
  const children = [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: title, font: 'Arial', size: 42, bold: true, color: C.navy })] }),
    p(subtitle, { italics: true, color: '718096' }),
  ];
  for (const section of sections) {
    if (typeof section === 'string') children.push(p(section));
    else if (section.kind === 'h') children.push(h(section.text));
    else if (section.kind === 'bullet') children.push(bullet(section.text));
    else if (section.kind === 'image') {
      const img = image(section.base, section.width, section.height);
      if (img) children.push(img);
    } else if (section.kind === 'table') {
      children.push(table(section.rows));
    }
  }
  const doc = new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    sections: [{ properties: {}, children }],
  });
  const out = path.join(PAR_DIR, fileName);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(out, buffer);
  console.log(`docx ${out}`);
}

function htmlPage(title, sections) {
  const body = sections.map(section => {
    if (typeof section === 'string') return `<p>${escapeHtml(section)}</p>`;
    if (section.kind === 'h') return `<h2>${escapeHtml(section.text)}</h2>`;
    if (section.kind === 'bullet') return `<li>${escapeHtml(section.text)}</li>`;
    if (section.kind === 'image') return `<figure><img src="_assets/${section.base}.png" alt="${escapeHtml(section.base)}"><figcaption>${escapeHtml(section.base)}</figcaption></figure>`;
    if (section.kind === 'table') return `<table>${section.rows.map((r, i) => `<tr>${r.map(c => i === 0 ? `<th>${escapeHtml(c)}</th>` : `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</table>`;
    return '';
  }).join('\n');
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body{font-family:Arial,sans-serif;line-height:1.55;max-width:920px;margin:32px auto;padding:0 20px;color:#243040}
    h1{color:#1E2761} h2{margin-top:28px;color:#1A5276}
    img{max-width:100%;height:auto;border:1px solid #d8dee9;background:white}
    figure{margin:24px 0;text-align:center} figcaption{font-size:.9rem;color:#667}
    table{border-collapse:collapse;width:100%;margin:18px 0} th,td{border:1px solid #cbd5e0;padding:10px;vertical-align:top} th{background:#1E2761;color:white}
    li{margin:8px 0}
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${body}
</body>
</html>
`;
}

function writeHtml(fileName, title, sections) {
  const out = path.join(PAR_DIR, fileName);
  fs.writeFileSync(out, htmlPage(title, sections), 'utf8');
  console.log(`html ${out}`);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

async function buildPptx() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = '4veco';
  pptx.subject = PREFIX;
  pptx.title = `${PREFIX} - presentatie`;
  pptx.theme = {
    headFontFace: 'Arial',
    bodyFontFace: 'Arial',
    lang: 'nl-NL',
  };

  function slide(title, subtitle, bullets = [], imgBase = null) {
    const s = pptx.addSlide();
    s.background = { color: 'FFFFFF' };
    s.addText(`§ ${PAR_NR}`, { x: 0.45, y: 0.25, w: 1.2, h: 0.25, fontFace: 'Arial', fontSize: 11, bold: true, color: C.amber });
    s.addText(title, { x: 0.45, y: 0.55, w: imgBase ? 5.7 : 12.2, h: 0.55, fontFace: 'Arial', fontSize: 27, bold: true, color: C.navy, fit: 'shrink' });
    s.addText(subtitle, { x: 0.45, y: 1.12, w: imgBase ? 5.5 : 11.8, h: 0.45, fontFace: 'Arial', fontSize: 17, italic: true, color: '52606D', fit: 'shrink' });
    bullets.forEach((b, i) => {
      s.addText(b, { x: 0.75, y: 1.85 + i * 0.55, w: imgBase ? 5.2 : 11.4, h: 0.38, fontFace: 'Arial', fontSize: 18, color: C.dark, bullet: { type: 'ul' }, fit: 'shrink' });
    });
    if (imgBase) {
      const file = assetPath(imgBase);
      if (fs.existsSync(file)) {
        s.addImage({ path: file, x: 6.5, y: 1.45, w: 6.2, h: 3.5 });
        s.addText(imgBase, { x: 6.5, y: 5.05, w: 6.2, h: 0.25, fontSize: 9, color: '667085', align: 'center' });
      }
    }
  }

  slide('Percentages en indexcijfers', 'Hoe vergelijk je prijzen door de tijd?', [
    'Absolute bedragen vertellen niet genoeg.',
    'Percentages maken veranderingen vergelijkbaar.',
    'Indexcijfers maken reeksen door de tijd overzichtelijk.',
  ]);
  slide('Smartphone: EUR 48 duurder', 'Van EUR 600 naar EUR 648 is niet “een beetje”: het is 8%.', [
    'Oud = EUR 600',
    'Nieuw = EUR 648',
    '(648 - 600) / 600 x 100% = 8%',
  ], '1.1.2_fig_1');
  slide('Procedure 1: procentuele verandering', 'De oude waarde staat altijd in de noemer.', [
    '1. Noteer oud en nieuw.',
    '2. Bereken (nieuw - oud) / oud x 100%.',
    '3. Interpreteer: positief stijging, negatief daling.',
  ], '1.1.2_fig_1');
  slide('Indexcijfer: basisjaar = 100', 'Een indexcijfer vergelijkt elk jaar met hetzelfde startpunt.', [
    'Indexcijfer = waarde / basiswaarde x 100.',
    'Index 125 betekent: 25% hoger dan het basisjaar.',
    'Zonder basisjaar kun je een index niet interpreteren.',
  ], '1.1.2_fig_2');
  slide('Valkuil: indexpunten zijn geen procenten', 'Van 125 naar 135 is 10 indexpunten, maar 8%.', [
    'Indexpunten: 135 - 125 = 10.',
    'Procentuele verandering: 10 / 125 x 100% = 8%.',
    'Alleen vanaf index 100 zijn punten en procenten gelijk.',
  ], '1.1.2_fig_3');
  slide('Uitgewerkt voorbeeld: benzineprijs', 'Dezelfde procedure werkt bij stijging en daling.', [
    '2022 = EUR 1,80, dus index 100.',
    '2023 = EUR 1,98, dus index 110.',
    '2024 = EUR 1,89, dus index 105.',
  ], '1.1.2_we_1');
  slide('Samenvatting', 'Drie afspraken die overal terugkomen.', [
    'Procentuele verandering: deel door oud.',
    'Indexcijfer: deel door basiswaarde en vermenigvuldig met 100.',
    'Indexpunten ≠ procenten.',
  ]);

  const out = path.join(PAR_DIR, `${PREFIX} – presentatie.pptx`);
  await pptx.writeFile({ fileName: out });
  console.log(`pptx ${out}`);
}

const voorkennis = [
  { kind: 'h', text: 'Wat moet je al kunnen?' },
  'Je hebt drie bouwstenen nodig: rekenen met procenten, delen door een beginwaarde, en een eenvoudige grafiek of tabel aflezen.',
  { kind: 'bullet', text: 'Van een breuk naar een percentage: 0,08 x 100% = 8%.' },
  { kind: 'bullet', text: 'Bij veranderingen vergelijk je altijd met waar je vandaan komt.' },
  { kind: 'image', base: '1.1.2_fig_1' },
  { kind: 'h', text: 'Basisjaar begrijpen' },
  'Een basisjaar is het startpunt van een indexreeks. Dat jaar krijgt de waarde 100. Daarna kun je alle jaren met hetzelfde startpunt vergelijken.',
  { kind: 'image', base: '1.1.2_fig_2' },
];

const vaardigheden = [
  { kind: 'h', text: 'Vaardigheid 1: procentuele verandering berekenen' },
  { kind: 'table', rows: [['Stap', 'Actie'], ['1', 'Noteer oude waarde en nieuwe waarde'], ['2', 'Bereken (nieuw - oud) / oud x 100%'], ['3', 'Interpreteer positief als stijging en negatief als daling']] },
  { kind: 'image', base: '1.1.2_fig_1' },
  { kind: 'h', text: 'Vaardigheid 2: indexcijfer berekenen' },
  { kind: 'table', rows: [['Stap', 'Actie'], ['1', 'Bepaal het basisjaar: index = 100'], ['2', 'Bereken waarde / basiswaarde x 100'], ['3', 'Interpreteer boven of onder 100']] },
  { kind: 'image', base: '1.1.2_fig_2' },
  { kind: 'h', text: 'Vaardigheid 3: indexpunten niet verwarren met procenten' },
  'Een stijging van 125 naar 135 is 10 indexpunten. De procentuele stijging is 10 / 125 x 100% = 8%.',
  { kind: 'image', base: '1.1.2_fig_3' },
];

const nieuws = [
  { kind: 'h', text: 'CBS: inflatie in maart 2026 is 2,7 procent' },
  'Volgens het CBS waren consumentengoederen en -diensten in maart 2026 gemiddeld 2,7 procent duurder dan een jaar eerder. Dat is een procentuele verandering van het algemene prijspeil.',
  'Bron: CBS, https://www.cbs.nl/nl-nl/nieuws/2026/15/inflatie-in-maart-2-7-procent',
  { kind: 'image', base: '1.1.2_fig_2' },
  { kind: 'h', text: 'Vragen' },
  { kind: 'bullet', text: 'Wat betekent 2,7 procent inflatie in woorden?' },
  { kind: 'bullet', text: 'Waarom gebruikt het CBS een index om prijzen door de tijd te vergelijken?' },
  { kind: 'bullet', text: 'Wat is het verschil tussen indexpunten en procentuele verandering?' },
  { kind: 'bullet', text: 'Waarom kan jouw persoonlijke inflatie anders voelen dan het gemiddelde cijfer?' },
];

const samenvatting = [
  { kind: 'h', text: 'Alles op een rij' },
  { kind: 'table', rows: [['Onderwerp', 'Formule', 'Let op'], ['Procentuele verandering', '(nieuw - oud) / oud x 100%', 'Deel door oud'], ['Indexcijfer', 'waarde / basiswaarde x 100', 'Basisjaar = 100'], ['Indexpunten', 'nieuw index - oud index', 'Niet hetzelfde als procenten']] },
  { kind: 'image', base: '1.1.2_fig_3' },
  { kind: 'image', base: '1.1.2_we_1' },
];

const begeleideVragen = [
  { kind: 'h', text: 'Begeleide inoefening' },
  'Werk elke opgave uit met dezelfde procedure. Schrijf bij elke berekening expliciet op wat oud en nieuw zijn.',
  { kind: 'image', base: '1.1.2_we_1' },
  { kind: 'bullet', text: 'Opgave A: Een prijs stijgt van EUR 600 naar EUR 648. Bereken de procentuele stijging.' },
  { kind: 'bullet', text: 'Opgave B: Een mandje stijgt van EUR 120 naar EUR 150. Bereken het indexcijfer.' },
  { kind: 'bullet', text: 'Opgave C: Een index stijgt van 125 naar 135. Bereken de procentuele verandering.' },
];

const begeleideAntwoorden = [
  { kind: 'h', text: 'Antwoorden begeleide inoefening' },
  { kind: 'bullet', text: 'A: (648 - 600) / 600 x 100% = 8%.' },
  { kind: 'bullet', text: 'B: 150 / 120 x 100 = 125.' },
  { kind: 'bullet', text: 'C: (135 - 125) / 125 x 100% = 8%. Het verschil is 10 indexpunten.' },
  { kind: 'image', base: '1.1.2_fig_3' },
];

function exerciseSections(level) {
  return [
    { kind: 'h', text: `${level} opgaven` },
    { kind: 'bullet', text: 'Bereken een procentuele stijging en benoem de oude waarde.' },
    { kind: 'bullet', text: 'Bereken een indexcijfer met basisjaar 100.' },
    { kind: 'bullet', text: 'Leg uit waarom indexpunten geen procenten zijn.' },
    { kind: 'image', base: level === 'Verrijking' ? '1.1.2_fig_3' : '1.1.2_fig_1' },
  ];
}

function answerSections(level) {
  return [
    { kind: 'h', text: `${level} antwoorden` },
    { kind: 'bullet', text: 'Gebruik steeds: (nieuw - oud) / oud x 100%.' },
    { kind: 'bullet', text: 'Gebruik voor indexcijfers: waarde / basiswaarde x 100.' },
    { kind: 'bullet', text: 'Schrijf bij indexverschillen eerst het aantal indexpunten op en bereken daarna het percentage.' },
  ];
}

async function main() {
  if (!fs.existsSync(PAR_DIR)) throw new Error(`Paragraph folder missing: ${PAR_DIR}`);

  await writeDocx(`${PREFIX} – uitleg voorkennis.docx`, `${PREFIX} - Uitleg voorkennis`, 'Rekenen met procenten, oude waarde en basisjaar.', voorkennis);
  await writeDocx(`${PREFIX} – uitleg vaardigheden.docx`, `${PREFIX} - Uitleg vaardigheden`, 'Drie vaste procedures voor percentages en indexcijfers.', vaardigheden);
  await writeDocx(`${PREFIX} – nieuws met visual.docx`, `${PREFIX} - Nieuws met visual`, 'CBS-inflatiebericht gekoppeld aan indexcijfers.', nieuws);
  await writeDocx(`${PREFIX} – samenvatting.docx`, `${PREFIX} - Samenvatting`, 'Een compacte formulekaart voor deze paragraaf.', samenvatting);
  await writeDocx(`${PREFIX} – begeleide inoefening – vragen.docx`, `${PREFIX} - Begeleide inoefening vragen`, 'Met denkstappen en visuele steun.', begeleideVragen);
  await writeDocx(`${PREFIX} – begeleide inoefening – antwoorden.docx`, `${PREFIX} - Begeleide inoefening antwoorden`, 'Uitwerkingen volgens de vaste procedures.', begeleideAntwoorden);

  for (const level of ['Basis', 'Midden', 'Verrijking']) {
    const slug = level.toLowerCase();
    await writeDocx(`${PREFIX} – ${slug} – vragen.docx`, `${PREFIX} - ${level} vragen`, `${level} oefenset percentages en indexcijfers.`, exerciseSections(level));
    await writeDocx(`${PREFIX} – ${slug} – antwoorden.docx`, `${PREFIX} - ${level} antwoorden`, `Uitwerkingen ${level.toLowerCase()}.`, answerSections(level));
  }

  writeHtml(`${PREFIX} – uitleg voorkennis.html`, `${PREFIX} - Uitleg voorkennis`, voorkennis);
  writeHtml(`${PREFIX} – uitleg vaardigheden.html`, `${PREFIX} - Uitleg vaardigheden`, vaardigheden);
  writeHtml(`${PREFIX} – begeleide inoefening.html`, `${PREFIX} - Begeleide inoefening`, [...begeleideVragen, { kind: 'h', text: 'Antwoorden' }, ...begeleideAntwoorden]);
  writeHtml(`${PREFIX} – youtube-videos.html`, `${PREFIX} - YouTube-video's`, [
    { kind: 'h', text: 'Videozoekhulp voor docent en leerling' },
    'Gebruik deze pagina als startpunt voor klassikale uitlegvideo’s over procenten, indexcijfers en inflatie. De links openen YouTube-zoekopdrachten zodat de docent de meest passende video kan kiezen.',
    { kind: 'bullet', text: 'Procentuele verandering berekenen - https://www.youtube.com/results?search_query=procentuele+verandering+berekenen+economie' },
    { kind: 'bullet', text: 'Indexcijfers berekenen economie - https://www.youtube.com/results?search_query=indexcijfers+berekenen+economie' },
    { kind: 'bullet', text: 'Inflatie en consumentenprijsindex - https://www.youtube.com/results?search_query=inflatie+consumentenprijsindex+uitleg' },
  ]);

  await buildPptx();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
