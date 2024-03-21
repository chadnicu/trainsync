import { z } from "zod";

export const templateSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(0).max(255).optional(),
});
