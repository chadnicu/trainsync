import { createContext } from "react";
import { WorkoutExercise } from "./types";

export const WorkoutExerciseContext = createContext<WorkoutExercise>({
  id: 0,
  title: "",
  instructions: "",
  url: "",
  todo: "",
  comment: "",
  exerciseId: 0,
  workout_id: 0,
});
