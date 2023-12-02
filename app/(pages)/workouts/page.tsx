import WorkoutForm from "@/components/WorkoutForm";
import { getTemplates, getWorkouts } from "../actions";
import Workouts from "./Workouts";
import AddFromTemplateForm from "@/components/AddFromTemplateForm";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@nextui-org/react";

export default async function Page() {
  const buttonFallback = (
    <Button variant={"outline"} className="w-full overflow-hidden p-0">
      <Skeleton className="h-10 w-full" />
    </Button>
  );

  const cardsFallback = <p>ADD WORKOUT SKELETON CARDS YOU DIPSHIT</p>;

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
