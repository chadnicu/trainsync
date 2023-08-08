"use client";

import EditButton from "./EditButton";
import { DeleteButton } from "./DeleteButton";
import { deleteExercise, editExercise } from "@/app/(pages)/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Exercise } from "@/lib/types";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseSchema } from "./ExerciseForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const queryClient = useQueryClient();

  const { id, title, instructions, url } = exercise;

  const playbackId = url?.includes("/watch?v=")
    ? url?.split("/watch?v=")[1]
    : url?.includes(".be/")
    ? url.split(".be/")[1]
    : url?.includes("?feature=share")
    ? url?.split("shorts/")[1].split("?feature=share")[0]
    : url?.includes("shorts/")
    ? url?.split("shorts/")[1]
    : "";

  const embedUrl = playbackId
    ? "https://www.youtube.com/embed/" + playbackId
    : url;

  const { mutate } = useMutation({
    mutationFn: async () => {
      await deleteExercise(id);
      queryClient.invalidateQueries(["exercises"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(["exercises"], (old: any) =>
        old.filter((e: any) => e.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      title: exercise.title,
      instructions: exercise.instructions ?? "",
      url: exercise.url ?? "",
    },
  });

  const { userId } = useAuth();

  const { mutate: editOptimistically } = useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) => {
      await editExercise(exercise.id, values);
      queryClient.invalidateQueries(["exercises"]);
    },
    onMutate: async (values: z.infer<typeof exerciseSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(["exercises"], (old: any) => {
        console.log(old, "old");
        return old.map((e: Exercise) =>
          e.id === id ? { id, userId, ...values } : e
        );
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
    <div className="grid w-[299px] gap-2 text-left">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm">{instructions}</p>
      {embedUrl && (
        <iframe
          src={embedUrl}
          width="299"
          height="168"
          title="YouTube video player"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
      <div className="flex gap-2">
        <EditButton description="exercise">
          <FormProvider {...form}>
            <form
              className="grid gap-4 text-left"
              onSubmit={form.handleSubmit(
                (values: z.infer<typeof exerciseSchema>) =>
                  editOptimistically(values)
              )}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name of the exercise"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tips about how to perform this movement"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">YouTube URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Link to demonstration video"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit">Save changes</Button>
            </form>
          </FormProvider>
        </EditButton>
        <DeleteButton mutate={() => mutate(id)} />
      </div>
    </div>
  );
}
