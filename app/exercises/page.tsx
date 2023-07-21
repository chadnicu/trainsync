import Exercises from "./Exercises";
import { getExercises } from "../actions";

export default async function Page() {
  const exercises = await getExercises();

  return <Exercises exercises={exercises} />;
}
