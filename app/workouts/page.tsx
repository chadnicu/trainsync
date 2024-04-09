"use client";

import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import WorkoutCard from "./_components/workout-card";
import WorkoutSkeleton from "./_components/workout-skeleton";
import CreateWorkoutForm from "./_components/create-workout-form";
import { H1, P } from "@/components/typography";
import {
  useWorkouts,
  WorkoutContext,
  useCreateWorkout,
  useCreateWorkoutFromTemplate,
} from "@/hooks/tanstack/workouts";
import { queryKeys } from "@/hooks/tanstack";
import ImportFromTemplateForm from "./_components/import-template-form";
import LoadingWorkouts from "./loading";

export default function Workouts() {
  const { data, isLoading, isFetching, isSuccess, isError } = useWorkouts();
  const { mutate: createWorkout, isPending } = useCreateWorkout();
  const { mutate: createFromTemplate, isPending: fromTemplatePending } =
    useCreateWorkoutFromTemplate();

  const queryClient = useQueryClient();
  const Error = () => (
    <P className="grid place-items-center gap-3">
      Something went wrong.
      <Button
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: queryKeys.workouts })
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
      <H1 className="text-center">WORKOUTS</H1>
      {isError && <Error />}
      <div className="flex justify-center gap-2">
        <ResponsiveFormDialog
          trigger={<Button>Create new</Button>}
          title="Create workout"
          description="Description field isn't mandatory."
        >
          <CreateWorkoutForm
            mutate={createWorkout}
            isSubmitting={isPending}
            submitButtonText="Create"
          />
        </ResponsiveFormDialog>
        <ResponsiveFormDialog
          trigger={<Button>Import from template</Button>}
          title="Import from template"
          description="Copies title, description and exercises from a chosen template."
        >
          <ImportFromTemplateForm
            mutate={createFromTemplate}
            isSubmitting={fromTemplatePending}
            submitButtonText="Import"
          />
        </ResponsiveFormDialog>
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
        {(isFetching || isLoading) && !data.length && <Skeletons />}
        {isSuccess && <Workouts />}
      </div>
    </section>
  );
}
