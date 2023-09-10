"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSet } from "@/app/(pages)/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useAuth } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const setSchema = z.object({
  reps: z.coerce.number().positive(),
  weight: z.coerce.number(),
});

export default function AddSetForm({
  workoutExerciseId,
}: {
  workoutExerciseId: number;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues: {
      reps: 0,
      weight: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof setSchema>) {
    setOpen(false);
    form.reset();
    await createSet(values, workoutExerciseId).then(() => {
      queryClient.invalidateQueries(["logs"]);
    });
  }

  const { userId } = useAuth();

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async (newSet: z.infer<typeof setSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["logs"] });
      const previous = queryClient.getQueryData(["logs"]);
      queryClient.setQueryData(["logs"], (old: any) => {
        return [
          ...old,
          {
            ...newSet,
            workoutExerciseId,
            userId,
            // title: "title",
            // exerciseId: 0,
          },
        ];
      });
      return { previous };
    },
    onError: (err, newExercise, context) =>
      queryClient.setQueryData(["logs"], context?.previous),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });

  return (
    <>
      {open ? (
        <Card>
          <CardHeader>
            <CardTitle>Add set</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  async (data: z.infer<typeof setSchema>) => {
                    mutate(data);
                  }
                )}
                className="space-y-2"
              >
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="reps"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormLabel>Reps</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-20 text-center"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-20 text-center"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center">
          <Button
            variant={"outline"}
            className="w-24"
            onClick={() => setOpen(true)}
          >
            Add set
          </Button>
        </div>
      )}
    </>
  );
}
