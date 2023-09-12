"use client";

import {
  addTemplateToWorkout,
  getExercisesByTemplateId,
  removeExerciseFromTemplate,
} from "@/app/(pages)/actions";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const { mutate: addOptimistically } = useMutation({
    mutationFn: async (values: z.infer<typeof templateToWorkoutSchema>) => {
      setOpen(false);
      form.reset();
      await addTemplateToWorkout(template.id, values);
      queryClient.invalidateQueries(["workouts"]);
    },
    onMutate: async (newWorkout: z.infer<typeof templateToWorkoutSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["workouts"] });
      const previous = queryClient.getQueryData(["workouts"]);
      queryClient.setQueryData(["workouts"], (old: any) => {
        return [
          ...old,
          {
            ...newWorkout,
            title: template.title,
            userId: template.userId,
            description: template.description,
          },
        ];
      });
      return { previous };
    },
    onError: (err, newExercise, context) =>
      queryClient.setQueryData(["workouts"], context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  });

  return (
    <>
      <div className="grid gap-2">
        <h1 className="text-5xl font-bold">{template.title}</h1>
        <p className="text-sm">{template.description}</p>
      </div>
      {open ? (
        <div className="flex items-center justify-center">
          <Card className="h-fit w-fit text-left">
            <CardHeader>
              <CardTitle className="text-lg">Create workout</CardTitle>
              <CardDescription>
                Create a workout from this template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(
                    (data: z.infer<typeof templateToWorkoutSchema>) =>
                      addOptimistically(data)
                  )}
                  className="grid w-full justify-center space-y-6"
                >
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
                    <Button
                      variant={"default"}
                      type="submit"
                      className="w-full"
                    >
                      Create
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Button
            variant={"default"}
            className="w-fit"
            onClick={() => setOpen(true)}
          >
            Add to calendar
          </Button>
        </div>
      )}
      <div className="flex flex-col items-center gap-5 px-5 md:justify-around">
        <div className="grid gap-2">
          {data.templatesExercises.map((e) => (
            <Card key={e.id} className="flex justify-between">
              <CardHeader>
                <HoverExercise data={e} />
              </CardHeader>
              <CardContent className="flex items-center justify-center py-0">
                <DeleteButton mutate={() => mutate(e.id)} className="w-fit" />
              </CardContent>
            </Card>
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
    </>
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
        <Button
          variant={"link"}
          className="p-0 text-left text-xl font-bold text-foreground"
        >
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
