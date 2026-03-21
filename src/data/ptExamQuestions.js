export const PT_EXAM_QUESTIONS = {
  "A1": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "portuguese": "Olá, tudo bem?",
      "options": ["Hello, how are you?", "Goodbye, see you later", "Good morning, sleep well", "Thank you very much"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "Eu sou professor.",
      "options": ["I am a student", "I am a teacher", "I am a doctor", "I am an engineer"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "Qual é o teu nome?",
      "options": ["How old are you?", "Where do you live?", "What is your name?", "What do you do?"],
      "answer": 2
    },
    {
      "type": "translate-en",
      "portuguese": "Tenho vinte e cinco anos.",
      "options": ["I have twenty-five euros", "I have twenty-five years", "I am twenty-five years old", "I want twenty-five apples"],
      "answer": 2
    },
    {
      "type": "translate-en",
      "portuguese": "A casa é grande.",
      "options": ["The house is small", "The house is big", "The house is old", "The house is new"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "Gosto de chocolate.",
      "options": ["I dislike chocolate", "I like chocolate", "I love coffee", "I need water"],
      "answer": 1
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Olá, meu ___ é João.",
      "options": ["nome", "dia", "ano", "livro"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Ela ___ médica no hospital.",
      "options": ["sou", "somos", "é", "são"],
      "answer": 2
    },
    {
      "type": "fill",
      "sentence": "Nós ___ três filhos.",
      "options": ["têm", "tem", "temos", "tenho"],
      "answer": 2
    },
    {
      "type": "fill",
      "sentence": "Você ___ de Portugal?",
      "options": ["sois", "é", "são", "sou"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Eu ___ café todas as manhãs.",
      "options": ["bebo", "bebes", "bebemos", "bebem"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Hoje ___ segunda-feira.",
      "options": ["é", "são", "sou", "somos"],
      "answer": 0
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Bom dia, como vai?",
      "options": ["Good afternoon, how are you?", "Good morning, how are you?", "Good evening, how are you?", "Goodnight, sleep well"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "Obrigado muito!",
      "options": ["You are welcome", "Thank you very much", "Excuse me", "I am sorry"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "Eu moro em Lisboa.",
      "options": ["I work in Lisbon", "I live in Lisbon", "I study in Lisbon", "I visit Lisbon"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "O meu número de telefone é 123456789.",
      "options": ["My email is 123456789", "My address is 123456789", "My phone number is 123456789", "My age is 123456789"],
      "answer": 2
    },
    {
      "type": "listen",
      "audio": "Qual é a tua idade?",
      "options": ["What is your name?", "What is your address?", "What is your age?", "What is your job?"],
      "answer": 2
    },
    {
      "type": "listen",
      "audio": "Eu tenho um cão e um gato.",
      "options": ["I have a cat and a bird", "I have a dog and a cat", "I have two dogs", "I have three cats"],
      "answer": 1
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "What is your name?",
      "options": ["O que é o teu nome?", "Qual é o teu nome?", "Quem é você?", "Como se chama?"],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "I am from Spain.",
      "options": ["Eu estou da Espanha.", "Eu sou de Espanha.", "Eu sou Espanha.", "Eu venho Espanha."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "She likes apples.",
      "options": ["Ela gosta maçãs.", "Ela gosta de maçãs.", "Ela ama maçãs.", "Ela deseja maçãs."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "We have three children.",
      "options": ["Nós temos três filhos.", "Nós somos três filhos.", "Nós estamos três filhos.", "Nós temos de três filhos."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The water is cold.",
      "options": ["A água é fria.", "A água está fria.", "A água é fria muito.", "A água tem fria."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "Do you speak English?",
      "options": ["Tu fales inglês?", "Você fala inglês?", "Você falas inglês?", "Tu fala inglês?"],
      "answer": 1
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Você está na padaria. O vendedor pergunta: 'O que deseja?' Qual é a resposta apropriada?",
      "options": ["Desejo pão e leite.", "Você vende pão?", "Que horas abre?", "Onde fica o banheiro?"],
      "answer": 0
    },
    {
      "type": "mcq",
      "prompt": "Seu colega chega e diz 'Olá!' Como você responde?",
      "options": ["Adeus!", "Olá, tudo bem?", "Que horas são?", "Obrigado!"],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Alguém lhe oferece comida. Qual frase usa se não quer?",
      "options": ["Quero mais!", "Não, obrigado.", "Sim, com prazer.", "É delicioso!"],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Você chega a um hotel. O recepcionista pergunta 'Qual é o seu nome?' Como responde?",
      "options": ["Meu número é 5.", "Meu nome é João.", "Sou de Lisboa.", "Tenho vinte anos."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Seu amigo diz 'Tenho fome!' Como você responde?",
      "options": ["Tenho sono!", "Está chovendo.", "Vamos comer algo?", "Que dia é hoje?"],
      "answer": 2
    },
    {
      "type": "mcq",
      "prompt": "Na rua, alguém pergunta 'Qual é teu email?' Como você responde de forma natural?",
      "options": ["Tenho um cão.", "Meu email é joao@email.com", "Sou engenheiro.", "Moro em Lisboa."],
      "answer": 1
    }
  ],
  "A2": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "portuguese": "Ontem fui ao cinema.",
      "options": ["I go to the cinema", "I will go to the cinema", "I went to the cinema yesterday", "I am going to the cinema"],
      "answer": 2
    },
    {
      "type": "translate-en",
      "portuguese": "Ela estava a estudar quando chegou a polícia.",
      "options": ["She is studying when police arrives", "She studies when police arrived", "She was studying when the police arrived", "She studies and police arrived"],
      "answer": 2
    },
    {
      "type": "translate-en",
      "portuguese": "Vou comprar pão na padaria.",
      "options": ["I buy bread at the bakery", "I will buy bread at the bakery", "I bought bread at the bakery", "I am buying bread at the bakery"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "Quando vejo um filme antigo, gosto muito.",
      "options": ["When I see an old film, I like it a lot", "When I saw an old film, I liked it", "When I will see an old film, I will like it", "When I am seeing an old film, I am liking"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "O livro sobre história é interessante.",
      "options": ["The book in history is interested", "The book of history is interesting", "The book about history is interesting", "The history book very interesting"],
      "answer": 2
    },
    {
      "type": "translate-en",
      "portuguese": "Não tenho mais dinheiro para comprar esse carro.",
      "options": ["I don't have much money to buy this car", "I don't have any more money to buy this car", "I have no money in the car", "I don't buy cars with money"],
      "answer": 1
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Ontem ___ uma carta importante.",
      "options": ["recebia", "recebi", "recebo", "receberia"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Se eu tivesse tempo, ___ contigo ao parque.",
      "options": ["vou", "iria", "vou ir", "fui"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Ela está ___ na cozinha.",
      "options": ["cozinhar", "cozinhando", "cozinhada", "cozinha"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "O comboio ___ às 15h de Lisboa.",
      "options": ["partiu", "parte", "partia", "partirá"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Nós ___ para o trabalho de carro todos os dias.",
      "options": ["fomos", "vamos", "iremos", "íamos"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Você ___ essa música antes?",
      "options": ["ouve", "ouviu", "ouve", "ouvia"],
      "answer": 1
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Passei uma semana em Paris.",
      "options": ["I am spending a week in Paris", "I spent a week in Paris", "I will spend a week in Paris", "I have weeks in Paris"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "Vou ao supermercado comprar comida.",
      "options": ["I went to the supermarket to buy food", "I go to the supermarket to buy food", "I will go to the supermarket to buy food", "I am at the supermarket buying food"],
      "answer": 2
    },
    {
      "type": "listen",
      "audio": "Ele havia dormido durante o filme.",
      "options": ["He was sleeping during the film", "He has slept during the film", "He had slept during the film", "He sleeps during the film"],
      "answer": 2
    },
    {
      "type": "listen",
      "audio": "Qual era a sua profissão antes?",
      "options": ["What is your profession?", "What was your profession before?", "What will be your profession?", "What profession do you want?"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "O restaurante ficava perto da estação.",
      "options": ["The restaurant is near the station", "The restaurant was near the station", "The restaurant will be near the station", "The restaurant has been near the station"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "Já visitei cinco países em dois anos.",
      "options": ["I visit five countries in two years", "I have visited five countries in two years", "I will visit five countries in two years", "I am visiting five countries in two years"],
      "answer": 1
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "Yesterday I bought a new shirt.",
      "options": ["Ontem comprei uma camisa nova.", "Ontem compro uma camisa nova.", "Ontem vou comprar uma camisa nova.", "Ontem estava comprando uma camisa nova."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "I was living in the countryside before.",
      "options": ["Estou a viver no campo antes.", "Vivia no campo antes.", "Vou viver no campo antes.", "Tenho vivido no campo antes."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "They were going to travel in August.",
      "options": ["Eles iam viajar em agosto.", "Eles viajam em agosto.", "Eles viajaram em agosto.", "Eles vão viajar em agosto."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "If you had studied, you would have passed.",
      "options": ["Se estudavas, passavas.", "Se estudasses, passes.", "Se tivesses estudado, terias passado.", "Se estudavas, terias passado."],
      "answer": 2
    },
    {
      "type": "translate",
      "english": "She has been working here for three years.",
      "options": ["Ela trabalha aqui há três anos.", "Ela trabalhava aqui há três anos.", "Ela trabalhou aqui há três anos.", "Ela estará trabalhando aqui há três anos."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The patient is being examined by the doctor.",
      "options": ["O doente é examinado pelo médico.", "O doente está sendo examinado pelo médico.", "O doente foi examinado pelo médico.", "O doente será examinado pelo médico."],
      "answer": 1
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Você vai a um restaurante. O garçom pergunta: 'Que deseja beber?' Qual resposta é apropriada?",
      "options": ["Tenho muita fome.", "Um suco de laranja, por favor.", "A conta, por favor.", "Está bom o prato?"],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Seu colega diz 'Vou viajar para o Brasil no próximo mês.' Como você responde naturalmente?",
      "options": ["Viajei para o Brasil.", "Que legal! Quando vai?", "Não gosto de viajar.", "Você viaja sempre?"],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Você está em uma loja. O vendedor pergunta 'Qual é o seu tamanho?' O que responde?",
      "options": ["Gosto dessa cor.", "Uso tamanho M.", "Quanto custa?", "Você tem outros?"],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Seu amigo chega atrasado. O que você diz?",
      "options": ["Chegaste a tempo!", "Estou feliz!", "Demoraste muito!", "Que hora bonita!"],
      "answer": 2
    },
    {
      "type": "mcq",
      "prompt": "Você vê um acidente na rua. O que faz primeiro?",
      "options": ["Continuo caminhando.", "Chamo a polícia e oferço ajuda.", "Tiro uma fotografia.", "Vou para casa."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Um colega diz 'Passei na prova de português!' Como você responde?",
      "options": ["Que pena!", "Parabéns! Bem-vindo!", "Parabéns! Fico feliz por ti.", "Estudaste bem?"],
      "answer": 2
    }
  ],
  "B1": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "portuguese": "Embora estivesse cansado, continuei a trabalhar.",
      "options": ["Although being tired, I continued working", "Although I was tired, I continued working", "Because I was tired, I continued working", "Even though I continue working, I am tired"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "É importante que você estude todos os dias.",
      "options": ["It is important that you study every day", "It is important you studying every day", "It is important that you studied every day", "It is important you will study every day"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "Gostaria de conhecer outras culturas antes de envelheci.",
      "options": ["I would like to know other cultures before aging", "I like to know other cultures before I grow old", "I would like to know other cultures before I grow old", "I liked knowing other cultures before growing old"],
      "answer": 2
    },
    {
      "type": "translate-en",
      "portuguese": "O facto de ela não responder preocupa-me.",
      "options": ["The fact that she does not respond worries me", "She does not respond and that is a fact", "I am worried about facts", "The fact makes her not respond"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "Não acho que seja uma boa ideia viajar sozinho.",
      "options": ["I find it not a good idea to travel alone", "I don't think it is a good idea to travel alone", "I think it is not a good idea to travel", "I find that traveling alone is a good idea"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "Assim que chegarem, avise-me.",
      "options": ["As soon as they arrive, tell me", "After they arrive, I will tell you", "While they are arriving, tell me", "Before they arrive, let me know"],
      "answer": 0
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "É necessário que todos ___ os regulamentos.",
      "options": ["cumpram", "cumprem", "cumprissem", "cumprirão"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Espero ___ boa notícia em breve.",
      "options": ["receber", "recebi", "recebendo", "receberei"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "A menos que ___, não podemos sair.",
      "options": ["terminássemos", "terminemos", "terminemos", "terminaremos"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Duvido que ele ___ capaz de fazer isso.",
      "options": ["é", "seja", "será", "fosse"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Desejo que vocês ___ muito sucesso no projeto.",
      "options": ["têm", "tenham", "terão", "tiveram"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Se ___ tempo, teria vindo.",
      "options": ["tinha", "tivesse", "tenho", "terei"],
      "answer": 1
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "Meu patrão sugeriu que eu fizesse um curso de especialização.",
      "options": ["My boss suggested I do a specialization course", "My boss will suggest a course", "My boss suggested courses", "My boss asks me to take courses"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Ainda que chovesse muito, eles saíram de casa.",
      "options": ["Even though it rained a lot, they left home", "Because it rained, they left home", "They left home to avoid the rain", "If it had rained, they would have stayed"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Percebi que ele estava descontente com o resultado.",
      "options": ["I perceived his discontent with results", "I realized he was unhappy with the result", "I saw him discontent and results", "He was not happy about perception"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "O objetivo do projeto era resolver problemas de saúde.",
      "options": ["The project had health problems", "The goal of the project was to solve health problems", "Health problems were the project", "The project solved and had goals"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "Visto que não há solução, aceitaremos a situação.",
      "options": ["Since there is no solution, we will accept the situation", "We will see if we accept", "The situation has no solution", "We will accept to see the situation"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Ela insistiu em que assistíssemos à reunião.",
      "options": ["She insists we attend the meeting", "She insisted that we attend the meeting", "She attended the meeting and insisted", "We insisted on attending her meeting"],
      "answer": 1
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "I would prefer that you arrive before sunset.",
      "options": ["Prefiro que chegues antes do pôr do sol.", "Preferia que chegasses antes do pôr do sol.", "Preferiria que chegasses antes do pôr do sol.", "Prefererei que chegues antes do pôr do sol."],
      "answer": 2
    },
    {
      "type": "translate",
      "english": "In order to succeed, one must be persistent.",
      "options": ["Para suceder, é necessário ser persistente.", "Para ser persistente, sucede.", "Sendo persistente, sucesso.", "Para sucesso, persistir é."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "She was afraid that something bad would happen.",
      "options": ["Ela tinha medo que algo mau aconteceria.", "Ela temia que algo mau acontecesse.", "Ela teve medo que algo acontecia.", "Ela teme algo mau acontecer."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "It is clear that the situation has improved.",
      "options": ["É claro que a situação melhorava.", "É claro que a situação tem melhorado.", "É claro que a situação melhora.", "É claro que a situação melhorou."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "Unless you change your attitude, you will not succeed.",
      "options": ["A menos que mudes de atitude, não sucederás.", "A menos que mudasses de atitude, não sucedias.", "Sem mudares de atitude, não sucedes.", "Excepto se mudares de atitude, sucedes."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The article argues that education is fundamental.",
      "options": ["O artigo argumenta que a educação é fundamental.", "O artigo argumentou que a educação fosse fundamental.", "O artigo deseja que a educação é fundamental.", "O artigo diz educação fundamental."],
      "answer": 0
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Você está numa entrevista de emprego. O entrevistador pergunta: 'Qual é a sua maior força?' Como responde?",
      "options": ["Tenho muita fraqueza.", "Sou muito criativo e aprendo rapidamente.", "Não tenho forças.", "Tenho medo de desafios."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Um colega faz uma sugestão que você não concorda. Como discorda educadamente?",
      "options": ["Essa ideia é péssima.", "Entendo seu ponto, mas talvez pudéssemos considerar outra abordagem.", "Está errado.", "Não quero ouvir."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Você recebeu crítica construtiva no trabalho. Qual é a resposta apropriada?",
      "options": ["Vou ignorar tudo.", "Agradeço o feedback, vou refletir sobre isso.", "Isso não importa.", "Você não sabe nada."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Um amigo está considerando um grande cambio de carreira. O que você sugere?",
      "options": ["Não mudes nada.", "Reflete bem, conversa com pessoas da área, e segue teu coração.", "Carreira é sem importância.", "Muda já!"],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Você precisa comunicar más notícias a um colega. Como começa?",
      "options": ["Tenho notícias mas não importa.", "Infelizmente tenho uma notícia desagradável a compartilhar.", "Não vou contar.", "Temos um grande problema!"],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Em uma reunião, sua opinião contraria a do seu chefe. O que faz?",
      "options": ["Fico calado.", "Apresento respeitosamente meu ponto de vista com argumentos.", "Critico publicamente.", "Concordo mesmo discordando."],
      "answer": 1
    }
  ],
  "B2": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "portuguese": "Sob o ponto de vista sociológico, a situação é complexa.",
      "options": ["From a sociological point of view, the situation is complex", "Under the society view, the situation is complex", "The society is viewing the complex situation", "Complexity views the sociological situation"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "A despeito das dificuldades, o projeto foi bem-sucedido.",
      "options": ["Because of the difficulties, the project was successful", "In spite of the difficulties, the project was successful", "The difficulties were successful in the project", "Although there were difficulties, we succeeded"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "É imperativo que se revejam as políticas implementadas.",
      "options": ["It is imperative that policies are reviewed", "It is imperative that policies be reviewed", "The reviews of policies are imperative", "Reviewing policies is more important"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "Talvez fosse conveniente renegociar os termos do contrato.",
      "options": ["Maybe it would be convenient to renegotiate contract terms", "It was convenient that we renegotiate the contract", "Renegotiating is convenient to the contract", "The contract was convenient about negotiation"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "O relatório em questão apresenta uma perspectiva inovadora.",
      "options": ["The report in question presents an innovative perspective", "The questioned report presents a perspective", "In questions, the report is innovative", "The perspective questions the report's innovation"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "Ainda que reconheçamos as limitações, devemos perseverar.",
      "options": ["Even though we recognize the limitations, we must persevere", "We recognize the limitations and must persevere", "Although recognizing, perseverance is limited", "The limitations are recognized in perseverance"],
      "answer": 0
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Convém que os relatórios ___ submetidos até amanhã.",
      "options": ["sejam", "são", "serão", "foram"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "O ministério exigiu que se ___ novas medidas.",
      "options": ["implementem", "implementam", "implementarão", "implementassem"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Caso ___ questões jurídicas, contacte o departamento legal.",
      "options": ["surgem", "surjam", "surgirem", "surgirão"],
      "answer": 2
    },
    {
      "type": "fill",
      "sentence": "É possível que o resultado ___ interpretado de forma distinta.",
      "options": ["seja", "é", "será", "foi"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Supõe-se que a economia ___ a recuperação em 2027.",
      "options": ["inicia", "inicie", "iniciará", "iniciava"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Salvo se ___ contraindicações, prosseguimos com o plano.",
      "options": ["haja", "há", "haverá", "havia"],
      "answer": 0
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "O presidente defendeu a legitimidade das decisões tomadas.",
      "options": ["The president defended the legitimacy of decisions made", "The president questioned whether decisions were legitimate", "Decisions legitimized the president's actions", "The president made decisions about legitimacy"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "A análise crítica revela inconsistências fundamentais no argumento.",
      "options": ["Critical analysis reveals fundamental inconsistencies in the argument", "Fundamental criticism analyzes the argument", "The argument is inconsistent with analysis", "Analysis is critical about the argument's inconsistency"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Conforme previsto nas cláusulas contratuais, o pagamento vence no mês atual.",
      "options": ["As expected, the payment is due", "As stipulated in the contractual clauses, the payment is due this month", "The contract expects payment in the future", "Clauses predict payment is due"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "A metodologia empregada carece de rigor científico.",
      "options": ["The methodology used is very rigorous", "The methodology employed lacks scientific rigor", "Science endorses the methodology rigorously", "Rigorous science employs this methodology"],
      "answer": 1
    },
    {
      "type": "listen",
      "audio": "Depreende-se desta análise que a situação requer intervenção imediata.",
      "options": ["This analysis shows the situation requires immediate intervention", "The analysis prevented immediate intervention", "Intervention is shown in the analysis", "The situation is analyzed as immediate"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Atendendo aos interesses públicos, as autoridades revisaram a legislação.",
      "options": ["Taking into account public interests, authorities reviewed the legislation", "Authorities attended to public interests without revision", "The legislation is reviewed by public interest", "Public review of authorities' interests occurred"],
      "answer": 0
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "The administration has systematically ignored the recommendations.",
      "options": ["A administração ignorou sistematicamente as recomendações.", "A administração tem sistematicamente ignorado as recomendações.", "A administração ignora sistematicamente as recomendações.", "A administração sistemática ignora as recomendações."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "Given the circumstances, one could argue that the decision was warranted.",
      "options": ["Dadas as circunstâncias, alguém podia discutir que a decisão era justificada.", "Dado as circunstâncias, poder-se-ia argumentar que a decisão foi justificada.", "As circunstâncias justificam a decisão argumentada.", "Poder-se argumentar que a decisão é circunstancial."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "It is unlikely that such irregularities would go undetected.",
      "options": ["É improvável que tais irregularidades passem despercebidas.", "É improvável que tais irregularidades passarem despercebidas.", "Tais irregularidades improvavelmente passam despercebidas.", "Irregularidades improváveis não são detectadas."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The effectiveness of this approach remains to be demonstrated.",
      "options": ["A efetividade desta abordagem permanece a demonstrar.", "A efetividade desta abordagem ainda está por ser demonstrada.", "A efetividade desta abordagem permaneceu demonstrada.", "Esta abordagem demonstra efetividade permanente."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "Notwithstanding the obstacles encountered, progress has been substantial.",
      "options": ["Não obstante os obstáculos encontrados, o progresso tem sido substancial.", "Obstáculos não permitindo, o progresso foi substancial.", "Apesar obstáculos, o progresso era substancial.", "Os obstáculos não impediam o progresso substancial."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The document in question was subject to multiple interpretations.",
      "options": ["O documento em questão foi assunto de múltiplas interpretações.", "O documento questionado teve múltiplas interpretações.", "O documento em questão estava sujeito a múltiplas interpretações.", "Múltiplas interpretações questionaram o documento."],
      "answer": 2
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Você está numa conferência acadêmica apresentando uma pesquisa. Como apresenta uma ideia controversa?",
      "options": ["Esta ideia é verdadeira e todos devem acreditar.", "Embora seja controversa, os dados sugerem...", "Ninguém vai concordar comigo.", "Ignore quem discorda."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Um colega questiona sua metodologia. Como responde formalmente?",
      "options": ["Você está errado.", "Agradeço a questão. Essas limitações foram consideradas porque...", "Não vou responder.", "A metodologia é obviamente correta."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Você precisa contrariar uma decisão no trabalho em reunião formal. Como procede?",
      "options": ["Discordo completamente.", "Reconheço os méritos da proposta, contudo gostaria de apontar algumas preocupações...", "Vocês estão todos errados.", "Vou calar."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Está a escrever um relatório formal. Como conclui?",
      "options": ["Portanto, temos de fazer algo.", "Em conclusão, os dados indicam que... Recomenda-se...", "Fim.", "Não há conclusão."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Uma política tem argumentos a favor e contra. Como apresenta equidade?",
      "options": ["A política é boa, ponto final.", "A política têm méritos e limitações. Enquanto..., porém...", "Não há argumento contra.", "Tudo é contra."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Você recebe um pedido de uma autoridade que considera inadequado. Como responde respeitosamente?",
      "options": ["Não faço.", "Reconheço a importância, todavia existem preocupações que...", "É uma má ideia.", "Não concordo, adeus."],
      "answer": 1
    }
  ],
  "C1": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "portuguese": "A ubiquidade das redes sociais tem suscitado questões éticas profundas.",
      "options": ["Social media ubiquity is raising ethics questions", "The ubiquity of social networks has raised profound ethical questions", "Social networks are questioned ethically and ubiquitous", "The ethics of ubiquitous social networks are questioned"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "Desperta particular interesse a constatação de que a fragmentação discursiva agrava as polarizações políticas.",
      "options": ["Political polarization shows that discourse is fragmented", "Of particular interest is the finding that discursive fragmentation exacerbates political polarizations", "Fragmented discourse is political and interesting", "Political polarizations fragment interest in discourse"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "O fenómeno em apreço revela complexidades que transcendem análises superficiais.",
      "options": ["The phenomenon being discussed reveals complexities that transcend superficial analyses", "Phenomena discuss complexities in analysis", "Superficial analyses transcend the complex phenomenon", "The analysis is complex and transcends phenomena"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "Não se trata meramente de um desajustamento conjuntural, senão de uma reconfiguração estrutural.",
      "options": ["It is merely a misalignment happening temporarily", "It is not merely a cyclical maladjustment, but rather a structural reconfiguration", "Structural adjustment is merely cyclical", "Cyclical reconfiguration is structural adjustment"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "A inflexão que se observa nos indicadores macroeconómicos sugere uma inflexão nas expectativas.",
      "options": ["Economic indicators are inflexible", "The inflection observed in macroeconomic indicators suggests an inflection in expectations", "Expectations inflect the economic indicators", "Economic indicators expect inflection"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "Cumpre salientar que tal abordagem não é isenta de crítica fundamentada.",
      "options": ["This approach is not immune to well-founded criticism", "All approaches are free from criticism", "Criticism is not fundamental to approaches", "The approach criticizes itself fundamentally"],
      "answer": 0
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "O paradoxo reside em que, conquanto os dados ___, as interpretações divergem substancialmente.",
      "options": ["convergem", "convergissem", "convergiriam", "convergem"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Seria profundamente equivocado ___ que a mudança foi meramente cosmética.",
      "options": ["supor", "supormos", "supúnhamos", "suporá"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Não menos relevante é a constatação de que os agentes ___ activamente para contrariar essa tendência.",
      "options": ["actuam", "actuariam", "actuassem", "actuaram"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Pressupõe-se, com justificação, que as autoridades ___ cognoscitivas de tal fenómeno.",
      "options": ["têm consciência", "tinham consciência", "tivessem consciência", "terão consciência"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Mister é que se ___ em perspectiva a multiplicidade de factores em jogo.",
      "options": ["considere", "considera", "considerava", "consideraria"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Delineia-se assim um quadro em que ___ coexistem tensões fundamentais.",
      "options": ["persistem", "persistam", "persistissem", "persistirão"],
      "answer": 0
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "A problemática em tela envolve dilemas que não comportam soluções de molde único.",
      "options": ["The problem at hand involves dilemmas that do not admit one-size-fits-all solutions", "The problem is about mold and solutions", "Solutions are diverse and problematic", "Molds create problems without solutions"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Convém destacar o carácter multifacetado desta questão, cujas ramificações extravasam o âmbito puramente técnico.",
      "options": ["It is important to highlight the multifaceted nature of this question, whose ramifications exceed the purely technical scope", "Technical aspects are the only ramifications", "This question is simple and technical", "Multifaceted questions have no ramifications"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Emerge, pois, a urgência de se repensar categoricamente os pressupostos subjacentes.",
      "options": ["There emerges, then, the urgency to categorically rethink the underlying assumptions", "Assumptions are not urgent or categorical", "Categories urgently emerge", "Underlying categories are not assumptions"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Não obstante o consenso aparente, subsistem discrepâncias paradigmáticas de envergadura.",
      "options": ["Despite apparent consensus, there subsist paradigmatic discrepancies of magnitude", "Consensus resolves all paradigmatic issues", "Apparent paradigms are discrepant", "Magnitude is apparent in consensus"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "A soberania interpretativa não deve, contudo, eclipsar a necessidade de fundamentação rigorosa.",
      "options": ["Interpretive sovereignty should not eclipse the need for rigorous foundation", "Interpretive sovereignty eliminates rigor", "Foundations are sovereign and interpretive", "Rigor is eclipsed by sovereignty"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Entrevê-se, portanto, uma reconfiguração que se afigura inevitável sob certas condições.",
      "options": ["One may foresee, therefore, a reconfiguration that appears inevitable under certain conditions", "Reconfiguration is impossible and inevitable", "Conditions are foreseen under reconfiguration", "Inevitable conditions are invisible"],
      "answer": 0
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "The multifarious interpretations render univocal assessment problematic.",
      "options": ["As interpretações multífaras tornam a avaliação unívoca problemática.", "As multifárias interpretações tornam problemática uma avaliação unívoca.", "As interpretações multifacetadas tornam univocamente problemática a avaliação.", "Interpretações univocamente multifárias avaliam problematicamente."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "It behooves us to consider the epistemological implications thereof.",
      "options": ["Cumpre-nos considerar as implicações epistemológicas disso.", "Competências nos permitem considerar implicações epistemológicas.", "Nós devemos epistemologicamente implicar considerações.", "As implicações são competência de epistemologia."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "Such reductionism obfuscates the underlying nexus of causality.",
      "options": ["Tal reducionismo obscurece o nexo subjacente de causalidade.", "O reducionismo obscurece tal nexo de causas subjacente.", "Reduções obscurecem causalmente o nexo.", "Causalidade e reducionismo são obscuros."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The paradigmatic shift precipitated unforeseen ramifications.",
      "options": ["A mudança paradigmática precipitou ramificações imprevistas.", "A mudança precipitada do paradigma tem ramificações.", "Paradigmas mudaram e ramificam imprevisivelmente.", "Ramificações paradigmáticas foram precipitadas imprevisivelmente."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "Notwithstanding the apparent convergence, substantive divergences persist.",
      "options": ["Não obstante a convergência aparente, divergências substantivas persistem.", "Apesar convergências aparentes, as substâncias divergem.", "Persistem divergências em aparente convergência substantiva.", "Convergência substantiva persiste divergentemente."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The exigencies of rigorous scholarship demand such circumspection.",
      "options": ["As exigências da erudição rigorosa demandam tal circunspecção.", "Exigências de erudição rigorosa circunspectamente demandam.", "Rigor demanda erudição e circunspecção.", "Circunspecção e rigor são exigências eruditas."],
      "answer": 0
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Num seminário académico, como introduz uma argumentação sofisticada que desafia pensamento aceite?",
      "options": ["Tudo está errado.", "Contrariamente ao senso comum, a análise contextualizada sugere...", "Ninguém pensa assim.", "É óbvio que..."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Está a escrever uma tese. Como navega entre múltiplas perspectivas teóricas?",
      "options": ["Uma perspectiva está certa, as outras erradas.", "Enquanto X sustenta que..., Y argumenta que..., estas posições revelam...", "Perspectivas são irrelevantes.", "Escolho uma sem justificação."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Como articula uma crítica fundamentada a uma obra canónica sem descartar sua importância?",
      "options": ["A obra é completamente inútil.", "Ainda que seminal, a obra apresenta lacunas quando consideramos...", "A obra não importa.", "Deve ser aceita sem crítica."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Num debate com especialistas, como concilia visões divergentes?",
      "options": ["Uma está certa.", "Ambas revelam aspectos válidos, porém o quadro completo requer também...", "Não há verdade.", "Especialistas nunca concordam."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Como conclui um artigo académico de forma impactante?",
      "options": ["Pronto, terminei.", "Assim, os achados implicam reconfiguração teórica que...", "Ninguém vai ler.", "Conclusões são desnecessárias."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Está a responder a crítica académica construtiva. Como o faz?",
      "options": ["Os críticos estão errados.", "Reconheço a pertinência das observações. Quanto a X, a fundamentação repousa em..., porém Y comporta merit revisão.", "Não respondo.", "Crítica é inútil."],
      "answer": 1
    }
  ],
  "C2": [
    // Q01-Q06: translate-en
    {
      "type": "translate-en",
      "portuguese": "A epistemologia contemporânea tem-se defrontado com aporias que desafiam a inteligibilidade ontológica.",
      "options": ["Contemporary epistemology faces aporias that challenge ontological intelligibility", "Epistemology challenges contemporary aporia", "Ontology is intelligible and contemporary", "Aporias confront epistemological challenges"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "Cumpre examinar as virtualidades inerentes a tal reformulação paradigmática sem incorrer em precipitação.",
      "options": ["It behoves us to examine the potentialities inherent in such paradigmatic reformulation without resorting to haste", "We must hastily examine paradigmatic reformulations", "Paradigmatic potentialities prevent examination", "Reformulation hastily examines paradigms"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "A circunscrição do campo semântico revela-se, portanto, problemática quando se proscrevem interpretações alternativas.",
      "options": ["Circumscribing the semantic field becomes problematic when alternative interpretations are proscribed", "Alternative interpretations circumscribe semantic fields", "Semantic circumscription prevents problems", "Fields reveal themselves semantically and circularly"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "Depreende-se, do exposto, que as antinomias subjacentes não comportam resolução por vias redutivas.",
      "options": ["From what is exposed, it can be inferred that underlying antinomies do not admit of reductive resolution", "Antinomies resolve reductively through exposition", "Reduction exposes antinomies", "Resolutions reduce antinomies underneath"],
      "answer": 0
    },
    {
      "type": "translate-en",
      "portuguese": "Não menos pertinente é o reconhecimento de que a conceptualização carece de fundamentação suficientemente robusta.",
      "options": ["Conceptualization lacks sufficiently robust foundation", "No less pertinent is the recognition that conceptualization lacks sufficiently robust foundation", "Conceptualization is fundamentally robust", "Recognition lacks conceptual pertinence"],
      "answer": 1
    },
    {
      "type": "translate-en",
      "portuguese": "A transgressão dos limites taxonomicamente estabelecidos abre vias fecundas de reinquirição.",
      "options": ["Transgressing taxonomically established boundaries opens fruitful avenues for reinquiry", "Taxonomy transgresses boundaries fruitfully", "Established inquiries are fruitful transgressions", "Boundaries open taxonomy to transgressions"],
      "answer": 0
    },
    // Q07-Q12: fill
    {
      "type": "fill",
      "sentence": "Destarte, ao se reconhecerem os pressupostos subjacentes, abrem-se perspectivas que ___ a reconfiguração epistemológica.",
      "options": ["viabilizam", "viabilizassem", "viabilizariam", "viabilizaram"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Mister é que se ___ com rigor as implicações que declinam desta reformulação.",
      "options": ["delineiem", "delineiam", "delineassem", "delineariam"],
      "answer": 1
    },
    {
      "type": "fill",
      "sentence": "Não se trata de que o fenómeno ___ univocamente determinado, senão de que suas determinações são multiformes.",
      "options": ["fosse", "seja", "é", "será"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Apenas quando se admite a polissemia constitutiva do constructo é que se ___ a inteligibilidade plena.",
      "options": ["alcançam", "alcançaria", "alcançassem", "alcançou"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Há que se considerar, portanto, não somente o que se explicita mas também o que se ___ nas entrelinhas.",
      "options": ["subsume", "subsome", "subsumisse", "subsumiria"],
      "answer": 0
    },
    {
      "type": "fill",
      "sentence": "Por conseguinte, a verdadeira crítica deverá ___ em perspectiva as condições históricas de possibilidade.",
      "options": ["manter", "mantenha", "mantivesse", "manteria"],
      "answer": 0
    },
    // Q13-Q18: listen
    {
      "type": "listen",
      "audio": "A indeterminação que perpassa a obra adquire, neste contexto, uma pregnância hermenêutica singular.",
      "options": ["The indetermination that pervades the work acquires, in this context, a singular hermeneutic pregnance", "The work determines singularly through hermeneutics", "Hermeneutics acquire indetermination", "Pregnance pervades singular works"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Tal elucidação comporta, decerto, nuances que escapam a conceptualizações monolíticas.",
      "options": ["Such elucidation undoubtedly involves nuances that elude monolithic conceptualizations", "Conceptualizations elude elucidation monolithically", "Monolithic nuances elucidate", "Elucidation avoids monolithic nuance"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "A alteridade que se manifesta no tecido textual não consente em ser subsumida por categorias binárias.",
      "options": ["Alterity manifested in the textual fabric does not consent to being subsumed by binary categories", "Binary textual categories alter consent", "Textual alterity is binary and subsumed", "Categories alter and consent to textuality"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Importa salientar que a disseminação significativa permeia a própria estrutura do artefacto.",
      "options": ["It is important to note that significant dissemination permeates the very structure of the artifact", "Significance disseminates artifacts", "Structures disseminate significantly", "Artifacts permeate significantly"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "O palimpsesto hermenêutico que assim se delineia comporta dimensões que transbordam interpretação.",
      "options": ["The hermeneutic palimpsest that thus delineates itself involves dimensions that overflow interpretation", "Interpretation delineates hermeneutic palimpsests", "Dimensions overflow and delineate hermeneutics", "Palimpsests interpret dimensionally"],
      "answer": 0
    },
    {
      "type": "listen",
      "audio": "Emerge, destarte, uma poética do inefável que transcende a domesticação conceptual.",
      "options": ["There emerges, thus, a poetics of the ineffable that transcends conceptual domestication", "Ineffable poetics domesticate conceptually", "Transcendence domesticates poetical ineffability", "Conceptual poetics emerge ineffably"],
      "answer": 0
    },
    // Q19-Q24: translate
    {
      "type": "translate",
      "english": "The aporias engendered by such formulations resist reductive recuperation.",
      "options": ["As aporias engendradas por tais formulações resistem à recuperação redutiva.", "As formulações engendram aporias que reduzem recuperação.", "Recuperação redutiva resiste a formulações aporéticas.", "Formulações resistem redutivamente às aporias engendradas."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "It is precisely this undecidability that imparts to the work its ethical dimension.",
      "options": ["É precisamente esta indecidibilidade que imprime à obra sua dimensão ética.", "Precisamente, a indecidibilidade imprime dimensões éticas.", "Obras impressionam eticamente pela indecidibilidade.", "Dimensões éticas decidem a indecidibilidade da obra."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The constitutive polyvalence resists univocal hermeneutic closure.",
      "options": ["A polivalência constitutiva resiste ao encerramento hermenêutico univocal.", "A polivalência constitutiva resiste ao fechamento hermenêutico univocal.", "A polivalência hermenêutica constitui resistência univocal.", "Univocalmente, resistências constituem polivalências hermenêuticas."],
      "answer": 1
    },
    {
      "type": "translate",
      "english": "What emerges is less a doctrine than a problematic of thought.",
      "options": ["O que emerge é menos uma doutrina do que uma problemática do pensamento.", "O que emerge doutrinariamente é menos problemático do pensamento.", "Doutrinas emergem como problemas do pensamento.", "Pensamento problemático emerge doutrinariamente."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "Such circumlocutions ought not, however, occlude the fundamental stakes.",
      "options": ["Tais circunlóquios não deveriam, contudo, ocluir os fundamentos em jogo.", "Circunlóquios ocluem fundamentalmente o que é apostado.", "O fundamental é obscurecido por circunlóquios.", "Stakes fundamentally obscure circumlocutory thought."],
      "answer": 0
    },
    {
      "type": "translate",
      "english": "The hermeneutic wager consists precisely in maintaining this irreducible tension.",
      "options": ["A aposta hermenêutica consiste precisamente em manter esta tensão irreducível.", "Apostar hermeneuticamente mantém tensões reduzidas.", "Tensões hermenêuticas apostam na redução.", "Manter irredutivelmente aposta a hermenêutica."],
      "answer": 0
    },
    // Q25-Q30: mcq
    {
      "type": "mcq",
      "prompt": "Numa disquisição teórica de nível máximo, como articula a relação entre texto e interpretação quando ambos são constitutivamente indeterminados?",
      "options": ["O texto determina a interpretação.", "A indeterminação constitutiva de ambos não impede mas antes exige uma hermenêutica que reconheça sua co-implicação e irreducibilidade.", "A interpretação é desnecessária.", "Texto e interpretação são equivalentes."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Como responde a uma crítica que the aponta uma aparente antinomia no seu argumento?",
      "options": ["A crítica está errada.", "Reconheço a antinomia; porém, tal irredutibilidade é constitutiva do problema e não una falha lógica mas uma exigência ontológica.", "Não há antinomia.", "Evito antinomias."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Em que consiste, para si, uma argumentação verdadeiramente sofisticada?",
      "options": ["Em parecer complexa.", "Em reconhecer a multiplicidade de perspectivas, as aporias inerentes, e em manter a tensão constitutiva sem recorrer a resoluções redutivas.", "Em negar complexidade.", "Em escolher uma posição e mantê-la."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Como conclui um trabalho que se posiciona na vanguarda teórica sem cair em dogmatismo?",
      "options": ["Demonstrei que tenho razão.", "O investigado revela aporias que abrem vias de reinquirição; a verdade reside no manutenção dessa abertura.", "Ninguém vai compreender.", "Evito conclusões."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Como navega entre fidelidade ao arquivo histórico e liberdade interpretativa?",
      "options": ["O arquivo é tudo.", "A recepção responsável implica não apenas conformidade ao arquivo mas também a capacidade de interrogar suas lacunas e silêncios de forma produtiva.", "Ignoro o arquivo.", "Interpretação ignora história."],
      "answer": 1
    },
    {
      "type": "mcq",
      "prompt": "Qual é o alcance ético de uma análise verdadeiramente rigorosa?",
      "options": ["A ética é irrelevante.", "Reside em reconhecer a alteridade do outro, seja textual ou humano, e em resistir à domesticação redutiva que violentaria sua irredutibilidade e singularidade.", "Análise não tem ética.", "Rigor é amoral."],
      "answer": 1
    }
  ]
};
