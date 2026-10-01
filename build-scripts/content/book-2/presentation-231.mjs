// HOW TO ADAPT: derive a new assignment/operation manifest from its own book sources.
// Keep runtime discovery external; reuse the overview and graph helpers, not these data.
// Build: follow docs/workflows/classroom-presentation.md with a fresh PRESENTATION_WORKSPACE.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const assignment=JSON.parse(await fs.readFile(new URL('./presentation-231.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('231');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',hatch:'#7BACBF'};
const FONT='Arial', tables=[],charts=[],slides=[];
const source=`https://github.com/meijer1973/4veco-lessen/blob/${assignment.sourceCommit}/`+assignment.sourceEdition.split('/').map(encodeURIComponent).join('/')+'/';
const exampleLabel='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,footer='§2.3.1 Consumentensurplus'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Uitleg: ${explanation}\n\nVraag: ${question}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 2, chatuitgave 2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${source}boek/Boek_2_Compleet_Antwoorden.pdf\n${authored?'Uitlegvoorbeeld — niet uit het boek. Filmavond en Theatermiddag, met alle bijbehorende getallen, zijn voor deze presentatie bedacht. De boekpagina onderbouwt alleen de methode. Geen uitgewerkte toegewezen boekopgave.':''}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){
  t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){
   const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
   cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
  }
 }
 tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 8.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §2.3.1 Consumentensurplus');
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Q berekenen, lijnen tekenen,\nCS arceren en berekenen,\nhet kopersvoordeel uitleggen.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,397,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 76 · Opgaven 1 en 2\n2: verkennen met theorie p. 72\nReken- en tekenhulp: p. 74',972,452,565,112,30,{bold:active===2,name:'overview-start'});
 rule(s,972,578,568);
 text(s,'Huiswerk',972,600,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.3.1 Consumentensurplus\nBasis: 3, 4 en 5\nZelfstandig: 6 en 7 · Doel: 8\nOpgaven 3 t/m 8\nMaken en nakijken',972,655,565,182,30,{bold:active===7,name:'overview-homework'});
 notes(s,'72, 74, 76–79',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start: 1–2 op p.76. Basis: alle begeleide opgaven 3 (p.76), 4 en 5 (p.77). Zelfstandig: 6–7 (p.78). Doel: 8 (p.79). Huiswerk: 3 t/m 8 maken en nakijken. Bonus 9 en herhaling 10–11 zijn extra en niet toegewezen. Volledige route heeft geen gemeten lestijd; maak zo nodig thuis of in een volgende les af.\n\nStart 1 haalt functie-invulling, assensnijpunten en driehoeksoppervlakte op. Eerdere kennismaking bewijst geen beheersing: verwijs bij vastlopen naar p.74. Start 2 is verkenning van formeel CS. Lees op p.72 de blokken Betalingsbereidheid, Werkelijk betaalde prijs en Consumentensurplus. Laat leerlingen hun gebruikte definitie en twijfel aanwijzen. Geef nog geen uitgewerkt antwoord. Keer na de uitleg, bij de tweede overzichtsdia, terug naar 1–2: laat leerlingen beide antwoorden opnieuw bekijken en hun redenering voor 2 verbeteren vóór het basiswerk. Geef dan zo nodig feedback op reeds gemaakt werk.`,active===2?'Welk bedrag is het maximum en welk bedrag wordt echt betaald?':'Welke stap vraagt nog uitleg voordat je verder oefent?','Een verkennende start is geen bewijs van beheersing. Gebruik gedrukte boekpagina’s, niet de PDF-index.',active===7?'Laat het huiswerk in de agenda noteren.':'Ga door naar de volgende fase zodra leerlingen voldoende steun hebben.');
}
// Each graph is a native XY chart. Hatching is exact coordinate data, so it
// remains editable with the lines and labels and cannot drift after resizing.
function graph(s,{a,price,q,stage}){
 const xmax=a/.5, series=[];
 const baseSeries=(name,xValues,values,color,width=4)=>({name,xValues,values,line:{fill:color,width},marker:{symbol:'none'}});
 if(stage>=3){
  for(let x=3;x<q;x+=3)series.push(baseSeries('CS-arcering '+x,[x,x],[price,a-.5*x],C.hatch,2));
 }
 const v=baseSeries('V',[0,xmax],[a,0],C.blue,4);
 v.marker={symbol:'circle',size:6};
 series.push(v);
 const label=(name,x,y,color=C.ink,size=29,bold=true)=>({name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:'none'},dataLabelOverrides:[{idx:0,text:name,textStyle:{typeface:FONT,fontSize:size,bold,fill:color},fill:C.paper}]});
 // Labels are anchored in chart coordinates above the real endpoint/point markers.
 // This avoids exporters that ignore data-label position hints laying text on lines.
 series.push(label(`(0; ${a})`,0,a+3,C.ink,26,false));
 series.push(label(`(${xmax}; 0)`,xmax,3,C.ink,26,false));
 series.push(label('V',xmax-9,10,C.blue));
 if(stage>=2){
  series.push(baseSeries('Prijslijn',[0,120],[price,price],C.orange,3));
  const guide=baseSeries('Hoeveelheid',[q,q],[0,price],C.muted,2);guide.line.style='dashed';series.push(guide);
  series.push({name:'Snijpunt',xValues:[q],values:[price],line:{fill:'none',width:0},marker:{symbol:'circle',size:8}});
  series.push(label(`(${q}; ${price})`,q,price+4,C.ink,26,false));
  series.push(label(`P = ${price}`,106,price+4,C.orange));
 }
 if(stage>=3)series.push(label('CS',Number((q*.27).toFixed(3)),Number((price+(a-price)*.35).toFixed(3)),C.blue));
 const ch=s.charts.add('scatter',{position:{left:55,top:252,width:1010,height:564},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,
  dataLabels:{showValue:false,showSeriesName:false,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},
  xAxis:{min:0,max:120,majorUnit:20,numberFormatCode:'0',title:{text:'Q (kaartjes)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:null},
  yAxis:{min:0,max:60,majorUnit:10,numberFormatCode:'0',title:{text:'P (€ per kaartje)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
}
const eg=()=>slide('Theatermiddag',exampleLabel);
const target=(title)=>slide(title,'§2.3.1 Consumentensurplus · Opgave 8 · Boekpagina 79');
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Hoeveelheid','Je berekent Q bij een gegeven prijs.'],['Grafiek','Je tekent V en de prijslijn met assen, eenheden en snijpunten.'],['Consumentensurplus','Je arceert het gebied en berekent de oppervlakte.'],['Betekenis','Je legt het gezamenlijke voordeel van de kopers uit.']];
 rows.forEach((r,i)=>{const y=207+148*i;text(s,r[0],60,y,600,85,39,{bold:true,color:C.blue});text(s,r[1],700,y,840,105,37);if(i<3)rule(s,60,y+117,1480);});
 notes(s,'72–75','De doelopgave vraagt het hele proces: berekenen, tekenen, arceren en uitleggen. De prijs is gegeven. De kern van deze les is formeel CS als oppervlak.','Welke stap is meer dan alleen een getal uitrekenen?','Een juist CS-bedrag alleen beantwoordt een tekenvraag niet.','Begin bij het voordeel van één koper.');
}
{
 const s=slide('Het voordeel van één koper',exampleLabel);
 text(s,'Filmavond: Noor wil maximaal € 22 betalen. Het kaartje kost € 9.',60,188,1480,100,38,{bold:true});
 table(s,[['Betalingsbereidheid','Werkelijk betaald','Consumentensurplus'],['€ 22','€ 9','22 − 9 = € 13']],60,331,1480,230,[490,470,520],35);
 text(s,'CS = betalingsbereidheid − betaalde prijs',60,616,1480,77,44,{bold:true,color:C.blue});
 text(s,'Het bezoek is voor Noor € 13 meer waard dan zij betaalt.',60,728,1480,92,38);
 notes(s,'72','Noor koopt één kaartje. Maximaal willen betalen is een waardering. Zij betaalt 9 euro, niet 22 euro. Het verschil van 13 euro is haar voordeel. Dit is een hernieuwde, formele uitleg na de informele kennismaking in Boek 1 §1.2.1.','Krijgt Noor € 13 terug aan de kassa?','CS is geen terugbetaling en ook geen korting ten opzichte van een oude winkelprijs.','Vergelijk meerdere kopers die dezelfde prijs betalen.',true);
}
{
 const s=slide('Losse kopers: voordelen optellen',exampleLabel);
 text(s,'Filmavond: iedereen wil hoogstens één kaartje. De prijs is € 9.',60,186,1480,78,37,{bold:true});
 table(s,[['Koper','Maximaal betalen','Aankoop?','CS'],['Noor','€ 22','Ja','22 − 9 = € 13'],['Sam','€ 15','Ja','15 − 9 = € 6'],['Bo','€ 7','Nee','€ 0']],60,300,1480,345,[285,455,280,460],34);
 text(s,'Gezamenlijk CS = 13 + 6 = € 19',60,698,1480,65,43,{bold:true,color:C.blue});
 text(s,'Alleen de gekochte kaartjes tellen mee.',60,775,1480,54,35);
 notes(s,'72–73','Bij een losse lijst kopers bereken je de werkelijke voordelen en tel je die op. Bo koopt niet bij 9 euro, dus Bo heeft geen negatief CS. Dit is een discrete som van 2 kaartjes.','Waarom tel je bij Bo geen −€ 2 op?','Een tabel met drie personen wordt niet zonder modelwijziging een doorlopende rechte lijn.','We schakelen nu expliciet over naar een andere context en een doorlopend marktmodel.',true);
}
{
 const s=eg();
 text(s,'Een doorlopende vraaglijn voor een andere markt',60,186,1480,62,37,{bold:true,color:C.blue});
 text(s,'P = 40 − 0,5Q',60,298,1480,83,54,{bold:true});
 text(s,'P: euro per kaartje\nQ: aantal kaartjes voor deze theatermiddag',60,415,1480,126,39);
 text(s,'Gegeven prijs: € 16 per kaartje',60,580,1480,67,43,{bold:true,color:C.orange});
 text(s,'Er zijn genoeg kaartjes. Alle gevraagde kaartjes gaan naar de vragers met de hoogste betalingsbereidheid.',60,686,1480,118,36);
 notes(s,'73–75','Dit is een nieuw, doorlopend lineair marktmodel, niet de tabel van Noor, Sam en Bo. Op V lees je van links naar rechts een dalende betalingsbereidheid. De gegeven prijs bepaalt via deze vraagfunctie Q; er is geen aanbodfunctie. De toewijzing en voldoende aanbod maken het volledige driehoeksgebied geldig.','Welke informatie geeft V over wat kopers willen betalen?','De 40 in de formule is een prijs bij Q = 0, geen aantal kaartjes. De gegeven prijs is niet berekend als evenwichtsprijs.','Vul eerst de gegeven prijs in en los op naar Q.',true);
}
{
 const s=slide('De hoeveelheid bij P = € 16',exampleLabel);
 text(s,'Theatermiddag: P = 40 − 0,5Q',60,186,1480,61,37,{bold:true,color:C.blue});
 const r=[['Prijs invullen','16 = 40 − 0,5Q'],['0,5Q links, 16 rechts','0,5Q = 40 − 16 = 24'],['Delen door 0,5','Q = 24 / 0,5 = 48 kaartjes']];
 r.forEach((a,i)=>{const y=298+i*133;text(s,a[0],60,y,590,78,35);text(s,a[1],687,y,850,81,43,{bold:true});});
 text(s,'Controle: 40 − 0,5 × 48 = € 16 per kaartje',60,697,1480,62,36,{bold:true,color:C.green});
 text(s,'Q = 48 is hier gevraagd én verkocht.\nZonder aanbodfunctie is dit geen berekend marktevenwicht.',60,764,1480,73,30);
 notes(s,'74–75','Tel aan beide kanten 0,5Q op en trek aan beide kanten 16 af. Zo krijg je 0,5Q = 24. Deel beide kanten door 0,5. Deze vorm P(Q) kan anders zijn dan de Q(P)-notatie uit Boek 1 §1.3.2, dus doe de algebra expliciet voor. Controleer met de originele functie.','Waarom is delen door 0,5 hetzelfde als vermenigvuldigen met 2?','Zonder aanbodfunctie is Q = 48 geen berekend marktevenwicht. Noem alleen de gevraagde en hier verkochte hoeveelheid.','Bereken daarna de twee punten waarmee je V tekent.',true);
}
{
 const s=slide('Twee assensnijpunten voor V',exampleLabel);
 text(s,'Theatermiddag: P = 40 − 0,5Q',60,186,1480,61,37,{bold:true,color:C.blue});
 table(s,[['Kies nul op één as','Berekening','Punt (Q; P)'],['Q = 0','P = 40 − 0,5 × 0 = 40','(0; 40)'],['P = 0','0,5Q = 40\nQ = 40 / 0,5 = 80','(80; 0)']],60,300,1480,340,[410,695,375],34);
 text(s,'Horizontaal: Q (kaartjes)\nVerticaal: P (€ per kaartje)',60,696,1480,105,39,{bold:true});
 notes(s,'74–75','Een punt schrijf je als (Q; P), omdat Q horizontaal en P verticaal staat. Op de verticale as is Q nul. Op de horizontale as is P nul. Verbind de twee gevonden punten met een rechte lijn.','Welke variabele is nul op de P-as?','Verwissel de assen of de volgorde in het coördinatenpaar niet.','Zet de berekende punten nu in een geschaald assenstelsel.',true);
}
{
 const s=slide('De vraaglijn tekenen',exampleLabel);
 text(s,'Theatermiddag: P = 40 − 0,5Q',60,183,1480,58,37,{bold:true,color:C.blue});graph(s,{a:40,price:16,q:48,stage:1});
 text(s,'Assen en schaal',1120,291,415,60,36,{bold:true});text(s,'Q horizontaal\nP verticaal\nNul op beide assen',1120,379,415,173,34);
 text(s,'V verbindt\n(0; 40) en (80; 0).',1120,596,415,125,35,{bold:true,color:C.blue});
 notes(s,'74–75','Laat leerlingen de assen, schaalverdeling en eenheden benoemen. Elke stap horizontaal is 20 kaartjes, verticaal 10 euro per kaartje. De lijn stopt op de Q-as bij 80. De grotere schaal laat ruimte voor labels en blijft op de volgende grafieken gelijk.','Waar teken je het punt (80; 0)?','Een negatieve voortzetting is voor dit marktmodel niet nodig. De vraaglijn toont hoeveel kopers voor een extra kaartje overhebben.','Voeg de horizontale prijs toe.',true);
}
{
 const s=slide('De prijslijn en de verkochte hoeveelheid',exampleLabel);
 text(s,'Theatermiddag: P = 40 − 0,5Q en prijs € 16',60,183,1480,58,37,{bold:true,color:C.blue});graph(s,{a:40,price:16,q:48,stage:2});
 text(s,'P = 16',1120,291,415,60,38,{bold:true,color:C.orange});text(s,'Een horizontale lijn:\nelk kaartje kost\nevenveel.',1120,380,415,180,34);
 text(s,'Snijpunt (48; 16)\nDus Q = 48 kaartjes.',1120,601,415,128,34,{bold:true});
 notes(s,'74–75','De prijs is een horizontale lijn door 16, tussen 10 en 20 op de P-as. Vanuit het snijpunt met V ga je verticaal naar Q = 48. Gebruik de berekening voor de precieze coördinaat, de grafiek als controle.','Welke hoeveelheid lees je onder het snijpunt af?','Het kruisen van V met een gegeven prijslijn is op zichzelf geen berekend vraag-aanbodevenwicht.','Kies alleen het voordeel boven de betaling bij die 48 kaartjes.',true);
}
{
 const s=slide('Het consumentensurplus als gebied',exampleLabel);
 text(s,'Theatermiddag: de 48 verkochte kaartjes',60,183,1480,58,37,{bold:true,color:C.blue});graph(s,{a:40,price:16,q:48,stage:3});
 text(s,'CS',1120,282,415,56,40,{bold:true,color:C.blue});text(s,'Onder V\nBoven P = 16\nVan Q = 0 tot 48',1120,356,415,163,33);
 text(s,'Basis: 48 kaartjes\nHoogte: 40 − 16\n= € 24 per kaartje',1120,568,415,191,34,{bold:true});
 notes(s,'73–75','De arcering telt het voordeel voor alle verkochte kaartjes in het doorlopende model. De drie hoekpunten zijn (0;16), (0;40), (48;16). De basis loopt horizontaal van 0 tot 48. De loodrechte hoogte loopt verticaal van 16 tot 40. Dit is 24, niet 16.','Waarom hoort het gebied onder P = 16 niet bij CS?','Onder de prijslijn ligt de betaling. Rechts van Q = 48 zijn in deze situatie geen verkochte kaartjes om mee te tellen.','Bereken de oppervlakte met deze basis en hoogte.',true);
}
{
 const s=slide('De oppervlakte berekenen',exampleLabel);
 text(s,'Een driehoek is de helft van basis × hoogte.',60,186,1480,70,39,{bold:true});
 table(s,[['Basis','Loodrechte hoogte'],['48 kaartjes','40 − 16 = € 24 per kaartje']],60,305,1480,205,[670,810],37);
 text(s,'CS = ½ × basis × hoogte',60,566,1480,75,45,{bold:true,color:C.blue});
 text(s,'CS = ½ × 48 × 24 = € 576',60,664,1480,81,49,{bold:true});
 text(s,'Kaartjes × € per kaartje = €',60,771,1480,58,36,{color:C.green,bold:true});
 notes(s,'74–75','Herhaal de wiskundige regel expliciet: de driehoek is de helft van een rechthoek met dezelfde basis en loodrechte hoogte. 48 × 24 = 1152; de helft is 576. De hoogte loopt vanaf de prijs, niet vanaf nul. De uitkomst is euro voor de groep, niet euro per kaartje.','Welke twee grootheden vermenigvuldig je, en welke eenheid blijft over?','De formule ½ × Q × P is hier fout: ½ × 48 × 16 zou 384 geven.','Leg uit wat de 576 euro in deze situatie betekent.',true);
}
{
 const s=slide('Voordeel en betaling',exampleLabel);
 text(s,'Theatermiddag: 48 verkochte kaartjes bij P = € 16',60,186,1480,85,37,{bold:true});
 table(s,[['Bedrag','Berekening','Betekenis'],['CS','€ 576','Wat kopers samen méér overhebben dan zij betalen'],['Betaling / omzet','16 × 48 = € 768','Wat kopers samen werkelijk betalen']],60,309,1480,333,[350,425,705],34);
 text(s,'De kopers hebben samen € 576 meer over voor de 48 kaartjes dan zij werkelijk betalen.',60,700,1480,120,42,{bold:true,color:C.blue});
 notes(s,'72–75','De vraag is naar de groep kopers. CS is het totale extra voordeel boven de betaling voor de 48 gekochte kaartjes. De gezamenlijke bereidheid voor die kaartjes is 576 + 768 = 1344 euro, maar niemand krijgt het CS terugbetaald.','Welk bedrag ontvangt de verkoper?','€ 576 is geen omzet en geen voordeel per koper. Verwar betaling niet met waardering.','Controleer de keuze van de hoogte met een korte vraag.',true);
}
function check(reveal){
 const s=slide(reveal?'Korte controle: de juiste hoogte':'Korte controle',exampleLabel);
 text(s,'Theatermiddag: P = 40 − 0,5Q, prijs € 16 en Q = 48',60,188,1480,93,38,{bold:true});
 text(s,'Een leerling rekent: CS = ½ × 48 × 16.',60,340,1480,96,47,{bold:true,color:C.blue});
 if(!reveal){text(s,'Welk deel van deze berekening moet veranderen?\nLeg uit met de grenzen van het CS-gebied.',60,535,1480,165,42);}
 else{text(s,'De hoogte is 40 − 16 = € 24 per kaartje.',60,510,1480,79,44,{bold:true});text(s,'CS = ½ × 48 × 24 = € 576',60,631,1480,82,46,{bold:true,color:C.green});text(s,'Je meet vanaf de prijslijn tot de bovenkant van V.',60,765,1480,64,36);}
 notes(s,'74–75',reveal?'Laat een leerling benoemen waar de hoogte in de grafiek ligt. Het getal 16 is de prijs, maar de juiste hoogte is 24.':'Laat leerlingen eerst zelf nadenken. Dit is een korte begripscheck op het eigen uitlegvoorbeeld en geen extra huiswerkopgave.','Tussen welke twee prijzen loopt de hoogte?','Een juist basisgetal maakt een verkeerde hoogte nog niet goed.',reveal?'Keer terug naar start 1–2 voordat leerlingen de basisopgaven maken.':'Toon de uitwerking na de reacties.',true);
}
check(false);check(true);
overview('Zelfstandig werken',4);
{
 const s=target('Opgave 8 · Concertkaartjes');
 text(s,'Voor concertkaartjes geldt de vraagfunctie:',60,190,1480,60,37);
 text(s,'P = 50 − 0,5Q',60,277,1480,83,55,{bold:true,color:C.blue});
 text(s,'P is de prijs in euro per kaartje.\nQ is het aantal gevraagde kaartjes.',60,398,1480,116,38);
 text(s,'De gegeven marktprijs is € 20.',60,550,1480,68,44,{bold:true,color:C.orange});
 text(s,'Er zijn voldoende kaartjes beschikbaar. Alle bij deze prijs gevraagde kaartjes worden verkocht aan de vragers met de hoogste betalingsbereidheid.',60,644,1480,118,36);
 text(s,'Er is in deze opgave geen aanbodfunctie.',60,788,1480,47,33,{bold:true});
 notes(s,'79','Start deze bespreking nadat leerlingen zelf doelopgave 8 hebben geprobeerd. Dit is de volledige context met alle gegevens en aannames uit de echte boekopgave. De context is nu concertkaartjes, niet Theatermiddag.','Welke gegevens veranderen ten opzichte van het uitlegvoorbeeld?','Neem geen getal of uitkomst uit de vorige context over.','Toon eerst alle deelvragen, pas daarna de antwoorden.');
}
{
 const s=target('Opgave 8 · Deelvragen a en b');
 text(s,'a) Bereken de gevraagde hoeveelheid bij P = € 20.\nNoem dit niet de evenwichtshoeveelheid.',60,193,1480,149,39);
 rule(s,60,396,1480);
 text(s,'b) Teken de vraaglijn en de horizontale prijslijn in één assenstelsel.',60,446,1480,124,39);
 text(s,'Benoem de horizontale as als Q (kaartjes) en de verticale as als P (€ per kaartje).',60,598,1480,115,37);
 text(s,'Noteer de snijpunten van de vraaglijn en het snijpunt met de prijslijn.',60,750,1480,88,37);
 notes(s,'79','Deze vragen zijn inhoudelijk volledig overgenomen. De opmaak verdeelt b in leesbare zinnen. Er staat nog geen oplossing op de dia.','Welke drie punten moet je straks in je tekening terugvinden?','Alleen twee lijnen tekenen zonder assen, eenheden en punten is onvoldoende voor b.','Laat ook c, d en e zien voordat je de uitwerking opent.');
}
{
 const s=target('Opgave 8 · Deelvragen c, d en e');
 text(s,'c) Arceer en benoem in je grafiek het consumentensurplus.',60,203,1480,133,40);
 rule(s,60,367,1480);
 text(s,'d) Bereken het consumentensurplus als oppervlakte van een driehoek\nen noteer de eenheid.',60,410,1480,135,40);
 rule(s,60,583,1480);
 text(s,'e) Leg uit wat het berekende consumentensurplus voor de kopers als groep betekent.',60,636,1480,139,40);
 notes(s,'79','Nu zijn alle vijf deelvragen zonder antwoorden zichtbaar geweest. Laat leerlingen hun eigen werk erbij houden en pas straks verbeteren.','Bij welke deelvraag heb je woorden nodig naast getallen?','Een berekening vervangt de gevraagde arcering niet, en een definitie zonder context vervangt e niet.','Bespreek eerst a: invullen, oplossen en controleren.');
}
{
 const s=target('Opgave 8a · De gevraagde hoeveelheid');
 text(s,'P = 50 − 0,5Q en P = € 20',60,187,1480,68,39,{bold:true,color:C.blue});
 const r=[['Invullen','20 = 50 − 0,5Q'],['Herschrijven','0,5Q = 50 − 20 = 30'],['Delen','Q = 30 / 0,5 = 60 kaartjes']];
 r.forEach((a,i)=>{const y=300+126*i;text(s,a[0],60,y,430,65,36);text(s,a[1],550,y,990,75,45,{bold:true});});
 text(s,'Controle: 50 − 0,5 × 60 = € 20 per kaartje',60,708,1480,60,36,{bold:true,color:C.green});
 text(s,'Gevraagd én verkocht. Zonder aanbodfunctie geen berekend evenwicht.',60,790,1480,43,31);
 notes(s,'79','Tel 0,5Q op en trek 20 af aan beide kanten. 0,5Q = 30; deel door 0,5 voor 60 kaartjes. Er is voldoende beschikbaar, zodat de gevraagde hoeveelheid ook werkelijk verkocht wordt.','Waarom mag je wel verkocht zeggen maar geen berekend marktevenwicht?','Je hebt geen vraag en aanbod gelijkgesteld.','Bepaal de assensnijpunten voor de tekening.');
}
{
 const s=target('Opgave 8b · De punten berekenen');
 text(s,'Vraaglijn: P = 50 − 0,5Q',60,187,1480,62,39,{bold:true,color:C.blue});
 table(s,[['Kies','Berekening','Punt (Q; P)'],['Q = 0','P = 50 − 0,5 × 0 = 50','(0; 50)'],['P = 0','0,5Q = 50\nQ = 50 / 0,5 = 100','(100; 0)'],['P = 20','Q = 60 uit deelvraag a','(60; 20)']],60,300,1480,382,[295,805,380],34);
 text(s,'De eerste twee punten bepalen V.\nHet derde punt ligt ook op de horizontale prijslijn.',60,725,1480,111,38,{bold:true});
 notes(s,'79','Elke rij koppelt een gekozen prijs of hoeveelheid aan de bijbehorende andere variabele. De assensnijpunten liggen op de vraaglijn. Het snijpunt met de prijslijn volgt uit a.','Hoe kun je controleren of (60; 20) op V ligt?','Punten noteren als (P; Q) verwisselt de assen.','Zet de drie punten in het assenstelsel.');
}
{
 const s=target('Opgave 8b · Vraaglijn en prijslijn');
 text(s,'Concertkaartjes: P = 50 − 0,5Q en prijs € 20',60,183,1480,58,37,{bold:true,color:C.blue});graph(s,{a:50,price:20,q:60,stage:2});
 text(s,'V door',1120,282,415,52,37,{bold:true,color:C.blue});text(s,'(0; 50)\nen (100; 0)',1120,360,415,112,37);
 text(s,'Prijslijn P = 20',1120,519,415,60,35,{bold:true,color:C.orange});text(s,'Snijpunt:\n(60; 20)',1120,624,415,129,39,{bold:true});
 notes(s,'79','De assen staan met grootheid en eenheid op de grafiek. V loopt door de twee assensnijpunten. De horizontale prijslijn op 20 snijdt V exact op Q = 60. De verticale stippellijn is een afleeshulp, geen aanbodlijn.','Welke lijn is alleen een afleeshulp?','Een stijgende aanbodlijn toevoegen is hier niet toegestaan: die is niet gegeven.','Arceer nu het gebied voor de kopers.');
}
{
 const s=target('Opgave 8c · Het CS-gebied');
 text(s,'Concertkaartjes: boven de prijs, onder de vraaglijn',60,183,1480,58,37,{bold:true,color:C.blue});graph(s,{a:50,price:20,q:60,stage:3});
 text(s,'Drie hoekpunten',1120,282,415,58,36,{bold:true});text(s,'(0; 20)\n(0; 50)\n(60; 20)',1120,375,415,184,40);
 text(s,'Arceer de driehoek\nen schrijf CS\nin het gebied.',1120,602,415,166,35,{bold:true,color:C.blue});
 notes(s,'79','Controleer de echte tekening van leerlingen. Het gebied begint bij de prijs 20, loopt links tot 50 en eindigt rechts bij het snijpunt 60;20. Het label CS staat binnen de arcering. De schaal is identiek aan de vorige dia.','Hoort de rechthoek van Q = 0 tot 60 onder P = 20 bij CS?','De rechthoek is de gezamenlijke betaling. Alleen het extra voordeel boven de prijs telt mee.','Gebruik de basis en loodrechte hoogte van deze driehoek.');
}
{
 const s=target('Opgave 8d · Het CS berekenen');
 table(s,[['Basis','Loodrechte hoogte'],['60 kaartjes','50 − 20 = € 30 per kaartje']],60,205,1480,223,[655,825],38);
 text(s,'CS = ½ × basis × hoogte',60,489,1480,82,45,{bold:true,color:C.blue});
 text(s,'CS = ½ × 60 × (50 − 20)',60,596,1480,78,46);
 text(s,'CS = € 900',60,699,1480,76,53,{bold:true,color:C.green});
 text(s,'Eenheid: kaartjes × € per kaartje = €',60,794,1480,43,32);
 notes(s,'79','De hoogte is 30 euro per kaartje, geen 20. 60 × 30 = 1800; de helft is 900. Controleer dat het antwoord in euro voor de hele groep staat.','Waar komt de 30 in de berekening vandaan?','De prijs 20 gebruiken als hoogte meet het verkeerde gebied.','Leg het gevonden bedrag uit voor de kopers als groep.');
}
{
 const s=target('Opgave 8e · Betekenis voor de kopers');
 text(s,'De kopers hebben samen € 900 meer over voor de 60 gekochte kaartjes dan zij werkelijk betalen.',60,199,1480,183,47,{bold:true,color:C.blue});
 rule(s,60,439,1480);
 text(s,'Ter controle: wat wordt er werkelijk betaald?',60,486,1480,63,38,{bold:true});
 text(s,'20 × 60 = € 1.200',60,579,1480,83,47);
 text(s,'CS meet het gezamenlijke extra voordeel.\nHet bedrag wordt niet aan de kopers terugbetaald.',60,722,1480,111,38);
 notes(s,'79','Voor e moet de economische betekenis én de groep van 60 verkochte kaartjes duidelijk zijn. 900 is het gezamenlijke verschil tussen bereidheid en betaling. De omzetcontrole 1200 is aanvullend, geen extra boekdeelvraag. Laat leerlingen één ontbrekende rekenstap, eenheid, grafieklabel of uitleg verbeteren.','Welke woorden laten zien dat jouw antwoord over alle kopers samen gaat?','Het CS is geen omzet, geen teruggave en geen bedrag per koper.','Laat de gezamenlijke overzichtsdia staan bij de afsluiting.');
}
overview('Afsluiting / huiswerk',7);
if(p.slides.items.length!==25)throw new Error('Update the slide trace before changing slide count.');
await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides:assignment.overviewSlides,tables,charts},null,2));
const candidate=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
const refRelative=Object.keys(assignment.sourceFiles).find(x=>x.endsWith('presentatie.pptx'));
const referencePath=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..','4veco-lessen',refRelative);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,'2.3.1 Consumentensurplus – presentatie.pptx'),pythonExecutable:PYTHON,
 integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],
 fontPolicy:{basis:'reference',families:[FONT],referencePath,referenceSha256:assignment.sourceFiles[refRelative]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,
 materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({finalPath:result.finalPath,slides:p.slides.items.length,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
