import { exercise, exercise_session, session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, eq, notInArray } from "drizzle-orm";
import Session from "./Session";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) notFound();

  const sessionId = parseInt(params.id, 10);

  const currentSession = await db
    .select()
    .from(session)
    .where(eq(session.id, sessionId))
    .limit(1)
    .get();

  const sessionsExercises = await db
    .select()
    .from(exercise_session)
    .innerJoin(exercise, eq(exercise_session.exerciseId, exercise.id))
    .where(eq(exercise_session.sessionId, sessionId))
    .all()
    .then((data) => data.map(({ exercise }) => exercise));

  const exerciseIds = sessionsExercises.length
    ? sessionsExercises.map((e) => e.id)
    : [-1];

  const otherExercises = await db
    .select()
    .from(exercise)
    .where(
      and(eq(exercise.userId, userId), notInArray(exercise.id, exerciseIds))
    )
    .all();

  return (
    <Session
      session={currentSession}
      sessionsExercises={sessionsExercises}
      otherExercises={otherExercises}
    />
  );
}
