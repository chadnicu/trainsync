import { z } from "zod";
import { addWorkoutSchema, editWorkoutSchema } from "./validators";
import { getWorkouts } from "./server";

export type AddWorkoutInput = z.infer<typeof addWorkoutSchema>;
export type EditWorkoutInput = z.infer<typeof editWorkoutSchema>;

export type Workout = Awaited<ReturnType<typeof getWorkouts>>[0];
