'use strict';
// Internal native worker, invoked only after the owned Python release gates.
// Not an independently authorized paragraph production entrypoint.
const fs=require('node:fs'), sharp=require('sharp');
const source=fs.readFileSync(0);
if(process.argv.length!==3)throw Error('Expected exact PNG destination');
sharp(source,{density:96}).resize(1200,1050,{fit:'fill'}).png().toFile(process.argv[2]).then(x=>{
 if(x.width!==1200||x.height!==1050)throw Error('Unexpected source figure dimensions');
 console.log(JSON.stringify(x));
}).catch(e=>{console.error(e);process.exitCode=1;});
