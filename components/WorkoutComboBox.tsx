"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addExerciseToWorkout } from "@/app/(pages)/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Exercise } from "@/lib/types";

export default function WorkoutComboBox({
  exercises,
  workoutId,
}: {
  exercises: {
    value: string;
    label: string;
    exerciseId: number;
  }[];
  workoutId: number;
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      setOpen(false);
      await addExerciseToWorkout(id, workoutId).then(() => setValue(""));
      queryClient.invalidateQueries([`workout-${workoutId}`]);
      queryClient.invalidateQueries([`sets`]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: [`workout-${workoutId}`],
      });
      const previous = queryClient.getQueryData([`workout-${workoutId}`]);
      queryClient.setQueryData([`workout-${workoutId}`], (old: any) => ({
        workoutsExercises: old.workoutsExercises.concat(
          old.otherExercises.filter((e: Exercise) => e.id === id)
        ),
        otherExercises: old.otherExercises.filter((e: Exercise) => e.id !== id),
      }));
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData([`workout-${workoutId}`], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`workout-${workoutId}`],
      });
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Add exercise..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search exercise..." />
          {exercises.length === 0 ? (
            <div className="py-6 text-center text-sm">No exercises found.</div>
          ) : (
            <CommandEmpty>No exercises found.</CommandEmpty>
          )}

          <CommandGroup>
            {exercises.map((exercise) => (
              <CommandItem
                key={exercise.value}
                onSelect={(currentValue) => {
                  setValue("Loading..");
                  mutate(exercise.exerciseId);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === exercise.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {exercise.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
