"use client";

import { ExerciseType } from "@/app/exercises/Exercises";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";

export default function Exercise({ exercise }: { exercise: ExerciseType }) {
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

  console.log(embedUrl);

  return (
    <div key={id} className="grid gap-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm">{instructions}</p>
      <iframe
        // src={url?.replace("/watch?v=", "/embed/") ?? ""}
        src={embedUrl}
        // width="560"
        // height="315"
        width="298"
        height="168"
        title="YouTube video player"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <div className="flex gap-2">
        <EditButton exercise={exercise} />
        <DeleteButton id={id} table={"exercises"} />
      </div>
    </div>
  );
}
