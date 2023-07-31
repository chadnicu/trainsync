"use client";

import {
  addTemplateToWorkout,
  getExercisesByTemplateId,
  removeExerciseFromTemplate,
} from "@/app/actions";
import TemplateComboBox from "@/components/TemplateComboBox";
import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Exercise, Template } from "@/lib/types";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ControllerRenderProps,
  Form,
  FormProvider,
  useForm,
} from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type Props = {
  template: Template;
  templatesExercises: Exercise[];
  otherExercises: Exercise[];
};

export const templateToWorkoutSchema = z.object({
  date: z.date({
    required_error: "Date of the workout is required.",
  }),
});

export default function Template({
  template,
  templatesExercises,
  otherExercises,
}: Props) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [`template-${template.id}`],
    queryFn: async () => {
      const data = await getExercisesByTemplateId(template.id);
      return data;
    },
    initialData: { templatesExercises, otherExercises },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await removeExerciseFromTemplate(id, template.id).then(() =>
        queryClient.invalidateQueries([`template-${template.id}`])
      );
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: [`template-${template.id}`],
      });
      const previous = queryClient.getQueryData([`template-${template.id}`]);
      queryClient.setQueryData([`template-${template.id}`], (old: any) => ({
        templatesExercises: old.templatesExercises.filter(
          (e: Exercise) => e.id !== id
        ),
        otherExercises: old.otherExercises.concat(
          old.templatesExercises.filter((e: Exercise) => e.id === id)
        ),
      }));
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData([`template-${template.id}`], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`template-${template.id}`],
      });
    },
  });

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof templateToWorkoutSchema>>({
    resolver: zodResolver(templateToWorkoutSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold">{template.title}</h1>
      {open ? (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(
              async (data: z.infer<typeof templateToWorkoutSchema>) => {
                setOpen(false);
                form.reset();
                await addTemplateToWorkout(template.id, data);
                queryClient.invalidateQueries(["workouts"]);
              }
            )}
            className="mt-5 flex w-full justify-center space-y-6"
          >
            <div className="grid">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <DatePicker field={field} />
                    {/* <FormDescription>
                          Your date of birth is used to calculate your age.
                        </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <div className="mt-2 flex justify-between gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
                <Button variant={"outline"} type="submit" className="w-full">
                  Create
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      ) : (
        <Button
          variant={"outline"}
          className="mt-5 w-fit"
          onClick={() => setOpen(true)}
        >
          Add to calendar
        </Button>
      )}
      <div className="mt-10 flex flex-col-reverse items-center gap-5 md:flex-row md:justify-around">
        <div className="grid gap-2">
          {data.templatesExercises.map((e) => (
            <div
              className="flex h-fit items-center justify-between gap-10 border px-7 py-5"
              key={e.id}
            >
              <div>
                <HoverExercise data={e} />
              </div>
              <div className="flex gap-2">
                <DeleteButton mutate={() => mutate(e.id)} className="w-fit" />
              </div>
            </div>
          ))}
        </div>

        <TemplateComboBox
          exercises={data.otherExercises.map((e) => ({
            value: e.title,
            label: e.title,
            exerciseId: e.id,
          }))}
          templateId={template.id}
        />
      </div>
    </div>
  );
}

export function HoverExercise({
  data,
}: {
  data: {
    id: number;
    title: string;
    instructions: string | null;
    url: string | null;
  };
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant={"link"} className="p-0 text-left text-xl font-bold">
          {data?.title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        <p className="text-sm">{data?.instructions || "No instructions"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

function DatePicker({
  field,
}: {
  field?: ControllerRenderProps<
    {
      date: Date;
    },
    "date"
  >;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field?.value && "text-muted-foreground"
            )}
          >
            {field?.value ? (
              format(field?.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field?.value}
          onSelect={(e) => {
            if (e) return field?.onChange(e);
          }}
          // disabled={(date) =>
          //   date > new Date() || date < new Date("1900-01-01")
          // }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
