"use server";

import { exercise, sets, workout, workout_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, eq, notInArray, sql } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getWorkoutById(workoutId: number) {
  const { userId } = auth();
  if (!userId) notFound();

  return (
    await db
      .select()
      .from(workout)
      .where(and(eq(workout.id, workoutId), eq(workout.userId, userId)))
      .limit(1)
  )[0];
}

export async function getExercisesByWorkoutId(workoutId: number) {
  const { userId } = auth();
  if (!userId) return { inWorkout: [], other: [] };

  const { title, instructions, url } = exercise;
  const {
    id,
    exerciseId,
    workoutId: workout_id,
    comment,
    todo,
  } = workout_exercise;

  const inWorkout = await db
    .select({
      id,
      title,
      instructions,
      url,
      comment,
      todo,
      exerciseId,
      workout_id,
    })
    .from(workout_exercise)
    .where(eq(workout_exercise.workoutId, workoutId))
    .innerJoin(exercise, eq(workout_exercise.exerciseId, exercise.id))
    .groupBy(workout_exercise.id)
    .all();

  const exerciseIds = inWorkout.length ? inWorkout.map((e) => e.id) : [-1];

  const other = await db
    .select()
    .from(exercise)
    .where(
      and(eq(exercise.userId, userId), notInArray(exercise.id, exerciseIds))
    )
    .all();

  return { inWorkout, other };
}

export async function addExerciseToWorkout(values: {
  exerciseId: number;
  workoutId: number;
  comment?: string;
  todo?: string;
}) {
  const { userId } = auth();
  if (!userId) return;

  await db.insert(workout_exercise).values(values);
}
