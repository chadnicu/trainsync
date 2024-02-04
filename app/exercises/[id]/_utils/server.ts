"use server";

import { exercise, sets, workout, workout_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SetInput } from "./types";

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

export async function getSetsById(exerciseId: number) {
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
      workoutId: workout_exercise.workoutId,
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
    .all();
}

export async function addSet(values: SetInput, workoutExerciseId: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .insert(sets)
    .values({ ...values, workoutExerciseId: workoutExerciseId, userId });
}
