import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { ExerciseType } from "@/app/exercises/Exercises";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { exerciseSchema } from "./ExerciseForm";
import { SessionType } from "@/app/sessions/page";
import { ReactNode } from "react";

export function EditButton({
  data,
  action,
  header,
  children,
}: {
  data: ExerciseType | SessionType;
  action: (formData?: FormData) => void;
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {header}
        <form className="grid gap-4 py-4" action={action}>
          {children}
        </form>
      </DialogContent>
    </Dialog>
  );
}
  
// unused cuz of error
function EditForm({ exercise }: { exercise: ExerciseType }) {
  const queryClient = useQueryClient();

  const editForm = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      title: exercise.title,
      instructions: exercise.instructions ?? "",
      url: exercise.url ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof exerciseSchema>) {
    await axios
      .put(`/api/exercises/${exercise.id}`, values)
      .then(() => queryClient.invalidateQueries(["exercises"]));
  }

  return (
    <Form {...editForm}>
      <form
        className="grid gap-4 py-4"
        onSubmit={editForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={editForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Name of the exercise" {...field} />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={editForm.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tips about how to perform this movement"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={editForm.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Input placeholder="Link to demonstration video" {...field} />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <div className="flex justify-center">
          <Button type="submit" className="w-fit">
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
