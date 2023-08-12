"use client";

import { Workout } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import WorkoutCard from "@/components/WorkoutCard";

export default function Workouts({ workouts }: { workouts: Workout[] }) {
  const queryClient = useQueryClient();

  function queryWorkouts() {
    const data = queryClient.getQueryData(["workouts"]);
    if (!data) return [];
    return data as Workout[];
  }

  const { data } = useQuery({
    queryKey: ["workouts"],
    queryFn: queryWorkouts,
    initialData: () => queryWorkouts(),
  });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {!data.length && <p>you have no workouts</p>}
      {data.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}

function HoverWorkout({ w }: { w: Workout }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/workouts/${w.id}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0 text-left text-xl font-bold"
          )}
        >
          {w.title}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        <p className="text-sm">{w?.description || "No description"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
