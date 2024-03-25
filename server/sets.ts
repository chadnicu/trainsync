"use server";

import { exercise, sets, workout, workout_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { SetInput } from "@/types";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getSetsByExerciseId(exerciseId: number) {
  const { userId } = auth();
  if (!userId) notFound();

  const { id, reps, weight } = sets;
  const { title, date } = workout;
  const { comment } = workout_exercise;
  return await db
    .select({
      id,
      reps,
      weight,
      comment,
      workoutDate: date,
      workoutId: workout.id,
      workoutTitle: title,
    })
    .from(sets)
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .innerJoin(exercise, eq(exercise.id, workout_exercise.exerciseId)) // ?
    .innerJoin(workout, eq(workout.id, workout_exercise.workoutId))
    .where(and(eq(exercise.id, exerciseId), eq(exercise.userId, userId)))
    .all()
    .then((data) =>
      data.sort(
        (a, b) =>
          new Date(b.workoutDate ?? "").getTime() -
          new Date(a.workoutDate ?? "").getTime()
      )
    );
}

export async function getSetsByWorkoutId(workoutId: number) {
  const { userId } = auth();
  if (!userId) notFound();

  const { id, reps, weight, workoutExerciseId } = sets;
  return await db
    .select({
      id,
      reps,
      weight,
      workoutExerciseId,
    })
    .from(sets)
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .where(
      and(eq(workout_exercise.workoutId, workoutId), eq(sets.userId, userId))
    )
    .all();
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
