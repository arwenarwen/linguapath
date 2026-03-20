
import { getEffectiveXP, hasFullAccess } from "@/lib/statueAccess";

const effectiveXP = getEffectiveXP(user?.id, totalXP);

const unlocked = hasFullAccess(user?.id)
  ? true
  : effectiveXP >= baseCost;
