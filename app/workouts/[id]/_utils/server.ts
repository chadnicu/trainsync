"use server";

import { exercise, sets, workout, workout_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, eq, notInArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CommentInput, SetInput } from "./types";

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

export async function addSet(values: SetInput, workoutExerciseId: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .insert(sets)
    .values({ ...values, workoutExerciseId: workoutExerciseId, userId });
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

export async function addCommentToSets(
  values: CommentInput,
  workoutExerciseId: number
) {
  const { userId } = auth();
  if (!userId) notFound();

  const a = await db
    .update(workout_exercise)
    .set({ comment: values.comment })
    .where(eq(workout_exercise.id, workoutExerciseId));

  console.log("niga");
  return a;
  // .where(
  //   and(
  //     eq(workout_exercise.id, workoutExerciseId),
  //     eq(workout_exercise.userId, userId) // might need to find a fix
  //   )
  // );
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
