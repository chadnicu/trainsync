import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { addExercise, getExercises } from "@/server/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exerciseSchema } from "./edit-exercise-form";
import { ExerciseContext } from "@/app/exercises/page";
import { useContext } from "react";

export default function AddExerciseForm() {
  const { id, ...defaultValues } = useContext(ExerciseContext);

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) =>
      await addExercise(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) => [
          { ...values, id: 0 },
          ...old,
        ]
      );
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Bench Press" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of your exercise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Retract your scapula, arch your back, lower slowly then press back up"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                These are the instructions for your exercise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the URL to your exercise&apos;s YouTube video.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="float-right">
          Submit
        </Button>
      </form>
    </Form>
  );
}
