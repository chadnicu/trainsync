import { deleteExercise, editExercise, getExercises } from "@/server/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import DeleteDialog from "./delete-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ResponsiveFormDialog from "./responsive-form-dialog";
import { Button } from "./ui/button";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./loading-spinner";
import { ExerciseContext } from "@/app/exercises/context";
import { z } from "zod";
import ExerciseForm, { exerciseSchema } from "./exercise-form";

export default function ExerciseCard() {
  const queryClient = useQueryClient();

  const { mutate: deleteOptimistically } = useMutation({
    mutationFn: async (exerciseId) => deleteExercise(exerciseId),
    onMutate: async (exerciseId: number) => {
      await queryClient.getQueryData(["exercises"]);
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) =>
          old.filter((e) => e.id !== exerciseId)
      );
      return { previous };
    },
    onError: (err, values, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  const { mutate: editOptimistically, isPending: isEditing } = useMutation({
    mutationFn: async (values: z.infer<typeof exerciseSchema>) => {
      if (id !== 0) return await editExercise({ id, ...values });
    },
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previous = queryClient.getQueryData(["exercises"]);
      queryClient.setQueryData(
        ["exercises"],
        (old: Awaited<ReturnType<typeof getExercises>>) => {
          const index = old.findIndex((e) => e.id === id);
          if (index === -1) return old;
          const copy = structuredClone(old);
          copy[index] = {
            id,
            title: values.title,
            instructions: values.instructions ?? null,
            url: values.url ?? null,
          };
          return copy;
        }
      );
      return { previous, values };
    },
    onError: (err, values, context) => {
      queryClient.setQueryData(["exercises"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  const { id, title, instructions, url } = useContext(ExerciseContext);

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
    : url;

  const optimistic = id === 0;

  return (
    <Card
      className={cn("w-[330px] sm:w-[348px]", {
        "opacity-50 relative": optimistic,
      })}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {instructions && <CardDescription>{instructions}</CardDescription>}
        {optimistic && (
          <LoadingSpinner className="absolute right-[12px] top-[6px] h-4 w-4" />
        )}
      </CardHeader>
      {embedUrl && (
        <CardContent>
          <iframe
            src={embedUrl}
            width="283.5"
            height="159.3"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md sm:w-[299px] sm:h-[168px]"
          />
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        {optimistic ? (
          <>
            <Button variant={"outline"}>Edit</Button>
            <Button variant={"destructive"}>Delete</Button>
          </>
        ) : (
          <>
            <ResponsiveFormDialog
              trigger={<Button variant={"outline"}>Edit</Button>}
              title="Edit exercise"
              description="Make changes to your exercise here. Click save when you're done."
            >
              <ExerciseForm
                mutate={editOptimistically}
                submitButtonText="Edit"
                isSubmitting={isEditing}
              />
            </ResponsiveFormDialog>
            <DeleteDialog action={() => deleteOptimistically(id)} />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
