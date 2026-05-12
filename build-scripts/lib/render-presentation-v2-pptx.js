const {
  PC,
  FONT_SANS,
  FONT_DISPLAY,
  FONT_SERIF,
  fixPptxFile,
  fixNotesFontSize,
  roundtripWithLibreOffice,
} = require('./lib-pptx.js');
const PptxGenJS = require('pptxgenjs');

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

async function writeDeckPptx(deck, outPath, { roundtrip = true } = {}) {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: 'CUSTOM_16x9_WIDE', width: SLIDE_W, height: SLIDE_H });
  pres.layout = 'CUSTOM_16x9_WIDE';
  pres.author = '4VWO Economie';
  pres.company = '4veco';
  pres.subject = deck.paragraph.title;
  pres.title = `${deck.paragraph.number} ${deck.paragraph.title} — presentatie v2 prototype`;
  pres.lang = 'nl-NL';

  for (const slide of deck.slides) {
    renderSlide(pres, slide, deck);
  }

  await pres.writeFile({ fileName: outPath });
  await fixPptxFile(outPath);
  await fixNotesFontSize(outPath, 14);
  if (roundtrip) await roundtripWithLibreOffice(outPath);
  return outPath;
}

function renderSlide(pres, slide, deck) {
  const s = pres.addSlide();
  s.background = { color: PC.paper };
  addTopRule(s);
  addFooter(s, deck, slide);
  if (slide.layout === 'choiceTensionCover') return renderCover(s, slide);
  if (slide.layout === 'choiceComparison') return renderChoiceComparison(s, slide);
  if (slide.layout === 'procedureRoute') return renderProcedureRoute(s, slide);
  throw new Error(`Unknown presentation-v2 layout: ${slide.layout}`);
}

function addTopRule(s) {
  s.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: 0.05, fill: { color: PC.teal } });
  s.addShape('rect', { x: 0, y: 0, w: 4.2, h: 0.05, fill: { color: PC.amber } });
  s.addShape('rect', { x: 4.2, y: 0, w: 2.2, h: 0.05, fill: { color: PC.coralDeep } });
}

function addFooter(s, deck, slide) {
  s.addText(`${deck.paragraph.number} · ${slide.navTitle}`, {
    x: 0.55, y: 7.05, w: 5.2, h: 0.22,
    fontFace: FONT_SANS, fontSize: 14, bold: true,
    color: PC.smoke, charSpacing: 1.2, margin: 0,
  });
}

function notesText(slide) {
  const notes = slide.speakerNotes || {};
  const script = Array.isArray(notes.script) ? notes.script.join('\n\n') : (notes.script || '');
  return `NavTitle: ${slide.navTitle}\nSpeaker notes:\n${script}`;
}

function text(s, value, options) {
  s.addText(value, {
    fontFace: FONT_SANS,
    color: PC.ink,
    margin: 0,
    fit: 'shrink',
    breakLine: false,
    ...options,
  });
}

function renderCover(s, slide) {
  text(s, slide.eyebrow.toUpperCase(), {
    x: 0.7, y: 0.72, w: 5.4, h: 0.28,
    fontSize: 14, bold: true, color: PC.amberInk, charSpacing: 2.8,
  });
  text(s, slide.studentTitle, {
    x: 0.7, y: 1.22, w: 6.6, h: 1.55,
    fontFace: FONT_DISPLAY, fontSize: 48, bold: true,
    color: PC.indigo, charSpacing: -1.1,
  });
  text(s, slide.thesis, {
    x: 0.72, y: 3.05, w: 5.95, h: 0.75,
    fontFace: FONT_SERIF, fontSize: 20, italic: true,
    color: PC.smoke,
  });
  text(s, slide.prompt, {
    x: 0.72, y: 4.42, w: 5.5, h: 0.38,
    fontSize: 18, bold: true, color: PC.indigo,
  });

  s.addShape('rect', { x: 7.7, y: 0.65, w: 4.85, h: 5.0, fill: { color: PC.paperMid, transparency: 20 }, line: { color: PC.cloud } });

  const metrics = [slide.tension.available, slide.tension.wanted, slide.tension.gap];
  metrics.forEach((metric, i) => {
    const y = 0.85 + i * 1.72;
    text(s, metric.label.toUpperCase(), {
      x: 8.2, y, w: 3.6, h: 0.28,
      fontSize: 14, bold: true, color: PC.smoke, charSpacing: 1.8,
    });
    text(s, metric.value, {
      x: 8.15, y: y + 0.3, w: 3.6, h: 0.92,
      fontFace: FONT_DISPLAY, fontSize: i === 2 ? 48 : 58,
      bold: true, color: i === 2 ? PC.coralDeep : PC.indigo,
      charSpacing: -1.5,
    });
    if (i < metrics.length - 1) {
      s.addShape('line', { x: 8.2, y: y + 1.35, w: 3.35, h: 0, line: { color: PC.cloud, width: 1 } });
    }
  });

  const paths = slide.paths;
  paths.forEach((p, i) => {
    const y = 5.18 + i * 0.74;
    s.addShape('line', {
      x: 0.8, y: y + 0.39, w: 4.95, h: 0,
      line: { color: i === 0 ? PC.teal : PC.amberInk, width: 2.2, dash: i === 0 ? 'solid' : 'dash' },
    });
    text(s, p.label.toUpperCase(), {
      x: 0.82, y, w: 1.95, h: 0.24,
      fontSize: 14, bold: true, color: i === 0 ? PC.tealDeep : PC.amberInk,
      charSpacing: 1.4,
    });
    text(s, p.text, {
      x: 2.85, y, w: 3.1, h: 0.28,
      fontSize: 14, color: PC.smoke,
    });
  });

  s.addNotes(notesText(slide));
}

function renderChoiceComparison(s, slide) {
  text(s, slide.eyebrow.toUpperCase(), {
    x: 0.65, y: 0.55, w: 4.8, h: 0.25,
    fontSize: 14, bold: true, color: PC.badInk, charSpacing: 2.8,
  });
  text(s, slide.studentTitle, {
    x: 0.65, y: 0.95, w: 5.1, h: 0.55,
    fontFace: FONT_DISPLAY, fontSize: 32, bold: true,
    color: PC.indigo, charSpacing: -0.6,
  });
  text(s, slide.lead, {
    x: 0.68, y: 1.58, w: 4.8, h: 0.32,
    fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.smoke,
  });

  const goalText = 'Na deze les kun je: ' + slide.goals.join(' · ');
  text(s, goalText, {
    x: 0.68, y: 2.0, w: 8.6, h: 0.25,
    fontSize: 14, bold: true, color: PC.indigo,
  });

  slide.options.forEach((opt, i) => {
    const x = i === 0 ? 0.72 : 6.55;
    const accent = opt.accent === 'teal' ? PC.tealDeep : PC.amberInk;
    s.addShape('line', { x, y: 2.8, w: 4.75, h: 0, line: { color: accent, width: 3.3 } });
    text(s, `OPTIE ${opt.key}`, {
      x, y: 3.05, w: 2.4, h: 0.22,
      fontSize: 14, bold: true, color: accent, charSpacing: 2,
    });
    text(s, opt.title, {
      x, y: 3.38, w: 4.4, h: 0.48,
      fontFace: FONT_DISPLAY, fontSize: 25, bold: true,
      color: PC.indigo, charSpacing: -0.4,
    });
    text(s, opt.price, {
      x, y: 3.98, w: 3.0, h: 0.8,
      fontFace: FONT_DISPLAY, fontSize: 48, bold: true,
      color: accent, charSpacing: -1.2,
    });
    text(s, opt.benefit, {
      x, y: 4.88, w: 4.4, h: 0.28,
      fontFace: FONT_SERIF, fontSize: 15.5, italic: true,
      color: PC.smoke,
    });
  });

  s.addShape('line', { x: 6.07, y: 2.68, w: 0, h: 2.62, line: { color: PC.cloud, width: 1.2, dash: 'dash' } });
  s.addShape('line', { x: 0.65, y: 5.82, w: 12.0, h: 0, line: { color: PC.indigo, width: 1.8 } });
  text(s, slide.conclusion, {
    x: 0.86, y: 5.93, w: 11.5, h: 0.25,
    fontFace: FONT_SERIF, fontSize: 16.5, italic: true,
    color: PC.indigo,
  });

  s.addNotes(notesText(slide));
}

function renderProcedureRoute(s, slide) {
  text(s, slide.eyebrow.toUpperCase(), {
    x: 0.65, y: 0.55, w: 4.2, h: 0.25,
    fontSize: 14, bold: true, color: PC.badInk, charSpacing: 2.8,
  });
  text(s, slide.studentTitle, {
    x: 0.65, y: 0.95, w: 7.7, h: 0.55,
    fontFace: FONT_DISPLAY, fontSize: 32, bold: true,
    color: PC.indigo, charSpacing: -0.6,
  });
  text(s, slide.lead, {
    x: 0.68, y: 1.58, w: 8.8, h: 0.32,
    fontFace: FONT_SERIF, fontSize: 15.5, italic: true, color: PC.smoke,
  });

  const colors = { teal: PC.tealDeep, green: PC.oliveDeep, amber: PC.amberInk, coral: PC.badInk };
  const startX = 0.92;
  const gap = 3.05;
  s.addShape('line', { x: startX + 0.25, y: 3.4, w: 9.35, h: 0, line: { color: PC.cloud, width: 2.2 } });

  slide.steps.forEach((step, i) => {
    const x = startX + i * gap;
    const c = colors[step.accent] || PC.indigo;
    s.addShape('ellipse', { x, y: 2.85, w: 1.1, h: 1.1, fill: { color: PC.paperMid }, line: { color: c, width: 2.2 } });
    text(s, step.number, {
      x: x + 0.15, y: 3.18, w: 0.8, h: 0.28,
      fontFace: FONT_DISPLAY, fontSize: 15, bold: true,
      color: c, align: 'center',
    });
    text(s, step.title, {
      x: x - 0.32, y: 4.12, w: 1.75, h: 0.45,
      fontFace: FONT_DISPLAY, fontSize: 15.5, bold: true,
      color: PC.indigo, align: 'center', breakLine: false,
    });
    text(s, step.prompt, {
      x: x - 0.52, y: 4.68, w: 2.15, h: 0.62,
      fontSize: 14, italic: true,
      color: PC.smoke, align: 'center',
    });
  });

  s.addShape('line', { x: 1.05, y: 5.85, w: 11.1, h: 0, line: { color: PC.indigo, width: 1.8 } });
  text(s, slide.example, {
    x: 1.25, y: 5.96, w: 10.65, h: 0.25,
    fontSize: 14.5, bold: true, color: PC.indigo,
  });

  s.addNotes(notesText(slide));
}

module.exports = { writeDeckPptx };
