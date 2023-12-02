import { Suspense } from "react";
import { getLogs } from "../actions";
import Logs from "./Logs";

export default async function Page() {
  const fallback = <p>ADD SKELETON LOG CARDS</p>;
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
