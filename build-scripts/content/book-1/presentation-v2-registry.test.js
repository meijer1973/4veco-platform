const fs=require('fs'),os=require('os'),path=require('path');
const {DEFAULT_MODULE_ROOT,assertHistoricalBuildDestination,moduleRootFrom}=require('./presentation-v2-registry');
test('historical regression builds default outside active lessons',()=>{
  expect(DEFAULT_MODULE_ROOT).toMatch(/[\\/]\.presentation-v2-first-edition$/);
  expect(DEFAULT_MODULE_ROOT).not.toContain('4veco-lessen');
  expect(()=>moduleRootFrom({edition:'book1-second-edition-2026'})).toThrow('first edition');
});
test('explicit active book and its descendants cannot regenerate retired files',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'book1-retired-build-'));
  try{
    fs.mkdirSync(path.join(root,'edities/tweede-editie-2026'),{recursive:true});
    fs.writeFileSync(path.join(root,'edities/tweede-editie-2026/manifest.json'),'{}');
    expect(()=>assertHistoricalBuildDestination(root)).toThrow('regeneration is retired');
    expect(()=>assertHistoricalBuildDestination(path.join(root,'nested'))).toThrow('regeneration is retired');
    expect(()=>assertHistoricalBuildDestination(path.join(root,'..','scratch'))).not.toThrow();
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
