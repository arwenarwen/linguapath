# LinguaPath

A React language-learning app with AI-powered conversation, CEFR-levelled exams, and pre-recorded audio for 10 languages.

## Tech stack

- **Frontend:** React 19, Vite 8, plain CSS (no Tailwind)
- **AI:** OpenAI GPT-4o (tutor chat)
- **TTS:** ElevenLabs `eleven_multilingual_v2` (vocab + exam audio pre-generation, live TTS fallback)
- **Auth / DB:** Supabase
- **Hosting:** Vercel (SPA, all routes → index.html)

## Supported languages

German · French · Spanish · Italian · Portuguese · Russian · Mandarin · Japanese · Korean · Greek

CEFR levels A1 → C2 for all languages.

---

## Project structure

```
src/
  components/
    AIChat.jsx         — main app shell (chat, exam, vocab, situations)
    SituationDetail.jsx — situation roleplay UI
    LessonView.jsx     — lesson/vocab card UI
    TrailMap.jsx       — progress trail
    ...
  data/
    deExamQuestions.js — German exam question bank source
    frExamQuestions.js — French
    esExamQuestions.js — Spanish
    itExamQuestions.js — Italian
    ptExamQuestions.js — Portuguese
    ruExamQuestions.js — Russian
    zhExamQuestions.js — Mandarin
    jaExamQuestions.js — Japanese
    koExamQuestions.js — Korean
    elExamQuestions.js — Greek
  lib/                 — shared utilities
  pages/              — route-level pages

public/
  audio/
    <lang>/           — vocab MP3s (German: ~3,959 files; others: feedback clips)
    exam/
      <lang>/         — exam question + wrong-answer feedback MP3s (~288/lang)
        numbers/      — "Question 1." … "Question 30." shared clips
    intros/           — 20 situation intro clips

scripts/
  build_exam_banks_all.js      — build JSON exam banks from source question files
  generate_exam_audio_all.js   — pre-record exam audio for all 10 languages
  generate_exam_audio_de.js    — German-only exam audio
  generate_feedback_audio.js   — correct.mp3 / incorrect.mp3 per language

api/
  tts.js             — Vercel serverless function: live ElevenLabs TTS proxy
```

---

## Audio coverage by section

| Section | Static audio | Live TTS |
|---|---|---|
| **Exam questions** | ✅ 100% — all 10 languages pre-recorded | Fallback only |
| **Exam feedback** ("correct" / "incorrect") | ✅ 100% — all 10 languages | Fallback only |
| **Exam wrong-answer reveal** | ✅ 100% — all 10 languages | Fallback only |
| **Vocab / lesson words** (German) | ✅ ~100% — ~3,959 MP3s | Fallback only |
| **Vocab / lesson words** (other 9 langs) | ❌ 0% pre-recorded | 100% live TTS |
| **AI tutor chat replies** | ❌ dynamic content | 100% live TTS |
| **Situation roleplays** | ❌ dynamic content | 100% live TTS |
| **Situation intros** | ✅ 20 static clips | — |

> **Priority for cost reduction:** pre-record vocab words for the 9 non-German languages.
> German vocab took one batch run; the same pattern applies to all others.

---

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd linguapath-main
npm install
```

### 2. Set environment variables

Copy `env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_OPENAI_API_KEY=...   # used server-side via api/tts — do NOT expose in client
ELEVENLABS_API_KEY=...    # only needed for local audio pre-generation scripts
```

### 3. Run locally

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

---

## Pre-generating audio

All scripts run from the project root. Set `ELEVENLABS_API_KEY` first.

### Rebuild exam JSON banks (run after editing question source files)

```bash
node scripts/build_exam_banks_all.js
```

Output: `public/data/exams/<lang>/<LEVEL>/<Language>_<LEVEL>_exam_bank.json`

### Pre-record exam audio for all 10 languages (~3,100 files, ~32 min)

```bash
export ELEVENLABS_API_KEY=sk_...
node scripts/generate_exam_audio_all.js
```

Safe to re-run — skips files that already exist.

### Pre-record feedback clips (correct / incorrect, 9 non-German languages)

```bash
export ELEVENLABS_API_KEY=sk_...
node scripts/generate_feedback_audio.js
```

### Pre-record German vocab audio

```bash
export ELEVENLABS_API_KEY=sk_...
node scripts/generate_exam_audio_de.js
```

---

## Deployment

Hosted on Vercel. Every push to `main` triggers a production deploy.

- `vercel.json` routes all paths to `index.html` (SPA)
- `api/tts.js` is the live TTS proxy (serverless function)
- Large `public/audio/` files are served directly from Vercel's CDN

---

## Linting

```bash
npm run lint
```

ESLint v9 flat config (`eslint.config.js`) with react-hooks and react-refresh plugins.
