import { exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { slug: string };
  }
) {
  const data = await request.json();
  const updated = await db
    .update(exercise)
    .set(data)
    .where(eq(exercise.id, parseInt(params.slug, 10)))
    .returning()
    .get();

  console.log(data, updated, params.slug, "su");

  return NextResponse.json(updated);
}
