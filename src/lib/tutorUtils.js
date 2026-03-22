// Tutor reply parsing and speech normalisation utilities.
// Extracted from AIChat.jsx — pure string functions, no side-effects.

/**
 * Parse ⚠️ CORRECTION blocks from an AI tutor reply.
 */
export function parseMistakes(reply) {
  const regex = /\u26a0\ufe0f CORRECTION:\s*"([^"]+)"\s*\u2192\s*"([^"]+)"\s*\|\s*([^\n]+)/g;
  const out = [];
  let m;
  while ((m = regex.exec(reply)) !== null) {
    out.push({ original: m[1].trim(), corrected: m[2].trim(), explanation: m[3].trim() });
  }
  return out;
}

/**
 * Normalise tutor reply text for TTS — expand abbreviations, clean symbols.
 */
export function normalizeTutorSpeechText(text, langCode = "en") {
  if (!text) return "";
  let out = String(text);

  const ordinalMap = {
    en: {1:"first",2:"second",3:"third",4:"fourth",5:"fifth",6:"sixth",7:"seventh",8:"eighth",9:"ninth",10:"tenth"},
    de: {1:"erstens",2:"zweitens",3:"drittens",4:"viertens",5:"funftens",6:"sechstens",7:"siebtens",8:"achtens",9:"neuntens",10:"zehntens"},
    zh: {1:"\u7b2c\u4e00",2:"\u7b2c\u4e8c",3:"\u7b2c\u4e09",4:"\u7b2c\u56db",5:"\u7b2c\u4e94",6:"\u7b2c\u516d",7:"\u7b2c\u4e03",8:"\u7b2c\u516b",9:"\u7b2c\u4e5d",10:"\u7b2c\u5341"}
  };
  const ords = ordinalMap[langCode] || ordinalMap.en;

  out = out.replace(/Question\s+(\d+)\s*\/\s*(\d+)/gi, (_, a, b) => `Question ${a} out of ${b}`);
  out = out.replace(/Questions\s+(\d+)\s*-\s*(\d+)/gi, (_, a, b) => `Questions ${a} to ${b}`);

  out = out.replace(/(^|\n)\s*(\d{1,2})[\.):]\s+/g, (m, prefix, n) => {
    const num = Number(n);
    const word = ords[num] || `${n}.`;
    return `${prefix}${word}: `;
  });

  out = out.replace(/(^|\n)\s*([A-D])[\)]\s+/g, (_, prefix, letter) => `${prefix}Option ${letter}. `);

  out = out
    .replace(/\u2192/g, " to ")
    .replace(/\|/g, ". ")
    .replace(/\u2026/g, " ... ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return out;
}
