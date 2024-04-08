import DeleteDialog from "@/components/delete-dialog";
import LoadingSpinner from "@/components/loading-spinner";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import {
  Blockquote,
  H4,
  InlineCode,
  P,
  typography,
} from "@/components/typography";
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
import { cn } from "@/lib/utils";
import { TrashIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import ToDoForm from "./todo-form";
import { ResponsiveComboBox } from "@/components/responsive-combobox";
import { useTemplate } from "@/hooks/tanstack/templates";

export default function TemplateExerciseCard() {
  const { id, title, toDo } = useContext(TemplateExerciseContext);
  const {
    data: { inTemplate, other },
  } = useTemplateExercises();

  const { mutate: removeExercise } = useRemoveExerciseFromTemplate();
  const { mutate: addToDo, isPending: toDoPending } = useAddToDoToExercise();
  const { mutate: swapExercise } = useSwapExerciseInTemplate();

  const isOptimistic = id === 0;

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
          <span className={cn(typography("h3"))}>{title}</span>
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
        <div className="space-x-3">
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
              <Button variant={"outline"} disabled={isOptimistic}>
                {toDo ? "Edit" : "Add"} to-do
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
        </div>
      </CardContent>
    </Card>
  );
}
