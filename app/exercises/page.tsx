"use client";

import ExerciseCard from "@/components/exercise-card";
import ExerciseSkeleton from "@/components/exercise-skeleton";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import { addExercise, getExercises } from "@/server/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExerciseContext } from "./context";
import ExerciseForm, { exerciseSchema } from "@/components/exercise-form";
import { z } from "zod";

export default function Exercises() {
  const { data, isLoading, isFetching, isSuccess, isError } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => getExercises(),
    initialData: [],
  });

  const queryClient = useQueryClient();

  const { mutate: addOptimistically } = useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) =>
      await addExercise(values),
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) => [
          { ...values, id: 0 },
          ...old,
        ]
      );
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  const Error = () => (
    <p className="grid place-items-center gap-3">
      Something went wrong.
      <Button
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: ["exercises"] })
        }
        className="w-fit"
      >
        Refresh
      </Button>
    </p>
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
      <h1 className="text-center text-3xl font-bold  md:text-6xl tracking-tighter">
        Your exercises
      </h1>
      {isError && <Error />}
      <ResponsiveFormDialog
        trigger={
          <Button className="block ml-auto sm:float-right">Create</Button>
        }
        title="Add exercise"
        description="Instructions and URL are not mandatory."
      >
        <ExerciseForm mutate={addOptimistically} />
      </ResponsiveFormDialog>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
        {(isFetching || isLoading) && !data.length && <Skeletons />}
        {isSuccess && <Exercises />}
      </div>
    </section>
  );
}
