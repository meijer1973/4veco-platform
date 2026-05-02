const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const DEFAULT_PATHS = {
  procedureTemplates: 'references/data/procedure-visual/procedure-templates.json',
  visualStates: 'references/data/procedure-visual/visual-states.json',
  unitTemplateLinks: 'references/data/procedure-visual/unit-template-links.json',
  vocab: 'references/data/procedure-visual/procedure-visual-vocab.json',
};

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function byId(items, field) {
  return new Map(items.map((item) => [item[field], item]));
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function loadProcedureVisualData(paths = DEFAULT_PATHS) {
  const procedureTemplates = readJson(paths.procedureTemplates);
  const visualStates = readJson(paths.visualStates);
  const unitTemplateLinks = readJson(paths.unitTemplateLinks);
  const vocab = readJson(paths.vocab);
  const templates = procedureTemplates.templates || [];
  const states = visualStates.visual_states || [];
  const links = unitTemplateLinks.links || [];

  return {
    procedureTemplates,
    visualStates,
    unitTemplateLinks,
    vocab,
    templates,
    states,
    links,
    templatesById: byId(templates, 'template_id'),
    statesById: byId(states, 'visual_state_id'),
    linksByUnit: links.reduce((map, link) => {
      if (!map.has(link.unit_id)) map.set(link.unit_id, []);
      map.get(link.unit_id).push(link);
      return map;
    }, new Map()),
  };
}

function templateVisualStateSequence(template, statesById) {
  const sequenceIds = unique((template.procedure_steps || []).map((step) => step.visual_state_ref));
  return sequenceIds.map((visualStateId) => {
    const visualState = statesById.get(visualStateId);
    return {
      visual_state_id: visualStateId,
      found: Boolean(visualState),
      visual_type: visualState ? visualState.visual_type : null,
      semantic_focus: visualState ? visualState.semantic_focus : null,
      representation: visualState ? visualState.representation : null,
    };
  });
}

function answerModelStepOrder(template) {
  return (template.procedure_steps || [])
    .filter((step) => step.student_visible !== false)
    .map((step, index) => ({
      order: index + 1,
      step_id: step.step_id,
      label_nl: step.label_nl,
      action: step.action,
      input_refs: step.input_refs || [],
      output_refs: step.output_refs || [],
      visual_state_ref: step.visual_state_ref || null,
    }));
}

function templatePublicationBlocked(template) {
  return Boolean(
    template.publication &&
    template.publication.student_facing_allowed === false &&
    Array.isArray(template.blockers) &&
    template.blockers.length > 0
  );
}

function visualStatePublicationBlocked(visualState) {
  return Boolean(
    visualState.publication &&
    visualState.publication.student_facing_allowed === false &&
    visualState.accessibility &&
    visualState.accessibility.meaning_not_color_only === true &&
    visualState.accessibility.direct_labels_required === true
  );
}

function buildTemplateProjectionModel(template, statesById) {
  return {
    template_id: template.template_id,
    source_unit_ids: template.source_unit_ids || [],
    representation: template.representation,
    economic_context: template.economic_context,
    status: template.status,
    operation_reference_status: template.operation_reference_status,
    visual_state_sequence: templateVisualStateSequence(template, statesById),
    answer_model_step_order: answerModelStepOrder(template),
    publication_blocked: templatePublicationBlocked(template),
    projection_flags: template.projections || {},
    blockers: template.blockers || [],
  };
}

function summarizeProjectionModels(models) {
  const visualTypes = {};
  const surfaces = {};
  for (const model of models) {
    for (const visual of model.visual_state_sequence) {
      if (visual.visual_type) visualTypes[visual.visual_type] = (visualTypes[visual.visual_type] || 0) + 1;
    }
    for (const surface of model.rendered_surfaces || []) {
      surfaces[surface] = (surfaces[surface] || 0) + 1;
    }
  }
  return {
    template_count: models.length,
    publication_blocked_count: models.filter((model) => model.publication_blocked).length,
    visual_type_counts: visualTypes,
    rendered_surface_counts: surfaces,
  };
}

module.exports = {
  DEFAULT_PATHS,
  loadProcedureVisualData,
  templateVisualStateSequence,
  answerModelStepOrder,
  templatePublicationBlocked,
  visualStatePublicationBlocked,
  buildTemplateProjectionModel,
  summarizeProjectionModels,
};
