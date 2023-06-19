import AddButton from "@/components/AddButtonn";
import RemoveButton from "@/components/RemoveButton";
import { exercise, exercise_session, session } from "@/lib/schema";
import { db } from "@/lib/turso";
import { eq, isNull, not, notExists, notInArray } from "drizzle-orm";

export default async function Page({ params }: { params: { id: string } }) {
  const result = await db
    .select()
    .from(exercise_session)
    .innerJoin(exercise, eq(exercise_session.exercise_id, exercise.id))
    .all();

  // const other = await db
  //   .select()
  //   .from(exercise_session)
  //   .innerJoin(exercise, eq(exercise_session.exercise_id, exercise.id))
  //   .all();

  const other = await db
    .select()
    .from(exercise_session)
    .rightJoin(exercise, eq(exercise_session.exercise_id, exercise.id))
    .where(isNull(exercise_session.exercise_id))
    .all();

  return (
    <div className="p-20 text-center">
      <h1 className="text-5xl font-bold">{params.id}</h1>

      <div className="grid grid-cols-6">
        {result.map((e) => {
          const { id, title, instructions, url } = e.exercise;
          return (
            <div
              key={id}
              className="grid w-fit place-items-center gap-2 border p-5"
            >
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm">{instructions}</p>
              <div className="flex gap-2">
                <RemoveButton ex={id} sesh={parseInt(params.id, 10)} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-6">
        {other.map((e) => {
          const { id, title, instructions, url } = e.exercise;
          return (
            <div
              key={id}
              className="grid w-fit place-items-center gap-2 border p-5"
            >
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm">{instructions}</p>
              <div className="flex gap-2">
                <AddButton ex={id} sesh={parseInt(params.id, 10)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
