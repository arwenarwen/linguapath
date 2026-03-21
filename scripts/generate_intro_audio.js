/**
 * LinguaPath — Pre-generate AI Tutor situation intro audio files
 * Run from the project root:
 *
 *   export ELEVENLABS_API_KEY=your_key_here
 *   node scripts/generate_intro_audio.js
 *
 * Output: public/audio/intros/<situation_id>.mp3
 * Voice:  Rachel (English, friendly female) — 21m00Tcm4TlvDq8ikWAM
 *
 * Generates 20 intro sentences — one per practice situation.
 * These play automatically when a learner starts a scenario session.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY  = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel — warm English female
const OUT_DIR  = path.join(__dirname, "../public/audio/intros");

// 20 situation intro sentences — one per practice stop.
// Files are stored by situation ID (not slugified text).
const INTROS = [
  {
    id: "restaurant",
    text: "Hi! I'm Fox, your practice guide. You're at a German restaurant — I'll be your waiter. Go ahead and get my attention when you're ready to order!",
  },
  {
    id: "cafe",
    text: "Hi! I'm Fox, your practice guide. Welcome to a cozy German café — I'll be your barista today. Step up to the counter whenever you're ready!",
  },
  {
    id: "hotel",
    text: "Hi! I'm Fox, your practice guide. You've just arrived at your hotel — I'll be the receptionist at the front desk. Come on over and let's get you checked in!",
  },
  {
    id: "airport",
    text: "Hi! I'm Fox, your practice guide. You're at the airport and heading to your gate — I'll be the airline staff at check-in. Let's get started!",
  },
  {
    id: "travel",
    text: "Hi! I'm Fox, your practice guide. You're exploring the city as a tourist — I'll be your local tour guide. Ask me anything about the sights and I'll point you in the right direction!",
  },
  {
    id: "directions",
    text: "Hi! I'm Fox, your practice guide. You're lost somewhere in the city and need to find your way — I'll be a friendly local. Stop me on the street and ask for directions!",
  },
  {
    id: "taxi",
    text: "Hi! I'm Fox, your practice guide. You've just hopped into a taxi — I'll be your driver. Tell me where you're heading and we'll get going!",
  },
  {
    id: "supermarket",
    text: "Hi! I'm Fox, your practice guide. You're shopping at a German supermarket — I'll be the store employee. Ask me where to find things or anything else you need!",
  },
  {
    id: "making-friends",
    text: "Hi! I'm Fox, your practice guide. You're at a language exchange meetup and meeting someone new — I'll be that person. Introduce yourself and let's get talking!",
  },
  {
    id: "weather",
    text: "Hi! I'm Fox, your practice guide. You've bumped into a friendly neighbor outside — I'll play that role. Let's have a relaxed chat about the weather and everyday life!",
  },
  {
    id: "first-date",
    text: "Hi! I'm Fox, your practice guide. You're on a first date at a nice spot — I'll be your date for the evening. Keep it natural, have fun, and enjoy the conversation!",
  },
  {
    id: "shopping",
    text: "Hi! I'm Fox, your practice guide. You're browsing a clothing shop — I'll be the shop assistant ready to help. Tell me what you're looking for and we'll find it together!",
  },
  {
    id: "bank",
    text: "Hi! I'm Fox, your practice guide. You need to sort something out at the bank — I'll be the teller at the counter. Step up and let me know how I can help you today!",
  },
  {
    id: "phone-call",
    text: "Hi! I'm Fox, your practice guide. You're about to make a phone call in German — I'll be the receptionist on the other end. Go ahead and dial when you're ready!",
  },
  {
    id: "office",
    text: "Hi! I'm Fox, your practice guide. You're in a team meeting at the office — I'll be your colleague. Let's talk about the project and catch up on what's happening!",
  },
  {
    id: "university",
    text: "Hi! I'm Fox, your practice guide. You've stopped by your professor's office — I'll play that role. Come on in and let's talk about your studies!",
  },
  {
    id: "job-interview",
    text: "Hi! I'm Fox, your practice guide. You're sitting down for a job interview — I'll be the HR manager. Take a breath, you've got this. Let's begin!",
  },
  {
    id: "doctor",
    text: "Hi! I'm Fox, your practice guide. You're visiting the doctor — I'll play the doctor. Have a seat and tell me what's brought you in today.",
  },
  {
    id: "pharmacy",
    text: "Hi! I'm Fox, your practice guide. You're at a German pharmacy — I'll be the pharmacist behind the counter. Come over and tell me how I can help!",
  },
  {
    id: "emergency",
    text: "Hi! I'm Fox, your practice guide. This is an emergency practice scenario — I'll be the operator. Stay calm, speak clearly, and tell me what's happening!",
  },
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
        voice_settings: { stability: 0.55, similarity_boost: 0.75 },
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

  const toGenerate = INTROS.filter(({ id }) => !fs.existsSync(path.join(OUT_DIR, `${id}.mp3`)));
  const skip       = INTROS.length - toGenerate.length;

  console.log(`🎙️  ${toGenerate.length} intros to generate  (${skip} already exist)\n`);

  let done = 0, failed = 0;
  for (const { id, text } of toGenerate) {
    const outPath = path.join(OUT_DIR, `${id}.mp3`);
    process.stdout.write(`  [${done + failed + 1}/${toGenerate.length}] ${id} ... `);
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
    console.log("  git add public/audio/intros");
    console.log('  git commit -m "Add pre-recorded AI tutor situation intro audio"');
    console.log("  git push");
  }
}

main();
