import { z } from "zod";

export const exerciseCommentSchema = z.object({
  comment: z.string().min(0).max(255).optional(),
});
