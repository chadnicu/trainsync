import AddButton from "@/components/AddButtonn";
import ComboBox from "@/components/ComboBox";
import ComboboxDemo from "@/components/ComboBox";
import CoolView from "@/components/CoolView";
import RemoveButton from "@/components/RemoveButton";
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
              <CoolView
                data={e.exercise}
                button={<RemoveButton ex={e.exercise.id} sesh={sessionId} />}
              />
            </div>
          ))}
        </div>
        {/* <div className="grid gap-2">
          {other.map((e) => (
            <div key={e.id}>
              <ExerciseView
                data={e}
                button={<AddButton ex={e.id} sesh={sessionId} />}
              />
            </div>
          ))}

        </div> */}
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

