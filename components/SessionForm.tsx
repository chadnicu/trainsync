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
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";

const sessionSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  //   exercise_id: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
  //     message: "Expected number, received a string",
  //   }),
});

export default function SessionForm() {
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

  return (
    <Form {...form}>
      <form
        // action={addFramework} // server action
        onSubmit={form.handleSubmit(onSubmit)} // api route
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
        <div className="flex justify-center">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
}
