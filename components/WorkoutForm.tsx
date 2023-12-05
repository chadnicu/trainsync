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
import { createWorkout } from "@/app/actions";
import { useState } from "react";
import DatePicker from "./DatePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
        return [{ userId, ...newWorkout, id: 0 }, ...old];
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
        <Card className="h-fit w-fit text-left">
          <CardHeader>
            <CardTitle className="text-lg">Create workout</CardTitle>
            <CardDescription>Create a new workout from scratch</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <div className="flex justify-center lg:justify-end">
                <form
                  onSubmit={form.handleSubmit(
                    async (data: z.infer<typeof workoutSchema>) => {
                      mutate(data);
                    }
                  )}
                  className="w-fit space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Title of the workout"
                            {...field}
                          />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <div className="flex justify-between gap-2 pt-4">
                    <Button
                      variant={"outline"}
                      onClick={() => setOpen(false)}
                      className="w-full"
                    >
                      Close
                    </Button>
                    <Button
                      variant={"default"}
                      type="submit"
                      className="w-full"
                    >
                      Create
                    </Button>
                  </div>
                </form>
              </div>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button
            variant={"outline"}
            onClick={() => setOpen(true)}
            className="w-full"
          >
            Create new
          </Button>
        </div>
      )}
    </>
  );
}
