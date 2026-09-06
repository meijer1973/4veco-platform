/* HOW TO ADAPT: independent §231 specialist QC evidence only. Run each named
 * mode once from this owned platform pair; outputs are exclusive-create. No
 * helper assertion supplies personal inspection or root acceptance. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const P = path.resolve(__dirname, '../..');
const L = path.resolve(P, '../4veco-lessen');
const rel = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus';
const folder = path.join(L, rel);
const prefix = 'BOOK2-TEXTBOOK-PRODUCTION-1-231';
const Q = path.join(P, 'reports/sprints', prefix + '-QC');
const proof = path.join(P, 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1');
const py = 'C:/Python314/python.exe';
const posix = p => p.replaceAll('\\', '/');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (suffix, value) => fs.writeFileSync(Q + '-' + suffix + '.json', JSON.stringify(value, null, 2) + '\n', {flag:'wx'});
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
}
function git(cwd, ...args) { return cp.execFileSync('git',args,{cwd,encoding:'utf8'}).trim(); }
function run(name, command, args, allowed = [0]) {
  const target = Q + '-' + name + '-process.json';
  assert(!fs.existsSync(target), 'Never overwrite process evidence');
  const started_at = new Date().toISOString();
  const r = cp.spawnSync(command,args,{cwd:P,encoding:'utf8',maxBuffer:64*1024*1024});
  const record = {name,command,args,cwd:P,started_at,finished_at:new Date().toISOString(),exit_code:r.status,signal:r.signal,error:r.error?.message,stdout:r.stdout,stderr:r.stderr};
  fs.writeFileSync(target,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify(record,null,2));
  assert(allowed.includes(r.status), `${name} unexpected exit ${r.status}`);
  return r;
}
function snapshot() {
  const all = walk(folder).filter(p => !posix(p).includes('/__pycache__/'));
  assert.equal(all.length,45);
  const native = Object.fromEntries(all.map(p => [posix(path.relative(L,p)),hash(p)]));
  const history = walk(path.join(P,'reports')).filter(p => /231/.test(posix(p)) && !posix(p).includes(prefix+'-QC'));
  const sources = [path.join(P,'build-scripts/content/book-2/b2_231.py'),path.join(P,'build-scripts/content/book-2/print_pipeline.py'),...walk(path.join(P,'build-scripts/content/book-2/231')).filter(p => !posix(p).includes('/__pycache__/'))];
  assert.equal(sources.length,10);
  const old = Object.fromEntries([...history,...sources].map(p => [posix(path.relative(P,p)),hash(p)]));
  const roots = cp.execFileSync('git',['worktree','list','--porcelain'],{cwd:P,encoding:'utf8'}).split(/\r?\n/).filter(s=>s.startsWith('worktree ')).map(s=>s.slice(9));
  const revisionHistory = [];
  for(const root of roots) {
    const files = walk(path.join(root,'reports','rendered-proof')).concat(walk(path.join(root,'reports','sprints')).filter(p => /231/.test(posix(p))));
    for(const p of files) {
      const r = posix(path.relative(root,p));
      if(!/231/.test(r)) continue;
      const nums = [...r.matchAll(/(?:^|[-/])r([1-9][0-9]*)(?=[./-]|$)/g)].map(m=>+m[1]);
      for (const rev of nums) revisionHistory.push({root,path:r,revision:rev});
      if(/231.*reserv/i.test(r) && /\.json$/.test(r)) {
        const t=fs.readFileSync(p,'utf8');
        for(const m of t.matchAll(/"r([1-9][0-9]*)"/g)) revisionHistory.push({root,path:r,revision:+m[1],reservation_content:true});
      }
    }
  }
  const highest = Math.max(0,...revisionHistory.map(r=>r.revision));
  assert.equal(highest,16,'Unexpected global history; reserve a later revision explicitly before build');
  const moved = json(path.join(P,'reports/sprints/'+prefix+'-root-import-after.json')).rows;
  assert.equal(moved.length,66);
  for(const row of moved) {
    assert.equal(hash(path.join(P,row.new_path)),row.sha256);
    const raw=cp.execFileSync('git',['show',row.source_commit+':'+row.old_path],{cwd:P,maxBuffer:4*1024*1024});
    assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),row.sha256);
    assert(!fs.existsSync(path.join(P,row.old_path)));
  }
  const pending = history.filter(p=>/231-(?:paragraaf|opgaven|antwoorden)-[^/\\]+[\\/]manifest\.json$/.test(p));
  for(const p of pending) { const j=json(p);assert.equal(j.inspection_status,'PENDING');assert.deepEqual(j.pages_inspected,[]);assert.equal(j.visible_student_defects,null);assert.equal(j.inspected_at_normal_reading_scale,false); }
  const result={captured_at:new Date().toISOString(),platform:git(P,'rev-parse','HEAD'),lessons:git(L,'rev-parse','HEAD'),native45:native,old_sources_and_history:old,registered_worktrees:roots,revision_history:revisionHistory,highest_observed:highest,reserved:['r17','r18','r19'],old_pending_manifests:pending.map(p=>posix(path.relative(P,p))),old66_relocation_git_bytes:'IDENTICAL',root_validation:'PENDING',root_acceptance:'PENDING',handoff_renewal:'PENDING'};
  save('reservation-and-baseline',result);
  console.log(JSON.stringify({highest,reserved:result.reserved,registered_roots:roots.length,revision_rows:revisionHistory.length,baseline_lesson_files:all.length,historical_files:Object.keys(old).length,pending:pending.length,relocated66:'IDENTICAL'},null,2));
}
const mode=process.argv[2];
const manifest=n=>path.join(P,'reports/sprints',prefix+'-build-manifest-r'+n+'.json');
if(mode==='snapshot')snapshot();
else if(mode==='pre') {
  run('currentness-pre','node',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','specialist_review','--paragraph','2.3.1']);
  run('durable-pre','node',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']);
  run('source-tests',py,['build-scripts/content/book-2/231/test_source.py','--lesson-root',L]);
  for(const profile of ['student-web','publisher-print'])run('pre-'+profile,'node',['scripts/validate-paragraph.js','--mode','part-a','--profile',profile,folder],[1]);
}
else if(mode==='full') {
  assert.equal(json(Q+'-reservation-and-baseline.json').highest_observed,16);
  run('full',py,['build-scripts/content/book-2/b2_231.py','--lesson-root',L,'--proof-root',proof,'--proof-suffix','r17','--manifest',manifest(17)]);
}
else if(mode==='verify') {
  run('render-check',py,['build-scripts/content/book-2/231/check_render.py','--lesson-root',L,'--manifest',manifest(17)]);
  run('native-reproduction',py,['build-scripts/content/book-2/231/verify_rebuild.py',manifest(17),Q+'-native-reproduction.json',Q+'-grayscale-r17']);
}
else if(mode==='post') {
  run('currentness-post','node',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','specialist_review','--paragraph','2.3.1']);
  run('durable-post','node',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']);
  for(const profile of ['student-web','publisher-print'])run('post-'+profile,'node',['scripts/validate-paragraph.js','--mode','part-a','--profile',profile,folder]);
  run('active-sprint-bundle','node',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']);
}
else throw Error('Specify snapshot/pre/full/verify/post');
