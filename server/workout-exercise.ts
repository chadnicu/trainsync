"use server";

import { auth } from "@clerk/nextjs";
import { exercise, sets, workout, workout_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { and, eq, notInArray } from "drizzle-orm";
import { CommentInput } from "@/types";
import { notFound } from "next/navigation";

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
    order,
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
      order,
    })
    .from(workout_exercise)
    .where(eq(workout_exercise.workoutId, workoutId))
    .innerJoin(exercise, eq(workout_exercise.exerciseId, exercise.id))
    .groupBy(workout_exercise.id)
    .orderBy(workout_exercise.order)
    .all();

  const exerciseIds = inWorkout.length
    ? inWorkout.map((e) => e.exerciseId)
    : [-1];

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
  order?: number;
}) {
  const { userId } = auth();
  if (!userId) return;

  await db.insert(workout_exercise).values(values);
}

export async function updateExerciseOrder(arr: number[]) {
  const { userId } = auth();
  if (!userId) return;

  const promises = arr.map((e, i) =>
    db
      .update(workout_exercise)
      .set({ order: i + 1 })
      .where(eq(workout_exercise.id, e))
      .returning()
      .get()
  );

  await Promise.all(promises);
}

export async function removeExerciseFromWorkout(workoutExerciseId: number) {
  const { userId } = auth();
  if (!userId) return;

  const a = await db
    .delete(sets)
    .where(eq(sets.workoutExerciseId, workoutExerciseId))
    .returning()
    .get();

  // hz dc nu merge
  console.log(workoutExerciseId);
  console.log(a, "nige");

  await db
    .delete(workout_exercise)
    .where(eq(workout_exercise.id, workoutExerciseId));
}

export async function addCommentToExercise(
  values: CommentInput,
  workoutExerciseId: number
) {
  const { userId } = auth();
  if (!userId) notFound();

  return await db
    .update(workout_exercise)
    .set({ comment: values.comment })
    .where(eq(workout_exercise.id, workoutExerciseId));
}
