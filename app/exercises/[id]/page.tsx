"use client";

import { H1, P } from "@/components/typography";
import {
  invalidateExerciseAndSets,
  useExercise,
  useSets,
} from "./_utils/hooks";

import { cn, getYouTubeEmbedURL } from "@/lib/utils";
import SetsChart from "./_components/sets-chart";
import SetCard from "./_components/set-card";
import SetSkeleton from "./_components/set-skeleton";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import SetsChartSkeleton from "./_components/sets-chart-skeleton";
import { Set } from "./_utils/types";

type Props = {
  params: { id: string };
};

function groupSetsByDate(sets: Set[]): Record<string, Set[]> {
  const groupedSets: Record<string, Set[]> = {};

  sets.forEach((set) => {
    const date = set.workoutDate || "No Date";
    if (!groupedSets[date]) {
      groupedSets[date] = [];
    }
    groupedSets[date].push(set);
  });

  return groupedSets;
}

export default function Exercise({ params: { id } }: Props) {
  const exerciseId = parseInt(id, 10);

  const {
    data: exercise,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useExercise(exerciseId);
  const { data: sets } = useSets(exerciseId);

  const embedUrl = getYouTubeEmbedURL(exercise?.url ?? "");

  const queryClient = useQueryClient();

  const Error = () => (
    <P className="grid place-items-center gap-3">
      Something went wrong.
      <Button
        onClick={() => invalidateExerciseAndSets(queryClient, exerciseId)}
        className="w-fit"
      >
        Refresh
      </Button>
    </P>
  );

  const SetsSkeletons = () =>
    Array.from({ length: 6 }, (_, i) => <SetSkeleton key={i} />);

  const groupedSets = groupSetsByDate(sets);

  const Sets = () =>
    Object.entries(groupedSets).map(([date, setsForDate]) => (
      <SetCard key={date} sets={setsForDate} />
    ));

  return (
    <section className="sm:container text-center space-y-4">
      <div className="space-y-2">
        <H1>{exercise?.title ?? "Loading.."}</H1>
        <P className="max-w-lg mx-auto">
          {exercise?.instructions ?? `Exercise with id ${exerciseId}`}
        </P>
      </div>
      {isError && <Error />}
      <div className="xl:flex xl:px-20 space-y-4 xl:space-y-0">
        {!!(isSuccess && embedUrl) && (
          <iframe
            src={embedUrl}
            title="YouTube video player"
            width={472}
            height={265}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md h-[52vw] w-full sm:max-w-[472px] sm:h-[265px] mx-auto"
          />
        )}
        {(isFetching || isLoading) && !embedUrl && (
          <Skeleton className="rounded-md h-[52vw] w-full sm:max-w-[472px] sm:h-[265px] mx-auto" />
        )}
        {(isFetching || isLoading) && !sets.length && <SetsChartSkeleton />}
        {isSuccess && <SetsChart sets={sets} />}
      </div>
      <div
        className={cn("grid gap-4 place-items-center", {
          "md:grid-cols-2": Object.entries(groupedSets).length > 1,
          "lg:grid-cols-3": Object.entries(groupedSets).length > 2,
        })}
      >
        {(isFetching || isLoading) && !sets.length && <SetsSkeletons />}
        {isSuccess && <Sets />}
      </div>
    </section>
  );
}
