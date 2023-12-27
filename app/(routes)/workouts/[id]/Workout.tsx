"use client";

import TimePassed from "./TimePassed";
import WorkoutComboBox from "@/components/WorkoutComboBox";
import { useState } from "react";
import { Exercise, Set, Workout as WorkoutType } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  deleteSet,
  editWorkout,
  getCurrentWorkout,
  getExercisesByWorkoutId,
  getOtherComments,
  getLogs,
  removeExerciseFromWorkout,
} from "@/app/actions";
import EditDurationForm from "./EditDurationForm";
import CommentForm from "./CommentForm";
import { ExerciseCarousel } from "@/components/Carousel";

export default function Workout({
  initialWorkout,
  initialExercises,
  initialLogs,
  initialOtherComments,
}: {
  initialWorkout: WorkoutType;
  initialExercises: {
    workoutsExercises: (Exercise & {
      workoutExerciseId: number;
      todo: string | null;
      comment: string | null;
    })[];
    otherExercises: Exercise[];
  };
  initialLogs: (Set & {
    title: string;
    exerciseId: number;
  })[];
  initialOtherComments: {
    workoutId: number;
    id: number;
    comment: string | null;
    todo: string | null;
    exerciseId: number;
  }[];
}) {
  const queryClient = useQueryClient();
  const queryKeys = {
    workout: [`workout-${initialWorkout.id}`],
    exercises: [`exercises-workout-${initialWorkout.id}`],
    lastComment: [`last-comment-${initialWorkout.id}`],
  };

  const { data: workout } = useQuery({
    queryKey: queryKeys.workout,
    queryFn: async () => getCurrentWorkout(initialWorkout.id),
    initialData: initialWorkout,
  });

  const { data: exercises } = useQuery({
    queryKey: queryKeys.exercises,
    queryFn: async () => getExercisesByWorkoutId(initialWorkout.id),
    initialData: initialExercises,
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await removeExerciseFromWorkout(id, initialWorkout.id).then(() =>
        queryClient.invalidateQueries(queryKeys.exercises)
      );
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.exercises,
      });
      const previous = queryClient.getQueryData(queryKeys.exercises);
      queryClient.setQueryData(queryKeys.exercises, (old: any) => ({
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
      queryClient.setQueryData(queryKeys.exercises, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.exercises,
      });
    },
  });

  const { data: sets } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => getLogs(),
    initialData: initialLogs,
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
        old.filter((s: any) => s.id && s.id !== id)
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

  const startedDate = workout.started
    ? new Date(parseInt(workout.started, 10))
    : null;
  const finishedDate = workout.finished
    ? new Date(parseInt(workout.finished, 10))
    : null;
  const timeSpent =
    finishedDate && startedDate
      ? new Date(finishedDate.getTime() - startedDate.getTime())
      : null;

  const { data: otherComments } = useQuery({
    queryKey: queryKeys.lastComment,
    queryFn: async () => getOtherComments(initialWorkout.id),
    initialData: initialOtherComments,
  });

  console.log("other: ", otherComments);

  return (
    <>
      <div className="grid gap-2">
        <h3 className="text-sm">
          {initialWorkout.date.toString().slice(0, 15)}
        </h3>
        <h1 className="text-5xl font-bold">{workout.title}</h1>
        <p className="px-5 text-sm">{workout.description}</p>
        <div className="max-w-screen flex justify-center gap-2 overflow-hidden px-20 pt-2">
          {(workout.started || workout.finished) && (
            <Button
              onClick={async () => {
                const optimistic = {
                  ...workout,
                  started: null,
                  finished: null,
                };
                queryClient.setQueryData(queryKeys.workout, optimistic);
                await editWorkout(initialWorkout.id, optimistic);
                await queryClient.invalidateQueries(queryKeys.workout);
              }}
              variant={"destructive"}
            >
              {!workout.finished ? "Cancel" : "Delete"}
            </Button>
          )}
          <Button
            onClick={async () => {
              const now = new Date().getTime();
              const optimistic = {
                ...workout,
                started: now.toString(),
                finished: null,
              };
              queryClient.setQueryData(queryKeys.workout, optimistic);
              await editWorkout(initialWorkout.id, optimistic);
              await queryClient.invalidateQueries(queryKeys.workout);
            }}
            variant={
              workout.started && !workout.finished ? "outline" : "default"
            }
            className="w-fit items-end"
          >
            {workout.started ? "Restart" : "Start"}
          </Button>
          {workout.started && !workout.finished && (
            <Button
              onClick={async () => {
                const now = new Date().getTime();
                const optimistic = {
                  ...workout,
                  finished: now.toString(),
                };
                queryClient.setQueryData(queryKeys.workout, optimistic);
                await editWorkout(initialWorkout.id, optimistic);
                await queryClient.invalidateQueries(queryKeys.workout);
              }}
              variant={"default"}
              className="w-fit items-end"
            >
              Finish
            </Button>
          )}
        </div>
        {workout.started && workout.finished && (
          <EditDurationForm workout={workout} />
        )}
        {startedDate && (
          <p>
            Started at: {startedDate.getHours()}:{startedDate.getMinutes()}
          </p>
        )}
        {finishedDate && (
          <p>
            Ended at: {finishedDate.getHours()}:{finishedDate.getMinutes()}
          </p>
        )}
        {workout.started && !workout.finished && (
          <TimePassed since={parseInt(workout.started, 10)} />
        )}
        {timeSpent && (
          <p>
            Duration: {timeSpent.getHours() - 3}:{timeSpent.getMinutes()}
          </p>
        )}
        <CommentForm workout={workout} />
      </div>
      <div className="flex flex-col items-center gap-10 md:items-center md:justify-center md:gap-5">
        <ExerciseCarousel
          workoutsExercises={exercises.workoutsExercises}
          sets={sets}
          otherComments={otherComments}
          mutate={(id: number) => mutate(id)}
          setEditable={(id: number) => setEditable(id)}
          editable={editable}
          mutateSet={(id: number) => mutateSet(id)}
        />
        {/* <div className="grid gap-5 px-5">
          {exercises.workoutsExercises.map((e) => (
            <div
              key={e.id}
              className="grid place-items-center  sm:flex sm:justify-between sm:gap-5"
            >
              <Card className="mb-2 w-fit md:flex md:items-center">
                <CardHeader>
                  <div className="grid h-full justify-between gap-2">
                    <div
                      className={
                        getLastSets(e, sets).length ? "flex" : "hidden"
                      }
                    >
                      {getLastSets(e, sets)
                        .reverse()
                        .map((set, i, arr) => (
                          <div key={set.id} className="flex gap-1 text-xs">
                            {i === 0 && <p>Last:</p>}
                            <p>
                              {set.reps}x{set.weight}
                              {arr.length !== i + 1 && ","}
                            </p>
                          </div>
                        ))}
                    </div>
                    <p
                      className={cn(
                        "w-fit max-w-xs rounded-md rounded-tl-none bg-secondary p-2 text-left text-sm",
                        { hidden: !getLastComment(otherComments, e.id) }
                      )}
                    >
                      {getLastComment(otherComments, e.id)}
                    </p>
                    <div className="flex h-full flex-col items-start gap-1">
                      <HoverExercise data={e} />
                      <p className="max-w-xs text-left text-sm italic">
                        {e?.todo}
                      </p>
                    </div>
                    <div>
                      <DeleteButton mutate={() => mutate(e.id)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="m-0 flex h-full items-center justify-center px-0 pb-4 md:py-0">
                  <div className="py-0 md:py-4">
                    {sets.map((set) => {
                      if (set.workoutExerciseId === e.workoutExerciseId)
                        return (
                          <div key={set.id} className="md:pr-4">
                            {set.workoutExerciseId === e.workoutExerciseId && (
                              <div
                                key={set.id}
                                className="flex items-center justify-center gap-2"
                              >
                                <button
                                  onClick={() =>
                                    setEditable(
                                      editable === set.id ? 0 : set.id
                                    )
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
                              </div>
                            )}
                          </div>
                        );
                    })}
                  </div>
                </CardContent>
              </Card>
              <AddSetForm
                workout={workout}
                workoutExerciseId={e.workoutExerciseId}
                disabled={!workout.started}
                id={initialWorkout.id}
              />
              <AddCommentForm
                workoutId={initialWorkout.id}
                workoutExerciseId={e.workoutExerciseId}
                comment={e.comment}
              />
            </div>
          ))}
        </div> */}

        <WorkoutComboBox
          exercises={exercises.otherExercises.map((e) => ({
            value: e.title,
            label: e.title,
            exerciseId: e.id,
          }))}
          workoutId={initialWorkout.id}
        />
      </div>
    </>
  );
}

function getLastSets(
  workoutsExercise: Exercise & {
    workoutExerciseId: number;
  },
  sets: (Set & {
    title: string;
    exerciseId: number;
  })[]
) {
  const arr = [];

  for (let i = sets.length - 1; i >= 0; i--) {
    if (
      sets[i].workoutExerciseId !== workoutsExercise.workoutExerciseId &&
      sets[i].exerciseId === workoutsExercise.id
    ) {
      arr.push(sets[i]);
      for (let j = i - 1; j >= 0; j--) {
        if (sets[i].workoutExerciseId === sets[j].workoutExerciseId) {
          arr.push(sets[j]);
        } else {
          j = 0;
          break;
        }
      }
      i = 0;
      break;
    }
  }

  return arr;
}

function getLastComment(
  otherComments:
    | {
        id: number;
        comment: string | null;
        todo: string | null;
        workoutId: number;
        exerciseId: number;
      }[]
    | ""
    | undefined,
  exerciseId: number
) {
  if (!otherComments) return "";
  return otherComments.find((e) => e.exerciseId === exerciseId)?.comment;
}
