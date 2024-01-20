import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeleteDialog from "@/components/delete-dialog";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { cn, getYouTubeEmbedURL } from "@/lib/utils";
import LoadingSpinner from "@/components/loading-spinner";
import { ExerciseContext } from "./helpers";
import ExerciseForm from "./exercise-form";
import { useDeleteExercise, useEditExercise } from "./helpers";
import { useQueryClient } from "@tanstack/react-query";

export default function ExerciseCard() {
  const queryClient = useQueryClient();

  const { mutate: deleteOptimistically } = useDeleteExercise(queryClient);

  const { id, title, instructions, url } = useContext(ExerciseContext);

  const { mutate: editOptimistically, isPending: isEditing } = useEditExercise(
    queryClient,
    id
  );

  const embedUrl = getYouTubeEmbedURL(url);

  const isOptimistic = id === 0;

  return (
    <Card
      className={cn("w-[330px] sm:w-[348px]", {
        "opacity-50 relative": isOptimistic,
      })}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {instructions && <CardDescription>{instructions}</CardDescription>}
        {isOptimistic && (
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
        <ResponsiveFormDialog
          trigger={
            <Button variant={"outline"} disabled={isOptimistic}>
              Edit
            </Button>
          }
          title="Edit exercise"
          description="Make changes to your exercise here. Click save when you're done."
        >
          <ExerciseForm
            mutate={editOptimistically}
            submitButtonText="Edit"
            isSubmitting={isEditing}
          />
        </ResponsiveFormDialog>
        <DeleteDialog
          action={() => deleteOptimistically(id)}
          disabled={isOptimistic}
        />
      </CardFooter>
    </Card>
  );
}
