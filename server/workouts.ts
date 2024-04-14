"use server";

import {
  sets,
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
import { and, desc, eq, inArray } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

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

  const { id: setId } = sets;

  const setIdsToDelete = await db
    .select({ setId })
    .from(sets)
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .where(
      and(eq(workout_exercise.workoutId, workoutId), eq(sets.userId, userId))
    )
    .all()
    .then((data) => data.map(({ setId }) => setId));

  await db.delete(sets).where(inArray(sets.id, setIdsToDelete));

  await db
    .delete(workout_exercise)
    .where(eq(workout_exercise.workoutId, workoutId));

  await db
    .delete(workout)
    .where(and(eq(workout.id, workoutId), eq(workout.userId, userId)));
}

export async function getWorkoutById(workoutId: number) {
  const { userId } = auth();
  if (!userId) notFound();

  const data = await db
    .select()
    .from(workout)
    .where(and(eq(workout.id, workoutId), eq(workout.userId, userId)))
    .limit(1);

  if (data.length && data[0]) return data[0];

  return null;
  // notFound();
}
