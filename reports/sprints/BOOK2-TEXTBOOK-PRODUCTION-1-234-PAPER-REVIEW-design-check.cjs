'use strict';
// Independent nominal design arithmetic only: this is NOT rendered-glyph or page evidence.
const fs=require('node:fs'),path=require('node:path'),A=require('node:assert/strict'),c=require('node:crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),pre='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PAPER-REVIEW-';
const hash=b=>c.createHash('sha256').update(b).digest('hex'),file='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart/2.3.4-textbook-plan.md',raw=fs.readFileSync(path.join(L,file));
A.equal(hash(raw),'12d81b83f9be50ebdcf3460ce7ad60d2de5a788cb3da8d3a046c1449112922ea');const s=raw.toString('utf8');
const contexts=[['Een bezoekerscentrum','Broncijfers:',113],['Een openluchttheater','Hulptabel:',104],['Een festival verkoopt','Tabel:',107],['Een buurtcentrum','Broncijfers:',106]].map(([a,b,n])=>{const i=s.indexOf(a),j=s.indexOf(b,i),count=s.slice(i,j).trim().split(/\s+/).length;A(i>=0&&j>i);A.equal(count,n);A(count>=100&&count<=250);return{start:a,stop:b,whitespace_words:count};});
const rows=[];for(const[name,a,b,c,d,Qmax,Pmax,pbook,qbook]of [['WE',36,1,6,.5,36,36,18,16],['G3',30,.5,6,.5,60,40,20,16],['G4',42,1,6,.5,42,42,20,20],['I6',60,1,12,.5,60,60,30,24],['target',80,1,20,.5,80,80,45,30]]){
 const qe=(a-c)/(b+d),pe=a-b*qe,xx=q=>180+780*q/Qmax,yy=p=>720-540*p/Pmax;
 for(const[variant,q,p]of [['free',qe,pe],['booking',qbook,pbook]]){
  const centerQ=.22*q,x=xx(centerQ),rightQ=centerQ+44*Qmax/780,priceY=yy(p),demandY=yy(a-b*rightQ),supplyY=yy(c+d*rightQ);
  for(const[area,cy]of [['CS',(demandY+priceY)/2],['PS',(priceY+supplyY)/2]]){
   const corners=[];for(const dx of [-44,44])for(const dy of [-38,38]){const px=x+dx,py=cy+dy,Q=(px-180)*Qmax/780,P=(720-py)*Pmax/540;A(Q>=0&&Q<=q);if(area==='CS')A(P>=p&&P<=a-b*Q);else A(P<=p&&P>=c+d*Q);corners.push({x:px,y:py,Q,P});}
   rows.push({name,variant,area,expanded_box_half_width:44,expanded_box_half_height:38,corners,nominal_clearance_pass:true});
  }
 }
}
const lum=hex=>{const [r,g,b]=hex.match(/[a-f0-9]{2}/gi).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;},bg=lum('F7FAFC');
const contrast=['2D3748','1A5276','1E8449'].map(color=>{const ratio=(bg+.05)/(lum(color)+.05);A(ratio>=4.5);return{color,background:'F7FAFC',ratio};});
const source=fs.readFileSync(__filename),result={status:'NOMINAL_DESIGN_ARITHMETIC_PASS_NOT_RENDERED_QA',plan_raw_sha256:hash(raw),source_raw_sha256:hash(source),source_utf8:source.toString('utf8'),contexts,expanded_region_boxes:rows,boxes:rows.length,corners:rows.reduce((n,r)=>n+r.corners.length,0),contrast,placed_font_pt:40/1200*166/25.4*72,actual_glyphs_measured:false,pages_viewed:0,figures_viewed:0,remaining:['actual glyph ink and line/leader clearances','actual all-page including Start1 same/facing pagination','actual color and grayscale visual review']};
fs.writeFileSync(path.join(P,pre+'design-check.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:result.status,boxes:result.boxes,corners:result.corners,contexts,contrast}));
