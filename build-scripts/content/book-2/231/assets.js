/**
 * HOW TO ADAPT: §231-only figures from approved v2 economic coordinates.
 * Keep all 15 roles, source font/canvas, and native names pinned by test_source.py.
 * --describe is read-only; otherwise pass the exact paragraph _assets directory.
 */
'use strict';
const fs=require('fs'), path=require('path'), assert=require('node:assert/strict');
const C={ink:'#2D3748',demand:'#1A5276',fill:'#85C1E9',bg:'#F7FAFC',grid:'#CBD5E0'};
const models={
 bookfair:{a:40,b:.5,p:10,qstep:20,pstep:10,title:'Boekenbeurs'},
 museum:{a:30,b:1,p:10,qstep:5,pstep:5,title:'Museum'},
 aquarium:{a:24,b:.5,p:8,qstep:8,pstep:4,title:'Aquarium'},
 garden:{a:30,b:.5,p:10,qstep:10,pstep:5,title:'Tuintour'},
 climbing:{a:24,b:.5,p:12,qstep:8,pstep:4,title:'Klimkennismaking'},
 boardgame:{a:20,b:.5,p:5,qstep:10,pstep:5,title:'Bordspelmiddag'},
 skate:{a:36,b:.5,p:12,qstep:12,pstep:6,title:'Skateclinic'},
 cafe:{a:28,b:.5,p:14,qstep:14,pstep:7,title:'Taalcafé'},
 concert:{a:50,b:.5,p:20,qstep:20,pstep:10,title:'Concertkaartjes'}
};
const specs=[
 ['fig_1','discrete','discrete'],
 ['fig_2','bookfair','axes'],['fig_3','bookfair','price'],['fig_4','bookfair','payment'],
 ['we_1','museum','cs'],['ex_1','aquarium','price'],['ex_2','garden','guided'],
 ['ex_3','climbing','line'],['ex_4','aquarium','cs'],['ex_5','garden','cs'],
 ['ex_6','climbing','cs'],['ex_7','boardgame','cs'],['ex_8','skate','cs'],
 ['ex_9','cafe','payment'],['ex_10','concert','cs']
].map(([suffix,model,stage])=>({stem:'2.3.1_'+suffix,model,stage}));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const n=v=>Number(v.toFixed(6));
function text(x,y,s,anchor='start',color=C.ink){
 return '<text x="'+n(x)+'" y="'+n(y)+'" text-anchor="'+anchor+'" font-family="Arial" font-size="30pt" font-weight="400" fill="'+color+'">'+esc(s)+'</text>';
}
function line(id,x1,y1,x2,y2,color=C.ink,width=3,dash=''){
 return '<line id="'+id+'" x1="'+n(x1)+'" y1="'+n(y1)+'" x2="'+n(x2)+'" y2="'+n(y2)+'" stroke="'+color+'" stroke-width="'+width+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
}
function dot(id,x,y){return '<circle id="'+id+'" cx="'+n(x)+'" cy="'+n(y)+'" r="7" fill="'+C.demand+'"/>';}
function frame(title,desc,body){
 return '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-labelledby="title desc">\n<title id="title">'+esc(title)+'</title><desc id="desc">'+esc(desc)+'</desc>\n'+
 '<defs><pattern id="hatch" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M-5,5 L5,-5 M0,20 L20,0 M15,25 L25,15" stroke="#1A5276" stroke-width="2.2"/></pattern></defs>\n'+
 '<rect width="1200" height="900" fill="'+C.bg+'"/>\n'+body+'\n</svg>\n';
}
function graph(spec){
 const m=models[spec.model],qmax=m.a/m.b,qd=(m.a-m.p)/m.b;
 const X=q=>160+880*q/qmax,Y=p=>650-450*p/m.a;
 assert.equal(m.a-m.b*qd,m.p);assert(qd>0&&qd<qmax);
 const cs=spec.stage==='cs'||spec.stage==='payment'||spec.stage==='guided';
 const price=cs||spec.stage==='price',demand=spec.stage!=='axes';
 // Scaffold and labels first; mark layers stay within its reserved plot box.
 let body=text(600,60,m.title,'middle')+text(160,135,'P (€ per kaartje)');
 for(let p=0;p<=m.a;p+=m.pstep){
  body+=line('p-tick-'+p,150,Y(p),160,Y(p))+text(130,Y(p)+14,p,'end');
  if(p>0)body+=line('p-grid-'+p,160,Y(p),1040,Y(p),C.grid,1.2,'4 10');
 }
 for(let q=0;q<=qmax;q+=m.qstep){
  body+=line('q-tick-'+q,X(q),650,X(q),661)+text(X(q),715,q,'middle');
 }
 body+=line('p-axis',160,200,160,650,C.ink,3.5)+line('q-axis',160,650,1040,650,C.ink,3.5);
 body+=text(600,775,'Q (kaartjes)','middle');
 if(spec.stage==='payment'){
  body+='<rect id="payment" x="160" y="'+n(Y(m.p))+'" width="'+n(X(qd)-160)+'" height="'+n(650-Y(m.p))+'" fill="#CBD5E0" fill-opacity="0.55"/>';
 }
 // The exact triangle is computed from economic bounds, never eyeballed.
 if(cs){
  const points=[[X(0),Y(m.a)],[X(0),Y(m.p)],[X(qd),Y(m.p)]].map(p=>p.map(n).join(',')).join(' ');
  body+='<polygon id="cs-fill" points="'+points+'" fill="'+C.fill+'" fill-opacity="0.45"/>';
  body+='<polygon id="cs-hatch" points="'+points+'" fill="url(#hatch)"/>';
 }
 if(price){
  body+=line('price',160,Y(m.p),1040,Y(m.p),C.ink,3.5,'16 10');
  body+=line('quantity-projection',X(qd),Y(m.p),X(qd),650,C.ink,2.5,'6 8');
  body+=text(1060,Y(m.p)+14,'P='+m.p);
 }
 if(demand)body+=line('demand',X(0),Y(m.a),X(qmax),Y(0),C.demand,5)+text(441.6,299,'Vraaglijn','start',C.demand);
 body+=dot('p-intercept',X(0),Y(m.a))+dot('q-intercept',X(qmax),Y(0));
 if(price)body+=dot('price-intersection',X(qd),Y(m.p));
 if(cs){
  const cx=X(.18*qd),cy=Y(m.p+.38*(m.a-m.p));
  body+='<rect x="'+n(cx-36)+'" y="'+n(cy-35)+'" width="72" height="43" fill="'+C.bg+'"/>'+text(cx,cy,'CS','middle');
 }
 if(spec.stage==='payment')body+=text(X(.30*qd),Y(.45*m.p),'Betaling','middle');
 const footer=spec.stage==='guided'?'Basis: 40 kaartjes; hoogte: 20 €/kaartje':
  '(0, '+m.a+')   ('+qmax+', 0)'+(price?'   ('+qd+', '+m.p+')':'');
 body+=text(600,845,footer,'middle');
 const description=m.title+': P = '+m.a+' − '+m.b+'Q; '+(price?'gegeven P = '+m.p+', Qd = '+qd+'. ':'')+
  (cs?'CS is het gebied boven de prijs en onder de vraaglijn. ':'')+'Geen berekend marktevenwicht.';
 return frame(m.title+' — '+({axes:'assen en snijpunten',line:'vraaglijn zonder prijslijn',price:'vraaglijn en gegeven prijs',payment:'consumentensurplus en betaling',guided:'consumentensurplus met basis en hoogte',cs:'consumentensurplus'}[spec.stage]),description,body);
}
function discrete(){
 const Y=p=>650-22.5*p,vs=[18,14,10,6],centres=[280,480,680,880];
 let b=text(600,60,'Betalingsbereidheid','middle')+text(160,135,'Bedrag (€)');
 for(let p=0;p<=20;p+=5)b+=line('p-tick-'+p,150,Y(p),160,Y(p))+text(130,Y(p)+14,p,'end')+line('p-grid-'+p,160,Y(p),1040,Y(p),C.grid,1.2,'4 10');
 b+=line('amount-axis',160,200,160,650,C.ink,3.5)+line('category-axis',160,650,1040,650,C.ink,3.5);
 vs.forEach((v,i)=>{
  const x=centres[i];b+='<rect id="wtp-'+(i+1)+'" x="'+(x-50)+'" y="'+Y(v)+'" width="100" height="'+(650-Y(v))+'" fill="#CBD5E0" stroke="'+C.demand+'" stroke-width="3"/>';
  if(v>10)b+='<rect id="gap-'+(i+1)+'" x="'+(x-50)+'" y="'+Y(v)+'" width="100" height="'+(Y(10)-Y(v))+'" fill="'+C.fill+'" fill-opacity="0.45"/><rect x="'+(x-50)+'" y="'+Y(v)+'" width="100" height="'+(Y(10)-Y(v))+'" fill="url(#hatch)"/>';
  b+=text(x,[233,323,413,503][i],v,'middle')+text(x,715,i+1,'middle');
 });
 b+=line('price',160,Y(10),1040,Y(10),C.ink,3.5,'16 10')+text(1060,Y(10)+14,'P=10');
 for(const [x,y,value]of [[280,349,8],[480,394,4]])b+='<rect x="'+(x-20)+'" y="'+(y-34)+'" width="40" height="41" fill="'+C.bg+'"/>'+text(x,y,value,'middle');
 b+=text(600,775,'Deelnemer','middle')+text(600,845,'Gekocht: 1, 2 en 3; niet gekocht: 4','middle');
 return frame('Betalingsbereidheid en consumentensurplus van vier workshopdeelnemers','Afzonderlijke personen met betalingsbereidheid 18, 14, 10 en 6 euro. Bij prijs 10 kopen de eerste drie; hun surplus is 8, 4 en 0 euro, samen 12. De vierde koopt niet.',b);
}
function sources(){return Object.fromEntries(specs.map(s=>[s.stem,s.stage==='discrete'?discrete():graph(s)]));}
async function main(){
 if(process.argv[2]==='--describe'){console.log(JSON.stringify({models,specs},null,2));return;}
 const output=path.resolve(process.argv[2]||'');
 if(path.basename(output)!=='_assets'||path.basename(path.dirname(output))!=='2.3.1 Consumentensurplus')throw Error('Pass exact §231 _assets folder');
 const generated=sources();assert.equal(Object.keys(generated).length,15);
 const sharp=require('sharp');fs.mkdirSync(output,{recursive:true});
 for(const [stem,svg]of Object.entries(generated)){
  fs.writeFileSync(path.join(output,stem+'.svg'),svg);
  await sharp(Buffer.from(svg)).resize(2400,1800).png().toFile(path.join(output,stem+'.png'));
 }
 console.log(JSON.stringify({assets:Object.keys(generated),pairs:15,canvas:[1200,900],png:[2400,1800],font:'Arial regular 30pt',visual_acceptance:'NOT_ASSERTED'}));
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={models,specs,sources};
