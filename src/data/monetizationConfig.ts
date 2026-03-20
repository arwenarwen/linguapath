export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const MONETIZATION_CONFIG = {
  plans: {
    free: {
      beginnerFullAccessLevel: 'A1' as CefrLevel,
      placedUserPreviewLessons: 3,
      aiDailyMessages: 5,
      showAds: true,
    },
    pro: {
      monthlyPriceUsd: 6.99,
      yearlyPriceUsd: 69.99,
      aiUnlimited: true,
      showAds: false,
    },
  },
  energy: {
    enabledForLevelsAboveA1: true,
    lessonCost: 20,
    dailyCap: 100,
    regenRateMinutesPerEnergy: 5,
    adRefillAmount: 20,
    maxAdRefillsPerDay: 5,
  },
} as const;

export function levelUsesEnergy(level: CefrLevel, isPro: boolean) {
  if (isPro) return false;
  if (!MONETIZATION_CONFIG.energy.enabledForLevelsAboveA1) return false;
  return level !== 'A1';
}

export function canStartLesson(params: {
  level: CefrLevel;
  currentEnergy: number;
  isPro: boolean;
}) {
  const { level, currentEnergy, isPro } = params;
  if (!levelUsesEnergy(level, isPro)) {
    return { allowed: true, reason: 'energy_not_required' as const };
  }
  if (currentEnergy >= MONETIZATION_CONFIG.energy.lessonCost) {
    return { allowed: true, reason: 'enough_energy' as const };
  }
  return { allowed: false, reason: 'not_enough_energy' as const };
}

export function consumeLessonEnergy(params: {
  level: CefrLevel;
  currentEnergy: number;
  isPro: boolean;
}) {
  const { level, currentEnergy, isPro } = params;
  if (!levelUsesEnergy(level, isPro)) return currentEnergy;
  return Math.max(0, currentEnergy - MONETIZATION_CONFIG.energy.lessonCost);
}

export function applyAdRefill(currentEnergy: number) {
  return Math.min(
    MONETIZATION_CONFIG.energy.dailyCap,
    currentEnergy + MONETIZATION_CONFIG.energy.adRefillAmount,
  );
}
