"use client";

import ExerciseCard from "./exercise-card";
import ExerciseSkeleton from "./exercise-skeleton";
import ExerciseForm from "./exercise-form";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import {
  useExercises,
  useAddExercise,
  ExerciseContext,
  invalidateExercises,
} from "./helpers";
import { useQueryClient } from "@tanstack/react-query";
import { H1, P } from "@/components/typography";

export default function Exercises() {
  const { data, isLoading, isFetching, isSuccess, isError } = useExercises();

  const queryClient = useQueryClient();

  const { mutate: addOptimistically, isPending: isAdding } =
    useAddExercise(queryClient);

  const Error = () => (
    <P className="grid place-items-center gap-3">
      Something went wrong.
      <Button
        onClick={() => invalidateExercises(queryClient)}
        className="w-fit"
      >
        Refresh
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
        title="Add exercise"
        description="Instructions and URL are not mandatory."
      >
        <ExerciseForm
          mutate={addOptimistically}
          isSubmitting={isAdding}
          submitButtonText="Create"
        />
      </ResponsiveFormDialog>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
        {(isFetching || isLoading) && !data.length && <Skeletons />}
        {isSuccess && <Exercises />}
      </div>
    </section>
  );
}
