/**
 * Regression test for L1.5V Bucket A5 / QA-1: regenerated companion DOCX
 * files must not declare custom paragraph-style IDs that collide with Word's
 * built-in style IDs (e.g. Heading1, Heading2, Title, Normal).
 *
 * The voorkennis review (1.1.1-companion-visual-review.md, QA-1) flagged that
 * b1-111-voorkennis.js declared a custom style id "Heading1" colliding with
 * Word's built-in, which broke `python build-scripts/render_docx.py
 * --renderer artifact-tool` with `Argument_AddingDuplicateWithKey, Heading1`.
 * The same pattern lived in b1-111-vaardigheden.js. Both fixed in A5.
 *
 * This test inspects the deployed DOCX files (when present) and asserts that
 * styles.xml has unique w:styleId values across customStyle entries, AND
 * that no customStyle declares an ID matching Word's built-in set.
 *
 * Skips cleanly if the DOCX isn't deployed (e.g. fresh repo before builders
 * have run).
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DOCX_FILES = [
    {
        label: 'voorkennis (1.1.1)',
        relPath: '1.1.1 Schaarste en economisch denken – uitleg voorkennis.docx',
    },
    {
        label: 'vaardigheden (1.1.1)',
        relPath: '1.1.1 Schaarste en economisch denken – uitleg vaardigheden.docx',
    },
];

const PARA_DIR = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '4veco-lessen',
    'Boek 1 - Grondslagen, vraag en aanbod',
    '1.1 Hoofdstuk Economisch denken en rekenen',
    '1.1.1 Schaarste en economisch denken'
);

// Word built-in style IDs custom styles must NOT collide with.
const RESERVED_IDS = ['Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5',
                       'Heading6', 'Heading7', 'Heading8', 'Heading9',
                       'Title', 'Subtitle', 'Normal'];

/**
 * Minimal zip-entry extractor: read a single file from a zip archive without
 * pulling in a dependency. We only need to read styles.xml; if it's stored
 * (no compression) we copy bytes; if deflated we run inflateRaw. Sufficient
 * for the docx output we produce.
 */
function readZipEntry(zipPath, entryName) {
    const buf = fs.readFileSync(zipPath);
    let i = 0;
    while (i < buf.length - 4) {
        const sig = buf.readUInt32LE(i);
        if (sig !== 0x04034b50) {
            // Past local file headers.
            return null;
        }
        const compressionMethod = buf.readUInt16LE(i + 8);
        const compressedSize = buf.readUInt32LE(i + 18);
        const uncompressedSize = buf.readUInt32LE(i + 22);
        const fileNameLen = buf.readUInt16LE(i + 26);
        const extraLen = buf.readUInt16LE(i + 28);
        const fileName = buf.slice(i + 30, i + 30 + fileNameLen).toString('utf8');
        const dataStart = i + 30 + fileNameLen + extraLen;
        const dataEnd = dataStart + compressedSize;
        if (fileName === entryName) {
            const data = buf.slice(dataStart, dataEnd);
            if (compressionMethod === 0) {
                return data;
            } else if (compressionMethod === 8) {
                return zlib.inflateRawSync(data);
            } else {
                throw new Error(`Unsupported compression method ${compressionMethod}`);
            }
        }
        i = dataEnd;
    }
    return null;
}

for (const { label, relPath } of DOCX_FILES) {
    const docxPath = path.join(PARA_DIR, relPath);
    const exists = fs.existsSync(docxPath);
    const describeOrSkip = exists ? describe : describe.skip;

    describeOrSkip(`docx style IDs (${label})`, () => {
        let stylesXml;
        beforeAll(() => {
            const buf = readZipEntry(docxPath, 'word/styles.xml');
            expect(buf).not.toBeNull();
            stylesXml = buf.toString('utf8');
        });

        test('all customStyle styleIds are unique', () => {
            const customStyles = [...stylesXml.matchAll(/<w:style[^>]*w:customStyle="1"[^>]*w:styleId="([^"]+)"/g)];
            const ids = customStyles.map(m => m[1]);
            const seen = new Set();
            const duplicates = [];
            for (const id of ids) {
                if (seen.has(id)) duplicates.push(id);
                seen.add(id);
            }
            expect(duplicates).toEqual([]);
        });

        test('no customStyle styleId collides with Word built-in IDs', () => {
            const customStyles = [...stylesXml.matchAll(/<w:style[^>]*w:customStyle="1"[^>]*w:styleId="([^"]+)"/g)];
            const ids = customStyles.map(m => m[1]);
            const collisions = ids.filter(id => RESERVED_IDS.includes(id));
            expect(collisions).toEqual([]);
        });
    });
}
