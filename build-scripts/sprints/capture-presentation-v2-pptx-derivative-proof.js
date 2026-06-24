#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const JSZip = require('jszip');

const { mapPqPoint } = require('../lib/pq-plot-mapper');

const SPRINT_ID = 'PRESENTATION-V2-PPTX-DERIVATIVE-111-113-1';
const ROOT = path.resolve(__dirname, '..', '..');
const BOOK_ROOT = path.resolve(
  process.env.PRESENTATION_V2_BOOK_ROOT ||
  process.env.LESSON_BOOK_ROOT ||
  path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const OUT_DIR = path.join(ROOT, 'reports', 'sprints', SPRINT_ID);
const SOFFICE = process.env.SOFFICE_PATH || 'C:\\Program Files\\LibreOffice\\program\\soffice.exe';
const PDFTOPPM = process.env.PDFTOPPM_PATH || 'pdftoppm';

const targets = [
  {
    id: '1.1.1',
    slug: 'b1-111',
    modelPath: path.join(ROOT, 'build-scripts', 'content', 'book-1', 'b1-111-presentation-v2-model.js'),
    deck: require('../content/book-1/b1-111-presentation-v2-model'),
  },
  {
    id: '1.1.3',
    slug: 'b1-113',
    modelPath: path.join(ROOT, 'build-scripts', 'content', 'book-1', 'b1-113-presentation-v2-model.js'),
    deck: require('../content/book-1/b1-113-presentation-v2-model'),
  },
];

function fail(message) {
  console.error(`${SPRINT_ID} proof failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  assert(buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG', `${file} must be a PNG`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function paragraphDir(deck) {
  return path.join(
    BOOK_ROOT,
    deck.paragraph.chapter,
    `${deck.paragraph.number} ${deck.paragraph.title}`,
  );
}

function outputFiles(deck) {
  const dir = paragraphDir(deck);
  return {
    dir,
    html: path.join(dir, `${deck.outputBase}.html`),
    pptx: path.join(dir, `${deck.outputBase}.pptx`),
  };
}

function numericPathSort(a, b) {
  return Number(a.match(/(\d+)\.xml$/)[1]) - Number(b.match(/(\d+)\.xml$/)[1]);
}

function zipPaths(zip, pattern) {
  const paths = [];
  zip.forEach((entryPath, file) => {
    if (!file.dir && pattern.test(entryPath)) paths.push(entryPath);
  });
  return paths.sort(numericPathSort);
}

function decodeXmlText(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function collectText(xml) {
  return [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)]
    .map(match => decodeXmlText(match[1]))
    .join('\n');
}

function collectFontSizes(xml) {
  return [...xml.matchAll(/<a:(?:rPr|defRPr)\b[^>]*\bsz="(\d+)"/g)]
    .map(match => Number(match[1]) / 100);
}

async function inspectPptx(target, files) {
  const zip = await JSZip.loadAsync(fs.readFileSync(files.pptx));
  const slidePaths = zipPaths(zip, /^ppt\/slides\/slide\d+\.xml$/);
  const notePaths = zipPaths(zip, /^ppt\/notesSlides\/notesSlide\d+\.xml$/);
  const deck = target.deck;

  assert(slidePaths.length === deck.slides.length, `${target.id} slide count mismatch`);
  assert(notePaths.length === deck.slides.length, `${target.id} notes count mismatch`);

  const slides = [];
  const allSlideText = [];
  const allSlideFontSizes = [];
  const allNotesFontSizes = [];

  for (let index = 0; index < deck.slides.length; index += 1) {
    const slide = deck.slides[index];
    const slideXml = await zip.file(slidePaths[index]).async('string');
    const noteXml = await zip.file(notePaths[index]).async('string');
    const slideText = collectText(slideXml);
    const noteText = collectText(noteXml);
    const slideSizes = collectFontSizes(slideXml);
    const noteSizes = collectFontSizes(noteXml);

    assert(slideText.includes(slide.assertion), `${target.id} slide ${index + 1} missing assertion`);
    assert(noteText.includes(`Rol: ${slide.role}`), `${target.id} slide ${index + 1} missing note role`);
    assert(noteText.includes(`Layout: ${slide.layout}`), `${target.id} slide ${index + 1} missing note layout`);
    assert(slideSizes.length > 0, `${target.id} slide ${index + 1} has no font sizes`);
    assert(noteSizes.length > 0, `${target.id} slide ${index + 1} notes have no font sizes`);
    assert(Math.min(...slideSizes) >= 14, `${target.id} slide ${index + 1} has text below 14 pt`);
    assert(slideSizes.some(size => size >= 18), `${target.id} slide ${index + 1} has no body-size text`);
    assert(Math.min(...noteSizes) >= 14, `${target.id} slide ${index + 1} notes below 14 pt`);

    allSlideText.push(slideText);
    allSlideFontSizes.push(...slideSizes);
    allNotesFontSizes.push(...noteSizes);
    slides.push({
      index: index + 1,
      role: slide.role,
      layout: slide.layout,
      title: slide.studentTitle || slide.title || slide.navTitle,
      assertion: slide.assertion,
      assertion_found: true,
      note_role_found: true,
      note_layout_found: true,
      slide_min_font_pt: Math.min(...slideSizes),
      notes_min_font_pt: Math.min(...noteSizes),
    });
  }

  const graphGeometry = target.id === '1.1.3'
    ? verifyGraphGeometry(target.deck, allSlideText.join('\n'))
    : null;

  return {
    slide_count: slidePaths.length,
    notes_count: notePaths.length,
    slide_min_font_pt: Math.min(...allSlideFontSizes),
    notes_min_font_pt: Math.min(...allNotesFontSizes),
    assertions_found: true,
    notes_roles_found: true,
    graph_geometry: graphGeometry,
    slides,
  };
}

function verifyGraphGeometry(deck, text) {
  for (const marker of [
    'P-Q-grafiek',
    'Vraaglijn ijsjes',
    'Hoeveelheid ijsjes (Q)',
    'Prijs per ijsje (P)',
    '(300; 2,00)',
    'Q ongeveer 350',
    '\u20ac1,75',
  ]) {
    assert(text.includes(marker), `1.1.3 PPTX text missing graph marker: ${marker}`);
  }

  const axisSlide = deck.slides.find(slide => slide.role === 'axis_convention');
  const interpolationSlide = deck.slides.find(slide => slide.role === 'graph_reading_interpolation');
  const axisVisual = axisSlide.visual;
  const interpolationVisual = interpolationSlide.visual;
  const config = { pMin: 1, pMax: 3, qMin: 100, qMax: 500, plot: interpolationVisual.plot };
  const expectedGuide = mapPqPoint({ quantity: 350, price: 1.75 }, config);
  const p100 = axisVisual.points.find(point => point.quantity === 100 && point.price === 3);
  const p500 = axisVisual.points.find(point => point.quantity === 500 && point.price === 1);

  assert(p100.x < p500.x, '1.1.3 P-Q graph must increase quantity left-to-right');
  assert(p100.y < p500.y, '1.1.3 P-Q graph must place higher prices higher');
  assert(Math.abs(interpolationVisual.guides.x - expectedGuide.x) < 0.01, '1.1.3 interpolation guide x mismatch');
  assert(Math.abs(interpolationVisual.guides.y - expectedGuide.y) < 0.01, '1.1.3 interpolation guide y mismatch');

  return {
    axis_convention: 'P vertical; Q horizontal',
    upper_left_point: { quantity: p100.quantity, price: p100.price, x: p100.x, y: p100.y },
    lower_right_point: { quantity: p500.quantity, price: p500.price, x: p500.x, y: p500.y },
    interpolation: {
      quantity: interpolationVisual.guides.quantity,
      price: interpolationVisual.guides.price,
      x: interpolationVisual.guides.x,
      y: interpolationVisual.guides.y,
      expected_x: expectedGuide.x,
      expected_y: expectedGuide.y,
      x_label: interpolationVisual.guides.xLabel,
      y_label: interpolationVisual.guides.yLabel,
    },
  };
}

function convertPptxToPdf(pptxPath, tmpDir) {
  assert(fs.existsSync(SOFFICE), `LibreOffice not found: ${SOFFICE}`);
  const profileDir = path.join(tmpDir, `lo-profile-${Date.now()}`);
  const profileUri = `file:///${profileDir.replace(/\\/g, '/')}`;
  execFileSync(SOFFICE, [
    `-env:UserInstallation=${profileUri}`,
    '--headless',
    '--convert-to',
    'pdf',
    '--outdir',
    tmpDir,
    pptxPath,
  ], { stdio: 'pipe' });
  const pdfPath = path.join(tmpDir, `${path.basename(pptxPath, '.pptx')}.pdf`);
  assert(fs.existsSync(pdfPath), `LibreOffice did not produce PDF: ${pdfPath}`);
  return pdfPath;
}

function exportPdfPngs(pdfPath, deckOutDir, target) {
  const prefix = path.join(deckOutDir, 'slide');
  execFileSync(PDFTOPPM, ['-png', '-r', '144', pdfPath, prefix], { stdio: 'pipe' });
  const rawFiles = fs.readdirSync(deckOutDir)
    .filter(file => /^slide-\d+\.png$/i.test(file))
    .sort((a, b) => Number(a.match(/slide-(\d+)\.png/i)[1]) - Number(b.match(/slide-(\d+)\.png/i)[1]));

  return rawFiles.map((file, index) => {
    const finalName = `slide-${String(index + 1).padStart(2, '0')}.png`;
    const from = path.join(deckOutDir, file);
    const to = path.join(deckOutDir, finalName);
    if (from !== to) fs.renameSync(from, to);
    const dims = pngDimensions(to);
    return {
      index: index + 1,
      role: target.deck.slides[index] && target.deck.slides[index].role,
      path: rel(to),
      sha256: sha256File(to),
      width: dims.width,
      height: dims.height,
      bytes: fs.statSync(to).size,
    };
  });
}

function deckMarkdown(deckReport) {
  const lines = [
    `### ${deckReport.id} ${deckReport.title}`,
    '',
    `- Model: \`${deckReport.model_file}\` (${deckReport.model_sha256.slice(0, 12)})`,
    `- HTML: \`${deckReport.html_file}\` (${deckReport.html_sha256.slice(0, 12)})`,
    `- PPTX: \`${deckReport.pptx_file}\` (${deckReport.pptx_sha256.slice(0, 12)})`,
    `- Slides/notes/PNGs: ${deckReport.slide_count}/${deckReport.notes_count}/${deckReport.png_count}`,
    `- Font floors: slides ${deckReport.slide_min_font_pt} pt, notes ${deckReport.notes_min_font_pt} pt`,
    '',
    '| Slide | Role | Layout | PNG proof |',
    '| --- | --- | --- | --- |',
  ];
  deckReport.images.forEach((image) => {
    const slide = deckReport.slides[image.index - 1];
    lines.push(`| ${image.index} | \`${slide.role}\` | \`${slide.layout}\` | [${path.basename(image.path)}](${path.basename(deckReport.proof_dir)}/${path.basename(image.path)}) |`);
  });
  return lines.join('\n');
}

function writeMarkdownReport(manifest) {
  const lines = [
    `# ${SPRINT_ID}`,
    '',
    'PowerPoint derivative proof packet for the semantic presentation-v2 decks.',
    '',
    'The PPTX files are generated from the same semantic models as the web presentations. LibreOffice converts each PPTX to PDF, Poppler exports every slide as PNG, and this packet records model/HTML/PPTX/PNG hashes plus route, notes, font, and geometry checks.',
    '',
    `Generated: ${manifest.generated_at}`,
    '',
    ...manifest.decks.map(deckMarkdown),
    '',
    '## Geometry',
    '',
    'The 1.1.3 graph proof verifies P vertical, Q horizontal, (100; EUR 3.00) in the upper-left direction, (500; EUR 1.00) in the lower-right direction, and interpolation at EUR 1.75 to approximately Q = 350.',
    '',
    '## Toolchain',
    '',
    `- LibreOffice: \`${manifest.toolchain.libreoffice}\``,
    `- Poppler: \`${manifest.toolchain.poppler}\``,
    `- Renderer: \`${manifest.toolchain.renderer}\``,
    '',
  ];
  fs.writeFileSync(path.join(OUT_DIR, 'parity-report.md'), `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  assert(fs.existsSync(BOOK_ROOT), `lesson book root not found: ${BOOK_ROOT}`);
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pv2-pptx-proof-'));
  const manifest = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_at: new Date().toISOString(),
    book_root: rel(BOOK_ROOT),
    toolchain: {
      renderer: 'build-scripts/lib/render-presentation-v2-pptx.js',
      libreoffice: SOFFICE,
      poppler: `${PDFTOPPM} -png -r 144`,
    },
    decks: [],
  };

  try {
    for (const target of targets) {
      const files = outputFiles(target.deck);
      assert(fs.existsSync(files.html), `${target.id} HTML missing: ${files.html}`);
      assert(fs.existsSync(files.pptx), `${target.id} PPTX missing: ${files.pptx}`);

      const deckOutDir = path.join(OUT_DIR, target.slug);
      fs.mkdirSync(deckOutDir, { recursive: true });
      const pdfPath = convertPptxToPdf(files.pptx, tmpDir);
      const inspection = await inspectPptx(target, files);
      const images = exportPdfPngs(pdfPath, deckOutDir, target);
      assert(images.length === target.deck.slides.length, `${target.id} PNG count mismatch`);

      manifest.decks.push({
        id: target.id,
        slug: target.slug,
        title: target.deck.paragraph.title,
        model_file: rel(target.modelPath),
        model_sha256: sha256File(target.modelPath),
        html_file: rel(files.html),
        html_sha256: sha256File(files.html),
        pptx_file: rel(files.pptx),
        pptx_sha256: sha256File(files.pptx),
        pptx_bytes: fs.statSync(files.pptx).size,
        proof_dir: rel(deckOutDir),
        slide_count: inspection.slide_count,
        notes_count: inspection.notes_count,
        png_count: images.length,
        slide_min_font_pt: inspection.slide_min_font_pt,
        notes_min_font_pt: inspection.notes_min_font_pt,
        assertions_found: inspection.assertions_found,
        notes_roles_found: inspection.notes_roles_found,
        graph_geometry: inspection.graph_geometry,
        slides: inspection.slides,
        images,
      });
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  writeMarkdownReport(manifest);

  console.log(`OK ${SPRINT_ID}`);
  console.log(`  report: ${path.join(OUT_DIR, 'parity-report.md')}`);
  console.log(`  manifest: ${path.join(OUT_DIR, 'manifest.json')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
