"use client";

import ExerciseCard from "./_components/exercise-card";
import ExerciseSkeleton from "./_components/exercise-skeleton";
import ExerciseForm from "./_components/exercise-form";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/typography";
import {
  ExerciseContext,
  queryKey as exercisesQueryKey,
  useCreateExercise,
  useExercises,
} from "@/hooks/exercises";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loading-spinner";

export default function Exercises() {
  const { data, isLoading, isFetching, isSuccess, isError } = useExercises();
  const { mutate: createExercise, isPending } = useCreateExercise();

  const queryClient = useQueryClient();
  const Error = () => (
    <P className="grid place-items-center gap-3">
      Something went wrong.
      <Button
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: exercisesQueryKey })
        }
        className="w-fit"
      >
        Refresh
        {!!(isLoading || isFetching) && (
          <LoadingSpinner className="ml-1 w-4 h-4 text-background/80 fill-background/80" />
        )}
      </Button>
    </P>
  );

  const Skeletons = () =>
    Array.from({ length: 6 }, (_, i) => <ExerciseSkeleton key={i} />);

  const Exercises = () =>
    data.map((e) => (
      <ExerciseContext.Provider value={e} key={e.id}>
        <ExerciseCard />
      </ExerciseContext.Provider>
    ));

  return (
    <section className="space-y-10">
      <H1 className="text-center">Your exercises</H1>
      {isError && <Error />}
      <ResponsiveFormDialog
        trigger={
          <Button className="block ml-auto sm:float-right">Create</Button>
        }
        title="Create exercise"
        description="Instructions and URL are not mandatory."
      >
        <ExerciseForm
          mutate={createExercise}
          isSubmitting={isPending}
          submitButtonText="Create"
        />
      </ResponsiveFormDialog>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
        {!!((isFetching || isLoading) && !data.length) && <Skeletons />}
        {isSuccess && <Exercises />}
      </div>
    </section>
  );
}
