const crypto = require('crypto');

const { SURFACES } = require('./lib-visual-surfaces');
const { renderFormulaTrace } = require('./lib-formula-trace-renderer');
const { renderFlowchart } = require('./lib-flowchart-renderer');
const { renderTableTrace } = require('./lib-table-trace-renderer');
const { renderGraphStage } = require('./lib-graph-stage-renderer');

const SURFACE_ALIASES = {
  docx: 'doc',
  summary_thumbnail: 'summary',
};

const RENDERERS = {
  formula_trace: renderFormulaTrace,
  flowchart: renderFlowchart,
  table_trace: renderTableTrace,
  graph_stage: renderGraphStage,
};

function surfaceKey(surfaceId) {
  return SURFACE_ALIASES[surfaceId] || surfaceId;
}

function surfaceConfig(surfaceId) {
  const key = surfaceKey(surfaceId);
  const cfg = SURFACES[key];
  if (!cfg) throw new Error(`Unsupported PV surface: ${surfaceId}`);
  return { ...cfg, surface_id: surfaceId, surface_key: key };
}

function requiredSurfaceIds(visualState) {
  const requirements = visualState.surface_requirements || {};
  return Object.entries(requirements)
    .filter(([, required]) => required === true)
    .map(([surfaceId]) => surfaceId);
}

function rendererForVisualType(visualType) {
  if (RENDERERS[visualType]) return RENDERERS[visualType];
  if (String(visualType).includes('formula_trace')) return renderFormulaTrace;
  if (String(visualType).includes('graph_stage')) return renderGraphStage;
  if (String(visualType).includes('table_trace')) return renderTableTrace;
  if (String(visualType).includes('flowchart')) return renderFlowchart;
  throw new Error(`No PV renderer for visual_type ${visualType}`);
}

function hashSvg(svg) {
  return crypto.createHash('sha256').update(svg).digest('hex');
}

function renderVisualState(visualState, options = {}) {
  const surfaceId = options.surface_id || options.surface || 'web_light';
  const cfg = surfaceConfig(surfaceId);
  const renderer = rendererForVisualType(visualState.visual_type);
  const result = renderer(visualState, { ...options, surface: cfg });
  const svg = result.svg;
  return {
    visual_state_id: visualState.visual_state_id,
    visual_type: visualState.visual_type,
    surface_id: surfaceId,
    surface_key: cfg.surface_key,
    renderer: result.renderer,
    status: 'rendered',
    svg,
    svg_sha256: hashSvg(svg),
    svg_char_count: svg.length,
    checks: [
      ...(result.checks || []),
      visualState.accessibility && visualState.accessibility.meaning_not_color_only === true
        ? 'meaning_not_color_only'
        : 'missing_meaning_not_color_only',
      visualState.accessibility && visualState.accessibility.direct_labels_required === true
        ? 'direct_labels_required'
        : 'missing_direct_labels_required',
    ],
    warnings: result.warnings || [],
  };
}

module.exports = {
  SURFACE_ALIASES,
  requiredSurfaceIds,
  surfaceConfig,
  renderVisualState,
  rendererForVisualType,
};
