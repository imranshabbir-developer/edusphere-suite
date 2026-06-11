import { useCallback, useState } from "react";
import { loadRecords, saveRecords } from "@/utils/recordStorage";

export function usePersistedRecords<T extends { id: string }>(storageKey: string, seed: T[]) {
  const [data, setData] = useState<T[]>(() => loadRecords(storageKey, () => seed));

  const updateData = useCallback(
    (next: T[] | ((prev: T[]) => T[])) => {
      setData((prev) => {
        const updated = typeof next === "function" ? next(prev) : next;
        saveRecords(storageKey, updated);
        return updated;
      });
    },
    [storageKey],
  );

  return [data, updateData] as const;
}
