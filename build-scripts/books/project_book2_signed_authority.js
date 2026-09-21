'use strict';
// Refresh only the current lesson blueprint projection from its owned source.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const authority=require('../workflows/book2-signed-authority');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(process.argv[2]||path.join(root,'../4veco-lessen'));
const source='references/owned/course-blueprint-v5.md',target='course_blueprint_v5.md';
const desired=fs.readFileSync(path.join(root,source),'utf8').replace(/\r\n?/g,'\n');
if(!authority.matchesFile(source,desired))throw Error('Unreviewed current blueprint');
const baseline=execFileSync('git',['show',`fdad5d8f62b7e12618e6a3b8d344c407c259ed35:${target}`],{cwd:lessons,encoding:'utf8'}).replace(/\r\n?/g,'\n');
const current=fs.readFileSync(path.join(lessons,target),'utf8').replace(/\r\n?/g,'\n');
if(current!==baseline&&current!==desired)throw Error('Unexpected lesson blueprint edit');
fs.writeFileSync(path.join(lessons,target),desired);
console.log('Projected current signed Book 2 authority; Book 3/4 rows unchanged');
