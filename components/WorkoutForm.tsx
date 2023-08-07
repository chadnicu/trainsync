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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { createWorkout } from "@/app/(pages)/actions";
import { useState } from "react";
import DatePicker from "./DatePicker";

export const workoutSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date of the workout is required.",
  }),
});

export default function WorkoutForm() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof workoutSchema>>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof workoutSchema>) {
    setOpen(false);
    form.reset();
    await createWorkout(values).then(() => {
      queryClient.invalidateQueries(["workouts"]);
    });
  }

  const { userId } = useAuth();

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async (newWorkout: z.infer<typeof workoutSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["workouts"] });
      const previous = queryClient.getQueryData(["workouts"]);
      queryClient.setQueryData(["workouts"], (old: any) => {
        return [...old, { userId, ...newWorkout }];
      });
      return { previous };
    },
    onError: (err, newExercise, context) =>
      queryClient.setQueryData(["workouts"], context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  });

  return (
    <>
      {open ? (
        <Form {...form}>
          <div className="flex justify-center lg:justify-end">
            <form
              onSubmit={form.handleSubmit(
                async (data: z.infer<typeof workoutSchema>) => {
                  mutate(data);
                }
              )}
              className="w-fit space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of the workout" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optionally describe this workout"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <DatePicker field={field} />
                    {/* <FormDescription>
                      Your date of birth is used to calculate your age.
                    </FormDescription> */}
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
