"use client";

import { ExerciseType } from "@/app/exercises/Exercises";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";
import { deleteExercise, editExercise } from "@/app/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DialogHeader } from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function Exercise({ exercise }: { exercise: ExerciseType }) {
  const queryClient = useQueryClient();

  const { id, title, instructions, url } = exercise;

  const playbackId = url?.includes("/watch?v=")
    ? url?.split("/watch?v=")[1]
    : url?.includes(".be/")
    ? url.split(".be/")[1]
    : url?.includes("?feature=share")
    ? url?.split("shorts/")[1].split("?feature=share")[0]
    : url?.includes("shorts/")
    ? url?.split("shorts/")[1]
    : "";

  const embedUrl = playbackId
    ? "https://www.youtube.com/embed/" + playbackId
    : "";

  const { mutate } = useMutation({
    mutationFn: async () => {
      await deleteExercise(id);
      queryClient.invalidateQueries(["exercises"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(["exercises"], (old: any) =>
        old.filter((e: any) => e.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  return (
    <div key={id} className="grid gap-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm">{instructions}</p>
      {embedUrl && (
        <iframe
          src={embedUrl}
          width="299"
          height="168"
          title="YouTube video player"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
      <div className="flex gap-2">
        <EditButton
          data={exercise}
          action={async (formData) =>
            editExercise(exercise, formData).then(() =>
              queryClient.invalidateQueries(["exercises"])
            )
          }
          header={
            <DialogHeader>
              <DialogTitle>Edit</DialogTitle>
              <DialogDescription>
                Make changes to your exercise here. Click save when you{"'"}re
                done.
              </DialogDescription>
            </DialogHeader>
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
         
        </EditButton>
        <DeleteButton mutate={() => mutate(id)} />
      </div>
    </div>
  );
}
