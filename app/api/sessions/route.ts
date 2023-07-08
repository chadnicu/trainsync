import { session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const data = await request.json();
  const newRecord = await db
    .insert(session)
    .values({ ...data, userId })
    .returning()
    .all();

  revalidatePath(`/sessions/${data.id}`);
  revalidatePath("/sessions");

  return NextResponse.json(newRecord);
}

export async function GET() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const data = await db
    .select()
    .from(session)
    .where(eq(session.userId, userId))
    .all();

  revalidatePath("/sessions"); // optional

  return new NextResponse(JSON.stringify(data));
}
