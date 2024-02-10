"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ResponsiveComboBox } from "@/components/responsive-combobox";
import {
  useAddExerciseToWorkout,
  useWorkout,
  useWorkoutExercises,
  useWorkoutSets,
} from "./_utils/hooks";
import { WorkoutExerciseContext } from "./_utils/context";
import { Button } from "@/components/ui/button";
import WorkoutExerciseCard from "./_components/workout-exercise-card";
import { H1, P } from "@/components/typography";
import { useSearchParams } from "next/navigation";
import ExercisesPagination from "./_components/exercises-pagination";

type Props = {
  params: { id: string };
};

export default function Workout({ params: { id } }: Props) {
  const workoutId = parseInt(id, 10);

  const {
    data: workout,
    isLoading,
    isFetching,
    isSuccess,
  } = useWorkout(workoutId);

  const {
    data: { inWorkout, other },
    isSuccess: exercisesSucces,
    isLoading: exercisesLoading,
    isFetching: exercisesFetching,
  } = useWorkoutExercises(workoutId);

  const { data: sets } = useWorkoutSets(workoutId);

  const queryClient = useQueryClient();

  const { mutate: addExerciseToWorkout } = useAddExerciseToWorkout(
    queryClient,
    workoutId
  );

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

      <div className="space-x-3">
        {/* implement this, make it so that i can delete/reorder exercises */}
        <Button variant={"outline"}>Edit exercises</Button>
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
