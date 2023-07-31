"use client";

import { Set } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getLogs } from "../actions";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Logs({
  initialLogs,
}: {
  initialLogs: (Set & {
    title: string;
    exerciseId: number;
  })[];
}) {
  const { data: logs } = useQuery({
    queryKey: ["logs"],
    queryFn: getLogs,
    initialData: initialLogs,
  });

  return (
    <div className="grid grid-cols-3 items-end gap-10 lg:grid-cols-4 xl:grid-cols-5">
      {!logs.length && <p>you have no logs</p>}
      {logs.map((e) => (
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
