"use client";

import Exercise from "@/components/Exercise";
import ExerciseForm from "@/components/ExerciseForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type ExerciseType = {
  id: number;
  title: string;
  instructions: string | null;
  url: string | null;
  userId: string;
};

async function getExercises() {
  const { data } = await axios.get("/api/exercises");
  return data;
}

export default function Exercises({
  exercises,
}: {
  exercises: ExerciseType[];
}) {
  const { data }: { data: ExerciseType[] } = useQuery({
    queryKey: ["exercises"],
    queryFn: getExercises,
    initialData: exercises,
  });

  console.log(data);

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 items-end gap-2">
        {!data.length && <p>you have no exercises</p>}
        {data.map((e) => (
          <div key={e.id}>
            <Exercise exercise={e} />
          </div>
        ))}
      </div>
  );
}
