// French CEFR Exam Questions — 30 per level (A1–C2)
// Structure per level:
//   Q01–Q06  Vocabulary in Context  (translate-en: see French, choose English meaning)
//   Q07–Q12  Grammar in Context     (fill: French sentence with blank, French options)
//   Q13–Q18  Listening              (listen: hear French phrase, choose English meaning)
//   Q19–Q24  Speaking → Translate   (translate: English prompt, French options)
//   Q25–Q30  Scenario Tasks         (mcq: French situational prompt, French options)

export const FR_EXAM_QUESTIONS = {
  "A1": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", french:"Bonjour",               options:["goodbye","good night","thank you","hello"],                                                     answer:"hello" },
    { type:"translate-en", french:"Merci",                options:["please","goodbye","thank you","you're welcome"],                                              answer:"thank you" },
    { type:"translate-en", french:"Excusez-moi",          options:["goodbye","please","thank you","excuse me"],                                                   answer:"excuse me" },
    { type:"translate-en", french:"Bonne nuit",           options:["good morning","goodbye","good evening","good night"],                                         answer:"good night" },
    { type:"translate-en", french:"Je ne comprends pas",  options:["I don't know","I don't understand","I'm busy","I'm tired"],                                   answer:"I don't understand" },
    { type:"translate-en", french:"Ça coûte combien?",    options:["Where is it?","What time is it?","How much does it cost?","Can I help you?"],                 answer:"How much does it cost?" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Je m\'appelle ___.",         options:["est","suis","appelle","appel"],            answer:"appelle" },
    { type:"fill", sentence:"Comment ___ -tu?",           options:["est","appelles","es","suis"],              answer:"appelles" },
    { type:"fill", sentence:"C\'___ mon livre.",          options:["es","est","suis","suis"],                  answer:"est" },
    { type:"fill", sentence:"Je ___ de France.",          options:["viens","vient","venons","vient"],          answer:"viens" },
    { type:"fill", sentence:"Il ___ du thé.",             options:["bois","boit","boivent","buvons"],          answer:"boit" },
    { type:"fill", sentence:"Nous ___ faim.",             options:["avons","avez","ai","ont"],                 answer:"avons" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Bonjour madame",              options:["Good evening","Good night","Hello madam","Goodbye"],                                         answer:"Hello madam" },
    { type:"listen", audio:"Comment allez-vous?",         options:["Where are you from?","What is your name?","How are you?","Where are you?"],                 answer:"How are you?" },
    { type:"listen", audio:"Au revoir",                   options:["Hello","Please","Thank you","Goodbye"],                                                     answer:"Goodbye" },
    { type:"listen", audio:"Où est la toilette?",         options:["Where is the exit?","Where is the toilet?","Where is the station?","Where is the bus?"],   answer:"Where is the toilet?" },
    { type:"listen", audio:"Je m\'appelle Sophie",        options:["I am from Sophie","I come from Sophie","My name is Sophie","I work with Sophie"],            answer:"My name is Sophie" },
    { type:"listen", audio:"Désolé",                      options:["Thank you very much","Excuse me please","I'm sorry","You're welcome"],                      answer:"I'm sorry" },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"Good evening",            options:["Bon matin","Bonne nuit","Bon jour","Bonsoir"],                                                 answer:"Bonsoir" },
    { type:"translate", english:"My name is Pierre.",      options:["Je suis Pierre.","Je viens de Pierre.","J\'ai Pierre.","Je m\'appelle Pierre."],              answer:"Je m\'appelle Pierre." },
    { type:"translate", english:"I come from France.",     options:["Je wohne en France.","Je suis de France.","J\'habite de France.","Je viens de France."],     answer:"Je viens de France." },
    { type:"translate", english:"I don't understand.",     options:["Je ne sais pas.","Je ne parle pas français.","Je ne peux pas.","Je ne comprends pas."],      answer:"Je ne comprends pas." },
    { type:"translate", english:"How old are you?",        options:["Quel est ton nom?","D\'où viens-tu?","Qu\'est-ce que tu fais?","Quel âge as-tu?"],            answer:"Quel âge as-tu?" },
    { type:"translate", english:"Where do you live?",      options:["D\'où viens-tu?","Quel est ton nom?","Qu\'est-ce que tu fais?","Où habites-tu?"],            answer:"Où habites-tu?" },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Vous rencontrez quelqu\'un pour la première fois. Que dites-vous?",      options:["Bonne nuit!","Bonsoir!","Au revoir!","Enchanté, j\'ai beaucoup d\'amis."],     answer:"Enchanté, j\'ai beaucoup d\'amis." },
    { type:"mcq", prompt:"Quelqu\'un demande: \'Ça va?\' Comment répondez-vous?",                  options:["Je m\'appelle Pierre.","J\'habite à Paris.","Au revoir.","Ça va bien, merci. Et toi?"],  answer:"Ça va bien, merci. Et toi?" },
    { type:"mcq", prompt:"Vous voulez savoir l\'heure. Que demandez-vous?",                        options:["Où suis-je?","Ça coûte combien?","C\'est quoi?","Quelle heure est-il, s\'il vous plaît?"],  answer:"Quelle heure est-il, s\'il vous plaît?" },
    { type:"mcq", prompt:"Quelqu\'un vous donne un cadeau. Que dites-vous?",                       options:["Excusez-moi.","Au revoir!","S\'il vous plaît.","Merci beaucoup!"],                    answer:"Merci beaucoup!" },
    { type:"mcq", prompt:"Vous ne comprenez pas une question. Que dites-vous?",                   options:["Je sais tout.","Au revoir.","Je suis fatigué.","Parlez plus lentement, s\'il vous plaît."], answer:"Parlez plus lentement, s\'il vous plaît." },
    { type:"mcq", prompt:"Vous dites au revoir à un ami. Que dites-vous?",                         options:["Bonjour!","Salut!","Ça va?","À bientôt!"],                                         answer:"À bientôt!" },
  ],

  "A2": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", french:"la gare",          options:["airport","bus stop","taxi rank","train station"],     answer:"train station" },
    { type:"translate-en", french:"la pharmacie",     options:["supermarket","bakery","hospital","pharmacy"],          answer:"pharmacy" },
    { type:"translate-en", french:"le petit-déjeuner",options:["lunch","dinner","dessert","breakfast"],                answer:"breakfast" },
    { type:"translate-en", french:"cher",             options:["cheap","fresh","heavy","expensive"],                   answer:"expensive" },
    { type:"translate-en", french:"le retard",        options:["platform","arrival","departure","delay"],             answer:"delay" },
    { type:"translate-en", french:"tôt",              options:["late","often","never","early"],                        answer:"early" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Hier ___ au cinéma.",                     options:["suis allé","ai allé","vais","suis"],              answer:"suis allé" },
    { type:"fill", sentence:"Elle ___ le journal chaque matin.",        options:["lis","lit","lisent","lisons"],                    answer:"lit" },
    { type:"fill", sentence:"Je voudrais un ticket ___ Lyon.",          options:["pour","en","à","vers"],                          answer:"pour" },
    { type:"fill", sentence:"Avez-vous une chambre ___?",               options:["libre","libres","liber","libra"],                 answer:"libre" },
    { type:"fill", sentence:"Le concert ___ à 20 heures.",              options:["commence","commencent","commençons","commença"],  answer:"commence" },
    { type:"fill", sentence:"J\'___ très fatigué hier.",                options:["suis","ai","avais","étais"],                     answer:"étais" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Où est le supermarché le plus proche?",     options:["Where is the nearest station?","Where is the nearest pharmacy?","Where is the nearest supermarket?","Where is the nearest bus stop?"], answer:"Where is the nearest supermarket?" },
    { type:"listen", audio:"Je voudrais un verre d\'eau.",              options:["I would like a cup of coffee.","I would like a glass of juice.","I would like a glass of water.","I would like a bottle of wine."],     answer:"I would like a glass of water." },
    { type:"listen", audio:"Le train part à huit heures et demie.",     options:["The train departs at nine o'clock.","The train departs at half past eight.","The train departs at quarter to nine.","The train departs at eight o'clock."], answer:"The train departs at half past eight." },
    { type:"listen", audio:"Pouvez-vous m\'aider?",                    options:["Could you repeat that?","Do you speak English?","Where are you from?","Can you help me?"],                                              answer:"Can you help me?" },
    { type:"listen", audio:"Ça coûte vingt euros.",                     options:["That costs twelve euros.","That costs twenty euros.","That costs thirty euros.","That costs two euros."],                              answer:"That costs twenty euros." },
    { type:"listen", audio:"Montrez-moi votre passeport.",             options:["Please fill in this form.","Please sign here.","Please take a seat.","Please show me your passport."],                                 answer:"Please show me your passport." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"I would like a coffee, please.",      options:["Je veux du café.","Je prends un café.","Du café pour moi.","Je voudrais un café, s\'il vous plaît."],         answer:"Je voudrais un café, s\'il vous plaît." },
    { type:"translate", english:"How much does this cost?",            options:["C\'est quoi?","Vous l\'avez?","Où l\'achète-t-on?","Ça coûte combien?"],                                     answer:"Ça coûte combien?" },
    { type:"translate", english:"Where is the bus stop?",              options:["Où est la gare?","Où est le métro?","Où est le taxi?","Où est l\'arrêt de bus?"],                         answer:"Où est l\'arrêt de bus?" },
    { type:"translate", english:"I need a doctor.",                    options:["Je cherche une pharmacie.","Je veux aller à l\'hôpital.","J\'ai mal.","J\'ai besoin d\'un médecin."],       answer:"J\'ai besoin d\'un médecin." },
    { type:"translate", english:"Can I pay by card?",                  options:["Vous avez de l\'argent?","C\'est combien?","Je paie en espèces.","Je peux payer par carte?"],                answer:"Je peux payer par carte?" },
    { type:"translate", english:"A return ticket to Paris, please.",   options:["Un billet pour Paris, s\'il vous plaît.","Deux billets pour Paris.","Quand part le train pour Paris?","Un aller-retour pour Paris, s\'il vous plaît."], answer:"Un aller-retour pour Paris, s\'il vous plaît." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Vous êtes au restaurant et voulez l\'addition. Que dites-vous?",        options:["J\'ai fini.","Le repas était bon.","Encore quelque chose?","L\'addition, s\'il vous plaît."],                             answer:"L\'addition, s\'il vous plaît." },
    { type:"mcq", prompt:"Au supermarché: vous cherchez le lait. Que demandez-vous?",            options:["Je vais acheter du lait.","Le lait est délicieux.","Vous avez acheté du lait?","Où est le lait, s\'il vous plaît?"],     answer:"Où est le lait, s\'il vous plaît?" },
    { type:"mcq", prompt:"À la gare: le train a du retard. Qu\'est-ce que cela signifie?",      options:["Le train est parti.","Le train arrive plus tôt.","Le train ne part pas.","Le train arrive plus tard."],             answer:"Le train arrive plus tard." },
    { type:"mcq", prompt:"Vous êtes malade et appelez le médecin. Que dites-vous d\'abord?",     options:["J\'achète des médicaments.","Je vais à l\'hôpital.","Je reste à la maison.","Je voudrais un rendez-vous, s\'il vous plaît."], answer:"Je voudrais un rendez-vous, s\'il vous plaît." },
    { type:"mcq", prompt:"À l\'hôtel: vous voulez vous enregistrer. Que dites-vous?",            options:["Je cherche un supermarché.","Où est le restaurant?","J\'ai besoin d\'un taxi.","Bonjour, j\'ai une réservation."],      answer:"Bonjour, j\'ai une réservation." },
    { type:"mcq", prompt:"Quelqu\'un demande: \'Comment était votre week-end?\' Répondez.",      options:["Je ne sais pas.","Le week-end est demain.","Je n\'ai pas le temps.","C\'était très bien, merci."],                     answer:"C\'était très bien, merci." },
  ],

  "B1": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", french:"la candidature",  options:["job interview","job advertisement","job application","job offer"],    answer:"job application" },
    { type:"translate-en", french:"l\'hôpital",      options:["pharmacy","doctor's office","health insurance","hospital"],           answer:"hospital" },
    { type:"translate-en", french:"suggérer",        options:["to demand","to refuse","to ignore","to suggest"],                      answer:"to suggest" },
    { type:"translate-en", french:"fiable",          options:["ambitious","flexible","unreliable","reliable"],                        answer:"reliable" },
    { type:"translate-en", french:"l\'avis",         options:["news","meeting","majority","opinion"],                                 answer:"opinion" },
    { type:"translate-en", french:"se plaindre",     options:["to apologise","to enquire","to agree","to complain"],                  answer:"to complain" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Bien qu\'il pleuve, nous ___ en promenade.",                   options:["allons","allié","allez","allons"],          answer:"allons" },
    { type:"fill", sentence:"J\'aimerais voyager ___ j\'aurais plus de temps.",             options:["si","comme","parce que","si"],              answer:"si" },
    { type:"fill", sentence:"Le projet ___ être terminé vendredi.",                        options:["devrait","devra","doit","devaient"],        answer:"doit" },
    { type:"fill", sentence:"Il habite en France ___ trois ans.",                          options:["pendant","depuis","il y a","pour"],         answer:"depuis" },
    { type:"fill", sentence:"Après le dîner, nous ___ parlé des plans.",                   options:["avions","avez","ont","avons"],              answer:"avons" },
    { type:"fill", sentence:"Elle m\'a aidée à trouver ___ travail.",                      options:["une","un","des","le"],                      answer:"un" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Je ne suis pas d\'accord.",                 options:["I fully agree with that.","I haven't decided yet.","I don't agree with that.","I need more time to think."],                 answer:"I don't agree with that." },
    { type:"listen", audio:"Pouvez-vous répéter, s\'il vous plaît?",    options:["Could you speak more slowly?","Could you write that down?","Could you explain that?","Could you please repeat that?"],        answer:"Could you please repeat that?" },
    { type:"listen", audio:"Je suis désolé, je me suis trompé.",        options:["I'm sorry, I don't understand.","I'm sorry, I'm late.","I'm sorry, I was wrong.","I'm sorry, I forgot."],                   answer:"I'm sorry, I was wrong." },
    { type:"listen", audio:"Combien de temps dure le voyage?",          options:["How far is the journey?","How much does the journey cost?","When does the journey start?","How long does the journey take?"],  answer:"How long does the journey take?" },
    { type:"listen", audio:"Je m\'intéresse au poste.",                 options:["I applied for the position.","I rejected the position.","I am interested in the position.","I was offered the position."],    answer:"I am interested in the position." },
    { type:"listen", audio:"Ça dépend.",                                options:["That is certain.","That is impossible.","That depends on it.","That is a good idea."],                                        answer:"That depends on it." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"I have been living in Paris for two years.",    options:["J\'ai habité deux ans à Paris.","Je suis à Paris depuis deux ans.","Je demeure deux ans à Paris.","J\'habite depuis deux ans à Paris."],    answer:"J\'habite depuis deux ans à Paris." },
    { type:"translate", english:"Could you please speak more slowly?",            options:["Parlez plus clairement, s\'il vous plaît.","Pourriez-vous parler plus fort?","Répétez cela, s\'il vous plaît.","Pourriez-vous parler plus lentement, s\'il vous plaît?"],  answer:"Pourriez-vous parler plus lentement, s\'il vous plaît?" },
    { type:"translate", english:"In my opinion, this is a good idea.",            options:["C\'est une bonne idée.","Je crois que c\'est bien.","Je suis pour.","À mon avis, c\'est une bonne idée."],                       answer:"À mon avis, c\'est une bonne idée." },
    { type:"translate", english:"I would like to make an appointment.",           options:["J\'ai besoin d\'un rendez-vous.","Je veux voir un médecin.","Je peux avoir un rendez-vous?","Je voudrais prendre un rendez-vous."],            answer:"Je voudrais prendre un rendez-vous." },
    { type:"translate", english:"What do you think about that?",                  options:["Vous avez fait cela?","Comment aimez-vous cela?","Vous le connaissez?","Que pensez-vous de cela?"],                                           answer:"Que pensez-vous de cela?" },
    { type:"translate", english:"I have a question about the contract.",          options:["Je ne comprends pas le contrat.","Je peux lire le contrat?","Quand le contrat est-il valide?","J\'ai une question sur le contrat."],         answer:"J\'ai une question sur le contrat." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Vous postulez pour un emploi. Qu\'y a-t-il dans une candidature complète?",             options:["Juste la lettre de motivation","Juste le CV","Une photo et une recommandation","Le CV et la lettre de motivation"],            answer:"Le CV et la lettre de motivation" },
    { type:"mcq", prompt:"Vous êtes chez le médecin. Il vous demande vos plaintes. Que dites-vous?",               options:["Je suis fatigué.","Je prends des médicaments.","J\'ai eu mal hier.","J\'ai des maux de tête depuis trois jours."],              answer:"J\'ai des maux de tête depuis trois jours." },
    { type:"mcq", prompt:"Vous voulez exprimer votre avis poliment. Quel expression convient?",                     options:["C\'est faux.","Ce n\'est pas du tout vrai.","Ça ne m\'intéresse pas.","Je suis de l\'avis que..."],                    answer:"Je suis de l\'avis que..." },
    { type:"mcq", prompt:"Quelqu\'un a commis une erreur et s\'excuse. Que répondez-vous?",                        options:["C\'était très mal.","Ce n\'est pas acceptable.","Pourquoi avez-vous fait cela?","Ce n\'est pas grave, cela peut arriver."],  answer:"Ce n\'est pas grave, cela peut arriver." },
    { type:"mcq", prompt:"Vous avez une question, mais l\'orateur parle trop vite. Que faites-vous?",               options:["Vous quittez la salle.","Vous n\'écoutez plus.","Vous ne prenez pas de notes.","Vous lui demandez de parler plus lentement."], answer:"Vous lui demandez de parler plus lentement." },
    { type:"mcq", prompt:"Votre collègue explique un plan. Vous n\'êtes pas sûr d\'avoir tout compris. Dites...",    options:["Je le sais déjà.","Oui, bien sûr.","Ça m\'est égal.","Excusez-moi, pouvez-vous me le résumer brièvement?"],              answer:"Excusez-moi, pouvez-vous me le résumer brièvement?" },
  ],

  "B2": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", french:"la négociation",    options:["announcement","presentation","complaint","negotiation"],           answer:"negotiation" },
    { type:"translate-en", french:"influencer",        options:["to ignore","to encourage","to prevent","to influence"],            answer:"to influence" },
    { type:"translate-en", french:"durable",           options:["modern","temporary","expensive","sustainable"],                    answer:"sustainable" },
    { type:"translate-en", french:"échouer",           options:["to succeed","to delay","to compete","to fail"],                    answer:"to fail" },
    { type:"translate-en", french:"l\'expertise",      options:["work experience","job title","expert knowledge","professional qualification"], answer:"expert knowledge" },
    { type:"translate-en", french:"l\'équilibre",      options:["atmosphere","imbalance","distribution","balance"],                 answer:"balance" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"___ il était malade, il est venu au travail quand même.",                    options:["Parce que","Afin que","Si","Bien que"],             answer:"Bien que" },
    { type:"fill", sentence:"Le résultat dépend ___, combien de temps nous investissons.",                options:["de ce que","jusqu\'à","sur","combien"],             answer:"de ce que" },
    { type:"fill", sentence:"Plus il apprenait, plus il devenait ___ confiant.",                          options:["tellement","donc","de","plus"],                    answer:"plus" },
    { type:"fill", sentence:"Le nouveau règlement ___ en vigueur à partir de janvier.",                   options:["entrerait","entrent","entre","entre"],             answer:"entre" },
    { type:"fill", sentence:"Le projet n\'aurait pas été réalisable ___ le financement adéquat.",         options:["sans","avec","par","pendant"],                     answer:"sans" },
    { type:"fill", sentence:"Il avait promis d\'être ponctuel, ___ il est arrivé en retard.",             options:["parce que","pour que","bien que","mais"],          answer:"mais" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Les mesures ont été adoptées malgré les critiques.",      options:["The measures were withdrawn due to criticism.","The measures were discussed but not approved.","The measures were delayed because of criticism.","The measures were pushed through despite criticism."],  answer:"The measures were pushed through despite criticism." },
    { type:"listen", audio:"Il n\'y a pas lieu de s\'inquiéter.",                    options:["There are reasons to be concerned.","The situation is unclear.","We are monitoring the situation.","There is no cause for concern."],                                                                    answer:"There is no cause for concern." },
    { type:"listen", audio:"La demande a été refusée.",                              options:["The application was approved.","The application is pending.","The application was withdrawn.","The application was rejected."],                                                                      answer:"The application was rejected." },
    { type:"listen", audio:"Nous devons trouver un compromis.",                      options:["We must stand firm.","We should postpone the decision.","We have reached an agreement.","We need to find a compromise."],                                                                          answer:"We need to find a compromise." },
    { type:"listen", audio:"La conférence a été reportée indéfiniment.",             options:["The conference was cancelled.","The conference was moved to a smaller venue.","The conference is taking place as planned.","The conference was postponed indefinitely."],                           answer:"The conference was postponed indefinitely." },
    { type:"listen", audio:"Il n\'a pas tenu sa promesse.",                          options:["He kept his promise.","He made a new promise.","He asked to be released from his promise.","He did not keep his promise."],                                                                         answer:"He did not keep his promise." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"The project was completed on time despite the difficulties.",  options:["Le projet n\'a pas été finalisé à cause des difficultés.","Le projet est à temps, mais il y a eu des problèmes.","Le projet n\'a pas pu être réalisé malgré tout.","Le projet a été finalisé à temps malgré les difficultés."], answer:"Le projet a été finalisé à temps malgré les difficultés." },
    { type:"translate", english:"I would appreciate your feedback.",                            options:["J\'ai besoin de vos critiques.","Pourriez-vous faire moins de commentaires?","Vos commentaires ne sont pas nécessaires.","J\'apprécierais beaucoup vos commentaires."],                                     answer:"J\'apprécierais beaucoup vos commentaires." },
    { type:"translate", english:"The results are not yet available.",                           options:["Les résultats sont décevants.","Les résultats n\'ont pas encore été discutés.","Les résultats sont déjà connus.","Les résultats ne sont pas encore disponibles."],                              answer:"Les résultats ne sont pas encore disponibles." },
    { type:"translate", english:"We need to reconsider our strategy.",                          options:["Nous n\'avons plus de stratégie.","Notre stratégie fonctionne bien.","Nous devrions rester fidèles à notre stratégie.","Nous devons reconsidérer notre stratégie."],                            answer:"Nous devons reconsidérer notre stratégie." },
    { type:"translate", english:"Could you elaborate on that point?",                          options:["Pourquoi dites-vous cela?","Pouvez-vous répéter?","Êtes-vous d\'accord?","Pourriez-vous préciser ce point?"],                                                                                answer:"Pourriez-vous préciser ce point?" },
    { type:"translate", english:"It is essential that we meet the deadline.",                   options:["La date limite n\'est pas très importante.","Ce serait bien de respecter la date limite.","Nous devrions repousser la date limite.","Il est absolument nécessaire que nous respections la date limite."],   answer:"Il est absolument nécessaire que nous respections la date limite." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Lors d\'une réunion, on vous demande d\'expliquer votre point de vue. Comment commencez-vous?",  options:["Je ne sais pas.","Ce n\'est pas mon rôle.","C\'est une question difficile.","Je voudrais brièvement expliquer pourquoi je pense que..."],  answer:"Je voudrais brièvement expliquer pourquoi je pense que..." },
    { type:"mcq", prompt:"Dans une discussion, vous ne suis pas d\'accord. Comment vous opposez-vous poliment?",             options:["C\'est complètement faux.","Vous ne comprenez pas.","Ça ne m\'intéresse pas.","Je vois les choses un peu différemment."],                                      answer:"Je vois les choses un peu différemment." },
    { type:"mcq", prompt:"Vous recevez un refus pour votre candidature. Quelle est une réaction appropriée?",               options:["Ne pas réagir.","Déposer une réclamation.","Envoyer immédiatement une nouvelle candidature.","Répondre poliment et demander un retour d\'information."],  answer:"Répondre poliment et demander un retour d\'information." },
    { type:"mcq", prompt:"Votre interlocuteur utilise un terme technique que vous ne connaissez pas. Que faites-vous?",     options:["Faire semblant de le connaître.","Arrêter la conversation.","Chercher le terme en ligne sans dire quoi que ce soit.","Pourriez-vous expliquer brièvement ce terme?"],  answer:"Pourriez-vous expliquer brièvement ce terme?" },
    { type:"mcq", prompt:"Vous devez rédiger un e-mail formel à un client. Quelle salutation est correcte?",                options:["Coucou,","Bonjour à tous,","Salut,","Madame, Monsieur,"],                                                                                                 answer:"Madame, Monsieur," },
    { type:"mcq", prompt:"Vous devez résumer un long rapport. Qu\'est-ce qui est le plus important?",                       options:["Répéter tous les détails.","Faire le rapport aussi long que possible.","Utiliser uniquement l\'introduction.","Résumer les points clés clairement et brièvement."],  answer:"Résumer les points clés clairement et brièvement." },
  ],

  "C1": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", french:"la conclusion",     options:["introduction","assumption","recommendation","conclusion"],        answer:"conclusion" },
    { type:"translate-en", french:"indispensable",     options:["unusual","controversial","unreliable","indispensable"],         answer:"indispensable" },
    { type:"translate-en", french:"l\'objection",      options:["proposal","evidence","agreement","objection"],                 answer:"objection" },
    { type:"translate-en", french:"proportionnel",     options:["disproportionate","absolute","excessive","proportionate"],     answer:"proportionate" },
    { type:"translate-en", french:"sembler évident",   options:["to illuminate","to confuse","to make sense","to complicate"], answer:"to make sense" },
    { type:"translate-en", french:"l\'atteinte",       options:["enhancement","continuation","influence","impairment"],        answer:"impairment" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"Il exigeait que le contrat ___ vérifié.",                       options:["vérifiant","vérifiaient","vérifient","soit vérifié"],    answer:"soit vérifié" },
    { type:"fill", sentence:"La loi a pris effet ___ des objections de l\'opposition.",      options:["donc","malgré","bien que","nonobstant"],              answer:"nonobstant" },
    { type:"fill", sentence:"___ on apprenne beaucoup, il y a toujours du nouveau à découvrir.", options:["Puisse","Bien que","Bien sûr","Quoique"],           answer:"Quoique" },
    { type:"fill", sentence:"Plus le problème est complexe, ___ plus de temps est nécessaire.", options:["tant","comme","dès que","d\'autant"],            answer:"d\'autant" },
    { type:"fill", sentence:"On s\'attend à ce que le nouveau modèle ___ présenté avant la fin de l\'année.", options:["présentant","présentent","présente","soit présenté"],  answer:"soit présenté" },
    { type:"fill", sentence:"Le témoin a décrit les événements ___ il les avait vécus.",     options:["si","parce que","alors que","comme"],                answer:"comme" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"On ne peut pas le généraliser ainsi.",                   options:["That can be easily generalised.","That is impossible to understand.","That cannot be generalised in that way.","That has been thoroughly researched."],                      answer:"That cannot be generalised in that way." },
    { type:"listen", audio:"Il n\'a pas voulu changer d\'avis.",                     options:["He changed his mind at the last moment.","He made a poor decision under pressure.","He was not dissuaded from his decision.","He regretted his decision afterwards."],       answer:"He was not dissuaded from his decision." },
    { type:"listen", audio:"Il serait prématuré de tirer des conclusions maintenant.",options:["It is necessary to draw conclusions immediately.","It would be premature to draw conclusions now.","The conclusions are already clear.","The conclusions are disappointing."],  answer:"It would be premature to draw conclusions now." },
    { type:"listen", audio:"Cela ne fait aucun doute.",                              options:["That is highly questionable.","That is beyond question.","That is open to debate.","That has not been answered yet."],                                                   answer:"That is beyond question." },
    { type:"listen", audio:"Il a très mal évalué la situation.",                     options:["He assessed the situation correctly.","He refused to comment on the situation.","He completely misjudged the situation.","He was completely unaware of the situation."],  answer:"He completely misjudged the situation." },
    { type:"listen", audio:"L\'argument est devenu intenable.",                      options:["The argument was widely accepted.","The argument became untenable.","The argument was easily defended.","The argument was universally praised."],                      answer:"The argument became untenable." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"The evidence suggests that further investigation is warranted.",            options:["Les preuves ne montrent rien de particulier.","Les preuves ne sont pas suffisantes.","Les preuves suggèrent qu\'une enquête supplémentaire est justifiée.","Nous n\'avons pas besoin de plus d\'enquêtes."],  answer:"Les preuves suggèrent qu\'une enquête supplémentaire est justifiée." },
    { type:"translate", english:"His argument lacks coherence and methodological rigor.",                    options:["Son argument est très clair.","Son argument manque de cohérence et de rigueur méthodologique.","Son argument n\'a pas besoin d\'amélioration.","Son argument est parfaitement structuré."],    answer:"Son argument manque de cohérence et de rigueur méthodologique." },
    { type:"translate", english:"This interpretation is subject to considerable debate.",                    options:["Cette interprétation est universellement acceptée.","Cette interprétation n\'est pas controversée.","Cette interprétation fait l\'objet d\'un débat considérable.","Cette interprétation est définitive."],    answer:"Cette interprétation fait l\'objet d\'un débat considérable." },
    { type:"translate", english:"The authors juxtapose conflicting viewpoints.",                              options:["Les auteurs présentent un seul point de vue.","Les auteurs évitent les points de vue conflictuels.","Les auteurs juxtaposent les points de vue conflictuels.","Les auteurs suppriment les points de vue conflictuels."],  answer:"Les auteurs juxtaposent les points de vue conflictuels." },
    { type:"translate", english:"To what extent is this claim substantiated by empirical data?",              options:["Cette affirmation est évidemment vraie.","Dans quelle mesure cette affirmation est-elle étayée par les données empiriques?","Cette affirmation n\'a pas besoin de preuves.","Les données réfutent complètement cette affirmation."],  answer:"Dans quelle mesure cette affirmation est-elle étayée par les données empiriques?" },
    { type:"translate", english:"The nuances of this phenomenon have been inadequately explored.",            options:["Ce phénomène a été entièrement étudié.","Les nuances de ce phénomène ont été insuffisamment explorées.","Ce phénomène est trop simple pour être étudié.","Les nuances de ce phénomène sont exagérées."],        answer:"Les nuances de ce phénomène ont été insuffisamment explorées." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Lors d\'une soutenance, le jury soulève une faille logique dans votre argument. Comment réagissez-vous?",  options:["Je maintiens mon opinion sans écouter.","Je suis complètement déstabilisé et muet.","Je reconnais le problème et propose une clarification.","Je dis que c\'est trop difficile à expliquer."],  answer:"Je reconnais le problème et propose une clarification." },
    { type:"mcq", prompt:"Vous devez évaluer une thèse sérieuse mais écrite dans un registre excessivement technique. Que faites-vous?",  options:["Je rejette tout sans lire.","Je reconnais la qualité mais note que l\'accessibilité doit être améliorée.","J\'accepte tout sans réserve.","Je dis que c\'est du charabia."],  answer:"Je reconnais la qualité mais note que l\'accessibilité doit être améliorée." },
    { type:"mcq", prompt:"Dans un débat académique, quelqu\'un utilise une source discréditée. Comment intervenez-vous?",             options:["Je fais semblant de ne pas remarquer.","Je l\'insulte publiquement.","Je soulève poliment la question de la validité de cette source.","Je quitte le débat."],                                    answer:"Je soulève poliment la question de la validité de cette source." },
    { type:"mcq", prompt:"On vous demande de rédiger une critique constructive d\'un article académique. Quel est votre approche?",   options:["Je loue chaque aspect sans discernement.","Je critique tout sans offrir de solutions.","Je reconnaître les forces et propose des améliorations spécifiques.","Je refuse de critiquer."],  answer:"Je reconnaître les forces et propose des améliorations spécifiques." },
    { type:"mcq", prompt:"Vous découvrez une erreur factuelle mineure dans une présentation prestigieuse. Comment procédez-vous?",  options:["Je crie l\'erreur publiquement et rudement.","Je l\'ignore complètement.","Je soulève discrètement la question après la présentation.","Je prétends que c\'est correct."],     answer:"Je soulève discrètement la question après la présentation." },
    { type:"mcq", prompt:"Votre thèse repose sur une prémisse contestée. Comment la présentez-vous?",                                 options:["Je cache la prémisse contestée.","Je reconnais clairement la controverse et la justifie.","Je prétends que personne ne conteste.","Je minimise l\'importance de la prémisse."],           answer:"Je reconnais clairement la controverse et la justifie." },
  ],

  "C2": [
    // ── Section 1: Vocabulary in Context ──────────────────────────────────────
    { type:"translate-en", french:"la prédilection",    options:["indifference","aversion","inclination","predilection"],            answer:"predilection" },
    { type:"translate-en", french:"circonvenir",        options:["to support","to circumvent","to prohibit","to facilitate"],       answer:"to circumvent" },
    { type:"translate-en", french:"l\'équivoque",       options:["clarity","certainty","ambiguity","precision"],                    answer:"ambiguity" },
    { type:"translate-en", french:"déférent",           options:["aggressive","disrespectful","deferential","indifferent"],         answer:"deferential" },
    { type:"translate-en", french:"l\'apothéose",       options:["decline","catastrophe","climax","beginning"],                     answer:"climax" },
    { type:"translate-en", french:"lucidité",           options:["confusion","clarity","deception","blindness"],                    answer:"clarity" },

    // ── Section 2: Grammar in Context ─────────────────────────────────────────
    { type:"fill", sentence:"___ elle fût reconnue tardivement, son influence sur la pensée contemporaine est indéniable.", options:["Bien que","Bien sûr","Plutôt que","Si"], answer:"Bien que" },
    { type:"fill", sentence:"Cet auteur cultive une certaine opacité intentionnelle, ___ il faut l\'interpréter avec une grande circonspection.", options:["ce qui","d\'où","ainsi","dont"], answer:"d\'où" },
    { type:"fill", sentence:"L\'évolution de sa pensée suit une trajectoire qui contredit ___ la logique conventionnelle ___ les attentes critiques.", options:["non seulement...mais aussi","plutôt...sinon","et...et","tant...que"],  answer:"non seulement...mais aussi" },
    { type:"fill", sentence:"Faisant abstraction de toute considération idéologique, on ne peut nier que ses arguments ___.", options:["soutiennent","soutiennent","soutient","soutienne"], answer:"soutiennent" },
    { type:"fill", sentence:"Ce paradoxe inhérent à l\'œuvre ___ d\'une profonde réflexion sur les limites du langage.", options:["découlèrent","découle","découlera","découlerait"], answer:"découle" },
    { type:"fill", sentence:"Il serait trop commode de réduire la portée de son travail à ___ que la simple polémique.",options:["plus","autant","moins","bien"], answer:"moins" },

    // ── Section 3: Listening ──────────────────────────────────────────────────
    { type:"listen", audio:"Son interprétation, bien que séduisante, demeure une extrapolation abusive.",     options:["His interpretation is universally recognized.","His interpretation, while attractive, remains an unwarranted extrapolation.","His interpretation is completely refuted.","His interpretation is definitively proven."],  answer:"His interpretation, while attractive, remains an unwarranted extrapolation." },
    { type:"listen", audio:"Il convient de distinguer entre la critique légitime et la mauvaise foi manifeste.",   options:["One must avoid all criticism.","One must accept all criticism without question.","One must distinguish between legitimate criticism and manifest bad faith.","Criticism is impossible to define."],           answer:"One must distinguish between legitimate criticism and manifest bad faith." },
    { type:"listen", audio:"Cette affirmation, loin d\'être établie, soulève plus de questions qu\'elle n\'en résout.", options:["This affirmation is well-established and conclusive.","This affirmation raises more questions than it resolves.","This affirmation is of no consequence.","This affirmation is obviously true."],    answer:"This affirmation raises more questions than it resolves." },
    { type:"listen", audio:"Son œuvre transcende les catégorisations faciles et exige une relecture continuée.",        options:["His work easily fits conventional categories.","His work defies easy categorization and demands continuous rereading.","His work is not worth studying.","His work confirms conventional wisdom."],      answer:"His work defies easy categorization and demands continuous rereading." },
    { type:"listen", audio:"L\'apparente simplicité du style masque une architecture textuelle de grande subtilité.",   options:["The complexity of style obscures simple content.","The apparent simplicity of style masks a textual architecture of great subtlety.","The style is genuinely simple.","The style and substance are equally simple."],  answer:"The apparent simplicity of style masks a textual architecture of great subtlety." },
    { type:"listen", audio:"Il ne s\'agit pas ici de simple virtuosité formelle, mais de philosophie incarnée.",          options:["This is merely formal virtuosity.","This is not merely formal virtuosity, but embodied philosophy.","This work lacks any philosophical content.","Philosophy is absent from this work."],  answer:"This is not merely formal virtuosity, but embodied philosophy." },

    // ── Section 4: Speaking → Translate ───────────────────────────────────────
    { type:"translate", english:"The dialectical nature of this antagonism precludes any facile synthesis.",                  options:["The antagonism is easily resolved by synthesis.","The dialectical nature of this antagonism precludes any facile synthesis.","Synthesis is the only solution.","No antagonism truly exists."],                answer:"The dialectical nature of this antagonism precludes any facile synthesis." },
    { type:"translate", english:"His oeuvre represents a deliberate and incisive interrogation of the very foundations of modernity.", options:["His work is a superficial treatment of modernity.","His work represents a deliberate and incisive interrogation of the very foundations of modernity.","His work avoids the question of modernity.","His work celebrates modernity uncritically."], answer:"His work represents a deliberate and incisive interrogation of the very foundations of modernity." },
    { type:"translate", english:"The seeming contradiction dissolves upon more rigorous scrutiny of the author\'s epistemological framework.", options:["The contradiction becomes more apparent upon examination.","The seeming contradiction dissolves upon more rigorous scrutiny of the author\'s epistemological framework.","There is no contradiction to examine.","The author explicitly acknowledges the contradiction."], answer:"The seeming contradiction dissolves upon more rigorous scrutiny of the author\'s epistemological framework." },
    { type:"translate", english:"While not without certain methodological limitations, this work fundamentally reconceptualises the problematic.", options:["This work has no limitations whatsoever.","While not without certain methodological limitations, this work fundamentally reconceptualises the problematic.","This work fails to address methodological concerns.","Methodology is irrelevant to this work."], answer:"While not without certain methodological limitations, this work fundamentally reconceptualises the problematic." },
    { type:"translate", english:"One must exercise considerable caution in extrapolating universal principles from these particular instances.", options:["Universal principles can be easily extrapolated from these cases.","One must exercise considerable caution in extrapolating universal principles from these particular instances.","Extrapolation is unnecessary here.","These instances are completely irrelevant."], answer:"One must exercise considerable caution in extrapolating universal principles from these particular instances." },
    { type:"translate", english:"This theoretical apparatus, while conceptually elegant, risks obscuring rather than illuminating the phenomenon in question.", options:["This apparatus perfectly illuminates the phenomenon.","This theoretical apparatus, while conceptually elegant, risks obscuring rather than illuminating the phenomenon in question.","The apparatus has no conceptual elegance.","The phenomenon is completely transparent."], answer:"This theoretical apparatus, while conceptually elegant, risks obscuring rather than illuminating the phenomenon in question." },

    // ── Section 5: Scenario Tasks ─────────────────────────────────────────────
    { type:"mcq", prompt:"Lors d\'une conférence académique majeure, vous identifiez une prémisse fondamentale contestée. Quelle est votre réaction?",  options:["Vous dérangez la présentation.","Vous attendez le débat et posez une question qui remet en question la prémisse.","Vous ignorez complètement.","Vous criez immédiatement objection."], answer:"Vous attendez le débat et posez une question qui remet en question la prémisse." },
    { type:"mcq", prompt:"Vous rédigez un article pour une revue prestigieuse qui contredit votre propre travail antérieur. Comment procédez-vous?",  options:["Vous cachez le contradiction.","Vous reconnaissez explicitement l\'évolution de votre pensée et expliquez les raisons.","Vous prétendez qu\'il n\'y a aucune contradiction.","Vous ne publiez pas du tout."],  answer:"Vous reconnaissez explicitement l\'évolution de votre pensée et expliquez les raisons." },
    { type:"mcq", prompt:"Un collègue propose une interprétation habile mais potentiellement spécieuse de votre travail. Comment réagissez-vous?",  options:["Vous le remerciez sans réfléchir.","Vous explorez la pertinence de son interprétation avec rigueur et honnêteté critique.","Vous rejetez d\'emblée tout examen.","Vous adoptez son interprétation sans vérification."], answer:"Vous explorez la pertinence de son interprétation avec rigueur et honnêteté critique." },
    { type:"mcq", prompt:"Dans une controverse disciplinaire, vous constatez que les deux camps comportent des failles logiques. Quelle position adoptez-vous?",  options:["Vous ignorez les failles.","Vous défendez aveuglement un camp.","Vous reconnaissez les failles des deux côtés et proposez une voie constructive.","Vous déclarez que l\'analyse logique n\'a aucune utilité."], answer:"Vous reconnaissez les failles des deux côtés et proposez une voie constructive." },
    { type:"mcq", prompt:"Un pair vous reproche une omission significative dans votre bibliographie. Comment procédez-vous?",  options:["Vous argumentez que c\'est sans importance.","Vous reconnaissez l\'omission, en expliquez les raisons si approprié, et envisagez une révision.","Vous rejetez catégoriquement la critique.","Vous accusez le critique d\'être injuste."],  answer:"Vous reconnaissez l\'omission, en expliquez les raisons si approprié, et envisagez une révision." },
    { type:"mcq", prompt:"On vous demande de participer à un débat où la bonne foi intellectuelle semble absente de la part de l\'opposition. Comment agissez-vous?",  options:["Vous adoptez les mêmes tactiques déloyales.","Vous maintenez votre intégrité intellectuelle tout en soulevant poliment ces problèmes de bonne foi.","Vous quittez sans rien dire.","Vous recourez à des insultes."], answer:"Vous maintenez votre intégrité intellectuelle tout en soulevant poliment ces problèmes de bonne foi." },
  ],
};
