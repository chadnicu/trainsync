"use client";

import {
  deleteSet,
  getExercisesByWorkoutId,
  getSets,
  removeExerciseFromWorkout,
} from "@/app/actions";
import { HoverExercise } from "@/app/templates/[id]/Template";
import AddSet from "@/components/AddSet";
import { DeleteButton } from "@/components/DeleteButton";
import WorkoutComboBox from "@/components/WorkoutComboBox";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Exercise, Set, Workout } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  workout: Workout;
  initialExercises: {
    workoutsExercises: (Exercise & { workoutExerciseId: number })[];
    otherExercises: Exercise[];
  };
  initialSets: Set[];
};

export default function Workout({
  workout,
  initialExercises,
  initialSets,
}: Props) {
  const queryClient = useQueryClient();

  const { data: exercises } = useQuery({
    queryKey: [`workout-${workout.id}`],
    queryFn: async () => {
      const data = await getExercisesByWorkoutId(workout.id);
      return data;
    },
    initialData: initialExercises,
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await removeExerciseFromWorkout(id, workout.id).then(() =>
        queryClient.invalidateQueries([`workout-${workout.id}`])
      );
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: [`workout-${workout.id}`],
      });
      const previous = queryClient.getQueryData([`workout-${workout.id}`]);
      queryClient.setQueryData([`workout-${workout.id}`], (old: any) => ({
        workoutsExercises: old.workoutsExercises.filter(
          (e: Exercise) => e.id !== id
        ),
        otherExercises: old.otherExercises.concat(
          old.workoutsExercises.filter((e: Exercise) => e.id === id)
        ),
      }));
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData([`workout-${workout.id}`], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`workout-${workout.id}`],
      });
    },
  });

  const { data: sets } = useQuery({
    queryKey: ["sets"],
    queryFn: async () => {
      const data = await getSets();
      return data;
    },
    initialData: initialSets,
  });

  const { mutate: mutateSet } = useMutation({
    mutationFn: async (id) => {
      await deleteSet(id);
      queryClient.invalidateQueries(["sets"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["sets"] });
      const previous = queryClient.getQueryData(["sets"]);
      queryClient.setQueryData(["sets"], (old: any) =>
        old.filter((s: any) => s.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["sets"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sets"] });
    },
  });

  return (
    <div className="p-10 text-center">
      <h1 className="text-5xl font-bold">{workout.title}</h1>
      <div className="mt-10 flex flex-col-reverse items-center gap-5 md:flex-row md:justify-around">
        <div className="grid gap-2">
          {exercises.workoutsExercises.map((e) => (
            <div key={e.id} className="flex gap-10">
              <div className="flex items-center justify-between gap-10 border px-7 py-5">
                <div>
                  <HoverExercise data={e} />
                </div>
                <div>
                  <DeleteButton mutate={() => mutate(e.id)} />
                </div>
                <div>
                  {sets
                    .filter(
                      (set) => set.workoutExerciseId === e.workoutExerciseId
                    )
                    .map((d) => (
                      <div key={d.id} className="flex items-center gap-2">
                        <p>
                          {d.reps} x {d.weight}
                        </p>
                        <button onClick={() => mutateSet(d.id)}>
                          <Icons.trash size={12} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              <AddSet workoutExerciseId={e.workoutExerciseId} />
            </div>
          ))}
        </div>

        <WorkoutComboBox
          exercises={exercises.otherExercises.map((e) => ({
            value: e.title,
            label: e.title,
            exerciseId: e.id,
          }))}
          workoutId={workout.id}
        />
      </div>
    </div>
  );
}
