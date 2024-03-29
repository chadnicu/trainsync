import { queryKeys } from "@/hooks/tanstack";
import { createSet, deleteSet, getAllSets, updateSet } from "@/server/sets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { Set, SetInput } from "@/types";
import { WorkoutExerciseContext } from "@/hooks/tanstack/workout-exercises";

const queryKey = queryKeys.sets;

export function useSets() {
  return useQuery({
    queryKey,
    queryFn: async () => getAllSets(),
    initialData: [],
  });
}

export function useCreateSet() {
  const queryClient = useQueryClient();
  const { id: workoutExerciseId } = useContext(WorkoutExerciseContext);
  return useMutation({
    mutationFn: async (values: SetInput) =>
      await createSet(values, workoutExerciseId),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Set[]) => {
        return [...old, { ...values, workoutExerciseId, id: 0 }];
      });
      return { previous };
    },
    onError: (err, newElement, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      console.log("Error optimistic ", newElement);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: SetInput & { id: number }) =>
      await updateSet(values.id, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Set[]) => {
        return old.map((e) =>
          e.id === values.id ? { ...e, ...values, id: 0 } : e
        );
      });
      return { previous };
    },
    onError: (err, newElement, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      console.log("Error optimistic ", newElement);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => await deleteSet(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Set[]) => {
        return old.filter((e) => e.id !== id);
      });
      return { previous };
    },
    onError: (err, newElement, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      console.log("Error optimistic ", newElement);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
