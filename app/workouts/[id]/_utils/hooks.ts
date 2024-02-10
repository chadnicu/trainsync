import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  addCommentToSets,
  addExerciseToWorkout,
  addSet,
  deleteSet,
  getExercisesByWorkoutId,
  getSetsByWorkoutId,
  getWorkoutById,
  updateSet,
} from "./server";
import { WorkoutSet, SetInput, WorkoutExercises, CommentInput } from "./types";
import { useContext } from "react";
import { WorkoutExerciseContext } from "./context";
import { queryKeys as exerciseQueryKeys } from "@/app/exercises/[id]/_utils/hooks";

const queryKeys = {
  workout: (id: number) => ["workouts", { workoutId: id }],
  workoutExercises: (id: number) => ["exercises", { workoutId: id }],
  workoutSets: (id: number) => ["sets", { workoutId: id }],
};

export const useWorkout = (workoutId: number) =>
  useQuery({
    queryKey: queryKeys.workout(workoutId),
    queryFn: async () => getWorkoutById(workoutId),
  });

export const useWorkoutExercises = (workoutId: number) =>
  useQuery({
    queryKey: queryKeys.workoutExercises(workoutId),
    queryFn: async () => getExercisesByWorkoutId(workoutId),
    initialData: { inWorkout: [], other: [] },
  });

export const useAddExerciseToWorkout = (
  queryClient: QueryClient,
  workoutId: number
) => {
  const queryKey = queryKeys.workoutExercises(workoutId);
  return useMutation({
    mutationFn: async ({ exerciseId }: { exerciseId: number }) =>
      await addExerciseToWorkout({ exerciseId, workoutId }),
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
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};

export const useWorkoutSets = (workoutId: number) =>
  useQuery({
    queryKey: queryKeys.workoutSets(workoutId),
    queryFn: async () => getSetsByWorkoutId(workoutId),
    initialData: [],
  });

export const useAddSet = (queryClient: QueryClient) => {
  const {
    exerciseId,
    workout_id: workoutId,
    id: workoutExerciseId,
  } = useContext(WorkoutExerciseContext);
  const queryKey = queryKeys.workoutSets(workoutId);
  return useMutation({
    mutationFn: async (values: SetInput) =>
      await addSet(values, workoutExerciseId),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutSet[]) => {
        return [...old, { ...values, workoutExerciseId, id: 0 }];
      });
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: exerciseQueryKeys.exerciseSets(exerciseId), //dunno if optimistic is worth it
      });
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useAddComment = (queryClient: QueryClient) => {
  const {
    id,
    exerciseId,
    workout_id: workoutId,
  } = useContext(WorkoutExerciseContext);
  const queryKey = queryKeys.workoutExercises(workoutId);
  return useMutation({
    mutationFn: async (values: CommentInput) =>
      await addCommentToSets(values, id),
    onMutate: async (values) => {
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
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: exerciseQueryKeys.exerciseSets(exerciseId), //dunno if optimistic is worth it
      });
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useEditSet = (queryClient: QueryClient, setId: number) => {
  const { workout_id: workoutId } = useContext(WorkoutExerciseContext);
  const queryKey = queryKeys.workoutSets(workoutId);
  return useMutation({
    mutationFn: async (values: SetInput) => await updateSet(setId, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutSet[]) => {
        return old.map((e) =>
          e.id === setId ? { ...e, id: 0, ...values } : e
        );
      });
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useDeleteSet = (queryClient: QueryClient, setId: number) => {
  const { workout_id: workoutId } = useContext(WorkoutExerciseContext);
  const queryKey = queryKeys.workoutSets(workoutId);
  return useMutation({
    mutationFn: async () => await deleteSet(setId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: WorkoutSet[]) => {
        return old.filter((e) => e.id !== setId);
      });
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
