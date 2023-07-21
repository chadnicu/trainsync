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
import { createSession, deleteSession } from "@/app/actions";
import { useState } from "react";

export const sessionSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
});

export default function SessionForm() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof sessionSchema>) {
    setOpen(false);
    form.reset();
    await createSession(values).then(() => {
      queryClient.invalidateQueries(["sessions"]);
      queryClient.invalidateQueries(["sessions-navbar"]);
    });
  }

  const { userId } = useAuth();

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onMutate: async (newSession: z.infer<typeof sessionSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previous = queryClient.getQueryData(["sessions"]);
      queryClient.setQueryData(["sessions"], (old: any) => [
        ...old,
        { id: old?.length + 1, userId, ...newSession },
      ]);
      queryClient.setQueryData(["sessions-navbar"], (old: any) => [
        ...old,
        newSession,
      ]);
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["sessions"], context?.previous);
      queryClient.setQueryData(["sessions-navbar"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["sessions-navbar"] });
    },
  });

  return (
    <>
      {open ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              async (data: z.infer<typeof sessionSchema>) => mutate(data)
            )}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title of the session" {...field} />
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
                      placeholder="Optionally describe this session"
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
