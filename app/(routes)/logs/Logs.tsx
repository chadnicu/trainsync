"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Set } from "@/lib/types";
import { cn, filterLogs } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card, CardHeader } from "@/components/ui/card";
import { getLogs } from "@/app/actions";
import LogSkeleton from "@/components/LogSkeleton";

export default function Logs() {
  const { data, isFetched } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => getLogs(),
    initialData: [],
  });

  const filteredLogs = filterLogs(data);

  if (!isFetched)
    // renew this for new layout
    return (
      <div className="flex h-full w-[93vw] flex-wrap justify-center gap-[1%] gap-y-3 px-10">
        {Array.from({ length: 16 }, (_, i) => (
          <LogSkeleton key={i} />
        ))}
      </div>
    );

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
        {/* aici o sa pun last sets sau cv */}
      </HoverCardContent>
    </HoverCard>
  );
}
