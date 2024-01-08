import * as React from "react";

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
import { ExerciseContext } from "@/app/exercises/context";
import LoadingSpinner from "./loading-spinner";
import { DialogContext } from "./responsive-form-dialog";

export const exerciseSchema = z.object({
  title: z.string().min(1).max(80),
  instructions: z.string().min(0).max(255).optional(),
  url: z
    .string()
    .url()
    .refine((url) =>
      /^(https?:\/\/)?(www\.)?(youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)?([a-zA-Z0-9_-]{11})/.test(
        url
      )
    )
    .optional()
    .or(z.literal("")),
});

export default function ExerciseForm({
  mutate,
  isSubmitting,
  submitButtonText,
}: {
  mutate: (values: z.infer<typeof exerciseSchema>) => void;
  isSubmitting?: boolean;
  submitButtonText?: React.ReactNode;
}) {
  const { title, instructions, url } = React.useContext(ExerciseContext);

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: { title, instructions: instructions ?? "", url: url ?? "" },
  });

  const setOpen = React.useContext(DialogContext);

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
        <Button
          type="submit"
          className="float-right flex justify-center items-center"
          onClick={() => setOpen(false)}
        >
          {submitButtonText ?? "Submit"}
          {isSubmitting && (
            <LoadingSpinner className="ml-1 w-4 h-4 text-background/80 fill-background/80" />
          )}
        </Button>
      </form>
    </Form>
  );
}
