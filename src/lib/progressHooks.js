// React progress hook and curriculum helpers.
// Pairs with progressUtils.js (pure localStorage fns).

import { useState, useEffect } from 'react';
import { supabase } from './appState';

export function useProgress(userId, language = "es") {
  const lsKey = `lp_progress_${userId}_${language}`;

  const readLocalProgress = useCallback(() => {
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          completed: Array.isArray(parsed?.completed) ? parsed.completed : [],
          xp: parsed?.xp || 0,
        };
      }
    } catch (e) {}
    return { completed: [], xp: 0 };
  }, [lsKey]);

  const [data, setData] = useState(() => readLocalProgress());

  useEffect(() => {
    setData(readLocalProgress());
  }, [readLocalProgress]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .eq("language", language)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (cancelled) return;
        if (error) {
          console.warn("[useProgress] fetch warning:", error);
          return;
        }

        const local = readLocalProgress();
        const server = row
          ? {
              completed: Array.isArray(row.completed) ? row.completed : [],
              xp: row.xp || 0,
            }
          : { completed: [], xp: 0 };

        const merged = {
          completed: Array.from(new Set([...(local.completed || []), ...(server.completed || [])])),
          xp: Math.max(local.xp || 0, server.xp || 0),
        };

        setData(merged);
        try { localStorage.setItem(lsKey, JSON.stringify(merged)); } catch (e) {}

        const serverCompleted = JSON.stringify(server.completed || []);
        const mergedCompleted = JSON.stringify(merged.completed || []);
        if (!row || server.xp !== merged.xp || serverCompleted !== mergedCompleted) {
          supabase.from("progress").upsert({
            user_id: userId,
            language,
            completed: merged.completed,
            xp: merged.xp,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id,language" }).then(() => {}).catch(() => {});
        }
      })
      .catch((err) => {
        if (!cancelled) console.warn("[useProgress] fetch failed:", err);
      });

    return () => { cancelled = true; };
  }, [userId, language, lsKey, readLocalProgress]);

  const complete = useCallback(async (id, xp) => {
    setData(prev => {
      if (prev.completed.includes(id)) return prev;
      const next = { completed: [...prev.completed, id], xp: prev.xp + xp };
      try { localStorage.setItem(lsKey, JSON.stringify(next)); } catch (e) {}
      if (userId) {
        supabase.from("progress").upsert({
          user_id: userId,
          language,
          completed: next.completed,
          xp: next.xp,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,language" }).then(() => {}).catch(() => {});
      }
      return next;
    });
  }, [userId, language, lsKey]);

  const isDone = (id) => data.completed.includes(id);
  return { data, complete, isDone };
}


export function getLevelColor(level) {
  return level === "A1" ? "#22c55e" : level === "A2" ? "#38bdf8" : "#a78bfa";
}


export function getCompletedModuleIds(curriculum = {}, completed = []) {
  const validIds = new Set(getAllModules(curriculum).map((m) => m.id));
  const unique = [];
  const seen = new Set();
  (completed || []).forEach((id) => {
    if (validIds.has(id) && !seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  });
  return unique;
}


export function getCachedProgress(userId, language) {
  if (!userId || !language || typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(`lp_progress_${userId}_${language}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      language,
      xp: parsed?.xp || 0,
      completed: Array.isArray(parsed?.completed) ? parsed.completed : [],
    };
  } catch (e) {
    return null;
  }
}


