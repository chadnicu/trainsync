import AddButton from "@/components/AddButtonn";
import ComboBox from "@/components/ComboBox";
import ComboboxDemo from "@/components/ComboBox";
import CoolView from "@/components/CoolView";
import { DeleteButton } from "@/components/DeleteButton";
import RemoveButton from "@/components/RemoveButton";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { exercise, exercise_session, session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { eq, notInArray } from "drizzle-orm";

export default async function Page({ params }: { params: { id: string } }) {
  const sessionId = parseInt(params.id, 10);

  const currentSession = await db
    .select()
    .from(session)
    .where(eq(session.id, sessionId))
    .limit(1)
    .get();

  const existing = await db
    .select()
    .from(exercise_session)
    .rightJoin(exercise, eq(exercise_session.exercise_id, exercise.id))
    .where(eq(exercise_session.session_id, sessionId))
    .all();

  const exerciseIds = await db
    .select()
    .from(exercise_session)
    .where(eq(exercise_session.session_id, sessionId))
    .all()
    .then((data) =>
      data.length !== 0 ? data.map((e) => e.exercise_id) : [-1]
    );

  const other = await db
    .select()
    .from(exercise)
    .where(notInArray(exercise.id, exerciseIds))
    .all();

  return (
    <div className="p-10 text-center">
      <h1 className="text-5xl font-bold">{currentSession.title}</h1>

      <div className="mt-10 flex justify-around">
        <div className="grid gap-2">
          {existing.map((e) => (
            <div key={e.exercise.id}>
              <div className="flex w-80 items-center justify-between border py-5 px-7">
                <div className="text-left">
                  <HoverExercise data={e.exercise} />
                </div>
                <div className="">
                  <DeleteButton id={e.exercise.id} table={"exercises"} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <ComboBox
          exercises={other.map((e) => ({
            value: e.title.toLowerCase(),
            label: e.title,
            exerciseId: e.id,
            sessionId: sessionId,
          }))}
        />
      </div>
    </div>
  );
}

function HoverExercise({
  data,
}: {
  data: {
    id: number;
    title: string;
    instructions: string | null;
    url: string | null;
  };
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant={"link"} className="p-0 text-left text-xl font-bold">
          {data.title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit max-w-xs">
        <div className="flex justify-between space-x-4 space-y-1">
          <p className="text-sm">{data.instructions || "No instructions"}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
