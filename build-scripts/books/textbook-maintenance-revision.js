'use strict';
// A bounded successor, not a refresh of any historical receipt or approval.
const fs = require('fs'), path = require('path'), os = require('os');
const assert = require('assert/strict'), crypto = require('crypto');
const {execFileSync} = require('child_process');
const previous = require('./book1-classroom-scope');
const ROOT = path.resolve(__dirname, '../..');
const REVISION = 'textbook-maintenance-20261004';
const BASE_P = '7f924b57767838557b2dff96243e0b3ad7cbff2c';
const BASE_L = '99c5eb4127bebfd9892b19dc0d35789d05b6344b';
const DIR = 'reports/review-gates/' + REVISION;
const CONTRACT = 'build-scripts/books/textbook-maintenance-contract.json';
const MANIFEST = DIR + '/revision.json', PIN = DIR + '/pin.json';
const REVIEW = DIR + '/independent-review.md';
const HEAD = 'build-scripts/books/textbook-maintenance-lesson-head.txt';
const LESSON_MANIFEST = REVISION + '.json';
const EXCLUDED_P = new Set([MANIFEST, PIN, REVIEW, HEAD]);
const ADVISORY = new Set(['platform', 'lessen'].flatMap(r => ['md','json'].map(ext => `reports/github-agent-index-${r}.${ext}`)));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const git = (root, args) => execFileSync('git', ['-c', 'core.longpaths=true', ...args], {cwd:root,maxBuffer:256*1024*1024});
const safe = previous.safeFile;
function changed(root, base, excluded = new Set()) {
  return previous.changedPaths(root,base).filter(file => !excluded.has(file)).filter(file => {
    // The authorized bundle harness may refresh disposable navigation views.
    // Never conceal a committed/staged advisory edit or a missing file.
    if (!ADVISORY.has(file) || process.env.FOURVECO_INDEX_VIEW_MODE !== 'complete-only'
      || !/^compatibility\/(platform-first|lesson-first|bundle-final)\/platform$/.test(process.env.FOURVECO_PLATFORM_SOURCE_BRANCH || '')) return true;
    try {
      safe(root,file); git(root,['rev-parse',base+':'+file]);
      return Boolean(git(root,['diff','--name-only',base,'HEAD','--',file]).length
        || git(root,['diff','--cached','--name-only',base,'--',file]).length);
    } catch { return true; }
  });
}
function checkContract(doc) {
  assert.equal(doc.revision,REVISION,'Unknown maintenance scope');
  assert.equal(doc.platform_base,BASE_P,'Wrong platform baseline');
  assert.equal(doc.lessons_base,BASE_L,'Wrong lesson baseline');
  for (const key of ['platform','lessons']) {
    assert(Array.isArray(doc[key]),'Missing finite '+key+' paths');
    assert.deepEqual(doc[key],[...new Set(doc[key])].sort(),'Unsorted/duplicate scope paths');
    for (const file of doc[key]) {
      assert(!path.isAbsolute(file) && !file.includes('\\') && !file.split('/').some(p => !p || p === '.' || p === '..'),'Unsafe scope path');
      assert(!file.includes('/historisch/') && !file.includes('/received/') && !file.includes('/historical-inputs/')
        && !file.includes('Boek 2 -') && !file.startsWith('references/machine/'),'Protected history/Book 2/authority in scope');
    }
  }
  assert(Array.isArray(doc.attribute_paths),'Missing finite checkout rules');
  assert.deepEqual(doc.attribute_paths,[...new Set(doc.attribute_paths)].sort(),'Duplicate checkout rule');
  for(const file of doc.attribute_paths)assert((doc.platform.includes(file)||EXCLUDED_P.has(file))&&!/[*?\[\]!]/.test(file),'Unbounded checkout rule');
}
function expectedAttributes(before,files) {
  return before+'\n# Exact-byte inputs for the bounded October textbook maintenance.\n'+files.map(file=>file+' -text\n').join('');
}
function checkAttributes(root,contract) {
  const before=git(root,['show',BASE_P+':.gitattributes']).toString('utf8');
  assert.equal(fs.readFileSync(safe(root,'.gitattributes'),'utf8'),expectedAttributes(before,contract.attribute_paths),'Unreviewed checkout policy');
}
function rows(root, files) {
  return files.map(file => {const bytes=fs.readFileSync(safe(root,file));return {path:file,bytes:bytes.length,sha256:sha(bytes)};});
}
function checkRows(root,base,records,allowed,excluded,requireTracked) {
  const actual=changed(root,base,excluded);
  assert.deepEqual(actual,records.map(r=>r.path),'Unreviewed changed-path inventory');
  for (const row of records) {
    assert(allowed.includes(row.path),'Outside finite maintenance scope: '+row.path);
    const bytes=fs.readFileSync(safe(root,row.path));
    assert(bytes.length===row.bytes && sha(bytes)===row.sha256,'Stale maintenance bytes: '+row.path);
    if (requireTracked) {
      const stage=git(root,['ls-files','--stage','--',row.path]).toString();
      assert(/^100644 [a-f0-9]{40} 0\t/.test(stage),'Not a tracked regular file: '+row.path);
      assert(git(root,['show',':'+row.path]).equals(bytes),'Stale staged bytes: '+row.path);
      assert(git(root,['show','HEAD:'+row.path]).equals(bytes),'Uncommitted bytes: '+row.path);
    }
  }
}
function record({root=ROOT,lessons=path.resolve(root,'../4veco-lessen')}={}) {
  const contract=JSON.parse(fs.readFileSync(safe(root,CONTRACT)));checkContract(contract);checkAttributes(root,contract);
  const p=changed(root,BASE_P,EXCLUDED_P),l=changed(lessons,BASE_L,new Set([LESSON_MANIFEST]));
  assert(p.every(f=>contract.platform.includes(f)),'Unlisted platform file');
  assert(l.every(f=>contract.lessons.includes(f)),'Unlisted lesson file');
  const doc={revision:REVISION,platform_base:BASE_P,lessons_base:BASE_L,
    note:'Freshness only. Independent review, target authority and human merge approval are distinct.',
    platform:rows(root,p),lessons:rows(lessons,l)};
  const text=JSON.stringify(doc,null,2)+'\n';fs.mkdirSync(path.join(root,DIR),{recursive:true});
  fs.writeFileSync(path.join(root,MANIFEST),text);fs.writeFileSync(path.join(lessons,LESSON_MANIFEST),text);
  fs.writeFileSync(path.join(root,PIN),JSON.stringify({revision:REVISION,manifest_sha256:sha(text)},null,2)+'\n');
  return {manifest_sha256:sha(text),platform_files:p.length,lesson_files:l.length};
}
const historyCache=new Map();
function predecessor(root,lessons,acceptedBase) {
  const key=root+'|'+lessons+'|'+acceptedBase;
  if (acceptedBase && historyCache.has(key)) return historyCache.get(key);
  const parent=fs.mkdtempSync(path.join(os.tmpdir(),'textbook-maintenance-history-'));
  const checkout=path.join(parent,'platform'),lessonCopy=path.join(parent,'lessons');
  const modules=path.join(checkout,'node_modules');
  try {
    git(root,['worktree','add','--detach',checkout,BASE_P]);
    if (acceptedBase) git(lessons,['worktree','add','--detach',lessonCopy,BASE_L]);
    const dependencies=[path.join(root,'node_modules'),...(process.env.NODE_PATH||'').split(path.delimiter)].find(f=>f&&fs.existsSync(f));
    if (dependencies) previous.linkHistoricalDependencies(dependencies,modules);
    const code="const path=require('path');const result=require(path.join(process.argv[1],'build-scripts/books/book1-classroom-scope')).verify({root:process.argv[1],lessons:process.argv[2],requireTracked:true});process.stdout.write(JSON.stringify(result));";
    const result=JSON.parse(execFileSync(process.execPath,['-e',code,checkout,acceptedBase?lessonCopy:lessons],{encoding:'utf8',maxBuffer:256*1024*1024,env:{...process.env,NODE_PATH:path.join(root,'node_modules')}}));
    assert(result.passed,'Accepted predecessor rejected: '+result.failures?.join('; '));
    const record={platform:BASE_P,lessons:acceptedBase?BASE_L:git(lessons,['rev-parse','HEAD']).toString().trim(),
      method:'Original verifier at immutable accepted platform commit',result};
    if (acceptedBase) historyCache.set(key,record);
    return record;
  } finally {
    previous.unlinkHistoricalDependencies(modules);
    if(fs.existsSync(lessonCopy))git(lessons,['worktree','remove',lessonCopy]);
    if(fs.existsSync(checkout))git(root,['worktree','remove',checkout]);
    fs.rmdirSync(parent);
  }
}
function verify({root=ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false,requireReview=false}={}) {
  try {
    git(root,['merge-base','--is-ancestor',BASE_P,'HEAD']);
    const contract=JSON.parse(fs.readFileSync(safe(root,CONTRACT)));checkContract(contract);checkAttributes(root,contract);
    const bytes=fs.readFileSync(safe(root,MANIFEST)),doc=JSON.parse(bytes),pin=JSON.parse(fs.readFileSync(safe(root,PIN)));
    assert(doc.revision===REVISION && pin.revision===REVISION && sha(bytes)===pin.manifest_sha256,'Unknown/unpinned maintenance revision');
    assert(doc.platform_base===BASE_P && doc.lessons_base===BASE_L,'Unknown revision baseline');
    checkRows(root,BASE_P,doc.platform,contract.platform,EXCLUDED_P,requireTracked);
    const active=fs.existsSync(path.join(lessons,LESSON_MANIFEST));
    if (!active && changed(lessons,BASE_L).length) {
      const history=predecessor(root,lessons,false);
      return {...history.result,maintenance_historical_verification:history};
    }
    const history=predecessor(root,lessons,true);
    if (active) {
      git(lessons,['merge-base','--is-ancestor',BASE_L,'HEAD']);
      assert(fs.readFileSync(safe(lessons,LESSON_MANIFEST)).equals(bytes),'Mixed maintenance pair');
      checkRows(lessons,BASE_L,doc.lessons,contract.lessons,new Set([LESSON_MANIFEST]),requireTracked);
    }
    if (requireReview) {
      const review=fs.readFileSync(safe(root,REVIEW),'utf8');
      assert(/^Verdict: PASS(?: with flags)?$/m.test(review) && review.includes('Review manifest SHA256: `'+sha(bytes)+'`'),'Missing current independent maintenance review');
    }
    return {passed:true,failures:[],revision:REVISION,lesson_state:active?REVISION:REVISION+'-platform-first',
      files:active?doc.lessons.length:0,platform_base:BASE_P,lessons_base:BASE_L,
      historical_verification:history,content_review_attested:requireReview,
      removals:history.result.removals,entry_changes:history.result.entry_changes,
      curriculum_authority_changed:false};
  } catch(error) {return {passed:false,failures:[error.message],revision:REVISION};}
}
module.exports={ROOT,REVISION,BASE_P,BASE_L,CONTRACT,DIR,MANIFEST,PIN,REVIEW,HEAD,LESSON_MANIFEST,EXCLUDED_P,sha,changed,checkContract,checkRows,expectedAttributes,record,verify};
if(require.main===module){const result=process.argv.includes('--record')?record():verify({requireTracked:process.argv.includes('--require-tracked'),requireReview:process.argv.includes('--require-review')});console.log(JSON.stringify(result,null,2));if(result.passed===false)process.exitCode=1;}
