"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { createTemplate } from "@/app/actions";
import { useState } from "react";

export const templateSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
});

export default function TemplateForm() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof templateSchema>) {
    setOpen(false);
    form.reset();
    await createTemplate(values).then(() =>
      queryClient.invalidateQueries(["templates"])
    );
  }

  const { userId } = useAuth();

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async (newTemplate: z.infer<typeof templateSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["templates"] });
      const previous = queryClient.getQueryData(["templates"]);
      queryClient.setQueryData(["templates"], (old: any) => {
        return [...old, { userId, ...newTemplate }];
      });
      return { previous };
    },
    onError: (err, newExercise, context) =>
      queryClient.setQueryData(["templates"], context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });

  return (
    <>
      {open ? (
        <Form {...form}>
          <div className="flex justify-center lg:justify-end">
            <form
              onSubmit={form.handleSubmit(
                async (data: z.infer<typeof templateSchema>) => mutate(data)
              )}
              className="w-fit space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of the template" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optionally describe this template"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <div className="flex justify-between gap-2">
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
            </form>
          </div>
        </Form>
      ) : (
        <div className="flex justify-end">
          <Button variant={"outline"} onClick={() => setOpen(true)}>
            Add new
          </Button>
        </div>
      )}
    </>
  );
}
