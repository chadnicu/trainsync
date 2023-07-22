import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const exercise = sqliteTable("exercise", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  instructions: text("instructions"),
  url: text("url"),
  userId: text("user_id").notNull(),
});

export const template = sqliteTable("template", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: text("user_id").notNull(),
});

export const exercise_template = sqliteTable("exercise_template", {
  id: integer("id").primaryKey(),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercise.id),
  templateId: integer("template_id")
    .notNull()
    .references(() => template.id),
});

export const workout = sqliteTable("workout", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  started: text("started"),
  finished: text("finished"),
  comment: text("comment"),
});

export const workout_exercise = sqliteTable("workout_exercise", {
  id: integer("id").primaryKey(),
  comment: text("comment"),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workout.id),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercise.id),
});

export const sets = sqliteTable("sets", {
  id: integer("id").primaryKey(),
  reps: integer("reps"),
  weight: integer("weight"),
  workoutExerciseId: integer("workout_exercise_id")
    .notNull()
    .references(() => workout_exercise.id),
});
