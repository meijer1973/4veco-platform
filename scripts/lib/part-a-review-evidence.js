'use strict';

// HOW TO ADAPT: extend inventory ownership deliberately when a Part A output
// contract changes. Never let callers supply a smaller list of reviewed files.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PARA_TYPES, classifyParagraph } = require('./paragraph-types');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const TEXT = /\.(md|html|css|svg|py|json|txt)$/i;

function decodeHtml(value) {
  const result = value.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code)))
    .replace(/&(amp|quot|apos|lt|gt);/g, (_, name) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[name]));
  if (/&[a-z][a-z\d]+;/i.test(result)) throw new Error('Unsupported HTML entity in a rendering URL; use its literal or numeric form');
  return result;
}

function renderDependencies(file, text) {
  const refs = [];
  if (/\.(html|svg)$/i.test(file)) {
    if (/<\s*(script|iframe|object|embed|video|audio)\b/i.test(text) || /<[^>]*\son[a-z]+\s*=/i.test(text)) throw new Error('Part A review requires static HTML/SVG; script and embedded document dependencies are unsupported');
    for (const match of text.matchAll(/\b(src|href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
      const ref = decodeHtml(match[2] ?? match[3] ?? match[4]);
      if (match[1].toLowerCase() === 'src' || /\.(css|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf)(?:[?#]|$)/i.test(ref)) refs.push(ref);
    }
    for (const tag of text.matchAll(/<link\b[^>]*>/gi)) {
      const href = tag[0].match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      if (/\bstylesheet\b/i.test(tag[0]) && href) refs.push(decodeHtml(href[1] ?? href[2] ?? href[3]));
    }
    for (const tag of text.matchAll(/<(?:image|use|feImage)\b[^>]*>/gi)) {
      const href = tag[0].match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      if (href) refs.push(decodeHtml(href[1] ?? href[2] ?? href[3]));
    }
    for (const match of text.matchAll(/\bsrcset\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
      const value = decodeHtml(match[1] ?? match[2] ?? match[3]);
      if (/data:/i.test(value)) throw new Error('Data URLs inside srcset are unsupported; use src or local image candidates');
      for (const candidate of value.split(',')) refs.push(candidate.trim().replace(/\s+[\d.]+[wx]$/, ''));
    }
  }
  // Quoted CSS imports are not url() expressions. Follow both, recursively.
  for (const match of text.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/@import\s*["']([^"']+)["']|url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/gi)) refs.push(match[1] || match[2] || match[3] || match[4]);
  if (/\.md$/i.test(file)) {
    const definitions = new Map([...text.matchAll(/^\s*\[([^\]]+)\]:\s*(?:<([^>]+)>|(\S+))/gm)].map(match => [match[1].toLowerCase(), match[2] || match[3]]));
    for (const match of text.matchAll(/!\[([^\]]*)\](?:\((<[^>]+>|[^)]+)\)|\[([^\]]*)\])?/g)) {
      if (match[2]) {
        let ref = match[2].trim();
        if (ref.startsWith('<')) ref = ref.slice(1, ref.indexOf('>'));
        else ref = ref.replace(/\s+["'][^"']*["']\s*$/, '');
        if (/[()]/.test(ref)) throw new Error('Parentheses in Markdown image URLs must be percent-encoded for review');
        refs.push(ref);
      } else {
        const ref = definitions.get((match[3] || match[1]).toLowerCase());
        if (ref) refs.push(ref);
        else if (match[3] !== undefined) throw new Error(`Missing Markdown image reference: ${match[3] || match[1]}`);
      }
    }
  }
  return refs;
}

function identity(folder) {
  const match = path.basename(path.resolve(folder)).match(/^(\d+\.\d+\.\d+)\s+(.+)$/);
  if (!match) throw new Error('Expected paragraph folder X.Y.Z Name');
  return { id: match[1], name: match[2] };
}

function safeFile(folder, relative) {
  if (!relative || path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').includes('..')) {
    throw new Error(`Unsafe review input: ${relative}`);
  }
  let current = path.resolve(folder);
  for (const piece of relative.split('/')) {
    current = path.join(current, piece);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Symlink review input: ${relative}`);
  }
  if (!fs.statSync(current).isFile()) throw new Error(`Not a review file: ${relative}`);
  return current;
}

function fileHash(folder, relative) {
  const bytes = fs.readFileSync(safeFile(folder, relative));
  if (!TEXT.test(relative)) return hash(bytes);
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return hash(text.replace(/\r\n?/g, '\n'));
}

function inventory(folder) {
  const { id, name } = identity(folder);
  const suffixes = PARA_TYPES[classifyParagraph(name)].requiredMd;
  const roots = fs.readdirSync(folder).filter(file =>
    file === 'build_pdf.py' || file === `${id}-textbook-plan.md` ||
    file === `${id}-textbook-foundation.json` || file === `${id}-target-contract.md` ||
    suffixes.some(suffix => file.replace(/–/g, '-').endsWith(` - ${suffix}.md`) ||
      file.replace(/–/g, '-').endsWith(` - ${suffix}.html`) ||
      file.replace(/–/g, '-').endsWith(` - ${suffix}.pdf`)));
  const files = new Set(roots);
  // Include owned assets, even if currently orphaned. Companion-only assets do
  // not invalidate a Part A verdict unless a reviewed document references them.
  if (fs.existsSync(path.join(folder, '_assets'))) {
    for (const file of fs.readdirSync(path.join(folder, '_assets'))) {
      if ((/^\d+\.\d+\.\d+_(fig|we|ex)_/.test(file) && !/_(slide|doc|summary|web_light|web_dark)\./.test(file)) || /cover/i.test(file)) files.add(`_assets/${file}`);
    }
  }
  // Follow local Markdown/HTML/CSS dependencies (including fonts and styles).
  for (const file of files) {
    const absolute = safeFile(folder, file);
    if (!/\.(md|html|css|svg)$/i.test(file)) continue;
    const text = fs.readFileSync(absolute, 'utf8');
    for (const ref of renderDependencies(file, text)) {
      if (/^(?:data:|#)/i.test(ref)) continue;
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(ref)) throw new Error(`Rendering dependency must be local or inline: ${ref}`);
      const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
      if (!clean) continue;
      const relative = path.posix.normalize(path.posix.join(path.posix.dirname(file), clean));
      safeFile(folder, relative);
      files.add(relative);
    }
  }
  if (!roots.some(file => file.endsWith('.md'))) throw new Error('No Part A content to review');
  return [...files].sort().map(file => ({ path: file, sha256: fileHash(folder, file) }));
}

function snapshot(folder) {
  return { schema_version: 1, paragraph: identity(folder).id,
    hash_contract: 'sha256: UTF-8 text with LF; other files exact bytes', files: inventory(folder) };
}
function digest(manifest) { return hash(JSON.stringify(manifest)); }
function writeSnapshot(folder) {
  const manifest = snapshot(folder);
  fs.writeFileSync(path.join(folder, `${manifest.paragraph}-textbook-review-manifest.json`), `${JSON.stringify(manifest, null, 2)}\n`);
  return digest(manifest);
}

function verdict(content) {
  const sections = [...content.replace(/\r/g, '').matchAll(/^##\s+(?:\d+\.\s*)?Verdict\s*\n\s*([^\n]+)/gmi)];
  if (sections.length !== 1) return null;
  const value = sections[0][1].replace(/\*/g, '').trim();
  return ['PASS', 'PASS WITH FLAGS', 'FAIL'].includes(value) ? value : null;
}

function checkReview(folder) {
  const errors = [];
  let reviewVerdict = null;
  let manifestDigest = null;
  try {
    const { id } = identity(folder);
    const report = fs.readFileSync(safeFile(folder, `${id}-review.md`), 'utf8');
    reviewVerdict = verdict(report);
    if (!reviewVerdict) errors.push('Part A review requires one explicit Verdict section (PASS, PASS WITH FLAGS or FAIL)');
    if (reviewVerdict === 'FAIL') errors.push('Part A review verdict is FAIL');
    const actual = snapshot(folder);
    const stored = JSON.parse(fs.readFileSync(safeFile(folder, `${id}-textbook-review-manifest.json`), 'utf8'));
    if (JSON.stringify(stored) !== JSON.stringify(actual)) errors.push('Part A review manifest is stale: content inventory or hashes changed');
    manifestDigest = digest(actual);
    const bindings = [...report.matchAll(/^Review manifest SHA256: `([a-f0-9]{64})`\s*$/gm)];
    if (bindings.length !== 1 || bindings[0][1] !== manifestDigest) errors.push('Part A review does not bind the current manifest SHA256');
  } catch (error) { errors.push(`Part A review evidence missing or invalid: ${error.message}`); }
  return { ok: errors.length === 0, verdict: reviewVerdict, manifestDigest, errors };
}

module.exports = { identity, safeFile, fileHash, inventory, snapshot, digest, writeSnapshot, verdict, checkReview };
