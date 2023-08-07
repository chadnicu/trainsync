import WorkoutForm from "@/components/WorkoutForm";
import { getWorkouts } from "../actions";
import Workouts from "./Workouts";

export default async function Page() {
  const workouts = await getWorkouts();

  return (
    <>
      <h1 className="text-center text-5xl font-bold">Workouts</h1>
      <div className="grid gap-5 md:flex md:flex-row-reverse md:justify-between">
        <WorkoutForm />
        <Workouts workouts={workouts} />
      </div>
    </>
  );
}
