import { getExercises } from "@/server/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import EditExerciseForm from "./edit-exercise-form";
import { createContext } from "react";

export const ExerciseContext = createContext({
  id: 0,
  title: "",
  instructions: "",
  url: "",
});

export default function ExerciseCard({
  exercise,
}: {
  exercise: Awaited<ReturnType<typeof getExercises>>[0];
}) {
  const { title, instructions, url } = exercise;

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
    <Card className="w-[348px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {instructions && <CardDescription>{instructions}</CardDescription>}
      </CardHeader>
      {embedUrl && (
        <CardContent>
          <iframe
            src={embedUrl}
            width="299"
            height="168"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md"
          />
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        <ExerciseContext.Provider
          value={{
            ...exercise,
            instructions: instructions ?? "",
            url: url ?? "",
          }}
        >
          <EditExerciseForm />
        </ExerciseContext.Provider>
        <Button variant={"destructive"}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
