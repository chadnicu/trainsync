"use server";

import { exercise, exercise_template, template } from "@/lib/schema";
import { db } from "@/lib/turso";
import { and, eq, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { z } from "zod";
import { exerciseSchema } from "@/components/ExerciseForm";
import { templateSchema } from "@/components/TemplateForm";
import { Exercise, Template } from "@/lib/types";

export async function getExercises() {
  const { userId } = auth();
  if (!userId) return [];

  const data = await db
    .select()
    .from(exercise)
    .where(eq(exercise.userId, userId))
    .all();

  return data;
}

export async function getTemplates() {
  const { userId } = auth();
  if (!userId) return [];

  const data = await db
    .select()
    .from(template)
    .where(eq(template.userId, userId))
    .all();

  return data;
}

export async function createExercise(values: z.infer<typeof exerciseSchema>) {
  const { userId } = auth();
  if (!userId) return {};

  const newExercise = await db
    .insert(exercise)
    .values({ ...values, userId })
    .returning()
    .get();

  return newExercise;
}

export async function createTemplate(values: z.infer<typeof templateSchema>) {
  const { userId } = auth();
  if (!userId) return {};

  const newTemplate = await db
    .insert(template)
    .values({ ...values, userId })
    .returning()
    .get();

  return newTemplate;
}

export async function editExercise(old: Exercise, data?: FormData) {
  const { userId } = auth();
  if (!userId) return;

  const title = data?.get("title")?.toString() || old.title,
    instructions = data?.get("instructions")?.toString() || old.instructions,
    url = data?.get("url")?.toString() || old.url;

  const res = await db
    .update(exercise)
    .set({ title, instructions, url })
    .where(eq(exercise.id, old.id))
    .returning()
    .get();

  await db
    .select()
    .from(exercise_template)
    .where(eq(exercise_template.exerciseId, old.id))
    .all()
    .then((data) =>
      data.forEach(({ id }) => revalidatePath(`/templates/${id}`))
    );
}

export async function editTemplate(old: Template, data?: FormData) {
  const { userId } = auth();
  if (!userId) return;

  const title = data?.get("title")?.toString() || old.title,
    description = data?.get("description")?.toString() || old.description;

  await db
    .update(template)
    .set({ title, description })
    .where(eq(template.id, old.id))
    .returning()
    .get();

  revalidatePath(`/templates/${old.id}`);
}

export async function deleteExercise(id: number) {
  const { userId } = auth();
  if (!userId) return;

  // unlink it from all templates first
  await db
    .delete(exercise_template)
    .where(eq(exercise_template.exerciseId, id))
    .returning()
    .get();

  await db.delete(exercise).where(eq(exercise.id, id)).returning().get();
}

export async function deleteTemplate(id: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .delete(exercise_template)
    .where(eq(exercise_template.templateId, id))
    .returning()
    .get();

  await db.delete(template).where(eq(template.id, id)).returning().get();
}

export async function addExerciseToTemplate(
  exerciseId: number,
  templateId: number
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .insert(exercise_template)
    .values({ exerciseId, templateId })
    .returning()
    .get();

  revalidatePath(`/templates/${templateId}`);
}

export async function removeExerciseFromTemplate(
  exerciseId: number,
  templateId: number
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .delete(exercise_template)
    .where(
      and(
        eq(exercise_template.exerciseId, exerciseId),
        eq(exercise_template.templateId, templateId)
      )
    )
    .returning()
    .get();

  revalidatePath(`/templates/${templateId}`);
}

export async function getCurrentTemplate(templateId: number) {
  const currentTemplate = await db
    .select()
    .from(template)
    .where(eq(template.id, templateId))
    .limit(1)
    .get();

  return currentTemplate;
}

export async function getExercisesByTemplateId(templateId: number) {
  const { userId } = auth();
  if (!userId) return { templatesExercises: [], otherExercises: [] };

  const templatesExercises = await db
    .select()
    .from(exercise_template)
    .innerJoin(exercise, eq(exercise_template.exerciseId, exercise.id))
    .where(eq(exercise_template.templateId, templateId))
    .all()
    .then((data) => data.map(({ exercise }) => exercise));

  const exerciseIds = templatesExercises.length
    ? templatesExercises.map((e) => e.id)
    : [-1];

  const otherExercises = await db
    .select()
    .from(exercise)
    .where(
      and(eq(exercise.userId, userId), notInArray(exercise.id, exerciseIds))
    )
    .all();

  return { templatesExercises, otherExercises };
}
