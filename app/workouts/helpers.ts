import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { z } from "zod";
import { addWorkout, deleteWorkout, editWorkout, getWorkouts } from "./server";
import dayjs from "@/lib/dayjs";

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

export const useAddWorkout = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (values: AddWorkoutFormData) => await addWorkout(values),
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
    mutationFn: async (values: EditWorkoutFormData) =>
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

// form schemas
export const AddWorkoutSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(0).max(255).optional(),
  date: z.date({
    required_error: "Date of workout is required.",
  }),
});

export const EditWorkoutSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(0).max(255).optional(),
  date: z.date({
    required_error: "Date of workout is required.",
  }),
  started: z
    .string()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
      message: "Invalid time format. Expected HH:MM",
    })
    .optional(),
  finished: z
    .string()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
      message: "Invalid time format. Expected HH:MM",
    })
    .optional(),
  comment: z.string().min(0).max(255).optional(),
  clearTime: z.boolean().default(false).optional(),
});

// types
export type AddWorkoutFormData = z.infer<typeof AddWorkoutSchema>;
export type EditWorkoutFormData = z.infer<typeof EditWorkoutSchema>;
export type Workout = Awaited<ReturnType<typeof getWorkouts>>[0];

// other
export function getDiffInMinutes(
  started: string | null,
  finished: string | null
) {
  if (
    !started ||
    !finished ||
    started.length !== 5 ||
    finished.length !== 5 ||
    started.indexOf(":") === -1 ||
    finished.indexOf(":") === -1
  )
    return -1;

  const [sHour, sMin] = started.split(":").map((e) => parseInt(e, 10));
  const [fHour, fMin] = finished.split(":").map((e) => parseInt(e, 10));
  const startTime = dayjs().hour(sHour).minute(sMin);
  const finishTime = dayjs().hour(fHour).minute(fMin);
  const duration = finishTime.diff(startTime, "minutes");

  return duration;
}
