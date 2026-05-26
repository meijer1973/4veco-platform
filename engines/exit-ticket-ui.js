// Exit Ticket Checkpoint UI.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.ExitTicketUI = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function readStars(storage) {
    try {
      storage = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
      if (!storage) return {};
      var raw = storage.getItem('skilltree_global_stars');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function buildSkillView(data, engine, globals) {
    globals = globals || {};
    var request = engine.getSkillMapRequest();
    var routeLabels = data.skillMap && Array.isArray(data.skillMap.routes) ? data.skillMap.routes.slice() : [];
    var view = {
      request: request,
      routeLabels: routeLabels,
      visibleSkills: []
    };
    var SkillMapEngine = globals.SkillMapEngine || (typeof window !== 'undefined' ? window.SkillMapEngine : null);
    var elements = globals.SKILL_TREE_ELEMENTS || (typeof window !== 'undefined' ? window.SKILL_TREE_ELEMENTS : null);
    var skillData = globals.SKILL_TREE_DATA || (typeof window !== 'undefined' ? window.SKILL_TREE_DATA : null);
    if (SkillMapEngine && elements && skillData) {
      try {
        var mapEngine = new SkillMapEngine({
          elements: elements,
          data: skillData,
          stars: readStars(globals.localStorage)
        });
        view.skillMapView = mapEngine.buildView(request);
        view.visibleSkills = view.skillMapView.visibleSkills || [];
      } catch (e) {
        view.warning = 'skill_map_view_unavailable';
      }
    }
    return view;
  }

  function renderRouteCards(data) {
    var routes = data.skillMap && Array.isArray(data.skillMap.routes) ? data.skillMap.routes : [];
    if (!routes.length) return '';
    return routes.map(function (route) {
      return '<a class="et-route-card" href="' + escapeHtml(route.href) + '">' +
        '<span class="et-route-surface">' + escapeHtml(route.surface) + '</span>' +
        '<strong>' + escapeHtml(route.label) + '</strong>' +
        '</a>';
    }).join('');
  }

  function renderTask(task, index) {
    var options = task.options.map(function (option) {
      return '<button type="button" class="et-option" data-task-id="' + escapeHtml(task.id) + '" data-answer-id="' + escapeHtml(option.id) + '">' +
        '<span class="et-option-letter">' + escapeHtml(option.id.toUpperCase()) + '</span>' +
        '<span>' + escapeHtml(option.label) + '</span>' +
        '</button>';
    }).join('');
    return '<article class="et-task" data-task="' + escapeHtml(task.id) + '">' +
      '<div class="et-task-meta">' +
        '<span>Vraag ' + (index + 1) + '</span>' +
        '<span>' + escapeHtml(task.skillLabel) + '</span>' +
      '</div>' +
      '<h2>' + escapeHtml(task.prompt) + '</h2>' +
      '<div class="et-options">' + options + '</div>' +
      '<div class="et-feedback" id="feedback-' + escapeHtml(task.id) + '" aria-live="polite"></div>' +
    '</article>';
  }

  function renderStaticHtml(data, view) {
    view = view || {};
    return '<section class="et-hero">' +
      '<div>' +
        '<p class="et-eyebrow">Afronden</p>' +
        '<h1>' + escapeHtml(data.title) + '</h1>' +
        '<p>' + escapeHtml(data.intro) + '</p>' +
      '</div>' +
      '<aside class="et-route-panel" aria-label="' + escapeHtml(data.skillMap && data.skillMap.title ? data.skillMap.title : 'Oefenroute') + '">' +
        '<div class="et-route-head">' +
          '<span>' + escapeHtml(data.skillMap && data.skillMap.title ? data.skillMap.title : 'Oefenroute') + '</span>' +
          '<span>compact</span>' +
        '</div>' +
        '<div class="et-route-grid">' + renderRouteCards(data) + '</div>' +
      '</aside>' +
    '</section>' +
    '<section class="et-tasks">' + data.tasks.map(renderTask).join('') + '</section>' +
    '<section class="et-completion" id="et-completion" hidden>' +
      '<h2>' + escapeHtml(data.completion && data.completion.title ? data.completion.title : 'Kies je volgende oefenstap') + '</h2>' +
      '<p>' + escapeHtml(data.completion && data.completion.text ? data.completion.text : '') + '</p>' +
      '<div class="et-route-grid">' + renderRouteCards(data) + '</div>' +
    '</section>';
  }

  function updateCompletion(app, engine) {
    var completion = app.querySelector('#et-completion');
    if (!completion) return;
    var progress = engine.getProgress();
    completion.hidden = progress.pending !== 0;
  }

  function bindInteractions(app, engine) {
    app.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('.et-option') : null;
      if (!button) return;
      var taskId = button.getAttribute('data-task-id');
      var answerId = button.getAttribute('data-answer-id');
      var result = engine.checkTask(taskId, answerId);
      var task = app.querySelector('[data-task="' + taskId + '"]');
      if (task) {
        var options = task.querySelectorAll('.et-option');
        for (var i = 0; i < options.length; i++) {
          options[i].classList.remove('selected');
          options[i].removeAttribute('aria-pressed');
        }
      }
      button.classList.add('selected');
      button.setAttribute('aria-pressed', 'true');
      var feedback = app.querySelector('#feedback-' + taskId);
      if (feedback) {
        feedback.className = 'et-feedback ' + (result.matched ? 'is-match' : 'is-retry');
        feedback.innerHTML =
          '<strong>' + escapeHtml(result.feedbackTitle) + '</strong>' +
          '<p>' + escapeHtml(result.feedbackText) + '</p>' +
          '<a href="' + escapeHtml(result.practiceRoute.href) + '">' + escapeHtml(result.practiceRoute.label) + '</a>';
      }
      updateCompletion(app, engine);
    });
  }

  function init(options) {
    options = options || {};
    var rootObj = options.root || (typeof window !== 'undefined' ? window : {});
    var documentObj = options.document || rootObj.document;
    if (!documentObj) return null;
    var app = documentObj.getElementById(options.appId || 'exit-ticket-app');
    if (!app) return null;
    var Engine = options.Engine || rootObj.ExitTicketEngine;
    var data = options.data || rootObj.EXIT_TICKET_DATA;
    if (!Engine || !data) {
      app.innerHTML = '<p class="et-error">Deze check kan nu niet laden.</p>';
      return null;
    }
    var engine = new Engine({
      data: data,
      SkillMapEngine: options.SkillMapEngine || rootObj.SkillMapEngine
    });
    var view = buildSkillView(data, engine, rootObj);
    app.innerHTML = renderStaticHtml(data, view);
    bindInteractions(app, engine);
    return { engine: engine, view: view };
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function () { init(); });
  }

  return {
    init: init,
    renderStaticHtml: renderStaticHtml,
    buildSkillView: buildSkillView,
    escapeHtml: escapeHtml
  };
});
