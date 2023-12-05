import Logs from "./Logs";
import LogSkeleton from "@/components/LogSkeleton";
import { Suspense } from "react";
import { getLogs } from "@/app/(pages)/actions";

export default async function Page() {
  const fallback = (
    <div className="flex h-full w-screen flex-wrap justify-center gap-[1%] gap-y-3 px-10">
      {Array.from({ length: 16 }, (_, i) => (
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
