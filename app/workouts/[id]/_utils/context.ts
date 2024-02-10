import { createContext } from "react";
import { WorkoutExercise, WorkoutSet } from "./types";

export const WorkoutExerciseContext = createContext<
  WorkoutExercise & { sets: WorkoutSet[] }
>({
  id: 0,
  title: "Loading..",
  instructions: "exercise card..",
  url: "",
  todo: "",
  comment: "",
  exerciseId: 0,
  workout_id: 0,
  // sets: [{ reps: 69, weight: 69, id: 0, workoutExerciseId: 0 }],
  sets: [],
});
