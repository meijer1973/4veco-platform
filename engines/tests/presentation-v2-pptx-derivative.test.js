const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const JSZip = require('jszip');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const deck111 = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'content', 'book-1', 'b1-111-presentation-v2-model.js'));
const deck113 = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'content', 'book-1', 'b1-113-presentation-v2-model.js'));
const { mapPqPoint } = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'lib', 'pq-plot-mapper.js'));
const { renderDeckHtml } = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'lib', 'render-presentation-v2-html.js'));
const { fixNotesFontSize } = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'lib', 'lib-pptx.js'));

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
    .map(match => Number(match[1]));
}

function arr(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value) return [value];
  return [];
}

function generateDecks(tmpDir) {
  const generatorPath = path.join(tmpDir, 'generate-presentation-v2-pptx.js');
  fs.writeFileSync(generatorPath, `
const path = require('path');
const root = process.argv[2];
const tmpDir = process.argv[3];
const { writeDeckPptx } = require(path.join(root, 'build-scripts', 'lib', 'render-presentation-v2-pptx.js'));
const decks = [
  require(path.join(root, 'build-scripts', 'content', 'book-1', 'b1-111-presentation-v2-model.js')),
  require(path.join(root, 'build-scripts', 'content', 'book-1', 'b1-113-presentation-v2-model.js')),
];

(async () => {
  for (const deck of decks) {
    const outPath = path.join(tmpDir, deck.paragraph.number.replace(/\\./g, '-') + '.pptx');
    await writeDeckPptx(deck, outPath, { roundtrip: false });
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
`, 'utf8');
  execFileSync(process.execPath, [generatorPath, PLATFORM_ROOT, tmpDir], {
    cwd: PLATFORM_ROOT,
    stdio: 'pipe',
  });
}

async function loadGeneratedDeck(deck, tmpDir) {
  const outPath = path.join(tmpDir, `${deck.paragraph.number.replace(/\./g, '-')}.pptx`);
  const zip = await JSZip.loadAsync(fs.readFileSync(outPath));
  return {
    outPath,
    zip,
    slides: zipPaths(zip, /^ppt\/slides\/slide\d+\.xml$/),
    notes: zipPaths(zip, /^ppt\/notesSlides\/notesSlide\d+\.xml$/),
  };
}

describe('presentation-v2 semantic PPTX derivatives', () => {
  let tmpDir;
  let generated111;
  let generated113;

  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'presentation-v2-pptx-'));
    generateDecks(tmpDir);
    generated111 = await loadGeneratedDeck(deck111, tmpDir);
    generated113 = await loadGeneratedDeck(deck113, tmpDir);
  }, 30000);

  afterAll(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test.each([
    ['1.1.1 golden scarcity deck', deck111, () => generated111],
    ['1.1.3 graph transfer deck', deck113, () => generated113],
  ])('%s preserves slide route, assertions, and classroom-ready teacher notes', async (_label, deck, generatedFor) => {
    const generated = generatedFor();
    expect(generated.slides).toHaveLength(deck.slides.length);
    expect(generated.notes).toHaveLength(deck.slides.length);

    for (let index = 0; index < deck.slides.length; index += 1) {
      const slide = deck.slides[index];
      const slideXml = await generated.zip.file(generated.slides[index]).async('string');
      const noteXml = await generated.zip.file(generated.notes[index]).async('string');
      const slideText = collectText(slideXml);
      const noteText = collectText(noteXml);

      expect(slideText).toContain(slide.assertion);
      expect(noteText).toContain('Vraag:');
      expect(noteText).toContain('Uitleg:');
      expect(noteText).toContain('Pitfall:');
      expect(noteText).toContain(slide.assertion);
      expect(noteText).not.toMatch(/\bRol:|\bLayout:|\bKernzin:|\bStudentuitleg:/);

      if (slide.speakerNotes && slide.speakerNotes.transition) {
        expect(noteText).toContain('Overgang:');
        expect(noteText).toContain(slide.speakerNotes.transition);
      }
      for (const cue of arr(slide.speakerNotes && slide.speakerNotes.teacherCue)) expect(noteText).toContain(cue);
      for (const item of arr((slide.speakerNotes && slide.speakerNotes.misconceptionWatch) || (slide.speakerNotes && slide.speakerNotes.misconception))) {
        expect(noteText).toContain(item);
      }
    }
  });

  test.each([
    ['1.1.1 golden scarcity deck', deck111, () => generated111],
    ['1.1.3 graph transfer deck', deck113, () => generated113],
  ])('%s keeps retrieval answers out of slide XML and in teacher notes', async (_label, deck, generatedFor) => {
    const generated = generatedFor();
    const retrievalIndexes = deck.slides
      .map((slide, index) => ({ slide, index }))
      .filter(({ slide }) => slide.layout === 'retrievalCheck');

    expect(retrievalIndexes.length).toBeGreaterThan(0);

    for (const { slide, index } of retrievalIndexes) {
      const slideXml = await generated.zip.file(generated.slides[index]).async('string');
      const noteXml = await generated.zip.file(generated.notes[index]).async('string');
      const slideText = collectText(slideXml);
      const noteText = collectText(noteXml);

      expect(noteText).toContain('Antwoord:');
      for (const check of slide.checks) {
        expect(slideText).toContain(check.prompt);
        expect(slideText).toContain(check.hint);
        expect(slideText).not.toContain(check.answer);
        expect(noteText).toContain(check.answer);
      }
    }
  });

  test.each([
    ['1.1.1 golden scarcity deck', deck111, () => generated111],
    ['1.1.3 graph transfer deck', deck113, () => generated113],
  ])('%s keeps labels and notes at the committed font-size floor', async (_label, deck, generatedFor) => {
    const generated = generatedFor();

    for (const slidePath of generated.slides) {
      const xml = await generated.zip.file(slidePath).async('string');
      const sizes = collectFontSizes(xml);
      expect(sizes.length).toBeGreaterThan(0);
      expect(Math.min(...sizes)).toBeGreaterThanOrEqual(1400);
      expect(sizes.some(size => size >= 1800)).toBe(true);
      expect(sizes.some(size => size >= 3400)).toBe(true);
    }

    for (const notePath of generated.notes) {
      const xml = await generated.zip.file(notePath).async('string');
      const sizes = collectFontSizes(xml);
      expect(sizes.length).toBeGreaterThan(0);
      expect(Math.min(...sizes)).toBeGreaterThanOrEqual(1400);
    }

    expect(generated.slides).toHaveLength(deck.slides.length);
  });

  test('1.1.3 PPTX carries graph labels from the semantic P-Q geometry', async () => {
    const text = (await Promise.all(generated113.slides.map(async slidePath => {
      const xml = await generated113.zip.file(slidePath).async('string');
      return collectText(xml);
    }))).join('\n');

    for (const marker of [
      'P-Q-grafiek',
      'Vraaglijn ijsjes',
      'Hoeveelheid ijsjes (Q)',
      'Prijs per ijsje (P)',
      '(300; 2,00)',
      'Q ongeveer 350',
      '\u20ac1,75',
    ]) {
      expect(text).toContain(marker);
    }

    const axisSlide = deck113.slides.find(slide => slide.role === 'axis_convention');
    const interpolationSlide = deck113.slides.find(slide => slide.role === 'graph_reading_interpolation');
    const visual = interpolationSlide.visual;
    const config = { pMin: 1, pMax: 3, qMin: 100, qMax: 500, plot: visual.plot };
    const expectedGuide = mapPqPoint({ quantity: 350, price: 1.75 }, config);

    expect(axisSlide.visual.points.find(point => point.quantity === 100 && point.price === 3).x)
      .toBeLessThan(axisSlide.visual.points.find(point => point.quantity === 500 && point.price === 1).x);
    expect(axisSlide.visual.points.find(point => point.quantity === 100 && point.price === 3).y)
      .toBeLessThan(axisSlide.visual.points.find(point => point.quantity === 500 && point.price === 1).y);
    expect(visual.guides.x).toBeCloseTo(expectedGuide.x, 2);
    expect(visual.guides.y).toBeCloseTo(expectedGuide.y, 2);
  });

  test.each([
    ['1.1.1 golden scarcity deck', deck111],
    ['1.1.3 graph transfer deck', deck113],
  ])('%s web renderer exposes the semantic PPTX derivative link', (_label, deck) => {
    const href = `${deck.outputBase}.pptx`;
    const html = renderDeckHtml(deck, { pptxHref: href, backHref: 'index.html' });

    expect(html).toContain(`href="${href}" download>PowerPoint downloaden</a>`);
    expect(html).toMatch(/data-pv2-notes aria-pressed="false" aria-expanded="false"/);
    expect(html).toMatch(/data-pv2-fullscreen aria-pressed="false">Presentatiemodus<\/button>/);
  });

  test('notes font repair covers LibreOffice default note runs', async () => {
    const outPath = path.join(tmpDir, 'notes-default-run-font-floor.pptx');
    const zip = new JSZip();
    zip.file('ppt/notesSlides/notesSlide1.xml', [
      '<p:notes xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">',
      '<a:defRPr lang="en-US" sz="1200"/>',
      '<a:rPr lang="en-US" sz="900"/>',
      '</p:notes>',
    ].join(''));
    fs.writeFileSync(outPath, await zip.generateAsync({ type: 'nodebuffer' }));

    await fixNotesFontSize(outPath, 14);
    const repaired = await JSZip.loadAsync(fs.readFileSync(outPath));
    const xml = await repaired.file('ppt/notesSlides/notesSlide1.xml').async('string');
    const sizes = collectFontSizes(xml);

    expect(sizes).toHaveLength(2);
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(1400);
    expect(xml).toMatch(/<a:defRPr\b[^>]*\bsz="1400"/);
    expect(xml).toMatch(/<a:rPr\b[^>]*\bsz="1400"/);
  });
});
