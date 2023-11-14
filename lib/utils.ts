import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Set as SetType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// to filter and sort duplicates in navbar and /logs
export function filterLogs(
  logs: (SetType & { title: string; exerciseId: number })[]
) {
  const uniqueLogs: (SetType & { title: string; exerciseId: number })[] = [];
  const seenExerciseIds = new Set<number>();

  for (const log of logs) {
    const key = log.exerciseId;
    if (!seenExerciseIds.has(key)) {
      seenExerciseIds.add(key);
      uniqueLogs.push(log);
    }
  }

  return uniqueLogs.sort((a, b) => a.title.localeCompare(b.title));
}
