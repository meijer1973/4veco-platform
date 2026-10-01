// HOW TO ADAPT: paragraph-specific classroom deck. Change source/manifest and
// teaching sequence together; reuse the platform runtime, then render in PowerPoint.
// The example is authored teaching data; exercise 7 is the complete v3 book target.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('311');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E8449',orange:'#A94D16',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial';
const title='Belastingen: wig en nieuw evenwicht';
const stem='3.1.1 Belastingen – wig en nieuw evenwicht – presentatie';
const source='https://github.com/meijer1973/4veco-lessen/blob/9b8304d5031cafac936a56281e144573a25fbbc9/edities/books34-v3/books/book-3/';
const tables=[],charts=[],slides=[],overviewSlides=[];
const example={context:'Houten puzzels',unit:'puzzel',quantity:'puzzels per week',v:26,b:.2,a:2,d:.1,t:6,maxQ:140,maxP:30};
const target={context:'Bedrukte tassen',unit:'tas',quantity:'tassen per dag',v:20,b:.2,a:2,d:.1,t:3,maxQ:100,maxP:22};
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(heading,{exampleSlide=false,targetSlide=false,smallTitle=false}={}){
 const s=p.slides.add();s.background.fill='#FFFFFF';
 text(s,heading,60,42,1480,86,smallTitle?43:52,{bold:true});rule(s,60,146,1480);
 const footer=exampleSlide?'Uitlegvoorbeeld — niet uit het boek':targetSlide?'§3.1.1 · Opgave 7 · Boekpagina 12':'§3.1.1 Belastingen: wig en nieuw evenwicht';
 text(s,footer,60,848,1400,30,21,{color:C.muted,name:'footer'});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title:heading,role:exampleSlide?'authored-example':targetSlide?'book-target':'lesson'});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{exampleNote=false}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, actuele v3-uitgave, revisies t/m 28 september 2026; gedrukte boekpagina ${page}. ${source}output/Boek_3_Compleet_v3.pdf\nAntwoorden: ${source}chapters/3.1/Antwoorden.md#ans7\nDocent: ${source}chapters/3.1/Docenteninformatie.md\n${exampleNote?'Uitlegvoorbeeld — niet uit het boek. Context houten puzzels en alle getallen zijn voor deze les geschreven. Alleen de methode is ontleend aan boekpagina 6–9.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 values.forEach((r,i)=>{t.rows[i].height=h/values.length;r.forEach((v,j)=>{const c=t.getCell(i,j);c.fill=i===0?C.ink:(i%2?'#FFFFFF':C.pale);c.text.style={typeface:FONT,fontSize:size,color:i===0?'#FFFFFF':C.ink,bold:i===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};});});
 tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 7.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §3.1.1 '+title,{smallTitle:true});overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Evenwicht en beide prijzen berekenen;\nde wig tekenen; afdragen en\nde last dragen onderscheiden.',972,244,565,122,30,{name:'overview-goals'});
 rule(s,972,374,568);text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 9 · Opgaven 1 en 2\n2: verkennen, theorie p. 6–9',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.1.1 Belastingen\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'6–12',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 1–2: boekpagina 9; basis 3–4: p. 10; zelfstandig 5–6: p. 11; doel 7: p. 12. Huiswerk: 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9 zijn extra. Opgave 1 haalt een vergelijking oplossen en invullen terug; vraag welke stappen leerlingen gebruiken. Opgave 2 verkent nieuwe stof: laat eerst de begrippen Pc en Pp en de belastingwig op p. 6 lezen en de vergelijking met de oude prijs op p. 9. Laat leerlingen bij 2b benoemen welke informatie ontbreekt; geef het antwoord niet vooraf. Keer na de uitleg vóór zelfstandig oefenen terug naar opgave 2 en laat de redenering verbeteren. De docentenhandleiding adviseert voorlopig twee lessen van 55 minuten; dat is niet gemeten. Gebruik de fasegrens flexibel, behoud de volledige oefenroute.`,active===2?'Welke bekende rekenstap helpt bij opgave 1?':'Welke stap of uitleg wil je nog verbeteren?','De hoofdstukpagina’s 5 en 8 zijn in het volledige boek pagina 9 en 12. Gebruik de gedrukte boekvoet.',active===7?'Noteer het huiswerk. §3.1.2 bouwt verder op de twee prijzen en de nieuwe hoeveelheid.':'Ga verder wanneer de klas aan de volgende fase toe is.');
 return s;
}
function lines(s,rows,{y=238,gap=115,size=45}={}){rows.forEach((r,i)=>text(s,r,60,y+i*gap,1480,95,size,{bold:i===rows.length-1,color:i===rows.length-1?C.blue:C.ink}));}
function en(s,explanation,question,pitfall,transition){notes(s,'6–9',explanation,question,pitfall,transition,{exampleNote:true});}
function tn(s,explanation,question,pitfall,transition){notes(s,'12',explanation,question,pitfall,transition);}

// Each graph has numeric XY coordinates, fixed axes and literal workbook data.
// Direct curve labels are attached to the native chart's endpoint after export.
function graph(s,m,stage,{left=60,top=219,width=1040,height=570}={}){
 // These models have exact integer solutions; normalize IEEE-754 residue only.
 const exact=n=>Math.round(n*1e10)/1e10;
 const q0=exact((m.v-m.a)/(m.b+m.d)), p0=exact(m.a+m.d*q0), qt=exact((m.v-m.a-m.t)/(m.b+m.d)), pc=exact(m.v-m.b*qt), pp=exact(m.a+m.d*qt);
 const curve=(name,x,y,color)=>({name,xValues:x.map(exact),values:y.map(exact),line:{fill:color,width:4},marker:{symbol:'none'}});
 const qv=Math.min(m.maxQ,m.v/m.b), qa=Math.min(m.maxQ,(m.maxP-m.a)/m.d), qat=Math.min(m.maxQ,(m.maxP-m.a-m.t)/m.d);
 const series=[curve('V',[0,qv],[m.v,Math.max(0,m.v-m.b*qv)],C.blue),curve('A',[0,qa],[m.a,m.a+m.d*qa],C.green)];
 if(stage>=2)series.push(curve('A + t',[0,qat],[m.a+m.t,m.a+m.t+m.d*qat],C.orange));
 if(stage===1){series.push(curve('Hulplijn P₀',[0,q0],[p0,p0],C.line),curve('Hulplijn Q₀',[q0,q0],[0,p0],C.line));}
 if(stage>=3){series.push(curve('Hulplijn Pc',[0,qt],[pc,pc],C.line),curve('Hulplijn Pp',[0,qt],[pp,pp],C.line),curve('Hulplijn Qt',[qt,qt],[0,pc],C.line),curve('Belastingwig',[qt,qt],[pp,pc],C.orange));}
 const ch=s.charts.add('scatter',{position:{left,top,width,height},series,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:m.maxQ,majorUnit:20,numberFormatCode:'0',title:{text:'Q ('+m.quantity+')',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:m.maxP,majorUnit:5,numberFormatCode:'0',title:{text:'P (€ per '+m.unit+')',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push({slide:p.slides.items.length,model:m,stage,series:series.map(({name,xValues,values})=>({name,xValues,values})),solution:{q0,p0,qt,pc,pp}});
 return {q0,p0,qt,pc,pp};
}

overview('Startopdracht',2);
{
 const s=slide('Eén product, twee prijzen');
 table(s,[['Grootheid','Betekenis'],['Pc','De koper betaalt dit per product.'],['Pp','De verkoper ontvangt dit na afdracht.'],['t','De overheid krijgt dit per product.']],60,216,1480,352,[290,1190],39);
 text(s,'Pc − Pp = t',60,630,1000,90,64,{bold:true,color:C.blue});
 text(s,'Pp is vóór aftrek van productiekosten.',60,753,1480,60,37,{bold:true,color:C.orange});
 notes(s,'6–7','Noem de belasting per product en de eenheden. De verkoper ontvangt Pc, draagt t af en houdt Pp over vóór zijn productiekosten. De vraagfunctie gebruikt Pc; de oorspronkelijke aanbodfunctie gebruikt Pp. Zonder belasting zijn beide prijzen gelijk. Het model heeft veel kopers en verkopers die de prijs als gegeven nemen; één product en verder gelijke omstandigheden.','Welk bedrag bepaalt wat de koper wil kopen?','Pp is geen winst. Afdragen vertelt wie het geld overmaakt, nog niet wie er economisch op achteruitgaat.','Gebruik de twee prijzen in een apart rekenvoorbeeld.');
}
{
 const s=slide('Uitlegvoorbeeld · Houten puzzels',{exampleSlide:true});
 text(s,'Veel aanbieders verkopen dezelfde soort houten puzzel.',60,195,1480,75,39);
 table(s,[['Markt','Functie of maatregel'],['Vraag','Pc = 26 − 0,20Q'],['Oorspronkelijk aanbod','Pp = 2 + 0,10Q'],['Belasting door verkopers afgedragen','t = € 6 per verkochte puzzel']],60,306,1480,335,[800,680],36);
 text(s,'Q: puzzels per week · Pc en Pp: euro per puzzel',60,699,1480,65,36,{bold:true});
 text(s,'Alle andere marktomstandigheden blijven gelijk.',60,780,1480,54,32);
 en(s,'Dit is een nieuw onderwijsvoorbeeld, geen boekopgave. De vraaglijn geeft de bereidheid om te betalen; de aanbodlijn de benodigde ontvangst. De functies blijven gelden. Begin zonder belasting.','Waarom krijgt de aanbodprijs een andere naam dan de vraagprijs?','De € 6 is een heffing per verkochte puzzel, geen eenmalig bedrag.','Bereken eerst het vrije evenwicht.');
}
{
 const s=slide('Vrij evenwicht · één prijs',{exampleSlide:true});
 lines(s,['26 − 0,20Q = 2 + 0,10Q','24 = 0,30Q','Q₀ = 80 puzzels per week'],{gap:110});
 text(s,'P₀ = 26 − 0,20 × 80 = € 10 per puzzel',60,636,1480,75,46,{bold:true});
 text(s,'Controle met A: 2 + 0,10 × 80 = 10',60,757,1480,60,36,{color:C.green});
 en(s,'Zonder belasting is Pc gelijk aan Pp. Tel 0,20Q bij beide kanten op en trek 2 af: 24 = 0,30Q. Deel door 0,30. Vul Q vervolgens in één oorspronkelijke functie in en controleer in de andere. Dit herhaalt het oplossen en substitueren uit Boek 2 §2.3.2.','Welke grootheid bereken je door beide prijsfuncties gelijk te stellen?','Invullen van een willekeurige Q in A levert een prijs op, maar bewijst geen evenwicht.','Zoek dezelfde uitkomst in de grafiek.');
}
{
 const s=slide('Vrij evenwicht in de grafiek',{exampleSlide:true});graph(s,example,1);
 text(s,'V snijdt A',1150,247,390,70,39,{bold:true,color:C.blue});text(s,'Q₀ = 80\n\nP₀ = € 10',1150,376,390,220,40,{bold:true});text(s,'Gevraagd =\naangeboden',1150,686,390,108,37);
 en(s,'Lees de horizontale as als puzzels per week en de verticale as als euro per puzzel. Beide lijnen ontmoeten elkaar bij (80; 10). De hulplijnen verbinden de kruising met beide assen. De grafiek toont het relevante domein tot 140; vraag stopt waar Pc nul is.','Hoe vind je bij de kruising het aantal en daarna de prijs?','De assen zijn numeriek: 80 is een hoeveelheid, geen achtste categorie.','Vertaal nu de aanbodfunctie naar de prijs inclusief belasting.');
}
{
 const s=slide('Aanbod in kopersprijzen',{exampleSlide:true});
 text(s,'Gewenste ontvangst + afdracht = benodigde kopersprijs',60,190,1480,96,37,{bold:true});
 lines(s,['Pc = Pp + 6','Pc = (2 + 0,10Q) + 6','A + t: Pc = 8 + 0,10Q'],{y:319,gap:113,size:48});
 text(s,'Bij Q = 60: € 8 ontvangst + € 6 afdracht = € 14 betaling',60,742,1480,78,35,{color:C.orange,bold:true});
 en(s,'Vergelijk bij dezelfde hoeveelheid de gewenste ontvangst met de benodigde betaling. Voor 60 puzzels wil men 8 euro per puzzel ontvangen; om ook 6 af te dragen moet de koper 14 betalen. Dit geldt voor elke Q. De productiekosten veranderen hier niet. De oorspronkelijke A blijft de ontvangstfunctie; A+t beschrijft dezelfde aanbodbeslissing in kopersprijzen.','Waarom blijft de coëfficiënt 0,10 gelijk?','Tel t bij de aanbodfunctie op, niet zomaar bij de oude evenwichtsprijs.','Bekijk A en A+t op dezelfde assen.');
}
{
 const s=slide('De belastinglijn A + t',{exampleSlide:true});graph(s,example,2);
 text(s,'A + t ligt\n€ 6 hoger',1150,261,390,135,40,{bold:true,color:C.orange});text(s,'Bij elke Q\ndezelfde afstand',1150,464,390,116,35);text(s,'V verandert niet.',1150,704,390,91,35,{bold:true,color:C.blue});
 en(s,'A begint op 2; A+t op 8. Beide hebben dezelfde helling. De verticale afstand is 6 euro bij elke hoeveelheid. Het snijpunt van V en A+t gaat over de prijs die kopers betalen. Lees de verkopersontvangst later op A.','Welke twee lijnen bepalen de nieuwe hoeveelheid?','A+t is geen nieuwe ontvangstfunctie voor de verkoper na belasting.','Los V = A+t op.');
}
{
 const s=slide('Nieuwe hoeveelheid',{exampleSlide:true});
 lines(s,['26 − 0,20Q = 8 + 0,10Q','18 = 0,30Q','Qt = 60 puzzels per week'],{gap:125});
 text(s,'De hoeveelheid daalt: 80 → 60 puzzels per week.',60,722,1480,92,40,{bold:true,color:C.orange});
 en(s,'De kopersprijs op V moet gelijk zijn aan de benodigde kopersprijs op A+t. Tel 0,20Q op en trek 8 af. De uitkomst is één hoeveelheid voor beide zijden: elke verkochte puzzel wordt gekocht én aangeboden.','Waarom gebruik je nu 8 in plaats van 2?','De twee prijzen betekenen niet dat er twee verschillende verhandelde hoeveelheden zijn.','Vul de nieuwe hoeveelheid in beide oorspronkelijke functies in.');
}
{
 const s=slide('Beide prijzen bij dezelfde Qt',{exampleSlide:true});
 text(s,'Qt = 60 puzzels per week',60,190,1480,75,41,{bold:true});
 text(s,'Koper · V',60,318,460,60,37,{bold:true,color:C.blue});text(s,'Pc = 26 − 0,20 × 60 = € 14',560,318,980,100,45,{bold:true});
 text(s,'Verkoper · A',60,474,460,60,37,{bold:true,color:C.green});text(s,'Pp = 2 + 0,10 × 60 = € 8',560,474,980,100,45,{bold:true});
 text(s,'Controle: Pc − Pp = 14 − 8 = € 6 per puzzel',60,705,1480,96,43,{bold:true,color:C.orange});
 en(s,'Gebruik voor Pc de vraagfunctie en voor Pp de oorspronkelijke aanbodfunctie. Een tweede controle is Pc min t = Pp. De overheid krijgt 6 euro per verkochte puzzel, de verkoper ontvangt 8 vóór kosten.','Op welke lijn staat het bedrag dat de verkoper na afdracht overhoudt?','Trek t niet nog eens af van de uitkomst van de oorspronkelijke A.','Markeer beide bedragen boven dezelfde Q in de grafiek.');
}
{
 const s=slide('De belastingwig bij Qt = 60',{exampleSlide:true});graph(s,example,3);
 text(s,'Pc = € 14\nop V en A + t',1150,248,390,133,37,{bold:true,color:C.blue});text(s,'Pp = € 8\nop A',1150,424,390,130,37,{bold:true,color:C.green});text(s,'Verticale wig:\n14 − 8 = € 6',1150,657,390,132,37,{bold:true,color:C.orange});
 en(s,'Volg Q=60 omhoog naar V en A+t: Pc=14. Op de oorspronkelijke A bij diezelfde Q staat Pp=8. De oranje verticale lijn tussen deze twee punten is de wig van 6 euro. Alle progressive grafieken gebruiken exact dezelfde schalen.','Waarom moet de wig verticaal zijn?','Een horizontale afstand is een verschil in aantallen, geen euro per puzzel.','Vergelijk beide nieuwe prijzen met de oude prijs.');
}
{
 const s=slide('Afdragen en de last dragen',{exampleSlide:true});
 table(s,[['Per puzzel','Zonder belasting','Met belasting'],['Koper betaalt','€ 10','€ 14'],['Verkoper ontvangt vóór kosten','€ 10','€ 8']],60,226,1480,300,[680,400,400],36);
 text(s,'Koper: 14 − 10 = € 4 meer',60,586,1480,70,43,{bold:true,color:C.blue});text(s,'Verkoper: 10 − 8 = € 2 minder',60,684,1480,70,43,{bold:true,color:C.green});
 text(s,'De verkoper draagt € 6 af; zijn last is € 2 per puzzel.',60,784,1480,48,33,{bold:true,color:C.orange});
 en(s,'Afdragen is het overmaken van 6 euro. De economische last vergelijkt met de oude prijs: koper 4 meer, verkoper 2 minder. Samen 6. Dit voorbeeld laat zien dat delen niet automatisch halveren. Een hogere Pc gaat samen met een lagere Pp; op beide oorspronkelijke curves hoort daar minder Q bij.','Kun je zonder P₀ bepalen wie de grootste last draagt?','De wig geeft het totaal per product. De verdeling vereist de oude prijs; Pp is nog geen winst.','Controleer of zomaar optellen bij de oude prijs werkt.');
}
for(const reveal of [false,true]){
 const s=slide(reveal?'Controle · € 16 geeft geen evenwicht':'Korte controle · oude prijs + belasting',{exampleSlide:true});
 text(s,'“De oude prijs was € 10. Dus Pc wordt € 16.”',60,211,1480,123,48,{bold:true,color:C.blue});
 if(!reveal){text(s,'Klopt dit bij de houten puzzels?',60,435,1480,75,44);text(s,'V: Pc = 26 − 0,20Q\nA: Pp = 2 + 0,10Q · t = € 6',60,588,1480,145,40);}
 else{lines(s,['Bij Pc = 16: 16 = 26 − 0,20Q → Qv = 50','Pp = 16 − 6 = 10: 10 = 2 + 0,10Q → Qa = 80','50 gevraagd ≠ 80 aangeboden'],{y:422,gap:128,size:37});}
 en(s,reveal?'Keer de functies om: 0,20Qv=10 dus Qv=50; 0,10Qa=8 dus Qa=80. Er is geen evenwicht. Het juiste evenwicht was Qt=60, Pc=14 en Pp=8. Laat leerlingen daarna startopgave 2 opnieuw bekijken.':'Laat leerlingen eerst nadenken en hun redenering benoemen. De getoonde functies behoren uitsluitend bij het uitlegvoorbeeld. Laat de geclaimde Pc omzetten in Pp en beide hoeveelheden vergelijken.','Zijn vraag en aanbod bij de voorgestelde prijzen even groot?','Met twee prijzen moet je in de juiste functie invullen; Qv en Qa verschillen hier omdat de voorgestelde prijs onjuist is.',reveal?'Terug naar startopgave 2, daarna basis 3–4 en zelfstandig werk.':'Toon de vergelijking van beide hoeveelheden.');
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 7 · Bedrukte tassen',{targetSlide:true});
 text(s,'Verschillende aanbieders verkopen dezelfde soort bedrukte tas.',60,191,1480,100,39);
 table(s,[['Vraag','Pc = 20 − 0,20Q'],['Aanbod','Pp = 2 + 0,10Q'],['Eenheden','Q: tassen per dag · prijzen: euro per tas']],60,339,1480,261,[470,1010],37);
 text(s,'De overheid heft € 3 per verkochte tas.\nDe verkopers dragen de belasting af.\nDe andere marktomstandigheden blijven gelijk.',60,668,1480,154,36);
 tn(s,'Dit zijn de volledige context en gegevens van de echte doeloefening. Start de bespreking pas nadat leerlingen die zelf hebben geprobeerd. De volgende twee dia’s tonen alle deelvragen en de basisgrafiek zonder oplossingen.','Welke functie hoort bij de koper, welke bij de verkoper?','Reset de context: t is nu 3 euro, niet 6; Q is per dag, niet per week.','Toon eerst alle vragen, zonder al antwoorden te onthullen.');
}
{
 const s=slide('Opgave 7 · Deelvragen a, b en c',{targetSlide:true});
 text(s,'a. Bereken de vrije evenwichtsprijs en -hoeveelheid.',60,212,1480,105,43);
 text(s,'b. Stel na invoering van de belasting het aanbod in kopersprijzen op. Bereken de nieuwe hoeveelheid.',60,390,1480,150,43);
 text(s,'c. Bereken de prijs die kopers betalen en het bedrag dat verkopers na afdracht ontvangen.',60,624,1480,151,43);
 tn(s,'Lees a tot en met c volledig. De context blijft Pc=20−0,20Q; Pp=2+0,10Q; t=3. Toon nog geen oplossingen.','Welke grootheden moet je antwoord straks bevatten?','De nieuwe hoeveelheid is nog niet de gevraagde vrije hoeveelheid bij a.','Toon de grafiek en deelvragen d en e.');
}
{
 const s=slide('Opgave 7 · Deelvragen d en e',{targetSlide:true});
 text(s,'d. Teken de nieuwe aanbodlijn in de basisgrafiek. Markeer de nieuwe hoeveelheid, beide prijzen en de belastingwig.',60,192,720,214,35);
 text(s,'e. Een verkoper zegt: “Wij dragen alles af; dus wij dragen ook de hele economische last.” Beoordeel met de oude en nieuwe prijzen.',60,489,720,247,35);
 graph(s,target,0,{left:800,top:241,width:750,height:545});
 tn(s,'De basisgrafiek is als bewerkbare XY-grafiek overgenomen met dezelfde functies en domeinen als figuur 5: Q 0–100, P 0–22, V van (0;20) tot (100;0), A van (0;2) tot (100;12). Alle vijf vragen zijn nu beschikbaar zonder oplossingen.','Waar lees je later de ontvangst na afdracht af?','De basisgrafiek bevat bewust nog geen belastinglijn of nieuwe uitkomst.','Begin de uitwerking bij het vrije evenwicht.');
}
{
 const s=slide('Opgave 7a · Vrij evenwicht',{targetSlide:true});
 lines(s,['20 − 0,20Q = 2 + 0,10Q','18 = 0,30Q','Q₀ = 60 tassen per dag'],{gap:110});
 text(s,'P₀ = 20 − 0,20 × 60 = € 8 per tas',60,636,1480,78,48,{bold:true});text(s,'Controle: 2 + 0,10 × 60 = 8',60,762,1480,55,36,{color:C.green});
 tn(s,'Stel V gelijk aan A omdat er zonder belasting één prijs is. Tel 0,20Q op en trek 2 af. Deel 18 door 0,30. Vul 60 in V in en controleer met A.','Waarom komt hier nog geen 3 in de vergelijking?','Deel 18 door 0,30; niet door het verschil van de twee hellingen.','Stel het aanbod in kopersprijzen op.');
}
{
 const s=slide('Opgave 7b · Belasting en nieuwe hoeveelheid',{targetSlide:true});
 text(s,'Pc = Pp + 3 = (2 + 0,10Q) + 3',60,209,1480,85,46);
 text(s,'A + t: Pc = 5 + 0,10Q',60,323,1480,75,46,{bold:true,color:C.orange});
 lines(s,['20 − 0,20Q = 5 + 0,10Q','15 = 0,30Q','Qt = 50 tassen per dag'],{y:458,gap:116,size:44});
 tn(s,'Dezelfde gewenste ontvangst plus 3 euro afdracht geeft het nieuwe aanbod in kopersprijzen. Laat precies zien waar de 5 vandaan komt. Stel dat gelijk aan de vraagprijs en los op. De hoeveelheid daalt van 60 naar 50.','Waarom verschuift alleen het constante getal?','5 is de prijsas-snijding van A+t, niet de nieuwe marktprijs.','Vul 50 in de oorspronkelijke functies in.');
}
{
 const s=slide('Opgave 7c · Pc en Pp',{targetSlide:true});
 text(s,'Qt = 50 tassen per dag',60,196,1480,80,43,{bold:true});
 text(s,'Pc = 20 − 0,20 × 50 = € 10 per tas',60,352,1480,100,48,{bold:true,color:C.blue});
 text(s,'Pp = 2 + 0,10 × 50 = € 7 per tas',60,528,1480,100,48,{bold:true,color:C.green});
 text(s,'Controle: 10 − 7 = € 3 per tas',60,736,1480,73,43,{bold:true,color:C.orange});
 tn(s,'Pc komt van V, Pp van de oorspronkelijke A. Beide berekeningen gebruiken dezelfde 50 tassen. Controleer zowel de wig als Pp=Pc−3.','Waar zou je terechtkomen als je 50 in A+t invult?','A+t geeft 10, de kopersprijs. Trek niet nogmaals 3 af van Pp=7.','Teken eerst A+t en markeer daarna beide prijzen.');
}
{
 const s=slide('Opgave 7d · De nieuwe aanbodlijn',{targetSlide:true});graph(s,target,2);
 text(s,'A + t:\nPc = 5 + 0,10Q',1140,269,400,136,36,{bold:true,color:C.orange});
 text(s,'Twee punten:\n(0; 5) en (100; 15)',1140,475,400,132,34);
 text(s,'Evenwijdig aan A',1140,712,400,89,34,{bold:true});
 tn(s,'Teken de rechte A+t door (0;5) en (100;15). Bij elke hoeveelheid ligt deze lijn 3 euro boven A. V blijft onveranderd. De grafiek gebruikt dezelfde grenzen als de basisgrafiek.','Welk snijpunt bepaalt Qt en Pc?','Een belasting per product verandert hier het intercept, niet de helling.','Markeer bij Q=50 de twee prijzen en de verticale wig.');
}
{
 const s=slide('Opgave 7d · Twee prijzen en de wig',{targetSlide:true});graph(s,target,3);
 text(s,'Qt = 50\ntassen per dag',1140,241,400,126,36,{bold:true});text(s,'Pc = € 10 op V\nPp = € 7 op A',1140,434,400,139,36,{bold:true,color:C.blue});
 text(s,'Wig: 10 − 7\n= € 3 per tas',1140,673,400,128,36,{bold:true,color:C.orange});
 tn(s,'Markeer (50;10) op V en A+t en (50;7) op de oorspronkelijke A. Verbind verticaal. Hulplijnen leiden naar Q=50 en beide prijzen. Laat leerlingen hun eigen punten, aslabels en eenheden vergelijken.','Zijn de beide prijzen boven dezelfde hoeveelheid gemarkeerd?','De wig loopt niet tussen oude en nieuwe Q; dat is een hoeveelheidverschil.','Beoordeel de uitspraak van de verkoper met de oude prijs.');
}
{
 const s=slide('Opgave 7e · Wie draagt de last?',{targetSlide:true});
 table(s,[['Per tas','Oude prijs','Nieuwe prijs','Economische last'],['Koper','€ 8','€ 10','10 − 8 = € 2'],['Verkoper','€ 8','€ 7','8 − 7 = € 1']],60,220,1480,303,[420,300,300,460],35);
 text(s,'De uitspraak is onjuist.',60,587,1480,75,48,{bold:true,color:C.blue});
 text(s,'De verkoper draagt € 3 af, maar draagt € 1 last per tas.',60,693,1480,87,42,{bold:true,color:C.orange});
 tn(s,'Afdragen is de betalingshandeling. Dragen is de achteruitgang tegenover P₀=8. De koper betaalt 2 meer, de verkoper ontvangt 1 minder. Samen is dat 3 euro. Pp=7 is nog steeds vóór aftrek van productiekosten. Laat leerlingen één ontbrekende stap, eenheid of redenering in a–e verbeteren.','Waarom heb je voor deze beoordeling de oude prijs nodig?','De afdrager draagt niet automatisch de hele last. De € 7 is ook geen winst.','Keer terug naar het overzicht en laat huiswerk noteren.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides,tables,charts},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.resolve('build-scripts/content/book-3/presentation-311-charts.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,stem+'.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts.map(c=>c.slide),materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviewSlides,final:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
