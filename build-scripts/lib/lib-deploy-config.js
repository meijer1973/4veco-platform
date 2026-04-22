/**
 * lib-deploy-config.js — Loader for a book's deploy-config.json manifest.
 *
 * Every deploy target (4veco-lessen/Boek N - ...) carries a manifest at its
 * root that declares chapters, paragraphs, domain assignments, and hidden
 * paragraphs. Platform generators read this file instead of hard-coding
 * target-specific data. Flat paragraph layout is assumed everywhere.
 *
 * Usage:
 *   const { loadConfig } = require('./lib-deploy-config');
 *   const cfg = loadConfig(process.env.MODULE_ROOT);
 *   for (const par of cfg.paragraphs) { ... }
 *
 * Hard-fails if the manifest is missing or malformed — there is intentionally
 * no implicit fallback. Every target must declare itself.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const MANIFEST_NAME = 'deploy-config.json';

const REQUIRED_TOP = ['nr', 'name', 'chapters', 'paragraphs'];
const REQUIRED_CHAPTER = ['id', 'folder', 'name', 'number', 'domain'];
const REQUIRED_PARAGRAPH = ['id', 'name', 'chapter', 'domain'];

function loadConfig(moduleRoot) {
    if (!moduleRoot) {
        throw new Error(
            'loadConfig: moduleRoot is required. ' +
            'Set MODULE_ROOT env var or pass the target book path explicitly.'
        );
    }
    const resolved = path.resolve(moduleRoot);
    const manifestPath = path.join(resolved, MANIFEST_NAME);
    if (!fs.existsSync(manifestPath)) {
        throw new Error(
            `loadConfig: no ${MANIFEST_NAME} at ${resolved}.\n` +
            `Every deploy target must ship a manifest. See 4veco-platform/BUILD-PARAGRAPH.md.`
        );
    }

    let raw;
    try {
        raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
        throw new Error(`loadConfig: ${manifestPath} is not valid JSON — ${e.message}`);
    }

    validate(raw, manifestPath);

    const chapterIndex = {};
    for (const ch of raw.chapters) chapterIndex[ch.id] = ch;

    const paragraphIndex = {};
    for (const p of raw.paragraphs) paragraphIndex[p.id] = p;

    const hidden = new Set(raw.hiddenParagraphs || []);

    return {
        moduleRoot: resolved,
        manifestPath,
        nr: raw.nr,
        name: raw.name,
        displayLabel: `Boek ${raw.nr}: ${raw.name}`,
        chapters: raw.chapters,
        paragraphs: raw.paragraphs,
        chapterIndex,
        paragraphIndex,
        hiddenParagraphs: hidden,

        // ── Helpers ─────────────────────────────────────────────────

        isHidden(paragraphId) {
            return hidden.has(paragraphId);
        },

        chapterOrder() {
            return raw.chapters.map(c => c.id);
        },

        chapterOf(paragraphId) {
            const p = paragraphIndex[paragraphId];
            return p ? chapterIndex[p.chapter] : null;
        },

        chapterFullLabel(chapterId) {
            const ch = chapterIndex[chapterId];
            if (!ch) return '';
            return `Hoofdstuk ${ch.number} – ${ch.name}`;
        },

        /**
         * Absolute path to a paragraph's folder on disk. The folder name is
         * discovered by prefix match inside the chapter folder — the
         * manifest declares the paragraph id, the filesystem owns the name.
         * Returns null if the chapter or paragraph folder is missing.
         */
        findParagraphFolder(paragraphId) {
            const p = paragraphIndex[paragraphId];
            if (!p) return null;
            const ch = chapterIndex[p.chapter];
            if (!ch) return null;
            const chapterPath = path.join(resolved, ch.folder);
            if (!fs.existsSync(chapterPath)) return null;
            const entries = fs.readdirSync(chapterPath, { withFileTypes: true });
            const match = entries.find(
                e => e.isDirectory() && e.name.startsWith(paragraphId + ' ')
            );
            return match ? { fullPath: path.join(chapterPath, match.name), folderName: match.name } : null;
        },
    };
}

function validate(raw, manifestPath) {
    for (const k of REQUIRED_TOP) {
        if (raw[k] === undefined || raw[k] === null) {
            throw new Error(`${manifestPath}: missing required top-level field "${k}"`);
        }
    }
    if (!Array.isArray(raw.chapters) || raw.chapters.length === 0) {
        throw new Error(`${manifestPath}: "chapters" must be a non-empty array`);
    }
    if (!Array.isArray(raw.paragraphs) || raw.paragraphs.length === 0) {
        throw new Error(`${manifestPath}: "paragraphs" must be a non-empty array`);
    }

    const chapterIds = new Set();
    for (const ch of raw.chapters) {
        for (const k of REQUIRED_CHAPTER) {
            if (ch[k] === undefined || ch[k] === null) {
                throw new Error(`${manifestPath}: chapter ${JSON.stringify(ch)} missing "${k}"`);
            }
        }
        if (chapterIds.has(ch.id)) {
            throw new Error(`${manifestPath}: duplicate chapter id "${ch.id}"`);
        }
        chapterIds.add(ch.id);
    }

    const paragraphIds = new Set();
    for (const p of raw.paragraphs) {
        for (const k of REQUIRED_PARAGRAPH) {
            if (p[k] === undefined || p[k] === null) {
                throw new Error(`${manifestPath}: paragraph ${JSON.stringify(p)} missing "${k}"`);
            }
        }
        if (!chapterIds.has(p.chapter)) {
            throw new Error(
                `${manifestPath}: paragraph "${p.id}" references chapter "${p.chapter}" not declared in chapters[]`
            );
        }
        if (paragraphIds.has(p.id)) {
            throw new Error(`${manifestPath}: duplicate paragraph id "${p.id}"`);
        }
        paragraphIds.add(p.id);
    }

    if (raw.hiddenParagraphs) {
        if (!Array.isArray(raw.hiddenParagraphs)) {
            throw new Error(`${manifestPath}: "hiddenParagraphs" must be an array`);
        }
        for (const h of raw.hiddenParagraphs) {
            if (!paragraphIds.has(h)) {
                throw new Error(
                    `${manifestPath}: hiddenParagraphs contains "${h}" which is not a declared paragraph id`
                );
            }
        }
    }
}

module.exports = { loadConfig };
