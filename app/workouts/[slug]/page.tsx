"use client";

import { ResponsiveComboBox } from "@/components/responsive-combobox";
import { Button } from "@/components/ui/button";
import WorkoutExerciseCard from "./_components/workout-exercise-card";
import { H1, P } from "@/components/typography";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ExercisesPagination from "./_components/exercises-pagination";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import EditWorkoutExercises from "./_components/edit-workout-exercises";
import { cn, getIdFromSlug } from "@/lib/utils";
import {
  useUpdateDynamicWorkout,
  useWorkout,
  WorkoutContext,
} from "@/hooks/tanstack/workouts";
import {
  WorkoutExerciseContext,
  useAddExerciseToWorkout,
  useWorkoutExercises,
} from "@/hooks/tanstack/workout-exercises";
import { useEffect } from "react";
import Timer from "./_components/timer";
import WorkoutExerciseSkeleton from "./_components/workout-exercise-skeleton";
import CommentAlert from "@/components/comment";
import WorkoutCommentForm from "./_components/workout-comment-form";
import dayjs from "@/lib/day-js";
import { useSets } from "@/hooks/tanstack/sets";

type Params = {
  params: { slug: string };
};

export default function Workout({ params: { slug } }: Params) {
  const workoutId = getIdFromSlug(slug);
  const { data: workout, isLoading, isFetching, isSuccess } = useWorkout();
  const {
    data: { inWorkout, other },
  } = useWorkoutExercises();
  const { data: sets } = useSets(); // just to cache em i guess
  const { mutate: addExerciseToWorkout, isPending: isAdding } =
    useAddExerciseToWorkout();

  const searchParams = useSearchParams();
  const value = searchParams.get("exercise");
  const exerciseIndex = value ? parseInt(value, 10) : -1;

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const value = searchParams.get("exercise");
    if (!value && inWorkout.length > 0 && !isAdding)
      router.replace("?exercise=1");
  }, [pathname, router, searchParams, inWorkout, isAdding]);

  const { mutate: updateWorkout, isPending: updateWorkoutPending } =
    useUpdateDynamicWorkout();

  const dayJsDate = dayjs(workout?.date);
  const formattedDate = dayJsDate.format("DD-MM-YYYY");

  return (
    <>
      {isSuccess && (
        <WorkoutContext.Provider value={workout}>
          <Timer />
        </WorkoutContext.Provider>
      )}

      <section className="sm:container text-center space-y-4 mt-[52.5px]">
        {isSuccess && (
          <>
            <H1>{workout.title}</H1>
            {workout.description && (
              <P className="max-w-lg mx-auto">{workout.description}</P>
            )}

            <WorkoutContext.Provider value={workout}>
              {workout.comment ? (
                <ResponsiveFormDialog
                  trigger={
                    <button
                      className="text-left"
                      disabled={updateWorkoutPending}
                    >
                      <CommentAlert
                        className={cn({ "opacity-70": updateWorkoutPending })}
                      >
                        {workout.comment}
                      </CommentAlert>
                    </button>
                  }
                  title={"Edit comment"}
                  description={`Edit comment for ${workout.title} (${formattedDate})`}
                >
                  <WorkoutCommentForm
                    mutate={({ comment }) =>
                      updateWorkout({
                        started: workout.started ?? undefined,
                        finished: workout.finished ?? undefined,
                        comment,
                      })
                    }
                    submitButtonText="Edit"
                    isSubmitting={updateWorkoutPending}
                    variant="edit"
                  />
                </ResponsiveFormDialog>
              ) : (
                <ResponsiveFormDialog
                  trigger={
                    <Button variant={"outline"} disabled={updateWorkoutPending}>
                      Add workout comment
                    </Button>
                  }
                  title={`Add comment`}
                  description={`Add comment to ${workout.title} (${formattedDate})`}
                >
                  <WorkoutCommentForm
                    mutate={({ comment }) =>
                      updateWorkout({
                        started: workout.started ?? undefined,
                        finished: workout.finished ?? undefined,
                        comment,
                      })
                    }
                    submitButtonText="Add"
                    isSubmitting={updateWorkoutPending}
                  />
                </ResponsiveFormDialog>
              )}
            </WorkoutContext.Provider>
          </>
        )}
        {!!((isFetching || isLoading) && !workout?.title) && (
          <>
            <H1>Loading..</H1>
            <P className="max-w-lg mx-auto">Workout with id {workoutId}</P>
          </>
        )}

        <ExercisesPagination length={inWorkout.length} />
        {exerciseIndex > 0 && inWorkout[exerciseIndex - 1] ? (
          <WorkoutExerciseContext.Provider value={inWorkout[exerciseIndex - 1]}>
            <WorkoutExerciseCard />
          </WorkoutExerciseContext.Provider>
        ) : (
          <>
            {!!(exerciseIndex > 0 && inWorkout.length > 0) && (
              <WorkoutExerciseSkeleton />
            )}
          </>
        )}

        <div className="flex flex-col gap-2 min-[370px]:flex-row w-fit mx-auto">
          <ResponsiveFormDialog
            trigger={
              inWorkout.length > 1 && (
                <Button variant={"outline"}>Edit exercise order</Button>
              )
            }
            title="Edit exercise order"
            description="Simply click on the exercises to number them in order"
          >
            <EditWorkoutExercises exercises={inWorkout} />
          </ResponsiveFormDialog>
          <ResponsiveComboBox
            trigger={
              <Button variant="outline">
                Add {inWorkout.length > 0 ? "another" : "an"} exercise
              </Button>
            }
            data={other.map(({ id, title }) => ({
              id,
              title,
            }))}
            placeholder="Search exercise.."
            mutate={({ exerciseId }) => {
              router.replace(pathname + "?exercise=" + (inWorkout.length + 1));
              return addExerciseToWorkout({
                exerciseId,
                order:
                  inWorkout.length > 0
                    ? inWorkout[inWorkout.length - 1].order + 1
                    : 1,
              });
            }}
          />
        </div>
      </section>
    </>
  );
}
