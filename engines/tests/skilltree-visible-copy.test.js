const fs = require('fs');
const path = require('path');

const FILES = [
    'engines/skilltree-ui.js',
    'engines/skill-map-route-ui.js',
    'build-scripts/platform/build-skilltree-shells.js',
    'build-scripts/platform/build-reasoning-engine.js',
    'build-scripts/platform/build-procedure-shells.js',
    'build-scripts/platform/build-graphical-shells.js',
    'engines/tests/harness-skilltree-ui.html',
    'engines/tests/_wiskundevaardigheden-template.html'
];

const BANNED_VISIBLE_COPY = [
    'Meesterschap',
    'Doel al behaald',
    'Doel behaald',
    'Voltooid',
    'beheerst'
];

describe('skilltree visible practice-copy boundary', () => {
    test.each(FILES)('%s avoids mastery/achievement visible copy', relativePath => {
        const filePath = path.resolve(__dirname, '..', '..', relativePath);
        const text = fs.readFileSync(filePath, 'utf8');

        for (const phrase of BANNED_VISIBLE_COPY) {
            expect(text).not.toContain(phrase);
        }
    });

    test('result next-step copy uses skill names instead of internal skill IDs', () => {
        const filePath = path.resolve(__dirname, '..', 'skilltree-ui.js');
        const text = fs.readFileSync(filePath, 'utf8');

        expect(text).toContain('var nextLabel = skillDisplayName(next.id);');
        expect(text).toContain('Volgende: \' + esc(nextLabel)');
        expect(text).not.toContain('Volgende: \' + esc(next.id)');
    });

    test('dependency graph node captions do not render raw internal skill IDs as visible text', () => {
        const filePath = path.resolve(__dirname, '..', 'skilltree-ui.js');
        const text = fs.readFileSync(filePath, 'utf8');

        expect(text).toContain('<text class="st-dep-node-id" x="8" y="14">Vaardigheid</text>');
        expect(text).not.toMatch(/st-dep-node-id[^\\n]+esc\\(nd\\.id\\)/);
    });
});
