"use client";

import { ResponsiveComboBox } from "@/components/responsive-combobox";
import { Button } from "@/components/ui/button";
import WorkoutExerciseCard from "./_components/workout-exercise-card";
import { H1, P } from "@/components/typography";
import { useSearchParams } from "next/navigation";
import ExercisesPagination from "./_components/exercises-pagination";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import EditWorkoutExercises from "./_components/edit-workout-exercises";
import { getIdFromSlug } from "@/lib/utils";
import { useWorkout } from "@/hooks/workouts";
import {
  WorkoutExerciseContext,
  useAddExerciseToWorkout,
  useWorkoutExercises,
} from "@/hooks/workout-exercises";
import { useWorkoutSets } from "@/hooks/sets";

type Params = {
  params: { slug: string };
};

export default function Workout({ params: { slug } }: Params) {
  const workoutId = getIdFromSlug(slug);
  const { data: workout, isLoading, isFetching, isSuccess } = useWorkout();
  const {
    data: { inWorkout, other },
    // isSuccess: exercisesSucces,
    // isLoading: exercisesLoading,
    isFetching: exercisesFetching,
  } = useWorkoutExercises();
  const { data: sets } = useWorkoutSets();
  const { mutate: addExerciseToWorkout } = useAddExerciseToWorkout();

  const searchParams = useSearchParams();
  const exerciseIndex = parseInt(searchParams.get("exercise") ?? "1", 10);

  return (
    <section className="sm:container text-center space-y-4">
      {isSuccess && (
        <>
          <H1>{workout.title}</H1>
          <P className="max-w-lg mx-auto">{workout.description}</P>
        </>
      )}
      {!!((isFetching || isLoading) && !workout?.title) && (
        <>
          <H1>Loading..</H1>
          <P className="max-w-lg mx-auto">Workout with id {workoutId}</P>
        </>
      )}

      <ExercisesPagination length={inWorkout.length || 3} />
      {inWorkout[exerciseIndex - 1] ? (
        <WorkoutExerciseContext.Provider
          value={{
            ...inWorkout[exerciseIndex - 1],
            sets: sets.filter(
              (e) => e.workoutExerciseId === inWorkout[exerciseIndex - 1].id
            ),
          }}
        >
          <WorkoutExerciseCard />
        </WorkoutExerciseContext.Provider>
      ) : (
        <>{exercisesFetching && <WorkoutExerciseCard />}</>
      )}

      <div className="space-y-2 sm:space-x-3 sm:space-y-0">
        {/* implement this, make it so that i can delete/reorder exercises */}
        <ResponsiveFormDialog
          trigger={<Button variant={"outline"}>Edit exercise order</Button>}
          title="Edit exercise order"
          description="Simply click on the exercises to number them in order"
        >
          <EditWorkoutExercises exercises={inWorkout} />
        </ResponsiveFormDialog>
        <ResponsiveComboBox
          trigger={<Button variant="outline">Add another exercise</Button>}
          data={other.map(({ id, title }) => ({
            id,
            title,
          }))}
          placeholder="Search exercise.."
          mutate={addExerciseToWorkout}
        />
      </div>
    </section>
  );
}
