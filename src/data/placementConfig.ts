export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type PlacementQuestion = { id:string; level:Exclude<CefrLevel,"A1">; prompt:string; options:string[]; correctIndex:number; explanation?:string; speechTarget?:string };
export const FREE_PLAN_RULES = { beginnerStartsAt:"A1" as CefrLevel, previewLessonsForPlacedUsers:3, a2PlusUsesEnergy:true, lessonEnergyCost:20, dailyEnergy:100, passiveRegenMinutesPerEnergy:5, adRefillEnergy:20, maxAdRefillsPerDay:5 };
export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
{id:"a2_1", level:"A2", prompt:'Welche Form ist richtig? „Ich ___ heute im Supermarkt.“', options:["bin","war","habe","wurde"], correctIndex:1},
{id:"a2_2", level:"A2", prompt:'Welche Antwort passt zu „Wie geht es dir?“', options:["Guten Morgen!","Mir geht es gut.","Ich wohne in Berlin.","Das ist mein Bruder."], correctIndex:1},
{id:"a2_3", level:"A2", prompt:'Welche Aussage ist korrekt?', options:["Ich kann heute nicht kommen.","Ich kanne heute nicht kommen.","Ich heute nicht kann kommen.","Ich kann heute nicht zu kommen."], correctIndex:0},
{id:"b1_1", level:"B1", prompt:'Welches Wort passt? „Wenn ich mehr Zeit hätte, ___ ich öfter Deutsch lernen.“', options:["werde","würde","bin","muss"], correctIndex:1},
{id:"b1_2", level:"B1", prompt:'Welche Formulierung ist grammatikalisch richtig?', options:["Seit zwei Jahren lerne ich Deutsch.","Seit zwei Jahren ich lerne Deutsch.","Ich lerne seit zwei Jahre Deutsch.","Seit zwei Jahren habe ich lerne Deutsch."], correctIndex:0},
{id:"b1_3", level:"B1", prompt:'Welcher Konnektor passt? „Ich war müde, ___ habe ich weitergearbeitet.“', options:["oder","aber","denn","weil"], correctIndex:1},
{id:"b2_1", level:"B2", prompt:'Welche Formulierung ist am passendsten für eine formelle E-Mail?', options:["Ich will Infos über den Kurs.","Könnten Sie mir bitte weitere Informationen zum Kurs zusenden?","Schick mir bitte die Kursdetails.","Ich brauche sofort Infos zum Kurs."], correctIndex:1},
{id:"b2_2", level:"B2", prompt:'Wähle die richtige Ergänzung. „Der Bericht ___, bevor wir ankamen.“', options:["war schon fertig","ist schon fertig gewesen","hat schon fertig","wurde schon fertig"], correctIndex:0},
{id:"b2_3", level:"B2", prompt:'Welche Aussage drückt den stärksten Gegensatz korrekt aus?', options:["Obwohl es geregnet hat, fand das Konzert statt.","Wegen des Regens fand das Konzert statt.","Trotz es geregnet hat, fand das Konzert statt.","Obwohl der Regen, fand das Konzert statt."], correctIndex:0},
{id:"c1_1", level:"C1", prompt:'Welche Formulierung ist am präzisesten?', options:["Die Maßnahme machte viele Probleme.","Die Maßnahme führte zu mehreren unvorhergesehenen Folgen.","Die Maßnahme war nicht so gut.","Die Maßnahme hatte irgendwie Probleme."], correctIndex:1},
{id:"c1_2", level:"C1", prompt:'Wähle die stilistisch beste Variante. „Selten ___ ich ein so überzeugendes Argument gehört.“', options:["habe ich","ich habe","hatte ich","ich hatte"], correctIndex:0},
{id:"c2_1", level:"C2", prompt:'Welche Aussage ist am idiomatischsten und nuanciertersten?', options:["Der Vorschlag wurde nicht angenommen.","Der Vorschlag hat nicht funktioniert.","Der Vorschlag wurde angesichts des wachsenden Widerstands letztlich auf Eis gelegt.","Der Vorschlag stoppte."], correctIndex:2},
];
export const LEVEL_ORDER:CefrLevel[]=["A1","A2","B1","B2","C1","C2"];
export function calculatePlacementLevel(correctAnswers:number):CefrLevel { if(correctAnswers<=2)return"A1"; if(correctAnswers<=5)return"A2"; if(correctAnswers<=7)return"B1"; if(correctAnswers<=9)return"B2"; if(correctAnswers<=10)return"C1"; return "C2"; }
