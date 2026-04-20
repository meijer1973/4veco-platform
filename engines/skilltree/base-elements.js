/**
 * SkillTree Base Elements — thin adapter that joins the canonical
 * micro-teaching-units catalog with the generator functions.
 *
 * SKILLS data is authoritatively sourced from
 *   references/machine/micro-teaching-units.json
 * (A-domain slice, edited only via CLI scripts under build-scripts/references/).
 *
 * GEN functions live in ./generators.js. LAYER_NAMES and LAYER_COLORS stay
 * inline here because they are presentation-layer concerns, not curriculum data.
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.SKILL_TREE_ELEMENTS = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Load catalog + generators. Both require synchronous availability.
    var units, generators;
    if (typeof module !== 'undefined' && module.exports) {
        units = require('../../references/machine/micro-teaching-units.json');
        generators = require('./generators');
    } else {
        units = (root.MICRO_TEACHING_UNITS || []);
        generators = (root.SKILL_TREE_GENERATORS || { GEN: {}, helpers: {} });
    }

    var SKILLS = [];
    for (var i = 0; i < units.length; i++) {
        var u = units[i];
        if (u.id.charAt(0) !== 'A') continue;
        if (u.deprecated) continue;
        SKILLS.push({
            id: u.id,
            name: u.name,
            layer: u.layer,
            needs: u.needs || [],
            desc: u.kern || (u.procedure && u.procedure[0]) || ''
        });
    }

    var LAYER_NAMES = ['Fundament', 'Bouwstenen', 'Marginale grootheden', 'Samengesteld', 'Gevorderd', 'Eindbazen'];
    var LAYER_COLORS = [
        { bg:'#1a3353', text:'#7cb9e8', glow:'rgba(26,82,118,0.35)' },
        { bg:'#2a1f4e', text:'#b8a9e8', glow:'rgba(136,78,160,0.3)' },
        { bg:'#1a3a3a', text:'#7dcec0', glow:'rgba(30,132,120,0.3)' },
        { bg:'#1a3a2a', text:'#7dcea0', glow:'rgba(30,132,73,0.3)' },
        { bg:'#3a1a2a', text:'#e07a9a', glow:'rgba(180,60,100,0.3)' },
        { bg:'#4a2a1a', text:'#f0b27a', glow:'rgba(230,126,34,0.3)' }
    ];

    return {
        SKILLS: SKILLS,
        LAYER_NAMES: LAYER_NAMES,
        LAYER_COLORS: LAYER_COLORS,
        GEN: generators.GEN,
        helpers: generators.helpers
    };
});
