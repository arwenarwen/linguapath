const PURCHASED_KEY = (userId) => `lp_statue_purchases_${userId || "anon"}`;
const SPENT_KEY = (userId) => `lp_statue_spent_xp_${userId || "anon"}`;
const CLAIMED_KEY = (userId) => `lp_statue_claimed_sets_${userId || "anon"}`;

export function getStatueCost(index) {
  const n = Math.max(0, Number(index) || 0);
  return Math.round(120 + Math.pow(n, 1.35) * 60);
}

export function getPurchasedStatues(userId) {
  try {
    return JSON.parse(localStorage.getItem(PURCHASED_KEY(userId)) || "[]");
  } catch {
    return [];
  }
}

export function savePurchasedStatues(userId, purchases) {
  try {
    localStorage.setItem(PURCHASED_KEY(userId), JSON.stringify(purchases || []));
  } catch {}
}

export function getClaimedStatueSets(userId) {
  try {
    return JSON.parse(localStorage.getItem(CLAIMED_KEY(userId)) || "[]");
  } catch {
    return [];
  }
}

export function saveClaimedStatueSets(userId, sets) {
  try {
    localStorage.setItem(CLAIMED_KEY(userId), JSON.stringify(sets || []));
  } catch {}
}

export function markStatueSetClaimed(userId, setKey) {
  const current = new Set(getClaimedStatueSets(userId));
  current.add(setKey);
  saveClaimedStatueSets(userId, Array.from(current));
}

export function isStatueSetClaimed(userId, setKey) {
  return getClaimedStatueSets(userId).includes(setKey);
}

export function getGlobalEarnedXp(userId) {
  try {
    const uid = userId || "anon";
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (!key.startsWith("lp_progress_")) continue;
      if (!key.includes(`_${uid}_`) && !key.startsWith(`lp_progress_${uid}_`)) continue;
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        total += Number(data?.xp || 0);
      } catch {}
    }
    return total;
  } catch {
    return 0;
  }
}

export function getSpentStatueXp(userId) {
  return Number(localStorage.getItem(SPENT_KEY(userId)) || 0);
}

export function setSpentStatueXp(userId, value) {
  try {
    localStorage.setItem(SPENT_KEY(userId), String(Math.max(0, Number(value) || 0)));
  } catch {}
}

export function getAvailableStatueXp(userId) {
  return Math.max(0, getGlobalEarnedXp(userId) - getSpentStatueXp(userId));
}

export function getOrCreateStatuePurchase(userId, statueId) {
  const purchases = getPurchasedStatues(userId);
  let found = purchases.find((p) => p.statueId === statueId);
  if (!found) {
    found = { statueId, purchased: false, costAtPurchase: null, claimedSetKey: null, purchasedAt: null };
    purchases.push(found);
    savePurchasedStatues(userId, purchases);
  }
  return found;
}

export function purchaseStatue(userId, statueId) {
  const purchases = getPurchasedStatues(userId);
  const existingCount = purchases.filter((p) => p.purchased).length;
  const cost = getStatueCost(existingCount);
  const available = getAvailableStatueXp(userId);

  if (available < cost) {
    return { ok: false, reason: "not_enough_xp", cost, available };
  }

  let purchase = purchases.find((p) => p.statueId === statueId);
  if (!purchase) {
    purchase = { statueId, purchased: false, costAtPurchase: null, claimedSetKey: null, purchasedAt: null };
    purchases.push(purchase);
  }

  if (!purchase.purchased) {
    purchase.purchased = true;
    purchase.costAtPurchase = cost;
    purchase.purchasedAt = new Date().toISOString();
    setSpentStatueXp(userId, getSpentStatueXp(userId) + cost);
    savePurchasedStatues(userId, purchases);
  }

  return { ok: true, cost, availableAfter: getAvailableStatueXp(userId), purchase };
}

export function assignStatueSet(userId, statueId, setKey) {
  const purchases = getPurchasedStatues(userId);
  const purchase = purchases.find((p) => p.statueId === statueId);
  if (!purchase || !purchase.purchased) return { ok: false };
  purchase.claimedSetKey = setKey;
  savePurchasedStatues(userId, purchases);
  markStatueSetClaimed(userId, setKey);
  return { ok: true, purchase };
}
