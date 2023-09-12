"use client";

import { Set } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card, CardHeader } from "@/components/ui/card";

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
    <div className="grid h-full w-full grid-cols-1 place-items-center items-end gap-3 px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {!logs.length && <p>you have no logs</p>}
      {logs
        .filter(
          (item, i, arr) =>
            arr.findIndex((each) => each.title === item.title) === i
        )
        .sort((a, b) => a.title?.localeCompare(b.title))
        .map((e) => (
          <Card key={e.id} className="w-full max-w-[300px]">
            <CardHeader className="break-words">
              <HoverLog log={e} />
            </CardHeader>
            {/* <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-lg font-bold"
              )}
              href={`/logs/${e.exerciseId}`}
            >
              {e.title}
            </Link> */}
          </Card>
        ))}
    </div>
  );
}

function HoverLog({
  log,
}: {
  log: Set & {
    title: string;
    exerciseId: number;
  };
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/logs/${log.exerciseId}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "px-0 py-3 text-left text-xl font-bold text-foreground"
          )}
        >
          {log.title}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        {/* <p className="text-sm">{log?.description || "No description"}</p> */}
        {/* aici o sa pun last sets sau c */}
      </HoverCardContent>
    </HoverCard>
  );
}
