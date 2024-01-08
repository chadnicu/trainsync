import { exerciseSchema } from "@/components/exercise-form";
import {
  addExercise,
  deleteExercise,
  editExercise,
  getExercises,
} from "@/server/actions";
import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const useExercises = () =>
  useQuery({
    queryKey: ["exercises"],
    queryFn: async () => getExercises(),
    initialData: [],
  });

export const useAddExerciseMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) =>
      await addExercise(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) => [
          { ...values, id: 0 },
          ...old,
        ]
      );
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

export const useDeleteExerciseMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async (exerciseId) => deleteExercise(exerciseId),
    onMutate: async (exerciseId: number) => {
      await queryClient.getQueryData(["exercises"]);
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) =>
          old.filter((e) => e.id !== exerciseId)
      );
      return { previous };
    },
    onError: (err, values, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

export const useEditExerciseMutation = (
  queryClient: QueryClient,
  exerciseId: number
) =>
  useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) =>
      await editExercise(exerciseId, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) => {
          const index = old.findIndex((e) => e.id === exerciseId);
          if (index === -1) return old;
          const copy = structuredClone(old);
          copy[index] = {
            id: 0, // pass 0 if you want to show its loading, otherwise exerciseId
            title: values.title,
            instructions: values.instructions ?? null,
            url: values.url ?? null,
          };
          return copy;
        }
      );
      return { previous, values };
    },
    onError: (err, values, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
