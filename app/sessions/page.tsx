import { db } from "@/lib/turso";
import Sessions from "./Sessions";
import { session } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import SessionForm from "@/components/SessionForm";

export type SessionType = {
  title: string;
  id: number;
  userId: string;
  description: string | null;
}[];

export default async function Page() {
  const { userId } = auth();
  const sessions = await db
    .select()
    .from(session)
    .where(eq(session.userId, userId ?? "niger"))
    .all();

  return (
    <div className="grid justify-between p-10 md:flex md:flex-row-reverse md:justify-between">
      <SessionForm />
      <Sessions sessions={sessions} />
    </div>
  );
}
