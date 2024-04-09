import WorkoutSkeleton from "./_components/workout-skeleton";
import { H1 } from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingWorkouts() {
  const Skeletons = () =>
    Array.from({ length: 6 }, (_, i) => <WorkoutSkeleton key={i} />);

  return (
    <section className="space-y-10">
      <H1 className="text-center">WORKOUTS</H1>
      <div className="flex justify-center gap-2">
        <Skeleton className="h-[36px] w-[107px]" />
        <Skeleton className="h-[36px] w-[173px]" />
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
        <Skeletons />
      </div>
    </section>
  );
}
