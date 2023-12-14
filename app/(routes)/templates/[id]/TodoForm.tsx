"use client";

import { editTemplateExercise } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Exercise } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export const todoSchema = z.object({
  todo: z.string(),
});

export default function TodoForm({
  templateId,
  exerciseTemplateId,
  exercises,
}: {
  templateId: number;
  exerciseTemplateId: number;
  exercises: {
    templatesExercises: (Exercise & { todo: string | null })[];
    otherExercises: Exercise[];
  };
}) {
  const queryKey = [`template-${templateId}`];
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({ todo }: z.infer<typeof todoSchema>) => {
      setOpen(false);
      await editTemplateExercise(exerciseTemplateId, todo);
      queryClient.invalidateQueries(queryKey);
    },
    onMutate: async ({ todo }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...exercises,
        templatesExercises: exercises.templatesExercises.map((e) => ({
          ...e,
          todo: e.id === exerciseTemplateId ? todo : e.todo,
        })),
      }));
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todo:
        exercises.templatesExercises.find((e) => e.id === exerciseTemplateId)
          ?.todo ?? "",
    },
  });

  return (
    <>
      {open ? (
        <Card className="space-y-3 p-3">
          <CardHeader className="p-0">
            <CardTitle>To do</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit((data) => mutate(data))}>
                <FormField
                  control={form.control}
                  name="todo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <div className="flex justify-between gap-2 pt-2">
                  <Button
                    variant={"outline"}
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                  <Button variant={"default"} type="submit" className="w-full">
                    Add
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setOpen(true)}>Add todo</Button>
      )}
    </>
  );
}
