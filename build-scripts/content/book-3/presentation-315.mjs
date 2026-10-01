// HOW TO ADAPT: derive a new source manifest and exercise route before changing
// content. Runtime discovery and finalization follow classroom-presentation.md.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('315');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E8449',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',hatch:'#D0AD80'};
const FONT='Arial', title='3.1.5 Minimumprijs en quota';
const source='https://github.com/meijer1973/4veco-lessen/blob/9b8304d5031cafac936a56281e144573a25fbbc9/edities/books34-v3/';
const tables=[], charts=[], slides=[], graphSpecs=[], overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(heading,{example=false,target=false}={}){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,heading,60,42,1480,82,52,{bold:true});rule(s,60,146,1480);
 const footer=example?'Uitlegvoorbeeld — niet uit het boek':target?'§3.1.5 · Opgave 43 · Boekpagina 46':'§3.1.5 Minimumprijs en quota';
 text(s,footer,60,848,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:heading,example,target});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{example=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3 v3, geselecteerde en herstelde editie, compleet leerlingboek, gedrukte pagina ${page}. ${source}books/book-3/output/Boek_3_Compleet_v3.pdf\nAntwoorden en docentroute: ${source}books/book-3/chapters/3.1/Antwoorden.md en ${source}books/book-3/chapters/3.1/Docenteninformatie.md\n${example?'Uitlegvoorbeeld — niet uit het boek. Kruidenpotten, functies en getallen zijn voor deze uitleg gemaakt. De boekverwijzing onderbouwt de methode, niet deze context of data.':''}\n${extra}`);
}
function table(s,values,y,height,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:60,top:y,width:1480,height,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=height/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.', 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.', 'Bespreken van de doelopgave: opgave 43.', 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §3.1.5 Minimumprijs en quota');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color,name:`route-number-${i+1}`});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:`route-${i+1}`});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Binding en overschot bepalen.\nOpkoop en uitgaven berekenen.\nEen quotum ermee vergelijken.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 42 · Opgaven 37 en 38\nVerkennen met theorie p. 39–40',972,459,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.1.5 Minimumprijs en quota\nBasis: 39, 40 en 40A\nZelfstandig: 41 en 42\nDoelopgave: 43\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'39–46',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 37–38 staat op p. 42 van het complete boek. Basis 39–40 staat op p. 43 en 40A op p. 44; zelfstandig 41–42 op p. 45; doel 43 op p. 46. Huiswerk: 39, 40, 40A, 41, 42 en 43 maken en nakijken. 40A is de afzonderlijke quotumoefening en kan vóór 40c. Bonus 44 en herhaling 45 zijn extra.\n\nStart 37 gebruikt bekende gelijkstelling en invullen, maar het aanbodoverschot en de minimumprijs in 38 zijn verkenning. Laat leerlingen eerst de definitie op p. 39 en het onderscheid vraag/aanbod/verkoop op p. 40 lezen. Bij Q(P) stel je voor evenwicht de twee hoeveelheden gelijk; bij een gegeven prijs vul je die prijs in beide functies in. Doe de start niet voor. Laat leerlingen markeren welke uitleg hen helpt. Keer na de uitleg, bij dit overzicht vóór basiswerk, terug naar 37–38 en laat antwoorden en redeneringen verbeteren.\n\nDocentplanning: de bron adviseert voorlopig twee lessen van 55 minuten met zo nodig uitloop. Ook 110 minuten is niet aangetoond. Rond de volledige route in een vervolg of als huiswerk af; sla 40A niet over om tijd te winnen.`,
 'Welke stap kun je al, en waar gebruik je de theorie?', 'De hoofdstukbron noemt p. 38 en 42. In het complete leerlingboek zijn dit gedrukte p. 42 en 46.',active===7?'Laat het huiswerk noteren.':'Ga door met de volgende lesfase.',{extra:'Startantwoorden voor de docent: 37: P₀ = € 12, Q₀ = 40 kratten/week; bij € 14: Qv = 30, Qa = 50, overschot = 20 kratten/week. 38: € 12 blijft toegestaan boven de ondergrens € 9.'});
}
const E={d:24,b:.2,a:6,c:.1,xmax:120,ymax:26,step:15,q:60,p:12,price:15,qv:45,qa:90,unit:'potten kruiden'};
const T={d:20,b:.1,a:8,c:.1,xmax:160,ymax:26,step:20,q:60,p:14,price:16,qv:40,qa:80,unit:'kratten paddenstoelen'};
function series(name,x,y,color,width=3,style='solid',label){
 const v={name,xValues:x,values:y,line:{fill:color,width,style},marker:{symbol:'none'}};
 if(label)v.dataLabelOverrides=[{idx:x.length-1,text:label,position:'r',showValue:false,textStyle:{typeface:FONT,fontSize:26,bold:true,fill:color}}];
 return v;
}
function graph(s,m,mode,{wide=false}={}){
 const ss=[];
 if(mode==='purchase'){
  // Hatch and border are chart series in data coordinates, so the expenditure
  // region remains editable and moves correctly if the plot is resized.
  for(let y=1;y<m.price;y+=1)ss.push(series(`U-arcering ${y}`,[m.qv,m.qa],[y,y],C.hatch,1.3));
  ss.push(series('U-rechthoek',[m.qv,m.qa,m.qa,m.qv,m.qv],[0,0,m.price,m.price,0],C.orange,3));
 }
 ss.push(series('V',[0,m.xmax],[m.d,m.d-m.b*m.xmax],C.blue,4,'solid','V'));
 ss.push(series('A',[0,m.xmax],[m.a,m.a+m.c*m.xmax],C.green,4,'solid','A'));
 if(mode==='free'){
  ss.push(series('Vrij evenwicht',[0,m.q,m.q],[m.p,m.p,0],C.muted,2,'dashed'));
 }
 if(['floor','purchase'].includes(mode)){
  ss.push(series('Pmin',[0,m.xmax],[m.price,m.price],C.orange,3,'dashed'));
  ss.push(series('Qv',[m.qv,m.qv],[0,m.price],C.blue,2,'dashed'));
  ss.push(series('Qa',[m.qa,m.qa],[0,m.price],C.green,2,'dashed'));
 }
 if(mode==='quota'){
  ss.push(series('Quotum',[m.qv,m.qv],[0,m.ymax],C.orange,3,'dashed'));
  ss.push(series('Verkoopprijs op V',[0,m.qv],[m.price,m.price],C.blue,2,'dashed'));
 }
 const ch=s.charts.add('scatter',{position:{left:60,top:238,width:wide?1470:1040,height:568},series:ss,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:m.xmax,majorUnit:m.step,numberFormatCode:'0',title:{text:`Q (${m.unit} per week)`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:m.ymax,majorUnit:5,numberFormatCode:'0',title:{text:m===E?'P (€ per pot)':'P (€ per krat)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphSpecs.push({slide:p.slides.items.length,model:m===E?'E':'T',mode,series:ss.map(v=>({name:v.name,x:v.xValues,y:v.values}))});
}
function right(s,head,body,bottom=''){text(s,head,1140,250,400,86,36,{bold:true,color:C.blue});text(s,body,1140,360,400,300,34);if(bottom)text(s,bottom,1140,696,400,130,32,{bold:true,color:C.orange});}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Minimumprijs','Je bepaalt of de ondergrens bindt en berekent Qv en Qa.'],['Opkoopgarantie','Je bepaalt wie de producten koopt en berekent de uitgaven.'],['Productiequotum','Je bepaalt de hoeveelheid en leest de prijs op de vraaglijn.']];
 rows.forEach((r,i)=>{const y=235+i*190;text(s,r[0],60,y,580,65,40,{bold:true,color:C.blue});text(s,r[1],700,y,835,120,38);if(i<2)rule(s,60,y+146,1480);});
 notes(s,'39–42','Koppel de drie doelen aan de verschillende regelingen. Vraag, aanbod en werkelijk verkochte hoeveelheid zijn drie verschillende grootheden. Uit §3.1.4 gebruiken we het vrije evenwicht en het toetsen van een prijsgrens opnieuw. De richting van de grens verandert.','Wat betekent het dat een prijs nog is toegestaan?','De regel voor een maximumprijs heeft de omgekeerde richting.','Begin met een eigen oefenmarkt.');
}
{
 const s=slide('Uitlegvoorbeeld: kruidenpotten',{example:true});
 text(s,'Veel kwekers en particuliere kopers',60,200,1480,60,39,{bold:true,color:C.blue});
 text(s,'Vraag: P = 24 − 0,20Q\nAanbod: P = 6 + 0,10Q',60,310,1480,170,48,{bold:true});
 text(s,'Q = potten kruiden per week\nP = euro per pot',60,535,1480,124,39);
 text(s,'Eerst de vrije markt, daarna één regeling tegelijk.',60,733,1480,68,39,{bold:true});
 notes(s,'39–42','Deze zelfgemaakte markt is geen boekopgave. Alle potten zijn gelijk. Er veranderen geen andere vraag- of aanbodfactoren. Later voegen we apart een minimumprijs, volledige opkoop en daarna een quotum toe.','Welke eenheden staan bij Q en P?','De drie regelingen gelden niet tegelijkertijd.','Herhaal kort het berekenen van het vrije evenwicht.',{example:true});
}
{
 const s=slide('Vrij evenwicht berekenen',{example:true});
 text(s,'Vraagprijs = aanbodprijs',60,195,1480,55,36,{bold:true,color:C.blue});
 text(s,'24 − 0,20Q = 6 + 0,10Q\n18 = 0,30Q\nQ₀ = 60 potten per week',60,289,1480,222,46,{bold:true});
 text(s,'P₀ = 24 − 0,20 × 60 = € 12 per pot',60,590,1480,73,43,{bold:true,color:C.blue});
 text(s,'Controle in aanbod: 6 + 0,10 × 60 = 12',60,731,1480,67,36);
 notes(s,'34 en 42','Bij P(Q) stel je de prijzen gelijk en los je eerst Q op. Dezelfde vraag kan geschreven worden als Qv = 120 − 5P en aanbod als Qa = 10P − 60. Bij die Q(P)-vorm stel je hoeveelheden gelijk: 120 − 5P = 10P − 60 geeft P = 12 en daarna Q = 60. Zo verbind je beide representaties. Deze herhaling is belangrijk bij start 37.','Wat los je eerst op als beide functies Q als uitkomst hebben?','Gelijkstellen vraagt dezelfde grootheid aan beide kanten.','Lees de uitkomst af in de grafiek.',{example:true});
}
{
 const s=slide('Het vrije evenwicht in de grafiek',{example:true});graph(s,E,'free');
 right(s,'V en A snijden','Q₀ = 60\nP₀ = € 12','Vraag = aanbod');
 notes(s,'39–42','V daalt en A stijgt. De hulplijnen verbinden het snijpunt met Q = 60 en P = 12. Hoeveelheden staan horizontaal, euro per pot verticaal. De grafiek gebruikt dezelfde functies als de vorige dia.','Waarom horen de twee uitkomsten bij hetzelfde punt?','Een punt op V alleen is nog geen evenwicht.','Voeg een prijsgrens toe.',{example:true});
}
{
 const s=slide('Wanneer bindt een minimumprijs?',{example:true});
 text(s,'Vrije prijs: € 12 per pot',60,198,1480,63,40,{bold:true,color:C.blue});
 table(s,[['Minimumprijs','Mag de vrije prijs nog?','Gevolg'],['€ 15','Nee: € 12 ligt onder € 15.','Bindend'],['€ 10','Ja: € 12 ligt boven € 10.','Vrij evenwicht blijft']],310,300,[340,715,425],33);
 text(s,'Een minimumprijs is de laagste toegestane verkoopprijs.',60,704,1480,102,40,{bold:true});
 notes(s,'39','Het voorbeeld met 10 is een afzonderlijke, niet-bindende regeling. Een minimum van 12 zou het vrije evenwicht precies toelaten. Vergelijk altijd eerst met de vrije prijs, vóór invullen.','Welke prijzen verbiedt een minimum van 15?','Een minimum is geen verplicht prijskaartje.','Bereken nu bij de bindende ondergrens van 15.',{example:true});
}
{
 const s=slide('Hoeveelheden bij € 15',{example:true});
 text(s,'Particuliere vraag',60,197,700,58,36,{bold:true,color:C.blue});
 text(s,'15 = 24 − 0,20Qv\n0,20Qv = 9\nQv = 45 potten',60,294,690,220,43,{bold:true});
 text(s,'Gewenst aanbod',850,197,690,58,36,{bold:true,color:C.green});
 text(s,'15 = 6 + 0,10Qa\n0,10Qa = 9\nQa = 90 potten',850,294,690,220,43,{bold:true});rule(s,60,573,1480);
 text(s,'Aanbodoverschot = Qa − Qv\n= 90 − 45 = 45 potten per week',60,628,1480,145,44,{bold:true,color:C.orange});
 notes(s,'39–42','Gebruik één en dezelfde minimumprijs in beide oorspronkelijke functies. Vraag en aanbod verschuiven niet. Het verschil is het gewenste aanbod dat particuliere kopers niet afnemen.','Waarom trek je hier vraag van aanbod af?','Bij een maximumprijs was er een vraagoverschot. Neem niet automatisch dezelfde aftrekvolgorde.','Onderscheid het gewenste aanbod van de werkelijke verkoop.',{example:true});
}
{
 const s=slide('Minimumprijs zonder opkoop',{example:true});graph(s,E,'floor');
 right(s,'Pmin = € 15','Qv = 45\nQa = 90\n\nParticulieren\nkopen 45 potten.','Overheid: 0\nU = € 0');
 notes(s,'40','Er is geen opkoop of andere afnemer. Daardoor worden alleen de 45 gevraagde potten verkocht. A vertelt wat kwekers willen aanbieden, niet dat alle 90 worden geproduceerd en verkocht. De verticale hulplijnen tonen 45 en 90. De horizontale lijn is de prijsgrens.','Zijn de 90 aangeboden potten ook allemaal verkocht?','Een prijsregel maakt de overheid niet vanzelf koper.','Verander nu alleen de aankoopbelofte.',{example:true});
}
{
 const s=slide('Dezelfde prijs met volledige opkoop',{example:true});
 text(s,'De overheid koopt elk overblijvend aangeboden potje voor € 15.',60,188,1480,110,38,{bold:true,color:C.blue});
 table(s,[['Per week','Zonder opkoop','Met volledige opkoop'],['Particuliere aankopen','45 potten','45 potten'],['Overheidsaankopen','0 potten','90 − 45 = 45 potten'],['Totale verkopen','45 potten','45 + 45 = 90 potten']],350,330,[650,360,470],32);
 text(s,'De kwekers leveren nu alle 90 aangeboden potten.',60,746,1480,65,39,{bold:true});
 notes(s,'40','De functies en minimumprijs blijven gelijk. We voegen uitsluitend de garantie toe dat de overheid het hele overschot koopt. Nu hebben alle 90 geleverde potten een afnemer.','Welke rij verandert terwijl de particuliere vraag gelijk blijft?','De overheid koopt 45 en niet alle 90 potten.','Bereken de uitgaven over precies die overheidsaankopen.',{example:true});
}
{
 const s=slide('De uitgavenrechthoek',{example:true});graph(s,E,'purchase');
 right(s,'U = Pmin × (Qa − Qv)','U = 15 × 45\n\nU = € 675\nper week','Basis: 45 potten\nHoogte: € 15');
 notes(s,'40–42','De gearceerde rechthoek loopt van Q = 45 tot 90 en van P = 0 tot 15. Basis maal hoogte geeft euro per week. De hoogte is de hele aankoopprijs van 15, niet het verschil met 12. U is een uitgave, geen automatische maat voor welvaartsverlies.','Waarom begint de rechthoek pas bij Qv?','U = 15 × 90 zou ook particuliere aankopen laten betalen door de overheid.','Vervang nu de hele prijs- en opkoopregeling.',{example:true});
}
{
 const s=slide('Alleen een productiequotum',{example:true});
 text(s,'De minimumprijs en opkoopregeling vervallen.',60,195,1480,70,41,{bold:true,color:C.orange});
 text(s,'Maximaal 45 potten kruiden per week.\nAlle 45 worden geproduceerd en verkocht.\nDe productierechten zijn gratis verdeeld.\nDe overheid koopt niets.',60,319,1480,265,40);
 text(s,'45 < Q₀ van 60: het quotum bindt.',60,678,1480,80,46,{bold:true,color:C.blue});
 notes(s,'41–42','Dit is een nieuwe regeling. Wis de minimumprijs en de opkoop uit je redenering. Het quotum begrenst de productie. De tekst bepaalt dat alle toegestane potten daadwerkelijk worden verkocht. Gratis verdeelde rechten leveren geen inkomsten voor de overheid op.','Welke vrije uitkomst verhindert dit maximum?','Een quotum is een hoeveelheid, dus vergelijk het met Q₀ en niet met P₀.','Lees de verkoopprijs nu op V af.',{example:true});
}
{
 const s=slide('De quotumprijs staat op de vraaglijn',{example:true});graph(s,E,'quota');
 right(s,'Bij Q = 45','P = 24 − 0,20 × 45\nP = € 15 per pot\n\nA geeft € 10,50:\nmarginale kosten.','U = € 0\nGeen opkoop');
 notes(s,'41–42','De verticale grens ligt op Q = 45. V vertelt de prijs waarbij particuliere kopers precies deze 45 potten kopen: 15 euro. A geeft bij dezelfde hoeveelheid 6 + 0,10 × 45 = 10,50 euro marginale kosten. Dat is niet de verkoopprijs. De productie kan vanwege het quotum niet doorgroeien tot het vrije evenwicht.','Welke lijn beschrijft de betalingsbereidheid van kopers?','Lees bij een bindend quotum niet de verkoopprijs op A af.','Controleer ook een quotum dat het vrije evenwicht toelaat.',{example:true});
}
{
 const s=slide('Een quotum is een maximum',{example:true});
 text(s,'Een nieuwe grens van 80 potten vervangt het quotum van 45.',60,195,1480,120,39,{bold:true});
 text(s,'80 > Q₀ van 60',60,363,1480,90,56,{bold:true,color:C.blue});
 text(s,'Het vrije evenwicht past binnen het maximum.\nQ = 60 potten per week\nP = € 12 per pot',60,505,1480,193,40);
 text(s,'De overheid koopt niets: U = € 0.',60,754,1480,70,38,{bold:true});
 notes(s,'41 en 44','Deze nieuwe grens vervangt 45 en laat alle andere aannamen gelijk. De markt hoeft niet 80 te produceren. Lees daarom niet de prijs op V af bij 80. Dit bereidt de afzonderlijke begeleide quotumoefening 40A voor.','Waarom vullen we nu Q = 60 in en niet Q = 80?','Een maximum is geen productieplicht.','Vergelijk de mechanismen voordat leerlingen zelfstandig oefenen.',{example:true});
}
{
 const s=slide('Dezelfde prijs, andere gevolgen',{example:true});
 table(s,[['Per week','Minimum € 15 + opkoop','Alleen quotum 45'],['Verkoopprijs per pot','€ 15','€ 15'],['Particuliere aankopen','45 potten','45 potten'],['Productie en verkoop','90 potten','45 potten'],['Overheidsaankopen','45 potten','0 potten'],['Overheidsuitgaven','€ 675','€ 0']],220,485,[580,470,430],31);
 text(s,'De aankoopregel en productiegrens bepalen de verschillen.',60,760,1480,70,39,{bold:true,color:C.blue});
 notes(s,'42','Vraag leerlingen twee berekende verschillen te benoemen: productie en overheidsuitgaven. Laat ze de oorzaak uitleggen, niet alleen getallen noemen. Eén gelijke prijs maakt maatregelen niet gelijk.','Welke twee verschillen kun je met getallen onderbouwen?','Een overheidsuitgave is niet automatisch hetzelfde als welvaartsverlies.','Keer eerst terug naar de startvragen en laat daarna de volledige oefenroute maken.',{example:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 43 · Paddenstoelen in kratten',{target:true});
 text(s,'Vraag: P = 20 − 0,10Q\nAanbod: P = 8 + 0,10Q',60,204,1480,145,47,{bold:true,color:C.blue});
 text(s,'Q is kratten per week. P is euro per krat.',60,404,1480,72,37);
 text(s,'Regeling A voert een minimumprijs van € 16 in.\nDe overheid koopt elk aangeboden krat dat particulieren niet kopen, tegen € 16.\nDe telers leveren samen de aangeboden hoeveelheid.',60,526,1480,260,38);
 notes(s,'46','Dit is de volledige oorspronkelijke context van opgave 43. Begin de bespreking na de eigen poging van leerlingen. Toon ook de basisgrafiek en alle vragen voordat oplossingen verschijnen.','Welk zinnetje maakt de overheid hier tot koper?','De gegevens van het kruidenvoorbeeld gelden hier niet meer.','Toon de oorspronkelijke basisgrafiek als bewerkbare grafiek.');
}
{
 const s=slide('Opgave 43 · De basisgrafiek',{target:true});
 text(s,'V: P = 20 − 0,10Q     A: P = 8 + 0,10Q',60,178,1480,48,32,{bold:true});graph(s,T,'base',{wide:true});
 notes(s,'46','De basisgrafiek reproduceert figuur 7 met dezelfde functies, Q-bereik 0–160, prijsbereik 0–26 en stapgroottes 20 en 5. Dit zijn bewerkbare lijnen. Er zijn nog geen oplossingsmarkeringen.','Waar zet je straks de markeringen van elke regeling?','Meng de twee regelingen niet in één berekening.','Toon eerst deelvragen a tot en met c.');
}
{
 const s=slide('Opgave 43 · Deelvragen a, b en c',{target:true});
 const q=[['a','Bereken het vrije evenwicht en leg uit of de minimumprijs bindt.'],['b','Bereken bij € 16 de particuliere vraag, het aanbod, het aanbodoverschot en de totale verkoop door telers.'],['c','Bereken de overheidsaankopen en de overheidsuitgaven per week. Markeer in de grafiek Pmin, Qv, Qa en de uitgavenrechthoek.']];
 q.forEach((r,i)=>{let y=207+i*203;text(s,r[0]+'.',60,y,80,70,40,{bold:true,color:C.blue});text(s,r[1],170,y,1350,165,39);});
 notes(s,'46','Dit zijn de volledige deelvragen a, b en c. Laat leerlingen hun eigen werk gereedhouden. Geef nog geen uitwerking: de volgende dia bevat d en e.','Welke grootheden vraagt deelvraag b afzonderlijk?','Alleen het overschot berekenen beantwoordt b niet volledig.','Maak nu ook d en e beschikbaar.');
}
{
 const s=slide('Opgave 43 · Deelvragen d en e',{target:true});
 text(s,'d.',60,209,80,70,40,{bold:true,color:C.blue});
 text(s,'Regeling B vervangt A volledig: een productiequotum van 40 kratten. Alle 40 worden verkocht; de rechten zijn gratis verdeeld en de overheid koopt niets. Bereken de marktprijs, totale productie en overheidsuitgaven.',170,209,1350,280,39);
 rule(s,60,539,1480);text(s,'e.',60,588,80,70,40,{bold:true,color:C.blue});
 text(s,'Een teler zegt: “Omdat beide regelingen dezelfde prijs geven, zijn ze economisch hetzelfde.” Beoordeel met twee berekende verschillen.',170,588,1350,207,39);
 notes(s,'46','Alle onderdelen van de echte doelopgave zijn nu getoond zonder berekende oplossingen. Wijs op vervangt volledig en twee berekende verschillen.','Welke aannamen van A verdwijnen bij B?','Neem de opkoopgarantie niet mee naar B.','Start nu pas de uitwerking, bij het vrije evenwicht.');
}
{
 const s=slide('Opgave 43a · Vrij evenwicht en binding',{target:true});
 text(s,'20 − 0,10Q = 8 + 0,10Q\n12 = 0,20Q\nQ₀ = 60 kratten per week',60,217,1480,222,46,{bold:true});
 text(s,'P₀ = 20 − 0,10 × 60 = € 14 per krat',60,515,1480,80,43,{bold:true,color:C.blue});
 text(s,'€ 16 > € 14: de minimumprijs bindt.\nDe vrije prijs ligt onder de toegestane ondergrens.',60,668,1480,128,39);
 notes(s,'46','Los V = A op. Controle op A: 8 + 0,10 × 60 = 14. Het vrije evenwicht kan niet blijven gelden, want verkopen voor 14 is bij de ondergrens 16 verboden.','Welke vergelijking bewijst de binding?','De minimumprijs alleen noemen is nog geen uitleg.','Vul 16 in beide oorspronkelijke functies in.');
}
{
 const s=slide('Opgave 43b · Vraag, aanbod en verkoop',{target:true});
 text(s,'16 = 20 − 0,10Qv\nQv = 40 kratten per week',60,205,710,145,41,{bold:true,color:C.blue});
 text(s,'16 = 8 + 0,10Qa\nQa = 80 kratten per week',850,205,690,145,41,{bold:true,color:C.green});rule(s,60,408,1480);
 text(s,'Aanbodoverschot = 80 − 40 = 40 kratten per week',60,467,1480,92,41,{bold:true});
 text(s,'Totale verkoop = 40 aan particulieren + 40 aan de overheid\n= 80 kratten per week',60,644,1480,140,38,{bold:true,color:C.orange});
 notes(s,'46','Vraag: 0,10Qv = 4, dus Qv = 40. Aanbod: 0,10Qa = 8, dus Qa = 80. De telers leveren alle 80 kratten en de garantie zorgt voor een koper voor het volledige aanbod. Controle: particuliere vraag plus overheidsaankopen is totale verkoop.','Waarom zijn totale verkoop en particuliere vraag hier ongelijk?','Qa = 80 zou zonder de belofte geen bewijs voor 80 verkopen zijn.','Bereken en teken de uitgaven.');
}
{
 const s=slide('Opgave 43c · De overheid koopt het overschot',{target:true});graph(s,T,'purchase');
 right(s,'Pmin = € 16','Qv = 40\nQa = 80\n\nOpkoop = 80 − 40\n= 40 kratten/week','U = 16 × 40\n= € 640 per week');
 notes(s,'46','Markeer Pmin horizontaal op 16, Qv verticaal bij 40 en Qa bij 80. De gearceerde uitgavenrechthoek loopt van 40 tot 80 en van nul tot 16. De breedte is 40 kratten per week, de hoogte 16 euro per krat. Vermenigvuldigen geeft 640 euro per week. De overheid betaalt alleen voor haar eigen aankopen.','Waarom is de hoogte 16 en niet 2?','Het verschil met de vrije prijs is geen aankoopprijs. Gebruik ook niet alle 80 als breedte.','Vervang regeling A geheel door B.');
}
{
 const s=slide('Opgave 43d · Alleen quotum 40',{target:true});
 text(s,'Regeling B vervangt A volledig. 40 < 60: bindend.',60,181,1480,54,34,{bold:true,color:C.orange});graph(s,T,'quota');
 right(s,'Prijs op V','P = 20 − 0,10 × 40\nP = € 16 per krat\n\nProductie en verkoop:\n40 kratten per week','U = € 0\nRechten gratis');
 notes(s,'46','Alle 40 kratten worden verkocht. De prijs komt van V. Op A zou bij 40 de marginale kost 12 zijn, maar dat is niet de verkoopprijs. Gratis rechten brengen geen veilingopbrengst op. Er zijn geen overheidsaankopen, dus uitgaven nul.','Wat verhindert dat telers weer 80 kratten leveren?','Regeling B heeft geen minimumprijs of opkoopbelofte.','Vergelijk twee berekende gevolgen.');
}
{
 const s=slide('Opgave 43e · Twee berekende verschillen',{target:true});
 table(s,[['Uitkomst','A: minimum + opkoop','B: alleen quotum'],['Prijs per krat','€ 16','€ 16'],['Productie per week','80 kratten','40 kratten'],['Overheidsuitgaven per week','€ 640','€ 0']],227,375,[670,440,370],32);
 text(s,'De uitspraak is onjuist.',60,665,1480,65,43,{bold:true,color:C.blue});
 text(s,'De prijs is gelijk, maar de productie en overheidsuitgaven verschillen.',60,756,1480,77,36);
 notes(s,'46','Een volledig antwoord noemt de productie 80 tegenover 40 én de uitgaven 640 tegenover 0, met eenheden. Bij A koopt de overheid het overschot. Bij B verhindert de productiegrens die extra productie. Vraag leerlingen een ontbrekende stap in hun eigen werk te verbeteren.','Welke oorzaak hoort bij elk berekend verschil?','Een gelijk prijskaartje betekent niet dat beide regelingen economisch gelijk zijn.','Rond af met het huiswerkoverzicht.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviews,tables,charts,graphSpecs},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
