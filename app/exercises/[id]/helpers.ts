import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getExerciseById, getSetsById } from "./server";
import { createContext } from "react";

export const invalidateExerciseAndSets = (
  queryClient: QueryClient,
  exerciseId: number
) => {
  queryClient.invalidateQueries({ queryKey: ["exercise", exerciseId] });
  queryClient.invalidateQueries({ queryKey: ["sets", exerciseId] });
};

export const useExercise = (exerciseId: number) =>
  useQuery({
    queryKey: ["exercise", exerciseId],
    queryFn: async () => getExerciseById(exerciseId),
  });

export const useSets = (exerciseId: number) =>
  useQuery({
    queryKey: ["sets", exerciseId],
    queryFn: async () => getSetsById(exerciseId),
    initialData: [],
  });

export function groupSetsByDate(sets: Set[]): Record<string, Set[]> {
  const groupedSets: Record<string, Set[]> = {};

  sets.forEach((set) => {
    const date = set.workoutDate || "No Date";
    if (!groupedSets[date]) {
      groupedSets[date] = [];
    }
    groupedSets[date].push(set);
  });

  return groupedSets;
}

// export const useWorkoutExercises = (workoutId: number) =>
//   useQuery({
//     queryKey: ["exercises", { workoutId }],
//     queryFn: async () => getExercisesByWorkoutId(workoutId),
//     initialData: { inWorkout: [], other: [] },
//   });

// export const useAddExerciseToWorkout = (
//   queryClient: QueryClient,
//   workoutId: number
// ) => {
//   const queryKey = ["exercises", { workoutId }];
//   return useMutation({
//     mutationFn: async ({ exerciseId }: { exerciseId: number }) =>
//       await addExerciseToWorkout({ exerciseId, workoutId }),
//     onMutate: async (values) => {
//       await queryClient.cancelQueries({ queryKey });
//       const previous = queryClient.getQueryData(queryKey);
//       queryClient.setQueryData(queryKey, (old: WorkoutExercises) => ({
//         inWorkout: [
//           ...old.inWorkout,
//           old.other.find((e) => e.id === values.exerciseId),
//         ],
//         other: old.other.filter((e) => e.id !== values.exerciseId),
//       }));
//       return { previous };
//     },
//     onError: (err, newTodo, context) => {
//       queryClient.setQueryData(queryKey, context?.previous);
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey }),
//   });
// };

// export const WorkoutExerciseContext = createContext<WorkoutExercise>({
//   workoutExerciseId: 0,
//   todo: "",
//   comment: "",
//   id: 0,
//   title: "",
//   userId: "",
//   instructions: "",
//   url: "",
// });

// export type WorkoutExercises = Awaited<
//   ReturnType<typeof getExercisesByWorkoutId>
// >;
// export type WorkoutExercise = WorkoutExercises["inWorkout"][0];
export type Set = Awaited<ReturnType<typeof getSetsById>>[0];
