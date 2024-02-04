import { createContext } from "react";
import { Workout } from "./types";

export const WorkoutContext = createContext<Workout>({
  id: 0,
  title: "",
  description: "",
  date: new Date().toDateString(),
  comment: null,
  finished: null,
  started: null,
});
