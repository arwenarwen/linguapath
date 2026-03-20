/**
 * Pre-recorded tutor answers.
 * Used to avoid API calls for known grammar topics and common questions.
 * Structure:
 *   TOPIC_ANSWERS[langCode][topicLabel] = full explanation string
 *   COMMON_QA[langCode] = array of { keywords: [...], answer: string }
 */

// ─── TOPIC ANSWERS — Quick Grammar Topics ────────────────────────────────────

export const TOPIC_ANSWERS = {

  // ── SPANISH ──────────────────────────────────────────────────────────────
  es: {
    "Ser vs Estar": `**Ser vs Estar — Both mean "to be", but they're used differently.**

**SER** is for permanent or defining characteristics:
1. Identity & origin → Soy mexicano. (I'm Mexican.)
2. Profession → Ella es médica. (She's a doctor.)
3. Time & dates → Son las tres. (It's three o'clock.)
4. Relationships → Somos amigos. (We're friends.)
5. Material → La mesa es de madera. (The table is wooden.)

**ESTAR** is for temporary states or conditions:
1. Location → Estoy en casa. (I'm at home.)
2. Feelings/mood → Estás triste hoy. (You're sad today.)
3. Health → Está enfermo. (He's sick.)
4. Ongoing actions → Estamos comiendo. (We're eating.)
5. Results of change → La puerta está abierta. (The door is open.)

**⚠️ Common trap:** "Estar muerto" (to be dead) uses estar even though death is permanent — because it's the result of a change.

**🎯 Quick rule:** Think DOCTOR for ser (Description, Occupation, Characteristic, Time, Origin, Relation) and PLACE for estar (Position, Location, Action, Condition, Emotion).

**Practice:** Try saying where you are right now and how you're feeling today using estar! Then describe yourself using ser.`,

    "Por vs Para": `**Por vs Para — Both mean "for", but very different uses.**

**PARA** = purpose, destination, deadline, opinion
1. Purpose → Estudio para aprender. (I study in order to learn.)
2. Recipient → Este regalo es para ti. (This gift is for you.)
3. Deadline → Lo necesito para el lunes. (I need it by Monday.)
4. Destination → Salgo para Madrid. (I'm leaving for Madrid.)
5. Opinion → Para mí, es difícil. (In my opinion, it's difficult.)

**POR** = cause, exchange, duration, on behalf of, means
1. Cause/reason → Lo hice por amor. (I did it because of love.)
2. Exchange → Lo compré por diez euros. (I bought it for ten euros.)
3. Duration → Estudié por tres horas. (I studied for three hours.)
4. On behalf of → Lo hice por ti. (I did it for you / on your behalf.)
5. Means → Te llamo por teléfono. (I'll call you by phone.)

**🎯 Memory trick:** PARA points forward to a goal/destination. POR looks back at a cause/reason.

**Practice:** "I bought flowers for my mother because of her birthday" — try it in Spanish using both por and para!`,

    "Subjunctive Mood": `**The Spanish Subjunctive — used for doubt, emotion, wishes, and hypotheticals.**

**When to use it — the WEIRDO categories:**
- **W**ishes → Quiero que vengas. (I want you to come.)
- **E**motion → Me alegra que estés aquí. (I'm glad you're here.)
- **I**mpersonal expressions → Es importante que estudies. (It's important that you study.)
- **R**ecommendations/requests → Te recomiendo que lo hagas. (I recommend you do it.)
- **D**oubt/denial → No creo que sea verdad. (I don't believe it's true.)
- **O**jalá → Ojalá llueva. (Hopefully it'll rain.)

**How to form it (present subjunctive):**
- AR verbs: drop -o, add -e endings → hablar → hable, hables, hable...
- ER/IR verbs: drop -o, add -a endings → comer → coma, comas, coma...

**Key signal:** Two different subjects + "que" → subjunctive!
- Quiero ir. (same subject — no subjunctive)
- Quiero que tú vayas. (different subjects — subjunctive!)

**Examples in action:**
1. Espero que tengas un buen día. (I hope you have a good day.)
2. Es necesario que practiques cada día. (It's necessary that you practice every day.)
3. Busco a alguien que hable inglés. (I'm looking for someone who speaks English.)

**🎯 Practice:** Complete this sentence: "Quiero que mi amigo ___" (I want my friend to...)`,

    "Preterite vs Imperfect": `**Preterite vs Imperfect — two past tenses with very different jobs.**

**PRETERITE (Pretérito Indefinido)** — completed actions with a clear endpoint:
1. Specific events → Ayer comí pizza. (Yesterday I ate pizza.)
2. Sequence of events → Me levanté, desayuné y salí. (I got up, had breakfast, and left.)
3. Sudden changes → De repente, empezó a llover. (Suddenly it started to rain.)
4. Actions that interrupted → Llamó cuando dormía. (He called while I was sleeping.)

**IMPERFECT (Pretérito Imperfecto)** — ongoing, habitual, or background past:
1. Habitual past → Cuando era niño, jugaba fútbol. (When I was a child, I used to play football.)
2. Background description → Hacía frío y nevaba. (It was cold and snowing.)
3. Ongoing state → Tenía veinte años. (I was twenty years old.)
4. "Was doing" actions → Leía cuando llegaste. (I was reading when you arrived.)

**🎯 The movie analogy:** Imperfect = the scene-setting background (camera panning slowly). Preterite = the main plot events (action shots).

**Classic pair:**
- Conocí a María ayer. (I met María yesterday.) ← preterite: event
- Conocía a María de la universidad. (I knew María from university.) ← imperfect: ongoing state

**Practice:** Describe what you were doing (imperfect) when something happened (preterite) yesterday.`,

    "Gender Rules": `**Spanish Gender — every noun is masculine or feminine.**

**Masculine (el) — general patterns:**
- Words ending in -o → el libro, el perro, el vaso
- Days, months, languages → el lunes, el español
- Many words ending in -or → el color, el amor
- Words ending in -ma (Greek origin!) → el problema, el tema, el sistema

**Feminine (la) — general patterns:**
- Words ending in -a → la casa, la mesa, la silla
- Words ending in -ión → la canción, la nación, la información
- Words ending in -dad, -tad, -tud → la ciudad, la libertad, la virtud
- Words ending in -umbre → la costumbre, la cumbre

**⚠️ Important exceptions to memorize:**
- la mano (hand) — ends in -o but feminine!
- el día (day) — ends in -a but masculine!
- el mapa (map) — ends in -a but masculine!

**Articles change with gender:**
- Singular: el/un (masc) → la/una (fem)
- Plural: los/unos (masc) → las/unas (fem)

**Adjectives agree with the noun:**
- El libro rojo. La casa roja. (The red book. The red house.)

**🎯 Best strategy:** Always learn nouns with their article. Don't learn "libro" — learn "el libro".

**Practice:** Can you tell me the gender of: ciudad, problema, noche, tiempo, mano?`,

    "Reflexive Verbs": `**Spanish Reflexive Verbs — the action reflects back on the subject.**

**What makes a verb reflexive?** A reflexive pronoun (me, te, se, nos, os, se) where the doer and receiver are the same person.

**Reflexive pronouns:**
- yo → me / tú → te / él/ella → se / nosotros → nos / vosotros → os / ellos → se

**Common reflexive verbs — daily routine:**
1. levantarse → Me levanto a las siete. (I get up at seven.)
2. ducharse → ¿Te duchas por la mañana? (Do you shower in the morning?)
3. vestirse → Se viste rápido. (He gets dressed quickly.)
4. acostarse → Nos acostamos tarde. (We go to bed late.)
5. llamarse → Me llamo Ana. (My name is Ana. / I call myself Ana.)

**Non-reflexive vs reflexive — spot the difference:**
- Lavo el coche. (I wash the car.) ← action on something else
- Me lavo. (I wash myself.) ← action on myself

**Some verbs change meaning when reflexive:**
- ir (to go) → irse (to leave/go away)
- dormir (to sleep) → dormirse (to fall asleep)
- poner (to put) → ponerse (to put on / to become)

**🎯 Practice:** Describe your morning routine using at least 4 reflexive verbs!`,
  },

  // ── GERMAN ───────────────────────────────────────────────────────────────
  de: {
    "Der, Die, Das": `**Der, Die, Das — German has three grammatical genders: masculine, feminine, neuter.**

**MASCULINE (der):**
- Male people & animals → der Mann, der Hund, der Vater
- Days, months, seasons → der Montag, der Januar, der Sommer
- Most nouns ending in -er, -en, -el → der Lehrer, der Wagen, der Mantel
- Weather/direction words → der Wind, der Regen, der Norden

**FEMININE (die):**
- Female people & animals → die Frau, die Katze, die Mutter
- Most nouns ending in -ung, -heit, -keit, -schaft → die Zeitung, die Freiheit, die Möglichkeit
- Nouns ending in -ion, -ie, -ik → die Nation, die Familie, die Musik
- Most flowers & trees → die Rose, die Eiche

**NEUTER (das):**
- Young people & animals → das Kind, das Baby, das Lamm
- Infinitives used as nouns → das Essen (eating), das Schlafen (sleeping)
- Most nouns ending in -chen, -lein → das Mädchen, das Fräulein
- Most metals and chemical elements → das Gold, das Eisen
- Fractions → das Drittel, das Viertel

**⚠️ The bad news:** German gender often defies logic. Das Mädchen (girl) is neuter! Die Sonne (sun) is feminine but der Mond (moon) is masculine.

**🎯 Best strategy:** ALWAYS learn the article with the noun. Never learn "Tisch" — always learn "der Tisch".

**Practice:** What's the article for: Buch, Schule, Kind, Auto, Mann?`,

    "Akkusativ vs Dativ": `**Akkusativ vs Dativ — two of the four German cases.**

**THE KEY QUESTION:**
- Akkusativ → answers "Wen? / Was?" (Whom? / What?) — the direct object
- Dativ → answers "Wem?" (To whom? / For whom?) — the indirect object

**How articles change:**

| Case | Masc | Fem | Neut | Plural |
|------|------|-----|------|--------|
| Nominativ (subject) | der | die | das | die |
| Akkusativ (direct obj) | **den** | die | das | die |
| Dativ (indirect obj) | **dem** | **der** | **dem** | **den+n** |

**Prepositions that always take Akkusativ:**
durch, für, gegen, ohne, um, bis, entlang
→ Ich kaufe ein Geschenk **für den** Mann. (für + Akkusativ → den)

**Prepositions that always take Dativ:**
aus, bei, mit, nach, seit, von, zu, gegenüber, außer
→ Ich fahre **mit dem** Bus. (mit + Dativ → dem)

**Two-way prepositions (an, auf, hinter, in, neben, über, unter, vor, zwischen):**
- Movement/direction → Akkusativ: Ich gehe **in den** Park.
- Location/position → Dativ: Ich bin **im (in dem)** Park.

**🎯 Quick test:** In "Ich gebe der Frau das Buch" — "der Frau" is Dativ (to whom?), "das Buch" is Akkusativ (what?).

**Practice:** "I buy (kaufen) a book for my mother" — which case does "mother" need? Why?`,

    "Word Order": `**German Word Order — the verb has strict rules.**

**Rule 1: Verb is ALWAYS in position 2 in a main clause.**
- Normal: Ich **lerne** Deutsch. (Subject - Verb - Rest)
- With time first: Heute **lerne** ich Deutsch. (Time - Verb - Subject - Rest)
- ✅ The verb stays in position 2 no matter what comes first!

**Rule 2: Conjugated verb goes to the END in subordinate clauses.**
Trigger words (weil, dass, ob, wenn, weil, obwohl...):
- Main: Ich lerne Deutsch.
- Sub: ...weil ich Deutsch **lerne**. (...because I learn German.)
- Main: Er kommt nicht.
- Sub: ...obwohl er Zeit **hat**. (...although he has time.)

**Rule 3: Separable verbs — prefix goes to the end.**
- aufmachen → Ich **mache** die Tür **auf**. (I open the door.)
- anrufen → Er **ruft** mich **an**. (He calls me.)
- In subordinate clauses they rejoin: ...weil er mich **anruft**.

**Rule 4: Time - Manner - Place order (TMP).**
- ✅ Ich fahre **morgen** (time) **mit dem Auto** (manner) **nach Berlin** (place).
- ❌ Ich fahre nach Berlin mit dem Auto morgen.

**Rule 5: Modal verbs — main verb goes to end as infinitive.**
- Ich **muss** jetzt **gehen**. (I must go now.)
- Er **kann** gut **singen**. (He can sing well.)

**🎯 Practice:** Rewrite this with "weil": "Er kommt nicht. Er ist krank."`,

    "Verb Tenses": `**German Verb Tenses — the main ones you actually need.**

**1. PRÄSENS (Present)** — current actions and near future
- Regular: ich lern**e**, du lern**st**, er lern**t**
- Use for: what's happening now, and often for future too!
- Morgen fahre ich nach Berlin. (Tomorrow I'm going to Berlin.) ← present for future

**2. PERFEKT (Present Perfect)** — conversational past (most important for speaking!)
Formed with: haben/sein + past participle (Partizip II)
- haben → most verbs: Ich **habe** Deutsch **gelernt**. (I learned German.)
- sein → movement/change of state: Ich **bin** nach Hause **gegangen**. (I went home.)
- Regular Partizip II: ge- + stem + -t → gemacht, gelernt, gespielt
- Irregular Partizip II: must memorize → gegessen, gesehen, geschrieben

**3. PRÄTERITUM (Simple Past)** — written/narrative past (books, formal writing, haben/sein/modals)
- In speech: always prefer Perfekt (except: war, hatte, konnte, wollte...)
- Ich **war** gestern müde. (I was tired yesterday.) ← war is more natural than bin gewesen

**4. FUTUR I** — future (often replaced by Präsens + time word)
- werden + infinitive: Ich **werde** es **machen**. (I will do it.)
- But: Morgen mache ich es. (Tomorrow I'll do it.) ← more natural!

**🎯 Key takeaway:** For speaking, master Präsens + Perfekt first. Präteritum is mainly for reading.

**Practice:** How do you say "I have eaten pizza" and "She has gone to school" in German?`,

    "Separable Verbs": `**German Separable Verbs — the verb that splits in two.**

**What are they?** Verbs with a prefix that detaches and moves to the END of the clause.

**Common separable prefixes:** ab-, an-, auf-, aus-, ein-, mit-, nach-, vor-, zu-, zurück-

**Main clause — prefix goes to end:**
- aufmachen (to open) → Ich **mache** die Tür **auf**. (I open the door.)
- anrufen (to call) → Er **ruft** mich **an**. (He calls me.)
- einladen (to invite) → Wir **laden** euch **ein**. (We invite you.)
- ausgehen (to go out) → Sie **geht** heute Abend **aus**. (She goes out tonight.)
- zurückkommen (to come back) → Er **kommt** morgen **zurück**. (He comes back tomorrow.)

**Subordinate clause — they REUNITE at the end:**
- ...weil ich die Tür **aufmache**. (...because I open the door.)
- ...dass er mich **anruft**. (...that he calls me.)

**With modal verbs — prefix stays attached at end:**
- Ich muss die Tür **aufmachen**. (I must open the door.)
- Er will mich **anrufen**. (He wants to call me.)

**Infinitive form:** Always written as one word → aufmachen, anrufen, einladen

**⚠️ Not all prefixes are separable!**
- be-, ge-, er-, ver-, zer-, ent-, emp-, miss- → NEVER separate
- verstehen → Ich **verstehe** das. (never: *Ich stehe das ver.*)

**🎯 Practice:** Conjugate "anrufen" for: ich, du, er/sie, wir in present tense.`,

    "Adjective Endings": `**German Adjective Endings — they change depending on gender, case, and article type.**

**THREE patterns depending on what comes before the adjective:**

**1. After definite articles (der/die/das) — WEAK endings:**
Nominative: der alt**e** Mann | die alt**e** Frau | das alt**e** Kind
Accusative: den alt**en** Mann | die alt**e** Frau | das alt**e** Kind
Dative: dem alt**en** Mann | der alt**en** Frau | dem alt**en** Kind

→ After der/die/das, most endings are **-e** or **-en**. Easy!

**2. After indefinite articles (ein/eine/ein) — MIXED endings:**
Nominative: ein alt**er** Mann | eine alt**e** Frau | ein alt**es** Kind
Accusative: einen alt**en** Mann | eine alt**e** Frau | ein alt**es** Kind
Dative: einem alt**en** Mann | einer alt**en** Frau | einem alt**en** Kind

→ The adjective "borrows" the strong ending when ein has no ending itself.

**3. No article — STRONG endings:**
The adjective carries the full gender signal:
Nominative: alt**er** Mann | alt**e** Frau | alt**es** Kind | alt**e** Kinder
→ These mirror the der/die/das/die endings (minus the d-).

**🎯 Quick shortcut:** 
- After **der/die/das** → mostly **-en** (safe default)
- After **ein** → **-er/-e/-es** in nominative singular
- No article → adjective ends like the article would

**Practice:** "A red car" — how do you say it? (rot + Auto + ein). What case, gender, article type?`,
  },

  // ── FRENCH ───────────────────────────────────────────────────────────────
  fr: {
    "Le, La, Les": `**French Articles — le, la, les and when to use them.**

**DEFINITE ARTICLES (the):**
- Masculine singular: **le** → le livre (the book), le garçon (the boy)
- Feminine singular: **la** → la maison (the house), la fille (the girl)
- Before vowel/h: **l'** → l'ami (the friend), l'heure (the hour)
- Plural (all genders): **les** → les livres, les maisons (the books, the houses)

**INDEFINITE ARTICLES (a/an/some):**
- Masculine singular: **un** → un livre (a book)
- Feminine singular: **une** → une maison (a house)
- Plural: **des** → des livres (some books)

**PARTITIVE ARTICLES (some — with uncountable nouns):**
- Masculine: **du** (de + le) → du café (some coffee), du pain (some bread)
- Feminine: **de la** → de la musique (some music), de la soupe (some soup)
- Before vowel: **de l'** → de l'eau (some water)
- Plural: **des** → des légumes (some vegetables)

**After negation → always just "de":**
- J'ai **du** café. → Je n'ai pas **de** café. (I have coffee. → I don't have any coffee.)

**Key French difference from English:** French uses definite articles for general statements!
- J'aime **le** chocolat. (I like chocolate.) ← NOT "j'aime chocolat"
- **La** vie est belle. (Life is beautiful.) ← general statement → use le/la

**🎯 Practice:** Say "I love music" and "I don't have a car" in French — which articles do you need?`,

    "Passé Composé": `**Passé Composé — the main conversational past tense in French.**

**Structure:** Subject + auxiliary (avoir/être) + past participle

**WITH AVOIR (most verbs):**
- parler → J'**ai parlé**. (I spoke / I have spoken.)
- manger → Il **a mangé**. (He ate.)
- finir → Nous **avons fini**. (We finished.)
- prendre → Tu **as pris**. (You took.) ← irregular participle!

**WITH ÊTRE — the "DR MRS VANDERTRAMP" verbs (movement/state change) + all reflexives:**
Devenir, Revenir | Mourir, Retourner | Sortir | Venir, Aller | Naître | Descendre, Entrer, Rentrer | Tomber, Rester, Arriver, Monter, Partir

When using être, the participle AGREES with the subject:
- Il est allé. / Elle est allée. / Ils sont allés. / Elles sont allées.
- Elle **s'est levée** à 7h. (She got up at 7. — reflexive → être)

**FORMING PAST PARTICIPLES:**
- -er verbs → -é: parler → parlé, aimer → aimé
- -ir verbs → -i: finir → fini, choisir → choisi
- -re verbs → -u: vendre → vendu, attendre → attendu
- Irregular: être → été | avoir → eu | faire → fait | prendre → pris | voir → vu

**🎯 Practice:** How do you say "She went to the cinema yesterday" and "We spoke with the teacher"?`,

    "Subjunctive": `**French Subjunctive — for doubt, emotion, necessity, and wishing.**

**When to use it — key triggers:**
1. Wishing/wanting → Je veux que tu **viennes**. (I want you to come.)
2. Doubt/negation → Je ne pense pas qu'il **soit** là. (I don't think he's there.)
3. Emotion → Je suis content que tu **sois** ici. (I'm glad you're here.)
4. Necessity → Il faut que tu **partes**. (You must leave.)
5. "Bien que/quoique" (although) → Bien qu'il **soit** fatigué... (Although he's tired...)
6. "Pour que" (so that) → Je parle lentement pour que tu **comprennes**. (I speak slowly so you understand.)

**How to form it:**
Take the ils/elles present tense form → drop -ent → add: -e, -es, -e, -ions, -iez, -ent

parler: ils parlent → parl- → que je **parle**, tu **parles**, il **parle**, nous **parlions**...
finir: ils finissent → finiss- → que je **finisse**, tu **finisses**...

**Key irregulars (must memorize):**
- être → que je **sois**, tu **sois**, il **soit**, nous **soyons**
- avoir → que j'**aie**, tu **aies**, il **ait**, nous **ayons**
- aller → que j'**aille**, nous **allions**
- faire → que je **fasse**, nous **fassions**

**🎯 Same-subject rule:** Two subjects = subjunctive / Same subject = infinitive
- Je veux **partir**. (I want to leave. — same subject)
- Je veux que tu **partes**. (I want you to leave. — different subjects)

**Practice:** "It's important that you (tu) study every day" — try it in French!`,

    "Gender Agreement": `**French Gender & Agreement — adjectives must match their nouns.**

**MASCULINE vs FEMININE nouns:**
Most feminine nouns end in -e: la maison, la femme, la voiture
Most masculine nouns DON'T end in -e: le livre, le garçon, le chat
But there are exceptions: le problème (masc!), la main (fem ends in nothing!)

**ADJECTIVE AGREEMENT rules:**
Adding -e for feminine (if no -e already):
- grand → grande: un grand homme / une grande femme
- petit → petite: un petit chat / une petite maison
- If already ends in -e, no change: un livre rouge / une maison rouge

Adding -s for plural (masculine), -es for plural (feminine):
- des grands hommes / de grandes femmes

**IRREGULAR feminine forms (must memorize):**
- beau/bel → belle (beautiful)
- nouveau/nouvel → nouvelle (new)
- vieux/vieil → vieille (old)
- bon → bonne | gentil → gentille | blanc → blanche

**ADJECTIVE POSITION — most go AFTER the noun:**
- une voiture rouge (a red car) ← color goes after
- un problème difficile (a difficult problem) ← most adjectives after

**BAGS adjectives go BEFORE:** Beauty, Age, Goodness, Size
- un **beau** jardin | un **vieux** monsieur | un **bon** repas | un **grand** immeuble

**🎯 Practice:** Make these agree: "un appartement (propre / beau / grand)" — what changes when it's feminine?`,

    "Verb Groups": `**French Verb Groups — three conjugation patterns.**

**GROUP 1: -ER verbs** (largest group — most regular!)
Model: parler (to speak)
je parle | tu parles | il/elle parle | nous parlons | vous parlez | ils/elles parlent

Most common -er verbs: aimer, manger, travailler, habiter, jouer, écouter, regarder, parler, chanter, commencer, acheter, appeler

**Spelling changes in some -er verbs:**
- manger → nous mangeons (add e before -ons)
- commencer → nous commençons (cedilla before -ons)
- appeler → j'appelle (double l before silent endings)

**GROUP 2: -IR verbs** (regular pattern with -iss- in plural)
Model: finir (to finish)
je finis | tu finis | il finit | nous finissons | vous finissez | ils finissent

Common regular -ir verbs: finir, choisir, réussir, remplir, grandir, obéir

**GROUP 3: -RE verbs + irregular verbs** (must memorize)
Model: vendre (to sell) → je vends | tu vends | il vend | nous vendons...
Key irregulars: être, avoir, aller, faire, pouvoir, vouloir, savoir, venir, prendre

**🎯 The most important rule:** Learn group 3 irregular verbs by heart — they're the most used!
Top priority: être (to be), avoir (to have), aller (to go), faire (to do/make)

**Practice:** Conjugate "choisir" (to choose) for all persons, then "faire" — notice the difference!`,

    "Imparfait vs Passé": `**Imparfait vs Passé Composé — two past tenses with different jobs.**

**PASSÉ COMPOSÉ** = completed, specific past actions:
1. Specific event: Hier, j'**ai mangé** une pizza. (Yesterday I ate a pizza.)
2. Sequence: Je **suis entré**, **j'ai vu** Marie, et **je lui ai parlé**. (I entered, saw Marie, and spoke to her.)
3. Sudden event interrupting: Le téléphone **a sonné** pendant que je dormais. (The phone rang while I was sleeping.)

**IMPARFAIT** = background, ongoing, habitual past:
1. Description/setting: Il **faisait** beau et les oiseaux **chantaient**. (The weather was nice and birds were singing.)
2. Habit: Quand j'**étais** enfant, je **jouais** au foot. (When I was a child, I used to play football.)
3. Ongoing action interrupted: Je **dormais** quand le téléphone a sonné. (I was sleeping when the phone rang.)
4. States of mind/feeling: Elle **était** triste. Je **voulais** partir. (She was sad. I wanted to leave.)

**FORMING IMPARFAIT:**
Take nous present form → drop -ons → add: -ais, -ais, -ait, -ions, -iez, -aient
parler → nous parlons → parl- → je parlais, tu parlais, il parlait...
Only être is irregular: j'**étais**, tu **étais**, il **était**...

**🎯 The movie analogy:** Imparfait paints the backdrop. Passé composé tells what happened.

**Practice:** "I was reading (imparfait) when my friend called (passé composé)" — try it in French!`,
  },

  // ── JAPANESE ─────────────────────────────────────────────────────────────
  ja: {
    "は vs が": `**は (wa) vs が (ga) — one of Japanese's trickiest distinctions.**

**は (wa) = TOPIC marker** — marks what the sentence is ABOUT
**が (ga) = SUBJECT marker** — marks who/what DOES the action or IS the state

**Basic rule:** は sets the topic (often "as for..."), が identifies or emphasizes the subject.

**Examples showing the difference:**
1. 私**は**学生です。(Watashi **wa** gakusei desu.) = As for me, I'm a student. ← topic
2. 誰**が**学生ですか？(Dare **ga** gakusei desu ka?) = Who IS the student? ← identifying

**は for known/established information:**
- 田中さん**は**医者です。(Tanaka-san **wa** isha desu.) = (As for) Tanaka, he's a doctor.

**が for new information or emphasis:**
- 田中さん**が**医者です。(Tanaka-san **ga** isha desu.) = It's TANAKA who's the doctor.

**Always が after question words:**
- 誰**が** / 何**が** / どれ**が** — who/what/which (as subject)

**Always が with ability/liking/wanting/visible:**
- 日本語**が**わかります。(I understand Japanese.)
- 寿司**が**好きです。(I like sushi.)
- 猫**が**見えます。(I can see a cat.)

**は for contrast:**
- 私**は**行きます。(I WILL go — implying others won't)

**🎯 Quick test:** "What do you like?" answer: "I like cats" — which particle for cats and why?`,

    "て-form verbs": `**Japanese て-form (te-form) — the connector verb form.**

**What is it?** A verb form that connects actions, makes requests, and forms progressive tenses.

**HOW TO FORM IT:**

**Group 1 (-u verbs) — change ending:**
- く → いて: 書く (kaku) → 書いて (kaite)
- ぐ → いで: 泳ぐ (oyogu) → 泳いで (oyoide)
- す → して: 話す (hanasu) → 話して (hanashite)
- ぬ/ぶ/む → んで: 飲む (nomu) → 飲んで (nonde)
- る/つ/う → って: 買う (kau) → 買って (katte) | 持つ (motsu) → 持って (motte)
- Special: 行く (iku) → 行って (itte) ← exception!

**Group 2 (-ru verbs) — just replace る with て:**
- 食べる (taberu) → 食べて (tabete)
- 見る (miru) → 見て (mite)
- 起きる (okiru) → 起きて (okite)

**Irregular:**
- する → して | くる → きて

**KEY USES of て-form:**

1. **Connecting actions** (and then...): 起きて、朝ごはんを食べて、学校に行きます。(I wake up, eat breakfast, and go to school.)

2. **Making requests** (～てください): もう一度言ってください。(Please say it again.)

3. **Progressive tense** (～ている): 今、食べています。(I'm eating now.)

4. **Permission** (～てもいい): 行ってもいいですか？(May I go?)

5. **Prohibition** (～てはいけない): ここで食べてはいけません。(You must not eat here.)

**🎯 Practice:** Convert these to て-form: 飲む、見る、来る (nomu, miru, kuru)`,
  },

  // ── KOREAN ───────────────────────────────────────────────────────────────
  ko: {
    "이/가 vs 은/는": `**이/가 vs 은/는 — subject vs topic markers in Korean.**

**은/는 (eun/neun) = TOPIC marker:**
- 은 after consonant: 책**은** (as for the book...)
- 는 after vowel: 나**는** (as for me...)

**이/가 (i/ga) = SUBJECT marker:**
- 이 after consonant: 고양이**가** (the cat [does]...)
- 가 after vowel: 나**가** (I [am/do]...)

**The key difference:**
- **은/는** → known info, contrast, topic setting ("as for X...")
- **이/가** → new info, emphasis, identifying ("it's X that...")

**Contrast examples:**
- 저**는** 한국 사람이에요. (As for me, I'm Korean.) ← topic, establishing
- 제**가** 할게요! (I'll do it!) ← emphasis, "I'm the one"

**이/가 for first mentions and ability/feelings:**
- 고양이**가** 귀여워요. (The cat is cute.) ← first mention
- 한국어**가** 재미있어요. (Korean is fun.) ← feeling/state

**은/는 for contrast:**
- 저**는** 커피는 안 마셔요. (As for me, I don't drink coffee.) ← but I drink other things

**이/가 after question words:**
- 누**가** 왔어요? (Who came?) ← always 이/가 with 누구→누

**🎯 Practice:** How do you say "I like Korean food" emphasizing "I" specifically? And how do you say "As for me, I like Korean food" as a topic statement?`,
  },

  // ── PORTUGUESE ────────────────────────────────────────────────────────────
  pt: {
    "Ser vs Estar": `**Ser vs Estar — both mean "to be" in Portuguese, but different uses.**

**SER** = permanent, essential, defining characteristics:
1. Origin/nationality → Sou brasileiro. (I'm Brazilian.)
2. Profession → Ela é médica. (She's a doctor.)
3. Physical/permanent traits → Ele é alto. (He's tall.)
4. Time/dates → São três horas. (It's three o'clock.)
5. Material → A mesa é de madeira. (The table is made of wood.)
6. Relationships → Somos amigos. (We're friends.)
7. Passive voice → O livro foi escrito por ele. (The book was written by him.)

**ESTAR** = temporary states, conditions, location:
1. Location → Estou em casa. (I'm at home.)
2. Temporary feelings → Estou cansado hoje. (I'm tired today.)
3. Health → Ela está doente. (She's sick.)
4. Progressive → Estamos comendo. (We're eating.)
5. Temporary states → A janela está aberta. (The window is open.)

**European vs Brazilian Portuguese note:**
Both use ser/estar the same way, but colloquial Brazilian sometimes uses estar for more situations.

**Classic pair:**
- Ele é nervoso. (He's a nervous person by nature.) ← ser
- Ele está nervoso. (He's nervous right now.) ← estar

**🎯 Practice:** "The coffee is hot" and "Maria is Portuguese" — which verb and why?`,
  },
};

// ─── COMMON QA — Pre-recorded answers for frequently asked questions ──────────

export const COMMON_QA = {

  es: [
    // Numbers / counting
    { keywords: ["count", "numbers", "1 to 10", "one two three", "contar", "números"],
      answer: `**Counting in Spanish 1-20:**
1-10: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez
11-20: once, doce, trece, catorce, quince, dieciséis, diecisiete, dieciocho, diecinueve, veinte
21+: veintiuno, veintidós... treinta (30), cuarenta (40), cincuenta (50), sesenta (60), setenta (70), ochenta (80), noventa (90), cien (100)

**⚠️ Important:** uno becomes **un** before masculine nouns: un libro, veintiún años
And **una** before feminine: una casa, veintiuna personas

**Practice:** How do you say 35, 47, 82?` },

    // Greetings
    { keywords: ["greet", "hello", "goodbye", "hi", "hola", "adiós", "saludar", "saludo"],
      answer: `**Spanish Greetings & Farewells:**

**Hellos:**
- Hola → Hello (any time, informal)
- Buenos días → Good morning (until ~noon)
- Buenas tardes → Good afternoon (noon-~8pm)
- Buenas noches → Good evening/night

**Goodbyes:**
- Adiós → Goodbye (final)
- Hasta luego → See you later
- Hasta mañana → See you tomorrow
- Hasta pronto → See you soon
- Nos vemos → See you (casual)
- Chao/Chau → Bye (Latin America, casual)

**How are you:**
- ¿Cómo estás? (informal) / ¿Cómo está usted? (formal)
- ¿Qué tal? → How's it going?
- ¿Cómo te va? → How's it going for you?

**Replies:**
- Muy bien, gracias → Very well, thanks
- Bien, ¿y tú? → Fine, and you?
- Más o menos → So-so
- Regular → So-so (Latin America)

**🎯 Practice:** Say hello, ask how someone is, and say goodbye in Spanish!` },

    // Time
    { keywords: ["time", "clock", "hora", "qué hora", "tell time", "o'clock"],
      answer: `**Telling Time in Spanish:**

**Basic structure:** Son las + number (except 1 o'clock: Es la una)
- 1:00 → Es la una
- 2:00 → Son las dos
- 3:30 → Son las tres y media
- 4:15 → Son las cuatro y cuarto
- 4:45 → Son las cinco menos cuarto
- 5:20 → Son las cinco y veinte
- 12:00 → Son las doce / Es mediodía (noon) / Es medianoche (midnight)

**Asking the time:**
- ¿Qué hora es? → What time is it?
- ¿A qué hora...? → At what time...?

**AM/PM:**
- de la mañana (morning), de la tarde (afternoon), de la noche (night)
- Son las 3 de la tarde → It's 3pm

**🎯 Practice:** How do you say 7:30am, 9:45pm, and "At what time does the museum open?"` },

    // Please/Thank you
    { keywords: ["please", "thank", "polite", "courtesy", "por favor", "gracias", "de nada"],
      answer: `**Essential Polite Phrases in Spanish:**

- Por favor → Please
- Gracias → Thank you
- Muchas gracias → Thank you very much
- De nada → You're welcome
- No hay de qué → Don't mention it (more formal)
- Con mucho gusto → With pleasure (Colombia)

- Perdón / Perdone → Sorry / Excuse me
- Disculpe → Excuse me (getting attention)
- Lo siento → I'm sorry (apology)

- ¿Puede repetir? → Can you repeat?
- ¿Habla más despacio? → Can you speak more slowly?
- No entiendo → I don't understand
- No hablo bien español → I don't speak Spanish well

**🎯 These phrases will save you everywhere. Practice saying: "Excuse me, can you speak more slowly please?"` },

    // Direct/indirect object pronouns
    { keywords: ["object pronoun", "me te le lo la", "direct indirect", "pronoun", "pronombre"],
      answer: `**Spanish Object Pronouns:**

**Direct Object (lo/la/los/las) — replaces the thing being acted on:**
- Tengo el libro → Lo tengo. (I have it.)
- Veo a María → La veo. (I see her.)
- Compro los zapatos → Los compro. (I buy them.)

**Indirect Object (me/te/le/nos/os/les) — to whom / for whom:**
- Le doy el libro a Juan. → Le doy el libro. (I give him the book.)
- Me habla. (He speaks to me.)
- Les escribo una carta. (I write them a letter.)

**Order when using both:** Indirect BEFORE Direct: me lo, te lo, se lo...
- Me lo da. (He gives it to me.)
- ⚠️ le/les + lo/la = se lo/la: Le lo doy → Se lo doy.

**Position:** Before conjugated verb, or attached to infinitive/gerund:
- Lo quiero comprar. OR Quiero comprarlo.

**🎯 Practice:** Replace the object: "Yo compro la pizza para mi madre" using pronouns.` },

    // Conditional
    { keywords: ["would", "conditional", "condicional", "would like", "quisiera", "podría"],
      answer: `**Spanish Conditional Tense — "would"**

**Formed by:** infinitive + -ía, -ías, -ía, -íamos, -íais, -ían

hablar → hablaría, hablarías, hablaría, hablaríamos, hablaríais, hablarían
comer → comería | vivir → viviría

**Irregular stems (same as future irregulars):**
- tener → tendría | hacer → haría | poder → podría
- querer → querría | saber → sabría | venir → vendría
- decir → diría | poner → pondría | salir → saldría

**Uses:**
1. Polite requests → ¿Podría ayudarme? (Could you help me?)
2. Hypotheticals → Si tuviera dinero, viajaría. (If I had money, I would travel.)
3. Future-in-past → Dijo que vendría. (He said he would come.)
4. Advice → Yo en tu lugar, estudiaría más. (If I were you, I'd study more.)
5. Polite "I'd like" → Querría un café. / Me gustaría ir. (I'd like a coffee / to go.)

**🎯 Practice:** How do you politely say "I would like a table for two" in a restaurant?` },

    // Commands / imperative
    { keywords: ["command", "imperative", "order", "imperativo", "tú commands", "tell someone to"],
      answer: `**Spanish Imperative (Commands):**

**Informal tú commands:**
- Regular: 3rd person singular present → habla, come, escribe
- Come! → ¡Come! | Speak! → ¡Habla! | Write! → ¡Escribe!
- Irregular tú commands (must memorize): ven (come), di (say), haz (do/make), ve (go), pon (put), sal (leave), sé (be), ten (have)

**Negative tú commands:** Use present subjunctive:
- ¡No hables! (Don't speak!) | ¡No comas! (Don't eat!)

**Formal usted commands:** Use present subjunctive:
- ¡Hable! (Speak!) | ¡Coma! (Eat!) | ¡Escriba! (Write!)

**Object pronouns attach to affirmative commands:**
- ¡Dímelo! (Tell it to me!) | ¡Cómpralo! (Buy it!)
- But separate in negative: ¡No me lo digas! (Don't tell it to me!)

**Useful common commands:**
- ¡Escucha! Listen! | ¡Mira! Look! | ¡Espera! Wait! | ¡Para! Stop!
- ¡Ayúdame! Help me! | ¡Repite! Repeat! | ¡Habla más despacio! Speak more slowly!

**🎯 Practice:** How do you tell a friend (tú) to "look at this" and tell a stranger (usted) to "wait"?` },

    // Ir + infinitive future
    { keywords: ["going to", "near future", "ir a", "voy a", "future plans"],
      answer: `**"Going to" Future in Spanish — ir a + infinitive**

**Structure:** conjugated ir + a + infinitive

**Conjugation of ir:** voy, vas, va, vamos, vais, van

**Examples:**
- Voy a estudiar esta noche. (I'm going to study tonight.)
- ¿Vas a comer? (Are you going to eat?)
- Ella va a llamar mañana. (She's going to call tomorrow.)
- Vamos a hablar con el profesor. (We're going to talk to the teacher.)
- Van a viajar a España. (They're going to travel to Spain.)

**This is MORE common than the formal future tense in everyday speech!**

**vs. Simple future (hablaré, comerás...):**
- Ir a = immediate/planned future (I'm going to...)
- Simple future = more distant/uncertain (I will...)
- In conversation, ir a is used most of the time.

**Negative:** No + conjugated ir + a + infinitive
- No voy a ir. (I'm not going to go.)
- No van a llegar tarde. (They're not going to arrive late.)

**🎯 Practice:** Tell me 3 things you're going to do this weekend using "ir a"!` },

    // Question words
    { keywords: ["question word", "interrogative", "who what where when why how", "quién qué dónde cuándo por qué cómo"],
      answer: `**Spanish Question Words:**

- ¿Quién? / ¿Quiénes? → Who? / Who (plural)?
- ¿Qué? → What?
- ¿Dónde? → Where? | ¿Adónde? → Where to? | ¿De dónde? → Where from?
- ¿Cuándo? → When?
- ¿Por qué? → Why? (answer with: porque = because)
- ¿Cómo? → How?
- ¿Cuánto/a? / ¿Cuántos/as? → How much? / How many?
- ¿Cuál? / ¿Cuáles? → Which? / Which ones?

**⚠️ Qué vs Cuál:**
- ¿Qué es esto? (What is this? — defining)
- ¿Cuál es tu nombre? (What/Which is your name? — selecting from options)
- ¿Cuál prefieres? (Which do you prefer?)

**All question words have accent marks — always!**
Note: "que" without accent = "that" (conjunction), "qué" with accent = "what?" (question)

**Sample questions:**
- ¿Dónde vives? (Where do you live?)
- ¿Cuántos años tienes? (How old are you?)
- ¿Por qué estudias español? (Why do you study Spanish?)

**🎯 Practice:** Ask me 3 questions using different question words!` },

    // Gustar
    { keywords: ["gustar", "like", "me gusta", "how to say i like", "me gusta vs me gustan"],
      answer: `**"Gustar" and verbs like it — "to like" in Spanish**

**⚠️ Important:** Gustar doesn't work like English "like"! It literally means "to please".

**Structure:** (A mí) me gusta/gustan + the thing you like
- The subject is WHAT you like, not you!
- Me gusta el café. = Coffee pleases me. (= I like coffee.)
- Me gustan los gatos. = Cats please me. (= I like cats.)

**GUSTA vs GUSTAN:**
- gusta → singular thing or infinitive: Me gusta la música. / Me gusta bailar.
- gustan → plural things: Me gustan los libros. / Me gustan las películas.

**All pronouns:**
- (A mí) me gusta... → I like...
- (A ti) te gusta... → You like...
- (A él/ella) le gusta... → He/She likes...
- (A nosotros) nos gusta... → We like...
- (A ellos) les gusta... → They like...

**Similar verbs (same structure):**
- encantar → Me encanta! (I love it!)
- interesar → Me interesa la historia. (History interests me.)
- molestar → Me molesta el ruido. (Noise bothers me.)
- faltar → Me falta dinero. (I'm missing money.)
- doler → Me duele la cabeza. (My head hurts.)

**🎯 Practice:** Say 3 things you like and one thing you don't like using gustar!` },

    // Indirect speech / reporting
    { keywords: ["reported speech", "indirect speech", "said that", "dijo que", "decir que"],
      answer: `**Reported Speech in Spanish — "said that..."**

**Direct speech:** María dijo: "Tengo hambre." (María said: "I'm hungry.")
**Reported speech:** María dijo que **tenía** hambre. (María said that she was hungry.)

**Tense shifts when reporting past statements:**
- Present → Imperfect: "Estoy cansado" → dijo que **estaba** cansado
- Preterite → Pluperfect: "Llegué tarde" → dijo que **había llegado** tarde
- Future → Conditional: "Vendré" → dijo que **vendría**

**Common reporting verbs:**
- decir → dijo que... (said that)
- explicar → explicó que... (explained that)
- preguntar → preguntó si/qué... (asked if/what)
- responder → respondió que... (answered that)

**Yes/no questions use "si":**
- "¿Vienes?" → Preguntó si **venía**. (He asked if she was coming.)

**Information questions keep the question word:**
- "¿Dónde vives?" → Preguntó dónde **vivía**. (He asked where she lived.)

**🎯 Practice:** Report this: Your friend said "I will go to the party tomorrow."` },

    // False friends
    { keywords: ["false friend", "embarrassed embarazada", "false cognate", "looks like english", "tricky words"],
      answer: `**Spanish False Friends — words that look English but mean something different!**

**Most dangerous false friends:**
- embarazada → PREGNANT (not embarrassed!) → avergonzado/a = embarrassed
- éxito → SUCCESS (not exit!) → salida = exit
- sensible → SENSITIVE (not sensible!) → sensato/a = sensible
- actual → CURRENT/PRESENT (not actual!) → real/verdadero = actual
- realizar → TO REALIZE (carry out) / darse cuenta = to realize (understand)
- librería → BOOKSTORE (not library!) → biblioteca = library
- carpeta → FOLDER/BRIEFCASE (not carpet!) → alfombra = carpet
- molestar → TO BOTHER (not molest!) → acosar = to molest
- pretender → TO INTEND/CLAIM (not pretend!) → fingir = to pretend
- introducir → TO INSERT/INTRODUCE (not introduce a person) → presentar = to introduce someone
- decepcionado → DISAPPOINTED (not deceived!) → engañado = deceived
- largo → LONG (not large!) → grande = large
- constipado → HAVING A COLD (not constipated!) → estreñido = constipated

**💡 Tip:** When a Spanish word looks exactly like an English word, double-check it!

**🎯 Practice:** What would a Spanish speaker mean if they said "Estoy muy embarazada"?` },

    // Pronunciation
    { keywords: ["pronounce", "pronunciation", "r sound", "ll sound", "j sound", "accent", "how to say"],
      answer: `**Spanish Pronunciation Guide:**

**Vowels** — always short and pure, never diphthongs:
- a = "ah" | e = "eh" | i = "ee" | o = "oh" | u = "oo"

**Tricky consonants:**

**J and G (before e/i)** → strong "h" sound (back of throat):
- jardín, jugo, general, girasol → sound like a strong English "h"

**LL and Y** → In most of Latin America: like English "y" (yo, llama)
In Spain (Castilian): like "ly" or even "zh"

**RR and R at start of word** → trilled "r": rojo, perro, rey
Single R between vowels → tapped (quick flap): pero, caro, para

**C before e/i and Z:**
- Latin America: always "s" → ciudad = "syudad"
- Spain: "th" sound → ciudad = "thyudad"

**H** → always SILENT: hablar, hoy, hijo

**Ñ** → "ny" sound: España = "España" (es-PAIN-ya), niño = "NEE-nyo"

**V vs B** → same sound in Spanish! Both like a soft "b"

**🎯 Tongue twister practice:** "El perro de San Roque no tiene rabo." (San Roque's dog has no tail.)` },

    // Tener expressions
    { keywords: ["tener", "have to", "tener que", "tener expressions", "tener hambre", "tener miedo"],
      answer: `**Tener Expressions — "to have" does a lot in Spanish!**

**Tener que + infinitive = have to / must:**
- Tengo que estudiar. (I have to study.)
- ¿Tienes que trabajar mañana? (Do you have to work tomorrow?)

**Common tener expressions (where English uses "to be"):**
- tener hambre → to be hungry (I have hunger)
- tener sed → to be thirsty
- tener sueño → to be sleepy
- tener miedo → to be afraid
- tener frío/calor → to be cold/hot
- tener prisa → to be in a hurry
- tener razón → to be right
- tener suerte → to be lucky
- tener vergüenza → to be ashamed
- tener éxito → to be successful
- tener cuidado → to be careful
- tener en cuenta → to keep in mind
- tener lugar → to take place
- tener ganas de → to feel like / to want to

**Examples:**
- Tengo mucha hambre. (I'm very hungry.)
- Ten cuidado! (Be careful!)
- ¿Tienes razón! (You're right!)

**🎯 Practice:** How do you say "I'm sleepy, thirsty, and in a hurry" using tener expressions?` },

    // Hay / estar / ser for location
    { keywords: ["there is", "there are", "hay", "location", "hay vs está", "where is"],
      answer: `**Hay vs Estar for existence and location:**

**HAY = "there is / there are"** — existence, availability:
- Hay un banco cerca. (There is a bank nearby.)
- Hay muchos estudiantes. (There are many students.)
- No hay leche. (There is no milk.)
- ¿Hay un baño? (Is there a bathroom?)

**ESTAR = "to be" (location)** — where a specific known thing IS:
- El banco está en la calle principal. (The bank is on the main street.)
- Los estudiantes están en clase. (The students are in class.)
- ¿Dónde está el baño? (Where is the bathroom?)

**The key difference:**
- Hay → introducing something new, unknown, or unspecified
- Está/están → locating something specific and already known

**Practice pair:**
- ¿Hay un restaurante por aquí? (Is there a restaurant around here?) ← don't know if one exists
- ¿Dónde está el restaurante? (Where is the restaurant?) ← know it exists, asking location

**🎯 Say this in Spanish:** "There is a beautiful park near my house. The park is very big."` },
  ],

  de: [
    { keywords: ["please thank you", "bitte danke", "polite", "greet", "hallo", "tschüss"],
      answer: `**Essential German Courtesy Phrases:**

**Greetings:**
- Hallo → Hello (informal)
- Guten Morgen → Good morning (until ~noon)
- Guten Tag → Good day / Hello (formal, daytime)
- Guten Abend → Good evening
- Wie geht es Ihnen? → How are you? (formal)
- Wie geht's? → How are you? (informal)

**Farewells:**
- Tschüss / Tschau → Bye (informal)
- Auf Wiedersehen → Goodbye (formal)
- Bis bald → See you soon
- Bis morgen → See you tomorrow

**Courtesy:**
- Bitte → Please / You're welcome / Here you go
- Danke / Danke schön → Thank you / Thank you very much
- Gern geschehen → You're welcome (gladly)
- Entschuldigung → Excuse me / Sorry
- Es tut mir leid → I'm sorry (apology)

**🎯 Note:** "Bitte" is incredibly versatile — it means please, you're welcome, here you go, and "pardon?" all in one!` },

    { keywords: ["modal verb", "können dürfen müssen sollen wollen mögen", "can must may want"],
      answer: `**German Modal Verbs — the Big 6:**

**können** (can/to be able to):
ich kann | du kannst | er kann | wir können | ihr könnt | sie können
- Ich kann Deutsch sprechen. (I can speak German.)

**müssen** (must/have to):
ich muss | du musst | er muss | wir müssen
- Ich muss jetzt gehen. (I must go now.)

**dürfen** (may/to be allowed to):
ich darf | du darfst | er darf | wir dürfen
- Darf ich hier sitzen? (May I sit here?)

**wollen** (to want to):
ich will | du willst | er will | wir wollen
- Ich will Deutsch lernen. (I want to learn German.)

**sollen** (should/supposed to — external obligation):
ich soll | du sollst | er soll | wir sollen
- Du sollst das nicht tun. (You shouldn't do that.)

**mögen/möchten** (to like / would like):
ich mag | du magst (present)
ich möchte | du möchtest (polite "would like" — most used!)
- Ich möchte einen Kaffee. (I'd like a coffee.)

**Word order:** Modal in position 2, infinitive at END of sentence:
- Ich **kann** gut Gitarre **spielen**. (I can play guitar well.)

**🎯 Practice:** "I must learn German because I want to live in Berlin."` },

    { keywords: ["negation", "nicht kein", "not no", "how to say no", "keine"],
      answer: `**German Negation — nicht vs kein:**

**NICHT** (not) — negates verbs, adjectives, adverbs, and specific nouns with definite article:
- Ich komme **nicht**. (I'm not coming.)
- Das ist **nicht** richtig. (That's not right.)
- Ich trinke den Kaffee **nicht**. (I'm not drinking the coffee.) ← specific coffee with "den"
- Position: usually at END, or before what it negates

**KEIN** (no/not a/not any) — negates nouns with indefinite or no article:
- Ich habe **kein** Geld. (I have no money.) ← kein replaces "ein Geld" or bare noun
- Das ist **kein** Problem. (That's no problem.)
- Ich habe **keine** Zeit. (I have no time.)

**Kein agrees like ein:**
- kein (masc/neut nom) | keine (fem) | keine (plural) | keinen (masc acc) | keinem (dative)

**Quick rule:**
→ Negating a noun? → Use kein/keine
→ Negating a verb/adjective/adverb or noun with "the"? → Use nicht

**Examples:**
- Er ist **nicht** Arzt. (He's not a doctor.) — profession, no article
- Er hat **keinen** Arzt. (He has no doctor.) — object noun
- Das Buch ist **nicht** interessant. (The book is not interesting.) — adjective

**🎯 Practice:** Negate these: "Ich habe Zeit" and "Er kommt morgen"` },

    { keywords: ["preposition", "in an auf bei", "two way", "accusative dative prepositions"],
      answer: `**German Prepositions — which case do they take?**

**Always ACCUSATIVE:**
durch (through) | für (for) | gegen (against) | ohne (without) | um (around/at) | bis (until) | entlang (along)
- Ich kaufe das **für dich**. (I buy it for you.) → dich = accusative

**Always DATIVE:**
aus (from/out of) | bei (at/with) | mit (with) | nach (after/to) | seit (since) | von (from/of) | zu (to) | gegenüber (opposite) | außer (except)
- Ich fahre **mit dem** Bus. (I take the bus.) → dem = dative

**Two-way prepositions (an, auf, hinter, in, neben, über, unter, vor, zwischen):**
→ ACCUSATIVE for movement/direction (Wohin? — Where to?)
→ DATIVE for location/static (Wo? — Where?)

Examples:
- Ich lege das Buch **auf den** Tisch. (I put the book onto the table.) ← motion → Akkusativ
- Das Buch liegt **auf dem** Tisch. (The book is on the table.) ← location → Dativ

**Common contractions:**
- an + dem = **am** | an + das = **ans** | in + dem = **im** | in + das = **ins**
- zu + dem = **zum** | zu + der = **zur**

**🎯 Practice:** "I'm going INTO the house" vs "I'm IN the house" — which case?` },

    { keywords: ["plural", "make plural", "plurals", "mehr als eins", "how to make plural german"],
      answer: `**German Plurals — no simple rule, but patterns help!**

**Main plural patterns:**

**No change (usually masculine -er, -en, -el):**
- der Lehrer → die Lehrer (teacher)
- der Wagen → die Wagen (car)

**Add -e (common, often with umlaut for masculine):**
- der Tisch → die Tische (table)
- der Hund → die Hunde (dog)
- die Nacht → die Nächte (night) ← umlaut!

**Add -er (often with umlaut — neuter short words):**
- das Kind → die Kinder (child)
- das Haus → die Häuser (house) ← umlaut!

**Add -(e)n (most feminine words!):**
- die Frau → die Frauen (woman)
- die Schule → die Schulen (school)
- die Zeitung → die Zeitungen (newspaper)

**Add -s (foreign words, abbreviations):**
- das Auto → die Autos
- das Hotel → die Hotels
- das Café → die Cafés

**The die rule: ALL plurals use "die" regardless of singular gender!**
- der Mann → die Männer | die Frau → die Frauen | das Kind → die Kinder

**🎯 Best strategy:** Learn the plural with each noun: not just "Tisch" but "der Tisch, die Tische"` },

    { keywords: ["reflexive", "reflexive verb", "sich", "sich waschen", "reflexive pronoun"],
      answer: `**German Reflexive Verbs — sich and reflexive pronouns**

**What are they?** Verbs where the subject acts on itself.

**Reflexive pronouns:**
ich → mich (acc) / mir (dat) | du → dich / dir | er/sie/es → sich | wir → uns | ihr → euch | sie/Sie → sich

**Common reflexive verbs:**
- sich waschen → Ich **wasche mich**. (I wash myself.)
- sich freuen → Er **freut sich**. (He's happy / He's looking forward to it.)
- sich erinnern → Ich **erinnere mich**. (I remember.)
- sich setzen → **Setzen Sie sich**! (Sit down! — formal)
- sich beeilen → Beeile **dich**! (Hurry up! — informal)
- sich vorstellen → Darf ich mich **vorstellen**? (May I introduce myself?)
- sich interessieren für → Ich **interessiere mich** für Musik. (I'm interested in music.)

**Accusative vs Dative reflexive:**
When there's another object, the reflexive is dative:
- Ich **wasche mich**. (no other object → accusative)
- Ich **wasche mir** die Hände. (another object = Hände → reflexive is dative)

**Word order:** Reflexive pronoun comes early, usually right after verb:
- Ich **freue mich** sehr. (I'm very happy.)
- Wir **treffen uns** um 8. (We're meeting at 8.)

**🎯 Practice:** How do you say "I'm interested in German culture" and "She introduces herself"?` },
  ],

  fr: [
    { keywords: ["greet", "hello bonjour", "goodbye au revoir", "how are you"],
      answer: `**French Greetings & Farewells:**

**Hellos:**
- Bonjour → Hello / Good morning (formal or daytime)
- Bonsoir → Good evening
- Salut → Hi (informal, friends)
- Coucou → Hey! (very informal)

**Goodbyes:**
- Au revoir → Goodbye (formal)
- À bientôt → See you soon
- À tout à l'heure → See you in a bit
- À demain → See you tomorrow
- Salut → Bye! (same as hi, informal)
- Bonne journée / Bonne soirée → Have a good day/evening

**How are you:**
- Comment allez-vous? → How are you? (formal/vous)
- Comment vas-tu? → How are you? (informal/tu)
- Ça va? → How's it going? (very common)
- Ça va bien, merci → I'm fine, thanks
- Comme ci, comme ça → So-so

**⚠️ Always use Bonjour before any interaction in France — it's essential politeness!**

**🎯 Practice:** Greet someone formally, ask how they are, and say goodbye in French.` },

    { keywords: ["tu vs vous", "formal informal", "tutoyer vouvoyer", "when to use tu vous"],
      answer: `**Tu vs Vous — French's two ways to say "you"**

**TU (informal "you"):**
Use with: friends, family, children, classmates, peers your age, animals
- Tu parles français? (Do you speak French?)
- Comment tu t'appelles? (What's your name?)

**VOUS (formal "you" OR plural "you"):**
Use with: strangers, elderly people, authority figures, customers, anyone you want to show respect
Also: always when speaking to more than one person
- Vous parlez français? (Do you speak French? — formal or plural)
- Comment vous appelez-vous? (What is your name? — formal)

**The cultural rule:**
In France, default to VOUS with anyone you've just met unless they invite you to use tu ("On peut se tutoyer" = We can use tu with each other). 

With the young generation, tu is spreading more widely.

**Verb conjugation differs:**
- tu parles / vous parlez | tu es / vous êtes | tu fais / vous faites

**🎯 You're asking for directions from an elderly stranger vs. talking to a friend your age — which "you" do you use in each case?` },

    { keywords: ["ne pas", "negation", "not ne", "how to say not", "negative"],
      answer: `**French Negation — ne...pas and its family**

**Basic negation:** ne + verb + pas
- Je parle. → Je **ne** parle **pas**. (I don't speak.)
- Il vient. → Il **ne** vient **pas**. (He's not coming.)

**With infinitives — both ne and pas go BEFORE the infinitive:**
- Je voudrais **ne pas** partir. (I'd like not to leave.)

**In spoken French:** ne is often dropped! 
- Je **ne** sais **pas** → Je sais **pas** (informal speech)
- Vous comprenez → Vous comprenez **pas**? (You don't understand?)

**Other negative patterns:**
- ne...jamais → never: Je ne fume **jamais**. (I never smoke.)
- ne...rien → nothing: Je ne vois **rien**. (I see nothing.)
- ne...personne → nobody: Je ne connais **personne**. (I know nobody.)
- ne...plus → no more/no longer: Elle ne travaille **plus**. (She doesn't work anymore.)
- ne...que → only: Je n'ai **qu'**un euro. (I only have one euro.)

**With compound tenses** — ne before auxiliary, pas after auxiliary:
- Je **n'**ai **pas** mangé. (I didn't eat.)
- Elle **n'**est **pas** partie. (She didn't leave.)

**🎯 Practice:** Make these negative: "Je comprends" / "Il a mangé la pizza" / "Elle vient toujours"` },

    { keywords: ["pronoun en y", "en y pronoun", "how to use en y"],
      answer: `**French Pronouns EN and Y — two tricky but essential pronouns**

**EN** replaces "de + something" (of it, some, from there):

1. Replaces "du/de la/des + noun" (partitive):
   - Tu veux du café? → Tu en veux? (Do you want some?)
   - Il mange des pommes? → Il en mange. (He eats some.)

2. Replaces "de + place":
   - Tu viens de Paris? → Tu en viens? (You come from there?)

3. Replaces "de + noun" after expressions:
   - J'ai besoin de temps → J'en ai besoin. (I need some.)
   - Il a peur des araignées → Il en a peur. (He's afraid of them.)

4. With numbers/quantities:
   - J'ai trois enfants → J'en ai trois. (I have three [of them].)

**Y** replaces "à/dans/en + place or thing":

1. Replaces location (à/dans/en + place):
   - Tu vas à Paris? → Tu y vas? (Are you going there?)
   - Je suis en France → J'y suis. (I'm there.)

2. Replaces "à + thing" (with verbs like penser à, répondre à):
   - Tu penses à ton voyage? → Tu y penses? (Are you thinking about it?)

**Position:** Always before the verb (except affirmative commands: Vas-y!)

**🎯 Practice:** Replace the underlined: "Je vais [au marché]" and "Elle prend [du pain]"` },
  ],

  ja: [
    { keywords: ["greet", "hello konnichiwa", "goodbye", "ohayo", "arigato", "yoroshiku"],
      answer: `**Essential Japanese Greetings:**

**Hellos by time of day:**
- おはようございます (Ohayou gozaimasu) → Good morning (formal)
- おはよう (Ohayou) → Morning! (casual)
- こんにちは (Konnichiwa) → Hello / Good afternoon
- こんばんは (Konbanwa) → Good evening

**Goodbyes:**
- さようなら (Sayounara) → Goodbye (formal, somewhat final)
- じゃあね / またね (Jaa ne / Mata ne) → See ya / Later (casual)
- また明日 (Mata ashita) → See you tomorrow
- お先に失礼します (Osaki ni shitsurei shimasu) → Leaving before you (work/formal)

**Thank you:**
- ありがとうございます (Arigatou gozaimasu) → Thank you (formal)
- ありがとう (Arigatou) → Thanks (casual)
- どうもありがとう (Doumo arigatou) → Thank you very much

**How are you / Common exchanges:**
- お元気ですか？(Ogenki desu ka?) → Are you well? (formal)
- 元気？(Genki?) → You good? (casual)
- おかげさまで (Okagesama de) → Thanks to you, I'm well

**Meeting someone:**
- はじめまして (Hajimemashite) → Nice to meet you (first time)
- よろしくお願いします (Yoroshiku onegai shimasu) → Please treat me well / Nice to meet you

**🎯 Practice:** Introduce yourself saying your name and "nice to meet you"!` },
  ],

  ko: [
    { keywords: ["greet", "hello annyeong", "goodbye", "thank you", "kamsahamnida"],
      answer: `**Essential Korean Greetings:**

**Formal (to elders, strangers):**
- 안녕하세요 (Annyeonghaseyo) → Hello (polite)
- 안녕히 가세요 (Annyeonghi gaseyo) → Goodbye (you're leaving, I'm staying)
- 안녕히 계세요 (Annyeonghi gyeseyo) → Goodbye (I'm leaving, you're staying)
- 감사합니다 (Gamsahamnida) → Thank you (formal)
- 죄송합니다 (Joesonghamnida) → I'm sorry (formal)

**Casual (friends, younger people):**
- 안녕 (Annyeong) → Hi / Bye (casual)
- 고마워 (Gomawo) → Thanks (casual)
- 미안해 (Mianhae) → Sorry (casual)

**Common phrases:**
- 네 (Ne) → Yes | 아니요 (Aniyo) → No
- 괜찮아요 (Gwaenchanayo) → It's okay / Are you okay?
- 모르겠어요 (Moreugesseoyo) → I don't know
- 이해 못 했어요 (Ihae mot haesseoyo) → I didn't understand
- 천천히 말해주세요 (Cheoncheonhi malhaejuseyo) → Please speak slowly

**Honorific speech — speech levels:**
Korean has formal/informal speech. With -요 ending = polite, safe default for learners.
합쇼체 (formal) → 해요체 (polite, use this) → 해체 (casual, close friends only)

**🎯 Practice:** Greet someone politely, thank them, and say goodbye in Korean!` },
  ],
};

// ─── MATCHING FUNCTION ────────────────────────────────────────────────────────

/**
 * Try to find a pre-recorded answer for a given question.
 * Returns { answer, matched: true } or { matched: false }
 */
export function findPrerecordedAnswer(langCode, question) {
  const q = question.toLowerCase().trim();
  const bank = COMMON_QA[langCode] || [];

  // Check common QA bank — keyword matching
  for (const entry of bank) {
    const matched = entry.keywords.some(kw => q.includes(kw.toLowerCase()));
    if (matched) {
      return { answer: entry.answer, matched: true };
    }
  }

  return { matched: false };
}

/**
 * Get pre-recorded topic answer.
 * Returns the answer string or null.
 */
export function getTopicAnswer(langCode, topicLabel) {
  return TOPIC_ANSWERS[langCode]?.[topicLabel] || null;
}
