"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
// import { addExercise } from "@/app/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";
import { ExerciseType } from "@/app/exercises/Exercises";
import { useAuth } from "@clerk/nextjs";

export const exerciseSchema = z.object({
  title: z.string().nonempty(),
  instructions: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
});

export default function ExerciseForm() {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      title: "",
      instructions: "",
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof exerciseSchema>) {
    await axios
      .post("/api/exercises", values)
      .then(() => queryClient.invalidateQueries(["exercises"]));
  }

  const { userId } = useAuth();

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async (newExercise: z.infer<typeof exerciseSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(["exercises"], (old: any) => [
        ...old,
        { id: old?.length + 1, userId, ...newExercise },
      ]);
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  return (
    <Form {...form}>
      <form
        // action={addFramework} // server action
        // onSubmit={form.handleSubmit(onSubmit)} // api route
        onSubmit={form.handleSubmit(
          async (data: z.infer<typeof exerciseSchema>) => mutate(data)
          // im a jenius
        )}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Name of the exercise" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tips about how to perform this movement"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input placeholder="Link to demonstration video" {...field} />
              </FormControl>
              {/* <FormDescription>Framework{"'"}s github URL</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <div className="flex justify-center">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
}
