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
import { ReactNode, useContext } from "react";
import {
  WorkoutContext,
  EditWorkoutFormData,
  EditWorkoutSchema,
} from "./helpers";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function EditWorkoutForm({
  mutate,
  isSubmitting,
  submitButtonText,
}: {
  mutate: (values: EditWorkoutFormData) => void;
  isSubmitting?: boolean;
  submitButtonText?: ReactNode;
}) {
  const { title, description, date, started, finished, comment } =
    useContext(WorkoutContext);

  const defaultValues = {
    title,
    description: description ?? "",
    date: date ? new Date(date) : new Date(),
    started: started ?? undefined,
    finished: finished ?? undefined,
    comment: comment ?? "",
  };

  const form = useForm<EditWorkoutFormData>({
    resolver: zodResolver(EditWorkoutSchema),
    defaultValues,
  });

  const setOpen = useContext(ToggleDialogFunction);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (JSON.stringify(values) !== JSON.stringify(defaultValues)) {
            mutate(values);
          }
          setOpen(false);
        })}
        className="space-y-4 max-h-[70vh] overflow-y-auto px-1"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Push A" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of your workout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Chest, delts, triceps and abs."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the description for your workout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <CalendarPopover field={field} />
              <FormDescription>
                This is the date of your workout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Weighted 69.69kg. New prs. Everything went smooth."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is a comment about your workout.
              </FormDescription>
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
