'use strict';
// Finite reviewed authority transition. Keep Book 2 approval metadata immutable.
// HOW TO ADAPT: a later source change requires a new reviewed transition;
// do not broaden this to accept an editable manifest or arbitrary revisions.
const crypto=require('crypto');
const TRANSITIONS=Object.freeze({
  "references/owned/course-blueprint-v5.md": [
    "61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7",
    "482c506c93d1d8cd4ba9bd4bc6cf268c73494112c32726f7da176d804d4bda96"
  ],
  "references/owned/course-blueprint-v6-three-year.md": [
    "72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e",
    "dc89ed024db2d352148a963e08d7cc668888c6190e9738a28c5e0fb3d66085f7"
  ],
  "references/authored/course-target-exercises.json": [
    "d3d7163ad82e0ddcf2f9ae1cbfa653335c96cb46762e8125bd594583f5d5885e",
    "8e30ecc51151bb479dfca0ca8dbe41122e4d548b4e6ace76663b25922e3c552f"
  ]
});
function hash(value) {return crypto.createHash('sha256').update(String(value).replace(/\r\n?/g,'\n')).digest('hex');}
function acceptsTransition(file,previousHash,files) {
 const pair=TRANSITIONS[file];
 return Boolean(pair && pair[0]===previousHash && Object.entries(TRANSITIONS).every(([p,hashes])=> files[p]!=null && hash(files[p])===hashes[1]));
}
module.exports={TRANSITIONS,acceptsTransition};
