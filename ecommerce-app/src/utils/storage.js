/**
 * Tiny, safe localStorage helpers.
 * Guards against private-mode / quota / JSON errors so the app never crashes
 * because of storage.
 */
export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore write errors (quota, private mode) */
  }
}
