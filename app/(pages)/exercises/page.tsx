import Exercises from "./Exercises";
import { getExercises } from "../actions";
import ExerciseForm from "@/components/ExerciseForm";

export default async function Page() {
  const exercises = await getExercises();

  return (
    <>
      <h1 className="text-center text-5xl font-bold">Exercises</h1>
      <div className="grid gap-5 md:flex md:flex-row-reverse md:justify-between">
        <ExerciseForm />
        <Exercises exercises={exercises} />
      </div>
    </>
  );
}
