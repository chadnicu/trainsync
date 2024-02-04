import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  addExerciseToWorkout,
  addSet,
  getExercisesByWorkoutId,
  getSetsById,
  getWorkoutById,
} from "./server";
import { Set, SetInput, WorkoutExercises } from "./types";
import { getValueByDataKey } from "recharts/types/util/ChartUtils";
import { useContext } from "react";
import { WorkoutExerciseContext } from "./context";

const queryKeys = {
  workout: (id: number) => ["workouts", { workoutId: id }],
  workoutExercises: (id: number) => ["exercises", { workoutId: id }],
  sets: (id: number) => ["sets", { exerciseId: id }],
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

export const useSets = (exerciseId: number) =>
  useQuery({
    queryKey: queryKeys.sets(exerciseId),
    queryFn: async () => getSetsById(exerciseId),
    initialData: [],
  });

export const useAddSet = (queryClient: QueryClient) => {
  const {
    exerciseId,
    workout_id: workoutId,
    id: workoutExerciseId,
  } = useContext(WorkoutExerciseContext);
  const queryKey = queryKeys.sets(exerciseId);
  return useMutation({
    mutationFn: async (values: SetInput) =>
      await addSet(values, workoutExerciseId),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Set[]) => {
        return [...old, { ...values, workoutId }];
      });
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
