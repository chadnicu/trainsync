"use server";

import { exercise, sets, workout, workout_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { SetInput } from "@/types";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getAllSets() {
  const { userId } = auth();
  if (!userId) notFound();

  const { id, reps, weight } = sets;
  const { title: workoutTitle, date: workoutDate, id: workoutId } = workout;
  const { comment, id: workoutExerciseId, exerciseId } = workout_exercise;
  return await db
    .select({
      id,
      reps,
      weight,
      comment,
      workoutExerciseId,
      exerciseId,
      workoutId,
      workoutDate,
      workoutTitle,
    })
    .from(sets)
    .innerJoin(workout_exercise, eq(workoutExerciseId, sets.workoutExerciseId))
    .innerJoin(workout, eq(workoutId, workout_exercise.workoutId))
    .where(eq(sets.userId, userId))
    .all()
    .then((data) =>
      data.sort(
        (a, b) =>
          new Date(b.workoutDate ?? "").getTime() -
          new Date(a.workoutDate ?? "").getTime()
      )
    );
}

export async function createSet(values: SetInput, workoutExerciseId: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .insert(sets)
    .values({ ...values, workoutExerciseId: workoutExerciseId, userId });
}

export async function updateSet(setId: number, values: SetInput) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(sets)
    .set(values)
    .where(and(eq(sets.id, setId), eq(sets.userId, userId)));
}

export async function deleteSet(setId: number) {
  const { userId } = auth();
  if (!userId) return;

  await db.delete(sets).where(and(eq(sets.id, setId), eq(sets.userId, userId)));
}
