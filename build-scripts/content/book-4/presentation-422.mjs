// HOW TO ADAPT: keep overview() shared; replace the manifest, authored example,
// source questions and answer steps together. Runtime paths come from the installed skill.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
  PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('422');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',pale:'#EFF4F7',line:'#C6D2DB',muted:'#445B6B'};
const FONT='Arial', tables=[],charts=[],slides=[],graphs=[],overviews=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/e734532a42b27732ac25ce990fc9448b12309d28/edities/books34-v3/books/book-4/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,{example=false,target=false}={}){
 const s=p.slides.add();s.background.fill='#FFFFFF';text(s,title,60,42,1480,82,52,{bold:true});rule(s,60,146,1480);
 text(s,example?'Uitlegvoorbeeld — niet uit het boek':target?'§4.2.2 Prijsdiscriminatie · Opgave 16 · Boekpagina 69':'§4.2.2 Prijsdiscriminatie',60,848,1380,30,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title,example,target});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{example=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, editie books34-v3, gedrukte pagina ${page} in het complete leerlingenboek. ${source}output/Boek_4_Compleet_v3.pdf\nMethode en opdrachten: ${source}chapters/4.2/4.2.2%20manuscript.md\nAntwoordmodel: ${source}chapters/4.2/Antwoorden.md#antwoord16\n${example?'Uitlegvoorbeeld — niet uit het boek. Speelatelier en alle bijbehorende getallen zijn afzonderlijk voor deze les gemaakt. De boekpagina’s onderbouwen alleen de methode.':''}\n${extra}`);
}
function table(s,values,x=60,y=250,w=1480,h=400,widths=[620,430,430],size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:r%2?'#FFFFFF':C.pale;cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
function rows(s,items,y=220,gap=140){items.forEach((a,i)=>{text(s,a[0],60,y+i*gap,480,65,37,{bold:true,color:C.blue});text(s,a[1],565,y+i*gap,970,100,37);if(i<items.length-1)rule(s,60,y+i*gap+114,1480);});}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.','Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 16.','Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §4.2.2 Prijsdiscriminatie');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Prijsdiscriminatie herkennen,\ngroepsprijzen berekenen en\nwinst en surplus vergelijken.',972,244,565,122,31,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 66 · Opgaven 10 en 11\n10: samenvoegen, steun p. 64\n11: verkennen, theorie p. 63',972,455,565,111,30,{bold:active===2,name:'overview-start'});rule(s,972,579,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§4.2.2 Prijsdiscriminatie\nBasis: 12 en 13\nZelfstandig: 14 en 15\nDoelopgave: 16\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'63–69',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 10–11 op p. 66, basis 12 op p. 66 en 13 op p. 67, zelfstandig 14 op p. 67 en 15 op p. 68, doel 16 op p. 69. Huiswerk: 12, 13, 14, 15 en 16 maken en nakijken. Bonus 17 en herhaling 18 zijn extra. Start 10 haalt TO, TK en winst uit §4.1.4 p. 38 op. Nieuw is twee omzetbedragen optellen bij één bedrijf: laat de formule op p. 64 gebruiken, zoals zichtbaar op het overzicht. Geef zo nodig de steun ‘tel ontvangsten op, tel alle bezoeken op, gebruik de gezamenlijke huur één keer’. Start 11 is verkennen: lees eerst definitie, voorwaarden en waarschuwing op p. 63. Leerlingen wijzen hun bewijs aan en noteren twijfel; dit is geen toets van al beheerste leerstof. Bij terugkeer vóór het basiswerk: laat de samenvoeging van 10 toelichten en laat 11 opnieuw proberen en leg uit waarom het product en kostenverschil tellen. Reserveer volgens de docentenhandleiding voorlopig twee lessen; geen gemeten tijdsfit. Rond zo nodig later af zonder basiswerk te schrappen.`, 'Welke stap kun je al uitleggen, en waar heb je de theorie nodig?', 'Een andere prijs alleen bewijst geen prijsdiscriminatie.',active===7?'Laat het huiswerk noteren en inventariseer vragen.':'Ga door naar de volgende lesfase.',{extra:'Docentenroute: '+source+'chapters/4.2/Docenteninformatie.md. Eerdere methode: '+source+'chapters/4.1/4.1.4%20manuscript.md, gedrukte p. 38. Startantwoorden voor feedback na de poging: 10a TO 520, TK 240, winst 280 euro per week; 10b gezamenlijke vaste kosten eenmaal. 11a situatie A; bij B verandert de rit en bij C de hoeveelheid opslag.'});return s;
}
// Native XY charts. Every series stores its equation-derived data in the PPTX.
function graph(s,{a,m,group,max=32,x=60,y=232,w=1000,h=565,reveal=0,showDemand=true}){
 const series=[];
 function curve(name,xs,ys,color,dash,labelIndex,labelText,position='top'){
  // Values in these linear models terminate within two decimals. Remove binary
  // floating-point tails so the editable Excel snapshot keeps exact decimals.
  xs=xs.map(n=>Number(n.toFixed(6)));ys=ys.map(n=>Number(n.toFixed(6)));
  series.push({name,xValues:xs,values:ys,line:{fill:color,width:3.5,...(dash?{style:'dashed'}:{})},marker:{symbol:'none'},...(labelText?{dataLabelOverrides:[{idx:labelIndex,text:labelText,position,showValue:false,textStyle:{typeface:FONT,fontSize:25,bold:true,fill:color}}]}:{})});
 }
 if(showDemand)curve('Vraag / GO',[0,a*.62,a],[a,a*.38,0],C.blue,false,1,'GO');
 curve('MO',[0,a/2],[a,0],C.purple,true);
 curve('MK',[0,max*.82,max],[m,m,m],C.orange,false,1,'MK');
 const q=(a-m)/2,price=a-q;
 if(reveal>=1)curve('Q gekozen',[q,q],[0,reveal===1?m:price],C.muted,true);
 if(reveal>=2)curve('P op GO',[0,q],[price,price],C.muted,true);
 // An invisible chart-anchored point places the MO label in clear space to
 // the left of the curve. This also clears the vertical quantity guide.
 series.push({name:'MO label',xValues:[Number((a*.28-max*.12).toFixed(6))],values:[Number((a*.44).toFixed(6))],line:{fill:'none',width:0},marker:{symbol:'none'},dataLabelOverrides:[{idx:0,text:'MO',position:'right',showValue:false,textStyle:{typeface:FONT,fontSize:25,bold:true,fill:C.purple}}]});
 const ch=s.charts.add('scatter',{position:{left:x,top:y,width:w,height:h},series,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false},xAxis:{min:0,max,majorUnit:max===40?10:8,numberFormatCode:'0',title:{text:`Q_${group} (bezoeken per week)`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max,majorUnit:8,numberFormatCode:'0',title:{text:'P, MO en MK (€ per bezoek)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,a,m,group,max,reveal,showDemand,series});return ch;
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');rows(s,[['Herkennen','Dezelfde dienst, andere prijs: je onderzoekt de voorwaarden.'],['Kiezen per groep','Je bepaalt Q met MO = MK en P met de eigen vraag.'],['Bedrijf vergelijken','Je berekent omzet en winst bij één en bij twee prijzen.'],['Welvaart beoordelen','Je vergelijkt CS, PS en TS en begrenst je conclusie.']],208,145);
 notes(s,'63–65','Verbind de doelen met FilmLab, opgave 16. Herinner aan de monopolieprocedure: hoeveelheid kiezen, haalbaarheid controleren, prijs op GO lezen, totale bedragen berekenen. Daarna vergelijken we kopers en aanbieder samen.','Waarom is meer winst nog geen bewijs voor meer totale welvaart?','Winst en PS verschillen door de constante kosten.','Onderzoek eerst wanneer een prijsverschil prijsdiscriminatie is.');
}
{
 const s=slide('Prijsdiscriminatie en de voorwaarden');text(s,'Dezelfde dienst, verschillende prijzen, zonder kostenverklaring',60,184,1480,106,42,{bold:true,color:C.blue});
 table(s,[['Voorwaarde','Bij een persoonlijk toegangsbewijs'],['Marktmacht','De aanbieder kan de prijs beïnvloeden.'],['Groepen herkennen en apart behandelen','Controle bepaalt wie welk tarief krijgt.'],['Doorverkoop verhinderen','De pas is alleen door de houder te gebruiken.']],60,337,1480,350,[660,820],32);
 text(s,'Een uitgebreidere dienst of extra bezorgkosten vraagt een andere beoordeling.',60,744,1480,82,34);
 notes(s,'63, 68','Prijsdiscriminatie vereist hetzelfde product en een prijsverschil dat niet door kostenverschillen wordt verklaard. Bespreek alle drie voorwaarden. Verschil in prijsgevoeligheid moet blijken uit gedrag of gegevens; het etiket student bewijst geen elasticiteit, en alleen de helling ook niet.','Waarom kan de aanbieder geen twee tarieven handhaven als iedereen de goedkope pas kan kiezen?','Een langere rit of luxer product is niet dezelfde dienst. Een andere prijs is op zichzelf onvoldoende bewijs.','Gebruik nu een afzonderlijk rekenvoorbeeld met twee herkenbare groepen.');
}
{
 const s=slide('Speelatelier: twee groepen, één bedrijf',{example:true});text(s,'Dezelfde toegang, gecontroleerde persoonlijke passen, marktmacht',60,190,1480,90,38,{bold:true,color:C.blue});
 table(s,[['Gegeven','Groep A','Groep B'],['Vraag (€ per bezoek)','P_A = 30 − Q_A','P_B = 18 − Q_B'],['Domein (bezoeken per week)','0 ≤ Q_A ≤ 30','0 ≤ Q_B ≤ 18']],60,319,1480,266,[620,430,430],32);
 text(s,'MK = € 6 per bezoek · TCK = € 36 per week\nCapaciteit: 48 bezoeken. Vraag en kosten blijven gelijk.\nEén vergelijkingsprijs is gegeven: € 15. Geen externe effecten.',60,639,1480,172,34);
 notes(s,'64–65','Dit authored Speelatelier-voorbeeld staat niet in het boek en werkt geen toegewezen oefening uit. MK blijft 6 euro ongeacht de gezamenlijke afzet en capaciteit bindt niet. Daarom kunnen we de groepen apart optimaliseren. Dezelfde vaste kosten horen bij één bedrijf. De vergelijkingsprijs 15 is gegeven, niet een nieuw optimalisatieprobleem.','Waarom moeten we ook de gezamenlijke capaciteit kennen?','Bij MK die van de totale afzet afhangt of een bindende capaciteit kunnen we de groepen niet zomaar los kiezen.','Haal de methode voor één groep op.',{example:true});
}
{
 const s=slide('Groep A: de marginale opbrengst',{example:true});rows(s,[['Vraag','P_A = 30 − Q_A'],['Totale omzet','TO_A = P_A × Q_A = 30Q_A − Q_A²'],['Afgeleide','MO_A = 30 − 2Q_A']],235,161);
 text(s,'Een lagere uniforme groepsprijs geldt ook voor eerdere verkopen.',60,760,1480,68,36,{bold:true,color:C.blue});
 notes(s,'36–38, 64','Herhaal de afleiding: omzet is prijs maal afzet. De afgeleide van 30Q is 30 en van −Q² is −2Q. Binnen groep A betaalt iedereen dezelfde prijs; daarom daalt MO sterker dan GO. §4.1.4 gedrukte p. 36 onderbouwt de afleiding, p. 37 het prijslezen, p. 38 TO minus TK. Deze p. 36–38 zijn in hoofdstuk 4.1, niet de hoofdstuklokale 22–24.','Waarom is MO_A niet gelijk aan P_A?','Pas de afgeleide toe op TO, niet rechtstreeks op de vraagfunctie.','Kies de hoeveelheid met MO en MK.',{example:true,extra:'Eerdere methode: '+source+'chapters/4.1/4.1.4%20manuscript.md'});
}
{
 const s=slide('Groep A: eerst de hoeveelheid',{example:true});graph(s,{a:30,m:6,group:'A',reveal:1,showDemand:false});
 text(s,'MO_A = MK',1110,215,420,58,36,{bold:true,color:C.purple});text(s,'30 − 2Q_A = 6\n24 = 2Q_A\nQ_A = 12',1110,307,425,194,36);
 text(s,'Vóór Q_A = 12:\nMO > MK\n\nErna: MO < MK',1110,552,425,221,32,{bold:true});
 notes(s,'36, 64','Winst neemt toe tot 12 en af daarna: bij 10 is MO 10 > 6, bij 14 is MO 2 < 6. Het horizontale bedrag 6 is MK en hier ook MO, nog niet de prijs. De volgende dia behoudt dezelfde assen.','Welke hoeveelheid hoort bij het snijpunt?','De hoogte van het snijpunt is geen verkoopprijs.','Voeg de vraaglijn toe en lees P bij dezelfde Q.',{example:true});
}
{
 const s=slide('Groep A: de prijs op de vraaglijn',{example:true});graph(s,{a:30,m:6,group:'A',reveal:2});
 text(s,'Q_A = 12',1110,234,420,60,42,{bold:true});text(s,'P_A = 30 − 12\nP_A = € 18',1110,361,425,134,38,{bold:true,color:C.blue});text(s,'12 bezoeken per week\n€ 18 per bezoek',1110,590,425,139,32);
 notes(s,'37, 64','Volg de verticale hulplijn bij 12 naar GO en daarna horizontaal naar P = 18. De prijs is hoger dan MO = MK = 6. Terugcontrole: 30 − 18 = 12. GO betekent gemiddelde opbrengst, hier dezelfde prijs per bezoek.','Waar lees je de prijs af?','Lees geen prijs op de MO-lijn.','Herhaal dezelfde methode voor B.',{example:true});
}
{
 const s=slide('Groep B: dezelfde methode',{example:true});graph(s,{a:18,m:6,group:'B',reveal:2});
 text(s,'TO_B = 18Q_B − Q_B²\nMO_B = 18 − 2Q_B',1080,208,460,126,32);text(s,'18 − 2Q_B = 6\nQ_B = 6\nP_B = 18 − 6 = € 12',1080,382,460,194,35,{bold:true,color:C.blue});text(s,'Samen 12 + 6 = 18\n18 ≤ 48 bezoeken',1080,657,460,116,34,{bold:true});
 notes(s,'64','Bij B is Q 6 en P 12. MO is vóór 6 groter dan 6 en erna kleiner. Beide keuzes liggen in hun vraagdomein, samen binnen de capaciteit 48. De schaal is gelijk aan de vorige grafiek, ook al eindigt de vraag van B eerder.','Waarom staat groep B niet op een andere schaal?','Het label van een klantgroep is geen bewijs van elasticiteit; de functies bepalen de rekenuitkomst.','Vergelijk de totale bedragen met de gegeven uniforme prijs.',{example:true});
}
{
 const s=slide('Speelatelier: omzet, kosten en winst',{example:true});text(s,'Bij P = € 15: Q_A = 30 − 15 = 15 en Q_B = 18 − 15 = 3',60,190,1480,82,35,{bold:true,color:C.blue});
 table(s,[['Per week','Eén prijs: € 15','Groepsprijzen'],['Afzet','15 + 3 = 18','12 + 6 = 18'],['TO','15 × 18 = € 270','18 × 12 + 12 × 6 = € 288'],['TK','36 + 6 × 18 = € 144','36 + 6 × 18 = € 144'],['Winst = TO − TK','270 − 144 = € 126','288 − 144 = € 144']],60,306,1480,401,[520,460,500],31);
 text(s,'TCK eenmaal. TVK over alle bezoeken samen.',60,763,1480,61,38,{bold:true,color:C.orange});
 notes(s,'38, 64–65','Reken de uniforme hoeveelheden uit de vraag terug. Tel de twee ontvangsten op voor TO. TVK is 6 maal de totale afzet, plus eenmaal TCK 36 geeft TK. Door dezelfde totale afzet zijn TK gelijk; dit hoeft in een andere case niet zo te zijn.','Welke kosten zouden we dubbel tellen als we per groep de hele huur aftrekken?','TO − TCK vergeet variabele kosten. TO − TVK is PS, niet winst.','Bekijk de gevolgen voor de twee klantgroepen.',{example:true});
}
{
 const s=slide('Speelatelier: kopers krijgen een ander surplus',{example:true});text(s,'CS per groep = ½ × afzet × (maximale betalingsbereidheid − prijs)',60,187,1480,100,37,{bold:true,color:C.blue});
 table(s,[['CS (€ per week)','Eén prijs','Groepsprijzen'],['Groep A','½ × 15 × 15 = 112,50','½ × 12 × 12 = 72'],['Groep B','½ × 3 × 3 = 4,50','½ × 6 × 6 = 18'],['Totaal CS','117','90']],60,324,1480,330,[460,510,510],31);
 text(s,'A betaalt meer en verliest € 40,50 CS.\nB betaalt minder en wint € 13,50 CS.',60,710,1480,118,36,{bold:true});
 notes(s,'55, 65','De driehoek ligt boven de prijs en onder de lineaire vraag tot de afzet. Bij A is de hoogte bij één prijs 30−15=15 en bij groepsprijzen 30−18=12. Bij B zijn de hoogtes 18−15=3 en 18−12=6. Totaal CS daalt met 27 euro. Benoem eerst elke groep, daarna de som.','Wie wint en wie verliest als de tarieven veranderen?','Korting voor B betekent niet dat alle klanten winnen.','Voeg het producentensurplus toe.',{example:true});
}
{
 const s=slide('Speelatelier: winst en totale welvaart',{example:true});table(s,[['€ per week','Eén prijs','Groepsprijzen'],['PS = TO − TVK','270 − 108 = 162','288 − 108 = 180'],['Winst = PS − TCK','162 − 36 = 126','180 − 36 = 144'],['TS = CS + PS','117 + 162 = 279','90 + 180 = 270']],60,229,1480,375,[540,470,470],32);
 text(s,'Winst stijgt € 18. TS daalt € 9.',60,659,1480,64,44,{bold:true,color:C.orange});text(s,'Gelijke totale afzet, andere verdeling van bezoeken.',60,768,1480,61,37);
 notes(s,'55, 65','TVK is 108 in beide situaties. PS laat TCK buiten beschouwing; winst trekt 36 af. TS telt voordelen van kopers en aanbieder op. Hier blijft TCK gelijk en zijn er geen externe effecten, zodat ΔTS het verschil in gezamenlijk voordeel weergeeft. De afzet is gelijk maar minder A-bezoeken en meer B-bezoeken veranderen de waarde van de verkopen.','Waarom vergelijken we ook TS?','Meer winst of dezelfde totale afzet garandeert geen hogere totale welvaart.','Controleer de redenering met één uitspraak.',{example:true});
}
for(const reveal of [false,true]){
 const s=slide(reveal?'Korte controle: de conclusie':'Korte controle',{example:true});text(s,'“B krijgt korting en de winst stijgt.\nDus iedereen gaat erop vooruit.”',60,224,1480,171,50,{bold:true,color:C.blue});
 if(reveal){rows(s,[['Groep A','CS daalt € 40,50 per week.'],['Alle partijen samen','TS daalt € 9 per week.']],463,137);text(s,'Dit resultaat geldt voor deze vraag, kosten en afzet.',60,764,1480,65,35,{bold:true});}
 else text(s,'Klopt dit? Gebruik een bedrag voor een klantgroep\nen een bedrag voor alle partijen samen.',60,530,1480,164,41);
 notes(s,'65, 68',reveal?'De uitspraak klopt niet: A verliest en het gezamenlijke surplus daalt. Het gaat om deze case; bereik van nieuwe kopers of andere kosten kan in een andere case een andere verandering geven.':'Laat leerlingen eerst zelf antwoorden, daarna kort hun bewijs noemen. Gebruik het aparte voorbeeld; dit voegt geen huiswerk toe.', 'Welke twee bedragen weerleggen de uitspraak?', 'Een uitkomst in één case is geen algemene wet.',reveal?'Keer terug naar start 11 en begin bij basis 12 en 13.':'Bespreek na de reacties de twee bedragen.',{example:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 16 · Bron A: FilmLab',{target:true});text(s,'Dezelfde toegangsdienst voor A en B. FilmLab heeft marktmacht.\nPersoonlijke passen, gecontroleerde groepen, geen doorverkoop.',60,190,1480,122,36,{bold:true});
 table(s,[['Gegeven','Groep A','Groep B'],['Vraag','P_A = 40 − Q_A','P_B = 24 − Q_B'],['Domein (bezoeken per week)','0 ≤ Q_A ≤ 40','0 ≤ Q_B ≤ 24']],60,367,1480,258,[620,430,430],32);
 text(s,'P: euro per bezoek. Q_A en Q_B: bezoeken per week.\nMK = € 8 voor elk bezoek. TCK = € 80 per week, samen.\nCapaciteit: 64 bezoeken.',60,681,1480,146,34);
 notes(s,'69','Toon de echte doelopgave pas na de oefenfase. Dit is de volledige context van bron A, in tabelvorm. Geef nog geen uitkomsten. MK blijft voor alle bezoeken 8, TCK is gezamenlijk en capaciteit 64.','Welke gegevens gelden voor beide groepen samen?','Dezelfde aanbieder betekent niet dat de groepen dezelfde vraag hebben.','Toon bron B voordat de vragen worden besproken.');
}
{
 const s=slide('Opgave 16 · Bron B: de vergelijking',{target:true});table(s,[['Gegeven','Eén prijs','Groepsprijzen'],['Gemeenschappelijke prijs','€ 20 per bezoek','Afzonderlijk winstmaximaal'],['Afzet bij de gegeven prijs','A: 20 bezoeken; B: 4','Zelf te bepalen'],['Totaal CS (€ per week)','208','160']],60,217,1480,359,[530,475,475],32);
 text(s,'De vraag en kosten veranderen niet. Er zijn geen externe effecten.',60,632,1480,90,38,{bold:true});text(s,'Gebruik beide bronnen. Je hoeft de gemeenschappelijke prijs\nvan € 20 niet opnieuw te bepalen.',60,752,1480,82,34,{bold:true,color:C.blue});
 notes(s,'69','Alle bedragen op deze dia zijn gegeven in bron B; het totale CS is hier dus geen prijsgegeven antwoord. Onderstreep dat de uniforme prijs gegeven is. De groepsprijzen moeten wel berekend worden.','Welk surplus hoef je voor vraag d niet opnieuw af te leiden?','De € 208 in bron B is CS, niet een opgegeven winst.','Laat ook de oningevulde bronfiguur zien.');
}
{
 const s=slide('Opgave 16 · De twee bronpanelen',{target:true});text(s,'Groep A',60,177,710,48,35,{bold:true});text(s,'Groep B',840,177,700,48,35,{bold:true});
 graph(s,{a:40,m:8,group:'A',max:40,x:60,y:238,w:710,h:520});graph(s,{a:24,m:8,group:'B',max:40,x:840,y:238,w:700,h:520});
 text(s,'Vul de benodigde hoeveelheden en prijzen aan.',60,780,1480,54,36,{bold:true,color:C.blue});
 notes(s,'69','Dit zijn de twee grafieken uit figuur 10, opnieuw opgebouwd als bewerkbare XY-grafieken. Functies, domeinen en gelijke schaal zijn behouden. GO is de vraaglijn. Er staan nog geen optimale hoeveelheden of prijsmarkeringen.','Op welke lijn komt straks de verkoopprijs?','De MO/MK-kruising levert niet de prijs.','Toon eerst alle vijf deelvragen, zonder antwoorden.',{extra:'Bronfiguur: '+source+'chapters/4.2/_assets/422_target.svg'});
}
{
 const s=slide('Opgave 16 · Deelvragen a, b en c',{target:true});
 rows(s,[['a · 3 punten','Bereken per groep MO, de winstmaximale hoeveelheid en de groepsprijs.'],['b · 3 punten','Bereken TO en winst bij één prijs en bij de groepsprijzen.'],['c · 2 punten','Welke groep betaalt meer en welke minder? Noem één noodzakelijke voorwaarde uit bron A.']],227,191);
 notes(s,'69','Lees de volledige vragen a–c zonder uitwerkingen. Leerlingen gebruiken beide bronnen en houden hun eigen werk erbij. De volgorde van de opdracht blijft behouden.','Welke tussenstappen vraagt a voordat je een prijs kunt geven?','Alleen Q en P zonder MO is niet de volledige vraag.','Toon ook d en e voordat je antwoorden onthult.');
}
{
 const s=slide('Opgave 16 · Deelvragen d en e',{target:true});
 text(s,'d · 3 punten',60,223,330,62,39,{bold:true,color:C.blue});text(s,'Bereken met bron B PS en TS in beide situaties.\nIs de hogere winst hier ook een hogere totale welvaart?',420,223,1120,172,38);rule(s,60,440,1480);
 text(s,'e · 2 punten',60,497,330,62,39,{bold:true,color:C.blue});text(s,'Waarom bewijst deze ene case niet dat prijsdiscriminatie\naltijd welvaart verlaagt?',420,497,1120,180,38);
 notes(s,'69','Nu zijn alle vijf deelvragen en beide bronnen getoond zonder oplossingen. Geef leerlingen gelegenheid hun vergelijking af te maken. Begin de bespreking daarna bij a.','Wat moet je berekenen om over totale welvaart te oordelen?','De richting van de winst is geen antwoord op d.','Start de uitwerking met groep A.');
}
{
 const s=slide('Opgave 16a · Groep A',{target:true});graph(s,{a:40,m:8,group:'A',max:40,reveal:2,w:930});
 text(s,'TO_A = 40Q_A − Q_A²\nMO_A = 40 − 2Q_A',1050,205,490,123,34);text(s,'40 − 2Q_A = 8\n32 = 2Q_A\nQ_A = 16 bezoeken',1050,387,490,183,36,{bold:true,color:C.purple});text(s,'P_A = 40 − 16\nP_A = € 24 per bezoek',1050,655,490,131,36,{bold:true,color:C.blue});
 notes(s,'69','Stel TO op en leid MO af. Los MO = 8 op, daarna P op GO. Bij Q 15 is MO 10 > 8, bij 17 is MO 6 < 8. De winst stijgt eerst en daalt daarna. Q 16 ligt in 0–40. De grafische hulplijnen gebruiken dezelfde exacte waarden.','Waarom vul je 16 daarna nog in de vraag in?','€ 8 is MO = MK, geen groepsprijs.','Voer dezelfde stappen uit bij B.');
}
{
 const s=slide('Opgave 16a · Groep B en de controle',{target:true});graph(s,{a:24,m:8,group:'B',max:40,reveal:2,w:930});
 text(s,'TO_B = 24Q_B − Q_B²\nMO_B = 24 − 2Q_B',1050,203,490,123,34);text(s,'24 − 2Q_B = 8\nQ_B = 8 bezoeken\nP_B = 24 − 8 = € 16',1050,374,490,196,36,{bold:true,color:C.blue});text(s,'Samen: 16 + 8 = 24\n24 ≤ 64 bezoeken',1050,669,490,117,36,{bold:true});
 notes(s,'69','Voor B ligt Q 8 in 0–24. Bij 7 is MO 10 > 8, bij 9 is MO 6 < 8. Beide marginale lijnen dalen door MK. Gezamenlijke afzet 24 past binnen 64. Gelijke constante MK en niet-bindende capaciteit maken de afzonderlijke keuzes uitvoerbaar.','Welke controle kun je pas na beide groepen afronden?','Controleer niet alleen twee losse hoeveelheden, maar ook de gezamenlijke capaciteit.','Vergelijk nu omzet, totale kosten en winst.');
}
{
 const s=slide('Opgave 16b · Omzet en winst',{target:true});table(s,[['Per week','Eén prijs: € 20','Groepsprijzen'],['Totale afzet','20 + 4 = 24','16 + 8 = 24'],['TO','20 × 24 = € 480','24 × 16 + 16 × 8 = € 512'],['TK','80 + 8 × 24 = € 272','80 + 8 × 24 = € 272'],['Winst = TO − TK','480 − 272 = € 208','512 − 272 = € 240']],60,223,1480,435,[510,475,495],31);
 text(s,'Winst stijgt met 240 − 208 = € 32 per week.',60,711,1480,74,42,{bold:true,color:C.orange});
 notes(s,'69','Groepsomzet A 384 plus B 128 geeft 512. TVK zijn 8 × 24 = 192 en TCK is eenmaal 80. TK is 272. De winst stijgt 32, gelijk aan ΔTO omdat de totale afzet en kosten hier gelijk blijven.','Welke kostenpost hoort maar één keer in TK?','De 208 winst hier is toevallig gelijk aan het gegeven CS bij één prijs; het zijn verschillende grootheden.','Vergelijk wie welk tarief betaalt.');
}
{
 const s=slide('Opgave 16c · Prijzen en uitvoerbaarheid',{target:true});table(s,[['Prijs per bezoek','Eerst','Bij groepsprijzen'],['Groep A','€ 20','€ 24: € 4 meer'],['Groep B','€ 20','€ 16: € 4 minder']],60,234,1480,283,[620,430,430],35);
 text(s,'Noodzakelijke voorwaarde uit bron A',60,576,1480,66,39,{bold:true,color:C.blue});text(s,'De persoonlijke, gecontroleerde passen houden de groepen\ngescheiden en verhinderen doorverkoop.',60,679,1480,137,40);
 notes(s,'69','A betaalt meer en koopt minder, B betaalt minder en koopt meer. Eén noodzakelijke voorwaarde volstaat in c. Naast persoonlijke passen noemt bron A marktmacht; een goed verbonden formulering is toegestaan.','Wat zou gebeuren als een bezoeker van A eenvoudig een goedkope pas kon gebruiken?','De hogere prijs is geen bewijs op basis van een groepsetiket: de bronfuncties dragen de keuze.','Houd producentensurplus en winst apart.');
}
{
 const s=slide('Opgave 16d · Eerst het producentensurplus',{target:true});text(s,'PS = TO − TVK',60,193,1480,83,49,{bold:true,color:C.blue});
 table(s,[['€ per week','Eén prijs','Groepsprijzen'],['TVK','8 × 24 = 192','8 × 24 = 192'],['PS','480 − 192 = 288','512 − 192 = 320'],['Controle: PS − TCK','288 − 80 = 208 winst','320 − 80 = 240 winst']],60,335,1480,334,[540,470,470],32);
 text(s,'Voor de winst trek je de gezamenlijke € 80 van PS af.',60,735,1480,81,39,{bold:true});
 notes(s,'55, 69','Producentensurplus is opbrengst boven variabele kosten. Bij constante MK kan PS ook als Q maal het prijs-kostenverschil per groep worden berekend: één prijs 24×12=288, twee prijzen 16×16 + 8×8=320. Controleer door 80 af te trekken; dat geeft de eerder berekende winsten.','Waarom trekken we bij PS geen 80 af?','PS verwarren met winst maakt de niveauvergelijking van TS fout.','Tel de gegeven consumentensurplussen uit bron B erbij op.');
}
{
 const s=slide('Opgave 16d · Dan het totale surplus',{target:true});table(s,[['€ per week','Eén prijs','Groepsprijzen'],['CS (bron B)','208','160'],['PS','288','320'],['TS = CS + PS','208 + 288 = 496','160 + 320 = 480']],60,220,1480,371,[540,470,470],35);
 text(s,'ΔTS = 480 − 496 = −€ 16 per week',60,644,1480,73,44,{bold:true,color:C.orange});text(s,'De winst stijgt € 32. De totale welvaart daalt in deze case.',60,756,1480,72,36,{bold:true});
 notes(s,'69','Controle met veranderingen: ΔCS = −48, ΔPS = +32, samen ΔTS = −16 euro per week. Vraag en kosten blijven gelijk, er zijn geen externe effecten en TCK blijft 80. Dus de hogere winst gaat hier samen met een lager totaal surplus. Hoewel totale afzet 24 blijft, verandert de verdeling van bezoeken.','Welk verlies is groter dan de winst van de aanbieder?','Gelijke totale afzet betekent niet dat dezelfde bezoeken bij dezelfde betalingsbereidheid plaatsvinden.','Begrens de conclusie tot de gegevens.');
}
{
 const s=slide('Opgave 16e · De grens van deze conclusie',{target:true});rows(s,[['In FilmLab','TS daalt € 16 bij deze vraag, kosten en afzet.'],['Een andere case','Een lagere prijs kan kopers bereiken die eerst niets kochten.'],['Voor een oordeel','Onderzoek opnieuw hoeveelheden, kosten en surplus.']],238,174);
 notes(s,'69','De berekening bewijst geen algemene richting. Andere vraagverhoudingen, kosten en bereik van kopers kunnen TS anders veranderen. Extra kopers zijn een mogelijk mechanisme, geen bewezen uitkomst zonder data. Laat leerlingen hun antwoord in drie zinnen controleren: bedrijfsresultaat, verdeling, beperkte welvaartsconclusie.','Welke extra informatie heb je nodig voor een andere case?','Zeg niet dat prijsdiscriminatie altijd welvaart verlaagt of altijd verhoogt.','Laat het overzicht staan voor afsluiting en huiswerk.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviews,tables,charts,graphs},null,2));
const draft=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const tableOwners=[...new Set(tables)],chartOwners=[...new Set(charts)];
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.2.2 Prijsdiscriminatie – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tableOwners.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tableOwners,requiredNativeChartOwnerSlides:chartOwners,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviewSlides:overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
