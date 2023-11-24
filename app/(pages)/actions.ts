"use server";

import {
  exercise,
  exercise_template,
  sets,
  template,
  workout,
  workout_exercise,
} from "@/lib/schema";
import { db } from "@/lib/turso";
import { and, desc, eq, inArray, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { z } from "zod";
import { exerciseSchema } from "@/components/ExerciseForm";
import { templateSchema } from "@/components/TemplateForm";
import { Exercise, Template, Workout } from "@/lib/types";
import { workoutSchema } from "@/components/WorkoutForm";
import { setSchema } from "@/components/AddSetForm";
import { templateToWorkoutSchema } from "./templates/[id]/Template";
import { NextResponse } from "next/server";

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

  await db
    .select()
    .from(exercise_template)
    .where(eq(exercise_template.exerciseId, exerciseId))
    .all()
    .then((data) =>
      data.forEach(({ id }) => revalidatePath(`/templates/${id}`))
    );
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

  revalidatePath(`/templates/${templateId}`);
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

  // and from sets
  const setIds = await db
    .select()
    .from(sets)
    .innerJoin(
      workout_exercise,
      eq(workout_exercise.id, sets.workoutExerciseId)
    )
    .where(eq(workout_exercise.exerciseId, id))
    .all()
    .then((data) => data.map(({ sets }) => sets.id));

  if (setIds.length) {
    await db.delete(sets).where(inArray(sets.id, setIds)).returning().get();
  }

  // and from workouts
  await db
    .delete(workout_exercise)
    .where(eq(workout_exercise.exerciseId, id))
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

export async function getWorkouts() {
  const { userId } = auth();
  if (!userId) return [];

  const data = await db
    .select()
    .from(workout)
    .where(eq(workout.userId, userId))
    .orderBy(workout.started)
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
  values: z.infer<typeof workoutSchema>
) {
  const { userId } = auth();
  if (!userId) return;

  // const title = data?.get("title")?.toString() || old.title,
  //   description = data?.get("description")?.toString() || old.description,
  //   date = data?.get("date")?.toString() || old.date,
  //   started = data?.get("started")?.toString() || old.started,
  //   finished = data?.get("finished")?.toString() || old.finished,
  //   comment = data?.get("comment")?.toString() || old.comment;

  const { title, date, description } = values;
  await db
    .update(workout)
    .set({ userId, title, description, date: date.toString() })
    .where(eq(workout.id, workoutId))
    .returning()
    .get();

  revalidatePath(`/workouts/${workoutId}`);
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

  revalidatePath(`/workouts/${workoutId}`);
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

  revalidatePath(`/workouts/${workoutId}`);
}

export async function getSets() {
  const { userId } = auth();
  if (!userId) return [];

  // treb cu workoutExerciseId nu workoutId

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
    .then(
      (data) =>
        data.map(({ sets, exercise }) => {
          return {
            ...sets,
            title: exercise.title,
            exerciseId: exercise.id,
          };
        })
      // .filter(
      //   (item, i, arr) =>
      //     arr.findIndex((each) => each.title === item.title) === i
      // )
      // .sort((a, b) => a.title.localeCompare(b.title))
    );

  // console.log(logs[logs.length - 1]);

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
          .values({ workoutId, exerciseId: data[i].exerciseId })
          .returning()
          .get()
          .then(() => i++);
      }
    });
}

export async function getLastSets(workoutId: number) {
  const { userId } = auth();
  if (!userId) return [];

  const data = await db
    .select()
    .from(workout_exercise)
    .where(eq(sets.userId, userId))
    // .where(eq(workout_exercise.workoutId, workoutId))
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

export async function startWorkout(workoutId: number, started: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(workout)
    .set({ started: started.toString() })
    .where(eq(workout.id, workoutId))
    .returning()
    .get();
}

export async function getTimeStarted(workoutId: number) {
  const { userId } = auth();
  if (!userId) return null;

  const res = await db
    .select()
    .from(workout)
    .where(eq(workout.id, workoutId))
    .limit(1)
    .get()
    .then((data) => data.started);

  if (!res || res === "-1") return null;
  return res;
}

export async function finishWorkout(workoutId: number, finished: number) {
  const { userId } = auth();
  if (!userId) return;

  await db
    .update(workout)
    .set({ finished: finished.toString() })
    .where(eq(workout.id, workoutId))
    .returning()
    .get();
}

export async function getTimeFinished(workoutId: number) {
  const { userId } = auth();
  if (!userId) return null;

  const res = await db
    .select()
    .from(workout)
    .where(eq(workout.id, workoutId))
    .limit(1)
    .get()
    .then((data) => data.finished);

  if (!res || res === "-1") return null;
  return res;
}
