'use strict';
// HOW TO ADAPT: use this source contract in new consumers. Never substitute
// sources[0].content for a broken context export or read a manuscript as fallback.
const fs=require('fs'),path=require('path');
const {JSDOM}=require('jsdom');
const {sha,PACKAGE,TRANSPORT,ROOT,REVISION}=require('./migrate-books34-v3');
const {safeFile,manifestAt}=require('./books34-v3-delivery');
function consumeTarget(record,{platformRoot=ROOT}={}) {
 if(record.structure_revision!==REVISION||record.source_identity?.revision!==REVISION)throw new Error('Explicit v3 source identity required');
 const loc=record.source_locator,t=record.target_exercise,pin=record.source_pin;
 if(loc?.package_root!==PACKAGE||loc.repository!=='meijer1973/4veco-lessen')throw new Error('Unknown lesson package locator');
 // This is the declared provider in BOTH supported transition states, never
 // a fallback for a missing lesson file. Lessons retains authored ownership.
 const root=path.join(platformRoot,TRANSPORT);
 manifestAt(root);
 const readPinned=(name,hash)=>{const bytes=fs.readFileSync(safeFile(root,name));if(!/^[a-f0-9]{64}$/.test(hash||'')||sha(bytes)!==hash)throw new Error('Source hash mismatch: '+name);return bytes;};
 for(const [name,h] of [[pin?.student_file,pin?.student_manuscript_sha256],[pin?.answer_file,pin?.answer_file_sha256]])readPinned(name,h);
 for(const [key,name] of [['student_manuscript',pin.student_file],['answer_manuscript',pin.answer_file],['target_excerpt',`curriculum/target-excerpts/${record.id}.md`],['package_record',`curriculum/targets/${record.id}.json`]])if(loc[key]!==`${PACKAGE}/${name}`)throw new Error('Incorrect concrete locator '+key);else safeFile(root,name);
 if(!t?.context?.trim()||!t.context_html?.trim()||t.context_html_base!=='package_root'||!t.subquestions?.length)throw new Error('Incomplete target context');
 const dom=new JSDOM('<body>'+t.context_html+'</body>'),body=dom.window.document.body;
 if(body.querySelector('script,iframe,object,embed,link')||[...body.querySelectorAll('*')].some(e=>[...e.attributes].some(a=>/^on/i.test(a.name))))throw new Error('Active context HTML is unsupported');
 const figures=new Map((t.figures||[]).map(f=>[f.path,f])),used=[];
 for(const img of body.querySelectorAll('img')){
  const name=img.getAttribute('src'),figure=figures.get(name);if(!figure)throw new Error('Unregistered figure '+name);
  const bytes=readPinned(name,figure.sha256),ext=path.extname(name);if(!['.svg','.png'].includes(ext))throw new Error('Unsupported figure type');
  img.setAttribute('src',`data:image/${ext==='.svg'?'svg+xml':'png'};base64,${bytes.toString('base64')}`);img.setAttribute('data-package-path',name);used.push(name);
 }
 if(new Set(used).size!==figures.size)throw new Error('Required figure not consumed');
 for(const f of record.answer_figures||[])readPinned(f.path,f.sha256);
 const html=body.innerHTML,tables=body.querySelectorAll('table').length;dom.window.close();
 const transportLocator={...structuredClone(loc),repository:'meijer1973/4veco-platform',package_root:TRANSPORT,
  role:'immutable_received_transport',content_owner_repository:'meijer1973/4veco-lessen'};
 for(const key of ['student_manuscript','answer_manuscript','target_excerpt','package_record'])transportLocator[key]=TRANSPORT+loc[key].slice(PACKAGE.length);
 return {context:t.context,context_html:html,subquestions:structuredClone(t.subquestions),sources:structuredClone(t.sources),figures_consumed:used,tables_consumed:tables,
  source_locator:transportLocator,canonical_source_locator:structuredClone(loc)};
}
module.exports={safeFile,consumeTarget};
