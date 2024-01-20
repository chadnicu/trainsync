import { useContext } from "react";
import { WorkoutExerciseContext } from "./helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getYouTubeEmbedURL } from "@/lib/utils";
import { typography } from "@/components/typography";

export default function WorkoutExerciseCard() {
  const {
    id,
    title,
    instructions,
    comment,
    todo,
    url,
    userId,
    workoutExerciseId,
  } = useContext(WorkoutExerciseContext);

  const embedUrl = getYouTubeEmbedURL(url);

  // finish the card

  return (
    <Card className={cn("max-w-lg w-full")}>
      <CardHeader className="text-left">
        <CardTitle className={typography("h3")}>{title}</CardTitle>
        {instructions && <CardDescription>{instructions}</CardDescription>}
      </CardHeader>
      {embedUrl && (
        <CardContent>
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md h-[33.7vw] w-[60vw] sm:w-full sm:h-[260px] mx-auto"
          />
        </CardContent>
      )}
    </Card>
  );
}
