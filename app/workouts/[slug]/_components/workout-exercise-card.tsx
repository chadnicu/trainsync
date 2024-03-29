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
} from "@/hooks/tanstack/workout-exercises";
import DeleteDialog from "@/components/delete-dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { ResponsiveComboBox } from "@/components/responsive-combobox";
import LoadingSpinner from "@/components/loading-spinner";
import { useCreateSet, useSets } from "@/hooks/tanstack/sets";
import { Set } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

function getLastSets(sets: Set[], workoutId: number) {
  const lastSets: Set[] = [];

  const index = sets.findIndex((e) => e.workoutId === workoutId);

  let i = index < 0 ? 0 : index;
  for (; i < sets.length; i++) {
    if (sets[i].workoutId !== workoutId) {
      lastSets.push(sets[i]);
      if (i < sets.length - 1 && sets[i].workoutId !== sets[i + 1].workoutId) {
        return lastSets;
      }
    }
  }
}

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
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const current = parseInt(searchParams.get("exercise") ?? "1", 10);
  const prev = current > 1 ? current - 1 : current;

  const embedUrl = getYouTubeEmbedURL(url);

  const value = searchParams.get("exercise");
  const exerciseIndex = value ? parseInt(value, 10) : -1;
  console.log(exerciseIndex);

  const { data, isLoading: setsLoading, isFetching: setsFetching } = useSets();
  const sets = data.filter(
    (e) => e.workoutExerciseId === inWorkout[exerciseIndex - 1].id
  );
  const lastSets =
    getLastSets(
      data.filter(
        (e) => e.exerciseId === inWorkout[exerciseIndex - 1].exerciseId
      ),
      workoutId
    ) ?? [];

  const LastSets = () => {
    if (setsLoading || setsFetching)
      return <Skeleton className="h-4 w-[90%] sm:w-[94%]" />;

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
          <P className="text-sm text-muted-foreground hover:brightness-150 duration-300 max-w-[90%] sm:max-w-[94%] break-words">
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
            className={cn(
              // this is fucked up why tf does only vw or fixed values work?
              "space-y-2 bg-red-500 p-0 m-0 max-w-[78vw] break-words",
              {
                "opacity-70": isOptimistic,
              }
            )}
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
          {comment && (
            <ResponsiveFormDialog
              trigger={
                <button className="text-left" disabled={isOptimistic}>
                  <CommentAlert className={cn({ "opacity-70": isOptimistic })}>
                    {comment}
                  </CommentAlert>
                </button>
              }
              title={"Edit comment"}
              description={`Edit ${title}'s comment in this workout`}
            >
              <CommentForm
                mutate={addComment}
                submitButtonText="Edit"
                isSubmitting={commentPending}
                variant="edit"
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
        {comment && (
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
