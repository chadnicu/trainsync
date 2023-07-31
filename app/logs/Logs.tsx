"use client";

import { Set } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Logs() {
  const queryClient = useQueryClient();

  function queryLogs() {
    const data = queryClient.getQueryData(["logs"]);
    if (!data) return [];
    return data as (Set & {
      title: string;
      exerciseId: number;
    })[];
  }

  const { data: logs } = useQuery({
    queryKey: ["logs"],
    queryFn: queryLogs,
    initialData: () => queryLogs(),
  });

  return (
    <div className="grid grid-cols-1 items-end gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {!logs.length && <p>you have no logs</p>}
      {logs
        .filter(
          (item, i, arr) =>
            arr.findIndex((each) => each.title === item.title) === i
        )
        .sort((a, b) => a.title?.localeCompare(b.title))
        .map((e) => (
          <div
            key={e.id}
            className="grid h-fit place-items-center gap-5 border px-7 py-5"
          >
            <Link
              className={cn(buttonVariants({ variant: "link" }), "text-lg")}
              href={`/logs/${e.exerciseId}`}
            >
              {e.title}
            </Link>
          </div>
        ))}
    </div>
  );
}
