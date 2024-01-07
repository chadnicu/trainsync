import { deleteExercise, getExercises } from "@/server/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import EditExerciseForm from "./edit-exercise-form";
import DeleteDialog from "./delete-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ResponsiveFormDialog from "./responsive-form-dialog";
import { Button } from "./ui/button";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./loading-spinner";
import { ExerciseContext } from "@/app/exercises/context";

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

  return (
    <Card
      className={cn("w-[330px] sm:w-[348px]", {
        "opacity-50 relative": id === 0,
      })}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {instructions && <CardDescription>{instructions}</CardDescription>}
        {id === 0 && (
          <LoadingSpinner className="absolute right-4 top-4 h-4 w-4" />
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
        <ResponsiveFormDialog
          trigger={<Button variant={"outline"}>Edit</Button>}
          title="Edit exercise"
          description="Make changes to your exercise here. Click save when you're done."
        >
          <EditExerciseForm />
        </ResponsiveFormDialog>
        <DeleteDialog action={() => deleteOptimistically(id)} />
      </CardFooter>
    </Card>
  );
}
