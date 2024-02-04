import { z } from "zod";
import { getExercisesByWorkoutId } from "./server";
import { setSchema } from "./validators";
import { getSetsById } from "./server";

export type SetInput = z.infer<typeof setSchema>;

export type WorkoutExercises = Awaited<
  ReturnType<typeof getExercisesByWorkoutId>
>;
export type WorkoutExercise = WorkoutExercises["inWorkout"][0];
export type Set = Awaited<ReturnType<typeof getSetsById>>[0];
