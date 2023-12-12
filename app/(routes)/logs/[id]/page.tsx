import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getLogsByExerciseId } from "@/app/actions";
import { Metadata } from "next";
import CardsMetric from "./CardsMetric";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Logs ${params.id}`,
  };
}

export default async function Page({ params }: Props) {
  const fallback = (
    <div className="grid w-full place-items-center space-y-3 ">
      <Skeleton className="mb-7 h-12 w-[90vw] md:w-[40vw]" />
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-6 w-[70vw] md:w-[30vw]" />
      ))}
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
    <div className="flex flex-col items-center justify-center gap-10 px-5 lg:flex-row ">
      <div>
        <h1 className="mb-8 text-5xl font-bold">
          {logs[0]?.exerciseTitle ?? ""}
        </h1>
        {logs.map((e) => (
          <div key={e.id} className="flex justify-center gap-5">
            <p className="font-semibold">{e.date.toString().slice(0, 15)}</p>
            <h1>
              {e.reps} x {e.weight}
            </h1>
            <p className="italic">({e.workoutTitle})</p>
            {e.comment && <p>{e.comment}</p>}
          </div>
        ))}
      </div>
      <CardsMetric logs={logs} />
    </div>
  );
}
