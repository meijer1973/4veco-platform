'use strict';
// Finite, explicitly authorized classroom successor to the reviewed textbook.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const EDITION='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026';
const TITLES={
 '213':'Marginale kosten en marginale opbrengsten','214':'Gemengde opgaven',
 '221':'Prijselasticiteit','222':'Elasticiteit en omzet','223':'Inkomenselasticiteit en kruislingse elasticiteit','224':'Gemengde opgaven',
 '231':'Consumentensurplus','232':'Producentensurplus en totaal surplus','233':'Pareto-efficiëntie en welvaartsverlies','234':'Gemengde opgaven'};
const CODES=Object.keys(TITLES),CONTRACT='build-scripts/books/book2-presentation-contract.json';
const folder=code=>EDITION+'/bronnen/H'+code[1]+'/paragrafen/'+code.split('').join('.')+' '+TITLES[code];
const paths=CODES.flatMap(code=>['pptx','pdf'].map(ext=>folder(code)+'/'+code.split('').join('.')+' '+TITLES[code]+' – presentatie.'+ext));
const allowed=new Set(paths),BASE='a8940a7a79e22857a3e306a91fe923c48c63e716';
function checkContract(root,lessons){
 const c=JSON.parse(fs.readFileSync(path.join(root,CONTRACT)));
 if(c.lesson_baseline!==BASE||JSON.stringify(c.decks.map(r=>r.code))!==JSON.stringify(CODES))throw Error('Wrong classroom successor scope');
 if(JSON.stringify(c.decks.flatMap(r=>[r.pptx,r.pdf]))!==JSON.stringify(paths))throw Error('Presentation exception exceeds ten named decks');
 const tree=execFileSync('git',['ls-tree','-r','--name-only','-z',BASE,'--',EDITION],{cwd:lessons,encoding:'utf8'});
 const preserved=tree.split('\0').filter(p=>/ – presentatie\.(pdf|pptx)$/.test(p)||/\/evidence\/2\.[123]\.\d+-presentation\.md$/.test(p)).filter(p=>!allowed.has(p)).sort();
 if(JSON.stringify(c.preserved_classroom_paths)!==JSON.stringify(preserved)||preserved.length!==16)throw Error('Historical classroom protection changed');
 const expected=[...paths,...CODES.map(code=>folder(code)+'/README.md'),...CODES.map(code=>folder(code)+'/evidence/'+code.split('').join('.')+'-presentation-pagination.md'),
 EDITION.split('/edities/')[0]+'/README.md',EDITION+'/README.md',EDITION+'/NOTATION-REVISION-2026-10-01.md',
 EDITION+'/PRESENTATIES-PAGINAVERWIJZINGEN.md',EDITION+'/presentation-page-compatibility.json',EDITION+'/notation-verification.json','book2-notation-revision.json'].sort();
 if(JSON.stringify(c.lesson_revision_paths)!==JSON.stringify(expected))throw Error('Unbounded presentation successor paths');
 return c;
}
function checkLane(lessons,root=path.resolve(__dirname,'../..')){
 const c=checkContract(root,lessons),r=require('./book2-notation-revision'),s=require('../workflows/check-paragraph-lane-scope');
 const changedPaths=r.changedPaths(lessons);
 const actual=s.classifyChangedPaths(changedPaths).partB_companion.sort();
 if(JSON.stringify(actual)!==JSON.stringify([...paths].sort()))throw Error('Unreviewed companion boundary crossing');
 const result=s.checkLaneScope({lane:'textbook',changedPaths,exception:c.lane_scope_exception});
 if(!result.ok)throw Error(JSON.stringify(result));
 return {passed:true,companion_files:actual.length,authorization:c.lane_scope_exception.reason};
}
module.exports={CONTRACT,CODES,paths,allowed,checkContract,checkLane};
if(require.main===module)console.log(JSON.stringify(checkLane(path.resolve(__dirname,'../../../4veco-lessen')),null,2));
