'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), {execFileSync} = require('child_process');
const r = require('./book1-classroom-scope');
const titles = ['Schaarste, keuzes en alternatieve kosten', 'Vraagfactoren', 'Gemengde opgaven'];
const examples = titles.map((title, i) => `${r.EDITION}/paragrafen/H${i+1}/1.${i+1}.${i===2?4:1} ${title}`);
const sealed = new Set(examples.map((stem,i) => stem + (i===2 ? ' – opgaven.pdf' : ' – paragraaf.pdf')));

test('only actual sealed current paragraph titles admit slides and evidence', () => {
  examples.forEach((stem,i) => {
    for (const ext of ['pptx','pdf']) expect(r.isAddition(stem+' – presentatie.'+ext,sealed)).toBe(true);
    expect(r.isAddition(`${r.EDITION}/paragrafen/H${i+1}/evidence/1.${i+1}.${i===2?4:1}-presentation.md`,sealed)).toBe(true);
  });
  for (const file of [examples[0]+' – antwoorden.pdf',examples[0]+' – presentatie.html',examples[0].replace('Schaarste,','Wrong,')+' – presentatie.pdf',
    examples[0].replace('/H1/','/H2/')+' – presentatie.pdf', examples[0].replace('1.1.1','1.1.5')+' – presentatie.pdf',
    r.EDITION+'/bronnen/H1/manuscript.md',r.BOOK+'/historisch/extra.pptx','edities/books34-v3/books/book-4/new.pptx'])
    expect(r.isAddition(file,sealed)).toBe(false);
  const existing=examples[0]+' – presentatie.pptx';expect(r.isAddition(existing,new Set([...sealed,existing]))).toBe(false);
});

test('platform additions cannot modify receipts, old models, textbook tools or other books', () => {
  for (const file of ['build-scripts/content/book-1/presentation-134.mjs','build-scripts/content/book-1/presentation-111.manifest.json',
    'build-scripts/content/book-1/check-presentation-121.py','reports/review-gates/classroom-presentations-book1-20261003/series-review.md']) expect(r.platformPath(file)).toBe(true);
  for (const file of ['build-scripts/books/book1-second-edition-revision.js','build-scripts/books/book1-second-edition-pin.json',
    'build-scripts/books/book1_second_edition/publish.py','references/owned/book1-second-edition-2026/revision.json',
    'build-scripts/content/book-1/b1-111-presentation-v2-model.js','build-scripts/content/book-2/presentation-211.mjs',
    'reports/review-gates/book1-second-edition-20261002/independent-review.md','build-scripts/content/book-1/presentation-151.mjs']) expect(r.platformPath(file)).toBe(false);
});

function fixture() {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'book1-classroom-'));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const write=(file,text)=>{const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);};
  git('init','-q');git('config','user.email','test@example.invalid');git('config','user.name','Test');git('config','core.autocrlf','false');
  const source=[...sealed][0], retired=[...r.RETIRED][0],entry=[...r.LEGACY_ENTRIES][0];
  const html='<header>keep me</header>\nuitleg + presentatie + leerpad\n  <article data-tile-id="presentatie"><a href="old.pptx">PowerPoint</a></article>\n<footer>keep me</footer>\n';
  write(source,'sealed textbook');write(retired,'historical output');write(entry,html);write('book1-second-edition-20261002.json','sealed receipt');
  git('add','.');git('commit','-qm','accepted');const base=git('rev-parse','HEAD');
  return {root,git,write,source,retired,entry,html,base,check:()=>r.verifyChanges({root,base,repo:'lessons',sealed,requireTracked:true}),
    close:()=>fs.rmSync(root,{recursive:true,force:true})};
}

test('finite deletion/link retirement and actual paragraph additions pass, staged byte changes fail',()=>{
  const f=fixture();try{
    fs.unlinkSync(path.join(f.root,f.retired));f.write(f.entry,r.retireLinks(f.entry,Buffer.from(f.html)));
    f.write(examples[0]+' – presentatie.pptx','editable deck');f.git('add','.');
    expect(f.check()).toMatchObject({removals:[f.retired],entry_changes:[f.entry],additions:[examples[0]+' – presentatie.pptx']});
    f.write(examples[0]+' – presentatie.pptx','different bytes');expect(f.check).toThrow('Stale staged');
  }finally{f.close();}
});

test.each(['source','receipt','archive','other book','compensated index','compensated HEAD','compensated link index','compensated link HEAD','extra link','retired replacement'])('%s mutation fails',kind=>{
  const f=fixture();try{
    if(kind==='source')f.write(f.source,'mutated textbook');
    if(kind==='receipt')f.write('book1-second-edition-20261002.json','repinned');
    if(kind==='archive')f.write(r.BOOK+'/historisch/extra.zip','extra archive');
    if(kind==='other book')f.write('Boek 2 - protected/extra.pptx','outside scope');
    if(kind==='compensated index'||kind==='compensated HEAD'){
      f.write(f.source,'mutated textbook');f.git('add','.');if(kind==='compensated HEAD')f.git('commit','-qm','unreviewed');f.write(f.source,'sealed textbook');
    }
    if(kind.startsWith('compensated link')){
      f.write(f.entry,'unreviewed content');f.git('add','.');if(kind.endsWith('HEAD'))f.git('commit','-qm','unreviewed entry');
      f.write(f.entry,r.retireLinks(f.entry,Buffer.from(f.html)));
    }
    if(kind==='extra link')f.write(f.entry,r.retireLinks(f.entry,Buffer.from(f.html)).replace('keep me','changed copy'));
    if(kind==='retired replacement')f.write(f.retired,'modified historical output');
    if(!kind.startsWith('compensated'))f.git('add','.');
    const check=kind.startsWith('compensated link')
      ?()=>r.verifyChanges({root:f.root,base:f.base,repo:'lessons',sealed,requireTracked:false}):f.check;
    expect(check).toThrow();
  }finally{f.close();}
});

test('retirement transformer preserves unrelated text and accepts exactly one tile/link',()=>{
  const entry=[...r.LEGACY_ENTRIES][0];
  expect(()=>r.retireLinks(entry,Buffer.from('no presentation'))).toThrow('Expected one');
  const prerequisite=[...r.LEGACY_ENTRIES].find(file=>!file.endsWith('/index.html'));
  expect(r.retireLinks(prerequisite,Buffer.from('Ga verder of bekijk de <a href="old%20presentatie.pptx">Presentatie</a>.'))).toBe('Ga verder.');
});
