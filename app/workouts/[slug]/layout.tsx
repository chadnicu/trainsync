"use client";

import { useWorkout, WorkoutContext } from "@/hooks/workouts";
import Timer from "./_components/timer";

export default function WorkoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: workout, isSuccess } = useWorkout();

  return (
    <>
      {isSuccess && (
        <WorkoutContext.Provider value={workout}>
          <Timer />
        </WorkoutContext.Provider>
      )}
      {children}
    </>
  );
}
