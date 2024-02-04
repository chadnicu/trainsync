import { QueryClient, useQuery } from "@tanstack/react-query";
import { getExerciseById } from "./server";

const queryKeys = {
  exercise: (id: number) => ["exercises", { exerciseId: id }],
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
