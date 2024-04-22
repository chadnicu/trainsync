import { Button } from "@/components/ui/button";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "@/components/loading-spinner";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";
import { ReactNode, useContext, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn, mapNullKeysToUndefined } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkoutContext } from "@/hooks/tanstack/workouts";
import { EditDurationInput } from "@/types";
import {
  editDurationSchema,
  editWorkoutSchema,
} from "@/lib/validators/workout";

export default function UpdateDurationForm({
  mutate,
  isSubmitting,
  submitButtonText,
}: {
  mutate: (values: EditDurationInput) => void;
  isSubmitting?: boolean;
  submitButtonText?: ReactNode;
}) {
  const { started, finished } = useContext(WorkoutContext);
  const defaultValues = {
    started: started ?? undefined,
    finished: finished ?? undefined,
    clearTime: false,
  };
  const form = useForm<EditDurationInput>({
    resolver: zodResolver(editDurationSchema),
    defaultValues,
  });
  const setOpen = useContext(ToggleDialogFunction);

  // need state cuz the old way doesnt work for some reason
  const [showTimes, setShowTimes] = useState(!defaultValues.clearTime);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (JSON.stringify(values) !== JSON.stringify(defaultValues)) {
            const { clearTime, ...needed } = values;
            mutate({
              ...needed,
              started: !!values.clearTime ? undefined : values.started,
              finished: !!values.clearTime ? undefined : values.finished,
            });
          }
          setOpen(false);
        })}
        className="space-y-4"
      >
        {showTimes && (
          <>
            <FormField
              control={form.control}
              name="started"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Started at</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the time your workout started.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="finished"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Finished at</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the time you finished your workout.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="clearTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-1">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(e) => {
                      setShowTimes((e: boolean | undefined) => !e);
                      return field.onChange(e);
                    }}
                    className="border-border brightness-150"
                  />
                </FormControl>
                <FormLabel className="mt-[2px]">Clear times</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="float-right flex justify-center items-center"
        >
          {submitButtonText ?? "Submit"}
          {isSubmitting && (
            <LoadingSpinner className="ml-1 w-4 h-4 text-background/80 fill-background/80" />
          )}
        </Button>
      </form>
    </Form>
  );
}

function CalendarPopover({
  field,
}: {
  field: ControllerRenderProps<
    {
      title: string;
      date: Date;
      description?: string | undefined;
      started?: string | undefined;
      finished?: string | undefined;
      comment?: string | undefined;
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
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
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
          selected={field.value}
          onSelect={field.onChange}
          // disabled={(date) =>
          //   date > new Date() || date < new Date("1900-01-01")
          // }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
