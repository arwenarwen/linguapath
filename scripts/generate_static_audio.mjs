/**
 * LinguaPath Static Audio Generator
 * Generates MP3s for every item in public/audio/manifest.json
 *
 * SETUP
 * ─────
 * 1. Add your ElevenLabs key to .env.local:
 *      ELEVENLABS_API_KEY=sk_...
 *
 * 2. Optionally add custom voice IDs (defaults are good):
 *      VOICE_ES=EXAVITQu4vr4xnSDxMaL
 *      VOICE_DE=kUqnjA18C6ISqjtKOpsJ
 *      (etc — see VOICE_IDS below)
 *
 * USAGE
 * ─────
 *   node scripts/generate_static_audio.mjs              # all languages
 *   node scripts/generate_static_audio.mjs es fr        # specific languages
 *   node scripts/generate_static_audio.mjs de           # one language
 *   node scripts/generate_static_audio.mjs --dry-run    # preview, no API calls
 *   node scripts/generate_static_audio.mjs es --force   # re-generate existing files
 *
 * OUTPUT
 * ──────
 *   public/audio/{lang}/{slug}.mp3
 *
 * The tryPlayStaticAudio() function in src/lib/staticAudio.js will
 * automatically use these files instead of calling /api/tts.
 */

import fs   from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const p = path.join(ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}
loadEnv();

// ── Voice IDs (ElevenLabs) ─────────────────────────────────────────────────
// Override any of these with VOICE_{UPPER_CODE} in .env.local
// e.g.  VOICE_ES=your_custom_voice_id
const DEFAULT_VOICES = {
  de: "kUqnjA18C6ISqjtKOpsJ",  // German man
  es: "zdzXtQ5BTOYMDG04sR8R",  // Spanish man
  it: "BUAZlX1JYGONhOQdurfl",  // Italian man
  fr: "ttrVUBHgC9AEENt2kGi6",  // French man
  zh: "RrYpxumYIVoc5NKCTGOg",  // Chinese man
  ko: "FNrsMcVkTfKeSyL1UYXS",  // Korean man
  ja: "9XG6vvb5sQYWawDizIlo",  // Japanese man
  ru: "1iQuCymkuonZDnoteVZT",  // Russian man
  el: "8C0RosTo9KZhAz8UmM7c",  // Greek man
  pt: "CImjz27snHwe55ik6hke",  // Portuguese man
  en: "zdzXtQ5BTOYMDG04sR8R",  // fallback to Spanish man for English UI
};

function getVoice(code) {
  const envKey = `VOICE_${code.toUpperCase()}`;
  return process.env[envKey] || DEFAULT_VOICES[code] || DEFAULT_VOICES.en;
}

// ── Language names ─────────────────────────────────────────────────────────
const LANG_NAMES = {
  es:"Spanish", fr:"French", de:"German", it:"Italian", pt:"Portuguese",
  zh:"Chinese", ja:"Japanese", ko:"Korean", pl:"Polish", en:"English",
};

// ── Paths ──────────────────────────────────────────────────────────────────
const API_KEY      = process.env.ELEVENLABS_API_KEY;
const MANIFEST     = path.join(ROOT, "public", "audio", "manifest.json");
const AUDIO_ROOT   = path.join(ROOT, "public", "audio");

// ── Args ───────────────────────────────────────────────────────────────────
const args        = process.argv.slice(2);
const DRY_RUN     = args.includes("--dry-run");
const FORCE       = args.includes("--force");
const LANG_FILTER = args.filter(a => !a.startsWith("--") && /^[a-z]{2}$/.test(a));

// ── Helpers ────────────────────────────────────────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function cleanText(raw) {
  return String(raw || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/\([^)]*\)/g, "")
    .replace(/[*_#`~]/g, "")
    .trim();
}

function eta(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s/60)}m ${s%60}s`;
}

// ── ElevenLabs TTS call ────────────────────────────────────────────────────
function tts({ text, voiceId }) {
  const body = JSON.stringify({
    text: cleanText(text),
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.72,
      similarity_boost: 0.88,
      style: 0.0,
      use_speaker_boost: true,
    },
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "api.elevenlabs.io",
      path: `/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
        "Content-Length": Buffer.byteLength(body),
      },
    }, res => {
      if (res.statusCode === 429) { reject(new Error("RATE_LIMITED")); return; }
      if (res.statusCode !== 200) {
        let e = "";
        res.on("data", d => e += d);
        res.on("end", () => reject(new Error(`HTTP ${res.statusCode}: ${e.slice(0,120)}`)));
        return;
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🎙️  LinguaPath Static Audio Generator");
  console.log("══════════════════════════════════════");

  if (!API_KEY && !DRY_RUN) {
    console.error("❌  ELEVENLABS_API_KEY not found in .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(MANIFEST)) {
    console.error("❌  manifest.json not found at public/audio/manifest.json");
    process.exit(1);
  }

  const manifest    = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const allLangs    = Object.keys(manifest);
  const targetLangs = LANG_FILTER.length ? LANG_FILTER : allLangs;

  if (DRY_RUN) console.log("🔍  DRY RUN — no API calls\n");

  // Count work
  let totalNew = 0, totalSkip = 0;
  for (const lang of targetLangs) {
    const items = manifest[lang] || [];
    const dir   = path.join(AUDIO_ROOT, lang);
    for (const item of items) {
      const fp = path.join(dir, `${item.slug}.mp3`);
      (!FORCE && fs.existsSync(fp)) ? totalSkip++ : totalNew++;
    }
  }

  console.log(`📋  Languages : ${targetLangs.map(l => LANG_NAMES[l]||l).join(", ")}`);
  console.log(`📦  To generate: ${totalNew.toLocaleString()}  |  Already done: ${totalSkip.toLocaleString()}`);
  if (totalNew > 0) {
    const ms = totalNew * 900; // ~900ms avg per item with delays
    console.log(`⏱️   Est. time  : ~${eta(ms)}`);
    console.log(`💰  Est. chars : ~${(totalNew * 12).toLocaleString()} (ElevenLabs)`);
  }
  console.log("");

  if (totalNew === 0 && !DRY_RUN) {
    console.log("✅  All audio already generated! Run with --force to regenerate.");
    return;
  }

  let generated = 0, skipped = 0, errors = 0;
  const start = Date.now();

  for (const lang of targetLangs) {
    const items   = manifest[lang] || [];
    const voiceId = getVoice(lang);
    const dir     = path.join(AUDIO_ROOT, lang);

    if (!DRY_RUN) ensureDir(dir);

    const todo = items.filter(item => {
      if (FORCE) return true;
      return !fs.existsSync(path.join(dir, `${item.slug}.mp3`));
    });

    console.log(`\n🌍  ${LANG_NAMES[lang]||lang} (${lang})`);
    console.log(`    Voice  : ${voiceId}`);
    console.log(`    New    : ${todo.length}  |  Existing: ${items.length - todo.length}`);

    for (let i = 0; i < todo.length; i++) {
      const item = todo[i];
      const fp   = path.join(dir, `${item.slug}.mp3`);

      if (DRY_RUN) {
        console.log(`    [dry]  ${item.slug.padEnd(45)} ← ${item.text.slice(0,50)}`);
        generated++;
        continue;
      }

      const pct = Math.round(((generated + skipped) / Math.max(totalNew, 1)) * 100);
      process.stdout.write(`    [${String(pct).padStart(3)}%] ${item.slug.slice(0,44).padEnd(44)} `);

      let retries = 0;
      while (retries <= 3) {
        try {
          const buf = await tts({ text: item.text, voiceId });
          fs.writeFileSync(fp, buf);
          console.log(`✅ ${(buf.length/1024).toFixed(1)}kb`);
          generated++;
          break;
        } catch (err) {
          if (err.message === "RATE_LIMITED") {
            const wait = 60 + retries * 30;
            console.log(`\n    ⚠️  Rate limited — waiting ${wait}s...`);
            await sleep(wait * 1000);
            retries++;
          } else {
            console.log(`❌ ${err.message?.slice(0,60)}`);
            errors++;
            break;
          }
        }
      }

      // Pacing: 300ms between calls, extra 2s every 50 items
      await sleep(300);
      if ((i + 1) % 50 === 0) {
        const done  = generated + skipped;
        const left  = totalNew - done;
        const msLeft = left * 900;
        console.log(`\n    ⏸️  ${i+1}/${todo.length} done — ~${eta(msLeft)} remaining...\n`);
        await sleep(2000);
      }
    }
  }

  const elapsed = Date.now() - start;
  console.log("\n══════════════════════════════════════");
  console.log(`✅  Generated : ${generated}`);
  console.log(`⏭️   Skipped   : ${skipped}`);
  if (errors) console.log(`❌  Errors    : ${errors}`);
  console.log(`⏱️   Time      : ${eta(elapsed)}`);
  console.log("\n🎉  Done! Files saved to public/audio/");
  if (errors > 0) {
    console.log(`\n⚠️   ${errors} files failed. Re-run the same command to retry them.`);
  }
}

main().catch(err => {
  console.error("\n❌ Fatal:", err.message || err);
  process.exit(1);
});
