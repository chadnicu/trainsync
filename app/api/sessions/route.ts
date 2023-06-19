import { session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newRecord = await db.insert(session).values(data).returning().get();

  return NextResponse.json(newRecord);
}

export async function GET() {
  const data = await db.select().from(session).all();

  return new NextResponse(JSON.stringify(data));
}
