const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const JSZip = require('jszip');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const {
  ACTIVE_PRESENTATION_V2_DECK_SLUGS,
  PRESENTATION_V2_DECKS,
} = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'content', 'book-1', 'presentation-v2-registry.js'));
const { mapPqPoint } = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'lib', 'pq-plot-mapper.js'));
const { renderDeckHtml } = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'lib', 'render-presentation-v2-html.js'));
const { fixNotesFontSize } = require(path.resolve(__dirname, '..', '..', 'build-scripts', 'lib', 'lib-pptx.js'));

const registeredDecks = PRESENTATION_V2_DECKS.map(entry => ({
  entry,
  deck: require(entry.modelPath),
}));
const deckBySlug = new Map(registeredDecks.map(({ entry, deck }) => [entry.slug, deck]));
const deck113 = deckBySlug.get('b1-113');
const deckCases = registeredDecks.map(({ entry, deck }) => [
  `${deck.paragraph.number} ${deck.paragraph.title}`,
  entry.slug,
  deck,
]);
const retrievalDeckCases = deckCases.filter(([, , deck]) =>
  deck.slides.some(slide => slide.layout === 'retrievalCheck')
);

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
const { PRESENTATION_V2_DECKS } = require(path.join(root, 'build-scripts', 'content', 'book-1', 'presentation-v2-registry.js'));
const decks = PRESENTATION_V2_DECKS.map(entry => require(entry.modelPath));

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
  let generatedBySlug;

  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'presentation-v2-pptx-'));
    generateDecks(tmpDir);
    generatedBySlug = new Map();
    for (const { entry, deck } of registeredDecks) {
      generatedBySlug.set(entry.slug, await loadGeneratedDeck(deck, tmpDir));
    }
  }, 30000);

  afterAll(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('presentation-v2 registry and workflow scripts cover the active deck set', () => {
    expect(ACTIVE_PRESENTATION_V2_DECK_SLUGS).toEqual(['b1-111', 'b1-112', 'b1-113']);
    expect(PRESENTATION_V2_DECKS.map(deck => deck.slug)).toEqual(ACTIVE_PRESENTATION_V2_DECK_SLUGS);
    expect(PRESENTATION_V2_DECKS.map(deck => require(deck.modelPath).paragraph.number)).toEqual(['1.1.1', '1.1.2', '1.1.3']);

    const pkg = JSON.parse(fs.readFileSync(path.join(PLATFORM_ROOT, 'package.json'), 'utf8'));
    expect(pkg.scripts['build:presentation-v2']).toBe('node build-scripts/content/book-1/build-presentation-v2.js --all');
    expect(pkg.scripts['build:presentation-111']).toBe('node build-scripts/content/book-1/b1-111-presentation-v2.js');
    expect(pkg.scripts['build:presentation-112']).toBe('node build-scripts/content/book-1/b1-112-presentation-v2.js');
    expect(pkg.scripts['build:presentation-113']).toBe('node build-scripts/content/book-1/b1-113-presentation-v2.js');
    expect(pkg.scripts['check:presentation-v2-pptx-proof']).toContain('--check');
    expect(pkg.scripts['check:presentation-v2-html-qa']).toBe('node build-scripts/sprints/check-presentation-v2-html-qa.js');
    expect(pkg.scripts['check:presentation-v2-legacy-guard']).toBe('node build-scripts/sprints/check-presentation-v2-legacy-guard.js');

    const deploy = fs.readFileSync(path.join(PLATFORM_ROOT, 'scripts', 'deploy.js'), 'utf8');
    expect(deploy).toContain('build-scripts/content/book-1/build-presentation-v2.js --all');
  });

  test.each(deckCases)('%s preserves slide route, assertions, and classroom-ready teacher notes', async (_label, slug, deck) => {
    const generated = generatedBySlug.get(slug);
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

  test.each(retrievalDeckCases)('%s keeps retrieval answers out of slide XML and in teacher notes', async (_label, slug, deck) => {
    const generated = generatedBySlug.get(slug);
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

  test.each(deckCases)('%s keeps labels and notes at the committed font-size floor', async (_label, slug, deck) => {
    const generated = generatedBySlug.get(slug);

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
    const generated113 = generatedBySlug.get('b1-113');
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

  test.each(deckCases)('%s web renderer exposes the semantic PPTX derivative link', (_label, _slug, deck) => {
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
