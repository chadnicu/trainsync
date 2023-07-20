import { exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const data = await request.json();
  const updated = await db
    .update(exercise)
    .set({ ...data, userId })
    .where(eq(exercise.id, parseInt(params.id, 10)))
    .returning()
    .all();

  console.log(data, updated, params.id, "su");

  return NextResponse.json(updated);
}
