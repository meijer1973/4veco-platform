/**
 * SkillMapRouteUI - shared scoped route preview for practice surfaces.
 *
 * This renderer is intentionally small. It displays the route view model from
 * SkillMapEngine, but it does not score, diagnose, grade, sequence, or make
 * mastery decisions.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.SkillMapRouteUI = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'skilltree_global_stars';

  function getGlobalRoot() {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    return {};
  }

  function loadSkillMapEngine() {
    var root = getGlobalRoot();
    if (root.SkillMapEngine) return root.SkillMapEngine;
    if (typeof require === 'function') {
      try { return require('./skill-map-engine'); } catch (e) { return null; }
    }
    return null;
  }

  function readStars(storage) {
    var source = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!source || typeof source.getItem !== 'function') return {};
    try {
      return JSON.parse(source.getItem(STORAGE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function aspectLabel(aspect) {
    if (aspect === 'reasoning') return 'Redeneren';
    if (aspect === 'calculation') return 'Rekenen';
    if (aspect === 'graphical') return 'Grafieken';
    if (aspect === 'mixed') return 'Gemengd';
    return 'Oefenroute';
  }

  function stateClass(state) {
    if (state === 'recommended') return ' is-recommended';
    if (state === 'in_progress') return ' is-in-progress';
    if (state === 'practised') return ' is-practised';
    if (state === 'not_yet_useful') return ' is-later';
    return ' is-available';
  }

  function compactStars(count) {
    var value = Math.max(0, Math.min(3, count || 0));
    return value + '/3';
  }

  function recommendedSkillLabel(view, visibleSkills) {
    if (!view || !view.recommendedSkillId) return null;
    for (var i = 0; i < visibleSkills.length; i++) {
      if (visibleSkills[i].id === view.recommendedSkillId) {
        return visibleSkills[i].label || null;
      }
    }
    return null;
  }

  function buildView(config) {
    config = config || {};
    var root = getGlobalRoot();
    var Engine = config.SkillMapEngine || loadSkillMapEngine();
    var elements = config.elements || root.SKILL_TREE_ELEMENTS;
    var data = config.data || root.SKILL_TREE_DATA;
    if (!Engine || !elements || !data) return null;

    var request = config.request;
    if (!request && typeof Engine.createRequest === 'function') {
      request = Engine.createRequest('landing-preview', {
        paragraph: data.parNr || null,
        mode: 'compact'
      });
    }
    if (!request) return null;

    var map = new Engine({
      elements: elements,
      data: data,
      stars: config.stars || readStars(config.storage)
    });
    return map.buildView(request);
  }

  function renderView(view, options) {
    if (!view) return '';
    options = options || {};
    var title = options.title || ('Oefenroute ' + aspectLabel(view.aspectFilter));
    var visible = Array.isArray(view.visibleSkills) ? view.visibleSkills : [];
    var items = visible.map(function (skill) {
      return [
        '<li class="skill-map-route-item' + stateClass(skill.state) + '">',
        '<span class="skill-map-route-name">' + escapeHtml(skill.label) + '</span>',
        '<span class="skill-map-route-state">' + escapeHtml(skill.studentLabel) + '</span>',
        '<span class="skill-map-route-stars" aria-label="' + escapeHtml(compactStars(skill.stars)) + ' oefensterren">' + escapeHtml(compactStars(skill.stars)) + '</span>',
        '</li>'
      ].join('');
    }).join('');

    if (!items) {
      items = '<li class="skill-map-route-item is-later"><span class="skill-map-route-name">Deze route is nog niet gevuld.</span></li>';
    }
    var nextFocusLabel = recommendedSkillLabel(view, visible);

    var hiddenCount = 0;
    if (view.collapsedCounts) {
      hiddenCount += view.collapsedCounts.notYetUseful || 0;
      hiddenCount += view.collapsedCounts.fullCatalogHidden || 0;
      hiddenCount += view.collapsedCounts.outOfAspect || 0;
    }
    var hiddenNote = hiddenCount > 0
      ? '<p class="skill-map-route-note">' + hiddenCount + ' vaardigheden zijn ingeklapt zodat deze oefenroute rustig blijft.</p>'
      : '';

    return [
      '<section class="skill-map-route" aria-label="' + escapeHtml(title) + '">',
      '<div class="skill-map-route-head">',
      '<p class="skill-map-route-kicker">' + escapeHtml(aspectLabel(view.aspectFilter)) + '</p>',
      '<h2>' + escapeHtml(title) + '</h2>',
      '</div>',
      '<div class="skill-map-route-primary">',
      '<span class="skill-map-route-action">' + escapeHtml(view.primaryAction && view.primaryAction.label || 'Start oefenen') + '</span>',
      nextFocusLabel ? '<span class="skill-map-route-next">Focus: ' + escapeHtml(nextFocusLabel) + '</span>' : '',
      '</div>',
      '<ul class="skill-map-route-list">',
      items,
      '</ul>',
      hiddenNote,
      '<p class="skill-map-route-boundary">Alleen lokale oefenvoortgang. Geen diagnose, beoordeling of automatische route.</p>',
      '</section>'
    ].join('');
  }

  function renderRequest(request, options) {
    options = options || {};
    var view = buildView(Object.assign({}, options, { request: request }));
    return renderView(view, options);
  }

  function renderInto(container, request, options) {
    if (!container) return null;
    var html = renderRequest(request, options);
    container.hidden = html.length === 0;
    container.innerHTML = html;
    return html;
  }

  return {
    buildView: buildView,
    renderView: renderView,
    renderRequest: renderRequest,
    renderInto: renderInto,
    readStars: readStars
  };
});
