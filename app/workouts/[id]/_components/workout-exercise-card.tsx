import { useContext } from "react";
import { WorkoutExerciseContext } from "../_utils/context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getYouTubeEmbedURL } from "@/lib/utils";
import { typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import CommentAlert from "@/components/comment";
import { useAddSet, useSets } from "../_utils/hooks";
import { Cross2Icon } from "@radix-ui/react-icons";
import ResponsiveFormDialog, {
  ToggleDialogFunction,
} from "@/components/responsive-form-dialog";
import { useQueryClient } from "@tanstack/react-query";
import SetForm from "./set-form";

export default function WorkoutExerciseCard() {
  const {
    id,
    title,
    instructions,
    comment,
    todo,
    url,
    exerciseId,
    workout_id: workoutId,
  } = useContext(WorkoutExerciseContext);

  const embedUrl = getYouTubeEmbedURL(url);

  const { data } = useSets(exerciseId);
  const sets = data.filter((e) => e.workoutId === workoutId);

  const queryClient = useQueryClient();
  const { mutate: addSet, isPending } = useAddSet(queryClient);

  return (
    <Card className={cn("max-w-lg w-full mx-auto text-left")}>
      <CardHeader>
        <CardTitle className={typography("h3")}>{title}</CardTitle>
        {(instructions || todo) && (
          <CardDescription className="space-y-2">
            {instructions && <p>{instructions}</p>}
            {todo && <p className="text-foreground pt-2 border-t">{todo}</p>}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {embedUrl && (
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md h-[44vw] w-full sm:w-full sm:h-[260px] mx-auto"
          />
        )}
        <div className="mx-auto w-fit">
          {sets.map((e) => (
            <div key={e.id} className="flex items-center gap-3 justify-center">
              {e.id === 0 && <p>NIGAAAAAAAAAAAAAAAAAAAAaa</p>}
              <button className="text-xl font-semibold">{e.reps}</button>
              <Cross2Icon />
              <button className="text-xl font-semibold">{e.weight}</button>
            </div>
          ))}
        </div>
        {comment && <CommentAlert>{comment}</CommentAlert>}
      </CardContent>
      <CardFooter>
        <ResponsiveFormDialog
          trigger={<Button className="ml-auto">Add set</Button>}
          title="Add set"
          description={`Add a new set to ${title}`}
        >
          <SetForm mutate={addSet} />
        </ResponsiveFormDialog>
      </CardFooter>
    </Card>
  );
}
