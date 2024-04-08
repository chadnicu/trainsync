"use server";

import { auth } from "@clerk/nextjs";
import { exercise, template_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { and, eq, notInArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ToDoInput } from "@/types";

export async function getExercisesByTemplateId(templateId: number) {
  const { userId } = auth();
  if (!userId) return { inTemplate: [], other: [] };

  const { title, instructions, url } = exercise;
  const {
    id,
    toDo,
    exerciseId,
    templateId: template_id,
    order,
  } = template_exercise;

  const inTemplate = await db
    .select({
      id,
      title,
      instructions,
      url,
      toDo,
      exerciseId,
      template_id,
      order,
    })
    .from(template_exercise)
    .where(eq(template_exercise.templateId, templateId))
    .innerJoin(exercise, eq(template_exercise.exerciseId, exercise.id))
    .groupBy(template_exercise.id)
    .orderBy(template_exercise.order)
    .all();

  const exerciseIds = inTemplate.length
    ? inTemplate.map((e) => e.exerciseId)
    : [-1];

  const other = await db
    .select()
    .from(exercise)
    .where(
      and(eq(exercise.userId, userId), notInArray(exercise.id, exerciseIds))
    )
    .all();

  return { inTemplate, other };
}

export async function addExerciseToTemplate(values: {
  exerciseId: number;
  templateId: number;
  toDo?: string;
  order?: number;
}) {
  const { userId } = auth();
  if (!userId) return;

  await db.insert(template_exercise).values(values).returning().get();
}

export async function updateTemplateExerciseOrder(arr: number[]) {
  const { userId } = auth();
  if (!userId) return;

  const promises = arr.map((e, i) =>
    db
      .update(template_exercise)
      .set({ order: i + 1 })
      .where(eq(template_exercise.id, e))
      .returning()
      .get()
  );

  await Promise.all(promises);
}

export async function removeExerciseFromTemplate(templateExerciseId: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .delete(template_exercise)
    .where(eq(template_exercise.id, templateExerciseId));
}

export async function addToDoToExercise(
  values: ToDoInput,
  templateExerciseId: number
) {
  const { userId } = auth();
  if (!userId) notFound();

  return await db
    .update(template_exercise)
    .set({ toDo: values.toDo })
    .where(eq(template_exercise.id, templateExerciseId));
}

export async function swapTemplateExercise(
  templateExerciseId: number,
  exerciseId: number
) {
  const { userId } = auth();
  if (!userId) notFound();

  return await db
    .update(template_exercise)
    .set({ exerciseId })
    .where(eq(template_exercise.id, templateExerciseId));
}
