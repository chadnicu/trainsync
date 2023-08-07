"use client";

import Exercise from "@/components/Exercise";
import { useQuery } from "@tanstack/react-query";
import { getExercises } from "../actions";
import { Exercise as ExerciseType } from "@/lib/types";

export default function Exercises({
  exercises,
}: {
  exercises: ExerciseType[];
}) {
  const { data } = useQuery({
    queryKey: ["exercises"],
    queryFn: getExercises,
    initialData: exercises,
  });

  return (
    <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {!data.length && <p>you have no exercises</p>}
      {data.map((e) => (
        <div key={e.id}>
          <Exercise exercise={e} />
        </div>
      ))}
    </div>
  );
}
