// HOW TO ADAPT: derive sources, assignment, teaching example and target together.
// The economic regions below use native XY series in model coordinates.
// Set runtime paths through the installed presentation skill; use a fresh workspace.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,PLATFORM,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('421');
const spec=JSON.parse(await fs.readFile(new URL('./presentation-421.manifest.json',import.meta.url),'utf8'));
const lessonRoot=path.resolve(PLATFORM,'../4veco-lessen');
for(const f of spec.sources){const actual=createHash('sha256').update(await fs.readFile(path.join(lessonRoot,f.path))).digest('hex');if(actual!==f.sha256)throw Error('Source changed: '+f.path);}
const source=`https://github.com/meijer1973/4veco-lessen/blob/${spec.lessonCommit}/edities/books34-v3/books/book-4/`;
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',red:'#A3302A',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],graphs=[],overviews=[];
const E={id:'Keramiekoven',a:96,b:1,c:24,d:1,tck:144,cap:60,qm:24,pm:72,qe:36,pe:60,xmax:60,ymax:100,xtick:12,ytick:20,unit:'bakbeurten per week',price:'€ per bakbeurt'};
const T={id:'VR-studio',a:80,b:.5,c:20,d:.5,tck:200,cap:100,qm:40,pm:60,qe:60,pe:50,xmax:100,ymax:80,xtick:20,ytick:10,unit:'sessies per week',price:'€ per sessie'};
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,64),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§4.2.1 Welvaartseffecten van monopolie',size=50){
 const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,80,size,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4 v3, gedrukte pagina ${page} van het complete leerlingenboek. ${source}output/Boek_4_Compleet_v3.pdf\nManuscript: ${source}chapters/4.2/4.2.1%20manuscript.md\nAntwoordmodel: ${source}chapters/4.2/Antwoorden.md#antwoord7\n${authored?'Uitlegvoorbeeld — niet uit het boek. De context keramiekoven, functies en gegevens zijn voor deze les gemaakt. De boekverwijzing onderbouwt alleen de werkwijze.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek · Keramiekoven',60,177,1480,44,28,{bold:true,color:C.blue});}
function target(s){text(s,'Opgave 7 · De VR-studio · Boekpagina 61',60,177,1480,44,28,{bold:true,color:C.blue});}
function side(s,heading,body,bottom='',color=C.blue){text(s,heading,1088,250,452,70,35,{bold:true,color});text(s,body,1088,345,452,320,33);if(bottom)text(s,bottom,1088,694,452,135,32,{bold:true,color});}
function pointSeries(name,points,color,width=3,labels=[]){return {name,xValues:points.map(a=>Number(a[0].toFixed(8))),values:points.map(a=>Number(a[1].toFixed(8))),line:{fill:color,width},marker:{symbol:'none'},dataLabelOverrides:labels.map(({idx,text:label,position='r'})=>({idx,text:label,position,showValue:false,showSeriesName:false,textStyle:{typeface:FONT,fontSize:26,fill:color,bold:true}}))};}
function regionSeries(name,vertices,color,direction='vertical',spacing=1.5){
 const out=[pointSeries(name+' boundary',[...vertices,vertices[0]],color,2.3)];const axis=direction==='vertical'?0:1,other=1-axis;
 const lo=Math.min(...vertices.map(v=>v[axis])),hi=Math.max(...vertices.map(v=>v[axis]));
 for(let v=lo+spacing;v<hi-1e-7;v+=spacing){const cross=[];for(let i=0;i<vertices.length;i++){const a=vertices[i],b=vertices[(i+1)%vertices.length];if((a[axis]<=v&&b[axis]>v)||(b[axis]<=v&&a[axis]>v))cross.push(a[other]+(b[other]-a[other])*(v-a[axis])/(b[axis]-a[axis]));}
 if(cross.length===2){const ends=cross.sort((a,b)=>a-b).map(z=>axis===0?[v,z]:[z,v]);out.push(pointSeries(name+' hatch',ends,color,1.2));}}return out;
}
function graph(s,m,{mode='both',areas=[],mo=true,wide=false,splitPS=false}={}){
 const mk=m.c+m.d*m.qm;
 const regions={CS:[[0,m.pm],[m.qm,m.pm],[0,m.a]],PS:[[0,m.c],[m.qm,mk],[m.qm,m.pm],[0,m.pm]],CSe:[[0,m.pe],[m.qe,m.pe],[0,m.a]],PSe:[[0,m.c],[m.qe,m.pe],[0,m.pe]],O:[[0,m.pe],[m.qm,m.pe],[m.qm,m.pm],[0,m.pm]],W:[[m.qm,mk],[m.qe,m.pe],[m.qm,m.pm]]};
 const colors={CS:'#85B8D6',PS:'#68B39A',CSe:'#85B8D6',PSe:'#68B39A',O:'#C48D28',W:'#C8554B'};
 let series=[];for(const r of areas)series.push(...regionSeries(r,regions[r],colors[r],r==='W'?'horizontal':'vertical',r==='W'?1.3:m.xmax/48));
 const label=(name,x,y,color=C.ink)=>series.push({...pointSeries(name,[[x,y]],color,0,[{idx:0,text:name,position:'ctr'}]),line:{fill:'none',width:0}});
 const guide=(name,pts)=>series.push(pointSeries(name,pts,C.muted,1.3));
 if(mode!=='base'){
  guide('Qm',[[m.qm,0],[m.qm,m.pm]]);
  if(mode!=='quantity'){guide('Pm',[[0,m.pm],[m.qm,m.pm]]);label('M',m.qm+m.xmax*.015,m.pm+m.ymax*.065);}
  if(mode==='quantity'){guide('MK at Qm',[[0,mk],[m.qm,mk]]);}
 }
 if(mode==='both'){guide('Qe',[[m.qe,0],[m.qe,m.pe]]);guide('Pe',[[0,m.pe],[m.qe,m.pe]]);label('E',m.qe+m.xmax*.035,m.pe+m.ymax*.12);}
 if(splitPS)guide('PS split',[[0,mk],[m.qm,mk]]);
 const qd=Math.min(m.xmax,m.a/m.b),qk=Math.min(m.xmax,(m.ymax-m.c)/m.d),qmo=Math.min(m.xmax,m.a/(2*m.b));
 series.push(pointSeries('Vraag = GO',[[0,m.a],[qd,m.a-m.b*qd]],C.blue,4));
 series.push(pointSeries('MK',[[0,m.c],[qk,m.c+m.d*qk]],C.orange,4));
 label('Vraag = GO',m.xmax*.78,m.a-m.b*m.xmax*.78-m.ymax*.18,C.blue);
 label('MK',m.xmax*.89,m.c+m.d*m.xmax*.89+m.ymax*.075,C.orange);
 if(mo)series.push({...pointSeries('MO',[[0,m.a],[qmo,m.a-2*m.b*qmo]],C.purple,3),line:{fill:C.purple,width:3,style:'dashed'}});
 if(mo)label('MO',m.xmax*.31,m.a-2*m.b*(m.xmax*.31)+m.ymax*.05,C.purple);
 if(mode!=='base'&&mode!=='quantity')series.push({...pointSeries('M point',[[m.qm,m.pm]],C.ink,0),marker:{symbol:'circle',size:7}});
 if(mode==='both')series.push({...pointSeries('E point',[[m.qe,m.pe]],C.ink,0),marker:{symbol:'circle',size:7}});
 if(areas.includes('CS'))label('CS',m.qm*.3,m.pm+(m.a-m.pm)*.26,C.blue);
 if(areas.includes('PS'))label('PS',m.qm*.34,m.c+(m.pm-m.c)*.57,C.green);
 if(areas.includes('CSe'))label('CS',m.qe*.28,m.pe+(m.a-m.pe)*.28,C.blue);
 if(areas.includes('PSe'))label('PS',m.qe*.28,m.c+(m.pe-m.c)*.7,C.green);
 if(areas.includes('O'))label('A',m.qm*.42,(m.pe+m.pm)/2,C.orange);
 if(areas.includes('W'))label('B',m.qm+(m.qe-m.qm)*.22,(m.pm+mk)/2,C.red);
 const cfg={position:{left:60,top:245,width:wide?1480:995,height:560},series,scatterOptions:{style:'line'},hasLegend:false,xAxis:{min:0,max:m.xmax,majorUnit:m.xtick,numberFormatCode:'0',title:{text:`Q (${m.unit})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.4},majorGridlines:null},yAxis:{min:0,max:m.ymax,majorUnit:m.ytick,numberFormatCode:'0',title:{text:`P, MO, MK (${m.price})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.4}},chartFill:C.paper,plotAreaFill:C.paper};
 const ch=s.charts.add('scatter',cfg);applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,market:m,mode,areas,regions:Object.fromEntries(areas.map(a=>[a,regions[a]])),series});
}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 7.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=slide('Deze les: §4.2.1 Welvaartseffecten van monopolie',undefined,44);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,40,30,{bold:true,color:C.blue,name:'phase'});text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Monopolie en efficiënt vergelijken.\nCS, PS, TS en winst berekenen.\nOverdracht en verlies scheiden.',972,244,565,125,30,{name:'overview-goals'});rule(s,972,380,568);
 text(s,'Startopdracht',972,402,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 59 · Opgaven 1 en 2\n2: verkennen, theorie p. 55–57',972,458,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,597,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§4.2.1 · Maken en nakijken\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7',972,654,565,170,30,{bold:active===7,name:'overview-homework'});
 notes(s,'55–61',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 1–2 en basis 3 staan op p. 59, basis 4 en zelfstandig 5–6 op p. 60, doel 7 op p. 61. Huiswerk is 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9 zijn extra. Opgave 1 haalt de monopolieprocedure uit §4.1.4, p. 36–40, terug. In opgave 2 is overdracht versus verdwenen surplus de nieuwe bewerking: laat leerlingen de definities op p. 55 en de uitleg op p. 57 raadplegen, onzekerheden noteren en dit als verkenning proberen. Vóór het basiswerk keren leerlingen na de uitleg terug naar opgave 2. Bespreek dan: ΔTS = −120 + 80 = −40 euro per week. Niet het hele verlies van kopers verdwijnt. Start 1: MO = 30 − Q, MK = 10, Qm = 20, Pm = 20, winst = 160 euro per dag. Gebruik deze antwoorden pas als feedback na de poging. De docentengids reserveert voorlopig twee lessen van 55 minuten voor deze volledige route; dat is geen gemeten tijdsfit. Rond de route zo nodig later af.`,active===2?'Welke uitleg helpt je bij opgave 2?':'Welke stap of redenering moet je nog afmaken?','Het hoofdstuk noemt p. 7 en 9; het complete boek heeft hier gedrukte pagina 59 en 61.',active===7?'Zet opgaven 3–7 maken en nakijken in de agenda.':'Volg de volgende lesfase en bied steun waar nodig.');return s;
}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const r=[['Uitkomsten vergelijken','Qm via MO = MK; Qe via P = MK.'],['Voordeel berekenen','CS, PS, TS en winst bij dezelfde markt.'],['Veranderingen verklaren','Overdracht, gemiste transacties en verdeling.']];
 r.forEach((a,i)=>{let y=220+i*180;text(s,a[0],60,y,600,70,40,{bold:true,color:C.blue});text(s,a[1],720,y,820,105,38);rule(s,60,y+127,1480);});
 text(s,'Dezelfde vraag, kosten en kwaliteit. Geen externe effecten.',60,780,1480,55,32,{bold:true});
 notes(s,'55–58','We vergelijken het gezamenlijke voordeel van kopers en aanbieder. Daarvoor houden we vraag, kosten, kwaliteit en constante kosten gelijk. De surplusberekening gebruikt betalingsbereidheid in euro en geeft geen volledig oordeel over welzijn of rechtvaardigheid. Bij één monopolist is de ondernemingsafzet q gelijk aan markthoeveelheid Q.','Kan meer winst samengaan met minder gezamenlijk voordeel?','Winst, producentensurplus en totaal surplus zijn drie verschillende grootheden.','Haal eerst de betekenissen van de surplusbedragen terug.');
}
{
 const s=slide('Surplus en winst');
 const r=[['CS','Betalingsbereidheid boven de betaalde prijs.'],['PS','Opbrengst boven de variabele kosten.'],['TS = CS + PS','Voordeel van kopers en aanbieder samen.'],['Winst = PS − TCK','Constante kosten moeten er nog af.']];
 r.forEach((a,i)=>{let y=225+i*140;text(s,a[0],60,y,575,64,42,{bold:true,color:i===3?C.orange:C.blue});text(s,a[1],670,y,860,90,36);if(i<3)rule(s,60,y+98,1480);});
 notes(s,'55','CS telt het voordeel van kopers op. PS = TO − TVK: in de grafiek de ruimte tussen prijs en MK tot de verkochte hoeveelheid. TS telt beide op. Winst trekt ook de constante kosten af. Omdat TCK gelijk blijft, is een verandering in TS gelijk aan de verandering van het gezamenlijke voordeel na aftrek van TCK. Oppervlakte: hoeveelheid per week maal euro per eenheid geeft euro per week.','Waarom is PS groter dan winst als er constante kosten zijn?','PS is geen omzet: variabele kosten zijn er al af.','Gebruik deze begrippen in een eigen voorbeeld.');
}
{
 const s=slide('Eén aanbieder van ovenruimte');example(s);
 text(s,'Eén keramiekatelier verhuurt bakbeurten tegen één prijs.',60,250,1480,70,38,{bold:true});
 table(s,[['Gegeven','Betekenis'],['P = 96 − Q','P in euro per bakbeurt'],['TK = 144 + 24Q + 0,5Q²','TK in euro per week'],['0 ≤ Q ≤ 60','Q in bakbeurten per week']],60,354,1480,330,[750,730],34);
 text(s,'Dezelfde vraag en kosten. TCK = € 144. Geen externe effecten.',60,745,1480,82,34);
 notes(s,'55–58','Dit is een eigen uitlegvoorbeeld. De capaciteit is 60 bakbeurten per week. De constante kosten van 144 euro zijn deze week onvermijdbaar en in beide situaties gelijk. Alle bakbeurten worden binnen één situatie tegen dezelfde prijs verkocht. De functies zijn doorlopende benaderingen; de uitkomsten zijn hier hele aantallen.','Wat is constant als we straks twee uitkomsten vergelijken?','We vergelijken geen andere technologie of kwaliteit.','Bepaal eerst de winstmaximale hoeveelheid.',true);
}
{
 const s=slide('De monopolist kiest eerst de hoeveelheid');example(s);graph(s,E,{mode:'quantity'});
 side(s,'MO = MK','TO = 96Q − Q²\nMO = 96 − 2Q\nMK = 24 + Q\n\n96 − 2Q = 24 + Q\n72 = 3Q\nQm = 24','24 past binnen\nde capaciteit van 60.');
 notes(s,'56; voorkennis p. 36–40','TO = P × Q, de afgeleide is MO = 96 − 2Q. De afgeleide van TK is MK = 24 + Q. Bij Q = 24 zijn MO en MK beide 48 euro per bakbeurt. MO is vóór 24 groter dan MK en erna kleiner: de winst stijgt eerst en daalt daarna. Controleer 0 ≤ 24 ≤ 60.','Welke grootheid vind je met MO = MK?','48 euro bij het snijpunt is nog niet de verkoopprijs.','Lees bij Q = 24 de prijs op de vraaglijn.',true);
}
{
 const s=slide('De prijs hoort bij de vraaglijn');example(s);graph(s,E,{mode:'monopoly'});
 side(s,'Pm = 96 − Qm','Pm = 96 − 24\nPm = € 72\nper bakbeurt\n\nM = (24, 72)','Bij MO = MK staat\n€ 48, geen € 72.');
 notes(s,'56; voorkennis p. 37','Ga bij Q = 24 omhoog naar de vraaglijn. Daar ligt M. Een prijs van 72 euro verkoopt volgens de vraagfunctie 24 bakbeurten. De extra opbrengst op de marginale bakbeurt ligt lager dan de prijs omdat de prijsverlaging ook eerdere verkopen raakt.','Waarom lezen we de prijs niet bij MO = MK?','Gebruik nooit MO als betalingsbereidheid van de koper.','Vergelijk dit met de hoeveelheid die het gezamenlijke surplus maximaliseert.',true);
}
{
 const s=slide('Efficiënt: de laatste transactie levert nog voordeel');example(s);graph(s,E,{mode:'both'});
 side(s,'P = MK','96 − Q = 24 + Q\n72 = 2Q\nQe = 36\nPe = 96 − 36 = € 60','Tussen 24 en 36:\nP > MK.');
 notes(s,'56','Bij een extra bakbeurt meet de vraaglijn de betalingsbereidheid. Zolang die hoger is dan MK, voegt een transactie gezamenlijk voordeel toe. Dat gaat door tot Q = 36. Boven 36 zijn MK hoger dan de betalingsbereidheid. E = (36,60); 36 past binnen de capaciteit. De efficiënte uitkomst is een maatstaf bij dezelfde vraag, kosten en kwaliteit, geen algemene voorspelling over iedere concurrerende markt.','Waarom kunnen kopers en aanbieder samen profiteren van extra transacties tussen 24 en 36?','De maatschappelijke vergelijking gebruikt P, niet MO.','Bereken eerst het kopersvoordeel bij monopolie.',true);
}
{
 const s=slide('Consumentensurplus bij monopolie');example(s);graph(s,E,{mode:'monopoly',areas:['CS'],mo:false});
 side(s,'CS: boven Pm','Basis = 24\nHoogte = 96 − 72\n\nCS = ½ × 24 × 24\nCS = € 288 per week','Alleen de 24 verkochte\nbakbeurten tellen.');
 notes(s,'55, 57–58','Arceer tussen de vraaglijn en de horizontale prijs 72, van Q = 0 tot Q = 24. De basis is 24 bakbeurten per week, hoogte 24 euro per bakbeurt. De driehoek meet voordeel boven wat kopers werkelijk betalen.','Wat stellen basis en hoogte economisch voor?','De volledige driehoek onder de vraaglijn is geen CS.','Bereken nu het voordeel van de aanbieder.',true);
}
{
 const s=slide('Producentensurplus bij monopolie');example(s);graph(s,E,{mode:'monopoly',areas:['PS'],mo:false,splitPS:true});
 side(s,'PS: boven MK','MK(24) = 48\n\nRechthoek:\n24 × (72 − 48) = 576\nDriehoek:\n½ × 24 × (48 − 24) = 288','PS = 576 + 288\n= € 864 per week',C.green);
 notes(s,'55, 57–58','PS ligt tussen P = 72 en MK tot Q = 24. Splits het trapezium bij MK(24) = 48. De bovenste rechthoek geeft 576 euro en de onderste driehoek 288 euro. De variabele kosten zijn de ruimte onder MK en horen niet bij PS.','Waarom is dit gebied een rechthoek plus een driehoek?','Gebruik bij de onderste hoek MK(0) = 24, niet nul.','Trek voor winst ook de constante kosten af.',true);
}
{
 const s=slide('Van producentensurplus naar winst');example(s);
 text(s,'Winst = PS − TCK = 864 − 144 = € 720 per week',60,266,1480,100,45,{bold:true,color:C.green});
 table(s,[['Controle via totalen','€ per week'],['TO = 72 × 24','1.728'],['TVK = 24 × 24 + 0,5 × 24²','864'],['TK = 144 + 864','1.008'],['Winst = 1.728 − 1.008','720']],60,404,1480,345,[1090,390],33);
 notes(s,'55, 58','Trek 144 af van PS. Controleer langs TO − TK. Dezelfde winst volgt: 720 euro per week. De winstmaximale hoeveelheid verandert niet door deze onvermijdbare constante kosten; de hoogte van de winst wel.','Waar zit de 144 euro als je TO − TK gebruikt?','Trek TCK precies één keer af. PS is 864, winst 720.','Bereken de surplussen bij de efficiënte hoeveelheid.',true);
}
{
 const s=slide('Surplus bij de efficiënte hoeveelheid');example(s);graph(s,E,{mode:'both',areas:['CSe','PSe'],mo:false});
 side(s,'Qe = 36, Pe = € 60','CS = ½ × 36 × (96 − 60)\n= € 648 per week\n\nPS = ½ × 36 × (60 − 24)\n= € 648 per week','TS = 648 + 648\n= € 1.296 per week',C.green);
 notes(s,'57–58','Bij E sluiten vraag en MK aan. CS en PS zijn hier driehoeken, omdat de MK-lijn bij Qe de prijs bereikt. De gelijke bedragen komen door de gegeven hellingen en zijn geen algemene regel. De labels M en E maken duidelijk dat dezelfde markt wordt vergeleken.','Waarom heeft PS nu geen bovenste rechthoek?','Een efficiënte uitkomst hoeft CS en PS niet gelijk te verdelen.','Zet beide uitkomsten naast elkaar.',true);
}
{
 const s=slide('Meer winst, minder totaal surplus');example(s);
 table(s,[['€ per week','Monopolie','Efficiënt'],['CS','288','648'],['PS','864','648'],['TS = CS + PS','1.152','1.296'],['Winst = PS − 144','720','504']],60,272,1480,402,[660,410,410],35);
 text(s,'Het gezamenlijke voordeel daalt met 1.296 − 1.152 = € 144.',60,732,1480,92,38,{bold:true,color:C.red});
 notes(s,'57–58','Vergelijk vanuit de efficiënte uitkomst naar monopolie. De aanbieder wint 216 euro PS en winst, maar kopers verliezen 360 euro CS. Per saldo verdwijnt 144 euro gezamenlijk surplus. Constante kosten blijven gelijk.','Kan één partij winnen terwijl het totaal daalt?','Een hoger PS is geen bewijs voor een hoger TS.','Scheid eerst het bedrag dat alleen van ontvanger wisselt.',true);
}
{
 const s=slide('Overdracht op blijvende verkopen');example(s);graph(s,E,{areas:['O'],mo:false});
 side(s,'A: geld verschuift','24 bakbeurten blijven.\nDe prijs stijgt met\n72 − 60 = € 12.\n\nA = 24 × 12\n= € 288 per week','Alleen A:\nCS −288; PS +288\nTS verandert niet.',C.orange);
 notes(s,'57–58','De rechthoek A gaat van Q = 0 tot 24 en van P = 60 tot 72. Dat is het extra bedrag op de blijvende verkopen. Kopers betalen wat de aanbieder ontvangt. Binnen CS + PS valt deze overdracht weg. Dit is één deel van de totale verandering.','Wie ontvangt de 288 euro die kopers extra betalen?','De totale stijging van PS is niet 288: ook producentenvoordeel op gemiste verkopen verdwijnt.','Kijk vervolgens naar de bakbeurten die niet meer plaatsvinden.',true);
}
{
 const s=slide('Welvaartsverlies door gemiste transacties');example(s);graph(s,E,{areas:['W'],mo:false});
 side(s,'B: voordeel verdwijnt','Basis = 36 − 24 = 12\nHoogte = 72 − 48 = 24\n\nB = ½ × 12 × 24\n= € 144 per week','Controle:\n1.296 − 1.152 = 144',C.red);
 notes(s,'57–58','De verliesdriehoek is begrensd door vraag, MK en Qm. De hoogte is Pm − MK(Qm), niet Pm − Pe. Tussen 24 en 36 was de betalingsbereidheid groter dan de extra kosten, maar de monopolist verkoopt die bakbeurten niet. Dit verdwenen voordeel is geen betaling aan iemand.','Waarom gebruikt de hoogte 48 en niet 60?','Gebruik geen MO-lijn als ondergrens van welvaartsverlies.','Tel overdracht en gemiste voordelen per partij bij elkaar.',true);
}
{
 const s=slide('Twee effecten in één verandering');example(s);
 table(s,[['Van efficiënt naar monopolie','ΔCS','ΔPS','ΔTS'],['A: overdracht','−288','+288','0'],['Gemiste transacties','−72','−72','−144'],['Totale verandering','−360','+216','−144']],60,283,1480,350,[730,250,250,250],33);
 text(s,'Alle bedragen in euro per week. De ontvanger van A blijft in het totaal.',60,713,1480,92,36,{bold:true});
 notes(s,'57–58','Elke helft van de verliesdriehoek is hier 72 euro: ½ × 12 × 12. Boven Pe verdwijnt kopersvoordeel; onder Pe verdwijnt producentenvoordeel. CS: −288 − 72 = −360. PS: +288 − 72 = +216. TS: −144. De gelijke helften zijn specifiek voor dit model. Dit ondersteunt later de veranderingen in opgave 5, zonder die toegewezen opgave uit te werken.','Waarom groeit PS met minder dan de overdracht?','Alleen een saldo bekijken verbergt de twee verschillende mechanismen.','Controleer het onderscheid met één uitspraak.',true);
}
{
 const s=slide('Korte controle');example(s);
 text(s,'“Het verlies aan CS is helemaal welvaartsverlies.”',60,283,1480,150,51,{bold:true,color:C.blue});
 text(s,'Gebruik de € 288 overdracht en de € 144 verloren surplus\nin je uitleg.',60,514,1480,145,39);
 text(s,'Welke informatie zegt iets over verdeling en eerlijkheid?',60,726,1480,86,36,{bold:true});
 notes(s,'55, 57–58','Laat eerst leerlingen antwoorden. CS daalt 360, PS stijgt 216; TS daalt 144 euro. De 288 overdracht verschuift voordeel, terwijl 72 kopersvoordeel en 72 producentenvoordeel verdwijnen. De berekening geeft geen norm voor eerlijkheid en dekt niet alle welzijn. Laat leerlingen dit verwoorden zonder nieuwe boekopgaven toe te voegen.','Is iedere euro die kopers verliezen ook voor de hele groep verdwenen?','Verwar een verdelingsoordeel niet met de berekening van TS.','Keer terug naar startopgave 2 met de nieuwe kennis, dan basis 3–4.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 7 · De enige VR-studio');target(s);
 text(s,'Eén studio bedient de hele beschreven markt.',60,252,1480,60,39,{bold:true});
 table(s,[['Vraag en kosten','Eenheden en capaciteit'],['P = 80 − 0,5Q','P: euro per sessie'],['TK = 200 + 20Q + 0,25Q²','Q: sessies per week'],['MK = 20 + 0,5Q','Capaciteit: 100 sessies']],60,355,1480,315,[860,620],34);
 text(s,'De € 200 constante kosten blijven deze week in beide situaties gelijk.\nVergelijk met dezelfde vraag en kosten bij de efficiënte hoeveelheid.\nGeen externe effecten of andere veranderingen.',60,711,1480,121,31);
 notes(s,'61','Lees de volledige bron. Alle gegevens op deze dia komen uit de echte doeloefening. De basisgrafiek en alle deelvragen volgen zonder antwoorden. Houd boekpagina 61 open tijdens de bespreking.','Welke aannamen houden de twee situaties vergelijkbaar?','De bron gebruikt één hele markt; Q telt alle sessies.','Bekijk de gegeven lijnen voordat je vragen a–e bespreekt.');
}
{
 const s=slide('Opgave 7 · De gegeven basisgrafiek');target(s);graph(s,T,{mode:'base',wide:true});
 notes(s,'61','Dit is de basisgrafiek uit de opgave, opnieuw als bewerkbare XY-grafiek met dezelfde functies en het domein 0–100. Vraag = GO, MO en MK zijn gegeven, zonder uitkomstmarkeringen of arcering. MO eindigt bij Q = 80 waar MO nul is; het negatieve vervolg is buiten het getoonde prijsbereik. De volgende dia’s geven alle deelvragen voordat oplossingen verschijnen.','Welke lijn gebruik je voor de hoeveelheid, en welke voor de prijs?','De basisgrafiek bevat nog geen antwoordpunten.','Lees de vragen a en b.');
}
{
 const s=slide('Opgave 7 · Vragen a en b');target(s);
 text(s,'Gebruik de bron en de basisgrafiek. De lijnen zijn al gegeven.',60,264,1480,80,37,{bold:true});
 text(s,'a. (3p) Bereken Qm en Pm, en daarna Qe en Pe.',60,391,1480,106,41);
 text(s,'b. (3p) Markeer beide uitkomsten en arceer CS en PS bij monopolie.\nBereken die bedragen en de winst.',60,563,1480,173,41);
 notes(s,'61','Deze tekst volgt de echte vragen a en b. Toon nog geen oplossing. De context blijft via het boek en de twee voorgaande dia’s beschikbaar. Laat leerlingen hun berekeningen en arcering klaarleggen.','Welke berekening moet voorafgaan aan je arcering?','Bij b wordt naast PS ook winst gevraagd.','Lees ook c, d en e voordat de antwoorden verschijnen.');
}
{
 const s=slide('Opgave 7 · Vragen c, d en e');target(s);
 text(s,'c. (3p) Bereken TS in beide situaties en het welvaartsverlies.\nBenoem basis en hoogte van de verliesdriehoek.',60,271,1480,138,37);
 text(s,'d. (2p) Bereken de overdracht op de blijvende sessies.\nLeg uit waarom die niet zelf het welvaartsverlies is.',60,459,1480,138,37);
 text(s,'e. (2p) Beoordeel: “Meer producentensurplus betekent dat deze\nuitkomst voor de samenleving beter én eerlijker is.”',60,648,1480,140,37);
 notes(s,'61','Nu zijn context, basisgrafiek en alle vijf deelvragen zonder oplossingen beschikbaar geweest. Geef ruimte om antwoorden te vergelijken en onzekere stappen aan te wijzen. Begin pas daarna de stapsgewijze bespreking.','Welke twee verschillende oordelen zitten in de uitspraak bij e?','Een goede berekening vervangt de gevraagde uitleg niet.','Begin de uitwerking bij de keuze van de monopolist.');
}
{
 const s=slide('7a · De monopolie-uitkomst');target(s);graph(s,T,{mode:'monopoly'});
 side(s,'MO = MK','TO = 80Q − 0,5Q²\nMO = 80 − Q\n\n80 − Q = 20 + 0,5Q\n60 = 1,5Q\nQm = 40','Pm = 80 − 0,5 × 40\n= € 60 per sessie');
 notes(s,'61','De afgeleide van TO is MO = 80 − Q. MO = MK geeft 40 sessies per week. MO daalt en MK stijgt, dus vóór 40 kan de winst stijgen en erna daalt ze. 40 ≤ 100. Lees Pm = 60 van de vraaglijn, niet de 40 euro bij MO = MK.','Welk punt is de combinatie die kopers werkelijk zien?','MO = MK is hier 40 euro, niet de prijs.','Bepaal de efficiënte vergelijking bij dezelfde vraag en kosten.');
}
{
 const s=slide('7a · De efficiënte uitkomst');target(s);graph(s,T,{mode:'both'});
 side(s,'P = MK','80 − 0,5Q = 20 + 0,5Q\n60 = Q\nQe = 60\n\nPe = 80 − 0,5 × 60\n= € 50 per sessie','40 en 60 sessies\npassen binnen 100.',C.green);
 notes(s,'61','Bij de laatste gezamenlijk voordelige sessie is betalingsbereidheid gelijk aan MK. Qe = 60 en Pe = 50. Markeer E op de vraag- en MK-lijn. Houd het verschil met M zichtbaar: monopolie verkoopt 20 sessies minder en vraagt 10 euro meer.','Waarom gebruiken we nu P in plaats van MO?','Verander de kostenfunctie niet bij de vergelijking.','Arceer het CS bij de feitelijke monopolieverkopen.');
}
{
 const s=slide('7b · Het consumentensurplus');target(s);graph(s,T,{areas:['CS'],mo:false});
 side(s,'CSm','Basis = 40 sessies\nHoogte = 80 − 60\n= € 20 per sessie\n\nCSm = ½ × 40 × 20','CSm = € 400 per week');
 notes(s,'61','CS ligt onder de vraaglijn en boven P = 60 tot Q = 40. Beide uitkomsten zijn gemarkeerd, maar de arcering gaat alleen over het monopolie. Benoem de eenheden van basis en hoogte.','Tot welke hoeveelheid mag je arceren?','Gebruik niet Qe = 60 als basis van CSm.','Arceer en bereken nu PS.');
}
{
 const s=slide('7b · Het producentensurplus');target(s);graph(s,T,{areas:['PS'],mo:false,splitPS:true});
 side(s,'MK(40) = € 40','Rechthoek:\n40 × (60 − 40) = 800\n\nDriehoek:\n½ × 40 × (40 − 20)\n= 400','PSm = 800 + 400\n= € 1.200 per week',C.green);
 notes(s,'61','Arceer tussen prijs 60 en MK tot Q = 40. De bovenste rechthoek is 800 euro, de onderste driehoek 400 euro. Samen 1200. De oppervlakte onder MK vertegenwoordigt variabele kosten en hoort niet bij PS.','Welke ondergrens heeft de driehoek bij Q = 0?','PS is hier een trapezium, geen enkele driehoek onder de prijs.','Bereken uit PS de gevraagde winst.');
}
{
 const s=slide('7b · De winst');target(s);
 text(s,'Winst = PS − TCK = 1.200 − 200 = € 1.000 per week',60,280,1480,96,43,{bold:true,color:C.green});
 table(s,[['Controle met TO − TK','€ per week'],['TO = 60 × 40','2.400'],['TK = 200 + 20 × 40 + 0,25 × 40²','1.400'],['Winst = 2.400 − 1.400','1.000']],60,451,1480,296,[1120,360],33);
 notes(s,'61','PS minus de onvermijdbare constante kosten levert winst 1000 euro per week. Controle via de totale kosten: 200 + 800 + 400 = 1400. TO = 2400. Het verschil is weer 1000.','Welke kosten moeten er nog af als je begint met PS?','Trek niet ook opnieuw TVK van PS af.','Vergelijk nu het totale surplus in beide situaties.');
}
{
 const s=slide('7c · Het totale surplus in beide situaties');target(s);
 table(s,[['€ per week','Monopolie','Efficiënt'],['CS','400','½ × 60 × (80 − 50) = 900'],['PS','1.200','½ × 60 × (50 − 20) = 900'],['TS = CS + PS','1.600','1.800']],60,290,1480,363,[440,340,700],33);
 text(s,'Welvaartsverlies = TSe − TSm = 1.800 − 1.600 = € 200 per week',60,725,1480,94,37,{bold:true,color:C.red});
 notes(s,'61','Bereken CS en PS bij E met Q = 60 en P = 50. Beide driehoeken zijn 900 euro. Het totale surplus bij monopolie is 1600, efficiënt 1800. TCK blijft gelijk, dus het verschil in gezamenlijk voordeel na constante kosten is ook 200.','Welke prijzen en hoeveelheden horen bij de rechterkolom?','Trek TCK niet af bij de definitie TS = CS + PS.','Controleer het bedrag met de verliesdriehoek.');
}
{
 const s=slide('7c · De verliesdriehoek');target(s);graph(s,T,{areas:['W'],mo:false});
 side(s,'B: verloren surplus','Basis = Qe − Qm\n= 60 − 40 = 20 sessies\n\nHoogte = Pm − MK(40)\n= 60 − 40 = € 20','½ × 20 × 20\n= € 200 per week',C.red);
 notes(s,'61','De driehoek wordt begrensd door vraag, MK en de verticale lijn bij 40. De basis is 20 sessies per week. De hoogte is 20 euro per sessie. Welvaartsverlies is 200 euro per week. Van Q 40 tot 60 was betalingsbereidheid hoger dan MK, maar die sessies vinden niet plaats.','Waarom is de hoogte niet 60 − 50?','Het prijsverschil tussen M en E hoort bij de overdracht, niet bij de volle hoogte van B.','Scheid daarvan de rechthoek van de overdracht.');
}
{
 const s=slide('7d · De overdracht');target(s);graph(s,T,{areas:['O','W'],mo:false});
 side(s,'A: blijvende sessies','A = Qm × (Pm − Pe)\n= 40 × (60 − 50)\n= € 400 per week\n\nKopers −400\nAanbieder +400','A blijft in CS + PS.\nB = € 200 verdwijnt.',C.orange);
 notes(s,'61','De 40 blijvende sessies worden 10 euro duurder. Die 400 euro gaat van kopers naar de aanbieder en is geen verdwenen surplus. Verloren sessies kosten daarnaast kopers 100 en de aanbieder 100 euro surplus. Daardoor daalt CS 500, stijgt PS 300 en daalt TS 200.','Waar is A gebleven als je CS en PS optelt?','PS stijgt niet met de hele overdracht: 100 producentenvoordeel op gemiste sessies vervalt.','Beoordeel nu de uitspraak over beter en eerlijker.');
}
{
 const s=slide('7e · Meer PS is geen volledig welvaartsoordeel');target(s);
 table(s,[['Van efficiënt naar monopolie','€ per week'],['PS: 900 naar 1.200','+300'],['CS: 900 naar 400','−500'],['TS: 1.800 naar 1.600','−200']],60,283,1480,321,[1070,410],35);
 text(s,'Beter? Het totale surplus daalt in deze vergelijking.',60,656,1480,66,39,{bold:true,color:C.red});
 text(s,'Eerlijker? De berekening bevat geen norm voor eerlijkheid.',60,750,1480,74,37,{bold:true});
 notes(s,'61','De uitspraak is onjuist. De aanbieder ontvangt meer PS, maar het verlies bij kopers is groter. TS daalt 200 euro per week. Een oordeel over eerlijkheid vraagt een afzonderlijk verdelingsoordeel; de surplusberekening geeft daarvoor geen norm en omvat niet alle aspecten van welzijn. Laat leerlingen de combinatie van cijferbewijs en redenering in hun eigen antwoord verbeteren.','Welke cijfers weerleggen het eerste deel, en wat ontbreekt voor het tweede deel?','Stel een verandering in verdeling niet gelijk aan een objectief oordeel over rechtvaardigheid.','Rond af met huiswerk en één verbeterpunt in het eigen werk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviews,tables,charts,graphs,source:spec},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.2.1 Welvaartseffecten van monopolie – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
