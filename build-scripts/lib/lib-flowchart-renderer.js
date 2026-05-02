const { esc, text, lineText, rect, frame } = require('./lib-visual-surfaces');

function renderFlowchart(visualState, options = {}) {
  const cfg = options.surface;
  const nodes = (visualState.elements || []).filter((element) => element.type === 'flow_node');
  const annotations = (visualState.elements || []).filter((element) => element.type === 'annotation');
  const accent = '#2f7d4a';
  const { t, m, contentY, header } = frame(
    cfg,
    'Stappenlijn',
    visualState.semantic_focus,
    accent
  );
  const nodeCount = Math.max(1, nodes.length);
  const startX = m + 36;
  const availableW = cfg.w - 2 * (m + 36);
  const gap = cfg.compact ? 12 : 18;
  const nodeW = Math.max(120, Math.floor((availableW - gap * (nodeCount - 1)) / nodeCount));
  const nodeH = cfg.compact ? 88 : 112;
  const y = contentY + (cfg.compact ? 8 : 26);

  const renderedNodes = nodes.map((node, index) => {
    const x = startX + index * (nodeW + gap);
    const arrow = index < nodes.length - 1
      ? `${text(x + nodeW + gap / 2, y + nodeH / 2 + 8, '>', { size: 26, weight: 800, fill: t.green, anchor: 'middle' })}`
      : '';
    return `
      ${rect(x, y, nodeW, nodeH, t.greenSoft, { stroke: t.green, sw: 2, rx: 12 })}
      ${text(x + 16, y + 28, `Stap ${index + 1}`, { size: cfg.compact ? 13 : 16, weight: 800, fill: t.green })}
      ${lineText(x + 16, y + 56, splitLabel(node.label || node.role, cfg.compact ? 15 : 18), { size: cfg.compact ? 14 : 18, weight: 650, fill: t.ink, gap: cfg.compact ? 18 : 22 })}
      ${arrow}
    `;
  }).join('');

  const annotationLines = annotations.length > 0
    ? annotations.map((item) => item.text_nl || item.label || item.role)
    : [visualState.accessibility.non_color_fallback];
  const noteY = y + nodeH + (cfg.compact ? 32 : 48);
  const note = `
    ${rect(startX, noteY, availableW, cfg.compact ? 76 : 94, t.noteBg, { stroke: t.border, sw: 1, rx: 10 })}
    ${lineText(startX + 24, noteY + 30, annotationLines.slice(0, cfg.compact ? 2 : 3), { size: cfg.compact ? 14 : 18, weight: 500, fill: t.ink })}
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.w}" height="${cfg.h}" viewBox="0 0 ${cfg.w} ${cfg.h}" role="img" aria-label="${esc(visualState.semantic_focus)}">
    ${header}
    ${renderedNodes}
    ${note}
  </svg>`;

  return {
    renderer: 'flowchart',
    svg,
    checks: ['flow_nodes_rendered', 'numbered_order_rendered', 'annotation_rendered'],
    warnings: nodes.length === 0 ? ['no_flow_node_elements'] : [],
  };
}

function splitLabel(label, maxLength) {
  const words = String(label).split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

module.exports = { renderFlowchart };
