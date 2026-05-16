/**
 * AdaptiveSeam — safe inert reader for future game-adaptive input.
 *
 * This helper defines the shared localStorage contract only. It must not route,
 * score, diagnose, sequence, or personalize gameplay by itself.
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.AdaptiveSeam = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var STORAGE_KEY = '4veco.adaptivePayload.v1';
    var SCHEMA_VERSION = 1;

    function cleanString(value, fallback) {
        if (typeof value !== 'string') return fallback;
        var trimmed = value.trim();
        return trimmed ? trimmed : fallback;
    }

    function cleanStringArray(value) {
        if (!Array.isArray(value)) return [];
        var out = [];
        var seen = {};
        for (var i = 0; i < value.length; i++) {
            var item = cleanString(value[i], '');
            if (item && !seen[item]) {
                seen[item] = true;
                out.push(item);
            }
        }
        return out;
    }

    function createDefaultPayload(options) {
        options = options || {};
        return {
            schema_version: SCHEMA_VERSION,
            paragraph_id: cleanString(options.paragraphId, null),
            focus_skills: [],
            difficulty_hint: 'default',
            allowed_hints: 'default',
            source: 'none'
        };
    }

    function normalizePayload(value, options) {
        var base = createDefaultPayload(options);
        if (!value || typeof value !== 'object') return base;
        if (value.schema_version !== SCHEMA_VERSION) return base;

        return {
            schema_version: SCHEMA_VERSION,
            paragraph_id: cleanString(value.paragraph_id, base.paragraph_id),
            focus_skills: cleanStringArray(value.focus_skills),
            difficulty_hint: cleanString(value.difficulty_hint, 'default'),
            allowed_hints: cleanString(value.allowed_hints, 'default'),
            source: cleanString(value.source, 'none')
        };
    }

    function resolveStorage(storage) {
        if (storage) return storage;
        try {
            if (typeof localStorage !== 'undefined') return localStorage;
        } catch (e) {
            return null;
        }
        return null;
    }

    function readPayload(options) {
        options = options || {};
        var storage = resolveStorage(options.storage);
        if (!storage || typeof storage.getItem !== 'function') {
            return createDefaultPayload(options);
        }
        try {
            var raw = storage.getItem(STORAGE_KEY);
            if (!raw) return createDefaultPayload(options);
            return normalizePayload(JSON.parse(raw), options);
        } catch (e) {
            return createDefaultPayload(options);
        }
    }

    return {
        STORAGE_KEY: STORAGE_KEY,
        SCHEMA_VERSION: SCHEMA_VERSION,
        createDefaultPayload: createDefaultPayload,
        normalizePayload: normalizePayload,
        readPayload: readPayload
    };
});
