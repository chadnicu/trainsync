"use server";

import { exerciseSchema } from "@/components/exercise-form";
import { exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

export async function getExercises() {
  const { userId } = auth();
  if (!userId) return [];

  const { id, title, instructions, url } = exercise;
  return await db
    .select({ id, title, instructions, url })
    .from(exercise)
    .where(eq(exercise.userId, userId))
    .orderBy(desc(exercise.id))
    .all();
}

export async function editExercise(
  values: z.infer<typeof exerciseSchema> & { id: number }
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(exercise)
    .set(values)
    .where(and(eq(exercise.id, values.id), eq(exercise.userId, userId)));
}

export async function deleteExercise(id: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .delete(exercise)
    .where(and(eq(exercise.id, id), eq(exercise.userId, userId)));
}

export async function addExercise(values: z.infer<typeof exerciseSchema>) {
  const { userId } = auth();
  if (!userId) return;

  await db.insert(exercise).values({ ...values, userId });
}
