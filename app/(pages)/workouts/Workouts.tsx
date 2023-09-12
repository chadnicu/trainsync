"use client";

import { Workout } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {!data.length && <p>you have no workouts</p>}
      {data.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
