"use client";

import ExerciseCard from "@/components/ExerciseCard";
import { useQuery } from "@tanstack/react-query";
import { Exercise } from "@/lib/types";
import { getExercises } from "@/app/(pages)/actions";

export default function Exercises({ exercises }: { exercises: Exercise[] }) {
  const { data } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => getExercises(),
    initialData: exercises,
  });

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {!data.length && <p>you have no exercises</p>}
      {data.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
