
// ─── UTILITY HOOKS ───────────────────────────────────────────────────────────
import { useState } from "react";
function useLocalStorage(key, init) {
  const [state, setState] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : init; } catch { return init; }
  });
  const set = v => setState(prev => {
    const next = typeof v === "function" ? v(prev) : v;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
    return next;
  });
  return [state, set];
}
export default useLocalStorage;