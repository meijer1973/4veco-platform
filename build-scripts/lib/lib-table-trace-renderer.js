const { esc, text, lineText, rect, frame } = require('./lib-visual-surfaces');

function renderTableTrace(visualState, options = {}) {
  const cfg = options.surface;
  const tableCells = (visualState.elements || []).filter((element) => element.type === 'table_cell');
  const annotations = (visualState.elements || []).filter((element) => element.type === 'annotation');
  const accent = '#d08732';
  const { t, m, contentY, header } = frame(
    cfg,
    'Tabelspoor',
    visualState.semantic_focus,
    accent
  );
  const startX = m + 52;
  const y = contentY + (cfg.compact ? 0 : 22);
  const tableW = cfg.w - 2 * (m + 52);
  const rowH = cfg.compact ? 48 : 60;
  const cols = Math.max(3, Math.min(5, tableCells.length || 3));
  const colW = Math.floor(tableW / cols);
  const rows = 3;
  const tableH = rows * rowH;

  const grid = [];
  for (let r = 0; r <= rows; r += 1) {
    const yy = y + r * rowH;
    grid.push(`<line x1="${startX}" y1="${yy}" x2="${startX + tableW}" y2="${yy}" stroke="${t.border}" stroke-width="1.5"/>`);
  }
  for (let c = 0; c <= cols; c += 1) {
    const xx = startX + c * colW;
    grid.push(`<line x1="${xx}" y1="${y}" x2="${xx}" y2="${y + tableH}" stroke="${t.border}" stroke-width="1.5"/>`);
  }

  const labels = tableCells.slice(0, cols).map((cell, index) => {
    const x = startX + index * colW;
    return `
      ${rect(x + 8, y + rowH + 8, colW - 16, rowH - 16, t.amberSoft, { stroke: t.amber, sw: 2, rx: 8 })}
      ${text(x + colW / 2, y + rowH + 38, cell.label || cell.role, { size: cfg.compact ? 14 : 17, weight: 750, fill: t.ink, anchor: 'middle' })}
    `;
  }).join('');

  const headerLabels = Array.from({ length: cols }, (_, index) => (
    text(startX + index * colW + colW / 2, y + 34, index === 0 ? 'bron' : `waarde ${index}`, {
      size: cfg.compact ? 13 : 16,
      weight: 800,
      fill: t.soft,
      anchor: 'middle',
    })
  )).join('');

  const annotationLines = annotations.length > 0
    ? annotations.map((item) => item.text_nl || item.label || item.role)
    : [visualState.accessibility.non_color_fallback];
  const noteY = y + tableH + (cfg.compact ? 28 : 42);
  const note = `
    ${rect(startX, noteY, tableW, cfg.compact ? 74 : 92, t.noteBg, { stroke: t.border, sw: 1, rx: 10 })}
    ${lineText(startX + 24, noteY + 30, annotationLines.slice(0, cfg.compact ? 2 : 3), { size: cfg.compact ? 14 : 18, weight: 500, fill: t.ink })}
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.w}" height="${cfg.h}" viewBox="0 0 ${cfg.w} ${cfg.h}" role="img" aria-label="${esc(visualState.semantic_focus)}">
    ${header}
    ${rect(startX, y, tableW, tableH, t.panel, { stroke: t.border, sw: 1.5, rx: 8 })}
    ${grid.join('')}
    ${headerLabels}
    ${labels}
    ${note}
  </svg>`;

  return {
    renderer: 'table_trace',
    svg,
    checks: ['table_grid_rendered', 'selected_cells_labeled', 'annotation_rendered'],
    warnings: tableCells.length === 0 ? ['no_table_cell_elements'] : [],
  };
}

module.exports = { renderTableTrace };
