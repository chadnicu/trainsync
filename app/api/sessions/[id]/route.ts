import { exercise, exercise_session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, eq, notInArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  }
) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const sessionId = parseInt(params.slug, 10);
  
  console.log(parseInt(params.slug, 10))
  console.log(sessionId);

  const exercises = await db
    .select()
    .from(exercise_session)
    .innerJoin(exercise, eq(exercise_session.exerciseId, exercise.id))
    .where(eq(exercise_session.sessionId, sessionId))
    .all()
    .then((data) => data.map(({ exercise }) => exercise));

  const exerciseIds = exercises.length ? exercises.map((e) => e.id) : [-1];

  const other = await db
    .select()
    .from(exercise)
    .where(
      and(
        eq(exercise.userId, userId ?? "niger"),
        notInArray(exercise.id, exerciseIds)
      )
    )
    .all();

  console.log(NextResponse.json({ exercises, other }));
  return NextResponse.json({ exercises, other });
}
