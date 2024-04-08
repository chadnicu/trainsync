import { getIdFromSlug } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext, useContext } from "react";
import { TemplateExercise, TemplateExercises, ToDoInput } from "@/types";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";
import { queryKeys } from "@/hooks/tanstack";
import {
  addExerciseToTemplate,
  addToDoToExercise,
  getExercisesByTemplateId,
  removeExerciseFromTemplate,
  swapTemplateExercise,
  updateTemplateExerciseOrder,
} from "@/server/template-exercise";

export function useTemplateExercises() {
  const params = useParams<{ slug: string }>();
  const templateId = getIdFromSlug(params.slug);
  return useQuery({
    queryKey: queryKeys.templateExercises(templateId),
    queryFn: async () => getExercisesByTemplateId(templateId),
    initialData: { inTemplate: [], other: [] },
  });
}

export function useAddExerciseToTemplate() {
  const params = useParams<{ slug: string }>();
  const templateId = getIdFromSlug(params.slug);
  const queryClient = useQueryClient();
  const queryKey = queryKeys.templateExercises(templateId);
  return useMutation({
    mutationFn: async ({
      exerciseId,
      order,
    }: {
      exerciseId: number;
      order: number;
    }) => await addExerciseToTemplate({ exerciseId, templateId, order }),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TemplateExercises) => ({
        inTemplate: [
          ...old.inTemplate,
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

export function useRemoveExerciseFromTemplate() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string }>();
  const templateId = getIdFromSlug(params.slug);
  const queryKey = queryKeys.templateExercises(templateId);
  const { id } = useContext(TemplateExerciseContext);
  return useMutation({
    mutationFn: async () => await removeExerciseFromTemplate(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: TemplateExercises) => {
        return {
          inTemplate: old.inTemplate.filter((e) => e.id !== id),
          other: [...old.other, old.inTemplate.find((e) => e.id === id)],
        };
      });
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

export function useAddToDoToExercise() {
  const queryClient = useQueryClient();
  const { id, template_id: templateId } = useContext(TemplateExerciseContext);
  const queryKey = queryKeys.templateExercises(templateId);
  return useMutation({
    mutationFn: async (values: ToDoInput) =>
      await addToDoToExercise(values, id),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (old: TemplateExercises): TemplateExercises => {
          return {
            inTemplate: old.inTemplate.map((e) => ({
              ...e,
              toDo: e.id !== id ? e.toDo : values.toDo ?? null,
            })),
            other: old.other,
          };
        }
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

export function useUpdateTemplateExerciseOrder() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string }>();
  const templateId = getIdFromSlug(params.slug);
  const queryKey = queryKeys.templateExercises(templateId);
  const setOpen = useContext(ToggleDialogFunction);
  return useMutation({
    mutationFn: async (arr: number[]) => {
      if (!arr.length) return;
      await updateTemplateExerciseOrder(arr);
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

export function useSwapExerciseInTemplate() {
  const params = useParams<{ slug: string }>();
  const templateId = getIdFromSlug(params.slug);
  const queryClient = useQueryClient();
  const queryKey = queryKeys.templateExercises(templateId);
  return useMutation({
    mutationFn: async ({
      templateExerciseId,
      exerciseId,
    }: {
      templateExerciseId: number;
      exerciseId: number;
    }) => await swapTemplateExercise(templateExerciseId, exerciseId),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (old: TemplateExercises): TemplateExercises => {
          return {
            inTemplate: old.inTemplate.map((e) =>
              e.id === values.templateExerciseId ? { ...e, id: 0 } : e
            ),
            other: old.other.filter((e) => e.id === values.exerciseId),
          };
        }
      );
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

export const TemplateExerciseContext = createContext<TemplateExercise>({
  id: 0,
  title: "Loading..",
  instructions: "Template card..",
  url: "",
  toDo: "",
  exerciseId: 0,
  template_id: 0,
  order: -1,
});
