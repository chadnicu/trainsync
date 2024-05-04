"use client";

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
import { cn, getYouTubeEmbedURL, slugify } from "@/lib/utils";
import LoadingSpinner from "@/components/loading-spinner";
import ExerciseForm from "./exercise-form";
import LazyYoutube from "@/components/lazy-youtube";
import Link from "next/link";
import { typography } from "@/components/typography";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import {
  ExerciseContext,
  useDeleteExercise,
  useUpdateExercise,
} from "@/hooks/tanstack/exercises";

export default function ExerciseCard() {
  const pathname = usePathname();
  const { id, title, instructions, url } = useContext(ExerciseContext);
  const { mutate: updateExercise, isPending: isEditing } = useUpdateExercise();
  const { mutate: deleteExercise } = useDeleteExercise();

  const embedUrl = getYouTubeEmbedURL(url);
  const isOptimistic = id === 0;

  return (
    <Card
      className={cn("w-[330px] sm:w-[348px]", {
        "opacity-50 relative": isOptimistic,
      })}
    >
      <CardHeader>
        <CardTitle>
          {isOptimistic ? (
            title
          ) : (
            <Link
              href={slugify(pathname, title, id)}
              className={cn(
                typography("a"),
                "hover:text-foreground break-words max-w-sm inline"
              )}
            >
              {title}{" "}
              <ExternalLinkIcon className="inline mb-[3px] text-foreground" />
            </Link>
          )}
        </CardTitle>
        {instructions && (
          <CardDescription className="break-words">
            {instructions}
          </CardDescription>
        )}
        {isOptimistic && (
          <LoadingSpinner className="absolute right-[12px] top-[6px] h-4 w-4" />
        )}
      </CardHeader>
      {embedUrl && (
        <CardContent>
          <LazyYoutube>
            <iframe
              src={embedUrl}
              width="283.5"
              height="159.3"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-md sm:w-[299px] sm:h-[168px]"
            />
          </LazyYoutube>
        </CardContent>
      )}
      <CardFooter className={cn("flex justify-between", { hidden: id < 0 })}>
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
            mutate={(values) => updateExercise({ ...values, id })}
            submitButtonText="Edit"
            isSubmitting={isEditing}
          />
        </ResponsiveFormDialog>
        <DeleteDialog
          action={() => deleteExercise(id)}
          disabled={isOptimistic}
        />
      </CardFooter>
    </Card>
  );
}
