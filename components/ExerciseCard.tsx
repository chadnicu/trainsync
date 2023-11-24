"use client";

import React from "react";
import { Exercise } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExercise, editExercise } from "@/app/(pages)/actions";
import { exerciseSchema } from "./ExerciseForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@clerk/nextjs";
import EditButton from "./EditButton";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { DeleteButton } from "./DeleteButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
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

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await deleteExercise(id);
      queryClient.invalidateQueries(["exercises"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(["exercises"], (old: any) =>
        old.filter((e: any) => e.id && e.id !== id)
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

  return (
    <Card
      className={cn("flex h-full max-w-[350px] flex-col justify-between", {
        "opacity-50": !id,
      })}
    >
      <CardHeader className="relative pb-3 text-left">
        {!id && <LoadingSpinner className="absolute right-[5px] top-[8px]" />}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{instructions}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        {embedUrl && (
          <iframe
            src={embedUrl}
            width="299"
            height="168"
            title="YouTube video player"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md"
          ></iframe>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pb-5">
        <EditFormButton exercise={exercise} />
        <DeleteButton disabled={!id} mutate={() => mutate(id)} />
      </CardFooter>
    </Card>
  );
}

function EditFormButton({ exercise }: { exercise: Exercise }) {
  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      title: exercise.title,
      instructions: exercise.instructions ?? "",
      url: exercise.url ?? "",
    },
  });

  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: editOptimistically } = useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) => {
      await editExercise(exercise.id, values);
      queryClient.invalidateQueries(["exercises"]);
    },
    onMutate: async (values: z.infer<typeof exerciseSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(["exercises"], (old: any) => {
        // console.log(old, "old");
        return old.map((e: Exercise) =>
          e.id === exercise.id ? { id: exercise.id, userId, ...values } : e
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
  );
}
