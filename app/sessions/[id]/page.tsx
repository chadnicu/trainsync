import Session from "./Session";
import { getCurrentSession, getExercisesBySeshId } from "@/app/actions";

export default async function Page({ params }: { params: { id: string } }) {
  const sessionId = parseInt(params.id, 10);

  const currentSession = await getCurrentSession(sessionId);

  const { sessionsExercises, otherExercises } = await getExercisesBySeshId(
    sessionId
  );

  return (
    <Session
      session={currentSession}
      sessionsExercises={sessionsExercises}
      otherExercises={otherExercises}
    />
  );
}
