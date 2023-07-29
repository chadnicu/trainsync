import { getWorkouts } from "../actions";
import Workouts from "./Workouts";

export default async function Page() {
  const workouts = await getWorkouts();

  return (
    <div className="space-y-10 p-20 text-center">
      <h1 className="text-5xl font-bold">Workouts</h1>
      <Workouts workouts={workouts} />
    </div>
  );
}
