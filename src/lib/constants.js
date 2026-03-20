// Shared constants extracted from the original LingoTrailz.jsx
// Imported by AIChat, SituationDetail, LessonView etc.

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lato:wght@300;400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #f0f0f5;
    --muted: #6b6b80;
    --gold: #f5c842;
    --gold2: #e8a020;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #38bdf8;
    --purple: #a78bfa;
    --orange: #fb923c;
    --font-display: 'Syne', sans-serif;
    --font-body: 'Lato', sans-serif;
    --radius: 14px;
    --radius-lg: 20px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .app-root { min-height: 100vh; display: flex; flex-direction: column; max-width: 860px; margin: 0 auto; }

  /* Animations */
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes pop { 0%{transform:scale(0.85);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px #f5c84230} 50%{box-shadow:0 0 40px #f5c84260} }
  @keyframes streakBounce { 0%{transform:translateY(0) scale(1)} 40%{transform:translateY(-12px) scale(1.2)} 100%{transform:translateY(0) scale(1)} }
  @keyframes confetti-fall { 0%{transform:translateY(-20px) rotate(0)} 100%{transform:translateY(100vh) rotate(720deg); opacity:0} }
  @keyframes slide-in-right { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }

  .fade-up { animation: fadeUp 0.4s cubic-bezier(.16,1,.3,1) both; }
  .fade-in { animation: fadeIn 0.3s ease both; }
  .pop-in { animation: pop 0.35s cubic-bezier(.34,1.56,.64,1) both; }
  .slide-right { animation: slide-in-right 0.3s cubic-bezier(.16,1,.3,1) both; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border: none; cursor: pointer; font-family: var(--font-body); font-weight: 700;
    border-radius: var(--radius); transition: all 0.15s ease; user-select: none; }
  .btn:active { transform: scale(0.97); }
  .btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #1a1000; padding: 14px 28px; font-size: 15px; letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(245,200,66,0.3); }
  .btn-gold:hover { box-shadow: 0 6px 28px rgba(245,200,66,0.5); transform: translateY(-1px); }
  .btn-ghost { background: var(--surface2); color: var(--text); padding: 12px 22px;
    font-size: 14px; border: 1px solid var(--border2); }
  .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); padding: 10px 20px; font-size: 13px; }
  .btn-sm { padding: 8px 16px; font-size: 13px; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  /* Cards */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
  .card-hover { transition: all 0.2s ease; cursor: pointer; }
  .card-hover:hover { background: var(--surface2); border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }

  /* Progress bar */
  .progress-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  /* Chips */
  .chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .chip-a1 { background: rgba(34,197,94,0.15); color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .chip-a2 { background: rgba(56,189,248,0.15); color: var(--blue); border: 1px solid rgba(56,189,248,0.3); }
  .chip-b1 { background: rgba(167,139,250,0.15); color: var(--purple); border: 1px solid rgba(167,139,250,0.3); }
  .chip-b2 { background: rgba(249,115,22,0.15); color: #f97316; border: 1px solid rgba(249,115,22,0.3); }
  .chip-c1 { background: rgba(236,72,153,0.15); color: #ec4899; border: 1px solid rgba(236,72,153,0.3); }
  .chip-c2 { background: rgba(245,200,66,0.15); color: #f5c842; border: 1px solid rgba(245,200,66,0.3); }

  /* Nav */
  .bottom-nav { display: flex; background: var(--surface); border-top: 1px solid var(--border);
    padding: 8px 0 4px; position: sticky; bottom: 0; z-index: 50; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 8px 4px; cursor: pointer; transition: all 0.15s; color: var(--muted); font-size: 10px;
    font-family: var(--font-body); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: none; background: none; }
  .nav-item.active { color: var(--gold); }
  .nav-item:hover { color: var(--text); }
  .nav-icon { font-size: 20px; }

  /* AI Chat */
  .chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; animation: fadeUp 0.3s both; }
  .chat-ai { background: var(--surface2); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .chat-user { background: linear-gradient(135deg, #2563eb, #1d4ed8); border-bottom-right-radius: 4px; align-self: flex-end; }

  /* Exercise */
  .choice-btn { width: 100%; padding: 14px 18px; background: var(--surface); border: 2px solid var(--border2);
    border-radius: var(--radius); color: var(--text); font-family: var(--font-body); font-size: 14px;
    text-align: left; cursor: pointer; transition: all 0.15s; font-weight: 400; }
  .choice-btn:hover:not(:disabled) { background: var(--surface2); border-color: rgba(255,255,255,0.25); }
  .choice-correct { background: rgba(34,197,94,0.15) !important; border-color: var(--green) !important; color: var(--green) !important; animation: pop 0.3s both; }
  .choice-wrong { background: rgba(239,68,68,0.1) !important; border-color: var(--red) !important; color: var(--red) !important; animation: shake 0.4s both; }

  /* Vocab card */
  .vocab-card { perspective: 1000px; }
  .vocab-inner { transition: transform 0.5s; transform-style: preserve-3d; position: relative; }
  .vocab-inner.flipped { transform: rotateY(180deg); }
  .vocab-face { backface-visibility: hidden; }
  .vocab-back { backface-visibility: hidden; transform: rotateY(180deg); }

  /* Tooltip */
  .tooltip { position: relative; }
  .tooltip-text { position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
    background: #1a1a2e; border: 1px solid var(--border2); border-radius: 8px; padding: 6px 10px;
    font-size: 12px; white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.2s; z-index: 100; }
  .tooltip:hover .tooltip-text { opacity: 1; }

  /* Loader */
  .loader { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

  /* Side Menu */
  @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  @keyframes slideOutLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
  .side-menu { position: fixed; top: 0; left: 0; height: 100vh; width: 300px; max-width: 88vw;
    background: #0e0e16; border-right: 1px solid rgba(255,255,255,0.1);
    z-index: 200; display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 8px 0 40px rgba(0,0,0,0.6); }
  .side-menu.open { animation: slideInLeft 0.28s cubic-bezier(.16,1,.3,1) both; }
  .side-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 199;
    backdrop-filter: blur(2px); animation: fadeIn 0.2s ease both; cursor: pointer; }
  .lang-pill { display: flex; align-items: center; gap: 10px; padding: 10px 14px;
    border-radius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
  .lang-pill:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
  .lang-pill.active { background: rgba(245,200,66,0.1); border-color: rgba(245,200,66,0.25); }
  .level-jump { display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    border-radius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
  .level-jump:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.07); }
  .menu-section { padding: 0 12px 12px; }
  .menu-section-title { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: #3d3d50; padding: 10px 14px 6px; }
  .menu-scroll { flex: 1; overflow-y: auto; }
  .menu-scroll::-webkit-scrollbar { width: 3px; }
  .menu-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); }
  .hamburger { display: flex; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px;
    border-radius: 8px; transition: background 0.15s; background: none; border: none; }
  .hamburger:hover { background: rgba(255,255,255,0.08); }
  .hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.2s; }

/* mountain overrides placeholder */
`;

// ─────────────────────────────────────────────
// 20 LANGUAGES
// ─────────────────────────────────────────────
const LANGUAGES = [
  { code: "es", name: "Spanish",    native: "Español",   flag: "🇪🇸", region: "Romance",      status: "full", maxLevel: "C2" },
  { code: "zh", name: "Mandarin",   native: "普通话",     flag: "🇨🇳", region: "Sino-Tibetan", status: "full", maxLevel: "C2" },
  { code: "ja", name: "Japanese",   native: "日本語",     flag: "🇯🇵", region: "Japonic",      status: "full", maxLevel: "C2" },
  { code: "ko", name: "Korean",     native: "한국어",     flag: "🇰🇷", region: "Koreanic",     status: "full", maxLevel: "C2" },
  { code: "fr", name: "French",     native: "Français",  flag: "🇫🇷", region: "Romance",      status: "full", maxLevel: "B1" },
  { code: "de", name: "German",     native: "Deutsch",   flag: "🇩🇪", region: "Germanic",     status: "full", maxLevel: "B1" },
  { code: "it", name: "Italian",    native: "Italiano",  flag: "🇮🇹", region: "Romance",      status: "full", maxLevel: "B1" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇧🇷", region: "Romance",      status: "full", maxLevel: "B1" },
  { code: "pl", name: "Polish",     native: "Polski",    flag: "🇵🇱", region: "Slavic",       status: "full", maxLevel: "B1" },
  { code: "en", name: "English",    native: "English",   flag: "🇬🇧", region: "Germanic",     status: "full", maxLevel: "B1" },
  { code: "ar", name: "Arabic",     native: "العربية",   flag: "🇸🇦", region: "Semitic",      status: "soon" },
  { code: "ru", name: "Russian",    native: "Русский",   flag: "🇷🇺", region: "Slavic",       status: "soon" },
  { code: "hi", name: "Hindi",      native: "हिन्दी",    flag: "🇮🇳", region: "Indo-Aryan",   status: "soon" },
  { code: "tr", name: "Turkish",    native: "Türkçe",    flag: "🇹🇷", region: "Turkic",       status: "soon" },
  { code: "sv", name: "Swedish",    native: "Svenska",   flag: "🇸🇪", region: "Germanic",     status: "soon" },
];


const SITUATIONS = [
  { id:"restaurant",    title:"Restaurant",          icon:"🍽️", color:"#f97316", desc:"Order food, ask for the bill, handle dietary needs", aiRole:"waiter",
    quickPhrases:[
      { en:"A table for two, please", es:"Una mesa para dos, por favor", fr:"Une table pour deux", de:"Einen Tisch für zwei, bitte", it:"Un tavolo per due", pt:"Uma mesa para dois", zh:"两位，请。", ja:"二人です。", ko:"두 명이요.", pl:"Stolik dla dwóch" },
      { en:"The menu, please", es:"La carta, por favor", fr:"La carte, s'il vous plaît", de:"Die Speisekarte, bitte", it:"Il menù, per favore", pt:"O cardápio, por favor", zh:"菜单，谢谢。", ja:"メニューをください。", ko:"메뉴 주세요.", pl:"Kartę dań, proszę" },
      { en:"The bill, please", es:"La cuenta, por favor", fr:"L'addition, s'il vous plaît", de:"Die Rechnung, bitte", it:"Il conto, per favore", pt:"A conta, por favor", zh:"买单，谢谢。", ja:"お会計をお願いします。", ko:"계산서 주세요.", pl:"Poproszę o rachunek" },
      { en:"What do you recommend?", es:"¿Qué recomienda?", fr:"Que recommandez-vous?", de:"Was empfehlen Sie?", it:"Cosa consiglia?", pt:"O que você recomenda?", zh:"你有什么推荐？", ja:"おすすめは何ですか？", ko:"추천해 주실 게 있나요?", pl:"Co poleca?" },
      { en:"I'm allergic to...", es:"Soy alérgico/a a...", fr:"Je suis allergique à...", de:"Ich bin allergisch gegen...", it:"Sono allergico a...", pt:"Sou alérgico a...", zh:"我对……过敏。", ja:"アレルギーがあります。", ko:"알레르기가 있어요.", pl:"Jestem uczulony na..." },
    ]},
  { id:"cafe", title:"Café", icon:"☕", color:"#a16207", desc:"Order coffee and pastries", aiRole:"barista",
    quickPhrases:[
      { en:"One coffee, please", es:"Un café, por favor", fr:"Un café, s'il vous plaît", de:"Einen Kaffee, bitte", it:"Un caffè, per favore", pt:"Um café, por favor", zh:"一杯咖啡，谢谢。", ja:"コーヒーを一つください。", ko:"커피 한 잔 주세요.", pl:"Jedną kawę, proszę" },
      { en:"To take away, please", es:"Para llevar", fr:"À emporter", de:"Zum Mitnehmen", it:"Da asporto", pt:"Para levar", zh:"打包，谢谢。", ja:"テイクアウトで。", ko:"포장이요.", pl:"Na wynos" },
      { en:"Do you have oat milk?", es:"¿Tienen leche de avena?", fr:"Vous avez du lait d'avoine?", de:"Haben Sie Hafermilch?", it:"Avete latte d'avena?", pt:"Tem leite de aveia?", zh:"有燕麦奶吗？", ja:"オーツミルクはありますか？", ko:"귀리 우유 있나요?", pl:"Czy macie mleko owsiane?" },
    ]},
  { id:"hotel", title:"Hotel", icon:"🏨", color:"#06b6d4", desc:"Check in, request amenities, handle problems", aiRole:"receptionist",
    quickPhrases:[
      { en:"I have a reservation", es:"Tengo una reserva", fr:"J'ai une réservation", de:"Ich habe eine Reservierung", it:"Ho una prenotazione", pt:"Tenho uma reserva", zh:"我有预订。", ja:"予約があります。", ko:"예약했어요.", pl:"Mam rezerwację" },
      { en:"What time is check-out?", es:"¿A qué hora es el check-out?", fr:"À quelle heure est le départ?", de:"Wann ist der Check-out?", it:"A che ora è il check-out?", pt:"Qual é o horário de check-out?", zh:"退房时间是几点？", ja:"チェックアウトは何時ですか？", ko:"체크아웃은 몇 시예요?", pl:"O której jest wymeldowanie?" },
      { en:"The key doesn't work", es:"La llave no funciona", fr:"La clé ne fonctionne pas", de:"Der Schlüssel funktioniert nicht", it:"La chiave non funziona", pt:"A chave não funciona", zh:"钥匙坏了。", ja:"鍵が壊れています。", ko:"키가 안 돼요.", pl:"Klucz nie działa" },
      { en:"The WiFi password, please", es:"La contraseña del wifi", fr:"Le mot de passe WiFi", de:"Das WLAN-Passwort", it:"La password del WiFi", pt:"A senha do WiFi", zh:"WiFi密码是多少？", ja:"Wi-Fiのパスワードは？", ko:"와이파이 비밀번호요.", pl:"Hasło do WiFi" },
    ]},
  { id:"airport", title:"Airport", icon:"✈️", color:"#8b5cf6", desc:"Check-in, boarding, lost luggage", aiRole:"airline staff",
    quickPhrases:[
      { en:"Where is the check-in desk?", es:"¿Dónde está el mostrador?", fr:"Où est le comptoir?", de:"Wo ist der Check-in-Schalter?", it:"Dov'è il banco del check-in?", pt:"Onde fica o balcão?", zh:"值机柜台在哪里？", ja:"チェックインカウンターは？", ko:"체크인 카운터가 어디예요?", pl:"Gdzie jest lada odpraw?" },
      { en:"I've lost my suitcase", es:"He perdido mi maleta", fr:"J'ai perdu ma valise", de:"Ich habe meinen Koffer verloren", it:"Ho perso la mia valigia", pt:"Perdi a minha mala", zh:"我的行李丢了。", ja:"スーツケースをなくしました。", ko:"가방을 잃어버렸어요.", pl:"Zgubiłem walizkę" },
      { en:"The flight is delayed", es:"El vuelo está retrasado", fr:"Le vol est retardé", de:"Der Flug hat Verspätung", it:"Il volo è in ritardo", pt:"O voo está atrasado", zh:"航班延误了。", ja:"フライトが遅延しています。", ko:"비행기가 지연됐어요.", pl:"Lot jest opóźniony" },
    ]},
  { id:"doctor", title:"Doctor", icon:"🏥", color:"#ef4444", desc:"Describe symptoms, get medical help", aiRole:"doctor",
    quickPhrases:[
      { en:"I need a doctor", es:"Necesito un médico", fr:"J'ai besoin d'un médecin", de:"Ich brauche einen Arzt", it:"Ho bisogno di un medico", pt:"Preciso de um médico", zh:"我需要看医生。", ja:"医者が必要です。", ko:"의사가 필요해요.", pl:"Potrzebuję lekarza" },
      { en:"My head hurts", es:"Me duele la cabeza", fr:"J'ai mal à la tête", de:"Ich habe Kopfschmerzen", it:"Ho mal di testa", pt:"Minha cabeça dói", zh:"我头疼。", ja:"頭が痛いです。", ko:"머리가 아파요.", pl:"Boli mnie głowa" },
      { en:"I have a fever", es:"Tengo fiebre", fr:"J'ai de la fièvre", de:"Ich habe Fieber", it:"Ho la febbre", pt:"Estou com febre", zh:"我发烧了。", ja:"熱があります。", ko:"열이 나요.", pl:"Mam gorączkę" },
      { en:"I'm allergic to penicillin", es:"Soy alérgico a la penicilina", fr:"Je suis allergique à la pénicilline", de:"Ich bin allergisch auf Penizillin", it:"Sono allergico alla penicillina", pt:"Sou alérgico à penicilina", zh:"我对青霉素过敏。", ja:"ペニシリンアレルギーです。", ko:"페니실린 알레르기가 있어요.", pl:"Jestem uczulony na penicylinę" },
    ]},
  { id:"pharmacy", title:"Pharmacy", icon:"💊", color:"#10b981", desc:"Buy medicine, ask about dosage", aiRole:"pharmacist",
    quickPhrases:[
      { en:"Do I need a prescription?", es:"¿Necesito receta?", fr:"Il me faut une ordonnance?", de:"Brauche ich ein Rezept?", it:"Ho bisogno di una ricetta?", pt:"Preciso de receita?", zh:"我需要处方吗？", ja:"処方箋が必要ですか？", ko:"처방전이 필요한가요?", pl:"Czy potrzebuję recepty?" },
      { en:"How many times a day?", es:"¿Cuántas veces al día?", fr:"Combien de fois par jour?", de:"Wie oft am Tag?", it:"Quante volte al giorno?", pt:"Quantas vezes por dia?", zh:"每天几次？", ja:"1日何回ですか？", ko:"하루에 몇 번이요?", pl:"Ile razy dziennie?" },
    ]},
  { id:"shopping", title:"Shopping", icon:"🛒", color:"#22c55e", desc:"Buy clothes, negotiate prices, returns", aiRole:"shop assistant",
    quickPhrases:[
      { en:"How much is this?", es:"¿Cuánto cuesta?", fr:"Combien ça coûte?", de:"Wie viel kostet das?", it:"Quanto costa?", pt:"Quanto custa?", zh:"这个多少钱？", ja:"いくらですか？", ko:"이거 얼마예요?", pl:"Ile to kosztuje?" },
      { en:"Can I try it on?", es:"¿Puedo probármelo?", fr:"Puis-je l'essayer?", de:"Kann ich das anprobieren?", it:"Posso provarlo?", pt:"Posso experimentar?", zh:"可以试穿吗？", ja:"試着できますか？", ko:"입어봐도 되나요?", pl:"Czy mogę to przymierzyć?" },
      { en:"Do you have a larger size?", es:"¿Lo tiene en talla más grande?", fr:"Vous l'avez en plus grand?", de:"Haben Sie das größer?", it:"Ce l'ha più grande?", pt:"Tem num tamanho maior?", zh:"有大一码的吗？", ja:"大きいサイズはありますか？", ko:"더 큰 사이즈 있나요?", pl:"Czy ma pan/pani w większym rozmiarze?" },
      { en:"Can I return this?", es:"¿Puedo devolverlo?", fr:"Puis-je le retourner?", de:"Kann ich das zurückgeben?", it:"Posso restituirlo?", pt:"Posso devolver?", zh:"可以退货吗？", ja:"返品できますか？", ko:"반품 가능한가요?", pl:"Czy mogę to zwrócić?" },
    ]},
  { id:"supermarket", title:"Supermarket", icon:"🏪", color:"#84cc16", desc:"Find products, checkout", aiRole:"store employee",
    quickPhrases:[
      { en:"Where is the bread?", es:"¿Dónde está el pan?", fr:"Où est le pain?", de:"Wo ist das Brot?", it:"Dov'è il pane?", pt:"Onde fica o pão?", zh:"面包在哪里？", ja:"パンはどこですか？", ko:"빵이 어디 있어요?", pl:"Gdzie jest chleb?" },
      { en:"Do you have this in stock?", es:"¿Tiene esto en stock?", fr:"Vous avez ça en stock?", de:"Ist das vorrätig?", it:"Ce l'avete?", pt:"Tem isso em estoque?", zh:"这个有货吗？", ja:"在庫はありますか？", ko:"재고 있나요?", pl:"Czy to jest w magazynie?" },
    ]},
  { id:"taxi", title:"Taxi & Transport", icon:"🚕", color:"#fbbf24", desc:"Taxis, buses, trains, directions", aiRole:"taxi driver",
    quickPhrases:[
      { en:"Take me to the airport", es:"Lléveme al aeropuerto", fr:"À l'aéroport, s'il vous plaît", de:"Zum Flughafen, bitte", it:"All'aeroporto, per favore", pt:"Para o aeroporto, por favor", zh:"去机场，谢谢。", ja:"空港までお願いします。", ko:"공항으로 가주세요.", pl:"Na lotnisko, proszę" },
      { en:"How much to the centre?", es:"¿Cuánto al centro?", fr:"Combien pour le centre?", de:"Was kostet es bis ins Zentrum?", it:"Quanto per il centro?", pt:"Quanto para o centro?", zh:"去市中心多少钱？", ja:"中心部までいくらですか？", ko:"시내까지 얼마예요?", pl:"Ile do centrum?" },
      { en:"Stop here, please", es:"Pare aquí, por favor", fr:"Arrêtez-vous ici", de:"Halten Sie hier an", it:"Si fermi qui", pt:"Pare aqui", zh:"在这里停。", ja:"ここで止めてください。", ko:"여기서 세워주세요.", pl:"Proszę tu się zatrzymać" },
    ]},
  { id:"making-friends", title:"Meeting People", icon:"🤝", color:"#f472b6", desc:"Introductions, small talk, making friends", aiRole:"new friend",
    quickPhrases:[
      { en:"What's your name?", es:"¿Cómo te llamas?", fr:"Comment tu t'appelles?", de:"Wie heißt du?", it:"Come ti chiami?", pt:"Como você se chama?", zh:"你叫什么名字？", ja:"お名前は？", ko:"이름이 뭐예요?", pl:"Jak masz na imię?" },
      { en:"Where are you from?", es:"¿De dónde eres?", fr:"Tu es d'où?", de:"Woher kommst du?", it:"Di dove sei?", pt:"De onde você é?", zh:"你是哪里人？", ja:"どこの出身ですか？", ko:"어디서 왔어요?", pl:"Skąd jesteś?" },
      { en:"Nice to meet you!", es:"¡Encantado!", fr:"Enchanté(e)!", de:"Schön, dich kennenzulernen!", it:"Piacere di conoscerti!", pt:"Prazer em conhecê-lo!", zh:"很高兴认识你！", ja:"よろしくお願いします！", ko:"만나서 반가워요!", pl:"Miło mi cię poznać!" },
    ]},
  { id:"bank", title:"Bank", icon:"🏦", color:"#6366f1", desc:"Open accounts, transfers, card problems", aiRole:"bank teller",
    quickPhrases:[
      { en:"I'd like to open an account", es:"Quisiera abrir una cuenta", fr:"Je voudrais ouvrir un compte", de:"Ich möchte ein Konto eröffnen", it:"Vorrei aprire un conto", pt:"Gostaria de abrir uma conta", zh:"我想开户。", ja:"口座を開設したいです。", ko:"계좌를 개설하고 싶어요.", pl:"Chciałbym otworzyć konto" },
      { en:"My card has been blocked", es:"Mi tarjeta está bloqueada", fr:"Ma carte a été bloquée", de:"Meine Karte wurde gesperrt", it:"La mia carta è stata bloccata", pt:"Meu cartão foi bloqueado", zh:"我的卡被锁了。", ja:"カードがブロックされました。", ko:"카드가 차단됐어요.", pl:"Moja karta została zablokowana" },
    ]},
  { id:"job-interview", title:"Job Interview", icon:"💼", color:"#0ea5e9", desc:"Interview practice, professional language", aiRole:"HR manager",
    quickPhrases:[
      { en:"I have 3 years of experience", es:"Tengo 3 años de experiencia", fr:"J'ai 3 ans d'expérience", de:"Ich habe 3 Jahre Erfahrung", it:"Ho 3 anni di esperienza", pt:"Tenho 3 anos de experiência", zh:"我有3年工作经验。", ja:"3年の経験があります。", ko:"3년의 경험이 있어요.", pl:"Mam 3 lata doświadczenia" },
      { en:"What are the next steps?", es:"¿Cuáles son los próximos pasos?", fr:"Quelles sont les prochaines étapes?", de:"Was sind die nächsten Schritte?", it:"Quali sono i prossimi passi?", pt:"Quais são os próximos passos?", zh:"接下来的步骤是什么？", ja:"次のステップは何ですか？", ko:"다음 단계는 무엇인가요?", pl:"Jakie są następne kroki?" },
    ]},
  { id:"apartment", title:"Renting an Apartment", icon:"🏠", color:"#f59e0b", desc:"Viewings, contracts, deposits", aiRole:"landlord",
    quickPhrases:[
      { en:"Is the rent negotiable?", es:"¿El alquiler es negociable?", fr:"Le loyer est négociable?", de:"Ist die Miete verhandelbar?", it:"L'affitto è trattabile?", pt:"O aluguel é negociável?", zh:"租金可以商量吗？", ja:"家賃は交渉できますか？", ko:"임대료 협상 가능한가요?", pl:"Czy czynsz jest do negocjacji?" },
      { en:"Are bills included?", es:"¿Los gastos están incluidos?", fr:"Les charges sont incluses?", de:"Sind Nebenkosten inklusive?", it:"Le spese sono incluse?", pt:"As contas estão incluídas?", zh:"包含水电费吗？", ja:"光熱費込みですか？", ko:"공과금 포함인가요?", pl:"Czy rachunki są wliczone?" },
    ]},
  { id:"phone-call", title:"Phone Call", icon:"📞", color:"#64748b", desc:"Making appointments, formal calls", aiRole:"receptionist",
    quickPhrases:[
      { en:"I'd like to make an appointment", es:"Quisiera hacer una cita", fr:"Je voudrais prendre rendez-vous", de:"Ich möchte einen Termin machen", it:"Vorrei fissare un appuntamento", pt:"Gostaria de marcar uma consulta", zh:"我想预约。", ja:"予約したいのですが。", ko:"예약하고 싶어요.", pl:"Chciałbym umówić wizytę" },
      { en:"Can I speak to...?", es:"¿Puedo hablar con...?", fr:"Puis-je parler à...?", de:"Kann ich mit ... sprechen?", it:"Posso parlare con...?", pt:"Posso falar com...?", zh:"我可以和……说话吗？", ja:"…様はいらっしゃいますか？", ko:"…와 통화할 수 있나요?", pl:"Czy mogę rozmawiać z...?" },
    ]},
  { id:"gym", title:"Gym & Fitness", icon:"💪", color:"#dc2626", desc:"Sign up, equipment, fitness classes", aiRole:"gym instructor",
    quickPhrases:[
      { en:"How much is a monthly membership?", es:"¿Cuánto cuesta la mensualidad?", fr:"Combien coûte un abonnement mensuel?", de:"Was kostet eine Monatsmitgliedschaft?", it:"Quanto costa un abbonamento mensile?", pt:"Quanto custa uma mensalidade?", zh:"月会员费多少钱？", ja:"月会費はいくらですか？", ko:"월 회원권 얼마예요?", pl:"Ile kosztuje miesięczny karnet?" },
      { en:"Where are the changing rooms?", es:"¿Dónde están los vestuarios?", fr:"Où sont les vestiaires?", de:"Wo sind die Umkleidekabinen?", it:"Dove sono gli spogliatoi?", pt:"Onde ficam os vestiários?", zh:"更衣室在哪里？", ja:"更衣室はどこですか？", ko:"탈의실이 어디예요?", pl:"Gdzie są szatnie?" },
    ]},
  { id:"bar", title:"Bar & Nightlife", icon:"🍻", color:"#7c3aed", desc:"Order drinks, socialise", aiRole:"bartender",
    quickPhrases:[
      { en:"What beers do you have on tap?", es:"¿Qué cervezas tienen de barril?", fr:"Quelles bières avez-vous à la pression?", de:"Welche Biere haben Sie vom Fass?", it:"Quali birre avete alla spina?", pt:"Quais cervejas têm no barril?", zh:"你们有什么生啤？", ja:"生ビールは何がありますか？", ko:"생맥주 뭐 있어요?", pl:"Jakie macie piwa z beczki?" },
      { en:"Same again please", es:"Lo mismo de nuevo", fr:"La même chose, s'il vous plaît", de:"Das gleiche nochmal, bitte", it:"Lo stesso ancora", pt:"O mesmo de novo", zh:"再来一杯。", ja:"同じものをもう一つ。", ko:"같은 거 하나 더요.", pl:"To samo jeszcze raz" },
    ]},
  { id:"travel", title:"Travel & Tourism", icon:"🗺️", color:"#0891b2", desc:"Sightseeing, tourist info, travel tips", aiRole:"tourist guide",
    quickPhrases:[
      { en:"What are the must-see sights?", es:"¿Qué lugares no hay que perderse?", fr:"Quels sont les incontournables?", de:"Was sind die Sehenswürdigkeiten?", it:"Quali sono i luoghi da non perdere?", pt:"O que não pode deixar de ver?", zh:"必看景点有哪些？", ja:"必見の観光スポットは？", ko:"꼭 봐야 할 명소가 어디예요?", pl:"Co warto zobaczyć?" },
      { en:"How do I get to the old town?", es:"¿Cómo llego al casco antiguo?", fr:"Comment aller à la vieille ville?", de:"Wie komme ich in die Altstadt?", it:"Come arrivo al centro storico?", pt:"Como chego ao centro histórico?", zh:"怎么去老城区？", ja:"旧市街へはどう行けば？", ko:"구시가지에 어떻게 가요?", pl:"Jak dojść do starego miasta?" },
    ]},
  { id:"directions", title:"Asking for Directions", icon:"🧭", color:"#059669", desc:"Getting around, asking locals", aiRole:"local",
    quickPhrases:[
      { en:"Excuse me, how do I get to...?", es:"Perdone, ¿cómo llego a...?", fr:"Excusez-moi, comment aller à...?", de:"Entschuldigung, wie komme ich zu...?", it:"Scusi, come si arriva a...?", pt:"Com licença, como chego a...?", zh:"打扰一下，怎么去……？", ja:"すみません、…にはどう行けば？", ko:"실례합니다, …에 어떻게 가요?", pl:"Przepraszam, jak dojść do...?" },
      { en:"Is it far from here?", es:"¿Está lejos de aquí?", fr:"C'est loin d'ici?", de:"Ist es weit von hier?", it:"È lontano da qui?", pt:"É longe daqui?", zh:"离这里远吗？", ja:"ここから遠いですか？", ko:"여기서 멀어요?", pl:"Czy to daleko stąd?" },
    ]},
  { id:"university", title:"University / School", icon:"🎓", color:"#4f46e5", desc:"Academic life, professors, exams", aiRole:"professor",
    quickPhrases:[
      { en:"When is the deadline?", es:"¿Cuándo es la fecha límite?", fr:"Quelle est la date limite?", de:"Wann ist die Frist?", it:"Qual è la scadenza?", pt:"Qual é o prazo?", zh:"截止日期是什么时候？", ja:"締め切りはいつですか？", ko:"마감 기한이 언제예요?", pl:"Kiedy jest termin?" },
      { en:"Can I get an extension?", es:"¿Puedo pedir una prórroga?", fr:"Je peux avoir une prolongation?", de:"Kann ich eine Verlängerung bekommen?", it:"Posso avere una proroga?", pt:"Posso ter uma prorrogação?", zh:"可以延期吗？", ja:"延長できますか？", ko:"연장 가능할까요?", pl:"Czy mogę dostać przedłużenie?" },
    ]},
  { id:"emergency", title:"Emergency", icon:"🚨", color:"#b91c1c", desc:"Emergency phrases, calling for help", aiRole:"emergency operator",
    quickPhrases:[
      { en:"Call an ambulance!", es:"¡Llame a una ambulancia!", fr:"Appelez une ambulance!", de:"Rufen Sie einen Krankenwagen!", it:"Chiami un'ambulanza!", pt:"Chame uma ambulância!", zh:"叫救护车！", ja:"救急車を呼んでください！", ko:"구급차 불러주세요!", pl:"Proszę zadzwonić po karetkę!" },
      { en:"Call the police!", es:"¡Llame a la policía!", fr:"Appelez la police!", de:"Rufen Sie die Polizei!", it:"Chiami la polizia!", pt:"Chame a polícia!", zh:"报警！", ja:"警察を呼んでください！", ko:"경찰 불러주세요!", pl:"Proszę zadzwonić na policję!" },
      { en:"I've been robbed", es:"Me han robado", fr:"On m'a volé", de:"Ich wurde bestohlen", it:"Mi hanno derubato", pt:"Fui roubado", zh:"我被抢了。", ja:"盗難に遭いました。", ko:"도난당했어요.", pl:"Zostałem okradziony" },
    ]},
  { id:"post-office", title:"Post Office", icon:"📮", color:"#d97706", desc:"Sending parcels, stamps, services", aiRole:"post office clerk",
    quickPhrases:[
      { en:"I'd like to send this to...", es:"Quisiera enviar esto a...", fr:"Je voudrais envoyer ça à...", de:"Ich möchte das nach ... schicken", it:"Vorrei spedire questo a...", pt:"Gostaria de enviar isso para...", zh:"我想把这个寄到……", ja:"これを…に送りたいです。", ko:"이걸 …로 보내고 싶어요.", pl:"Chciałbym to wysłać do..." },
      { en:"How long will it take?", es:"¿Cuánto tardará?", fr:"Combien de temps ça prend?", de:"Wie lange dauert das?", it:"Quanto tempo ci vuole?", pt:"Quanto tempo demora?", zh:"需要多长时间？", ja:"どのくらいかかりますか？", ko:"얼마나 걸려요?", pl:"Ile to potrwa?" },
    ]},
  { id:"date", title:"First Date", icon:"❤️", color:"#e11d48", desc:"Romantic conversation, getting to know someone", aiRole:"date",
    quickPhrases:[
      { en:"You look great!", es:"¡Estás muy bien!", fr:"Tu es superbe!", de:"Du siehst toll aus!", it:"Stai benissimo!", pt:"Você está ótimo/a!", zh:"你看起来太好了！", ja:"素敵ですね！", ko:"정말 멋지네요!", pl:"Świetnie wyglądasz!" },
      { en:"What kind of music do you like?", es:"¿Qué tipo de música te gusta?", fr:"Quel genre de musique tu aimes?", de:"Welche Musik magst du?", it:"Che tipo di musica ti piace?", pt:"Que tipo de música você gosta?", zh:"你喜欢什么音乐？", ja:"どんな音楽が好きですか？", ko:"어떤 음악 좋아해요?", pl:"Jaką muzykę lubisz?" },
    ]},
  { id:"office", title:"Office / Work", icon:"🏢", color:"#475569", desc:"Meetings, colleagues, workplace talk", aiRole:"colleague",
    quickPhrases:[
      { en:"Let's schedule a meeting", es:"Vamos a programar una reunión", fr:"Planifions une réunion", de:"Lass uns ein Meeting planen", it:"Pianifichiamo una riunione", pt:"Vamos agendar uma reunião", zh:"我们安排一次会议吧。", ja:"ミーティングを設定しましょう。", ko:"회의를 잡읍시다.", pl:"Zaplanujmy spotkanie" },
      { en:"Can you send me the report?", es:"¿Puedes enviarme el informe?", fr:"Peux-tu m'envoyer le rapport?", de:"Kannst du mir den Bericht schicken?", it:"Puoi mandarmi il rapporto?", pt:"Pode me mandar o relatório?", zh:"你能把报告发给我吗？", ja:"レポートを送ってもらえますか？", ko:"보고서 보내줄 수 있어요?", pl:"Czy możesz mi wysłać raport?" },
    ]},
  { id:"weather", title:"Weather & Small Talk", icon:"☀️", color:"#eab308", desc:"Casual conversation, weather, daily life", aiRole:"local",
    quickPhrases:[
      { en:"What's the weather like today?", es:"¿Qué tiempo hace hoy?", fr:"Quel temps fait-il aujourd'hui?", de:"Wie ist das Wetter heute?", it:"Com'è il tempo oggi?", pt:"Como está o tempo hoje?", zh:"今天天气怎么样？", ja:"今日の天気は？", ko:"오늘 날씨 어때요?", pl:"Jaka jest dziś pogoda?" },
      { en:"It's beautiful today!", es:"¡Hace un día precioso!", fr:"Il fait beau aujourd'hui!", de:"Heute ist schönes Wetter!", it:"Oggi è una bella giornata!", pt:"Hoje está lindo!", zh:"今天天气真好！", ja:"今日はいい天気ですね！", ko:"오늘 날씨 좋죠!", pl:"Dzisiaj jest pięknie!" },
    ]},
  { id:"cooking", title:"Food & Cooking", icon:"🍳", color:"#16a34a", desc:"Recipes, ingredients, food culture", aiRole:"chef",
    quickPhrases:[
      { en:"What's your favourite dish?", es:"¿Cuál es tu plato favorito?", fr:"Quel est ton plat préféré?", de:"Was ist dein Lieblingsessen?", it:"Qual è il tuo piatto preferito?", pt:"Qual é o seu prato favorito?", zh:"你最喜欢的菜是什么？", ja:"好きな料理は何ですか？", ko:"가장 좋아하는 음식이 뭐예요?", pl:"Jakie jest twoje ulubione danie?" },
    ]},
];

const EXTRA_SITUATION_PHRASES = {
  restaurant: [
    {
      en: "I would like to order now",
      es: "Quisiera pedir ahora",
      fr: "Je voudrais commander maintenant",
      de: "Ich möchte jetzt bestellen",
      it: "Vorrei ordinare adesso",
      pt: "Gostaria de pedir agora",
      zh: "我现在想点餐。",
      ja: "今注文したいです。",
      ko: "지금 주문하고 싶어요.",
      pl: "Chciałbym teraz zamówić"
    },
    {
      en: "What is today's special?",
      es: "¿Cuál es el plato del día?",
      fr: "Quel est le plat du jour ?",
      de: "Was ist das Tagesgericht?",
      it: "Qual è il piatto del giorno?",
      pt: "Qual é o prato do dia?",
      zh: "今天的特色菜是什么？",
      ja: "本日のおすすめは何ですか？",
      ko: "오늘의 추천 메뉴가 뭐예요?",
      pl: "Jakie jest danie dnia?"
    },
    {
      en: "No onions, please",
      es: "Sin cebolla, por favor",
      fr: "Sans oignons, s'il vous plaît",
      de: "Keine Zwiebeln, bitte",
      it: "Senza cipolla, per favore",
      pt: "Sem cebola, por favor",
      zh: "不要洋葱，谢谢。",
      ja: "玉ねぎ抜きでお願いします。",
      ko: "양파 빼 주세요.",
      pl: "Bez cebuli, proszę"
    },
    {
      en: "Can we have some water?",
      es: "¿Nos trae agua?",
      fr: "On peut avoir de l'eau ?",
      de: "Können wir Wasser haben?",
      it: "Possiamo avere dell'acqua?",
      pt: "Pode trazer água?",
      zh: "可以给我们一些水吗？",
      ja: "お水をもらえますか？",
      ko: "물 좀 주시겠어요?",
      pl: "Czy możemy dostać wodę?"
    },
    {
      en: "That was delicious",
      es: "Estaba delicioso",
      fr: "C'était délicieux",
      de: "Das war lecker",
      it: "Era delizioso",
      pt: "Estava delicioso",
      zh: "很好吃。",
      ja: "とてもおいしかったです。",
      ko: "정말 맛있었어요.",
      pl: "To było pyszne"
    }
  ],
  cafe: [
    {
      en: "A cappuccino, please",
      es: "Un capuchino, por favor",
      fr: "Un cappuccino, s'il vous plaît",
      de: "Einen Cappuccino, bitte",
      it: "Un cappuccino, per favore",
      pt: "Um cappuccino, por favor",
      zh: "一杯卡布奇诺，谢谢。",
      ja: "カプチーノを一つお願いします。",
      ko: "카푸치노 한 잔 주세요.",
      pl: "Poproszę cappuccino"
    },
    {
      en: "Can I get it iced?",
      es: "¿Puede ser con hielo?",
      fr: "Je peux l'avoir glacé ?",
      de: "Kann ich es eisgekühlt bekommen?",
      it: "Posso averlo freddo?",
      pt: "Pode ser gelado?",
      zh: "可以做成冰的吗？",
      ja: "アイスにできますか？",
      ko: "아이스로 가능할까요?",
      pl: "Czy może być na zimno?"
    },
    {
      en: "With soy milk, please",
      es: "Con leche de soja, por favor",
      fr: "Avec du lait de soja, s'il vous plaît",
      de: "Mit Sojamilch, bitte",
      it: "Con latte di soia, per favore",
      pt: "Com leite de soja, por favor",
      zh: "请加豆奶。",
      ja: "豆乳でお願いします。",
      ko: "두유로 해 주세요.",
      pl: "Z mlekiem sojowym, proszę"
    },
    {
      en: "Anything sweet?",
      es: "¿Tienen algo dulce?",
      fr: "Vous avez quelque chose de sucré ?",
      de: "Haben Sie etwas Süßes?",
      it: "Avete qualcosa di dolce?",
      pt: "Vocês têm algo doce?",
      zh: "有甜点吗？",
      ja: "甘いものはありますか？",
      ko: "달콤한 거 있어요?",
      pl: "Macie coś słodkiego?"
    },
    {
      en: "Can I pay by card?",
      es: "¿Puedo pagar con tarjeta?",
      fr: "Je peux payer par carte ?",
      de: "Kann ich mit Karte zahlen?",
      it: "Posso pagare con la carta?",
      pt: "Posso pagar com cartão?",
      zh: "可以刷卡吗？",
      ja: "カードで払えますか？",
      ko: "카드로 결제할 수 있나요?",
      pl: "Czy mogę zapłacić kartą?"
    },
    {
      en: "One croissant, please",
      es: "Un cruasán, por favor",
      fr: "Un croissant, s'il vous plaît",
      de: "Ein Croissant, bitte",
      it: "Un cornetto, per favore",
      pt: "Um croissant, por favor",
      zh: "一个牛角包，谢谢。",
      ja: "クロワッサンを一つください。",
      ko: "크루아상 하나 주세요.",
      pl: "Jednego croissanta, proszę"
    },
    {
      en: "For here, please",
      es: "Para tomar aquí",
      fr: "Sur place, s'il vous plaît",
      de: "Zum Hiertrinken, bitte",
      it: "Da consumare qui",
      pt: "Para consumir aqui",
      zh: "在这里喝。",
      ja: "店内でお願いします。",
      ko: "매장에서 먹을게요.",
      pl: "Na miejscu, proszę"
    }
  ],
  hotel: [
    {
      en: "Can I check in now?",
      es: "¿Puedo hacer el check-in ahora?",
      fr: "Je peux m'enregistrer maintenant ?",
      de: "Kann ich jetzt einchecken?",
      it: "Posso fare il check-in adesso?",
      pt: "Posso fazer o check-in agora?",
      zh: "我现在可以办理入住吗？",
      ja: "今チェックインできますか？",
      ko: "지금 체크인할 수 있나요?",
      pl: "Czy mogę się teraz zameldować?"
    },
    {
      en: "Is breakfast included?",
      es: "¿El desayuno está incluido?",
      fr: "Le petit-déjeuner est-il inclus ?",
      de: "Ist das Frühstück inklusive?",
      it: "La colazione è inclusa?",
      pt: "O café da manhã está incluído?",
      zh: "含早餐吗？",
      ja: "朝食は含まれていますか？",
      ko: "조식이 포함돼 있나요?",
      pl: "Czy śniadanie jest wliczone?"
    },
    {
      en: "Can I have another towel?",
      es: "¿Me puede traer otra toalla?",
      fr: "Je peux avoir une autre serviette ?",
      de: "Kann ich noch ein Handtuch bekommen?",
      it: "Posso avere un altro asciugamano?",
      pt: "Pode me trazer outra toalha?",
      zh: "可以再给我一条毛巾吗？",
      ja: "タオルをもう一枚もらえますか？",
      ko: "수건 하나 더 주실 수 있나요?",
      pl: "Czy mogę dostać jeszcze jeden ręcznik?"
    },
    {
      en: "The room is too cold",
      es: "La habitación está demasiado fría",
      fr: "La chambre est trop froide",
      de: "Das Zimmer ist zu kalt",
      it: "La stanza è troppo fredda",
      pt: "O quarto está muito frio",
      zh: "房间太冷了。",
      ja: "部屋が寒すぎます。",
      ko: "방이 너무 추워요.",
      pl: "W pokoju jest za zimno"
    },
    {
      en: "Could you call a taxi?",
      es: "¿Puede llamar un taxi?",
      fr: "Pouvez-vous appeler un taxi ?",
      de: "Können Sie ein Taxi rufen?",
      it: "Può chiamare un taxi?",
      pt: "Pode chamar um táxi?",
      zh: "您可以帮我叫辆出租车吗？",
      ja: "タクシーを呼んでもらえますか？",
      ko: "택시 불러 주실 수 있나요?",
      pl: "Czy może pan/pani zamówić taksówkę?"
    },
    {
      en: "Which room number?",
      es: "¿Qué número de habitación?",
      fr: "Quel est le numéro de chambre ?",
      de: "Welche Zimmernummer?",
      it: "Qual è il numero della camera?",
      pt: "Qual é o número do quarto?",
      zh: "房间号是多少？",
      ja: "部屋番号は何ですか？",
      ko: "객실 번호가 뭐예요?",
      pl: "Jaki jest numer pokoju?"
    }
  ],
  airport: [
    {
      en: "Where is security?",
      es: "¿Dónde está el control de seguridad?",
      fr: "Où est le contrôle de sécurité ?",
      de: "Wo ist die Sicherheitskontrolle?",
      it: "Dov'è il controllo di sicurezza?",
      pt: "Onde fica o controle de segurança?",
      zh: "安检在哪里？",
      ja: "保安検査場はどこですか？",
      ko: "보안 검색대가 어디예요?",
      pl: "Gdzie jest kontrola bezpieczeństwa?"
    },
    {
      en: "Which gate is it?",
      es: "¿Qué puerta es?",
      fr: "C'est quelle porte ?",
      de: "Welches Gate ist es?",
      it: "Qual è il gate?",
      pt: "Qual é o portão?",
      zh: "是几号登机口？",
      ja: "何番ゲートですか？",
      ko: "몇 번 게이트예요?",
      pl: "Która to bramka?"
    },
    {
      en: "Can I take this bag as hand luggage?",
      es: "¿Puedo llevar esta bolsa como equipaje de mano?",
      fr: "Je peux prendre ce sac en bagage cabine ?",
      de: "Kann ich diese Tasche als Handgepäck mitnehmen?",
      it: "Posso portare questa borsa come bagaglio a mano?",
      pt: "Posso levar esta bolsa como bagagem de mão?",
      zh: "这个包可以当随身行李吗？",
      ja: "このバッグは機内持ち込みできますか？",
      ko: "이 가방은 기내 반입 되나요?",
      pl: "Czy mogę wziąć tę torbę jako bagaż podręczny?"
    },
    {
      en: "Where is passport control?",
      es: "¿Dónde está el control de pasaportes?",
      fr: "Où est le contrôle des passeports ?",
      de: "Wo ist die Passkontrolle?",
      it: "Dov'è il controllo passaporti?",
      pt: "Onde fica o controle de passaporte?",
      zh: "护照检查在哪里？",
      ja: "パスポートコントロールはどこですか？",
      ko: "출입국 심사는 어디예요?",
      pl: "Gdzie jest kontrola paszportowa?"
    },
    {
      en: "I missed my flight",
      es: "He perdido mi vuelo",
      fr: "J'ai raté mon vol",
      de: "Ich habe meinen Flug verpasst",
      it: "Ho perso il mio volo",
      pt: "Perdi meu voo",
      zh: "我误机了。",
      ja: "飛行機に乗り遅れました。",
      ko: "비행기를 놓쳤어요.",
      pl: "Spóźniłem się na lot"
    },
    {
      en: "I need help with my boarding pass",
      es: "Necesito ayuda con mi tarjeta de embarque",
      fr: "J'ai besoin d'aide avec ma carte d'embarquement",
      de: "Ich brauche Hilfe mit meiner Bordkarte",
      it: "Ho bisogno di aiuto con la mia carta d'imbarco",
      pt: "Preciso de ajuda com meu cartão de embarque",
      zh: "我的登机牌需要帮助。",
      ja: "搭乗券で助けが必要です。",
      ko: "탑승권 때문에 도움이 필요해요.",
      pl: "Potrzebuję pomocy z kartą pokładową"
    },
    {
      en: "Where can I collect my luggage?",
      es: "¿Dónde recojo mi equipaje?",
      fr: "Où puis-je récupérer mes bagages ?",
      de: "Wo kann ich mein Gepäck abholen?",
      it: "Dove posso ritirare il bagaglio?",
      pt: "Onde posso pegar minha bagagem?",
      zh: "我在哪里取行李？",
      ja: "荷物はどこで受け取れますか？",
      ko: "짐은 어디서 찾나요?",
      pl: "Gdzie mogę odebrać bagaż?"
    }
  ],
  doctor: [
    {
      en: "My stomach hurts",
      es: "Me duele el estómago",
      fr: "J'ai mal à l'estomac",
      de: "Ich habe Bauchschmerzen",
      it: "Mi fa male lo stomaco",
      pt: "Meu estômago dói",
      zh: "我胃疼。",
      ja: "お腹が痛いです。",
      ko: "배가 아파요.",
      pl: "Boli mnie brzuch"
    },
    {
      en: "I have been sick since yesterday",
      es: "Estoy enfermo desde ayer",
      fr: "Je suis malade depuis hier",
      de: "Ich bin seit gestern krank",
      it: "Sto male da ieri",
      pt: "Estou doente desde ontem",
      zh: "我从昨天开始就不舒服。",
      ja: "昨日から具合が悪いです。",
      ko: "어제부터 아파요.",
      pl: "Jestem chory od wczoraj"
    },
    {
      en: "Do I need medicine?",
      es: "¿Necesito medicina?",
      fr: "J'ai besoin d'un médicament ?",
      de: "Brauche ich Medikamente?",
      it: "Ho bisogno di medicine?",
      pt: "Preciso de remédio?",
      zh: "我需要吃药吗？",
      ja: "薬が必要ですか？",
      ko: "약이 필요할까요?",
      pl: "Czy potrzebuję lekarstwa?"
    },
    {
      en: "I feel dizzy",
      es: "Me siento mareado",
      fr: "Je me sens étourdi",
      de: "Mir ist schwindelig",
      it: "Mi sento stordito",
      pt: "Estou tonto",
      zh: "我头晕。",
      ja: "めまいがします。",
      ko: "어지러워요.",
      pl: "Kręci mi się w głowie"
    },
    {
      en: "It hurts here",
      es: "Me duele aquí",
      fr: "J'ai mal ici",
      de: "Es tut hier weh",
      it: "Mi fa male qui",
      pt: "Dói aqui",
      zh: "这里疼。",
      ja: "ここが痛いです。",
      ko: "여기가 아파요.",
      pl: "Boli tutaj"
    },
    {
      en: "How often should I take this?",
      es: "¿Con qué frecuencia debo tomar esto?",
      fr: "À quelle fréquence dois-je le prendre ?",
      de: "Wie oft soll ich das nehmen?",
      it: "Quanto spesso devo prenderlo?",
      pt: "Com que frequência devo tomar isso?",
      zh: "这个药多久吃一次？",
      ja: "これはどのくらいの頻度で飲めばいいですか？",
      ko: "이 약은 얼마나 자주 먹어야 해요?",
      pl: "Jak często mam to brać?"
    }
  ],
  pharmacy: [
    {
      en: "I need something for a cold",
      es: "Necesito algo para un resfriado",
      fr: "J'ai besoin de quelque chose contre le rhume",
      de: "Ich brauche etwas gegen eine Erkältung",
      it: "Ho bisogno di qualcosa per il raffreddore",
      pt: "Preciso de algo para resfriado",
      zh: "我需要治感冒的药。",
      ja: "風邪薬が必要です。",
      ko: "감기약이 필요해요.",
      pl: "Potrzebuję czegoś na przeziębienie"
    },
    {
      en: "Does this have side effects?",
      es: "¿Tiene efectos secundarios?",
      fr: "Y a-t-il des effets secondaires ?",
      de: "Hat das Nebenwirkungen?",
      it: "Ha effetti collaterali?",
      pt: "Tem efeitos colaterais?",
      zh: "这个有副作用吗？",
      ja: "副作用はありますか？",
      ko: "부작용이 있나요?",
      pl: "Czy to ma skutki uboczne?"
    },
    {
      en: "Should I take it with food?",
      es: "¿Debo tomarlo con comida?",
      fr: "Dois-je le prendre avec de la nourriture ?",
      de: "Soll ich es mit Essen einnehmen?",
      it: "Devo prenderlo con il cibo?",
      pt: "Devo tomar com comida?",
      zh: "要和饭一起吃吗？",
      ja: "食事と一緒に飲むべきですか？",
      ko: "식사와 함께 먹어야 하나요?",
      pl: "Czy mam to brać z jedzeniem?"
    },
    {
      en: "Can children take this?",
      es: "¿Los niños pueden tomar esto?",
      fr: "Les enfants peuvent prendre ça ?",
      de: "Können Kinder das nehmen?",
      it: "I bambini possono prenderlo?",
      pt: "Crianças podem tomar isso?",
      zh: "孩子可以吃这个吗？",
      ja: "子どもでも飲めますか？",
      ko: "아이들도 먹을 수 있나요?",
      pl: "Czy dzieci mogą to brać?"
    },
    {
      en: "I have a headache",
      es: "Tengo dolor de cabeza",
      fr: "J'ai mal à la tête",
      de: "Ich habe Kopfschmerzen",
      it: "Ho mal di testa",
      pt: "Estou com dor de cabeça",
      zh: "我头疼。",
      ja: "頭痛があります。",
      ko: "두통이 있어요.",
      pl: "Boli mnie głowa"
    },
    {
      en: "Can you explain the dosage?",
      es: "¿Puede explicar la dosis?",
      fr: "Pouvez-vous expliquer la posologie ?",
      de: "Können Sie die Dosierung erklären?",
      it: "Può spiegare il dosaggio?",
      pt: "Pode explicar a dosagem?",
      zh: "您能解释一下剂量吗？",
      ja: "用量を説明してもらえますか？",
      ko: "복용량을 설명해 주실 수 있나요?",
      pl: "Czy może pan/pani wyjaśnić dawkowanie?"
    },
    {
      en: "I need pain relief",
      es: "Necesito algo para el dolor",
      fr: "J'ai besoin d'un antidouleur",
      de: "Ich brauche etwas gegen Schmerzen",
      it: "Ho bisogno di un antidolorifico",
      pt: "Preciso de algo para dor",
      zh: "我需要止痛药。",
      ja: "痛み止めが必要です。",
      ko: "진통제가 필요해요.",
      pl: "Potrzebuję czegoś przeciwbólowego"
    },
    {
      en: "Is this medicine strong?",
      es: "¿Es fuerte este medicamento?",
      fr: "Ce médicament est fort ?",
      de: "Ist dieses Medikament stark?",
      it: "Questo medicinale è forte?",
      pt: "Esse remédio é forte?",
      zh: "这个药效强吗？",
      ja: "この薬は強いですか？",
      ko: "이 약은 강한가요?",
      pl: "Czy ten lek jest mocny?"
    }
  ],
  shopping: [
    {
      en: "I'm just looking, thank you",
      es: "Solo estoy mirando, gracias",
      fr: "Je regarde seulement, merci",
      de: "Ich schaue mich nur um, danke",
      it: "Sto solo guardando, grazie",
      pt: "Só estou olhando, obrigado",
      zh: "我只是看看，谢谢。",
      ja: "見ているだけです、ありがとう。",
      ko: "그냥 보고 있어요, 감사합니다.",
      pl: "Tylko się rozglądam, dziękuję"
    },
    {
      en: "Do you have this in black?",
      es: "¿Lo tiene en negro?",
      fr: "Vous l'avez en noir ?",
      de: "Haben Sie das in Schwarz?",
      it: "Ce l'ha in nero?",
      pt: "Tem isso em preto?",
      zh: "这个有黑色的吗？",
      ja: "黒はありますか？",
      ko: "검은색 있어요?",
      pl: "Czy mają to w czarnym kolorze?"
    },
    {
      en: "Where is the fitting room?",
      es: "¿Dónde está el probador?",
      fr: "Où est la cabine d'essayage ?",
      de: "Wo ist die Umkleidekabine?",
      it: "Dov'è il camerino?",
      pt: "Onde fica o provador?",
      zh: "试衣间在哪里？",
      ja: "試着室はどこですか？",
      ko: "탈의실이 어디예요?",
      pl: "Gdzie jest przymierzalnia?"
    },
    {
      en: "It's too expensive",
      es: "Es demasiado caro",
      fr: "C'est trop cher",
      de: "Das ist zu teuer",
      it: "È troppo caro",
      pt: "É muito caro",
      zh: "太贵了。",
      ja: "高すぎます。",
      ko: "너무 비싸요.",
      pl: "To jest za drogie"
    },
    {
      en: "Do you have a smaller size?",
      es: "¿Lo tiene en una talla más pequeña?",
      fr: "Vous l'avez en plus petit ?",
      de: "Haben Sie das kleiner?",
      it: "Ce l'ha più piccolo?",
      pt: "Tem num tamanho menor?",
      zh: "有小一码的吗？",
      ja: "小さいサイズはありますか？",
      ko: "더 작은 사이즈 있나요?",
      pl: "Czy jest mniejszy rozmiar?"
    },
    {
      en: "I'll take it",
      es: "Me lo llevo",
      fr: "Je le prends",
      de: "Ich nehme es",
      it: "Lo prendo",
      pt: "Vou levar",
      zh: "我要这个。",
      ja: "これにします。",
      ko: "이걸로 할게요.",
      pl: "Wezmę to"
    },
    {
      en: "Can I get a receipt?",
      es: "¿Me da el recibo?",
      fr: "Je peux avoir le reçu ?",
      de: "Kann ich eine Quittung bekommen?",
      it: "Posso avere lo scontrino?",
      pt: "Posso pegar o recibo?",
      zh: "可以给我收据吗？",
      ja: "レシートをもらえますか？",
      ko: "영수증 받을 수 있나요?",
      pl: "Czy mogę dostać paragon?"
    }
  ],
  supermarket: [
    {
      en: "Where can I find milk?",
      es: "¿Dónde puedo encontrar leche?",
      fr: "Où puis-je trouver du lait ?",
      de: "Wo finde ich Milch?",
      it: "Dove posso trovare il latte?",
      pt: "Onde posso encontrar leite?",
      zh: "牛奶在哪里？",
      ja: "牛乳はどこですか？",
      ko: "우유는 어디에 있어요?",
      pl: "Gdzie znajdę mleko?"
    },
    {
      en: "Is this fresh?",
      es: "¿Está fresco?",
      fr: "C'est frais ?",
      de: "Ist das frisch?",
      it: "È fresco?",
      pt: "Está fresco?",
      zh: "这个新鲜吗？",
      ja: "これは新鮮ですか？",
      ko: "이거 신선해요?",
      pl: "Czy to jest świeże?"
    },
    {
      en: "Which aisle is it in?",
      es: "¿En qué pasillo está?",
      fr: "C'est dans quel rayon ?",
      de: "In welchem Gang ist das?",
      it: "In quale corsia si trova?",
      pt: "Em qual corredor fica?",
      zh: "在第几排？",
      ja: "何番通路ですか？",
      ko: "몇 번 통로에 있어요?",
      pl: "W którym alejce to jest?"
    },
    {
      en: "Do you sell fruit here?",
      es: "¿Venden fruta aquí?",
      fr: "Vous vendez des fruits ici ?",
      de: "Verkaufen Sie hier Obst?",
      it: "Vendete frutta qui?",
      pt: "Vocês vendem fruta aqui?",
      zh: "这里卖水果吗？",
      ja: "ここで果物を売っていますか？",
      ko: "여기 과일 팔아요?",
      pl: "Czy sprzedajecie tu owoce?"
    },
    {
      en: "I need a basket",
      es: "Necesito una cesta",
      fr: "J'ai besoin d'un panier",
      de: "Ich brauche einen Korb",
      it: "Ho bisogno di un cestino",
      pt: "Preciso de uma cesta",
      zh: "我需要一个篮子。",
      ja: "かごが必要です。",
      ko: "바구니가 필요해요.",
      pl: "Potrzebuję koszyka"
    },
    {
      en: "Is there a self-checkout?",
      es: "¿Hay caja automática?",
      fr: "Il y a une caisse automatique ?",
      de: "Gibt es eine Selbstbedienungskasse?",
      it: "C'è una cassa automatica?",
      pt: "Tem caixa de autoatendimento?",
      zh: "有自助结账吗？",
      ja: "セルフレジはありますか？",
      ko: "셀프 계산대가 있나요?",
      pl: "Czy jest kasa samoobsługowa?"
    },
    {
      en: "Can I pay cash?",
      es: "¿Puedo pagar en efectivo?",
      fr: "Je peux payer en espèces ?",
      de: "Kann ich bar bezahlen?",
      it: "Posso pagare in contanti?",
      pt: "Posso pagar em dinheiro?",
      zh: "可以付现金吗？",
      ja: "現金で払えますか？",
      ko: "현금으로 결제할 수 있나요?",
      pl: "Czy mogę zapłacić gotówką?"
    },
    {
      en: "I only need one bag",
      es: "Solo necesito una bolsa",
      fr: "J'ai seulement besoin d'un sac",
      de: "Ich brauche nur eine Tasche",
      it: "Mi serve solo una busta",
      pt: "Só preciso de uma sacola",
      zh: "我只需要一个袋子。",
      ja: "袋は一つだけで大丈夫です。",
      ko: "봉투 하나만 필요해요.",
      pl: "Potrzebuję tylko jednej torby"
    }
  ],
  taxi: [
    {
      en: "Please use the meter",
      es: "Use el taxímetro, por favor",
      fr: "Mettez le compteur, s'il vous plaît",
      de: "Bitte benutzen Sie das Taxameter",
      it: "Usi il tassametro, per favore",
      pt: "Use o taxímetro, por favor",
      zh: "请打表。",
      ja: "メーターを使ってください。",
      ko: "미터기 켜 주세요.",
      pl: "Proszę włączyć taksometr"
    },
    {
      en: "How long will it take?",
      es: "¿Cuánto tardará?",
      fr: "Combien de temps cela prendra-t-il ?",
      de: "Wie lange dauert es?",
      it: "Quanto ci vorrà?",
      pt: "Quanto tempo vai levar?",
      zh: "要多久？",
      ja: "どれくらいかかりますか？",
      ko: "얼마나 걸려요?",
      pl: "Ile to zajmie?"
    },
    {
      en: "Can you take the fastest route?",
      es: "¿Puede tomar la ruta más rápida?",
      fr: "Pouvez-vous prendre l'itinéraire le plus rapide ?",
      de: "Können Sie die schnellste Route nehmen?",
      it: "Può prendere la strada più veloce?",
      pt: "Pode pegar o caminho mais rápido?",
      zh: "可以走最快的路线吗？",
      ja: "一番早いルートでお願いします。",
      ko: "가장 빠른 길로 가 주세요.",
      pl: "Czy może pan/pani jechać najszybszą trasą?"
    },
    {
      en: "Please wait here",
      es: "Espere aquí, por favor",
      fr: "Attendez ici, s'il vous plaît",
      de: "Bitte warten Sie hier",
      it: "Aspetti qui, per favore",
      pt: "Espere aqui, por favor",
      zh: "请在这里等一下。",
      ja: "ここで待ってください。",
      ko: "여기서 기다려 주세요.",
      pl: "Proszę tu poczekać"
    },
    {
      en: "Can I pay by card?",
      es: "¿Puedo pagar con tarjeta?",
      fr: "Je peux payer par carte ?",
      de: "Kann ich mit Karte zahlen?",
      it: "Posso pagare con la carta?",
      pt: "Posso pagar com cartão?",
      zh: "可以刷卡吗？",
      ja: "カードで払えますか？",
      ko: "카드로 결제할 수 있나요?",
      pl: "Czy mogę zapłacić kartą?"
    },
    {
      en: "I’m in a hurry",
      es: "Tengo prisa",
      fr: "Je suis pressé",
      de: "Ich habe es eilig",
      it: "Ho fretta",
      pt: "Estou com pressa",
      zh: "我很赶时间。",
      ja: "急いでいます。",
      ko: "저 급해요.",
      pl: "Spieszę się"
    },
    {
      en: "Can you help with my bags?",
      es: "¿Puede ayudarme con mis maletas?",
      fr: "Pouvez-vous m'aider avec mes bagages ?",
      de: "Können Sie mir mit meinem Gepäck helfen?",
      it: "Può aiutarmi con i bagagli?",
      pt: "Pode me ajudar com as malas?",
      zh: "您可以帮我拿行李吗？",
      ja: "荷物を手伝ってもらえますか？",
      ko: "짐 좀 도와주실 수 있나요?",
      pl: "Czy może pan/pani pomóc mi z bagażami?"
    }
  ],
  "making-friends": [
    {
      en: "What do you do?",
      es: "¿A qué te dedicas?",
      fr: "Qu'est-ce que tu fais dans la vie ?",
      de: "Was machst du beruflich?",
      it: "Che lavoro fai?",
      pt: "O que você faz?",
      zh: "你是做什么工作的？",
      ja: "お仕事は何ですか？",
      ko: "무슨 일 하세요?",
      pl: "Czym się zajmujesz?"
    },
    {
      en: "Do you live here?",
      es: "¿Vives aquí?",
      fr: "Tu habites ici ?",
      de: "Wohnst du hier?",
      it: "Abiti qui?",
      pt: "Você mora aqui?",
      zh: "你住在这里吗？",
      ja: "ここに住んでいますか？",
      ko: "여기 살아요?",
      pl: "Mieszkasz tutaj?"
    },
    {
      en: "What do you like to do?",
      es: "¿Qué te gusta hacer?",
      fr: "Qu'est-ce que tu aimes faire ?",
      de: "Was machst du gern?",
      it: "Cosa ti piace fare?",
      pt: "O que você gosta de fazer?",
      zh: "你喜欢做什么？",
      ja: "何をするのが好きですか？",
      ko: "뭐 하는 걸 좋아해요?",
      pl: "Co lubisz robić?"
    },
    {
      en: "Would you like to grab coffee?",
      es: "¿Quieres tomar un café?",
      fr: "Tu veux prendre un café ?",
      de: "Willst du einen Kaffee trinken gehen?",
      it: "Ti va di prendere un caffè?",
      pt: "Quer tomar um café?",
      zh: "想一起喝咖啡吗？",
      ja: "コーヒーでもどうですか？",
      ko: "커피 한잔할래요?",
      pl: "Masz ochotę na kawę?"
    },
    {
      en: "That sounds fun",
      es: "Eso suena divertido",
      fr: "Ça a l'air sympa",
      de: "Das klingt lustig",
      it: "Sembra divertente",
      pt: "Parece divertido",
      zh: "听起来很有趣。",
      ja: "楽しそうですね。",
      ko: "재미있겠네요.",
      pl: "Brzmi fajnie"
    },
    {
      en: "Can I add you on WhatsApp?",
      es: "¿Puedo agregarte en WhatsApp?",
      fr: "Je peux t'ajouter sur WhatsApp ?",
      de: "Kann ich dich auf WhatsApp hinzufügen?",
      it: "Posso aggiungerti su WhatsApp?",
      pt: "Posso te adicionar no WhatsApp?",
      zh: "我可以加你的WhatsApp吗？",
      ja: "WhatsAppを交換してもいいですか？",
      ko: "왓츠앱 추가해도 될까요?",
      pl: "Czy mogę dodać cię na WhatsAppie?"
    },
    {
      en: "See you soon",
      es: "Nos vemos pronto",
      fr: "À bientôt",
      de: "Bis bald",
      it: "A presto",
      pt: "Até logo",
      zh: "很快见。",
      ja: "また近いうちに。",
      ko: "곧 또 봐요.",
      pl: "Do zobaczenia wkrótce"
    }
  ],
  bank: [
    {
      en: "I need to withdraw cash",
      es: "Necesito sacar efectivo",
      fr: "J'ai besoin de retirer de l'argent",
      de: "Ich muss Bargeld abheben",
      it: "Ho bisogno di prelevare contanti",
      pt: "Preciso sacar dinheiro",
      zh: "我需要取现金。",
      ja: "現金を引き出したいです。",
      ko: "현금을 인출해야 해요.",
      pl: "Muszę wypłacić gotówkę"
    },
    {
      en: "Can I make a transfer?",
      es: "¿Puedo hacer una transferencia?",
      fr: "Je peux faire un virement ?",
      de: "Kann ich eine Überweisung machen?",
      it: "Posso fare un bonifico?",
      pt: "Posso fazer uma transferência?",
      zh: "我可以转账吗？",
      ja: "振り込みできますか？",
      ko: "송금할 수 있나요?",
      pl: "Czy mogę zrobić przelew?"
    },
    {
      en: "What are the fees?",
      es: "¿Cuáles son las comisiones?",
      fr: "Quels sont les frais ?",
      de: "Welche Gebühren gibt es?",
      it: "Quali sono le commissioni?",
      pt: "Quais são as taxas?",
      zh: "手续费是多少？",
      ja: "手数料はいくらですか？",
      ko: "수수료가 얼마예요?",
      pl: "Jakie są opłaty?"
    },
    {
      en: "I forgot my PIN",
      es: "Olvidé mi PIN",
      fr: "J'ai oublié mon code PIN",
      de: "Ich habe meine PIN vergessen",
      it: "Ho dimenticato il PIN",
      pt: "Esqueci meu PIN",
      zh: "我忘记密码了。",
      ja: "暗証番号を忘れました。",
      ko: "비밀번호를 잊어버렸어요.",
      pl: "Zapomniałem PIN-u"
    },
    {
      en: "Can you help me with online banking?",
      es: "¿Puede ayudarme con la banca en línea?",
      fr: "Pouvez-vous m'aider avec la banque en ligne ?",
      de: "Können Sie mir beim Online-Banking helfen?",
      it: "Può aiutarmi con l'online banking?",
      pt: "Pode me ajudar com o banco online?",
      zh: "您能帮我处理网上银行吗？",
      ja: "オンラインバンキングを手伝ってもらえますか？",
      ko: "온라인 뱅킹 좀 도와주실 수 있나요?",
      pl: "Czy może mi pan/pani pomóc z bankowością internetową?"
    },
    {
      en: "My card was declined",
      es: "Mi tarjeta fue rechazada",
      fr: "Ma carte a été refusée",
      de: "Meine Karte wurde abgelehnt",
      it: "La mia carta è stata rifiutata",
      pt: "Meu cartão foi recusado",
      zh: "我的卡被拒了。",
      ja: "カードが使えませんでした。",
      ko: "카드가 거절됐어요.",
      pl: "Moja karta została odrzucona"
    },
    {
      en: "I need a bank statement",
      es: "Necesito un extracto bancario",
      fr: "J'ai besoin d'un relevé bancaire",
      de: "Ich brauche einen Kontoauszug",
      it: "Ho bisogno di un estratto conto",
      pt: "Preciso de um extrato bancário",
      zh: "我需要银行流水。",
      ja: "銀行明細が必要です。",
      ko: "거래 내역서가 필요해요.",
      pl: "Potrzebuję wyciągu bankowego"
    },
    {
      en: "Can I speak to an advisor?",
      es: "¿Puedo hablar con un asesor?",
      fr: "Je peux parler à un conseiller ?",
      de: "Kann ich mit einem Berater sprechen?",
      it: "Posso parlare con un consulente?",
      pt: "Posso falar com um consultor?",
      zh: "我可以和顾问谈谈吗？",
      ja: "担当者と話せますか？",
      ko: "상담원과 이야기할 수 있나요?",
      pl: "Czy mogę porozmawiać z doradcą?"
    }
  ],
  "job-interview": [
    {
      en: "Tell me about yourself",
      es: "Hábleme de usted",
      fr: "Parlez-moi de vous",
      de: "Erzählen Sie mir etwas über sich",
      it: "Mi parli di lei",
      pt: "Fale sobre você",
      zh: "请介绍一下你自己。",
      ja: "自己紹介をお願いします。",
      ko: "자기소개 부탁드립니다.",
      pl: "Proszę opowiedzieć coś o sobie"
    },
    {
      en: "Why do you want this job?",
      es: "¿Por qué quiere este trabajo?",
      fr: "Pourquoi voulez-vous ce poste ?",
      de: "Warum möchten Sie diesen Job?",
      it: "Perché vuole questo lavoro?",
      pt: "Por que você quer este emprego?",
      zh: "你为什么想要这份工作？",
      ja: "なぜこの仕事を希望するのですか？",
      ko: "왜 이 일을 원하시나요?",
      pl: "Dlaczego chce pan/pani tę pracę?"
    },
    {
      en: "What are your strengths?",
      es: "¿Cuáles son sus puntos fuertes?",
      fr: "Quels sont vos points forts ?",
      de: "Was sind Ihre Stärken?",
      it: "Quali sono i suoi punti di forza?",
      pt: "Quais são seus pontos fortes?",
      zh: "你的优点是什么？",
      ja: "あなたの強みは何ですか？",
      ko: "당신의 강점은 무엇인가요?",
      pl: "Jakie są pana/pani mocne strony?"
    },
    {
      en: "I work well in teams",
      es: "Trabajo bien en equipo",
      fr: "Je travaille bien en équipe",
      de: "Ich arbeite gut im Team",
      it: "Lavoro bene in squadra",
      pt: "Trabalho bem em equipe",
      zh: "我很擅长团队合作。",
      ja: "チームでうまく働けます。",
      ko: "팀으로 잘 일합니다.",
      pl: "Dobrze pracuję w zespole"
    },
    {
      en: "I am available from next month",
      es: "Estoy disponible a partir del próximo mes",
      fr: "Je suis disponible à partir du mois prochain",
      de: "Ich bin ab nächstem Monat verfügbar",
      it: "Sono disponibile dal prossimo mese",
      pt: "Estou disponível a partir do próximo mês",
      zh: "我下个月开始可以入职。",
      ja: "来月から勤務可能です。",
      ko: "다음 달부터 가능합니다.",
      pl: "Jestem dostępny/a od przyszłego miesiąca"
    },
    {
      en: "Thank you for your time",
      es: "Gracias por su tiempo",
      fr: "Merci pour votre temps",
      de: "Vielen Dank für Ihre Zeit",
      it: "Grazie per il suo tempo",
      pt: "Obrigado pelo seu tempo",
      zh: "感谢您的时间。",
      ja: "お時間をいただきありがとうございます。",
      ko: "시간 내주셔서 감사합니다.",
      pl: "Dziękuję za poświęcony czas"
    },
    {
      en: "Can you tell me more about the role?",
      es: "¿Puede contarme más sobre el puesto?",
      fr: "Pouvez-vous m'en dire plus sur le poste ?",
      de: "Können Sie mir mehr über die Stelle sagen?",
      it: "Può dirmi di più sul ruolo?",
      pt: "Pode me falar mais sobre o cargo?",
      zh: "您能多介绍一下这个职位吗？",
      ja: "この役割についてもう少し教えていただけますか？",
      ko: "이 역할에 대해 더 설명해 주실 수 있나요?",
      pl: "Czy może pan/pani powiedzieć więcej o stanowisku?"
    },
    {
      en: "I am excited about this opportunity",
      es: "Estoy entusiasmado con esta oportunidad",
      fr: "Je suis enthousiaste à propos de cette opportunité",
      de: "Ich freue mich über diese Gelegenheit",
      it: "Sono entusiasta di questa opportunità",
      pt: "Estou animado com essa oportunidade",
      zh: "我对这个机会很期待。",
      ja: "この機会にとてもわくわくしています。",
      ko: "이 기회가 정말 기대됩니다.",
      pl: "Cieszę się z tej możliwości"
    }
  ],
  apartment: [
    {
      en: "Can I see the apartment?",
      es: "¿Puedo ver el apartamento?",
      fr: "Je peux voir l'appartement ?",
      de: "Kann ich die Wohnung besichtigen?",
      it: "Posso vedere l'appartamento?",
      pt: "Posso ver o apartamento?",
      zh: "我可以看看公寓吗？",
      ja: "アパートを見てもいいですか？",
      ko: "집을 볼 수 있을까요?",
      pl: "Czy mogę obejrzeć mieszkanie?"
    },
    {
      en: "How much is the deposit?",
      es: "¿Cuánto es el depósito?",
      fr: "Quel est le montant de la caution ?",
      de: "Wie hoch ist die Kaution?",
      it: "Quanto costa il deposito?",
      pt: "Qual é o valor do depósito?",
      zh: "押金是多少？",
      ja: "敷金はいくらですか？",
      ko: "보증금이 얼마예요?",
      pl: "Ile wynosi kaucja?"
    },
    {
      en: "Is it furnished?",
      es: "¿Está amueblado?",
      fr: "Il est meublé ?",
      de: "Ist sie möbliert?",
      it: "È arredato?",
      pt: "É mobiliado?",
      zh: "带家具吗？",
      ja: "家具付きですか？",
      ko: "가구가 포함돼 있나요?",
      pl: "Czy jest umeblowane?"
    },
    {
      en: "When is it available?",
      es: "¿Cuándo está disponible?",
      fr: "Quand est-il disponible ?",
      de: "Wann ist sie verfügbar?",
      it: "Quando è disponibile?",
      pt: "Quando está disponível?",
      zh: "什么时候可以入住？",
      ja: "いつから入居できますか？",
      ko: "언제부터 입주 가능해요?",
      pl: "Kiedy jest dostępne?"
    },
    {
      en: "Are pets allowed?",
      es: "¿Se permiten mascotas?",
      fr: "Les animaux sont-ils autorisés ?",
      de: "Sind Haustiere erlaubt?",
      it: "Gli animali sono ammessi?",
      pt: "Animais são permitidos?",
      zh: "可以养宠物吗？",
      ja: "ペットは大丈夫ですか？",
      ko: "반려동물 가능해요?",
      pl: "Czy zwierzęta są dozwolone?"
    },
    {
      en: "Is there a washing machine?",
      es: "¿Hay lavadora?",
      fr: "Il y a une machine à laver ?",
      de: "Gibt es eine Waschmaschine?",
      it: "C'è una lavatrice?",
      pt: "Tem máquina de lavar?",
      zh: "有洗衣机吗？",
      ja: "洗濯機はありますか？",
      ko: "세탁기 있어요?",
      pl: "Czy jest pralka?"
    },
    {
      en: "How long is the contract?",
      es: "¿Cuánto dura el contrato?",
      fr: "Combien de temps dure le contrat ?",
      de: "Wie lange läuft der Vertrag?",
      it: "Quanto dura il contratto?",
      pt: "Quanto tempo dura o contrato?",
      zh: "合同多长时间？",
      ja: "契約期間はどのくらいですか？",
      ko: "계약 기간이 얼마나 되나요?",
      pl: "Jak długo trwa umowa?"
    },
    {
      en: "The location is perfect",
      es: "La ubicación es perfecta",
      fr: "L'emplacement est parfait",
      de: "Die Lage ist perfekt",
      it: "La posizione è perfetta",
      pt: "A localização é perfeita",
      zh: "位置非常好。",
      ja: "立地が完璧です。",
      ko: "위치가 완벽해요.",
      pl: "Lokalizacja jest idealna"
    }
  ],
  "phone-call": [
    {
      en: "Could you repeat that, please?",
      es: "¿Podría repetirlo, por favor?",
      fr: "Pouvez-vous répéter, s'il vous plaît ?",
      de: "Könnten Sie das bitte wiederholen?",
      it: "Potrebbe ripetere, per favore?",
      pt: "Pode repetir, por favor?",
      zh: "您可以再说一遍吗？",
      ja: "もう一度言っていただけますか？",
      ko: "다시 말씀해 주시겠어요?",
      pl: "Czy może pan/pani powtórzyć?"
    },
    {
      en: "The line is bad",
      es: "La línea está mal",
      fr: "La ligne est mauvaise",
      de: "Die Verbindung ist schlecht",
      it: "La linea è disturbata",
      pt: "A linha está ruim",
      zh: "信号不好。",
      ja: "回線が悪いです。",
      ko: "통화 상태가 안 좋아요.",
      pl: "Połączenie jest słabe"
    },
    {
      en: "Can you speak more slowly?",
      es: "¿Puede hablar más despacio?",
      fr: "Pouvez-vous parler plus lentement ?",
      de: "Können Sie langsamer sprechen?",
      it: "Può parlare più lentamente?",
      pt: "Pode falar mais devagar?",
      zh: "您可以说慢一点吗？",
      ja: "もう少しゆっくり話していただけますか？",
      ko: "조금 더 천천히 말씀해 주실 수 있나요?",
      pl: "Czy może pan/pani mówić wolniej?"
    },
    {
      en: "Could you call me back later?",
      es: "¿Podría llamarme más tarde?",
      fr: "Pouvez-vous me rappeler plus tard ?",
      de: "Könnten Sie mich später zurückrufen?",
      it: "Potrebbe richiamarmi più tardi?",
      pt: "Pode me ligar mais tarde?",
      zh: "您可以晚点再打给我吗？",
      ja: "後でかけ直してもらえますか？",
      ko: "나중에 다시 전화해 주실 수 있나요?",
      pl: "Czy może pan/pani oddzwonić później?"
    },
    {
      en: "I’m calling about...",
      es: "Llamo por...",
      fr: "J'appelle au sujet de...",
      de: "Ich rufe wegen ... an",
      it: "Chiamo per...",
      pt: "Estou ligando por causa de...",
      zh: "我打电话是关于……",
      ja: "…についてお電話しています。",
      ko: "… 때문에 전화드렸습니다.",
      pl: "Dzwonię w sprawie..."
    },
    {
      en: "Can you hear me clearly?",
      es: "¿Me oye bien?",
      fr: "Vous m'entendez bien ?",
      de: "Können Sie mich gut hören?",
      it: "Mi sente bene?",
      pt: "Você me ouve bem?",
      zh: "您能听清吗？",
      ja: "よく聞こえますか？",
      ko: "제 말 잘 들리세요?",
      pl: "Czy dobrze mnie słychać?"
    },
    {
      en: "Please leave a message",
      es: "Por favor, deje un mensaje",
      fr: "Veuillez laisser un message",
      de: "Bitte hinterlassen Sie eine Nachricht",
      it: "Per favore, lasci un messaggio",
      pt: "Por favor, deixe uma mensagem",
      zh: "请留言。",
      ja: "メッセージを残してください。",
      ko: "메시지를 남겨 주세요.",
      pl: "Proszę zostawić wiadomość"
    },
    {
      en: "I’ll send an email too",
      es: "También enviaré un correo",
      fr: "J'enverrai aussi un e-mail",
      de: "Ich schicke auch eine E-Mail",
      it: "Manderò anche un'e-mail",
      pt: "Também vou enviar um e-mail",
      zh: "我也会发一封邮件。",
      ja: "メールも送ります。",
      ko: "이메일도 보내겠습니다.",
      pl: "Wyślę też e-mail"
    }
  ],
  gym: [
    {
      en: "I want to sign up",
      es: "Quiero inscribirme",
      fr: "Je veux m'inscrire",
      de: "Ich möchte mich anmelden",
      it: "Voglio iscrivermi",
      pt: "Quero me inscrever",
      zh: "我想报名。",
      ja: "入会したいです。",
      ko: "등록하고 싶어요.",
      pl: "Chcę się zapisać"
    },
    {
      en: "Do you have a day pass?",
      es: "¿Tienen pase diario?",
      fr: "Vous avez un pass à la journée ?",
      de: "Haben Sie eine Tageskarte?",
      it: "Avete un pass giornaliero?",
      pt: "Vocês têm passe diário?",
      zh: "有日票吗？",
      ja: "1日券はありますか？",
      ko: "일일권 있나요?",
      pl: "Czy macie karnet jednodniowy?"
    },
    {
      en: "Where are the lockers?",
      es: "¿Dónde están las taquillas?",
      fr: "Où sont les casiers ?",
      de: "Wo sind die Schließfächer?",
      it: "Dove sono gli armadietti?",
      pt: "Onde ficam os armários?",
      zh: "储物柜在哪里？",
      ja: "ロッカーはどこですか？",
      ko: "사물함이 어디예요?",
      pl: "Gdzie są szafki?"
    },
    {
      en: "How do I use this machine?",
      es: "¿Cómo uso esta máquina?",
      fr: "Comment utiliser cette machine ?",
      de: "Wie benutze ich dieses Gerät?",
      it: "Come si usa questa macchina?",
      pt: "Como uso essa máquina?",
      zh: "这个器械怎么用？",
      ja: "このマシンはどう使いますか？",
      ko: "이 기구는 어떻게 사용해요?",
      pl: "Jak używać tej maszyny?"
    },
    {
      en: "Is there a yoga class today?",
      es: "¿Hay clase de yoga hoy?",
      fr: "Il y a un cours de yoga aujourd'hui ?",
      de: "Gibt es heute einen Yogakurs?",
      it: "C'è un corso di yoga oggi?",
      pt: "Tem aula de yoga hoje?",
      zh: "今天有瑜伽课吗？",
      ja: "今日はヨガのクラスがありますか？",
      ko: "오늘 요가 수업 있나요?",
      pl: "Czy jest dziś joga?"
    },
    {
      en: "Do you have showers?",
      es: "¿Tienen duchas?",
      fr: "Vous avez des douches ?",
      de: "Gibt es Duschen?",
      it: "Avete docce?",
      pt: "Vocês têm chuveiros?",
      zh: "有淋浴吗？",
      ja: "シャワーはありますか？",
      ko: "샤워실 있나요?",
      pl: "Czy są prysznice?"
    },
    {
      en: "I need help with my workout",
      es: "Necesito ayuda con mi entrenamiento",
      fr: "J'ai besoin d'aide pour mon entraînement",
      de: "Ich brauche Hilfe beim Training",
      it: "Ho bisogno di aiuto con il mio allenamento",
      pt: "Preciso de ajuda com meu treino",
      zh: "我需要训练方面的帮助。",
      ja: "トレーニングを手伝ってほしいです。",
      ko: "운동 도움 좀 필요해요.",
      pl: "Potrzebuję pomocy z treningiem"
    },
    {
      en: "What time do you close?",
      es: "¿A qué hora cierran?",
      fr: "À quelle heure fermez-vous ?",
      de: "Wann schließen Sie?",
      it: "A che ora chiudete?",
      pt: "Que horas vocês fecham?",
      zh: "你们几点关门？",
      ja: "何時に閉まりますか？",
      ko: "몇 시에 닫아요?",
      pl: "O której zamykacie?"
    }
  ],
  bar: [
    {
      en: "A beer, please",
      es: "Una cerveza, por favor",
      fr: "Une bière, s'il vous plaît",
      de: "Ein Bier, bitte",
      it: "Una birra, per favore",
      pt: "Uma cerveja, por favor",
      zh: "一杯啤酒，谢谢。",
      ja: "ビールを一つお願いします。",
      ko: "맥주 한 잔 주세요.",
      pl: "Jedno piwo, proszę"
    },
    {
      en: "What cocktails do you have?",
      es: "¿Qué cócteles tienen?",
      fr: "Quels cocktails avez-vous ?",
      de: "Welche Cocktails haben Sie?",
      it: "Che cocktail avete?",
      pt: "Que coquetéis vocês têm?",
      zh: "你们有什么鸡尾酒？",
      ja: "どんなカクテルがありますか？",
      ko: "칵테일 뭐 있어요?",
      pl: "Jakie macie koktajle?"
    },
    {
      en: "Can I open a tab?",
      es: "¿Puedo abrir una cuenta?",
      fr: "Je peux ouvrir une note ?",
      de: "Kann ich einen Deckel aufmachen?",
      it: "Posso aprire un conto?",
      pt: "Posso abrir uma conta?",
      zh: "我可以记账吗？",
      ja: "ツケにできますか？",
      ko: "탭 열 수 있나요?",
      pl: "Czy mogę otworzyć rachunek?"
    },
    {
      en: "One more round",
      es: "Otra ronda",
      fr: "Une autre tournée",
      de: "Noch eine Runde",
      it: "Un altro giro",
      pt: "Mais uma rodada",
      zh: "再来一轮。",
      ja: "もう一杯ずつ。",
      ko: "한 잔 더요.",
      pl: "Jeszcze jedna kolejka"
    },
    {
      en: "Cheers!",
      es: "¡Salud!",
      fr: "Santé !",
      de: "Prost!",
      it: "Cin cin!",
      pt: "Saúde!",
      zh: "干杯！",
      ja: "乾杯！",
      ko: "건배!",
      pl: "Na zdrowie!"
    },
    {
      en: "Can I have the check?",
      es: "¿Me trae la cuenta?",
      fr: "L'addition, s'il vous plaît",
      de: "Kann ich die Rechnung haben?",
      it: "Posso avere il conto?",
      pt: "Pode trazer a conta?",
      zh: "可以买单吗？",
      ja: "お会計をお願いします。",
      ko: "계산서 주세요.",
      pl: "Czy mogę prosić rachunek?"
    },
    {
      en: "What do you recommend?",
      es: "¿Qué recomienda?",
      fr: "Que recommandez-vous ?",
      de: "Was empfehlen Sie?",
      it: "Cosa consiglia?",
      pt: "O que você recomenda?",
      zh: "你推荐什么？",
      ja: "おすすめは何ですか？",
      ko: "추천해 주실 거 있나요?",
      pl: "Co poleca pan/pani?"
    },
    {
      en: "Is there live music tonight?",
      es: "¿Hay música en vivo esta noche?",
      fr: "Il y a de la musique live ce soir ?",
      de: "Gibt es heute Abend Livemusik?",
      it: "C'è musica dal vivo stasera?",
      pt: "Tem música ao vivo hoje à noite?",
      zh: "今晚有现场音乐吗？",
      ja: "今夜はライブ音楽がありますか？",
      ko: "오늘 밤 라이브 음악 있어요?",
      pl: "Czy dziś wieczorem jest muzyka na żywo?"
    }
  ],
  travel: [
    {
      en: "Can you recommend a place to visit?",
      es: "¿Puede recomendarme un lugar para visitar?",
      fr: "Pouvez-vous me recommander un endroit à visiter ?",
      de: "Können Sie mir einen Ort empfehlen?",
      it: "Può consigliarmi un posto da visitare?",
      pt: "Pode me recomendar um lugar para visitar?",
      zh: "您能推荐一个值得去的地方吗？",
      ja: "おすすめの場所はありますか？",
      ko: "추천할 만한 곳이 있나요?",
      pl: "Czy może pan/pani polecić jakieś miejsce do odwiedzenia?"
    },
    {
      en: "How much is the ticket?",
      es: "¿Cuánto cuesta la entrada?",
      fr: "Combien coûte le billet ?",
      de: "Wie viel kostet die Eintrittskarte?",
      it: "Quanto costa il biglietto?",
      pt: "Quanto custa o ingresso?",
      zh: "门票多少钱？",
      ja: "入場券はいくらですか？",
      ko: "입장권 얼마예요?",
      pl: "Ile kosztuje bilet?"
    },
    {
      en: "What time does it open?",
      es: "¿A qué hora abre?",
      fr: "À quelle heure ça ouvre ?",
      de: "Wann öffnet es?",
      it: "A che ora apre?",
      pt: "Que horas abre?",
      zh: "几点开门？",
      ja: "何時に開きますか？",
      ko: "몇 시에 열어요?",
      pl: "O której otwierają?"
    },
    {
      en: "Is there a guided tour?",
      es: "¿Hay una visita guiada?",
      fr: "Y a-t-il une visite guidée ?",
      de: "Gibt es eine Führung?",
      it: "C'è una visita guidata?",
      pt: "Tem visita guiada?",
      zh: "有导览吗？",
      ja: "ガイドツアーはありますか？",
      ko: "가이드 투어 있나요?",
      pl: "Czy jest zwiedzanie z przewodnikiem?"
    },
    {
      en: "Can I take photos here?",
      es: "¿Puedo tomar fotos aquí?",
      fr: "Je peux prendre des photos ici ?",
      de: "Darf ich hier Fotos machen?",
      it: "Posso fare foto qui?",
      pt: "Posso tirar fotos aqui?",
      zh: "这里可以拍照吗？",
      ja: "ここで写真を撮ってもいいですか？",
      ko: "여기서 사진 찍어도 되나요?",
      pl: "Czy mogę tu robić zdjęcia?"
    },
    {
      en: "Where is the tourist office?",
      es: "¿Dónde está la oficina de turismo?",
      fr: "Où est l'office de tourisme ?",
      de: "Wo ist die Touristeninformation?",
      it: "Dov'è l'ufficio turistico?",
      pt: "Onde fica o posto de turismo?",
      zh: "游客中心在哪里？",
      ja: "観光案内所はどこですか？",
      ko: "관광 안내소가 어디예요?",
      pl: "Gdzie jest informacja turystyczna?"
    },
    {
      en: "Is this nearby?",
      es: "¿Está cerca?",
      fr: "C'est à proximité ?",
      de: "Ist das in der Nähe?",
      it: "È vicino?",
      pt: "É perto?",
      zh: "离这里近吗？",
      ja: "近いですか？",
      ko: "가까워요?",
      pl: "Czy to jest blisko?"
    },
    {
      en: "Do I need to book in advance?",
      es: "¿Necesito reservar con antelación?",
      fr: "Dois-je réserver à l'avance ?",
      de: "Muss ich im Voraus buchen?",
      it: "Devo prenotare in anticipo?",
      pt: "Preciso reservar com antecedência?",
      zh: "需要提前预约吗？",
      ja: "事前予約が必要ですか？",
      ko: "미리 예약해야 하나요?",
      pl: "Czy muszę zarezerwować wcześniej?"
    }
  ],
  directions: [
    {
      en: "Turn left at the corner",
      es: "Gire a la izquierda en la esquina",
      fr: "Tournez à gauche au coin",
      de: "Biegen Sie an der Ecke links ab",
      it: "Giri a sinistra all'angolo",
      pt: "Vire à esquerda na esquina",
      zh: "在拐角处左转。",
      ja: "角を左に曲がってください。",
      ko: "모퉁이에서 왼쪽으로 도세요.",
      pl: "Skręć w lewo na rogu"
    },
    {
      en: "Go straight ahead",
      es: "Siga todo recto",
      fr: "Allez tout droit",
      de: "Gehen Sie geradeaus",
      it: "Vada dritto",
      pt: "Siga em frente",
      zh: "一直往前走。",
      ja: "まっすぐ行ってください。",
      ko: "쭉 가세요.",
      pl: "Idź prosto"
    },
    {
      en: "It’s next to the bank",
      es: "Está al lado del banco",
      fr: "C'est à côté de la banque",
      de: "Es ist neben der Bank",
      it: "È accanto alla banca",
      pt: "Fica ao lado do banco",
      zh: "它在银行旁边。",
      ja: "銀行の隣です。",
      ko: "은행 옆에 있어요.",
      pl: "To jest obok banku"
    },
    {
      en: "It’s across from the station",
      es: "Está enfrente de la estación",
      fr: "C'est en face de la gare",
      de: "Es ist gegenüber vom Bahnhof",
      it: "È di fronte alla stazione",
      pt: "Fica em frente à estação",
      zh: "它在车站对面。",
      ja: "駅の向かいです。",
      ko: "역 맞은편에 있어요.",
      pl: "To jest naprzeciwko stacji"
    },
    {
      en: "You can’t miss it",
      es: "No tiene pérdida",
      fr: "Vous ne pouvez pas le manquer",
      de: "Sie können es nicht verfehlen",
      it: "Non può sbagliarsi",
      pt: "Não tem erro",
      zh: "你不会错过的。",
      ja: "すぐわかります。",
      ko: "바로 찾을 수 있을 거예요.",
      pl: "Nie da się tego ominąć"
    },
    {
      en: "How far is it on foot?",
      es: "¿Qué tan lejos está caminando?",
      fr: "C'est à quelle distance à pied ?",
      de: "Wie weit ist es zu Fuß?",
      it: "Quanto dista a piedi?",
      pt: "Fica a que distância a pé?",
      zh: "走路有多远？",
      ja: "歩くとどのくらいですか？",
      ko: "걸어서 얼마나 걸려요?",
      pl: "Jak daleko jest pieszo?"
    },
    {
      en: "Take the second street on the right",
      es: "Tome la segunda calle a la derecha",
      fr: "Prenez la deuxième rue à droite",
      de: "Nehmen Sie die zweite Straße rechts",
      it: "Prenda la seconda strada a destra",
      pt: "Pegue a segunda rua à direita",
      zh: "走第二个路口右转。",
      ja: "二つ目の角を右に曲がってください。",
      ko: "두 번째 길에서 오른쪽으로 가세요.",
      pl: "Skręć w drugą ulicę w prawo"
    },
    {
      en: "Is there a bus stop nearby?",
      es: "¿Hay una parada de autobús cerca?",
      fr: "Y a-t-il un arrêt de bus à proximité ?",
      de: "Gibt es hier in der Nähe eine Bushaltestelle?",
      it: "C'è una fermata dell'autobus qui vicino?",
      pt: "Tem um ponto de ônibus por perto?",
      zh: "附近有公交站吗？",
      ja: "近くにバス停はありますか？",
      ko: "근처에 버스 정류장 있나요?",
      pl: "Czy w pobliżu jest przystanek autobusowy?"
    }
  ],
  university: [
    {
      en: "Which classroom is it in?",
      es: "¿En qué aula es?",
      fr: "Dans quelle salle est-ce ?",
      de: "In welchem Raum ist es?",
      it: "In quale aula si trova?",
      pt: "Em qual sala é?",
      zh: "在哪个教室？",
      ja: "どの教室ですか？",
      ko: "어느 강의실이에요?",
      pl: "W której sali to jest?"
    },
    {
      en: "I have a question about the assignment",
      es: "Tengo una pregunta sobre la tarea",
      fr: "J'ai une question sur le devoir",
      de: "Ich habe eine Frage zur Aufgabe",
      it: "Ho una domanda sul compito",
      pt: "Tenho uma pergunta sobre a tarefa",
      zh: "我有一个关于作业的问题。",
      ja: "課題について質問があります。",
      ko: "과제에 대해 질문이 있어요.",
      pl: "Mam pytanie dotyczące zadania"
    },
    {
      en: "Can you explain this again?",
      es: "¿Puede explicarlo otra vez?",
      fr: "Pouvez-vous l'expliquer encore une fois ?",
      de: "Können Sie das noch einmal erklären?",
      it: "Può spiegarlo di nuovo?",
      pt: "Pode explicar isso de novo?",
      zh: "您能再解释一遍吗？",
      ja: "もう一度説明していただけますか？",
      ko: "다시 설명해 주실 수 있나요?",
      pl: "Czy może pan/pani wyjaśnić to jeszcze raz?"
    },
    {
      en: "When is the exam?",
      es: "¿Cuándo es el examen?",
      fr: "Quand est l'examen ?",
      de: "Wann ist die Prüfung?",
      it: "Quando è l'esame?",
      pt: "Quando é a prova?",
      zh: "考试是什么时候？",
      ja: "試験はいつですか？",
      ko: "시험이 언제예요?",
      pl: "Kiedy jest egzamin?"
    },
    {
      en: "Can I borrow your notes?",
      es: "¿Puedo tomar prestados tus apuntes?",
      fr: "Je peux emprunter tes notes ?",
      de: "Kann ich mir deine Notizen ausleihen?",
      it: "Posso prendere in prestito i tuoi appunti?",
      pt: "Posso pegar seus apontamentos emprestados?",
      zh: "我可以借你的笔记吗？",
      ja: "ノートを借りてもいいですか？",
      ko: "노트 빌려도 될까요?",
      pl: "Czy mogę pożyczyć twoje notatki?"
    },
    {
      en: "I need help studying",
      es: "Necesito ayuda para estudiar",
      fr: "J'ai besoin d'aide pour étudier",
      de: "Ich brauche Hilfe beim Lernen",
      it: "Ho bisogno di aiuto per studiare",
      pt: "Preciso de ajuda para estudar",
      zh: "我需要学习上的帮助。",
      ja: "勉強の助けが必要です。",
      ko: "공부하는 데 도움이 필요해요.",
      pl: "Potrzebuję pomocy w nauce"
    },
    {
      en: "Where is the library?",
      es: "¿Dónde está la biblioteca?",
      fr: "Où est la bibliothèque ?",
      de: "Wo ist die Bibliothek?",
      it: "Dov'è la biblioteca?",
      pt: "Onde fica a biblioteca?",
      zh: "图书馆在哪里？",
      ja: "図書館はどこですか？",
      ko: "도서관이 어디예요?",
      pl: "Gdzie jest biblioteka?"
    },
    {
      en: "Is attendance mandatory?",
      es: "¿La asistencia es obligatoria?",
      fr: "La présence est-elle obligatoire ?",
      de: "Ist Anwesenheit Pflicht?",
      it: "La presenza è obbligatoria?",
      pt: "A presença é obrigatória?",
      zh: "必须出勤吗？",
      ja: "出席は必須ですか？",
      ko: "출석이 필수인가요?",
      pl: "Czy obecność jest obowiązkowa?"
    }
  ],
  emergency: [
    {
      en: "I need help right now",
      es: "Necesito ayuda ahora mismo",
      fr: "J'ai besoin d'aide tout de suite",
      de: "Ich brauche sofort Hilfe",
      it: "Ho bisogno di aiuto subito",
      pt: "Preciso de ajuda agora mesmo",
      zh: "我现在就需要帮助。",
      ja: "今すぐ助けが必要です。",
      ko: "지금 당장 도움이 필요해요.",
      pl: "Potrzebuję pomocy natychmiast"
    },
    {
      en: "There has been an accident",
      es: "Ha habido un accidente",
      fr: "Il y a eu un accident",
      de: "Es gab einen Unfall",
      it: "C'è stato un incidente",
      pt: "Houve um acidente",
      zh: "发生了事故。",
      ja: "事故がありました。",
      ko: "사고가 났어요.",
      pl: "Był wypadek"
    },
    {
      en: "Someone is injured",
      es: "Alguien está herido",
      fr: "Quelqu'un est blessé",
      de: "Jemand ist verletzt",
      it: "Qualcuno è ferito",
      pt: "Alguém está ferido",
      zh: "有人受伤了。",
      ja: "けが人がいます。",
      ko: "다친 사람이 있어요.",
      pl: "Ktoś jest ranny"
    },
    {
      en: "What is the emergency number?",
      es: "¿Cuál es el número de emergencia?",
      fr: "Quel est le numéro d'urgence ?",
      de: "Wie lautet die Notrufnummer?",
      it: "Qual è il numero di emergenza?",
      pt: "Qual é o número de emergência?",
      zh: "紧急电话是多少？",
      ja: "緊急番号は何ですか？",
      ko: "긴급 전화번호가 뭐예요?",
      pl: "Jaki jest numer alarmowy?"
    },
    {
      en: "I lost my passport",
      es: "Perdí mi pasaporte",
      fr: "J'ai perdu mon passeport",
      de: "Ich habe meinen Pass verloren",
      it: "Ho perso il passaporto",
      pt: "Perdi meu passaporte",
      zh: "我把护照丢了。",
      ja: "パスポートをなくしました。",
      ko: "여권을 잃어버렸어요.",
      pl: "Zgubiłem paszport"
    },
    {
      en: "Please come quickly",
      es: "Por favor, venga rápido",
      fr: "Venez vite, s'il vous plaît",
      de: "Kommen Sie bitte schnell",
      it: "Per favore, venga presto",
      pt: "Por favor, venha rápido",
      zh: "请快点来。",
      ja: "早く来てください。",
      ko: "빨리 와 주세요.",
      pl: "Proszę przyjechać szybko"
    },
    {
      en: "I need the police",
      es: "Necesito a la policía",
      fr: "J'ai besoin de la police",
      de: "Ich brauche die Polizei",
      it: "Ho bisogno della polizia",
      pt: "Preciso da polícia",
      zh: "我需要警察。",
      ja: "警察が必要です。",
      ko: "경찰이 필요해요.",
      pl: "Potrzebuję policji"
    },
    {
      en: "Where is the nearest hospital?",
      es: "¿Dónde está el hospital más cercano?",
      fr: "Où est l'hôpital le plus proche ?",
      de: "Wo ist das nächste Krankenhaus?",
      it: "Dov'è l'ospedale più vicino?",
      pt: "Onde fica o hospital mais próximo?",
      zh: "最近的医院在哪里？",
      ja: "一番近い病院はどこですか？",
      ko: "가장 가까운 병원이 어디예요?",
      pl: "Gdzie jest najbliższy szpital?"
    }
  ],
  "post-office": [
    {
      en: "I need to send this letter",
      es: "Necesito enviar esta carta",
      fr: "Je dois envoyer cette lettre",
      de: "Ich muss diesen Brief verschicken",
      it: "Devo spedire questa lettera",
      pt: "Preciso enviar esta carta",
      zh: "我需要寄这封信。",
      ja: "この手紙を送りたいです。",
      ko: "이 편지를 보내야 해요.",
      pl: "Muszę wysłać ten list"
    },
    {
      en: "How much is a stamp?",
      es: "¿Cuánto cuesta un sello?",
      fr: "Combien coûte un timbre ?",
      de: "Wie viel kostet eine Briefmarke?",
      it: "Quanto costa un francobollo?",
      pt: "Quanto custa um selo?",
      zh: "邮票多少钱？",
      ja: "切手はいくらですか？",
      ko: "우표 얼마예요?",
      pl: "Ile kosztuje znaczek?"
    },
    {
      en: "I want to send a package",
      es: "Quiero enviar un paquete",
      fr: "Je veux envoyer un colis",
      de: "Ich möchte ein Paket verschicken",
      it: "Voglio spedire un pacco",
      pt: "Quero enviar um pacote",
      zh: "我想寄一个包裹。",
      ja: "荷物を送りたいです。",
      ko: "소포를 보내고 싶어요.",
      pl: "Chcę wysłać paczkę"
    },
    {
      en: "How long will it take?",
      es: "¿Cuánto tardará?",
      fr: "Combien de temps cela prendra-t-il ?",
      de: "Wie lange dauert es?",
      it: "Quanto ci vorrà?",
      pt: "Quanto tempo vai levar?",
      zh: "要多久？",
      ja: "どのくらいかかりますか？",
      ko: "얼마나 걸려요?",
      pl: "Ile to zajmie?"
    },
    {
      en: "Do I need to fill out a form?",
      es: "¿Necesito rellenar un formulario?",
      fr: "Dois-je remplir un formulaire ?",
      de: "Muss ich ein Formular ausfüllen?",
      it: "Devo compilare un modulo?",
      pt: "Preciso preencher um formulário?",
      zh: "我需要填写表格吗？",
      ja: "用紙に記入する必要がありますか？",
      ko: "양식을 작성해야 하나요?",
      pl: "Czy muszę wypełnić formularz?"
    },
    {
      en: "Can I track the package?",
      es: "¿Puedo rastrear el paquete?",
      fr: "Puis-je suivre le colis ?",
      de: "Kann ich das Paket verfolgen?",
      it: "Posso tracciare il pacco?",
      pt: "Posso rastrear o pacote?",
      zh: "我可以追踪包裹吗？",
      ja: "荷物を追跡できますか？",
      ko: "소포 추적이 가능한가요?",
      pl: "Czy mogę śledzić paczkę?"
    },
    {
      en: "Express shipping, please",
      es: "Envío urgente, por favor",
      fr: "Envoi express, s'il vous plaît",
      de: "Expressversand, bitte",
      it: "Spedizione espressa, per favore",
      pt: "Envio expresso, por favor",
      zh: "请用快递。",
      ja: "速達でお願いします。",
      ko: "빠른 배송으로 부탁해요.",
      pl: "Przesyłka ekspresowa, proszę"
    },
    {
      en: "Where do I write the address?",
      es: "¿Dónde escribo la dirección?",
      fr: "Où est-ce que j'écris l'adresse ?",
      de: "Wo schreibe ich die Adresse hin?",
      it: "Dove scrivo l'indirizzo?",
      pt: "Onde escrevo o endereço?",
      zh: "地址写在哪里？",
      ja: "住所はどこに書きますか？",
      ko: "주소는 어디에 적어요?",
      pl: "Gdzie mam napisać adres?"
    }
  ],
  date: [
    {
      en: "You look nice",
      es: "Te ves bien",
      fr: "Tu es très bien",
      de: "Du siehst gut aus",
      it: "Stai bene",
      pt: "Você está bonito/a",
      zh: "你看起来很好。",
      ja: "素敵ですね。",
      ko: "멋져 보여요.",
      pl: "Świetnie wyglądasz"
    },
    {
      en: "What do you like to do for fun?",
      es: "¿Qué te gusta hacer para divertirte?",
      fr: "Qu'est-ce que tu aimes faire pour t'amuser ?",
      de: "Was machst du gern zum Spaß?",
      it: "Cosa ti piace fare per divertirti?",
      pt: "O que você gosta de fazer por diversão?",
      zh: "你平时喜欢做什么？",
      ja: "趣味は何ですか？",
      ko: "취미가 뭐예요?",
      pl: "Co lubisz robić dla zabawy?"
    },
    {
      en: "Do you want another drink?",
      es: "¿Quieres otra bebida?",
      fr: "Tu veux encore à boire ?",
      de: "Möchtest du noch etwas trinken?",
      it: "Vuoi un'altra bevanda?",
      pt: "Quer outra bebida?",
      zh: "你还想喝点什么吗？",
      ja: "もう一杯どうですか？",
      ko: "한 잔 더 할래요?",
      pl: "Chcesz jeszcze coś do picia?"
    },
    {
      en: "I’m having a great time",
      es: "Lo estoy pasando muy bien",
      fr: "Je passe un très bon moment",
      de: "Ich habe eine tolle Zeit",
      it: "Mi sto divertendo molto",
      pt: "Estou me divertindo muito",
      zh: "我玩得很开心。",
      ja: "とても楽しいです。",
      ko: "정말 즐거워요.",
      pl: "Bardzo dobrze się bawię"
    },
    {
      en: "Would you like to meet again?",
      es: "¿Te gustaría vernos otra vez?",
      fr: "Tu voudrais qu'on se revoie ?",
      de: "Möchtest du dich noch einmal treffen?",
      it: "Ti andrebbe di rivederci?",
      pt: "Gostaria de nos encontrarmos de novo?",
      zh: "你想再见一次吗？",
      ja: "また会いたいですか？",
      ko: "또 만날래요?",
      pl: "Chciał(a)byś spotkać się jeszcze raz?"
    },
    {
      en: "I’d like to get to know you better",
      es: "Me gustaría conocerte mejor",
      fr: "J'aimerais mieux te connaître",
      de: "Ich würde dich gern besser kennenlernen",
      it: "Mi piacerebbe conoscerti meglio",
      pt: "Gostaria de te conhecer melhor",
      zh: "我想更了解你。",
      ja: "もっとあなたのことを知りたいです。",
      ko: "당신을 더 알고 싶어요.",
      pl: "Chciał(a)bym lepiej cię poznać"
    },
    {
      en: "Shall we share dessert?",
      es: "¿Compartimos postre?",
      fr: "On partage un dessert ?",
      de: "Wollen wir ein Dessert teilen?",
      it: "Condividiamo un dolce?",
      pt: "Vamos dividir uma sobremesa?",
      zh: "我们一起吃甜点吗？",
      ja: "デザートをシェアしませんか？",
      ko: "디저트 같이 먹을래요?",
      pl: "Podzielimy się deserem?"
    },
    {
      en: "It was lovely meeting you",
      es: "Fue un placer conocerte",
      fr: "C'était un plaisir de te rencontrer",
      de: "Es war schön, dich kennenzulernen",
      it: "È stato un piacere conoscerti",
      pt: "Foi um prazer te conhecer",
      zh: "很高兴认识你。",
      ja: "会えてよかったです。",
      ko: "만나서 정말 좋았어요.",
      pl: "Miło było cię poznać"
    }
  ],
  office: [
    {
      en: "Can we schedule a meeting?",
      es: "¿Podemos programar una reunión?",
      fr: "Peut-on programmer une réunion ?",
      de: "Können wir ein Meeting planen?",
      it: "Possiamo programmare una riunione?",
      pt: "Podemos marcar uma reunião?",
      zh: "我们可以安排一个会议吗？",
      ja: "会議を予定できますか？",
      ko: "회의를 잡을 수 있을까요?",
      pl: "Czy możemy zaplanować spotkanie?"
    },
    {
      en: "I sent you an email",
      es: "Le envié un correo",
      fr: "Je vous ai envoyé un e-mail",
      de: "Ich habe Ihnen eine E-Mail geschickt",
      it: "Le ho mandato un'e-mail",
      pt: "Enviei um e-mail para você",
      zh: "我给你发了邮件。",
      ja: "メールを送りました。",
      ko: "이메일 보냈어요.",
      pl: "Wysłałem/am ci e-mail"
    },
    {
      en: "Let’s discuss the project",
      es: "Hablemos del proyecto",
      fr: "Discutons du projet",
      de: "Lassen Sie uns das Projekt besprechen",
      it: "Parliamo del progetto",
      pt: "Vamos discutir o projeto",
      zh: "我们讨论一下这个项目吧。",
      ja: "そのプロジェクトについて話し合いましょう。",
      ko: "프로젝트에 대해 이야기해 봅시다.",
      pl: "Omówmy projekt"
    },
    {
      en: "I need more time",
      es: "Necesito más tiempo",
      fr: "J'ai besoin de plus de temps",
      de: "Ich brauche mehr Zeit",
      it: "Ho bisogno di più tempo",
      pt: "Preciso de mais tempo",
      zh: "我需要更多时间。",
      ja: "もう少し時間が必要です。",
      ko: "시간이 더 필요해요.",
      pl: "Potrzebuję więcej czasu"
    },
    {
      en: "Can you send me the file?",
      es: "¿Puede enviarme el archivo?",
      fr: "Pouvez-vous m'envoyer le fichier ?",
      de: "Können Sie mir die Datei schicken?",
      it: "Può inviarmi il file?",
      pt: "Pode me enviar o arquivo?",
      zh: "您可以把文件发给我吗？",
      ja: "ファイルを送ってもらえますか？",
      ko: "파일 보내주실 수 있나요?",
      pl: "Czy może mi pan/pani wysłać plik?"
    },
    {
      en: "The deadline is tomorrow",
      es: "La fecha límite es mañana",
      fr: "La date limite est demain",
      de: "Die Frist ist morgen",
      it: "La scadenza è domani",
      pt: "O prazo é amanhã",
      zh: "截止日期是明天。",
      ja: "締め切りは明日です。",
      ko: "마감일은 내일이에요.",
      pl: "Termin jest jutro"
    },
    {
      en: "Thank you for the update",
      es: "Gracias por la actualización",
      fr: "Merci pour la mise à jour",
      de: "Danke für das Update",
      it: "Grazie per l'aggiornamento",
      pt: "Obrigado pela atualização",
      zh: "谢谢你的更新。",
      ja: "更新ありがとうございます。",
      ko: "업데이트 감사합니다.",
      pl: "Dziękuję za aktualizację"
    },
    {
      en: "I’m available this afternoon",
      es: "Estoy disponible esta tarde",
      fr: "Je suis disponible cet après-midi",
      de: "Ich bin heute Nachmittag verfügbar",
      it: "Sono disponibile questo pomeriggio",
      pt: "Estou disponível esta tarde",
      zh: "我今天下午有空。",
      ja: "今日の午後は空いています。",
      ko: "오늘 오후에 시간 돼요.",
      pl: "Jestem dostępny/a dziś po południu"
    }
  ],
  weather: [
    {
      en: "It’s sunny today",
      es: "Hoy hace sol",
      fr: "Il fait beau aujourd'hui",
      de: "Heute ist es sonnig",
      it: "Oggi c'è il sole",
      pt: "Hoje está ensolarado",
      zh: "今天天气晴朗。",
      ja: "今日は晴れです。",
      ko: "오늘은 맑아요.",
      pl: "Dziś jest słonecznie"
    },
    {
      en: "It looks like rain",
      es: "Parece que va a llover",
      fr: "On dirait qu'il va pleuvoir",
      de: "Es sieht nach Regen aus",
      it: "Sembra che pioverà",
      pt: "Parece que vai chover",
      zh: "看起来要下雨了。",
      ja: "雨が降りそうです。",
      ko: "비가 올 것 같아요.",
      pl: "Wygląda na deszcz"
    },
    {
      en: "It’s really cold outside",
      es: "Hace mucho frío afuera",
      fr: "Il fait très froid dehors",
      de: "Draußen ist es sehr kalt",
      it: "Fuori fa molto freddo",
      pt: "Está muito frio lá fora",
      zh: "外面很冷。",
      ja: "外はとても寒いです。",
      ko: "밖에 정말 추워요.",
      pl: "Na zewnątrz jest bardzo zimno"
    },
    {
      en: "Do you like this weather?",
      es: "¿Te gusta este clima?",
      fr: "Tu aimes ce temps ?",
      de: "Magst du dieses Wetter?",
      it: "Ti piace questo tempo?",
      pt: "Você gosta deste clima?",
      zh: "你喜欢这种天气吗？",
      ja: "この天気は好きですか？",
      ko: "이 날씨 좋아하세요?",
      pl: "Lubisz taką pogodę?"
    },
    {
      en: "I forgot my umbrella",
      es: "Olvidé mi paraguas",
      fr: "J'ai oublié mon parapluie",
      de: "Ich habe meinen Regenschirm vergessen",
      it: "Ho dimenticato l'ombrello",
      pt: "Esqueci meu guarda-chuva",
      zh: "我忘带伞了。",
      ja: "傘を忘れました。",
      ko: "우산을 두고 왔어요.",
      pl: "Zapomniałem/am parasola"
    },
    {
      en: "It’s windy today",
      es: "Hace viento hoy",
      fr: "Il y a du vent aujourd'hui",
      de: "Heute ist es windig",
      it: "Oggi c'è vento",
      pt: "Hoje está ventando",
      zh: "今天风很大。",
      ja: "今日は風が強いです。",
      ko: "오늘 바람이 많이 불어요.",
      pl: "Dziś jest wietrznie"
    },
    {
      en: "The forecast says snow",
      es: "El pronóstico dice que nevará",
      fr: "La météo annonce de la neige",
      de: "Die Vorhersage sagt Schnee",
      it: "Le previsioni danno neve",
      pt: "A previsão diz neve",
      zh: "天气预报说会下雪。",
      ja: "天気予報では雪だそうです。",
      ko: "일기예보에 눈이 온대요.",
      pl: "Prognoza zapowiada śnieg"
    },
    {
      en: "Perfect weather for a walk",
      es: "Tiempo perfecto para pasear",
      fr: "Un temps parfait pour une promenade",
      de: "Perfektes Wetter für einen Spaziergang",
      it: "Tempo perfetto per una passeggiata",
      pt: "Tempo perfeito para uma caminhada",
      zh: "非常适合散步的天气。",
      ja: "散歩にぴったりの天気です。",
      ko: "산책하기 딱 좋은 날씨예요.",
      pl: "Idealna pogoda na spacer"
    }
  ],
  cooking: [
    {
      en: "I need onions and garlic",
      es: "Necesito cebollas y ajo",
      fr: "J'ai besoin d'oignons et d'ail",
      de: "Ich brauche Zwiebeln und Knoblauch",
      it: "Mi servono cipolle e aglio",
      pt: "Preciso de cebolas e alho",
      zh: "我需要洋葱和大蒜。",
      ja: "玉ねぎとにんにくが必要です。",
      ko: "양파와 마늘이 필요해요.",
      pl: "Potrzebuję cebuli i czosnku"
    },
    {
      en: "How much salt should I add?",
      es: "¿Cuánta sal debo añadir?",
      fr: "Combien de sel dois-je ajouter ?",
      de: "Wie viel Salz soll ich hinzufügen?",
      it: "Quanto sale devo aggiungere?",
      pt: "Quanto sal devo adicionar?",
      zh: "我要加多少盐？",
      ja: "塩はどれくらい入れればいいですか？",
      ko: "소금을 얼마나 넣어야 하나요?",
      pl: "Ile soli powinienem/powinnam dodać?"
    },
    {
      en: "Can you chop the vegetables?",
      es: "¿Puedes cortar las verduras?",
      fr: "Peux-tu couper les légumes ?",
      de: "Kannst du das Gemüse schneiden?",
      it: "Puoi tagliare le verdure?",
      pt: "Pode cortar os legumes?",
      zh: "你能切一下蔬菜吗？",
      ja: "野菜を切ってくれますか？",
      ko: "채소 좀 썰어줄래요?",
      pl: "Możesz pokroić warzywa?"
    },
    {
      en: "Boil the water first",
      es: "Hierve el agua primero",
      fr: "Fais bouillir l'eau d'abord",
      de: "Koche zuerst das Wasser",
      it: "Fai bollire l'acqua prima",
      pt: "Ferva a água primeiro",
      zh: "先把水烧开。",
      ja: "先にお湯を沸かしてください。",
      ko: "먼저 물을 끓이세요.",
      pl: "Najpierw zagotuj wodę"
    },
    {
      en: "It smells great",
      es: "Huele muy bien",
      fr: "Ça sent très bon",
      de: "Es riecht toll",
      it: "Ha un profumo fantastico",
      pt: "Está cheirando muito bem",
      zh: "闻起来很香。",
      ja: "いい匂いがします。",
      ko: "냄새가 정말 좋아요.",
      pl: "Pachnie świetnie"
    },
    {
      en: "Stir it slowly",
      es: "Remuévelo despacio",
      fr: "Remue-le doucement",
      de: "Rühre es langsam um",
      it: "Mescolalo lentamente",
      pt: "Mexa devagar",
      zh: "慢慢搅拌。",
      ja: "ゆっくり混ぜてください。",
      ko: "천천히 저어 주세요.",
      pl: "Mieszaj powoli"
    },
    {
      en: "Is it ready yet?",
      es: "¿Ya está listo?",
      fr: "C'est prêt ?",
      de: "Ist es schon fertig?",
      it: "È già pronto?",
      pt: "Já está pronto?",
      zh: "已经好了吗？",
      ja: "もうできましたか？",
      ko: "이제 다 됐나요?",
      pl: "Czy już gotowe?"
    },
    {
      en: "Let’s cook together",
      es: "Cocinemos juntos",
      fr: "Cuisinons ensemble",
      de: "Lass uns zusammen kochen",
      it: "Cuciniamo insieme",
      pt: "Vamos cozinhar juntos",
      zh: "我们一起做饭吧。",
      ja: "一緒に料理しましょう。",
      ko: "같이 요리해요.",
      pl: "Ugotujmy coś razem"
    }
  ]
};


function getSituationPhrases(situation) {
  const base = Array.isArray(situation?.quickPhrases) ? situation.quickPhrases : [];
  const extra = EXTRA_SITUATION_PHRASES[situation?.id] || [];
  const merged = [...base, ...extra];
  const seen = new Set();
  return merged.filter((p) => {
    const key = `${p?.en || ""}__${p?.de || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, Math.max(10, merged.length));
}

function formatTutorPhraseList(situation, langCode) {
  const phrases = getSituationPhrases(situation || {}).slice(0, 10);
  return phrases.map((p, i) => {
    const target = p?.[langCode] || p?.de || p?.es || p?.fr || p?.it || p?.zh || p?.en || "";
    return `${i + 1}. ${target} — ${p?.en || ""}`;
  }).join("\n");
}


// AI Conversation Scenarios
const AI_SCENARIOS = [
  { id: "restaurant-order",  situationId: "restaurant",     aiRole: "waiter",              title: "Order at a Restaurant",   icon: "🍽️",
    systemPrompt: `You are a friendly waiter at a traditional local restaurant. The customer (the learner) is ordering food. Speak only in the target language. Be patient and helpful.` },
  { id: "cafe-order",        situationId: "cafe",            aiRole: "barista",             title: "At the Café",             icon: "☕",
    systemPrompt: `You are a friendly barista at a cozy café. Take the customer's order, ask about size and milk preferences, and make small talk. Speak only in the target language.` },
  { id: "hotel-checkin",     situationId: "hotel",           aiRole: "hotel receptionist",  title: "Hotel Check-in",          icon: "🏨",
    systemPrompt: `You are a professional hotel receptionist. Help the guest check in: confirm their reservation, explain amenities, and answer questions. Speak only in the target language.` },
  { id: "airport-help",      situationId: "airport",         aiRole: "airline staff member", title: "At the Airport",         icon: "✈️",
    systemPrompt: `You are helpful airline check-in staff at an international airport. Assist the traveler with check-in, boarding passes, and luggage queries. Speak only in the target language.` },
  { id: "doctor-visit",      situationId: "doctor",          aiRole: "doctor",              title: "Doctor's Appointment",    icon: "🏥",
    systemPrompt: `You are a calm, reassuring doctor. Ask the patient about their symptoms, duration, and medical history. Give simple advice. Speak only in the target language.` },
  { id: "pharmacy-visit",    situationId: "pharmacy",        aiRole: "pharmacist",          title: "At the Pharmacy",         icon: "💊",
    systemPrompt: `You are a knowledgeable pharmacist. Help the customer find the right medicine, explain dosage instructions, and answer health questions. Speak only in the target language.` },
  { id: "shopping-clothes",  situationId: "shopping",        aiRole: "shop assistant",      title: "Shopping for Clothes",    icon: "🛒",
    systemPrompt: `You are a helpful shop assistant in a clothing store. Help the customer find their size, suggest items, and handle the purchase. Speak only in the target language.` },
  { id: "supermarket-shop",  situationId: "supermarket",     aiRole: "supermarket employee", title: "At the Supermarket",     icon: "🏪",
    systemPrompt: `You are a friendly supermarket employee. Help the customer find products, answer questions about ingredients or prices, and handle checkout. Speak only in the target language.` },
  { id: "taxi-ride",         situationId: "taxi",            aiRole: "taxi driver",         title: "Taking a Taxi",           icon: "🚕",
    systemPrompt: `You are a chatty taxi driver. Ask the passenger where they're going, discuss the route, and make friendly small talk. Speak only in the target language.` },
  { id: "meet-new-friend",   situationId: "making-friends",  aiRole: "new acquaintance",    title: "Meeting Someone New",     icon: "🤝",
    systemPrompt: `You are a friendly local at a language exchange meetup. Introduce yourself, ask about the learner's interests, and keep the conversation flowing naturally. Speak only in the target language.` },
  { id: "bank-visit",        situationId: "bank",            aiRole: "bank teller",         title: "At the Bank",             icon: "🏦",
    systemPrompt: `You are a professional bank teller. Help the customer with their account, card queries, or a simple transaction. Be clear and formal. Speak only in the target language.` },
  { id: "job-interview",     situationId: "job-interview",   aiRole: "HR manager",          title: "Job Interview",           icon: "💼",
    systemPrompt: `You are an HR manager interviewing a candidate for a position. Ask about their experience, strengths, and motivations. Be professional but encouraging. Speak only in the target language.` },
  { id: "rent-apartment",    situationId: "apartment",       aiRole: "landlord",            title: "Renting an Apartment",    icon: "🏠",
    systemPrompt: `You are a landlord showing an apartment to a prospective tenant. Describe the flat, discuss rent and conditions, and answer questions. Speak only in the target language.` },
  { id: "phone-call-appt",   situationId: "phone-call",      aiRole: "receptionist",        title: "Making a Phone Call",     icon: "📞",
    systemPrompt: `You are an office receptionist receiving a phone call. Help the caller book an appointment or get information. Be formal and clear. Speak only in the target language.` },
  { id: "gym-signup",        situationId: "gym",             aiRole: "gym instructor",      title: "Gym & Fitness",           icon: "💪",
    systemPrompt: `You are an enthusiastic gym instructor. Help a new member sign up, explain the facilities, and discuss their fitness goals. Speak only in the target language.` },
  { id: "bar-drinks",        situationId: "bar",             aiRole: "bartender",           title: "At a Bar",                icon: "🍻",
    systemPrompt: `You are a friendly bartender. Take the customer's drink order, recommend cocktails or local beers, and have a casual chat. Use informal register. Speak only in the target language.` },
  { id: "travel-guide",      situationId: "travel",          aiRole: "local tour guide",    title: "Travel & Tourism",        icon: "🗺️",
    systemPrompt: `You are an enthusiastic local tour guide. Share sightseeing tips, recommend places to visit and eat, and help the tourist navigate. Speak only in the target language.` },
  { id: "ask-directions",    situationId: "directions",      aiRole: "helpful local",       title: "Ask for Directions",      icon: "🧭",
    systemPrompt: `You are a helpful local pedestrian. Give the learner clear directions to a nearby landmark, metro station, or shop. Use natural spatial language. Speak only in the target language.` },
  { id: "university-life",   situationId: "university",      aiRole: "university professor", title: "University Life",        icon: "🎓",
    systemPrompt: `You are a friendly university professor. Discuss a student's coursework, upcoming exam, or academic interests. Be encouraging and intellectually engaging. Speak only in the target language.` },
  { id: "emergency-help",    situationId: "emergency",       aiRole: "emergency operator",  title: "Emergency Situation",     icon: "🚨",
    systemPrompt: `You are a calm emergency operator. Help the caller describe their situation clearly, ask key questions, and guide them through next steps. Keep the tone reassuring. Speak only in the target language.` },
  { id: "post-office-errand",situationId: "post-office",     aiRole: "postal worker",       title: "At the Post Office",      icon: "📮",
    systemPrompt: `You are a helpful postal worker. Assist the customer sending a package or letter: discuss size, weight, destination, and cost. Speak only in the target language.` },
  { id: "first-date",        situationId: "date",            aiRole: "date",                title: "First Date",              icon: "❤️",
    systemPrompt: `You are on a first date at a relaxed restaurant or café. Make light, engaging conversation about hobbies, travel, and dreams. Be warm and curious. Speak only in the target language.` },
  { id: "office-meeting",    situationId: "office",          aiRole: "colleague",           title: "Office Meeting",          icon: "🏢",
    systemPrompt: `You are a friendly colleague in a team meeting. Discuss a project update, deadlines, and next steps. Use professional but natural workplace language. Speak only in the target language.` },
  { id: "weather-smalltalk", situationId: "weather",         aiRole: "friendly neighbour",  title: "Weather & Small Talk",    icon: "☀️",
    systemPrompt: `You are a friendly neighbour making casual small talk. Chat about the weather, the weekend, local events, and everyday life. Keep it relaxed and natural. Speak only in the target language.` },
  { id: "cooking-lesson",    situationId: "cooking",         aiRole: "cooking instructor",  title: "Cooking Class",           icon: "🍳",
    systemPrompt: `You are an enthusiastic cooking instructor. Walk the learner through a simple local recipe, explain ingredients and techniques, and encourage them to ask questions. Speak only in the target language.` },
];

// ─────────────────────────────────────────────
// UTILITY HOOKS & HELPERS
// ─────────────────────────────────────────────
function useProgress(userId, language = "es") {
  const lsKey = `lp_progress_${userId}_${language}`;

  const readLocalProgress = useCallback(() => {
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          completed: Array.isArray(parsed?.completed) ? parsed.completed : [],
          xp: parsed?.xp || 0,
        };
      }
    } catch (e) {}
    return { completed: [], xp: 0 };
  }, [lsKey]);

  const [data, setData] = useState(() => readLocalProgress());

  useEffect(() => {
    setData(readLocalProgress());
  }, [readLocalProgress]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .eq("language", language)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (cancelled) return;
        if (error) {
          console.warn("[useProgress] fetch warning:", error);
          return;
        }

        const local = readLocalProgress();
        const server = row
          ? {
              completed: Array.isArray(row.completed) ? row.completed : [],
              xp: row.xp || 0,
            }
          : { completed: [], xp: 0 };

        const merged = {
          completed: Array.from(new Set([...(local.completed || []), ...(server.completed || [])])),
          xp: Math.max(local.xp || 0, server.xp || 0),
        };

        setData(merged);
        try { localStorage.setItem(lsKey, JSON.stringify(merged)); } catch (e) {}

        const serverCompleted = JSON.stringify(server.completed || []);
        const mergedCompleted = JSON.stringify(merged.completed || []);
        if (!row || server.xp !== merged.xp || serverCompleted !== mergedCompleted) {
          supabase.from("progress").upsert({
            user_id: userId,
            language,
            completed: merged.completed,
            xp: merged.xp,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id,language" }).then(() => {}).catch(() => {});
        }
      })
      .catch((err) => {
        if (!cancelled) console.warn("[useProgress] fetch failed:", err);
      });

    return () => { cancelled = true; };
  }, [userId, language, lsKey, readLocalProgress]);

  const complete = useCallback(async (id, xp) => {
    setData(prev => {
      if (prev.completed.includes(id)) return prev;
      const next = { completed: [...prev.completed, id], xp: prev.xp + xp };
      try { localStorage.setItem(lsKey, JSON.stringify(next)); } catch (e) {}
      if (userId) {
        supabase.from("progress").upsert({
          user_id: userId,
          language,
          completed: next.completed,
          xp: next.xp,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,language" }).then(() => {}).catch(() => {});
      }
      return next;
    });
  }, [userId, language, lsKey]);

  const isDone = (id) => data.completed.includes(id);
  return { data, complete, isDone };
}

function getLevelColor(level) {
  return level === "A1" ? "#22c55e" : level === "A2" ? "#38bdf8" : "#a78bfa";
}

function getCompletedModuleIds(curriculum = {}, completed = []) {
  const validIds = new Set(getAllModules(curriculum).map((m) => m.id));
  const unique = [];
  const seen = new Set();
  (completed || []).forEach((id) => {
    if (validIds.has(id) && !seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  });
  return unique;
}

function getCachedProgress(userId, language) {
  if (!userId || !language || typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(`lp_progress_${userId}_${language}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      language,
      xp: parsed?.xp || 0,
      completed: Array.isArray(parsed?.completed) ? parsed.completed : [],
    };
  } catch (e) {
    return null;
  }
}


const VISUAL_QUERY_MAP = {
  "calendar": "Calendar",
  "kalender": "Calendar",
  "calendario": "Calendar",
  "calendrier": "Calendar",
  "bus": "Bus",
  "hotel": "Hotel",
  "server": "Waiter",
  "waiter": "Waiter",
  "waitress": "Waitress",
  "station": "Railway station",
  "bahnhof": "Railway station",
  "u-bahn": "Rapid transit",
  "airport": "Airport",
  "museum": "Museum",
  "bank": "Bank",
  "pharmacy": "Pharmacy",
  "supermarket": "Supermarket",
  "park": "Park",
  "hospital": "Hospital",
  "bridge": "Bridge",
  "ticket": "Ticket",
  "fahrkarte": "Ticket",
  "billet": "Ticket",
  "billete": "Ticket",
  "biglietto": "Ticket",
  "车票": "Ticket",
  "passport": "Passport",
  "menu": "Menu",
  "restaurant": "Restaurant",
  "coffee": "Coffee",
  "tea": "Tea",
  "bread": "Bread",
  "rice": "Rice",
  "soup": "Soup",
  "salad": "Salad",
  "apple": "Apple",
  "cheese": "Cheese",
  "shirt": "Shirt",
  "pants": "Trousers",
  "trousers": "Trousers",
  "hose": "Trousers",
  "shoes": "Shoes",
  "dress": "Dress",
  "jacket": "Jacket",
  "bag": "Bag",
  "gift": "Gift",
  "souvenir": "Souvenir",
  "postcard": "Postcard",
  "flowers": "Flowers",
  "book": "Book",
  "perfume": "Perfume",
  "toy": "Toy",
  "mother": "Mother",
  "father": "Father",
  "brother": "Brother",
  "sister": "Sister",
  "tram": "Tram",
  "subway": "Rapid transit",
  "taxi": "Taxi",
  "bicycle": "Bicycle",
  "car": "Car",
  "airplane": "Airplane",
  "train": "Train",
  "zug": "Train",
  "map": "Map",
  "umbrella": "Umbrella",
  "clock": "Clock",
  "breakfast": "Breakfast",
  "dinner": "Dinner",
  "phone": "Mobile phone",
  "water": "Water",
  "fahrplan": "Timetable"
};

const NUMBER_VALUE_MAP = {
  "0": 0, "zero": 0, "null": 0, "cero": 0, "zéro": 0, "零": 0,
  "1": 1, "one": 1, "eins": 1, "uno": 1, "un": 1, "une": 1, "一": 1,
  "2": 2, "two": 2, "zwei": 2, "dos": 2, "deux": 2, "due": 2, "二": 2,
  "3": 3, "three": 3, "drei": 3, "tres": 3, "trois": 3, "tre": 3, "三": 3,
  "4": 4, "four": 4, "vier": 4, "cuatro": 4, "quatre": 4, "quattro": 4, "四": 4,
  "5": 5, "five": 5, "fünf": 5, "cinco": 5, "cinq": 5, "cinque": 5, "五": 5,
  "6": 6, "six": 6, "sechs": 6, "seis": 6, "sei": 6, "六": 6,
  "7": 7, "seven": 7, "sieben": 7, "siete": 7, "sept": 7, "sette": 7, "七": 7,
  "8": 8, "eight": 8, "acht": 8, "ocho": 8, "huit": 8, "otto": 8, "八": 8,
  "9": 9, "nine": 9, "neun": 9, "nueve": 9, "neuf": 9, "nove": 9, "九": 9,
  "10": 10, "ten": 10, "zehn": 10, "diez": 10, "dix": 10, "dieci": 10, "十": 10
};


export { GLOBAL_CSS, SITUATIONS, AI_SCENARIOS, getSituationPhrases, formatTutorPhraseList };
