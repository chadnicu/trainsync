import { db } from "@/lib/turso";
import Exercises from "./Exercises";
import { exercise } from "@/lib/schema";

export default async function Home() {
  const initialData = await db.select().from(exercise).all();

  return <Exercises exercises={initialData} />;
}
