import { queryKeys } from "@/hooks/tanstack";
import { getIdFromSlug, mapUndefinedKeysToNull } from "@/lib/utils";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  getTemplates,
  updateTemplate,
} from "@/server/templates";
import { Template, TemplateInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext } from "react";

const queryKey = queryKeys.templates;

export const useTemplates = () =>
  useQuery({
    queryKey,
    queryFn: async () => getTemplates(),
    initialData: [],
  });

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TemplateInput) => await createTemplate(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Template[]) => [
        { ...values, id: 0 },
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

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TemplateInput & { id: number }) =>
      await updateTemplate(values.id, values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Template[]) => {
        const index = old.findIndex((e) => e.id === values.id);
        if (index === -1) return old;
        const copy = structuredClone(old);
        copy[index] = {
          ...mapUndefinedKeysToNull(values),
          id: 0, // pass 0 if you want to show its loading, otherwise templateId
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

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (templateId) => deleteTemplate(templateId),
    onMutate: async (templateId: number) => {
      await queryClient.getQueryData(queryKey);
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Template[]) =>
        old.filter((e) => e.id !== templateId)
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

export function useTemplate() {
  const params = useParams<{ slug: string }>();
  const templateId = getIdFromSlug(params.slug);
  return useQuery({
    queryKey: queryKeys.template(templateId),
    queryFn: async () => getTemplateById(templateId),
  });
}

export function useUpdateDynamicTemplate() {
  const params = useParams<{ slug: string }>();
  const templateId = getIdFromSlug(params.slug);
  const queryClient = useQueryClient();
  const { data } = useTemplate();
  const { id, title } = data ?? { id: 0, title: "" }; // this shouldnt happen
  const defaultValues = { id, title };
  const queryKey = queryKeys.template(templateId);

  return useMutation({
    mutationFn: async (values: {
      started?: string;
      finished?: string;
      comment?: string;
    }) =>
      await updateTemplate(templateId, {
        ...defaultValues,
        ...values,
      }),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Template) => ({
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

export const TemplateContext = createContext<Template>({
  id: 0,
  title: "",
  description: null,
});
