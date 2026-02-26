// ---------- storage ----------
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// ---------- date ----------
export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toISODate(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

export function startOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function dayOfWeekMon0(date) {
  const js = new Date(date).getDay(); // Sun=0
  return (js + 6) % 7; // Mon=0
}

export function monthLabel(date) {
  return new Date(date).toLocaleString(undefined, { month: "long", year: "numeric" });
}

export function lastNDays(n, fromDate = new Date()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(toISODate(addDays(fromDate, -i)));
  }
  return out;
}