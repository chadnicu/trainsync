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
import { useAddComment, useAddSet, useRemoveExercise } from "../_utils/hooks";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { useQueryClient } from "@tanstack/react-query";
import CommentForm from "./comment-form";
import WorkoutSetCard from "./workout-set-card";
import SetForm from "./set-form";
import { TrashIcon } from "@radix-ui/react-icons";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
    order,
  } = useContext(WorkoutExerciseContext);

  const embedUrl = getYouTubeEmbedURL(url);

  const queryClient = useQueryClient();
  const { mutate: addSet, isPending: setPending } = useAddSet(queryClient);

  const { mutate: addComment, isPending: commentPending } =
    useAddComment(queryClient);

  const { mutate: removeExercise } = useRemoveExercise(queryClient);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = parseInt(searchParams.get("exercise") ?? "1", 10);
  const prev = current > 1 ? current - 1 : current;

  return (
    <Card className={cn("max-w-lg w-full mx-auto text-left relative")}>
      <CardHeader>
        <CardTitle className={typography("h3")}>
          {title}
          <Button
            variant={"ghost"}
            className="absolute top-3 right-3 h-8 w-8"
            size={"icon"}
            onClick={() => {
              removeExercise();
              // router.push(pathname + "?exercise=" + prev);
              router.replace(pathname + "?exercise=" + prev);
              // nush care mai bn
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </CardTitle>
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
