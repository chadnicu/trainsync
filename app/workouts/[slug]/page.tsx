"use client";

import { ResponsiveComboBox } from "@/components/responsive-combobox";
import { Button } from "@/components/ui/button";
import WorkoutExerciseCard from "./_components/workout-exercise-card";
import { H1, P } from "@/components/typography";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ExercisesPagination from "./_components/exercises-pagination";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import EditWorkoutExercises from "./_components/edit-workout-exercises";
import { getIdFromSlug } from "@/lib/utils";
import { useWorkout } from "@/hooks/workouts";
import {
  WorkoutExerciseContext,
  useAddExerciseToWorkout,
  useWorkoutExercises,
} from "@/hooks/workouts/exercises";
import { useEffect } from "react";
import { WorkoutContext } from "@/hooks/workouts";
import Timer from "./_components/timer";
import { useSets } from "@/hooks/sets";
import { Set } from "@/types";

type Params = {
  params: { slug: string };
};

function getLastSets(sets: Set[], workoutId: number) {
  const index = sets.findIndex((e) => e.workoutId === workoutId);

  sets = sets.filter((e) => e.workoutId !== workoutId);

  const lastSets: Set[] = [];

  for (let i = index; i < sets.length; i++) {
    if (i < 0) i = 0;

    lastSets.push(sets[i]);
    if (i < sets.length - 1 && sets[i]?.workoutId !== sets[i + 1]?.workoutId) {
      return lastSets;
    }
  }
}

export default function Workout({ params: { slug } }: Params) {
  const workoutId = getIdFromSlug(slug);
  const { data: workout, isLoading, isFetching, isSuccess } = useWorkout();
  const {
    data: { inWorkout, other },
  } = useWorkoutExercises();
  const { data: sets } = useSets();
  const { mutate: addExerciseToWorkout } = useAddExerciseToWorkout();

  const searchParams = useSearchParams();
  const value = searchParams.get("exercise");
  const exerciseIndex = value ? parseInt(value, 10) : -1;

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const value = searchParams.get("exercise");
    if (!value && inWorkout.length > 0) router.replace("?exercise=1");
  }, [inWorkout, router, searchParams]);

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
          </>
        )}
        {!!((isFetching || isLoading) && !workout?.title) && (
          <>
            <H1>Loading..</H1>
            <P className="max-w-lg mx-auto">Workout with id {workoutId}</P>
          </>
        )}

        <ExercisesPagination length={inWorkout.length} />
        {inWorkout[exerciseIndex - 1] ? (
          <WorkoutExerciseContext.Provider
            value={{
              ...inWorkout[exerciseIndex - 1],
              sets: sets.filter(
                (e) => e.workoutExerciseId === inWorkout[exerciseIndex - 1].id
              ),
              lastSets:
                getLastSets(
                  sets.filter(
                    (e) =>
                      e.exerciseId === inWorkout[exerciseIndex - 1].exerciseId
                  ),
                  workoutId
                ) ?? [],
            }}
          >
            <WorkoutExerciseCard />
          </WorkoutExerciseContext.Provider>
        ) : (
          <>{/* <WorkoutExerciseSkeleton /> */}</>
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
