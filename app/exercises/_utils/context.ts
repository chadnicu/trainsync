import { createContext } from "react";
import { Exercise } from "./types";

export const ExerciseContext = createContext<Exercise>({
  id: 0,
  title: "",
  instructions: "",
  url: "",
});
