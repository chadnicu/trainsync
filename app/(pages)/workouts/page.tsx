import WorkoutForm from "@/components/WorkoutForm";
import { getTemplates, getWorkouts } from "../actions";
import Workouts from "./Workouts";
import AddFromTemplateForm from "@/components/AddFromTemplateForm";

export default async function Page() {
  const workouts = await getWorkouts();
  const templates = await getTemplates();

  return (
    <>
      <h1 className="text-center text-5xl font-bold">Workouts</h1>
      <div className="grid gap-10 md:flex md:flex-row-reverse md:justify-between">
        <div className="flex flex-col gap-2">
          <WorkoutForm />
          <AddFromTemplateForm templates={templates} />
        </div>
        <Workouts workouts={workouts} />
      </div>
    </>
  );
}
