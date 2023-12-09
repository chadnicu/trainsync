"use client";

import { commentWorkout, getWorkoutComment } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const commentSchema = z.object({
  comment: z.string(),
});

export default function CommentForm({
  workoutId,
  comment,
}: {
  workoutId: number;
  comment: string | null;
}) {
  const queryKey = `comment-workout-${workoutId}`;

  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => getWorkoutComment(workoutId),
    initialData: comment,
  });

  const queryClient = useQueryClient();

  const [editable, setEditable] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: data ?? "",
    },
  });

  async function onSubmit({ comment }: z.infer<typeof commentSchema>) {
    setEditable(false);
    await commentWorkout(workoutId, comment).then(() =>
      queryClient.invalidateQueries([queryKey])
    );
  }

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async ({ comment }: z.infer<typeof commentSchema>) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });
      const previous = await queryClient.getQueryData([queryKey]);
      queryClient.setQueryData([queryKey], comment);
      return { previous };
    },
    onError: (err, newExercise, context) =>
      queryClient.setQueriesData([queryKey], context?.previous),
    onSettled: async () =>
      queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  return editable ? (
    <Card className="mx-auto mb-1 grid w-fit p-1">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">Comment on this workout</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pb-2">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(
              async (data: z.infer<typeof commentSchema>) => mutate(data)
            )}
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
                            // placeholder={comment}
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
      className="mx-auto w-fit rounded-2xl rounded-tl-none p-6 font-normal"
      onClick={() => setEditable(true)}
    >
      {data ? data : "Comment on this workout"}
    </Button>
  );
}
