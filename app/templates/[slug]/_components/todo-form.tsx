"use client";

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
import LoadingSpinner from "@/components/loading-spinner";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";
import { ReactNode, useContext } from "react";
import { ToDoInput } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import DeleteDialog from "@/components/delete-dialog";
import { TemplateExerciseContext } from "@/hooks/tanstack/template-exercise";
import { templateToDoSchema } from "@/lib/validators/template-exercise";

export default function ToDoForm({
  mutate,
  isSubmitting,
  submitButtonText,
  variant,
}: {
  mutate: (values: ToDoInput) => void;
  isSubmitting?: boolean;
  submitButtonText?: ReactNode;
  variant?: "add" | "edit";
}) {
  const { toDo } = useContext(TemplateExerciseContext);
  const defaultValues = { toDo: toDo ?? undefined };
  const form = useForm<ToDoInput>({
    resolver: zodResolver(templateToDoSchema),
    defaultValues,
  });
  const setOpen = useContext(ToggleDialogFunction);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          mutate(values);
          setOpen(false);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="toDo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise to-do</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    toDo && toDo?.length
                      ? toDo
                      : "Do 2 sets of 5-8 reps to failure"
                  }
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This could be the number of sets, reps, RIR, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {variant === "edit" && (
          <div className="float-left ml-24 md:ml-0">
            <DeleteDialog
              action={() => {
                mutate({ toDo: "" });
                setOpen(false);
              }}
            />
          </div>
        )}
        <Button
          type="submit"
          className="float-right flex justify-center items-center"
          disabled={isSubmitting}
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
