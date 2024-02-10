import { z } from "zod";
import { getExercisesByWorkoutId } from "./server";
import { commentSchema, setSchema } from "./validators";
import { getSetsByWorkoutId } from "./server";

export type SetInput = z.infer<typeof setSchema>;
export type CommentInput = z.infer<typeof commentSchema>;

export type WorkoutExercises = Awaited<
  ReturnType<typeof getExercisesByWorkoutId>
>;
export type WorkoutExercise = WorkoutExercises["inWorkout"][0];
export type WorkoutSet = Awaited<ReturnType<typeof getSetsByWorkoutId>>[0];
