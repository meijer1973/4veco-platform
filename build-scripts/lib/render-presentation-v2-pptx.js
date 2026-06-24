const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');
const {
  PC,
  FONT_SANS,
  FONT_DISPLAY,
  FONT_SERIF,
  fixPptxFile,
  fixNotesFontSize,
  roundtripWithLibreOffice,
} = require('./lib-pptx.js');

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

const FONT = {
  eyebrow: 14,
  footer: 14,
  title: 34,
  assertion: 19,
  body: 18,
  label: 14,
  metric: 42,
  stepNumber: 18,
};

const ACCENTS = {
  teal: PC.tealDeep,
  green: PC.oliveDeep,
  amber: PC.amberInk,
  coral: PC.coralDeep,
  default: PC.indigo,
};

async function writeDeckPptx(deck, outPath, { roundtrip = true } = {}) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const pres = new PptxGenJS();
  pres.defineLayout({ name: 'CUSTOM_16x9_WIDE', width: SLIDE_W, height: SLIDE_H });
  pres.layout = 'CUSTOM_16x9_WIDE';
  pres.author = '4VWO Economie';
  pres.company = '4veco';
  pres.subject = `${deck.paragraph.number} ${deck.paragraph.title}`;
  pres.title = `${deck.paragraph.number} ${deck.paragraph.title} - presentation-v2 PPTX derivative`;
  pres.lang = 'nl-NL';
  pres.theme = {
    headFontFace: FONT_DISPLAY,
    bodyFontFace: FONT_SANS,
    lang: 'nl-NL',
  };

  deck.slides.forEach((slide, index) => renderSlide(pres, slide, deck, index));

  await pres.writeFile({ fileName: outPath });
  await fixPptxFile(outPath);
  if (roundtrip) {
    await roundtripWithLibreOffice(outPath);
    await fixPptxFile(outPath);
  }
  await fixNotesFontSize(outPath, 14);
  return outPath;
}

function renderSlide(pres, slide, deck, index) {
  const s = pres.addSlide();
  s.background = { color: PC.paper };
  addTopRule(s);
  addFooter(s, deck, slide, index);
  addSlideHead(s, slide);

  if (slide.layout === 'choiceTensionCover') renderCover(s, slide);
  else if (slide.layout === 'choiceComparison') renderNarrativeAnchor(s, slide);
  else if (slide.layout === 'procedureRoute') renderProcedureRoute(s, slide);
  else if (slide.layout === 'routeContract') renderRouteContract(s, slide);
  else if (slide.layout === 'narrativeAnchor') renderNarrativeAnchor(s, slide);
  else if (slide.layout === 'conceptModel') renderConceptModel(s, slide);
  else if (slide.layout === 'transferCards') renderTransferCards(s, slide);
  else if (slide.layout === 'misconceptionCards') renderMisconceptionCards(s, slide);
  else if (slide.layout === 'workedCalculation') renderWorkedCalculation(s, slide);
  else if (slide.layout === 'workedInterpretation') renderWorkedInterpretation(s, slide);
  else if (slide.layout === 'retrievalCheck') renderRetrievalCheck(s, slide);
  else if (slide.layout === 'summaryBridge') renderSummaryBridge(s, slide);
  else throw new Error(`Unknown presentation-v2 layout: ${slide.layout}`);

  s.addNotes(notesText(slide, deck, index));
}

function arr(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value) return [value];
  return [];
}

function txt(value) {
  return String(value ?? '');
}

function truncate(value, max = 120) {
  const text = txt(value);
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}

function colorFor(accent) {
  return ACCENTS[accent] || ACCENTS.default;
}

function addTopRule(s) {
  s.addShape('rect', { x: 0, y: 0, w: SLIDE_W, h: 0.05, fill: { color: PC.teal } });
  s.addShape('rect', { x: 0, y: 0, w: 4.2, h: 0.05, fill: { color: PC.amber } });
  s.addShape('rect', { x: 4.2, y: 0, w: 2.2, h: 0.05, fill: { color: PC.coralDeep } });
}

function addFooter(s, deck, slide, index) {
  addText(s, `${deck.paragraph.number} - ${slide.navTitle || slide.studentTitle || slide.role}`, {
    x: 0.55, y: 7.07, w: 7.1, h: 0.25,
    fontSize: FONT.footer, bold: true,
    color: PC.smoke, charSpacing: 0.6,
  });
  addText(s, `${index + 1}/${deck.slides.length}`, {
    x: 12.05, y: 7.07, w: 0.8, h: 0.25,
    fontSize: FONT.footer, bold: true,
    color: PC.smoke, align: 'right',
  });
}

function addSlideHead(s, slide) {
  addText(s, txt(slide.eyebrow || slide.subtitle || slide.role).toUpperCase(), {
    x: 0.65, y: 0.42, w: 11.8, h: 0.26,
    fontSize: FONT.eyebrow, bold: true,
    color: PC.coralDeep, charSpacing: 1.4,
  });
  addText(s, slide.studentTitle || slide.title || slide.teacherTitle || slide.navTitle, {
    x: 0.65, y: 0.78, w: 11.6, h: 0.55,
    fontFace: FONT_DISPLAY, fontSize: FONT.title, bold: true,
    color: PC.indigo,
  });
  if (slide.assertion) {
    addText(s, slide.assertion, {
      x: 0.67, y: 1.42, w: 11.7, h: 0.58,
      fontSize: FONT.assertion, bold: true,
      color: PC.ink,
    });
  }
  if (slide.action) {
    addText(s, slide.action, {
      x: 0.8, y: 6.53, w: 11.7, h: 0.35,
      fontFace: FONT_SERIF, fontSize: FONT.body, italic: true,
      color: PC.indigo,
    });
    s.addShape('line', {
      x: 0.72, y: 6.43, w: 11.85, h: 0,
      line: { color: PC.cloud, width: 1 },
    });
  }
}

function addText(s, value, options = {}) {
  s.addText(txt(value), {
    fontFace: FONT_SANS,
    color: PC.ink,
    fontSize: FONT.body,
    margin: 0.03,
    valign: 'top',
    breakLine: false,
    ...options,
  });
}

function addPanel(s, { x, y, w, h, fill = PC.chalk, line = PC.cloud } = {}) {
  s.addShape('roundRect', {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: fill },
    line: { color: line, width: 1 },
  });
}

function renderRouteContract(s, slide) {
  const cards = arr(slide.routeCards);
  const cardW = cards.length > 0 ? 11.9 / cards.length - 0.18 : 3.6;
  cards.forEach((card, index) => {
    const x = 0.72 + index * (cardW + 0.28);
    addPanel(s, { x, y: 2.35, w: cardW, h: 1.72, fill: PC.chalk });
    addText(s, card.label, {
      x: x + 0.18, y: 2.55, w: 0.55, h: 0.42,
      fontFace: FONT_DISPLAY, fontSize: 26, bold: true,
      color: colorFor(['teal', 'amber', 'coral', 'green'][index]),
      align: 'center',
    });
    addText(s, card.title, {
      x: x + 0.85, y: 2.55, w: cardW - 1.05, h: 0.35,
      fontSize: 20, bold: true, color: PC.indigo,
    });
    addText(s, card.text, {
      x: x + 0.85, y: 3.03, w: cardW - 1.05, h: 0.72,
      fontSize: FONT.body, color: PC.smoke,
    });
  });

  const criteria = arr(slide.successCriteria || (slide.routeContract && slide.routeContract.successCriteria));
  if (criteria.length) {
    addText(s, 'Aan het einde kun je...', {
      x: 0.75, y: 4.48, w: 4.8, h: 0.28,
      fontSize: FONT.label, bold: true, color: PC.smoke,
    });
    renderBullets(s, criteria, { x: 0.9, y: 4.9, w: 10.9, h: 1.15, fontSize: FONT.body });
  }
}

function renderCover(s, slide) {
  const hasVisual = Boolean(slide.visual);
  const leftW = hasVisual ? 5.0 : 5.8;
  if (slide.thesis) {
    addText(s, slide.thesis, {
      x: 0.72, y: 2.3, w: leftW, h: 0.75,
      fontFace: FONT_SERIF, fontSize: 21, italic: true,
      color: PC.smoke,
    });
  }
  if (slide.prompt) {
    addText(s, slide.prompt, {
      x: 0.72, y: 3.28, w: leftW, h: 0.55,
      fontSize: FONT.body, bold: true,
      color: PC.indigo,
    });
  }

  if (hasVisual) {
    renderVisual(s, slide.visual, { x: 6.1, y: 2.15, w: 6.55, h: 3.95 });
    return;
  }

  const metrics = [slide.tension && slide.tension.available, slide.tension && slide.tension.wanted, slide.tension && slide.tension.gap].filter(Boolean);
  metrics.forEach((metric, index) => {
    const y = 2.25 + index * 1.15;
    addText(s, metric.label.toUpperCase(), {
      x: 7.3, y, w: 3.7, h: 0.25,
      fontSize: FONT.label, bold: true, color: PC.smoke,
    });
    addText(s, metric.value, {
      x: 7.28, y: y + 0.28, w: 3.8, h: 0.52,
      fontFace: FONT_DISPLAY, fontSize: FONT.metric, bold: true,
      color: index === metrics.length - 1 ? PC.coralDeep : PC.indigo,
    });
  });

  arr(slide.paths).forEach((item, index) => {
    const y = 5.45 + index * 0.45;
    s.addShape('line', { x: 0.78, y: y + 0.18, w: 5.25, h: 0, line: { color: colorFor(index ? 'amber' : 'teal'), width: 2 } });
    addText(s, item.label.toUpperCase(), { x: 0.82, y, w: 1.6, h: 0.22, fontSize: FONT.label, bold: true, color: colorFor(index ? 'amber' : 'teal') });
    addText(s, item.text, { x: 2.45, y, w: 3.6, h: 0.25, fontSize: FONT.label, color: PC.smoke });
  });
}

function renderNarrativeAnchor(s, slide) {
  const metrics = [slide.tension && slide.tension.available, slide.tension && slide.tension.wanted, slide.tension && slide.tension.gap].filter(Boolean);
  metrics.forEach((metric, index) => {
    const x = 0.75 + index * 3.9;
    addPanel(s, { x, y: 2.2, w: 3.55, h: 1.02, fill: PC.chalk });
    addText(s, metric.label.toUpperCase(), { x: x + 0.18, y: 2.38, w: 3.0, h: 0.2, fontSize: FONT.label, bold: true, color: PC.smoke });
    addText(s, metric.value, { x: x + 0.18, y: 2.64, w: 3.0, h: 0.38, fontFace: FONT_DISPLAY, fontSize: 28, bold: true, color: index === 2 ? PC.coralDeep : PC.indigo });
  });
  const options = arr(slide.options);
  options.forEach((opt, index) => {
    const x = 0.82 + index * 5.95;
    addPanel(s, { x, y: 3.65, w: 5.35, h: 1.75, fill: PC.chalk, line: colorFor(opt.accent) });
    addText(s, `OPTIE ${opt.key || index + 1}`, { x: x + 0.22, y: 3.88, w: 2, h: 0.22, fontSize: FONT.label, bold: true, color: colorFor(opt.accent) });
    addText(s, opt.title, { x: x + 0.22, y: 4.18, w: 3.2, h: 0.3, fontSize: 22, bold: true, color: PC.indigo });
    addText(s, opt.price, { x: x + 3.65, y: 3.98, w: 1.25, h: 0.48, fontFace: FONT_DISPLAY, fontSize: 30, bold: true, color: colorFor(opt.accent) });
    addText(s, opt.benefit, { x: x + 0.22, y: 4.76, w: 4.75, h: 0.32, fontSize: FONT.body, italic: true, color: PC.smoke });
  });
}

function renderConceptModel(s, slide) {
  const relation = slide.relation || {};
  renderRelationNode(s, relation.left, { x: 0.9, y: 2.65, w: 3.15, h: 1.35 }, 'teal');
  addText(s, relation.operator || '>', {
    x: 4.42, y: 3.04, w: 0.9, h: 0.45,
    fontFace: FONT_DISPLAY, fontSize: 34, bold: true,
    color: PC.indigo, align: 'center',
  });
  renderRelationNode(s, relation.right, { x: 5.65, y: 2.65, w: 3.15, h: 1.35 }, 'amber');
  s.addShape('line', { x: 4.95, y: 4.35, w: 0, h: 0.6, line: { color: PC.cloud, width: 1.5 } });
  addPanel(s, { x: 3.25, y: 5.05, w: 6.95, h: 0.88, fill: PC.goodBg, line: PC.olive });
  addText(s, relation.result || '', { x: 3.45, y: 5.18, w: 3.4, h: 0.36, fontSize: 24, bold: true, color: PC.goodInk });
  if (relation.caution) {
    addText(s, relation.caution, { x: 6.85, y: 5.25, w: 2.8, h: 0.26, fontSize: FONT.body, italic: true, color: PC.coralDeep });
  }
}

function renderRelationNode(s, node = {}, frame, accent) {
  addPanel(s, { ...frame, fill: PC.chalk, line: colorFor(accent) });
  addText(s, txt(node.label).toUpperCase(), { x: frame.x + 0.18, y: frame.y + 0.25, w: frame.w - 0.36, h: 0.22, fontSize: FONT.label, bold: true, color: colorFor(accent) });
  addText(s, node.value || '', { x: frame.x + 0.18, y: frame.y + 0.62, w: frame.w - 0.36, h: 0.38, fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: PC.indigo });
}

function renderTransferCards(s, slide) {
  arr(slide.transferCards).forEach((card, index) => {
    const x = 0.72 + index * 4.15;
    addPanel(s, { x, y: 2.3, w: 3.65, h: 3.15, fill: PC.chalk, line: colorFor(['teal', 'amber', 'coral'][index]) });
    addText(s, card.title, { x: x + 0.22, y: 2.58, w: 3.1, h: 0.34, fontSize: 23, bold: true, color: PC.indigo });
    renderDefinition(s, 'Wie kiest?', card.chooser, x + 0.22, 3.18, 3.1);
    renderDefinition(s, 'Beperkt middel', card.limited, x + 0.22, 3.88, 3.1);
    renderDefinition(s, 'Alternatieven', card.alternatives, x + 0.22, 4.68, 3.1);
  });
}

function renderMisconceptionCards(s, slide) {
  arr(slide.misconceptions).forEach((card, index) => {
    const x = 0.86 + index * 6.1;
    addPanel(s, { x, y: 2.45, w: 5.35, h: 2.75, fill: index ? PC.goodBg : PC.badBg, line: index ? PC.olive : PC.coralDeep });
    addText(s, card.title, { x: x + 0.25, y: 2.75, w: 1.8, h: 0.24, fontSize: FONT.label, bold: true, color: index ? PC.goodInk : PC.badInk });
    addText(s, card.wrong, { x: x + 0.25, y: 3.18, w: 4.75, h: 0.62, fontSize: 24, bold: true, color: PC.indigo });
    addText(s, card.fix, { x: x + 0.25, y: 4.12, w: 4.8, h: 0.62, fontSize: FONT.body, color: PC.smoke });
  });
  addText(s, 'Controlevraag: wat is gekozen en wat is het beste niet-gekozen alternatief?', {
    x: 1.05, y: 5.82, w: 10.6, h: 0.3,
    fontSize: FONT.body, bold: true, color: PC.indigo,
  });
}

function renderProcedureRoute(s, slide) {
  const hasVisual = Boolean(slide.visual);
  const routeFrame = hasVisual
    ? { x: 6.8, y: 2.18, w: 5.55, h: 3.8 }
    : { x: 0.82, y: 2.35, w: 11.7, h: 2.9 };
  if (hasVisual) renderVisual(s, slide.visual, { x: 0.75, y: 2.18, w: 5.72, h: 3.95 });

  const steps = arr(slide.steps);
  if (hasVisual) {
    steps.forEach((step, index) => {
      const y = routeFrame.y + index * 0.86;
      addStepRow(s, step, routeFrame.x, y, routeFrame.w);
    });
  } else {
    steps.forEach((step, index) => {
      const x = routeFrame.x + index * 2.9;
      addStepCard(s, step, x, routeFrame.y, 2.55, 2.15);
    });
  }

  if (slide.example) {
    addText(s, slide.example, {
      x: hasVisual ? 6.9 : 1.0, y: hasVisual ? 5.72 : 6.02, w: hasVisual ? 5.25 : 10.8, h: hasVisual ? 0.62 : 0.28,
      fontSize: FONT.body, bold: true, color: PC.indigo,
    });
  }
}

function addStepRow(s, step, x, y, w) {
  const c = colorFor(step.accent);
  s.addShape('ellipse', { x, y: y + 0.03, w: 0.62, h: 0.62, fill: { color: PC.paperMid }, line: { color: c, width: 1.5 } });
  addText(s, step.number, { x: x + 0.07, y: y + 0.2, w: 0.48, h: 0.22, fontFace: FONT_DISPLAY, fontSize: FONT.label, bold: true, color: c, align: 'center' });
  addText(s, step.title, { x: x + 0.78, y, w: w - 0.9, h: 0.25, fontSize: FONT.body, bold: true, color: PC.indigo });
  addText(s, step.prompt, { x: x + 0.78, y: y + 0.33, w: w - 0.9, h: 0.34, fontSize: FONT.body, color: PC.smoke });
}

function addStepCard(s, step, x, y, w, h) {
  const c = colorFor(step.accent);
  addPanel(s, { x, y, w, h, fill: PC.chalk, line: c });
  addText(s, step.number, { x: x + 0.18, y: y + 0.2, w: 0.7, h: 0.32, fontFace: FONT_DISPLAY, fontSize: FONT.stepNumber, bold: true, color: c });
  addText(s, step.title, { x: x + 0.18, y: y + 0.72, w: w - 0.36, h: 0.36, fontSize: 20, bold: true, color: PC.indigo });
  addText(s, step.prompt, { x: x + 0.18, y: y + 1.22, w: w - 0.36, h: 0.55, fontSize: FONT.body, color: PC.smoke });
}

function renderWorkedCalculation(s, slide) {
  if (slide.table) renderTableVisual(s, { ...slide.table, title: 'Opbrengst per alternatief' }, { x: 0.85, y: 2.32, w: 5.65, h: 3.28 });
  arr(slide.formulaCards).forEach((card, index) => {
    const y = 2.55 + index * 1.25;
    addPanel(s, { x: 7.05, y, w: 5.15, h: 0.9, fill: PC.chalk, line: index ? PC.amberInk : PC.tealDeep });
    addText(s, card.title, { x: 7.28, y: y + 0.18, w: 1.3, h: 0.24, fontSize: FONT.label, bold: true, color: index ? PC.amberInk : PC.tealDeep });
    addText(s, card.formula, { x: 8.72, y: y + 0.16, w: 3.1, h: 0.32, fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.indigo });
  });
}

function renderWorkedInterpretation(s, slide) {
  const eq = slide.equation || {};
  addPanel(s, { x: 1.0, y: 2.35, w: 11.25, h: 1.05, fill: PC.goodBg, line: PC.olive });
  addText(s, `${eq.chosen || ''} - ${eq.minus || ''} = ${eq.result || ''}`, {
    x: 1.35, y: 2.62, w: 6.15, h: 0.42,
    fontFace: FONT_DISPLAY, fontSize: 30, bold: true,
    color: PC.goodInk,
  });
  addText(s, eq.label || '', {
    x: 7.55, y: 2.74, w: 3.95, h: 0.28,
    fontSize: FONT.body, italic: true,
    color: PC.smoke,
  });
  arr(slide.interpretationCards).forEach((card, index) => {
    const x = 0.92 + index * 4.08;
    addPanel(s, { x, y: 4.15, w: 3.6, h: 1.45, fill: PC.chalk, line: colorFor(['teal', 'amber', 'coral'][index]) });
    addText(s, card.title, { x: x + 0.2, y: 4.38, w: 3.0, h: 0.28, fontSize: 20, bold: true, color: PC.indigo });
    addText(s, card.text, { x: x + 0.2, y: 4.85, w: 3.05, h: 0.45, fontSize: FONT.body, color: PC.smoke });
  });
}

function renderRetrievalCheck(s, slide) {
  const checks = arr(slide.checks);
  checks.forEach((check, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 0.85 + col * 5.95;
    const y = 2.22 + row * 2.02;
    addPanel(s, { x, y, w: 5.35, h: 1.62, fill: PC.chalk, line: colorFor(['teal', 'amber', 'coral', 'green'][index]) });
    addText(s, String(index + 1).padStart(2, '0'), { x: x + 0.2, y: y + 0.2, w: 0.55, h: 0.25, fontSize: FONT.label, bold: true, color: colorFor(['teal', 'amber', 'coral', 'green'][index]) });
    addText(s, truncate(check.prompt, 86), { x: x + 0.88, y: y + 0.18, w: 4.1, h: 0.45, fontSize: 18, bold: true, color: PC.indigo });
    addText(s, truncate(check.answer || check.hint, 94), { x: x + 0.88, y: y + 0.84, w: 4.15, h: 0.42, fontSize: FONT.body, color: PC.smoke });
  });
}

function renderSummaryBridge(s, slide) {
  const items = arr(slide.studentExplanation);
  items.forEach((item, index) => {
    const y = 2.18 + index * 0.78;
    s.addShape('ellipse', { x: 0.95, y, w: 0.45, h: 0.45, fill: { color: colorFor(['teal', 'amber', 'coral', 'green'][index]) }, line: { color: colorFor(['teal', 'amber', 'coral', 'green'][index]) } });
    addText(s, String(index + 1), { x: 1.06, y: y + 0.11, w: 0.24, h: 0.18, fontSize: FONT.label, bold: true, color: PC.chalk, align: 'center' });
    addText(s, item, { x: 1.65, y: y + 0.02, w: 10.3, h: 0.44, fontSize: FONT.body, color: PC.ink });
  });
}

function renderDefinition(s, label, value, x, y, w) {
  addText(s, label, { x, y, w, h: 0.22, fontSize: FONT.label, bold: true, color: PC.smoke });
  addText(s, value, { x, y: y + 0.28, w, h: 0.32, fontSize: FONT.body, color: PC.ink });
}

function renderBullets(s, items, frame) {
  addText(s, items.map((item) => `- ${item}`).join('\n'), {
    x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    fontSize: frame.fontSize || FONT.body,
    color: PC.ink,
    breakLine: true,
  });
}

function renderVisual(s, visual, frame) {
  if (!visual) return;
  if (visual.type === 'combo') {
    const items = arr(visual.items);
    if (items.length === 2) {
      renderVisual(s, items[0], { x: frame.x, y: frame.y, w: frame.w * 0.42, h: frame.h });
      renderVisual(s, items[1], { x: frame.x + frame.w * 0.45, y: frame.y, w: frame.w * 0.55, h: frame.h });
      return;
    }
  }
  if (visual.type === 'table') return renderTableVisual(s, visual, frame);
  if (visual.type === 'pqGraph') return renderPqGraph(s, visual, frame);
  if (visual.type === 'axisComparison') return renderAxisComparison(s, visual, frame);
}

function renderTableVisual(s, visual, frame) {
  const compact = frame.w < 4.2;
  addPanel(s, { ...frame, fill: PC.chalk, line: PC.cloud });
  addText(s, visual.title || '', { x: frame.x + 0.16, y: frame.y + 0.15, w: frame.w - 0.32, h: 0.25, fontSize: FONT.label, bold: true, color: PC.indigo });
  const headers = arr(visual.headers);
  const rows = arr(visual.rows);
  const tableX = frame.x + 0.15;
  const tableY = frame.y + 0.55;
  const colW = (frame.w - 0.3) / Math.max(headers.length, 1);
  const rowH = Math.min(0.42, (frame.h - 0.88) / Math.max(rows.length + 1, 1));

  headers.forEach((header, col) => {
    const label = compact ? String(header).replace(/Aantal verkocht/g, 'Aantal') : header;
    s.addShape('rect', { x: tableX + col * colW, y: tableY, w: colW, h: rowH, fill: { color: PC.paperMid }, line: { color: PC.cloud, width: 0.7 } });
    addText(s, label, { x: tableX + col * colW + 0.05, y: tableY + 0.08, w: colW - 0.1, h: 0.18, fontSize: FONT.label, bold: true, color: PC.indigo, align: 'center' });
  });
  rows.forEach((row, r) => {
    arr(row).forEach((cell, c) => {
      const data = typeof cell === 'object' ? cell : { text: cell };
      const y = tableY + (r + 1) * rowH;
      s.addShape('rect', { x: tableX + c * colW, y, w: colW, h: rowH, fill: { color: data.highlight ? PC.warnBg : PC.chalk }, line: { color: PC.cloud, width: 0.7 } });
      addText(s, data.text, { x: tableX + c * colW + 0.05, y: y + 0.08, w: colW - 0.1, h: 0.18, fontSize: FONT.label, color: data.highlight ? PC.warnInk : PC.ink, bold: Boolean(data.highlight), align: 'center' });
    });
  });
  if (visual.caption && !compact) addText(s, visual.caption, { x: frame.x + 0.16, y: frame.y + frame.h - 0.25, w: frame.w - 0.32, h: 0.18, fontSize: FONT.label, italic: true, color: PC.smoke });
}

function renderPqGraph(s, visual, frame) {
  const compact = frame.w < 4.2;
  addPanel(s, { ...frame, fill: PC.chalk, line: PC.cloud });
  addText(s, visual.title || '', { x: frame.x + 0.15, y: frame.y + 0.12, w: frame.w - 0.3, h: 0.22, fontSize: FONT.label, bold: true, color: PC.indigo });

  const graph = {
    x: frame.x + 0.1,
    y: frame.y + 0.42,
    w: frame.w - 0.2,
    h: frame.h - 0.78,
  };
  const plot = visual.plot || { width: 420, height: 250, left: 58, right: 374, top: 34, bottom: 206 };
  const sx = (px) => graph.x + (px / plot.width) * graph.w;
  const sy = (py) => graph.y + (py / plot.height) * graph.h;

  const xAxis = visual.axes && visual.axes.x ? visual.axes.x : {};
  const yAxis = visual.axes && visual.axes.y ? visual.axes.y : {};
  arr(yAxis.ticks).forEach((tick) => {
    s.addShape('line', { x: sx(plot.left), y: sy(tick.y), w: sx(plot.right) - sx(plot.left), h: 0, line: { color: PC.paperMid, width: 0.5 } });
    addText(s, tick.label ?? tick.value, { x: sx(plot.left) - 0.72, y: sy(tick.y) - 0.09, w: 0.62, h: 0.18, fontSize: FONT.label, color: PC.smoke, align: 'right' });
  });
  arr(xAxis.ticks).forEach((tick) => {
    s.addShape('line', { x: sx(tick.x), y: sy(plot.top), w: 0, h: sy(plot.bottom) - sy(plot.top), line: { color: PC.paperMid, width: 0.5 } });
    addText(s, tick.label ?? tick.value, { x: sx(tick.x) - 0.28, y: sy(plot.bottom) + 0.08, w: 0.56, h: 0.18, fontSize: FONT.label, color: PC.smoke, align: 'center' });
  });

  s.addShape('line', { x: sx(plot.left), y: sy(plot.bottom), w: sx(plot.right) - sx(plot.left), h: 0, line: { color: PC.ink, width: 1.2 } });
  s.addShape('line', { x: sx(plot.left), y: sy(plot.bottom), w: 0, h: sy(plot.top) - sy(plot.bottom), line: { color: PC.ink, width: 1.2 } });
  addText(s, xAxis.shortLabel || 'Q', { x: sx(plot.right) - 0.1, y: sy(plot.bottom) + 0.35, w: 0.3, h: 0.18, fontSize: FONT.label, bold: true, color: PC.ink });
  addText(s, yAxis.shortLabel || 'P', { x: sx(plot.left) - 0.48, y: sy(plot.top) - 0.02, w: 0.3, h: 0.18, fontSize: FONT.label, bold: true, color: PC.ink });
  addText(s, xAxis.label || '', { x: sx(plot.left), y: graph.y + graph.h - 0.05, w: sx(plot.right) - sx(plot.left), h: 0.18, fontSize: FONT.label, color: PC.smoke, align: 'center' });
  addText(s, yAxis.label || '', { x: sx(plot.left) + 0.08, y: sy(plot.top) - 0.32, w: 2.1, h: 0.18, fontSize: FONT.label, color: PC.smoke });

  const points = arr(visual.points);
  const sorted = [...points].sort((a, b) => Number(a.quantity) - Number(b.quantity));
  for (let i = 0; i < sorted.length - 1; i += 1) {
    s.addShape('line', {
      x: sx(sorted[i].x),
      y: sy(sorted[i].y),
      w: sx(sorted[i + 1].x) - sx(sorted[i].x),
      h: sy(sorted[i + 1].y) - sy(sorted[i].y),
      line: { color: PC.tealDeep, width: 2 },
    });
  }
  points.forEach((point) => {
    s.addShape('ellipse', { x: sx(point.x) - 0.045, y: sy(point.y) - 0.045, w: 0.09, h: 0.09, fill: { color: PC.amberInk }, line: { color: PC.chalk, width: 0.5 } });
    if (point.label) addText(s, point.label, { x: sx(point.x) + 0.08, y: sy(point.y) - 0.2, w: 1.0, h: 0.18, fontSize: FONT.label, color: PC.indigo });
  });
  if (visual.lineLabel && !compact) {
    addText(s, visual.lineLabel, { x: sx(plot.right) - 1.45, y: sy(plot.top) - 0.32, w: 1.45, h: 0.18, fontSize: FONT.label, bold: true, color: PC.tealDeep, align: 'right' });
  }
  if (visual.guides) {
    const guide = visual.guides;
    s.addShape('line', { x: sx(guide.x), y: sy(guide.y), w: 0, h: sy(plot.bottom) - sy(guide.y), line: { color: PC.coralDeep, width: 1.2, dash: 'dash' } });
    s.addShape('line', { x: sx(plot.left), y: sy(guide.y), w: sx(guide.x) - sx(plot.left), h: 0, line: { color: PC.coralDeep, width: 1.2, dash: 'dash' } });
    s.addShape('ellipse', { x: sx(guide.x) - 0.05, y: sy(guide.y) - 0.05, w: 0.1, h: 0.1, fill: { color: PC.coralDeep }, line: { color: PC.chalk, width: 0.4 } });
    addText(s, guide.xLabel, { x: sx(guide.x) + 0.1, y: sy(plot.bottom) - 0.35, w: 1.55, h: 0.18, fontSize: FONT.label, color: PC.coralDeep });
    addText(s, guide.yLabel, { x: sx(plot.left) + 0.1, y: sy(guide.y) - 0.28, w: 0.8, h: 0.18, fontSize: FONT.label, color: PC.coralDeep });
  }
  if (visual.caption && !compact) addText(s, visual.caption, { x: frame.x + 0.16, y: frame.y + frame.h - 0.25, w: frame.w - 0.32, h: 0.18, fontSize: FONT.label, italic: true, color: PC.smoke });
}

function renderAxisComparison(s, visual, frame) {
  addPanel(s, { ...frame, fill: PC.chalk, line: PC.cloud });
  addText(s, visual.title || '', { x: frame.x + 0.15, y: frame.y + 0.13, w: frame.w - 0.3, h: 0.22, fontSize: FONT.label, bold: true, color: PC.indigo });
  arr(visual.panels).forEach((panel, index) => {
    const x = frame.x + 0.25 + index * ((frame.w - 0.55) / 2);
    const w = (frame.w - 0.75) / 2;
    addText(s, panel.title, { x, y: frame.y + 0.52, w, h: 0.22, fontSize: FONT.label, bold: true, color: PC.smoke, align: 'center' });
    arr(panel.values).forEach((value, i) => {
      const barH = (Number(value.height) / 100) * (frame.h - 1.45);
      const bx = x + 0.35 + i * 0.95;
      const by = frame.y + frame.h - 0.52 - barH;
      s.addShape('rect', { x: bx, y: by, w: 0.5, h: barH, fill: { color: i ? PC.amber : PC.teal }, line: { color: i ? PC.amberDeep : PC.tealDeep, width: 0.8 } });
      addText(s, value.label, { x: bx - 0.2, y: frame.y + frame.h - 0.42, w: 0.9, h: 0.18, fontSize: FONT.label, color: PC.smoke, align: 'center' });
      addText(s, value.value, { x: bx - 0.15, y: by - 0.22, w: 0.8, h: 0.18, fontSize: FONT.label, bold: true, color: PC.indigo, align: 'center' });
    });
  });
  if (visual.caption) addText(s, visual.caption, { x: frame.x + 0.16, y: frame.y + frame.h - 0.25, w: frame.w - 0.32, h: 0.18, fontSize: FONT.label, italic: true, color: PC.smoke });
}

function notesText(slide, deck, index) {
  const notes = slide.speakerNotes || {};
  const student = arr(notes.studentExplanation).length ? arr(notes.studentExplanation) : (arr(notes.student).length ? arr(notes.student) : arr(notes.script));
  const misconception = arr(notes.misconceptionWatch).length ? arr(notes.misconceptionWatch) : arr(notes.misconception);
  const cue = arr(notes.teacherCue);
  const lines = [
    `${deck.paragraph.number} ${deck.paragraph.title}`,
    `Dia ${index + 1}: ${slide.studentTitle || slide.title || slide.navTitle}`,
    `Rol: ${slide.role}`,
    `Layout: ${slide.layout}`,
    '',
    'Kernzin:',
    slide.assertion || '',
    '',
    'Studentuitleg:',
    ...student.map((item) => `- ${item}`),
  ];
  if (misconception.length) lines.push('', 'Misconceptie-watch:', ...misconception.map((item) => `- ${item}`));
  if (cue.length) lines.push('', 'Docentcue:', ...cue.map((item) => `- ${item}`));
  if (notes.transition) lines.push('', 'Overgang:', notes.transition);
  if (notes.visual) lines.push('', 'Visual:', notes.visual);
  if (slide.action) lines.push('', 'Actie op de dia:', slide.action);
  return lines.filter((line) => line !== undefined && line !== null).join('\n');
}

module.exports = { writeDeckPptx };
