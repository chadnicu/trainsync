import { useContext } from "react";
import { WorkoutExerciseContext } from "../_utils/context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getYouTubeEmbedURL } from "@/lib/utils";
import { typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import CommentAlert from "@/components/comment";
import { useAddComment, useAddSet } from "../_utils/hooks";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { useQueryClient } from "@tanstack/react-query";
import CommentForm from "./comment-form";
import WorkoutSetCard from "./workout-set-card";
import SetForm from "./set-form";

export default function WorkoutExerciseCard() {
  const {
    id,
    title,
    instructions,
    comment,
    todo,
    url,
    exerciseId,
    workout_id: workoutId,
    sets,
  } = useContext(WorkoutExerciseContext);

  const embedUrl = getYouTubeEmbedURL(url);

  const queryClient = useQueryClient();
  const { mutate: addSet, isPending: setPending } = useAddSet(queryClient);

  const { mutate: addComment, isPending: commentPending } =
    useAddComment(queryClient);

  console.log(sets);

  return (
    <Card className={cn("max-w-lg w-full mx-auto text-left")}>
      <CardHeader>
        <CardTitle className={typography("h3")}>{title}</CardTitle>
        {(instructions || todo) && (
          <CardDescription className="space-y-2">
            {instructions && <span className="block">{instructions}</span>}
            {todo && (
              <span className="text-foreground pt-2 border-t block">
                {todo}
              </span>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {embedUrl && (
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md h-[44vw] w-full sm:w-full sm:h-[260px] mx-auto"
          />
        )}
        <div>
          {sets.map((e) => (
            <WorkoutSetCard key={e.id} set={e} />
          ))}
        </div>
        {comment && <CommentAlert>{comment}</CommentAlert>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <ResponsiveFormDialog
          trigger={<Button variant={"outline"}>Add comment</Button>}
          title="Add comment"
          description={`Add a comment to ${title} in this workout`}
        >
          <CommentForm
            mutate={addComment}
            submitButtonText="Add"
            isSubmitting={commentPending}
          />
        </ResponsiveFormDialog>
        <ResponsiveFormDialog
          trigger={<Button>Add set</Button>}
          title="Add set"
          description={`Add a new set to ${title}`}
        >
          <SetForm
            submitAction={addSet}
            submitButtonText="Add"
            isSubmitting={setPending}
            defaultValues={{ reps: 0, weight: 0 }}
          />
        </ResponsiveFormDialog>
      </CardFooter>
    </Card>
  );
}
