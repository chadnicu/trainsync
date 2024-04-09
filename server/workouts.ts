"use server";

import {
  template,
  template_exercise,
  workout,
  workout_exercise,
} from "@/lib/schema";
import { db } from "@/lib/turso";
import {
  AddWorkoutInput,
  EditWorkoutInput,
  TemplateToWorkoutInput,
} from "@/types";
import { auth } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

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

export async function createWorkout(values: AddWorkoutInput) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .insert(workout)
    .values({ ...values, date: values.date.toString(), userId });
}

export async function createWorkoutFromTemplate(
  values: TemplateToWorkoutInput
) {
  const { userId } = auth();
  if (!userId) return;

  console.log("dbiil");

  const { title, description } = (await db
    .select()
    .from(template)
    .where(eq(template.id, values.templateId))
    .limit(1)
    .get())!;

  const { id: workoutId } = await db
    .insert(workout)
    .values({
      title,
      description,
      userId,
      date: values.date.toString(),
    })
    .returning()
    .get();

  await db
    .select()
    .from(template_exercise)
    .where(eq(template_exercise.templateId, values.templateId))
    .all()
    .then(async (data) => {
      for (let i = 0; i < data.length; ) {
        await db
          .insert(workout_exercise)
          .values({
            workoutId,
            exerciseId: data[i].exerciseId,
            toDo: data[i]?.toDo,
            order: i + 1,
          })
          .returning()
          .get()
          .then(() => i++);
      }
    });
  console.log("dbiil");
}

export async function updateWorkout(
  workoutId: number,
  values: EditWorkoutInput
) {
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
