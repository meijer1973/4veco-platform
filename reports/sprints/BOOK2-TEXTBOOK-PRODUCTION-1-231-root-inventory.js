// HOW TO ADAPT: fixed 41-output post-§231-import inventory. Read-only lesson checks.
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process'),a=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const baseline='f09fd6e88edc5049b026b16b0158e7e188091d2d';
const manifest=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md');
const text=fs.readFileSync(manifest,'utf8'),tick=String.fromCharCode(96);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(args,binary=false)=>{const r=cp.spawnSync('git',args,{cwd:lessons,encoding:binary?null:'utf8',maxBuffer:64*1024*1024});a.equal(r.status,0,String(r.stderr));return binary?r.stdout:r.stdout.trim();};
const rows=text.split('\n').filter(l=>/^\|\s*\d+\s*\|/.test(l)).map(l=>{const c=l.split('|').map(x=>x.trim());return {number:Number(c[1]),id:c[2],edition:c[3],status:c[4],path:c[5].split(tick).join('')};});
a.equal(rows.length,41);a.equal(new Set(rows.map(r=>r.path)).size,41);a.deepEqual(rows.map(r=>r.number),Array.from({length:41},(_,i)=>i+1));
const counts=Object.fromEntries(['A','C','L','P'].map(s=>[s,rows.filter(r=>r.status===s).length]));a.deepEqual(counts,{A:9,C:12,L:8,P:12});
const hashes=text.split('\n').filter(l=>/^\| \d\.\d\.\d \/ /.test(l)).map(l=>{const c=l.split('|').map(x=>x.trim()),[id,edition]=c[1].split(' / ');return {id,edition,sha256:c[2].split(tick).join('')};});a.equal(hashes.length,21);
for(const row of rows){
 const relative=book+'/'+row.path,absolute=path.join(lessons,relative);row.present=fs.existsSync(absolute);
 a.equal(row.present,row.status!=='P',relative);
 if(!row.present)continue;
 const bytes=fs.readFileSync(absolute);row.sha256=hash(bytes);a.equal(hash(git(['show','HEAD:'+relative],true)),row.sha256);
 if(row.status==='L'){a.equal(hash(git(['show',baseline+':'+relative],true)),row.sha256);row.baseline_identical=true;}
 else {const expected=hashes.find(h=>h.id===row.id&&h.edition===row.edition);a(expected);a.equal(row.sha256,expected.sha256);}
 if(row.status==='A')a(['2.1.1','2.2.1','2.2.2'].includes(row.id));
}
const tracked=git(['ls-tree','-r','--name-only','-z','HEAD','--',book]).split('\0').filter(p=>p.endsWith('.pdf')).sort();
a.deepEqual(tracked,rows.filter(r=>r.present).map(r=>book+'/'+r.path).sort());a.equal(tracked.length,29);
const out=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-root-inventory.json');
fs.writeFileSync(out,JSON.stringify({status:'PASS',manifest_sha256:hash(fs.readFileSync(manifest)),lesson_head:git(['rev-parse','HEAD']),baseline,counts,present:29,absent:12,rows,limitations:'File and hash inventory, not new acceptance. Only211/221/222 internally accepted with flags; all other gates remain explicit.'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',counts,present:29,absent:12,current_pdf_hashes:21,legacy_exact:8,output:out},null,2));
