"use server";

import { exercise, exercise_session, session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ExerciseType } from "./exercises/Exercises";

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

  // revalidatePath("/");

  console.log(res);
}

export async function deleteExercise(id: number) {
  const deleted = await db
    .delete(exercise)
    .where(eq(exercise.id, id))
    .returning()
    .get();

  console.log(deleted);
}

export async function deleteSession(id: number) {
  const deleted = await db
    .delete(session)
    .where(eq(session.id, id))
    .returning()
    .get();

  console.log(deleted);
}

export async function removeExerciseFromSession(
  exercise_id: number,
  session_id: number
) {
  const deleted = await db
    .delete(exercise_session)
    .where(
      and(
        eq(exercise_session.exercise_id, exercise_id),
        eq(exercise_session.session_id, session_id)
      )
    )
    .returning()
    .get();

  revalidatePath(`/sessions/${session_id}`);

  console.log(deleted);
}

export async function addExerciseToSession(
  exercise_id: number,
  session_id: number
) {
  const newEntry = await db
    .insert(exercise_session)
    .values({ exercise_id, session_id })
    .returning()
    .get();

  revalidatePath(`/sessions/${session_id}`);

  console.log(newEntry);
}
