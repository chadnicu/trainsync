"use client";

import WorkoutCard from "@/components/WorkoutCard";
import { useQuery } from "@tanstack/react-query";
import { getWorkouts } from "@/app/actions";
import WorkoutSkeleton from "@/components/WorkoutSkeleton";

export default function Workouts() {
  const { data, isFetched } = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => getWorkouts(),
  });

  if (!isFetched)
    return (
      <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 8 }, (_, i) => (
          <WorkoutSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {!data?.length && <p>you have no workouts</p>}
      {data?.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
