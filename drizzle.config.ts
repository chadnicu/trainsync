import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  connectionString: process.env.DB_URL,
} satisfies Config;
