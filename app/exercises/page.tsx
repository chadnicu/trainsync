import { db } from "@/lib/turso";
import Exercises from "./Exercises";
import { exercise } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const exercises = await db
    .select()
    .from(exercise)
    .where(eq(exercise.userId, userId))
    .all();

  return <Exercises exercises={exercises} />;
}
