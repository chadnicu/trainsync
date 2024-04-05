"use client";

import CommentAlert from "@/components/comment";
import { H1, H4, P } from "@/components/typography";
import { usePathname } from "next/navigation";
import ExercisesPagination from "./_components/exercises-pagination";
import { Button } from "@/components/ui/button";
import WorkoutExerciseSkeleton from "./_components/workout-exercise-skeleton";

export default function LoadingWorkout() {
  const pathname = usePathname();
  const last = pathname.split("/")[2].split("-");
  const name = last.toSpliced(last.length - 1).join(" ");

  return (
    <>
      <div className="top-[52.5px] absolute border-b w-full left-0 backdrop-blur supports-[backdrop-filter]:bg-background/70 z-10 h-[52px]">
        <H4 className="absolute inset-0 m-auto w-fit h-fit grid place-items-center">
          Loading..
        </H4>
      </div>
      <section className="sm:container text-center space-y-4 mt-[52.5px]">
        <H1>{name}</H1>
        <P className="max-w-lg mx-auto">Loading..</P>
        <CommentAlert className="w-fit mx-auto opacity-75">
          Loading..
        </CommentAlert>
        <ExercisesPagination length={3} disabled />
        <WorkoutExerciseSkeleton />
        <div className="flex flex-col gap-2 min-[370px]:flex-row w-fit mx-auto">
          <Button variant="outline" disabled>
            Edit exercise order
          </Button>
          <Button variant="outline" disabled>
            Add another exercise
          </Button>
        </div>
      </section>
    </>
  );
}
