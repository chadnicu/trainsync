import { getLogsByExerciseId } from "@/app/actions";
import Log from "./Log";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const exerciseId = parseInt(params.id, 10);
  const logs = await getLogsByExerciseId(exerciseId);

  return (
    <div className="grid place-items-center gap-10">
      <h1 className="text-5xl font-bold">{logs[0]?.exerciseTitle ?? ""}</h1>
      <div>
        {logs.map((e) => (
          <div key={e.id} className="flex gap-5">
            <p className="font-semibold">{e.date.toString().slice(0, 15)}</p>{" "}
            <h1>
              {e.reps} x {e.weight}
            </h1>
            <p className="italic">({e.workoutTitle})</p>
            {e.comment && <p>{e.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
  // return <Log initialLog={logs} exerciseId={exerciseId} />;
}
