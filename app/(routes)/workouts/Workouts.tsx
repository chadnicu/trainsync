"use client";

import WorkoutCard from "@/components/WorkoutCard";
import { useQuery } from "@tanstack/react-query";
import { Workout } from "@/lib/types";
import { getWorkouts } from "@/app/actions";

export default function Workouts({ workouts }: { workouts: Workout[] }) {
  const { data } = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => getWorkouts(),
    initialData: workouts,
  });

  return (
    <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {!data?.length && <p>you have no workouts</p>}
      {data?.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
