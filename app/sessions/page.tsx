import { db } from "@/lib/turso";
import Sessions from "./Sessions";
import { session } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import SessionForm from "@/components/SessionForm";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const sessions = await db
    .select()
    .from(session)
    .where(eq(session.userId, userId))
    .all();

  return (
    <div className="grid gap-2 p-10 md:flex md:flex-row-reverse md:justify-between">
      <SessionForm />
      <Sessions sessions={sessions} />
    </div>
  );
}
