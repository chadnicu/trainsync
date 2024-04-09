// WHY IS THIS UNSUBMITTABLE
"use client";

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
import LoadingSpinner from "@/components/loading-spinner";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";
import { ReactNode, useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { TemplateToWorkoutInput } from "@/types";
import {
  addWorkoutSchema,
  templateToWorkoutSchema,
} from "@/lib/validators/workout";
import { useTemplates } from "@/hooks/tanstack/templates";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export default function ImportFromTemplateForm({
  mutate,
  isSubmitting,
  submitButtonText,
}: {
  mutate: (values: TemplateToWorkoutInput) => void;
  isSubmitting?: boolean;
  submitButtonText?: ReactNode;
}) {
  const defaultValues = { templateId: 0, date: new Date() };
  const form = useForm<TemplateToWorkoutInput>({
    resolver: zodResolver(templateToWorkoutSchema),
    defaultValues,
  });
  const setOpenDialog = useContext(ToggleDialogFunction);
  const { data: templates } = useTemplates();

  const [openPopover, setOpenPopover] = useState(false);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (JSON.stringify(values) !== JSON.stringify(defaultValues)) {
            mutate(values);
          }
          setOpenDialog(false);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "flex text-left w-[240px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? templates.find(
                            (template) => template.id === field.value
                          )?.title
                        : "Select template"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <Command>
                    <CommandInput placeholder="Search template..." />
                    <CommandEmpty>No template found.</CommandEmpty>
                    <CommandGroup>
                      {templates?.map((template) => (
                        <CommandItem
                          value={template.title}
                          key={template.id}
                          onSelect={() => {
                            form.setValue("templateId", template.id);
                            setOpenPopover(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              template.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {template.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the template to import from.
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
        <Button
          type="submit"
          className="float-right flex justify-center items-center"
          disabled={isSubmitting}
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
      templateId: number;
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
          onSelect={(e) => {
            if (e) return field?.onChange(e);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
