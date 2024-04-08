import { z } from "zod";

export const templateToDoSchema = z.object({
  toDo: z.string().min(0).max(255).optional(),
});
