import { useContext } from "react";
import { WorkoutExerciseContext } from "./helpers";
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
import LazyYoutube from "@/components/lazy-youtube";
import { Button } from "@/components/ui/button";

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
    <Card className={cn("max-w-lg w-full mx-auto")}>
      <CardHeader className="text-left">
        <CardTitle className={typography("h3")}>{title}</CardTitle>
        {instructions && <CardDescription>{instructions}</CardDescription>}
      </CardHeader>
      {embedUrl && (
        <CardContent>
          <LazyYoutube>
            <iframe
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-md h-[44vw] w-full sm:w-full sm:h-[260px] mx-auto"
            />
          </LazyYoutube>
          {todo}
          {comment}
        </CardContent>
      )}
      <CardFooter>
        <Button className="ml-auto">Add set</Button>
      </CardFooter>
    </Card>
  );
}
