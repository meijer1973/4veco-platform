const fs = require('fs');
const path = require('path');

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function arr(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value) return [value];
  return [];
}

function renderDeckHtml(deck, { cssHref = '../../shared/presentation-v2.css', jsHref = '../../shared/presentation-v2.js', pptxHref = '', backHref = '../index.html' } = {}) {
  const slides = deck.slides.map((slide, index) => renderSlide(slide, index + 1, deck.slides.length, deck)).join('\n');
  const nav = deck.slides.map((slide, index) => {
    const n = String(index + 1).padStart(2, '0');
    return `<a class="pv2-nav-link" href="#${esc(slide.id)}" data-pv2-link="${index + 1}"><span>${n}</span>${esc(slide.navTitle || slide.title || slide.studentTitle)}</a>`;
  }).join('\n');
  const titleLabel = deck.titleLabel || 'Webpresentatie';
  const sideLabel = deck.sideLabel || 'webpresentatie';
  const notesLabel = deck.notesLabel || 'Studentgerichte uitleg';
  const pptxLink = pptxHref
    ? `          <a class="pv2-action pv2-action-primary" href="${esc(pptxHref)}" download>Download PowerPoint</a>\n`
    : '';
  const sourceAttrs = deck.sourceSnapshot
    ? ` data-source-sha256="${esc(deck.sourceSnapshot.sha256)}" data-source-package="${esc(deck.sourceSnapshot.package)}" data-accepted-on="${esc(deck.sourceSnapshot.acceptedOn)}"`
    : '';
  const sourceMeta = deck.sourceSnapshot
    ? `  <meta name="presentation-source-sha256" content="${esc(deck.sourceSnapshot.sha256)}">\n`
    : '';

  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(deck.paragraph.number)} ${esc(deck.paragraph.title)} — ${esc(titleLabel)}</title>
${sourceMeta}  <script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
  <link rel="stylesheet" href="${esc(cssHref)}">
</head>
<body data-layout="presentation-v2">
  <a class="pv2-skip" href="#pv2-stage">Naar dia</a>
  <div class="pv2-shell" data-pv2 data-deck-version="${esc(deck.version)}" data-exemplar-id="${esc(deck.exemplarId || '')}"${sourceAttrs}>
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
${pptxLink}          <button type="button" class="pv2-action" data-pv2-notes aria-pressed="false" aria-expanded="false" data-open-label="${esc(notesLabel)}" data-close-label="Verberg uitleg">${esc(notesLabel)}</button>
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

function renderSlide(slide, number, total, deck) {
  const classes = `pv2-slide pv2-slide-${esc(slide.layout)} pv2-role-${esc(slide.role || 'generic')}`;
  const speakerText = getSpeakerText(slide.speakerNotes);
  return `        <article class="${classes}" id="${esc(slide.id)}" data-pv2-slide="${number}" data-route-role="${esc(slide.role || '')}" aria-labelledby="${esc(slide.id)}-title" ${number === 1 ? '' : 'hidden'}>
          <div class="pv2-slide-canvas">
            <div class="pv2-slide-count">${number} / ${total}</div>
            ${renderSlideInner(slide, deck)}
            <div class="pv2-sr-speaker-text" data-pv2-speaker-text>${esc(speakerText)}</div>
          </div>
          ${renderNotes(slide.speakerNotes, deck)}
        </article>`;
}

function renderSlideInner(slide, deck) {
  if (slide.layout === 'choiceTensionCover') return renderCover(slide);
  if (slide.layout === 'choiceComparison') return renderChoiceComparison(slide);
  if (slide.layout === 'procedureRoute') return renderProcedureRoute(slide);
  if (slide.layout === 'routeContract') return renderRouteContract(slide);
  if (slide.layout === 'narrativeAnchor') return renderNarrativeAnchor(slide);
  if (slide.layout === 'conceptModel') return renderConceptModel(slide);
  if (slide.layout === 'transferCards') return renderTransferCards(slide);
  if (slide.layout === 'misconceptionCards') return renderMisconceptionCards(slide);
  if (slide.layout === 'workedCalculation') return renderWorkedCalculation(slide);
  if (slide.layout === 'workedInterpretation') return renderWorkedInterpretation(slide);
  if (slide.layout === 'retrievalCheck') return renderRetrievalCheck(slide);
  if (slide.layout === 'summaryBridge') return renderSummaryBridge(slide);
  throw new Error(`Unknown presentation-v2 layout: ${slide.layout}`);
}

function renderSlideHead(slide, { compact = false } = {}) {
  return `<div class="pv2-slide-head${compact ? ' pv2-slide-head-compact' : ''}">
            <p class="pv2-eyebrow">${esc(slide.eyebrow || slide.subtitle || '')}</p>
            <h2 id="${esc(slide.id)}-title" tabindex="-1">${esc(slide.studentTitle || slide.title)}</h2>
            ${slide.assertion ? `<p class="pv2-assertion">${esc(slide.assertion)}</p>` : ''}
            ${slide.action ? `<p class="pv2-slide-action">${esc(slide.action)}</p>` : ''}
          </div>`;
}

function renderRouteContract(slide) {
  return `${renderSlideHead(slide)}
          <div class="pv2-route-contract" role="list" aria-label="Lesroute">
            ${arr(slide.routeCards).map((card) => `<section class="pv2-route-card" role="listitem"><span>${esc(card.label)}</span><h3>${esc(card.title)}</h3><p>${esc(card.text)}</p></section>`).join('')}
          </div>`;
}

function renderNarrativeAnchor(slide) {
  return `${renderSlideHead(slide, { compact: true })}
          <div class="pv2-narrative-grid">
            <div class="pv2-tension pv2-tension-inline" aria-label="Budgetspanning">
              ${renderTensionMetric(slide.tension?.available)}
              ${renderTensionMetric(slide.tension?.wanted)}
              ${renderTensionMetric(slide.tension?.gap)}
            </div>
            <div class="pv2-choice-lanes" role="list" aria-label="Keuzeopties">
              ${arr(slide.options).map(opt => renderOption(opt)).join('')}
            </div>
          </div>`;
}

function renderConceptModel(slide) {
  const relation = slide.relation || {};
  return `${renderSlideHead(slide)}
          <div class="pv2-relation" aria-label="Begripsrelatie">
            ${renderRelationNode(relation.left)}
            <strong class="pv2-relation-operator">${esc(relation.operator || '→')}</strong>
            ${renderRelationNode(relation.right)}
            <div class="pv2-relation-result"><span>dus</span><strong>${esc(relation.result)}</strong>${relation.caution ? `<em>${esc(relation.caution)}</em>` : ''}</div>
          </div>`;
}

function renderRelationNode(node = {}) {
  return `<section class="pv2-relation-node"><span>${esc(node.label)}</span><strong>${esc(node.value)}</strong></section>`;
}

function renderTransferCards(slide) {
  return `${renderSlideHead(slide, { compact: true })}
          <div class="pv2-transfer-grid" role="list" aria-label="Transfercontexten">
            ${arr(slide.transferCards).map(card => `<section class="pv2-transfer-card" role="listitem">
              <h3>${esc(card.title)}</h3>
              <dl>
                <div><dt>Wie kiest?</dt><dd>${esc(card.chooser)}</dd></div>
                <div><dt>Beperkt middel</dt><dd>${esc(card.limited)}</dd></div>
                <div><dt>Alternatieven</dt><dd>${esc(card.alternatives)}</dd></div>
              </dl>
            </section>`).join('')}
          </div>`;
}

function renderMisconceptionCards(slide) {
  return `${renderSlideHead(slide, { compact: true })}
          <div class="pv2-misconception-grid" role="list" aria-label="Misconcepties">
            ${arr(slide.misconceptions).map(card => `<section class="pv2-misconception-card" role="listitem">
              <span>${esc(card.title)}</span>
              <h3>${esc(card.wrong)}</h3>
              <p>${esc(card.fix)}</p>
            </section>`).join('')}
          </div>
          <p class="pv2-control-question">Controlevraag: wat is gekozen en wat is het beste niet-gekozen alternatief?</p>`;
}

function renderWorkedCalculation(slide) {
  const table = slide.table || {};
  return `${renderSlideHead(slide, { compact: true })}
          <div class="pv2-worked-grid">
            <figure class="pv2-visual-panel pv2-worked-table">
              <figcaption>Opbrengst per alternatief</figcaption>
              <table class="pv2-data-table">
                <thead><tr>${arr(table.headers).map(header => `<th>${esc(header)}</th>`).join('')}</tr></thead>
                <tbody>${arr(table.rows).map(row => `<tr>${arr(row).map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
              </table>
            </figure>
            <div class="pv2-formula-stack" role="list" aria-label="Berekeningen">
              ${arr(slide.formulaCards).map(card => `<section class="pv2-formula-card" role="listitem"><span>${esc(card.title)}</span><strong>${esc(card.formula)}</strong></section>`).join('')}
            </div>
          </div>`;
}

function renderWorkedInterpretation(slide) {
  const eq = slide.equation || {};
  return `${renderSlideHead(slide, { compact: true })}
          <div class="pv2-equation" aria-label="${esc(eq.label || 'Nettowaarde')}">
            <strong>${esc(eq.chosen)}</strong><span>−</span><strong>${esc(eq.minus)}</strong><span>=</span><strong>${esc(eq.result)}</strong>
            <em>${esc(eq.label)}</em>
          </div>
          <div class="pv2-interpretation-grid" role="list" aria-label="Interpretatie">
            ${arr(slide.interpretationCards).map(card => `<section class="pv2-interpretation-card" role="listitem"><h3>${esc(card.title)}</h3><p>${esc(card.text)}</p></section>`).join('')}
          </div>`;
}

function renderRetrievalCheck(slide) {
  return `${renderSlideHead(slide, { compact: true })}
          <div class="pv2-check-grid" role="list" aria-label="Actieve checks">
            ${arr(slide.checks).map((check, index) => `<details class="pv2-check-card" role="listitem">
              <summary><span>${String(index + 1).padStart(2, '0')}</span>${esc(check.prompt)}</summary>
              <p class="pv2-hint">${esc(check.hint)}</p>
              <p class="pv2-answer">${esc(check.answer)}</p>
            </details>`).join('')}
          </div>`;
}

function renderSummaryBridge(slide) {
  return `${renderSlideHead(slide, { compact: true })}
          <ol class="pv2-summary-list" aria-label="Kernzinnen">
            ${arr(slide.studentExplanation).map(sentence => `<li>${esc(sentence)}</li>`).join('')}
          </ol>`;
}

function renderCover(slide) {
  const visual = renderVisual(slide.visual);
  if (visual) {
    return `<div class="pv2-cover-grid pv2-cover-grid-visual">
              <div class="pv2-cover-copy">
                <p class="pv2-eyebrow">${esc(slide.eyebrow)}</p>
                <h2 id="${esc(slide.id)}-title" tabindex="-1">${esc(slide.studentTitle)}</h2>
                <p class="pv2-thesis">${esc(slide.thesis)}</p>
                <p class="pv2-prompt">${esc(slide.prompt)}</p>
              </div>
              <div class="pv2-cover-visual-stack">
                ${visual}
              </div>
            </div>`;
  }
  const pathStrip = visual ? '' : `<div class="pv2-path-strip" aria-label="Keuzepaden">
            ${arr(slide.paths).map((p, i) => `<div class="pv2-path pv2-path-${i + 1}"><span>${esc(p.label)}</span><strong>${esc(p.text)}</strong></div>`).join('')}
          </div>`;
  return `<div class="pv2-cover-grid">
            <div class="pv2-cover-copy">
              <p class="pv2-eyebrow">${esc(slide.eyebrow)}</p>
              <h2 id="${esc(slide.id)}-title" tabindex="-1">${esc(slide.studentTitle)}</h2>
              <p class="pv2-thesis">${esc(slide.thesis)}</p>
              <p class="pv2-prompt">${esc(slide.prompt)}</p>
            </div>
            <div class="pv2-tension" aria-label="Budgetspanning">
              ${renderTensionMetric(slide.tension?.available)}
              ${renderTensionMetric(slide.tension?.wanted)}
              ${renderTensionMetric(slide.tension?.gap)}
            </div>
          </div>
          ${visual}
          ${pathStrip}`;
}

function renderTensionMetric(metric) {
  if (!metric) return '';
  return `<div class="pv2-metric"><span>${esc(metric.label)}</span><strong>${esc(metric.value)}</strong></div>`;
}

function renderChoiceComparison(slide) {
  return `<div class="pv2-slide-head">
            <p class="pv2-eyebrow">${esc(slide.eyebrow)}</p>
            <h2 id="${esc(slide.id)}-title" tabindex="-1">${esc(slide.studentTitle)}</h2>
            <p>${esc(slide.lead)}</p>
          </div>
          <ul class="pv2-goals" aria-label="Leerdoelen">
            ${arr(slide.goals).map(goal => `<li>${esc(goal)}</li>`).join('')}
          </ul>
          <div class="pv2-choice-lanes" role="list" aria-label="Keuzeopties">
            ${arr(slide.options).map(opt => renderOption(opt)).join('')}
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
  const routeLabel = slide.routeLabel || `${slide.studentTitle || slide.teacherTitle || 'Procedure'} in ${arr(slide.steps).length} stappen`;
  const visual = renderVisual(slide.visual);
  const visualBlock = visual ? `\n            ${visual}` : '';
  return `${renderSlideHead(slide, { compact: true })}
          <div class="pv2-route-with-visual${visual ? '' : ' pv2-route-without-visual'}">${visualBlock}
            <ol class="pv2-route" aria-label="${esc(routeLabel)}">
              ${arr(slide.steps).map(step => renderStep(step)).join('')}
            </ol>
          </div>
          <p class="pv2-example">${esc(slide.example)}</p>`;
}

function renderStep(step) {
  return `<li class="pv2-step pv2-accent-${esc(step.accent)}">
            <span>${esc(step.number)}</span>
            <strong>${esc(step.title)}</strong>
            <em>${esc(step.prompt)}</em>
          </li>`;
}

function renderVisual(visual) {
  if (!visual) return '';
  if (visual.type === 'combo') {
    return `<div class="pv2-visual-combo" data-visual-id="${esc(visual.id)}">
      ${arr(visual.items).map((item) => renderVisual(item)).join('')}
    </div>`;
  }
  if (visual.type === 'table') {
    return `<figure class="pv2-visual-panel" data-visual-id="${esc(visual.id)}">
      <figcaption>${esc(visual.title)}</figcaption>
      <table class="pv2-data-table">
        <thead><tr>${arr(visual.headers).map((header) => `<th>${esc(header)}</th>`).join('')}</tr></thead>
        <tbody>
          ${arr(visual.rows).map((row) => `<tr>${arr(row).map((cell) => `<td class="${cell.highlight ? 'is-highlighted' : ''}">${esc(cell.text ?? cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
      ${visual.caption ? `<p>${esc(visual.caption)}</p>` : ''}
    </figure>`;
  }
  if (visual.type === 'pqGraph') {
    const points = arr(visual.points);
    const plotted = points.map((point) => `${point.x},${point.y}`).join(' ');
    const guideMarkup = visual.guides
      ? `\n        <line class="guide" x1="${esc(visual.guides.x)}" y1="${esc(visual.guides.y)}" x2="${esc(visual.guides.x)}" y2="206"></line><line class="guide" x1="58" y1="${esc(visual.guides.y)}" x2="${esc(visual.guides.x)}" y2="${esc(visual.guides.y)}"></line><text x="${esc(visual.guides.x + 8)}" y="198">${esc(visual.guides.xLabel)}</text><text x="66" y="${esc(visual.guides.y - 8)}">${esc(visual.guides.yLabel)}</text>`
      : '';
    return `<figure class="pv2-visual-panel" data-visual-id="${esc(visual.id)}">
      <figcaption>${esc(visual.title)}</figcaption>
      <svg class="pv2-inline-graph" viewBox="0 0 420 250" role="img" aria-label="${esc(visual.alt || visual.title)}">
        <line x1="58" y1="206" x2="374" y2="206"></line>
        <line x1="58" y1="206" x2="58" y2="34"></line>
        <text x="342" y="232">Q</text>
        <text x="22" y="48">P</text>
        <polyline points="${esc(plotted)}"></polyline>
        ${points.map((point) => `<circle cx="${esc(point.x)}" cy="${esc(point.y)}" r="4"></circle><text x="${esc(point.x + 6)}" y="${esc(point.y - 6)}">${esc(point.label)}</text>`).join('')}${guideMarkup}
      </svg>
      ${visual.caption ? `<p>${esc(visual.caption)}</p>` : ''}
    </figure>`;
  }
  if (visual.type === 'axisComparison') {
    return `<figure class="pv2-visual-panel" data-visual-id="${esc(visual.id)}">
      <figcaption>${esc(visual.title)}</figcaption>
      <div class="pv2-axis-compare">
        ${arr(visual.panels).map((panel) => `<section><strong>${esc(panel.title)}</strong>${arr(panel.values).map((value) => `<div class="pv2-mini-bar"><span>${esc(value.label)}</span><i style="height:${esc(value.height)}%"></i><b>${esc(value.value)}</b></div>`).join('')}</section>`).join('')}
      </div>
      ${visual.caption ? `<p>${esc(visual.caption)}</p>` : ''}
    </figure>`;
  }
  return '';
}

function renderNotes(notes, deck = {}) {
  const label = notes?.label || deck.notesLabel || 'Studentgerichte uitleg';
  const sections = [];
  const student = arr(notes?.student).length ? arr(notes.student) : arr(notes?.script);
  if (student.length) sections.push(renderNoteSection('Studentuitleg', student));
  if (arr(notes?.misconception).length) sections.push(renderNoteList('Let op', notes.misconception));
  if (notes?.teacherCue) sections.push(renderNoteSection('Docentcue', [notes.teacherCue]));
  if (notes?.transition) sections.push(renderNoteSection('Overgang', [notes.transition]));
  if (arr(notes?.data).length) sections.push(renderNoteList('Data', notes.data));
  if (notes?.visual) sections.push(renderNoteSection('Visual', [notes.visual]));
  const body = sections.join('') || '<section><p>Geen aanvullende uitleg.</p></section>';
  return `<details class="pv2-notes"><summary>${esc(label)}</summary><div class="pv2-speaker-script">${body}</div></details>`;
}

function renderNoteSection(title, paragraphs) {
  return `<section><h3>${esc(title)}</h3>${arr(paragraphs).map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>`;
}

function renderNoteList(title, items) {
  return `<section><h3>${esc(title)}</h3><ul>${arr(items).map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>`;
}

function getSpeakerText(notes) {
  if (!notes) return '';
  const parts = [
    ...arr(notes.student),
    ...arr(notes.script),
    ...arr(notes.misconception),
    notes.teacherCue,
    notes.transition,
    ...arr(notes.data),
    notes.visual,
  ].filter(Boolean);
  return parts.join('\n\n');
}

function writeDeckHtml(deck, outPath, opts = {}) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, renderDeckHtml(deck, opts), 'utf8');
}

module.exports = { renderDeckHtml, writeDeckHtml };
