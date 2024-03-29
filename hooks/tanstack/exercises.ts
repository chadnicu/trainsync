import {
  createExercise,
  deleteExercise,
  updateExercise,
  getExercises,
  getExerciseById,
} from "@/server/exercises";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Exercise, ExerciseInput } from "@/types";
import { getIdFromSlug, mapUndefinedKeysToNull } from "@/lib/utils";
import { createContext } from "react";
import { queryKeys } from "@/hooks/tanstack";
import { useParams } from "next/navigation";

const queryKey = queryKeys.exercises;

export const useExercises = () =>
  useQuery({
    queryKey,
    queryFn: async () => getExercises(),
    initialData: [],
  });

export function useCreateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ExerciseInput) => await createExercise(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Exercise[]) => [
        { ...values, id: 0 },
        ...old,
      ]);
      return { previous };
    },
    onError: (err, newElement, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      console.log("Error optimistic ", newElement);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exerciseId) => deleteExercise(exerciseId),
    onMutate: async (exerciseId: number) => {
      await queryClient.getQueryData(queryKey);
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Exercise[]) =>
        old.filter((e) => e.id !== exerciseId)
      );
      return { previous };
    },
    onError: (err, newElement, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      console.log("Error optimistic ", newElement);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ExerciseInput & { id: number }) =>
      await updateExercise(values.id, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Exercise[]) => {
        const index = old.findIndex((e) => e.id === values.id);
        if (index === -1) return old;
        const copy = structuredClone(old);
        copy[index] = {
          ...mapUndefinedKeysToNull(values),
          id: 0, // pass 0 if you want to show its loading, otherwise exerciseId
        };
        return copy;
      });
      return { previous, values };
    },
    onError: (err, newElement, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      console.log("Error optimistic ", newElement);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useExercise() {
  const params = useParams<{ slug: string }>();
  const exerciseId = getIdFromSlug(params.slug);
  return useQuery({
    queryKey: queryKeys.exercise(exerciseId),
    queryFn: async () => getExerciseById(exerciseId),
  });
}

export const ExerciseContext = createContext<Exercise>({
  id: 0,
  title: "",
  instructions: null,
  url: null,
});
