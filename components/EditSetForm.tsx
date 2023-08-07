"use client";

import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editSet } from "@/app/(pages)/actions";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useAuth } from "@clerk/nextjs";

export const setSchema = z.object({
  reps: z.coerce.number().positive(),
  weight: z.coerce.number(),
});

export default function EditSetForm({
  setId,
  workoutExerciseId,
  defaultValues,
  setEditable,
}: {
  setId: number;
  workoutExerciseId: number;
  defaultValues: { reps: number; weight: number };
  setEditable: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof setSchema>) {
    setEditable();
    form.reset();
    await editSet(values, setId).then(() => {
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
        return old
          .filter((e: any) => e.id !== setId)
          .concat({
            ...newSet,
            workoutExerciseId,
            userId,
            // title: "title",
            // exerciseId: "exid",
          });
      });
      return { previous };
    },
    onError: (err, newExercise, context) =>
      queryClient.setQueryData(["logs"], context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["logs"] }),
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            async (data: z.infer<typeof setSchema>) => {
              mutate(data);
            }
          )}
          className="flex gap-2 space-y-2"
        >
          <FormField
            control={form.control}
            name="reps"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-2">
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
          <div className="flex justify-between gap-2">
            <Button
              variant={"outline"}
              onClick={() => setEditable()}
              className="w-full"
            >
              Close
            </Button>
            <Button variant={"outline"} type="submit" className="w-full">
              Done
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
