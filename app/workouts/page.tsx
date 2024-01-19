"use client";

import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import {
  WorkoutContext,
  invalidateWorkouts,
  useAddWorkoutMutation,
  useWorkouts,
} from "./helpers";
import { useQueryClient } from "@tanstack/react-query";
import WorkoutCard from "./workout-card";
import WorkoutSkeleton from "./workout-skeleton";
import AddWorkoutForm from "./add-workout-form";
import { H1 } from "@/components/typography/h1";
import { P } from "@/components/typography/p";

export default function Workouts() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isSuccess, isError } = useWorkouts();

  const { mutate: addOptimistically, isPending: isAdding } =
    useAddWorkoutMutation(queryClient);

  const Error = () => (
    <P className="grid place-items-center gap-3">
      Something went wrong.
      <Button onClick={() => invalidateWorkouts(queryClient)} className="w-fit">
        Refresh
      </Button>
    </P>
  );

  const Skeletons = () =>
    Array.from({ length: 6 }, (_, i) => <WorkoutSkeleton key={i} />);

  const Workouts = () =>
    data.map((w) => (
      <WorkoutContext.Provider key={w.id} value={w}>
        <WorkoutCard />
      </WorkoutContext.Provider>
    ));

  return (
    <section className="space-y-10">
      <H1 className="text-center">Your workouts</H1>
      {isError && <Error />}
      <ResponsiveFormDialog
        trigger={
          <Button className="block ml-auto sm:float-right">Create</Button>
        }
        title="Add workout"
        description="Idk for now, subject to change"
      >
        <AddWorkoutForm
          mutate={addOptimistically}
          isSubmitting={isAdding}
          submitButtonText="Create"
        />
      </ResponsiveFormDialog>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
        {(isFetching || isLoading) && !data.length && <Skeletons />}
        {isSuccess && <Workouts />}
      </div>
    </section>
  );
}
