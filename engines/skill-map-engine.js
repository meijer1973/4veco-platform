/**
 * SkillMapEngine - shared route/view-model logic for practice surfaces.
 *
 * This module does not score, diagnose, sequence, grade, or personalize.
 * It only turns local practice-progress stars plus explicit request scope into
 * a display view model for route previews and practice entry points.
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.SkillMapEngine = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var PREREQ_STAR_THRESHOLD = 1;
    var PRACTISED_STAR_THRESHOLD = 3;

    var ASPECT_SOURCE = {
        reasoning: 'verbaal',
        calculation: 'rekenen',
        graphical: 'grafisch'
    };

    var ASPECT_NORMALIZED = {
        verbaal: 'reasoning',
        rekenen: 'calculation',
        grafisch: 'graphical',
        reasoning: 'reasoning',
        calculation: 'calculation',
        graphical: 'graphical'
    };

    var DEFAULT_BOUNDARY_FLAGS = {
        diagnostics: false,
        adaptiveRouting: false,
        masteryDecisions: false,
        automaticSequencing: false,
        studentFacingAI: false,
        summativeUse: false,
        pvProjection: false,
        pvMachinePromotion: false,
        studentFacingOutput: false
    };

    var SURFACE_DEFAULTS = {
        'reasoning-game': { aspectFilter: 'reasoning', mode: 'route' },
        redeneren: { aspectFilter: 'reasoning', mode: 'route' },
        'calculation-game': { aspectFilter: 'calculation', mode: 'route' },
        rekenen: { aspectFilter: 'calculation', mode: 'route' },
        'procedure-game': { aspectFilter: 'calculation', mode: 'route' },
        'graphical-game': { aspectFilter: 'graphical', mode: 'route' },
        grafieken: { aspectFilter: 'graphical', mode: 'route' },
        'exit-ticket': { aspectFilter: 'mixed', mode: 'compact' },
        'landing-preview': { aspectFilter: 'mixed', mode: 'compact' }
    };

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function copyFlags() {
        return clone(DEFAULT_BOUNDARY_FLAGS);
    }

    function normalizeAspectFilter(value) {
        if (value === 'reasoning' || value === 'calculation' || value === 'graphical' || value === 'mixed') {
            return value;
        }
        return 'mixed';
    }

    function normalizeMode(mode, allowFullView, warnings) {
        if (mode === 'full') {
            if (allowFullView === true) return 'full';
            warnings.push('full_view_requires_explicit_allowFullView');
            return 'route';
        }
        if (mode === 'route' || mode === 'compact') return mode;
        return 'compact';
    }

    function normalizeAspects(skill) {
        var raw = Array.isArray(skill.aspects) ? skill.aspects : [];
        var out = [];
        var seen = {};
        for (var i = 0; i < raw.length; i++) {
            var normalized = ASPECT_NORMALIZED[raw[i]];
            if (normalized && !seen[normalized]) {
                seen[normalized] = true;
                out.push(normalized);
            }
        }
        return out;
    }

    function sourceAspects(skill) {
        return Array.isArray(skill.aspects) ? skill.aspects.slice() : [];
    }

    function matchesAspect(skill, aspectFilter) {
        var raw = sourceAspects(skill);
        if (aspectFilter === 'mixed') return raw.length > 1;
        return raw.indexOf(ASPECT_SOURCE[aspectFilter]) !== -1;
    }

    function skillIdSet(ids) {
        var set = {};
        if (!Array.isArray(ids)) return null;
        for (var i = 0; i < ids.length; i++) set[ids[i]] = true;
        return set;
    }

    function buildSkillMap(skills) {
        var map = {};
        for (var i = 0; i < skills.length; i++) map[skills[i].id] = skills[i];
        return map;
    }

    function collectPrereqs(skillId, skillMap, out) {
        var skill = skillMap[skillId];
        if (!skill || !Array.isArray(skill.needs)) return;
        for (var i = 0; i < skill.needs.length; i++) {
            var prereq = skill.needs[i];
            if (out[prereq]) continue;
            out[prereq] = true;
            collectPrereqs(prereq, skillMap, out);
        }
    }

    function prereqsMet(skill, stars) {
        var needs = Array.isArray(skill.needs) ? skill.needs : [];
        for (var i = 0; i < needs.length; i++) {
            if ((stars[needs[i]] || 0) < PREREQ_STAR_THRESHOLD) return false;
        }
        return true;
    }

    function stateFor(skill, stars, recommendedId) {
        var count = stars[skill.id] || 0;
        if (count >= PRACTISED_STAR_THRESHOLD) return 'practised';
        if (count > 0) return 'in_progress';
        if (skill.id === recommendedId) return 'recommended';
        if (prereqsMet(skill, stars)) return 'available';
        return 'not_yet_useful';
    }

    function studentLabel(state) {
        if (state === 'recommended') return 'aanbevolen om nu te oefenen';
        if (state === 'available') return 'beschikbaar';
        if (state === 'in_progress') return 'ga verder';
        if (state === 'practised') return 'geoefend';
        return 'later nodig';
    }

    function routeReason(routeRole, state) {
        if (routeRole === 'target') return 'doel van deze oefenroute';
        if (routeRole === 'prerequisite') return 'nodig op de route';
        if (state === 'recommended') return 'beste volgende oefening binnen deze route';
        if (state === 'available') return 'beschikbaar binnen deze route';
        if (state === 'in_progress') return 'eerder gestart binnen deze route';
        if (state === 'practised') return 'al geoefend binnen deze route';
        return 'later in de route';
    }

    function sortSkills(skills) {
        return skills.slice().sort(function (a, b) {
            if (a.layer !== b.layer) return a.layer - b.layer;
            return String(a.id).localeCompare(String(b.id));
        });
    }

    function chooseRecommended(skills, stars) {
        var sorted = sortSkills(skills);
        for (var i = 0; i < sorted.length; i++) {
            if ((stars[sorted[i].id] || 0) < PRACTISED_STAR_THRESHOLD && prereqsMet(sorted[i], stars)) {
                return sorted[i].id;
            }
        }
        return sorted.length ? sorted[0].id : null;
    }

    function toVisibleSkill(skill, stars, recommendedId, routeRole) {
        var state = stateFor(skill, stars, recommendedId);
        return {
            id: skill.id,
            label: skill.name,
            aspects: normalizeAspects(skill),
            sourceAspects: sourceAspects(skill),
            state: state,
            studentLabel: studentLabel(state),
            stars: stars[skill.id] || 0,
            routeRole: routeRole || 'candidate',
            routeReason: routeReason(routeRole || 'candidate', state)
        };
    }

    function buildPrimaryAction(surface, recommendedId, visibleSkills, request) {
        var skillId = recommendedId || (visibleSkills[0] && visibleSkills[0].id) || null;
        var state = null;
        for (var i = 0; i < visibleSkills.length; i++) {
            if (visibleSkills[i].id === skillId) {
                state = visibleSkills[i].state;
                break;
            }
        }
        return {
            label: request && request.practiceLabel
                ? request.practiceLabel
                : (state === 'in_progress' ? 'Ga verder' : 'Start oefenen'),
            href: request && request.practiceHref ? request.practiceHref : null,
            surface: surface || 'skill-map',
            skillId: skillId
        };
    }

    function buildViewModel(config) {
        config = config || {};
        var elements = config.elements || {};
        var request = config.request || {};
        var data = config.data || {};
        var warnings = [];
        var surfaceDefaults = SURFACE_DEFAULTS[request.surface] || {};
        var aspectFilter = normalizeAspectFilter(request.aspectFilter || surfaceDefaults.aspectFilter);
        var allowFullView = request.allowFullView === true;
        var mode = normalizeMode(request.mode || surfaceDefaults.mode || data.defaultSkillMapMode, allowFullView, warnings);
        var stars = config.stars || {};
        var allSkills = Array.isArray(elements.SKILLS) ? elements.SKILLS : [];
        var skillMap = buildSkillMap(allSkills);
        var scopeSet = skillIdSet(request.skillScope);
        if (!scopeSet && Array.isArray(data.activeSkills)) scopeSet = skillIdSet(data.activeSkills);

        var candidateSet = {};
        var targetSet = {};
        var targetSkills = Array.isArray(request.targetSkills) ? request.targetSkills : [];
        for (var t = 0; t < targetSkills.length; t++) {
            if (!skillMap[targetSkills[t]]) continue;
            targetSet[targetSkills[t]] = true;
            candidateSet[targetSkills[t]] = true;
            collectPrereqs(targetSkills[t], skillMap, candidateSet);
        }

        var scopedSkills = [];
        for (var i = 0; i < allSkills.length; i++) {
            var skill = allSkills[i];
            if (scopeSet && !scopeSet[skill.id] && !candidateSet[skill.id]) continue;
            if (mode === 'full') {
                scopedSkills.push(skill);
            } else if (candidateSet[skill.id] || matchesAspect(skill, aspectFilter)) {
                scopedSkills.push(skill);
            }
        }

        var recommendedId = chooseRecommended(
            scopedSkills.filter(function (skill) { return !candidateSet[skill.id] || targetSet[skill.id] || matchesAspect(skill, aspectFilter); }),
            stars
        );

        var visible = [];
        var collapsed = { notYetUseful: 0, outOfAspect: 0, fullCatalogHidden: 0 };
        var sorted = sortSkills(scopedSkills);

        for (var s = 0; s < sorted.length; s++) {
            var row = sorted[s];
            var routeRole = targetSet[row.id] ? 'target' : (candidateSet[row.id] ? 'prerequisite' : 'candidate');
            var vm = toVisibleSkill(row, stars, recommendedId, routeRole);
            if (mode === 'compact' && vm.state === 'not_yet_useful' && routeRole === 'candidate') {
                collapsed.notYetUseful++;
                continue;
            }
            visible.push(vm);
        }

        if (mode === 'compact') {
            var maxVisible = request.maxVisibleAvailable || 4;
            if (maxVisible < 2) maxVisible = 2;
            if (maxVisible > 4) maxVisible = 4;
            if (visible.length > maxVisible) {
                collapsed.fullCatalogHidden += visible.length - maxVisible;
                visible = visible.slice(0, maxVisible);
            }
        }

        if (mode !== 'full' && !scopeSet && data.activeSkills === null) {
            collapsed.fullCatalogHidden += Math.max(0, allSkills.length - visible.length - collapsed.notYetUseful);
        }

        var requestedFlags = request.boundaryFlags || {};
        for (var key in DEFAULT_BOUNDARY_FLAGS) {
            if (DEFAULT_BOUNDARY_FLAGS.hasOwnProperty(key) && requestedFlags[key] === true) {
                warnings.push('boundary_flag_forced_false:' + key);
            }
        }

        return {
            schema_version: 1,
            mode: mode,
            aspectFilter: aspectFilter,
            surface: request.surface || 'skill-map',
            title: request.title || null,
            paragraphTarget: request.paragraphTarget || null,
            routePurpose: request.routePurpose || null,
            primaryAction: buildPrimaryAction(request.surface, recommendedId, visible, request),
            recommendedSkillId: recommendedId,
            visibleSkills: visible,
            collapsedCounts: collapsed,
            fullViewAvailable: allowFullView,
            progress: {
                practiceProgressOnly: true,
                practised: visible.filter(function (skill) { return skill.state === 'practised'; }).length,
                visible: visible.length
            },
            boundaryFlags: copyFlags(),
            warnings: warnings
        };
    }

    function createRequest(surface, options) {
        options = options || {};
        var defaults = SURFACE_DEFAULTS[surface] || {};
        return {
            paragraph: options.paragraph || options.parNr || null,
            surface: surface,
            mode: options.mode || defaults.mode || 'compact',
            aspectFilter: normalizeAspectFilter(options.aspectFilter || defaults.aspectFilter),
            skillScope: Array.isArray(options.skillScope) ? options.skillScope.slice() : null,
            targetSkills: Array.isArray(options.targetSkills) ? options.targetSkills.slice() : [],
            maxVisibleAvailable: options.maxVisibleAvailable || 4,
            allowFullView: options.allowFullView === true,
            title: options.title || null,
            paragraphTarget: options.paragraphTarget || null,
            routePurpose: options.routePurpose || null,
            practiceHref: options.practiceHref || null,
            practiceLabel: options.practiceLabel || null,
            boundaryFlags: copyFlags()
        };
    }

    function SkillMapEngine(config) {
        config = config || {};
        this.elements = config.elements || {};
        this.data = config.data || {};
        this.stars = config.stars || {};
    }

    SkillMapEngine.prototype.buildView = function (request) {
        return buildViewModel({
            elements: this.elements,
            data: this.data,
            stars: this.stars,
            request: request
        });
    };

    SkillMapEngine.createRequest = createRequest;
    SkillMapEngine.buildViewModel = buildViewModel;
    SkillMapEngine.normalizeAspectFilter = normalizeAspectFilter;
    SkillMapEngine.DEFAULT_BOUNDARY_FLAGS = copyFlags();

    return SkillMapEngine;
});
