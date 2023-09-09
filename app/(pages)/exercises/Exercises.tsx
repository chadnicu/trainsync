"use client";

import { useQuery } from "@tanstack/react-query";
import { getExercises } from "../actions";
import { Exercise } from "@/lib/types";
import ExerciseCard from "@/components/ExerciseCard";

export default function Exercises({ exercises }: { exercises: Exercise[] }) {
  const { data } = useQuery({
    queryKey: ["exercises"],
    queryFn: getExercises,
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
