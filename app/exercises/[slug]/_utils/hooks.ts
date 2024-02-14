import { QueryClient, useQuery } from "@tanstack/react-query";
import { getExerciseById, getSetsByExerciseId } from "./server";

export const queryKeys = {
  exercise: (id: number) => ["exercises", { exerciseId: id }],
  exerciseSets: (id: number) => ["sets", { exerciseId: id }],
};

export const invalidateExercise = (
  queryClient: QueryClient,
  exerciseId: number
) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.exercise(exerciseId) });
};

export const useExercise = (exerciseId: number) =>
  useQuery({
    queryKey: queryKeys.exercise(exerciseId),
    queryFn: async () => getExerciseById(exerciseId),
  });

export const useExerciseSets = (exerciseId: number) =>
  useQuery({
    queryKey: queryKeys.exerciseSets(exerciseId),
    queryFn: async () => getSetsByExerciseId(exerciseId),
    initialData: [],
  });
