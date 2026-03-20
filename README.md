
LinguaPath Static Audio Kit

Goal:
Pre-generate audio once so you don't burn TTS credits every time users play a word.

Structure you should copy into your project:

scripts/generate_static_audio.mjs
src/lib/staticAudio.js
public/audio/manifest.json

Steps:

1. Copy the files into your project folders.
2. Rename manifest.sample.json → manifest.json
3. Run:

node scripts/generate_static_audio.mjs

That generates MP3 files inside:

public/audio/<language>/<slug>.mp3

Vercel automatically serves anything inside /public.
