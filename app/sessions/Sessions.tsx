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
import { deleteSession, editSession, getSessions } from "../actions";
import { EditButton } from "@/components/EditButton";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Session } from "@/lib/types";

export default function Sessions({ sessions }: { sessions: Session[] }) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
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
            className="grid h-fit place-items-center gap-5 border px-7 py-5"
          >
            <div>
              <HoverSession s={s} />
            </div>
            <div className="flex justify-between gap-2">
              <EditButton
                data={s}
                action={async (formData) =>
                  editSession(s, formData).then(() => {
                    queryClient.invalidateQueries(["sessions"]);
                    queryClient.invalidateQueries(["sessions-navbar"]);
                  })
                }
                header={
                  <DialogHeader>
                    <DialogTitle>Edit</DialogTitle>
                    <DialogDescription>
                      Make changes to your session here. Click save when you
                      {"'"}re done.
                    </DialogDescription>
                  </DialogHeader>
                }
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder={s.title}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={s.description ?? ""}
                    className="col-span-3"
                  />
                </div>
              </EditButton>
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
