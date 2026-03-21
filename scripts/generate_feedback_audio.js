/**
 * LinguaPath — Generate short correct/incorrect feedback audio for all languages
 *
 * Run from project root:
 *   export ELEVENLABS_API_KEY=your_key_here
 *   node scripts/generate_feedback_audio.js
 *
 * Output: public/audio/<lang>/correct.mp3 and public/audio/<lang>/incorrect.mp3
 * These are the generic fallback clips played when per-question audio isn't available.
 * German already has richtig.mp3 / falsch.mp3 — skipped here.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY   = process.env.ELEVENLABS_API_KEY;

const FEEDBACK = [
  { code:"fr", voice:"ttrVUBHgC9AEENt2kGi6", correct:"Correct !",         incorrect:"Incorrect. Bonne chance !" },
  { code:"es", voice:"zdzXtQ5BTOYMDG04sR8R", correct:"¡Correcto!",        incorrect:"Incorrecto. ¡Sigue intentando!" },
  { code:"it", voice:"BUAZlX1JYGONhOQdurfl", correct:"Corretto!",         incorrect:"Sbagliato. Continua così!" },
  { code:"pt", voice:"CImjz27snHwe55ik6hke", correct:"Correto!",          incorrect:"Incorreto. Continue tentando!" },
  { code:"ru", voice:"1iQuCymkuonZDnoteVZT", correct:"Правильно!",        incorrect:"Неверно. Попробуйте ещё раз!" },
  { code:"zh", voice:"RrYpxumYIVoc5NKCTGOg", correct:"正确！",             incorrect:"不对。继续加油！" },
  { code:"ja", voice:"9XG6vvb5sQYWawDizIlo", correct:"正解です！",          incorrect:"不正解です。頑張ってください！" },
  { code:"ko", voice:"FNrsMcVkTfKeSyL1UYXS", correct:"정답입니다!",        incorrect:"틀렸습니다. 계속 도전하세요!" },
  { code:"el", voice:"8C0RosTo9KZhAz8UmM7c", correct:"Σωστά!",           incorrect:"Λάθος. Συνέχισε να προσπαθείς!" },
];

async function generateAudio(text, outPath, voiceId) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.50, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  if (!API_KEY) { console.error("❌  Set ELEVENLABS_API_KEY"); process.exit(1); }

  const toGenerate = [];
  for (const { code, voice, correct, incorrect } of FEEDBACK) {
    const dir = path.join(__dirname, `../public/audio/${code}`);
    fs.mkdirSync(dir, { recursive: true });
    const correctPath   = path.join(dir, "correct.mp3");
    const incorrectPath = path.join(dir, "incorrect.mp3");
    if (!fs.existsSync(correctPath))   toGenerate.push({ label:`[${code}] correct`,   text:correct,   outPath:correctPath,   voice });
    if (!fs.existsSync(incorrectPath)) toGenerate.push({ label:`[${code}] incorrect`, text:incorrect, outPath:incorrectPath, voice });
  }

  console.log(`\n🎙️  ${toGenerate.length} feedback clips to generate\n`);
  let done = 0, failed = 0;
  for (const { label, text, outPath, voice } of toGenerate) {
    process.stdout.write(`  ${label}: "${text}" ... `);
    try {
      await generateAudio(text, outPath, voice);
      console.log("✅"); done++;
    } catch (e) {
      console.log(`❌ ${e.message}`); failed++;
    }
    await new Promise(r => setTimeout(r, 600));
  }
  console.log(`\n✅  Done! Generated: ${done}  Failed: ${failed}`);
}

main();
