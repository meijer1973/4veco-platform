'use strict';
// Numeric paragraph IDs are local to an edition; never inherit legacy approval.
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..');
const REVISION='book1-second-edition-2026',LEGACY='book1-first-edition-2026';
const SOURCE='references/owned/book1-second-edition-2026/targets.json';
function isCurrentSource(file){return String(file).replace(/\\/g,'/').includes('Boek 1 - Grondslagen, vraag en aanbod/edities/tweede-editie-2026/');}
function selectedTargets(targets,root=ROOT){
 const file=path.join(root,SOURCE);
 if(!fs.existsSync(file))throw Error('Missing current Book 1 edition targets');
 const current=JSON.parse(fs.readFileSync(file,'utf8'));
 if(current.edition_id!==REVISION||current.exercises.length!==12)throw Error('Unknown Book 1 edition');
 for(const r of current.exercises){
  if(r.edition_id!==REVISION||r.record_id!==REVISION+':'+r.id||r.module!==1||r.approval_inherited!==false||r.record_status==='reviewed_final'||r.curriculum_authority!==false)throw Error('Mixed Book 1 identity/authority '+r.id);
 }
 return {...targets,exercises:[...current.exercises,...targets.exercises.filter(r=>r.module!==1)]};
}
function lookup(id,edition,{root=ROOT,legacy}={}){
 if(edition===REVISION)return selectedTargets({exercises:[]},root).exercises.find(r=>r.id===id)||null;
 if(edition===LEGACY&&legacy)return legacy.exercises.find(r=>r.module===1&&r.id===id)||null;
 throw Error('Explicit supported Book 1 edition required; first edition additionally needs its historical registry');
}
module.exports={REVISION,LEGACY,SOURCE,selectedTargets,lookup,isCurrentSource};
