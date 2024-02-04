import {
  addExercise,
  deleteExercise,
  editExercise,
  getExercises,
} from "./server";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Exercise, ExerciseInput } from "./types";

const queryKey = ["exercises"];

export const invalidateExercises = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey });

export const useExercises = () =>
  useQuery({
    queryKey,
    queryFn: async () => getExercises(),
    initialData: [],
  });

export const useAddExercise = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (values: ExerciseInput) => await addExercise(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Exercise[]) => [
        { ...values, id: 0 },
        ...old,
      ]);
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => invalidateExercises(queryClient),
  });

export const useDeleteExercise = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (exerciseId) => deleteExercise(exerciseId),
    onMutate: async (exerciseId: number) => {
      await queryClient.getQueryData(queryKey);
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Exercise[]) =>
        old.filter((e) => e.id !== exerciseId)
      );
      return { previous };
    },
    onError: (err, values, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => invalidateExercises(queryClient),
  });

export const useEditExercise = (queryClient: QueryClient, exerciseId: number) =>
  useMutation({
    mutationFn: async (values: ExerciseInput) =>
      await editExercise(exerciseId, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Exercise[]) => {
        const index = old.findIndex((e) => e.id === exerciseId);
        if (index === -1) return old;
        const copy = structuredClone(old);
        copy[index] = {
          id: 0, // pass 0 if you want to show its loading, otherwise exerciseId
          title: values.title,
          instructions: values.instructions ?? null,
          url: values.url ?? null,
        };
        return copy;
      });
      return { previous, values };
    },
    onError: (err, values, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => invalidateExercises(queryClient),
  });
