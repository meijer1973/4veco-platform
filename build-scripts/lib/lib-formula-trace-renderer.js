const { esc, text, lineText, rect, frame } = require('./lib-visual-surfaces');

function renderFormulaTrace(visualState, options = {}) {
  const cfg = options.surface;
  const formulaBoxes = (visualState.elements || []).filter((element) => element.type === 'formula_box');
  const annotations = (visualState.elements || []).filter((element) => element.type === 'annotation');
  const accent = '#17A2B8';
  const { t, m, contentY, header } = frame(
    cfg,
    'Formulespoor',
    visualState.semantic_focus,
    accent
  );
  const boxCount = Math.max(1, formulaBoxes.length);
  const gap = cfg.compact ? 14 : 22;
  const availableW = cfg.w - 2 * m - 72;
  const boxW = Math.max(130, Math.floor((availableW - gap * (boxCount - 1)) / boxCount));
  const boxH = cfg.compact ? 78 : 98;
  const startX = m + 36;
  const y = contentY + (cfg.compact ? 12 : 28);

  const boxes = formulaBoxes.map((element, index) => {
    const x = startX + index * (boxW + gap);
    const role = element.role || `step_${index + 1}`;
    const label = element.label || role;
    const arrow = index < formulaBoxes.length - 1
      ? `${text(x + boxW + gap / 2, y + boxH / 2 + 8, '>', { size: 26, weight: 800, fill: t.muted, anchor: 'middle' })}`
      : '';
    return `
      ${rect(x, y, boxW, boxH, t.blueSoft, { stroke: t.blue, sw: 2, rx: 10 })}
      ${text(x + 18, y + 30, `${index + 1}. ${role}`, { size: cfg.compact ? 13 : 15, weight: 700, fill: t.soft })}
      ${text(x + boxW / 2, y + 64, label, { size: cfg.compact ? 22 : 28, weight: 800, fill: t.ink, anchor: 'middle', family: 'Inter, Arial, sans-serif' })}
      ${arrow}
    `;
  }).join('');

  const annotationLines = annotations.length > 0
    ? annotations.map((item) => item.text_nl || item.label || item.role)
    : [visualState.accessibility.non_color_fallback];
  const noteY = y + boxH + (cfg.compact ? 42 : 58);
  const note = `
    ${rect(startX, noteY, cfg.w - 2 * (m + 36), cfg.compact ? 74 : 92, t.noteBg, { stroke: t.border, sw: 1, rx: 10 })}
    ${lineText(startX + 24, noteY + 30, annotationLines.slice(0, cfg.compact ? 2 : 3), { size: cfg.compact ? 14 : 18, weight: 500, fill: t.ink })}
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.w}" height="${cfg.h}" viewBox="0 0 ${cfg.w} ${cfg.h}" role="img" aria-label="${esc(visualState.semantic_focus)}">
    ${header}
    ${boxes}
    ${note}
  </svg>`;

  return {
    renderer: 'formula_trace',
    svg,
    checks: ['formula_boxes_rendered', 'ordered_formula_trace', 'annotation_rendered'],
    warnings: formulaBoxes.length === 0 ? ['no_formula_box_elements'] : [],
  };
}

module.exports = { renderFormulaTrace };
