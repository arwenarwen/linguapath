export function slugifyStaticAudio(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .toLowerCase();
}

export function getStaticAudioUrl(langCode, text, audioFolder = "") {
  const slug = slugifyStaticAudio(text);
  const folder = audioFolder ? `/${audioFolder}` : "";
  return `/audio/${langCode}${folder}/${slug}.mp3`;
}

export async function tryPlayStaticAudio({ text, langCode, stopAllAudio, setActiveAudio, audioFolder = "" }) {
  const clean = String(text || "").trim();
  if (!clean) return false;

  // German and English have pre-recorded files of any length (German: vocab; English: exam questions/feedback)
  // All other languages: skip HEAD request for long strings unlikely to have a static file
  if (langCode !== "de" && langCode !== "en" && clean.length > 80) return false;

  const candidateUrls = [];
  if (audioFolder) candidateUrls.push(getStaticAudioUrl(langCode, clean, audioFolder));
  candidateUrls.push(getStaticAudioUrl(langCode, clean, ""));
  if (langCode === "de" && !audioFolder) candidateUrls.push(getStaticAudioUrl(langCode, clean, "statues"));

  let url = null;
  for (const candidate of candidateUrls) {
    try {
      const head = await fetch(candidate, { method: "HEAD", cache: "force-cache" });
      if (head.ok) { url = candidate; break; }
    } catch {}
  }
  if (!url) return false;

  try {
    if (typeof stopAllAudio === "function") stopAllAudio();
    const audio = new Audio(url);
    audio.preload = "auto";
    if (typeof setActiveAudio === "function") setActiveAudio(audio);
    await audio.play();
    return true;
  } catch {
    return false;
  }
}
