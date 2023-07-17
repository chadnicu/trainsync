"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
// import { addExercise } from "@/app/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { deleteSession } from "@/app/actions";
import { useState } from "react";

const sessionSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  //   exerciseId: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
  //     message: "Expected number, received a string",
  //   }),
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
    await axios.post("/api/sessions", values).then(() => {
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
            // action={addFramework} // server action
            onSubmit={form.handleSubmit(
              async (data: z.infer<typeof sessionSchema>) => mutate(data)
            )} // api route
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
