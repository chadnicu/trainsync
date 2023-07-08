import { exercise } from "@/lib/schema";
import { db } from "@/lib/turso";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const data = await db
    .select()
    .from(exercise)
    .where(eq(exercise.userId, userId))
    .all();

  revalidatePath("/exercises"); // optional

  return new NextResponse(JSON.stringify(data));
}

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const data = await request.json();
  const newRecord = await db
    .insert(exercise)
    .values({ ...data, userId })
    .returning()
    .all();

  revalidatePath("/exercises"); // optional

  return NextResponse.json(newRecord);
}
