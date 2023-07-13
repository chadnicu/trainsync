import { removeExerciseFromSession } from "@/app/actions";
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

  const exercises = await db
    .select()
    .from(exercise_session)
    .innerJoin(exercise, eq(exercise_session.exerciseId, exercise.id))
    .where(eq(exercise_session.sessionId, sessionId))
    .all()
    .then((data) => data.map(({ exercise }) => exercise));

  // const exerciseIds = await db
  //   .select()
  //   .from(exercise_session)
  //   .where(eq(exercise_session.sessionId, sessionId))
  //   .all()
  //   .then((data) => (data.length !== 0 ? data.map((e) => e.exerciseId) : [-1]));

  const exerciseIds = exercises.length ? exercises.map((e) => e.id) : [-1];

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
          {exercises.map((e) => (
            <div key={e.id}>
              <div className="flex w-80 items-center justify-between border px-7 py-5">
                <div className="text-left">
                  <HoverExercise data={e} />
                </div>
                <div className="">
                  <DeleteButton
                    // mutate={async () =>
                    //   await removeExerciseFromSession(e.id, sessionId)
                    // }
                    fromServer={{ exerciseId: e.id, sessionId }}
                  />
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
