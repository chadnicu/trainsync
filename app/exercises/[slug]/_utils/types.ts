import { getSetsByExerciseId } from "./server";

export type ExerciseSet = Awaited<ReturnType<typeof getSetsByExerciseId>>[0];
