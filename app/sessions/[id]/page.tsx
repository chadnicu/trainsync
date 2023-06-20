import AddButton from "@/components/AddButtonn";
import RemoveButton from "@/components/RemoveButton";
import { exercise, exercise_session, session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { notEqual } from "assert";
import {
  and,
  eq,
  inArray,
  isNull,
  ne,
  not,
  notExists,
  notInArray,
  or,
  sql,
} from "drizzle-orm";

export default async function Page({ params }: { params: { id: string } }) {
  const sessionId = parseInt(params.id, 10);

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
      data.length !== 0
        ? data.map((e) => (e.exercise_id === null ? -1 : e.exercise_id))
        : [-1]
    );

  const other = await db
    .select()
    .from(exercise)
    .where(notInArray(exercise.id, exerciseIds))
    .all();

  return (
    <div className="p-20 text-center">
      <h1 className="text-5xl font-bold">{sessionId}</h1>
      <div className="grid grid-cols-6">
        {existing.map((e) => {
          const { id, title, instructions, url } = e.exercise;
          return (
            <div
              key={id}
              className="grid w-fit place-items-center gap-2 border p-5"
            >
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm">{instructions}</p>
              <div className="flex gap-2">
                <RemoveButton ex={id} sesh={sessionId} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-6">
        {other.map((e) => {
          const { id, title, instructions, url } = e;
          return (
            <div
              key={id}
              className="grid w-fit place-items-center gap-2 border p-5"
            >
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm">{instructions}</p>
              <div className="flex gap-2">
                <AddButton ex={id} sesh={sessionId} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
