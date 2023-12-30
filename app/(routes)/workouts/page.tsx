import WorkoutForm from "@/components/WorkoutForm";
import Workouts from "./Workouts";
import AddFromTemplateForm from "@/components/AddFromTemplateForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workouts",
};

export default async function Page() {
  return (
    <>
      <h1 className="text-center text-5xl font-bold">Workouts</h1>
      <div className="grid gap-10 md:flex md:flex-row-reverse md:justify-between">
        <div className="flex flex-col gap-2">
          <WorkoutForm />
          <AddFromTemplateForm />
        </div>
        <Workouts />
      </div>
    </>
  );
}
