
export function getUserRole(userId) {
  return localStorage.getItem("lp_role_" + (userId || "anon")) || "free";
}

export function hasFullAccess(userId) {
  const role = getUserRole(userId);
  return ["admin","tester","influencer","pro"].includes(role);
}

export function getEffectiveXP(userId, xp) {
  const role = getUserRole(userId);
  if (["admin","tester","influencer"].includes(role)) {
    return 999999; // 🔥 always enough to unlock everything
  }
  return xp;
}
