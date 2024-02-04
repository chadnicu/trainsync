import { z } from "zod";

export const setSchema = z.object({
  reps: z.coerce.number().min(1),
  weight: z.coerce.number().min(1),
});
