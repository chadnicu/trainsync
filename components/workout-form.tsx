import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import LoadingSpinner from "./loading-spinner";
import { ToggleDialogFunction } from "./responsive-form-dialog";
import { ReactNode, useContext } from "react";
import { WorkoutFormData, workoutSchema } from "@/app/workouts/helpers";
import { WorkoutContext } from "@/app/workouts/helpers";

export default function WorkoutForm({
  mutate,
  isSubmitting,
  submitButtonText,
  variant,
}: {
  mutate: (values: WorkoutFormData) => void;
  isSubmitting?: boolean;
  submitButtonText?: ReactNode;
  variant?: "edit";
}) {
  const { title, description, date, started, finished, comment } =
    useContext(WorkoutContext);

  // continue with editform
  const isEditForm = variant === "edit";

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      title,
      description: description ?? "",
      date: date ? new Date(date) : new Date(),
      // started: started ?? "",
      // finished: finished ?? "",
      // comment: comment ?? "",
    },
  });

  const setOpen = useContext(ToggleDialogFunction);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          console.log(values);
          mutate({ ...values, date: values.date });
          setOpen(false);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Push A" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of your workout.
              </FormDescription>
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
                  placeholder="Chest, delts, triceps and abs."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the description for your workout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                {/* @ts-ignore */}
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                This is the date of your workout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isEditForm && (
          <>
            {/* <FormField
              control={form.control}
              name="started"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Started</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the timee you started your workout.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </>
        )}
        <Button
          type="submit"
          className="float-right flex justify-center items-center"
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
