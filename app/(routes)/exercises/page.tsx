import Exercises from "./Exercises";
import ExerciseForm from "@/components/ExerciseForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercises",
};

export default function Page() {
  return (
    <>
      <h1 className="text-center text-5xl font-bold">Exercises</h1>
      <div className="grid place-items-center gap-5 md:flex md:flex-row-reverse md:items-start md:justify-between">
        <ExerciseForm />
        <Exercises />
      </div>
    </>
  );
}
