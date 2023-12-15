"use server";

import { and, desc, eq, inArray, notInArray } from "drizzle-orm";
import { z } from "zod";
import {
  exercise,
  exercise_template,
  sets,
  template,
  workout,
  workout_exercise,
} from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { exerciseSchema } from "@/components/ExerciseForm";
import { templateSchema } from "@/components/TemplateForm";
import { workoutSchema } from "@/components/WorkoutForm";
import { setSchema } from "@/components/AddSetForm";
import { templateToWorkoutSchema } from "@/app/(routes)/templates/[id]/Template";
import { Workout } from "@/lib/types";

export async function getExercises() {
  const { userId } = auth();
  if (!userId) return [];

  const data = await db
    .select()
    .from(exercise)
    .where(eq(exercise.userId, userId))
    .orderBy(desc(exercise.id))
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
    .orderBy(desc(template.id))
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

export async function editExercise(
  exerciseId: number,
  data: z.infer<typeof exerciseSchema>
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(exercise)
    .set(data)
    .where(eq(exercise.id, exerciseId))
    .returning()
    .get();
}

export async function editTemplate(
  templateId: number,
  values: z.infer<typeof templateSchema>
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(template)
    .set(values)
    .where(eq(template.id, templateId))
    .returning()
    .get();
}

export async function deleteExercise(id: number) {
  const { userId } = auth();
  if (!userId) return;

  const [_, setIds] = await Promise.all([
    db
      .delete(exercise_template)
      .where(eq(exercise_template.exerciseId, id))
      .returning()
      .get(),
    db
      .select()
      .from(sets)
      .innerJoin(
        workout_exercise,
        eq(workout_exercise.id, sets.workoutExerciseId)
      )
      .where(eq(workout_exercise.exerciseId, id))
      .all()
      .then((data) => data.map(({ sets }) => sets.id)),
  ]);

  await Promise.all([
    setIds.length
      ? db.delete(sets).where(inArray(sets.id, setIds)).returning().get()
      : null,
    db
      .delete(workout_exercise)
      .where(eq(workout_exercise.exerciseId, id))
      .returning()
      .get(),
  ]);

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
    .then((data) =>
      data.map(({ exercise, exercise_template }) => ({
        ...exercise,
        todo: exercise_template.todo,
      }))
    );

  const exerciseIds = templatesExercises.length
    ? templatesExercises.map((e) => e.id)
    : [-1];

  const otherExercises = await db
    .select()
    .from(exercise)
    .where(
      and(eq(exercise.userId, userId), notInArray(exercise.id, exerciseIds))
    )
    // .innerJoin(exercise_template, eq(exercise.id, exercise_template.exerciseId))
    .all();
  // .then((data) =>
  //   data.map(({ exercise, exercise_template }) => ({
  //     ...exercise,
  //     todo: exercise_template.todo,
  //   }))
  // );

  return { templatesExercises, otherExercises };
}

export async function getWorkouts() {
  const { userId } = auth();
  if (!userId) return [];

  const data = await db
    .select()
    .from(workout)
    .where(eq(workout.userId, userId))
    .orderBy(desc(workout.id))
    .all();

  return data;
}

export async function createWorkout(values: z.infer<typeof workoutSchema>) {
  const { userId } = auth();
  if (!userId) return {};

  await db
    .insert(workout)
    .values({ ...values, userId, date: values.date.toString() })
    .returning()
    .get();
}

export async function getExercisesByWorkoutId(workoutId: number) {
  const { userId } = auth();
  if (!userId) return { workoutsExercises: [], otherExercises: [] };

  const workoutsExercises = await db
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

  const exerciseIds = workoutsExercises.length
    ? workoutsExercises.map((e) => e.id)
    : [-1];

  const otherExercises = await db
    .select()
    .from(exercise)
    .where(
      and(eq(exercise.userId, userId), notInArray(exercise.id, exerciseIds))
    )
    .all();

  return { workoutsExercises, otherExercises };
}

export async function editWorkout(
  workoutId: number,
  values: z.infer<typeof workoutSchema> | Workout
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(workout)
    .set({
      ...values,
      date:
        typeof values.date === "string" ? values.date : values.date.toString(),
    })
    .where(eq(workout.id, workoutId))
    .returning()
    .get();
}

export async function deleteWorkout(workoutId: number) {
  const { userId } = auth();
  if (!userId) return;

  const setIdsToDelete = await db
    .select()
    .from(sets)
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .where(eq(workout_exercise.workoutId, workoutId))
    .all()
    .then((data) => (data.length ? data.map(({ sets }) => sets.id) : [-1]));

  await db
    .delete(sets)
    .where(inArray(sets.id, setIdsToDelete))
    .returning()
    .get();

  await db
    .delete(workout_exercise)
    .where(eq(workout_exercise.workoutId, workoutId))
    .returning()
    .get();

  await db.delete(workout).where(eq(workout.id, workoutId)).returning().get();
}

export async function addExerciseToWorkout(
  exerciseId: number,
  workoutId: number,
  comment?: string
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .insert(workout_exercise)
    .values({ exerciseId, workoutId })
    .returning()
    .get();
}

export async function getCurrentWorkout(workoutId: number) {
  const currentWorkout = await db
    .select()
    .from(workout)
    .where(eq(workout.id, workoutId))
    .limit(1)
    .get();

  return currentWorkout;
}

export async function removeExerciseFromWorkout(
  exerciseId: number,
  workoutId: number
) {
  const { userId } = auth();
  if (!userId) return;

  const setIdsToDelete = await db
    .select()
    .from(sets)
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .where(
      and(
        eq(workout_exercise.exerciseId, exerciseId),
        eq(workout_exercise.workoutId, workoutId)
      )
    )
    .all()
    .then((data) => (data.length ? data.map(({ sets }) => sets.id) : [-1]));

  await db
    .delete(sets)
    .where(inArray(sets.id, setIdsToDelete))
    .returning()
    .get();

  await db
    .delete(workout_exercise)
    .where(
      and(
        eq(workout_exercise.exerciseId, exerciseId),
        eq(workout_exercise.workoutId, workoutId)
      )
    )
    .returning()
    .get();
}

export async function getSets() {
  const { userId } = auth();
  if (!userId) return [];

  const data = await db
    .select()
    .from(sets)
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .where(eq(sets.userId, userId))
    .all()
    .then((data) => data.map(({ sets }) => sets));

  return data;
}

export async function createSet(
  values: z.infer<typeof setSchema>,
  workoutExerciseId: number
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .insert(sets)
    .values({ ...values, workoutExerciseId, userId })
    .returning()
    .get();
}

export async function deleteSet(id: number) {
  const { userId } = auth();
  if (!userId) return;

  await db.delete(sets).where(eq(sets.id, id)).returning().get();
}

export async function editSet(
  values: { reps: number; weight: number },
  id: number
) {
  const { userId } = auth();
  if (!userId) return;

  await db.update(sets).set(values).where(eq(sets.id, id)).returning().get();
}

export async function getLogs() {
  const { userId } = auth();
  if (!userId) return [];

  const logs = await db
    .select()
    .from(sets)
    .where(eq(sets.userId, userId))
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .innerJoin(exercise, eq(exercise.id, workout_exercise.exerciseId))
    .all()
    .then((data) =>
      data.map(({ sets, exercise }) => {
        return {
          ...sets,
          title: exercise.title,
          exerciseId: exercise.id,
        };
      })
    );

  return logs;
}

export async function getLogsByExerciseId(id: number) {
  const { userId } = auth();
  if (!userId) return [];

  const logs = await db
    .select()
    .from(sets)
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .innerJoin(workout, eq(workout.id, workout_exercise.workoutId))
    .innerJoin(exercise, eq(exercise.id, workout_exercise.exerciseId))
    .where(eq(exercise.id, id))
    .all()
    .then((data) =>
      data.map(({ sets, workout_exercise, workout, exercise }) => ({
        ...sets,
        comment: workout_exercise.comment,
        date: workout.date,
        workoutTitle: workout.title,
        exerciseTitle: exercise.title,
      }))
    );

  return logs;
}

export async function addTemplateToWorkout(
  templateId: number,
  values: z.infer<typeof templateToWorkoutSchema>
) {
  const { userId } = auth();
  if (!userId) return;

  const { title, description } = await db
    .select()
    .from(template)
    .where(eq(template.id, templateId))
    .limit(1)
    .get();

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
    .from(exercise_template)
    .where(eq(exercise_template.templateId, templateId))
    .all()
    .then(async (data) => {
      for (let i = 0; i < data.length; ) {
        await db
          .insert(workout_exercise)
          .values({
            workoutId,
            exerciseId: data[i].exerciseId,
            todo: data[i]?.todo,
          })
          .returning()
          .get()
          .then(() => i++);
      }
    });
}

export async function getLastSets(workoutId?: number) {
  const { userId } = auth();
  if (!userId) return [];

  const data = await db
    .select()
    .from(workout_exercise)
    .where(eq(sets.userId, userId))
    .innerJoin(sets, eq(sets.workoutExerciseId, workout_exercise.id))
    .all()
    .then((data) =>
      data.map(({ workout_exercise, sets }) => ({
        ...sets,
        workoutId: workout_exercise.workoutId,
        exerciseId: workout_exercise.exerciseId,
      }))
    );

  return data;
}

export async function editTemplateExercise(
  templateExerciseId: number,
  todo: string
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(exercise_template)
    .set({ todo })
    .where(eq(exercise_template.exerciseId, templateExerciseId))
    .returning()
    .get();
}

export async function editWorkoutExercise(
  workoutExerciseId: number,
  comment: string
) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(workout_exercise)
    .set({ comment })
    .where(eq(workout_exercise.id, workoutExerciseId))
    .returning()
    .get();
}
