import { useContext } from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import CommentAlert from "@/components/comment";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import CommentForm from "./comment-form";
import WorkoutSetCard from "./workout-set-card";
import SetForm from "./set-form";
import { TrashIcon } from "@radix-ui/react-icons";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  WorkoutExerciseContext,
  useRemoveExerciseFromWorkout,
} from "@/hooks/workout-exercises";
import { useAddCommentToSets, useCreateSet } from "@/hooks/sets";
import DeleteDialog from "@/components/delete-dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function WorkoutExerciseCard() {
  const {
    // id,
    title,
    instructions,
    comment,
    todo,
    url,
    // exerciseId,
    // workout_id: workoutId,
    sets,
    // order,
  } = useContext(WorkoutExerciseContext);
  const { mutate: addSet, isPending: setPending } = useCreateSet();
  const { mutate: addComment, isPending: commentPending } =
    useAddCommentToSets();
  const { mutate: removeExercise } = useRemoveExerciseFromWorkout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const current = parseInt(searchParams.get("exercise") ?? "1", 10);
  const prev = current > 1 ? current - 1 : current;
  const embedUrl = getYouTubeEmbedURL(url);

  console.log(comment, "nigaer asa skid");

  return (
    <Card className={cn("max-w-lg w-full mx-auto text-left relative")}>
      <CardHeader>
        <CardTitle className={typography("h3")}>
          {title}
          <div className="absolute top-3 right-3">
            <DeleteDialog
              action={() => {
                removeExercise();
                router.replace(pathname + "?exercise=" + prev);
              }}
              customTrigger={
                <AlertDialogTrigger
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                  <TrashIcon className="h-4 w-4" />
                </AlertDialogTrigger>
              }
            />
          </div>
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
            className="rounded-md h-[44vw] w-full sm:w-full sm:h-[260px] mx-auto "
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
          trigger={
            <Button variant={"outline"}>
              {comment ? "Edit" : "Add"} comment
            </Button>
          }
          title={`${comment ? "Edit" : "Add"} comment`}
          description={`${
            comment ? "Edit" : "Add"
          } comment to ${title} in this workout`}
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
          drawerContentClassname="max-h-[272px]"
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
