import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  addExerciseToWorkout,
  getExercisesByWorkoutId,
  getWorkoutById,
} from "./server";
import { createContext } from "react";
import { z } from "zod";
import { Set } from "@/app/exercises/[id]/helpers";

export const useWorkout = (workoutId: number) =>
  useQuery({
    queryKey: ["workout", workoutId],
    queryFn: async () => getWorkoutById(workoutId),
  });

export const useWorkoutExercises = (workoutId: number) =>
  useQuery({
    queryKey: ["exercises", { workoutId }],
    queryFn: async () => getExercisesByWorkoutId(workoutId),
    initialData: { inWorkout: [], other: [] },
  });

export const useAddExerciseToWorkout = (
  queryClient: QueryClient,
  workoutId: number
) => {
  const queryKey = ["exercises", { workoutId }];
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

export const WorkoutExerciseContext = createContext<WorkoutExercise>({
  id: 0,
  title: "",
  instructions: "",
  url: "",
  todo: "",
  comment: "",
  exerciseId: 0,
  workout_id: 0,
});

export type WorkoutExercises = Awaited<
  ReturnType<typeof getExercisesByWorkoutId>
>;
export type WorkoutExercise = WorkoutExercises["inWorkout"][0];
