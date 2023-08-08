import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { Template } from "@/lib/types";
import EditButton from "./EditButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DeleteButton } from "./DeleteButton";
import { deleteTemplate, editTemplate } from "@/app/(pages)/actions";
import { FormProvider, useForm } from "react-hook-form";
import { templateSchema } from "./TemplateForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@clerk/nextjs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export default function TemplateCard({ template }: { template: Template }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await deleteTemplate(id);
      queryClient.invalidateQueries(["templates"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["templates"] });
      const previous = queryClient.getQueryData(["templates"]);
      queryClient.setQueryData(["templates"], (old: any) =>
        old.filter((s: any) => s.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["templates"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: template.title,
      description: template.description ?? undefined,
    },
  });

  const { userId } = useAuth();

  const { mutate: editOptimistically } = useMutation({
    mutationFn: async (values: z.infer<typeof templateSchema>) => {
      await editTemplate(template.id, values);
      queryClient.invalidateQueries(["templates"]);
    },
    onMutate: async (values: z.infer<typeof templateSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["templates"] });
      const previous = queryClient.getQueryData(["templates"]);
      queryClient.setQueryData(["templates"], (old: any) => {
        console.log(old, "old");
        return old.map((e: Template) =>
          e.id === template.id ? { id: template.id, userId, ...values } : e
        );
      });
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["templates"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  return (
    <div className="grid h-fit place-items-center gap-5 border px-7 py-5">
      <div>
        <HoverTemplate template={template} />
      </div>
      <div className="flex justify-between gap-2">
        <EditButton description="template">
          <FormProvider {...form}>
            <form
              className="grid gap-4 text-left"
              onSubmit={form.handleSubmit(
                (values: z.infer<typeof templateSchema>) =>
                  editOptimistically(values)
              )}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title of the template"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Optionally describe this template"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit">Save changes</Button>
            </form>
          </FormProvider>
        </EditButton>
        <DeleteButton mutate={() => mutate(template.id)} />
      </div>
    </div>
  );
}

function HoverTemplate({ template }: { template: Template }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/templates/${template?.id}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0 text-left text-xl font-bold"
          )}
        >
          {template.title}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        <p className="text-sm">{template?.description || "No description"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
