import {
  addExercise,
  deleteExercise,
  editExercise,
  getExercises,
} from "./server";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { z } from "zod";

// key
const queryKey = ["exercises"];

// function to revalidate
export const invalidateExercises = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey });

// tanstack query hooks
export const useExercises = () =>
  useQuery({
    queryKey,
    queryFn: async () => getExercises(),
    initialData: [],
  });

export const useAddExerciseMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (values: ExerciseFormData) => await addExercise(values),
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

export const useDeleteExerciseMutation = (queryClient: QueryClient) =>
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

export const useEditExerciseMutation = (
  queryClient: QueryClient,
  exerciseId: number
) =>
  useMutation({
    mutationFn: async (values: ExerciseFormData) =>
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

// react context
export const ExerciseContext = createContext<Exercise>({
  id: 0,
  title: "",
  instructions: "",
  url: "",
});

// form schema
export const exerciseSchema = z.object({
  title: z.string().min(1).max(80),
  instructions: z.string().min(0).max(255).optional(),
  url: z
    .string()
    .url()
    .refine((url) =>
      /^(https?:\/\/)?(www\.)?(youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)?([a-zA-Z0-9_-]{11})/.test(
        url
      )
    )
    .optional()
    .or(z.literal("")),
});

// types
export type ExerciseFormData = z.infer<typeof exerciseSchema>;
export type Exercise = Awaited<ReturnType<typeof getExercises>>[0];
