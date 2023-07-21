import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const exercise = sqliteTable("exercise", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  instructions: text("instructions"),
  url: text("url"),
  userId: text("user_id").notNull(),
});

export const session = sqliteTable("session", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: text("user_id").notNull(),
});

export const exercise_session = sqliteTable("exercise_session", {
  id: integer("id").primaryKey(),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercise.id),
  sessionId: integer("session_id")
    .notNull()
    .references(() => session.id),
});
