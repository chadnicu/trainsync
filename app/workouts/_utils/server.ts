"use server";

import { workout } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import { AddWorkoutInput, EditWorkoutInput } from "./types";

export async function getWorkouts() {
  const { userId } = auth();
  if (!userId) return [];

  const { id, title, description, date, started, finished, comment } = workout;
  return await db
    .select({ id, title, description, date, started, finished, comment })
    .from(workout)
    .where(eq(workout.userId, userId))
    .orderBy(desc(workout.id))
    .all();
}

export async function editWorkout(workoutId: number, values: EditWorkoutInput) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(workout)
    .set({
      ...values,
      date: values.date.toDateString(),
      started: values.started ?? null,
      finished: values.finished ?? null,
    })
    .where(and(eq(workout.id, workoutId), eq(workout.userId, userId)));
}

export async function deleteWorkout(workoutId: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .delete(workout)
    .where(and(eq(workout.id, workoutId), eq(workout.userId, userId)));
}

export async function addWorkout(values: AddWorkoutInput) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .insert(workout)
    .values({ ...values, date: values.date.toDateString(), userId });
}
