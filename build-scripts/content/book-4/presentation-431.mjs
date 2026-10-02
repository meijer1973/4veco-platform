// HOW TO ADAPT: verify the current paragraph, printed pages and complete target first.
// Keep explanation data separate from assigned exercises and reuse one overview.
// Runtime paths come from the installed presentation runtime; no local paths here.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
  PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';

const sourceManifest=JSON.parse(await fs.readFile(new URL('./presentation-431.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('431');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',title='Arbeidsvraag en arbeidsproductiviteit';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${sourceManifest.lessonCommit}/edities/books34-v3/`;
const tables=[],charts=[],slides=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(name,footer='§4.3.1 '+title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,name,60,42,1480,86,name.startsWith('Deze les')?46:52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:name});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, editie books34-v3, §4.3.1, gedrukte boekpagina ${page}. ${source}books/book-4/output/Boek_4_Compleet_v3.pdf\nAntwoordmodel: ${source}books/book-4/chapters/4.3/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. MokStudio en de getallen zijn voor deze les gemaakt. De boekverwijzing onderbouwt de methode, niet deze voorbeeldgegevens.':''}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
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
 const s=slide('Deze les: §4.3.1 '+title);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Arbeidsmarktrollen verklaren;\nproductiviteit, uren en kosten\nberekenen; bewegen of verschuiven.',972,244,565,122,30,{name:'overview-goals'});
 rule(s,972,374,568);text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 119 · Opgaven 1 en 2\n2: verkennen, theorie p. 114',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§4.3.1 · Opgaven 3 t/m 7\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'114, 119–122',`Laat de dia staan tijdens ${phase.toLowerCase()}. Start 1–2: p. 119. Basis 3: p. 119 en 4: p. 120. Zelfstandig 5: p. 120 en 6: p. 121. Doel 7: p. 122. Huiswerk 3 tot en met 7 maken en nakijken. Bonus 8 en herhaling 9 zijn extra. Opgave 1 herhaalt gemiddelde kosten en procentuele verandering uit Boek 2. De rolwisseling bij opgave 2 is nieuw: laat leerlingen de definitie en figuur op p. 114 gebruiken, hun keuze proberen te verklaren en twijfel noteren. Verwacht nog geen zelfstandige beheersing. Keer vóór basiswerk terug naar opgave 2 na de uitleg, laat opnieuw beantwoorden en bespreek de rollen. Startantwoorden voor feedback na de poging: 1a 2700/900 = 3 euro per poster; 1b (1080−900)/900 × 100% = 20%; 2 restaurant vraagt arbeid, kok biedt arbeid aan. De volledige route kan over meerdere lessen worden afgerond; de handleiding adviseert voorlopig twee lessen van 55 minuten, zonder gemeten tijdsfit.`,phase==='Startopdracht'?'Waar vind je steun voor de rolverdeling bij opgave 2?':'Welke stap in de route moet je nog afronden?','De hoofdstukhandleiding gebruikt lokale paginanummers 2–11. Hier staan de gedrukte complete-boekpagina’s 114–123.',active===7?'Laat het huiswerk noteren en herinner aan nakijken.':'Ga verder wanneer de klas klaar is voor de volgende fase.');
}
function exampleLabel(s,extra='MokStudio'){text(s,'Uitlegvoorbeeld — niet uit het boek',60,180,1480,42,28,{color:C.muted});text(s,extra,60,237,1480,65,39,{bold:true,color:C.blue});}
overview('Startopdracht',2);
{
 const s=slide('Wie koopt arbeid?');
 table(s,[['Markt','Huishoudens','Bedrijven'],['Goederenmarkt','Vragen producten','Bieden producten aan'],['Arbeidsmarkt','Bieden arbeid aan','Vragen arbeid']],60,231,1480,320,[420,530,530],36);
 text(s,'Loon is de prijs van arbeid.',60,605,1480,65,46,{bold:true,color:C.blue});
 text(s,'w = loon per uur\nL = hoeveelheid arbeid, met eenheid',60,713,1480,108,37);
 notes(s,'114','Een werknemer levert werktijd, de werkgever betaalt daarvoor loon. Arbeidsvraag is de hoeveelheid arbeid die werkgevers bij een bepaald loon willen inzetten. Een vacature is een nog niet vervulde arbeidsplaats. Verbind goederenverkoop met de behoefte aan personeel: meer vraag naar mokken kan meer vraag naar arbeid geven. Laat leerlingen nu hun verkennende antwoord op startopgave 2 opnieuw overwegen.','Wat levert een werknemer aan een werkgever?','In alledaagse taal biedt een bedrijf een baan aan. Op de arbeidsmarkt vraagt het bedrijf arbeid.','Fris eerst twee bekende verhoudingen op.');
}
{
 const s=slide('Opfrissen: per product en procenten');exampleLabel(s,'MokStudio verkoopt eerst 80, daarna 100 mokken');
 text(s,'€ 360 totale kosten bij 80 mokken',60,350,1480,60,38);
 text(s,'Gemiddelde kosten = 360 / 80 = € 4,50 per mok',60,435,1480,80,44,{bold:true,color:C.blue});rule(s,60,547,1480);
 text(s,'Procentuele verandering = (nieuw − oud) / oud × 100%',60,590,1480,60,37);
 text(s,'(100 − 80) / 80 × 100% = 25% meer mokken',60,695,1480,85,44,{bold:true,color:C.green});
 notes(s,'119','Herhaal de bewerkingen uit start 1 zonder die opgave uit te werken. Gemiddelde kosten zijn totale kosten gedeeld door productie. De oude waarde is de basis bij procentuele verandering. Dit losse verkoopvoorbeeld staat apart van het productieplan op de volgende dia’s. Voorkennisbronnen: Boek 2 §2.1.1, Gemiddelde totale kosten, en §2.2.1, Rekenen met de oude waarde.','Welk getal is de noemer bij een procentuele verandering?','Een verschil van 20 mokken is geen stijging van 20 procent.','Vertaal de hoeveelheid arbeid eerst naar de juiste eenheid.',true);
}
{
 const s=slide('Personen, arbeidsuren en fte');exampleLabel(s,'MokStudio: 10 medewerkers werken elk 30 uur per week');
 table(s,[['Grootheid','Berekening','Uitkomst'],['Personen','Medewerkers tellen','10 personen'],['Arbeidsuren per week','10 × 30','300 uur per week'],['Fte bij 40 uur voltijd','300 / 40','7,5 fte']],60,346,1480,340,[500,460,520],34);
 text(s,'Eén fte = de arbeidsduur van één voltijdbaan.',60,745,1480,69,40,{bold:true,color:C.blue});
 notes(s,'115','Een fulltime-equivalent drukt arbeidsduur uit. In dit eigen voorbeeld is voltijd 40 uur per week. Alle 10 medewerkers blijven personen, ook als hun uren samen 7,5 fte zijn. Gebruik de voltijdduur uit de bron, niet altijd automatisch 40. Vergelijk productie per persoon alleen wanneer periode en arbeidsduur duidelijk zijn.','Hoe kunnen 10 personen samen 7,5 fte werken?','Uren, personen en fte zijn verschillende grootheden.','Gebruik de 300 arbeidsuren in het productieplan.',true);
}
{
 const s=slide('Productieplan van MokStudio');exampleLabel(s);
 table(s,[['Grootheid','Oude week','Nieuwe week'],['Productie (mokken)','1.800','2.800'],['Arbeidsuren per week','300','Te berekenen'],['Productiviteit (mokken per uur)','Te berekenen','8'],['Volledige uurkosten','€ 27','€ 28,80']],60,337,1480,380,[740,370,370],33);
 text(s,'Elke kolom beschrijft één volledige week.',60,765,1480,58,37,{bold:true,color:C.blue});
 notes(s,'115–116','MokStudio neemt meer orders aan en gebruikt een ander werkproces. Productie, productiviteit en volledige uurkosten veranderen samen. De gegevens staan hier gegeven, zoals in een rekenplan. Het plan voorspelt niet hoe elke verandering afzonderlijk werkt. Uurkosten zijn alle loonkosten van de werkgever per arbeidsuur, en hoeven niet gelijk te zijn aan het brutoloon.','Welke grootheden zijn gegeven en welke ontbreken?','Voeg geen onbekende werkgeverskosten aan de volledige uurkosten toe.','Bereken eerst hoeveel mokken één arbeidsuur opleverde.',true);
}
{
 const s=slide('Arbeidsproductiviteit berekenen');exampleLabel(s,'Oude week: 1.800 mokken in 300 arbeidsuren');
 text(s,'Arbeidsproductiviteit = productie / arbeidsuren',60,366,1480,66,42,{bold:true});
 text(s,'1.800 / 300 = 6 mokken per arbeidsuur',60,493,1480,89,52,{bold:true,color:C.blue});
 text(s,'Controle: 300 uur × 6 mokken per uur = 1.800 mokken',60,679,1480,80,37);
 notes(s,'115','Deel productie per week door arbeidsuren per week. De week valt in de verhouding weg en de uitkomst is mokken per arbeidsuur. De eenheid vertelt wat het gemiddelde betekent. Schrijf deze uitkomst in de oude kolom van het plan.','Waarom delen we hier door uren en niet door personen?','Productie per week en uren per maand mogen niet ongemerkt worden gecombineerd.','Draai de verhouding om om de nieuwe arbeidsuren te vinden.',true);
}
{
 const s=slide('Benodigde arbeidsuren berekenen');exampleLabel(s,'Nieuwe week: 2.800 mokken, 8 mokken per arbeidsuur');
 text(s,'Arbeidsuren = productie / arbeidsproductiviteit',60,355,1480,75,42,{bold:true});
 text(s,'2.800 / 8 = 350 arbeidsuren per week',60,480,1480,85,51,{bold:true,color:C.green});
 text(s,'Controle: 350 × 8 = 2.800 mokken per week',60,622,1480,60,38);
 text(s,'Dat is 50 / 300 × 100% ≈ 16,7% meer uren.',60,732,1480,63,39,{bold:true});
 notes(s,'115–116','De oorspronkelijke 300 uren worden 350. De productie stijgt sterker dan de productiviteit, dus in dit plan zijn meer uren nodig. Controleer de nieuwe uren door met de nieuwe productiviteit te vermenigvuldigen. Rond het percentage pas aan het einde af. Er is nog geen informatie om 350 uren in een nieuw aantal personen te vertalen.','Hoe controleer je of 350 uur genoeg is?','Meer productiviteit betekent alleen bij gelijkblijvende productie zeker minder benodigde uren.','Bereken nu het loonbedrag dat op één mok drukt.',true);
}
{
 const s=slide('Loonkosten per mok');exampleLabel(s);
 text(s,'Loonkosten per product = uurkosten / productie per uur',60,340,1480,64,39,{bold:true});
 table(s,[['','Berekening','Loonkosten per mok'],['Oude week','€ 27 / 6','€ 4,50'],['Nieuwe week','€ 28,80 / 8','€ 3,60']],60,447,1480,256,[360,560,560],37);
 text(s,'Een duurder uur levert méér mokken op.',60,762,1480,62,42,{bold:true,color:C.orange});
 notes(s,'116','Het uurbedrag stijgt, maar de productie per uur stijgt sterker. Daarom daalt de loonkost per mok. Controle via totalen: oud 300 × 27 = 8100 euro en 8100/1800 = 4,50. Nieuw 350 × 28,80 = 10080 euro en 10080/2800 = 3,60. Loonkosten per product zijn totale loonkosten gedeeld door productie. Lagere loonkosten per product bewijzen geen lagere totale kostprijs: machines, energie en materiaal kunnen veranderen.','Kan het totale loonbedrag stijgen terwijl het bedrag per mok daalt?','Uurkosten, loon per werknemer en loonkosten per product zijn geen verwisselbare begrippen.','Controleer wat productiviteit bij gelijkblijvende productie doet.',true);
}
{
 const s=slide('Korte controle: hoeveel uren?');exampleLabel(s,'MokStudio produceert nu 8 mokken per arbeidsuur');
 text(s,'De productie blijft 1.800 mokken per week.',60,371,1480,79,44,{bold:true});
 text(s,'Hoeveel arbeidsuren zijn dan nodig?\nEn bij welke productie blijven 300 uren nodig?',60,524,1480,174,44,{color:C.blue});
 notes(s,'115–116','Laat iedereen kort zelfstandig rekenen. Dit zijn alternatieven binnen het eigen uitlegvoorbeeld, geen extra boekopgaven of huiswerk. Verwachte antwoorden na de poging: 1800/8 = 225 uur; 300 × 8 = 2400 mokken. De volgende dia vergelijkt deze alternatieven met het productieplan.','Welke grootheid houden we hier gelijk?','Gebruik bij beide vragen de nieuwe productiviteit, niet de oude 6.','Vergelijk de alternatieven na het ophalen van antwoorden.',true);
}
{
 const s=slide('Productie én productiviteit bepalen de uren');exampleLabel(s,'MokStudio: oude week 1.800 mokken, 6 per uur, 300 uur');
 table(s,[['Nieuwe productie per week','Nieuwe productiviteit','Benodigde uren per week'],['1.800 mokken','8 mokken per uur','1.800 / 8 = 225'],['2.400 mokken','8 mokken per uur','2.400 / 8 = 300'],['2.800 mokken','8 mokken per uur','2.800 / 8 = 350']],60,363,1480,344,[520,470,490],32);
 text(s,'Dezelfde hogere productiviteit, drie mogelijke uitkomsten.',60,761,1480,61,38,{bold:true,color:C.orange});
 notes(s,'116','Bij gelijkblijvende productie dalen uren, bij evenredig groeiende productie blijven ze gelijk, bij sterker groeiende productie stijgen ze. Deze drie alternatieven geven geen voorspelling voor de hele economie. Techniek kan taken vervangen en tegelijk nieuwe taken of extra productie mogelijk maken.','Welke rij hoort bij het oorspronkelijke nieuwe productieplan?','Uit alleen een productiviteitsstijging volgt niet de totale verandering van de arbeidsinzet.','Onderzoek loon en orders nu afzonderlijk in een grafiek.',true);
}
// Native numeric XY charts. Every labelled point and guide is tied to data.
function graph(stage){
 const s=slide(stage===0?'De arbeidsvraaglijn':stage===1?'Alleen het uurloon verandert':'Alleen de orders nemen toe');
 exampleLabel(s,'Apart model van MokStudio: andere omstandigheden blijven gelijk');
 const series=[];
 function line(name,x,y,color=C.blue,dashed=false,width=4){series.push({name,xValues:x,values:y,line:{fill:color,width,...(dashed?{style:'dashed'}:{})},marker:{symbol:'none'}});}
 function label(name,x,y,color=C.ink,point=false){
  if(point)series.push({name:'Punt '+name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:'circle',size:9,fill:color,line:{fill:color,width:1}}});
  // Separate invisible anchors keep text clear of the economic point/curve.
  series.push({name,xValues:[x],values:[Number((y+2.6).toFixed(4))],line:{fill:'none',width:0},marker:{symbol:'none'},dataLabelOverrides:[{idx:0,text:name,position:'t',showValue:false,textStyle:{typeface:FONT,fontSize:28,fill:color,bold:true}}]});
 }
 line('Arbeidsvraag oud',[0,300],[30,0]);label('Lᵥ oud',210,1,C.blue);
 line('Hulplijn A',[0,120,120],[18,18,0],C.muted,true,1.5);label('A',120,18,C.ink,true);
 if(stage===1){line('Hulplijn B',[0,60,60],[24,24,0],C.muted,true,1.5);label('B',60,24,C.orange,true);}
 if(stage===2){line('Arbeidsvraag nieuw',[0,360],[36,0],C.orange,true);label('Lᵥ nieuw',297,6.3,C.orange);line('Hulplijn C',[120,180,180],[18,18,0],C.muted,true,1.5);label('C',180,18,C.orange,true);line('Verschuiving',[120,180],[18,18],C.orange,false,3);line('Pijlpunt',[168,180,168],[18.8,18,17.2],C.orange,false,3);}
 const chart=s.charts.add('scatter',{position:{left:60,top:329,width:1050,height:475},series,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:360,majorUnit:60,numberFormatCode:'0',title:{text:'L (arbeidsuren per week)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:36,majorUnit:6,numberFormatCode:'0',title:{text:'w (€ per uur)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(chart,{fontFamily:FONT});charts.push(p.slides.items.length);
 text(s,stage===0?'Bij € 18 per uur':stage===1?'Van A naar B':'Van A naar C',1160,370,375,90,36,{bold:true,color:C.blue});
 text(s,stage===0?'120 arbeidsuren\nper week':stage===1?'w: € 18 naar € 24\nL: 120 naar 60 uur': 'w blijft € 18\nL: 120 naar 180 uur',1160,486,375,157,32);
 text(s,stage===0?'Een hoger loon maakt arbeid duurder.':stage===1?'Beweging langs\ndezelfde lijn':'Verschuiving\nnaar rechts',1160,674,375,137,34,{bold:true,color:stage===2?C.orange:C.blue});
 notes(s,'117',stage===0?'Dit afzonderlijke, zelfgemaakte model heeft Lᵥ = 300 − 10w, of w = 30 − 0,1L. Lees vanuit 18 euro horizontaal naar A en verticaal naar 120 uren. Werkgevers vragen arbeid om te produceren. Bij een hoger loon wordt arbeid duurder ten opzichte van wat zij oplevert. De kromme blijft hier een rechte lijn. De cijfers horen niet bij het eerdere volledige productieplan.':stage===1?'Alleen het loon stijgt van 18 naar 24 euro per uur. Orders, techniek en overige omstandigheden blijven gelijk. Lees 120 uren bij 18 euro en 60 uren bij 24 euro. Beide punten liggen op dezelfde vraaglijn: de gevraagde hoeveelheid arbeid daalt.':'Start opnieuw bij A: 18 euro per uur, 120 uren. Alleen orders nemen toe, loon en techniek blijven gelijk. In dit eigen voorbeeld wordt de vraag Lᵥ = 360 − 10w. Bij 18 euro zijn nu 180 uren gewenst. Het verschil is 60 uren bij hetzelfde loon. De pijl verbindt de verandering horizontaal. De nieuwe lijn ligt rechts van de oude. Minder orders zouden bij verder gelijke omstandigheden naar links verschuiven.',stage===0?'Hoe lees je bij een gegeven loon de gevraagde uren af?':stage===1?'Is er een nieuwe vraaglijn nodig als alleen het loon verandert?':'Wat houden we gelijk om de verschuiving te zien?','Een loonverandering verplaatst een punt langs een lijn. Een andere vraagbepalende factor kan de lijn verschuiven.',stage===0?'Verander nu alleen het loon.':stage===1?'Ga terug naar het oude loon en verander alleen de orders.':'Zet de afzonderlijke effecten naast elkaar.',true);
}
graph(0);graph(1);graph(2);
{
 const s=slide('Loon en orders veranderen tegelijk');exampleLabel(s,'Nieuwe situatie: hoger loon en meer orders, omvang onbekend');
 table(s,[['Afzonderlijke oorzaak','Wat verandert?','Effect op gevraagde uren'],['Alleen hoger loon','Punt langs de vraaglijn','Minder'],['Alleen extra orders','Vraaglijn naar rechts','Meer bij hetzelfde loon']],60,367,1480,299,[520,530,430],32);
 text(s,'Zonder de omvang van beide effecten blijft het saldo onbekend.',60,731,1480,96,40,{bold:true,color:C.orange});
 notes(s,'117–118','Deze kwalitatieve situatie geeft geen omvang van de orderverandering. Gebruik de vorige numerieke verschuiving dus niet als gegeven voor deze situatie. De effecten werken in tegengestelde richting. Meer, minder of evenveel uren zijn mogelijk. Het volledige rekenplan eerder bevatte wél concrete productie en productiviteit; dan kon je benodigde uren berekenen. Houd het rekenplan en de afzonderlijke vergelijkingen uit elkaar.','Welke ontbrekende informatie heb je nodig voor een conclusie over het totaal?','Twee veranderingen betekenen niet automatisch twee lijnverschuivingen.','Keer terug naar start 2 en begin daarna bij de basisopgaven.',true);
}
overview('Zelfstandig werken',4);
const targetFooter='§4.3.1 · Opgave 7 · Boekpagina 122';
{
 const s=slide('Opgave 7 · FrameWerk groeit',targetFooter);
 text(s,'FrameWerk produceert fietsframes voor export.\nDe tabel beschrijft het volledige productieplan.',60,191,1480,115,37,{bold:true});
 table(s,[['Grootheid','Oude week','Nieuwe week'],['Productie (frames)','2.400','3.300'],['Arbeidsuren','600','te berekenen'],['Productiviteit (frames/uur)','te berekenen','5,5'],['Volledige uurkosten','€ 24','€ 26,40']],60,347,1480,365,[740,370,370],33);
 text(s,'Los van dit rekenplan beoordeel je bij d twee afzonderlijke veranderingen.\nEr worden geen huidige wettelijke loonbedragen gebruikt.',60,745,1480,91,30);
 notes(s,'122','Dit is de volledige context en gegeven tabel van de echte doeloefening, zonder oplossingen. Bespreek pas na de eigen poging. Toon eerst ook alle deelvragen op de volgende twee dia’s. De arbeidsuren gelden voor de desbetreffende week; uurkosten zijn volledige werkgeverskosten.','Welke cellen moet je nog berekenen?','De context geeft een volledig plan. Deelvraag d onderzoekt afzonderlijke veranderingen los van dat plan.','Toon a en b zonder hun uitwerking.');
}
{
 const s=slide('Opgave 7 · Deelvragen a en b',targetFooter);
 text(s,'a. (3p) Bereken de oorspronkelijke arbeidsproductiviteit\nen de benodigde arbeidsuren in de nieuwe week.',60,234,1480,182,44);rule(s,60,476,1480);
 text(s,'b. (2p) Bereken de loonkosten per frame in beide weken.',60,544,1480,154,44);
 notes(s,'122','De vragen zijn volledig overgenomen, met de puntentelling. Laat leerlingen hun eigen antwoorden erbij houden. Nog geen berekeningen op het scherm voordat ook c en d getoond zijn.','Welke twee verschillende eenheden vraagt a?','Een aantal producten per uur is iets anders dan een aantal uren per week.','Toon ook de verklaringsvragen.');
}
{
 const s=slide('Opgave 7 · Deelvragen c en d',targetFooter);
 text(s,'c. (2p) De directeur zegt: “Een hogere productiviteit betekent altijd minder arbeidsuren.” Beoordeel dit met de tabel.',60,190,1480,172,41);rule(s,60,390,1480);
 text(s,'d. (3p) Benoem en verklaar de verandering van de arbeidsvraag bij:',60,432,1480,102,41);
 text(s,'(1) alleen een hoger uurloon\n(2) alleen extra exportorders bij gelijk loon en gelijke techniek.',102,569,1438,166,40);
 text(s,'Inleveren: berekeningen met eenheden en twee afzonderlijke verklaringen.',60,771,1480,63,31,{bold:true,color:C.blue});
 notes(s,'122','Dit zijn beide volledige verklaringsvragen. De uitspraak in c moet met het volledige plan worden beoordeeld. d vraagt niet om een nieuwe numerieke lijn: benoem telkens oorzaak, punt of lijn en betekenis. Alle deelvragen zijn nu zichtbaar geweest zonder antwoorden.','Waar moet jouw bewijs voor c vandaan komen?','Een algemeen antwoord over techniek zonder verwijzing naar deze tabel is onvoldoende.','Begin de uitwerking bij productiviteit en uren.');
}
{
 const s=slide('Opgave 7a · Productiviteit en arbeidsuren',targetFooter);
 text(s,'Arbeidsproductiviteit = productie / arbeidsuren',60,195,1480,62,39,{bold:true});
 text(s,'Oud: 2.400 / 600 = 4 frames per arbeidsuur',60,298,1480,79,48,{bold:true,color:C.blue});rule(s,60,412,1480);
 text(s,'Arbeidsuren = productie / arbeidsproductiviteit',60,458,1480,62,39,{bold:true});
 text(s,'Nieuw: 3.300 / 5,5 = 600 uur per week',60,560,1480,84,48,{bold:true,color:C.green});
 text(s,'Controle: 600 × 5,5 = 3.300 frames per week',60,744,1480,67,38);
 notes(s,'122','De oorspronkelijke productiviteit is 4 frames per arbeidsuur. Bij de nieuwe productiviteit van 5,5 frames per arbeidsuur zijn voor 3300 frames 600 uren per week nodig. Controleer oud ook: 600 × 4 = 2400. Vergelijk dezelfde periode.','Waarom blijft de benodigde arbeidsinzet hier 600 uren?','Gebruik de nieuwe productiviteit bij de nieuwe productie.','Deel nu in beide situaties de volledige uurkosten door de passende productiviteit.');
}
{
 const s=slide('Opgave 7b · Loonkosten per frame',targetFooter);
 text(s,'Loonkosten per product = uurkosten / productie per uur',60,200,1480,76,39,{bold:true});
 table(s,[['Week','Berekening','Loonkosten per frame'],['Oud','€ 24 / 4','€ 6'],['Nieuw','€ 26,40 / 5,5','€ 4,80']],60,357,1480,285,[340,600,540],38);
 text(s,'Het hogere uurbedrag wordt over meer frames verdeeld.',60,720,1480,89,41,{bold:true,color:C.orange});
 notes(s,'122','Oud 6 euro per frame; nieuw 4,80 euro per frame. Controle met totalen: 600 × 24 = 14400 en gedeeld door 2400 geeft 6. Nieuw 600 × 26,40 = 15840 en gedeeld door 3300 geeft 4,80. Uurkosten stijgen 10%, productiviteit 37,5%; per frame dalen de loonkosten. De vraag gaat over loonkosten, niet alle productiekosten.','Wat wordt groter: de kosten van een uur of de productie in dat uur?','Deel het uurbedrag niet direct door de volledige weekproductie.','Beoordeel nu de uitspraak van de directeur.');
}
{
 const s=slide('Opgave 7c · De uitspraak van de directeur',targetFooter);
 table(s,[['Grootheid','Oud','Nieuw'],['Productie (frames per week)','2.400','3.300'],['Productiviteit (frames per uur)','4','5,5'],['Arbeidsuren per week','600','600']],60,209,1480,320,[740,370,370],34);
 text(s,'De uitspraak is onjuist: de productiviteit stijgt,\nmaar het plan vraagt evenveel arbeidsuren.',60,582,1480,118,43,{bold:true,color:C.orange});
 text(s,'Productie en productiviteit stijgen allebei met 37,5%.',60,754,1480,65,38);
 notes(s,'122','Productie: (3300−2400)/2400 × 100% = 37,5%. Productiviteit: (5,5−4)/4 × 100% = 37,5%. Daarom blijft hun verhouding, benodigde arbeidsuren, gelijk. De uitkomsten uit a vormen al het gevraagde bewijs; percentages maken het verband expliciet. Alleen bij gelijkblijvende productie zou hogere productiviteit minder uren geven.','Welke twee rijen verklaren waarom 600 uren genoeg blijven?','Je kunt de conclusie niet baseren op uitsluitend de productiviteitsrij.','Onderzoek bij d twee losstaande oorzaken.');
}
{
 const s=slide('Opgave 7d(1) · Alleen een hoger uurloon',targetFooter);
 text(s,'Oorzaak',60,224,390,65,40,{bold:true,color:C.blue});text(s,'Het uurloon stijgt; andere omstandigheden blijven gelijk.',485,224,1055,113,40);
 rule(s,60,370,1480);text(s,'Model',60,414,390,65,40,{bold:true,color:C.blue});text(s,'Beweging langs dezelfde arbeidsvraaglijn.',485,414,1055,105,43,{bold:true});
 rule(s,60,555,1480);text(s,'Betekenis',60,603,390,65,40,{bold:true,color:C.blue});text(s,'Arbeid wordt duurder. Werkgevers vragen minder arbeid.',485,603,1055,135,40);
 notes(s,'122','Dit is de eerste afzonderlijke vergelijking uit d, geen afleiding uit de stijging van de volledige uurkosten in de tabel. Orders en techniek blijven gelijk. Alleen de prijs van arbeid verandert. In het eenvoudige model daalt de gevraagde hoeveelheid langs dezelfde lijn. Er is geen numerieke functie voor FrameWerk gegeven, dus maak geen nieuwe aantallen.','Welke andere omstandigheden houden we hier gelijk?','Volledige uurkosten uit het rekenplan zijn niet automatisch alleen het uurloon.','Houd bij de tweede vergelijking het loon gelijk.');
}
{
 const s=slide('Opgave 7d(2) · Alleen extra exportorders',targetFooter);
 text(s,'Oorzaak',60,224,390,65,40,{bold:true,color:C.orange});text(s,'Meer exportorders; loon en techniek blijven gelijk.',485,224,1055,113,40);
 rule(s,60,370,1480);text(s,'Model',60,414,390,65,40,{bold:true,color:C.orange});text(s,'De arbeidsvraaglijn verschuift naar rechts.',485,414,1055,105,43,{bold:true});
 rule(s,60,555,1480);text(s,'Betekenis',60,603,390,65,40,{bold:true,color:C.orange});text(s,'Voor de extra productie is bij hetzelfde loon meer arbeid nodig.',485,603,1055,135,40);
 notes(s,'122','De vraag naar het eindproduct neemt toe. Bij dezelfde techniek vraagt extra productie meer arbeidsinzet. Bij hetzelfde loon willen werkgevers meer arbeid inzetten: de vraaglijn schuift naar rechts. Benoem oorzaak, verandering van de lijn en betekenis. Het antwoordmodel vraagt hier geen berekend netto-effect van beide oorzaken samen.','Waarom vergelijken we bij hetzelfde loon?','Meer gevraagde arbeid door extra orders is niet alleen een beweging langs de oude lijn.','Controleer of alle onderdelen van de eigen antwoorden aanwezig zijn.');
}
{
 const s=slide('Antwoordcontrole bij opgave 7',targetFooter);
 const rows=[['a','4 frames per uur; 600 arbeidsuren per week.'],['b','€ 6 en € 4,80 per frame, met berekening.'],['c','Uitspraak beoordeeld met productie én productiviteit.'],['d','Twee oorzaken, twee afzonderlijke verklaringen.']];
 rows.forEach((a,i)=>{const y=211+i*139;text(s,a[0],60,y,80,65,44,{bold:true,color:C.blue});text(s,a[1],176,y,1364,93,39);});
 text(s,'Verbeter een ontbrekende eenheid, rekenstap of verklaring.',60,789,1480,45,32,{bold:true,color:C.orange});
 notes(s,'122','Laat leerlingen eigen werk verbeteren. a heeft twee verschillende grootheden; b twee kostbedragen per product; c een bewijs tegen altijd; d twee afzonderlijke oorzaak-gevolgketens. Juiste losse eindgetallen vervangen geen gevraagde uitleg.','Welk onderdeel van jouw antwoord moet nog worden aangevuld?','Een juiste richting zonder oorzaak en modelonderscheid beantwoordt d niet volledig.','Zet het resterende huiswerk in de agenda.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...sourceManifest,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,`4.3.1 ${title} – presentatie.pptx`),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
