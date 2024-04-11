"use client";

import DeleteDialog from "@/components/delete-dialog";
import LoadingSpinner from "@/components/loading-spinner";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Blockquote, typography } from "@/components/typography";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplateExerciseContext,
  useAddToDoToExercise,
  useRemoveExerciseFromTemplate,
  useSwapExerciseInTemplate,
  useTemplateExercises,
} from "@/hooks/tanstack/template-exercise";
import { cn, getYouTubeEmbedURL } from "@/lib/utils";
import { TrashIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import ToDoForm from "./todo-form";
import { ResponsiveComboBox } from "@/components/responsive-combobox";
import LazyYoutube from "@/components/lazy-youtube";
import { TemplateExercise } from "@/types";

export default function TemplateExerciseCard() {
  const { id, title, instructions, url, toDo, index, other } = useContext(
    TemplateExerciseContext
  );

  const { mutate: removeExercise } = useRemoveExerciseFromTemplate();
  const { mutate: addToDo, isPending: toDoPending } = useAddToDoToExercise();
  const { mutate: swapExercise } = useSwapExerciseInTemplate();

  const isOptimistic = id === 0;

  const embedUrl = getYouTubeEmbedURL(url);

  return (
    <Card
      className={cn(
        "max-w-[330px] sm:max-w-lg w-full mx-auto text-left relative"
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            { "opacity-70": isOptimistic },
            "flex items-center gap-1 max-w-[94%]"
          )}
        >
          {isOptimistic && <LoadingSpinner className="h-5 w-5" />}
          <span className={cn(typography("h3"), "flex items-center ")}>
            <span className="text-muted-foreground font-semibold mr-1">
              {index}.
            </span>
            {title}
          </span>
          <DeleteDialog
            action={removeExercise}
            customTrigger={
              <AlertDialogTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "absolute top-3 right-3"
                )}
                disabled={isOptimistic}
              >
                <TrashIcon className="h-4 w-4 text-foreground" />
              </AlertDialogTrigger>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-7">
        <Blockquote className="m-0 text-muted-foreground">{toDo}</Blockquote>
        <div className="space-x-[5px] sm:space-x-3">
          <ResponsiveFormDialog
            trigger={
              <Button variant={"outline"} disabled={isOptimistic}>
                {toDo ? "Edit" : "Add to-do"}
              </Button>
            }
            title={`Add to-do`}
            description={`Add to-do for ${title} in this template`}
          >
            <ToDoForm
              mutate={addToDo}
              submitButtonText="Add"
              isSubmitting={toDoPending}
            />
          </ResponsiveFormDialog>
          <ResponsiveComboBox
            trigger={
              <Button variant="outline" disabled={isOptimistic}>
                Swap
              </Button>
            }
            data={other.map(({ id, title }) => ({
              id,
              title,
            }))}
            placeholder="Search exercise.."
            mutate={({ exerciseId }) =>
              swapExercise({ templateExerciseId: id, exerciseId })
            }
          />
          <ResponsiveFormDialog
            trigger={
              <Button variant={"outline"} className="float-right">
                See more
              </Button>
            }
            title={`${title} Demo Video`}
            description={instructions}
          >
            {embedUrl && (
              <LazyYoutube>
                <iframe
                  src={embedUrl}
                  width="290"
                  height="162.9"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="rounded-md mb-14 sm:mb-0 sm:w-[380px] sm:h-[213px] mx-auto"
                />
              </LazyYoutube>
            )}
          </ResponsiveFormDialog>
        </div>
      </CardContent>
    </Card>
  );
}
