'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),file='build-scripts/books/books34-followups-revision-pin.json';
const git=(cwd,args)=>execFileSync('git',args,{cwd,maxBuffer:4*1024*1024});
test.each([false,true])('predecessor pin survives aged Windows checkout with byte rule=%s',protectedBytes=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'book2-notation-checkout-'));
 try{
  git(temp,['init','--quiet']);git(temp,['config','core.autocrlf','true']);
  let attributes=fs.readFileSync(path.join(root,'.gitattributes'),'utf8');
  if(!protectedBytes)attributes=attributes.split('\n').filter(line=>!line.startsWith(file+' ')).join('\n');
  fs.writeFileSync(path.join(temp,'.gitattributes'),attributes);
  const bytes=git(root,['show','HEAD:'+file]);fs.mkdirSync(path.dirname(path.join(temp,file)),{recursive:true});fs.writeFileSync(path.join(temp,file),bytes);
  git(temp,['-c','core.autocrlf=false','add','.']);git(temp,['-c','user.name=Checkout test','-c','user.email=test@example.invalid','commit','--quiet','-m','fixture']);
  fs.unlinkSync(path.join(temp,file));git(temp,['checkout-index','-f','-u','--all']);
  const aged=new Date(Date.now()-10000);fs.utimesSync(path.join(temp,file),aged,aged);git(temp,['update-index','--refresh']);
  git(temp,['-c','core.autocrlf=false','reset','--hard']);git(temp,['-c','core.autocrlf=false','checkout-index','-f','--all']);
  const actual=fs.readFileSync(path.join(temp,file));expect(actual.equals(bytes)).toBe(protectedBytes);
  expect(actual.toString().replace(/\r\n/g,'\n')).toBe(bytes.toString());
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
