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
import { addExerciseToSession } from "@/app/actions";

export default function ComboBox({
  exercises,
}: {
  exercises: {
    value: string;
    label: string;
    exerciseId: number;
    sessionId: number;
  }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? // ? exercises.find((exercises) => exercises.value === value)?.label
              value
            : "Add exercise..."}
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
                  addExerciseToSession(
                    exercise.exerciseId,
                    exercise.sessionId
                  ).then(() => setValue(""));
                  //   setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
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
