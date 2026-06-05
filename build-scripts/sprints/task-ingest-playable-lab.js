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

function graphMetrics(interaction) {
  const axes = interaction.axes || { x: { label: 'Q', min: 0, max: 1 }, y: { label: 'P', min: 0, max: 1 } };
  const width = 720;
  const height = 420;
  const padL = 82;
  const padR = 34;
  const padT = 28;
  const padB = 68;
  const xMin = Number(axes.x.min ?? 0);
  const xMax = Number(axes.x.max ?? 1);
  const yMin = Number(axes.y.min ?? 0);
  const yMax = Number(axes.y.max ?? 1);
  const sx = (x) => padL + ((Number(x) - xMin) / (xMax - xMin || 1)) * (width - padL - padR);
  const sy = (y) => height - padB - ((Number(y) - yMin) / (yMax - yMin || 1)) * (height - padT - padB);
  return { axes, width, height, padL, padR, padT, padB, xMin, xMax, yMin, yMax, sx, sy };
}

function axisTickValues(axis, fallback) {
  const explicit = Array.isArray(axis.ticks) ? axis.ticks.map(Number).filter(Number.isFinite) : [];
  return explicit.length > 0 ? explicit : fallback;
}

function formatTick(value, axis) {
  const decimals = Number.isInteger(axis.tickDecimals) ? axis.tickDecimals : (value % 1 ? 2 : 0);
  const formatted = Number(value).toFixed(Math.max(0, decimals));
  return axis.tickFormat === 'decimal_comma' ? formatted.replace('.', ',') : formatted;
}

function emptyGraphSvg(interaction) {
  const metrics = graphMetrics(interaction);
  const { axes, width, height, padL, padR, padT, padB, xMin, xMax, yMin, yMax, sx, sy } = metrics;
  const xTicks = axisTickValues(axes.x, [xMin, (xMin + xMax) / 4, (xMin + xMax) / 2, (xMin + xMax) * 3 / 4, xMax])
    .map((value) => `<g><line class="grid-line" x1="${sx(value).toFixed(1)}" y1="${padT}" x2="${sx(value).toFixed(1)}" y2="${height - padB}"></line><text class="scale-label reveal-after-axes" x="${sx(value).toFixed(1)}" y="${height - padB + 24}">${escapeHtml(formatTick(value, axes.x))}</text></g>`)
    .join('');
  const yTicks = axisTickValues(axes.y, [yMin, (yMin + yMax) / 4, (yMin + yMax) / 2, (yMin + yMax) * 3 / 4, yMax])
    .map((value) => `<g><line class="grid-line" x1="${padL}" y1="${sy(value).toFixed(1)}" x2="${width - padR}" y2="${sy(value).toFixed(1)}"></line><text class="scale-label reveal-after-axes" x="${padL - 14}" y="${sy(value).toFixed(1)}" text-anchor="end">${escapeHtml(formatTick(value, axes.y))}</text></g>`)
    .join('');
  return `<svg class="graph-grid-svg graph-click-surface" viewBox="0 0 ${width} ${height}" role="img" tabindex="0" aria-label="${escapeAttr(interaction.emptyGraphAltText || 'Leeg grafiekwerkvlak')}" data-graph-click-surface="true" data-x-min="${xMin}" data-x-max="${xMax}" data-y-min="${yMin}" data-y-max="${yMax}" data-pad-l="${padL}" data-pad-r="${padR}" data-pad-t="${padT}" data-pad-b="${padB}">
    <rect width="${width}" height="${height}" rx="8"></rect>
    <g class="grid">${xTicks}${yTicks}</g>
    <line class="axis" x1="${padL}" y1="${height - padB}" x2="${width - padR}" y2="${height - padB}"></line>
    <line class="axis" x1="${padL}" y1="${height - padB}" x2="${padL}" y2="${padT}"></line>
    <rect class="plot-hit-area" x="${padL}" y="${padT}" width="${width - padL - padR}" height="${height - padT - padB}" data-plot-hit-area="true"></rect>
    <g class="constructed-line" data-completed-graph="true" data-graph-line="constructed" hidden>
      <line x1="0" y1="0" x2="0" y2="0"></line>
    </g>
    <g class="placed-points" data-placed-points="true"></g>
    <text class="axis-label reveal-after-axes" x="${(width + padL - padR) / 2}" y="${height - 16}">${escapeHtml(axes.x.label)}</text>
    <text class="axis-label y-label reveal-after-axes" transform="translate(22 ${(height - padB + padT) / 2}) rotate(-90)">${escapeHtml(axes.y.label)}</text>
  </svg>`;
}

function completedGraphSvgFromTask(task) {
  const interaction = task.interaction || {};
  const expected = task.expected || {};
  return graphSvg({
    axes: interaction.axes || { x: { label: 'Q', min: 0, max: 1 }, y: { label: 'P', min: 0, max: 1 } },
    series: [{ label: 'Gemaakte P-Q-grafiek', points: expected.points || [] }],
    altText: 'Voltooide P-Q-grafiek na correcte constructie.'
  });
}

function visibleBlockTitle(block) {
  const source = String(block.sourceLabel || '').trim();
  const caption = String(block.caption || block.title || '').trim();
  if (!source) return caption;
  if (!caption) return source;
  const normalizedCaption = caption.replace(new RegExp(`^${source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[:\\-–—]?\\s*`, 'i'), '').trim();
  return normalizedCaption ? `${source} — ${normalizedCaption}` : source;
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
    return `<h2 class="source-heading">${escapeHtml(visibleBlockTitle(block))}</h2>${paragraphs(block.bodyMarkdown)}`;
  }
  if (block.type === 'table') {
    const headers = block.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('');
    const rows = block.rows
      .map((row) => `<tr>${row.map((cell, index) => `<${index === 0 ? 'th scope="row"' : 'td'}>${escapeHtml(cell)}</${index === 0 ? 'th' : 'td'}>`).join('')}</tr>`)
      .join('');
    const title = visibleBlockTitle(block);
    return `<h2 class="source-heading">${escapeHtml(title)}</h2><div class="table-scroll"><table aria-label="${escapeAttr(title)}"><caption class="visually-hidden">${escapeHtml(title)}</caption><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  if (block.type === 'graph') {
    return `<h2 class="source-heading">${escapeHtml(visibleBlockTitle(block))}</h2>${graphSvg(block)}`;
  }
  if (block.type === 'formula') {
    const vars = (block.variables || []).map((item) => `<div><dt>${escapeHtml(item.symbol)}</dt><dd>${escapeHtml(item.meaning)}</dd></div>`).join('');
    return `<h2 class="source-heading">${escapeHtml(visibleBlockTitle(block))}</h2><div class="formula-scroll"><pre><code>${escapeHtml(block.expression)}</code></pre></div><dl>${vars}</dl>`;
  }
  if (block.type === 'flowchart') {
    const nodes = (block.nodes || []).map((node) => `<li>${escapeHtml(node.label)}</li>`).join('');
    return `<h2 class="source-heading">${escapeHtml(visibleBlockTitle(block))}</h2><ol class="flow-list">${nodes}</ol>`;
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

function sourceBlockHtml(block, transform) {
  const role = contextRole(block);
  const hasGraphConstruction = (transform.taskSet.tasks || []).some((task) => task.family === 'graph_construction_substitute');
  if (role === 'prompt') return '';
  if (hasGraphConstruction && block.type === 'graph' && block.renderPolicy && block.renderPolicy.defaultVisibleBeforeGraphConstruction === false) {
    return '';
  }
  return blockHtml(block);
}

function operationLabel(operationId) {
  return String(operationId || '').replace(/_/g, ' ');
}

function displayPrompt(task) {
  const prompts = {
    'q3-source-values': 'Wat moet je vergelijken om te bepalen wanneer het verhoogde eigen risico voordeliger is?',
    'q3-annual-premium-formula': 'Bouw de formule waarmee je per variant de jaarpremie berekent.',
    'q3-operation-order': 'Zet de rekenstappen in de volgorde die past bij het correctiemodel.',
    'q3-calculation': 'Bereken de meerkosten per jaar en noteer uitwerking, antwoord en eenheid.',
    'q3-source-chain': 'Bouw de bronketen van tabelwaarden naar conclusie, zonder stappen over te slaan.',
    'q3-threshold-direction': 'Leg uit of Zoohee boven de wettelijke variant uitkomt en onderbouw dat met het berekende verschil.',
    'tb113-table-value': 'Kies uit de tabel hoeveel wordt gevraagd bij een prijs van EUR 1.50.',
    'tb113-graph-construction': 'Teken de P-Q-grafiek bij Tabel 1: kies assen, klik twee punten in het werkvlak en bevestig de dalende lijn.',
    'tb113-axis-convention': 'Benoem welke grootheid op elke as hoort voordat je de grafiek leest.',
    'tb113-graph-step-order': 'Zet de stappen voor het tekenen van de vraaglijn in de juiste volgorde.',
    'tb113-point-placement': 'Plaats een punt uit de tabel als coordinatenpaar in de grafiek.',
    'tb113-interpolation-source-values': 'Kies de twee bronwaarden waartussen je de gevraagde prijs-hoeveelheid-combinatie afleest.',
    'tb113-graph-reading': 'Lees uit je P-Q-grafiek af welke hoeveelheid hoort bij P = EUR 1.75.',
    'tb113-quantity-drop-check': 'Controleer één halvering: kies een interval en benoem dat de nieuwe Q de helft is van de oude Q.',
    'tb113-claim-calculation': 'Bereken het prijsinterval bij een daling van 50 procent en noteer ook een geldig alternatief als de bron dit toelaat.',
    'tb113-source-chain': 'Bouw de redeneringsketen van tekst, tabel en grafiek naar de conclusie.',
    'tb113-answer-form': 'Schrijf het antwoord in de gevraagde vorm: asafspraak, brongebruik en conclusie.'
  };
  return prompts[task.id] || task.prompt;
}

function instructionRows(task) {
  const byFamily = {
    source_value_selection: ['Kies de gevraagde bronwaarden.', 'Gebruik maximaal vier noodzakelijke cellen.', 'Antwoordvorm: geselecteerde tabelcellen.'],
    formula_builder: ['Klik formuleblokken in de juiste volgorde.', 'Gebruik alleen blokken uit de bank.', 'Antwoordvorm: geordende formuleketen.'],
    step_ordering: ['Klik stappen in de juiste volgorde.', 'Gebruik de bron of procedurehulp alleen als dat nodig is.', 'Antwoordvorm: geordende stappenreeks.'],
    source_chain_builder: ['Klik bronketen-onderdelen in de juiste volgorde.', 'Verbind bronwaarde, bewerking en conclusie.', 'Antwoordvorm: volledige redeneringsketen.'],
    table_value_selection: ['Lees de tabel gericht af.', 'Kies precies een waarde.', 'Antwoordvorm: geselecteerde tabelwaarde.'],
    choice: ['Lees de bron gericht af.', 'Kies precies een optie.', 'Antwoordvorm: geselecteerde optie.'],
    graph_reading: ['Lees de grafiek bij de genoemde aswaarde.', 'Controleer of je de juiste as gebruikt.', 'Antwoordvorm: getal met eventuele eenheid.'],
    graph_construction_substitute: ['Kies de P-Q-assen.', 'Klik twee tabelpunten in het werkvlak.', 'Bevestig dat je de punten tot een dalende lijn verbindt.'],
    numeric_input: ['Bepaal het gevraagde getal.', 'Gebruik bronwaarden waar nodig.', 'Antwoordvorm: getal met eventuele eenheid.'],
    point_placement: ['Gebruik de tabelwaarde als coordinatenpaar.', 'Vul beide assen in.', 'Antwoordvorm: x- en y-waarde.'],
    calculation_work_capture: task.interaction?.selectionMode === 'interval_halving_check'
      ? ['Kies één interval.', 'Lees de oude en nieuwe hoeveelheid die verschijnen.', 'Kies dat de nieuwe hoeveelheid de helft is van de oude hoeveelheid.']
      : ['Schrijf de berekening uit.', 'Noteer het eindantwoord en de eenheid apart.', 'Antwoordvorm: uitwerking plus eindantwoord.'],
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

function graphAxisOptions() {
  return [
    '<option value="">Kies as...</option>',
    '<option value="hoeveelheid q">Hoeveelheid Q</option>',
    '<option value="prijs p">Prijs P</option>',
    '<option value="omzet">Omzet</option>',
    '<option value="tijd">Tijd</option>'
  ].join('');
}

function graphConstructionControlHtml(task) {
  const interaction = task.interaction || {};
  const pointCount = Number(interaction.pointCount || 0);
  const rows = Array.from({ length: pointCount }, (_, index) => `<div class="point-entry-row">
    <span>Punt ${index + 1}</span>
    <label>${escapeHtml(interaction.xInputLabel || 'x')}<input class="play-control graph-point-x" type="text" inputmode="decimal" data-graph-point-index="${index}" data-graph-axis="x"></label>
    <label>${escapeHtml(interaction.yInputLabel || 'y')}<input class="play-control graph-point-y" type="text" inputmode="decimal" data-graph-point-index="${index}" data-graph-axis="y"></label>
  </div>`).join('');
  return `<div class="graph-construction-layout">
    <section class="graph-workspace" data-graph-workspace="construction" data-required-points="${pointCount}">
      <h3>${escapeHtml(interaction.workspaceTitle || 'Grafiekworkspace')}</h3>
      <p class="graph-stage-note" data-graph-stage-note="true">${escapeHtml(interaction.preAxisNote || 'Kies eerst de juiste assen. Daarna verschijnen labels en schaal.')}</p>
      <div class="axis-select-grid graph-axis-controls" data-axis-controls-attached="true">
        <label>${escapeHtml(interaction.xAxisLabel || 'Horizontale as')}<select class="play-control graph-axis-x" data-graph-axis="x">${graphAxisOptions()}</select></label>
        <label>${escapeHtml(interaction.yAxisLabel || 'Verticale as')}<select class="play-control graph-axis-y" data-graph-axis="y">${graphAxisOptions()}</select></label>
      </div>
      ${emptyGraphSvg(interaction)}
      <div class="graph-click-toolbar">
        <p class="graph-point-status" data-graph-point-status="true">0 / ${pointCount} punten geplaatst</p>
        <button type="button" class="clear-graph-points">Wis punten</button>
      </div>
    </section>
    <section class="graph-construction-controls" aria-label="Grafiekconstructie controles">
      <p class="click-instruction">${escapeHtml(interaction.clickInstruction || 'Klik twee punten op de lijn in het grafiekwerkvlak.')}</p>
      <details class="typed-point-fallback" data-typed-point-fallback="collapsed">
        <summary>Coordinaten typen als fallback</summary>
        <fieldset class="point-entry-grid">
          <legend>${escapeHtml(interaction.pointRowsLabel || 'Plaats punten')}</legend>
          ${rows}
        </fieldset>
      </details>
      <label class="line-confirmation"><input class="play-control graph-line-confirm" type="checkbox" data-graph-line-confirmation="true"> ${escapeHtml(interaction.lineConfirmationLabel || 'Ik verbind de punten.')}</label>
    </section>
  </div>`;
}

function sourceCellSelectionControlHtml(task) {
  const interaction = task.interaction || {};
  const values = interaction.values || [];
  const requiredCount = (task.expected?.selections || []).length;
  const distractorLimit = Number(interaction.distractorLimit || 2);
  const answerValues = values.filter((item) => item.kind === 'answer').slice(0, requiredCount);
  const distractors = values.filter((item) => item.kind === 'distractor').slice(0, distractorLimit);
  const options = answerValues.concat(distractors);
  return `<fieldset class="source-cell-selection" data-source-cell-selection="compact" data-required-selections="${requiredCount}" data-distractor-count="${distractors.length}">
    <legend>${escapeHtml(interaction.selectionLabel || 'Klik de tabelcellen die je nodig hebt')}</legend>
    <div class="source-cell-grid">${options.map((item) => `<label class="source-cell-option" data-source-cell-kind="${escapeAttr(item.kind || '')}"><input class="play-control source-cell-select" type="checkbox" value="${escapeAttr(item.id)}"> <span><strong>${escapeHtml(item.label || item.value || item.id)}</strong><small>${escapeHtml([item.sourceLabel, item.unit, item.period].filter(Boolean).join(' - '))}</small></span></label>`).join('')}</div>
  </fieldset>`;
}

function carryForwardResponseHtml(task) {
  const interaction = task.interaction || {};
  const carried = interaction.carryForward || {};
  const directionOptions = interaction.directionOptions || [
    { id: 'lager dan', label: 'lager dan' },
    { id: 'hoger dan', label: 'hoger dan' },
    { id: 'gelijk aan', label: 'gelijk aan' }
  ];
  return `<div class="carry-forward-response" data-carry-forward="true" data-carry-from-index="${Number(carried.fromTaskIndex ?? 1)}" data-carried-value="${escapeAttr(carried.value || '')}" data-not-ready-text="${escapeAttr(carried.notReadyText || 'Bereken eerst het grensbedrag in taak 2.')}">
    <label>${escapeHtml(interaction.directionLabel || 'Richting')}<select class="play-control structured-field direction-select" data-field-id="direction" disabled><option value="">Kies richting...</option>${directionOptions.map((option) => `<option value="${escapeAttr(option.id)}">${escapeHtml(option.label)}</option>`).join('')}</select></label>
    <label>${escapeHtml(carried.label || 'Berekend grensbedrag')}<output class="carried-value" data-carried-output="true">${escapeHtml(carried.notReadyText || 'Bereken eerst het grensbedrag in taak 2.')}</output><input class="play-control structured-field carried-threshold-field" type="hidden" data-field-id="threshold" value=""></label>
    <p class="sentence-preview" data-sentence-preview="true">${escapeHtml(interaction.sentenceTemplate || 'Bij zorgkosten lager dan het grensbedrag is het verhoogde eigen risico voordeliger.')}</p>
  </div>`;
}

function calculationWorkCaptureHtml(task) {
  const interaction = task.interaction || {};
  if (interaction.selectionMode === 'interval_halving_check') {
    const options = interaction.intervalOptions || [];
    const conclusionOptions = interaction.conclusionOptions || [];
    return `<div class="interval-halving-check" data-interval-halving-check="true">
      <fieldset class="choice-options interval-options">
        <legend>${escapeHtml(interaction.intervalLabel || 'Kies een interval')}</legend>
        ${options.map((option) => `<label><input class="play-control interval-choice" type="radio" name="interval-${escapeAttr(task.id)}" value="${escapeAttr(option.id)}" data-final-answer="${escapeAttr(option.finalAnswer || option.label || option.id)}" data-work="${escapeAttr(option.work || '')}" data-old-q="${escapeAttr(option.oldQuantity || '')}" data-new-q="${escapeAttr(option.newQuantity || '')}" data-correct="${option.correct === true ? 'true' : 'false'}"> ${escapeHtml(option.label || option.id)}</label>`).join('')}
      </fieldset>
      <dl class="auto-fill-values" data-auto-fill-values="true">
        <div><dt>Oude Q</dt><dd data-old-quantity="true">Kies eerst een interval</dd></div>
        <div><dt>Nieuwe Q</dt><dd data-new-quantity="true">Kies eerst een interval</dd></div>
      </dl>
      <label>${escapeHtml(interaction.relationLabel || 'Relatie')}<select class="play-control halving-relation"><option value="">Kies...</option>${(interaction.relationOptions || []).map((option) => `<option value="${escapeAttr(option.id)}">${escapeHtml(option.label)}</option>`).join('')}</select></label>
      <label>${escapeHtml(interaction.conclusionLabel || 'Conclusie')}<select class="play-control halving-conclusion"><option value="">Kies conclusie...</option>${conclusionOptions.map((option) => `<option value="${escapeAttr(option.id)}" data-final-answer="${escapeAttr(option.finalAnswer || option.label || option.id)}" data-correct="${option.correct === true ? 'true' : 'false'}">${escapeHtml(option.label || option.id)}</option>`).join('')}</select></label>
      <input class="calc-work" type="hidden" value="">
      <input class="calc-final" type="hidden" value="">
      <input class="calc-unit" type="hidden" value="">
    </div>`;
  }
  const support = interaction.progressiveSupport;
  const supportHtml = support ? `<div class="progressive-support" data-progressive-support="true" data-support-complete="false">
    <p class="support-note">${escapeHtml(support.label || 'Hulp verschijnt na mislukte pogingen.')}</p>
    <button type="button" class="support-button support-hint-button" data-support-level="1" hidden>${escapeHtml(support.hintButton || 'Hulp')}</button>
    <div class="support-content support-hint" data-support-content="1" hidden>${paragraphs(support.hintText || '')}</div>
    <div class="support-content support-setup" data-support-content="2" hidden>${paragraphs(support.partialSetup || '')}</div>
    <button type="button" class="support-button support-solution-button" data-support-level="3" hidden>${escapeHtml(support.solutionButton || 'Toon uitwerking')}</button>
    <div class="support-content support-solution" data-support-content="3" hidden>${paragraphs(support.solutionText || '')}</div>
  </div>` : '';
  return `<label>${escapeHtml(interaction.workLabel || 'Uitwerking')}<textarea class="play-control calc-work" rows="4" data-response-key="work"></textarea></label><div class="control-row"><label>${escapeHtml(interaction.finalAnswerLabel || 'Eindantwoord')}<input class="play-control calc-final" type="text" data-response-key="finalAnswer" placeholder="${escapeAttr(interaction.finalAnswerPlaceholder || '')}"></label><label>${escapeHtml(interaction.unitNotationLabel || 'Eenheid')}<input class="play-control calc-unit" type="text" data-response-key="unit" placeholder="${escapeAttr(interaction.unitNotationPlaceholder || '')}"></label></div>${supportHtml}`;
}

function controlHtml(task, index) {
  if (task.family === 'graph_construction_substitute') {
    return graphConstructionControlHtml(task);
  }
  if (task.family === 'calculation_work_capture') {
    return calculationWorkCaptureHtml(task);
  }
  if (task.family === 'structured_short_response' && task.interaction?.carryForward) {
    return carryForwardResponseHtml(task);
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
    if (task.interaction?.selectionMode === 'compact_source_cells') {
      return sourceCellSelectionControlHtml(task);
    }
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
  const extraClass = task.family === 'graph_construction_substitute' ? ' graph-construction-card' : '';
  return `<article class="task-card${extraClass}" data-task-family="${escapeAttr(task.family)}" data-task-index="${index}" data-context-ref-count="${(task.contextRefs || []).length}">
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

function taskQuestionHtml(transform) {
  const prompts = (transform.taskSet.contextBlocks || []).filter((block) => contextRole(block) === 'prompt');
  if (prompts.length === 0) return '';
  return `<section class="task-question-panel" data-right-pane-question="true" aria-label="Originele vraag">${prompts.map((block) => `<p class="question-source-label">${escapeHtml(block.title || 'Vraag')}</p>${paragraphs(block.bodyMarkdown)}`).join('')}</section>`;
}

function buildPlayableLabHtml(options) {
  const { sprintId, transform, windowName, title, kicker, intro, reviewCheck } = options;
  const hasGraphConstruction = (transform.taskSet.tasks || []).some((task) => task.family === 'graph_construction_substitute');
  const blocks = transform.taskSet.contextBlocks.map((block) => sourceBlockHtml(block, transform)).filter(Boolean).join('\n');
  const tasks = transform.taskSet.tasks.map((task, index) => taskHtml(task, index, transform)).join('\n');
  const questionPanel = taskQuestionHtml(transform);
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
    .lab-shell.has-graph-construction {
      grid-template-columns: minmax(340px, 0.72fr) minmax(720px, 1.28fr);
    }
    .source-pane {
      position: sticky;
      top: 72px;
      max-height: calc(100vh - 92px);
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
    .task-question-panel {
      background: var(--panel);
      border: 1px solid var(--primary);
      border-radius: 8px;
      padding: 13px 15px;
      margin-bottom: 14px;
    }
    .task-question-panel p:last-child {
      margin-bottom: 0;
      font-weight: 700;
    }
    .question-source-label {
      color: var(--primary);
      font-size: 0.92rem;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .ctx-markdown {
      background: transparent;
      border-color: transparent;
      padding: 0;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
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
    .source-heading {
      color: var(--primary);
      font-size: 1.02rem;
      font-weight: 800;
      margin: 0 0 9px;
    }
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
    .has-graph-construction table {
      min-width: 100%;
    }
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
    .graph-construction-card {
      align-content: start;
    }
    .graph-construction-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
      align-items: start;
    }
    .graph-workspace {
      min-width: 0;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
    }
    .graph-stage-note {
      color: var(--muted);
      font-weight: 700;
    }
    .graph-workspace.axes-selected .graph-stage-note {
      color: var(--primary);
    }
    .graph-grid-svg {
      width: 100%;
      min-height: 360px;
      display: block;
      touch-action: manipulation;
    }
    .graph-grid-svg rect { fill: var(--graph-bg); stroke: var(--line); }
    .graph-grid-svg .axis { stroke: var(--text); stroke-width: 2; }
    .graph-grid-svg .grid-line { stroke: var(--muted); stroke-width: 1.1; opacity: 0.55; }
    .graph-grid-svg text { fill: var(--muted); font-size: 13px; dominant-baseline: middle; }
    .graph-grid-svg .axis-label { fill: var(--text); font-weight: 700; text-anchor: middle; dominant-baseline: auto; }
    .graph-grid-svg .constructed-line line {
      stroke: var(--primary);
      stroke-width: 4;
      stroke-linecap: round;
    }
    .graph-grid-svg .constructed-line[hidden] {
      display: none;
    }
    .graph-workspace:not(.axes-selected) .reveal-after-axes {
      opacity: 0;
      visibility: hidden;
    }
    .plot-hit-area {
      fill: transparent;
      cursor: crosshair;
    }
    .placed-points circle {
      fill: var(--accent);
      stroke: var(--panel);
      stroke-width: 3;
    }
    .placed-points text {
      fill: var(--text);
      font-size: 12px;
      font-weight: 700;
    }
    .graph-click-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
    }
    .graph-point-status {
      margin: 0;
      color: var(--muted);
      font-weight: 700;
    }
    .clear-graph-points {
      background: transparent;
      color: var(--primary);
      border: 1px solid var(--primary);
    }
    .graph-construction-controls {
      display: grid;
      gap: 10px;
    }
    .axis-select-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .graph-axis-controls {
      margin-bottom: 8px;
      padding: 10px;
      background: var(--soft);
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    .point-entry-grid {
      display: grid;
      gap: 8px;
    }
    .typed-point-fallback {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      padding: 9px 10px;
    }
    .typed-point-fallback summary {
      cursor: pointer;
      font-weight: 700;
      color: var(--primary);
    }
    .point-entry-row {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr) minmax(0, 1fr);
      gap: 8px;
      align-items: end;
    }
    .point-entry-row span {
      color: var(--muted);
      font-weight: 700;
      padding-bottom: 9px;
    }
    .line-confirmation {
      display: flex;
      gap: 8px;
      align-items: center;
      font-weight: 700;
    }
    .line-confirmation input {
      width: auto;
    }
    .click-instruction {
      color: var(--muted);
      font-weight: 700;
    }
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
    .source-cell-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .source-cell-option {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 9px;
      align-items: start;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      padding: 10px;
      font-weight: 700;
    }
    .source-cell-option input {
      width: auto;
      margin-top: 4px;
    }
    .source-cell-option small {
      display: block;
      color: var(--muted);
      font-weight: 600;
      line-height: 1.35;
    }
    .carry-forward-response {
      display: grid;
      grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr);
      gap: 10px;
      align-items: start;
    }
    .carried-value {
      min-height: 41px;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--panel);
      padding: 9px 10px;
      color: var(--muted);
      font-weight: 700;
    }
    .carry-forward-response.is-ready .carried-value {
      color: var(--text);
    }
    .sentence-preview {
      grid-column: 1 / -1;
      margin: 0;
      color: var(--muted);
      font-weight: 700;
    }
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
      .control-row, .field-grid, .pair-row, .flow-list, .graph-construction-layout, .axis-select-grid, .source-cell-grid, .carry-forward-response { grid-template-columns: 1fr; }
      .lab-shell.has-graph-construction { grid-template-columns: minmax(0, 1fr); }
      .graph-grid-svg { min-height: 300px; }
      .point-entry-row { grid-template-columns: 1fr; }
      .point-entry-row span { padding-bottom: 0; }
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
  <main class="lab-shell${hasGraphConstruction ? ' has-graph-construction' : ''}">
    <aside class="source-pane" aria-label="Bronnen en hulp"><section class="ctx-grid">${blocks}</section></aside>
    <section class="task-pane" aria-label="Vragen">${questionPanel}<section class="task-grid">${tasks}</section><aside class="review-panel"><strong>Reviewer check:</strong> ${escapeHtml(reviewCheck)}</aside></section>
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
        if (!actual) return false;
        return (accepted || []).some((candidate) => {
          const expected = normalize(candidate);
          return actual === expected || actual.includes(expected) || expected.includes(actual);
        });
      }

      function acceptedTextExact(value, accepted) {
        const actual = normalize(value);
        if (!actual) return false;
        return (accepted || []).some((candidate) => actual === normalize(candidate));
      }

      function workGroupOptions(group) {
        if (Array.isArray(group)) return group;
        return group?.any || group?.accepted || [];
      }

      function graphPointsMatch(actualPoints, expected) {
        const expectedPoints = (expected.points || []).map((point) => ({ x: Number(point.x), y: Number(point.y), matched: false }));
        if (!Array.isArray(actualPoints) || actualPoints.length !== expectedPoints.length) return false;
        const tx = Number(expected.toleranceX ?? expected.tolerance ?? 0);
        const ty = Number(expected.toleranceY ?? expected.tolerance ?? 0);
        for (const actual of actualPoints) {
          const x = numberValue(actual.x);
          const y = numberValue(actual.y);
          if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
          const match = expectedPoints.find((point) => !point.matched && Math.abs(x - point.x) <= tx && Math.abs(y - point.y) <= ty);
          if (!match) return false;
          match.matched = true;
        }
        return expectedPoints.every((point) => point.matched);
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

      function expectedRoleByValue(model) {
        const roles = {};
        (model.expected.selections || []).forEach((selection) => {
          roles[selection.valueId] = selection.role;
        });
        return roles;
      }

      function graphPointPosition(svg, x, y) {
        const xMin = Number(svg.dataset.xMin || 0);
        const xMax = Number(svg.dataset.xMax || 1);
        const yMin = Number(svg.dataset.yMin || 0);
        const yMax = Number(svg.dataset.yMax || 1);
        const padL = Number(svg.dataset.padL || 0);
        const padR = Number(svg.dataset.padR || 0);
        const padT = Number(svg.dataset.padT || 0);
        const padB = Number(svg.dataset.padB || 0);
        const viewBox = svg.viewBox.baseVal;
        const plotWidth = viewBox.width - padL - padR;
        const plotHeight = viewBox.height - padT - padB;
        return {
          cx: padL + ((Number(x) - xMin) / (xMax - xMin || 1)) * plotWidth,
          cy: viewBox.height - padB - ((Number(y) - yMin) / (yMax - yMin || 1)) * plotHeight
        };
      }

      function clearGraphPoints(card) {
        const svg = card.querySelector('[data-graph-click-surface="true"]');
        const group = svg?.querySelector('[data-placed-points="true"]');
        if (group) group.innerHTML = '';
        hideConstructedLine(card);
        updateGraphPointStatus(card);
      }

      function hideConstructedLine(card) {
        const lineGroup = card.querySelector('[data-graph-line="constructed"]');
        if (lineGroup) lineGroup.setAttribute('hidden', '');
      }

      function drawConstructedLine(card) {
        const svg = card.querySelector('[data-graph-click-surface="true"]');
        const lineGroup = svg?.querySelector('[data-graph-line="constructed"]');
        const line = lineGroup?.querySelector('line');
        const points = Array.from(card.querySelectorAll('.placed-graph-point'));
        if (!svg || !lineGroup || !line || points.length < 2) return false;
        const first = points[0];
        const last = points[points.length - 1];
        const firstPos = graphPointPosition(svg, first.dataset.x, first.dataset.y);
        const lastPos = graphPointPosition(svg, last.dataset.x, last.dataset.y);
        line.setAttribute('x1', firstPos.cx.toFixed(1));
        line.setAttribute('y1', firstPos.cy.toFixed(1));
        line.setAttribute('x2', lastPos.cx.toFixed(1));
        line.setAttribute('y2', lastPos.cy.toFixed(1));
        lineGroup.removeAttribute('hidden');
        return true;
      }

      function placeGraphPoint(card, x, y) {
        const workspace = card.querySelector('[data-graph-workspace="construction"]');
        const svg = workspace?.querySelector('[data-graph-click-surface="true"]');
        const group = svg?.querySelector('[data-placed-points="true"]');
        if (!svg || !group) return;
        const required = Number(workspace.dataset.requiredPoints || 2);
        const points = Array.from(group.querySelectorAll('.placed-graph-point'));
        if (points.length >= required) return;
        const position = graphPointPosition(svg, x, y);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('placed-graph-point');
        g.dataset.x = String(x);
        g.dataset.y = String(y);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', position.cx.toFixed(1));
        circle.setAttribute('cy', position.cy.toFixed(1));
        circle.setAttribute('r', '8');
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', (position.cx + 12).toFixed(1));
        label.setAttribute('y', (position.cy - 10).toFixed(1));
        label.textContent = String(points.length + 1);
        g.append(circle, label);
        group.appendChild(g);
        hideConstructedLine(card);
        updateGraphPointStatus(card);
      }

      function nearestExpectedPoint(model, x, y) {
        const points = model.expected.points || [];
        if (points.length === 0) return { x, y };
        return points
          .map((point) => ({ point, distance: Math.hypot(Number(point.x) - x, Number(point.y) - y) }))
          .sort((a, b) => a.distance - b.distance)[0].point;
      }

      function clickToGraphValue(svg, event, model) {
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const local = point.matrixTransform(svg.getScreenCTM().inverse());
        const viewBox = svg.viewBox.baseVal;
        const padL = Number(svg.dataset.padL || 0);
        const padR = Number(svg.dataset.padR || 0);
        const padT = Number(svg.dataset.padT || 0);
        const padB = Number(svg.dataset.padB || 0);
        const xMin = Number(svg.dataset.xMin || 0);
        const xMax = Number(svg.dataset.xMax || 1);
        const yMin = Number(svg.dataset.yMin || 0);
        const yMax = Number(svg.dataset.yMax || 1);
        const clampedX = Math.max(padL, Math.min(viewBox.width - padR, local.x));
        const clampedY = Math.max(padT, Math.min(viewBox.height - padB, local.y));
        const x = xMin + ((clampedX - padL) / (viewBox.width - padL - padR || 1)) * (xMax - xMin);
        const y = yMin + ((viewBox.height - padB - clampedY) / (viewBox.height - padT - padB || 1)) * (yMax - yMin);
        return nearestExpectedPoint(model, x, y);
      }

      function updateGraphPointStatus(card) {
        const workspace = card.querySelector('[data-graph-workspace="construction"]');
        const required = Number(workspace?.dataset.requiredPoints || 0);
        const count = card.querySelectorAll('.placed-graph-point').length;
        const status = card.querySelector('[data-graph-point-status="true"]');
        if (status) status.textContent = count + ' / ' + required + ' punten geplaatst';
      }

      function updateGraphAxisState(card, model) {
        const workspace = card.querySelector('[data-graph-workspace="construction"]');
        if (!workspace) return false;
        const xValue = card.querySelector('.graph-axis-x')?.value || '';
        const yValue = card.querySelector('.graph-axis-y')?.value || '';
        const ok = acceptedText(xValue, model.expected.axes?.xAccepted || []) && acceptedText(yValue, model.expected.axes?.yAccepted || []);
        workspace.classList.toggle('axes-selected', ok);
        const note = workspace.querySelector('[data-graph-stage-note="true"]');
        if (note) {
          note.textContent = ok
            ? 'Assen kloppen. Klik nu twee punten uit de tabel in het werkvlak.'
            : 'Kies eerst de juiste assen. Daarna verschijnen labels en schaal.';
        }
        return ok;
      }

      function installGraphConstruction(card, model) {
        const svg = card.querySelector('[data-graph-click-surface="true"]');
        if (!svg) return;
        card.querySelectorAll('.graph-axis-x, .graph-axis-y').forEach((select) => {
          select.addEventListener('change', () => updateGraphAxisState(card, model));
        });
        svg.addEventListener('click', (event) => {
          if (!updateGraphAxisState(card, model)) return;
          const value = clickToGraphValue(svg, event, model);
          placeGraphPoint(card, value.x, value.y);
        });
        const clear = card.querySelector('.clear-graph-points');
        if (clear) clear.addEventListener('click', () => clearGraphPoints(card));
        updateGraphAxisState(card, model);
        updateGraphPointStatus(card);
      }

      function installIntervalHalving(card) {
        const box = card.querySelector('[data-interval-halving-check="true"]');
        if (!box) return;
        const update = () => {
          const selected = box.querySelector('.interval-choice:checked');
          const oldTarget = box.querySelector('[data-old-quantity="true"]');
          const newTarget = box.querySelector('[data-new-quantity="true"]');
          const work = box.querySelector('.calc-work');
          const final = box.querySelector('.calc-final');
          const unit = box.querySelector('.calc-unit');
          const conclusion = box.querySelector('.halving-conclusion');
          const selectedConclusion = conclusion?.selectedOptions?.[0];
          if (oldTarget) oldTarget.textContent = selected ? selected.dataset.oldQ : 'Kies eerst een interval';
          if (newTarget) newTarget.textContent = selected ? selected.dataset.newQ : 'Kies eerst een interval';
          if (work) work.value = selected ? selected.dataset.work : '';
          if (final) final.value = selectedConclusion?.dataset.finalAnswer || selected?.dataset.finalAnswer || '';
          if (unit) unit.value = box.querySelector('.halving-relation')?.value === 'helft' ? '50 procent daling' : '';
        };
        box.querySelectorAll('.interval-choice, .halving-relation, .halving-conclusion').forEach((control) => {
          control.addEventListener('change', update);
        });
        update();
      }

      function installProgressiveSupport(card) {
        const support = card.querySelector('[data-progressive-support="true"]');
        if (!support) return;
        support.querySelectorAll('.support-button').forEach((button) => {
          button.addEventListener('click', () => {
            const level = button.dataset.supportLevel;
            const content = support.querySelector('[data-support-content="' + CSS.escape(level) + '"]');
            if (content) content.hidden = false;
            if (level === '3') {
              support.dataset.supportComplete = 'true';
              card.classList.add('support-complete');
              updateCarryovers();
            }
          });
        });
      }

      function updateProgressiveSupport(card) {
        const support = card.querySelector('[data-progressive-support="true"]');
        if (!support) return;
        const attempts = Number(card.dataset.failedAttempts || 0);
        const hintButton = support.querySelector('[data-support-level="1"]');
        const setup = support.querySelector('[data-support-content="2"]');
        const solutionButton = support.querySelector('[data-support-level="3"]');
        if (hintButton && attempts >= 1) hintButton.hidden = false;
        if (setup && attempts >= 2) setup.hidden = false;
        if (solutionButton && attempts >= 3) solutionButton.hidden = false;
      }

      function updateCarryovers() {
        document.querySelectorAll('[data-carry-forward="true"]').forEach((box) => {
          const sourceIndex = Number(box.dataset.carryFromIndex || 1);
          const sourceComplete = cards[sourceIndex]?.classList.contains('is-complete') === true;
          const supportComplete = cards[sourceIndex]?.classList.contains('support-complete') === true;
          const ready = sourceComplete || supportComplete;
          const carriedValue = box.dataset.carriedValue || '';
          const notReady = box.dataset.notReadyText || 'Bereken eerst het grensbedrag in taak 2.';
          const output = box.querySelector('[data-carried-output="true"]');
          const hidden = box.querySelector('.carried-threshold-field');
          const select = box.querySelector('.direction-select');
          box.classList.toggle('is-ready', ready);
          if (output) output.textContent = ready ? carriedValue : notReady;
          if (hidden) hidden.value = ready ? carriedValue : '';
          if (select) select.disabled = !ready;
        });
      }

      function collect(card, model) {
        if (model.family === 'calculation_work_capture') {
          const intervalBox = card.querySelector('[data-interval-halving-check="true"]');
          if (intervalBox) {
            const relation = intervalBox.querySelector('.halving-relation')?.value || '';
            return {
              work: intervalBox.querySelector('.calc-work')?.value || '',
              finalAnswer: intervalBox.querySelector('.calc-final')?.value || '',
              unit: relation === 'helft' ? '50 procent daling' : relation
            };
          }
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
        if (model.family === 'graph_construction_substitute') {
          const clickedPoints = Array.from(card.querySelectorAll('.placed-graph-point')).map((point) => ({
            x: point.dataset.x || '',
            y: point.dataset.y || ''
          }));
          const typedPoints = Array.from(card.querySelectorAll('.point-entry-row')).map((row) => ({
            x: row.querySelector('.graph-point-x')?.value || '',
            y: row.querySelector('.graph-point-y')?.value || ''
          }));
          return {
            axes: {
              x: card.querySelector('.graph-axis-x')?.value || '',
              y: card.querySelector('.graph-axis-y')?.value || ''
            },
            points: clickedPoints.length > 0 ? clickedPoints : typedPoints,
            lineShape: card.querySelector('.graph-line-confirm')?.checked ? 'decreasing' : ''
          };
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
          const compactValues = Array.from(card.querySelectorAll('.source-cell-select:checked')).map((input) => input.value);
          if (compactValues.length > 0) {
            const roles = expectedRoleByValue(model);
            return {
              selections: compactValues.map((valueId) => ({
                valueId,
                role: roles[valueId] || ''
              }))
            };
          }
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
          const parts = calculationParts(model, response);
          return parts.finalOk && parts.unitOk && parts.workOk;
        }
        if (model.family === 'structured_short_response') {
          return (expected.fields || []).every((field) => acceptedText(response.fields[field.id] || '', field.accepted || []));
        }
        if (model.family === 'graph_construction_substitute') {
          return acceptedText(response.axes.x, expected.axes?.xAccepted || [])
            && acceptedText(response.axes.y, expected.axes?.yAccepted || [])
            && graphPointsMatch(response.points, expected)
            && normalize(response.lineShape) === normalize(expected.lineShape);
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

      function calculationParts(model, response) {
        const expected = model.expected || {};
        const finalOk = acceptedText(response.finalAnswer, expected.finalAnswer?.accepted || []);
        const expectedUnit = expected.unit || expected.unitNotation;
        const unitOk = !expectedUnit?.accepted || acceptedTextExact(response.unit, expectedUnit.accepted);
        const paths = Array.isArray(expected.acceptedWorkPaths) && expected.acceptedWorkPaths.length > 0
          ? expected.acceptedWorkPaths.map((path) => path.requiredWorkText || [])
          : [expected.requiredWorkText || []];
        const workOk = paths.some((requiredGroups) => requiredGroups.every((group) => workGroupOptions(group).some((needle) => normalize(response.work).includes(normalize(needle)))));
        return { finalOk, unitOk, workOk };
      }

      function feedbackText(model, response, ok) {
        if (ok) return 'Klopt. Je kunt door naar de volgende kaart.';
        if (model.family === 'calculation_work_capture' && model.interaction?.targetedFeedback) {
          const parts = calculationParts(model, response);
          const feedback = model.interaction.targetedFeedback;
          if (parts.finalOk && !parts.unitOk) return feedback.unitOnly || 'Het bedrag klopt. Controleer alleen de eenheid.';
          if (parts.finalOk && parts.unitOk && !parts.workOk) return feedback.workMissing || 'Het eindantwoord klopt. Laat nog zien hoe je eraan komt.';
          return feedback.numberWrong || 'Controleer eerst de jaarpremies en het verschil.';
        }
        return 'Nog niet. Controleer bron, antwoordvorm en volgorde, en probeer opnieuw.';
      }

      function mark(card, index, ok) {
        const feedback = card.querySelector('.feedback');
        card.classList.toggle('is-complete', ok);
        card.classList.toggle('is-retry', !ok);
        if (card.getAttribute('data-task-family') === 'graph_construction_substitute') {
          if (ok) drawConstructedLine(card);
          else hideConstructedLine(card);
        }
        if (!ok) card.dataset.failedAttempts = String(Number(card.dataset.failedAttempts || 0) + 1);
        if (ok) card.dataset.failedAttempts = '0';
        updateProgressiveSupport(card);
        if (feedback) feedback.textContent = feedbackText(models[index], collect(card, models[index]), ok);
        updateCarryovers();
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

      function calculationWorkGroups(model) {
        const paths = model.expected.acceptedWorkPaths || [];
        if (paths.length > 0) return paths[0].requiredWorkText || [];
        return model.expected.requiredWorkText || [];
      }

      function fillCorrect(card, model) {
        if (model.family === 'calculation_work_capture') {
          const intervalBox = card.querySelector('[data-interval-halving-check="true"]');
          if (intervalBox) {
            const option = intervalBox.querySelector('.interval-choice[data-correct="true"]') || intervalBox.querySelector('.interval-choice');
            if (option) {
              option.checked = true;
              option.dispatchEvent(new Event('change', { bubbles: true }));
            }
            const relation = intervalBox.querySelector('.halving-relation');
            if (relation) {
              relation.value = 'helft';
              relation.dispatchEvent(new Event('change', { bubbles: true }));
            }
            const conclusion = intervalBox.querySelector('.halving-conclusion');
            if (conclusion) {
              const expected = model.expected.finalAnswer?.accepted?.[0] || '';
              const target = Array.from(conclusion.options).find((item) => normalize(item.dataset.finalAnswer || item.value) === normalize(expected))
                || Array.from(conclusion.options).find((item) => item.dataset.correct === 'true');
              conclusion.value = target?.value || '';
              conclusion.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return;
          }
          const work = calculationWorkGroups(model);
          const expectedUnit = model.expected.unit || model.expected.unitNotation;
          card.querySelector('.calc-work').value = work.map((group) => workGroupOptions(group)[0]).filter(Boolean).join(' ; ');
          card.querySelector('.calc-final').value = model.expected.finalAnswer.accepted[0];
          card.querySelector('.calc-unit').value = expectedUnit?.accepted?.[0] || '';
          return;
        }
        if (model.family === 'structured_short_response') {
          const carry = card.querySelector('[data-carry-forward="true"]');
          if (carry) {
            updateCarryovers();
            const direction = (model.expected.fields || []).find((field) => field.id === 'direction');
            const select = card.querySelector('.direction-select');
            if (select) select.value = direction?.accepted?.[0] || '';
            return;
          }
          (model.expected.fields || []).forEach((field) => {
            const input = card.querySelector('.structured-field[data-field-id="' + CSS.escape(field.id) + '"]');
            if (input) input.value = field.accepted[0];
          });
          return;
        }
        if (model.family === 'graph_construction_substitute') {
          const xAxis = card.querySelector('.graph-axis-x');
          const yAxis = card.querySelector('.graph-axis-y');
          if (xAxis) xAxis.value = model.expected.axes?.xAccepted?.[0] || '';
          if (yAxis) yAxis.value = model.expected.axes?.yAccepted?.[0] || '';
          updateGraphAxisState(card, model);
          clearGraphPoints(card);
          (model.expected.points || []).forEach((point) => placeGraphPoint(card, point.x, point.y));
          const rows = Array.from(card.querySelectorAll('.point-entry-row'));
          (model.expected.points || []).forEach((point, rowIndex) => {
            const row = rows[rowIndex];
            if (!row) return;
            row.querySelector('.graph-point-x').value = point.x;
            row.querySelector('.graph-point-y').value = String(point.y).replace('.', ',');
          });
          const line = card.querySelector('.graph-line-confirm');
          if (line) line.checked = true;
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
          const compactInputs = Array.from(card.querySelectorAll('.source-cell-select'));
          if (compactInputs.length > 0) {
            const expectedIds = new Set((model.expected.selections || []).map((selection) => selection.valueId));
            compactInputs.forEach((input) => { input.checked = expectedIds.has(input.value); });
            return;
          }
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
          const intervalBox = card.querySelector('[data-interval-halving-check="true"]');
          if (intervalBox) {
            const option = intervalBox.querySelector('.interval-choice');
            if (option) {
              option.checked = true;
              option.dispatchEvent(new Event('change', { bubbles: true }));
            }
            const relation = intervalBox.querySelector('.halving-relation');
            if (relation) relation.value = 'dubbel';
            const conclusion = intervalBox.querySelector('.halving-conclusion');
            if (conclusion) conclusion.value = Array.from(conclusion.options).find((item) => item.dataset.correct !== 'true' && item.value)?.value || '';
            return;
          }
          card.querySelector('.calc-work').value = 'onvolledig';
          card.querySelector('.calc-final').value = '0';
          card.querySelector('.calc-unit').value = '';
          return;
        }
        if (model.family === 'structured_short_response') {
          const carry = card.querySelector('[data-carry-forward="true"]');
          if (carry) {
            updateCarryovers();
            const select = card.querySelector('.direction-select');
            if (select) select.value = 'hoger dan';
            return;
          }
          card.querySelectorAll('.structured-field').forEach((input) => { input.value = 'nog niet'; });
          return;
        }
        if (model.family === 'graph_construction_substitute') {
          const xAxis = card.querySelector('.graph-axis-x');
          const yAxis = card.querySelector('.graph-axis-y');
          if (xAxis) xAxis.value = 'prijs p';
          if (yAxis) yAxis.value = 'hoeveelheid q';
          updateGraphAxisState(card, model);
          clearGraphPoints(card);
          card.querySelectorAll('.point-entry-row').forEach((row, rowIndex) => {
            row.querySelector('.graph-point-x').value = rowIndex === 0 ? '0' : '';
            row.querySelector('.graph-point-y').value = rowIndex === 0 ? '0' : '';
          });
          const line = card.querySelector('.graph-line-confirm');
          if (line) line.checked = false;
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
          const compactInputs = Array.from(card.querySelectorAll('.source-cell-select'));
          if (compactInputs.length > 0) {
            const firstWrong = compactInputs.find((input) => {
              const value = model.interaction.values?.find((item) => item.id === input.value);
              return value?.kind === 'distractor';
            }) || compactInputs[0];
            if (firstWrong) firstWrong.checked = true;
            return;
          }
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
        if (models[index].family === 'graph_construction_substitute') installGraphConstruction(card, models[index]);
        installIntervalHalving(card);
        installProgressiveSupport(card);
        const button = card.querySelector('.check-button');
        button.addEventListener('click', () => {
          mark(card, index, evaluate(models[index], collect(card, models[index])));
        });
      });

      function resetAll() {
        cards.forEach((card) => {
          card.classList.remove('is-complete', 'is-retry');
          card.classList.remove('support-complete');
          card.dataset.failedAttempts = '0';
          card.querySelectorAll('input, textarea, select').forEach((control) => {
            if (control.type === 'radio' || control.type === 'checkbox') control.checked = false;
            else control.value = '';
          });
          const zone = card.querySelector('.sequence-zone');
          if (zone) zone.innerHTML = '';
          card.querySelectorAll('[data-completed-graph="true"]').forEach((graph) => { graph.hidden = true; });
          clearGraphPoints(card);
          if (card.getAttribute('data-task-family') === 'graph_construction_substitute') {
            updateGraphAxisState(card, models[cards.indexOf(card)]);
          }
          card.querySelectorAll('[data-progressive-support="true"]').forEach((support) => {
            support.dataset.supportComplete = 'false';
            support.querySelectorAll('.support-button, .support-content').forEach((item) => { item.hidden = true; });
          });
          const intervalBox = card.querySelector('[data-interval-halving-check="true"]');
          if (intervalBox) {
            const oldTarget = intervalBox.querySelector('[data-old-quantity="true"]');
            const newTarget = intervalBox.querySelector('[data-new-quantity="true"]');
            if (oldTarget) oldTarget.textContent = 'Kies eerst een interval';
            if (newTarget) newTarget.textContent = 'Kies eerst een interval';
          }
          const feedback = card.querySelector('.feedback');
          if (feedback) feedback.textContent = '';
        });
        updateCarryovers();
        updateCurrent(0);
      }

      function inspect() {
        const sourcePane = document.querySelector('.source-pane');
        const taskPane = document.querySelector('.task-pane');
        const strip = document.querySelector('.question-strip');
        const originalScrollTop = sourcePane ? sourcePane.scrollTop : 0;
        let sourceTableFullyVisibleAtTop = true;
        let sourceTableVisibleAtTop = true;
        let sourcePaneNeedsImmediateVerticalScroll = false;
        if (sourcePane) {
          sourcePane.scrollTop = 0;
          const paneRect = sourcePane.getBoundingClientRect();
          const firstTable = sourcePane.querySelector('table');
          const firstTableRect = firstTable ? firstTable.getBoundingClientRect() : null;
          sourceTableVisibleAtTop = !firstTableRect || (firstTableRect.bottom > paneRect.top && firstTableRect.top < paneRect.bottom);
          sourceTableFullyVisibleAtTop = !firstTableRect || (firstTableRect.top >= paneRect.top && firstTableRect.bottom <= paneRect.bottom + 2);
          sourcePaneNeedsImmediateVerticalScroll = sourcePane.scrollHeight > sourcePane.clientHeight + 6;
          sourcePane.scrollTop = sourcePane.scrollHeight;
        }
        const stripRect = strip ? strip.getBoundingClientRect() : null;
        const overflowing = Array.from(document.querySelectorAll('body *')).filter((item) => {
          const style = window.getComputedStyle(item);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (item.ownerSVGElement) return false;
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(item.tagName)) return false;
          return item.scrollWidth > item.clientWidth + 2 && !item.closest('.table-scroll') && !item.closest('.formula-scroll');
        });
        const familyAffordances = {};
        const visible = (item) => {
          if (!item) return false;
          if (item.ownerSVGElement) {
            if (item.hasAttribute?.('hidden') || item.closest?.('[hidden]')) return false;
            const style = window.getComputedStyle(item);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            if (typeof item.getBBox === 'function') {
              try {
                const box = item.getBBox();
                return box.width > 0 || box.height > 0;
              } catch (error) {
                return true;
              }
            }
            return true;
          }
          if (item.hidden || item.hasAttribute?.('hidden') || item.closest?.('[hidden]')) return false;
          const style = window.getComputedStyle(item);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          const rect = item.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        };
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
              numericField: false,
              graphWorkspace: false,
              graphAxisControls: false,
              graphPointInputs: false,
              graphLineConfirmation: false,
              graphClickToPlace: false,
              graphAxisControlsAttached: false,
              graphClickedPointCount: 0,
              graphConstructedLineVisible: false,
              graphLineInSameWorkspace: false,
              graphGridLineVisibleCount: 0,
              typedPointFallbackCollapsed: false,
              typedPointFallbackOpen: false,
              sourceCellSelection: false,
              sourceCellOptionCount: 0,
              sourceCellCheckedCount: 0,
              sourceCellRequiredSelectionCount: 0,
              sourceCellDistractorCount: 0,
              repeatedDropdownRows: 0,
              roleDropdownCount: 0,
              structuredCarryForward: false,
              constrainedDirectionControl: false,
              freeTextDirectionAbsent: true,
              carriedValueReady: false,
              carryRequiresPreviousTask: false,
              intervalHalvingCheck: false,
              intervalChoiceCount: 0,
              halvingConclusionControl: false,
              autoFilledQuantitiesVisible: false,
              progressiveSupport: false,
              supportHintVisible: false,
              supportSetupVisible: false,
              supportSolutionVisible: false,
              supportComplete: false
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
          item.graphWorkspace = item.graphWorkspace || Boolean(card.querySelector('[data-graph-workspace="construction"]'));
          item.graphAxisControls = item.graphAxisControls || Boolean(card.querySelector('.graph-axis-x') && card.querySelector('.graph-axis-y'));
          item.graphAxisControlsAttached = item.graphAxisControlsAttached || Boolean(card.querySelector('[data-axis-controls-attached="true"]'));
          item.graphPointInputs = item.graphPointInputs || card.querySelectorAll('.graph-point-x, .graph-point-y').length >= 4;
          item.graphLineConfirmation = item.graphLineConfirmation || Boolean(card.querySelector('[data-graph-line-confirmation="true"]'));
          item.graphClickToPlace = item.graphClickToPlace || Boolean(card.querySelector('[data-graph-click-surface="true"]'));
          item.graphClickedPointCount += card.querySelectorAll('.placed-graph-point').length;
          item.graphConstructedLineVisible = item.graphConstructedLineVisible || Boolean(Array.from(card.querySelectorAll('[data-graph-line="constructed"]')).some((line) => visible(line)));
          item.graphLineInSameWorkspace = item.graphLineInSameWorkspace || Boolean(card.querySelector('[data-graph-workspace="construction"] [data-graph-line="constructed"]'));
          item.graphGridLineVisibleCount += Array.from(card.querySelectorAll('.graph-grid-svg .grid-line')).filter((line) => visible(line)).length;
          item.typedPointFallbackCollapsed = item.typedPointFallbackCollapsed || Boolean(card.querySelector('[data-typed-point-fallback="collapsed"]:not([open])'));
          item.typedPointFallbackOpen = item.typedPointFallbackOpen || Boolean(card.querySelector('[data-typed-point-fallback="collapsed"][open]'));
          item.sourceCellSelection = item.sourceCellSelection || Boolean(card.querySelector('[data-source-cell-selection="compact"]'));
          item.sourceCellOptionCount += card.querySelectorAll('.source-cell-select').length;
          item.sourceCellCheckedCount += card.querySelectorAll('.source-cell-select:checked').length;
          const sourceSelection = card.querySelector('[data-source-cell-selection="compact"]');
          if (sourceSelection) {
            item.sourceCellRequiredSelectionCount = Number(sourceSelection.dataset.requiredSelections || 0);
            item.sourceCellDistractorCount = Number(sourceSelection.dataset.distractorCount || 0);
          }
          item.repeatedDropdownRows += card.querySelectorAll('.pair-row').length;
          item.roleDropdownCount += card.querySelectorAll('.role-select').length;
          item.structuredCarryForward = item.structuredCarryForward || Boolean(card.querySelector('[data-carry-forward="true"]'));
          item.constrainedDirectionControl = item.constrainedDirectionControl || Boolean(card.querySelector('.direction-select'));
          item.freeTextDirectionAbsent = item.freeTextDirectionAbsent && !Boolean(card.querySelector('input.structured-field:not([type="hidden"]), textarea.structured-field'));
          item.carriedValueReady = item.carriedValueReady || Boolean(card.querySelector('[data-carry-forward="true"].is-ready'));
          item.carryRequiresPreviousTask = item.carryRequiresPreviousTask || Boolean(card.querySelector('[data-carry-forward="true"] .direction-select:disabled, [data-carry-forward="true"]:not(.is-ready)'));
          item.intervalHalvingCheck = item.intervalHalvingCheck || Boolean(card.querySelector('[data-interval-halving-check="true"]'));
          item.intervalChoiceCount += card.querySelectorAll('.interval-choice').length;
          item.halvingConclusionControl = item.halvingConclusionControl || Boolean(card.querySelector('.halving-conclusion'));
          item.autoFilledQuantitiesVisible = item.autoFilledQuantitiesVisible || Boolean(card.querySelector('[data-auto-fill-values="true"]'));
          item.progressiveSupport = item.progressiveSupport || Boolean(card.querySelector('[data-progressive-support="true"]'));
          item.supportHintVisible = item.supportHintVisible || Boolean(Array.from(card.querySelectorAll('[data-support-level="1"], [data-support-content="1"]')).some((item) => visible(item)));
          item.supportSetupVisible = item.supportSetupVisible || Boolean(Array.from(card.querySelectorAll('[data-support-content="2"]')).some((item) => visible(item)));
          item.supportSolutionVisible = item.supportSolutionVisible || Boolean(Array.from(card.querySelectorAll('[data-support-level="3"], [data-support-content="3"]')).some((item) => visible(item)));
          item.supportComplete = item.supportComplete || card.classList.contains('support-complete');
        });
        const bodyText = document.body.innerText;
        const supportBoxes = Array.from(document.querySelectorAll('.support-box'));
        const visibleText = (root) => Array.from(root.querySelectorAll('*'))
          .filter((item) => visible(item) && !item.closest('.visually-hidden'))
          .map((item) => {
            if (item.children.length > 0 && !['TD', 'TH', 'CAPTION', 'H1', 'H2', 'H3', 'P', 'LABEL', 'BUTTON', 'OPTION', 'SUMMARY', 'DT', 'DD'].includes(item.tagName)) return '';
            return item.innerText || item.textContent || '';
          })
          .join('\\n');
        const duplicateLabelBlocks = Array.from(document.querySelectorAll('.ctx-block')).map((block) => {
          const text = visibleText(block);
          return {
            bron1: (text.match(/Bron 1/g) || []).length,
            tabel1: (text.match(/Tabel 1/g) || []).length
          };
        });
        const duplicateVisibleSourceLabels = duplicateLabelBlocks.some((item) => item.bron1 > 1 || item.tabel1 > 1);
        const graphConstructionComplete = cards.some((item) => item.getAttribute('data-task-family') === 'graph_construction_substitute' && item.classList.contains('is-complete'));
        const completedGraphBlocks = Array.from(document.querySelectorAll('[data-completed-graph="true"]'));
        const visibleCompletedGraphs = completedGraphBlocks.filter(visible);
        const completedGraphOutsideWorkspaceCount = completedGraphBlocks.filter((item) => !item.closest('[data-graph-workspace="construction"]')).length;
        const constructedLineVisibleInWorkspace = Array.from(document.querySelectorAll('[data-graph-workspace="construction"] [data-graph-line="constructed"]')).some((item) => visible(item));
        const graphWorkspaces = Array.from(document.querySelectorAll('[data-graph-workspace="construction"]'));
        const firstGraphWorkspaceRect = graphWorkspaces[0] ? graphWorkspaces[0].getBoundingClientRect() : null;
        const labShell = document.querySelector('.lab-shell');
        const usableWidth = labShell ? labShell.getBoundingClientRect().width : window.innerWidth;
        const graphAxisLabels = Array.from(document.querySelectorAll('.graph-grid-svg .axis-label.reveal-after-axes'));
        const graphScaleLabels = Array.from(document.querySelectorAll('.graph-grid-svg .scale-label.reveal-after-axes'));
        const graphAxisLabelsVisibleCount = graphAxisLabels.filter(visible).length;
        const graphScaleLabelsVisibleCount = graphScaleLabels.filter(visible).length;
        const graphScaleLabelTexts = graphScaleLabels.filter(visible).map((label) => (label.textContent || '').trim()).filter(Boolean);
        const graphGridLineVisibleCount = Array.from(document.querySelectorAll('.graph-grid-svg .grid-line')).filter(visible).length;
        const graphLabelsVisibleBeforeAxisSelection = graphWorkspaces.some((workspace) => !workspace.classList.contains('axes-selected') && Array.from(workspace.querySelectorAll('.reveal-after-axes')).some(visible));
        const sourceRefsVisibleNow = bodyText.includes('references/') || bodyText.includes('..\\\\') || bodyText.includes('../');
        if (sourcePane) sourcePane.scrollTop = originalScrollTop;
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          viewport: { width: window.innerWidth, height: window.innerHeight },
          semanticValidationEnabled: document.body.dataset.semanticValidation === 'required',
          contextBlockCount: document.querySelectorAll('.ctx-block').length,
          promptContextCount: document.querySelectorAll('[data-context-role="prompt"]').length,
          promptInSourcePaneCount: document.querySelectorAll('.source-pane [data-context-role="prompt"]').length,
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
          rightPaneQuestionVisible: Boolean(document.querySelector('.task-pane [data-right-pane-question="true"]')),
          examQuestionTextVisibleInTaskPane: taskPane ? taskPane.innerText.includes('Bereken tot welk bedrag aan zorgkosten per jaar') : false,
          sourceTableVisibleAtTop,
          sourceTableFullyVisibleAtTop,
          sourcePaneNeedsImmediateVerticalScroll,
          sourcePaneComfortableInitial: sourceTableVisibleAtTop && sourceTableFullyVisibleAtTop && !sourceRefsVisibleNow,
          graphWorkspaceCount: graphWorkspaces.length,
          graphWorkspaceInTaskPane: graphWorkspaces.length === 0 || graphWorkspaces.every((item) => Boolean(item.closest('.task-pane'))),
          graphWorkspaceDesktopWidth: firstGraphWorkspaceRect ? Math.round(firstGraphWorkspaceRect.width) : 0,
          graphWorkspaceUsableWidth: Math.round(usableWidth),
          graphWorkspaceWidthPass: graphWorkspaces.length === 0 || window.innerWidth < 900 || Boolean(firstGraphWorkspaceRect && (firstGraphWorkspaceRect.width >= 720 || firstGraphWorkspaceRect.width / usableWidth >= 0.6)),
          graphClickToPlaceSupported: document.querySelectorAll('[data-graph-click-surface="true"]').length > 0,
          graphClickedPointCount: document.querySelectorAll('.placed-graph-point').length,
          graphGridLineVisibleCount,
          graphAxisLabelsVisibleCount,
          graphScaleLabelsVisibleCount,
          graphScaleLabelTexts,
          graphLabelsVisibleBeforeAxisSelection,
          graphLabelsRevealAfterAxisSelection: graphWorkspaces.length === 0 || graphWorkspaces.every((workspace) => !workspace.classList.contains('axes-selected') || Array.from(workspace.querySelectorAll('.reveal-after-axes')).some(visible)),
          completedGraphVisibleCount: visibleCompletedGraphs.length,
          completedGraphOutsideWorkspaceCount,
          constructedLineVisibleInWorkspace,
          completedGraphVisibleBeforeAttempt: visibleCompletedGraphs.length > 0 && !graphConstructionComplete,
          sourcePaneCompletedGraphCount: document.querySelectorAll('.source-pane [data-completed-graph="true"]').length,
          duplicateVisibleSourceLabels,
          duplicateLabelBlocks,
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
          targetedUnitFeedbackVisible: Array.from(document.querySelectorAll('.feedback')).some((item) => item.textContent.includes('Het bedrag klopt. Controleer alleen de eenheid.')),
          targetedWorkFeedbackVisible: Array.from(document.querySelectorAll('.feedback')).some((item) => item.textContent.includes('Het eindantwoord klopt. Laat nog zien hoe je eraan komt.')),
          targetedNumberFeedbackVisible: Array.from(document.querySelectorAll('.feedback')).some((item) => item.textContent.includes('Controleer eerst de jaarpremies en het verschil.')),
          progressiveSupportVisible: Array.from(document.querySelectorAll('[data-progressive-support="true"]')).some((item) => Array.from(item.querySelectorAll('.support-button, .support-content')).some(visible)),
          supportComplete: cards.some((card) => card.classList.contains('support-complete')),
          labCompleted: completedCount() === cards.length,
          tableCount: document.querySelectorAll('table').length,
          graphCount: document.querySelectorAll('.graph-svg').length,
          flowchartCount: document.querySelectorAll('.flow-list').length,
          sourceRefsVisible: sourceRefsVisibleNow,
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
        applyUnitOnlyMistake(taskIndex = 1) {
          resetAll();
          const card = cards[taskIndex];
          const model = models[taskIndex];
          if (card && model?.family === 'calculation_work_capture') {
            fillCorrect(card, model);
            const unit = card.querySelector('.calc-unit');
            if (unit) unit.value = 'euro per maand';
            card.querySelector('.check-button').click();
          }
          return inspect();
        },
        applyAcceptedEuros(taskIndex = 1) {
          resetAll();
          const card = cards[taskIndex];
          const model = models[taskIndex];
          if (card && model?.family === 'calculation_work_capture') {
            fillCorrect(card, model);
            const final = card.querySelector('.calc-final');
            const unit = card.querySelector('.calc-unit');
            if (final) final.value = '649';
            if (unit) unit.value = 'euros';
            card.querySelector('.check-button').click();
          }
          return inspect();
        },
        applyStuckSupport(taskIndex = 1) {
          resetAll();
          const card = cards[taskIndex];
          const model = models[taskIndex];
          if (card && model?.family === 'calculation_work_capture') {
            for (let attempt = 0; attempt < 3; attempt += 1) {
              fillWrong(card, model);
              card.querySelector('.check-button').click();
            }
            const solution = card.querySelector('[data-support-level="3"]');
            if (solution) solution.click();
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
        selectCorrectAxes(taskIndex = 0) {
          resetAll();
          const card = cards[taskIndex];
          const model = models[taskIndex];
          if (card && model?.family === 'graph_construction_substitute') {
            const xAxis = card.querySelector('.graph-axis-x');
            const yAxis = card.querySelector('.graph-axis-y');
            if (xAxis) xAxis.value = model.expected.axes?.xAccepted?.[0] || '';
            if (yAxis) yAxis.value = model.expected.axes?.yAccepted?.[0] || '';
            updateGraphAxisState(card, model);
          }
          return inspect();
        },
        placeGraphPointsOnly(taskIndex = 0) {
          resetAll();
          const card = cards[taskIndex];
          const model = models[taskIndex];
          if (card && model?.family === 'graph_construction_substitute') {
            const xAxis = card.querySelector('.graph-axis-x');
            const yAxis = card.querySelector('.graph-axis-y');
            if (xAxis) xAxis.value = model.expected.axes?.xAccepted?.[0] || '';
            if (yAxis) yAxis.value = model.expected.axes?.yAccepted?.[0] || '';
            updateGraphAxisState(card, model);
            clearGraphPoints(card);
            (model.expected.points || []).forEach((point) => placeGraphPoint(card, point.x, point.y));
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
      updateCarryovers();
      updateCurrent(0);
    })();
  </script>
</body>
</html>`;
}

module.exports = { buildPlayableLabHtml };
