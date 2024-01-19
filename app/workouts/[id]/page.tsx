"use client";

import { useQuery } from "@tanstack/react-query";
import { getExercisesByWorkoutId, getWorkoutById } from "./server";
import { ResponsiveComboBox } from "@/components/responsive-combobox";
import { H1 } from "@/components/typography/h1";
import { H2 } from "@/components/typography/h2";
import { H3 } from "@/components/typography/h3";
import { P } from "@/components/typography/p";

type Props = {
  params: { id: string };
};

export default function Workout({ params: { id } }: Props) {
  const workoutId = parseInt(id, 10);

  const { data: workout } = useQuery({
    queryKey: ["workout", workoutId],
    queryFn: async () => getWorkoutById(workoutId),
  });

  const {
    data: { inWorkout, other },
  } = useQuery({
    queryKey: ["exercises", workoutId],
    queryFn: async () => getExercisesByWorkoutId(workoutId),
    initialData: { inWorkout: [], other: [] },
  });

  return (
    <section className="container text-center space-y-4">
      <H2>Workout {workoutId}</H2>
      <H1>{workout?.title}</H1>
      <P>{workout?.description}</P>
      <div>
        in:
        {inWorkout.map((e) => (
          <div key={e.id}>
            <H3>{e.title}</H3>
          </div>
        ))}
      </div>

      <ResponsiveComboBox
        data={other.map(({ id, title }) => ({
          id,
          title,
        }))}
        placeholder="Search exercise.."
        triggerText="Add another exercise"
      />
    </section>
  );
}
