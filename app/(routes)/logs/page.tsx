import Logs from "./Logs";
import LogSkeleton from "@/components/LogSkeleton";
import { Suspense } from "react";
import { getLogs } from "@/app/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logs",
};

export default async function Page() {
  // will need to renew this cuz of new layout
  const fallback = (
    <div className="flex h-full w-[93vw] flex-wrap justify-center gap-[1%] gap-y-3 px-10">
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
