/**
 * LinguaPath — Pre-generate ALL missing German audio files via ElevenLabs
 * Run from the project root:
 *
 *   export ELEVENLABS_API_KEY=your_key_here
 *   node scripts/generate_missing_audio_de.js
 *
 * Output: public/audio/de/<slug>.mp3
 * Voice:  kUqnjA18C6ISqjtKOpsJ (German male)
 *
 * Covers:
 *   - 144 lesson vocab words + individual tile words
 *   - 50 exam question answer options
 *   = 194 total (skips any already generated)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY  = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "kUqnjA18C6ISqjtKOpsJ"; // VOICE_DE
const OUT_DIR  = path.join(__dirname, "../public/audio/de");

// 194 entries = 144 lesson vocab/tiles + 50 exam question options
const MISSING = [
  // ── EXAM QUESTION AUDIO ───────────────────────────────────────────────────
  { slug: "alte", text: "alte" },
  { slug: "alten", text: "alten" },
  { slug: "altes", text: "altes" },
  { slug: "damit", text: "Damit" },
  { slug: "das_entscheiden", text: "das Entscheiden" },
  { slug: "den", text: "Den" },
  { slug: "der_entscheider", text: "der Entscheider" },
  { slug: "die_entscheidung", text: "die Entscheidung" },
  { slug: "die_entschiedenheit", text: "die Entschiedenheit" },
  { slug: "doch", text: "doch" },
  { slug: "empfindlich", text: "empfindlich" },
  { slug: "gefu_hlvoll", text: "gefühlvoll" },
  { slug: "gegangen", text: "gegangen" },
  { slug: "gehe", text: "gehe" },
  { slug: "geholfen", text: "geholfen" },
  { slug: "gewollt", text: "gewollt" },
  { slug: "ging", text: "ging" },
  { slug: "habe", text: "habe" },
  { slug: "halt", text: "halt" },
  { slug: "hat", text: "hat" },
  { slug: "helfe", text: "helfe" },
  { slug: "hilft", text: "hilft" },
  { slug: "ist_gewesen", text: "ist gewesen" },
  { slug: "ka_me", text: "käme" },
  { slug: "macht", text: "macht" },
  { slug: "mal", text: "mal" },
  { slug: "nur", text: "nur" },
  { slug: "obwohl", text: "Obwohl" },
  { slug: "sage", text: "sage" },
  { slug: "schon", text: "schon" },
  { slug: "sei", text: "sei" },
  { slug: "sensibel", text: "sensibel" },
  { slug: "sto_rt", text: "stört" },
  { slug: "thomas", text: "Thomas" },
  { slug: "u_ber", text: "über" },
  { slug: "vernu_nftig", text: "vernünftig" },
  { slug: "vero_ffentlichen", text: "veröffentlichen" },
  { slug: "vero_ffentlichend", text: "veröffentlichend" },
  { slug: "vero_ffentlicht", text: "veröffentlicht" },
  { slug: "vero_ffentlichte", text: "veröffentlichte" },
  { slug: "wa_re", text: "wäre" },
  { slug: "war_gewesen", text: "war gewesen" },
  { slug: "wenn", text: "Wenn" },
  { slug: "wird", text: "wird" },
  { slug: "wollen", text: "wollen" },
  { slug: "wollte", text: "wollte" },
  { slug: "wurde", text: "wurde" },

  // ── LESSON VOCAB + TILE WORDS ─────────────────────────────────────────────

  { slug: "a_lter", text: "älter" },
  { slug: "ab", text: "ab" },
  { slug: "abend", text: "Abend" },
  { slug: "abfahrt", text: "Abfahrt" },
  { slug: "alles", text: "Alles" },
  { slug: "alt", text: "alt" },
  { slug: "an", text: "an" },
  { slug: "andere", text: "andere" },
  { slug: "anna", text: "Anna" },
  { slug: "aqui", text: "aquí" },
  { slug: "arbeit", text: "Arbeit" },
  { slug: "arzt", text: "Arzt" },
  { slug: "auch", text: "auch" },
  { slug: "auf", text: "auf" },
  { slug: "bahnsteig", text: "Bahnsteig" },
  { slug: "bei", text: "bei" },
  { slug: "besonderes", text: "Besonderes" },
  { slug: "bestens", text: "bestens" },
  { slug: "bewo_lkt", text: "bewölkt" },
  { slug: "biegen", text: "biegen" },
  { slug: "bis", text: "Bis" },
  { slug: "brauche", text: "brauche" },
  { slug: "bu_ro", text: "Büro" },
  { slug: "bushaltestelle", text: "Bushaltestelle" },
  { slug: "chef", text: "Chef" },
  { slug: "dank", text: "Dank" },
  { slug: "darauf", text: "darauf" },
  { slug: "das", text: "das" },
  { slug: "dass", text: "dass" },
  { slug: "dem", text: "dem" },
  { slug: "denke", text: "denke" },
  { slug: "der", text: "der" },
  { slug: "die", text: "die" },
  { slug: "die_stra\u00dfe", text: "die Straße" },
  { slug: "dir", text: "dir" },
  { slug: "ein", text: "ein" },
  { slug: "einzelfahrkarte", text: "Einzelfahrkarte" },
  { slug: "er_sie", text: "Er oder Sie" },
  { slug: "es", text: "es" },
  { slug: "fieber", text: "Fieber" },
  { slug: "frau", text: "Frau" },
  { slug: "freut", text: "freut" },
  { slug: "fu_r", text: "für" },
  { slug: "fu\u00dfball", text: "Fußball" },
  { slug: "gehalt", text: "Gehalt" },
  { slug: "geht", text: "geht" },
  { slug: "geht_s", text: "geht's" },
  { slug: "gibt", text: "gibt" },
  { slug: "gibt_s", text: "gibt's" },
  { slug: "gute", text: "Gute" },
  { slug: "guten", text: "Guten" },
  { slug: "hallo_guten_morgen", text: "Hallo! Guten Morgen." },
  { slug: "haus", text: "Haus" },
  { slug: "hei\u00dfe", text: "heiße" },
  { slug: "hei\u00dft", text: "heißt" },
  { slug: "herr", text: "Herr" },
  { slug: "hin", text: "Hin" },
  { slug: "ho_ren", text: "hören" },
  { slug: "ich_hei\u00dfe_anna", text: "Ich heiße Anna." },
  { slug: "ich_hei\u00dfe_lukas", text: "Ich heiße Lukas." },
  { slug: "ich_komme_aus_aqui", text: "Ich komme aus..." },
  { slug: "in", text: "in" },
  { slug: "inbegriffen", text: "inbegriffen" },
  { slug: "ist", text: "ist" },
  { slug: "jahre", text: "Jahre" },
  { slug: "ju_nger", text: "jünger" },
  { slug: "ka_mmen", text: "kämmen" },
  { slug: "kein", text: "kein" },
  { slug: "keine", text: "keine" },
  { slug: "ko_stlich", text: "köstlich" },
  { slug: "kollege", text: "Kollege" },
  { slug: "kommst", text: "kommst" },
  { slug: "kommt", text: "kommt" },
  { slug: "kopf", text: "Kopf" },
  { slug: "lassen", text: "lassen" },
  { slug: "laufenden", text: "Laufenden" },
  { slug: "leid", text: "leid" },
  { slug: "lukas", text: "Lukas" },
  { slug: "mach_s", text: "Mach's" },
  { slug: "machen", text: "machen" },
  { slug: "medikament", text: "Medikament" },
  { slug: "meiner", text: "meiner" },
  { slug: "meinung", text: "Meinung" },
  { slug: "mich", text: "mich" },
  { slug: "mir", text: "mir" },
  { slug: "mit", text: "mit" },
  { slug: "mittag", text: "Mittag" },
  { slug: "mitternacht", text: "Mitternacht" },
  { slug: "mo_chte", text: "möchte" },
  { slug: "musik", text: "Musik" },
  { slug: "na_he", text: "Nähe" },
  { slug: "nach", text: "nach" },
  { slug: "nachmittag", text: "Nachmittag" },
  { slug: "nacht", text: "Nacht" },
  { slug: "neblig", text: "neblig" },
  { slug: "neues", text: "Neues" },
  { slug: "nicht", text: "nicht" },
  { slug: "nichts", text: "Nichts" },
  { slug: "regnet", text: "regnet" },
  { slug: "rezept", text: "Rezept" },
  { slug: "ru_ckfahrkarte", text: "Rückfahrkarte" },
  { slug: "schmerz", text: "Schmerz" },
  { slug: "schminken", text: "schminken" },
  { slug: "schneit", text: "schneit" },
  { slug: "service", text: "Service" },
  { slug: "sich", text: "sich" },
  { slug: "sie", text: "Sie" },
  { slug: "so", text: "so" },
  { slug: "spa_t", text: "spät" },
  { slug: "spa_ter", text: "später" },
  { slug: "stimme", text: "stimme" },
  { slug: "stra\u00dfe", text: "Straße" },
  { slug: "tag", text: "Tag" },
  { slug: "temperatur", text: "Temperatur" },
  { slug: "tut", text: "tut" },
  { slug: "u_brig", text: "übrig" },
  { slug: "uhr", text: "Uhr" },
  { slug: "um", text: "um" },
  { slug: "umstieg", text: "Umstieg" },
  { slug: "unternehmen", text: "Unternehmen" },
  { slug: "vegetarier", text: "Vegetarier" },
  { slug: "vergnu_gen", text: "Vergnügen" },
  { slug: "verlassen", text: "verlassen" },
  { slug: "verspa_tung", text: "Verspätung" },
  { slug: "vertrag", text: "Vertrag" },
  { slug: "vielen", text: "vielen" },
  { slug: "viertel", text: "Viertel" },
  { slug: "von", text: "von" },
  { slug: "vor", text: "vor" },
  { slug: "wahl", text: "Wahl" },
  { slug: "war", text: "war" },
  { slug: "was", text: "was" },
  { slug: "wei\u00df", text: "weiß" },
  { slug: "wiedersehen", text: "Wiedersehen" },
  { slug: "windig", text: "windig" },
  { slug: "wo", text: "wo" },
  { slug: "woche", text: "Woche" },
  { slug: "wochenende", text: "Wochenende" },
  { slug: "wohne", text: "wohne" },
  { slug: "wu_nschen", text: "wünschen" },
  { slug: "yoga", text: "Yoga" },
  { slug: "za_hne", text: "Zähne" },
  { slug: "zu", text: "zu" },
  { slug: "zur", text: "zur" },
];

async function generateAudio(text, outPath) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  if (!API_KEY) {
    console.error("❌  Set ELEVENLABS_API_KEY first:\n    export ELEVENLABS_API_KEY=sk_...");
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const toGenerate = MISSING.filter(({ slug }) => !fs.existsSync(path.join(OUT_DIR, `${slug}.mp3`)));
  const skip       = MISSING.length - toGenerate.length;

  console.log(`🎙️  ${toGenerate.length} to generate  (${skip} already exist)\n`);

  let done = 0, failed = 0;
  for (const { slug, text } of toGenerate) {
    const outPath = path.join(OUT_DIR, `${slug}.mp3`);
    process.stdout.write(`  [${done + failed + 1}/${toGenerate.length}] "${text}" → ${slug}.mp3 ... `);
    try {
      await generateAudio(text, outPath);
      console.log("✅");
      done++;
    } catch (e) {
      console.log(`❌ FAILED: ${e.message}`);
      failed++;
    }
    // 600ms delay to stay within rate limit
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n✅ Done! Generated ${done}, failed ${failed}`);
  if (done > 0) {
    console.log("\nNow push the audio files:\n");
    console.log("  git add public/audio/de");
    console.log('  git commit -m "Add 144 missing German audio files"');
    console.log("  git push");
  }
}

main();
