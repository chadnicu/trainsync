import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkout,
  deleteWorkout,
  updateWorkout,
  getWorkouts,
  getWorkoutById,
  createWorkoutFromTemplate,
} from "@/server/workouts";
import {
  AddWorkoutInput,
  EditWorkoutInput,
  TemplateToWorkoutInput,
  Workout,
} from "@/types";
import { getIdFromSlug, mapUndefinedKeysToNull } from "@/lib/utils";
import { createContext, useContext } from "react";
import { queryKeys } from "@/hooks/tanstack";
import { useParams } from "next/navigation";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";
import { useTemplate, useTemplates } from "./templates";

const queryKey = queryKeys.workouts;

export const useWorkouts = () =>
  useQuery({
    queryKey,
    queryFn: async () => getWorkouts(),
    initialData: [],
  });

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: AddWorkoutInput) => await createWorkout(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Workout[]) => [
        { ...values, date: values.date.toDateString(), id: 0 },
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

export function useCreateWorkoutFromTemplate() {
  const queryClient = useQueryClient();
  const setOpen = useContext(ToggleDialogFunction);
  const { data: templates } = useTemplates();
  return useMutation({
    mutationFn: async (values: TemplateToWorkoutInput) =>
      await createWorkoutFromTemplate(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      const optimisticTemplate = templates.find(
        (e) => e.id === values.templateId
      );
      if (!optimisticTemplate) return { previous };
      queryClient.setQueryData(queryKey, (old: Workout[]) => [
        {
          title: optimisticTemplate.title,
          description: optimisticTemplate.description,
          date: values.date.toDateString(),
          id: 0,
        },
        ...old,
      ]);
      return { previous };
    },
    onError: (err, newElement, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      console.log("Error creating workout from template. ", newElement);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      setOpen(false);
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workoutId) => deleteWorkout(workoutId),
    onMutate: async (workoutId: number) => {
      await queryClient.getQueryData(queryKey);
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Workout[]) =>
        old.filter((e) => e.id !== workoutId)
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

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: EditWorkoutInput & { id: number }) =>
      await updateWorkout(values.id, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Workout[]) => {
        const index = old.findIndex((e) => e.id === values.id);
        if (index === -1) return old;
        const copy = structuredClone(old);
        copy[index] = {
          ...mapUndefinedKeysToNull(values),
          id: 0, // pass 0 if you want to show its loading, otherwise workoutId
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

export function useWorkout() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  return useQuery({
    queryKey: queryKeys.workout(workoutId),
    queryFn: async () => getWorkoutById(workoutId),
  });
}

export function useUpdateDynamicWorkout() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryClient = useQueryClient();
  const { data } = useWorkout();
  const { id, title, date } = data ?? { id: 0, title: "", date: "" };

  const defaultValues = {
    id,
    title,
    date: new Date(date ?? ""),
  };
  const queryKey = queryKeys.workout(workoutId);

  return useMutation({
    mutationFn: async (values: {
      started?: string;
      finished?: string;
      comment?: string;
    }) =>
      await updateWorkout(workoutId, {
        ...defaultValues,
        ...values,
      }),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Workout) => ({
        ...old,
        ...values,
      }));
      return { previous };
    },
    onError: (err, newValues, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      console.log("Error optimistic ", newValues);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export const WorkoutContext = createContext<Workout>({
  id: 0,
  title: "",
  description: "",
  date: new Date().toDateString(),
  comment: null,
  finished: null,
  started: null,
});
