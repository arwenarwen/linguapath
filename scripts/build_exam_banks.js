/**
 * LinguaPath — Convert deExamQuestions.js → JSON exam bank files
 *
 * Run from the project root:
 *   node scripts/build_exam_banks.js
 *
 * Output: public/data/exams/de/<LEVEL>/German_<LEVEL>_exam_bank.json
 * Creates 30-question banks per CEFR level (A1–C2).
 *
 * Question types supported:
 *   mcq, translate, translate-en, fill, listen, truefalse
 *   (speak questions skipped — no MCQ options)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DE_EXAM_QUESTIONS } from "../src/data/deExamQuestions.js";

// All 30 questions per level now come directly from deExamQuestions.js.
// SPEAK_AS_MCQ is no longer used — kept as empty stubs for compatibility.
const SPEAK_AS_MCQ = { A1:[], A2:[], B1:[], B2:[], C1:[], C2:[] };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function buildQuestion(raw, idx) {
  let questionText = "";
  let options      = raw.options || [];
  let correct      = raw.answer  || "";
  let exerciseType = raw.type;
  let audioTargets = {};

  switch (raw.type) {
    case "mcq":
      questionText = raw.prompt || "";
      break;

    case "translate":
      questionText = `Translate to German: "${raw.english || ""}"`;
      break;

    case "translate-en":
      questionText = `What does "${raw.german || ""}" mean in English?`;
      // The german word/phrase should be played as audio
      audioTargets.listen = raw.german || "";
      break;

    case "listen":
      questionText = `Listen and choose what you heard.`;
      // The audio field is the German phrase to play
      audioTargets.listen = raw.audio || "";
      break;

    case "fill":
      questionText = raw.sentence
        ? `Complete the sentence: ${raw.sentence}`
        : raw.prompt || "";
      break;

    case "truefalse":
      questionText = raw.prompt || "";
      // ensure options are exactly True/False
      options = ["True", "False"];
      correct = String(correct);
      break;

    case "speak":
      // Converted separately via SPEAK_AS_MCQ — skip here
      return null;

    default:
      questionText = raw.prompt || "";
  }

  if (!questionText || !options || options.length < 2 || !correct) return null;

  const correctIndex = options.findIndex(
    (o) => String(o).trim().toLowerCase() === String(correct).trim().toLowerCase()
  );

  const id = `${idx < 9 ? "0" + (idx + 1) : idx + 1}`;

  return {
    id:              `Q${id}`,
    question_number: idx + 1,
    question:        questionText,
    options,
    correct_answer:  correct,
    correct_index:   correctIndex >= 0 ? correctIndex : 0,
    exercise_type:   exerciseType,
    ...(audioTargets.listen ? { audio: audioTargets.listen } : {}),
  };
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

let totalWritten = 0;

for (const level of LEVELS) {
  const raw = DE_EXAM_QUESTIONS[level] || [];

  const questions = [];
  for (const rawQ of raw) {
    const built = buildQuestion(rawQ, questions.length);
    if (built) questions.push(built);
  }

  // Append speak-converted MCQs (translate-style)
  for (const sp of SPEAK_AS_MCQ[level] || []) {
    const correctIndex = sp.options.findIndex(
      (o) => String(o).trim().toLowerCase() === String(sp.answer).trim().toLowerCase()
    );
    questions.push({
      id:              `Q${questions.length + 1 < 10 ? "0" + (questions.length + 1) : questions.length + 1}`,
      question_number: questions.length + 1,
      question:        `Translate to German: "${sp.english}"`,
      options:         sp.options,
      correct_answer:  sp.answer,
      correct_index:   correctIndex >= 0 ? correctIndex : 0,
      exercise_type:   "translate",
    });
  }

  const bank = {
    language:       "German",
    code:           "de",
    level,
    format:         "multiple_choice",
    question_count: questions.length,
    feedback_audio_targets: {
      correct:   ["Richtig.", "Korrekt.", "Das ist richtig."],
      incorrect: ["Falsch.", "Nicht ganz richtig.", "Leider falsch."],
    },
    questions,
  };

  const outDir  = path.join(__dirname, `../public/data/exams/de/${level}`);
  const outPath = path.join(outDir, `German_${level}_exam_bank.json`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(bank, null, 2), "utf8");

  console.log(`✅  ${level}: ${questions.length} questions → ${outPath}`);
  totalWritten += questions.length;
}

console.log(`\nTotal questions written: ${totalWritten}`);
console.log("\nDone! Now commit:\n");
console.log("  git add public/data/exams/de");
console.log('  git commit -m "Upgrade German exam banks to 25 questions per CEFR level"');
console.log("  git push");
