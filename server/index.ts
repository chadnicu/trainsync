"use server";

import { revalidatePath as revalPath } from "next/cache";

export async function revalidatePath(path: string, type?: "layout" | "page") {
  revalPath(path, type);
}
