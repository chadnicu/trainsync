import {
  getCurrentWorkout,
  getExercisesByWorkoutId,
} from "@/app/(pages)/actions";
import Workout from "./Workout";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: { params: { id: string } }) {
  const fallback = (
    <>
      <div className="grid place-items-center gap-2">
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-6 w-[400px]" />
        <div className="my-2 flex w-full justify-center gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-6 w-[130px]" />
        <Skeleton className="h-6 w-[130px]" />
        <Skeleton className="h-6 w-[130px]" />
      </div>

      <div className="flex flex-col items-center gap-10 md:items-center md:justify-center md:gap-5">
        <div className="grid gap-5 px-5">
          {new Array(5).fill(null).map((_, i) => (
            <div
              key={i}
              className="grid place-items-center sm:flex sm:justify-between sm:gap-5"
            >
              <Skeleton className="h-[140px] w-[400px]" />
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
  const [currentWorkout, exercises] = await Promise.all([
    getCurrentWorkout(workoutId),
    getExercisesByWorkoutId(workoutId),
  ]);

  return <Workout workout={currentWorkout} initialExercises={exercises} />;
}
