"use server";

import { exercise, exercise_session, session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { and, eq, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ExerciseType } from "./exercises/Exercises";
import { auth } from "@clerk/nextjs";
import { Session } from "./sessions/Sessions";

// export async function addExercise(data: FormData) {
//   const title = data.get("title")?.toString(),
//     instructions = data.get("instructions")?.toString(),
//     url = data.get("url")?.toString();

//   if (title) {
//     const res = await db
//       .insert(exercise)
//       .values({ title, instructions, url })
//       .returning()
//       .get();

//     // revalidatePath("/");

//     console.log(res);
//   }
// }

// temporar
export async function editExercise(old: ExerciseType, data?: FormData) {
  const title = data?.get("title")?.toString() || old.title,
    instructions = data?.get("instructions")?.toString() || old.instructions,
    url = data?.get("url")?.toString() || old.url;

  const res = await db
    .update(exercise)
    .set({ title, instructions, url })
    .where(eq(exercise.id, old.id))
    .returning()
    .get();

  await db
    .select()
    .from(exercise_session)
    .where(eq(exercise_session.exerciseId, old.id))
    .all()
    .then((data) =>
      data.forEach(({ id }) => revalidatePath(`/sessions/${id}`))
    );

  console.log(res);
}

export async function editSession(old: Session, data?: FormData) {
  const title = data?.get("title")?.toString() || old.title,
    description = data?.get("description")?.toString() || old.description;

  await db
    .update(session)
    .set({ title, description })
    .where(eq(session.id, old.id))
    .returning()
    .get();

  revalidatePath(`/sessions/${old.id}`);
}

export async function deleteExercise(id: number) {
  const foreign = await db
    .delete(exercise_session)
    .where(eq(exercise_session.exerciseId, id))
    .returning()
    .get();

  const deletedExercise = await db
    .delete(exercise)
    .where(eq(exercise.id, id))
    .returning()
    .get();

  console.log(foreign, deletedExercise);
}

export async function deleteSession(id: number) {
  const foreign = await db
    .delete(exercise_session)
    .where(eq(exercise_session.sessionId, id))
    .returning()
    .get();

  const deletedSession = await db
    .delete(session)
    .where(eq(session.id, id))
    .returning()
    .get();

  console.log(foreign, deletedSession);
}

export async function removeExerciseFromSession(
  exerciseId: number,
  sessionId: number
) {
  const deleted = await db
    .delete(exercise_session)
    .where(
      and(
        eq(exercise_session.exerciseId, exerciseId),
        eq(exercise_session.sessionId, sessionId)
      )
    )
    .returning()
    .get();

  revalidatePath(`/sessions/${sessionId}`);

  console.log(deleted);
}

export async function addExerciseToSession(
  exerciseId: number,
  sessionId: number
) {
  const newEntry = await db
    .insert(exercise_session)
    .values({ exerciseId, sessionId })
    .returning()
    .get();

  revalidatePath(`/sessions/${sessionId}`);

  console.log(newEntry);
}

export async function getExercisesBySeshId(sessionId: number) {
  const exercises = await db
    .select()
    .from(exercise_session)
    .innerJoin(exercise, eq(exercise_session.exerciseId, exercise.id))
    .where(eq(exercise_session.sessionId, sessionId))
    .all()
    .then((data) => data.map(({ exercise }) => exercise));

  const exerciseIds = exercises.length ? exercises.map((e) => e.id) : [-1];

  const { userId } = auth();

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

  return { exercises, other };
}
