import { db } from "@/lib/turso";
import Exercises from "./Exercises";
import { exercise } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();
  const initialData = await db
    .select()
    .from(exercise)
    .where(eq(exercise.userId, userId ?? "niger"))
    .all();


  return <Exercises exercises={initialData} />;
}
