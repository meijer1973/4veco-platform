// HOW TO ADAPT: derive the exercise route and printed pages from the current book.
// Keep the authored example separate from assigned exercises; reuse overview().
// Runtime paths come from the installed Presentations skill, not this source.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('313');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',pale:'#EFF4F7',line:'#C6D2DB',muted:'#445B6B'};
const FONT='Arial', tables=[],charts=[],slides=[],overviews=[],graphSpecs=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/9b8304d5031cafac936a56281e144573a25fbbc9/edities/books34-v3/';
const E={name:'Fietscontroles',unit:'controles',d:32,b:.2,a:8,k:.1,s:6,q0:80,p0:16,q:100,pc:12,pp:18,xmax:160,ymax:36};
const T={name:'Cursusplaatsen',unit:'cursusplaatsen',d:26,b:.2,a:8,k:.1,s:3,q0:60,p0:14,q:70,pc:12,pp:15,xmax:140,ymax:30};
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,55),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,example=false){
 const s=p.slides.add();s.background.fill='#FFFFFF';text(s,title,60,42,1480,86,50,{bold:true});rule(s,60,146,1480);
 text(s,example?'Uitlegvoorbeeld — niet uit het boek':'§3.1.3 Subsidies',60,848,1400,30,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title,example});return s;
}
function notes(s,pages,explanation,question,pitfall,transition,example=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, geselecteerde v3-editie book34-lesson-balance-v3-20260915, gedrukte boekpagina ${pages}. ${source}books/book-3/output/Boek_3_Compleet_v3.pdf\nAntwoordmodel: ${source}books/book-3/chapters/3.1/Antwoorden.md#ans25\n${example?'Uitlegvoorbeeld — niet uit het boek. Fietscontroles en alle bijbehorende data zijn voor deze uitleg gemaakt. De boekverwijzing betreft uitsluitend de methode.':''}`);
}
function table(s,values,x=60,y=240,w=1480,h=390,widths=null,size=33){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths||Array(values[0].length).fill(w/values[0].length),values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:r%2?'#FFFFFF':C.pale;cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 25.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=slide('Deze les: §3.1.3 Subsidies');overviews.push(p.slides.items.length);text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Prijzen, hoeveelheid en uitgaven\nberekenen. Voordeel verdelen\nen welvaart beoordelen.',972,240,565,122,30,{name:'overview-goals'});rule(s,972,371,568);
 text(s,'Startopdracht',972,391,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 26 · Opgaven 19 en 20\nVerkennen met theorie:\n19: p. 23; 20: p. 24',972,445,565,115,30,{name:'overview-start'});rule(s,972,575,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§3.1.3 Subsidies\nBasis: 21, 22 en 22A\nZelfstandig: 23 en 24\nDoelopgave: 25\nMaken en nakijken',972,654,565,178,30,{name:'overview-homework'});
 notes(s,'23–30','Laat dit overzicht staan tijdens '+phase+'. Start 19–20 staat op boekpagina 26. Bij 19 is alleen de belastingwig voorkennis (§3.1.1, boek p. 6–9); de subsidiewig is nieuw. Laat de uitleg op p. 23 gebruiken, met Pp als kopersbetaling plus subsidie. Bij 20 is de regel U = s × Qsub nieuw; laat p. 24 lezen en alle gesubsidieerde verkopen aanwijzen. Dit is een ondersteunde verkenning. Keer na de instructie, vóór basiswerk, naar beide items terug en laat leerlingen hun aanpak verbeteren. Startantwoorden voor die nabespreking: 19 belasting Pp = 8, subsidie Pp = 14 euro per product; 20 U = 120 euro per week, omdat ook de 50 eerdere verkopen subsidie krijgen. Basis 21,22 p.27 en 22A p.28, zelfstandig 23–24 p.29, doel 25 p.30. Laat 22A zo nodig vóór 22c maken. Huiswerk is 21,22,22A,23,24,25 maken en nakijken. Bonus 26 en herhaling 27 zijn extra. Docenteninformatie reserveert voorlopig twee lessen van 55 minuten plus mogelijke uitloop; dit is geen bewezen tijdsfit.','Welke stap kun je al, en waar heb je de theorie nodig?','Nieuwe subsidiehandelingen zijn nog geen beheerste voorkennis. Gebruik complete boekpaginanummers; hoofdstukpaginanummers liggen vier lager.',active===7?'Laat het huiswerk in de agenda zetten.':'Ga verder zodra de klas klaar is voor de volgende fase.');
}
function rows(s,items,{y=240,gap=145,size=43}={}){items.forEach((r,i)=>text(s,r,60,y+i*gap,1480,gap-18,size,{bold:i===items.length-1,color:i===items.length-1?C.blue:C.ink}));}
function series(name,x,y,color,width=4,label=null){return {name,xValues:x.map(v=>Number(v.toFixed(9))),values:y.map(v=>Number(v.toFixed(9))),line:{fill:color,width},marker:{symbol:'none'},...(label?{dataLabelOverrides:[{idx:x.length-1,text:label,position:'right',showValue:false,textStyle:{typeface:FONT,fontSize:26,fill:color,bold:true}}]}:{})};}
function hatch(m,area){
 const x=[],y=[];let lo=0,hi=m.q;
 if(area==='W')lo=m.q0;
 for(let i=0;i<=65;i++){const q=lo+(hi-lo)*i/65;let bottom,top;
  if(area==='U'){bottom=m.pc;top=m.pp;}else if(area==='CS'){bottom=m.pc;top=m.d-m.b*q;}else if(area==='PS'){bottom=m.a+m.k*q;top=m.pp;}else{bottom=m.d-m.b*q;top=m.a+m.k*q;}
  x.push(q,q);y.push(i%2?top:bottom,i%2?bottom:top);
 }return series(area,x,y,area==='U'?'#DBC8B8':area==='W'?'#D89870':area==='CS'?'#B7D5E3':'#B5D4CA',1.2);
}
function graph(s,m,{shift=false,newPoint=false,oldPoint=false,area=null}={}){
 const ss=[];if(area)ss.push(hatch(m,area));
 ss.push(series('V',[0,m.d/m.b],[m.d,0],C.blue,4,'V'));
 ss.push(series('A',[0,m.xmax*.90],[m.a,m.a+m.k*m.xmax*.90],C.green,4,'A'));
 if(shift)ss.push(series('A − s',[0,m.xmax*.90],[m.a-m.s,m.a-m.s+m.k*m.xmax*.90],C.orange,4,'A − s'));
 // At a common buyer price, the subsidy increases quantity supplied. Use the
 // actual supply equations for an editable horizontal arrow and its head.
 if(shift&&!newPoint){const price=10,from=(price-m.a)/m.k,to=(price-m.a+m.s)/m.k;ss.push(series('Verschuiving bij dezelfde kopersprijs',[from,to],[price,price],C.muted,2.5));ss.push(series('Pijlpunt verschuiving',[to-4,to,to-4],[price+.4,price,price-.4],C.muted,2.5));}
 const point=(q,pr,name,color)=>{ss.push({...series(name,[q],[pr],color,0),marker:{symbol:'circle',size:9}});};
 if(oldPoint){ss.push(series('Oude hulplijnen',[0,m.q0,m.q0],[m.p0,m.p0,0],C.muted,1.3));point(m.q0,m.p0,'Vrij evenwicht',C.ink);}
 if(newPoint){ss.push(series('Pc hulplijn',[0,m.q,m.q],[m.pc,m.pc,0],C.muted,1.4));ss.push(series('Pp hulplijn',[0,m.q],[m.pp,m.pp],C.muted,1.4));ss.push(series('Subsidiewig',[m.q,m.q],[m.pc,m.pp],C.orange,5));point(m.q,m.pc,'Pc',C.blue);point(m.q,m.pp,'Pp',C.green);}
 if(area==='U')ss.push(series('U grens',[0,m.q,m.q,0,0],[m.pc,m.pc,m.pp,m.pp,m.pc],C.orange,2));
 if(area==='W')ss.push(series('W grens',[m.q0,m.q,m.q,m.q0],[m.p0,m.pc,m.pp,m.p0],C.orange,3));
 if(area&&area!=='W'){const q=m.q*.22,pr=area==='U'?(m.pc+m.pp)/2:area==='CS'?(m.d-m.b*q+m.pc)/2:(m.a+m.k*q+m.pp)/2;ss.push(series(area+' label',[q],[pr],C.ink,0,area));}
 if(newPoint){ss.push(series('Pp annotation',[m.q],[m.pp+3],C.green,0,'Pp = '+m.pp));ss.push(series('Pc annotation',[m.q+20],[m.pc],C.blue,0,'Pc = '+m.pc));}
 const ax={textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},numberFormatCode:'0'};
 const ch=s.charts.add('scatter',{position:{left:50,top:205,width:1070,height:608},series:ss,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,dataLabels:{showValue:false,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},xAxis:{...ax,min:0,max:m.xmax,majorUnit:20,title:{text:`Q (${m.unit} per week)`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}}},yAxis:{...ax,min:0,max:m.ymax,majorUnit:m===E?6:5,title:{text:`P (€ per ${m===E?'controle':'cursusplaats'})`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},majorGridlines:{fill:C.line,width:1}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphSpecs.push({slide:p.slides.items.length,model:m===E?'authored':'target',shift,newPoint,oldPoint,area,series:ss});return ch;
}
function aside(s,title,body,foot=''){text(s,title,1170,220,365,70,35,{bold:true,color:C.blue});text(s,body,1170,325,365,300,33);if(foot)text(s,foot,1170,658,365,145,31,{bold:true,color:C.orange});}
overview('Startopdracht',2);
{
 const s=slide('De subsidiewig');table(s,[['Per verkocht product','Belasting','Subsidie'],['Geldstroom','Verkoper draagt af','Overheid legt bij'],['Relatie tussen de prijzen','Pc − Pp = t','Pp − Pc = s'],['Ontvangst producent','Pp = Pc − t','Pp = Pc + s']],60,237,1480,380,[600,440,440],34);
 text(s,'Pp is de totale ontvangst vóór aftrek van productiekosten.',60,703,1480,80,39,{bold:true,color:C.blue});
 notes(s,'23','Haal de betekenis van Pc en Pp op uit §3.1.1. Pp is bij subsidie de kopersbetaling plus de overheidsbetaling. De subsidie keert de richting van de wig om. Laat beide vergelijkingen mondeling in woorden vertalen.','Welke prijs is hoger als de overheid geld bijlegt?','Pp is geen winst; productiekosten moeten er nog af.','Pas dit toe op een afzonderlijk uitlegvoorbeeld.');
}
{
 const s=slide('Fietscontroles',true);text(s,'Een fictieve markt voor een eenvoudige fietscontrole',60,190,1480,70,38,{bold:true,color:C.blue});
 table(s,[['Vraag','Pc = 32 − 0,20Q'],['Oorspronkelijk aanbod','Pp = 8 + 0,10Q'],['Subsidie per verkochte controle','s = € 6'],['Eenheden','Q per week; prijzen in € per controle']],60,292,1480,350,[680,800],34);
 text(s,'Geen baten voor buitenstaanders en geen uitvoeringskosten.',60,723,1480,72,37,{bold:true});
 notes(s,'23–26','Uitlegvoorbeeld — niet uit het boek. Alle data zijn voor deze les gemaakt. Veel kopers en aanbieders, één product en verder onveranderde omstandigheden. De oorspronkelijke aanbodlijn geeft marginale kosten. Veronderstel uitdrukkelijk geen externe baten, ook al kan een echte fietscontrole zulke baten hebben. Bereken alles opnieuw; dit is geen markt uit de opgaven.','Op welke prijs reageert de koper? En de aanbieder?','Een plausibel verhaal is geen bewijs voor externe baten in het gegeven model.','Begin met de situatie zonder subsidie.',true);
}
{
 const s=slide('Zonder subsidie: één evenwichtsprijs',true);graph(s,E,{oldPoint:true});aside(s,'V = A','32 − 0,20Q\n= 8 + 0,10Q\n\n24 = 0,30Q\nQ₀ = 80\nP₀ = € 16','80 controles\nper week');
 notes(s,'23–26','Herhaal de eerder onderwezen evenwichtsmethode (§3.1.1, boek p.9). 32−0,20Q = 8+0,10Q geeft Q=80. Invullen in beide functies geeft 16. De hulplijnen horen bij (80;16).','Hoe controleer je of de prijs bij beide kanten past?','Het snijpunt is één hoeveelheid en één prijs, niet twee hoeveelheden.','Zet het aanbod om naar de prijs van de koper.',true);
}
{
 const s=slide('Het aanbod in kopersprijzen',true);rows(s,['Pp = 8 + 0,10Q','Pc = Pp − s','Pc = (8 + 0,10Q) − 6 = 2 + 0,10Q']);
 text(s,'Dezelfde gewenste ontvangst, € 6 minder van de koper.',60,736,1480,75,38,{bold:true,color:C.orange});
 notes(s,'24','De oorspronkelijke aanbodlijn blijft de benodigde totale ontvangst aangeven. Trek bij elke Q zes euro af om de benodigde kopersprijs te krijgen. Kosten en betalingsbereidheid veranderen niet. Deze verandering van representatie is de kern van de procedure.','Waarom trekken we de subsidie van Pp af?','De vraaglijn schuift niet. De oorspronkelijke aanbodlijn als kostenlijn verandert evenmin.','Teken de nieuwe lijn naast het oorspronkelijke aanbod.',true);
}
{
 const s=slide('A − s ligt € 6 onder A',true);graph(s,E,{shift:true});aside(s,'Twee aanbodlijnen','A: Pp = 8 + 0,10Q\n\nA − s:\nPc = 2 + 0,10Q','V blijft gelijk');
 notes(s,'24','Construeer twee punten van A−s: bij Q=0 is Pc=2, bij Q=100 is Pc=12. De helling blijft 0,10. De horizontale pijl vergelijkt bij dezelfde kopersprijs van € 10: op A zijn dat 20 controles en op A−s 80 controles. Dit is een andere vergelijking dan de verticale subsidiewig bij dezelfde Q. Vergelijk bij dezelfde hoeveelheid met A: steeds zes euro lager. Het snijpunt van V met A−s gaat de nieuwe verkoop bepalen.','Waar begint A − s op de prijsas?','Lees Pp straks op de oorspronkelijke A af, niet op A − s.','Bereken eerst de nieuwe hoeveelheid.',true);
}
{
 const s=slide('De nieuwe hoeveelheid en beide prijzen',true);rows(s,['32 − 0,20Q = 2 + 0,10Q','30 = 0,30Q       Qsub = 100 controles per week','Pc = 32 − 0,20 × 100 = € 12','Pp = 8 + 0,10 × 100 = € 18'],{y:225,gap:126,size:41});
 text(s,'Controle: Pp − Pc = 18 − 12 = € 6 per controle',60,763,1480,64,36,{bold:true,color:C.orange});
 notes(s,'26','Vraag gelijkstellen aan aanbod in kopersprijzen. Los de vergelijking op, vul Qsub in de oorspronkelijke vraag- en aanbodfuncties in en controleer de wig. Je kunt Pp ook via Pc+s controleren.','Waarom vullen we in beide functies dezelfde 100 in?','Trek niet de hele subsidie van de oude evenwichtsprijs af. Vraag en aanbod bepalen samen beide nieuwe prijzen.','Lees de uitkomst in de grafiek.',true);
}
{
 const s=slide('Twee prijzen bij dezelfde hoeveelheid',true);graph(s,E,{shift:true,newPoint:true});aside(s,'Qsub = 100','Op V: Pc = € 12\n\nOp A: Pp = € 18\n\nWig: € 6','Pp is inclusief\nde subsidie');
 notes(s,'24, 26','Wijs het snijpunt van V en A−s aan. Ga bij Q=100 omhoog naar A om Pp=18 af te lezen. De oranje verticale afstand is zes euro. De grijze hulplijnen projecteren dezelfde coördinaten op de assen.','Welke lijn gebruik je voor de totale ontvangst van de aanbieder?','A−s geeft de kopersprijs weer, niet de ontvangst inclusief subsidie.','Vergelijk beide prijzen met de oude prijs.',true);
}
{
 const s=slide('De verdeling van het voordeel',true);table(s,[['Per controle','Vergelijking met P₀ = € 16','Voordeel'],['Koper','€ 16 − € 12','€ 4'],['Aanbieder','€ 18 − € 16','€ 2']],60,248,1480,335,[450,630,400],35);
 text(s,'€ 4 + € 2 = € 6 subsidie per verkochte controle',60,667,1480,73,43,{bold:true,color:C.blue});
 notes(s,'26','De aanbieder krijgt de subsidie uitbetaald, maar verkoopt voor een lagere kopersprijs. Daardoor komt vier euro bij de koper terecht en twee euro bij de aanbieder. Deze bedragen per verkoop zijn niet hetzelfde als de totale veranderingen van CS en PS.','Waarom houdt de aanbieder niet zelf het hele subsidievoordeel?','Uitbetaling en voordeelverdeling zijn verschillende begrippen.','Bereken wat de overheid voor alle verkopen betaalt.',true);
}
{
 const s=slide('De overheid betaalt voor alle 100 controles',true);graph(s,E,{shift:true,newPoint:true,area:'U'});aside(s,'Uitgaven U','U = s × Qsub\n\nU = 6 × 100\n\nU = € 600\nper week','Rechthoek:\nbreedte 100\nhoogte € 6');
 notes(s,'24–26','De gearceerde rechthoek loopt van Q=0 tot Q=100, tussen Pc=12 en Pp=18. Ook de 80 controles die eerder al plaatsvonden krijgen subsidie: 80×6=480. De 20 extra controles kosten 120 subsidie. Samen 600.','Waarom is 6 × 20 niet de volledige rekening?','Overheidsuitgaven zijn geen synoniem voor welvaartsverlies.','Bereken eerst het voordeel voor consumenten.',true);
}
{
 const s=slide('Consumentensurplus na subsidie',true);graph(s,E,{newPoint:true,area:'CS'});aside(s,'CS','½ × basis × hoogte\n\n½ × 100 × (32 − 12)\n\n= € 1.000 per week','Boven Pc,\nonder V');
 notes(s,'25–26','Herhaal de driehoeksformule uit §3.1.2, boek p.15–18. De basis is de verkochte hoeveelheid 100. De hoogte is het prijsintercept van V minus Pc: 32−12=20 euro. De gekleurde driehoek is dus 1000 euro per week.','Waarom gebruikt CS de prijs van twaalf euro?','Gebruik voor CS niet de totale ontvangst Pp.','Bereken vervolgens PS met de prijs voor producenten.',true);
}
{
 const s=slide('Producentensurplus na subsidie',true);graph(s,E,{newPoint:true,area:'PS'});aside(s,'PS','½ × basis × hoogte\n\n½ × 100 × (18 − 8)\n\n= € 500 per week','Onder Pp,\nboven A');
 notes(s,'25–26','PS omvat de totale ontvangst inclusief subsidie min de variabele kosten. De basis is 100 en de hoogte is 18−8=10 euro. Gebruik de oorspronkelijke aanbodlijn als marginalekostenlijn. Het gebied kan in dezelfde tekening deels met CS overlappen doordat de overheid bijlegt; tel daarom de overheidsrekening apart mee.','Welk prijsintercept begrenst de hoogte van PS?','PS is niet automatisch winst: vaste kosten zijn niet van dit gebied afgetrokken.','Vergelijk nu de hele rekening met de oude situatie.',true);
}
{
 const s=slide('De volledige welvaartsrekening',true);table(s,[['€ per week','Zonder subsidie','Met subsidie'],['CS','½ × 80 × (32 − 16) = 640','1.000'],['PS','½ × 80 × (16 − 8) = 320','500'],['Overheidsuitgaven U','0','600'],['CS + PS − U','960','900']],60,215,1480,437,[400,620,460],31);
 text(s,'CS en PS stijgen samen € 540. De overheid betaalt € 600.',60,694,1480,65,37,{bold:true,color:C.blue});text(s,'Welvaartsverlies: € 960 − € 900 = € 60 per week',60,769,1480,60,37,{bold:true,color:C.orange});
 notes(s,'25–26','Bereken oud CS en PS expliciet en vergelijk met nieuw. Nieuw CS+PS is 1500, maar de subsidie-uitgaven van 600 zitten al in die voordelen. Trek U af. De stijging van CS is 360 en die van PS 180, samen 540. De overheid betaalt zestig meer.','Welke fout ontstaat als je alleen CS en PS optelt?','De subsidie-uitgaven zelf zijn geen verloren welvaart. Dubbele telling geeft een onjuiste conclusie.','Leg uit waarom juist de extra transacties verlies veroorzaken.',true);
}
{
 const s=slide('Extra handel kan voordeel kosten',true);graph(s,E,{newPoint:true,area:'W',oldPoint:true});aside(s,'Welvaartsverlies W','½ × (100 − 80) × 6\n= € 60 per week\n\nBij Q = 90:\nwaarde € 14\nkosten € 17','Geen externe baten\nin dit model');
 notes(s,'25–26','W is de driehoek tussen A en V van Q0=80 tot Qsub=100. De basis is twintig, de hoogte zes. Bij Q=90 is de betalingsbereidheid 32−0,2×90=14, terwijl de marginale kosten 8+0,1×90=17 zijn. Die extra controle kost dus drie euro meer dan de koper eraan toekent. Zonder externe baten wordt dat nadeel niet gecompenseerd.','Waarom is de uitgavenrechthoek groter dan de verliesdriehoek?','Meer productie is binnen deze aannamen geen automatische welvaartswinst. Buiten dit model kunnen extra baten ertoe doen.','Laat leerlingen de rekeningen kort zelf onderscheiden.',true);
}
{
 const s=slide('Korte controle',true);rows(s,['Welke hoeveelheid gebruik je bij U: 20 of 100?','Welke prijs gebruik je voor CS? En voor PS?','Waarom zijn € 600 uitgaven en € 60 verlies verschillend?'],{y:250,gap:170,size:40});
 notes(s,'24–26','Laat leerlingen eerst in stilte een antwoord formuleren. U gebruikt 100, want alle verkochte controles krijgen subsidie. CS gebruikt 12, PS 18. U is een overdracht van 600; de gezamenlijke voordelen stijgen slechts 540, dus het verschil is 60. Herhaal bij twijfel de bijbehorende grafiek voordat je zelfstandig laat oefenen.','Welke grootheid hoort bij elke rekening?','Een juiste formule zonder betekenis van basis en hoogte is nog kwetsbaar.','Keer terug naar start 19–20 en laat leerlingen hun eerdere aanpak verbeteren.',true);
}
overview('Oefenen',4);
{
 const s=slide('Opgave 25 · Cursusplaatsen');text(s,'Boekpagina 30 · Gegevens',60,187,1480,55,35,{bold:true,color:C.blue});
 rows(s,['Vraag Pc = 26 − 0,20Q; aanbod Pp = 8 + 0,10Q','Q is cursusplaatsen per week.','Eerst: Q₀ = 60, P₀ = € 14, CS = € 360 en PS = € 180 per week.'],{y:270,gap:111,size:36});
 text(s,'Aanbieders ontvangen € 3 subsidie per werkelijk verkochte plaats.\nEr zijn geen baten voor buitenstaanders en geen uitvoeringskosten.',60,630,1480,158,38);
 notes(s,'30','Dit is de volledige context van de werkelijke doeloefening 25. Sluit het fictieve fietsvoorbeeld af: dit is een nieuwe markt met andere functies, eenheden en subsidie. Lees alle brongegevens en aannamen. Toon hierna alle deelvragen en de basisgrafiek vóór de eerste uitwerking.','Welke gegevens zijn anders dan bij de fietscontroles?','Gebruik geen eerder berekende uitkomst zonder opnieuw de bron te lezen.','Lees deelvragen a tot en met c.');
}
{
 const s=slide('Opgave 25 · Vragen a–c');rows(s,['a. Stel het aanbod in kopersprijzen mét subsidie op.\n    Bereken Qsub, Pc en Pp.','b. Bereken de overheidsuitgaven per week.','c. Bereken het voordeel per plaats voor kopers en aanbieders.\n    Leg uit waarom uitbetaling aan aanbieders niet betekent\n    dat zij het hele voordeel krijgen.'],{y:218,gap:190,size:36});
 notes(s,'30','Dit zijn de onopgeloste deelvragen a–c uit het boek. Laat de leerlingen hun eigen aanpak of ontbrekende stap herkennen zonder de uitwerking al te onthullen. De volledige context staat op de vorige dia.','Welke berekening heb je nodig voordat je de uitgaven kunt bepalen?','Uitbetaling is nog geen voordeelverdeling.','Toon ook d en e vóór de antwoorden.');
}
{
 const s=slide('Opgave 25 · Vragen d–e');rows(s,['d. Bereken CS en PS na subsidie. Bepaal CS + PS − U en het\n    welvaartsverlies ten opzichte van de oude situatie.','e. Markeer Qsub, Pc en Pp in de basisgrafiek.\n    Arceer de rechthoek van de overheidsuitgaven.\n    Beoordeel: “De subsidie verhoogt in dit model automatisch\n    de welvaart.”'],{y:245,gap:240,size:36});
 notes(s,'30','Dit zijn de volledige deelvragen d–e. Bij e hoort zowel de getekende markering en arcering als het economische oordeel. Er is nog geen antwoord onthuld.','Welke modelaanname is nodig voor het oordeel?','Een grafiek alleen beantwoordt de welvaartsclaim nog niet.','Toon de basisgrafiek uit de opgave.');
}
{
 const s=slide('Opgave 25 · Basisgrafiek');graph(s,T);aside(s,'Gegeven lijnen','V: Pc = 26 − 0,20Q\n\nA: Pp = 8 + 0,10Q','Q in cursusplaatsen\nper week');
 notes(s,'30','Bewerkbare reproductie van de basisgrafiek bij de doelopgave: dezelfde V en A, intercepten en eenheden. De hoeveelheid-as loopt iets verder door tot 140 voor labelruimte; V stopt bij 130 waar P=0. Er zijn geen antwoorden of nieuwe subsidielijn toegevoegd. Alle vragen zijn nu beschikbaar.','Waar zou je beginnen met tekenen?','Verander de oorspronkelijke vraag- en aanbodfuncties niet.','Bespreek nu stap voor stap de antwoorden.');
}
{
 const s=slide('25a · Nieuw aanbod en nieuwe hoeveelheid');rows(s,['Pc = Pp − 3 = 5 + 0,10Q','26 − 0,20Q = 5 + 0,10Q','21 = 0,30Q','Qsub = 70 cursusplaatsen per week'],{y:220,gap:140,size:43});
 notes(s,'30','Substitueer Pp=8+0,10Q in Pc=Pp−3. Stel daarna de vraag gelijk aan dit aanbod in kopersprijzen. Breng constanten en Q-termen samen: 21=0,30Q, dus 70.','Waarom gebruiken beide zijden van de vergelijking Pc?','Gelijkstellen van de oude V en A levert het oude evenwicht.','Vul 70 in om beide nieuwe prijzen te vinden.');
}
{
 const s=slide('25a · Beide prijzen en de controle');rows(s,['Pc = 26 − 0,20 × 70 = € 12','Pp = 8 + 0,10 × 70 = € 15','Pp − Pc = 15 − 12 = € 3 per cursusplaats'],{y:260,gap:160,size:44});
 notes(s,'30','Gebruik voor Pc de vraag en voor Pp het oorspronkelijke aanbod. De wig is gelijk aan de subsidie. Het aanbod in kopersprijzen geeft eveneens 5+0,10×70=12.','Welke alternatieve berekening controleert Pp?','Vijftien euro is inclusief de subsidie, geen winst.','Bereken de overheidsuitgaven.');
}
{
 const s=slide('25b · De overheidsuitgaven');rows(s,['U = s × Qsub','U = € 3 per plaats × 70 plaatsen per week','U = € 210 per week'],{y:250,gap:155,size:44});
 text(s,'De subsidie geldt voor alle 70 verkochte cursusplaatsen.',60,757,1480,68,38,{bold:true,color:C.orange});
 notes(s,'30','Neem de volledige verkochte hoeveelheid 70. De zestig bestaande verkopen krijgen 180 subsidie en de tien extra verkopen 30. Samen 210 euro per week.','Welke verkopen ontbreken als je alleen 3 × 10 rekent?','De tien extra cursusplaatsen zijn niet de breedte van de uitgavenrechthoek.','Vergelijk beide prijzen met de oude prijs van veertien euro.');
}
{
 const s=slide('25c · Wie krijgt het voordeel?');table(s,[['Per cursusplaats','Berekening','Voordeel'],['Koper','P₀ − Pc = 14 − 12','€ 2'],['Aanbieder','Pp − P₀ = 15 − 14','€ 1']],60,241,1480,340,[470,610,400],36);
 text(s,'De lagere kopersprijs geeft ook de koper een deel van het voordeel.',60,657,1480,122,40,{bold:true,color:C.blue});
 notes(s,'30','De aanbieder ontvangt de overheidsbetaling van drie euro, maar ontvangt twee euro minder van de koper dan vóór de subsidie. Zijn totale ontvangst stijgt daarom maar één euro. De koper bespaart twee euro. Controle 2+1=3.','Hoe kan de koper profiteren zonder geld van de overheid te ontvangen?','Verwar de betaling van drie euro niet met het voordeel van de aanbieder.','Bereken de surplusgebieden.');
}
{
 const s=slide('25d · CS en PS na subsidie');text(s,'Basis: 70 cursusplaatsen per week',60,195,1480,65,38,{bold:true,color:C.blue});
 table(s,[['Gebied','Berekening','€ per week'],['CS','½ × 70 × (26 − 12)','490'],['PS','½ × 70 × (15 − 8)','245']],60,305,1480,323,[350,750,380],37);
 text(s,'CS gebruikt Pc. PS gebruikt Pp en de oorspronkelijke aanbodlijn.',60,707,1480,93,37,{bold:true});
 notes(s,'30','Bij CS is de hoogte 26−12=14, bij PS 15−8=7. Beide hebben basis 70. Laat basis, hoogte, berekening en euro per week in het leerlingantwoord controleren.','Waarom zijn de twee driehoeken niet even groot?','Een hoogte is een prijsverschil, niet alleen de nieuwe prijs.','Neem ook de overheidsuitgaven mee.');
}
{
 const s=slide('25d · De welvaartsmaat en het verlies');rows(s,['Oud: CS + PS = 360 + 180 = € 540','Nieuw: CS + PS − U = 490 + 245 − 210 = € 525','W = 540 − 525 = € 15 per week'],{y:235,gap:153,size:40});
 text(s,'Controle: ½ × (70 − 60) × 3 = € 15 per week',60,747,1480,69,38,{bold:true,color:C.orange});
 notes(s,'30','Oude welvaartsmaat 540, nieuwe 525. CS stijgt 130, PS 65, samen 195. De overheid betaalt 210. Het verschil is 15 welvaartsverlies. De driehoekcontrole gebruikt tien extra plaatsen en drie euro hoogte.','Hoe verklaar je dat kopers en aanbieders profiteren terwijl de maat daalt?','CS+PS=735 is niet de volledige nieuwe welvaartsmaat.','Markeer de uitkomst en de begrotingsrekening in de grafiek.');
}
{
 const s=slide('25e · Prijzen, hoeveelheid en uitgaven');graph(s,T,{shift:true,newPoint:true,area:'U'});aside(s,'Markeringen','Qsub = 70\nPc = € 12\nPp = € 15\n\nU: 70 × € 3\n= € 210 per week','Rechthoek:\nQ = 0 tot 70\nP = 12 tot 15');
 notes(s,'30','De vraag snijdt A−s bij (70;12). Lees bij Q=70 op A de producentenontvangst 15. De gearceerde rechthoek omvat alle 70 verkopen tussen beide prijzen. Laat leerlingen eerst hun eigen figuur vergelijken voordat zij verbeteren.','Liggen beide gemarkeerde prijzen bij dezelfde hoeveelheid?','Arceer niet alleen de strook van Q=60 tot Q=70 als uitgaven.','Beoordeel de claim met berekening en aanname.');
}
{
 const s=slide('25e · De welvaartsclaim');text(s,'“De subsidie verhoogt in dit model automatisch de welvaart.”',60,221,1480,135,43);
 rows(s,['Onjuist: de welvaartsmaat daalt van € 540 naar € 525 per week.','De extra transacties kosten meer dan hun betalingsbereidheid.','Er zijn geen baten voor buitenstaanders die dat compenseren.'],{y:417,gap:125,size:37});
 notes(s,'30','Beantwoord de claim volledig: oordeel, berekend bewijs en economische reden onder de bronaanname. Het verlies is vijftien per week. Deze conclusie geldt hier zonder externe baten en zonder uitvoeringskosten; zij is geen universeel oordeel over iedere werkelijke subsidie. Laat leerlingen één ontbrekende stap, eenheid of argument aanvullen.','Welke zin in de bron begrenst deze conclusie?','Een hoger CS en PS bewijzen samen nog geen welvaartswinst.','Sluit af met het gezamenlijke overzicht en het huiswerk.');
}
overview('Afsluiting / huiswerk',7);
// Executable graph checks: intersections, units, domain endpoints and every shaded vertex.
for(const m of [E,T]){
 const near=(a,b)=>{if(Math.abs(a-b)>1e-8)throw new Error(`Geometry mismatch ${a} != ${b}`);};
 near((m.d-m.a)/(m.b+m.k),m.q0);near((m.d-m.a+m.s)/(m.b+m.k),m.q);near(m.d-m.b*m.q,m.pc);near(m.a+m.k*m.q,m.pp);near(m.pp-m.pc,m.s);
 const old=.5*m.q0*(m.d-m.a),cs=.5*m.q*(m.d-m.pc),ps=.5*m.q*(m.pp-m.a),u=m.s*m.q;near(old-(cs+ps-u),.5*(m.q-m.q0)*m.s);
 for(const area of ['CS','PS','U','W']){const h=hatch(m,area);for(let i=0;i<h.xValues.length;i++){const q=h.xValues[i],v=h.values[i];if(q<0||q>m.q||v<0||v>m.ymax)throw new Error('Shading outside domain');}}
}
await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts,models:{authored:E,target:T},graphSpecs},null,2));
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const draft=BUILD+'/candidate.pptx';await (await PresentationFile.exportPptx(p)).save(draft);execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[fileURLToPath(new URL('./presentation-313-chart-style.py',import.meta.url)),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/3.1.3 Subsidies – presentatie.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layout:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
