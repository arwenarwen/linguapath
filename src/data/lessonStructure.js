
export const lessonFlow = [
  "core_learn",
  "reinforce",
  "build",
  "checkpoint_micro",
  "core_learn",
  "reinforce",
  "real_use",
  "checkpoint_micro",
  "core_learn",
  "reinforce",
  "build",
  "checkpoint_micro",
  "real_use",
  "checkpoint_major"
];

export const lessonTypeMeta = {
  core_learn: { label: "Learn", icon: "🌱" },
  reinforce: { label: "Review", icon: "🔁" },
  build: { label: "Build", icon: "🧱" },
  real_use: { label: "Use", icon: "🗣️" },
  checkpoint_micro: { label: "Quick Check", icon: "⚡" },
  checkpoint_major: { label: "Mastery", icon: "🏆" }
};

export function applyLessonStructure(modules) {
  return modules.map((m, i) => {
    const type = lessonFlow[i % lessonFlow.length];
    return {
      ...m,
      lessonType: type,
      lessonLabel: lessonTypeMeta[type].label,
      lessonIcon: lessonTypeMeta[type].icon
    };
  });
}
