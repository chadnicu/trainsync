import Sessions from "./Sessions";
import SessionForm from "@/components/SessionForm";
import { getSessions } from "../actions";

export default async function Page() {
  const sessions = await getSessions();

  return (
    <div className="grid gap-2 p-10 md:flex md:flex-row-reverse md:justify-between">
      <SessionForm />
      <Sessions sessions={sessions} />
    </div>
  );
}
