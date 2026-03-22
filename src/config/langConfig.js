// Per-language chat config: display name, input placeholder, fallback message.

export function getAIChatLangConfig(langCode) {
  const configs = {
    es: { name:"Spanish",    placeholder:"Escribe en español...",       tip:"Speak only in Spanish. The AI will correct mistakes naturally.",    fallback:"Lo siento, hay un problema técnico. ¡Intenta de nuevo!" },
    fr: { name:"French",     placeholder:"Écris en français...",         tip:"Speak only in French. The AI will correct mistakes naturally.",     fallback:"Désolé, il y a un problème technique. Réessaie !" },
    de: { name:"German",     placeholder:"Schreib auf Deutsch...",       tip:"Speak only in German. The AI will correct mistakes naturally.",     fallback:"Entschuldigung, technisches Problem. Bitte versuche es erneut!" },
    it: { name:"Italian",    placeholder:"Scrivi in italiano...",        tip:"Speak only in Italian. The AI will correct mistakes naturally.",    fallback:"Scusa, problema tecnico. Riprova!" },
    pt: { name:"Portuguese", placeholder:"Escreve em português...",      tip:"Speak only in Portuguese. The AI will correct mistakes naturally.", fallback:"Desculpe, há um problema técnico. Tente de novo!" },
    zh: { name:"Chinese",    placeholder:"用中文输入...",                tip:"Speak only in Chinese. The AI will correct mistakes naturally.",    fallback:"抱歉，出现技术问题，请重试！" },
    ja: { name:"Japanese",   placeholder:"日本語で入力してください...",  tip:"Speak only in Japanese. The AI will correct mistakes naturally.",   fallback:"申し訳ありません、技術的な問題があります。もう一度お試しください。" },
    ko: { name:"Korean",     placeholder:"한국어로 입력하세요...",        tip:"Speak only in Korean. The AI will correct mistakes naturally.",     fallback:"죄송합니다, 기술적인 문제가 있습니다. 다시 시도해 주세요." },
    pl: { name:"Polish",     placeholder:"Pisz po polsku...",            tip:"Speak only in Polish. The AI will correct mistakes naturally.",     fallback:"Przepraszam, problem techniczny. Spróbuj ponownie!" },
    en: { name:"English",    placeholder:"Write in English...",          tip:"Speak only in English. The AI will correct mistakes naturally.",    fallback:"Sorry, there's a technical issue. Please try again!" },
  };
  return configs[langCode] || configs.en;
}

