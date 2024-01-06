"use client";

import AddExerciseForm from "@/components/add-exercise-form";
import ExerciseCard from "@/components/exercise-card";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import { getExercises } from "@/server/actions";
import { useMutationState, useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export const ExerciseContext = createContext({
  id: 0,
  title: "",
  instructions: "",
  url: "",
});

export default function Exercises() {
  const {
    data: exercises,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => getExercises(),
    initialData: [],
  });

  return (
    <section className="space-y-10">
      <h1 className="text-center text-3xl font-bold  md:text-6xl tracking-tighter">
        Your exercises
      </h1>
      <ResponsiveFormDialog
        trigger={<Button className="float-right">Create</Button>}
        title="Add exercise"
        description="Instructions and URL are not mandatory."
      >
        <AddExerciseForm />
      </ResponsiveFormDialog>
      {(isFetching || isLoading) && !exercises.length && <p>Skeletons</p>}
      {isError && <p>Something went wrong. Try refreshing.</p>}
      {isSuccess && (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
          {exercises.map((e) => (
            <ExerciseContext.Provider
              value={{
                ...e,
                instructions: e.instructions ?? "",
                url: e.url ?? "",
              }}
              key={e.id}
            >
              <ExerciseCard disabled={e.id === 0} />
            </ExerciseContext.Provider>
          ))}
        </div>
      )}
    </section>
  );
}
