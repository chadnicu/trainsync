"use server";

import { exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

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
