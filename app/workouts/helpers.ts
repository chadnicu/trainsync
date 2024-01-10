import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { z } from "zod";
import { addWorkout, deleteWorkout, editWorkout, getWorkouts } from "./server";

// key
const queryKey = ["workouts"];

// function to revalidate
export const invalidateWorkouts = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey });

// tanstack query hooks
export const useWorkouts = () =>
  useQuery({
    queryKey,
    queryFn: async () => getWorkouts(),
    initialData: [],
  });

export const useAddWorkoutMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (values: WorkoutFormData) => await addWorkout(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Workout[]) => [
        { ...values, date: values.date.toDateString(), id: 0 },
        ...old,
      ]);
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => invalidateWorkouts(queryClient),
  });

export const useDeleteWorkoutMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (workoutId) => deleteWorkout(workoutId),
    onMutate: async (workoutId: number) => {
      await queryClient.getQueryData(queryKey);
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Workout[]) =>
        old.filter((e) => e.id !== workoutId)
      );
      return { previous };
    },
    onError: (err, values, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => invalidateWorkouts(queryClient),
  });

export const useEditWorkoutMutation = (
  queryClient: QueryClient,
  workoutId: number
) =>
  useMutation({
    mutationFn: async (values: WorkoutFormData) =>
      await editWorkout(workoutId, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Workout[]) => {
        const index = old.findIndex((e) => e.id === workoutId);
        if (index === -1) return old;
        const copy = structuredClone(old);
        copy[index] = {
          id: 0, // pass 0 if you want to show its loading, otherwise workoutId
          ...values,
          description: values.description ?? "",
          date: values.date.toDateString(),
          started: null,
          finished: null,
          comment: null,
        };
        return copy;
      });
      return { previous, values };
    },
    onError: (err, values, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => invalidateWorkouts(queryClient),
  });

// react context
export const WorkoutContext = createContext<Workout>({
  id: 0,
  title: "",
  description: "",
  date: new Date().toDateString(),
  comment: null,
  finished: null,
  started: null,
});

// form schema
export const workoutSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(0).max(255).optional(),
  date: z.coerce.date(),
  started: z.string().datetime().optional(),
  finished: z.string().datetime().optional(),
  comment: z.string().min(0).max(255).optional(),
});

// types
export type WorkoutFormData = z.infer<typeof workoutSchema>;
export type Workout = Awaited<ReturnType<typeof getWorkouts>>[0];
