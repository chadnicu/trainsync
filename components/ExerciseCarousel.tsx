import * as React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Exercise, Set, Workout } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DeleteButton } from "./DeleteButton";
import { Icons } from "./ui/icons";
import EditSetForm from "./EditSetForm";
import AddSetForm from "./AddSetForm";
import AddCommentForm from "@/app/(routes)/workouts/[id]/AddCommentForm";
import { ExerciseDrawer } from "./ExerciseDrawer";

export function ExerciseCarousel({
  workoutsExercises,
  sets,
  otherComments,
  mutate,
  setEditable,
  editable,
  mutateSet,
  workout,
}: {
  workoutsExercises: (Exercise & {
    workoutExerciseId: number;
    todo: string | null;
    comment: string | null;
  })[];
  sets: (Set & {
    title: string;
    exerciseId: number;
  })[];
  otherComments: {
    workoutId: number;
    id: number;
    comment: string | null;
    todo: string | null;
    exerciseId: number;
  }[];
  mutate: (id: number) => void;
  setEditable: (id: number) => void;
  editable: number;
  mutateSet: (id: number) => void;
  workout: Workout;
}) {
  return (
    <Carousel className="w-full max-w-[250px] sm:max-w-xs">
      <CarouselContent className="p-0">
        {workoutsExercises.map((e, index) => (
          <CarouselItem
            key={index}
            className="flex items-center justify-center"
          >
            <Card className="w-full">
              <CardHeader className="flex items-center justify-center">
                <div className="grid h-full justify-between gap-2">
                  <div
                    className={getLastSets(e, sets).length ? "flex" : "hidden"}
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
                      "w-fit max-w-xs rounded-md rounded-tl-none bg-secondary p-2 text-center text-sm",
                      { hidden: !getLastComment(otherComments, e.id) }
                    )}
                  >
                    {getLastComment(otherComments, e.id)}
                  </p>
                  <div className="flex h-full flex-col items-start gap-1">
                    {/* <HoverExercise data={e} /> */}
                    <ExerciseDrawer data={e} />
                    <p className="max-w-xs text-left text-sm italic">
                      {e?.todo}
                    </p>
                  </div>
                  <div className="w-fit">
                    <DeleteButton mutate={() => mutate(e.id)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="m-0 mb-2 flex h-full flex-col items-center justify-center px-0 pb-4 md:py-0">
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
                            </div>
                          )}
                        </div>
                      );
                  })}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <AddSetForm
                    workout={workout}
                    workoutExerciseId={e.workoutExerciseId}
                    disabled={!workout.started}
                    id={workout.id}
                  />
                  <AddCommentForm
                    workoutId={workout.id}
                    workoutExerciseId={e.workoutExerciseId}
                    comment={e.comment}
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
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
