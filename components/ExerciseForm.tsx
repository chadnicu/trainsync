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
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";

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

  return (
    <Form {...form}>
      <form
        // action={addFramework} // server action
        onSubmit={form.handleSubmit(onSubmit)} // api route
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
