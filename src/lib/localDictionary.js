const cache = new Map();

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

async function loadDictionary(langCode) {
  const code = String(langCode || '').toLowerCase();
  if (!code) return null;
  if (cache.has(code)) return cache.get(code);
  try {
    const res = await fetch(`/data/dictionaries/${code}.json`, { cache: 'force-cache' });
    if (!res.ok) {
      cache.set(code, null);
      return null;
    }
    const data = await res.json();
    cache.set(code, data);
    return data;
  } catch {
    cache.set(code, null);
    return null;
  }
}

export async function lookupLocalDictionary(term, langCode) {
  const dict = await loadDictionary(langCode);
  if (!dict) return null;

  const q = normalizeKey(term);
  if (!q) return null;

  const entries = Array.isArray(dict) ? dict : Array.isArray(dict.entries) ? dict.entries : [];

  for (const entry of entries) {
    const keys = [entry.term, entry.word, entry.lemma, ...(entry.aliases || [])].map(normalizeKey).filter(Boolean);
    const translations = [entry.translation, ...(entry.translations || [])].map(normalizeKey).filter(Boolean);
    if (keys.includes(q) || translations.includes(q)) {
      return {
        translation: entry.translation || (entry.translations || [])[0] || '',
        pronunciation: entry.pronunciation || '',
        partOfSpeech: entry.partOfSpeech || '',
        example: entry.example || '',
        exampleTranslation: entry.exampleTranslation || '',
        notes: entry.notes || '',
      };
    }
  }

  return null;
}
