import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addExerciseToWorkout,
  getExercisesByWorkoutId,
  removeExerciseFromWorkout,
  updateExerciseOrder,
} from "@/server/workout-exercise";
import {
  WorkoutSet,
  WorkoutExercises,
  WorkoutExercise,
  Workout,
} from "@/types";
import { useContext } from "react";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";
import { useParams } from "next/navigation";
import { getIdFromSlug, mapUndefinedKeysToNull } from "@/lib/utils";
import { createContext } from "react";
import { updateWorkout } from "@/server/workouts";
import { useWorkout, queryKey as workoutQueryKey } from "./workouts";

export const queryKeyFn = (workoutId: number) => ["exercises", { workoutId }];

export function useWorkoutExercises() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  return useQuery({
    queryKey: queryKeyFn(workoutId),
    queryFn: async () => getExercisesByWorkoutId(workoutId),
    initialData: { inWorkout: [], other: [] },
  });
}

export function useUpdateWorkoutPage() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryClient = useQueryClient();
  const { data } = useWorkout();
  const { id, title, date } = data ?? { id: 0, title: "", date: "" }; // this shouldnt happen
  const defaultValues = {
    id,
    title,
    date: new Date(date ?? ""),
  };
  const queryKey = [...workoutQueryKey, { workoutId }];

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

export function useAddExerciseToWorkout() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryClient = useQueryClient();
  const queryKey = queryKeyFn(workoutId);
  return useMutation({
    mutationFn: async ({
      exerciseId,
      order,
    }: {
      exerciseId: number;
      order: number;
    }) => await addExerciseToWorkout({ exerciseId, workoutId, order }),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutExercises) => ({
        inWorkout: [
          ...old.inWorkout,
          old.other.find((e) => e.id === values.exerciseId),
        ],
        other: old.other.filter((e) => e.id !== values.exerciseId),
      }));
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

export function useRemoveExerciseFromWorkout() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryKey = queryKeyFn(workoutId);
  const { id } = useContext(WorkoutExerciseContext);
  return useMutation({
    mutationFn: async () => await removeExerciseFromWorkout(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutExercises) => {
        return {
          inWorkout: old.inWorkout.filter((e) => e.id !== id),
          other: [...old.other, old.inWorkout.find((e) => e.id === id)],
        };
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

export function useUpdateExerciseOrder() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryKey = queryKeyFn(workoutId);
  const setOpen = useContext(ToggleDialogFunction);
  return useMutation({
    mutationFn: async (arr: number[]) => {
      if (!arr.length) return;
      await updateExerciseOrder(arr);
    },
    onError: (err, newElement, context) => {
      console.log("Error updating order. Context: ", context);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      setOpen(false);
    },
  });
}

export const WorkoutExerciseContext = createContext<
  WorkoutExercise & { sets: WorkoutSet[] }
>({
  id: 0,
  title: "Loading..",
  instructions: "exercise card..",
  url: "",
  todo: "",
  comment: "",
  exerciseId: 0,
  workout_id: 0,
  // sets: [{ reps: 69, weight: 69, id: 0, workoutExerciseId: 0 }],
  sets: [],
  order: -1,
});
