'use strict';
// Exactly the first-edition freeze clarification + Book 1 second-edition link.
// Book 2 teaching rules and approval/hold metadata are unchanged. A later edit
// needs another independently reviewed transition; a manifest cannot grant it.
const crypto=require('crypto');
const FILE='skills/econ-exercise-builder.md';
const BEFORE='8ca4436eb9895ea5840e09162a6aa38e5d3df68bcc021b5404b1759d1531e925';
const AFTER='83f07c86db1b0634cec6fecda43281588ea8acf7f4bdc2e46eb8cf5fc0df83ff';
function acceptsTransition(file,previousHash,files){
 return file===FILE&&previousHash===BEFORE&&files[file]!=null&&crypto.createHash('sha256').update(String(files[file]).replace(/\r\n?/g,'\n')).digest('hex')===AFTER;
}
module.exports={FILE,BEFORE,AFTER,acceptsTransition};
