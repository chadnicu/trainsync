"use client";

import { Set } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn, filterLogs } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card, CardHeader } from "@/components/ui/card";
import { getLogs } from "../actions";
import LogSkeleton from "@/components/LogSkeleton";

export default function Logs({
  logs,
}: {
  logs: (Set & { title: string; exerciseId: number })[];
}) {
  const { data } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => getLogs(),
    initialData: logs,
  });

  const filteredLogs = filterLogs(data);

  return (
    <div className="grid h-full w-full grid-cols-1 place-items-center items-end gap-3 px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {!data.length && <p>you have no logs</p>}
      {filteredLogs.map((e) => (
        <Card key={e.id} className="w-full max-w-[300px]">
          <CardHeader className="break-words">
            <HoverLog log={e} />
          </CardHeader>
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
