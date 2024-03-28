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
import { WorkoutExerciseContext } from "@/hooks/workouts/exercises";
import { Textarea } from "@/components/ui/textarea";
import { exerciseCommentSchema } from "@/lib/validators/workout-exercise";
import DeleteDialog from "@/components/delete-dialog";

export default function CommentForm({
  mutate,
  isSubmitting,
  submitButtonText,
  deleteComment,
}: {
  mutate: (values: CommentInput) => void;
  isSubmitting?: boolean;
  submitButtonText?: ReactNode;
  deleteComment?: () => void;
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
        {deleteComment !== undefined && (
          <div className="float-left ml-24 md:ml-0">
            <DeleteDialog
              action={() => {
                deleteComment();
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
