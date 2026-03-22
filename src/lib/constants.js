// Re-export barrel — kept for backwards compatibility.
// New code should import directly from the split modules:
//   src/config/theme.js
//   src/config/languages.js
//   src/data/situations.js
//   src/data/aiScenarios.js
//   src/lib/progressHooks.js

export { GLOBAL_CSS } from '../config/theme';
export { LANGUAGES, VISUAL_QUERY_MAP, NUMBER_VALUE_MAP } from '../config/languages';
export { SITUATIONS, EXTRA_SITUATION_PHRASES, getSituationPhrases, formatTutorPhraseList } from '../data/situations';
export { AI_SCENARIOS } from '../data/aiScenarios';
export { useProgress, getLevelColor, getCompletedModuleIds, getCachedProgress } from './progressHooks';
