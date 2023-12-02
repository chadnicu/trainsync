import { Suspense } from "react";
import { getLogs } from "../actions";
import Logs from "./Logs";
import LogSkeleton from "@/components/LogSkeleton";

export default async function Page() {
  const fallback = (
    <div className="grid h-full w-full grid-cols-1 place-items-center items-end gap-3 px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 8 }, (_, i) => (
        <LogSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <h1 className="text-center text-5xl font-bold">Logs</h1>
      <Suspense fallback={fallback}>
        <FetchLogs />
      </Suspense>
    </>
  );
}

async function FetchLogs() {
  const logs = await getLogs();
  return <Logs logs={logs} />;
}
