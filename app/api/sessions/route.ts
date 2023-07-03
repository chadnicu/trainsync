import { session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newRecord = await db.insert(session).values(data).returning().get();

  revalidatePath(`/sessions/${data.id}`);
  revalidatePath("/sessions");

  return NextResponse.json(newRecord);
}

export async function GET() {
  const data = await db.select().from(session).all();

  revalidatePath("/sessions"); // optional

  return new NextResponse(JSON.stringify(data));
}
