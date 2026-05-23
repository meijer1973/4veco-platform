const fs = require('fs');
const path = require('path');

const FILES = [
    'engines/skilltree-ui.js',
    'build-scripts/platform/build-skilltree-shells.js',
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
});
