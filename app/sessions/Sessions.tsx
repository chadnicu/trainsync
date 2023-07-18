"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DeleteButton } from "@/components/DeleteButton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { deleteSession } from "../actions";

export type Session = {
  id: number;
  title: string;
  description: string | null;
};

export async function getSessions() {
  const { data } = await axios.get("/api/sessions");
  return data;
}

export default function Sessions({ sessions }: { sessions: Session[] }) {
  const queryClient = useQueryClient();

  const { data }: { data: Session[] } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
    initialData: sessions,
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await deleteSession(id);
      queryClient.invalidateQueries(["sessions"]);
      queryClient.invalidateQueries(["sessions-navbar"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previous = queryClient.getQueryData(["sessions"]);
      queryClient.setQueryData(["sessions"], (old: any) =>
        old.filter((s: any) => s.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["sessions"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return (
    <div>
      {!data.length && <p>you have no sessions</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {data.map((s) => (
          <div
            key={s.id}
            className="flex h-fit items-center justify-between gap-10 border px-7 py-5"
          >
            <div>
              <HoverSession s={s} />
            </div>
            <div>
              <DeleteButton mutate={() => mutate(s.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoverSession({ s }: { s: Session }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/sessions/${s?.id}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0 text-left text-xl font-bold"
          )}
        >
          {s.title}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        <p className="text-sm">{s?.description || "No description"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
