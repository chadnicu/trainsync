import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const frameworks = sqliteTable("frameworks", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  language: text("language").notNull(),
  url: text("url").notNull(),
  stars: integer("stars").notNull(),
});
