import WorkoutForm from "@/components/WorkoutForm";
import Workouts from "./Workouts";
import AddFromTemplateForm from "@/components/AddFromTemplateForm";
import WorkoutSkeleton from "@/components/WorkoutSkeleton";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTemplates, getWorkouts } from "@/app/(pages)/actions";

export default async function Page() {
  const buttonFallback = (
    <Button variant={"outline"} className="w-full overflow-hidden p-0">
      <Skeleton className="h-10 w-full px-4">Add from template</Skeleton>
    </Button>
  );

  const cardsFallback = (
    <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 8 }, (_, i) => (
        <WorkoutSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <h1 className="text-center text-5xl font-bold">Workouts</h1>
      <div className="grid gap-10 md:flex md:flex-row-reverse md:justify-between">
        <div className="flex flex-col gap-2">
          <WorkoutForm />
          <Suspense fallback={buttonFallback}>
            <FetchTemplates />
          </Suspense>
        </div>
        <Suspense fallback={cardsFallback}>
          <FetchWorkouts />
        </Suspense>
      </div>
    </>
  );
}

async function FetchTemplates() {
  const templates = await getTemplates();
  return <AddFromTemplateForm templates={templates} />;
}

async function FetchWorkouts() {
  const workouts = await getWorkouts();
  return <Workouts workouts={workouts} />;
}
