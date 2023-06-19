import { db } from "@/lib/turso";
import Sessions from "./Sessions";
import { session } from "@/lib/schema";

export default async function Page() {
  const sessions = await db.select().from(session).all();
  
  return <Sessions sessions={sessions} />;
}
