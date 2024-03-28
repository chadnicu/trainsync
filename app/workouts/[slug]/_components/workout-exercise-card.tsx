import { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getYouTubeEmbedURL, slugify } from "@/lib/utils";
import { P, typography } from "@/components/typography";
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
  useAddCommentToExercise,
  useRemoveExerciseFromWorkout,
  useSwapExerciseInWorkout,
  useWorkoutExercises,
} from "@/hooks/workouts/exercises";
import DeleteDialog from "@/components/delete-dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { ResponsiveComboBox } from "@/components/responsive-combobox";
import LastSetsSkeleton from "./last-sets-skeleton";
import LoadingSpinner from "@/components/loading-spinner";
import { useCreateSet } from "@/hooks/sets";

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
    lastSets,
    order,
  } = useContext(WorkoutExerciseContext);
  const { mutate: addSet, isPending: setPending } = useCreateSet();
  const { mutate: addComment, isPending: commentPending } =
    useAddCommentToExercise();
  const { mutate: removeExercise } = useRemoveExerciseFromWorkout();
  const {
    data: { inWorkout, other },
  } = useWorkoutExercises();
  const { mutate: swapExercise } = useSwapExerciseInWorkout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const current = parseInt(searchParams.get("exercise") ?? "1", 10);
  const prev = current > 1 ? current - 1 : current;
  const embedUrl = getYouTubeEmbedURL(url);

  const LastSets = () => {
    if (lastSets && lastSets.length > 0 && lastSets[0])
      return (
        <Link
          href={slugify(
            "/workouts",
            lastSets[0].workoutTitle,
            lastSets[0].workoutId
          )}
          target="_blank"
        >
          <P className="text-sm text-muted-foreground hover:brightness-150 duration-300 max-w-[94%] break-words">
            Last:{" "}
            {lastSets.map((e, i) => (
              <span key={e.id}>
                {e.reps}x{e.weight}
                {i === lastSets.length - 1 ? " " : ", "}
              </span>
            ))}
            {lastSets[0].comment && <span>({lastSets[0].comment})</span>}
          </P>
        </Link>
      );
  };

  const isOptimistic = id === 0;

  return (
    <Card className={cn("max-w-lg w-full mx-auto text-left relative")}>
      <CardHeader>
        <LastSets />
        <CardTitle
          className={cn(
            typography("h3"),
            { "opacity-70": isOptimistic },
            "flex items-center gap-1"
          )}
        >
          {isOptimistic && <LoadingSpinner className="h-5 w-5" />}
          {title}
          <div className="absolute top-3 right-3">
            <DeleteDialog
              action={() => {
                removeExercise();
                if (prev <= 1) router.replace(pathname);
                else router.replace(pathname + "?exercise=" + prev);
              }}
              customTrigger={
                <AlertDialogTrigger
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                  disabled={isOptimistic}
                >
                  <TrashIcon className="h-4 w-4" />
                </AlertDialogTrigger>
              }
            />
          </div>
        </CardTitle>
        {(instructions || todo) && (
          <CardDescription
            className={cn("space-y-2", { "opacity-70": isOptimistic })}
          >
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
        <div className="flex justify-center">
          {comment ? (
            <ResponsiveFormDialog
              trigger={
                <button className="text-left">
                  <CommentAlert>{comment}</CommentAlert>
                </button>
              }
              title={"Edit comment"}
              description={`Edit ${title}'s comment in this workout`}
            >
              <CommentForm
                mutate={addComment}
                submitButtonText="Edit"
                isSubmitting={commentPending}
                deleteComment={() => addComment({ comment: "" })}
              />
            </ResponsiveFormDialog>
          ) : (
            <ResponsiveFormDialog
              trigger={
                <Button variant={"outline"} disabled={isOptimistic}>
                  Add comment
                </Button>
              }
              title={`Add comment`}
              description={`Add comment to ${title} in this workout`}
            >
              <CommentForm
                mutate={addComment}
                submitButtonText="Add"
                isSubmitting={commentPending}
              />
            </ResponsiveFormDialog>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ResponsiveComboBox
          trigger={
            <Button variant="outline" disabled={isOptimistic}>
              Swap
            </Button>
          }
          data={other.map(({ id, title }) => ({
            id,
            title,
          }))}
          placeholder="Search exercise.."
          mutate={({ exerciseId }) =>
            swapExercise({ workoutExerciseId: id, exerciseId })
          }
        />
        <ResponsiveFormDialog
          trigger={<Button disabled={isOptimistic}>Add set</Button>}
          title="Add set"
          description={`Add a new set to ${title}`}
          drawerContentClassname="min-w-[330px]:max-h-[78vw]"
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
