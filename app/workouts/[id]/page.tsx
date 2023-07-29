import { getCurrentWorkout, getExercisesByWorkoutId } from "@/app/actions";
import Workout from "./Workout";

export default async function Page({ params }: { params: { id: string } }) {
  const workoutId = parseInt(params.id, 10);
  const currentWorkout = await getCurrentWorkout(workoutId);
  const exercises = await getExercisesByWorkoutId(workoutId);

  return <Workout workout={currentWorkout} exercises={exercises} />;
}
