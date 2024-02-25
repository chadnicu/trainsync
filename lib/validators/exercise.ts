import { z } from "zod";

export const exerciseSchema = z.object({
  title: z.string().min(1).max(80),
  instructions: z.string().min(0).max(255).optional(),
  url: z
    .string()
    .url()
    .refine((url) =>
      /^(https?:\/\/)?(www\.)?(youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)?([a-zA-Z0-9_-]{11})/.test(
        url
      )
    )
    .optional()
    .or(z.literal("")),
});
