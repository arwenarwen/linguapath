export const JA_EXAM_QUESTIONS = {
  "A1": [
    // Q01-Q06: translate-en
    {
      id: "A1_Q01",
      type: "translate-en",
      japanese: "おはよう",
      options: ["Good evening", "Good morning", "Good night", "Hello"],
      answer: "Good morning"
    },
    {
      id: "A1_Q02",
      type: "translate-en",
      japanese: "ありがとう",
      options: ["Sorry", "Thank you", "Please", "Excuse me"],
      answer: "Thank you"
    },
    {
      id: "A1_Q03",
      type: "translate-en",
      japanese: "すし",
      options: ["Tempura", "Sushi", "Ramen", "Soba"],
      answer: "Sushi"
    },
    {
      id: "A1_Q04",
      type: "translate-en",
      japanese: "がっこう",
      options: ["Hospital", "Library", "School", "Office"],
      answer: "School"
    },
    {
      id: "A1_Q05",
      type: "translate-en",
      japanese: "これ",
      options: ["That (far)", "This", "That (near)", "Which"],
      answer: "This"
    },
    {
      id: "A1_Q06",
      type: "translate-en",
      japanese: "さくら",
      options: ["Moon", "Snow", "Cherry blossom", "Maple"],
      answer: "Cherry blossom"
    },
    // Q07-Q12: fill
    {
      id: "A1_Q07",
      type: "fill",
      sentence: "わたし___がくせいです。",
      options: ["は", "を", "に", "が"],
      answer: "は"
    },
    {
      id: "A1_Q08",
      type: "fill",
      sentence: "これ___ぺん___。",
      options: ["の", "を", "は", "に"],
      answer: "は"
    },
    {
      id: "A1_Q09",
      type: "fill",
      sentence: "せんせい___あいます。",
      options: ["を", "に", "で", "は"],
      answer: "に"
    },
    {
      id: "A1_Q10",
      type: "fill",
      sentence: "きょう___がっこう___いきます。",
      options: ["へ", "を", "で", "が"],
      answer: "へ"
    },
    {
      id: "A1_Q11",
      type: "fill",
      sentence: "あした___いい天気___。",
      options: ["は", "を", "に", "が"],
      answer: "は"
    },
    {
      id: "A1_Q12",
      type: "fill",
      sentence: "コーヒー___のみます。",
      options: ["を", "に", "で", "は"],
      answer: "を"
    },
    // Q13-Q18: listen
    {
      id: "A1_Q13",
      type: "listen",
      audio: "こんにちは",
      options: ["Good morning", "Hello", "Good night", "Thank you"],
      answer: "Hello"
    },
    {
      id: "A1_Q14",
      type: "listen",
      audio: "さようなら",
      options: ["Hello", "Thank you", "Goodbye", "Excuse me"],
      answer: "Goodbye"
    },
    {
      id: "A1_Q15",
      type: "listen",
      audio: "すみません",
      options: ["Thank you", "Excuse me", "Sorry", "Yes"],
      answer: "Excuse me"
    },
    {
      id: "A1_Q16",
      type: "listen",
      audio: "いただきます",
      options: ["Thank you for cooking", "Goodbye", "Hello", "Excuse me"],
      answer: "Thank you for cooking"
    },
    {
      id: "A1_Q17",
      type: "listen",
      audio: "ぶたにく",
      options: ["Chicken", "Beef", "Pork", "Fish"],
      answer: "Pork"
    },
    {
      id: "A1_Q18",
      type: "listen",
      audio: "くろい",
      options: ["Blue", "White", "Black", "Red"],
      answer: "Black"
    },
    // Q19-Q24: translate (EN → JA)
    {
      id: "A1_Q19",
      type: "translate",
      english: "I am a student.",
      options: ["わたし___がくせいです。", "あなた___がくせいです。", "かれ___がくせいです。", "かのじょ___がくせいです。"],
      answer: "わたし___がくせいです。"
    },
    {
      id: "A1_Q20",
      type: "translate",
      english: "This is a book.",
      options: ["これ___ほんです。", "それ___ほんです。", "あれ___ほんです。", "どれ___ほんです。"],
      answer: "これ___ほんです。"
    },
    {
      id: "A1_Q21",
      type: "translate",
      english: "I like Japanese food.",
      options: ["わたし___にほんご___すきです。", "わたし___にほんしょく___すきです。", "わたし___にほん___すきです。", "わたし___しょくじ___すきです。"],
      answer: "わたし___にほんしょく___すきです。"
    },
    {
      id: "A1_Q22",
      type: "translate",
      english: "What is your name?",
      options: ["あなた___なまえ___なん___?", "あなた___しゅみ___なん___?", "あなた___あーど___なん___?", "あなた___べんきょう___なん___?"],
      answer: "あなた___なまえ___なん___?"
    },
    {
      id: "A1_Q23",
      type: "translate",
      english: "I eat rice every day.",
      options: ["まいあさ___ご飯___たべます。", "まいひる___ご飯___たべます。", "まいしゅう___ご飯___たべます。", "まいばん___ご飯___たべます。"],
      answer: "まいひる___ご飯___たべます。"
    },
    {
      id: "A1_Q24",
      type: "translate",
      english: "Where is the restroom?",
      options: ["トイレ___どこ___?", "デパート___どこ___?", "びょういん___どこ___?", "ぎゅうにゅう___どこ___?"],
      answer: "トイレ___どこ___?"
    },
    // Q25-Q30: mcq
    {
      id: "A1_Q25",
      type: "mcq",
      prompt: "あした、なにをしますか？",
      options: ["がっこうへいきます。", "びょういんへいきます。", "えきへいきます。", "こうえんへいきます。"],
      answer: "がっこうへいきます。"
    },
    {
      id: "A1_Q26",
      type: "mcq",
      prompt: "いっしょに、すしをたべませんか？",
      options: ["いいえ、たべません。", "はい、たべます。", "はい、のみます。", "いいえ、のみません。"],
      answer: "はい、たべます。"
    },
    {
      id: "A1_Q27",
      type: "mcq",
      prompt: "なんじですか？",
      options: ["3さい___。", "3じ___。", "3ばん___。", "3いい___。"],
      answer: "3じ___。"
    },
    {
      id: "A1_Q28",
      type: "mcq",
      prompt: "すみません、えいご___はなせますか？",
      options: ["を", "で", "に", "が"],
      answer: "が"
    },
    {
      id: "A1_Q29",
      type: "mcq",
      prompt: "みず___ください。",
      options: ["を", "は", "に", "が"],
      answer: "を"
    },
    {
      id: "A1_Q30",
      type: "mcq",
      prompt: "この___, いくらですか？",
      options: ["もの", "ひと", "こと", "ば"],
      answer: "もの"
    }
  ],
  "A2": [
    // Q01-Q06: translate-en
    {
      id: "A2_Q01",
      type: "translate-en",
      japanese: "毎日勉強しています。",
      options: ["I studied every day", "I study every day (ongoing)", "I will study every day", "I studied every day (habitual)"],
      answer: "I study every day (ongoing)"
    },
    {
      id: "A2_Q02",
      type: "translate-en",
      japanese: "コンビニに行きたいです。",
      options: ["I want to go to the convenience store", "I have to go to the convenience store", "I went to the convenience store", "I can go to the convenience store"],
      answer: "I want to go to the convenience store"
    },
    {
      id: "A2_Q03",
      type: "translate-en",
      japanese: "カレーライスを食べて、コーヒーを飲みました。",
      options: ["I drank coffee and ate curry rice", "I ate curry rice and drank coffee", "I want to eat curry rice and drink coffee", "I can eat curry rice and drink coffee"],
      answer: "I ate curry rice and drank coffee"
    },
    {
      id: "A2_Q04",
      type: "translate-en",
      japanese: "音楽を聞くのが好きです。",
      options: ["I like to listen to music", "I listen to music", "I want to listen to music", "I am listening to music"],
      answer: "I like to listen to music"
    },
    {
      id: "A2_Q05",
      type: "translate-en",
      japanese: "昨日、雨が降っていました。",
      options: ["It was raining yesterday", "It rained yesterday", "It will rain yesterday", "It was about to rain yesterday"],
      answer: "It was raining yesterday"
    },
    {
      id: "A2_Q06",
      type: "translate-en",
      japanese: "日本人は礼儀正しいと思います。",
      options: ["I thought Japanese people are polite", "I think Japanese people are polite", "Japanese people think I am polite", "Japanese people are polite"],
      answer: "I think Japanese people are polite"
    },
    // Q07-Q12: fill
    {
      id: "A2_Q07",
      type: "fill",
      sentence: "毎日、朝ご飯___。",
      options: ["を食べています", "を食べた", "を食べる", "を食べません"],
      answer: "を食べています"
    },
    {
      id: "A2_Q08",
      type: "fill",
      sentence: "私は___したいです。",
      options: ["勉強に", "勉強を", "勉強で", "勉強は"],
      answer: "勉強を"
    },
    {
      id: "A2_Q09",
      type: "fill",
      sentence: "友達と遊ん___、楽しかったです。",
      options: ["で", "て", "て", "に"],
      answer: "て"
    },
    {
      id: "A2_Q10",
      type: "fill",
      sentence: "映画を見ることが___。",
      options: ["する", "できる", "ある", "好きです"],
      answer: "好きです"
    },
    {
      id: "A2_Q11",
      type: "fill",
      sentence: "昨日、田中さん___あいました。",
      options: ["を", "に", "で", "は"],
      answer: "に"
    },
    {
      id: "A2_Q12",
      type: "fill",
      sentence: "この本は___です。",
      options: ["面白い", "面白く", "面白かった", "面白ければ"],
      answer: "面白い"
    },
    // Q13-Q18: listen
    {
      id: "A2_Q13",
      type: "listen",
      audio: "食べています",
      options: ["Was eating", "Is eating", "Will eat", "Eats"],
      answer: "Is eating"
    },
    {
      id: "A2_Q14",
      type: "listen",
      audio: "行きたい",
      options: ["Wanted to go", "Went", "Wants to go", "Can go"],
      answer: "Wants to go"
    },
    {
      id: "A2_Q15",
      type: "listen",
      audio: "読んで",
      options: ["While reading", "Reading", "To read", "Reads"],
      answer: "Reading"
    },
    {
      id: "A2_Q16",
      type: "listen",
      audio: "かわいい犬",
      options: ["Aggressive dog", "Cute dog", "Large dog", "Small dog"],
      answer: "Cute dog"
    },
    {
      id: "A2_Q17",
      type: "listen",
      audio: "新しい靴",
      options: ["Old shoes", "New shoes", "Red shoes", "Comfortable shoes"],
      answer: "New shoes"
    },
    {
      id: "A2_Q18",
      type: "listen",
      audio: "困っています",
      options: ["Am happy", "Am troubled", "Am excited", "Am calm"],
      answer: "Am troubled"
    },
    // Q19-Q24: translate (EN → JA)
    {
      id: "A2_Q19",
      type: "translate",
      english: "I am reading a book right now.",
      options: ["本を読んでいます。", "本を読みました。", "本を読みます。", "本を読むことができます。"],
      answer: "本を読んでいます。"
    },
    {
      id: "A2_Q20",
      type: "translate",
      english: "I want to visit Japan.",
      options: ["日本を訪ねたいです。", "日本に来たいです。", "日本を訪問したいです。", "日本へ行きたいです。"],
      answer: "日本へ行きたいです。"
    },
    {
      id: "A2_Q21",
      type: "translate",
      english: "I cleaned my room and then took a shower.",
      options: ["部屋を掃除して、シャワーを浴びました。", "部屋を掃除したので、シャワーを浴びました。", "部屋を掃除するから、シャワーを浴びます。", "部屋を掃除できて、シャワーを浴びました。"],
      answer: "部屋を掃除して、シャワーを浴びました。"
    },
    {
      id: "A2_Q22",
      type: "translate",
      english: "Playing sports is fun.",
      options: ["スポーツをすること___楽しい。", "スポーツをするとき___楽しい。", "スポーツをするなら___楽しい。", "スポーツをするから___楽しい。"],
      answer: "スポーツをすること___楽しい。"
    },
    {
      id: "A2_Q23",
      type: "translate",
      english: "It was raining all day yesterday.",
      options: ["昨日一日中雨が降っていました。", "昨日は雨が降ります。", "昨日一日中雨を降らします。", "昨日雨が降るつもりでした。"],
      answer: "昨日一日中雨が降っていました。"
    },
    {
      id: "A2_Q24",
      type: "translate",
      english: "I think that movie is interesting.",
      options: ["その映画が面白いと思います。", "その映画に面白いと思います。", "その映画を面白いと思います。", "その映画は面白いと考えます。"],
      answer: "その映画が面白いと思います。"
    },
    // Q25-Q30: mcq
    {
      id: "A2_Q25",
      type: "mcq",
      prompt: "仕事が忙しくて、やることがいっぱいあります。何か手伝えることはありますか？",
      options: ["いいえ、大丈夫です。", "はい、ありがとうございます。", "いいえ、これからします。", "はい、できます。"],
      answer: "はい、ありがとうございます。"
    },
    {
      id: "A2_Q26",
      type: "mcq",
      prompt: "このケーキ、おいしい___。",
      options: ["ね", "よ", "か", "な"],
      answer: "ね"
    },
    {
      id: "A2_Q27",
      type: "mcq",
      prompt: "週末は何をしたいですか？",
      options: ["友達と遊びたいです。", "学校へ行きたいです。", "毎日勉強したいです。", "仕事をしたいです。"],
      answer: "友達と遊びたいです。"
    },
    {
      id: "A2_Q28",
      type: "mcq",
      prompt: "この靴は新しくて、___いいです。",
      options: ["とても", "とっても", "すごく", "ほんとに"],
      answer: "とても"
    },
    {
      id: "A2_Q29",
      type: "mcq",
      prompt: "朝、コーヒーを飲んで、パンを___。",
      options: ["食べます", "食べて", "食べています", "食べました"],
      answer: "食べます"
    },
    {
      id: "A2_Q30",
      type: "mcq",
      prompt: "雨が降っているから、傘を持って___。",
      options: ["いきました", "いきます", "いってください", "いきなさい"],
      answer: "いきます"
    }
  ],
  "B1": [
    // Q01-Q06: translate-en
    {
      id: "B1_Q01",
      type: "translate-en",
      japanese: "彼は毎日会社に行く前に、コーヒーを飲む。",
      options: ["He drinks coffee after he goes to the company every day", "Before he goes to the company every day, he drinks coffee", "He will drink coffee before he goes to the company every day", "He is drinking coffee before he goes to the company every day"],
      answer: "Before he goes to the company every day, he drinks coffee"
    },
    {
      id: "B1_Q02",
      type: "translate-en",
      japanese: "もし雨が降ったら、ピクニックをキャンセルしなければならない。",
      options: ["If it rains, we should cancel the picnic", "If it rained, we would have canceled the picnic", "If it rains, we must cancel the picnic", "If it will rain, we have to cancel the picnic"],
      answer: "If it rains, we must cancel the picnic"
    },
    {
      id: "B1_Q03",
      type: "translate-en",
      japanese: "彼女は勉強しているはずだ。",
      options: ["She is studying on purpose", "She should be studying", "She must study", "She can study"],
      answer: "She should be studying"
    },
    {
      id: "B1_Q04",
      type: "translate-en",
      japanese: "このプロジェクトが成功するかどうか、まだわかりません。",
      options: ["Whether this project will succeed or not, I don't know yet", "This project will succeed, I don't know", "I know this project will succeed or not", "Whether this project succeeds, it is not known"],
      answer: "Whether this project will succeed or not, I don't know yet"
    },
    {
      id: "B1_Q05",
      type: "translate-en",
      japanese: "彼は仕事が終わるまで、ずっと働き続けた。",
      options: ["He worked until his job was finished", "He kept working until his work was done", "He works until his job finishes", "He will work until his work is finished"],
      answer: "He kept working until his work was done"
    },
    {
      id: "B1_Q06",
      type: "translate-en",
      japanese: "その情報が正しいと信じるべきではない。",
      options: ["You should believe that information is correct", "You should not believe that information is correct", "You must not believe that information is correct", "You cannot believe that information is correct"],
      answer: "You should not believe that information is correct"
    },
    // Q07-Q12: fill
    {
      id: "B1_Q07",
      type: "fill",
      sentence: "私は彼の意見___同意する。",
      options: ["に", "を", "で", "が"],
      answer: "に"
    },
    {
      id: "B1_Q08",
      type: "fill",
      sentence: "私たちは___へ行くつもりです。",
      options: ["散歩", "散歩を", "散歩に", "散歩で"],
      answer: "散歩に"
    },
    {
      id: "B1_Q09",
      type: "fill",
      sentence: "彼が来る___、電話をください。",
      options: ["ときに", "まで", "ので", "なら"],
      answer: "まで"
    },
    {
      id: "B1_Q10",
      type: "fill",
      sentence: "この本は読む価値がある___思う。",
      options: ["と", "で", "に", "は"],
      answer: "と"
    },
    {
      id: "B1_Q11",
      type: "fill",
      sentence: "明日の試験のために、勉強___。",
      options: ["しなければならない", "したい", "できる", "してもいい"],
      answer: "しなければならない"
    },
    {
      id: "B1_Q12",
      type: "fill",
      sentence: "彼は私の質問に答える___できなかった。",
      options: ["ことが", "ように", "ほど", "ばかり"],
      answer: "ことが"
    },
    // Q13-Q18: listen
    {
      id: "B1_Q13",
      type: "listen",
      audio: "～ばかりか",
      options: ["Only", "Not only... but also", "Rather than", "As if"],
      answer: "Not only... but also"
    },
    {
      id: "B1_Q14",
      type: "listen",
      audio: "～ことになった",
      options: ["It came to be that...", "It became...", "It is decided that...", "As a result..."],
      answer: "It came to be that..."
    },
    {
      id: "B1_Q15",
      type: "listen",
      audio: "～ようにする",
      options: ["Try to...", "To the extent that...", "So that...", "In order to..."],
      answer: "Try to..."
    },
    {
      id: "B1_Q16",
      type: "listen",
      audio: "～にもかかわらず",
      options: ["Because", "In spite of", "Although", "As long as"],
      answer: "In spite of"
    },
    {
      id: "B1_Q17",
      type: "listen",
      audio: "～に関して",
      options: ["Regarding", "Related to", "Concerning", "About"],
      answer: "Regarding"
    },
    {
      id: "B1_Q18",
      type: "listen",
      audio: "～ほど",
      options: ["To the extent of", "As much as", "As far as", "To the degree that"],
      answer: "To the extent of"
    },
    // Q19-Q24: translate (EN → JA)
    {
      id: "B1_Q19",
      type: "translate",
      english: "If he hadn't been careful, the accident would have happened.",
      options: ["もし彼が注意していなかったら、事故が起こっていただろう。", "もし彼が注意しなかったら、事故が起こります。", "彼が注意していたので、事故は起こりませんでした。", "もし彼が注意していたら、事故は起こりません。"],
      answer: "もし彼が注意していなかったら、事故が起こっていただろう。"
    },
    {
      id: "B1_Q20",
      type: "translate",
      english: "It is said that this restaurant is very popular.",
      options: ["このレストランはとても人気があると言われています。", "このレストランがとても人気があると思っています。", "このレストランをとても人気があるとすすめられます。", "このレストランでとても人気があると聞きました。"],
      answer: "このレストランはとても人気があると言われています。"
    },
    {
      id: "B1_Q21",
      type: "translate",
      english: "I will study hard so that I can pass the exam.",
      options: ["試験に合格するために、一生懸命勉強します。", "試験に合格しるように、一生懸命勉強します。", "試験に合格するほど、一生懸命勉強します。", "試験に合格したら、一生懸命勉強します。"],
      answer: "試験に合格するために、一生懸命勉強します。"
    },
    {
      id: "B1_Q22",
      type: "translate",
      english: "As long as you work hard, you will succeed.",
      options: ["懸命に働く限り、成功するだろう。", "懸命に働いたので、成功するだろう。", "懸命に働けば、成功するだろう。", "懸命に働くまで、成功するだろう。"],
      answer: "懸命に働く限り、成功するだろう。"
    },
    {
      id: "B1_Q23",
      type: "translate",
      english: "Despite the difficulties, he continued his efforts.",
      options: ["困難にもかかわらず、彼は努力を続けた。", "困難だから、彼は努力を続けた。", "困難になると、彼は努力を続けた。", "困難のために、彼は努力を続けた。"],
      answer: "困難にもかかわらず、彼は努力を続けた。"
    },
    {
      id: "B1_Q24",
      type: "translate",
      english: "I have no choice but to give up.",
      options: ["あきらめるほかに、仕方がありません。", "あきらめるために、仕方がありません。", "あきらめるけれど、仕方がありません。", "あきらめるので、仕方がありません。"],
      answer: "あきらめるほかに、仕方がありません。"
    },
    // Q25-Q30: mcq
    {
      id: "B1_Q25",
      type: "mcq",
      prompt: "もし時間があったら、その展覧会に行きたかったです。",
      options: ["時間がありませんでした。", "時間があります。", "時間があったので、行きました。", "時間があればいいです。"],
      answer: "時間がありませんでした。"
    },
    {
      id: "B1_Q26",
      type: "mcq",
      prompt: "彼の話によると、プロジェクトは来月完成するということだ。",
      options: ["彼がプロジェクトを完成させます。", "彼はプロジェクトを完成させたいです。", "プロジェクトは来月完成するはずです。", "プロジェクトを来月完成させなければなりません。"],
      answer: "プロジェクトは来月完成するはずです。"
    },
    {
      id: "B1_Q27",
      type: "mcq",
      prompt: "その建設現場___、多くの危険があります。",
      options: ["では", "で", "に", "が"],
      answer: "では"
    },
    {
      id: "B1_Q28",
      type: "mcq",
      prompt: "この論文の内容___関して、質問があります。",
      options: ["に", "を", "で", "が"],
      answer: "に"
    },
    {
      id: "B1_Q29",
      type: "mcq",
      prompt: "勉強しよう___、テレビを見てしまった。",
      options: ["と", "ても", "のに", "ほど"],
      answer: "のに"
    },
    {
      id: "B1_Q30",
      type: "mcq",
      prompt: "このニュースが本当___わかりません。",
      options: ["かどうか", "かもしれません", "かもしれない", "かどうかは"],
      answer: "かどうか"
    }
  ],
  "B2": [
    // Q01-Q06: translate-en
    {
      id: "B2_Q01",
      type: "translate-en",
      japanese: "本件に関しましては、さらに詳しい情報が必要でございます。",
      options: ["Regarding this matter, more detailed information is needed (casual)", "Regarding this matter, more detailed information is needed (formal/honorific)", "Regarding this matter, I need more detailed information", "Regarding this matter, more detailed information will be needed"],
      answer: "Regarding this matter, more detailed information is needed (formal/honorific)"
    },
    {
      id: "B2_Q02",
      type: "translate-en",
      japanese: "この提案に対して、複数の異なる意見がございます。",
      options: ["There is one different opinion about this proposal", "There are multiple different opinions about this proposal (formal)", "There are different opinions about this proposal (casual)", "There will be different opinions about this proposal"],
      answer: "There are multiple different opinions about this proposal (formal)"
    },
    {
      id: "B2_Q03",
      type: "translate-en",
      japanese: "長年の経験を基に、この判断をいたしました。",
      options: ["Based on years of experience, I made this judgment (formal/honorific)", "Based on years of experience, I made this decision", "Years of experience made me judge this way", "I will judge based on years of experience"],
      answer: "Based on years of experience, I made this judgment (formal/honorific)"
    },
    {
      id: "B2_Q04",
      type: "translate-en",
      japanese: "その現象は、多くの要因に起因しているものと考えられます。",
      options: ["That phenomenon is caused by many factors", "That phenomenon is thought to be caused by many factors (formal)", "I think that phenomenon is caused by many factors", "The phenomenon causes many factors"],
      answer: "That phenomenon is thought to be caused by many factors (formal)"
    },
    {
      id: "B2_Q05",
      type: "translate-en",
      japanese: "意見の相違はあるものの、基本的な方針は一致している。",
      options: ["There are differences in opinion, but the basic policy agrees (formal)", "There are differences of opinion; however, the basic policy is aligned", "Although there are differences of opinion, the basic policy is consistent", "The basic policy agrees with the differences in opinion"],
      answer: "Although there are differences of opinion, the basic policy is consistent"
    },
    {
      id: "B2_Q06",
      type: "translate-en",
      japanese: "予定の変更につきましては、何卒ご理解のほどよろしくお願いいたします。",
      options: ["I request your understanding regarding the schedule change (humble/polite formal)", "Please understand the schedule change", "The schedule change was necessary", "I will change the schedule, so please understand"],
      answer: "I request your understanding regarding the schedule change (humble/polite formal)"
    },
    // Q07-Q12: fill
    {
      id: "B2_Q07",
      type: "fill",
      sentence: "本件___つきましては、別途ご連絡させていただきます。",
      options: ["に", "を", "として", "において"],
      answer: "に"
    },
    {
      id: "B2_Q08",
      type: "fill",
      sentence: "ご不明な点___ございましたら、お気軽にお問い合わせください。",
      options: ["が", "を", "は", "で"],
      answer: "が"
    },
    {
      id: "B2_Q09",
      type: "fill",
      sentence: "この資料___目を通していただき、ご意見をお聞かせください。",
      options: ["に", "を", "で", "は"],
      answer: "に"
    },
    {
      id: "B2_Q10",
      type: "fill",
      sentence: "お忙しいところ、誠に恐れ入りますが、___いただけますでしょうか。",
      options: ["対応してくださる", "対応いただく", "ご対応いただく", "対応させていただく"],
      answer: "ご対応いただく"
    },
    {
      id: "B2_Q11",
      type: "fill",
      sentence: "その点につきましては、今後___改善してまいります。",
      options: ["努める", "つとめて", "つとめます", "努めて"],
      answer: "努めて"
    },
    {
      id: "B2_Q12",
      type: "fill",
      sentence: "本提案は、従来の方法___比べて、より効率的___。",
      options: ["に、である", "と、です", "に、です", "で、である"],
      answer: "に、です"
    },
    // Q13-Q18: listen
    {
      id: "B2_Q13",
      type: "listen",
      audio: "～にあたって",
      options: ["At the time of", "In the face of", "When facing", "At the point of"],
      answer: "When facing"
    },
    {
      id: "B2_Q14",
      type: "listen",
      audio: "～ゆえに",
      options: ["Therefore", "Because", "As a result", "Consequently"],
      answer: "Because"
    },
    {
      id: "B2_Q15",
      type: "listen",
      audio: "～とともに",
      options: ["Along with", "Together with", "At the same time as", "With"],
      answer: "Along with"
    },
    {
      id: "B2_Q16",
      type: "listen",
      audio: "～ものなら",
      options: ["If one tries to", "In case of", "Even if", "Should one"],
      answer: "If one tries to"
    },
    {
      id: "B2_Q17",
      type: "listen",
      audio: "～次第で",
      options: ["Depending on", "According to", "By means of", "Following"],
      answer: "Depending on"
    },
    {
      id: "B2_Q18",
      type: "listen",
      audio: "～にかけて",
      options: ["Against", "Through", "Over a period of", "Toward"],
      answer: "Over a period of"
    },
    // Q19-Q24: translate (EN → JA)
    {
      id: "B2_Q19",
      type: "translate",
      english: "We are requesting your kind understanding regarding the delay.",
      options: ["遅延に関しましては、ご理解のほどよろしくお願いいたします。", "遅延についてご理解ください。", "遅延のため、ご理解いただきたいです。", "遅延するので、ご理解をお願いします。"],
      answer: "遅延に関しましては、ご理解のほどよろしくお願いいたします。"
    },
    {
      id: "B2_Q20",
      type: "translate",
      english: "As mentioned above, the project has been completed successfully.",
      options: ["上述の通り、プロジェクトは無事完了いたしました。", "上述のように、プロジェクトが完了しました。", "以上のことから、プロジェクトは完了した。", "上記の理由で、プロジェクトが完了しました。"],
      answer: "上述の通り、プロジェクトは無事完了いたしました。"
    },
    {
      id: "B2_Q21",
      type: "translate",
      english: "Your inquiry has been received and is being addressed accordingly.",
      options: ["お問い合わせをお受けしており、対応させていただいております。", "お問い合わせを受けて、対応しています。", "お問い合わせは受け取りました、対応します。", "お問い合わせをいただき、対応させていただきます。"],
      answer: "お問い合わせをお受けしており、対応させていただいております。"
    },
    {
      id: "B2_Q22",
      type: "translate",
      english: "We greatly appreciate your continued support and cooperation.",
      options: ["今後のご支援とご協力のほどよろしくお願いいたします。", "これまでのご支援とご協力、ありがとうございました。", "これまでのご支援とご協力に感謝申し上げます。", "ご支援とご協力をお願いいたします。"],
      answer: "これまでのご支援とご協力に感謝申し上げます。"
    },
    {
      id: "B2_Q23",
      type: "translate",
      english: "We will implement the new system in phases over the next quarter.",
      options: ["新しいシステムを四半期内に段階的に導入いたします。", "新しいシステムを導入しようとしています。", "新しいシステムは段階的に導入されます。", "新しいシステムを導入することにいたしました。"],
      answer: "新しいシステムを四半期内に段階的に導入いたします。"
    },
    {
      id: "B2_Q24",
      type: "translate",
      english: "In light of the recent developments, we must reconsider our approach.",
      options: ["最近の展開を踏まえて、アプローチを再検討する必要があります。", "最近の展開のために、アプローチを再検討します。", "最近の展開により、アプローチを変えなければなりません。", "最近の展開だから、アプローチを再検討しましょう。"],
      answer: "最近の展開を踏まえて、アプローチを再検討する必要があります。"
    },
    // Q25-Q30: mcq
    {
      id: "B2_Q25",
      type: "mcq",
      prompt: "お手数ですが、この書類に___していただけますでしょうか。",
      options: ["署名する", "ご署名いただく", "署名していただく", "お署名"],
      answer: "ご署名いただく"
    },
    {
      id: "B2_Q26",
      type: "mcq",
      prompt: "それに関しましては、何卒___のほどよろしくお願いいたします。",
      options: ["ご理解", "理解", "ご指導", "ご協力"],
      answer: "ご理解"
    },
    {
      id: "B2_Q27",
      type: "mcq",
      prompt: "本件___つき、改めてご説明させていただきます。",
      options: ["について", "につきまして", "に関して", "をめぐって"],
      answer: "につきまして"
    },
    {
      id: "B2_Q28",
      type: "mcq",
      prompt: "ご多忙___ことと存じますが、ご参加のほどよろしくお願いいたします。",
      options: ["であると", "であろう", "であり", "である"],
      answer: "であろう"
    },
    {
      id: "B2_Q29",
      type: "mcq",
      prompt: "別紙の資料___ご確認ください。",
      options: ["をご覧", "をご確認", "を___", "ずご覧"],
      answer: "をご覧"
    },
    {
      id: "B2_Q30",
      type: "mcq",
      prompt: "不明な点がございましたら、お気軽に___。",
      options: ["お聞きください", "お問い合わせください", "聞いてください", "問い合わせください"],
      answer: "お問い合わせください"
    }
  ],
  "C1": [
    // Q01-Q06: translate-en
    {
      id: "C1_Q01",
      type: "translate-en",
      japanese: "その現象は、複合的な因果関係に起因するものと推察される。",
      options: ["That phenomenon is caused by complex causal relationships", "It is inferred that the phenomenon originates from complex causal relationships", "The phenomenon seems to be caused by complex factors", "Complex causal relationships seem to explain the phenomenon"],
      answer: "It is inferred that the phenomenon originates from complex causal relationships"
    },
    {
      id: "C1_Q02",
      type: "translate-en",
      japanese: "従来の方法論に取って代わるべく、新たな枠組みが提唱されている。",
      options: ["A new framework is being proposed in place of the conventional methodology", "The new framework replaces the conventional methodology", "We should replace the conventional methodology with a new framework", "The new framework is proposed to the conventional methodology"],
      answer: "A new framework is being proposed in place of the conventional methodology"
    },
    {
      id: "C1_Q03",
      type: "translate-en",
      japanese: "その議論の妥当性は、相応の検証を待つ必要があろう。",
      options: ["The validity of the argument needs to be verified appropriately", "It may be necessary to await appropriate verification of the argument's validity", "We should verify the validity of the argument", "The argument's validity will be checked soon"],
      answer: "It may be necessary to await appropriate verification of the argument's validity"
    },
    {
      id: "C1_Q04",
      type: "translate-en",
      japanese: "それら複数の知見が相互に補完し合うことで、初めて全体像が浮かび上がってくる。",
      options: ["Only when multiple findings complement each other does the complete picture emerge", "Multiple findings can complement each other to show the complete picture", "The complete picture emerges when multiple findings are combined", "Multiple findings complement each other to show the picture"],
      answer: "Only when multiple findings complement each other does the complete picture emerge"
    },
    {
      id: "C1_Q05",
      type: "translate-en",
      japanese: "当該の問題に関しては、単なる技術的解決に留まらず、社会的・倫理的側面からの検討が急務である。",
      options: ["Regarding this problem, technical solutions are not enough; social and ethical considerations are urgently needed", "The problem requires technical, social, and ethical solutions", "We must solve the problem from technical, social, and ethical perspectives", "The technical solution to the problem is not the only consideration; social and ethical aspects are urgent"],
      answer: "Regarding this problem, technical solutions are not enough; social and ethical considerations are urgently needed"
    },
    {
      id: "C1_Q06",
      type: "translate-en",
      japanese: "その位置付けは、従来の認識枠組みからは脱却し、新たな観点を導入することで初めて可能となるであろう。",
      options: ["That positioning will become possible only by breaking free from the conventional conceptual framework and introducing a new perspective", "We can position it by introducing new perspectives beyond the conventional framework", "The new positioning requires a conventional framework", "The framework needs to be changed to position the concept"],
      answer: "That positioning will become possible only by breaking free from the conventional conceptual framework and introducing a new perspective"
    },
    // Q07-Q12: fill
    {
      id: "C1_Q07",
      type: "fill",
      sentence: "当該の現象は、様々な要因に___相互作用によってもたらされるものと考えられる。",
      options: ["かかわる", "関わる", "係わる", "繋がる"],
      answer: "関わる"
    },
    {
      id: "C1_Q08",
      type: "fill",
      sentence: "この理論の妥当性について、さらなる実証的検証が___ことが望まれている。",
      options: ["求められる", "必要である", "必須である", "要請される"],
      answer: "求められる"
    },
    {
      id: "C1_Q09",
      type: "fill",
      sentence: "従来の認識___相対化することで、新たな視点が開かれるであろう。",
      options: ["を", "に", "で", "は"],
      answer: "を"
    },
    {
      id: "C1_Q10",
      type: "fill",
      sentence: "その研究成果は、学問的意義___みならず、実践的応用の可能性も秘めている。",
      options: ["のみ", "のほか", "だけ", "に"],
      answer: "のみ"
    },
    {
      id: "C1_Q11",
      type: "fill",
      sentence: "複雑な現象を解釈___には、多角的なアプローチが不可欠である。",
      options: ["するために", "する上で", "するうえに", "することで"],
      answer: "する上で"
    },
    {
      id: "C1_Q12",
      type: "fill",
      sentence: "その議論の核心___あるのは、方法論的な根本的相違である。",
      options: ["に", "で", "を", "が"],
      answer: "に"
    },
    // Q13-Q18: listen
    {
      id: "C1_Q13",
      type: "listen",
      audio: "～をもって",
      options: ["By means of", "Using", "With", "Through"],
      answer: "By means of"
    },
    {
      id: "C1_Q14",
      type: "listen",
      audio: "～たる",
      options: ["That is", "As it were", "Which is", "Being"],
      answer: "Being"
    },
    {
      id: "C1_Q15",
      type: "listen",
      audio: "～しからずんば",
      options: ["Unless", "Otherwise", "If not", "Should it not be"],
      answer: "If not"
    },
    {
      id: "C1_Q16",
      type: "listen",
      audio: "～をいとわず",
      options: ["Without avoiding", "Not hesitating to", "Willingly", "Despite"],
      answer: "Not hesitating to"
    },
    {
      id: "C1_Q17",
      type: "listen",
      audio: "～にあらずして",
      options: ["Not that... but", "Rather than", "Instead of", "Contrary to"],
      answer: "Rather than"
    },
    {
      id: "C1_Q18",
      type: "listen",
      audio: "～に至るまで",
      options: ["Until", "To the extent of", "Even to the point of", "Up to"],
      answer: "Even to the point of"
    },
    // Q19-Q24: translate (EN → JA)
    {
      id: "C1_Q19",
      type: "translate",
      english: "The methodology employed must be fundamentally reconsidered in light of recent theoretical developments.",
      options: ["最近の理論的発展に鑑みて、採用されている方法論は根本的に再検討される必要があろう。", "最近の発展により、方法論は再検討しなければならない。", "最近の理論発展のため、方法論は変わるべきである。", "最近の理論的進展に基づいて、方法論を再検討します。"],
      answer: "最近の理論的発展に鑑みて、採用されている方法論は根本的に再検討される必要があろう。"
    },
    {
      id: "C1_Q20",
      type: "translate",
      english: "These phenomena, when examined through multiple analytical lenses, reveal their interconnected nature.",
      options: ["これらの現象は、複数の分析的観点を通じて検証されることで、その相互に関連した性質が明らかになる。", "これらの現象を複数の視点で見ると、関連していることがわかります。", "複数の方法を使ってこれらの現象を調べると、つながりが見えます。", "これらの現象は複数の観点から分析される。"],
      answer: "これらの現象は、複数の分析的観点を通じて検証されることで、その相互に関連した性質が明らかになる。"
    },
    {
      id: "C1_Q21",
      type: "translate",
      english: "The theoretical framework proposed herein endeavors to synthesize these ostensibly divergent viewpoints.",
      options: ["本稿で提唱される理論的枠組みは、一見異なるように見えるこれらの見方を統合することを試みている。", "この論文で提案される枠組みは、異なる見方をまとめようとしています。", "これらの見方を統合するために、新しい枠組みが提案されます。", "提案された理論的枠組みは、異なる観点を合わせようとする。"],
      answer: "本稿で提唱される理論的枠組みは、一見異なるように見えるこれらの見方を統合することを試みている。"
    },
    {
      id: "C1_Q22",
      type: "translate",
      english: "Far from being merely descriptive, the analysis undertaken here aspires to generate novel insights into the mechanisms at play.",
      options: ["ここで行われた分析は、単なる記述的なものではなく、作用しているメカニズムに関する新しい洞察を生み出すことを目指している。", "この分析は記述的ではなく、新しい見方を生み出そうとしています。", "記述的な分析ではなく、メカニズムについての新しい見方が目指されている。", "この分析は単なる説明ではなく、新しい理解を目指す。"],
      answer: "ここで行われた分析は、単なる記述的なものではなく、作用しているメカニズムに関する新しい洞察を生み出すことを目指している。"
    },
    {
      id: "C1_Q23",
      type: "translate",
      english: "The validity of such assertions remains contingent upon empirical substantiation that has yet to be forthcoming.",
      options: ["そのような主張の妥当性は、未だ得られていない実証的な裏付けに依存しているままである。", "その主張が正しいかどうかは、まだ実証されていません。", "このような主張の正当性は、まだ実証されていない。", "そのような主張は、実証的な裏付けが必要である。"],
      answer: "そのような主張の妥当性は、未だ得られていない実証的な裏付けに依存しているままである。"
    },
    {
      id: "C1_Q24",
      type: "translate",
      english: "By transcending the boundaries of disciplinary silos, we can better apprehend the emergent properties of complex systems.",
      options: ["学問的領域の境界を超越することで、複雑なシステムの創発的性質をより良く理解することができるであろう。", "学問の枠を超えることで、複雑なシステムの性質が見えます。", "異なる分野を統合することで、複雑なシステムが理解できます。", "領域を越えて、複雑なシステムの特性をよく理解できる。"],
      answer: "学問的領域の境界を超越することで、複雑なシステムの創発的性質をより良く理解することができるであろう。"
    },
    // Q25-Q30: mcq
    {
      id: "C1_Q25",
      type: "mcq",
      prompt: "当該の議論___根底に流れる仮定を明示化することが肝要である。",
      options: ["が", "を", "に", "で"],
      answer: "に"
    },
    {
      id: "C1_Q26",
      type: "mcq",
      prompt: "従来の認識枠組み___拘泥することなく、新たな視点を導入する必要がある。",
      options: ["に", "から", "を", "で"],
      answer: "に"
    },
    {
      id: "C1_Q27",
      type: "mcq",
      prompt: "その理論の信頼性は、厳密な方法論的検証を___ことが前提である。",
      options: ["待つ", "必要とする", "求める", "要求する"],
      answer: "待つ"
    },
    {
      id: "C1_Q28",
      type: "mcq",
      prompt: "複数の知見が相互補完的に機能することで、初めて総合的理解が___。",
      options: ["できる", "もたらされる", "得られる", "実現する"],
      answer: "もたらされる"
    },
    {
      id: "C1_Q29",
      type: "mcq",
      prompt: "その議論の有効性は、より広い文脈___配置されることで初めて明確になるであろう。",
      options: ["に", "で", "を", "まで"],
      answer: "に"
    },
    {
      id: "C1_Q30",
      type: "mcq",
      prompt: "学問的厳密性___いとわず、実践的応用性を追求することが重要である。",
      options: ["をいとわず", "を排除して", "に反して", "に忠実に"],
      answer: "をいとわず"
    }
  ],
  "C2": [
    // Q01-Q06: translate-en
    {
      id: "C2_Q01",
      type: "translate-en",
      japanese: "当該の現象は、単純なシステムの線形的な挙動として説明し難く、むしろ非線形ダイナミクスに基づく複雑系としての再考が不可避である。",
      options: ["The phenomenon can be understood as a simple linear system", "The phenomenon defies simple linear explanation and necessitates reconceptualization as a complex system based on nonlinear dynamics", "The phenomenon is complex and requires new methods", "We must study this phenomenon using complex mathematics"],
      answer: "The phenomenon defies simple linear explanation and necessitates reconceptualization as a complex system based on nonlinear dynamics"
    },
    {
      id: "C2_Q02",
      type: "translate-en",
      japanese: "従来の機械論的な因果性の概念は、現代の知識体系の多くの領域において、その解釈的生産性を喪失しつつあるのではないだろうか。",
      options: ["Traditional mechanistic causality has lost its explanatory power in many domains of modern knowledge", "We should question whether traditional mechanistic causality is losing its interpretive productivity across many domains of modern knowledge", "Modern knowledge systems reject traditional ideas about causality", "Traditional causality is being replaced by new theories"],
      answer: "We should question whether traditional mechanistic causality is losing its interpretive productivity across many domains of modern knowledge"
    },
    {
      id: "C2_Q03",
      type: "translate-en",
      japanese: "存在論的前提の根本的な転換を促しうるような、パラダイム的な知の再構成が急務である。",
      options: ["We need to reconstruct knowledge in a way that might prompt fundamental changes in ontological presuppositions", "We need a new paradigm to change our thinking", "Knowledge must be reconstructed with new foundations", "Paradigmatic reconstruction of knowledge is necessary for change"],
      answer: "We need to reconstruct knowledge in a way that might prompt fundamental changes in ontological presuppositions"
    },
    {
      id: "C2_Q04",
      type: "translate-en",
      japanese: "その議論の射程は、表面的な現象レベルに留まらず、根底的な構造的相互関係にまで及んでいるのであり、その含意は極めて深刻である。",
      options: ["The argument's implications extend not merely to phenomenal surfaces but to fundamental structural relations, with grave consequences", "The argument is about deep structures, not just appearances", "The argument affects both phenomena and structures", "This argument has deep and serious implications"],
      answer: "The argument's implications extend not merely to phenomenal surfaces but to fundamental structural relations, with grave consequences"
    },
    {
      id: "C2_Q05",
      type: "translate-en",
      japanese: "かくして、学知の営みは、いかなる確実な基盤をも持たず、常に暫定的かつ可謬的な性格を免れ得ないのであり、その自覚こそが学問的誠実性の要件たるべきではないだろうか。",
      options: ["Academic knowledge has no certain foundation and is always provisional and fallible; perhaps this recognition itself is a requirement of scholarly integrity", "Knowledge is not certain and academic work must accept this", "Scholars should accept that knowledge is temporary", "Academic integrity requires acknowledging uncertainty in knowledge"],
      answer: "Academic knowledge has no certain foundation and is always provisional and fallible; perhaps this recognition itself is a requirement of scholarly integrity"
    },
    {
      id: "C2_Q06",
      type: "translate-en",
      japanese: "その思考の軌跡をたどることは、同時代の知的状況の閾値を浮き彫りにするとともに、次なる思考の可能性を垣間見させるのである。",
      options: ["Following this line of thought reveals the threshold of contemporary intellectual conditions while affording glimpses of future possibilities of thought", "This thinking shows the current state of knowledge", "We can understand modern thinking by following this path", "This line of thought demonstrates intellectual progress"],
      answer: "Following this line of thought reveals the threshold of contemporary intellectual conditions while affording glimpses of future possibilities of thought"
    },
    // Q07-Q12: fill
    {
      id: "C2_Q07",
      type: "fill",
      sentence: "その観点___、既存の理論体系の根本的検証が___されるのである。",
      options: ["から、迫られ", "から、求められ", "より、要求され", "よって、求めら"],
      answer: "から、求められ"
    },
    {
      id: "C2_Q08",
      type: "fill",
      sentence: "知識の社会的構成性を認める一方で、その無制限の相対化を避けるべく、批判的実在論の立場___の理論的な___が必要である。",
      options: ["をもちい、検討", "からの、敷衍", "によ、整備", "による、構築"],
      answer: "からの、敷衍"
    },
    {
      id: "C2_Q09",
      type: "fill",
      sentence: "存在論的前提___照らして、従来の説明原理の妥当性___再検討されるべき局面にある。",
      options: ["に、が", "に照らして、が", "を、で", "において、を"],
      answer: "に、が"
    },
    {
      id: "C2_Q10",
      type: "fill",
      sentence: "かかる問題圏___おいては、方法論的単一性___放擲し、多元的な認識枠組みの相互補完性___活用することが求められる。",
      options: ["に、を、を", "において、を、を", "においては、を、を", "では、が、に"],
      answer: "においては、を、を"
    },
    {
      id: "C2_Q11",
      type: "fill",
      sentence: "その議論が孕む理論的な含意___明示化し、かつその限界性___自覚的に照射することが、学問的責任___。",
      options: ["を、を、である", "が、が、である", "を、を、であろう", "が、を、たるべき"],
      answer: "を、を、である"
    },
    {
      id: "C2_Q12",
      type: "fill",
      sentence: "知識体系の根底的な転換___もたらし___のは、けだし既得の認識枠組みの有効性の喪失と軌を一つにするのである。",
      options: ["を、とる", "が、もたらす", "を、きたす", "が、起こす"],
      answer: "を、とる"
    },
    // Q13-Q18: listen
    {
      id: "C2_Q13",
      type: "listen",
      audio: "～にして初めて",
      options: ["Only when", "After", "Only through", "For the first time"],
      answer: "Only through"
    },
    {
      id: "C2_Q14",
      type: "listen",
      audio: "～をおいてほかない",
      options: ["Without choice", "Having no alternative but to", "Other than", "No other way"],
      answer: "Having no alternative but to"
    },
    {
      id: "C2_Q15",
      type: "listen",
      audio: "～たる",
      options: ["Being", "That which is", "The one who", "Which bears the characteristic of"],
      answer: "Which bears the characteristic of"
    },
    {
      id: "C2_Q16",
      type: "listen",
      audio: "～しからずんば",
      options: ["If not so", "Unless it is", "Otherwise", "Should this not be"],
      answer: "If not so"
    },
    {
      id: "C2_Q17",
      type: "listen",
      audio: "～にまつ",
      options: ["Awaits", "Depends on", "Rests on", "Requires"],
      answer: "Depends on"
    },
    {
      id: "C2_Q18",
      type: "listen",
      audio: "～をめぐる",
      options: ["Surrounding", "Concerning", "Around", "About the matter of"],
      answer: "Concerning"
    },
    // Q19-Q24: translate (EN → JA)
    {
      id: "C2_Q19",
      type: "translate",
      english: "The reconstitution of knowledge demanded by contemporary intellectual crises necessitates not merely incremental theoretical adjustments but a fundamental paradigmatic reconfiguration.",
      options: ["現代の知的危機が要求する知識の再構成は、単なる理論的調整の小幅な修正ではなく、根本的なパラダイム的再編成を不可避とするのである。", "現代の知的危機により、知識の再構成が求められています。", "知識の再構成は、理論的調整を超えて基本的な変化を必要とします。", "パラダイム的な知識の再構成が現代において必要です。"],
      answer: "現代の知的危機が要求する知識の再構成は、単なる理論的調整の小幅な修正ではなく、根本的なパラダイム的再編成を不可避とするのである。"
    },
    {
      id: "C2_Q20",
      type: "translate",
      english: "To the extent that our interpretive frameworks remain enthralled to modernist epistemological presuppositions, the emergence of genuinely novel insights remains foreclosed.",
      options: ["われわれの解釈的枠組みがモダニスト的認識論的前提に拘束されている限り、真に新規な洞察の出現は阻止され続けるのである。", "モダニストの前提に従う限り、新しい見方は見つかりません。", "現代の認識論が知識に制限を与えています。", "新しい洞察は、モダニズムの前提を越える必要があります。"],
      answer: "われわれの解釈的枠組みがモダニスト的認識論的前提に拘束されている限り、真に新規な洞察の出現は阻止され続けるのである。"
    },
    {
      id: "C2_Q21",
      type: "translate",
      english: "The aporia encountered in classical theoretical edifices illuminates not failure but rather the necessary limitations of any finite conceptual apparatus when confronted with phenomena of radical alterity.",
      options: ["古典的理論体系において遭遇するアポリアは、失敗を示すのではなく、むしろ根本的他性の現象に直面したときのいかなる有限な概念装置の必然的限界を照らし出すのである。", "古典的理論には限界があります。", "理論が失敗するのは、現象が複雑だからです。", "古い理論は新しい現象に対応できません。"],
      answer: "古典的理論体系において遭遇するアポリアは、失敗を示すのではなく、むしろ根本的他性の現象に直面したときのいかなる有限な概念装置の必然的限界を照らし出すのである。"
    },
    {
      id: "C2_Q22",
      type: "translate",
      english: "It is perhaps through the very irresolution of these competing frameworks that we catch a glimpse of what lies beyond the hegemonic imposition of any singular regime of truth.",
      options: ["おそらく、これらの競合する枠組みのまさに未決定性を通じてこそ、いかなる単一の真理体制の覇権的押し付けを越えた何かを垣間見ることができるのではないだろうか。", "異なる枠組みを比較することで、真実が見えます。", "複数の理論の対立から新しい理解が生まれます。", "様々な見方が一つの真実につながります。"],
      answer: "おそらく、これらの競合する枠組みのまさに未決定性を通じてこそ、いかなる単一の真理体制の覇権的押し付けを越えた何かを垣間見ることができるのではないだろうか。"
    },
    {
      id: "C2_Q23",
      type: "translate",
      english: "The genealogical excavation of discourse reveals how ostensibly neutral epistemological categories are already saturated with historical contingency and political determination.",
      options: ["言説の系譜学的発掘により、一見中立的に見える認識論的カテゴリーが既に歴史的偶然性と政治的決定によって飽和していることが明らかになるのである。", "言説の歴史を調べると、知識が中立的ではないことがわかります。", "認識論は歴史的背景を持っています。", "認識的カテゴリーは政治的に影響されています。"],
      answer: "言説の系譜学的発掘により、一見中立的に見える認識論的カテゴリーが既に歴史的偶然性と政治的決定によって飽和していることが明らかになるのである。"
    },
    {
      id: "C2_Q24",
      type: "translate",
      english: "Only by dwelling within the constitutive aporias of our own conceptual apparatus can we hope to transfigure the very conditions of possibility for thought itself.",
      options: ["われわれ自身の概念装置の構成的なアポリアの内に住まうことによってのみ、思考そのものの可能性の諸条件を変容させることへの希望を抱くことができるのであろう。", "自分たちの考え方の問題を理解することが重要です。", "思考の基礎を変えるには、問題を認識する必要があります。", "概念的矛盾を受け入れることが思考を進める。"],
      answer: "われわれ自身の概念装置の構成的なアポリアの内に住まうことによってのみ、思考そのものの可能性の諸条件を変容させることへの希望を抱くことができるのであろう。"
    },
    // Q25-Q30: mcq
    {
      id: "C2_Q25",
      type: "mcq",
      prompt: "当該の現象___照らされることで、従来の理論的枠組みの根本的再検討が___。",
      options: ["によって、迫られる", "に、求められる", "を通じて、要請される", "によって、要求される"],
      answer: "によって、迫られる"
    },
    {
      id: "C2_Q26",
      type: "mcq",
      prompt: "知識の社会的構成性を認めつつも、その過度な相対化___抗することが、批判的実在論の重要な課題たるべき___。",
      options: ["に、ではないか", "に、ではあろう", "に、ではなかろうか", "を、であろう"],
      answer: "に、ではなかろうか"
    },
    {
      id: "C2_Q27",
      type: "mcq",
      prompt: "その議論が孕む複雑な含意___明示化する___が、学問的誠実性を実現する第一歩たるべき___。",
      options: ["を、こと、である", "が、こと、か", "を、こと、ではなかろうか", "が、まで、であろう"],
      answer: "を、こと、ではなかろうか"
    },
    {
      id: "C2_Q28",
      type: "mcq",
      prompt: "既得の認識枠組み___拘泥することなく、新たな理論的可能性___探究することが喫緊の課題たるべき___。",
      options: ["に、を、ではないか", "に、を、ではなかろうか", "を、を、であろう", "で、が、か"],
      answer: "に、を、ではなかろうか"
    },
    {
      id: "C2_Q29",
      type: "mcq",
      prompt: "存在論的前提の根本的転換___もたらしうる___は、知識体系そのものの再構成を不可避とするのである。",
      options: ["を、こと", "が、もの", "を、ゆえに", "を、ために"],
      answer: "を、こと"
    },
    {
      id: "C2_Q30",
      type: "mcq",
      prompt: "かくして、学知の営みは、永遠に未完の営為として、その可謬性___自覚しつつ、にもかかわらず、その継続___求めざるを得ないのではないだろうか。",
      options: ["を、が", "を、を", "が、を", "を、よ"],
      answer: "を、を"
    }
  ]
};
