import Exercises from "./Exercises";
import ExerciseForm from "@/components/ExerciseForm";
import { getExercises } from "../actions";
import { Suspense } from "react";
import ExerciseSkeleton from "@/components/ExerciseSkeleton";

export default function Page() {
  const fallback = (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {new Array(10).fill(null).map((_, i) => (
        <ExerciseSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <h1 className="text-center text-5xl font-bold">Exercises</h1>
      <div className="grid place-items-center gap-5 md:flex md:flex-row-reverse md:items-start md:justify-between">
        <ExerciseForm />
        <Suspense fallback={fallback}>
          <FetchExercises />
        </Suspense>
      </div>
    </>
  );
}

async function FetchExercises() {
  const exercises = await getExercises();
  return <Exercises exercises={exercises} />;
}
