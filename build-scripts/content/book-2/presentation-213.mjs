// HOW TO ADAPT: read the classroom recipe and the full new paragraph/answer model.
// Derive assignments and teaching examples from the new operations, not number replacements.
// Keep runtime paths in environment variables; final outputs are copied only after review.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const facts=JSON.parse(await fs.readFile(path.join(HERE,'presentation-213.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('213');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],slides=[],overviews=[];
const title='§2.1.3 Marginale kosten en marginale opbrengsten';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${facts.sourceCommit}/${facts.sourceEdition.split('/').map(encodeURIComponent).join('/')}/`;
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(label,footer=title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,label,60,42,1480,86,label.startsWith('Deze les:')?44:52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title:label});return s;
}
function notes(s,page,explanation,question,pitfall,transition,example=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: leerlingenboek Boek 2, chatuitgave 2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${source}bronnen/H1/${encodeURIComponent('2.1 Kosten en opbrengsten – antwoorden.md')}\n${example?`Uitlegvoorbeeld — niet uit het boek: ${example}. Context en gegevens zijn voor deze les gemaakt. De boekpagina onderbouwt de methode, niet deze gegevens.`:''}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){
  t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){
   const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
   cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:16,right:14,top:8,bottom:8}};
  }
 }
 tables.push(p.slides.items.length);return t;
}
function exampleLabel(s,name){text(s,`Uitlegvoorbeeld — niet uit het boek · ${name}`,60,173,1480,45,28,{color:C.muted});}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 `Bespreken van de doelopgave: opgave ${facts.assignment.target}.`,
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: '+title);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],790,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Winst, MK en MO berekenen.\nMK-patronen vergelijken.\nGemiddeld en marginaal uitleggen.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 23 · Opgaven 1 en 2\n2: verkennen, theorie p. 19–20',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,`§${facts.paragraph}\nBasis: ${facts.assignment.basis.join(' en ')}\nZelfstandig: ${facts.assignment.independent.join(' en ')}\nDoelopgave: ${facts.assignment.target}\n${facts.assignment.homeworkInstruction}`,972,650,565,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'23–26',(`Laat het overzicht staan tijdens ${phase.toLowerCase()}. Start 1–2: pagina 23. Basis 3–4: pagina 23–24. Zelfstandig 5–6: pagina 24–25. Doel 7: pagina 26. Huiswerk 3, 4, 5, 6 en 7 maken en nakijken. Denkertje 8 en herhaling 9–10 zijn extra. De volledige route hoeft niet binnen één les af; plan vervolgwerktijd.` + "\n\nStart en terugblik: Opgave 1 gebruikt TK en GTK uit §2.1.1, dia 4 en 7–9, en winst uit §2.1.2, dia 4. MK en delen door de verandering in Q zijn nieuw. Lees bij opgave 2 de definitie en tabelstappen op p. 19–20. Laat leerlingen bij deze verkenning aanwijzen welke uitleg zij gebruiken en hun twijfel noteren. Verwacht de nieuwe bewerking nog niet zonder steun. Bij terugkeer naar dit overzicht vóór het basiswerk: laat leerlingen opgave 2 opnieuw proberen na de uitleg, bespreek hun redenering en geef zo nodig extra steun. Dit is een verkennende start, geen toets van al beheerste nieuwe leerstof."),active===2?'Welke eerdere kennis over kosten en winst heb je nodig?':'Welke berekening of uitleg vraagt nog aandacht?','De MK-kolom beschrijft de stap vanaf de vorige rij. Gebruik de gedrukte boekpagina, niet de PDF-teller.',active===7?'Laat leerlingen het huiswerk noteren.':'Ga door naar de volgende lesfase zodra de klas eraan toe is.');
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Berekenen','Winst binnen één rij; MK en MO tussen twee rijen.'],['Vergelijken','Constante en stijgende MK herkennen; constante MO verklaren.'],['Uitleggen','De hele tabelstap en de eenheid noemen; gemiddeld van marginaal onderscheiden.']];
 rows.forEach((r,i)=>{let y=215+i*194;text(s,r[0],60,y,445,65,41,{bold:true,color:C.blue});text(s,r[1],560,y,975,125,38);if(i<2)rule(s,60,y+152,1480);});
 notes(s,'19–22','Koppel de drie doelen aan de tabelopgaven. Een ondernemer moet weten wat een grotere productie aan extra kosten en opbrengst betekent. We rekenen met verschillen, zonder afgeleiden en zonder een winstmaximum te bepalen.','Wat is het verschil tussen alle kosten en de kosten die erbij komen?','Marginaal betekent niet gemiddeld over alle producten.','Introduceer eerst de twee marginale begrippen.');
}
{
 const s=slide('Marginaal: het bedrag per extra product');
 table(s,[['Begrip','Berekening','Betekenis'],['Marginale kosten (MK)','MK = ΔTK / ΔQ','Extra totale kosten per extra geproduceerd product'],['Marginale opbrengsten (MO)','MO = ΔTO / ΔQ','Extra totale opbrengst per extra verkocht product']],60,223,1480,360,[480,425,575],35);
 text(s,'Δ = verandering = nieuw − oud',60,634,1480,80,47,{bold:true,color:C.blue});
 text(s,'Dezelfde periode · dezelfde tabelstap',60,753,1480,67,39,{bold:true,color:C.orange});
 notes(s,'19–20','Spreek delta uit en koppel het teken aan nieuw min oud. Bij een stap met meerdere producten deel je de totale verandering door het aantal extra producten. Het resultaat is een gemiddeld extra bedrag binnen die stap.','Waardoor deel je de extra totale kosten?','ΔTK is nog geen MK. De noemer is ΔQ, niet de nieuwe Q.','Gebruik een eigen voorbeeld met ongelijke tabelstappen.');
}
{
 const s=slide('TasDruk · De gegevens');exampleLabel(s,'TasDruk');
 text(s,'Bedrukte tassen: TK = 72 + 4Q en TO = 11Q',60,244,1480,72,43,{bold:true});
 text(s,'Q: tassen per week. Capaciteit: 12. Alle tassen worden verkocht.',60,332,1480,83,34);
 table(s,[['Q (tassen per week)','TK (€ per week)','TO (€ per week)'],['0','72','0'],['4','88','44'],['12','120','132']],60,443,1480,310,[490,495,495],35);
 text(s,'Let op: eerst 4 extra tassen, daarna 8 extra tassen.',60,786,1480,48,32,{bold:true,color:C.blue});
 notes(s,'20, 22','De vaste weekkosten zijn 72 euro; elke extra tas kost 4 euro aan materiaal en bedrukking. De verkoopprijs is 11 euro. Bij Q = 4: TK = 72 + 4 × 4 = 88 en TO = 11 × 4 = 44. Bij Q = 12: TK = 120 en TO = 132.','Hoeveel tassen komen er in elke stap bij?','De tabelstappen hoeven niet even groot te zijn.','Bereken eerst de winst binnen één rij.','TasDruk; TK = 72 + 4Q, TO = 11Q, Q = 0, 4, 12');
}
{
 const s=slide('Winst · Opbrengst min alle kosten');exampleLabel(s,'TasDruk');
 text(s,'Bij 4 tassen per week',60,252,1480,60,39,{bold:true,color:C.blue});
 text(s,'Winst = TO − TK',60,355,1480,80,54,{bold:true});
 text(s,'= 44 − 88 = −€ 44 per week',60,459,1480,80,52,{bold:true,color:C.orange});
 table(s,[['Q (tassen per week)','TO (€ per week)','TK (€ per week)','Winst (€ per week)'],['0','0','72','−72'],['4','44','88','−44'],['12','132','120','12']],60,584,1480,244,[410,350,350,370],30);
 notes(s,'22','Winst hoort bij één hoeveelheid. Trek bij Q = 4 de totale kosten 88 af van de totale opbrengst 44. De onderneming verliest 44 euro in die week. De tabel toont dezelfde aanpak bij nul en twaalf tassen.','Waarom kan er verlies zijn terwijl elke tas opbrengst geeft?','MO is geen winst. Alle kosten, inclusief de vaste kosten, tellen mee in winst.','Vergelijk nu twee rijen voor MK.','TasDruk');
}
{
 const s=slide('MK · Eerst het verschil, dan delen');exampleLabel(s,'TasDruk');
 table(s,[['Stap 4 → 12 tassen','Berekening','Verandering'],['Hoeveelheid','ΔQ = 12 − 4','8 extra tassen'],['Totale kosten','ΔTK = 120 − 88','€ 32 extra kosten']],60,250,1480,281,[525,480,475],36);
 text(s,'MK = ΔTK / ΔQ = 32 / 8',60,583,1480,78,50,{bold:true,color:C.orange});
 text(s,'= € 4 per extra tas in de stap 4 → 12',60,688,1480,76,47,{bold:true});
 text(s,'De acht extra tassen kosten samen € 32.',60,789,1480,45,32);
 notes(s,'19–20','Gebruik exact dezelfde twee rijen in teller en noemer. Nieuw min oud geeft 32 euro extra kosten voor acht extra tassen. Delen geeft 4 euro per extra tas. De 72 euro vaste kosten zit in beide totalen en valt weg bij aftrekken.','Waarom deel je niet door twaalf?','32 is de totale kostenstijging; 12 is de nieuwe hoeveelheid. Geen van beide is het gezochte bedrag per extra tas.','Bereken de extra opbrengst over precies dezelfde stap.','TasDruk');
}
{
 const s=slide('MO · De extra opbrengst per extra tas');exampleLabel(s,'TasDruk');
 text(s,'Dezelfde stap: 4 → 12 tassen per week',60,250,1480,75,42,{bold:true,color:C.blue});
 text(s,'ΔTO = 132 − 44 = € 88',60,360,1480,78,49);
 text(s,'MO = ΔTO / ΔQ = 88 / 8',60,468,1480,78,49,{bold:true});
 text(s,'= € 11 per extra verkochte tas',60,578,1480,82,49,{bold:true,color:C.blue});
 rule(s,60,701,1480);
 text(s,'Vaste verkoopprijs → constante MO',60,741,1480,80,44,{bold:true,color:C.green});
 notes(s,'20, 22','De opbrengst stijgt 88 euro bij acht extra verkochte tassen. Iedere tas brengt dezelfde 11 euro op, dus MO blijft 11 euro. Dit geldt hier omdat de prijs vast is en alle geproduceerde tassen worden verkocht.','Waarom komt de uitkomst overeen met de verkoopprijs?','Constante MO geldt niet zonder de aanname van een vaste prijs.','Zet de uitkomsten bij de laatste rij van elke stap.','TasDruk');
}
{
 const s=slide('Elke uitkomst hoort bij een tabelstap');exampleLabel(s,'TasDruk');
 table(s,[['Laatste rij Q','Bijbehorende stap','ΔQ','MK (€ per extra tas)','MO (€ per extra tas)'],['0','—','—','—','—'],['4','0 → 4','4','16 / 4 = 4','44 / 4 = 11'],['12','4 → 12','8','32 / 8 = 4','88 / 8 = 11']],60,260,1480,356,[275,345,140,360,360],32);
 text(s,'Grotere stap, dezelfde MK en MO',60,662,1480,69,45,{bold:true,color:C.green});
 text(s,'Bij de eerste rij: — betekent “geen vorige tabelrij”.',60,770,1480,64,35);
 notes(s,'20','De uitkomst bij twaalf beschrijft de hele stap van vier naar twaalf. Verdubbeling van ΔTK en ΔTO betekent hier geen verdubbeling van MK en MO, want ΔQ verdubbelt ook. Bij de eerste rij ontbreekt een vorige rij; het streepje is geen nul.','Waarom zijn de marginale bedragen gelijk, ondanks de grotere tweede stap?','De laatste rij is een notatieafspraak, geen bewering over alleen het laatste product.','Bekijk nu een onderneming met steeds grotere extra kosten.','TasDruk');
}
{
 const s=slide('Studio Reliëf · Kosten die sneller stijgen');exampleLabel(s,'Studio Reliëf');
 text(s,'TK = 32 + 2Q²     TO = 26Q',60,248,1480,75,46,{bold:true});
 text(s,'Q: tegels per week. Capaciteit: 6. Alle tegels worden verkocht.',60,335,1480,76,34);
 table(s,[['Q (tegels per week)','TK (€ per week)','TO (€ per week)'],['0','32','0'],['2','40','52'],['4','64','104'],['6','104','156']],60,431,1480,300,[490,495,495],33);
 text(s,'Bij Q = 4: TK = 32 + 2 × 4² = 32 + 32 = € 64',60,767,1480,65,35,{bold:true,color:C.orange});
 notes(s,'21–22','Deze werkplaats maakt reliëftegels. Bij meer productie is steeds meer betaald werk nodig per extra tegel. De vaste werkplaatskosten blijven 32 euro per week. Kwadrateer eerst Q, vermenigvuldig daarna met 2 en tel 32 op.','Waarom is 2 × 4² gelijk aan 32 en niet aan 64?','Q² is Q × Q. De constante kosten blijven hier gelijk; dat sluit stijgende marginale kosten niet uit.','Vergelijk de even grote groepen extra tegels.','Studio Reliëf; TK = 32 + 2Q², TO = 26Q, Q = 0, 2, 4, 6');
}
{
 const s=slide('Even grote stappen · Stijgende MK');exampleLabel(s,'Studio Reliëf');
 table(s,[['Stap (tegels)','MK = ΔTK / ΔQ','€ per extra tegel'],['0 → 2','(40 − 32) / (2 − 0)','8 / 2 = 4'],['2 → 4','(64 − 40) / (4 − 2)','24 / 2 = 12'],['4 → 6','(104 − 64) / (6 − 4)','40 / 2 = 20']],60,245,1480,340,[370,690,420],35);
 text(s,'MK: € 4 → € 12 → € 20 per extra tegel',60,624,1480,78,45,{bold:true,color:C.orange});
 text(s,'MO: steeds 52 / 2 = € 26 per extra tegel',60,746,1480,78,41,{bold:true,color:C.blue});
 notes(s,'21–22','De groepen hebben allemaal twee tegels. Hun extra kosten zijn 8, 24 en 40 euro: steeds meer per extra tegel. MO blijft 26 door de vaste verkoopprijs. De vaste 32 euro valt bij elke aftrekking weg. De bedragen 4, 12 en 20 zijn gemiddelden over telkens twee extra tegels.','Waarom stijgt MK terwijl de werkplaatskosten gelijk blijven?','Het zijn niet de afzonderlijke kosten van alleen tegel twee, vier of zes.','Vergelijk de laatste marginale uitkomst met het gemiddelde van alle tegels.','Studio Reliëf');
}
{
 const s=slide('GTK en MK · Alle tegels of extra tegels');exampleLabel(s,'Studio Reliëf');
 table(s,[['','GTK bij Q = 6','MK over de stap 4 → 6'],['Welke kosten?','Alle € 104','€ 104 − € 64 = € 40 extra'],['Welke tegels?','Alle 6 tegels','6 − 4 = 2 extra tegels'],['Berekening','104 / 6 ≈ € 17,33','40 / 2 = € 20'],['Betekenis','Gemiddeld per tegel','Per extra tegel in deze stap']],60,264,1480,430,[335,535,610],33);
 text(s,'€ 20 per extra tegel: gemiddeld over de stap 4 → 6.',60,756,1480,78,40,{bold:true,color:C.orange});
 notes(s,'19, 21','GTK verdeelt alle kosten over alle zes tegels. MK verdeelt alleen de extra kosten over de twee extra tegels. Voor een verdiepende vraag: tegel vijf voegt 18 euro toe en tegel zes 22 euro; hun gemiddelde is 20 euro. De intervaluitkomst zegt niet dat elke afzonderlijke tegel 20 euro extra kost.','Waarom mogen 17,33 en 20 verschillen?','Een getal in de MK-kolom bij Q = 6 is niet GTK van alle zes tegels.','Laat leerlingen de betekenis in één zin oefenen.','Studio Reliëf');
}
function quickCheck(reveal){
 const s=slide('Korte controle · Welke betekenis klopt?');exampleLabel(s,'Studio Reliëf');
 text(s,'Bij Q = 6 staat MK = € 20.',60,255,1480,72,48,{bold:true});
 text(s,'“Dus de zesde tegel kost precies € 20 extra.”',60,372,1480,100,46,{bold:true,color:C.blue});
 if(reveal){
  text(s,'Onjuist: de stap loopt van 4 naar 6 tegels.',60,545,1480,85,43,{bold:true,color:C.orange});
  text(s,'Samen € 40 extra kosten voor twee extra tegels:\ngemiddeld € 20 per extra tegel in die stap.',60,666,1480,151,40);
 }else{text(s,'Klopt dit? Noem de stap, het extra totaal\nen het aantal extra tegels.',60,574,1480,158,42);}
 notes(s,'19–21',reveal?'De uitspraak verwart het laatste tabelpunt met één afzonderlijk product. De MK van 20 is gebaseerd op 40 euro extra totale kosten en twee extra tegels.':'Laat leerlingen eerst zelf de uitspraak beoordelen. Vraag om de hoeveelheden vier en zes te noemen. De uitwerking volgt pas op de volgende dia. Dit is een korte controle, geen extra huiswerk.', 'Wat betekent “per extra tegel” in deze tabel?', 'Niet de nieuwe totale hoeveelheid en niet alleen de laatste tegel gebruiken.',reveal?'Laat de lesroute tijdens de oefenfase staan.':'Bespreek de redeneringen en toon daarna het antwoord.','Studio Reliëf');
}
quickCheck(false);quickCheck(true);
overview('Zelfstandig werken',4);
const targetFooter='§2.1.3 · Opgave 7 · Linea en Curva · Boekpagina 26';
const targetHeader=['Q','TK (€)','TO (€)','Winst (€)','MK (€ per\nextra product)','MO (€ per\nextra product)'];
const widths=[130,200,200,270,340,340];
const lineaBlank=[targetHeader,['0','200','0','…','—','—'],['10','230','80','…','…','…'],['20','260','160','…','…','…'],['30','290','240','…','…','…']];
const curvaBlank=[targetHeader,['0','100','0','−100','—','—'],['5','125','150','25','…','…'],['10','200','300','100','…','…'],['15','325','450','125','…','…']];
const lineaFull=[targetHeader,['0','200','0','−200','—','—'],['10','230','80','−150','3','8'],['20','260','160','−100','3','8'],['30','290','240','−50','3','8']];
const curvaFull=[targetHeader,['0','100','0','−100','—','—'],['5','125','150','25','5','30'],['10','200','300','100','15','30'],['15','325','450','125','25','30']];
{
 const s=slide('Opgave 7 · Linea en Curva',targetFooter);
 table(s,[['Onderneming','Kosten en opbrengsten','Capaciteit'],['Linea','TK = 200 + 3Q\nTO = 8Q','30 producten per week'],['Curva','TK = 100 + Q²\n€ 30 per product; TO = 30Q','15 producten per week']],60,218,1480,305,[315,720,445],35);
 text(s,'Q: producten per week. Totale bedragen: euro per week.',60,566,1480,63,35,{bold:true});
 text(s,'Bereken MK en MO per extra product over iedere tabelstap.\nZet de uitkomst bij de laatste rij van die stap.\nGebruik geen afgeleiden.',60,677,1480,153,37);
 notes(s,'26','Begin deze bespreking nadat leerlingen de doelopgave hebben geprobeerd. Dit zijn de functies, prijs, capaciteiten, periode en algemene opdracht uit opgave 7. De volgende dia’s tonen beide invultabellen en alle vijf deelvragen voordat antwoorden worden onthuld.','Welke twee stappen zijn bij Linea en Curva verschillend van grootte?','Curva en Linea hebben verschillende capaciteiten. Trek de tabellen niet verder door.','Toon de oorspronkelijke invultabel van Linea.');
}
for(const [name,data] of [['Linea',lineaBlank],['Curva',curvaBlank]]){
 const s=slide(`Opgave 7 · Invultabel ${name}`,targetFooter);
 text(s,name==='Linea'?'TK = 200 + 3Q     TO = 8Q':'TK = 100 + Q²     TO = 30Q',60,199,1480,78,45,{bold:true,color:C.blue});
 text(s,'Q: producten per week · TK, TO en winst: euro per week',60,295,1480,58,33);
 table(s,data,60,381,1480,363,widths,32);
 text(s,'MK en MO: per extra product, vanaf de vorige tabelrij.',60,787,1480,52,34,{bold:true});
 notes(s,'26',`Behoud alle gegeven waarden en lege cellen uit de ${name}-tabel. ${name==='Curva'?'De winstbedragen zijn hier al in de opgave gegeven.':'De winstkolom moet nog worden ingevuld.'} Toon nog geen uitwerking.`, 'Welke twee rijen gebruik je voor de eerste marginale berekening?', 'Een streepje bij Q = 0 betekent geen eerdere tabelrij, niet nul.', name==='Linea'?'Toon ook de invultabel van Curva.':'Toon eerst alle deelvragen.');
}
{
 const s=slide('Opgave 7 · Deelvragen a, b en c',targetFooter);
 text(s,'a) Vul bij Linea de winstkolom in.',60,219,1480,87,43);
 rule(s,60,340,1480);
 text(s,'b) Bereken voor Linea MK en MO over de eerste stap. Laat teller en noemer zien. Vul de MK- en MO-kolommen verder in bij Q = 10, 20 en 30.',60,387,1480,206,41);
 rule(s,60,638,1480);
 text(s,'c) Leg uit waarom MO bij Linea constant is.',60,702,1480,111,43);
 notes(s,'26','Deze drie vragen horen bij Linea. Behoud de vraag naar de teller en noemer en de economische verklaring. Wacht nog met de uitwerking totdat ook d en e getoond zijn.','Wat moet je naast de ingevulde cellen laten zien?','Alleen een eindgetal is geen volledige berekening of verklaring.','Toon ook de Curva-vraag en de vergelijking.');
}
{
 const s=slide('Opgave 7 · Deelvragen d en e',targetFooter);
 text(s,'d) Bereken voor Curva MK over de drie stappen en MO over de eerste stap. Vul alle lege MK- en MO-cellen in bij Q = 5, 10 en 15.',60,240,1480,195,42);
 rule(s,60,491,1480);
 text(s,'e) Vergelijk de MK-patronen. Leg uit wat MK en MO per extra product binnen een tabelstap betekenen. Trek geen conclusie over de hoeveelheid met maximale winst.',60,550,1480,240,42);
 notes(s,'26','Nu zijn de volledige context, beide tabellen en alle vijf deelvragen beschikbaar. d vraagt alle drie MK-berekeningen en de eerste MO-berekening; e vraagt patronen én betekenis. De opdracht sluit een conclusie over het winstmaximum uit.','Welke twee dingen moet je bij e uitleggen?','Geen afgeleiden gebruiken en geen winstmaximum afleiden uit de tabel.','Begin de uitwerking met winst bij Linea.');
}
{
 const s=slide('Opgave 7a · Winst bij Linea',targetFooter);
 text(s,'Winst = TO − TK',60,203,1480,76,49,{bold:true,color:C.blue});
 table(s,[['Q (producten per week)','Berekening','Winst (€ per week)'],['0','0 − 200','−200'],['10','80 − 230','−150'],['20','160 − 260','−100'],['30','240 − 290','−50']],60,328,1480,365,[500,480,500],35);
 text(s,'In elke getoonde rij: TO < TK, dus verlies.',60,749,1480,81,43,{bold:true,color:C.orange});
 notes(s,'26','Gebruik de bedragen uit één rij. De winstbedragen zijn −200, −150, −100 en −50 euro per week. Bij nul productie zijn er toch 200 euro kosten. Bij dertig producten is het verlies nog 50 euro.','Waarom is het eerste winstbedrag niet nul?','Verlies schrijf je als negatieve winst of als positief verliesbedrag met het woord verlies.','Vergelijk de eerste twee rijen voor de marginale bedragen.');
}
{
 const s=slide('Opgave 7b · Linea, stap 0 → 10',targetFooter);
 text(s,'ΔQ = 10 − 0 = 10 extra producten',60,205,1480,76,44,{bold:true});
 text(s,'MK = ΔTK / ΔQ',60,319,1480,69,45,{bold:true,color:C.orange});
 text(s,'= (230 − 200) / (10 − 0) = 30 / 10',60,399,1480,76,43);
 text(s,'= € 3 per extra product',60,478,1480,68,44,{bold:true,color:C.orange});
 rule(s,60,582,1480);
 text(s,'MO = ΔTO / ΔQ',60,620,1480,65,45,{bold:true,color:C.blue});
 text(s,'= (80 − 0) / (10 − 0) = € 8 per extra product',60,708,1480,105,42,{bold:true});
 notes(s,'26','Laat eerst de teller en noemer ontstaan uit dezelfde twee rijen. De tien extra producten kosten samen 30 euro en leveren samen 80 euro op. Noteer de marginale uitkomsten bij Q = 10. Controle: 10 × 3 = 30 en 10 × 8 = 80.','Waar komen 230, 200, 10 en 0 vandaan?','De 200 euro vaste kosten vallen weg bij het verschil, niet bij de totale winst.','Vul ook de volgende twee stappen in en verklaar MO.');
}
{
 const s=slide('Opgave 7b–c · Linea volledig',targetFooter);
 text(s,'Q: producten per week · TK, TO en winst: euro per week',60,195,1480,58,33);
 table(s,lineaFull,60,283,1480,357,widths,32);
 text(s,'Elke stap: MK = 30 / 10 = 3 en MO = 80 / 10 = 8',60,686,1480,64,37,{bold:true});
 text(s,'MO blijft € 8: ieder extra product wordt voor € 8 verkocht.',60,772,1480,66,36,{bold:true,color:C.blue});
 notes(s,'26','Stap 10 naar 20: MK = (260 − 230) / (20 − 10) = 3 en MO = (160 − 80) / 10 = 8. Stap 20 naar 30: MK = (290 − 260) / (30 − 20) = 3 en MO = (240 − 160) / 10 = 8. Alle bedragen zijn euro per extra product. Iedere verkochte eenheid voegt 8 euro toe aan TO omdat TO = 8Q.','Hoe verklaar je de constante MO zonder alleen naar de tabel te wijzen?','Een vaste verkoopprijs verklaart MO; constante kosten verklaren MO niet.','Bereken nu Curva met de eigen stapgrootte.');
}
{
 const s=slide('Opgave 7d · Drie MK-berekeningen bij Curva',targetFooter);
 text(s,'MK = ΔTK / ΔQ · elke stap bevat 5 extra producten',60,199,1480,80,39,{bold:true,color:C.orange});
 table(s,[['Stap','Teller en noemer','MK (€ per extra product)'],['0 → 5','(125 − 100) / (5 − 0)','25 / 5 = 5'],['5 → 10','(200 − 125) / (10 − 5)','75 / 5 = 15'],['10 → 15','(325 − 200) / (15 − 10)','125 / 5 = 25']],60,328,1480,348,[300,700,480],34);
 text(s,'Extra kosten per groep: € 25 → € 75 → € 125',60,743,1480,81,43,{bold:true,color:C.orange});
 notes(s,'26','Iedere teller is een verschil van opeenvolgende TK-bedragen en iedere noemer is vijf. MK stijgt van 5 naar 15 naar 25 euro per extra product. Controleer door elke uitkomst met vijf te vermenigvuldigen; je krijgt de extra totale kosten terug.','Waarom delen we hier door vijf, terwijl Linea tien gebruikte?','De € 125 is de extra totale kosten van de laatste vijf producten, niet MK.','Bereken de extra opbrengst met dezelfde stapgrootte.');
}
{
 const s=slide('Opgave 7d · MO bij Curva',targetFooter);
 text(s,'Eerste stap: 0 → 5 producten per week',60,214,1480,77,44,{bold:true});
 text(s,'MO = ΔTO / ΔQ',60,344,1480,80,51,{bold:true,color:C.blue});
 text(s,'= (150 − 0) / (5 − 0) = 150 / 5',60,448,1480,80,48);
 text(s,'= € 30 per extra product',60,552,1480,80,51,{bold:true,color:C.blue});
 text(s,'Ook in de volgende stappen: € 150 extra voor 5 extra producten.',60,686,1480,102,37);
 notes(s,'26','De eerste stap levert 150 euro extra opbrengst voor vijf producten. Curva verkoopt ieder product voor 30 euro. Bij de volgende stappen zijn de verschillen (300 − 150) / (10 − 5) en (450 − 300) / (15 − 10), beide 30.','Waarom groeit MO hier niet mee met MK?','Kosten en verkoopprijs hebben verschillende oorzaken. Een hogere MK verandert in deze opgave de prijs niet.','Plaats alle uitkomsten in Curva’s tabel.');
}
{
 const s=slide('Opgave 7d · Curva volledig',targetFooter);
 text(s,'Q: producten per week · TK, TO en winst: euro per week',60,199,1480,58,33);
 table(s,curvaFull,60,285,1480,357,widths,32);
 text(s,'Bij Q = 15 staat de uitkomst van de stap 10 → 15.',60,692,1480,73,40,{bold:true});
 text(s,'Controle: 5 × € 25 = € 125 extra kosten in die stap.',60,777,1480,61,35,{bold:true,color:C.orange});
 notes(s,'26','Alle zes ontbrekende marginale cellen zijn nu ingevuld. De winstkolom was al gegeven en blijft gelijk. Lees de laatste MK-uitkomst als 25 euro per extra product gemiddeld over vijf extra producten.','Over welke producten gaat de € 25 precies?','Het is niet het gemiddelde van alle vijftien producten en niet alleen de kosten van product vijftien.','Vergelijk de patronen en benoem de betekenis.');
}
{
 const s=slide('Opgave 7e · Patronen en betekenis',targetFooter);
 table(s,[['Onderneming','MK (€ per extra product)','Patroon'],['Linea','3 → 3 → 3','Constant'],['Curva','5 → 15 → 25','Stijgend']],60,222,1480,266,[385,620,475],36);
 text(s,'MK: extra totale kosten / extra producten',60,550,1480,74,43,{bold:true,color:C.orange});
 text(s,'MO: extra totale opbrengst / extra verkochte producten',60,654,1480,79,40,{bold:true,color:C.blue});
 text(s,'Beide uitkomsten beschrijven de hele genoemde tabelstap.',60,778,1480,60,36,{bold:true});
 notes(s,'26','Linea heeft constante MK, Curva stijgende MK. Een MK-uitkomst verdeelt de extra totale kosten over alle extra producten in de betreffende stap; MO doet hetzelfde met de extra opbrengst. De vaste prijzen verklaren de constante MO: 8 bij Linea en 30 bij Curva. Laat leerlingen hun antwoord controleren op berekening, eenheid, interval en verklaring. De opdracht vraagt geen winstmaximum; trek daar geen conclusie over.','Welke woorden mogen niet ontbreken bij een marginale uitkomst?','Per extra product binnen een stap is geen exact bedrag voor één afzonderlijk product en geen gemiddelde over de hele productie.','Keer terug naar de lesroute voor afsluiting en huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...facts,slides,overviewSlides:overviews,tableSlides:tables,chartSlides:[]},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.1.3 Marginale kosten en marginale opbrengsten – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
