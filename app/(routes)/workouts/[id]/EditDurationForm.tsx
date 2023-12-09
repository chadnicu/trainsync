"use client";
// fix this pls im losing my mind

import { finishWorkout, startWorkout } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const timeSchema = z.object({
  started: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: "Invalid time format. Expected HH:MM",
  }),
  finished: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: "Invalid time format. Expected HH:MM",
  }),
});

function HHMMToUnix(started: string, finished: string) {
  const startedDate = new Date(`1970-01-01T${started}:00`).getTime();
  const finishedDate = new Date(`1970-01-01T${finished}:00`).getTime();

  return [startedDate, finishedDate];
}

function unixToHHMM(unixTimestamp: number) {
  const date = new Date(unixTimestamp);
  return `${date.getHours()}:${date.getMinutes()}`;
}

export default function EditDurationForm({
  workoutId,
  started,
  finished,
}: {
  workoutId: number;
  started: number;
  finished: number;
}) {
  const [editable, setEditable] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof timeSchema>>({
    resolver: zodResolver(timeSchema),
    defaultValues: {
      started: unixToHHMM(started),
      finished: unixToHHMM(finished),
    },
  });

  async function onSubmit(values: z.infer<typeof timeSchema>) {
    setEditable(false);
    form.reset();
    const [started, finished] = HHMMToUnix(values.started, values.finished);
    console.log(values.started, values.finished, started, finished, "HEREE");
    await Promise.all([
      startWorkout(workoutId, started).then(() =>
        queryClient.invalidateQueries([`started-${workoutId}`])
      ),
      finishWorkout(workoutId, finished).then(() =>
        queryClient.invalidateQueries([`finished-${workoutId}`])
      ),
    ]);
  }

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async (values: z.infer<typeof timeSchema>) => {
      const [started, finished] = HHMMToUnix(values.started, values.finished);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: [`started-${workoutId}`] }),
        queryClient.cancelQueries({
          queryKey: [`finished-${workoutId}`],
        }),
      ]);
      const [prevStarted, prevFinished] = await Promise.all([
        queryClient.getQueryData([`started-${workoutId}`]),
        queryClient.getQueryData([`started-${workoutId}`]),
      ]);
      queryClient.setQueryData([`started-${workoutId}`], started);
      queryClient.setQueryData([`finished-${workoutId}`], finished);
      return { prevStarted, prevFinished };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData([`started-${workoutId}`], context?.prevStarted);
      queryClient.setQueryData(
        [`finished-${workoutId}`],
        context?.prevFinished
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`started-${workoutId}`] }),
        queryClient.invalidateQueries({ queryKey: [`finished-${workoutId}`] }),
      ]);
    },
  });

  return (
    <>
      {editable ? (
        <Card className="mb-1 grid p-1">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg">Edit session duration</CardTitle>
            {/* <CardDescription></CardDescription> */}
          </CardHeader>
          <CardContent className="p-4 pb-2">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(
                  async (data: z.infer<typeof timeSchema>) => mutate(data)
                )}
                className="grid gap-2 pb-2"
              >
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="started"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormControl>
                            <Input
                              type="time"
                              // placeholder={started}
                              className="w-full text-center"
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
                    name="finished"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormControl>
                            <Input
                              type="time"
                              // placeholder="0"
                              className="w-full text-center"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
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
          variant={"outline"}
          className="mx-auto w-fit"
          onClick={() => setEditable(true)}
        >
          Edit
        </Button>
      )}
    </>
  );
}
