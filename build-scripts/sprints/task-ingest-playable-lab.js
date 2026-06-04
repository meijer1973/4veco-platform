function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function paragraphs(markdown) {
  return String(markdown)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('\n');
}

function graphSvg(block) {
  const points = block.series[0].points;
  const xMin = block.axes.x.min || 0;
  const xMax = block.axes.x.max || Math.max(...points.map((point) => Number(point.x)));
  const yMin = block.axes.y.min || 0;
  const yMax = block.axes.y.max || Math.max(...points.map((point) => Number(point.y)));
  const width = 560;
  const height = 320;
  const padL = 70;
  const padR = 28;
  const padT = 24;
  const padB = 58;
  const sx = (x) => padL + ((Number(x) - xMin) / (xMax - xMin || 1)) * (width - padL - padR);
  const sy = (y) => height - padB - ((Number(y) - yMin) / (yMax - yMin || 1)) * (height - padT - padB);
  const line = points.map((point) => `${sx(point.x).toFixed(1)},${sy(point.y).toFixed(1)}`).join(' ');
  const circles = points
    .map((point) => `<circle cx="${sx(point.x).toFixed(1)}" cy="${sy(point.y).toFixed(1)}" r="4.8"></circle>`)
    .join('');
  return `<svg class="graph-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(block.altText)}">
    <rect width="${width}" height="${height}" rx="8"></rect>
    <line class="axis" x1="${padL}" y1="${height - padB}" x2="${width - padR}" y2="${height - padB}"></line>
    <line class="axis" x1="${padL}" y1="${height - padB}" x2="${padL}" y2="${padT}"></line>
    <polyline class="series" points="${line}"></polyline>
    <g class="points">${circles}</g>
    <text class="axis-label" x="${(width + padL - padR) / 2}" y="${height - 14}">${escapeHtml(block.axes.x.label)}</text>
    <text class="axis-label y-label" transform="translate(18 ${(height - padB + padT) / 2}) rotate(-90)">${escapeHtml(block.axes.y.label)}</text>
  </svg>`;
}

function blockHtml(block) {
  if (block.type === 'markdown') {
    return `<section class="ctx-block ctx-text" data-block-type="markdown"><h2>${escapeHtml(block.title)}</h2>${paragraphs(block.bodyMarkdown)}</section>`;
  }
  if (block.type === 'source_excerpt') {
    return `<section class="ctx-block ctx-card" data-block-type="source_excerpt"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2>${paragraphs(block.bodyMarkdown)}<p class="source-ref">Bronbestand: ${escapeHtml(block.sourceRefs.join(', '))}</p></section>`;
  }
  if (block.type === 'table') {
    const headers = block.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('');
    const rows = block.rows
      .map((row) => `<tr>${row.map((cell, index) => `<${index === 0 ? 'th scope="row"' : 'td'}>${escapeHtml(cell)}</${index === 0 ? 'th' : 'td'}>`).join('')}</tr>`)
      .join('');
    return `<section class="ctx-block ctx-table" data-block-type="table" aria-label="${escapeHtml(block.altText)}"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><div class="table-scroll"><table><caption>${escapeHtml(block.caption)}</caption><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }
  if (block.type === 'graph') {
    return `<section class="ctx-block ctx-graph" data-block-type="graph"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2>${graphSvg(block)}</section>`;
  }
  if (block.type === 'formula') {
    const vars = block.variables.map((item) => `<div><dt>${escapeHtml(item.symbol)}</dt><dd>${escapeHtml(item.meaning)}</dd></div>`).join('');
    return `<section class="ctx-block ctx-formula" data-block-type="formula" aria-label="${escapeHtml(block.altText)}"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><div class="formula-scroll"><pre><code>${escapeHtml(block.expression)}</code></pre></div><dl>${vars}</dl></section>`;
  }
  if (block.type === 'flowchart') {
    const nodes = block.nodes.map((node) => `<li>${escapeHtml(node.label)}</li>`).join('');
    return `<section class="ctx-block ctx-flow" data-block-type="flowchart" aria-label="${escapeHtml(block.altText)}"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><ol class="flow-list">${nodes}</ol></section>`;
  }
  return '';
}

function operationLabel(operationId) {
  return String(operationId || '').replace(/_/g, ' ');
}

function controlHtml(task, index) {
  if (task.family === 'calculation_work_capture') {
    return `<label>Uitwerking<textarea class="play-control" rows="3"></textarea></label><div class="control-row"><label>Antwoord<input class="play-control" type="text"></label><label>Eenheid<input class="play-control" type="text"></label></div>`;
  }
  if (task.family === 'structured_short_response' && task.interaction && Array.isArray(task.interaction.fields)) {
    return `<div class="field-grid">${task.interaction.fields.map((field) => `<label>${escapeHtml(field.label)}<input class="play-control" type="text"></label>`).join('')}</div>`;
  }
  if (task.family === 'point_placement') {
    return `<div class="control-row"><label>${escapeHtml(task.interaction.xLabel)}<input class="play-control" type="text"></label><label>${escapeHtml(task.interaction.yLabel)}<input class="play-control" type="text"></label></div>`;
  }
  if (task.family === 'graph_reading' || task.family === 'numeric_input') {
    return `<label>${escapeHtml(task.interaction.inputLabel || 'Antwoord')}<input class="play-control" type="text"></label>`;
  }
  if (task.family === 'table_value_selection' || task.family === 'choice') {
    const name = `choice-${index}`;
    return `<div class="generic-options"><label><input class="play-control" type="radio" name="${name}"> Keuze A</label><label><input class="play-control" type="radio" name="${name}"> Keuze B</label></div>`;
  }
  if (task.family === 'source_value_selection') {
    return `<div class="field-grid"><label>Bronwaarde 1<input class="play-control" type="text"></label><label>Rol 1<input class="play-control" type="text"></label><label>Bronwaarde 2<input class="play-control" type="text"></label><label>Rol 2<input class="play-control" type="text"></label></div>`;
  }
  if (task.family === 'formula_builder' || task.family === 'step_ordering' || task.family === 'source_chain_builder') {
    return `<label>Gekozen volgorde<textarea class="play-control" rows="4"></textarea></label>`;
  }
  return `<label>Reactie<textarea class="play-control" rows="3"></textarea></label>`;
}

function taskHtml(task, index, transform) {
  const mapped = (transform.taskFamilyMap || []).find((item) => item.task_id === task.id);
  const opText = mapped ? mapped.mapped_operations.map(operationLabel).join(', ') : task.family;
  return `<article class="task-card" data-task-family="${escapeHtml(task.family)}" data-task-index="${index}" data-context-ref-count="${task.contextRefs.length}">
    <p class="card-kicker">Taakkaart ${index + 1}</p>
    <h2>${escapeHtml(task.skillLabel)}</h2>
    <p class="task-purpose">${escapeHtml(task.purpose || '')}</p>
    <p class="prompt">${escapeHtml(task.prompt)}</p>
    <div class="play-area">${controlHtml(task, index)}</div>
    <button type="button" class="check-button">Controleer</button>
    <p class="feedback" aria-live="polite"></p>
    <p class="mapped">Bewaakt: ${escapeHtml(opText)}</p>
  </article>`;
}

function buildPlayableLabHtml(options) {
  const { sprintId, transform, windowName, title, kicker, intro, reviewCheck } = options;
  const blocks = transform.taskSet.contextBlocks.map(blockHtml).join('\n');
  const tasks = transform.taskSet.tasks.map((task, index) => taskHtml(task, index, transform)).join('\n');
  const firstPrompt = transform.taskSet.tasks[0] ? transform.taskSet.tasks[0].prompt : '';
  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(sprintId)} Playable Review Lab</title>
  <style>
    :root {
      --bg: #f5f2e8;
      --panel: #ffffff;
      --soft: #e9f2ee;
      --text: #202420;
      --muted: #5c675f;
      --line: #b7c5bd;
      --primary: #0f6b5f;
      --accent: #8a4d18;
      --formula: #f3f6f5;
      --graph-bg: #ffffff;
      --ok: #1f7a4f;
    }
    [data-theme="dark"] {
      --bg: #151819;
      --panel: #222726;
      --soft: #26342e;
      --text: #f5f4ef;
      --muted: #bac5bf;
      --line: #56645e;
      --primary: #72d8c8;
      --accent: #f0b35e;
      --formula: #141819;
      --graph-bg: #101313;
      --ok: #82d9a1;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.5;
    }
    header {
      max-width: 1480px;
      margin: 0 auto;
      padding: 18px 20px 10px;
    }
    h1 {
      margin: 0 0 4px;
      font-size: clamp(1.45rem, 2.1vw, 2.1rem);
      letter-spacing: 0;
    }
    h2 { margin: 4px 0 10px; font-size: 1.05rem; letter-spacing: 0; }
    p { margin: 0 0 10px; }
    .kicker, .card-kicker, .source-label, .source-ref, .mapped, .progress {
      color: var(--muted);
      font-size: 0.92rem;
    }
    .question-strip {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--panel);
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .question-inner {
      max-width: 1480px;
      margin: 0 auto;
      padding: 10px 20px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 16px;
      align-items: center;
    }
    .current-prompt {
      margin: 0;
      font-weight: 700;
    }
    .lab-shell {
      max-width: 1480px;
      margin: 0 auto;
      padding: 16px 20px 36px;
      display: grid;
      grid-template-columns: minmax(340px, 0.88fr) minmax(420px, 1.12fr);
      gap: 16px;
      align-items: start;
    }
    .source-pane {
      position: sticky;
      top: 72px;
      max-height: calc(100vh - 96px);
      overflow-y: auto;
      padding-right: 4px;
    }
    .task-pane {
      min-width: 0;
    }
    .ctx-grid, .task-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
    .ctx-block, .task-card, .review-panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 15px;
    }
    .ctx-text {
      background: transparent;
      border-color: transparent;
      padding: 0;
    }
    .source-label { color: var(--primary); font-weight: 700; }
    .table-scroll, .formula-scroll {
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    table {
      width: 100%;
      min-width: 460px;
      border-collapse: collapse;
      background: var(--panel);
    }
    caption { text-align: left; font-weight: 700; padding: 10px 12px; }
    th, td {
      border-top: 1px solid var(--line);
      padding: 9px 11px;
      text-align: left;
      white-space: nowrap;
    }
    thead th { background: var(--soft); }
    tbody th { font-weight: 700; }
    pre {
      min-width: 500px;
      margin: 0;
      padding: 12px;
      background: var(--formula);
      color: var(--text);
    }
    dl { display: grid; gap: 8px; margin: 12px 0 0; }
    dl div { display: grid; grid-template-columns: 140px minmax(0, 1fr); gap: 10px; }
    dt { font-weight: 700; }
    dd { margin: 0; color: var(--muted); }
    .graph-svg { width: 100%; max-width: 620px; height: auto; display: block; margin-top: 8px; }
    .graph-svg rect { fill: var(--graph-bg); stroke: var(--line); }
    .graph-svg .axis { stroke: var(--text); stroke-width: 2; }
    .graph-svg .series { fill: none; stroke: var(--primary); stroke-width: 3; }
    .graph-svg circle { fill: var(--accent); stroke: var(--panel); stroke-width: 2; }
    .graph-svg text { fill: var(--muted); font-size: 13px; text-anchor: middle; }
    .graph-svg .axis-label { fill: var(--text); font-weight: 700; }
    .flow-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style-position: inside;
    }
    .flow-list li {
      min-height: 58px;
      border: 1px solid var(--line);
      background: var(--soft);
      border-radius: 8px;
      padding: 10px;
    }
    .task-card {
      display: grid;
      gap: 10px;
      scroll-margin-top: 92px;
    }
    .prompt {
      border-left: 3px solid var(--primary);
      padding-left: 10px;
      color: var(--text);
      font-weight: 700;
    }
    .play-area {
      display: grid;
      gap: 10px;
      background: var(--soft);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
    }
    label { display: grid; gap: 4px; font-weight: 700; }
    input, textarea, button {
      font: inherit;
      color: var(--text);
    }
    input, textarea {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--panel);
      padding: 9px 10px;
    }
    textarea { resize: vertical; min-height: 78px; }
    .control-row, .field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .generic-options { display: grid; gap: 8px; }
    .generic-options label {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .generic-options input { width: auto; }
    button {
      justify-self: start;
      border: 0;
      border-radius: 7px;
      background: var(--primary);
      color: var(--panel);
      padding: 9px 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .feedback {
      min-height: 24px;
      color: var(--ok);
      font-weight: 700;
    }
    .mapped {
      padding-top: 10px;
      border-top: 1px solid var(--line);
    }
    .task-card.is-complete {
      border-color: var(--ok);
    }
    .review-panel {
      margin-top: 14px;
      background: var(--soft);
    }
    @media (max-width: 900px) {
      header { padding: 14px 12px 8px; }
      .question-inner {
        padding: 9px 12px;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
      }
      .lab-shell {
        padding: 12px 12px 30px;
        grid-template-columns: minmax(0, 1fr);
      }
      .source-pane {
        position: relative;
        top: auto;
        max-height: 44vh;
        border-bottom: 2px solid var(--line);
        padding-bottom: 12px;
      }
      .control-row, .field-grid, .flow-list { grid-template-columns: 1fr; }
      th, td { white-space: normal; font-size: 0.9rem; line-height: 1.35; }
      pre { min-width: 460px; }
      dl div { grid-template-columns: 1fr; gap: 2px; }
    }
  </style>
</head>
<body>
  <header>
    <p class="kicker">${escapeHtml(kicker)}</p>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(intro)}</p>
  </header>
  <section class="question-strip" aria-label="Huidige vraag">
    <div class="question-inner">
      <p class="current-prompt">${escapeHtml(firstPrompt)}</p>
      <p class="progress">0 / ${transform.taskSet.tasks.length}</p>
    </div>
  </section>
  <main class="lab-shell">
    <aside class="source-pane" aria-label="Bronnen"><section class="ctx-grid">${blocks}</section></aside>
    <section class="task-pane" aria-label="Vragen"><section class="task-grid">${tasks}</section><aside class="review-panel"><strong>Reviewer check:</strong> ${escapeHtml(reviewCheck)}</aside></section>
  </main>
  <script>
    (function () {
      const cards = Array.from(document.querySelectorAll('.task-card'));
      const currentPrompt = document.querySelector('.current-prompt');
      const progress = document.querySelector('.progress');
      function completedCount() {
        return cards.filter((card) => card.classList.contains('is-complete')).length;
      }
      function updateCurrent(index) {
        const card = cards[Math.min(index, cards.length - 1)];
        const prompt = card ? card.querySelector('.prompt') : null;
        if (prompt && currentPrompt) currentPrompt.textContent = prompt.textContent;
        if (progress) progress.textContent = completedCount() + ' / ' + cards.length;
      }
      cards.forEach((card, index) => {
        const button = card.querySelector('.check-button');
        const feedback = card.querySelector('.feedback');
        button.addEventListener('click', () => {
          card.classList.add('is-complete');
          if (feedback) feedback.textContent = 'Ingevuld en klaar voor de volgende stap.';
          updateCurrent(Math.min(index + 1, cards.length - 1));
        });
      });
      function fillCard(card, index) {
        card.querySelectorAll('.play-control').forEach((control, controlIndex) => {
          if (control.type === 'radio') {
            control.checked = controlIndex === 0;
          } else {
            control.value = 'review input ' + (index + 1) + '.' + (controlIndex + 1);
          }
        });
      }
      function inspect() {
        const sourcePane = document.querySelector('.source-pane');
        const taskPane = document.querySelector('.task-pane');
        const strip = document.querySelector('.question-strip');
        if (sourcePane) sourcePane.scrollTop = sourcePane.scrollHeight;
        const stripRect = strip ? strip.getBoundingClientRect() : null;
        const overflowing = Array.from(document.querySelectorAll('body *')).filter((item) => {
          const style = window.getComputedStyle(item);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (item.ownerSVGElement) return false;
          return item.scrollWidth > item.clientWidth + 2 && !item.closest('.table-scroll') && !item.closest('.formula-scroll');
        });
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          viewport: { width: window.innerWidth, height: window.innerHeight },
          contextBlockCount: document.querySelectorAll('.ctx-block').length,
          taskCardCount: cards.length,
          families: cards.map((item) => item.getAttribute('data-task-family')),
          contextBeforeTasks: sourcePane.getBoundingClientRect().top <= taskPane.getBoundingClientRect().top + 2,
          sourcePanePresent: Boolean(sourcePane),
          taskPanePresent: Boolean(taskPane),
          sourcePaneScrollable: sourcePane ? sourcePane.scrollHeight > sourcePane.clientHeight : false,
          sourcePaneIndependentScroll: sourcePane ? window.getComputedStyle(sourcePane).overflowY !== 'visible' : false,
          questionVisibleAfterSourceScroll: Boolean(stripRect && stripRect.top >= 0 && stripRect.bottom <= window.innerHeight),
          interactiveControlCount: document.querySelectorAll('.play-control').length,
          checkButtonCount: document.querySelectorAll('.check-button').length,
          completedTaskCount: completedCount(),
          labCompleted: completedCount() === cards.length,
          tableCount: document.querySelectorAll('table').length,
          graphCount: document.querySelectorAll('.graph-svg').length,
          flowchartCount: document.querySelectorAll('.flow-list').length,
          sourceRefsVisible: document.body.innerText.includes('references/'),
          bodyTextSnapshot: document.body.innerText,
          contextTextSnapshot: sourcePane ? sourcePane.innerText : '',
          taskTextSnapshot: taskPane ? taskPane.innerText : '',
          rawImageCount: document.querySelectorAll('img').length,
          overflowingCount: overflowing.length,
          overflowingTags: overflowing.slice(0, 8).map((item) => item.tagName.toLowerCase())
        };
      }
      window.${windowName} = {
        inspect,
        completeDemoPath() {
          cards.forEach((card, index) => {
            fillCard(card, index);
            if (!card.classList.contains('is-complete')) card.querySelector('.check-button').click();
          });
          return inspect();
        }
      };
      updateCurrent(0);
    })();
  </script>
</body>
</html>`;
}

module.exports = { buildPlayableLabHtml };
