"use client";

import { getExercisesBySeshId, removeExerciseFromSession } from "@/app/actions";
import ComboBox from "@/components/ComboBox";
import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Updater,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Exercise, Session } from "@/lib/types";

type Props = {
  session: Session;
  sessionsExercises: Exercise[];
  otherExercises: Exercise[];
};

export default function Session({
  session,
  sessionsExercises,
  otherExercises,
}: Props) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [`exercises-${session.id}`],
    queryFn: async () => {
      const data = await getExercisesBySeshId(session.id);
      return data;
    },
    initialData: { sessionsExercises, otherExercises },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await removeExerciseFromSession(id, session.id).then(() =>
        queryClient.invalidateQueries([`exercises-${session.id}`])
      );
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: [`exercises-${session.id}`],
      });
      const previous = queryClient.getQueryData([`exercises-${session.id}`]);
      queryClient.setQueryData([`exercises-${session.id}`], (old: any) => ({
        sessionsExercises: old.sessionsExercises.filter(
          (e: Exercise) => e.id !== id
        ),
        otherExercises: old.otherExercises.concat(
          old.sessionsExercises.filter((e: Exercise) => e.id === id)
        ),
      }));
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData([`exercises-${session.id}`], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`exercises-${session.id}`],
      });
    },
  });

  return (
    <div className="p-10 text-center">
      <h1 className="text-5xl font-bold">{session.title}</h1>
      <div className="mt-10 flex flex-col-reverse items-center gap-5 md:flex-row md:justify-around">
        <div className="grid gap-2">
          {data.sessionsExercises.map((e) => (
            <div
              className="flex items-center justify-between gap-10 border px-7 py-5"
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
          exercises={data.otherExercises.map((e) => ({
            value: e.title,
            label: e.title,
            exerciseId: e.id,
          }))}
          sessionId={session.id}
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
