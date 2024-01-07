import * as React from "react";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { editExercise, getExercises } from "@/server/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExerciseContext } from "@/app/exercises/page";

export const exerciseSchema = z.object({
  title: z.string().min(1).max(80),
  instructions: z.string().min(0).max(255).optional(),
  url: z
    .string()
    .url()
    .refine((url) =>
      /^(https?:\/\/)?(www\.)?(youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)?([a-zA-Z0-9_-]{11})/.test(
        url
      )
    )
    .optional()
    .or(z.literal("")),
});

export default function EditExerciseForm() {
  const { id, title, instructions, url } = React.useContext(ExerciseContext);

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: { title, instructions: instructions ?? "", url: url ?? "" },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) => {
      if (id !== 0) return await editExercise({ id, ...values });
    },
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) =>
          old.map((e) => (e.id === id ? values : e))
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Bench Press" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of your exercise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Retract your scapula, arch your back, lower slowly then press back up"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                These are the instructions for your exercise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the URL to your exercise&apos;s YouTube video.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="float-right">
          Edit
        </Button>
      </form>
    </Form>
  );
}
