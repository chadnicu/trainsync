"use server";

import { exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { ExerciseInput } from "@/types";
import { auth } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

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

export async function createExercise(values: ExerciseInput) {
  const { userId } = auth();
  if (!userId) return;

  await db.insert(exercise).values({ ...values, userId });
}

export async function updateExercise(
  exerciseId: number,
  values: ExerciseInput
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

export async function getExerciseById(exerciseId: number) {
  const { userId } = auth();
  if (!userId) notFound();

  return (
    await db
      .select()
      .from(exercise)
      .where(and(eq(exercise.id, exerciseId), eq(exercise.userId, userId)))
      .limit(1)
  )[0];
}
