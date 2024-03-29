import { getIdFromSlug } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext, useContext } from "react";
import { CommentInput, Set, WorkoutExercise, WorkoutExercises } from "@/types";
import {
  addCommentToExercise,
  addExerciseToWorkout,
  getExercisesByWorkoutId,
  removeExerciseFromWorkout,
  swapExercise,
  updateExerciseOrder,
} from "@/server/workout-exercise";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";
import { queryKeys } from "@/hooks/tanstack";

export function useWorkoutExercises() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  return useQuery({
    queryKey: queryKeys.workoutExercises(workoutId),
    queryFn: async () => getExercisesByWorkoutId(workoutId),
    initialData: { inWorkout: [], other: [] },
  });
}

export function useAddExerciseToWorkout() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryClient = useQueryClient();
  const queryKey = queryKeys.workoutExercises(workoutId);
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
  const queryKey = queryKeys.workoutExercises(workoutId);
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

export function useAddCommentToExercise() {
  const queryClient = useQueryClient();
  const { id, workout_id: workoutId } = useContext(WorkoutExerciseContext);
  const queryKey = queryKeys.workoutExercises(workoutId);
  return useMutation({
    mutationFn: async (values: CommentInput) =>
      await addCommentToExercise(values, id),
    onMutate: async (values) => {
      console.log(values);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutExercises) => {
        return {
          inWorkout: old.inWorkout.map((e) => ({
            ...e,
            comment: e.id === id ? values.comment : e.comment,
          })),
          other: old.other,
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.workoutExercises(id),
      });
    },
  });
}

export function useUpdateExerciseOrder() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryKey = queryKeys.workoutExercises(workoutId);
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

export function useSwapExerciseInWorkout() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryClient = useQueryClient();
  const queryKey = queryKeys.workoutExercises(workoutId);
  return useMutation({
    mutationFn: async ({
      workoutExerciseId,
      exerciseId,
    }: {
      workoutExerciseId: number;
      exerciseId: number;
    }) => await swapExercise(workoutExerciseId, exerciseId),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutExercises) => {
        return {
          inWorkout: old.inWorkout.map((e) =>
            e.id === values.workoutExerciseId ? { ...e, id: 0 } : e
          ),
          other: old.other.filter((e) => e.id === values.exerciseId),
        };
      });
      return { previous };
    },
    onError: (err, newElement, context) => {
      console.log("Error swapping exercise. Context: ", context);
      console.log(`${err.name}: ${err.message}. ${err.cause}: ${err.stack}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export const WorkoutExerciseContext = createContext<WorkoutExercise>({
  id: 0,
  title: "Loading..",
  instructions: "Exercise card..",
  url: "",
  todo: "",
  comment: "",
  exerciseId: 0,
  workout_id: 0,
  // sets: [{ reps: 69, weight: 69, id: 0, workoutExerciseId: 0 }],
  order: -1,
});
