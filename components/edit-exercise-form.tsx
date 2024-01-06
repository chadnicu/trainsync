import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { ExerciseContext } from "./exercise-card";
import { editExercise, getExercises } from "@/server/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditExerciseForm() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit exercise</DialogTitle>
            <DialogDescription>
              Make changes to your exercise here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <ExerciseForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left px-6">
          <DrawerTitle>Edit exercise</DrawerTitle>
          <DrawerDescription>
            Make changes to your exercise here. Click save when you&apos;re
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6">
          <ExerciseForm />
        </div>
        <DrawerFooter className="pt-2 px-6">
          <DrawerClose asChild>
            <Button variant="outline" className="w-fit -mt-11">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const exerciseSchema = z.object({
  title: z.string().min(1).max(80),
  instructions: z.string().min(0).max(255).optional(),
  url: z
    .string()
    .url()
    .refine((url) =>
      /^(https?:\/\/)?(www\.)?(youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)?([a-zA-Z0-9_-]{11})/.test(
        url
      )
    )
    .optional()
    .or(z.literal("")),
});

function ExerciseForm() {
  const { id, ...defaultValues } = React.useContext(ExerciseContext);

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) => {
      if (id !== 0) return await editExercise({ id, ...values });
    },
    onMutate: async (newExercise) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) =>
          old.map((e) => (e.id === id ? newExercise : e))
      );
      return { previous, values: newExercise };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Bench Press" {...field} />
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
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Retract your scapula, arch your back, lower slowly then press back up"
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
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the URL to your exercise&apos;s YouTube video.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="float-right">
          Submit
        </Button>
      </form>
    </Form>
  );
}
