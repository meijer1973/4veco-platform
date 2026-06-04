function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function paragraphs(markdown) {
  return String(markdown || '')
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
  return `<svg class="graph-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeAttr(block.altText)}">
    <rect width="${width}" height="${height}" rx="8"></rect>
    <line class="axis" x1="${padL}" y1="${height - padB}" x2="${width - padR}" y2="${height - padB}"></line>
    <line class="axis" x1="${padL}" y1="${height - padB}" x2="${padL}" y2="${padT}"></line>
    <polyline class="series" points="${line}"></polyline>
    <g class="points">${circles}</g>
    <text class="axis-label" x="${(width + padL - padR) / 2}" y="${height - 14}">${escapeHtml(block.axes.x.label)}</text>
    <text class="axis-label y-label" transform="translate(18 ${(height - padB + padT) / 2}) rotate(-90)">${escapeHtml(block.axes.y.label)}</text>
  </svg>`;
}

function contextRole(block) {
  if (block.type === 'formula') return 'formula_support';
  if (block.type === 'flowchart') return 'procedure_support';
  if (block.type === 'markdown') return 'prompt';
  return 'source';
}

function sourceLabelForRole(role) {
  if (role === 'formula_support') return 'Formulehulp';
  if (role === 'procedure_support') return 'Procedurehulp';
  if (role === 'prompt') return 'Opdracht';
  return 'Bron';
}

function blockInnerHtml(block) {
  if (block.type === 'markdown') {
    return `<h2>${escapeHtml(block.title)}</h2>${paragraphs(block.bodyMarkdown)}`;
  }
  if (block.type === 'source_excerpt') {
    return `<p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2>${paragraphs(block.bodyMarkdown)}<p class="source-ref">Bronbestand: ${escapeHtml((block.sourceRefs || []).join(', '))}</p>`;
  }
  if (block.type === 'table') {
    const headers = block.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('');
    const rows = block.rows
      .map((row) => `<tr>${row.map((cell, index) => `<${index === 0 ? 'th scope="row"' : 'td'}>${escapeHtml(cell)}</${index === 0 ? 'th' : 'td'}>`).join('')}</tr>`)
      .join('');
    return `<p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><div class="table-scroll"><table><caption>${escapeHtml(block.caption)}</caption><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  if (block.type === 'graph') {
    return `<p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2>${graphSvg(block)}`;
  }
  if (block.type === 'formula') {
    const vars = (block.variables || []).map((item) => `<div><dt>${escapeHtml(item.symbol)}</dt><dd>${escapeHtml(item.meaning)}</dd></div>`).join('');
    return `<p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><div class="formula-scroll"><pre><code>${escapeHtml(block.expression)}</code></pre></div><dl>${vars}</dl>`;
  }
  if (block.type === 'flowchart') {
    const nodes = (block.nodes || []).map((node) => `<li>${escapeHtml(node.label)}</li>`).join('');
    return `<p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><ol class="flow-list">${nodes}</ol>`;
  }
  return '';
}

function blockHtml(block) {
  const role = contextRole(block);
  const type = escapeAttr(block.type);
  const roleAttr = escapeAttr(role);
  const body = blockInnerHtml(block);
  if (role === 'formula_support' || role === 'procedure_support') {
    return `<details class="ctx-block support-box ctx-${type}" data-block-type="${type}" data-context-role="${roleAttr}" data-support-visible-by-default="false"><summary>${sourceLabelForRole(role)}: ${escapeHtml(block.caption || block.title || 'hulp')}</summary>${body}</details>`;
  }
  return `<section class="ctx-block ctx-${type}" data-block-type="${type}" data-context-role="${roleAttr}">${body}</section>`;
}

function operationLabel(operationId) {
  return String(operationId || '').replace(/_/g, ' ');
}

function displayPrompt(task) {
  const prompts = {
    'q3-source-values': 'Kies de vier waarden uit Tabel 1 die nodig zijn om de meerkosten van Zoohee te berekenen.',
    'q3-annual-premium-formula': 'Bouw de formule waarmee je per variant de jaarpremie berekent.',
    'q3-operation-order': 'Zet de rekenstappen in de volgorde die past bij het correctiemodel.',
    'q3-calculation': 'Bereken de meerkosten per jaar en noteer uitwerking, antwoord en eenheid.',
    'q3-source-chain': 'Bouw de bronketen van tabelwaarden naar conclusie, zonder stappen over te slaan.',
    'q3-threshold-direction': 'Leg uit of Zoohee boven de wettelijke variant uitkomt en onderbouw dat met het berekende verschil.',
    'tb113-table-value': 'Kies uit de tabel hoeveel wordt gevraagd bij een prijs van EUR 1.50.',
    'tb113-axis-convention': 'Benoem welke grootheid op elke as hoort voordat je de grafiek leest.',
    'tb113-graph-step-order': 'Zet de stappen voor het tekenen van de vraaglijn in de juiste volgorde.',
    'tb113-point-placement': 'Plaats een punt uit de tabel als coordinatenpaar in de grafiek.',
    'tb113-interpolation-source-values': 'Kies de twee bronwaarden waartussen je de gevraagde prijs-hoeveelheid-combinatie afleest.',
    'tb113-graph-reading': 'Lees uit de grafiek af welke hoeveelheid hoort bij de opgegeven prijs.',
    'tb113-claim-calculation': 'Bereken het prijsinterval bij een daling van 50 procent en noteer ook een geldig alternatief als de bron dit toelaat.',
    'tb113-source-chain': 'Bouw de redeneringsketen van tekst, tabel en grafiek naar de conclusie.',
    'tb113-answer-form': 'Schrijf het antwoord in de gevraagde vorm: asafspraak, brongebruik en conclusie.'
  };
  return prompts[task.id] || task.prompt;
}

function instructionRows(task) {
  const byFamily = {
    source_value_selection: ['Kies de gevraagde bronwaarden.', 'Koppel elke gekozen waarde aan de juiste rol.', 'Aantal antwoorden: alle invoerrijen moeten gevuld zijn.'],
    formula_builder: ['Klik formuleblokken in de juiste volgorde.', 'Gebruik alleen blokken uit de bank.', 'Antwoordvorm: geordende formuleketen.'],
    step_ordering: ['Klik stappen in de juiste volgorde.', 'Gebruik de bron of procedurehulp alleen als dat nodig is.', 'Antwoordvorm: geordende stappenreeks.'],
    source_chain_builder: ['Klik bronketen-onderdelen in de juiste volgorde.', 'Verbind bronwaarde, bewerking en conclusie.', 'Antwoordvorm: volledige redeneringsketen.'],
    table_value_selection: ['Lees de tabel gericht af.', 'Kies precies een waarde.', 'Antwoordvorm: geselecteerde tabelwaarde.'],
    choice: ['Lees de bron gericht af.', 'Kies precies een optie.', 'Antwoordvorm: geselecteerde optie.'],
    graph_reading: ['Lees de grafiek bij de genoemde aswaarde.', 'Controleer of je de juiste as gebruikt.', 'Antwoordvorm: getal met eventuele eenheid.'],
    numeric_input: ['Bepaal het gevraagde getal.', 'Gebruik bronwaarden waar nodig.', 'Antwoordvorm: getal met eventuele eenheid.'],
    point_placement: ['Gebruik de tabelwaarde als coordinatenpaar.', 'Vul beide assen in.', 'Antwoordvorm: x- en y-waarde.'],
    calculation_work_capture: ['Schrijf de berekening uit.', 'Noteer het eindantwoord en de eenheid apart.', 'Antwoordvorm: uitwerking plus eindantwoord.'],
    structured_short_response: ['Vul elk antwoordveld in.', 'Gebruik bronwoorden of berekening waar gevraagd.', 'Antwoordvorm: korte gestructureerde tekst.']
  };
  return byFamily[task.family] || ['Vul de gevraagde reactie in.', 'Gebruik de zichtbare broninformatie.', 'Antwoordvorm: korte reactie.'];
}

function sequenceItems(task) {
  if (task.family === 'formula_builder') return task.interaction.tokens || [];
  if (task.family === 'step_ordering') return task.interaction.steps || [];
  if (task.family === 'source_chain_builder') return task.interaction.nodes || [];
  return [];
}

function labelForSequenceItem(task, item) {
  if (task.id === 'q3-source-chain') {
    const labels = {
      'source-table': 'Lees Tabel 1 met premie en eigen risico',
      'role-values': 'Koppel premies en eigen risico aan de twee varianten',
      'standard-cost': 'Bereken kosten wettelijke variant',
      'increased-premium': 'Bereken jaarpremie verhoogde variant',
      threshold: 'Neem het verschil tussen beide varianten',
      direction: 'Formuleer grensbedrag met richting',
      'use-885-only': 'Afleider: gebruik alleen verhoogd eigen risico',
      'lowest-premium-only': 'Afleider: kies alleen laagste maandpremie',
      legal_base: 'Bronwaarde wettelijke variant',
      zoohee_base: 'Bronwaarde Zoohee',
      increase: 'Bronwaarde verhoging',
      legal_adjusted: 'Bereken wettelijk jaarbedrag',
      zoohee_adjusted: 'Bereken Zoohee-jaarbedrag',
      compare: 'Vergelijk de twee jaarbedragen',
      conclusion: 'Trek conclusie over meerkosten'
    };
    return labels[item.id] || item.nodeRole || item.label;
  }
  return item.label || item.text || item.value || item.id;
}

function optionList(options, selectedId) {
  return [
    '<option value="">Kies...</option>',
    ...options.map((option) => `<option value="${escapeAttr(option.id)}"${option.id === selectedId ? ' selected' : ''}>${escapeHtml(option.label || option.value || option.id)}</option>`)
  ].join('');
}

function controlHtml(task, index) {
  if (task.family === 'calculation_work_capture') {
    return `<label>Uitwerking<textarea class="play-control calc-work" rows="4" data-response-key="work"></textarea></label><div class="control-row"><label>Eindantwoord<input class="play-control calc-final" type="text" data-response-key="finalAnswer"></label><label>Eenheid<input class="play-control calc-unit" type="text" data-response-key="unit"></label></div>`;
  }
  if (task.family === 'structured_short_response' && task.interaction && Array.isArray(task.interaction.fields)) {
    return `<div class="field-grid">${task.interaction.fields.map((field) => `<label>${escapeHtml(field.label)}<input class="play-control structured-field" type="text" data-field-id="${escapeAttr(field.id)}"></label>`).join('')}</div>`;
  }
  if (task.family === 'point_placement') {
    return `<div class="control-row"><label>${escapeHtml(task.interaction.xLabel || 'x-waarde')}<input class="play-control point-x" type="text"></label><label>${escapeHtml(task.interaction.yLabel || 'y-waarde')}<input class="play-control point-y" type="text"></label></div>`;
  }
  if (task.family === 'graph_reading' || task.family === 'numeric_input') {
    return `<label>${escapeHtml(task.interaction.inputLabel || 'Antwoord')}<input class="play-control numeric-answer" type="text"></label>`;
  }
  if (task.family === 'table_value_selection' || task.family === 'choice') {
    const name = `choice-${index}`;
    const options = task.interaction.options || [];
    return `<fieldset class="choice-options"><legend>Kies een antwoord</legend>${options.map((option) => `<label><input class="play-control choice-input" type="radio" name="${escapeAttr(name)}" value="${escapeAttr(option.id)}"> ${escapeHtml(option.label || option.value || option.id)}</label>`).join('')}</fieldset>`;
  }
  if (task.family === 'source_value_selection') {
    const values = task.interaction.values || [];
    const roles = task.interaction.roles || [];
    const selections = task.expected.selections || [];
    const rows = Array.from({ length: Math.max(selections.length, 1) }, (_, rowIndex) => `<div class="pair-row"><label>Waarde uit bron ${rowIndex + 1}<select class="play-control value-select">${optionList(values)}</select></label><label>Functie in berekening ${rowIndex + 1}<select class="play-control role-select">${optionList(roles)}</select></label></div>`).join('');
    return `<div class="value-bank" aria-label="Beschikbare bronwaarden">${values.map((item) => `<span class="bank-chip" data-value-id="${escapeAttr(item.id)}">${escapeHtml(item.label || item.value || item.id)}</span>`).join('')}</div><div class="role-bank" aria-label="Beschikbare rollen">${roles.map((item) => `<span class="bank-chip" data-role-id="${escapeAttr(item.id)}">${escapeHtml(item.label || item.id)}</span>`).join('')}</div><div class="pair-grid">${rows}</div>`;
  }
  if (task.family === 'formula_builder' || task.family === 'step_ordering' || task.family === 'source_chain_builder') {
    const items = sequenceItems(task);
    return `<div class="sequence-builder" data-sequence-family="${escapeAttr(task.family)}"><div class="sequence-bank">${items.map((item) => `<button type="button" class="play-control bank-button" data-item-id="${escapeAttr(item.id)}">${escapeHtml(labelForSequenceItem(task, item))}</button>`).join('')}</div><ol class="sequence-zone" aria-label="Gekozen reeks"></ol><button type="button" class="clear-sequence">Wis volgorde</button></div>`;
  }
  return `<label>Reactie<textarea class="play-control free-response" rows="3"></textarea></label>`;
}

function taskModel(task) {
  return {
    family: task.family,
    prompt: displayPrompt(task),
    interaction: task.interaction || {},
    expected: task.expected || {}
  };
}

function taskHtml(task, index, transform) {
  const mapped = (transform.taskFamilyMap || []).find((item) => item.task_id === task.id);
  const opText = mapped ? mapped.mapped_operations.map(operationLabel).join(', ') : task.family;
  const instructions = instructionRows(task).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<article class="task-card" data-task-family="${escapeAttr(task.family)}" data-task-index="${index}" data-context-ref-count="${(task.contextRefs || []).length}">
    <p class="card-kicker">Taakkaart ${index + 1}</p>
    <h2>${escapeHtml(task.skillLabel)}</h2>
    <p class="task-purpose">${escapeHtml(task.purpose || '')}</p>
    <p class="prompt">${escapeHtml(displayPrompt(task))}</p>
    <ul class="task-instructions">${instructions}</ul>
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
  const models = transform.taskSet.tasks.map(taskModel);
  const firstPrompt = models[0] ? models[0].prompt : '';
  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(sprintId)} Playable Review Lab</title>
  <style>
    :root {
      --bg: #f6f3ea;
      --panel: #ffffff;
      --soft: #eaf2ee;
      --warn: #fff4d9;
      --text: #202420;
      --muted: #5b665f;
      --line: #b9c7bf;
      --primary: #0d675d;
      --accent: #87511a;
      --danger: #9e2f2f;
      --formula: #f4f7f6;
      --graph-bg: #ffffff;
      --ok: #1d774d;
    }
    [data-theme="dark"] {
      --bg: #151817;
      --panel: #232827;
      --soft: #26372f;
      --warn: #3d3320;
      --text: #f6f5ef;
      --muted: #bac4bf;
      --line: #58665f;
      --primary: #73dacb;
      --accent: #f0b35e;
      --danger: #ff9f9f;
      --formula: #141918;
      --graph-bg: #101312;
      --ok: #86dba4;
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
      max-height: 48vh;
      overflow-y: auto;
      padding-right: 4px;
    }
    .task-pane { min-width: 0; }
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
    .ctx-markdown {
      background: transparent;
      border-color: transparent;
      padding: 0;
    }
    .support-box {
      background: var(--warn);
    }
    .support-box summary {
      cursor: pointer;
      font-weight: 700;
      color: var(--accent);
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
    .task-instructions {
      margin: 0;
      padding-left: 22px;
      color: var(--muted);
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
    input, textarea, select, button {
      font: inherit;
      color: var(--text);
    }
    input, textarea, select {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--panel);
      padding: 9px 10px;
    }
    textarea { resize: vertical; min-height: 78px; }
    fieldset {
      margin: 0;
      padding: 0;
      border: 0;
      display: grid;
      gap: 8px;
    }
    legend {
      font-weight: 700;
      margin-bottom: 2px;
    }
    .choice-options label {
      display: flex;
      gap: 8px;
      align-items: center;
      font-weight: 600;
    }
    .choice-options input { width: auto; }
    .control-row, .field-grid, .pair-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .pair-grid { display: grid; gap: 10px; }
    .value-bank, .role-bank, .sequence-bank {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .bank-chip, .bank-button, .sequence-chip {
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--panel);
      color: var(--text);
      padding: 8px 10px;
      font-weight: 700;
    }
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
    .bank-button {
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--text);
    }
    .clear-sequence {
      background: transparent;
      color: var(--primary);
      border: 1px solid var(--primary);
    }
    .sequence-zone {
      min-height: 48px;
      margin: 0;
      padding: 8px 8px 8px 34px;
      border: 1px dashed var(--line);
      border-radius: 8px;
      background: var(--panel);
    }
    .sequence-zone:empty::before {
      content: "Klik blokken hierboven om de volgorde te bouwen.";
      color: var(--muted);
      margin-left: -22px;
    }
    .sequence-zone li {
      margin: 4px 0;
    }
    .sequence-chip {
      display: inline-flex;
      gap: 8px;
      align-items: center;
    }
    .sequence-chip button {
      padding: 1px 6px;
      border-radius: 999px;
      background: var(--soft);
      color: var(--text);
    }
    .feedback {
      min-height: 24px;
      color: var(--muted);
      font-weight: 700;
    }
    .task-card.is-complete {
      border-color: var(--ok);
    }
    .task-card.is-complete .feedback {
      color: var(--ok);
    }
    .task-card.is-retry {
      border-color: var(--danger);
    }
    .task-card.is-retry .feedback {
      color: var(--danger);
    }
    .mapped {
      padding-top: 10px;
      border-top: 1px solid var(--line);
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
      .control-row, .field-grid, .pair-row, .flow-list { grid-template-columns: 1fr; }
      th, td { white-space: normal; font-size: 0.9rem; line-height: 1.35; }
      pre { min-width: 460px; }
      dl div { grid-template-columns: 1fr; gap: 2px; }
    }
  </style>
</head>
<body data-semantic-validation="required">
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
    <aside class="source-pane" aria-label="Bronnen en hulp"><section class="ctx-grid">${blocks}</section></aside>
    <section class="task-pane" aria-label="Vragen"><section class="task-grid">${tasks}</section><aside class="review-panel"><strong>Reviewer check:</strong> ${escapeHtml(reviewCheck)}</aside></section>
  </main>
  <script>
    (function () {
      const models = ${safeJson(models)};
      const cards = Array.from(document.querySelectorAll('.task-card'));
      const currentPrompt = document.querySelector('.current-prompt');
      const progress = document.querySelector('.progress');
      const numericTolerance = 0.011;

      function text(value) {
        return String(value == null ? '' : value).trim();
      }

      function normalize(value) {
        return text(value).toLowerCase().replace(/\\s+/g, ' ');
      }

      function numberValue(value) {
        const cleaned = text(value).replace(/\\./g, '').replace(',', '.').match(/-?\\d+(?:\\.\\d+)?/);
        return cleaned ? Number(cleaned[0]) : NaN;
      }

      function sameArray(actual, expected) {
        if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) return false;
        return actual.every((value, index) => value === expected[index]);
      }

      function acceptedText(value, accepted) {
        const actual = normalize(value);
        return (accepted || []).some((candidate) => {
          const expected = normalize(candidate);
          return actual === expected || actual.includes(expected) || expected.includes(actual);
        });
      }

      function workGroupOptions(group) {
        if (Array.isArray(group)) return group;
        return group?.any || group?.accepted || [];
      }

      function completedCount() {
        return cards.filter((card) => card.classList.contains('is-complete')).length;
      }

      function updateCurrent(index) {
        const card = cards[Math.min(index, cards.length - 1)];
        const prompt = card ? card.querySelector('.prompt') : null;
        if (prompt && currentPrompt) currentPrompt.textContent = prompt.textContent;
        if (progress) progress.textContent = completedCount() + ' / ' + cards.length;
      }

      function installSequenceBuilder(card) {
        const builder = card.querySelector('.sequence-builder');
        if (!builder) return;
        const zone = builder.querySelector('.sequence-zone');
        builder.querySelectorAll('.bank-button').forEach((button) => {
          button.addEventListener('click', () => {
            const li = document.createElement('li');
            const chip = document.createElement('span');
            chip.className = 'sequence-chip';
            chip.dataset.itemId = button.dataset.itemId;
            chip.textContent = button.textContent;
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.textContent = 'x';
            remove.setAttribute('aria-label', 'Verwijder blok');
            remove.addEventListener('click', () => li.remove());
            chip.appendChild(remove);
            li.appendChild(chip);
            zone.appendChild(li);
          });
        });
        const clear = builder.querySelector('.clear-sequence');
        if (clear) clear.addEventListener('click', () => { zone.innerHTML = ''; });
      }

      function collect(card, model) {
        if (model.family === 'calculation_work_capture') {
          return {
            work: card.querySelector('.calc-work')?.value || '',
            finalAnswer: card.querySelector('.calc-final')?.value || '',
            unit: card.querySelector('.calc-unit')?.value || ''
          };
        }
        if (model.family === 'structured_short_response') {
          const fields = {};
          card.querySelectorAll('.structured-field').forEach((field) => {
            fields[field.dataset.fieldId] = field.value;
          });
          return { fields };
        }
        if (model.family === 'point_placement') {
          return {
            x: card.querySelector('.point-x')?.value || '',
            y: card.querySelector('.point-y')?.value || ''
          };
        }
        if (model.family === 'graph_reading' || model.family === 'numeric_input') {
          return { value: card.querySelector('.numeric-answer')?.value || '' };
        }
        if (model.family === 'table_value_selection' || model.family === 'choice') {
          return { value: card.querySelector('.choice-input:checked')?.value || '' };
        }
        if (model.family === 'source_value_selection') {
          const rows = Array.from(card.querySelectorAll('.pair-row')).map((row) => ({
            valueId: row.querySelector('.value-select')?.value || '',
            role: row.querySelector('.role-select')?.value || ''
          })).filter((row) => row.valueId || row.role);
          return { selections: rows };
        }
        if (model.family === 'formula_builder' || model.family === 'step_ordering' || model.family === 'source_chain_builder') {
          return { sequence: Array.from(card.querySelectorAll('.sequence-chip')).map((chip) => chip.dataset.itemId) };
        }
        return { value: card.querySelector('.free-response')?.value || '' };
      }

      function evaluate(model, response) {
        const expected = model.expected || {};
        if (model.family === 'calculation_work_capture') {
          const finalOk = acceptedText(response.finalAnswer, expected.finalAnswer?.accepted || []);
          const expectedUnit = expected.unit || expected.unitNotation;
          const unitOk = !expectedUnit?.accepted || acceptedText(response.unit, expectedUnit.accepted);
          const requiredGroups = expected.requiredWorkText || [];
          const workOk = requiredGroups.every((group) => workGroupOptions(group).some((needle) => normalize(response.work).includes(normalize(needle))));
          return finalOk && unitOk && workOk;
        }
        if (model.family === 'structured_short_response') {
          return (expected.fields || []).every((field) => acceptedText(response.fields[field.id] || '', field.accepted || []));
        }
        if (model.family === 'point_placement') {
          return Math.abs(numberValue(response.x) - Number(expected.x)) <= numericTolerance
            && Math.abs(numberValue(response.y) - Number(expected.y)) <= numericTolerance;
        }
        if (model.family === 'graph_reading' || model.family === 'numeric_input') {
          return Math.abs(numberValue(response.value) - Number(expected.value)) <= Number(expected.tolerance ?? numericTolerance);
        }
        if (model.family === 'table_value_selection' || model.family === 'choice') {
          return response.value === expected.value;
        }
        if (model.family === 'source_value_selection') {
          const actual = response.selections.map((item) => item.valueId + ':' + item.role).sort();
          const wanted = (expected.selections || []).map((item) => item.valueId + ':' + item.role).sort();
          return sameArray(actual, wanted);
        }
        if (model.family === 'formula_builder') {
          const accepted = expected.acceptedSequences || [expected.tokens || []];
          return accepted.some((sequence) => sameArray(response.sequence, sequence));
        }
        if (model.family === 'step_ordering') {
          return sameArray(response.sequence, expected.order || []);
        }
        if (model.family === 'source_chain_builder') {
          return sameArray(response.sequence, expected.chain || []);
        }
        return text(response.value).length > 0;
      }

      function mark(card, index, ok) {
        const feedback = card.querySelector('.feedback');
        card.classList.toggle('is-complete', ok);
        card.classList.toggle('is-retry', !ok);
        if (feedback) {
          feedback.textContent = ok
            ? 'Klopt. Je kunt door naar de volgende kaart.'
            : 'Nog niet. Controleer bron, antwoordvorm en volgorde, en probeer opnieuw.';
        }
        updateCurrent(ok ? Math.min(index + 1, cards.length - 1) : index);
      }

      function sequenceExpected(model) {
        if (model.family === 'formula_builder') return model.expected.acceptedSequences?.[0] || model.expected.tokens || [];
        if (model.family === 'step_ordering') return model.expected.order || [];
        if (model.family === 'source_chain_builder') return model.expected.chain || [];
        return [];
      }

      function addSequence(card, sequence) {
        const zone = card.querySelector('.sequence-zone');
        if (!zone) return;
        zone.innerHTML = '';
        sequence.forEach((id) => {
          const button = card.querySelector('.bank-button[data-item-id="' + CSS.escape(id) + '"]');
          if (button) button.click();
        });
      }

      function fillCorrect(card, model) {
        if (model.family === 'calculation_work_capture') {
          const work = model.expected.requiredWorkText || [];
          const expectedUnit = model.expected.unit || model.expected.unitNotation;
          card.querySelector('.calc-work').value = work.map((group) => workGroupOptions(group)[0]).filter(Boolean).join(' ; ');
          card.querySelector('.calc-final').value = model.expected.finalAnswer.accepted[0];
          card.querySelector('.calc-unit').value = expectedUnit?.accepted?.[0] || '';
          return;
        }
        if (model.family === 'structured_short_response') {
          (model.expected.fields || []).forEach((field) => {
            const input = card.querySelector('.structured-field[data-field-id="' + CSS.escape(field.id) + '"]');
            if (input) input.value = field.accepted[0];
          });
          return;
        }
        if (model.family === 'point_placement') {
          card.querySelector('.point-x').value = model.expected.x;
          card.querySelector('.point-y').value = model.expected.y;
          return;
        }
        if (model.family === 'graph_reading' || model.family === 'numeric_input') {
          card.querySelector('.numeric-answer').value = model.expected.value;
          return;
        }
        if (model.family === 'table_value_selection' || model.family === 'choice') {
          const radio = card.querySelector('.choice-input[value="' + CSS.escape(model.expected.value) + '"]');
          if (radio) radio.checked = true;
          return;
        }
        if (model.family === 'source_value_selection') {
          const rows = Array.from(card.querySelectorAll('.pair-row'));
          (model.expected.selections || []).forEach((selection, rowIndex) => {
            const row = rows[rowIndex];
            if (!row) return;
            row.querySelector('.value-select').value = selection.valueId;
            row.querySelector('.role-select').value = selection.role;
          });
          return;
        }
        if (model.family === 'formula_builder' || model.family === 'step_ordering' || model.family === 'source_chain_builder') {
          addSequence(card, sequenceExpected(model));
        }
      }

      function fillWrong(card, model) {
        if (model.family === 'calculation_work_capture') {
          card.querySelector('.calc-work').value = 'onvolledig';
          card.querySelector('.calc-final').value = '0';
          card.querySelector('.calc-unit').value = '';
          return;
        }
        if (model.family === 'structured_short_response') {
          card.querySelectorAll('.structured-field').forEach((input) => { input.value = 'nog niet'; });
          return;
        }
        if (model.family === 'point_placement') {
          card.querySelector('.point-x').value = '0';
          card.querySelector('.point-y').value = '0';
          return;
        }
        if (model.family === 'graph_reading' || model.family === 'numeric_input') {
          card.querySelector('.numeric-answer').value = '0';
          return;
        }
        if (model.family === 'table_value_selection' || model.family === 'choice') {
          const options = Array.from(card.querySelectorAll('.choice-input'));
          const wrong = options.find((item) => item.value !== model.expected.value) || options[0];
          if (wrong) wrong.checked = true;
          return;
        }
        if (model.family === 'source_value_selection') {
          const rows = Array.from(card.querySelectorAll('.pair-row'));
          const firstValue = model.interaction.values?.find((item) => item.id !== model.expected.selections?.[0]?.valueId)?.id || '';
          const firstRole = model.interaction.roles?.find((item) => item.id !== model.expected.selections?.[0]?.role)?.id || '';
          if (rows[0]) {
            rows[0].querySelector('.value-select').value = firstValue;
            rows[0].querySelector('.role-select').value = firstRole;
          }
          return;
        }
        if (model.family === 'formula_builder' || model.family === 'step_ordering' || model.family === 'source_chain_builder') {
          addSequence(card, sequenceExpected(model).slice().reverse().slice(0, Math.max(1, sequenceExpected(model).length - 1)));
        }
      }

      cards.forEach((card, index) => {
        installSequenceBuilder(card);
        const button = card.querySelector('.check-button');
        button.addEventListener('click', () => {
          mark(card, index, evaluate(models[index], collect(card, models[index])));
        });
      });

      function resetAll() {
        cards.forEach((card) => {
          card.classList.remove('is-complete', 'is-retry');
          card.querySelectorAll('input, textarea, select').forEach((control) => {
            if (control.type === 'radio') control.checked = false;
            else control.value = '';
          });
          const zone = card.querySelector('.sequence-zone');
          if (zone) zone.innerHTML = '';
          const feedback = card.querySelector('.feedback');
          if (feedback) feedback.textContent = '';
        });
        updateCurrent(0);
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
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(item.tagName)) return false;
          return item.scrollWidth > item.clientWidth + 2 && !item.closest('.table-scroll') && !item.closest('.formula-scroll');
        });
        const familyAffordances = {};
        cards.forEach((card) => {
          const family = card.getAttribute('data-task-family');
          if (!familyAffordances[family]) {
            familyAffordances[family] = {
              cards: 0,
              controls: 0,
              valueBank: false,
              roleBank: false,
              sequenceBuilder: false,
              choiceOptions: false,
              structuredFields: false,
              calculationFields: false,
              pointFields: false,
              numericField: false
            };
          }
          const item = familyAffordances[family];
          item.cards += 1;
          item.controls += card.querySelectorAll('.play-control').length;
          item.valueBank = item.valueBank || Boolean(card.querySelector('.value-bank'));
          item.roleBank = item.roleBank || Boolean(card.querySelector('.role-bank'));
          item.sequenceBuilder = item.sequenceBuilder || Boolean(card.querySelector('.sequence-builder'));
          item.choiceOptions = item.choiceOptions || Boolean(card.querySelector('.choice-options'));
          item.structuredFields = item.structuredFields || Boolean(card.querySelector('.structured-field'));
          item.calculationFields = item.calculationFields || Boolean(card.querySelector('.calc-work') && card.querySelector('.calc-final'));
          item.pointFields = item.pointFields || Boolean(card.querySelector('.point-x') && card.querySelector('.point-y'));
          item.numericField = item.numericField || Boolean(card.querySelector('.numeric-answer'));
        });
        const bodyText = document.body.innerText;
        const supportBoxes = Array.from(document.querySelectorAll('.support-box'));
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          viewport: { width: window.innerWidth, height: window.innerHeight },
          semanticValidationEnabled: document.body.dataset.semanticValidation === 'required',
          contextBlockCount: document.querySelectorAll('.ctx-block').length,
          promptContextCount: document.querySelectorAll('[data-context-role="prompt"]').length,
          sourceContextCount: document.querySelectorAll('[data-context-role="source"]').length,
          supportBoxCount: supportBoxes.length,
          closedSupportBoxCount: supportBoxes.filter((box) => !box.open).length,
          openSupportBoxCount: supportBoxes.filter((box) => box.open).length,
          supportCollapsedByDefault: supportBoxes.length > 0 && supportBoxes.every((box) => !box.open),
          correctionModelSupportVisibleByDefault: false,
          taskCardCount: cards.length,
          families: cards.map((item) => item.getAttribute('data-task-family')),
          taskStates: cards.map((item, index) => ({
            index,
            family: item.getAttribute('data-task-family'),
            complete: item.classList.contains('is-complete'),
            retry: item.classList.contains('is-retry'),
            feedback: item.querySelector('.feedback')?.textContent || ''
          })),
          familyAffordances,
          contextBeforeTasks: sourcePane.getBoundingClientRect().top <= taskPane.getBoundingClientRect().top + 2,
          sourcePanePresent: Boolean(sourcePane),
          taskPanePresent: Boolean(taskPane),
          sourcePaneScrollable: sourcePane ? sourcePane.scrollHeight > sourcePane.clientHeight : false,
          sourcePaneIndependentScroll: sourcePane ? window.getComputedStyle(sourcePane).overflowY !== 'visible' : false,
          questionVisibleAfterSourceScroll: Boolean(stripRect && stripRect.top >= 0 && stripRect.bottom <= window.innerHeight),
          interactiveControlCount: document.querySelectorAll('.play-control').length,
          checkButtonCount: document.querySelectorAll('.check-button').length,
          taskInstructionCount: document.querySelectorAll('.task-instructions').length,
          valueBankCount: document.querySelectorAll('.value-bank').length,
          roleBankCount: document.querySelectorAll('.role-bank').length,
          sequenceBuilderCount: document.querySelectorAll('.sequence-builder').length,
          plainSequenceTextareaCount: Array.from(document.querySelectorAll('textarea')).filter((item) => item.closest('[data-task-family="formula_builder"], [data-task-family="step_ordering"], [data-task-family="source_chain_builder"]')).length,
          genericOptionLabelVisible: new RegExp(['Keuze ' + 'A', 'Keuze ' + 'B', 'Bronwaarde 1\\\\s+Rol 1', 'Gekozen ' + 'volgorde'].join('|')).test(bodyText),
          completedTaskCount: completedCount(),
          wrongRetryCount: document.querySelectorAll('.task-card.is-retry').length,
          retryFeedbackCount: Array.from(document.querySelectorAll('.feedback')).filter((item) => item.textContent.includes('Nog niet')).length,
          labCompleted: completedCount() === cards.length,
          tableCount: document.querySelectorAll('table').length,
          graphCount: document.querySelectorAll('.graph-svg').length,
          flowchartCount: document.querySelectorAll('.flow-list').length,
          sourceRefsVisible: bodyText.includes('references/'),
          bodyTextSnapshot: bodyText,
          contextTextSnapshot: sourcePane ? sourcePane.innerText : '',
          taskTextSnapshot: taskPane ? taskPane.innerText : '',
          rawImageCount: document.querySelectorAll('img').length,
          overflowingCount: overflowing.length,
          overflowingTags: overflowing.slice(0, 8).map((item) => item.tagName.toLowerCase())
        };
      }

      window.${windowName} = {
        inspect,
        resetAll,
        applyWrongAttempt(taskIndex = 0) {
          resetAll();
          const card = cards[taskIndex];
          if (card) {
            fillWrong(card, models[taskIndex]);
            card.querySelector('.check-button').click();
          }
          return inspect();
        },
        correctTask(taskIndex = 0) {
          resetAll();
          const card = cards[taskIndex];
          if (card) {
            fillWrong(card, models[taskIndex]);
            card.querySelector('.check-button').click();
            fillCorrect(card, models[taskIndex]);
            card.querySelector('.check-button').click();
          }
          return inspect();
        },
        completeDemoPath() {
          resetAll();
          cards.forEach((card, index) => {
            fillCorrect(card, models[index]);
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
