const GERMAN_STATUE_SETS = {
  A1: [
    {
      title: "Funny Literal Translations I",
      description: "Weird German expressions whose literal translations sound ridiculous in English.",
      items: [
        {
          phrase: "Du gehst mir auf den Keks.",
          meaning: "You are annoying me.",
          example: "Boah, du gehst mir heute echt auf den Keks.",
          explain: "Das bedeutet: Du nervst mich."
        },
        {
          phrase: "Ich verstehe nur Bahnhof.",
          meaning: "I do not understand anything.",
          example: "Wenn ihr so schnell redet, verstehe ich nur Bahnhof.",
          explain: "Das bedeutet: Ich verstehe gar nichts."
        },
        {
          phrase: "Das ist mir Wurst.",
          meaning: "I do not care.",
          example: "Ob wir Pizza oder Pasta essen, das ist mir Wurst.",
          explain: "Das bedeutet: Es ist mir egal."
        },
        {
          phrase: "Jetzt geht's um die Wurst.",
          meaning: "Now it is getting serious.",
          example: "Im Finale geht's jetzt um die Wurst.",
          explain: "Das bedeutet: Jetzt wird es ernst."
        },
        {
          phrase: "Tomaten auf den Augen haben.",
          meaning: "To miss something obvious.",
          example: "Hast du Tomaten auf den Augen? Das Schild hängt doch direkt vor dir.",
          explain: "Das bedeutet: Etwas Offensichtliches nicht sehen."
        }
      ]
    }
  ],
  A2: [
    {
      title: "Casual Everyday German",
      description: "Real casual expressions Germans actually use, but textbooks usually skip.",
      items: [
        { phrase: "Na?", meaning: "A super short casual hello.", example: "Na, alles klar bei dir?", explain: "Das ist eine sehr kurze, lockere Begrüßung." },
        { phrase: "Alles klar?", meaning: "Is everything good?", example: "Hey, alles klar bei euch?", explain: "Das bedeutet ungefähr: Geht es dir gut?" },
        { phrase: "Was geht?", meaning: "What is up?", example: "Hey, was geht heute Abend?", explain: "Das ist lockere Jugendsprache für: Was ist los?" },
        { phrase: "Hau rein!", meaning: "Take care / See you.", example: "Ich muss los. Hau rein!", explain: "Das ist ein lockerer Abschied wie: Mach's gut." },
        { phrase: "Läuft bei dir.", meaning: "Things are going well for you.", example: "Du hast schon wieder gewonnen? Läuft bei dir.", explain: "Das bedeutet: Es klappt gerade gut für dich." }
      ]
    }
  ],
  B1: [
    {
      title: "Social Nuance",
      description: "Phrases that help you sound socially aware and more natural in real German conversation.",
      items: [
        { phrase: "Darf ich du sagen?", meaning: "May I switch from Sie to du?", example: "Wir arbeiten jetzt schon lange zusammen. Darf ich du sagen?", explain: "Damit fragt man höflich, ob man vom Sie zum du wechseln darf." },
        { phrase: "Wie meinen Sie das genau?", meaning: "What exactly do you mean?", example: "Entschuldigung, wie meinen Sie das genau?", explain: "Das ist höflich und direkt zugleich." },
        { phrase: "Nicht böse gemeint.", meaning: "No offense meant.", example: "Nicht böse gemeint, aber das war wirklich zu laut.", explain: "Damit entschärft man Kritik ein bisschen." },
        { phrase: "Das kommt drauf an.", meaning: "That depends.", example: "Wann ich zusage? Das kommt drauf an.", explain: "Das bedeutet: Es hängt von der Situation ab." }
      ]
    }
  ],
  B2: [
    {
      title: "Idioms Native Speakers Use",
      description: "Expressive idioms that make your German sound much more alive and native.",
      items: [
        { phrase: "Ich drücke dir die Daumen.", meaning: "I am keeping my fingers crossed for you.", example: "Morgen ist deine Prüfung, ich drücke dir die Daumen.", explain: "Das bedeutet: Ich wünsche dir viel Glück." },
        { phrase: "Da steppt der Bär.", meaning: "That place is really lively.", example: "Auf diesem Festival steppt wirklich der Bär.", explain: "Das bedeutet: Dort ist richtig viel los." },
        { phrase: "Ich bin fix und fertig.", meaning: "I am completely exhausted.", example: "Nach dem Umzug bin ich fix und fertig.", explain: "Das bedeutet: Ich bin völlig erschöpft." },
        { phrase: "Nicht alle Tassen im Schrank haben.", meaning: "To be a bit crazy.", example: "Wer bei diesem Wetter barfuß joggt, hat wohl nicht alle Tassen im Schrank.", explain: "Das ist eine freche Redewendung für: nicht ganz bei Verstand sein." }
      ]
    }
  ],
  C1: [
    {
      title: "Tone, Understatement, and Social Reading",
      description: "German often says strong things in a very understated way. This bonus lesson teaches that nuance.",
      items: [
        { phrase: "Kann man so sehen.", meaning: "That is one way to see it.", example: "Kann man so sehen, aber ich bin nicht ganz überzeugt.", explain: "Das ist oft eine höfliche Art, vorsichtig zu widersprechen." },
        { phrase: "Nicht ganz unproblematisch.", meaning: "Quite problematic, said indirectly.", example: "Der Vorschlag ist nicht ganz unproblematisch.", explain: "Das ist typisches deutsches Understatement für: ziemlich problematisch." },
        { phrase: "Das hat ein Geschmäckle.", meaning: "That feels a little suspicious.", example: "Wenn der Chef seinen Bruder einstellt, hat das schon ein Geschmäckle.", explain: "Das bedeutet: Etwas wirkt irgendwie verdächtig oder unsauber." }
      ]
    }
  ],
  C2: [
    {
      title: "Native Nuance and Sarcasm",
      description: "Very short expressions that carry irony, sarcasm, or emotional subtext in native conversation.",
      items: [
        { phrase: "Ja, nee, ist klar.", meaning: "Yeah right, I do not believe that.", example: "Du warst natürlich nur fünf Minuten zu spät? Ja, nee, ist klar.", explain: "Das ist sarkastisch und bedeutet meist: Das glaube ich dir nicht." },
        { phrase: "Machste nix.", meaning: "Nothing you can do.", example: "Zug weg, Ticket weg, machste nix.", explain: "Das bedeutet: Kann man jetzt auch nicht ändern." },
        { phrase: "Tja.", meaning: "A tiny word with resignation, irony, or dry reaction.", example: "Tja, das war wohl keine gute Idee.", explain: "Dieses kleine Wort kann Resignation, Ironie oder Schadenfreude ausdrücken." }
      ]
    }
  ]
};

function makeModule(levelKey, unitIdx, set) {
  const items = set.items || [];
  const vocab = items.map((item) => ({ de: item.phrase, en: item.meaning }));
  const dialogue = [];
  items.forEach((item, idx) => {
    dialogue.push({ speaker: "Guide", text: item.example });
    dialogue.push({ speaker: "Guide", text: item.explain });
  });

  return {
    id: `de-statue-${levelKey.toLowerCase()}-${unitIdx + 1}`,
    title: `Statue Bonus — ${set.title}`,
    section: "Statue Bonus",
    unit: `Statue ${unitIdx + 1}`,
    lesson: "Bonus",
    lesson_focus: set.title,
    icon: "🗿",
    xp: 60,
    grammar: set.description,
    vocab,
    dialogue,
    lessonType: "bonus_statue",
    lessonTypeLabel: "Statue Bonus",
    lessonTypeIcon: "🗿",
    audioFolder: "statues",
    recommendedExercises: 10,
    statueMeta: {
      title: set.title,
      description: set.description,
      itemCount: items.length,
      phrases: items.map((item) => item.phrase),
    },
  };
}

export function getGermanStatueLesson(levelKey, unitIdx = 0) {
  const sets = GERMAN_STATUE_SETS[levelKey] || [];
  if (!sets.length) return null;
  const picked = sets[unitIdx % sets.length];
  return makeModule(levelKey, unitIdx, picked);
}
