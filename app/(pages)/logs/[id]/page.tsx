import { getLogsByExerciseId } from "@/app/(pages)/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

// export const dynamic = "force-dynamic";

export default function Page({ params }: { params: { id: string } }) {
  const fallback = (
    <div className="grid place-items-center gap-10">
      <Skeleton className="h-12 w-[500px]" />
      <div className="space-y-3">
        {new Array(8).fill(null).map((_, i) => (
          <Skeleton key={i} className="h-6 w-[350px]" />
        ))}
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      <FetchLogs exerciseId={params.id} />
    </Suspense>
  );
}

async function FetchLogs({ exerciseId }: { exerciseId: string }) {
  const logs = await getLogsByExerciseId(parseInt(exerciseId, 10));

  return (
    <div className="grid place-items-center gap-10">
      <h1 className="text-5xl font-bold">{logs[0]?.exerciseTitle ?? ""}</h1>
      <div>
        {logs.map((e) => (
          <div key={e.id} className="flex gap-5">
            <p className="font-semibold">{e.date.toString().slice(0, 15)}</p>
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
}
