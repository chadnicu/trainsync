"use client";

import {
  deleteSet,
  getExercisesByWorkoutId,
  getSets,
  removeExerciseFromWorkout,
} from "@/app/actions";
import { HoverExercise } from "@/app/templates/[id]/Template";
import AddSetForm from "@/components/AddSetForm";
import { DeleteButton } from "@/components/DeleteButton";
import EditSetForm from "@/components/EditSetForm";
import WorkoutComboBox from "@/components/WorkoutComboBox";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Exercise, Set, Workout } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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

  function queryLogs() {
    const data = queryClient.getQueryData(["logs"]);
    if (!data) return [];
    return data as (Set & {
      title: string;
      exerciseId: number;
    })[];
  }

  const { data: sets } = useQuery({
    queryKey: ["logs"],
    queryFn: queryLogs,
    initialData: () => queryLogs(),
  });

  const { mutate: mutateSet } = useMutation({
    mutationFn: async (id) => {
      await deleteSet(id);
      queryClient.invalidateQueries(["logs"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["logs"] });
      const previous = queryClient.getQueryData(["logs"]);
      queryClient.setQueryData(["logs"], (old: any) =>
        old.filter((s: any) => s.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["logs"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });

  const [editable, setEditable] = useState(0);

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold">{workout.title}</h1>
      <div className="mt-10 flex flex-col-reverse items-center gap-5 md:flex-row md:justify-around">
        <div className="grid gap-2">
          {exercises.workoutsExercises.map((e) => (
            <div
              key={e.id}
              className="grid place-items-center sm:flex sm:gap-10"
            >
              <div className="mb-1 mt-5 grid w-full items-center border px-7 py-5 sm:mb-0 sm:mt-0 sm:flex sm:gap-10">
                <div className="flex justify-between gap-2">
                  <div>
                    <HoverExercise data={e} />
                  </div>
                  <div>
                    <DeleteButton mutate={() => mutate(e.id)} />
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  {sets.map(
                    (set) =>
                      set.workoutExerciseId === e.workoutExerciseId && (
                        <div
                          key={set.id}
                          className="flex items-center justify-center gap-2"
                        >
                          <button
                            onClick={() =>
                              setEditable(editable === set.id ? 0 : set.id)
                            }
                          >
                            <Icons.edit size={12} />
                          </button>
                          {editable == set.id ? (
                            <EditSetForm
                              workoutExerciseId={set.workoutExerciseId}
                              setId={set.id}
                              defaultValues={{
                                reps: set.reps ?? 0,
                                weight: set.weight ?? 0,
                              }}
                              setEditable={() => setEditable(0)}
                            />
                          ) : (
                            <p>
                              {set.reps} x {set.weight}
                            </p>
                          )}
                          <button onClick={() => mutateSet(set.id)}>
                            <Icons.trash size={12} />
                          </button>
                          {/* <button
                            onClick={() =>
                              setEditable(editable === set.id ? 0 : set.id)
                            }
                          >
                            <Icons.edit size={12} />
                          </button> */}
                        </div>
                      )
                  )}
                </div>
              </div>
              <AddSetForm workoutExerciseId={e.workoutExerciseId} />
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
