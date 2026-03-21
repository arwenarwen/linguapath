/**
 * LinguaPath — Build JSON exam banks for ALL supported languages
 *
 * Run from the project root:
 *   node scripts/build_exam_banks_all.js
 *
 * Output: public/data/exams/<lang>/<LEVEL>/<Language>_<LEVEL>_exam_bank.json
 * Creates 30-question banks per CEFR level (A1–C2) for each language.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Language registry
// Each entry: { code, name, importKey, questionField }
// questionField = the field on translate-en questions that holds the target-language text
const LANGUAGES = [
  { code:"de", name:"German",     importKey:"DE_EXAM_QUESTIONS", questionField:"german"     },
  { code:"fr", name:"French",     importKey:"FR_EXAM_QUESTIONS", questionField:"french"     },
  { code:"es", name:"Spanish",    importKey:"ES_EXAM_QUESTIONS", questionField:"spanish"    },
  { code:"it", name:"Italian",    importKey:"IT_EXAM_QUESTIONS", questionField:"italian"    },
  { code:"pt", name:"Portuguese", importKey:"PT_EXAM_QUESTIONS", questionField:"portuguese" },
  { code:"ru", name:"Russian",    importKey:"RU_EXAM_QUESTIONS", questionField:"russian"    },
  { code:"zh", name:"Chinese",    importKey:"ZH_EXAM_QUESTIONS", questionField:"chinese"    },
  { code:"ja", name:"Japanese",   importKey:"JA_EXAM_QUESTIONS", questionField:"japanese"   },
  { code:"ko", name:"Korean",     importKey:"KO_EXAM_QUESTIONS", questionField:"korean"     },
  { code:"el", name:"Greek",      importKey:"EL_EXAM_QUESTIONS", questionField:"greek"      },
];

function buildQuestion(raw, idx, questionField) {
  let questionText = "";
  let options      = raw.options || [];
  // Support both string answers and numeric index answers
  let correct = (typeof raw.answer === "number")
    ? (options[raw.answer] ?? "")
    : (raw.answer || "");
  let exerciseType = raw.type;
  let audioTargets = {};

  switch (raw.type) {
    case "mcq":
      questionText = raw.prompt || "";
      break;

    case "translate":
      questionText = `Translate to target language: "${raw.english || ""}"`;
      break;

    case "translate-en":
      questionText = `What does "${raw[questionField] || raw.german || ""}" mean in English?`;
      audioTargets.listen = raw[questionField] || raw.german || "";
      break;

    case "listen":
      questionText = `Listen and choose what you heard.`;
      audioTargets.listen = raw.audio || "";
      break;

    case "fill":
      questionText = raw.sentence
        ? `Complete the sentence: ${raw.sentence}`
        : raw.prompt || "";
      break;

    case "truefalse":
      questionText = raw.prompt || "";
      options = ["True", "False"];
      correct = String(correct);
      break;

    case "speak":
      return null;

    default:
      questionText = raw.prompt || "";
  }

  if (!questionText || !options || options.length < 2 || !correct) return null;

  const correctIndex = options.findIndex(
    (o) => String(o).trim().toLowerCase() === String(correct).trim().toLowerCase()
  );

  const id = `Q${idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}`;

  return {
    id,
    question_number: idx + 1,
    question:        questionText,
    options,
    correct_answer:  correct,
    correct_index:   correctIndex >= 0 ? correctIndex : 0,
    exercise_type:   exerciseType,
    ...(audioTargets.listen ? { audio: audioTargets.listen } : {}),
  };
}

let grandTotal = 0;

for (const lang of LANGUAGES) {
  const srcPath = path.join(__dirname, `../src/data/${lang.code}ExamQuestions.js`);
  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠️  Missing source: ${srcPath} — skipping ${lang.name}`);
    continue;
  }

  // Dynamic import
  const mod = await import(srcPath);
  const allQuestions = mod[lang.importKey];
  if (!allQuestions) {
    console.warn(`⚠️  Export ${lang.importKey} not found in ${srcPath} — skipping`);
    continue;
  }

  let langTotal = 0;
  for (const level of LEVELS) {
    const raw = allQuestions[level] || [];
    const questions = [];
    for (const rawQ of raw) {
      const built = buildQuestion(rawQ, questions.length, lang.questionField);
      if (built) questions.push(built);
    }

    const bank = {
      language:        lang.name,
      code:            lang.code,
      level,
      format:          "multiple_choice",
      question_count:  questions.length,
      feedback_audio_targets: {
        correct:   ["Correct!", "Well done!", "That's right!"],
        incorrect: ["Incorrect.", "Not quite.", "Wrong answer."],
      },
      questions,
    };

    const outDir  = path.join(__dirname, `../public/data/exams/${lang.code}/${level}`);
    const outPath = path.join(outDir, `${lang.name}_${level}_exam_bank.json`);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(bank, null, 2), "utf8");

    console.log(`✅  ${lang.name} ${level}: ${questions.length} questions`);
    langTotal += questions.length;
  }
  grandTotal += langTotal;
  console.log(`   → ${lang.name} total: ${langTotal}\n`);
}

console.log(`\n🎉  Grand total: ${grandTotal} questions across all languages.`);
console.log("\nNow commit:\n");
console.log("  git add public/data/exams src/data scripts");
console.log('  git commit -m "Add CEFR exam banks for 10 languages (DE, FR, ES, IT, PT, RU, ZH, JA, KO, EL)"');
console.log("  git push");
