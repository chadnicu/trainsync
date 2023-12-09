import Exercises from "./Exercises";
import ExerciseForm from "@/components/ExerciseForm";
import ExerciseSkeleton from "@/components/ExerciseSkeleton";
import { Suspense } from "react";
import { getExercises } from "@/app/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercises",
};

export default async function Page() {
  const fallback = (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 10 }, (_, i) => (
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
