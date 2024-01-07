import { getExercises } from "@/server/actions";
import { createContext } from "react";

export const ExerciseContext = createContext<
  Awaited<ReturnType<typeof getExercises>>[0]
>({
  id: 0,
  title: "",
  instructions: "",
  url: "",
});
