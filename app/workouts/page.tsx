"use client";

import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import WorkoutCard from "./_components/workout-card";
import WorkoutSkeleton from "./_components/workout-skeleton";
import CreateWorkoutForm from "./_components/create-workout-form";
import { H1, P } from "@/components/typography";
import {
  queryKey as workoutsQueryKey,
  useWorkouts,
  WorkoutContext,
  useCreateWorkout,
} from "@/hooks/workouts";

export default function Workouts() {
  const { data, isLoading, isFetching, isSuccess, isError } = useWorkouts();
  const { mutate: createWorkout, isPending } = useCreateWorkout();

  const queryClient = useQueryClient();
  const Error = () => (
    <P className="grid place-items-center gap-3">
      Something went wrong.
      <Button
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: workoutsQueryKey })
        }
        className="w-fit"
      >
        Refresh
      </Button>
    </P>
  );

  const Skeletons = () =>
    Array.from({ length: 6 }, (_, i) => <WorkoutSkeleton key={i} />);

  const Workouts = () =>
    data.map((e) => (
      <WorkoutContext.Provider key={e.id} value={e}>
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
        <CreateWorkoutForm
          mutate={createWorkout}
          isSubmitting={isPending}
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
