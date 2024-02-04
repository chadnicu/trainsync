import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { addWorkout, deleteWorkout, editWorkout, getWorkouts } from "./server";
import { AddWorkoutInput, EditWorkoutInput, Workout } from "./types";

const queryKey = ["workouts"];

export const invalidateWorkouts = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey });

export const useWorkouts = () =>
  useQuery({
    queryKey,
    queryFn: async () => getWorkouts(),
    initialData: [],
  });

export const useAddWorkout = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (values: AddWorkoutInput) => await addWorkout(values),
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

export const useDeleteWorkout = (queryClient: QueryClient) =>
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

export const useEditWorkout = (queryClient: QueryClient, workoutId: number) =>
  useMutation({
    mutationFn: async (values: EditWorkoutInput) =>
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
          started: values.started ?? null,
          finished: values.finished ?? null,
          comment: values.comment ?? null,
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
