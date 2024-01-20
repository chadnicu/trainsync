"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ResponsiveComboBox } from "@/components/responsive-combobox";
import {
  WorkoutExerciseContext,
  useAddExerciseToWorkout,
  useWorkout,
  useWorkoutExercises,
} from "./helpers";
import { Button } from "@/components/ui/button";
import WorkoutExerciseCard from "./workout-exercise-card";
import { H1, H2, P } from "@/components/typography";
import { useSearchParams } from "next/navigation";
import ExercisesPagination from "./exercises-pagination";

type Props = {
  params: { id: string };
};

export default function Workout({ params: { id } }: Props) {
  const workoutId = parseInt(id, 10);

  const { data: workout } = useWorkout(workoutId);

  const {
    data: { inWorkout, other },
  } = useWorkoutExercises(workoutId);

  const queryClient = useQueryClient();

  const { mutate: addExerciseToWorkout } = useAddExerciseToWorkout(
    queryClient,
    workoutId
  );

  const searchParams = useSearchParams();
  const exerciseIndex = parseInt(searchParams.get("exercise") ?? "1", 10);

  return (
    <section className="sm:container text-center space-y-4">
      <H2>Workout {workoutId}</H2>
      <H1>{workout?.title}</H1>
      <P>{workout?.description}</P>

      <ExercisesPagination length={inWorkout.length} />

      <div className="grid place-items-center gap-10">
        {inWorkout.map((e, i) => (
          <WorkoutExerciseContext.Provider value={e} key={e.id}>
            {i + 1 === exerciseIndex && <WorkoutExerciseCard />}
          </WorkoutExerciseContext.Provider>
        ))}
      </div>

      <ResponsiveComboBox
        trigger={<Button variant="outline">Add another exercise</Button>}
        data={other.map(({ id, title }) => ({
          id,
          title,
        }))}
        placeholder="Search exercise.."
        mutate={addExerciseToWorkout}
      />
    </section>
  );
}
