import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const exercise = sqliteTable("exercise", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  instructions: text("instructions"),
  url: text("url"),
});

export const session = sqliteTable("session", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
});

export const exercise_session = sqliteTable("exercise_session", {
  id: integer("id").primaryKey(),
  exercise_id: integer("exercise_id").references(() => exercise.id),
  session_id: integer("session_id").references(() => session.id),
});
