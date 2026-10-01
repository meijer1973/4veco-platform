// HOW TO ADAPT: read the classroom recipe, pin the current lesson sources in
// the adjacent manifest, and derive a separate teaching example from the target.
// Runtime discovery and finalization are owned by the installed presentation skill.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('314');
const assignment=JSON.parse(await fs.readFile(new URL('./presentation-314.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[],charts=[],slides=[],overviews=[],graphs=[];
const source=`https://github.com/meijer1973/4veco-lessen/blob/${assignment.lessonCommit}/edities/books34-v3/`;
const book=source+'books/book-3/output/Boek_3_Compleet_v3.pdf';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§3.1.4 Maximumprijs'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, actuele books34-v3-editie, gedrukte boekpagina ${page}. ${book}\nManuscript: ${source}books/book-3/chapters/3.1/3.1.4%20manuscript.md\nAntwoordmodel: ${source}books/book-3/chapters/3.1/Antwoorden.md#ans34\n${authored?'Uitlegvoorbeeld — niet uit het boek. Thermosbekers, functies en gegevens zijn voor deze les gemaakt. De boekpagina onderbouwt uitsluitend de methode.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){const q=t.getCell(r,c);q.fill=r===0?C.ink:(r%2?C.paper:C.pale);q.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:9,bottom:9}};}}
 tables.push(p.slides.items.length);return t;
}
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
 const s=slide('Deze les: §3.1.4 Maximumprijs');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{let color=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color,name:`route-number-${i+1}`});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:`route-${i+1}`});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Binding bepalen, hoeveelheden\nberekenen en tekenen, toegang\ntot het product verklaren.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 34 · Opgaven 28 en 29\n29: verkennen, theorie p. 32–33',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.1.4 Maximumprijs\nBasis: 30 en 31\nZelfstandig: 32 en 33\nDoelopgave: 34\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'32–37',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 28–29: boek p. 34. Basis 30–31: p. 35. Zelfstandig 32–33: p. 36. Doel 34: p. 37. Huiswerk is 30, 31, 32, 33 en 34 maken en nakijken. Bonus 35 en herhaling 36 zijn extra. Gebruik de gedrukte paginanummers van het complete boek; het hoofdstukbestand telt vier pagina's lager.\n\nStart 28 haalt vergelijking oplossen en een prijs afzonderlijk invullen op. Die techniek is eerder gebruikt in §3.1.1, boek p. 7–9. Geef bij vastlopen alleen de aanpak: stel V = A voor vrij evenwicht; vul bij een gegeven prijs diezelfde prijs in beide functies in. Start 29 is een eerste verkenning van een niet-bindende maximumprijs. Laat p. 32–33 lezen, vooral 'Een maximum is geen verplicht prijskaartje'. Vraag welke zin helpt, niet om vooraf beheerste kennis. Bij terugkeer vóór het basiswerk laat je 29 opnieuw beantwoorden en bespreek je het verschil tussen de toegestane bovengrens en de werkelijke prijs.\n\nDocentadvies: reserveer voorlopig twee lessen van 55 minuten met flexibele lesgrens; les 1 tot en met begeleiding, les 2 afronding begeleiding, zelfstandig werk en volledige doelbespreking. Dit is niet gemeten. Laat resterend werk zo nodig als huiswerk afronden. Zie ${source}books/book-3/chapters/3.1/Docenteninformatie.md.\n\nStartantwoorden alleen voor feedback na eigen poging: 28a Q₀ = 40 producten per dag, P₀ = € 10 per product. 28b Qv = 50 en Qa = 20 producten per dag. 29: € 12 blijft toegestaan onder € 15.`,active===2?'Bij welke denkstap heb je hulp nodig?':'Welke stap kun je nu zelf uitleggen?', 'Opgave 29 is nieuwe inhoud en geen onaangekondigde beheersingstoets. Begeleide inoefening hoort bij de normale route.',active===7?'Laat het huiswerk in de agenda noteren.':active===4?'Eerst 29 opnieuw proberen, daarna begeleid oefenen met 30–31.':'Start de uitleg zodra leerlingen hun eerste poging hebben gedaan.');
}
const example={name:'Thermosbekers',interceptV:24,slopeV:-.25,interceptA:4,slopeA:.25,qMax:80,pMax:24,majorQ:20,majorP:4,unit:'thermosbekers per week',priceUnit:'€ per beker',q0:40,p0:14,cap:11,qa:28,qv:52};
const target={name:'Tenten',interceptV:18,slopeV:-.1,interceptA:6,slopeA:.1,qMax:160,pMax:24,majorQ:20,majorP:5,unit:'tenten per weekend',priceUnit:'€ per tent',q0:60,p0:12,cap:10,qa:40,qv:80};
function graph(s,m,{equilibrium=false,cap=false,quantities=false}={}){
 const series=[];
 function line(name,x,y,color,width=3,style='solid',labels=[]){
  // Explicitly suppress every unlabeled point. PowerPoint otherwise invents
  // tiny coordinate labels for points missing from a partial override list.
  const dataLabelOverrides=x.map((_,i)=>{const label=labels.find(a=>a.i===i);return {idx:i,text:label?.t||' ',position:'top',showValue:false,showSeriesName:false,showCategoryName:false,showPercent:false,textStyle:{typeface:FONT,fontSize:25,fill:color,bold:true}};});
  series.push({name,xValues:x,values:y,line:{fill:color,width,style},marker:{symbol:'none'},dataLabelOverrides});
 }
 // Exact decimal coordinates avoid serializing floating-point noise into Excel.
 // At 7/8 of these axes every linear ordinate is exactly representable.
 const mid=m.qMax*.875;
 line('V',[0,mid,m.qMax],[m.interceptV,m.interceptV+m.slopeV*mid,m.interceptV+m.slopeV*m.qMax],C.blue,4,'solid',[{i:1,t:'V',pos:'t'}]);
 line('A',[0,mid,m.qMax],[m.interceptA,m.interceptA+m.slopeA*mid,m.interceptA+m.slopeA*m.qMax],C.green,4,'solid',[{i:1,t:'A',pos:'t'}]);
 if(equilibrium){line('Hulplijn P₀',[0,m.q0],[m.p0,m.p0],C.muted,2,'dashed');line('Hulplijn Q₀',[m.q0,m.q0],[0,m.p0],C.muted,2,'dashed');line('E₀',[m.q0],[m.p0],C.ink,0,'solid',[{i:0,t:'E₀'}]);series.at(-1).marker={symbol:'circle',size:8};}
 if(cap)line('Maximumprijs',[0,m.qMax],[m.cap,m.cap],C.orange,3,'dashed',[{i:1,t:`Pmax = ${m.cap}`,pos:'t'}]);
 if(quantities){
  line('Qa',[m.qa,m.qa],[0,m.cap],C.green,2,'dashed',[{i:0,t:`Qa = ${m.qa}`,pos:'t'}]);
  line('Qv',[m.qv,m.qv],[0,m.cap],C.blue,2,'dashed',[{i:0,t:`Qv = ${m.qv}`,pos:'t'}]);
  line('Tekort',[m.qa,m.qv],[m.cap,m.cap],C.orange,7,'solid');
  for(const [n,q,col] of [['Aanbod',m.qa,C.green],['Vraag',m.qv,C.blue]]){line(n,[q],[m.cap],col,0);series.at(-1).marker={symbol:'circle',size:8};}
 }
 const ch=s.charts.add('scatter',{position:{left:60,top:236,width:1070,height:570},series,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:m.qMax,majorUnit:m.majorQ,numberFormatCode:'0',title:{text:`Q (${m.unit})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:m.pMax,majorUnit:m.majorP,numberFormatCode:'0',title:{text:`P (${m.priceUnit})`,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},
  dataLabels:{showValue:false,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,model:m,equilibrium,cap,quantities,series});return ch;
}
function exampleHeading(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,182,1470,45,29,{color:C.blue,bold:true});}

overview('Startopdracht',2); // 1
{
 const s=slide('Een maximumprijs: de hoogste toegestane prijs');
 text(s,'Je vergelijkt de prijsgrens met het vrije evenwicht.',60,196,1480,95,42,{bold:true,color:C.blue});
 table(s,[['Prijsgrens','Gevolg in ons model'],['Pmax < P₀','Bindend: de vrije prijs is verboden.'],['Pmax ≥ P₀','Niet bindend: het vrije evenwicht blijft mogelijk.']],60,340,1480,260,[490,990],36);
 text(s,'Daarna: Qv, Qa, werkelijke verkopen en het tekort.',60,673,1480,80,40,{bold:true});
 text(s,'Wie kan kopen? Dat hangt ook af van de toewijzing.',60,770,1480,57,36);
 notes(s,'32–33','Een maximumprijs is een wettelijke bovengrens in dit fictieve model. Hij is alleen bindend onder de vrije evenwichtsprijs. Bij gelijkheid verandert de vrije uitkomst niet. Koppel aan de doelen: eerst binding, dan hoeveelheden berekenen en markeren, ten slotte uitleggen wie toegang krijgt. De prijsregel zelf verschuift geen vraag of aanbod.','Mag een verkoper minder vragen dan de maximumprijs?','Een maximum is geen verplicht prijskaartje.','Volg deze keuzes met een eigen uitlegvoorbeeld.');
}
{
 const s=slide('Thermosbekers: de gegevens');exampleHeading(s);
 text(s,'Vraag: P = 24 − 0,25Q',60,275,1480,67,47,{bold:true,color:C.blue});
 text(s,'Aanbod: P = 4 + 0,25Q',60,372,1480,67,47,{bold:true,color:C.green});
 text(s,'P: euro per beker. Q: thermosbekers per week.',60,481,1480,60,36);
 text(s,'Maximumprijs: € 11 per beker',60,580,1480,65,44,{bold:true,color:C.orange});
 text(s,'Elke koper wil één beker. Er is geen extra aanvoer.\nAlle aangeboden bekers worden verkocht aan de kopers\nmet de hoogste betalingsbereidheid.',60,679,1480,148,35);
 notes(s,'32–34','Dit voorbeeld is apart voor de uitleg gemaakt. Neem veel kopers en verkopers en één soort beker aan. Er is geen belasting of subsidie per transactie en er zijn geen andere gelijktijdige veranderingen. Dezelfde prijs geldt voor koper en verkoper. De regeling is nog geen uitkomst: we moeten eerst het vrije evenwicht kennen.','Welke gegevens gaan over prijs, welke over aantallen?','Een hoeveelheid van 40 is hier 40 bekers per week, niet 40 euro.','Bereken eerst het vrije evenwicht.',true);
}
{
 const s=slide('Eerst het vrije evenwicht');exampleHeading(s);
 text(s,'Vraagprijs = aanbodprijs bij dezelfde Q',60,263,1480,58,37,{bold:true});
 text(s,'24 − 0,25Q = 4 + 0,25Q\n20 = 0,50Q\nQ₀ = 40 thermosbekers per week',60,360,1480,227,47);
 text(s,'P₀ = 24 − 0,25 × 40 = € 14 per beker',60,632,1480,75,45,{bold:true,color:C.blue});
 text(s,'Controle op A: 4 + 0,25 × 40 = € 14',60,755,1480,58,35);
 notes(s,'34','Herhaal de algebra: breng de constante 4 naar links en −0,25Q naar rechts. Deel 20 door 0,50. Vul de gevonden hoeveelheid in een van de oorspronkelijke functies in. Controleer dezelfde prijs in de andere functie. Deze oude techniek ondersteunt start 28 en doel 34a.','Waarom gebruik je nu één Q in beide functies?','Vrij evenwicht gaat over gelijke gevraagde en aangeboden hoeveelheden. Dat is straks bij een bindende prijsgrens niet zo.','Laat de berekening terugzien in de grafiek.',true);
}
{
 const s=slide('Het vrije evenwicht in de grafiek');exampleHeading(s);graph(s,example,{equilibrium:true});
 text(s,'E₀',1180,283,360,62,44,{bold:true});text(s,'Q₀ = 40\nP₀ = € 14',1180,387,360,135,40,{bold:true,color:C.blue});
 text(s,'Vraag en aanbod\nzijn hier gelijk.',1180,622,360,145,36);
 notes(s,'32–34','Lees eerst de assen en eenheden. V daalt; A stijgt. De stippellijnen verbinden het snijpunt met Q = 40 en P = 14. Laat leerlingen de uitkomst uit de formule aanwijzen. De volgende grafieken behouden exact dezelfde assen.','Waar zie je de 40 uit de berekening?','Lees P verticaal en Q horizontaal.','Voeg de maximumprijs toe zonder de lijnen te verschuiven.',true);
}
{
 const s=slide('€ 11 ligt onder de vrije prijs');exampleHeading(s);graph(s,example,{equilibrium:true,cap:true});
 text(s,'€ 11 < € 14',1180,283,360,80,43,{bold:true,color:C.orange});text(s,'Bindend',1180,405,360,65,44,{bold:true});
 text(s,'V en A blijven\nop hun plaats.\n\nBeide partijen\nreageren op € 11.',1180,532,360,242,34);
 notes(s,'32–34','De vrije prijs van 14 mag niet meer. In dit model is de werkelijke verkoopprijs 11. Er is geen belasting of subsidie: koper betaalt dezelfde prijs als verkoper ontvangt. De maximumprijs is een horizontale lijn en verschuift V of A niet.','Waarom kan de prijs het komende tekort niet oplossen door te stijgen?','Een maximumprijs vormt geen verticale wig tussen kopers- en verkopersprijs.','Vul 11 afzonderlijk in de vraag- en aanbodfunctie in.',true);
}
{
 const s=slide('Twee gewenste hoeveelheden bij € 11');exampleHeading(s);
 table(s,[['Vraag: wat kopers willen','Aanbod: wat verkopers willen'],['11 = 24 − 0,25Qv','11 = 4 + 0,25Qa'],['0,25Qv = 13','0,25Qa = 7'],['Qv = 52 bekers per week','Qa = 28 bekers per week']],60,287,1480,360,[740,740],36);
 text(s,'Controle: 24 − 0,25 × 52 = 11',60,703,1480,55,36,{color:C.blue});
 text(s,'Controle: 4 + 0,25 × 28 = 11',60,774,1480,55,36,{color:C.green});
 notes(s,'33–34','Bij de opgelegde prijs moeten we Qv en Qa apart oplossen. Vraag: trek 11 van 24 af, deel 13 door 0,25. Aanbod: trek 4 van 11 af, deel 7 door 0,25. Doe beide substitutiecontroles. Dit is ook de herhaling van hoeveelheid-bij-prijs voor start 28. De 52 is een wens, geen gerealiseerde verkoop.','Waarom zijn Qv en Qa hier verschillend?','Stel de functies niet opnieuw gelijk alsof de maximumprijs vrij evenwicht oplevert.','Markeer de twee uitkomsten en het tekort.',true);
}
{
 const s=slide('Verkopen en tekort in de grafiek');exampleHeading(s);graph(s,example,{cap:true,quantities:true});
 text(s,'28 verkocht',1180,276,360,96,44,{bold:true,color:C.green});
 text(s,'Tekort\n52 − 28 = 24',1180,436,360,155,41,{bold:true,color:C.orange});
 text(s,'Bekers per week\n\nTekort: horizontaal\nvan 28 tot 52.',1180,640,360,160,32);
 notes(s,'32–34','Teken de horizontale Pmax-lijn. Het snijpunt met A geeft Qa = 28; het snijpunt met V geeft Qv = 52. Projecteer beide op de hoeveelheid-as. Markeer het stuk tussen beide snijpunten als tekort. Alle aangeboden bekers worden verkocht en er is geen extra aanvoer, dus verkopen = 28. Controle: 28 verkopen + 24 onvervulde gewenste aankopen = 52.','Welk deel van de grafiek meet het tekort?','Een tekort is een verschil tussen hoeveelheden, geen afstand tussen prijzen.','Leg uit aan wie de 28 bekers worden verkocht.',true);
}
{
 const s=slide('Een lagere prijs geeft niet iedereen toegang');exampleHeading(s);
 table(s,[['Bij € 11 per beker','Aantal per week'],['Willen kopen','52'],['Krijgen een beker','28'],['Willen kopen, maar krijgen geen beker','24']],60,276,1480,322,[1050,430],36);
 text(s,'De 28 hoogste betalingsbereidheden krijgen voorrang.',60,657,1480,80,41,{bold:true,color:C.green});
 text(s,'Zonder toewijzingsregel weet je niet wie er kan kopen.',60,770,1480,57,35);
 notes(s,'33–34','De prijs is lager voor wie een beker bemachtigt. De gegeven toewijzingsregel selecteert de hoogste betalingsbereidheden. Er blijven 24 gewenste aankopen onvervuld. Zonder regel ken je het aantal verkopen, maar niet welke kopers het product krijgen. Een loting kan andere kopers selecteren. Bereken hier geen surplus: dat is niet het doel van de normale route.','Wat ontbreekt als een bron alleen prijs en aantal verkopen noemt?','Betaalbaar willen kopen is niet hetzelfde als werkelijk een product ontvangen.','Onderzoek dezelfde markt met een hogere maximumprijs.',true);
}
{
 const s=slide('Een maximum van € 17 bindt hier niet');exampleHeading(s);
 text(s,'Zelfde markt: vrije prijs € 14, vrije hoeveelheid 40',60,266,1480,62,38,{bold:true});
 table(s,[['Maximumprijs','Werkelijke prijs','Verkocht per week'],['€ 11','€ 11','28 bekers'],['€ 17','€ 14','40 bekers']],60,386,1480,266,[500,500,480],37);
 text(s,'€ 14 blijft toegestaan. Het vrije evenwicht blijft bestaan.',60,715,1480,105,43,{bold:true,color:C.blue});
 notes(s,'33–34','Dit is een apart alternatief: vervang de grens van 11 door 17. De vrije prijs 14 blijft toegestaan. Je vult dus niet automatisch 17 in de functies om werkelijke verkopen te vinden. Aanbod en vraag ontmoeten elkaar nog bij 40 en 14. De vergelijking gebruikt dezelfde markt.','Waarom vragen verkopers in ons model niet automatisch € 17?','Een bovengrens verplicht verkopers niet om precies dat bedrag te vragen.','Controleer of de conclusie verandert wanneer de markt zelf verandert.',true);
}
{
 const s=slide('Binding hangt ook af van de markt');exampleHeading(s);
 text(s,'De maximumprijs blijft € 17.',60,266,1480,63,43,{bold:true});
 table(s,[['Situatie','Vrije evenwichtsprijs','Bindt € 17?'],['Oorspronkelijke markt','€ 14','Nee: € 14 is toegestaan.'],['Na toename van de vraag','€ 20 (gegeven)','Ja: € 20 is verboden.']],60,381,1480,290,[550,430,500],34);
 text(s,'Vergelijk steeds met het vrije evenwicht in díé situatie.',60,735,1480,87,42,{bold:true,color:C.orange});
 notes(s,'33; oefentransfer p. 36','Aanvullend fictief scenario in het uitlegvoorbeeld: door meer vraag zou de nieuwe vrije prijs 20 worden. De nieuwe vraagfunctie is niet gegeven; bereken daarom geen nieuwe hoeveelheid. Scheid de marktverandering van de prijsregel: houd bij iedere vergelijking de juiste markt vast. Dit bereidt de vergelijkingsstap uit 33 voor zonder diens antwoord voor te doen.','Kan dezelfde maximumprijs eerst niet en later wel bindend zijn?','Binding hangt niet alleen af van het bedrag in de regeling.','Laat leerlingen kort zelf het onderscheid tussen vraag en verkoop toepassen.',true);
}
{
 const s=slide('Korte controle');exampleHeading(s);
 text(s,'Terug naar de oorspronkelijke bekermarkt: Pmax = € 11.',60,260,1480,104,40,{bold:true});
 text(s,'“52 kopers willen een beker.\nDus er worden 52 bekers verkocht.”',60,434,1480,160,49,{bold:true,color:C.blue});
 text(s,'Welke hoeveelheid bepaalt de verkoop? Welke aanname is nodig?',60,687,1480,111,39);
 notes(s,'33–34','Laat leerlingen eerst zelf antwoorden. Verwacht: Qa = 28 bepaalt hier de verkoop. Geen extra aanvoer en alle aangeboden bekers worden verkocht. Tekort = 52 − 28 = 24 bekers per week. Toon eventueel de vorige grafiek pas na hun poging. Dit is een korte begripscontrole op het voorbeeld, geen nieuwe huiswerkopgave.','Wat maakt 28 de juiste hoeveelheid?','De gevraagde hoeveelheid is nog geen gerealiseerde transactie.','Keer terug naar het overzicht, laat start 29 opnieuw beantwoorden en begin begeleid oefenen.',true);
}
overview('Oefenen',4); // 13
{
 const s=slide('Opgave 34 · Tenten voor een weekend','§3.1.4 Maximumprijs · Opgave 34 · Boekpagina 37');
 text(s,'Verschillende bedrijven verhuren dezelfde soort tent.',60,193,1480,70,38,{bold:true});
 text(s,'Vraag: P = 18 − 0,10Q\nAanbod: P = 6 + 0,10Q',60,306,1480,156,45);
 text(s,'P is de huur in euro per tent voor één weekend.\nQ is tenten per weekend.',60,496,1480,113,35);
 text(s,'Er komt een maximumprijs van € 10. Er is geen extra aanvoer.',60,650,1480,80,35,{bold:true,color:C.orange});
 text(s,'Alle aangeboden tenten worden verhuurd, aan de vragers\nmet de hoogste betalingsbereidheid.',60,743,1480,91,35);
 notes(s,'37','Begin deze bespreking nadat leerlingen zelf de doelopgave hebben geprobeerd. Dit zijn de volledige oorspronkelijke context, functies, eenheden en aannames van opgave 34. Toon hierna eerst a–b, dan c met de basisgrafiek en daarna d–e. Pas daarna beginnen de antwoorden.','Welke aanname gaat over aantallen, welke over wie een tent krijgt?','Gebruik vanaf hier de tentenfuncties; de thermosbekers zijn afgesloten.','Toon deelvragen a en b.');
}
{
 const s=slide('Opgave 34 · Deelvragen a en b','§3.1.4 Maximumprijs · Opgave 34 · Boekpagina 37');
 text(s,'a.',60,247,80,65,44,{bold:true,color:C.blue});text(s,'Bereken de vrije evenwichtsprijs en -hoeveelheid.\nLeg uit of de maximumprijs bindt.',160,247,1380,150,43);
 rule(s,60,452,1480);text(s,'b.',60,519,80,65,44,{bold:true,color:C.blue});
 text(s,'Bereken de gevraagde en aangeboden hoeveelheid,\nhet werkelijke aantal verhuurde tenten en het tekort.',160,519,1380,171,43);
 notes(s,'37','Laat de twee volledige rekenvragen zien zonder uitkomsten. De gegevens staan op de vorige dia en in het boek. Leerlingen benoemen alleen de gevraagde grootheden. Er volgen nog drie deelvragen voor de uitwerking start.','Welke vier hoeveelheden vraagt b?','Sla de werkelijke verhuur of het tekort niet over.','Toon c met de oorspronkelijke basisgrafiek.');
}
{
 const s=slide('Opgave 34 · Deelvraag c en basisgrafiek','§3.1.4 Maximumprijs · Opgave 34 · Boekpagina 37');
 text(s,'c. Teken de maximumprijs in de basisgrafiek.',60,184,1480,45,34,{bold:true});
 graph(s,target);
 text(s,'Markeer Qv, Qa\nen het werkelijke\naantal verhuringen.\n\nGeef het tekort aan.',1175,315,365,310,34);
 text(s,'Geen belasting-\nof subsidiewig',1175,718,365,94,31,{color:C.muted});
 notes(s,'37','Deze bewerkbare basisgrafiek bevat dezelfde oorspronkelijke V en A en hetzelfde bereik Q = 0 tot 160 als figuur 4. P loopt van 0 tot 24. De prijsgrens, hoeveelheden en tekort zijn nog niet ingevuld. De volledige vraag c is verdeeld over de zin boven de grafiek en de tekst rechts.','Welke markeringen vraagt c?','De basisgrafiek bevat nog geen uitwerking.','Toon eerst ook d en e zonder oplossingen.');
}
{
 const s=slide('Opgave 34 · Deelvragen d en e','§3.1.4 Maximumprijs · Opgave 34 · Boekpagina 37');
 text(s,'d.',60,220,80,65,43,{bold:true,color:C.blue});
 text(s,'Een huurder zegt: “De lagere huur is goed voor iedereen\ndie voor € 10 een tent wil huren.”\nBeoordeel met de uitkomsten en de toewijzingsregel.',160,220,1380,230,41);
 rule(s,60,500,1480);text(s,'e.',60,566,80,65,43,{bold:true,color:C.blue});
 text(s,'Stel dat de maximumprijs € 14 is in plaats van € 10.\nGeef dan de werkelijke huur en het aantal verhuringen.\nLicht toe.',160,566,1380,206,41);
 notes(s,'37','Alle vijf deelvragen en de volledige context zijn nu zichtbaar geweest. Laat leerlingen hun eigen antwoorden gereedhouden voor vergelijking. Deel e is een alternatief scenario voor dezelfde oorspronkelijke tentenmarkt.','Welke bewering moet je bij d onderbouwen?','Een mening over eerlijkheid vervangt hier de gevraagde onderbouwing met aantallen en toewijzing niet.','Begin nu pas de stapsgewijze antwoorden met a.');
}
{
 const s=slide('34a · Vrij evenwicht en binding','§3.1.4 Maximumprijs · Opgave 34a · Boekpagina 37');
 text(s,'18 − 0,10Q = 6 + 0,10Q\n12 = 0,20Q\nQ₀ = 60 tenten per weekend',60,228,1480,225,47);
 text(s,'P₀ = 18 − 0,10 × 60 = € 12 per tent',60,507,1480,71,45,{bold:true,color:C.blue});
 text(s,'Controle: 6 + 0,10 × 60 = € 12',60,619,1480,59,36);
 text(s,'€ 10 < € 12. De maximumprijs bindt.',60,746,1480,81,45,{bold:true,color:C.orange});
 notes(s,'37','Werk a volledig uit. Bij vrij evenwicht stel je V en A gelijk. Deel 12 door 0,20, vul 60 in en controleer in de andere functie. P is huur per tent voor één weekend. De vrije huur 12 wordt door de bovengrens 10 verboden.','Welke berekening bewijst dat de maximumprijs bindt?','Vergelijk met P₀, niet met het prijsintercept 18 of 6.','Bereken beide gewenste hoeveelheden bij 10.');
}
{
 const s=slide('34b · Vraag en aanbod bij € 10','§3.1.4 Maximumprijs · Opgave 34b · Boekpagina 37');
 table(s,[['Gevraagd','Aangeboden'],['10 = 18 − 0,10Qv','10 = 6 + 0,10Qa'],['0,10Qv = 8','0,10Qa = 4'],['Qv = 80 tenten per weekend','Qa = 40 tenten per weekend']],60,239,1480,374,[740,740],36);
 text(s,'Controle vraag: 18 − 0,10 × 80 = € 10',60,683,1480,60,36,{color:C.blue});
 text(s,'Controle aanbod: 6 + 0,10 × 40 = € 10',60,763,1480,60,36,{color:C.green});
 notes(s,'37','Herhaal de afzonderlijke vergelijkingen en deel door 0,10. Beide berekeningen horen bij dezelfde huurprijs. Vraag en aanbod zijn wensen bij die prijs, niet allebei werkelijk verhuurde aantallen.','Waarom gebruik je voor vraag 80 en voor aanbod 40?','De 60 uit het vrije evenwicht geldt niet meer bij de bindende maximumprijs.','Beantwoord nu ook de werkelijke verhuur en het tekort uit b.');
}
{
 const s=slide('34b · Werkelijke verhuur en tekort','§3.1.4 Maximumprijs · Opgave 34b · Boekpagina 37');
 text(s,'Geen extra aanvoer. Alle aangeboden tenten worden verhuurd.',60,219,1480,103,39,{bold:true});
 table(s,[['Grootheid','Berekening','Tenten per weekend'],['Werkelijk verhuurd','Qa','40'],['Tekort','Qv − Qa = 80 − 40','40']],60,389,1480,270,[520,550,410],36);
 text(s,'Controle: 40 verhuurd + 40 tekort = 80 gevraagd',60,728,1480,84,41,{bold:true,color:C.orange});
 notes(s,'37','Van de 80 gewenste verhuringen kunnen er 40 doorgaan. De twee uitkomsten zijn toevallig beide 40, maar hebben een andere betekenis. Noem de aanname die verkopen = Qa rechtvaardigt. De vraag gaat over tenten per weekend, geen bedrag.','Wat is het verschil tussen de twee getallen 40?','Een tekort van 40 is geen extra aanbod en geen omzet.','Verbind de berekeningen met de grafiek voor c.');
}
{
 const s=slide('34c · Maximumprijs, verhuur en tekort','§3.1.4 Maximumprijs · Opgave 34c · Boekpagina 37');
 text(s,'Pmax = € 10 per tent voor één weekend',60,183,1480,48,35,{bold:true,color:C.orange});
 graph(s,target,{cap:true,quantities:true});
 text(s,'Qa = 40',1180,277,360,65,43,{bold:true,color:C.green});text(s,'Werkelijk verhuurd:\n40 tenten',1180,362,360,122,34);
 text(s,'Qv = 80',1180,529,360,65,43,{bold:true,color:C.blue});
 text(s,'Tekort: 40\nVan Q = 40\ntot Q = 80',1180,644,360,162,35,{bold:true,color:C.orange});
 notes(s,'37','Teken Pmax horizontaal op 10. Het snijpunt op A is (40;10); op V (80;10). Daal naar de Q-as. Benoem Qa = 40 daarnaast als werkelijke verhuringen. Het dikke horizontale stuk van 40 tot 80 bij P = 10 markeert het tekort van 40 tenten per weekend. Vergelijk de exacte lijnvergelijkingen met de berekeningen van b.','Hoe laat je zien dat werkelijke verhuur en Qa hier samenvallen?','Markeer geen verticale wig en verschuif de aanbodlijn niet.','Gebruik de uitkomsten om de bewering van de huurder te beoordelen.');
}
{
 const s=slide('34d · Goedkoper huren geeft geen garantie','§3.1.4 Maximumprijs · Opgave 34d · Boekpagina 37');
 text(s,'De uitspraak is onjuist.',60,212,1480,74,47,{bold:true,color:C.orange});
 table(s,[['Bij € 10 per tent','Uitkomst'],['80 vragers willen huren','40 krijgen een tent.'],['40 hoogste betalingsbereidheden','Zij krijgen voorrang.'],['Overige 40 vragers','Zij krijgen geen tent.']],60,349,1480,331,[790,690],36);
 text(s,'De lagere huur helpt niet iedereen die voor € 10 wil huren.',60,744,1480,84,41,{bold:true});
 notes(s,'37','Gebruik de aantallen uit b én de gegeven toewijzingsregel. Alleen de 40 vragers met de hoogste betalingsbereidheid krijgen een tent. Voor hen daalt de huur; 40 andere gewenste aankopen blijven onvervuld. De algemene uitspraak over iedereen is dus onjuist. Beoordeel geen volledige maatschappelijke welvaart of rechtvaardigheid: dat vraagt andere informatie of criteria.','Welke woorden in de uitspraak maken haar te algemeen?','Een prijsdaling voor daadwerkelijke huurders betekent niet dat alle geïnteresseerden profiteren.','Vervang de bovengrens door 14 voor e.');
}
{
 const s=slide('34e · Een maximumprijs van € 14','§3.1.4 Maximumprijs · Opgave 34e · Boekpagina 37');
 text(s,'Zelfde tentenmarkt. Alleen de maximumprijs verandert.',60,221,1480,91,40,{bold:true});
 table(s,[['Vergelijking','Gevolg'],['€ 14 > € 12','Niet bindend: de vrije huur is toegestaan.'],['Werkelijke huur','€ 12 per tent voor één weekend'],['Werkelijke verhuur','60 tenten per weekend']],60,364,1480,310,[535,945],36);
 text(s,'De maximumprijs is een bovengrens, geen verplicht prijskaartje.',60,739,1480,97,40,{bold:true,color:C.blue});
 notes(s,'37','Neem opnieuw de oorspronkelijke vrije uitkomst uit a: 60 tenten bij 12. De grens van 14 laat dat toe. Daarom blijft de werkelijke huur 12 en de verhuur 60. Vul niet automatisch 14 in beide functies om nieuwe transacties te bepalen. Laat leerlingen één ontbrekende berekening, eenheid of reden in a–e verbeteren.','Welke uitkomst uit a kun je hier hergebruiken?','De huur stijgt niet naar 14 alleen omdat dit bedrag toegestaan is.','Sluit af met hetzelfde overzicht en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7); // 24

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...assignment,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts},null,2));
await fs.writeFile(path.join(BUILD,'graph-specifications.json'),JSON.stringify(graphs,null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(BUILD,'candidate.pptx');
await(await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,'3.1.4 Maximumprijs – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({finalPath:result.finalPath,slides:slides.length,overviewSlides:overviews,nativeTables:tables.length,nativeCharts:charts.length,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
