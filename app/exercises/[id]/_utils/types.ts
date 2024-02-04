import { z } from "zod";
import { setSchema } from "./validators";
import { getSetsById } from "./server";

export type SetInput = z.infer<typeof setSchema>;

export type Set = Awaited<ReturnType<typeof getSetsById>>[0];
