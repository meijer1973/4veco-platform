// HOW TO ADAPT: use the current paragraph's source manifest and actual target.
// All data charts, area polygons, text and tables remain editable in PowerPoint.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const sourceManifest=JSON.parse(await fs.readFile(path.join(HERE,'presentation-233.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('233');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', title='Pareto-efficiëntie en welvaartsverlies';
const source='https://github.com/meijer1973/4veco-lessen/blob/'+sourceManifest.sourceCommit+'/'+sourceManifest.sourceEditionPath.split('/').map(encodeURIComponent).join('/')+'/';
const tables=[],charts=[],slides=[],overviewSlides=[];
const E={name:'Rondvaartplaatsen',unit:'plaatsen',a:36,b:.5,c:6,d:.25,qe:40,pe:16,cap:24,price:18,xmax:72,ymax:40,xstep:12,ystep:8};
const T={name:'Concertkaartjes',unit:'kaartjes',a:50,b:.5,c:5,d:.25,qe:60,pe:20,cap:40,price:25,xmax:100,ymax:50,xstep:20,ystep:10};
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(t,role='teaching',footer='§2.3.3 '+title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,t,60,40,1480,91,t.startsWith('Deze les:')?45:49,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,31,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:t,role});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Uitleg: ${explanation}\n\nVraag: ${question}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 2, chatuitgave 2026, revisie 1 oktober 2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${source}bronnen/H3/2.3%20Surplus%20en%20welvaart%20%E2%80%93%20antwoorden.md\n${authored?'Eigen context en gegevens: fictieve rondvaartplaatsen, één boekingsronde. Uitlegvoorbeeld, niet uit het boek. De boekpagina’s onderbouwen de methode, niet deze getallen.':''}\n${extra}`);
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,178,1480,47,30,{bold:true,color:C.blue});}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:16,right:14,top:10,bottom:10}};
 }} tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.','Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 6.','Zet je huiswerk in je agenda.'
];
const overviewData={goals:'Werkelijke handel bepalen.\nSurplus en verlies berekenen.\nPareto en eerlijkheid beoordelen.',start:'Pagina 97 · Opgaven 1 en 2\n2: verkennen met theorie p. 94',homework:'§2.3.3 · Maken en nakijken\nBasis: 3 en 4\nZelfstandig: 5\nDoelopgave: 6'};
function overview(phase,active){
 const s=slide('Deze les: §2.3.3 '+title,'overview');overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,568,45,35,{bold:true});text(s,overviewData.goals,972,244,568,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,568,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,overviewData.start,972,459,568,100,30,{name:'overview-start'});rule(s,972,580,568);
 text(s,'Huiswerk',972,610,568,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,overviewData.homework,972,669,568,165,30,{name:'overview-homework'});
 notes(s,'91–101',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 1–2 en basis 3 op p.97; basis 4 op p.98; zelfstandig 5 op p.99; doel 6 op p.100–101. Huiswerk 3,4,5,6 maken en nakijken. Bonus 7 en herhaling 8–9 zijn extra. Start 1 haalt de driehoeken uit §2.3.1 p.75 en §2.3.2 p.82–85 op. Start 2 vraagt het nieuwe Pareto-criterium: lees de definities en het onderscheid met een groter totaal op p.94. Noteer een eerste redenering en twijfel. Dit is ondersteund verkennen. Keer na de uitleg terug naar 2, vóór het basiswerk. Geen aanname dat dit al beheerst wordt. De volledige route kan extra lestijd vragen; er is geen gemeten 55-minutenbegroting.`, 'Waar heb je een berekening nodig en waar een oordeel over afzonderlijke personen?', 'Een stijgend totaal is nog geen Paretoverbetering.','Ga naar de volgende lesfase, of laat het huiswerk in de agenda noteren.');
}
// Native XY chart with the same explicit plot geometry used by editable area polygons.
function graph(s,m,stage,{wide=false}={}){
 const pos={left:60,top:260,width:wide?1480:950,height:545};
 const plot={x:pos.left+.12*pos.width,y:pos.top+.06*pos.height,w:.84*pos.width,h:.82*pos.height};
 const px=q=>plot.x+q/m.xmax*plot.w,py=v=>plot.y+(1-v/m.ymax)*plot.h;
 const price=stage==='free'?m.pe:m.price,q=stage==='free'?m.qe:m.cap;
 const bd=m.a-m.b*q,mc=m.c+m.d*q;
 function area(name,pts,fill){
  const coords=pts.map(([x,y])=>[px(x),py(y)]),left=Math.min(...coords.map(x=>x[0])),top=Math.min(...coords.map(x=>x[1]));
  const width=Math.max(...coords.map(x=>x[0]))-left,height=Math.max(...coords.map(x=>x[1]))-top;
  s.shapes.add({name,geometry:'custom',position:{left,top,width,height},fill,line:{fill:'none',width:0},customPaths:[{width,height,commands:coords.map(([x,y],i)=>({[i?'lineTo':'moveTo']:{x:x-left,y:y-top}})).concat([{close:{}}])}]});
 }
 if(stage==='free'){area('CS vrije markt',[[0,m.pe],[0,m.a],[m.qe,m.pe]],'#DCEAF3');area('PS vrije markt',[[0,m.c],[0,m.pe],[m.qe,m.pe]],'#DCEDE7');}
 if(stage==='cs'){area('CS rechthoek',[[0,price],[q,price],[q,bd],[0,bd]],'#B6D7E8');area('CS driehoek',[[0,bd],[0,m.a],[q,bd]],'#E0EDF5');}
 if(stage==='ps'){area('PS rechthoek',[[0,mc],[q,mc],[q,price],[0,price]],'#B9DED2');area('PS driehoek',[[0,m.c],[0,mc],[q,mc]],'#E2F0EA');}
 if(stage==='loss'){area('Welvaartsverlies',[[m.cap,bd],[m.qe,m.pe],[m.cap,mc]],'#F2D0A9');}
 const series=[];
 const addLine=(name,x,y,color,style='solid',width=3)=>series.push({name,xValues:x,values:y,line:{fill:color,width,style},marker:{symbol:'none'}});
 addLine('V',[0,m.xmax],[m.a,m.a-m.b*m.xmax],C.blue);
 addLine('A = MK',[0,m.xmax],[m.c,m.c+m.d*m.xmax],C.green);
 addLine('P = '+price,[0,m.xmax],[price,price],C.ink,'dashed',2);
 if(stage!=='free')addLine('Boekingsgrens',[m.cap,m.cap],[0,bd],C.muted,'dashed',2);
 if(stage==='cs')addLine('Hulplijn betalingsbereidheid',[0,m.cap],[bd,bd],C.blue,'dotted',2);
 if(stage==='ps')addLine('Hulplijn MK',[0,m.cap],[mc,mc],C.green,'dotted',2);
 if(stage==='loss'){addLine('Verliesgrens',[m.cap,m.qe,m.cap,m.cap],[bd,m.pe,mc,bd],C.orange,'solid',3);}
 function label(name,x,y,color=C.ink,position='t',marker=false){series.push({name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:marker?'circle':'none',size:7,fill:color,line:{fill:color,width:1}},dataLabelOverrides:[{idx:0,text:name,position,showValue:false,textStyle:{typeface:FONT,fontSize:25,fill:color,bold:true}}]});}
 label('E',m.qe,m.pe,C.ink,'t',true);
 label('V',m.xmax*.9,m.a-m.b*m.xmax*.9,C.blue,'t');
 label('A = MK',m.xmax*.87,m.c+m.d*m.xmax*.87,C.green,'t');
 label('P = '+price,m.xmax*.88,price,C.ink,'b');
 if(stage==='free'){label('CS',m.qe*.3,(m.a+m.pe)/2,C.blue);label('PS',m.qe*.3,(m.c+m.pe)/2,C.green);}
 if(stage==='cs'){label('driehoek',q*.3,bd+(m.a-bd)*.3,C.blue);label('rechthoek',q*.5,price+(bd-price)*.5,C.blue);}
 if(stage==='ps'){label('rechthoek',q*.5,mc+(price-mc)*.5,C.green);label('driehoek',q*.33,m.c+(mc-m.c)*.66,C.green);}
 // Annotation coordinates are authored to six decimals, without binary tails.
 for(const ser of series){ser.xValues=ser.xValues.map(v=>Number(v.toFixed(6)));ser.values=ser.values.map(v=>Number(v.toFixed(6)));}
 const ch=s.charts.add('scatter',{position:pos,series,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:m.xmax,majorUnit:m.xstep,numberFormatCode:'0',title:{text:'Q ('+m.unit+')',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'0',title:{text:'P (€ per '+(m.unit==='kaartjes'?'kaartje':'plaats')+')',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'none',plotAreaFill:'none'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 return ch;
}
function targetSlide(t,role='target-answer'){return slide(t,role,'§2.3.3 '+title+' · Opgave 6 · Boekpagina 100–101');}

overview('Startopdracht',2);
{
 const s=slide('Lesdoelen en voorkennis');
 table(s,[['Je leert','Je gebruikt al'],['Werkelijke handel en toewijzing bepalen','Functies invullen en Q berekenen'],['Afgekapt surplus en verlies berekenen','CS, PS en driehoeksoppervlakte'],['Een Paretoverbetering onderbouwen','Betalingsbereidheid en MK vergelijken']],60,205,1480,340,[830,650],33);
 text(s,'CS: boven de prijs en onder de vraaglijn.',60,599,1480,60,36,{color:C.blue,bold:true});
 text(s,'PS: onder de prijs en boven de MK-lijn. TS = CS + PS.',60,684,1480,60,36,{color:C.green,bold:true});
 text(s,'Eenheid: producten × euro per product = euro.',60,770,1480,60,34);
 notes(s,'75, 81–85, 91–94','Haal de eerder onderwezen betekenissen op: individueel CS is betalingsbereidheid min prijs, individueel PS is prijs min MK. Doorlopende rechte lijnen leveren oppervlakten. Bij een driehoek: ½ × basis × hoogte. PS is niet automatisch winst, omdat vaste kosten nog niet zijn afgetrokken. Efficiëntie en eerlijkheid zijn verschillende oordelen.','Welk gebied hoort bij de kopers en welk bij de verkopers?','Gebruik alleen echte transacties. Een getekende vraaglijn is geen optelsom van enkele losse kopers.','Introduceer een eigen model met één boekingsronde.');
}
{
 const s=slide('Rondvaartplaatsen: de markt en de boekingsregel');example(s);
 table(s,[['Markt in één boekingsronde','Gegeven'],['Vraag','P = 36 − 0,5Q'],['Aanbod = MK in dit model','P = 6 + 0,25Q'],['Reserveringsregel','P = € 18; maximaal 24 plaatsen']],60,250,1480,335,[740,740],34);
 text(s,'P in euro per plaats. Q in plaatsen. Technisch zijn er minstens 48 plaatsen.',60,620,1480,88,34);
 text(s,'Kopers met de hoogste betalingsbereidheid kopen bij aanbieders met de laagste MK.\nVerruiming kost niets. Prijs, bestaande transacties en anderen blijven ongemoeid.',60,732,1480,103,32,{bold:true,color:C.blue});
 notes(s,'91–96','Eigen voorbeeld. De grens is een verruimbare boekingsregel, geen fysieke schaarste aan plaatsen. Eén boekingsronde; geen maand- of jaarbedragen. Alle bijbehorende aannames staan op de dia. In deze markt geldt aanbod = MK. De lijnen rangschikken de hoogste betalingsbereidheid en laagste MK vooraan.','Welke grens hoort bij het systeem en welke bij de technische mogelijkheden?','Een boekingslimiet is hier niet hetzelfde als maximale productiecapaciteit.','Herhaal eerst het vrije evenwicht van dit eigen model.',{authored:true});
}
{
 const s=slide('Vrij evenwicht: twee surplusdriehoeken');example(s);graph(s,E,'free');
 text(s,'36 − 0,5Q = 6 + 0,25Q\n30 = 0,75Q\nQe = 40; Pe = € 16',1050,262,490,160,33,{bold:true});
 text(s,'CS = ½ × 40 × (36 − 16)\n= € 400',1050,458,490,114,32,{color:C.blue,bold:true});
 text(s,'PS = ½ × 40 × (16 − 6)\n= € 200',1050,602,490,114,32,{color:C.green,bold:true});
 text(s,'TS = 400 + 200 = € 600',1050,754,490,65,31,{bold:true});
 notes(s,'82–85','Refresh de bekende rekenroute: gelijkstellen, Qe oplossen, Pe invullen. Controle Pe = 6 + 0,25×40 = 16. CS boven 16 tot V; PS onder 16 tot MK. Beide stoppen bij 40. Bij 40 zijn betalingsbereidheid en MK gelijk. Verder rechts kost een extra eenheid meer dan zij waard is. Daarom is TS in dit model maximaal 600.','Waarom eindigen de twee gebieden hier in een punt?','De hoogte van CS is 20, niet de prijs 16. De hoogte van PS is 10.','Pas nu de boekingsregel toe.',{authored:true});
}
{
 const s=slide('Gevraagd, aangeboden en werkelijk geboekt');example(s);
 table(s,[['Bij P = € 18','Berekening of gegeven','Hoeveelheid'],['Vraag','18 = 36 − 0,5Qv; 0,5Qv = 18','Qv = 36 plaatsen'],['Aanbod','18 = 6 + 0,25Qa; 0,25Qa = 12','Qa = 48 plaatsen'],['Boekingsgrens','Maximaal 24 boekingen','24 plaatsen'],['Werkelijke handel','24 ligt onder 36 én 48','24 plaatsen']],60,257,1480,412,[350,660,470],31);
 text(s,'De 24 kopers met de hoogste betalingsbereidheid kopen\nbij de aanbieders met de laagste MK.',60,725,1480,108,36,{bold:true,color:C.blue});
 notes(s,'91, 95','Vul de regelprijs in beide functies in en isoleer Q. De gewenste hoeveelheden verschillen van werkelijk geboekte plaatsen. De limiet bindt: 24 is kleiner dan beide. Dankzij de toewijzingsregel mogen we de gebieden vanaf Q=0 gebruiken. Qv is de gevraagde hoeveelheid; Qa is de aangeboden hoeveelheid, net als in het boek.','Waarom rekenen we straks met 24 en niet met 36 of 48?','Een prijs geeft gewenste handel. De extra regel kan die handel beperken.','Lees bij de werkelijke hoeveelheid de twee hoogten.',{authored:true});
}
{
 const s=slide('De rechterrand van het surplus');example(s);graph(s,E,'cap');
 text(s,'Werkelijke Q = 24\nBetaalde prijs = € 18',1050,269,490,115,36,{bold:true});
 text(s,'Betalingsbereidheid\n36 − 0,5 × 24 = € 24',1050,432,490,119,33,{color:C.blue,bold:true});
 text(s,'Marginale kosten\n6 + 0,25 × 24 = € 12',1050,593,490,118,33,{color:C.green,bold:true});
 text(s,'Ook bij Q = 24 blijft voordeel over.',1050,758,490,74,31);
 notes(s,'92, 95','Beide gebieden stoppen bij 24. De laatste koper heeft 24−18=6 euro voordeel, de laatste verkoper 18−12=6. De gebieden eindigen dus niet in een punt op de prijslijn. Bepaal eerst deze rechterrand voor je een oppervlak uitrekent.','Welke twee bedragen liggen bij Q=24 boven en onder de prijs?','Alleen de formule ½×Q×hoogte gebruiken laat een rechthoek weg.','Splits eerst het consumentensurplus.',{authored:true});
}
{
 const s=slide('CS: rechthoek plus driehoek');example(s);graph(s,E,'cs');
 text(s,'Rechthoek\n24 × (24 − 18) = € 144',1050,277,490,125,33,{bold:true,color:C.blue});
 text(s,'Driehoek\n½ × 24 × (36 − 24)\n= € 144',1050,443,490,165,33,{bold:true,color:C.blue});
 text(s,'CS = 144 + 144\n= € 288',1050,657,490,145,40,{bold:true});
 notes(s,'92, 95','De horizontale hulplijn op 24 splitst het CS. Elke verkochte plaats levert minstens 6 euro kopersvoordeel: de rechthoek. De eerdere kopers willen meer dan 24 betalen: de driehoek daarboven. Basis beide 24 plaatsen; hoogten respectievelijk 6 en 12 euro per plaats.','Welk deel vergeet je als je alleen de driehoek neemt?','Gebruik niet Qv=36 als basis. Er gaan maar 24 boekingen door.','Doe dezelfde opsplitsing voor de verkopers.',{authored:true});
}
{
 const s=slide('PS: rechthoek plus driehoek');example(s);graph(s,E,'ps');
 text(s,'Rechthoek\n24 × (18 − 12) = € 144',1050,277,490,125,33,{bold:true,color:C.green});
 text(s,'Driehoek\n½ × 24 × (12 − 6)\n= € 72',1050,443,490,165,33,{bold:true,color:C.green});
 text(s,'PS = 144 + 72\n= € 216',1050,657,490,145,40,{bold:true});
 notes(s,'92, 95','De hulplijn op 12 splitst PS. Alle verkopers krijgen minstens 6 euro boven hun MK, en verkopers links hebben nog lagere MK. De onderste driehoek telt dat extra voordeel. Basis 24 plaatsen; hoogten 6 en 6 euro per plaats. Onder de MK-lijn liggen kosten.','Waarom hoort het gebied onder de MK-lijn niet bij PS?','P×Q is omzet, niet PS. PS is ook niet automatisch winst.','Tel CS en PS op en vergelijk met de vrije markt.',{authored:true});
}
{
 const s=slide('Welvaartsverlies: gemist gezamenlijk voordeel');example(s);graph(s,E,'loss');
 text(s,'Werkelijk TS\n288 + 216 = € 504',1050,262,490,117,34,{bold:true});
 text(s,'Verlies\n600 − 504 = € 96',1050,417,490,118,35,{bold:true,color:C.orange});
 text(s,'Controle met de driehoek\n½ × (40 − 24) × (24 − 12)\n= ½ × 16 × 12 = € 96',1050,579,490,176,32,{bold:true,color:C.orange});
 text(s,'16 gemiste plaatsen; hoogte € 12 per plaats.',1050,764,490,74,29);
 notes(s,'93, 96','Het oranje gebied ligt tussen vraag en MK, rechts van 24 en links van het vrije evenwicht bij 40. Hoekpunten (24;24), (40;16), (24;12). De horizontale afstand 16 en verticale afstand 12 leveren ½×16×12=96 euro. Het gemiste voordeel ontvangt niemand. Het model gebruikt continue gebieden, geen som van 16 afzonderlijke puntwaarden.','Waarom is de hoogte 24−12 en niet de prijs 18?','De stijging van PS is een verdelingseffect, terwijl dit gebied verloren totaal surplus is.','Introduceer nu het criterium dat over afzonderlijke personen gaat.',{authored:true});
}
{
 const s=slide('Paretoverbetering en Pareto-efficiëntie');
 text(s,'Paretoverbetering',60,220,1480,64,42,{bold:true,color:C.blue});
 text(s,'Een haalbare verandering waarbij minstens één persoon\nerop vooruitgaat en niemand erop achteruitgaat.',60,316,1480,130,42);
 rule(s,60,499,1480);
 text(s,'Pareto-efficiëntie',60,554,1480,63,42,{bold:true,color:C.green});
 text(s,'Er is geen haalbare Paretoverbetering meer mogelijk.\nOok een extra transactie of herverdeling biedt die kans niet.',60,656,1480,145,41);
 notes(s,'94','Benadruk de kwantoren: minstens één persoon beter en geen enkele slechter, én de verandering moet haalbaar zijn. Pareto-efficiënt gaat over het ontbreken van zo’n mogelijkheid binnen het model. Een stijgende som is op zichzelf onvoldoende.','Welke voorwaarde gaat over de uitvoerbaarheid?','Een voorstel met winnaars en verliezers is niet zonder meer een Paretoverbetering. Neem compensatie niet stilzwijgend aan.','Toets één concrete extra rondvaartplaats.');
}
{
 const s=slide('De mogelijke 25e rondvaartplaats');example(s);
 table(s,[['Nieuwe koper','Nieuwe verkoper'],['Betalingsbereidheid: 36 − 0,5 × 25 = € 23,50','MK: 6 + 0,25 × 25 = € 12,25'],['Voordeel: 23,50 − 18 = € 5,50','Voordeel: 18 − 12,25 = € 5,75']],60,255,1480,289,[740,740],32);
 text(s,'Haalbaar: technische ruimte en kosteloze verruiming.',60,597,1480,67,38,{bold:true,color:C.blue});
 text(s,'Niemand slechter af: prijs en bestaande transacties blijven gelijk.\nAnderen ondervinden geen nadeel.',60,680,1480,102,35);
 text(s,'Er is een Paretoverbetering. 24 boekingen zijn niet Pareto-efficiënt.',60,785,1480,51,33,{bold:true,color:C.green});
 notes(s,'94, 96','De koper en verkoper winnen bij dezelfde prijs 18. De technische ruimte is minstens 48 en de regel kan kosteloos worden verruimd; alle bestaande transacties en anderen blijven ongemoeid. Daarmee is één haalbare verbetering bewezen. De puntwaarden beschrijven deze mogelijke transactie, niet een exact integraalverschil over een heel productie-interval.','Welke aanname voorkomt dat iemand de kosten van verruiming draagt?','Alleen betalingsbereidheid boven MK is niet het hele Pareto-bewijs.','Vergelijk een extra transactie met de hele overgang naar het vrije evenwicht.',{authored:true});
}
{
 const s=slide('Een hoger totaal en de verdeling van voordeel');example(s);
 table(s,[['Rondvaartplaatsen','CS','PS','TS'],['Vrij: Q = 40; P = € 16','€ 400','€ 200','€ 600'],['Regel: Q = 24; P = € 18','€ 288','€ 216','€ 504']],60,262,1480,272,[700,260,260,260],33);
 text(s,'Terug naar het vrije evenwicht vergroot TS, maar verlaagt PS.',60,589,1480,98,39,{bold:true,color:C.orange});
 text(s,'Een extra boeking tegen dezelfde prijs kan wél niemand schaden.',60,703,1480,78,36);
 text(s,'Wat een eerlijke verdeling is, vraagt een apart waardeoordeel.',60,790,1480,47,32,{bold:true});
 notes(s,'93–94, 96','Bij de regel verliest de kopersgroep 112 en wint de verkopersgroep 16; TS daalt 96. De hele terugkeer naar de vrije markt verlaagt PS van 216 naar 200. Dat is dus niet automatisch een Paretoverbetering. De afzonderlijke 25e transactie bij prijs 18 was wel een geldig bewijs. Maximaal TS of afwezige Paretoverbeteringen schrijft niet voor wie hoeveel verdient.','Waarom is een groter TS onvoldoende om te zeggen dat iedereen wint?','Efficiëntie is geen norm voor eerlijkheid. Groepssurplus kan bovendien individuele verschillen verbergen.','Herzie nu de verkende startopgave.',{authored:true});
}
{
 const s=slide('Terug naar startopgave 2','start-return','§2.3.3 '+title+' · Startopgave 2 · Boekpagina 97');
 text(s,'Koper A krijgt € 8 extra voordeel.\nVerkoper B krijgt € 3 minder voordeel.\nAnderen merken niets.',60,237,1480,210,44);
 text(s,'Is dit een Paretoverbetering? Licht toe.',60,520,1480,90,46,{bold:true,color:C.blue});
 text(s,'Herzie je eerste antwoord. Gebruik alle voorwaarden uit de definitie.',60,718,1480,106,37,{bold:true});
 notes(s,'94, 97','Laat leerlingen eerst hun eigen redenering herzien. Antwoord na reacties: nee, B verliest 3 euro. Het gezamenlijke voordeel stijgt 8−3=5, maar niemand slechter af is geschonden. Dit is terugkoppeling op de al gemaakte verkennende start, geen uitwerking van nog te maken basis/zelfstandige opgaven.','Welke persoon verhindert hier de Pareto-conclusie?','Het saldo +5 vervangt niet de toets per persoon.','Begin de basisopgaven 3–4; gebruik het overzicht.');
}
overview('Zelfstandig werken',4);
{
 const s=targetSlide('Opgave 6: Concertkaartjes, de markt','target-question');
 text(s,'Gebruik opnieuw vraag P = 50 − 0,5Q\nen aanbod P = 5 + 0,25Q.',60,216,1480,122,42,{bold:true,color:C.blue});
 text(s,'P in euro per kaartje; Q in kaartjes.',60,385,1480,63,36);
 table(s,[['Vrij evenwicht','Gegeven'],['Hoeveelheid en prijs','Q = 60; P = € 20'],['Surplus','CS = € 900; PS = € 450; TS = € 1.350']],60,504,1480,267,[650,830],34);
 notes(s,'100','Dit zijn de echte gegevens van de doeloefening, nu met een andere markt dan het eigen rondvaartvoorbeeld. De volgende dia geeft alle details van de reserveringsregel. Toon daarna de basisgrafiek en alle deelvragen voordat de eerste uitwerking komt.','Welke markt en eenheden gebruiken we nu?','Neem geen getallen uit het rondvaartvoorbeeld over.','Toon de reserveringsregel en toewijzing.');
}
{
 const s=targetSlide('Opgave 6: de reserveringsregel','target-question');
 text(s,'Een kosteloos verruimbare reserveringsregel zet de prijs op € 25\nen beperkt boekingen tot 40 kaartjes.',60,218,1480,132,42,{bold:true});
 text(s,'Het platform kan technisch minstens 60 transacties verwerken.',60,401,1480,88,38);
 text(s,'De 40 kaartjes gaan naar de vragers met de hoogste betalingsbereidheid.\nDe aanbieders met de laagste marginale kosten leveren de kaartjes.\nDaardoor vinden precies 40 transacties plaats.',60,524,1480,176,36);
 text(s,'Bij verruiming blijven de prijs en alle bestaande transacties ongewijzigd.',60,746,1480,88,37,{bold:true,color:C.green});
 notes(s,'100','Alle aannames komen uit de boekcontext. Een hogere prijs en een boekingslimiet zijn gegevens, geen les over prijsbeleid. Er staat technisch minstens 60; er staat niet dat 80 transacties uitvoerbaar zijn. Voor Qa bij een prijs geldt wel de gegeven aanbodfunctie.','Wat bepaalt welke kopers en verkopers deelnemen?','Bereken surplus niet voor willekeurig toegewezen kaartjes.','Bekijk de complete basisgrafiek.');
}
{
 const s=targetSlide('Opgave 6: de basisgrafiek','target-question');
 text(s,'V: P = 50 − 0,5Q     A = MK: P = 5 + 0,25Q',60,184,1480,61,35,{bold:true,color:C.blue});graph(s,T,'cap',{wide:true});
 notes(s,'100','Bewerkbare reconstructie van figuur 10: dezelfde assen 0–100 en 0–50, vraag, aanbod=MK, E=(60;20), P=25 en Q=40. Geen antwoordgebied gearceerd. Vergelijk de werkelijke handel met het gegeven vrije evenwicht. Gebruik bij surplus alleen transacties onder de regel.','Waar stopt de werkelijke handel op deze basisgrafiek?','Het snijpunt met de prijslijn is nog niet het werkelijk verkochte aantal.','Toon a en b, daarna c tot en met f zonder antwoorden.');
}
{
 const s=targetSlide('Opgave 6: vragen a en b','target-question');
 text(s,'a)',60,229,100,70,43,{bold:true,color:C.blue});text(s,'Omschrijf Pareto-efficiëntie binnen dit marktmodel: wanneer kan geen haalbare extra transactie of herverdeling iemand beter maken zonder iemand anders slechter te maken?',205,229,1335,218,40);
 rule(s,60,502,1480);
 text(s,'b)',60,550,100,70,43,{bold:true,color:C.blue});text(s,'Bereken bij P = € 25 de gevraagde hoeveelheid (Qv) en aangeboden hoeveelheid (Qa). Leg met de reserveringsregel uit waarom het werkelijke aantal transacties 40 is en welke vragers en aanbieders handelen.',205,550,1335,248,40);
 notes(s,'101','Volledige deelvragen a en b. Vraag b bevat zowel rekenen als werkelijk aantal en toewijzing. Geen oplossingen geven voordat ook f in beeld is geweest.','Welke vier elementen vraagt b?','Alleen Qv en Qa noemen is onvolledig.','Toon c en d.');
}
{
 const s=targetSlide('Opgave 6: vragen c en d','target-question');
 text(s,'c)',60,226,100,70,43,{bold:true,color:C.blue});text(s,'Bereken bij 40 transacties en P = € 25 het CS en PS. Splits elk oppervlak zo nodig in een rechthoek en een driehoek; gebruik de allocatieregel.',205,226,1335,217,40);
 rule(s,60,492,1480);
 text(s,'d)',60,543,100,70,43,{bold:true,color:C.blue});text(s,'Bereken TS en het welvaartsverlies ten opzichte van het vrije evenwicht. Arceer het welvaartsverlies tussen Q = 40 en Q = 60 in de basisgrafiek en benoem basis en hoogte.',205,543,1335,240,40);
 notes(s,'101','Volledige deelvragen c en d. Het boek geeft al de hoeveelheidsgrenzen van het verlies, maar leerlingen moeten gebied, hoogte en berekening onderbouwen.','Welke grafische handeling vraagt d naast het rekenen?','Een verliesbedrag zonder gearceerd gebied, basis en hoogte is nog onvolledig.','Toon e en f.');
}
{
 const s=targetSlide('Opgave 6: vragen e en f','target-question');
 text(s,'e)',60,225,100,70,43,{bold:true,color:C.blue});text(s,'Pas je definitie uit vraag a toe op de 41e transactie. Leg met betalingsbereidheid, marginale kosten en de kosteloze verruiming uit waarom 40 transacties niet Pareto-efficiënt zijn.',205,225,1335,239,40);
 rule(s,60,506,1480);
 text(s,'f)',60,558,100,70,43,{bold:true,color:C.blue});text(s,'Leg uit waarom een hoger TS of Pareto-efficiëntie niet automatisch betekent dat de verdeling eerlijk is.',205,558,1335,180,40);
 notes(s,'101','Alle zes deelvragen zijn nu volledig beschikbaar, na de context en grafiek. Leerlingen hebben hun eigen werk erbij. Start pas hierna de stapsgewijze bespreking.','Welke aannames heb je naast de functies nodig bij e?','Verwar een voordeel voor twee nieuwe partijen niet met een volledige controle op alle betrokkenen.','Begin de bespreking bij de definitie.');
}
{
 const s=targetSlide('Opgave 6a: Pareto-efficiëntie');
 text(s,'Er is geen haalbare extra transactie of herverdeling\ndie iemand beter af maakt zonder iemand anders\nslechter af te maken.',60,240,1480,250,46,{bold:true,color:C.blue});
 text(s,'Dit geldt binnen de gegeven modelaannames.',60,572,1480,72,38);
 text(s,'Voor het tegendeel volstaat één concrete, haalbare Paretoverbetering.',60,722,1480,108,38,{bold:true,color:C.green});
 notes(s,'94, 101','Modelantwoord a. Efficiëntie is het ontbreken van een mogelijkheid. Bij e gaan we juist één mogelijke extra transactie aanwijzen die niemand schaadt. De term herverdeling moet in het antwoord blijven staan, naast extra transactie.','Hoe kun je bewijzen dat een situatie niet Pareto-efficiënt is?','Een maximaal totaal noemen is geen volledige definitie.','Bereken de twee gewenste hoeveelheden.');
}
{
 const s=targetSlide('Opgave 6b: hoeveelheden en toewijzing');
 text(s,'Vraag: 25 = 50 − 0,5Qv\n0,5Qv = 25; Qv = 50 kaartjes',60,218,1480,133,43,{bold:true,color:C.blue});
 text(s,'Aanbod: 25 = 5 + 0,25Qa\n0,25Qa = 20; Qa = 80 kaartjes',60,397,1480,133,43,{bold:true,color:C.green});
 rule(s,60,572,1480);
 text(s,'40 < 50 en 40 < 80. De boekingsgrens bindt: 40 transacties.',60,621,1480,90,38,{bold:true});
 text(s,'Kopers met de hoogste betalingsbereidheid kopen\nbij aanbieders met de laagste MK.',60,741,1480,98,36);
 notes(s,'100–101','Controleer de oplossingen door terug te rekenen: 50−0,5×50=25 en 5+0,25×80=25. De reserveringsregel beperkt tot 40, lager dan beide gewenste aantallen. Technische ruimte voor minstens 60 is voldoende voor 40 en voor de latere 41e transactie; de aanbodwens 80 is geen bewijs van 80 feitelijke transacties.','Welke Q gebruiken we als basis voor CS en PS?','Gebruik Qv of Qa niet als de werkelijk verhandelde hoeveelheid.','Bereken de twee hoogten bij Q=40.');
}
{
 const s=targetSlide('Opgave 6c: de hoogten bij 40 transacties');graph(s,T,'cap');
 text(s,'Betalingsbereidheid\n50 − 0,5 × 40\n= € 30 per kaartje',1050,274,490,164,35,{bold:true,color:C.blue});
 text(s,'Marginale kosten\n5 + 0,25 × 40\n= € 15 per kaartje',1050,492,490,163,35,{bold:true,color:C.green});
 text(s,'De prijs ligt ertussen:\n€ 15 < € 25 < € 30.',1050,718,490,99,33,{bold:true});
 notes(s,'100–101','Werkelijke Q40 is de rechterrand van beide gebieden. Daar is betalingsbereidheid 30 en MK15. De prijs 25 bepaalt de verdeling. De laatste koper heeft nog 5 voordeel; de laatste verkoper 10. Daarom geen simpele driehoeken.','Waar komen de horizontale hulplijnen voor de twee splitsingen?','De coördinaten zijn (Q;P), dus (40;30) en (40;15).','Bereken eerst het kopersgebied.');
}
{
 const s=targetSlide('Opgave 6c: consumentensurplus');graph(s,T,'cs');
 text(s,'Rechthoek\n40 × (30 − 25) = € 200',1050,269,490,126,33,{bold:true,color:C.blue});
 text(s,'Driehoek\n½ × 40 × (50 − 30)\n= € 400',1050,447,490,163,33,{bold:true,color:C.blue});
 text(s,'CS = 200 + 400\n= € 600',1050,676,490,141,40,{bold:true});
 notes(s,'101','De kopers met de hoogste betalingsbereidheid liggen vanaf nul tot 40 op V. De blauwe rechthoek geeft de minimale 5 euro voordeel voor alle 40; de driehoek de extra verschillen daarboven. Basis 40 kaartjes; hoogten 5 en 20 euro per kaartje. CS totaal in euro.','Waarom mag het gebied vanaf Q=0 worden gebruikt?','Zonder de gegeven toewijzing aan hoogste betalingsbereidheden zou dit standaardgebied niet gerechtvaardigd zijn.','Bereken PS onder de prijslijn.');
}
{
 const s=targetSlide('Opgave 6c: producentensurplus');graph(s,T,'ps');
 text(s,'Rechthoek\n40 × (25 − 15) = € 400',1050,269,490,126,33,{bold:true,color:C.green});
 text(s,'Driehoek\n½ × 40 × (15 − 5)\n= € 200',1050,447,490,163,33,{bold:true,color:C.green});
 text(s,'PS = 400 + 200\n= € 600',1050,676,490,141,40,{bold:true});
 notes(s,'101','De aanbieders met de laagste MK liggen links op A=MK. De rechthoek heeft basis40 en hoogte10; de driehoek ook basis40 en hoogte10. Het verschil in oppervlakten ontstaat door de factor ½. Het gebied onder MK zijn variabele kosten.','Waarom zijn de rechthoek en driehoek bij gelijke basis en hoogte niet even groot?','Gebruik niet de vrije prijs20; ontvangen prijs is25.','Tel de twee surplusbedragen en vergelijk de totalen.');
}
{
 const s=targetSlide('Opgave 6d: totaal surplus en welvaartsverlies');
 text(s,'TS = CS + PS',60,219,1480,76,48,{bold:true,color:C.blue});
 text(s,'TS = 600 + 600 = € 1.200',60,337,1480,91,51,{bold:true});
 rule(s,60,487,1480);
 text(s,'Welvaartsverlies = maximaal TS − werkelijk TS',60,545,1480,77,43,{bold:true,color:C.orange});
 text(s,'Welvaartsverlies = 1.350 − 1.200 = € 150',60,670,1480,93,49,{bold:true});
 text(s,'Dit voordeel ontvangt niemand, omdat voordelige handel uitblijft.',60,788,1480,47,32);
 notes(s,'100–101','Vrij TS1350 is gegeven. Bij de regel CS600 plus PS600 is1200. Het verschil150 is verloren totaal voordeel. Niet alle daling van CS is verlies: een deel verschuift naar producenten.','Waarom vergelijken we de totalen en niet alleen CS?','Surplus is in euro. Het verlies is niet euro per kaartje.','Controleer het bedrag met de juiste driehoek.');
}
{
 const s=targetSlide('Opgave 6d: de verliesdriehoek');graph(s,T,'loss');
 text(s,'Hoekpunten\n(40; 30), (60; 20), (40; 15)',1050,261,490,124,31,{bold:true,color:C.orange});
 text(s,'Basis: 60 − 40 = 20 kaartjes\nHoogte: 30 − 15\n= € 15 per kaartje',1050,422,490,162,32,{bold:true});
 text(s,'½ × 20 × 15 = € 150',1050,632,490,89,38,{bold:true,color:C.orange});
 text(s,'De hoogte is het verschil\ntussen betalingsbereidheid en MK.',1050,744,490,91,30);
 notes(s,'101','Het gearceerde oranje gebied ligt tussen Q40 en60, tussen V en A=MK. De gebruikte basis20 is de horizontale afstand; de bijbehorende hoogte15 is het verticale verschil bij Q40. Oppervlakte150 bevestigt de totaalsom. De prijs25−20 is nadrukkelijk niet de hoogte. Een hoekpunt ligt op het vrije evenwicht.','Wijs de horizontale basis en verticale hoogte aan.','Gebruik niet de prijsstijging5 of de hele prijs25 als hoogte.','Toets nu de 41e transactie.');
}
{
 const s=targetSlide('Opgave 6e: de mogelijke 41e transactie');
 table(s,[['Nieuwe koper','Nieuwe verkoper'],['Betalingsbereidheid: 50 − 0,5 × 41 = € 29,50','MK: 5 + 0,25 × 41 = € 15,25'],['Voordeel: 29,50 − 25 = € 4,50','Voordeel: 25 − 15,25 = € 9,75']],60,222,1480,290,[740,740],32);
 text(s,'Haalbaar: minstens 60 transacties mogelijk; verruiming kost niets.',60,563,1480,84,37,{bold:true,color:C.blue});
 text(s,'Niemand slechter af: prijs en bestaande transacties blijven gelijk.',60,671,1480,85,37);
 text(s,'Er is een Paretoverbetering. 40 transacties zijn niet Pareto-efficiënt.',60,783,1480,50,33,{bold:true,color:C.green});
 notes(s,'100–101','De extra koper wint4,50 en de verkoper9,75 bij dezelfde prijs25. Technische ruimte voor minstens60 omvat41. Kosteloze verruiming benadeelt niemand; de bestaande prijs en transacties blijven gelijk. Dat is één haalbare Paretoverbetering. De context modelleert geen gevolgen voor derden. De puntwaarden zijn bewijs voor wederzijds voordeel van die transactie; hun som14,25 is niet bedoeld als exact integraalverschil tussen40 en41.','Welke drie onderdelen maken samen dit bewijs?','Niet beweren dat de hele overstap naar Q60 en P20 noodzakelijk iedereen helpt.','Scheid efficiëntie van het oordeel over verdeling.');
}
{
 const s=targetSlide('Opgave 6f: efficiëntie en eerlijkheid');
 table(s,[['Uitkomst','CS','PS','TS'],['Vrij evenwicht','€ 900','€ 450','€ 1.350'],['Reserveringsregel','€ 600','€ 600','€ 1.200']],60,215,1480,270,[700,260,260,260],34);
 text(s,'Een groter TS zegt hoeveel voordeel er samen is.\nPareto-efficiëntie zegt of een verbetering zonder verliezers nog kan.',60,544,1480,133,38);
 text(s,'Geen van beide bepaalt wie welk voordeel hoort te krijgen.',60,705,1480,67,40,{bold:true,color:C.green});
 text(s,'Wat eerlijk is, vraagt een afzonderlijk waardeoordeel.',60,792,1480,43,32,{bold:true});
 notes(s,'94, 100–101','Modelantwoord f: TS en efficiëntie leveren geen norm voor de verdeling. De vrije markt heeft hoger TS, maar PS450 is lager dan600 onder de regel; de hele overgang is niet automatisch een Paretoverbetering. Een efficiënte uitkomst kan nog ongelijk verdeeld zijn. Laat leerlingen één ontbrekende stap verbeteren: toewijzing, rechthoek, eenheid, verliesgebied of volledig Pareto-bewijs.','Welke aanvullende norm heb je nodig om een verdeling eerlijk te noemen?','Een gelijk CS en PS bewijst evenmin eerlijkheid tussen personen.','Laat het huiswerk noteren; onvoltooide normale route gaat thuis of in een volgende les verder.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides,nativeTableSlides:tables,nativeChartSlides:charts},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft],{stdio:'inherit'});
execFileSync(PYTHON,[path.join(HERE,'presentation-233-chart-layout.py'),draft],{stdio:'inherit'});
const referencePath=path.resolve(HERE,'../../../../4veco-lessen',sourceManifest.sourceEditionPath,'bronnen/H1/paragrafen/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – presentatie.pptx');
const referenceSha256=createHash('sha256').update(await fs.readFile(referencePath)).digest('hex');
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.3.3 '+title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...new Set(tables)].flatMap(x=>typeof x==='number'?['--require-native-table-slide',String(x)]:[x]),fontPolicy:{basis:'reference',families:[FONT],referencePath,referenceSha256},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
