import { queryKeys } from "@/lib/query-keys";
import { getIdFromSlug } from "@/lib/utils";
import {
  createSet,
  deleteSet,
  getSetsByWorkoutId,
  updateSet,
} from "@/server/sets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { WorkoutExerciseContext } from "./exercises";
import { CommentInput, SetInput, WorkoutExercises, WorkoutSet } from "@/types";
import { addCommentToExercise } from "@/server/workout-exercise";

export function useWorkoutSets() {
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  return useQuery({
    queryKey: queryKeys.workoutSets(workoutId),
    queryFn: async () => getSetsByWorkoutId(workoutId),
    initialData: [],
  });
}

export function useCreateSet() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const { id: workoutExerciseId, exerciseId } = useContext(
    WorkoutExerciseContext
  );
  const queryKey = queryKeys.workoutSets(workoutId);
  return useMutation({
    mutationFn: async (values: SetInput) =>
      await createSet(values, workoutExerciseId),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutSet[]) => {
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.exerciseSets(exerciseId), // optimistic isnt worth it
      });
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateSet() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryKey = queryKeys.workoutSets(workoutId);
  return useMutation({
    mutationFn: async (values: SetInput & { id: number }) =>
      await updateSet(values.id, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutSet[]) => {
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
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryKey = queryKeys.workoutSets(workoutId);
  return useMutation({
    mutationFn: async (id: number) => await deleteSet(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutSet[]) => {
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

export function useAddCommentToSets() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string }>();
  const workoutId = getIdFromSlug(params.slug);
  const queryKey = queryKeys.workoutExercises(workoutId);
  const { id, exerciseId } = useContext(WorkoutExerciseContext);
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
        queryKey: queryKeys.exerciseSets(exerciseId), // optimistic isnt worth it
      });
    },
  });
}
