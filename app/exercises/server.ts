"use server";

import { exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import { ExerciseFormData } from "./helpers";

export async function getExercises() {
  const { userId } = auth();
  if (!userId) return [];

  const { id, title, instructions, url } = exercise;
  return await db
    .select({ id, title, instructions, url })
    .from(exercise)
    .where(eq(exercise.userId, userId))
    .orderBy(desc(id))
    .all();
}

export async function editExercise(
  exerciseId: number,
  values: ExerciseFormData
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(exercise)
    .set(values)
    .where(and(eq(exercise.id, exerciseId), eq(exercise.userId, userId)));
}

export async function deleteExercise(exerciseId: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .delete(exercise)
    .where(and(eq(exercise.id, exerciseId), eq(exercise.userId, userId)));
}

export async function addExercise(values: ExerciseFormData) {
  const { userId } = auth();
  if (!userId) return;

  await db.insert(exercise).values({ ...values, userId });
}
