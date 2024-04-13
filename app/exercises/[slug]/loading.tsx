"use client";

import { H1, P } from "@/components/typography";
import SetSkeleton from "./_components/set-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import SetsChartSkeleton from "./_components/sets-chart-skeleton";
import { usePathname } from "next/navigation";

export default function LoadingExercise() {
  const Skeletons = () =>
    Array.from({ length: 6 }, (_, i) => <SetSkeleton key={i} />);

  const pathname = usePathname();
  const last = pathname.split("/")[2].split("-");
  const name = last
    .toSpliced(last.length - 1)
    .join(" ")
    .toUpperCase();

  return (
    <section className="sm:container text-center space-y-4">
      <div className="space-y-2">
        <H1>{name}</H1>
        <P className="max-w-lg mx-auto text-muted-foreground pb-2">
          Loading instructions..
        </P>
      </div>
      <div className="xl:flex xl:px-20 space-y-4 xl:space-y-0 ">
        <Skeleton className="rounded-md h-[52vw] w-full sm:max-w-[472px] sm:h-[265px] mx-auto" />
        <SetsChartSkeleton />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
        <Skeletons />
      </div>
    </section>
  );
}
