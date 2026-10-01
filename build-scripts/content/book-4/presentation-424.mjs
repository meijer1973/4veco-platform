// HOW TO ADAPT: derive a new paragraph from its current complete book, questions,
// answers and teacher route. Update the source manifest and worked example first.
// Runtime paths come from the installed presentation runtime, never this source.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const facts=JSON.parse(await fs.readFile(path.join(HERE,'presentation-424.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('424');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E8449',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',loss:'#B4473C'};
const FONT='Arial', tables=[],charts=[],slides=[],overviews=[],graphs=[];
const title='§4.2.4 Negatieve externe effecten';
const src=`https://github.com/meijer1973/4veco-lessen/blob/${facts.sourceCommit}/${facts.sourceEdition}/`;
const example='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
  const t=s.shapes.add({geometry:'textbox',name:name||str.slice(0,64),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  t.text=str;t.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return t;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(label,{kind='instruction',footer=title}={}){
  const s=p.slides.add();s.background.fill=C.paper;
  text(s,label,60,38,1480,82,label.startsWith('Deze les:')?46:50,{bold:true});rule(s,60,146,1480);
  text(s,footer,60,848,1380,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
  slides.push({number:p.slides.items.length,title:label,kind});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false,extra=''}={}){
  explanation=explanation.replace(/(\p{L})(\d)/gu,'$1 $2').replace(/(\d)(\p{L})/gu,'$1 $2');
  s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, editie books34-v3, gedrukte boekpagina ${page}. ${src}output/Boek_4_Compleet_v3.pdf\nManuscript: ${src}chapters/4.2/4.2.4%20manuscript.md\nAntwoordmodel: ${src}chapters/4.2/Antwoorden.md#antwoord34\n${authored?'Uitlegvoorbeeld: zelf ontworpen metaalcoatingmarkt en data, niet uit het boek. De boekverwijzing ondersteunt uitsluitend de gebruikte methode. ':''}${extra}`);
}
function table(s,values,x,y,w,h,widths,size=32){
  const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
  t.borders.assign({fill:C.line,width:1,style:'solid'});
  for(let r=0;r<values.length;r++){
    t.rows[r].height=h/values.length;
    for(let c=0;c<values[0].length;c++){
      const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
      cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:9,bottom:9}};
    }
  }tables.push(p.slides.items.length);return t;
}
function lines(s,rows,{x=60,y=215,w=1480,step=145,size=43}={}){
  rows.forEach((r,i)=>{text(s,r,x,y+i*step,w,110,size,{bold:i===rows.length-1,color:i===rows.length-1?C.blue:C.ink});});
}
function exampleTag(s){text(s,example,60,176,1480,45,29,{color:C.muted});}
const route=[
  'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
  'Maak de startopdracht.',
  'Uitleg bij de lesdoelen.',
  'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
  'Klaar? Werk aan een ander vak. Geen devices.',
  'Bespreken van de doelopgave: opgave 34.',
  'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
  const s=slide('Deze les: '+title,{kind:'overview'});overviews.push(p.slides.items.length);
  text(s,'Nu: '+phase,60,108,1480,42,30,{bold:true,color:C.blue,name:'phase'});
  text(s,'Lesroute',60,178,835,46,35,{bold:true});
  const ys=[239,331,385,441,631,710,770],hs=[82,45,45,177,74,52,52];
  route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:`route-number-${i+1}`});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:`route-${i+1}`});});
  text(s,'Lesdoelen',972,178,565,46,35,{bold:true});
  text(s,'Derden en kosten onderscheiden.\nHeffing, maatschappelijk surplus\nen welvaartsverlies berekenen.',972,239,565,119,30,{name:'overview-goals'});rule(s,972,375,568);
  text(s,'Startopdracht',972,399,565,46,35,{bold:true,color:active===2?C.blue:C.ink});
  text(s,'Pagina 83 · Opgaven 28 en 29\n29: verkennen, theorie p. 77',972,454,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,567,568);
  text(s,'Huiswerk',972,590,565,46,35,{bold:true,color:active===7?C.blue:C.ink});
  text(s,'§4.2.4 · Opgaven 30 t/m 34\nBasis: 30 en 31\nZelfstandig: 32 en 33\nDoelopgave: 34\nMaken en nakijken',972,645,565,185,30,{bold:active===7,name:'overview-homework'});
  notes(s,'77, 83–86',`Laat het overzicht staan tijdens ${phase.toLowerCase()}. Start 28 is herhaling van de heffingswig uit Boek 3 §3.1.1 en de ontvangsten uit §3.1.2. Laat leerlingen Pc=Pp+t en O=t×Q terughalen. Start 29 verkent het nieuwe begrip: lees eerst de definitie en de waarschuwing op p.77, wijs de derde partij aan en noteer twijfel. Verwacht nog geen zelfstandige beheersing. Keer vóór het basiswerk terug naar 29 en laat de redenering verbeteren met de inmiddels besproken begrippen. Basis 30 staat op p.83, 31 op p.84; zelfstandig 32 op p.84, 33 op p.85; doel 34 op p.86. Huiswerk 30–34 maken en nakijken. Bonus35 en herhaling36 blijven extra. Docenteninformatie adviseert voorlopig twee lessen van 55 minuten met flexibele grens en uitloop; ook 110 minuten is niet bewezen. Rond in de volgende les zo nodig basiswerk af vóór zelfstandig werk.`, 'Welke stap wil je met de uitleg kunnen verbeteren?', 'De manuscript- en docenteninformatiepagina’s 25–35 zijn lokaal; gebruik in het complete boek 77–87. Start 29 is verkennen met steun.',phase==='Afsluiting / huiswerk'?'Noteer het resterende werk in de agenda.':'Ga door naar de passende lesfase.');return s;
}

// Native XY charts: all endpoints, labels, guides and hatching use model units.
const E={key:'coating',a:80,b:16,d:16,maxQ:64,maxP:96,stepQ:16,stepP:16,unit:'coatingbeurten per dag'};
const T={key:'target',a:60,b:0,d:20,maxQ:60,maxP:80,stepQ:10,stepP:20,unit:'diensten per dag'};
const coord=(m,q,which)=>which==='V'?m.a-q:m.b+q+(which==='M'?m.d:0);
function graph(s,m,{social=false,original=false,efficient=false,loss=false,tax=false,costGap=false}={}){
  const q0=(m.a-m.b)/2,p0=m.a-q0,qe=(m.a-m.b-m.d)/2,pc=m.a-qe,pp=m.b+qe;
  const series=[];
  function add(name,x,y,color,width=3,dash=false,label=null){
    const v={name,xValues:x.map(n=>Number(n.toFixed(6))),values:y.map(n=>Number(n.toFixed(6))),line:{fill:color,width,...(dash?{style:'dashed'}:{})},marker:{symbol:'none'}};
    if(label)v.dataLabelOverrides=[{idx:label.idx??1,text:label.text,position:label.pos??'top',showValue:false,textStyle:{typeface:FONT,fontSize:25,fill:color,bold:true}}];
    series.push(v);return v;
  }
  if(loss){
    for(let q=qe+0.5;q<q0;q+=0.7)add('arcering',[q,q],[coord(m,q,'V'),coord(m,q,'M')],C.loss,2);
    add('verliesgrens',[qe,q0,q0,qe],[pc,coord(m,q0,'V'),coord(m,q0,'M'),pc],C.loss,3);
  }
  if(original){add('Q0-hulplijn',[q0,q0],[0,p0],C.muted,1.5,true);add('P0-hulplijn',[0,q0],[p0,p0],C.muted,1.5,true);}
  if(efficient||tax){add('Qe-hulplijn',[qe,qe],[0,pc],C.muted,1.5,true);}
  if(tax){
    add('Pc-hulplijn',[0,qe],[pc,pc],C.muted,1.5,true);add('Pp-hulplijn',[0,qe],[pp,pp],C.muted,1.5,true);
    add('belastingwig',[qe,qe,qe],[pp,(pp+pc)/2,pc],C.orange,5,false,{text:`t = ${m.d}`,pos:'right'});
    // At a common buyer price, the tax shifts quantity offered left by d.
    const price=m.key==='coating'?80:60,oldQ=price-m.b,newQ=price-m.b-m.d;
    add('aanbodverschuiving',[oldQ,newQ],[price,price],C.orange,3);
    add('pijlpunt links',[newQ+2,newQ,newQ+2],[price+2,price,price-2],C.orange,3);
  }
  add('V',[0,m.maxQ],[m.a,coord(m,m.maxQ,'V')],C.blue,4);
  add('A',[0,m.maxQ],[m.b,coord(m,m.maxQ,'A')],C.green,4);
  if(social||tax)add('M',[0,m.maxQ],[m.b+m.d,coord(m,m.maxQ,'M')],C.orange,4);
  // Invisible label anchors keep native chart labels clear of intersecting lines.
  const labelAt=(name,q,y,label,color)=>add(name,[q],[y],color,0,false,{idx:0,text:label,pos:'center'});
  labelAt('label V',m.maxQ*.84,coord(m,m.maxQ*.84,'V')-5,'V',C.blue);
  labelAt('label A',m.maxQ*.81,coord(m,m.maxQ*.81,'A')-8,'A = MK privé',C.green);
  if(social||tax)labelAt('label M',m.maxQ*.65,coord(m,m.maxQ*.65,'M')+12,'MK maatschappelijk',C.orange);
  if(original){const v=add('E0',[q0],[p0],C.ink,0);v.marker={symbol:'circle',size:8};labelAt('label E0',q0+2.7,p0-8,'E₀',C.ink);}
  if(efficient||tax){const v=add('Ee',[qe],[pc],C.orange,0);v.marker={symbol:'circle',size:8};labelAt('label Ee',qe-2,pc+11,'Eₑ',C.orange);}
  if(costGap){const q=16;add('externe kosten per extra eenheid',[q,q,q],[m.b+q,m.b+q+m.d/2,m.b+q+m.d],C.orange,5,false,{text:'€ 16',pos:'left'});}
  const ch=s.charts.add('scatter',{position:{left:60,top:237,width:1040,height:583},series,scatterOptions:{style:'line'},hasLegend:false,
    dataLabels:{showValue:false,showSeriesName:false,showCategoryName:false},
    xAxis:{min:0,max:m.maxQ,majorUnit:m.stepQ,title:{text:`Q (${m.unit})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
    yAxis:{min:0,max:m.maxP,majorUnit:m.stepP,title:{text:m.key==='coating'?'P en MK (€ per coatingbeurt)':'P en MK (€ per dienst)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
  applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
  graphs.push({slide:p.slides.items.length,model:m,options:{social,original,efficient,loss,tax,costGap},series:series.map(({name,xValues,values})=>({name,xValues,values}))});
}

overview('Startopdracht',2);
{
  const s=slide('De derde partij');exampleTag(s);
  table(s,[['Betrokkene','Wat gebeurt er?'],['Koper','Betaalt voor de coating'],['Verkoper','Ontvangt geld en maakt eigen kosten'],['Omwonenden','Ondervinden geurhinder zonder vergoeding']],60,246,1480,394,[470,1010],36);
  text(s,'Negatief extern effect: niet-vergoed nadeel buiten de transactie.',60,705,1480,103,42,{bold:true,color:C.blue});
  notes(s,'77','Gebruik de zelf ontworpen metaalcoatingmarkt. Bedrijven laten metalen onderdelen coaten. Coatingbedrijven verkopen de dienst. De omwonenden kopen of verkopen in deze transactie niets, maar dragen niet-vergoede geurhinder. Leg de woorden productie of consumptie en niet verwerkt in prijs of vergoeding uit. De rekening van de koper en de eigen productiekosten zijn op zichzelf geen externe kosten.','Wie staat buiten de koop en verkoop?','Een hoge prijs of een hoge materiaalrekening is op zichzelf geen extern effect.','Geef de voorbeeldmarkt concrete functies.',{authored:true});
}
{
  const s=slide('Metaalcoating: de voorbeeldmarkt');exampleTag(s);
  table(s,[['Grootheid','Gegeven'],['Vraag','Pc = 80 − Q'],['Private kosten / aanbod','Pp = 16 + Q'],['Niet-vergoede geurhinder','€ 16 per coatingbeurt']],60,246,1480,350,[630,850],36);
  text(s,'Q: coatingbeurten per dag, van 0 tot en met 64.\nPc en Pp: euro per coatingbeurt.',60,642,1480,112,35);
  text(s,'Veel aanbieders · overige omstandigheden gelijk',60,779,1480,44,30,{color:C.muted});
  notes(s,'78–82','Eigen context en eigen data: concurrerende coatingmarkt met vraag Pc=80−Q en aanbod Pp=16+Q. De constante externe schade bedraagt16 euro per beurt. De functies gelden voor Q van0 tot64. Geen vaste kosten, uitvoeringskosten of andere externe effecten. Voorlopig geen heffing. De aanbodlijn geeft de marginale private kosten. We bepalen eerst de marktuitkomst en daarna wat voor alle betrokkenen samen zinvol is.','Welke kosten wegen aanbieders in hun eigen beslissing mee?','De externe schade zit nog niet in de oorspronkelijke aanbodfunctie.','Los de markt zonder heffing op.',{authored:true});
}
{
  const s=slide('Het ongereguleerde evenwicht');exampleTag(s);graph(s,E,{original:true});
  lines(s,['80 − Q = 16 + Q','64 = 2Q','Q₀ = 32\nP₀ = € 48'],{x:1150,y:265,w:390,step:160,size:35});
  notes(s,'78','Stel bij de ongereguleerde markt vraag gelijk aan private aanbodkosten. 80−Q=16+Q geeft2Q=64, Q0=32 per dag en P0=80−32=48 euro per beurt. Controle16+32=48. E0 ligt bij32,48 en de hulplijnen horen bij dezelfde hoeveelheid.','Waarom gebruiken bedrijven hier de private kostenlijn?','De markt verwerkt niet vanzelf de niet-vergoede geurhinder.','Voeg de ontbrekende maatschappelijke kosten toe.',{authored:true});
}
{
  const s=slide('Maatschappelijke kosten per extra beurt');exampleTag(s);graph(s,E,{social:true,costGap:true});
  text(s,'MK maatschappelijk\n= MK privé + schade\n= 32 + Q',1150,257,390,210,35,{bold:true,color:C.orange});
  text(s,'Bij Q = 16\nPrivé: € 32\nMaatschappelijk: € 48',1150,535,390,176,33);
  notes(s,'78','Tel bij dezelfde Q de16 euro schade op bij16+Q. Maatschappelijke MK=32+Q. De verticale afstand is16 euro per extra beurt. Bij Q16 is de private MK32 en maatschappelijke MK48 euro. Deze lijn beschrijft echte maatschappelijke kosten. Er is nog geen belasting; de private aanbodbeslissing verandert nog niet.','Waarom vergelijk je bij dezelfde hoeveelheid?','De lijn met maatschappelijke MK is zonder nieuwe prikkel nog niet de feitelijke aanbodlijn.','Bepaal welke hoeveelheid gezamenlijk zinvol is.',{authored:true});
}
{
  const s=slide('De efficiënte hoeveelheid');exampleTag(s);
  lines(s,['Betalingsbereidheid = maatschappelijke MK','80 − Q = 32 + Q','48 = 2Q      Qₑ = 24 coatingbeurten per dag'],{y:245,step:132,size:40});
  table(s,[['Extra beurt bij Q = 28','Waarde (€ per beurt)'],['Betalingsbereidheid','80 − 28 = 52'],['Maatschappelijke MK','32 + 28 = 60']],60,650,1480,171,[970,510],29);
  notes(s,'78–79','De marginale baten volgen uit de vraag. Stel ze gelijk aan maatschappelijke MK: Qe24. Bij Q28 is de betalingsbereidheid52, private MK44 en maatschappelijke MK60. Privaat kan de beurt voordeel geven, maar maatschappelijk kost hij8 euro meer dan hij oplevert. Daarom is de marktuitkomst32 hoger dan de efficiënte24. Sommige beurten blijven wel maatschappelijk zinvol.','Wat zegt de vergelijking52 tegenover60 over die extra beurt?','Efficiëntie betekent niet dat elke activiteit en elke externe schade verdwijnt.','Teken het gebied van het verloren surplus.',{authored:true});
}
{
  const s=slide('Het oorspronkelijke welvaartsverlies');exampleTag(s);graph(s,E,{social:true,original:true,efficient:true,loss:true});
  text(s,'Tussen Qₑ en Q₀',1150,258,390,55,34,{bold:true});
  text(s,'Basis: 32 − 24 = 8\nHoogte: € 16\n\n½ × 8 × 16\n= € 64 per dag',1150,358,390,300,35,{bold:true,color:C.loss});
  notes(s,'79,82','De arcering loopt uitsluitend tussen de vraag en maatschappelijke MK, van24 tot32. Het punt bij24 is24,56. Bij32 is vraag48 en maatschappelijke MK64, dus hoogte16. De basis is8 beurten per dag en de oppervlakte64 euro per dag. Deze driehoek is het vermijdbare maatschappelijke verlies, niet alle externe schade.','Waarom loopt de driehoek niet vanaf Q=0?','Totale schade is16 maal alle beurten; welvaartsverlies vergelijkt marginale baten en maatschappelijke kosten op de te veel uitgevoerde beurten.','Bereken nu het maatschappelijke surplus met alle posten.',{authored:true});
}
{
  const s=slide('Maatschappelijk surplus zonder heffing');exampleTag(s);
  table(s,[['Post (€ per dag)','Berekening'],['CS','½ × 32 × (80 − 48) = 512'],['PS','½ × 32 × (48 − 16) = 512'],['Externe kosten','16 × 32 = 512'],['Maatschappelijk surplus','512 + 512 − 512 = 512']],60,249,1480,470,[600,880],34);
  text(s,'CS + PS − totale externe kosten',60,761,1480,65,42,{bold:true,color:C.blue});
  notes(s,'79,82','Herhaal kort de driehoeken: CS ligt onder vraag boven prijs48 en PS boven oorspronkelijke aanbodlijn onder prijs48. De hoogten zijn beide32, de basis is32. Daarom zijn CS en PS elk512. Trek schade af over alle32 beurten,16×32=512. Maatschappelijk surplus512 per dag. Overheidsontvangst is hier nul.','Welk aantal gebruik je voor de totale externe schade?','Gebruik niet alleen de acht te veel uitgevoerde beurten voor totale schade.','Onderscheid veranderingen in beide kostencomponenten.',{authored:true});
}
{
  const s=slide('Twee kostenveranderingen bij dezelfde Q');exampleTag(s);
  table(s,[['Verandering','Effect op maatschappelijke MK'],['Duurder materiaal: eigen MK + € 4','+ € 4 per beurt'],['Schonere techniek: schade − € 7','− € 7 per beurt'],['Samen','+ 4 − 7 = − € 3 per beurt']],60,254,1480,398,[840,640],34);
  text(s,'Maatschappelijke MK telt beide veranderingen bij elkaar op.',60,714,1480,102,41,{bold:true});
  notes(s,'78','Dit is een apart variatiescenario met eigen cijfers op dezelfde coatingmarkt. Bij iedere vaste Q stijgt private MK van16+Q naar20+Q. De externe schade daalt van16 naar9. Nieuwe maatschappelijke MK=29+Q, drie euro lager dan32+Q. Isoleer eerst iedere verandering, tel daarna de effecten op. Voor de volgende dia keren we terug naar de oorspronkelijke kosten en schade16.','Welke verandering is groter, en wat betekent dat voor de som?','Een stijging van eigen kosten bewijst geen stijging van maatschappelijke kosten wanneer externe schade tegelijk verandert.','Terug naar het oorspronkelijke voorbeeld, nu met een heffing van16 euro.',{authored:true});
}
{
  const s=slide('Een heffing van € 16 per coatingbeurt');exampleTag(s);
  lines(s,['Pc = Pp + t','80 − Q = (16 + Q) + 16','48 = 2Q      Q₁ = 24 coatingbeurten per dag','Pc = € 56      Pp = € 40      56 − 40 = 16'],{y:244,step:142,size:40});
  notes(s,'80–82','Herstel expliciet de oorspronkelijke schade16 en private MK16+Q na het aparte variatiescenario. De producent draagt16 euro per verkochte beurt af. Herhaal de bekende wig uit Boek3. Vraag en aanbod in kopersprijzen geven Q24; op vraag Pc56 en op oorspronkelijke aanbod Pp40. Controle56−40=16. Pp is ontvangst na afdracht maar vóór productiekosten.','Op welke lijn vind je wat de producent overhoudt na afdracht?','Tel de heffing niet simpelweg op bij de oude evenwichtsprijs.','Lees de twee prijzen en de aanbodverschuiving in de grafiek.',{authored:true});
}
{
  const s=slide('De heffing en de twee prijzen');exampleTag(s);graph(s,E,{social:true,tax:true});
  text(s,'A + t valt hier samen\nmet maatschappelijke MK.',1150,260,390,155,33,{bold:true,color:C.orange});
  text(s,'Q₁ = 24\nPc = € 56\nPp = € 40',1150,482,390,169,38);
  text(s,'Alleen omdat t = schade\nper extra beurt.',1150,711,390,98,30,{bold:true});
  notes(s,'80','De horizontale pijl vergelijkt aanbodhoeveelheden bij dezelfde kopersprijs80: zonder heffing Q64 en met heffing Q48. De verticale wig vergelijkt prijzen bij dezelfde Q24:40 naar56. Dit zijn verschillende vergelijkingen. Omdat belasting16 precies gelijk is aan de constante marginale schade, valt A+t samen met maatschappelijke MK en wordt Q24 bereikt. De private aanbodlijn blijft16+Q.','Wat houdt de horizontale pijl constant, en wat de verticale wig?','Belasting is een betaling; de maatschappelijke kostenlijn beschrijft echte kosten. Hun samenvallen is hier een gevolg van de gekozen gelijke bedragen.','Bereken de ontvangst én de resterende schade.',{authored:true});
}
{
  const s=slide('Overdracht en resterende schade');exampleTag(s);
  table(s,[['Post','Bij 24 coatingbeurten per dag'],['Overheidsontvangst','16 × 24 = € 384 per dag'],['Resterende externe schade','16 × 24 = € 384 per dag']],60,266,1480,345,[640,840],36);
  text(s,'De heffing verplaatst geld. De geurhinder blijft een echte kost.',60,691,1480,118,42,{bold:true,color:C.blue});
  notes(s,'80–82','De overheid krijgt t×Q=384. Omwonenden ondervinden nog16×24=384 schade. Dat beide bedragen gelijk zijn, volgt uit gelijke belasting en constante marginale schade. Het zegt niet dat de overheid schadevergoeding uitkeert. Bij de surplusberekening tellen we ontvangst op omdat CS en PS die afdracht niet meer bevatten, en schade trekken we afzonderlijk af.','Is de belastingontvangst bewijs dat omwonenden zijn gecompenseerd?','Streep ontvangst en schade niet weg omdat ze hetzelfde begrip zouden zijn. Alleen de bedragen zijn hier gelijk.','Vergelijk het maatschappelijke saldo vóór en na.',{authored:true});
}
{
  const s=slide('Alle vier posten in de welvaartsvergelijking');exampleTag(s);
  table(s,[['Post (€ per dag)','Zonder heffing','Met heffing'],['CS','512','½ × 24 × (80 − 56) = 288'],['PS','512','½ × 24 × (40 − 16) = 288'],['Overheidsontvangst','0','16 × 24 = 384'],['Externe kosten','512','16 × 24 = 384'],['Maatschappelijk surplus','512','288 + 288 + 384 − 384 = 576']],60,244,1480,482,[480,320,680],30);
  text(s,'Verbetering: € 576 − € 512 = € 64 per dag',60,765,1480,64,40,{bold:true,color:C.blue});
  notes(s,'79–82','Bereken CS met kopersprijs56, dus hoogte24 tot vraagintercept80. PS gebruikt producentenontvangst40 en het private intercept16, dus eveneens hoogte24. De basis is24. Beide zijn288. De vier posten leveren576. Controle: toename64 is exact de oorspronkelijke verliesdriehoek. De heffing bereikt hier Qe, gegeven alle gemaakte aannames.','Waarom gebruik je bij PS de oorspronkelijke private aanbodlijn?','PS berekenen onder Pc zou de belastingontvangst dubbel tellen.','Leg uit waarom dalend privaat surplus toch een maatschappelijk voordeel kan geven.',{authored:true});
}
{
  const s=slide('Dalend CS + PS en toch meer maatschappelijk surplus');exampleTag(s);
  table(s,[['Verandering (€ per dag)','Bedrag'],['CS + PS: 576 − 1.024','−448'],['Ontvangst van de overheid','+384'],['Afname externe schade: 512 − 384','+128'],['Maatschappelijk saldo','+64']],60,256,1480,450,[1120,360],35);
  text(s,'Meer maatschappelijk surplus betekent niet dat iedereen wint.',60,758,1480,68,37,{bold:true,color:C.blue});
  notes(s,'80–82','De daling van CS+PS is448. Hiervan verschuift384 naar de overheid. Daarnaast verdwijnt128 echte schade. Netto−448+384+128=64. Vergelijk met Boek3: daar waren externe effecten uitgesloten, hier worden te schadelijke transacties verminderd. De maatstaf telt euro’s zonder verdelingsgewichten. Niet iedere persoon hoeft te winnen en niet iedere belasting is goed.','Welke twee posten mis je als je alleen naar kopers en verkopers kijkt?','Een positief totaal bewijst geen verbetering voor ieder individu.','Keer terug naar start29 en ga daarna naar basis30–31 en zelfstandig32–33.',{authored:true});
}
overview('Zelfstandig werken',4);
{
  const s=slide('Opgave 34 · Bron: Reinigingsdiensten',{kind:'target-question',footer:title+' · Boekpagina 86'});
  text(s,'Veel bedrijven bieden dezelfde reinigingsdienst aan.',60,199,1480,67,38);
  table(s,[['Vraag','Aanbod','Heffing per dienst'],['Pc = 60 − Q','Pp = Q','t = € 20']],60,298,1480,171,[510,510,460],36);
  text(s,'Q: diensten per dag, van 0 tot 60. Prijzen: euro per dienst.\nElke dienst veroorzaakt € 20 niet-vergoede overlast voor omwonenden.\nDe producenten dragen de heffing af.',60,512,1480,175,35);
  text(s,'Geen uitvoeringskosten, vaste kosten of andere externe effecten.\nAndere vraag- en aanbodfactoren veranderen niet.',60,729,1480,91,32);
  notes(s,'86','Lees de volledige boekbron. Dit is een nieuwe markt met eigen functies, intercepten en schade20. Het voorgaande coatingvoorbeeld is afgesloten. Gebruik de bron en de basisgrafiek op de volgende dia. Geef nog geen uitkomsten. Alle deelvragen volgen vóór de eerste uitwerking.','Welke gegevens zijn anders dan in het uitlegvoorbeeld?','Neem geen getal of aanbodintercept uit de coatingmarkt over.','Bekijk de basisgrafiek en de vragen a en b.');
}
{
  const s=slide('Opgave 34 · Basisgrafiek en vragen a–b',{kind:'target-question',footer:title+' · Boekpagina 86'});graph(s,T,{social:true});
  text(s,'a (3p)',1140,232,400,52,34,{bold:true,color:C.blue});
  text(s,'Noem de derde partij. Bereken de oorspronkelijke hoeveelheid en prijs, en de totale externe schade.',1140,299,400,227,32);
  text(s,'b (3p)',1140,564,400,52,34,{bold:true,color:C.blue});
  text(s,'Bereken met de heffingswig Q, Pc, Pp en de overheidsontvangst.',1125,630,415,169,32);
  notes(s,'86','De basisgrafiek reproduceert de drie gegeven lijnen uit figuur20 met native XY-reeksen: V=60−Q, A=Q en maatschappelijke MK=20+Q, op Q0–60 en P0–80. Er zijn nog geen uitkomsten, hulplijnen of antwoorden toegevoegd. Laat leerlingen de opdracht lezen.','Welke oorspronkelijke lijn heb je straks voor Pp nodig?','De maatschappelijke lijn is al een brongegeven; een markering van Qe is nog door de leerling te maken.','Lees ook c, d en e voordat we de antwoorden bespreken.');
}
{
  const s=slide('Opgave 34 · Vragen c–e',{kind:'target-question',footer:title+' · Boekpagina 86'});
  const items=[['c (4p)','Bereken het maatschappelijk surplus vóór en na ingrijpen. Laat alle vier posten zien.'],['d (2p)','Markeer de efficiënte hoeveelheid en arceer het oorspronkelijke welvaartsverlies. Benoem basis en hoogte.'],['e (2p)','Beoordeel: “CS en PS dalen door de belasting, dus de maatschappij verliest.”']];
  items.forEach((r,i)=>{text(s,r[0],60,231+i*196,190,60,38,{bold:true,color:C.blue});text(s,r[1],270,231+i*196,1270,130,39);});
  notes(s,'86','Alle vijf deelvragen zijn nu getoond zonder oplossingen. De bron en figuur blijven beschikbaar via het boek. Geef tijd om het eigen werk te controleren voordat de bespreking start. De punten tellen op tot14.','Welke vier posten moeten zichtbaar zijn bij c?','Een juist eindgetal is onvoldoende wanneer de berekening en vier posten gevraagd zijn.','Start pas daarna de uitwerking van a.');
}
{
  const s=slide('Opgave 34a · De oorspronkelijke markt',{kind:'target-answer',footer:title+' · Boekpagina 86'});
  lines(s,['Derde partij: omwonenden','60 − Q = Q      60 = 2Q      Q₀ = 30 diensten per dag','P₀ = 60 − 30 = € 30 per dienst','Externe schade = 20 × 30 = € 600 per dag'],{y:222,step:148,size:40});
  notes(s,'86','Omwonenden ondervinden niet-vergoede overlast buiten de koop en verkoop. Zonder heffing zijn beide prijzen gelijk. Los60−Q=Q op: Q30. Controle op aanbod geeft eveneens P30. Totale schade20×30=600 per dag, over alle diensten.','Waarom vermenigvuldig je20 met30?','Twintig euro is schade per dienst;600 euro is de totale dagschade.','Voer nu de heffing in.');
}
{
  const s=slide('Opgave 34b · De heffingswig',{kind:'target-answer',footer:title+' · Boekpagina 86'});
  lines(s,['Pc = Pp + 20      60 − Q = Q + 20','40 = 2Q      Q₁ = 20 diensten per dag','Pc = 60 − 20 = € 40      Pp = € 20 per dienst','Controle: 40 − 20 = 20      Ontvangst: 20 × 20 = € 400 per dag'],{y:232,step:144,size:38});
  notes(s,'86','Begin met de wig, stel de functies gelijk in kopersprijzen en bereken eerst de hoeveelheid. Substitueer Q20 op de vraag voor Pc40 en oorspronkelijke aanbod voor Pp20. De overheid krijgt t×Q1=400 per dag. Controleer de wig20 en dat vraag en aanbod dezelfde Q gebruiken.','Welke hoeveelheid gebruik je voor de belastingontvangst?','De oude hoeveelheid30 levert niet de nieuwe ontvangst op.','Lees dezelfde uitkomst in de grafiek.');
}
{
  const s=slide('Opgave 34b · Beide prijzen bij Q = 20',{kind:'target-answer',footer:title+' · Boekpagina 86'});graph(s,T,{social:true,tax:true});
  text(s,'Pc = € 40\nPp = € 20\nWig = € 20',1150,280,390,217,39,{bold:true});
  text(s,'A + t = Q + 20\n= MK maatschappelijk',1150,594,390,137,33,{color:C.orange,bold:true});
  notes(s,'86','De nieuwe hoeveelheid20 hoort bij Pc40 op vraag en Pp20 op A. De horizontale verschuiving vergelijkt de kopersprijs60: A geeft Q60 en A+t Q40. De verticale wig bij Q20 is20. A+t en maatschappelijke MK vallen samen omdat beide opslagbedragen20 zijn.','Waar lees je de producentenontvangst af?','Pp is geen winst per dienst; productiekosten moeten nog betaald worden.','Vul de welvaartsrekening zonder heffing.');
}
{
  const s=slide('Opgave 34c · Vóór de heffing',{kind:'target-answer',footer:title+' · Boekpagina 86'});
  table(s,[['Post (€ per dag)','Berekening'],['CS','½ × 30 × (60 − 30) = 450'],['PS','½ × 30 × (30 − 0) = 450'],['Overheidsontvangst','0'],['Externe kosten','20 × 30 = 600'],['Maatschappelijk surplus','450 + 450 + 0 − 600 = 300']],60,218,1480,555,[580,900],35);
  notes(s,'86','Bij Q30 en P30 hebben CS en PS basis30 en hoogte30. De oorspronkelijke aanbodlijn begint hier bij0. Overheidsontvangst is0 en schade600. Het maatschappelijke surplus is300 euro per dag. Houd de externe kosten als aparte aftrekpost zichtbaar.','Waarom is de hoogte van PS hier30?','Het aanbodintercept is nul in deze boekopgave, niet16 zoals in het eigen voorbeeld.','Bereken dezelfde vier posten na ingrijpen.');
}
{
  const s=slide('Opgave 34c · Na de heffing',{kind:'target-answer',footer:title+' · Boekpagina 86'});
  table(s,[['Post (€ per dag)','Berekening'],['CS','½ × 20 × (60 − 40) = 200'],['PS','½ × 20 × (20 − 0) = 200'],['Overheidsontvangst','20 × 20 = 400'],['Externe kosten','20 × 20 = 400'],['Maatschappelijk surplus','200 + 200 + 400 − 400 = 400']],60,218,1480,502,[580,900],34);
  text(s,'€ 400 − € 300 = € 100 meer maatschappelijk surplus per dag',60,762,1480,69,37,{bold:true,color:C.blue});
  notes(s,'86','CS gebruikt Pc40, PS gebruikt Pp20. Beide driehoeken hebben basis20 en hoogte20, dus200. Tel overheidsontvangst400 erbij en trek resterende schade400 af: maatschappelijk surplus400. De toename is100 per dag. De overheid heeft niet noodzakelijk de omwonenden betaald.','Welke prijs gebruik je voor de hoogte van CS, en welke voor PS?','Het bestaan van overheidsontvangsten maakt de resterende externe schade niet nul.','Controleer de verbetering met de verliesdriehoek.');
}
{
  const s=slide('Opgave 34d · Efficiëntie en verliesgebied',{kind:'target-answer',footer:title+' · Boekpagina 86'});graph(s,T,{social:true,original:true,efficient:true,loss:true});
  text(s,'60 − Q = Q + 20\nQₑ = 20 per dag',1140,248,400,141,34,{bold:true});
  text(s,'Basis: 30 − 20 = 10\nHoogte: 50 − 30 = € 20',1140,442,400,128,32);
  text(s,'½ × 10 × 20\n= € 100 per dag',1140,667,400,123,37,{bold:true,color:C.loss});
  notes(s,'86','Efficiënte hoeveelheid volgt uit vraag gelijk aan maatschappelijke MK:60−Q=Q+20, dus20. Arceer tussen vraag en maatschappelijke MK van Q20 tot30. Bij Q30 is maatschappelijke MK50 en vraag30, hoogte20 euro per dienst. Basis10 diensten per dag. De oppervlakte100 euro per dag stemt overeen met de berekende verbetering.','Tussen welke lijnen ligt deze verliesdriehoek?','Gebruik niet de driehoek tussen vraag en private aanbodlijn. Die zou de externe kosten negeren.','Beoordeel de uitspraak over CS en PS.');
}
{
  const s=slide('Opgave 34e · Wie telt mee?',{kind:'target-answer',footer:title+' · Boekpagina 86'});
  table(s,[['Verandering (€ per dag)','Bedrag'],['CS + PS: 400 − 900','−500'],['Overheidsontvangst','+400'],['Minder externe schade: 600 − 400','+200'],['Maatschappelijk saldo','+100']],60,235,1480,433,[1120,360],35);
  text(s,'De uitspraak is onjuist in deze case.\nMaatschappelijk surplus stijgt van € 300 naar € 400 per dag.',60,710,1480,114,39,{bold:true,color:C.blue});
  notes(s,'86','De uitspraak negeert zowel overheidsontvangsten als afgenomen externe schade. CS+PS daalt500, de overheid krijgt400 en de schade daalt200. Saldo+100. Dit is geen bewijs dat ieder individu wint of iedere belasting juist is. Het tarief valt hier samen met bekende constante marginale schade; uitvoeringskosten en overige effecten ontbreken. Laat leerlingen één ontbrekende stap of uitleg in hun antwoord verbeteren.','Welke twee ontbrekende posten maken de uitspraak onjuist?','Vergelijk maatschappelijk surplus en verdeling niet alsof het dezelfde vraag is.','Noteer het resterende huiswerk op het overzicht.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviews,tables,charts,graphs,source:facts},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.2.4 Negatieve externe effecten – presentatie.pptx'),pythonExecutable:PYTHON,
  integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],
  fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,tables,charts,finalPath:result.finalPath,integrity:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,reimport:result.firstPartyImport.passed}));
