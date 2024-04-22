import { z } from "zod";

export const addWorkoutSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(0).max(255).optional(),
  date: z.date({
    required_error: "Date of workout is required.",
  }),
});

export const editWorkoutSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(0).max(255).optional(),
  date: z.date({
    required_error: "Date of workout is required.",
  }),
  started: z
    .string()
    // .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    //   message: "Invalid time format. Expected HH:MM",
    // })
    .optional(),
  finished: z
    .string()
    // .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    //   message: "Invalid time format. Expected HH:MM",
    // })
    .optional(),
  comment: z.string().min(0).max(255).optional(),
  clearTime: z.boolean().default(false).optional(),
});

export const templateToWorkoutSchema = z.object({
  date: z.date({
    required_error: "Date of workout is required.",
  }),
  templateId: z.coerce
    .number()
    .positive({ message: "Please select a template." }),
});

export const editDurationSchema = z.object({
  started: z
    .string()
    .optional(),
  finished: z
    .string()
    .optional(),
  clearTime: z.boolean().default(false).optional(),
});
