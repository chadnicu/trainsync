"use client";

import { getLogsByExerciseId } from "@/app/actions";
import { Set } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function Log({
  initialLog,
  exerciseId,
}: {
  initialLog: (Set & {
    comment: string | null;
    date: string;
    workoutTitle: string;
    exerciseTitle: string;
  })[];
  exerciseId: number;
}) {
  const { data: log } = useQuery({
    queryKey: [`log-${exerciseId}`],
    queryFn: async () => await getLogsByExerciseId(exerciseId),
    initialData: initialLog,
  });

  return (
    <div className="grid place-items-center gap-10">
      <h1 className="text-5xl font-bold">{log[0]?.exerciseTitle ?? ""}</h1>
      <div>
        {log.map((e) => (
          <div key={e.id} className="flex gap-5">
            <p className="font-semibold">{e.date.toString().slice(0, 15)}</p>{" "}
            <h1>
              {e.reps} x {e.weight}
            </h1>
            <p className="italic">({e.workoutTitle})</p>
            {e.comment && <p>{e.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
