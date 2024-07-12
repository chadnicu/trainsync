"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import ResponsiveFormDialog from "./responsive-form-dialog";
import ExerciseForm from "@/app/exercises/_components/exercise-form";
import { useCreateExercise } from "@/hooks/tanstack/exercises";
import { useAddExerciseToWorkout } from "@/hooks/tanstack/workout-exercises";

type Data = { id: number; title: string };

type Props = {
  trigger: React.ReactNode;
  data: Data[];
  placeholder?: string;
  mutate: ({ exerciseId }: { exerciseId: number }) => void;
};

export function ResponsiveComboBox({
  trigger,
  data,
  placeholder,
  mutate,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { mutate: createExercise, isPending: creatingExercise } =
    useCreateExercise();

  const CreateNewExercise = () => (
    <div className="m-auto w-fit">
      <ResponsiveFormDialog
        trigger={
          <Button variant={"outline"} className="w-full">
            Create a new exercise
          </Button>
        }
        title={`Create exercise`}
        description={`Create a new exercise and add it to the session`}
      >
        <ExerciseForm
          mutate={createExercise}
          isSubmitting={creatingExercise}
          submitButtonText="Create"
        />
      </ResponsiveFormDialog>
    </div>
  );

  const DataCommand = () => (
    <Command className="p-4 md:p-0">
      <CommandInput placeholder={placeholder ?? "Search.."} />
      <CommandList>
        <CommandEmpty className="pb-2">
          <div className="text-sm text-center py-5">No results found.</div>
          <CreateNewExercise />
        </CommandEmpty>
        {data.length === 0 && (
          <div className="grid place-items-center pt-5 gap-5">
            <p className="text-sm">No exercises.</p>
            <CreateNewExercise />
          </div>
        )}
        <CommandGroup className="overflow-hidden">
          {data.length !== 0 && (
            <ScrollArea className="h-72">
              {data.map(({ id, title }) => (
                <CommandItem
                  key={id}
                  value={title}
                  onSelect={(title) => {
                    mutate({ exerciseId: id });
                    setOpen(false);
                  }}
                >
                  {title}
                </CommandItem>
              ))}
              <div className="mt-5">
                <hr className="mb-5 md:-mr-0 -mr-10" />
                <CreateNewExercise />
              </div>
            </ScrollArea>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <DataCommand />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DataCommand />
      </DrawerContent>
    </Drawer>
  );
}
