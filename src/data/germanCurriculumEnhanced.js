
import rawGerman from "../../languages/german.json";
import { progressionSystem } from "./progressionSystem";

export const LESSON_TYPES = ["core_learn", "reinforce", "build", "real_use", "checkpoint"];

export const LESSON_TYPE_META = {
  core_learn: {
    label: "Core Learn",
    shortLabel: "Learn",
    description: "Introduce new vocabulary and high-frequency patterns.",
    icon: "🌱",
  },
  reinforce: {
    label: "Reinforce",
    shortLabel: "Review",
    description: "Review recent and older material with SRS-style repetition.",
    icon: "🔁",
  },
  build: {
    label: "Build",
    shortLabel: "Build",
    description: "Combine words into sentence patterns and controlled production.",
    icon: "🧱",
  },
  real_use: {
    label: "Real Use",
    shortLabel: "Use",
    description: "Short dialogues, scenarios, and practical communication.",
    icon: "🗣️",
  },
  checkpoint: {
    label: "Checkpoint",
    shortLabel: "Check",
    description: "Mixed assessment that gates progress to the next unit.",
    icon: "🏁",
  },
};

const LEVEL_META = {
  A1: {
    title: "Foundation",
    description: "Survival language, core sentence patterns, and high-frequency communication.",
    targetVocab: 1000,
    totalUnits: 20,
  },
  A2: {
    title: "Expansion",
    description: "Daily-life independence, short storytelling, and practical communication.",
    targetVocab: 1200,
    totalUnits: 22,
  },
  B1: {
    title: "Independence",
    description: "Independent discussion, storytelling, opinions, and practical fluency.",
    targetVocab: 1500,
    totalUnits: 24,
  },
  B2: {
    title: "Upper Intermediate Fluency",
    description: "Nuanced argumentation, workplace fluency, advanced listening, and structured thinking.",
    targetVocab: 1800,
    totalUnits: 26,
  },
  C1: {
    title: "Advanced Control",
    description: "Nuance, rhetorical control, academic and professional flexibility.",
    targetVocab: 2000,
    totalUnits: 24,
  },
  C2: {
    title: "Mastery",
    description: "Native-level flexibility, rhetoric, interpretation, and stylistic precision.",
    targetVocab: 2200,
    totalUnits: 22,
  },
};

function inferUnitNumber(mod) {
  const m = String(mod?.unit || "").match(/(\d+)/);
  if (m) return Number(m[1]);
  const idm = String(mod?.id || "").match(/-u(\d+)-/i);
  return idm ? Number(idm[1]) : 1;
}

function inferLessonNumber(mod) {
  const m = String(mod?.lesson || "").match(/(\d+)/);
  if (m) return Number(m[1]);
  const idm = String(mod?.id || "").match(/-l(\d+)$/i);
  return idm ? Number(idm[1]) : 1;
}

function decorateModule(levelCode, mod) {
  const lessonNumber = inferLessonNumber(mod);
  const lessonType = LESSON_TYPES[(lessonNumber - 1) % LESSON_TYPES.length];
  const meta = LESSON_TYPE_META[lessonType];
  const xp = progressionSystem?.xp?.byLessonType?.[lessonType] ?? mod.xp ?? 30;

  const targetExercises =
    progressionSystem?.lessonEngine?.recommendedExercises?.[lessonType] ||
    progressionSystem?.reviewEngine?.recommendedExercises?.[lessonType] ||
    12;

  return {
    ...mod,
    lessonType,
    lessonTypeLabel: meta.label,
    lessonTypeShortLabel: meta.shortLabel,
    lessonTypeDescription: meta.description,
    lessonTypeIcon: meta.icon,
    recommendedExercises: targetExercises,
    xp,
    enhancedTitle: `${meta.icon} ${mod.title}`,
    levelCode,
    unitNumber: inferUnitNumber(mod),
    lessonNumber,
  };
}

function decorateLevel(levelCode, baseLevel) {
  const modules = (baseLevel?.modules || []).map((mod) => decorateModule(levelCode, mod));
  const uniqueVocab = new Set(
    modules.flatMap((m) => (m.vocab || []).map((v) => String(v.de || "").trim()).filter(Boolean))
  ).size;

  return {
    ...baseLevel,
    ...LEVEL_META[levelCode],
    modules,
    totalLessons: modules.length,
    uniqueVocab,
  };
}

export const germanCurriculumEnhanced = {
  ...rawGerman,
  framework: "CEFR A1–C2 · Upgraded 5-Lesson Engine",
  lessonEngine: {
    lessonTypes: LESSON_TYPES,
    structure: [
      "core_learn",
      "reinforce",
      "build",
      "real_use",
      "checkpoint",
    ],
    repetitionRatio: {
      new: 0.6,
      recent: 0.25,
      older: 0.15,
    },
    exercisesPerLessonCap: 16,
  },
  A1: decorateLevel("A1", rawGerman.A1),
  A2: decorateLevel("A2", rawGerman.A2),
  B1: decorateLevel("B1", rawGerman.B1),
  B2: decorateLevel("B2", rawGerman.B2),
  C1: decorateLevel("C1", rawGerman.C1),
  C2: decorateLevel("C2", rawGerman.C2),
};

export default germanCurriculumEnhanced;
