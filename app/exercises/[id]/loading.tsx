import { H1, P } from "@/components/typography";
import SetSkeleton from "./set-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import SetsChartSkeleton from "./sets-chart-skeleton";

export default function LoadingExercise() {
  const Skeletons = () =>
    Array.from({ length: 6 }, (_, i) => <SetSkeleton key={i} />);

  return (
    <section className="sm:container text-center space-y-4">
      <div className="space-y-2">
        <H1>Loading..</H1>
        <P>The exercise/[id] page</P>
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
