"use server";

import { template, template_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { TemplateInput } from "@/types";
import { auth } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getTemplates() {
  const { userId } = auth();
  if (!userId) return [];

  const { id, title, description } = template;
  return await db
    .select({ id, title, description })
    .from(template)
    .where(eq(template.userId, userId))
    .orderBy(desc(id))
    .all();
}

export async function createTemplate(values: TemplateInput) {
  const { userId } = auth();
  if (!userId) return;

  await db.insert(template).values({ ...values, userId });
}

export async function updateTemplate(
  templateId: number,
  values: TemplateInput
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(template)
    .set(values)
    .where(and(eq(template.id, templateId), eq(template.userId, userId)));
}

export async function deleteTemplate(templateId: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .delete(template_exercise)
    .where(eq(template_exercise.templateId, templateId));
  // nu merge innerJoin la delete sa verific userId

  await db
    .delete(template)
    .where(and(eq(template.id, templateId), eq(template.userId, userId)));
}

export async function getTemplateById(templateId: number) {
  const { userId } = auth();
  if (!userId) notFound();

  const data = await db
    .select()
    .from(template)
    .where(and(eq(template.id, templateId), eq(template.userId, userId)))
    .limit(1);

  if (data.length && data[0]) return data[0];

  return null;
}
