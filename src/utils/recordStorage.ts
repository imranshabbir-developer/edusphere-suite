const PREFIX = "edusphere:records:";

function recordIdPrefix(id: string): string {
  const dash = id.indexOf("-");
  return dash > 0 ? id.slice(0, dash) : id;
}

/** Drop cached rows when their id prefix no longer matches the current module seed. */
function storageMatchesSeed<T extends { id: string }>(stored: T[], seed: () => T[]): boolean {
  if (stored.length === 0) return false;
  const seedRows = seed();
  if (seedRows.length === 0) return true;
  return recordIdPrefix(stored[0].id) === recordIdPrefix(seedRows[0].id);
}

export function loadRecords<T extends { id: string }>(key: string, seed: () => T[]): T[] {
  if (typeof sessionStorage === "undefined") return seed();
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (raw) {
      const parsed = JSON.parse(raw) as T[];
      if (storageMatchesSeed(parsed, seed)) return parsed;
    }
  } catch {
    /* ignore corrupt storage */
  }
  const data = seed();
  saveRecords(key, data);
  return data;
}

export function saveRecords<T>(key: string, data: T[]): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

/** Split splat like `academics/courses/COU-1001` into module path + record id */
export function parseSplatWithId(splat: string): { modulePath: string; recordId: string | null } {
  const parts = splat.split("/").filter(Boolean);
  if (parts.length === 0) return { modulePath: "", recordId: null };
  const last = parts[parts.length - 1];
  if (/^[A-Z]{2,4}-\d+/.test(last)) {
    return { modulePath: parts.slice(0, -1).join("/"), recordId: last };
  }
  return { modulePath: splat, recordId: null };
}

export function recordDetailPath(listPath: string, id: string) {
  return `${listPath.replace(/\/$/, "")}/${id}`;
}
