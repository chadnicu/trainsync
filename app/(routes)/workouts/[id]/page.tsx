import Workout from "./Workout";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCurrentWorkout,
  getExercisesByWorkoutId,
  getLogs,
  getOtherComments,
} from "@/app/actions";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Workout ${params.id}`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const fallback = (
    <>
      <div className="mx-auto grid w-[90vw] place-items-center gap-2 md:w-[50vw]">
        <Skeleton className="h-5 w-[40%]" />
        <Skeleton className="h-12 w-[70%]" />
        <Skeleton className="h-6 w-full" />
        <div className="my-2 flex w-full justify-center gap-2 px-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-6 w-[130px]" />
        ))}
      </div>

      <div className="flex w-[90vw] flex-col items-center gap-10 md:w-[50vw] md:items-center md:justify-center md:gap-5">
        <div className="grid w-full gap-5 px-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="grid place-items-center gap-3 sm:flex sm:justify-between sm:gap-5"
            >
              <Skeleton className="h-[140px] w-full" />
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-[200px]" />
      </div>
    </>
  );

  return (
    <Suspense fallback={fallback}>
      <FetchData workoutId={parseInt(params.id, 10)} />
    </Suspense>
  );
}

async function FetchData({ workoutId }: { workoutId: number }) {
  const [currentWorkout, exercises, logs, otherComments] = await Promise.all([
    getCurrentWorkout(workoutId),
    getExercisesByWorkoutId(workoutId),
    getLogs(),
    getOtherComments(workoutId),
  ]);

  return (
    <Workout
      initialWorkout={currentWorkout}
      initialExercises={exercises}
      initialLogs={logs}
      initialOtherComments={otherComments}
    />
  );
}
