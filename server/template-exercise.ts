"use server";

import { auth } from "@clerk/nextjs";
import { exercise, sets, template_exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { and, eq, getOrderByOperators, notInArray } from "drizzle-orm";
import { CommentInput } from "@/types";
import { notFound } from "next/navigation";

export async function getExercisesByTemplateId(templateId: number) {
  const { userId } = auth();
  if (!userId) return { inTemplate: [], other: [] };

  const { title, instructions, url } = exercise;
  const {
    id,
    todo,
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
      todo,
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

// export async function addExerciseToTemplate(values: {
//   exerciseId: number;
//   workoutId: number;
//   comment?: string;
//   todo?: string;
//   order?: number;
// }) {
//   const { userId } = auth();
//   if (!userId) return;

//   const debug = await db
//     .insert(workout_exercise)
//     .values(values)
//     .returning()
//     .get();
//   console.log(debug);
// }

// export async function updateExerciseOrder(arr: number[]) {
//   const { userId } = auth();
//   if (!userId) return;

//   const promises = arr.map((e, i) =>
//     db
//       .update(workout_exercise)
//       .set({ order: i + 1 })
//       .where(eq(workout_exercise.id, e))
//       .returning()
//       .get()
//   );

//   await Promise.all(promises);
// }

// export async function removeExerciseFromWorkout(workoutExerciseId: number) {
//   const { userId } = auth();
//   if (!userId) return;

//   await db.delete(sets).where(eq(sets.workoutExerciseId, workoutExerciseId));

//   await db
//     .delete(workout_exercise)
//     .where(eq(workout_exercise.id, workoutExerciseId));
// }

// export async function addCommentToExercise(
//   values: CommentInput,
//   workoutExerciseId: number
// ) {
//   const { userId } = auth();
//   if (!userId) notFound();

//   return await db
//     .update(workout_exercise)
//     .set({ comment: values.comment })
//     .where(eq(workout_exercise.id, workoutExerciseId));
// }

// export async function swapExercise(
//   workoutExerciseId: number,
//   exerciseId: number
// ) {
//   const { userId } = auth();
//   if (!userId) notFound();

//   return await db
//     .update(workout_exercise)
//     .set({ exerciseId })
//     .where(eq(workout_exercise.id, workoutExerciseId));
// }
