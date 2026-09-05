// Read-only cross-paragraph diagnostic; no source or rendered artifact writes.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const lessons = path.resolve(root, '../4veco-lessen');
const book = path.join(lessons, 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus');
const results = [];
for (const id of ['2.1.1', '2.1.2', '2.1.3', '2.2.1', '2.2.2', '2.2.3']) {
  const chapter = fs.readdirSync(book).find((n) => n.startsWith(id.slice(0, 3) + ' '));
  const paragraph = fs.readdirSync(path.join(book, chapter)).find((n) => n.startsWith(id + ' '));
  const dir = path.join(book, chapter, paragraph);
  for (const file of fs.readdirSync(dir).filter((n) => n.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    const alternatives = [...html.matchAll(/<img\b[^>]*\balt="([^"]*)"[^>]*>/g)].map((m) => {
      const text = m[1].replace(/\s+/g, ' ').trim().replaceAll('&amp;', '&');
      return { text, characters: [...text].length, over_120: [...text].length > 120 };
    });
    results.push({ id, file: path.relative(lessons, path.join(dir, file)).replaceAll('\\', '/'), alternatives });
  }
}
console.log(JSON.stringify({ mode: 'diagnostic not acceptance', standard: 'agents/accessibility-agent.md: short alt <=120 characters and noun-first; complete descriptions must remain accessible', results }, null, 2));
