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
import { CommentInput } from "@/types";
import { WorkoutExerciseContext } from "@/hooks/workout-exercises";
import { editWorkoutSchema } from "@/lib/validators/workout";
import { Textarea } from "@/components/ui/textarea";
import { exerciseCommentSchema } from "@/lib/validators/workout-exercise";

export default function CommentForm({
  mutate,
  isSubmitting,
  submitButtonText,
}: {
  mutate: (values: CommentInput) => void;
  isSubmitting?: boolean;
  submitButtonText?: ReactNode;
}) {
  const { comment } = useContext(WorkoutExerciseContext);
  const defaultValues = { comment: comment ?? undefined };
  const form = useForm<CommentInput>({
    resolver: zodResolver(exerciseCommentSchema),
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
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sets comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    comment && comment?.length
                      ? comment
                      : "Left one more rep in the tank each set"
                  }
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This comment applies to all the sets you added here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
