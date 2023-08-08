"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { createExercise } from "@/app/(pages)/actions";

const isYouTubeLink = (url: string): boolean => {
  // Regular expressions to match valid YouTube links
  const youtubeRegex1 = /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/;
  const youtubeRegex2 =
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
  const youtubeRegex3 =
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
  const youtubeRegex4 =
    /^(https?:\/\/)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;

  return (
    youtubeRegex1.test(url) ||
    youtubeRegex2.test(url) ||
    youtubeRegex3.test(url) ||
    youtubeRegex4.test(url)
  );
};

export const exerciseSchema = z.object({
  title: z.string().nonempty(),
  instructions: z.string().optional(),
  url: z
    .string()
    .url()
    .refine((url) => isYouTubeLink(url), "Invalid YouTube Link")
    .optional()
    .or(z.literal("")),
});

export default function ExerciseForm() {
  const [open, setOpen] = useState(false);

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
    setOpen(false);
    form.reset();
    await createExercise(values).then(() =>
      queryClient.invalidateQueries(["exercises"])
    );
  }

  const { userId } = useAuth();

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async (newExercise: z.infer<typeof exerciseSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(["exercises"], (old: any) => {
        return [...old, { userId, ...newExercise }];
      });
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
    <>
      {open ? (
        <Form {...form}>
          <div className="flex justify-center lg:justify-end">
            <form
              onSubmit={form.handleSubmit(
                async (data: z.infer<typeof exerciseSchema>) => mutate(data)
              )}
              className="w-fit space-y-6 text-left"
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
                      <Input
                        placeholder="Link to demonstration video"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <div className="flex justify-between gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
                <Button variant={"outline"} type="submit" className="w-full">
                  Create
                </Button>
              </div>
            </form>
          </div>
        </Form>
      ) : (
        <div className="flex justify-end">
          <Button variant={"outline"} onClick={() => setOpen(true)}>
            Add new
          </Button>
        </div>
      )}
    </>
  );
}
