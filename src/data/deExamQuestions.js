// German CEFR Exam Questions — 30 per level (A1–C2)
// Structure per level:
//   Q01–Q06  Vocabulary in Context  (translate-en: see German, choose English meaning)
//   Q07–Q12  Grammar in Context     (fill: German sentence with blank, German options)
//   Q13–Q18  Listening              (listen: hear German phrase, choose English meaning)
//   Q19–Q24  Speaking → Translate   (translate: English prompt, German options)
//   Q25–Q30  Scenario Tasks         (mcq: German situational prompt, German options)

export const DE_EXAM_QUESTIONS = {
  "A1": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", german:"Hallo",                options:["hello","goodbye","thank you","please"],                                                answer:"hello" },
    { type:"translate-en", german:"danke",                options:["please","sorry","thank you","excuse me"],                                             answer:"thank you" },
    { type:"translate-en", german:"Entschuldigung",       options:["you're welcome","goodbye","please","excuse me"],                                      answer:"excuse me" },
    { type:"translate-en", german:"Gute Nacht",           options:["good morning","good evening","goodbye","good night"],                                 answer:"good night" },
    { type:"translate-en", german:"Ich verstehe nicht",  options:["I speak German","I don't know","I don't understand","I'm not sure"],                  answer:"I don't understand" },
    { type:"translate-en", german:"Wie viel kostet das?",options:["Where is this?","What time is it?","Can I help you?","How much does that cost?"],      answer:"How much does that cost?" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Ich ___ Anna.",               options:["heißt","heißen","heiß","heiße"],          answer:"heiße" },
    { type:"fill", sentence:"Wie ___ du?",                 options:["heiße","heißen","bin","heißt"],           answer:"heißt" },
    { type:"fill", sentence:"Das ___ mein Buch.",          options:["bin","bist","sind","ist"],                answer:"ist" },
    { type:"fill", sentence:"Ich ___ aus Deutschland.",    options:["kommt","kommst","kommen","komme"],        answer:"komme" },
    { type:"fill", sentence:"Er ___ Tee.",                 options:["trinke","trinkst","trinken","trinkt"],    answer:"trinkt" },
    { type:"fill", sentence:"Wir ___ Hunger.",             options:["habe","hast","habt","haben"],            answer:"haben" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Guten Morgen",          options:["Good afternoon","Good evening","Good night","Good morning"],                         answer:"Good morning" },
    { type:"listen", audio:"Wie geht es Ihnen?",    options:["What is your name?","Where are you from?","How old are you?","How are you?"],         answer:"How are you?" },
    { type:"listen", audio:"Auf Wiedersehen",        options:["Hello","Thank you","Please","Goodbye"],                                             answer:"Goodbye" },
    { type:"listen", audio:"Wo ist die Toilette?",  options:["Where is the exit?","Where is the station?","Where is the supermarket?","Where is the toilet?"], answer:"Where is the toilet?" },
    { type:"listen", audio:"Ich heiße Lukas",       options:["I come from Lukas","I am from Lukas","I speak Lukas","My name is Lukas"],            answer:"My name is Lukas" },
    { type:"listen", audio:"Es tut mir leid",       options:["Thank you very much","You're welcome","Excuse me please","I'm sorry"],              answer:"I'm sorry" },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"Good evening",         options:["Guten Morgen","Gute Nacht","Guten Tag","Guten Abend"],                                    answer:"Guten Abend" },
    { type:"translate", english:"My name is Anna.",     options:["Ich bin Anna.","Ich komme aus Anna.","Ich habe Anna.","Ich heiße Anna."],                 answer:"Ich heiße Anna." },
    { type:"translate", english:"I come from Germany.", options:["Ich wohne in Deutschland.","Ich bin aus Deutschland.","Ich mag Deutschland.","Ich komme aus Deutschland."], answer:"Ich komme aus Deutschland." },
    { type:"translate", english:"I don't understand.", options:["Ich weiß nicht.","Ich spreche nicht Deutsch.","Ich kann nicht.","Ich verstehe nicht."],    answer:"Ich verstehe nicht." },
    { type:"translate", english:"How old are you?",    options:["Wie heißt du?","Woher kommst du?","Was machst du?","Wie alt bist du?"],                    answer:"Wie alt bist du?" },
    { type:"translate", english:"Where do you live?",  options:["Woher kommst du?","Wie heißt du?","Was machst du?","Wo wohnst du?"],                       answer:"Wo wohnst du?" },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Sie treffen jemanden zum ersten Mal. Was sagen Sie?",               options:["Gute Nacht!","Schönen Abend!","Tschüss!","Freut mich, Sie kennenzulernen."],            answer:"Freut mich, Sie kennenzulernen." },
    { type:"mcq", prompt:"Jemand fragt: 'Wie geht\'s?' Wie antworten Sie?",                   options:["Ich heiße Anna.","Ich wohne in Berlin.","Auf Wiedersehen.","Danke, gut. Und Ihnen?"],   answer:"Danke, gut. Und Ihnen?" },
    { type:"mcq", prompt:"Sie wollen wissen, wie spät es ist. Was fragen Sie?",               options:["Wo bin ich?","Wie viel kostet das?","Was ist das?","Wie spät ist es bitte?"],           answer:"Wie spät ist es bitte?" },
    { type:"mcq", prompt:"Jemand gibt Ihnen ein Geschenk. Was sagen Sie?",                   options:["Entschuldigung.","Tschüss!","Bitte sehr.","Vielen Dank!"],                             answer:"Vielen Dank!" },
    { type:"mcq", prompt:"Sie verstehen eine Frage nicht. Was sagen Sie?",                   options:["Ich weiß alles.","Auf Wiedersehen.","Ich bin müde.","Sprechen Sie bitte langsamer."],   answer:"Sprechen Sie bitte langsamer." },
    { type:"mcq", prompt:"Sie verabschieden sich von einem Freund. Was sagen Sie?",          options:["Guten Morgen!","Hallo!","Wie geht's?","Bis bald!"],                                    answer:"Bis bald!" },
  ],

  "A2": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", german:"der Bahnhof",      options:["airport","bus stop","taxi rank","train station"],     answer:"train station" },
    { type:"translate-en", german:"die Apotheke",     options:["supermarket","bakery","hospital","pharmacy"],          answer:"pharmacy" },
    { type:"translate-en", german:"das Frühstück",    options:["lunch","dinner","dessert","breakfast"],                answer:"breakfast" },
    { type:"translate-en", german:"teuer",            options:["cheap","fresh","heavy","expensive"],                   answer:"expensive" },
    { type:"translate-en", german:"die Verspätung",   options:["platform","arrival","departure","delay"],             answer:"delay" },
    { type:"translate-en", german:"früh",             options:["late","often","never","early"],                        answer:"early" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Gestern ___ ich ins Kino gegangen.",       options:["habe","ist","hat","bin"],                  answer:"bin" },
    { type:"fill", sentence:"Sie ___ jeden Morgen Zeitung.",            options:["lesen","lest","lese","liest"],             answer:"liest" },
    { type:"fill", sentence:"Ich möchte ein Ticket ___ München.",       options:["zu","in","an","nach"],                     answer:"nach" },
    { type:"fill", sentence:"Haben Sie ein Zimmer ___?",                options:["freier","freies","freiem","frei"],          answer:"frei" },
    { type:"fill", sentence:"Das Konzert ___ um 20 Uhr.",               options:["beginn","beginne","begann","beginnt"],     answer:"beginnt" },
    { type:"fill", sentence:"Ich ___ gestern sehr müde.",               options:["bin","habe","hatte","war"],                answer:"war" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Wo ist der nächste Supermarkt?",           options:["Where is the nearest station?","Where is the nearest pharmacy?","Where is the nearest bus stop?","Where is the nearest supermarket?"], answer:"Where is the nearest supermarket?" },
    { type:"listen", audio:"Ich hätte gerne ein Glas Wasser.",         options:["I would like a cup of coffee.","I would like a glass of juice.","I would like a bottle of wine.","I would like a glass of water."],     answer:"I would like a glass of water." },
    { type:"listen", audio:"Der Zug fährt um halb neun ab.",           options:["The train departs at nine o'clock.","The train departs at quarter to nine.","The train departs at eight o'clock.","The train departs at half past eight."], answer:"The train departs at half past eight." },
    { type:"listen", audio:"Können Sie mir helfen?",                   options:["Could you repeat that?","Do you speak English?","Where are you from?","Can you help me?"],                                              answer:"Can you help me?" },
    { type:"listen", audio:"Das macht zwanzig Euro.",                  options:["That costs twelve euros.","That costs thirty euros.","That costs two euros.","That costs twenty euros."],                              answer:"That costs twenty euros." },
    { type:"listen", audio:"Bitte zeigen Sie mir Ihren Ausweis.",      options:["Please fill in this form.","Please sign here.","Please take a seat.","Please show me your ID."],                                       answer:"Please show me your ID." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"I would like a coffee, please.",      options:["Ich will Kaffee.","Ich nehme einen Kaffee.","Kaffee für mich.","Ich hätte gerne einen Kaffee, bitte."],         answer:"Ich hätte gerne einen Kaffee, bitte." },
    { type:"translate", english:"How much does this cost?",            options:["Was ist das?","Haben Sie das?","Wo kauft man das?","Wie viel kostet das?"],                                     answer:"Wie viel kostet das?" },
    { type:"translate", english:"Where is the bus stop?",              options:["Wo ist der Bahnhof?","Wo ist die U-Bahn?","Wo ist das Taxi?","Wo ist die Bushaltestelle?"],                     answer:"Wo ist die Bushaltestelle?" },
    { type:"translate", english:"I need a doctor.",                    options:["Ich suche eine Apotheke.","Ich möchte ins Krankenhaus.","Ich habe Schmerzen.","Ich brauche einen Arzt."],       answer:"Ich brauche einen Arzt." },
    { type:"translate", english:"Can I pay by card?",                  options:["Haben Sie Bargeld?","Wie teuer ist das?","Ich zahle bar.","Kann ich mit Karte zahlen?"],                        answer:"Kann ich mit Karte zahlen?" },
    { type:"translate", english:"A return ticket to Munich, please.",  options:["Eine Fahrkarte nach München, bitte.","Zwei Tickets nach München.","Wann fährt der Zug nach München?","Eine Rückfahrkarte nach München, bitte."], answer:"Eine Rückfahrkarte nach München, bitte." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Sie sind im Restaurant und möchten die Rechnung. Was sagen Sie?",          options:["Ich bin fertig.","Das Essen war gut.","Noch etwas?","Die Rechnung, bitte."],                                 answer:"Die Rechnung, bitte." },
    { type:"mcq", prompt:"Im Supermarkt: Sie suchen die Milch. Was fragen Sie?",                     options:["Ich kaufe Milch.","Die Milch ist lecker.","Haben Sie Milch gekauft?","Wo finde ich die Milch, bitte?"],     answer:"Wo finde ich die Milch, bitte?" },
    { type:"mcq", prompt:"Am Bahnhof: Der Zug hat Verspätung. Was bedeutet das?",                   options:["Der Zug ist abgefahren.","Der Zug kommt früher an.","Der Zug fährt nicht.","Der Zug kommt später an."],     answer:"Der Zug kommt später an." },
    { type:"mcq", prompt:"Sie sind krank und rufen beim Arzt an. Was sagen Sie zuerst?",             options:["Ich kaufe Medikamente.","Ich gehe ins Krankenhaus.","Ich bleibe zu Hause.","Ich möchte einen Termin, bitte."], answer:"Ich möchte einen Termin, bitte." },
    { type:"mcq", prompt:"Im Hotel: Sie möchten einchecken. Was sagen Sie?",                         options:["Ich suche einen Supermarkt.","Wo ist das Restaurant?","Ich brauche ein Taxi.","Guten Tag, ich habe eine Reservierung."], answer:"Guten Tag, ich habe eine Reservierung." },
    { type:"mcq", prompt:"Jemand fragt: 'Wie war Ihr Wochenende?' Wie antworten Sie?",              options:["Ich weiß nicht.","Das Wochenende ist morgen.","Ich habe keine Zeit.","Es war sehr schön, danke."],          answer:"Es war sehr schön, danke." },
  ],

  "B1": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", german:"die Bewerbung",      options:["job interview","job advertisement","job offer","job application"],     answer:"job application" },
    { type:"translate-en", german:"das Krankenhaus",    options:["pharmacy","doctor's surgery","health insurance","hospital"],           answer:"hospital" },
    { type:"translate-en", german:"vorschlagen",        options:["to demand","to refuse","to ignore","to suggest"],                      answer:"to suggest" },
    { type:"translate-en", german:"zuverlässig",        options:["ambitious","flexible","unreliable","reliable"],                        answer:"reliable" },
    { type:"translate-en", german:"die Meinung",        options:["news","meeting","majority","opinion"],                                 answer:"opinion" },
    { type:"translate-en", german:"sich beschweren",    options:["to apologise","to enquire","to agree","to complain"],                  answer:"to complain" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Obwohl es regnete, ___ wir spazieren.",                         options:["gehen","gegangen","geht","gingen"],        answer:"gingen" },
    { type:"fill", sentence:"Ich ___ gerne reisen, wenn ich mehr Zeit hätte.",               options:["werde","wurde","wäre","würde"],            answer:"würde" },
    { type:"fill", sentence:"Das Projekt ___ bis Freitag fertig sein.",                      options:["musste","müsste","mag","muss"],            answer:"muss" },
    { type:"fill", sentence:"Er ist seit drei Jahren ___ Deutschland.",                      options:["nach","aus","von","in"],                   answer:"in" },
    { type:"fill", sentence:"Wir haben ___ dem Essen über die Pläne gesprochen.",            options:["vor","bei","während","nach"],              answer:"nach" },
    { type:"fill", sentence:"Sie hat mir geholfen, ___ Arbeit zu finden.",                   options:["einen","einem","ein","eine"],              answer:"eine" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Ich bin damit nicht einverstanden.",         options:["I fully agree with that.","I haven't decided yet.","I need more time to think.","I don't agree with that."],                 answer:"I don't agree with that." },
    { type:"listen", audio:"Könnten Sie das bitte wiederholen?",         options:["Could you speak more slowly?","Could you write that down?","Could you explain that?","Could you please repeat that?"],        answer:"Could you please repeat that?" },
    { type:"listen", audio:"Es tut mir leid, ich habe mich geirrt.",     options:["I'm sorry, I don't understand.","I'm sorry, I'm late.","I'm sorry, I forgot.","I'm sorry, I was wrong."],                   answer:"I'm sorry, I was wrong." },
    { type:"listen", audio:"Wie lange dauert die Fahrt?",                options:["How far is the journey?","How much does the journey cost?","When does the journey start?","How long does the journey take?"],  answer:"How long does the journey take?" },
    { type:"listen", audio:"Ich interessiere mich für die Stelle.",      options:["I applied for the position.","I rejected the position.","I was offered the position.","I am interested in the position."],    answer:"I am interested in the position." },
    { type:"listen", audio:"Das hängt davon ab.",                        options:["That is certain.","That is impossible.","That is a good idea.","That depends on it."],                                        answer:"That depends on it." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"I have been living in Berlin for two years.",    options:["Ich habe zwei Jahre in Berlin gewohnt.","Ich wohnteдва Jahre in Berlin.","Ich bin zwei Jahre in Berlin.","Ich wohne seit zwei Jahren in Berlin."],    answer:"Ich wohne seit zwei Jahren in Berlin." },
    { type:"translate", english:"Could you please speak more slowly?",            options:["Sprechen Sie bitte deutlicher.","Können Sie lauter sprechen?","Wiederholen Sie das bitte.","Könnten Sie bitte langsamer sprechen?"],                  answer:"Könnten Sie bitte langsamer sprechen?" },
    { type:"translate", english:"In my opinion, this is a good idea.",            options:["Das ist eine gute Idee.","Ich glaube, das ist gut.","Ich bin dafür.","Meiner Meinung nach ist das eine gute Idee."],                               answer:"Meiner Meinung nach ist das eine gute Idee." },
    { type:"translate", english:"I would like to make an appointment.",           options:["Ich brauche einen Termin.","Ich möchte einen Arzt besuchen.","Kann ich einen Termin haben?","Ich würde gerne einen Termin vereinbaren."],            answer:"Ich würde gerne einen Termin vereinbaren." },
    { type:"translate", english:"What do you think about that?",                  options:["Haben Sie das gemacht?","Wie gefällt Ihnen das?","Kennen Sie das?","Was denken Sie darüber?"],                                                       answer:"Was denken Sie darüber?" },
    { type:"translate", english:"I have a question about the contract.",          options:["Ich verstehe den Vertrag nicht.","Darf ich den Vertrag lesen?","Wann gilt der Vertrag?","Ich habe eine Frage zum Vertrag."],                         answer:"Ich habe eine Frage zum Vertrag." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Sie bewerben sich um eine Stelle. Was gehört in eine vollständige Bewerbung?",              options:["Nur das Anschreiben","Nur der Lebenslauf","Ein Foto und eine Empfehlung","Lebenslauf und Anschreiben"],                      answer:"Lebenslauf und Anschreiben" },
    { type:"mcq", prompt:"Sie sind beim Arzt. Er fragt nach Ihren Beschwerden. Was sagen Sie?",                       options:["Ich bin müde.","Ich nehme Medikamente.","Ich war gestern krank.","Ich habe seit drei Tagen Kopfschmerzen."],              answer:"Ich habe seit drei Tagen Kopfschmerzen." },
    { type:"mcq", prompt:"Sie möchten Ihre Meinung höflich äußern. Welcher Ausdruck passt?",                          options:["Das ist falsch.","Das stimmt überhaupt nicht.","Das interessiert mich nicht.","Ich bin der Meinung, dass..."],            answer:"Ich bin der Meinung, dass..." },
    { type:"mcq", prompt:"Jemand hat einen Fehler gemacht und entschuldigt sich. Was antworten Sie?",                 options:["Das war sehr schlecht.","Das ist nicht in Ordnung.","Warum haben Sie das gemacht?","Kein Problem, das kann passieren."], answer:"Kein Problem, das kann passieren." },
    { type:"mcq", prompt:"Sie haben eine Frage, aber der Redner spricht zu schnell. Was tun Sie?",                    options:["Sie verlassen den Raum.","Sie hören nicht mehr zu.","Sie schreiben nichts auf.","Sie bitten ihn, langsamer zu sprechen."], answer:"Sie bitten ihn, langsamer zu sprechen." },
    { type:"mcq", prompt:"Ihr Kollege erklärt einen Plan. Sie sind unsicher, ob Sie alles verstanden haben. Was sagen Sie?", options:["Das weiß ich schon.","Ja, natürlich.","Das ist mir egal.","Entschuldigung, könnten Sie das kurz zusammenfassen?"], answer:"Entschuldigung, könnten Sie das kurz zusammenfassen?" },
  ],

  "B2": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", german:"die Verhandlung",    options:["announcement","presentation","complaint","negotiation"],           answer:"negotiation" },
    { type:"translate-en", german:"beeinflussen",       options:["to ignore","to encourage","to prevent","to influence"],            answer:"to influence" },
    { type:"translate-en", german:"nachhaltig",         options:["modern","temporary","expensive","sustainable"],                    answer:"sustainable" },
    { type:"translate-en", german:"scheitern",          options:["to succeed","to delay","to compete","to fail"],                    answer:"to fail" },
    { type:"translate-en", german:"die Fachkenntnis",   options:["work experience","job title","professional qualification","expert knowledge"], answer:"expert knowledge" },
    { type:"translate-en", german:"das Gleichgewicht",  options:["atmosphere","imbalance","distribution","balance"],                 answer:"balance" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"___ er krank war, kam er trotzdem zur Arbeit.",                     options:["Weil","Damit","Falls","Obwohl"],             answer:"Obwohl" },
    { type:"fill", sentence:"Das Ergebnis hängt davon ___, wie viel Zeit wir investieren.",      options:["ein","an","auf","ab"],                       answer:"ab" },
    { type:"fill", sentence:"Je mehr er lernte, ___ sicherer wurde er.",                         options:["umso","so","wie","desto"],                   answer:"desto" },
    { type:"fill", sentence:"Die neue Regelung ___ ab Januar in Kraft.",                         options:["träte","treten","trete","tritt"],            answer:"tritt" },
    { type:"fill", sentence:"Das Projekt wäre ohne ausreichende Finanzierung nicht ___.",        options:["realisiert","realisierend","realisiere","realisierbar"], answer:"realisierbar" },
    { type:"fill", sentence:"Er hatte versprochen, pünktlich zu sein, ___ er zu spät kam.",     options:["weil","damit","obwohl","aber"],              answer:"aber" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Die Maßnahmen wurden trotz Kritik durchgesetzt.",         options:["The measures were withdrawn due to criticism.","The measures were discussed but not approved.","The measures were delayed because of criticism.","The measures were pushed through despite criticism."],                  answer:"The measures were pushed through despite criticism." },
    { type:"listen", audio:"Es besteht kein Anlass zur Besorgnis.",                   options:["There are reasons to be concerned.","The situation is unclear.","We are monitoring the situation.","There is no cause for concern."],                                                                                    answer:"There is no cause for concern." },
    { type:"listen", audio:"Der Antrag wurde abgelehnt.",                             options:["The application was approved.","The application is pending.","The application was withdrawn.","The application was rejected."],                                                                                          answer:"The application was rejected." },
    { type:"listen", audio:"Wir müssen einen Kompromiss finden.",                     options:["We must stand firm.","We should postpone the decision.","We have reached an agreement.","We need to find a compromise."],                                                                                              answer:"We need to find a compromise." },
    { type:"listen", audio:"Die Konferenz wurde auf unbestimmte Zeit verschoben.",    options:["The conference was cancelled.","The conference was moved to a smaller venue.","The conference is taking place as planned.","The conference was postponed indefinitely."],                                               answer:"The conference was postponed indefinitely." },
    { type:"listen", audio:"Er hat sein Versprechen nicht gehalten.",                 options:["He kept his promise.","He made a new promise.","He asked to be released from his promise.","He did not keep his promise."],                                                                                             answer:"He did not keep his promise." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"The project was completed on time despite the difficulties.",  options:["Das Projekt wurde wegen der Schwierigkeiten nicht abgeschlossen.","Das Projekt ist pünktlich, aber es gab Probleme.","Das Projekt konnte trotz allem nicht fertiggestellt werden.","Das Projekt wurde trotz der Schwierigkeiten pünktlich abgeschlossen."], answer:"Das Projekt wurde trotz der Schwierigkeiten pünktlich abgeschlossen." },
    { type:"translate", english:"I would appreciate your feedback.",                            options:["Ich brauche Ihre Kritik.","Könnten Sie bitte weniger Feedback geben?","Ihr Feedback ist nicht notwendig.","Ich würde mich über Ihr Feedback freuen."],                                                          answer:"Ich würde mich über Ihr Feedback freuen." },
    { type:"translate", english:"The results are not yet available.",                           options:["Die Ergebnisse sind enttäuschend.","Die Ergebnisse wurden noch nicht besprochen.","Die Ergebnisse sind bereits bekannt.","Die Ergebnisse liegen noch nicht vor."],                                            answer:"Die Ergebnisse liegen noch nicht vor." },
    { type:"translate", english:"We need to reconsider our strategy.",                          options:["Wir haben keine Strategie mehr.","Unsere Strategie funktioniert gut.","Wir sollten an unserer Strategie festhalten.","Wir müssen unsere Strategie überdenken."],                                              answer:"Wir müssen unsere Strategie überdenken." },
    { type:"translate", english:"Could you elaborate on that point?",                          options:["Warum sagen Sie das?","Können Sie das wiederholen?","Sind Sie damit einverstanden?","Könnten Sie diesen Punkt näher erläutern?"],                                                                              answer:"Könnten Sie diesen Punkt näher erläutern?" },
    { type:"translate", english:"It is essential that we meet the deadline.",                   options:["Die Frist ist nicht so wichtig.","Es wäre gut, die Frist zu halten.","Wir sollten die Frist verlängern.","Es ist unbedingt erforderlich, dass wir die Frist einhalten."],                                    answer:"Es ist unbedingt erforderlich, dass wir die Frist einhalten." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Bei einer Besprechung werden Sie gebeten, Ihren Standpunkt zu erläutern. Wie beginnen Sie?",  options:["Das weiß ich nicht.","Das ist nicht meine Aufgabe.","Das ist eine schwierige Frage.","Ich möchte kurz erklären, warum ich der Meinung bin, dass..."],              answer:"Ich möchte kurz erklären, warum ich der Meinung bin, dass..." },
    { type:"mcq", prompt:"In einer Diskussion stimmen Sie nicht zu. Wie widersprechen Sie höflich?",                     options:["Das ist völlig falsch.","Sie verstehen das nicht.","Das interessiert mich nicht.","Ich sehe das etwas anders."],                                                       answer:"Ich sehe das etwas anders." },
    { type:"mcq", prompt:"Sie erhalten eine Absage auf Ihre Bewerbung. Was ist eine angemessene Reaktion?",              options:["Gar nicht reagieren.","Eine Beschwerde einreichen.","Sofort eine neue Bewerbung schicken.","Höflich antworten und nach Feedback fragen."],                           answer:"Höflich antworten und nach Feedback fragen." },
    { type:"mcq", prompt:"Ihr Gesprächspartner benutzt einen Fachausdruck, den Sie nicht kennen. Was tun Sie?",          options:["So tun, als ob Sie ihn kennen.","Das Gespräch abbrechen.","Den Begriff googeln, ohne etwas zu sagen.","Könnten Sie diesen Begriff kurz erklären?"],               answer:"Könnten Sie diesen Begriff kurz erklären?" },
    { type:"mcq", prompt:"Sie sollen eine formelle E-Mail an einen Kunden beginnen. Welche Anrede ist korrekt?",         options:["Hey,","Hallo zusammen,","Hi,","Sehr geehrte Damen und Herren,"],                                                                                                    answer:"Sehr geehrte Damen und Herren," },
    { type:"mcq", prompt:"Sie sollen einen langen Bericht zusammenfassen. Was ist am wichtigsten?",                     options:["Alle Details wiederholen.","Den Bericht möglichst lang machen.","Nur die Einleitung verwenden.","Die Hauptpunkte klar und knapp zusammenfassen."],                  answer:"Die Hauptpunkte klar und knapp zusammenfassen." },
  ],

  "C1": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", german:"die Schlussfolgerung",  options:["introduction","assumption","recommendation","conclusion"],      answer:"conclusion" },
    { type:"translate-en", german:"unentbehrlich",         options:["unusual","unreliable","controversial","indispensable"],         answer:"indispensable" },
    { type:"translate-en", german:"der Einwand",           options:["proposal","agreement","evidence","objection"],                 answer:"objection" },
    { type:"translate-en", german:"verhältnismäßig",       options:["disproportionate","excessive","absolute","proportionate"],     answer:"proportionate" },
    { type:"translate-en", german:"einleuchten",           options:["to illuminate","to confuse","to complicate","to make sense"],  answer:"to make sense" },
    { type:"translate-en", german:"die Beeinträchtigung",  options:["enhancement","influence","continuation","impairment"],        answer:"impairment" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Er bestand darauf, dass der Vertrag ___ werde.",                      options:["überprüfend","überprüften","überprüfen","überprüft"],    answer:"überprüft" },
    { type:"fill", sentence:"Das Gesetz trat ___ der Einwände der Opposition in Kraft.",           options:["trotzdem","obwohl","dennoch","ungeachtet"],              answer:"ungeachtet" },
    { type:"fill", sentence:"___ man auch noch so viel lernt, es gibt immer Neues zu entdecken.", options:["Darf","Soll","Muss","Mag"],                              answer:"Mag" },
    { type:"fill", sentence:"Je komplexer das Problem, ___ mehr Zeit wird benötigt.",              options:["je","so","umso","desto"],                                answer:"desto" },
    { type:"fill", sentence:"Es wird erwartet, dass das neue Modell bis Ende des Jahres ___ wird.",options:["vorstellend","vorstellt","vorstellen","vorgestellt"],   answer:"vorgestellt" },
    { type:"fill", sentence:"Der Zeuge schilderte die Ereignisse, ___ er sie erlebt hatte.",       options:["ob","weil","als","wie"],                                answer:"wie" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Das lässt sich so nicht verallgemeinern.",            options:["That can be easily generalised.","That is impossible to understand.","That has been thoroughly researched.","That cannot be generalised in that way."],                     answer:"That cannot be generalised in that way." },
    { type:"listen", audio:"Er ließ sich nicht von seiner Entscheidung abbringen.",options:["He changed his mind at the last moment.","He made a poor decision under pressure.","He regretted his decision afterwards.","He was not dissuaded from his decision."],    answer:"He was not dissuaded from his decision." },
    { type:"listen", audio:"Es wäre voreilig, jetzt schon Schlüsse zu ziehen.",   options:["It is necessary to draw conclusions immediately.","The conclusions are already clear.","The conclusions are disappointing.","It would be premature to draw conclusions now."], answer:"It would be premature to draw conclusions now." },
    { type:"listen", audio:"Das steht außer Frage.",                              options:["That is highly questionable.","That is open to debate.","That has not been answered yet.","That is beyond question."],                                                       answer:"That is beyond question." },
    { type:"listen", audio:"Er hat die Situation völlig falsch eingeschätzt.",    options:["He assessed the situation correctly.","He refused to comment on the situation.","He was completely unaware of the situation.","He completely misjudged the situation."],     answer:"He completely misjudged the situation." },
    { type:"listen", audio:"Die Verhandlungen stehen kurz vor dem Abschluss.",   options:["The negotiations have broken down.","The negotiations are just beginning.","The negotiations will take several more months.","The negotiations are close to completion."],   answer:"The negotiations are close to completion." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"The proposal was met with considerable scepticism.",        options:["Der Vorschlag stieß auf große Zustimmung.","Der Vorschlag wurde zurückgezogen.","Der Vorschlag war überraschend erfolgreich.","Der Vorschlag stieß auf erhebliche Skepsis."],           answer:"Der Vorschlag stieß auf erhebliche Skepsis." },
    { type:"translate", english:"It goes without saying that punctuality is expected.",      options:["Pünktlichkeit ist manchmal wichtig.","Pünktlichkeit ist eine Tugend.","Es ist unklar, ob Pünktlichkeit erwartet wird.","Es versteht sich von selbst, dass Pünktlichkeit erwartet wird."], answer:"Es versteht sich von selbst, dass Pünktlichkeit erwartet wird." },
    { type:"translate", english:"The findings give cause for concern.",                      options:["Die Ergebnisse sind überraschend positiv.","Die Ergebnisse wurden noch nicht ausgewertet.","Die Ergebnisse entsprechen den Erwartungen.","Die Ergebnisse geben Anlass zur Besorgnis."],   answer:"Die Ergebnisse geben Anlass zur Besorgnis." },
    { type:"translate", english:"She made a compelling argument.",                           options:["Sie hat ein langes Argument vorgebracht.","Sie hat ihr Argument zurückgezogen.","Sie hat das Argument nicht verstanden.","Sie hat ein überzeugendes Argument vorgebracht."],               answer:"Sie hat ein überzeugendes Argument vorgebracht." },
    { type:"translate", english:"The amendment was adopted unanimously.",                    options:["Die Änderung wurde mehrheitlich abgelehnt.","Die Änderung wurde diskutiert aber nicht beschlossen.","Die Änderung wurde vertagt.","Die Änderung wurde einstimmig angenommen."],         answer:"Die Änderung wurde einstimmig angenommen." },
    { type:"translate", english:"He tends to overlook the bigger picture.",                  options:["Er sieht das große Ganze sehr gut.","Er konzentriert sich nur auf das Wesentliche.","Er verliert selten den Überblick.","Er neigt dazu, das große Ganze zu übersehen."],                answer:"Er neigt dazu, das große Ganze zu übersehen." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"In einem akademischen Vortrag möchten Sie ein Gegenargument einleiten. Was sagen Sie?",                options:["Das stimmt überhaupt nicht.","Das ist eine schlechte Idee.","Ich bin anderer Meinung.","Man könnte jedoch einwenden, dass..."],                                    answer:"Man könnte jedoch einwenden, dass..." },
    { type:"mcq", prompt:"Sie leiten eine Diskussion und möchten zum nächsten Punkt übergehen. Was sagen Sie?",                   options:["Ich habe genug gehört.","Das reicht für heute.","Jetzt spreche ich.","Kommen wir nun zum nächsten Punkt."],                                                   answer:"Kommen wir nun zum nächsten Punkt." },
    { type:"mcq", prompt:"Sie stimmen einer These weitgehend zu, sehen aber Einschränkungen. Was sagen Sie?",                     options:["Das ist falsch.","Ich stimme zu.","Das ist eine interessante Frage.","Im Großen und Ganzen stimme ich zu, allerdings..."],                                    answer:"Im Großen und Ganzen stimme ich zu, allerdings..." },
    { type:"mcq", prompt:"Ein Kollege behauptet etwas faktisch Falsches in einer Präsentation. Wie reagieren Sie höflich?",        options:["Das ist völlig falsch.","Sie sollten das besser recherchieren.","Das stimmt nicht, das weiß jeder.","Ich glaube, da liegt möglicherweise ein Missverständnis vor."], answer:"Ich glaube, da liegt möglicherweise ein Missverständnis vor." },
    { type:"mcq", prompt:"Sie müssen einen komplexen Sachverhalt schriftlich erklären. Was ist besonders wichtig?",               options:["Möglichst viel Text schreiben.","Technische Fachbegriffe häufen.","Den Text möglichst kurz halten, egal wie unklar.","Klare Struktur und präzise Formulierungen."], answer:"Klare Struktur und präzise Formulierungen." },
    { type:"mcq", prompt:"Sie sollen einen längeren Text auf seine Hauptaussage hin zusammenfassen. Welche Strategie verwenden Sie?", options:["Den gesamten Text wörtlich abschreiben.","Nur die erste und letzte Seite lesen.","Den Text nach Adjektiven durchsuchen.","Den Text überfliegen und dann die Hauptpunkte herausarbeiten."], answer:"Den Text überfliegen und dann die Hauptpunkte herausarbeiten." },
  ],

  "C2": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", german:"die Ambiguität",     options:["clarity","precision","complexity","ambiguity"],             answer:"ambiguity" },
    { type:"translate-en", german:"erschöpfend",        options:["tiring","incomplete","preliminary","exhaustive"],           answer:"exhaustive" },
    { type:"translate-en", german:"hinfällig",          options:["essential","urgent","relevant","moot"],                     answer:"moot" },
    { type:"translate-en", german:"die Abgrenzung",     options:["combination","overlap","connection","delimitation"],        answer:"delimitation" },
    { type:"translate-en", german:"wohingegen",         options:["therefore","nevertheless","provided that","whereas"],       answer:"whereas" },
    { type:"translate-en", german:"der Vorbehalt",      options:["assumption","exception","requirement","reservation"],       answer:"reservation" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Wäre er früher gegangen, ___ er den Zug nicht verpasst.",                       options:["würde","wäre","hatte","hätte"],                                      answer:"hätte" },
    { type:"fill", sentence:"Die Studie, ___ Ergebnisse aufsehen erregend sind, wird nächste Woche veröffentlicht.", options:["die","das","derer","deren"],                                answer:"deren" },
    { type:"fill", sentence:"Nicht ___ verstand er die Frage, sondern er konnte sie auch beantworten.",      options:["auch","einmal","mal","nur"],                                         answer:"nur" },
    { type:"fill", sentence:"Der Beschluss gilt, ___ man ihn gutheißt oder nicht.",                          options:["wenn","falls","obwohl","ob"],                                       answer:"ob" },
    { type:"fill", sentence:"Er sprach so überzeugend, ___ alle schließlich zustimmten.",                    options:["obwohl","damit","sodass","dass"],                                    answer:"dass" },
    { type:"fill", sentence:"Die Regelung gilt ___ für alle Verträge, die nach dem 1. Januar geschlossen wurden.", options:["vorrangig","allgemein","gleichermaßen","ausschließlich"],     answer:"ausschließlich" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Das Argument entbehrt jeder Grundlage.",                             options:["The argument is well-founded.","The argument needs further evidence.","The argument is partially correct.","The argument has no basis whatsoever."],                          answer:"The argument has no basis whatsoever." },
    { type:"listen", audio:"Sie ließ keinen Zweifel an ihrer Haltung.",                          options:["She was uncertain about her position.","She changed her position under pressure.","She expressed doubts about her stance.","She left no doubt about her position."],          answer:"She left no doubt about her position." },
    { type:"listen", audio:"Das Vorhaben scheiterte an mangelndem politischen Willen.",          options:["The project succeeded thanks to political support.","The project was cancelled for financial reasons.","The project was delayed by political disagreement.","The project failed due to lack of political will."], answer:"The project failed due to lack of political will." },
    { type:"listen", audio:"Man darf die Tragweite dieser Entscheidung nicht unterschätzen.",   options:["One should not overestimate the impact of this decision.","This decision has no significant consequences.","This decision is unlikely to have any impact.","One must not underestimate the significance of this decision."], answer:"One must not underestimate the significance of this decision." },
    { type:"listen", audio:"Die Studie kommt zu dem Schluss, dass weitere Forschung notwendig ist.", options:["The study concludes that no further research is needed.","The study was unable to reach any conclusions.","The study's conclusions have been challenged.","The study concludes that further research is necessary."], answer:"The study concludes that further research is necessary." },
    { type:"listen", audio:"Er vermied es geschickt, eine direkte Antwort zu geben.",            options:["He gave a very direct and honest answer.","He was unable to answer the question.","He answered the question after some hesitation.","He cleverly avoided giving a direct answer."],  answer:"He cleverly avoided giving a direct answer." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"The implications of this decision remain to be seen.",          options:["Die Entscheidung hatte keine Folgen.","Die Folgen dieser Entscheidung wurden bereits analysiert.","Die Entscheidung wurde noch nicht getroffen.","Die Auswirkungen dieser Entscheidung bleiben abzuwarten."],   answer:"Die Auswirkungen dieser Entscheidung bleiben abzuwarten." },
    { type:"translate", english:"Her argument was both nuanced and persuasive.",                 options:["Ihr Argument war lang und detailliert.","Ihr Argument war schwer verständlich.","Ihr Argument überzeugte niemanden.","Ihr Argument war sowohl differenziert als auch überzeugend."],                          answer:"Ihr Argument war sowohl differenziert als auch überzeugend." },
    { type:"translate", english:"The data corroborates the initial hypothesis.",                 options:["Die Daten widerlegen die ursprüngliche Hypothese.","Die Daten stehen in keinem Zusammenhang zur Hypothese.","Die Daten machen die Hypothese unnötig.","Die Daten bestätigen die ursprüngliche Hypothese."],    answer:"Die Daten bestätigen die ursprüngliche Hypothese." },
    { type:"translate", english:"It would be misleading to draw such a conclusion.",             options:["Diese Schlussfolgerung ist naheliegend.","Es ist wichtig, diese Schlussfolgerung zu ziehen.","Diese Schlussfolgerung ist schwer zu vermeiden.","Es wäre irreführend, eine solche Schlussfolgerung zu ziehen."],  answer:"Es wäre irreführend, eine solche Schlussfolgerung zu ziehen." },
    { type:"translate", english:"Despite extensive research, the cause remains unknown.",        options:["Nach umfangreicher Forschung wurde die Ursache gefunden.","Die Forschung zu diesem Thema steht noch am Anfang.","Die Ursache ist bekannt, aber umstritten.","Trotz umfangreicher Forschung ist die Ursache nach wie vor unbekannt."], answer:"Trotz umfangreicher Forschung ist die Ursache nach wie vor unbekannt." },
    { type:"translate", english:"The committee reached a unanimous verdict.",                    options:["Das Komitee konnte sich nicht einigen.","Das Komitee vertagte die Entscheidung.","Das Komitee stimmte mehrheitlich dafür.","Das Komitee kam zu einem einstimmigen Urteil."],                                   answer:"Das Komitee kam zu einem einstimmigen Urteil." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Sie sollen ein wissenschaftliches Gutachten kritisch bewerten. Worauf achten Sie zuerst?",           options:["Den Namen des Autors","Die Länge des Textes","Das Layout und die Formatierung","Methodik, Quellen und Schlussfolgerungen"],                                              answer:"Methodik, Quellen und Schlussfolgerungen" },
    { type:"mcq", prompt:"In einem hochrangigen Gespräch möchten Sie Zustimmung mit Vorbehalt ausdrücken. Was sagen Sie?",     options:["Ich stimme vollständig zu.","Das ist eine schwierige Frage.","Ich bin nicht einverstanden.","Das leuchtet mir ein, wenngleich man bedenken sollte, dass..."],           answer:"Das leuchtet mir ein, wenngleich man bedenken sollte, dass..." },
    { type:"mcq", prompt:"Jemand formuliert ein Argument mit einem logischen Fehlschluss. Wie weisen Sie höflich darauf hin?", options:["Das ist völlig falsch.","Sie denken nicht logisch.","Das kann ich nicht akzeptieren.","Ihr Argument setzt voraus, dass... — ist das nicht möglicherweise fraglich?"],  answer:"Ihr Argument setzt voraus, dass... — ist das nicht möglicherweise fraglich?" },
    { type:"mcq", prompt:"Ein Kollege verwendet einen Begriff in einem falschen Kontext. Wie reagieren Sie sachlich?",          options:["Sie sagen nichts, um Konflikte zu vermeiden.","Sie lachen über den Fehler.","Sie korrigieren ihn laut vor allen.","In diesem Zusammenhang würde ich eher den Begriff '...' verwenden."], answer:"In diesem Zusammenhang würde ich eher den Begriff '...' verwenden." },
    { type:"mcq", prompt:"Sie übersetzen einen juristischen Text ins Deutsche. Was ist dabei besonders anspruchsvoll?",         options:["Die Länge des Textes","Das Finden von Synonymen","Die Schriftgröße und das Format","Fachterminologie und Bedeutungsgenauigkeit"],                                          answer:"Fachterminologie und Bedeutungsgenauigkeit" },
    { type:"mcq", prompt:"Sie müssen in einer Sitzung spontan einen komplexen Sachverhalt erläutern. Was tun Sie?",            options:["Sie bitten darum, es schriftlich einzureichen.","Sie weichen der Frage aus.","Sie lesen aus einem Dokument vor, ohne es zu erklären.","Den Sachverhalt strukturiert und in klaren Begriffen zusammenfassen."], answer:"Den Sachverhalt strukturiert und in klaren Begriffen zusammenfassen." },
  ],
};
