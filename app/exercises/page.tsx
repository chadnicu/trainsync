"use client";

import ExerciseCard from "@/components/exercise-card";
import { getExercises } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";

export default function Exercises() {
  const { data, isLoading, isFetching, isSuccess, isError } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => getExercises(),
    initialData: [],
  });

  return (
    <section className="space-y-10">
      <h1 className="text-center text-3xl font-bold  md:text-6xl tracking-tighter">
        Your exercises
      </h1>
      {(isFetching || isLoading) && !data.length && <p>Skeletons</p>}
      {isError && <p>Something went wrong. Try refreshing.</p>}
      {isSuccess && (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
          {data.map((e) => (
            <ExerciseCard key={e.id} exercise={e} />
          ))}
        </div>
      )}
    </section>
  );
}
