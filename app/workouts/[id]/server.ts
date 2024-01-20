"use server";

import { exercise, workout, workout_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, eq, notInArray } from "drizzle-orm";
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

  const inWorkout = await db
    .select()
    .from(workout_exercise)
    .where(eq(workout_exercise.workoutId, workoutId))
    .innerJoin(exercise, eq(workout_exercise.exerciseId, exercise.id))
    .all()
    .then((data) =>
      data.map(({ exercise, workout_exercise }) => ({
        ...exercise,
        workoutExerciseId: workout_exercise.id,
        todo: workout_exercise.todo,
        comment: workout_exercise.comment,
      }))
    );

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
