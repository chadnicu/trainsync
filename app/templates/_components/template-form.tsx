import LoadingSpinner from "@/components/loading-spinner";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
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
import { TemplateContext } from "@/hooks/templates";
import { templateSchema } from "@/lib/validators/template";
import { TemplateInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useContext } from "react";
import { useForm } from "react-hook-form";

export default function TemplateForm({
  mutate,
  isSubmitting,
  submitButtonText,
}: {
  mutate: (values: TemplateInput) => void;
  isSubmitting?: boolean;
  submitButtonText?: ReactNode;
}) {
  const { title, description } = useContext(TemplateContext);

  const defaultValues = {
    title,
    description: description ?? "",
  };

  const form = useForm<TemplateInput>({
    resolver: zodResolver(templateSchema),
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
        className="space-y-4"
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
                This is the title of your exercise.
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
                  placeholder="Push A is a chest focused day that also includes shoulders and triceps."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                These are the instructions for your exercise.
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
