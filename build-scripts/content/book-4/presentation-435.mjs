// HOW TO ADAPT: read current manuscript, teacher route, answers and printed pages.
// Preserve the shared overview, source/practice distinction and full target.
// Runtime paths come from the installed presentation runtime through environment.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, PLATFORM, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('435');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', title='4.3.5 Gemengde opgaven arbeidsmarkt';
const commit='e734532a42b27732ac25ce990fc9448b12309d28';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${commit}/edities/books34-v3/books/book-4/`;
const chapter=path.resolve(PLATFORM,'../4veco-lessen/edities/books34-v3/books/book-4/chapters/4.3');
const tables=[],charts=[],slides=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, books34-v3, broncommit ${commit}. ${page}. ${source}output/Boek_4_Compleet_v3.pdf\nManuscript: ${source}chapters/4.3/4.3.5%20manuscript.md\nAntwoordmodel: ${source}chapters/4.3/Antwoorden.md\nDocenteninformatie: ${source}chapters/4.3/Docenteninformatie.md\n${extra}`);
}
function slide(heading,footer='§4.3.5 Gemengde opgaven: arbeidsmarkt'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,heading,60,42,1480,95,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:heading});return s;
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
   cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
  }
 } tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 40.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=p.slides.add();s.background.fill=C.paper;overviews.push(p.slides.items.length);
 slides.push({number:p.slides.items.length,title:'Deze les: §4.3.5 Gemengde opgaven: arbeidsmarkt'});
 text(s,'Deze les: §4.3.5 Gemengde opgaven: arbeidsmarkt',60,34,1480,75,47,{bold:true,name:'overview-title'});
 text(s,'Nu: '+phase,60,113,1480,43,30,{bold:true,color:C.blue,name:'phase'});rule(s,60,165,1480);
 text(s,'Lesroute',60,196,835,45,35,{bold:true});
 const ys=[253,347,409,472,584,681,770],hs=[86,47,48,104,84,70,53];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,196,565,45,35,{bold:true});
 text(s,'Bronnen en eenheden kiezen.\nPercentages en evenwicht berekenen.\nKosten en werkgelegenheid verklaren.',972,253,568,140,30,{name:'overview-goals'});
 rule(s,972,398,568);
 text(s,'Startopdracht',972,425,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 150 · Opgave 37\nTerugblik op §§4.3.1–4.3.3',972,483,565,94,30,{bold:active===2,name:'overview-start'});
 rule(s,972,594,568);
 text(s,'Huiswerk',972,617,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§4.3.5 · Opgaven 37–41\nVoorbereiding: 37–39\nDoelopgave: 40 · Bonus: 41\nMaken en nakijken',972,674,565,160,30,{bold:active===7,name:'overview-homework'});
 text(s,'§4.3.5 · Gemengde opgaven: arbeidsmarkt',60,848,1350,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 notes(s,'Gedrukte boekpagina 150: start. Opgave 40: bronnen p.152 en vragen p.153',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start is de eerste echte gemengde opgave 37. Alle bewerkingen zijn eerder uitgelegd: fte in §4.3.1 p.115; kosten per product p.116; beroepsbevolking §4.3.2 p.124; werkloosheid en vacatures §4.3.3 p.132. Haal zo nodig de methode op, zonder beheersing te veronderstellen. Er is geen nieuwe theorie en geen aparte basissectie. Voorbereiding 37–39, doel 40, bonus 41. Volgens de classroom-route zijn alle gemengde opgaven 37–41 huiswerk; 41 houdt zijn bonuslabel. Dat is een expliciete opdracht, ook al is de bonus in de algemene boekroute optioneel. Geen gemeten claim dat alles in één les past. Opgave 40 is gekozen omdat bronkeuze, twee noemers, marktvergelijkingen, grafiek, oorzaak en een begrensde bedrijfsconclusie samenkomen.`,phase==='Startopdracht'?'Welke eenheid of noemer helpt je bij de drie uitspraken?':'Welke stap kun je al uitleggen en waar heb je hulp nodig?','Fte is geen personentelling. Vacatures mag je niet aftrekken van werklozen.','Na de start: korte herhaling; na de uitleg: verder met 38–40 en bonus 41; bij afsluiting: agenda.','Alleen voor feedback ná de start: 37a 4 fte, 8 personen; 37b 40/(960+40) × 100% = 4%; 37c hogere productiviteit kan de hogere uurkosten overtreffen. Bespreek twijfel kort. De drie overzichten hebben één bron en dezelfde geometrie.');
}
function rows(s,items,{y=210,step=172,split=550,size=36}={}){items.forEach((a,i)=>{const yy=y+i*step;text(s,a[0],60,yy,split-100,110,size,{bold:true,color:[C.blue,C.green,C.orange][i%3]});text(s,a[1],split,yy,1540-split,135,size);if(i<items.length-1)rule(s,60,yy+step-26,1480);});}
const targetPage='Opgave 40 · Bronnen p. 152 · Vragen p. 153';
const targetNotes='Gedrukte boekpagina’s 152–153 (hoofdstukpagina’s 40–41)';
function series(name,x,y,color,width=4,style='solid'){return {name,xValues:x,values:y,line:{fill:color,width,style},marker:{symbol:'none'}};}
function graph(s){
 const data=[series('Lᵥ oud',[0,180,200],[24,6,4],C.blue),series('Lᵥ nieuw',[40,220,240],[24,6,4],C.orange,4,'dashed'),series('Lₐ',[0,180,200],[4,22,24],C.green)];
 for(const [x,y,label,col] of [[100,14,'E₀',C.blue],[120,16,'E₁',C.orange]]){
  data.push(series(label+' horizontale hulplijn',[0,x],[y,y],C.muted,1.5,'dashed'),series(label+' verticale hulplijn',[x,x],[0,y],C.muted,1.5,'dashed'));
  data.push({name:label,xValues:[x],values:[y],line:{fill:col,width:0},marker:{symbol:'circle',size:9},dataLabelOverrides:label==='E₀'?[]:[{idx:0,text:label,position:'top',textStyle:{typeface:FONT,fontSize:27,fill:col}}]});
 }
 data.push({name:'Label E₀',xValues:[86],values:[11.5],line:{fill:'none',width:0},marker:{symbol:'none'},dataLabelOverrides:[{idx:0,text:'E₀',position:'bottom',textStyle:{typeface:FONT,fontSize:27,fill:C.blue}}]});
 // Invisible chart-label anchors keep labels clear of all curves and guides.
 for(const [label,x,y,col,pos] of [['Lᵥ oud',177,4.8,C.blue,'bottom'],['Lᵥ nieuw',225,8.5,C.orange,'top'],['Lₐ',177,24.8,C.green,'top']]) {
  data.push({name:'Label '+label,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:'none'},dataLabelOverrides:[{idx:0,text:label,position:pos,textStyle:{typeface:FONT,fontSize:25,fill:col}}]});
 }
 const ch=s.charts.add('scatter',{position:{left:65,top:228,width:1070,height:580},series:data,scatterOptions:{style:'line'},hasLegend:false,
 xAxis:{min:0,max:280,majorUnit:40,position:'bottom',title:{text:'L (personen, ieder 20 uur per week)',textStyle:{typeface:FONT,fontSize:25}},textStyle:{typeface:FONT,fontSize:24},line:{fill:C.ink,width:1},majorGridlines:{fill:C.line,width:0.5}},
 yAxis:{min:0,max:32,majorUnit:4,position:'left',title:{text:'w (€ per uur)',textStyle:{typeface:FONT,fontSize:25}},textStyle:{typeface:FONT,fontSize:24},line:{fill:C.ink,width:1},majorGridlines:{fill:C.line,width:0.5}},chartFill:C.paper,plotAreaFill:C.paper,chartLine:{fill:'none',width:0}});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 return data;
}

overview('Startopdracht',2);
{
 const s=slide('De bron bepaalt de berekening');
 table(s,[['Soort bron','Passende aanpak'],['Bevolking','Beroepsbevolking = werkenden + werklozen\nBruto = beroepsbevolking / bevolking × 100%\nWerkloosheid = werklozen / beroepsbevolking × 100%'],['Bedrijf','Uren = productie / productiviteit\nLoonkosten per product = uurkosten / productiviteit'],['Sectormodel','Vrij evenwicht: Lᵥ = Lₐ, daarna invullen\nAndere vraagfactor: nieuwe vraaglijn gebruiken']],60,208,1480,520,[410,1070],32);
 text(s,'Eerst groep, periode en eenheid. Dan de formule.',60,772,1480,62,40,{bold:true,color:C.blue});
 notes(s,'Gedrukte boekpagina’s 115–118, 124–126 en 132–135; overzicht op p.149','Korte herhaling van eerder onderwezen methoden. Bij participatie en werkloosheid vermenigvuldig je de verhouding met 100%. Werklozen hebben geen betaald werk, hebben recent gezocht en zijn direct beschikbaar. Personen, uren en fte zijn verschillende maten; fte = uren per week / voltijduren per week. Een minimumloon vraagt nog een toets van bindendheid, straks op dia 4. Laat leerlingen bij een bron eerst de eenheid onderstrepen.','Welke noemer hoort bij het aandeel werklozen?','Een aparte sectorfunctie telt niet dezelfde groep als een regionale bevolking.','Oefen één bedrijfsberekening met een ander voorbeeld.');
}
{
 const s=slide('Een nieuw werkproces bij een drukkerij');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,176,1480,46,29,{bold:true,color:C.blue});
 table(s,[['Per week','Eerst','Na de verandering'],['Orders (posters)','2.400','2.400'],['Productiviteit (posters per uur)','12','15'],['Volledige uurkosten','€ 30','€ 33']],60,244,1480,300,[650,415,415],32);
 text(s,'Uren: 2.400 / 12 = 200; daarna 2.400 / 15 = 160',60,583,1480,63,37,{bold:true});
 text(s,'Kosten per poster: 30 / 12 = € 2,50; 33 / 15 = € 2,20',60,663,1480,65,37,{bold:true,color:C.green});
 text(s,'Bij gelijkblijvende orders zijn minder uren nodig.\nHet aantal personen hangt ook af van de uren per persoon.',60,749,1480,88,32);
 notes(s,'Methode: §4.3.1, gedrukte boekpagina’s 115–118','Eigen fictieve drukkerijgegevens, geen boekopgave. Producten en uren hebben dezelfde weekperiode. Productiviteit wordt gegeven, maar controleer: 2400/200=12 en 2400/160=15. Kosten per poster = volledige uurkosten / posters per uur. Kostenverandering = (2,20−2,50)/2,50 ×100% = −12%. De orders blijven hier gelijk, anders moet ook de nieuwe productie in de urenformule. Winst hangt daarnaast af van opbrengsten en andere kosten. Dit herhaalt de methode zonder een toegewezen opgave uit te werken.','Kunnen hogere uurkosten samengaan met lagere kosten per poster?','Een lager aantal uren bewijst zonder arbeidsduur per persoon geen bepaald aantal ontslagen.','Herhaal kort de minimumloonroute voor de gemengde oefening.','Uitlegvoorbeeld — niet uit het boek. De boekpagina’s onderbouwen de methode, niet deze context of cijfers.');
}
{
 const s=slide('Een minimumloon: eerst de bindendheid');
 rows(s,[['Vrij evenwicht','Stel Lᵥ = Lₐ. Bereken w en L.'],['Minimum boven\nevenwichtsloon','Bereken Lᵥ en Lₐ bij het minimum.\nWerkgelegenheid = Lᵥ; overschot = Lₐ − Lᵥ.'],['Loonsom per week','Uurloon × uren per werknemer × werkenden.']],{y:205,step:173,size:36});
 text(s,'Een minimum onder het evenwicht verandert het loon niet.\nAlleen een loonvloer verschuift de vraaglijn niet.',60,748,1480,91,34,{bold:true,color:C.blue});
 notes(s,'§4.3.4, gedrukte boekpagina’s 141–144','Korte procedureherhaling voor opgave 39, zonder de opgegeven getallen uit te werken. Gebruik de bronvoorwaarden: concurrerende werkgevers, nageleefde vloer, alle gevraagde plaatsen gevuld, geen vacatures of zoekproblemen. Bij een bindende vloer bepaalt de gevraagde hoeveelheid het betaalde werk. Onderscheid minder werkenden en extra aanbieders. De werkelijke effecten van wettelijk beleid zijn hiermee niet voorspeld.','Waarom gebruik je in de loonsom alleen werkenden?','Aanbodoverschot is niet hetzelfde als het aantal mensen dat zijn baan verloor.','Ga zelf verder met de gemengde opgaven.');
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 40 · Bron A: inwoners van 15 tot 75 jaar',targetPage);
 text(s,'Werk in Havenregio',60,186,1480,59,39,{bold:true,color:C.blue});
 text(s,'Bron A is een regiotelling. Bron B is een apart vereenvoudigd\nsectormodel. Bron C beschrijft een afzonderlijk bedrijf.',60,271,1480,115,37);
 table(s,[['Groep','Personen'],['Betaald werk','12.600'],['Geen betaald werk, recent gezocht en direct beschikbaar','1.400'],['Niet-beroepsbevolking','6.000']],60,432,1480,324,[1160,320],32);
 notes(s,targetNotes,'Volledige bron A en de bronafbakening. Deze bronnen horen bij de zes vragen die hierna verschijnen. Onthul nog geen berekeningen. De boekbron staat op het blad direct vóór de vragen op p.153.','Welke groep zoekt en kan direct beginnen?','De inwoners uit A zijn niet automatisch de deelnemers uit model B.','Lees ook het sectormodel.');
}
{
 const s=slide('Opgave 40 · Bron B: verpakkingssector',targetPage);
 text(s,'Oorspronkelijk: Lᵥ = 240 − 10w; Lₐ = −40 + 10w',60,195,1480,72,42,{bold:true,color:C.blue});
 text(s,'Door extra buitenlandse orders wordt de vraag Lᵥ = 280 − 10w.\nHet aanbod verandert niet.',60,318,1480,119,38);
 text(s,'L is het aantal personen met ieder 20 uur per week.\nw is het uurloon in euro. Gebruik € 4 ≤ w ≤ € 24.',60,496,1480,126,38);
 text(s,'Werkgevers concurreren, het loon kan vrij aanpassen en alle\ngevraagde plaatsen worden gevuld zonder vacatures of zoekproblemen.',60,684,1480,130,35);
 notes(s,targetNotes,'Volledige tekst en alle aannamen uit bron B. De functie geldt alleen binnen het gegeven looninterval. Bereken nog geen evenwichten.','Welke grootheid blijft in de twee situaties gelijk?','Gebruik geen minimumloon uit opgave 39 in deze nieuwe bron.','Bekijk de gegeven basisgrafiek.');
}
{
 const s=slide('Opgave 40 · Figuur 24: de basisgrafiek',targetPage);
 const require=createRequire(path.join(process.env.RUNTIME_NODE_MODULES,'_435-loader.cjs'));
 const sharp=require('sharp');
 const bytes=await sharp(await fs.readFile(path.join(chapter,'_assets/mixed_base.svg'))).resize({width:2200}).png().toBuffer();
 s.images.add({blob:bytes,contentType:'image/png',alt:'Oorspronkelijke basisgrafiek bij opgave 40 met oude arbeidsvraag, nieuwe arbeidsvraag en arbeidsaanbod, zonder gemarkeerde evenwichten.',fit:'contain',position:{left:175,top:178,width:1250,height:608}});
 text(s,'Markeer beide evenwichten. Gebruik alleen het bereik € 4 ≤ w ≤ € 24.',60,793,1480,43,30,{bold:true});
 notes(s,targetNotes,'Oorspronkelijke figuur 24 ongewijzigd overgenomen uit mixed_base.svg. De verschuiving is gegeven; de evenwichten zijn nog niet gemarkeerd. Bronbevinding 435-S2: de boekfiguur tekent lijnen door buiten de expliciete geldigheid €4–€24. Benoem daarom de geldigheidsgrens op de dia. De latere bewerkbare antwoordgrafiek toont alleen de geldige lijnstukken en markeert beide evenwichten. De bron zelf is niet gewijzigd.','Welke as toont personen en welke euro per uur?','De getekende verlenging van een lijn verruimt de geldigheid van het model niet.','Lees het afzonderlijke bedrijf in bron C.');
}
{
 const s=slide('Opgave 40 · Bron C: een nieuw werkproces',targetPage);
 text(s,'In een afzonderlijk bedrijf zouden de volledige uurkosten\nstijgen van € 24 naar € 25,20.',60,204,1480,126,41);
 text(s,'De productiviteit zou stijgen van 8 naar 8,8 producten per uur.\nDe omvang van de toekomstige orders en de overige\nproductiekosten zijn nog onbekend.',60,389,1480,180,38);
 text(s,'Een woordvoerder zegt:',60,624,1480,50,34);
 text(s,'“Deze hogere productiviteit levert gegarandeerd meer banen op.”',60,704,1480,127,44,{bold:true,color:C.blue});
 notes(s,targetNotes,'Volledige bron C, inclusief het voorwaardelijke karakter, de onbekende gegevens en de uitspraak. Geef de beoordeling pas na alle vragen.','Welke twee gegevens veranderen en welke gegevens ontbreken?','De sectorlonen uit B zijn niet de volledige uurkosten van dit bedrijf.','Toon eerst de hele vraagstelling.');
}
{
 const s=slide('Opgave 40 · Deelvragen a, b en c',targetPage);
 text(s,'Gebruik uitsluitend de relevante bronnen. Geef bij elke berekening de eenheid.\nSchrijf verklaringen in volledige zinnen.',60,185,1480,96,32,{bold:true});
 rows(s,[['a (3p)','Bereken met bron A de beroepsbevolking, bruto-participatie en het werkloosheidspercentage.'],['b (2p)','Bereken met bron B zelfstandig het oorspronkelijke evenwichtsloon en de werkgelegenheid.'],['c (2p)','Bereken het nieuwe evenwicht na de extra orders. Markeer beide evenwichten in de basisgrafiek.']],{y:329,step:170,split:255,size:36});
 notes(s,targetNotes,'Alle opdrachten a–c zijn volledig. Alleen de boekverwijzing naar de linkerpagina is vervangen door de relevante bronnen die zojuist zijn getoond. De andere drie deelvragen volgen vóór enige oplossing.','Welke bron hoort bij a en welke bij b en c?','Alleen het loon noemen is geen compleet evenwicht.','Toon ook d, e en f.');
}
{
 const s=slide('Opgave 40 · Deelvragen d, e en f',targetPage);
 rows(s,[['d (2p)','Een leerling zegt: “De loonstijging verschuift de arbeidsvraag naar rechts.” Verbeter dit met bron B en benoem wat langs de aanbodlijn gebeurt.'],['e (3p)','Bereken met bron C de loonkosten per product vóór en na het nieuwe werkproces en de procentuele verandering.'],['f (2p)','Beoordeel de garantie van meer banen in bron C. Noem één ondersteunde uitkomst en één ontbrekend gegeven dat de werkgelegenheid kan beïnvloeden.']],{y:212,step:210,split:255,size:36});
 notes(s,targetNotes,'Volledige opdrachten d–f. Alle context, brongegevens, figuur en alle zes deelvragen zijn nu getoond zonder oplossingen. Laat leerlingen hun eigen poging erbij houden voordat de bespreking begint.','Welke vraag vraagt een oordeel dat verder gaat dan een berekening?','Lagere kosten per product bewijzen geen gegarandeerde banengroei.','Begin met de groepen en de twee noemers.');
}
{
 const s=slide('Opgave 40a · Beroepsbevolking en twee noemers',targetPage);
 text(s,'Beroepsbevolking = werkenden + werklozen',60,191,1480,58,38,{bold:true,color:C.blue});
 text(s,'12.600 + 1.400 = 14.000 personen',60,265,1480,65,44,{bold:true});
 text(s,'Bevolking = 14.000 + 6.000 = 20.000 personen',60,365,1480,65,39);
 rule(s,60,456,1480);
 text(s,'Bruto-participatie = beroepsbevolking / bevolking × 100%',60,492,1480,56,34);
 text(s,'14.000 / 20.000 × 100% = 70%',60,561,1480,64,45,{bold:true,color:C.green});
 text(s,'Werkloosheid = werklozen / beroepsbevolking × 100%',60,680,1480,56,34);
 text(s,'1.400 / 14.000 × 100% = 10%',60,753,1480,66,45,{bold:true,color:C.orange});
 notes(s,targetNotes,'Werkloos is hier de groep zonder betaald werk, recent gezocht en direct beschikbaar. Eerst 12600+1400=14000, daarna bevolking 20000. Controle: beroepsbevolking + niet-beroepsbevolking = bevolking. Noemers 20000 en 14000 beantwoorden verschillende vragen.','Waarom zijn 70% en 10% niet delen van dezelfde 100%?','De werklozen zitten al in de beroepsbevolking. Tel hen niet dubbel.','Schakel expliciet van regio A naar sector B.');
}
{
 const s=slide('Opgave 40b · Het oorspronkelijke evenwicht',targetPage);
 text(s,'Bron B: Lᵥ = Lₐ',60,188,1480,57,36,{bold:true,color:C.blue});
 text(s,'240 − 10w = −40 + 10w\n280 = 20w\nw = € 14 per uur',60,275,1480,215,48,{bold:true});
 text(s,'L = 240 − 10 × 14 = 100 personen',60,546,1480,73,45,{bold:true,color:C.green});
 text(s,'Controle in het aanbod: −40 + 10 × 14 = 100 personen\n€ 14 ligt binnen het bereik € 4–€ 24.',60,700,1480,112,35);
 notes(s,targetNotes,'Breng de w-termen naar rechts en de constante termen naar links. Deel 280 door 20. Vul het loon vervolgens in beide functies in. Alle 100 gevraagde plaatsen worden gevuld in dit model; ieder werkt 20 uur per week.','Waarom is 100 hier de werkgelegenheid?','100 personen is geen 100 arbeidsuren en geen regiotelling.','Gebruik de gewijzigde vraagfunctie voor de nieuwe situatie.');
}
{
 const s=slide('Opgave 40c · Het nieuwe evenwicht',targetPage);
 text(s,'Nieuwe vraag: Lᵥ = 280 − 10w; aanbod blijft Lₐ = −40 + 10w',60,188,1480,84,36,{bold:true,color:C.blue});
 text(s,'280 − 10w = −40 + 10w\n320 = 20w\nw = € 16 per uur',60,298,1480,215,48,{bold:true});
 text(s,'L = 280 − 10 × 16 = 120 personen',60,564,1480,73,45,{bold:true,color:C.green});
 text(s,'Controle: −40 + 10 × 16 = 120 personen\n€ 16 ligt binnen € 4–€ 24. Het loon én de werkgelegenheid stijgen.',60,708,1480,110,34);
 notes(s,targetNotes,'Het aanbod blijft gelijk. Gebruik 280, niet 240, als constante in de nieuwe arbeidsvraag. Het verschil tussen de vraagfuncties is bij elk gelijk loon 40 personen, maar de uiteindelijke werkgelegenheid stijgt met 20 door loonaanpassing.','Welke functie moet je vervangen voor deze berekening?','Een verschuiving van 40 bij gelijk loon is geen toename van de evenwichtshoeveelheid met 40.','Markeer beide berekende punten in de grafiek.');
}
{
 const s=slide('Opgave 40c · Beide evenwichten in de grafiek',targetPage);
 text(s,'Lijnstukken binnen het gegeven bereik € 4 ≤ w ≤ € 24',60,175,1480,46,31,{bold:true,color:C.blue});
 const data=graph(s);
 text(s,'E₀ = (100; 14)\nE₁ = (120; 16)',1165,319,375,124,36,{bold:true});
 text(s,'Horizontaal: personen\nVerticaal: € per uur',1165,490,375,113,29);
 text(s,'Lₐ blijft gelijk.\nBeide punten liggen\nop de aanbodlijn.',1165,661,375,129,32,{bold:true,color:C.green});
 await fs.writeFile(path.join(BUILD,'graph-data.json'),JSON.stringify(data,null,2));
 notes(s,targetNotes,'E0=(100,14), E1=(120,16), dus horizontaal personen en verticaal euro per uur. Geleidelijnen sluiten op de punten aan. De juiste hoeveelheid en prijs volgen uit de berekeningen. De oorspronkelijke boekfiguur loopt buiten het modelbereik door (bevinding 435-S2). Deze bewerkbare antwoordgrafiek beperkt de lijnstukken expliciet tot €4–€24, behoudt de functies en gebruikt dezelfde hoeveelheidsgrens 280 en loongrens 32.','Waarom blijft de aanbodlijn op dezelfde plaats?','Een ander snijpunt op de aanbodlijn betekent geen verschuiving van die lijn.','Verklaar welke verandering de oorzaak is.');
}
{
 const s=slide('Opgave 40d · Extra orders verschuiven de vraag',targetPage);
 rows(s,[['Oorzaak','Extra buitenlandse orders vergroten de arbeidsvraag bij ieder gelijk loon. De vraaglijn verschuift naar rechts.'],['Uitkomst','Het evenwichtsloon stijgt van € 14 naar € 16 per uur.'],['Langs het aanbod','Bij het hogere loon stijgt de aangeboden hoeveelheid van 100 naar 120 personen. De aanbodlijn blijft gelijk.']],{y:217,step:190,split:480,size:37});
 notes(s,targetNotes,'Verbeter de uitspraak in twee stappen: orders veroorzaken de verschuiving; het hogere loon is een uitkomst van de nieuwe verhouding tussen vraag en aanbod. Een loonverandering veroorzaakt bij verder gelijke omstandigheden een beweging langs een lijn. Bij w=14 zou de nieuwe vraag 140 zijn versus 100 oud; de stijging van het loon naar 16 brengt vraag en aanbod op 120.','Wat verandert eerst in de bron: het loon of de orders?','De loonstijging is geen oorzaak van de vraagverschuiving in deze bron.','Schakel nu van het sectormodel naar bedrijf C.');
}
{
 const s=slide('Opgave 40e · Loonkosten per product',targetPage);
 text(s,'Loonkosten per product = volledige uurkosten / productiviteit',60,192,1480,101,39,{bold:true,color:C.blue});
 table(s,[['','Vóór het werkproces','Na het werkproces'],['Uurkosten','€ 24','€ 25,20'],['Productiviteit','8 producten per uur','8,8 producten per uur'],['Loonkosten per product','24 / 8 = € 3','25,20 / 8,8 = € 2,863636…']],60,340,1480,346,[480,460,540],31);
 text(s,'Afgerond: € 2,86 per product. Bewaar de ongeronde uitkomst.',60,753,1480,79,38,{bold:true,color:C.green});
 notes(s,targetNotes,'Gebruik de volledige uurkosten uit C en de productie per arbeidsuur. De uren vallen weg bij delen, zodat euro per product overblijft. Reken door met 25,20/8,8; rond het tussenresultaat niet af voor de procentuele verandering.','Waarom deel je door de productiviteit?','€25,20 is geen kostprijs per product.','Bereken de procentuele verandering vanuit het oude bedrag.');
}
{
 const s=slide('Opgave 40e · De procentuele verandering',targetPage);
 text(s,'Verandering = (nieuw − oud) / oud × 100%',60,206,1480,77,44,{bold:true,color:C.blue});
 text(s,'((25,20 / 8,8) − 3) / 3 × 100% ≈ −4,55%',60,356,1480,98,47,{bold:true});
 text(s,'De loonkosten per product dalen met ongeveer 4,55%.',60,518,1480,98,42,{bold:true,color:C.green});
 text(s,'Controle met groeifactoren: 1,05 / 1,10 ≈ 0,954545\nDe productiviteit stijgt sterker dan de uurkosten.',60,704,1480,125,36);
 notes(s,targetNotes,'Uurkosten stijgen 5%, productiviteit 10%. De verhouding van groeifactoren is 1,05/1,10, niet het verschil 5−10. Reken exact met 25,20/8,8 = 63/22 euro per product en vergelijk met 3. Ronden van 2,86 vóór de procentberekening zou een afwijkend percentage opleveren.','Welk bedrag hoort onder de breuk bij procentuele verandering?','De daling is niet precies 5%. Procentuele veranderingen in teller en noemer trek je niet eenvoudig af.','Beoordeel nu de uitspraak over banen.');
}
{
 const s=slide('Opgave 40f · Meer banen zijn niet gegarandeerd',targetPage);
 rows(s,[['Wel ondersteund','Onder de veronderstelde veranderingen dalen de loonkosten per product.'],['Ontbrekend gegeven','De toekomstige orders bepalen mede\nhoeveel het bedrijf moet produceren.'],['Economische uitleg','Uren = productie / productiviteit. Bij dezelfde productie vraagt de hogere productiviteit juist minder uren.']],{y:218,step:184,split:530,size:36});
 text(s,'Het aantal personen hangt bovendien af van de arbeidsduur per persoon.',60,780,1480,55,32,{bold:true,color:C.blue});
 notes(s,targetNotes,'De garantie is onjuist. Eén ondersteunde uitkomst is een lagere loonkost per product. Eén ontbrekend gegeven is het toekomstige order- of productievolume. Andere kosten ontbreken eveneens voor een winstuitspraak. De uitspraak over dezelfde productie is voorwaardelijk, geen voorspelling van de gegeven onbekende toekomst. Voor personen is ook de arbeidsduur relevant. Laat elke leerling één onvolledige conclusie verbeteren.','Welk gegeven heb je nodig om de benodigde uren te berekenen?','Lagere loonkosten per product garanderen noch meer banen noch hogere totale winst.','Laat het huiswerk in de agenda zetten.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviews,tables,charts,sourceCommit:commit},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
