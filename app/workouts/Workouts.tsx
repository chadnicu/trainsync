"use client";

import { Workout } from "@/lib/types";
import { deleteWorkout, editWorkout, getWorkouts } from "../actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import EditButton from "@/components/EditButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeleteButton } from "@/components/DeleteButton";

export default function Workouts({ workouts }: { workouts: Workout[] }) {
  const queryClient = useQueryClient();

  function queryWorkouts() {
    const data = queryClient.getQueryData(["workouts"]);
    if (!data) return [];
    return data as Workout[];
  }

  const { data } = useQuery({
    queryKey: ["workouts"],
    queryFn: queryWorkouts,
    initialData: () => queryWorkouts(),
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await deleteWorkout(id);
      queryClient.invalidateQueries(["workouts"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["workouts"] });
      const previous = queryClient.getQueryData(["workouts"]);
      queryClient.setQueryData(["workouts"], (old: any) =>
        old.filter((s: any) => s.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["workouts"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {data.map((w) => (
        <div
          key={w.id}
          className="grid h-fit place-items-center gap-5 border px-7 py-5"
        >
          <div>
            <HoverWorkout w={w} />
          </div>
          <p className="text-xs">{w.date.toString().slice(0, 15)}</p>
          <div className="flex justify-between gap-2">
            <EditButton
              action={async (formData) =>
                editWorkout(w, formData).then(() =>
                  queryClient.invalidateQueries(["workouts"])
                )
              }
              header={
                <EditButton.Header>
                  <EditButton.Title>Edit</EditButton.Title>
                  <EditButton.Description>
                    Make changes to your workout here. Click save when you
                    {"'"}re done.
                  </EditButton.Description>
                </EditButton.Header>
              }
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={w.title}
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
                  placeholder={w.description ?? ""}
                  className="col-span-3"
                />
              </div>
            </EditButton>
            <DeleteButton mutate={() => mutate(w.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HoverWorkout({ w }: { w: Workout }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/workouts/${w.id}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0 text-left text-xl font-bold"
          )}
        >
          {w.title}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        <p className="text-sm">{w?.description || "No description"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
