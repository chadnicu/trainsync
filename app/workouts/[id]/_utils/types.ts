import { getExercisesByWorkoutId } from "./server";

export type WorkoutExercises = Awaited<
  ReturnType<typeof getExercisesByWorkoutId>
>;
export type WorkoutExercise = WorkoutExercises["inWorkout"][0];
