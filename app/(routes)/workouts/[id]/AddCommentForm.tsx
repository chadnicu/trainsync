"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { commentSchema } from "./CommentForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editWorkoutExercise } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function AddCommentForm({
  workoutId,
  workoutExerciseId,
  comment,
}: {
  workoutId: number;
  workoutExerciseId: number;
  comment: string | null;
}) {
  const queryKey = [`exercises-workout-${workoutId}`];
  const queryClient = useQueryClient();

  const [editable, setEditable] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: comment ? comment : "",
    },
  });

  async function onSubmit({ comment }: z.infer<typeof commentSchema>) {
    setEditable(false);
    await editWorkoutExercise(workoutExerciseId, comment);
    queryClient.invalidateQueries(queryKey);
  }

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async ({ comment }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => {
        return {
          otherExercises: old.otherExercises,
          workoutsExercises: old.workoutsExercises.map((e: any) => ({
            ...e,
            comment:
              e.workoutExerciseId === workoutExerciseId ? comment : e.comment,
          })),
        };
      });
      return { previous };
    },
    onError: (err, newExercise, context) =>
      queryClient.setQueryData(queryKey, context?.previous),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return editable ? (
    <Card className="mx-auto mt-2 grid w-fit p-1 sm:mt-0">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">Comment on this exercise</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pb-2">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => mutate(data))}
            className="grid gap-2 pb-2"
          >
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between gap-2">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={comment ? comment : ""}
                            className="w-full text-center"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant={"outline"}
                onClick={() => setEditable(false)}
                className="w-full"
              >
                Close
              </Button>
              <Button variant={"default"} type="submit" className="w-full">
                Done
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  ) : (
    <Button
      variant={"secondary"}
      className="mx-auto mt-2 h-fit w-fit max-w-[80%] rounded-2xl rounded-tl-none p-4 font-normal sm:mt-0 sm:max-w-[300px]"
      onClick={() => setEditable(true)}
    >
      {comment ? comment : "Add comment"}
    </Button>
  );
}
