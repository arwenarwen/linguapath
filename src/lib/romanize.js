// ── romanize.js ─────────────────────────────────────────────────────────────
// Romanization helpers for non-Latin script languages.
// Chinese: uses pinyin-pro (npm). Korean + Japanese: pure JS, no library needed.

// ── Which languages need romanization shown to learners ──────────────────────
export const NEEDS_ROM = new Set(['zh', 'ja', 'ko']);

// ── Korean: Revised Romanization of Korean ───────────────────────────────────
// Hangul syllable block: U+AC00–U+D7A3
// offset = (initial * 21 + vowel) * 28 + final
const KO_INIT  = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const KO_VOWEL = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const KO_FINAL = ['','k','k','k','n','n','n','t','l','k','m','p','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];

function koRom(text) {
  return [...(text||'')].map(ch => {
    const cp = ch.codePointAt(0);
    if (cp < 0xAC00 || cp > 0xD7A3) return ch;
    const off = cp - 0xAC00;
    return KO_INIT[Math.floor(off / 588)] + KO_VOWEL[Math.floor((off % 588) / 28)] + KO_FINAL[off % 28];
  }).join('');
}

// ── Japanese: Kana → Romaji table ────────────────────────────────────────────
// Two-char combos must be checked before single chars.
const KANA = {
  // voiced combos
  'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'じゃ':'ja', 'じゅ':'ju', 'じょ':'jo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo',
  'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  // unvoiced combos
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  // singles — unvoiced
  'あ':'a', 'い':'i', 'う':'u', 'え':'e', 'お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  // singles — voiced
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  // special
  'っ':'', 'ー':'-', '〜':'~',
};

function hiraToRomaji(ch) {
  const cp = ch.codePointAt(0);
  // Katakana → hiragana offset is 0x60
  const h = (cp >= 0x30A1 && cp <= 0x30F6) ? String.fromCodePoint(cp - 0x60) : ch;
  return KANA[h] !== undefined ? KANA[h] : ch;
}

function jaRom(text) {
  const chars = [...(text||'')];
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const combo = chars[i] + (chars[i+1] || '');
    if (KANA[combo] !== undefined) { out += KANA[combo]; i++; }
    else out += hiraToRomaji(chars[i]);
  }
  return out;
}

// ── Chinese: lazy-load pinyin-pro ─────────────────────────────────────────────
let _pinyin = null;
async function loadPinyin() {
  if (_pinyin) return _pinyin;
  try {
    const mod = await import('pinyin-pro');
    _pinyin = mod.pinyin;
    return _pinyin;
  } catch { return null; }
}

// ── Public helpers ────────────────────────────────────────────────────────────

/**
 * Returns romanization string for Korean/Japanese synchronously.
 * For Chinese, use getRom() (async).
 */
export function getRomSync(text, langCode) {
  if (!text || !NEEDS_ROM.has(langCode)) return '';
  if (langCode === 'ko') return koRom(text);
  if (langCode === 'ja') return jaRom(text);
  return ''; // zh needs async
}

/**
 * Returns romanization for any supported language (async for zh, sync for ko/ja).
 */
export async function getRom(text, langCode) {
  if (!text || !NEEDS_ROM.has(langCode)) return '';
  if (langCode === 'zh') {
    const fn = await loadPinyin();
    if (!fn) return '';
    // type:'string' returns a space-separated string of syllables
    return fn(text, { toneType: 'symbol', type: 'string' });
  }
  return getRomSync(text, langCode);
}
