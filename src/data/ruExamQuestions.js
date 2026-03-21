export const RU_EXAM_QUESTIONS = {
  "A1": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "russian": "Привет",
      "options": ["Hello", "Goodbye", "Thank you", "Please"],
      "answer": "Hello"
    },
    {
      "type": "translate-en",
      "russian": "Спасибо",
      "options": ["Sorry", "Thank you", "Please", "Yes"],
      "answer": "Thank you"
    },
    {
      "type": "translate-en",
      "russian": "Да",
      "options": ["No", "Yes", "Maybe", "Not"],
      "answer": "Yes"
    },
    {
      "type": "translate-en",
      "russian": "Нет",
      "options": ["Yes", "No", "Perhaps", "Always"],
      "answer": "No"
    },
    {
      "type": "translate-en",
      "russian": "Пожалуйста",
      "options": ["Thank you", "Hello", "Please", "Goodbye"],
      "answer": "Please"
    },
    {
      "type": "translate-en",
      "russian": "Кот",
      "options": ["Dog", "Bird", "Cat", "Fish"],
      "answer": "Cat"
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Я ___ Иван.",
      "options": ["есть", "быть", "идти", "говорить"],
      "answer": "есть"
    },
    {
      "type": "fill",
      "sentence": "Это мой ___.",
      "options": ["книга", "дом", "стол", "окно"],
      "answer": "дом"
    },
    {
      "type": "fill",
      "sentence": "У меня есть ___.",
      "options": ["стул", "ручка", "тетрадь", "карандаш"],
      "answer": "ручка"
    },
    {
      "type": "fill",
      "sentence": "Меня зовут ___.",
      "options": ["Анна", "читать", "видеть", "слушать"],
      "answer": "Анна"
    },
    {
      "type": "fill",
      "sentence": "Я ___ в школе.",
      "options": ["живу", "сидишь", "идёт", "едите"],
      "answer": "живу"
    },
    {
      "type": "fill",
      "sentence": "Это ___ собака.",
      "options": ["большой", "маленькая", "красивый", "новая"],
      "answer": "большой"
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Добрый день",
      "options": ["Goodbye", "Good morning", "Good afternoon", "Good night"],
      "answer": "Good afternoon"
    },
    {
      "type": "listen",
      "audio": "Как дела?",
      "options": ["What is your name?", "How are you?", "Where are you from?", "What time is it?"],
      "answer": "How are you?"
    },
    {
      "type": "listen",
      "audio": "Мне пять лет",
      "options": ["I am five years old", "I have five books", "I want five apples", "I see five birds"],
      "answer": "I am five years old"
    },
    {
      "type": "listen",
      "audio": "Это яблоко",
      "options": ["This is a banana", "This is an apple", "This is bread", "This is water"],
      "answer": "This is an apple"
    },
    {
      "type": "listen",
      "audio": "Я студент",
      "options": ["I am a teacher", "I am a student", "I am a doctor", "I am an engineer"],
      "answer": "I am a student"
    },
    {
      "type": "listen",
      "audio": "Хорошо",
      "options": ["Bad", "Good", "Excellent", "Terrible"],
      "answer": "Good"
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "I am a student",
      "options": ["Я студент", "Ты студент", "Он студент", "Вы студент"],
      "answer": "Я студент"
    },
    {
      "type": "translate",
      "english": "She is Russian",
      "options": ["Он русский", "Она русская", "Оно русское", "Они русские"],
      "answer": "Она русская"
    },
    {
      "type": "translate",
      "english": "We live in Moscow",
      "options": ["Я живу в Москве", "Ты живёшь в Москве", "Мы живём в Москве", "Они живут в Москве"],
      "answer": "Мы живём в Москве"
    },
    {
      "type": "translate",
      "english": "Do you speak English?",
      "options": ["Я говорю по-английски", "Ты говоришь по-английски?", "Он говорит по-английски", "Мы говорим по-английски"],
      "answer": "Ты говоришь по-английски?"
    },
    {
      "type": "translate",
      "english": "I like apples",
      "options": ["Я люблю яблоки", "Ты любишь яблоки", "Он любит яблоки", "Она любит яблоки"],
      "answer": "Я люблю яблоки"
    },
    {
      "type": "translate",
      "english": "Where is the book?",
      "options": ["Где книга?", "Как книга?", "Какая книга?", "Кто книга?"],
      "answer": "Где книга?"
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Вас спрашивают: 'Как вас зовут?' Вы отвечаете:",
      "options": ["Хорошо", "Я студент", "Меня зовут Петр", "До свидания"],
      "answer": "Меня зовут Петр"
    },
    {
      "type": "mcq",
      "prompt": "Друг говорит: 'Как дела?' Вы говорите:",
      "options": ["Спасибо, хорошо", "Привет!", "Где ты?", "Я не знаю"],
      "answer": "Спасибо, хорошо"
    },
    {
      "type": "mcq",
      "prompt": "Вы встречаете друга утром. Вы говорите:",
      "options": ["Добрый вечер", "Добрый день", "Доброе утро", "Спокойной ночи"],
      "answer": "Доброе утро"
    },
    {
      "type": "mcq",
      "prompt": "Вас благодарят. Вы отвечаете:",
      "options": ["Пожалуйста", "До свидания", "Привет", "Спасибо"],
      "answer": "Пожалуйста"
    },
    {
      "type": "mcq",
      "prompt": "Вы хотите узнать, откуда человек. Вы спрашиваете:",
      "options": ["Как тебя зовут?", "Откуда ты?", "Сколько тебе лет?", "Где ты живёшь?"],
      "answer": "Откуда ты?"
    },
    {
      "type": "mcq",
      "prompt": "Вы уходите домой. Вы говорите:",
      "options": ["Привет", "Добрый день", "До свидания", "Спасибо"],
      "answer": "До свидания"
    }
  ],
  "A2": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "russian": "Я люблю читать книги",
      "options": ["I like to read books", "I read books every day", "I have read books", "I am reading books"],
      "answer": "I like to read books"
    },
    {
      "type": "translate-en",
      "russian": "Она хочет пить воду",
      "options": ["She wants to drink water", "She drinks water", "She is drinking water", "She likes water"],
      "answer": "She wants to drink water"
    },
    {
      "type": "translate-en",
      "russian": "Я могу говорить по-русски",
      "options": ["I can speak Russian", "I like to speak Russian", "I must speak Russian", "I want to speak Russian"],
      "answer": "I can speak Russian"
    },
    {
      "type": "translate-en",
      "russian": "Вчера я был дома",
      "options": ["I am at home", "I was at home yesterday", "I will be at home", "I have been at home"],
      "answer": "I was at home yesterday"
    },
    {
      "type": "translate-en",
      "russian": "Она видела интересный фильм",
      "options": ["She sees an interesting film", "She watched an interesting film", "She watches interesting films", "She will watch a film"],
      "answer": "She watched an interesting film"
    },
    {
      "type": "translate-en",
      "russian": "Это красивое платье",
      "options": ["This is a beautiful dress", "This dress is beautiful", "That is a beautiful dress", "These are beautiful dresses"],
      "answer": "This is a beautiful dress"
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Она любит ___ в парке.",
      "options": ["гулять", "гуляет", "гуляла", "гулял"],
      "answer": "гулять"
    },
    {
      "type": "fill",
      "sentence": "Я ___ фрукты каждый день.",
      "options": ["ем", "есть", "ел", "буду есть"],
      "answer": "ем"
    },
    {
      "type": "fill",
      "sentence": "Вчера мы ___ интересный фильм.",
      "options": ["смотрим", "смотрели", "смотреть", "посмотрим"],
      "answer": "смотрели"
    },
    {
      "type": "fill",
      "sentence": "Это моя ___ сумка.",
      "options": ["новый", "новая", "новое", "новые"],
      "answer": "новая"
    },
    {
      "type": "fill",
      "sentence": "Я не ___ чай.",
      "options": ["люблю", "люби", "любить", "люба"],
      "answer": "люблю"
    },
    {
      "type": "fill",
      "sentence": "Завтра мы ___ в театр.",
      "options": ["идём", "идёте", "пойдём", "идёшь"],
      "answer": "пойдём"
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Я иду в школу",
      "options": ["I went to school", "I go to school", "I will go to school", "I am in school"],
      "answer": "I go to school"
    },
    {
      "type": "listen",
      "audio": "Ты можешь мне помочь?",
      "options": ["Can you help me?", "Will you help me?", "Do you want to help me?", "Did you help me?"],
      "answer": "Can you help me?"
    },
    {
      "type": "listen",
      "audio": "У неё есть кошка",
      "options": ["She likes cats", "She has a cat", "She saw a cat", "She is a cat"],
      "answer": "She has a cat"
    },
    {
      "type": "listen",
      "audio": "Мне не нравится это",
      "options": ["I like this", "I don't like this", "I love this", "I want this"],
      "answer": "I don't like this"
    },
    {
      "type": "listen",
      "audio": "Он работает в офисе",
      "options": ["He worked in the office", "He works in the office", "He will work in the office", "He is working in office"],
      "answer": "He works in the office"
    },
    {
      "type": "listen",
      "audio": "Где твоя сестра?",
      "options": ["When is your sister?", "What is your sister?", "Where is your sister?", "Who is your sister?"],
      "answer": "Where is your sister?"
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "I want to eat pizza",
      "options": ["Я хочу пиццу", "Я люблю пиццу", "Я ем пиццу", "Я хочу есть пиццу"],
      "answer": "Я хочу есть пиццу"
    },
    {
      "type": "translate",
      "english": "They went to the market",
      "options": ["Они идут на рынок", "Они ходили на рынок", "Они идут в рынок", "Они пошли на рынок"],
      "answer": "Они пошли на рынок"
    },
    {
      "type": "translate",
      "english": "She does not want to dance",
      "options": ["Она не хочет танцевать", "Она не танцует", "Она не танцевала", "Она не может танцевать"],
      "answer": "Она не хочет танцевать"
    },
    {
      "type": "translate",
      "english": "Do you like Russian food?",
      "options": ["Тебе нравится русская еда?", "Ты любишь русскую еду?", "Ты хочешь русскую еду?", "Ты ешь русскую еду?"],
      "answer": "Ты любишь русскую еду?"
    },
    {
      "type": "translate",
      "english": "Yesterday I saw a bear",
      "options": ["Я видел медведя вчера", "Я вижу медведя вчера", "Вчера я видел медведя", "Я буду видеть медведя вчера"],
      "answer": "Вчера я видел медведя"
    },
    {
      "type": "translate",
      "english": "This is their house",
      "options": ["Это их дом", "Это дом их", "Это домом их", "Это дома их"],
      "answer": "Это их дом"
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Вы спрашиваете друга: 'Когда ты придёшь?'",
      "options": ["Я хочу идти", "Я приду завтра", "Мне нужно идти", "Я уже пришёл"],
      "answer": "Я приду завтра"
    },
    {
      "type": "mcq",
      "prompt": "Ваш друг говорит: 'Я новый студент.' Вы отвечаете:",
      "options": ["Добро пожаловать!", "До свидания!", "Спасибо!", "Хорошо!"],
      "answer": "Добро пожаловать!"
    },
    {
      "type": "mcq",
      "prompt": "Ваша мама спрашивает: 'Где ты был?' Вы говорите:",
      "options": ["Я в школе", "Я был в школе", "Я буду в школе", "Я хожу в школу"],
      "answer": "Я был в школе"
    },
    {
      "type": "mcq",
      "prompt": "Кто-то приносит вам подарок. Вы говорите:",
      "options": ["Спасибо большое!", "Пожалуйста!", "До свидания!", "Как дела?"],
      "answer": "Спасибо большое!"
    },
    {
      "type": "mcq",
      "prompt": "Вы в ресторане. Официант спрашивает: 'Что вы хотите?'",
      "options": ["Я хочу салат и воду", "Я люблю еду", "Это вкусно", "Мне нравится"],
      "answer": "Я хочу салат и воду"
    },
    {
      "type": "mcq",
      "prompt": "Ваш друг болен. Вы говорите:",
      "options": ["Поздравляю!", "Выздоравливай!", "Спасибо!", "Хорошо!"],
      "answer": "Выздоравливай!"
    }
  ],
  "B1": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "russian": "Если бы я знал ответ, я бы тебе сказал",
      "options": ["If I know the answer, I will tell you", "If I knew the answer, I would tell you", "If I knew the answer, I tell you", "If I will know, I would tell"],
      "answer": "If I knew the answer, I would tell you"
    },
    {
      "type": "translate-en",
      "russian": "Статья написана известным автором",
      "options": ["The author writes the article", "The article is written by a famous author", "The famous author writes articles", "The article was wrote by the author"],
      "answer": "The article is written by a famous author"
    },
    {
      "type": "translate-en",
      "russian": "Меня интересуют русские традиции",
      "options": ["I am interested in Russian traditions", "I interest Russian traditions", "Russian traditions interest me to", "I like Russian traditions very much"],
      "answer": "I am interested in Russian traditions"
    },
    {
      "type": "translate-en",
      "russian": "Хотя он не говорил по-русски, он понимал всё",
      "options": ["Although he did not speak Russian, he understood everything", "He didn't speak Russian so he understood", "While speaking Russian, he understood", "Although understanding Russian, he didn't speak"],
      "answer": "Although he did not speak Russian, he understood everything"
    },
    {
      "type": "translate-en",
      "russian": "Эта книга интереснее, чем та",
      "options": ["This book is more interesting than that one", "This book is more interesting as that", "This book is interesting and that book too", "This book and that book are interesting"],
      "answer": "This book is more interesting than that one"
    },
    {
      "type": "translate-en",
      "russian": "В течение года он закончил четыре курса",
      "options": ["For a year he will complete four courses", "During the year he completed four courses", "In year he is completing courses", "For year he was complete four courses"],
      "answer": "During the year he completed four courses"
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Он говорил о своём ___ в жизни.",
      "options": ["опыт", "опыте", "опыта", "опытом"],
      "answer": "опыте"
    },
    {
      "type": "fill",
      "sentence": "Мы спорили о том, ___ ли справедлив закон.",
      "options": ["является", "быть", "есть", "быв"],
      "answer": "является"
    },
    {
      "type": "fill",
      "sentence": "Несмотря на трудность, он ___ задачу.",
      "options": ["решал", "решил", "решает", "будет решать"],
      "answer": "решил"
    },
    {
      "type": "fill",
      "sentence": "Это событие ___ значительное влияние на общество.",
      "options": ["имело", "имеет", "имев", "имея"],
      "answer": "имело"
    },
    {
      "type": "fill",
      "sentence": "Учитель объяснил нам правило ___ понятно.",
      "options": ["вполне", "полностью", "совсем", "достаточно"],
      "answer": "вполне"
    },
    {
      "type": "fill",
      "sentence": "Книга была ___ с большим интересом.",
      "options": ["читаема", "читана", "читать", "читаемая"],
      "answer": "читана"
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Я считаю, что образование очень важно",
      "options": ["Education is very important", "I think education is very important", "He believes education is important", "Education must be important"],
      "answer": "I think education is very important"
    },
    {
      "type": "listen",
      "audio": "По мнению экспертов, климат изменяется",
      "options": ["The climate is changing according to experts", "Experts think climate will change", "Climate changes expert opinion", "The experts are changing the climate"],
      "answer": "The climate is changing according to experts"
    },
    {
      "type": "listen",
      "audio": "Независимо от результата, мы продолжим работу",
      "options": ["We will stop working regardless", "Regardless of the result, we will continue working", "We work because of the result", "We stopped working about result"],
      "answer": "Regardless of the result, we will continue working"
    },
    {
      "type": "listen",
      "audio": "Это произведение было признано шедевром",
      "options": ["This work was recognized as a masterpiece", "This work recognized a masterpiece", "This masterpiece was recognized", "He recognized this as a work"],
      "answer": "This work was recognized as a masterpiece"
    },
    {
      "type": "listen",
      "audio": "Развитие технологии способствует прогрессу",
      "options": ["Technology is progress", "Development of technology contributes to progress", "Technology prevents progress", "Progress causes technology development"],
      "answer": "Development of technology contributes to progress"
    },
    {
      "type": "listen",
      "audio": "Будучи студентом, он уже работал",
      "options": ["He worked when he was a student", "Being a student, he was already working", "He is a working student", "He studied while working"],
      "answer": "Being a student, he was already working"
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "Despite the difficulties, he succeeded",
      "options": ["Несмотря на трудности, он успел", "Несмотря трудности, он успел", "Несмотря на трудности, он удался", "По трудностям, он успел"],
      "answer": "Несмотря на трудности, он успел"
    },
    {
      "type": "translate",
      "english": "If he had known, he would not have come",
      "options": ["Если он знал бы, он не пришёл бы", "Если бы он знал, он бы не пришёл", "Если бы он знал, он не пришёл", "Если он будет знать, он не придёт"],
      "answer": "Если бы он знал, он бы не пришёл"
    },
    {
      "type": "translate",
      "english": "This city is more beautiful than that one",
      "options": ["Этот город красивее, чем тот", "Этот город более красивый, чем тот", "Этот город красивый, чем тот", "Этот город красивее того"],
      "answer": "Этот город красивее, чем тот"
    },
    {
      "type": "translate",
      "english": "The letter was signed by the director",
      "options": ["Письмо подписано директором", "Письмо подписал директор", "Директор подписал письмо", "Письмо было подписано от директора"],
      "answer": "Письмо подписано директором"
    },
    {
      "type": "translate",
      "english": "He spoke as though he knew everything",
      "options": ["Он говорил, как будто он всё знал", "Он говорит, как будто знает всё", "Он говорит так, что знает всё", "Он говорил как ему всё знать"],
      "answer": "Он говорил, как будто он всё знал"
    },
    {
      "type": "translate",
      "english": "We are interested in this project",
      "options": ["Мы интересуемся этим проектом", "Мы заинтересованы этим проектом", "Мы интересуемся в этом проекте", "Мы интересованы на этот проект"],
      "answer": "Мы интересуемся этим проектом"
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Во время презентации вы хотите выразить согласие с мнением коллеги:",
      "options": ["Я не согласен", "Я полностью согласен с вами", "Мне не нравится", "Это неправильно"],
      "answer": "Я полностью согласен с вами"
    },
    {
      "type": "mcq",
      "prompt": "Вам нужно вежливо выразить сомнение в предложении:",
      "options": ["Это глупая идея", "Я не уверен, что это сработает", "Это не сработает", "Вы не правы"],
      "answer": "Я не уверен, что это сработает"
    },
    {
      "type": "mcq",
      "prompt": "На встречу пришло меньше людей, чем ожидалось. Вы говорите:",
      "options": ["Много людей пришло", "Как жаль, что меньше людей, чем мы ожидали", "Людей не было", "Это хорошо"],
      "answer": "Как жаль, что меньше людей, чем мы ожидали"
    },
    {
      "type": "mcq",
      "prompt": "Вам предлагают помощь, но вы её не нуждаетесь. Вы говорите:",
      "options": ["Да, помогите мне", "Спасибо, но я могу справиться сам", "Нет, я не помощь", "Мне нужна помощь"],
      "answer": "Спасибо, но я могу справиться сам"
    },
    {
      "type": "mcq",
      "prompt": "Обсуждая статью, вы хотите привести свой пример:",
      "options": ["Статья неправильная", "Например, когда я был студентом...", "Это похоже на мою книгу", "Я не знаю примеров"],
      "answer": "Например, когда я был студентом..."
    },
    {
      "type": "mcq",
      "prompt": "Вам нужно объяснить причину своего опоздания на встречу:",
      "options": ["Я не хотел приходить", "Из-за пробки на дороге я опоздал", "Встреча была скучная", "Мне не понравилось время"],
      "answer": "Из-за пробки на дороге я опоздал"
    }
  ],
  "B2": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "russian": "Притом что он был способен, он не очень старался",
      "options": ["Though he was able, he did not try very hard", "Because he was able, he didn't try hard", "When he was able, he tried hard", "Since he was able, he didn't work hard"],
      "answer": "Though he was able, he did not try very hard"
    },
    {
      "type": "translate-en",
      "russian": "Проблема заключается в том, что нам не хватает ресурсов",
      "options": ["We have a problem about resources", "The problem is that we lack resources", "We lack problem of resources", "Resources are problems for us"],
      "answer": "The problem is that we lack resources"
    },
    {
      "type": "translate-en",
      "russian": "Было бы желательно, чтобы участники пришли на час раньше",
      "options": ["Participants should come earlier", "It would be desirable if participants came an hour earlier", "Participants would come earlier", "It is desired that participants come"],
      "answer": "It would be desirable if participants came an hour earlier"
    },
    {
      "type": "translate-en",
      "russian": "Его интерпретация произведения была оригинальна и проницательна",
      "options": ["His interpretation was original and had insight", "His interpretation was original and sharp", "His interpretation of the work was original and insightful", "His work interpretation was original insight"],
      "answer": "His interpretation of the work was original and insightful"
    },
    {
      "type": "translate-en",
      "russian": "Следовательно, можно сделать вывод, что данные недостоверны",
      "options": ["Therefore, the data is not reliable", "Consequently, one can conclude that the data is unreliable", "Therefore, data is not truth", "So the data must not be trusted"],
      "answer": "Consequently, one can conclude that the data is unreliable"
    },
    {
      "type": "translate-en",
      "russian": "С точки зрения экономики, этот проект имеет смысл",
      "options": ["This project makes sense for economy", "From an economic perspective, this project makes sense", "Economically, this project is sense", "This project economically means sense"],
      "answer": "From an economic perspective, this project makes sense"
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Несмотря на ___ на рынке, компания продолжает развиваться.",
      "options": ["конкуренцию", "конкуренции", "конкурента", "конкурентов"],
      "answer": "конкуренцию"
    },
    {
      "type": "fill",
      "sentence": "Он предложил ___ стратегию, которую мы не рассматривали.",
      "options": ["альтернативную", "альтернативный", "альтернативное", "альтернативных"],
      "answer": "альтернативную"
    },
    {
      "type": "fill",
      "sentence": "Это исследование ___ на анализе большого количества данных.",
      "options": ["основано", "основано", "основанное", "основывается"],
      "answer": "основано"
    },
    {
      "type": "fill",
      "sentence": "К сожалению, его ___ в этом деле привело к провалу.",
      "options": ["невежество", "невежество", "невежественность", "невежественный"],
      "answer": "невежество"
    },
    {
      "type": "fill",
      "sentence": "Статистика ___, что большинство одобряет новый закон.",
      "options": ["показывает", "показывает", "показав", "показавшая"],
      "answer": "показывает"
    },
    {
      "type": "fill",
      "sentence": "Его ___ к работе была замечена всеми коллегами.",
      "options": ["ответственность", "ответственная", "ответственно", "ответственного"],
      "answer": "ответственность"
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Во-первых, нужно понять, что проблема существует уже давно",
      "options": ["First, we must understand the problem exists", "First of all, one must understand that the problem has existed for a long time", "We understand the problem first", "The first problem is understanding"],
      "answer": "First of all, one must understand that the problem has existed for a long time"
    },
    {
      "type": "listen",
      "audio": "Исходя из вышесказанного, можно предположить следующее",
      "options": ["Based on what was said, we can assume the following", "From this, we can say something", "The above means we can suppose", "Based on previous, we suppose"],
      "answer": "Based on what was said, we can assume the following"
    },
    {
      "type": "listen",
      "audio": "Этот подход, в отличие от предыдущего, оказался более эффективным",
      "options": ["This approach was more effective unlike before", "This approach, unlike the previous one, proved more effective", "Unlike before, this approach was effective", "This different approach was more effective"],
      "answer": "This approach, unlike the previous one, proved more effective"
    },
    {
      "type": "listen",
      "audio": "Необходимо подчеркнуть, что данные требуют тщательной интерпретации",
      "options": ["Data needs careful interpretation", "It must be noted that the data requires careful interpretation", "Data interpretation must be careful", "We need to interpret this data carefully"],
      "answer": "It must be noted that the data requires careful interpretation"
    },
    {
      "type": "listen",
      "audio": "Принимая во внимание сложность проблемы, решение было неплохим",
      "options": ["Considering the complexity, the solution was good", "Taking into account the complexity of the problem, the solution was quite good", "The problem complexity was solved", "The solution was complex but good"],
      "answer": "Taking into account the complexity of the problem, the solution was quite good"
    },
    {
      "type": "listen",
      "audio": "Можно утверждать, что предложение содержит элемент истины",
      "options": ["The proposal contains truth", "It can be argued that the proposal contains an element of truth", "The proposal has some truth", "The truth element is in the proposal"],
      "answer": "It can be argued that the proposal contains an element of truth"
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "The situation is ambiguous and requires further clarification",
      "options": ["Ситуация двусмысленна и требует дальнейшего уточнения", "Ситуация неясна и нужна дополнительная информация", "Ситуация требует уточнение и является неоднозначной", "Ситуация темная и нужно её разъяснить"],
      "answer": "Ситуация двусмысленна и требует дальнейшего уточнения"
    },
    {
      "type": "translate",
      "english": "In view of the above facts, the hypothesis appears valid",
      "options": ["В свете указанных фактов гипотеза кажется обоснованной", "По указанным фактам, гипотеза обоснована", "Исходя из факторов, гипотеза действительна", "Учитывая фактов, гипотеза валидна"],
      "answer": "В свете указанных фактов гипотеза кажется обоснованной"
    },
    {
      "type": "translate",
      "english": "The author's argument is based on insufficient evidence",
      "options": ["Аргумент автора основан на недостаточных доказательствах", "Доказательства автора недостаточны", "Автор недостаточно аргументирует", "Аргумент базирован на нехватке фактов"],
      "answer": "Аргумент автора основан на недостаточных доказательствах"
    },
    {
      "type": "translate",
      "english": "We should not dismiss this possibility without further investigation",
      "options": ["Мы не должны отвергать эту возможность без дальнейшего расследования", "Мы не должны отклонить эту возможность не исследовав", "Нельзя отказываться от возможности без изучения", "Мы не примем эту возможность без исследования"],
      "answer": "Мы не должны отвергать эту возможность без дальнейшего расследования"
    },
    {
      "type": "translate",
      "english": "The implementation of these measures would significantly improve the situation",
      "options": ["Введение этих мер значительно улучшит ситуацию", "Исполнение этих мер значительно улучшало ситуацию", "Реализация этих мер значительно улучшила бы ситуацию", "Эти меры значительно улучшают положение дел"],
      "answer": "Реализация этих мер значительно улучшила бы ситуацию"
    },
    {
      "type": "translate",
      "english": "It stands to reason that such an approach lacks merit",
      "options": ["Понятно, что такой подход лишён достоинства", "Очевидно, что такой подход не имеет смысла", "Ясно, что подобный подход чужд качеств", "Логично, что такой метод хуже других"],
      "answer": "Очевидно, что такой подход не имеет смысла"
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Вам нужно критически оценить доклад коллеги. Вы говорите:",
      "options": ["Доклад хороший", "Доклад содержит интересные идеи, однако я бы оспорил его главный вывод", "Это полная чушь", "Мне не нравится"],
      "answer": "Доклад содержит интересные идеи, однако я бы оспорил его главный вывод"
    },
    {
      "type": "mcq",
      "prompt": "В статье приводятся противоречивые данные. Вы пишете:",
      "options": ["Статья неправильна", "На мой взгляд, авторам следовало бы объяснить расхождение в данных", "Данные ошибочны", "Это ничего не значит"],
      "answer": "На мой взгляд, авторам следовало бы объяснить расхождение в данных"
    },
    {
      "type": "mcq",
      "prompt": "Вы предлагаете альтернативный подход к проблеме:",
      "options": ["Вот лучший способ", "Вместо этого можно рассмотреть следующий подход", "Это неправильно", "Пусть делают по-другому"],
      "answer": "Вместо этого можно рассмотреть следующий подход"
    },
    {
      "type": "mcq",
      "prompt": "На собрании обсуждается компромисс. Вы говорите:",
      "options": ["Это плохой компромисс", "Хотя это решение имеет недостатки, оно кажется приемлемым в текущих обстоятельствах", "Это не сработает", "Я против"],
      "answer": "Хотя это решение имеет недостатки, оно кажется приемлемым в текущих обстоятельствах"
    },
    {
      "type": "mcq",
      "prompt": "Вы резюмируете дискуссию. Вы говорите:",
      "options": ["Все согласны", "Подводя итог, мы согласились рассмотреть обе стороны вопроса и наметить план дальнейших действий", "Мы говорили много", "Всё хорошо"],
      "answer": "Подводя итог, мы согласились рассмотреть обе стороны вопроса и наметить план дальнейших действий"
    },
    {
      "type": "mcq",
      "prompt": "Вы выражаете осторожность перед новым предложением:",
      "options": ["Идея хороша", "Хотя идея привлекательна, я бы рекомендовал провести тщательный анализ рисков перед её реализацией", "Это плохая идея", "Нет, это не работает"],
      "answer": "Хотя идея привлекательна, я бы рекомендовал провести тщательный анализ рисков перед её реализацией"
    }
  ],
  "C1": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "russian": "Акцентируя внимание на эпистемологических основах, автор демонстрирует филологическую эрудицию",
      "options": ["The author shows knowledge about epistemology", "By emphasizing epistemological foundations, the author demonstrates philological erudition", "The author writes about epistemology and language", "Epistemology and language erudition are shown"],
      "answer": "By emphasizing epistemological foundations, the author demonstrates philological erudition"
    },
    {
      "type": "translate-en",
      "russian": "Парадигматический сдвиг в научном дискурсе обусловлен методологическими инновациями",
      "options": ["Scientific discourse changed methods", "The paradigmatic shift in scientific discourse is conditioned by methodological innovations", "Methods innovate scientific discussions", "Scientific thinking changed due to new procedures"],
      "answer": "The paradigmatic shift in scientific discourse is conditioned by methodological innovations"
    },
    {
      "type": "translate-en",
      "russian": "Анализируя рецепцию текста, необходимо учитывать интерпретативные стратегии читателя",
      "options": ["Readers interpret texts differently", "When analyzing the reception of the text, one must consider the reader's interpretative strategies", "The reader's interpretation matters for analysis", "Text reception is interpreted by readers"],
      "answer": "When analyzing the reception of the text, one must consider the reader's interpretative strategies"
    },
    {
      "type": "translate-en",
      "russian": "Дихотомия между номинальным и реальным определением эксплицирует фундаментальное противоречие",
      "options": ["Definitions are contradictory", "The dichotomy between nominal and real definition explicates a fundamental contradiction", "Real and nominal definitions are opposite", "Defining terms shows contradictions"],
      "answer": "The dichotomy between nominal and real definition explicates a fundamental contradiction"
    },
    {
      "type": "translate-en",
      "russian": "Полисемия лексических единиц создаёт амбивалентность семантического пространства",
      "options": ["Words have many meanings", "The polysemy of lexical units creates ambivalence in semantic space", "Polysemous words make meanings unclear", "Semantic meanings are ambiguous because of words"],
      "answer": "The polysemy of lexical units creates ambivalence in semantic space"
    },
    {
      "type": "translate-en",
      "russian": "Апелляция к авторитету, будучи логическим приёмом, тем не менее содержит потенциал манипуляции",
      "options": ["Authority is good in logic", "Appeal to authority, being a logical device, nonetheless contains the potential for manipulation", "Using authority is manipulative", "Authority in logic is manipulated"],
      "answer": "Appeal to authority, being a logical device, nonetheless contains the potential for manipulation"
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Аллюзивность текста ___ реципиента к активному декодированию интертекстуальных связей.",
      "options": ["обязывает", "побуждает", "заставляет", "принуждает"],
      "answer": "побуждает"
    },
    {
      "type": "fill",
      "sentence": "Гегемоническая позиция дискурса ___ альтернативные нарративы на периферию общественного внимания.",
      "options": ["перемещает", "вытесняет", "смещает", "удаляет"],
      "answer": "вытесняет"
    },
    {
      "type": "fill",
      "sentence": "Герменевтическая деятельность ___ необходимость контекстуализации символических форм.",
      "options": ["допускает", "предполагает", "требует", "позволяет"],
      "answer": "предполагает"
    },
    {
      "type": "fill",
      "sentence": "Редукционистский подход ___ сложность многоуровневых систем в угоду монистической модели.",
      "options": ["скрывает", "затемняет", "элиминирует", "упрощает"],
      "answer": "элиминирует"
    },
    {
      "type": "fill",
      "sentence": "Трансцендентальная критика Канта ___ фундаментальное отличие между явлением и ноуменом.",
      "options": ["выделяет", "устанавливает", "акцентирует", "подтверждает"],
      "answer": "устанавливает"
    },
    {
      "type": "fill",
      "sentence": "Синергетический эффект от взаимодействия компонентов ___ эмергентные свойства системы.",
      "options": ["создаёт", "порождает", "генерирует", "производит"],
      "answer": "порождает"
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Концептуализация феномена через призму структурализма раскрывает имплицитные измерения реальности",
      "options": ["Structuralism explains phenomena", "The conceptualization of the phenomenon through the prism of structuralism reveals the implicit dimensions of reality", "Reality has structural dimensions", "Structuralism is about reality concepts"],
      "answer": "The conceptualization of the phenomenon through the prism of structuralism reveals the implicit dimensions of reality"
    },
    {
      "type": "listen",
      "audio": "Прагматическая ориентация филологического анализа манифестирует его применимость к актуальным дискурсивным практикам",
      "options": ["Philology is practical", "The pragmatic orientation of philological analysis manifests its applicability to current discursive practices", "Analysis is practical for language study", "Philology applies to current discourse"],
      "answer": "The pragmatic orientation of philological analysis manifests its applicability to current discursive practices"
    },
    {
      "type": "listen",
      "audio": "Семиотическая амбигуальность символов генерирует множественность смыслов в процессе декодирования",
      "options": ["Symbols have one meaning", "The semiotic ambiguity of symbols generates a multiplicity of meanings in the decoding process", "Symbols are ambiguous in language", "Decoding creates symbol meanings"],
      "answer": "The semiotic ambiguity of symbols generates a multiplicity of meanings in the decoding process"
    },
    {
      "type": "listen",
      "audio": "Методология компаративного анализа архаичных текстов допускает реконструкцию прототипических смысловых структур",
      "options": ["Ancient texts are compared", "The methodology of comparative analysis of archaic texts allows the reconstruction of prototypical semantic structures", "Analyzing old texts reveals meanings", "Comparative method reconstructs text meaning"],
      "answer": "The methodology of comparative analysis of archaic texts allows the reconstruction of prototypical semantic structures"
    },
    {
      "type": "listen",
      "audio": "Дискурсивная стратегия автора артикулирует скрытую идеологему, существующую в интерстициях текста",
      "options": ["The author writes ideology", "The author's discursive strategy articulates a hidden ideologeme existing in the interstices of the text", "Ideology is hidden in text", "Strategy reveals text meaning"],
      "answer": "The author's discursive strategy articulates a hidden ideologeme existing in the interstices of the text"
    },
    {
      "type": "listen",
      "audio": "Экспликация онтологических предпосылок философского дискурса критически релевантна для его адекватного понимания",
      "options": ["Ontology is philosophical", "Explication of the ontological presuppositions of philosophical discourse is critically relevant for its adequate understanding", "Understanding philosophy requires ontology", "Philosophical discourse assumes ontology"],
      "answer": "Explication of the ontological presuppositions of philosophical discourse is critically relevant for its adequate understanding"
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "The multifaceted nature of the phenomenon necessitates a pluralistic epistemological approach",
      "options": ["Многоаспектный характер явления требует плюралистического эпистемологического подхода", "Явление имеет много аспектов и нужен подход", "Плюрализм необходим для явления", "Многоуровневое явление требует подхода"],
      "answer": "Многоаспектный характер явления требует плюралистического эпистемологического подхода"
    },
    {
      "type": "translate",
      "english": "The genealogical deconstruction of teleological narratives unveils the contingency of putative inevitabilities",
      "options": ["Генеалогическая деконструкция телеологических нарративов раскрывает контингентность предполагаемых неизбежностей", "Генеалогия разрушает идеи неизбежности", "Нарративы телеологичны и контингентны", "Декструкция показывает неизбежность"],
      "answer": "Генеалогическая деконструкция телеологических нарративов раскрывает контингентность предполагаемых неизбежностей"
    },
    {
      "type": "translate",
      "english": "The phenomenological bracketing of ontological commitments permits the elucidation of transcendental structures",
      "options": ["Феноменологическое брекетирование онтологических обязательств позволяет уточнить трансцендентальные структуры", "Феноменология раскрывает структуры", "Онтология и феноменология связаны", "Трансцендентальные структуры нужны"],
      "answer": "Феноменологическое брекетирование онтологических обязательств позволяет уточнить трансцендентальные структуры"
    },
    {
      "type": "translate",
      "english": "The aporias inherent in the representationalist paradigm necessitate a comprehensive reconceptualization of epistemic relationality",
      "options": ["Апории репрезентационалистской парадигмы требуют полной переконцептуализации эпистемической реляциональности", "Репрезентационализм имеет проблемы", "Парадигма нуждается в новых идеях", "Эпистемология и апории связаны"],
      "answer": "Апории репрезентационалистской парадигмы требуют полной переконцептуализации эпистемической реляциональности"
    },
    {
      "type": "translate",
      "english": "The hermeneutical fusion of horizons facilitates the transcendence of historical alterity through dialogical engagement",
      "options": ["Герменевтическое слияние горизонтов облегчает преодоление исторической инаковости через диалогическое взаимодействие", "Герменевтика и история связаны", "Диалог преодолевает различия", "Слияние горизонтов происходит"],
      "answer": "Герменевтическое слияние горизонтов облегчает преодоление исторической инаковости через диалогическое взаимодействие"
    },
    {
      "type": "translate",
      "english": "The sublation of subject-object dualism engendered by dialectical thought constitutes a paradigmatic reorientation of philosophical inquiry",
      "options": ["Снятие дуализма субъекта и объекта, порождённое диалектическим мышлением, представляет парадигматическую переориентацию философского исследования", "Диалектика снимает дуализм", "Философское исследование переориентируется", "Субъект и объект связаны"],
      "answer": "Снятие дуализма субъекта и объекта, порождённое диалектическим мышлением, представляет парадигматическую переориентацию философского исследования"
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Критикуя редукционистскую методологию, вы утверждаете:",
      "options": ["Редукционизм хорош", "Хотя редукционизм обладает определённой эвристической ценностью, его применение к сложным системам нередко оборачивается элиминацией существенных аспектов анализируемого феномена", "Редукционизм неправилен", "Методология плохая"],
      "answer": "Хотя редукционизм обладает определённой эвристической ценностью, его применение к сложным системам нередко оборачивается элиминацией существенных аспектов анализируемого феномена"
    },
    {
      "type": "mcq",
      "prompt": "Обсуждая интертекстуальность произведения, вы замечаете:",
      "options": ["Текст имеет ссылки", "Полисемия текстовых аллюзий порождает множественность прочитаний, каждое из которых актуализирует различные потенциальности смыслового поля", "Ссылки в тексте", "Текст интересен"],
      "answer": "Полисемия текстовых аллюзий порождает множественность прочитаний, каждое из которых актуализирует различные потенциальности смыслового поля"
    },
    {
      "type": "mcq",
      "prompt": "Оценивая методологическую обоснованность аргумента, вы говорите:",
      "options": ["Аргумент верен", "Следует отметить, что аргумент, несмотря на логическую стройность, нуждается в эмпирической верификации и дополнительной операционализации своих центральных концептов", "Это неверно", "Аргумент неправилен"],
      "answer": "Следует отметить, что аргумент, несмотря на логическую стройность, нуждается в эмпирической верификации и дополнительной операционализации своих центральных концептов"
    },
    {
      "type": "mcq",
      "prompt": "Исследуя философскую позицию автора, вы констатируете:",
      "options": ["Позиция ясна", "Экспликация метафизических предпосылок философского дискурса автора обнаруживает скрытую номиналистическую ориентацию, которая существенным образом детерминирует его аргументативное развёртывание", "Позиция неверна", "Автор философ"],
      "answer": "Экспликация метафизических предпосылок философского дискурса автора обнаруживает скрытую номиналистическую ориентацию, которая существенным образом детерминирует его аргументативное развёртывание"
    },
    {
      "type": "mcq",
      "prompt": "Анализируя дискурсивные стратегии текста, вы отмечаете:",
      "options": ["Стратегии хорошие", "Нарративное конструирование реальности осуществляется посредством рекуррентных риторических операций, которые постепенно устанавливают гегемонию определённого смыслового фрейма", "Текст интересен", "Стратегии используются"],
      "answer": "Нарративное конструирование реальности осуществляется посредством рекуррентных риторических операций, которые постепенно устанавливают гегемонию определённого смыслового фрейма"
    },
    {
      "type": "mcq",
      "prompt": "Подвергая критике позитивистский подход, вы утверждаете:",
      "options": ["Позитивизм хорош", "Несмотря на претензии позитивизма на объективность, его конstitutive presuppositions остаются скрыты от критического анализа, что делает его уязвимым для концептуальной деконструкции", "Позитивизм неверен", "Это плохой подход"],
      "answer": "Несмотря на претензии позитивизма на объективность, его конstitutive presuppositions остаются скрыты от критического анализа, что делает его уязвимым для концептуальной деконструкции"
    }
  ],
  "C2": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "russian": "Аполитичность философской рефлексии оказывается иллюзорной в свете герменевтического разоблачения имманентной идеологичности любого дискурса",
      "options": ["Philosophy is apolitical", "The apoliticity of philosophical reflection proves illusory in the light of hermeneutic exposure of the immanent ideological nature of any discourse", "Philosophy and politics are separate", "Ideology is always in discourse"],
      "answer": "The apoliticity of philosophical reflection proves illusory in the light of hermeneutic exposure of the immanent ideological nature of any discourse"
    },
    {
      "type": "translate-en",
      "russian": "Трансцендентальная дедукция категорий сопряжена с апорией самообоснования, обнажающей абиссальность трансцендентальных условий познания",
      "options": ["Categories are transcendental", "The transcendental deduction of categories is fraught with the aporia of self-justification, exposing the abyssal nature of transcendental conditions of knowledge", "Knowledge needs transcendence", "Deduction shows aporias"],
      "answer": "The transcendental deduction of categories is fraught with the aporia of self-justification, exposing the abyssal nature of transcendental conditions of knowledge"
    },
    {
      "type": "translate-en",
      "russian": "Биополитическая диспозиция модерного государства функционирует посредством осуществления дисциплинарного надзора над вымышленной жизнью общества",
      "options": ["States control life", "The biopolitical disposition of the modern state functions through the exercise of disciplinary surveillance over the fictional life of society", "Discipline and life in modern state", "Government controls populations"],
      "answer": "The biopolitical disposition of the modern state functions through the exercise of disciplinary surveillance over the fictional life of society"
    },
    {
      "type": "translate-en",
      "russian": "Поэтика архитектурного пространства кодифицирует социальные иерархии, отворяя сосуды скрытых властных отношений в видимости материального порядка",
      "options": ["Architecture shows design", "The poetics of architectural space codifies social hierarchies, opening the vessels of hidden power relations in the appearance of material order", "Architecture is about power", "Space structures society"],
      "answer": "The poetics of architectural space codifies social hierarchies, opening the vessels of hidden power relations in the appearance of material order"
    },
    {
      "type": "translate-en",
      "russian": "Симулякричность постмодернистского текста корумпирует онтологический статус различия между копией и оригиналом, растворяя их в безразличии гиперреальности",
      "options": ["Postmodernism is about texts", "The simulacral nature of postmodern text corrupts the ontological status of the difference between copy and original, dissolving them in the indifference of hyperreality", "Texts and reality are different", "Postmodernism is unreal"],
      "answer": "The simulacral nature of postmodern text corrupts the ontological status of the difference between copy and original, dissolving them in the indifference of hyperreality"
    },
    {
      "type": "translate-en",
      "russian": "Субтильность экзистенциальной ангажированности в предельных ситуациях расстраивает гомогенность социального консенсуса, открывая щель аутентичного опыта",
      "options": ["Existence is authentic", "The subtlety of existential engagement in ultimate situations disrupts the homogeneity of social consensus, opening a fissure of authentic experience", "Situations are limiting", "Experience reveals truth"],
      "answer": "The subtlety of existential engagement in ultimate situations disrupts the homogeneity of social consensus, opening a fissure of authentic experience"
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Ризоматическая структура текста ___ иерархическое и логоцентрическое прочтение, постулируя вместо того множественность нелинейных связей.",
      "options": ["подрывает", "расстраивает", "дезавуирует", "упраздняет"],
      "answer": "дезавуирует"
    },
    {
      "type": "fill",
      "sentence": "Остраненный взгляд критики ___ окостенелые суждения обыденного сознания, материализуя их отчуждённость и конвенциональность.",
      "options": ["деавтоматизирует", "дефамилиаризирует", "отчуждает", "эстранжирует"],
      "answer": "деавтоматизирует"
    },
    {
      "type": "fill",
      "sentence": "Амбивалентная позиция субъекта ___ модернистскому проекту просвещения своей неразрешимостью и внутренней противоречивостью.",
      "options": ["саботирует", "подрывает", "нивелирует", "имплодирует"],
      "answer": "саботирует"
    },
    {
      "type": "fill",
      "sentence": "Трансгрессивная энергия революционного жеста ___ границы символического порядка, открывая доступ к неподвластному кодификации остатку реального.",
      "options": ["преодолевает", "трансцендирует", "пробивает", "проступает"],
      "answer": "трансцендирует"
    },
    {
      "type": "fill",
      "sentence": "Пустота гипостазированного центра ___ любую попытку стабилизации смысла, конституируя логику перманентной дифферанции.",
      "options": ["парализует", "отрицает", "блокирует", "пресекает"],
      "answer": "парализует"
    },
    {
      "type": "fill",
      "sentence": "Архаическое измерение языка ___ под слоями исторической наслоённости, манифестируя присутствие забытого в структуре современности.",
      "options": ["пульсирует", "тлеет", "трепещет", "вибрирует"],
      "answer": "пульсирует"
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Мейнстримная критика, будучи не в состоянии артикулировать своё собственное условие возможности, остаётся заложницей тех самых репрессивных структур, которые она претендует подвергать анализу",
      "options": ["Mainstream criticism fails", "Mainstream criticism, being unable to articulate its own condition of possibility, remains a hostage to those very repressive structures which it claims to analyze", "Critics are trapped", "Analysis is impossible"],
      "answer": "Mainstream criticism, being unable to articulate its own condition of possibility, remains a hostage to those very repressive structures which it claims to analyze"
    },
    {
      "type": "listen",
      "audio": "Неразложимость события на его компоненты указывает на экстатическую природу истины, превосходящую логику идентичности",
      "options": ["Events are complex", "The irreducibility of the event to its components points to the ecstatic nature of truth, exceeding the logic of identity", "Truth is ecstatic", "Events cannot be analyzed"],
      "answer": "The irreducibility of the event to its components points to the ecstatic nature of truth, exceeding the logic of identity"
    },
    {
      "type": "listen",
      "audio": "Сверхдетерминированность структуры ткёт паутину причинно-следственных отношений, в которых субъект оказывается узлом пересечения множественных диспозиций",
      "options": ["Structure determines everything", "The overdetermination of structure weaves a web of causal relations in which the subject becomes a node of intersection of multiple dispositions", "Subject and structure relate", "Causality is complex"],
      "answer": "The overdetermination of structure weaves a web of causal relations in which the subject becomes a node of intersection of multiple dispositions"
    },
    {
      "type": "listen",
      "audio": "Реставрация аутентичности оказывается перформативным актом, который сам конструирует объект своего желания, раскрывая желание конституирующей силой смысла",
      "options": ["Authenticity is real", "The restoration of authenticity proves a performative act which itself constructs the object of its desire, revealing desire as constituting force of meaning", "Desire creates meaning", "Authenticity is constructed"],
      "answer": "The restoration of authenticity proves a performative act which itself constructs the object of its desire, revealing desire as constituting force of meaning"
    },
    {
      "type": "listen",
      "audio": "Эсхатологическое напряжение между абсолютным и относительным пронизывает ткань исторического сознания, обещая трансценденцию, которая никогда не наступает",
      "options": ["History is absolute", "The eschatological tension between the absolute and the relative permeates the fabric of historical consciousness, promising transcendence that never arrives", "Transcendence is promised", "History is incomplete"],
      "answer": "The eschatological tension between the absolute and the relative permeates the fabric of historical consciousness, promising transcendence that never arrives"
    },
    {
      "type": "listen",
      "audio": "Непостижимость вещи в себе, будучи условием трансцендентальной возможности опыта, одновременно кодирует его радикальную ограниченность и конечность",
      "options": ["Things are unknowable", "The incomprehensibility of the thing-in-itself, being the condition of transcendental possibility of experience, simultaneously encodes its radical limitation and finitude", "Experience is limited", "Knowledge has limits"],
      "answer": "The incomprehensibility of the thing-in-itself, being the condition of transcendental possibility of experience, simultaneously encodes its radical limitation and finitude"
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "The speculative identity of subject and object, posited as ultimate reconciliation, reveals itself as premature universalization foreclosing the alterity of particularity",
      "options": ["Спекулятивная идентичность субъекта и объекта, постулируемая как окончательное примирение, раскрывает себя в качестве преждевременной универсализации, закрывающей инаковость партикулярности", "Предмет и субъект идентичны", "Примирение возможно", "Универсализация предшествует"],
      "answer": "Спекулятивная идентичность субъекта и объекта, постулируемая как окончательное примирение, раскрывает себя в качестве преждевременной универсализации, закрывающей инаковость партикулярности"
    },
    {
      "type": "translate",
      "english": "The sublime emergence of the inhuman within the heart of the human exposes the foundational heteronomy of the cogito, its constitutive dependence on what it seeks to master",
      "options": ["Возвышенное появление нечеловеческого в сердце человеческого выявляет фундаментальную гетерономность картезианского субъекта, его конституирующую зависимость от того, что он стремится подчинить", "Человек нечеловечен", "Картезий был неправ", "Мышление зависит"],
      "answer": "Возвышенное появление нечеловеческого в сердце человеческого выявляет фундаментальную гетерономность картезианского субъекта, его конституирующую зависимость от того, что он стремится подчинить"
    },
    {
      "type": "translate",
      "english": "The radical contingency of being, its absolute groundlessness, engenders the vertiginous freedom of absolute responsibility without calculable measure or proportion",
      "options": ["Радикальная контингентность бытия, его абсолютная бесосновность, порождает головокружительную свободу абсолютной ответственности без исчисляемой меры или пропорции", "Бытие случайно", "Свобода абсолютна", "Ответственность безгранична"],
      "answer": "Радикальная контингентность бытия, его абсолютная бесосновность, порождает головокружительную свободу абсолютной ответственности без исчисляемой меры или пропорции"
    },
    {
      "type": "translate",
      "english": "The performative contradiction inherent in any meta-position demonstrates the impossibility of occupying a place outside the system from which to judge it",
      "options": ["Перформативное противоречие, присущее любой мета-позиции, демонстрирует невозможность занять место вне системы, с которого её судить", "Система всеохватывающа", "Положение внешнее", "Противоречие всегда есть"],
      "answer": "Перформативное противоречие, присущее любой мета-позиции, демонстрирует невозможность занять место вне системы, с которого её судить"
    },
    {
      "type": "translate",
      "english": "The wound of language, its irreducible distance from the plenum of presence, constitutes both the possibility and the impossibility of communication",
      "options": ["Рана языка, его неустранимое расстояние от полноты присутствия, конституирует как возможность, так и невозможность коммуникации", "Язык ранит", "Присутствие невозможно", "Коммуникация сложна"],
      "answer": "Рана языка, его неустранимое расстояние от полноты присутствия, конституирует как возможность, так и невозможность коммуникации"
    },
    {
      "type": "translate",
      "english": "The infinite deferral inscribed in the structure of supplementarity reveals that presence is always already compromised by the trace of absence",
      "options": ["Бесконечная отсрочка, вписанная в структуру суппилементарности, раскрывает, что присутствие всегда уже скомпрометировано следом отсутствия", "Присутствие отсрочено", "Отсутствие везде", "След везде"],
      "answer": "Бесконечная отсрочка, вписанная в структуру суппилементарности, раскрывает, что присутствие всегда уже скомпрометировано следом отсутствия"
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Критикуя онтологический реализм, вы утверждаете:",
      "options": ["Реализм верен", "Наивная вера в онтологическую независимость объектов ускользает от осознания того, что любой доступ к бытию опосредован символической сетью, которая конституирует саму возможность предметности", "Реализм неправ", "Объекты существуют"],
      "answer": "Наивная вера в онтологическую независимость объектов ускользает от осознания того, что любой доступ к бытию опосредован символической сетью, которая конституирует саму возможность предметности"
    },
    {
      "type": "mcq",
      "prompt": "Анализируя гегемониальные режимы производства истины, вы замечаете:",
      "options": ["Истина объективна", "Режимы производства истины функционируют посредством исключения и маргинализации альтернативных эпистемических позиций, сохраняя видимость нейтральности и универсальности", "Истина субъективна", "Всё относительно"],
      "answer": "Режимы производства истины функционируют посредством исключения и маргинализации альтернативных эпистемических позиций, сохраняя видимость нейтральности и универсальности"
    },
    {
      "type": "mcq",
      "prompt": "Обсуждая инвестированность философии в современном капитализме, вы говорите:",
      "options": ["Философия независима", "Даже критическая философия оказывается невольно соучастницей тех систем доминирования, которые она аналитически препарирует, поскольку её дискурс уже цифровизирован и коммодифицирован", "Капитализм не влияет", "Философия свободна"],
      "answer": "Даже критическая философия оказывается невольно соучастницей тех систем доминирования, которые она аналитически препарирует, поскольку её дискурс уже цифровизирован и коммодифицирован"
    },
    {
      "type": "mcq",
      "prompt": "Исследуя неоссификацию понятийных аппаратов, вы констатируете:",
      "options": ["Понятия статичны", "Постоянное обновление терминологии отражает как жизненность мысли, так и её неизбежную коррумпированность переходящими модами и эпохальными тренками", "Понятия развиваются", "Язык меняется"],
      "answer": "Постоянное обновление терминологии отражает как жизненность мысли, так и её неизбежную коррумпированность переходящими модами и эпохальными тренками"
    },
    {
      "type": "mcq",
      "prompt": "Подвергая критике трансценденталистские основания философии, вы отмечаете:",
      "options": ["Трансценденталь верен", "Претензия на трансцендентальность мышления скрывает его имплицитную укоренённость в исторической партикулярности, которую оно постоянно репрессирует и отрицает", "История не важна", "Мышление универсально"],
      "answer": "Претензия на трансцендентальность мышления скрывает его имплицитную укоренённость в исторической партикулярности, которую оно постоянно репрессирует и отрицает"
    },
    {
      "type": "mcq",
      "prompt": "Размышляя о возможности иного мышления, вы утверждаете:",
      "options": ["Новое мышление невозможно", "Возможность мышления иначе требует не просто интеллектуального напряжения, но экзистенциального разрыва с исторически наследуемыми модусами субъективации, сам же разрыв остаётся всегда ещё обещанием", "Мышление не меняется", "Иное возможно"],
      "answer": "Возможность мышления иначе требует не просто интеллектуального напряжения, но экзистенциального разрыва с исторически наследуемыми модусами субъективации, сам же разрыв остаётся всегда ещё обещанием"
    }
  ]
};
