const fs = require('fs');
const path = require('path');

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderDeckHtml(deck, { cssHref = '../../shared/presentation-v2.css', jsHref = '../../shared/presentation-v2.js', pptxHref = '', backHref = '../index.html' } = {}) {
  const slides = deck.slides.map((slide, index) => renderSlide(slide, index + 1, deck.slides.length)).join('\n');
  const nav = deck.slides.map((slide, index) => {
    const n = String(index + 1).padStart(2, '0');
    return `<a class="pv2-nav-link" href="#${esc(slide.id)}" data-pv2-link="${index + 1}"><span>${n}</span>${esc(slide.navTitle)}</a>`;
  }).join('\n');
  const titleLabel = deck.titleLabel || 'Presentatie v2 prototype';
  const sideLabel = deck.sideLabel || 'prototype v2';
  const pptxLink = pptxHref
    ? `<a class="pv2-action pv2-action-primary" href="${esc(pptxHref)}" download>Download PowerPoint</a>`
    : '';

  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(deck.paragraph.number)} ${esc(deck.paragraph.title)} — ${esc(titleLabel)}</title>
  <script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
  <link rel="stylesheet" href="${esc(cssHref)}">
</head>
<body data-layout="presentation-v2">
  <a class="pv2-skip" href="#pv2-stage">Naar dia</a>
  <div class="pv2-shell" data-pv2>
    <aside class="pv2-sidebar" aria-label="Dia's">
      <div class="pv2-sidebar-head">
        <p>${esc(deck.paragraph.number)}</p>
        <h1>${esc(deck.paragraph.title)}</h1>
        <span>${esc(sideLabel)}</span>
      </div>
      <nav class="pv2-nav">${nav}</nav>
    </aside>
    <main class="pv2-main">
      <header class="pv2-topbar">
        <a class="pv2-back" href="${esc(backHref)}">Terug naar overzicht</a>
        <div class="pv2-actions">
          ${pptxLink}
          <button type="button" class="pv2-action" data-pv2-notes aria-pressed="false" aria-expanded="false">Speaker notes</button>
          <button type="button" class="pv2-action" data-pv2-theme aria-pressed="false">Dark mode</button>
          <button type="button" class="pv2-action" data-pv2-fullscreen aria-pressed="false">Full screen</button>
        </div>
      </header>
      <section id="pv2-stage" class="pv2-stage" aria-label="Presentatie">
${slides}
      </section>
      <footer class="pv2-controls" aria-label="Dia-navigatie">
        <button type="button" data-pv2-prev>Vorige</button>
        <span><strong data-pv2-current>1</strong> / ${deck.slides.length}</span>
        <button type="button" data-pv2-next>Volgende</button>
      </footer>
    </main>
  </div>
  <script src="${esc(jsHref)}"></script>
</body>
</html>`;
}

function renderSlide(slide, number, total) {
  const classes = `pv2-slide pv2-slide-${esc(slide.layout)}`;
  const speakerText = getSpeakerText(slide.speakerNotes);
  return `        <article class="${classes}" id="${esc(slide.id)}" data-pv2-slide="${number}" aria-labelledby="${esc(slide.id)}-title" ${number === 1 ? '' : 'hidden'}>
          <div class="pv2-slide-canvas">
            <div class="pv2-slide-count">${number} / ${total}</div>
            ${renderSlideInner(slide)}
            <div class="pv2-sr-speaker-text" data-pv2-speaker-text>${esc(speakerText)}</div>
          </div>
          ${renderNotes(slide.speakerNotes)}
        </article>`;
}

function renderSlideInner(slide) {
  if (slide.layout === 'choiceTensionCover') return renderCover(slide);
  if (slide.layout === 'choiceComparison') return renderChoiceComparison(slide);
  if (slide.layout === 'procedureRoute') return renderProcedureRoute(slide);
  throw new Error(`Unknown presentation-v2 layout: ${slide.layout}`);
}

function renderCover(slide) {
  return `<div class="pv2-cover-grid">
            <div class="pv2-cover-copy">
              <p class="pv2-eyebrow">${esc(slide.eyebrow)}</p>
              <h2 id="${esc(slide.id)}-title">${esc(slide.studentTitle)}</h2>
              <p class="pv2-thesis">${esc(slide.thesis)}</p>
              <p class="pv2-prompt">${esc(slide.prompt)}</p>
            </div>
            <div class="pv2-tension" aria-label="Budgetspanning">
              ${renderTensionMetric(slide.tension.available)}
              ${renderTensionMetric(slide.tension.wanted)}
              ${renderTensionMetric(slide.tension.gap)}
            </div>
          </div>
          <div class="pv2-path-strip" aria-label="Keuzepaden">
            ${slide.paths.map((p, i) => `<div class="pv2-path pv2-path-${i + 1}"><span>${esc(p.label)}</span><strong>${esc(p.text)}</strong></div>`).join('')}
          </div>`;
}

function renderTensionMetric(metric) {
  return `<div class="pv2-metric"><span>${esc(metric.label)}</span><strong>${esc(metric.value)}</strong></div>`;
}

function renderChoiceComparison(slide) {
  return `<div class="pv2-slide-head">
            <p class="pv2-eyebrow">${esc(slide.eyebrow)}</p>
            <h2 id="${esc(slide.id)}-title">${esc(slide.studentTitle)}</h2>
            <p>${esc(slide.lead)}</p>
          </div>
          <ul class="pv2-goals" aria-label="Leerdoelen">
            ${slide.goals.map(goal => `<li>${esc(goal)}</li>`).join('')}
          </ul>
          <div class="pv2-choice-lanes" role="list" aria-label="Keuzeopties">
            ${slide.options.map(opt => renderOption(opt)).join('')}
          </div>
          <p class="pv2-conclusion">${esc(slide.conclusion)}</p>`;
}

function renderOption(opt) {
  return `<section class="pv2-option pv2-accent-${esc(opt.accent)}" role="listitem" aria-label="Optie ${esc(opt.key)}: ${esc(opt.title)}">
            <span>Optie ${esc(opt.key)}</span>
            <h3>${esc(opt.title)}</h3>
            <strong>${esc(opt.price)}</strong>
            <p>${esc(opt.benefit)}</p>
          </section>`;
}

function renderProcedureRoute(slide) {
  return `<div class="pv2-slide-head">
            <p class="pv2-eyebrow">${esc(slide.eyebrow)}</p>
            <h2 id="${esc(slide.id)}-title">${esc(slide.studentTitle)}</h2>
            <p>${esc(slide.lead)}</p>
          </div>
          <ol class="pv2-route" aria-label="Alternatieve kosten in een keuze-situatie in vier stappen">
            ${slide.steps.map(step => renderStep(step)).join('')}
          </ol>
          <p class="pv2-example">${esc(slide.example)}</p>`;
}

function renderStep(step) {
  return `<li class="pv2-step pv2-accent-${esc(step.accent)}">
            <span>${esc(step.number)}</span>
            <strong>${esc(step.title)}</strong>
            <em>${esc(step.prompt)}</em>
          </li>`;
}

function renderNotes(notes) {
  const paragraphs = Array.isArray(notes?.script)
    ? notes.script
    : [notes?.script || ''];
  const body = paragraphs
    .filter(Boolean)
    .map((paragraph) => `<p>${esc(paragraph)}</p>`)
    .join('');
  return `<details class="pv2-notes"><summary>Speaker notes</summary><div class="pv2-speaker-script">${body}</div></details>`;
}

function getSpeakerText(notes) {
  if (!notes) return '';
  if (Array.isArray(notes.script)) return notes.script.join('\n\n');
  return notes.script || '';
}

function writeDeckHtml(deck, outPath, opts = {}) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, renderDeckHtml(deck, opts), 'utf8');
}

module.exports = { renderDeckHtml, writeDeckHtml };
