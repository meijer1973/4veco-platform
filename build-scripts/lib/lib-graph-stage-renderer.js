const { esc, text, lineText, rect, frame } = require('./lib-visual-surfaces');

function renderGraphStage(visualState, options = {}) {
  const cfg = options.surface;
  const elements = visualState.elements || [];
  const axes = elements.filter((element) => element.type === 'axis');
  const curves = elements.filter((element) => element.type === 'curve' || element.type === 'line');
  const points = elements.filter((element) => element.type === 'point');
  const annotations = elements.filter((element) => element.type === 'annotation');
  const accent = '#17A2B8';
  const { t, m, contentY, header } = frame(
    cfg,
    'Grafiekfase',
    visualState.semantic_focus,
    accent
  );
  const x0 = m + (cfg.compact ? 70 : 92);
  const y0 = cfg.h - m - (cfg.compact ? 72 : 92);
  const graphW = cfg.w - x0 - m - (cfg.compact ? 32 : 70);
  const graphH = y0 - contentY - (cfg.compact ? 24 : 44);
  const horizontal = axes.find((axis) => axis.axis_role === 'horizontal_axis') || axes[0] || {};
  const vertical = axes.find((axis) => axis.axis_role === 'vertical_axis') || axes[1] || {};

  const grid = [];
  for (let i = 1; i <= 4; i += 1) {
    const gx = x0 + (graphW / 4) * i;
    const gy = y0 - (graphH / 4) * i;
    grid.push(`<line x1="${gx}" y1="${contentY}" x2="${gx}" y2="${y0}" stroke="${t.grid}" stroke-width="1"/>`);
    grid.push(`<line x1="${x0}" y1="${gy}" x2="${x0 + graphW}" y2="${gy}" stroke="${t.grid}" stroke-width="1"/>`);
  }

  const renderedCurves = curves.length > 0
    ? curves.map((curve, index) => {
      const yA = y0 - graphH * (0.18 + index * 0.12);
      const yB = y0 - graphH * (0.78 - index * 0.08);
      return `
        <path d="M ${x0 + 18} ${yB} C ${x0 + graphW * 0.35} ${yB - 38}, ${x0 + graphW * 0.63} ${yA + 42}, ${x0 + graphW - 18} ${yA}" fill="none" stroke="${index % 2 === 0 ? t.blue : t.green}" stroke-width="4"/>
        ${text(x0 + graphW - 90, yA - 10, curve.label || curve.role, { size: cfg.compact ? 14 : 17, weight: 800, fill: index % 2 === 0 ? t.blue : t.green })}
      `;
    }).join('')
    : '';

  const pointPositions = [
    [x0 + graphW * 0.32, y0 - graphH * 0.36],
    [x0 + graphW * 0.66, y0 - graphH * 0.62],
    [x0 + graphW * 0.5, y0 - graphH * 0.5],
  ];
  const renderedPoints = points.map((point, index) => {
    const [px, py] = pointPositions[index % pointPositions.length];
    return `
      <line x1="${px}" y1="${py}" x2="${px}" y2="${y0}" stroke="${t.muted}" stroke-width="1.5" stroke-dasharray="5 5"/>
      <line x1="${x0}" y1="${py}" x2="${px}" y2="${py}" stroke="${t.muted}" stroke-width="1.5" stroke-dasharray="5 5"/>
      <circle cx="${px}" cy="${py}" r="${cfg.compact ? 7 : 9}" fill="${t.amber}" stroke="${t.panel}" stroke-width="3"/>
      ${text(px + 12, py - 10, point.label || point.role, { size: cfg.compact ? 13 : 16, weight: 800, fill: t.ink })}
    `;
  }).join('');

  const annotationLines = annotations.length > 0
    ? annotations.map((item) => item.text_nl || item.label || item.role)
    : [visualState.accessibility.non_color_fallback];
  const note = `
    ${rect(x0 + graphW * 0.1, contentY + 12, graphW * 0.8, cfg.compact ? 58 : 72, t.noteBg, { stroke: t.border, sw: 1, rx: 10, opacity: 0.96 })}
    ${lineText(x0 + graphW * 0.1 + 18, contentY + 40, annotationLines.slice(0, cfg.compact ? 1 : 2), { size: cfg.compact ? 13 : 16, weight: 600, fill: t.ink })}
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.w}" height="${cfg.h}" viewBox="0 0 ${cfg.w} ${cfg.h}" role="img" aria-label="${esc(visualState.semantic_focus)}">
    ${header}
    ${grid.join('')}
    <line x1="${x0}" y1="${y0}" x2="${x0 + graphW}" y2="${y0}" stroke="${t.ink}" stroke-width="3"/>
    <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${contentY}" stroke="${t.ink}" stroke-width="3"/>
    ${text(x0 + graphW, y0 + 34, horizontal.label || 'x', { size: cfg.compact ? 16 : 20, weight: 800, fill: t.ink, anchor: 'end' })}
    ${text(x0 - 28, contentY + 18, vertical.label || 'y', { size: cfg.compact ? 16 : 20, weight: 800, fill: t.ink, anchor: 'middle' })}
    ${vertical.unit ? text(x0 - 30, contentY + 42, vertical.unit, { size: cfg.compact ? 12 : 15, weight: 600, fill: t.soft, anchor: 'middle' }) : ''}
    ${renderedCurves}
    ${renderedPoints}
    ${note}
  </svg>`;

  return {
    renderer: 'graph_stage',
    svg,
    checks: ['axes_rendered', 'direct_labels_rendered', 'points_or_curves_rendered', 'annotation_rendered'],
    warnings: axes.length < 2 ? ['graph_axes_incomplete'] : [],
  };
}

module.exports = { renderGraphStage };
