import { z } from "zod";
import { exerciseSchema } from "./validators";
import { getExercises } from "./server";

export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type Exercise = Awaited<ReturnType<typeof getExercises>>[0];
