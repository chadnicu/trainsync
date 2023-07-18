"use client";

import { getExercisesBySeshId, removeExerciseFromSession } from "@/app/actions";
import { ExerciseType } from "@/app/exercises/Exercises";
import ComboBox from "@/components/ComboBox";
import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "../Sessions";

type Props = {
  currentSession: {
    title: string;
    id: number;
    description: string | null;
    userId: string;
  };
  exercises: {
    id: number;
    title: string;
    userId: string;
    instructions: string | null;
    url: string | null;
  }[];
  other: {
    id: number;
    title: string;
    userId: string;
    instructions: string | null;
    url: string | null;
  }[];
};

export default function Session({ currentSession, exercises, other }: Props) {
  const queryClient = useQueryClient();

  const {
    data,
  }: {
    data: { exercises: ExerciseType[]; other: ExerciseType[] };
  } = useQuery({
    queryKey: [`exercises-${currentSession.id}`],
    queryFn: async () => {
      const data = await getExercisesBySeshId(currentSession.id);
      return data;
    },
    initialData: { exercises, other },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await removeExerciseFromSession(id, currentSession.id).then(() =>
        queryClient.invalidateQueries([`exercises-${currentSession.id}`])
      );
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: [`exercises-${currentSession.id}`],
      });
      const previous = queryClient.getQueryData([
        `exercises-${currentSession.id}`,
      ]);
      queryClient.setQueryData(
        [`exercises-${currentSession.id}`],
        (old: any) => ({
          exercises: old.exercises.filter((e: ExerciseType) => e.id !== id),
          other: old.other.concat(
            old.exercises.filter((e: ExerciseType) => e.id === id)
          ),
        })
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(
        [`exercises-${currentSession.id}`],
        context?.previous
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`exercises-${currentSession.id}`],
      });
    },
  });

  console.log(data.other);

  return (
    <div className="p-10 text-center">
      <h1 className="text-5xl font-bold">{currentSession.title}</h1>
      <div className="mt-10 flex flex-col-reverse items-center gap-5 md:flex-row md:justify-around">
        <div className="grid gap-2">
          {data.exercises.map((e) => (
            <div
              className="flex items-center gap-10 border px-7 py-5"
              key={e.id}
            >
              <div>
                <HoverExercise data={e} />
              </div>
              <div>
                <DeleteButton mutate={() => mutate(e.id)} />
              </div>
            </div>
          ))}
        </div>

        <ComboBox
          exercises={data.other.map((e, i) => ({
            value: e.title,
            label: e.title,
            // label: `${i + 1}. ${e.title}`,
            exerciseId: e.id,
          }))}
          sessionId={currentSession.id}
        />
      </div>
    </div>
  );
}

function HoverExercise({
  data,
}: {
  data: {
    id: number;
    title: string;
    instructions: string | null;
    url: string | null;
  };
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant={"link"} className="p-0 text-left text-xl font-bold">
          {data?.title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        <p className="text-sm">{data?.instructions || "No instructions"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
