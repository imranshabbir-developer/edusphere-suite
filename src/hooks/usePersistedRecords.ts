import { useCallback, useEffect, useState } from "react";
import { loadRecords, saveRecords } from "@/utils/recordStorage";

type SeedInput<T> = T[] | (() => T[]);

function toSeedFn<T>(seed: SeedInput<T>): () => T[] {
  return typeof seed === "function" ? seed : () => seed;
}

export function usePersistedRecords<T extends { id: string }>(storageKey: string, seed: SeedInput<T>) {
  const [data, setData] = useState<T[]>(() => loadRecords(storageKey, toSeedFn(seed)));

  // Reload when navigating between generic module routes (same component, new storage key).
  useEffect(() => {
    setData(loadRecords(storageKey, toSeedFn(seed)));
  }, [storageKey, seed]);

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
