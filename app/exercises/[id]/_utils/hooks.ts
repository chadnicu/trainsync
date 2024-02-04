import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { addSet, getExerciseById, getSetsById } from "./server";
import { SetInput } from "./types";
import { Set } from "./types";

const queryKeys = {
  exercise: (id: number) => ["exercises", { exerciseId: id }],
  sets: (id: number) => ["sets", { exerciseId: id }],
};

export const invalidateExerciseAndSets = (
  queryClient: QueryClient,
  exerciseId: number
) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.exercise(exerciseId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.sets(exerciseId) });
};

export const useExercise = (exerciseId: number) =>
  useQuery({
    queryKey: queryKeys.exercise(exerciseId),
    queryFn: async () => getExerciseById(exerciseId),
  });

export const useSets = (exerciseId: number) =>
  useQuery({
    queryKey: queryKeys.sets(exerciseId),
    queryFn: async () => getSetsById(exerciseId),
    initialData: [],
  });

export const useAddSet = (
  queryClient: QueryClient,
  exerciseId: number,
  workoutExerciseId: number
) => {
  const queryKey = queryKeys.sets(exerciseId);
  return useMutation({
    mutationFn: async (values: SetInput) =>
      await addSet(values, workoutExerciseId),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Set[]) => {
        return [...old, { ...values, id: 0 }];
      });
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => invalidateExerciseAndSets(queryClient, exerciseId),
  });
};
