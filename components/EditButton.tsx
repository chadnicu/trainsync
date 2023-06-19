import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { ExerciseType } from "@/app/exercises/Exercises";
import { editExercise } from "@/app/actions";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { exerciseSchema } from "./ExerciseForm";

export function EditButton({ exercise }: { exercise: ExerciseType }) {
  const queryClient = useQueryClient();

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Make changes to your exercise here. Click save when you{"'"}re done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 py-4"
          action={async (data) =>
            editExercise(exercise, data).then(() =>
              queryClient.invalidateQueries(["exercises"])
            )
          }
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder={exercise.title}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instructions" className="text-right">
              Instructions
            </Label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder={exercise.instructions ?? ""}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              YouTube URL
            </Label>
            <Input
              id="url"
              name="url"
              placeholder={exercise.url ?? ""}
              className="col-span-3"
            />
          </div>
          <div className="mt-5 flex justify-center">
            <Button type="submit" className="w-fit">
              Save changes
            </Button>
          </div>
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
